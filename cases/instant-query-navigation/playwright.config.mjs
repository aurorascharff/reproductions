export default {
  testDir: './tests',
  workers: 1,
  retries: 0,
  timeout: 20000,
  use: {
    baseURL: 'http://localhost:3424',
    navigationTimeout: 5000,
    actionTimeout: 5000,
    launchOptions: process.env.CHROMIUM_PATH ? { executablePath: process.env.CHROMIUM_PATH } : {},
  },
  webServer: { command: 'npm start', url: 'http://localhost:3424/shop/uk?category=all', reuseExistingServer: false },
}
