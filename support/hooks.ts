import { Before, After, Status, setDefaultTimeout } from '@cucumber/cucumber';
import { CustomWorld } from './world';
import './ensure-reports-dir';

setDefaultTimeout(60000); // 60 seconds for TfL page loads and autocomplete

Before(async function (this: CustomWorld) {
  await this.init();
});

After(async function (this: CustomWorld, { result }) {
  if (result?.status === Status.FAILED && this.page) {
    const screenshot = await this.page.screenshot({ path: `reports/screenshots/failure-${Date.now()}.png` }).catch(() => null);
    if (screenshot) {
      (this as any).attach(screenshot, 'image/png');
    }
  }
  await this.close();
});
