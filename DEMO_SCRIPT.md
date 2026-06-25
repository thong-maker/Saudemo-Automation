# Chromatic Visual Regression – Demo Script

## Trước buổi demo (chuẩn bị)

1. Vào https://www.chromatic.com/build?appId=6a3ca3a3f01bb1d996cc7aca&number=24
2. Click **"Accept all"** → đây là baseline (giao diện "đúng" hiện tại)
3. Mở VS Code với project Saudemo-Automation
4. Mở terminal sẵn

---

## Kịch bản demo (~5 phút)

### Bước 1 – Giới thiệu (1 phút)

> "Chromatic là tool giúp chúng ta phát hiện UI thay đổi tự động.
> Mỗi lần có code mới, Chromatic chụp screenshot và so sánh với baseline.
> Nếu có gì thay đổi — dù chỉ 1 pixel — nó sẽ báo ngay."

Mở chromatic.com → show 6 snapshots baseline của app.

---

### Bước 2 – Simulate một UI change (1 phút)

Nói với Kat:
> "Giả sử developer vừa thay đổi gì đó trong code — ví dụ switch sang một
> user account khác có giao diện khác. CI/CD sẽ tự detect."

Trong VS Code, copy file demo vào:

```powershell
Copy-Item tests\chromatic\visual.stories.demo-change.ts tests\chromatic\visual.stories.ts
```

Show cho Kat thấy dòng đã thay đổi (dòng 39): `visual_user` thay vì `standard_user`.

---

### Bước 3 – Chạy detection (2 phút)

```powershell
npx playwright test --project=chromatic
```

> "Playwright đang chụp screenshots mới..."

Sau khi xong:

```powershell
npm run chromatic
```

> "Chromatic đang so sánh với baseline và upload lên cloud..."

---

### Bước 4 – Review trên Chromatic (2 phút)

Mở link build mới từ terminal output.

Chỉ cho Kat thấy:
- **Snapshot "Inventory page"** → highlight đỏ vùng bị thay đổi
- Giải thích: đỏ = pixel bị xóa, xanh = pixel mới thêm vào
- **"Accept"** = thay đổi này intentional → trở thành baseline mới
- **"Deny"** = đây là bug → cần fix code

> "Trong CI/CD thật, nếu Deny → build fail, developer phải fix trước khi merge."

---

### Bước 5 – Restore (sau demo)

```powershell
git checkout tests/chromatic/visual.stories.ts
```

---

## Key messages cho Kat

- **Tự động 100%**: chạy mỗi khi push code, không cần manual review
- **Pixel-perfect**: phát hiện thay đổi mà mắt người không thấy
- **Review trực quan**: approve/deny ngay trên web, không cần đọc code
- **Tích hợp CI/CD**: CloudBees → GitHub Actions → Chromatic → report
