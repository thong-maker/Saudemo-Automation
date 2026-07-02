/**
 * Bug Report Reporter
 * Tổng hợp các test case fail kèm lý do + screenshot + steps to reproduce.
 * Output: bug-report/bug-report-YYYY-MM-DD_HH-mm-ss.docx
 */

import type {
  Reporter,
  TestCase,
  TestResult,
  TestStep,
  FullResult,
} from '@playwright/test/reporter';
import fs from 'fs';
import path from 'path';
import {
  Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
  ImageRun, HeadingLevel, AlignmentType, BorderStyle, WidthType,
  ShadingType, LevelFormat, Header, Footer, PageNumber,
} from 'docx';

interface StepInfo {
  title: string;
  failed: boolean;
  expected?: string;
  actual?: string;
}

interface FailedTest {
  suite: string;
  title: string;
  file: string;
  reason: string;
  duration: number;
  screenshotPath?: string;  // absolute path to screenshot file
  retries: number;
  browser: string;
  steps: StepInfo[];
}

// ── Helpers ──────────────────────────────────────────────────────────────────

const BORDER = { style: BorderStyle.SINGLE, size: 1, color: 'CCCCCC' };
const BORDERS = { top: BORDER, bottom: BORDER, left: BORDER, right: BORDER };
const RED   = 'C00000';
const GREEN = '375623';
const GRAY  = '595959';
const BLUE  = '2E74B5';

function cell(text: string, opts: { bold?: boolean; color?: string; shade?: string; width?: number } = {}) {
  return new TableCell({
    borders: BORDERS,
    width: { size: opts.width ?? 4680, type: WidthType.DXA },
    shading: opts.shade ? { fill: opts.shade, type: ShadingType.CLEAR } : undefined,
    margins: { top: 80, bottom: 80, left: 120, right: 120 },
    children: [new Paragraph({
      children: [new TextRun({
        text,
        bold: opts.bold ?? false,
        color: opts.color ?? '000000',
        font: 'Arial',
        size: 20,
      })],
    })],
  });
}

function infoTable(rows: [string, string][]): Table {
  return new Table({
    width: { size: 9360, type: WidthType.DXA },
    columnWidths: [2500, 6860],
    rows: rows.map(([label, value]) =>
      new TableRow({
        children: [
          cell(label, { bold: true, shade: 'F2F2F2', width: 2500 }),
          cell(value, { width: 6860 }),
        ],
      })
    ),
  });
}

// ── Reporter ──────────────────────────────────────────────────────────────────

class BugReportReporter implements Reporter {
  private failures: FailedTest[] = [];
  private totalTests = 0;
  private passed = 0;

