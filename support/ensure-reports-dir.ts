import * as fs from 'fs';
import * as path from 'path';

const reportsDir = path.join(process.cwd(), 'reports');
const screenshotsDir = path.join(reportsDir, 'screenshots');

if (!fs.existsSync(reportsDir)) {
  fs.mkdirSync(reportsDir, { recursive: true });
}
if (!fs.existsSync(screenshotsDir)) {
  fs.mkdirSync(screenshotsDir, { recursive: true });
}
