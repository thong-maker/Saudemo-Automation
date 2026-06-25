pipeline {
    agent {
        docker {
            image 'mcr.microsoft.com/playwright:v1.50.0-jammy'
            args '-e HOME=/root'
        }
    }

    environment {
        BASE_URL = 'https://www.saucedemo.com'
        STANDARD_USER = 'standard_user'
        STANDARD_PASSWORD = credentials('saucedemo-password')
        CHROMATIC_PROJECT_TOKEN = credentials('chromatic-project-token')
    }

    stages {
        stage('Install') {
            steps {
                sh 'npm ci'
            }
        }

        stage('E2E Tests') {
            steps {
                sh 'npm run test:e2e'
            }
            post {
                always {
                    publishHTML([
                        allowMissing: false,
                        alwaysLinkToLastBuild: true,
                        keepAll: true,
                        reportDir: 'playwright-report',
                        reportFiles: 'index.html',
                        reportName: 'Playwright E2E Report',
                    ])
                }
            }
        }

        stage('API Tests') {
            steps {
                sh 'npm run test:api'
            }
        }

        stage('Accessibility Tests') {
            steps {
                sh 'npm run test:accessibility'
            }
        }

        stage('Visual Regression (Chromatic)') {
            when { branch 'main' }
            steps {
                sh 'npx chromatic --exit-zero-on-changes'
            }
        }
    }

    post {
        always {
            archiveArtifacts artifacts: 'playwright-report/**', allowEmptyArchive: true
            archiveArtifacts artifacts: 'reports/**', allowEmptyArchive: true
        }
        failure {
            emailext(
                subject: "❌ Saudemo Tests FAILED – ${env.JOB_NAME} #${env.BUILD_NUMBER}",
                body: "Build URL: ${env.BUILD_URL}",
                to: 'team@theprojectfactory.com',
            )
        }
    }
}