  onTestEnd(test: TestCase, result: TestResult): void {
    this.totalTests++;

    if (result.status === 'passed') {
      this.passed++;
      return;
    }

    if (result.status === 'failed' || result.status === 'timedOut') {
      const suite = test.parent?.title ?? 'Unknown Suite';
      const reason = result.error?.message
        ?.replace(/\x1b\[[0-9;]*m/g, '')
        ?.split('\n')
        ?.slice(0, 4)
        ?.join(' ')
        ?.trim()
        ?? 'Unknown error';

      // Screenshot
      const screenshotAttachment = result.attachments.find(
        a => a.name === 'screenshot' && a.contentType === 'image/png' && a.path
      );
      let screenshotPath: string | undefined;
      if (screenshotAttachment?.path && fs.existsSync(screenshotAttachment.path)) {
        screenshotPath = screenshotAttachment.path;
      }

      const browser = test.parent?.project()?.name ?? 'chromium';
      const steps = this.extractSteps(result.steps);

      this.failures.push({
        suite,
        title: test.title,
        file: path.relative(process.cwd(), test.location.file),
        reason,
        duration: result.duration,
        screenshotPath,
        retries: result.retry,
        browser,
        steps,
      });
    }
  }

  private extractSteps(steps: TestStep[]): StepInfo[] {
    const result: StepInfo[] = [];
    for (const step of steps) {
      if (step.title.startsWith('Fixture ')) continue;
      if (step.title.startsWith('browser.') || step.title.startsWith('browserContext.')) continue;

      if (step.category === 'hook') {
        result.push(...this.extractSteps(step.steps ?? []));
        continue;
      }

      if (step.category === 'pw:api' || step.category === 'test.step') {
        const failed = !!step.error;
        let expected: string | undefined;
        let actual: string | undefined;

        if (failed && step.error?.message) {
          const msg = step.error.message.replace(/\x1b\[[0-9;]*m/g, '');
          const expMatch = msg.match(/Expected(?:\s+string)?:\s*(.+)/);
          const recMatch = msg.match(/Received(?:\s+string)?:\s*(.+)/);
          if (expMatch) expected = expMatch[1].trim().replace(/^"|"$/g, '');
          if (recMatch) actual   = recMatch[1].trim().replace(/^"|"$/g, '');
        }

        result.push({ title: step.title, failed, expected, actual });
        if (step.steps?.length) result.push(...this.extractSteps(step.steps));
        continue;
      }
    }
    return result;
  }

  async onEnd(_result: FullResult): Promise<void> {
    const failed = this.failures.length;
    const now = new Date().toLocaleString('en-GB', { timeZone: 'Asia/Ho_Chi_Minh' });

    // ── Console summary ───────────────────────────────
    if (failed === 0) {
      console.log('\n✅ All tests passed — no bug tickets needed.\n');
      return;
    }

    console.log('\n' + '═'.repeat(65));
    console.log(`🐛  BUG REPORT — ${failed} test(s) failed`);
    console.log('═'.repeat(65));

    this.failures.forEach((f, i) => {
      console.log(`\n#${i + 1} [${f.suite}] ${f.title}`);
      console.log(`   📁 File      : ${f.file}`);
      console.log(`   ❌ Reason    : ${f.reason}`);
      console.log(`   ⏱  Duration  : ${(f.duration / 1000).toFixed(1)}s`);
      if (f.steps.length > 0) {
        const failIdx = f.steps.findIndex(s => s.failed);
        if (failIdx !== -1) console.log(`   💥 Failed at step ${failIdx + 1}: ${f.steps[failIdx].title}`);
        console.log(`   📋 Steps to reproduce:`);
        f.steps.forEach((s, idx) => {
          const icon = s.failed ? '❌' : '✅';
          console.log(`      ${idx + 1}. ${icon} ${s.title}`);
          if (s.failed && s.expected) console.log(`            🎯 Expected : ${s.expected}`);
          if (s.failed && s.actual)   console.log(`            💥 Actual   : ${s.actual}`);
        });
      }
    });

    console.log('\n' + '═'.repeat(65));
    console.log(`📊 Total: ${this.totalTests} | Passed: ${this.passed} | Failed: ${failed}`);
    console.log('═'.repeat(65) + '\n');

    // ── Build .docx (awaited so file is written before Playwright exits) ──
    await this.writeDocx(now, failed);
  }

  private async writeDocx(now: string, failed: number): Promise<void> {
    const children: (Paragraph | Table)[] = [];

    // ── Title ──
    children.push(new Paragraph({
      heading: HeadingLevel.HEADING_1,
      children: [new TextRun({ text: 'Bug Report', bold: true, color: RED, font: 'Arial', size: 40 })],
    }));

    // ── Summary table ──
    children.push(new Paragraph(''));
    children.push(infoTable([
      ['Run Date', now],
      ['Total Tests', String(this.totalTests)],
      ['Passed', String(this.passed)],
      ['Failed', String(failed)],
    ]));
    children.push(new Paragraph(''));

    // ── One section per failed test ──
    for (let i = 0; i < this.failures.length; i++) {
      const f = this.failures[i];

      // Bug heading
      children.push(new Paragraph({
        heading: HeadingLevel.HEADING_2,
        children: [new TextRun({ text: `Bug #${i + 1} — ${f.title}`, font: 'Arial', size: 28, bold: true, color: RED })],
        spacing: { before: 240 },
      }));

      // Info table
      children.push(infoTable([
        ['Suite',    f.suite],
        ['File',     f.file],
        ['Browser',  f.browser],
        ['Duration', `${(f.duration / 1000).toFixed(1)}s`],
        ['Retries',  String(f.retries)],
        ['Error',    f.reason],
      ]));
      children.push(new Paragraph(''));

      // Steps to reproduce heading
      children.push(new Paragraph({
        heading: HeadingLevel.HEADING_3,
        children: [new TextRun({ text: 'Steps to Reproduce', font: 'Arial', size: 24, bold: true, color: BLUE })],
      }));

      // Steps list
      if (f.steps.length > 0) {
        const failedIdx = f.steps.findIndex(s => s.failed);

        // "Failed at step X" callout
        if (failedIdx !== -1) {
          children.push(new Paragraph({
            children: [new TextRun({
              text: `  Failed at step ${failedIdx + 1}: ${f.steps[failedIdx].title}  `,
              bold: true, color: 'FFFFFF', font: 'Arial', size: 20,
            })],
            shading: { fill: RED, type: ShadingType.CLEAR },
            spacing: { before: 80, after: 120 },
          }));
        }

        f.steps.forEach((s, idx) => {
          const icon  = s.failed ? '[FAIL]' : '[PASS]';
          const color = s.failed ? RED : GREEN;
          const isFailing = s.failed;

          children.push(new Paragraph({
            shading: isFailing ? { fill: 'FFE9E9', type: ShadingType.CLEAR } : undefined,
            children: [
              new TextRun({ text: `${idx + 1}. ${icon} `, bold: true, color, font: 'Arial', size: 20 }),
              new TextRun({ text: s.title, font: 'Courier New', size: 20, bold: isFailing }),
            ],
            spacing: { after: 60 },
          }));

          if (s.failed && s.expected) {
            children.push(new Paragraph({
              indent: { left: 720 },
              shading: { fill: 'FFE9E9', type: ShadingType.CLEAR },
              children: [
                new TextRun({ text: 'Expected: ', bold: true, color: GREEN, font: 'Arial', size: 20 }),
                new TextRun({ text: s.expected, font: 'Courier New', size: 20 }),
              ],
              spacing: { after: 40 },
            }));
          }
          if (s.failed && s.actual) {
            children.push(new Paragraph({
              indent: { left: 720 },
              shading: { fill: 'FFE9E9', type: ShadingType.CLEAR },
              children: [
                new TextRun({ text: 'Actual:   ', bold: true, color: RED, font: 'Arial', size: 20 }),
                new TextRun({ text: s.actual, font: 'Courier New', size: 20 }),
              ],
              spacing: { after: 80 },
            }));
          }
        });
      }

      // Screenshot
      if (f.screenshotPath && fs.existsSync(f.screenshotPath)) {
        children.push(new Paragraph(''));
        children.push(new Paragraph({
          heading: HeadingLevel.HEADING_3,
          children: [new TextRun({ text: 'Screenshot', font: 'Arial', size: 24, bold: true, color: BLUE })],
        }));
        const imgData = fs.readFileSync(f.screenshotPath);
        children.push(new Paragraph({
          children: [new ImageRun({
            type: 'png',
            data: imgData,
            transformation: { width: 600, height: 380 },
            altText: { title: 'Failure screenshot', description: f.title, name: 'screenshot' },
          })],
        }));
      }

      children.push(new Paragraph({ children: [new TextRun('')], spacing: { before: 200 },
        border: { bottom: { style: BorderStyle.SINGLE, size: 4, color: 'DDDDDD', space: 1 } } }));
    }

    const doc = new Document({
      styles: {
        default: { document: { run: { font: 'Arial', size: 22 } } },
        paragraphStyles: [
          { id: 'Heading1', name: 'Heading 1', basedOn: 'Normal', next: 'Normal', quickFormat: true,
            run: { size: 40, bold: true, font: 'Arial' },
            paragraph: { spacing: { before: 240, after: 120 }, outlineLevel: 0 } },
          { id: 'Heading2', name: 'Heading 2', basedOn: 'Normal', next: 'Normal', quickFormat: true,
            run: { size: 28, bold: true, font: 'Arial' },
            paragraph: { spacing: { before: 200, after: 100 }, outlineLevel: 1 } },
          { id: 'Heading3', name: 'Heading 3', basedOn: 'Normal', next: 'Normal', quickFormat: true,
            run: { size: 24, bold: true, font: 'Arial' },
            paragraph: { spacing: { before: 160, after: 80 }, outlineLevel: 2 } },
        ],
      },
      numbering: {
        config: [{
          reference: 'steps',
          levels: [{ level: 0, format: LevelFormat.DECIMAL, text: '%1.', alignment: AlignmentType.LEFT,
            style: { paragraph: { indent: { left: 720, hanging: 360 } } } }],
        }],
      },
      sections: [{
        properties: {
          page: {
            size: { width: 12240, height: 15840 },
            margin: { top: 1440, right: 1440, bottom: 1440, left: 1440 },
          },
        },
        headers: {
          default: new Header({ children: [new Paragraph({
            children: [new TextRun({ text: 'Saudemo Automation — Bug Report', color: GRAY, font: 'Arial', size: 18 })],
            border: { bottom: { style: BorderStyle.SINGLE, size: 4, color: 'CCCCCC', space: 1 } },
          })],
          })},
        footers: {
          default: new Footer({ children: [new Paragraph({
            alignment: AlignmentType.RIGHT,
            children: [
              new TextRun({ text: 'Page ', font: 'Arial', size: 18, color: GRAY }),
              new TextRun({ children: [PageNumber.CURRENT], font: 'Arial', size: 18, color: GRAY }),
            ],
          })],
          })},
        children,
      }],
    });

    // Save to bug-report/ folder with timestamp
    const bugReportDir = path.join(process.cwd(), 'bug-report');
    if (!fs.existsSync(bugReportDir)) fs.mkdirSync(bugReportDir, { recursive: true });

    const ts = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
    const outPath = path.join(bugReportDir, `bug-report-${ts}.docx`);

    const buffer = await Packer.toBuffer(doc);
    fs.writeFileSync(outPath, buffer);

    console.log(`📄 Bug report saved: bug-report/bug-report-${ts}.docx\n`);
  }
}

export default BugReportReporter;
