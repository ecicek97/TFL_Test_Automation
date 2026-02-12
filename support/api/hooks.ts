import { Before, After, setDefaultTimeout } from '@cucumber/cucumber';
import { ApiWorld } from './world';
import '../ensure-reports-dir';

setDefaultTimeout(3000);

Before(async function (this: ApiWorld) {
  await this.initApi();
});

After(async function (this: ApiWorld) {
  await this.close();
});
