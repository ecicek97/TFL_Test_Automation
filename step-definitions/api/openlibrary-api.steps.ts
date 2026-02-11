import { Given, Then } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import crypto from 'crypto';
import fs from 'fs';
import path from 'path';
import { ApiWorld } from '../../support/api/world';
import { OpenLibraryApi } from '../../support/api/openlibrary-test-data';

function hashBuffer(buffer: Buffer): string {
  return crypto.createHash('sha256').update(buffer).digest('hex');
}

Given('I request the Open Library books endpoint', async function (this: ApiWorld) {
  if (!this.apiContext) {
    throw new Error('API context was not initialized.');
  }
  const start = Date.now();
  const response = await this.apiContext.get(OpenLibraryApi.endpoint);
  this.apiResponseTimeMs = Date.now() - start;
  this.apiResponseStatus = response.status();
  this.apiResponseBody = await response.json();
});

Then('the response status should be {int}', async function (this: ApiWorld, expectedStatus: number) {
  expect(this.apiResponseStatus, 'Expected response status to be set').toBeDefined();
  expect(this.apiResponseStatus).toBe(expectedStatus);
});

Then('the response time should be below the threshold', async function (this: ApiWorld) {
  expect(this.apiResponseTimeMs, 'Expected response time to be set').toBeDefined();
  expect(this.apiResponseTimeMs).toBeLessThanOrEqual(OpenLibraryApi.responseTimeThresholdMs);
});

Then('the response should contain the expected number of results', async function (this: ApiWorld) {
  const body = this.apiResponseBody || {};
  const count = Object.keys(body).length;
  expect(count).toBe(OpenLibraryApi.expectedResultCount);
});

Then('the response should match the expected book data', async function (this: ApiWorld) {
  const body = this.apiResponseBody || {};
  for (const [key, expected] of Object.entries(OpenLibraryApi.expectedBooks)) {
    const actual = body[key];
    expect(actual, `Missing response for ${key}`).toBeTruthy();
    expect(actual.bib_key).toBe(expected.bibKey);
    expect(actual.info_url).toBe(expected.infoUrl);
    expect(actual.preview).toBe(expected.preview);
    expect(actual.preview_url).toBe(expected.previewUrl);
    expect(actual.thumbnail_url).toBe(expected.thumbnailUrl);
  }
});

Then('the response thumbnails should match the stored images', async function (this: ApiWorld) {
  if (!this.apiContext) {
    throw new Error('API context was not initialized.');
  }

  for (const expected of Object.values(OpenLibraryApi.expectedBooks)) {
    const imagePath = path.join(OpenLibraryApi.fixturesDir, expected.imageFile);
    if (!fs.existsSync(imagePath)) {
      throw new Error(`Missing baseline image: ${imagePath}`);
    }

    const baselineBuffer = fs.readFileSync(imagePath);
    const baselineHash = hashBuffer(baselineBuffer);

    const response = await this.apiContext.get(expected.thumbnailUrl);
    expect(response.status()).toBe(200);
    const downloadedBuffer = await response.body();
    const downloadedHash = hashBuffer(downloadedBuffer);

    expect(downloadedHash, `Thumbnail mismatch for ${expected.bibKey}`).toBe(baselineHash);
  }
});

Then('each book should have a valid thumbnail url', async function (this: ApiWorld) {
  const body = this.apiResponseBody || {};
  for (const [key, book] of Object.entries(body)) {
    expect(book.thumbnail_url, `Missing thumbnail_url for ${key}`).toBeTruthy();
    const url = new URL(book.thumbnail_url);
    expect(url.hostname).toBe(OpenLibraryApi.thumbnailHost);
    expect(url.pathname.toLowerCase()).toMatch(/\.jpg$/);
  }
});

Then('each thumbnail should be a non-empty jpeg image', async function (this: ApiWorld) {
  if (!this.apiContext) {
    throw new Error('API context was not initialized.');
  }

  const body = this.apiResponseBody || {};
  for (const [key, book] of Object.entries(body)) {
    const response = await this.apiContext.get(book.thumbnail_url);
    expect(response.status()).toBe(200);
    const contentType = response.headers()['content-type'] || '';
    const buffer = await response.body();
    expect(contentType.toLowerCase()).toContain('image/jpeg');
    expect(buffer.length, `Empty image for ${key}`).toBeGreaterThan(0);
  }
});
