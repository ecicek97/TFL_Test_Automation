import { IWorldOptions, setWorldConstructor, World } from '@cucumber/cucumber';
import { chromium, firefox, webkit, Browser, BrowserContext, Page, BrowserType } from 'playwright';
import { JourneyPlannerPage } from '../../pages/JourneyPlannerPage';

export class UiWorld extends World {
  browser!: Browser;
  context!: BrowserContext;
  page!: Page;
  journeyPage!: JourneyPlannerPage;

  constructor(options: IWorldOptions) {
    super(options);
  }

  async init(): Promise<void> {
    const browserName = (process.env.BROWSER || 'chromium').toLowerCase();
    let browserType: BrowserType<Browser>;

    switch (browserName) {
      case 'firefox':
        browserType = firefox;
        break;
      case 'webkit':
        browserType = webkit;
        break;
      case 'chromium':
      default:
        browserType = chromium;
        break;
    }

    this.browser = await browserType.launch({
      headless: process.env.HEADLESS !== 'false',
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });
    this.context = await this.browser.newContext({
      viewport: { width: 1280, height: 720 },
      ignoreHTTPSErrors: true,
      locale: 'en-GB',
    });
    this.page = await this.context.newPage();
    this.page.setDefaultTimeout(30000);
    this.page.setDefaultNavigationTimeout(60000);
    this.journeyPage = new JourneyPlannerPage(this.page);
  }

  async close(): Promise<void> {
    if (this.browser) {
      await this.browser.close();
    }
  }
}

setWorldConstructor(UiWorld);
