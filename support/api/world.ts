import { IWorldOptions, setWorldConstructor, World } from '@cucumber/cucumber';
import { request, APIRequestContext } from 'playwright';

export class ApiWorld extends World {
  apiContext?: APIRequestContext;
  apiResponseTimeMs?: number;
  apiResponseStatus?: number;
  apiResponseBody?: Record<string, any>;

  constructor(options: IWorldOptions) {
    super(options);
  }

  async initApi(): Promise<void> {
    this.apiContext = await request.newContext({
      extraHTTPHeaders: {
        'accept': 'application/json',
      },
    });
  }

  async close(): Promise<void> {
    if (this.apiContext) {
      await this.apiContext.dispose();
      this.apiContext = undefined;
    }
  }
}

setWorldConstructor(ApiWorld);
