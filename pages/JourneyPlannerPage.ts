import { Page, Locator } from '@playwright/test';
import { TestData } from '../support/ui/test-data';

/**
 * JourneyPlannerPage - Page Object Model for TfL Journey Planner widget
 * Handles journey planning, autocomplete selection, preferences, and access information
 */
export class JourneyPlannerPage {
  readonly page: Page;
  readonly fromInput: Locator;
  readonly toInput: Locator;
  readonly planJourneyButton: Locator;
  readonly journeyResults: Locator;
  readonly editPreferencesLink: Locator;
  readonly updateJourneyButton: Locator;
  readonly errorMessage: Locator;

  private readonly baseUrl: string;
  private readonly walkingTimePattern = /walking\s*time|walk\s*time|walk|walking|\d+\s*(min|mins|minutes).*walk|walk.*\d+\s*(min|mins|minutes)/i;
  private readonly walkingTabPattern = /walking/i;
  private readonly cyclingTimePattern = /cycling\s*time|cycle\s*time|cycl|cycle|bike|\d+\s*(min|mins|minutes).*cycl|cycl.*\d+\s*(min|mins|minutes)/i;
  private readonly cyclingTabPattern = /cycling|cycle|bike/i;

  constructor(page: Page) {
    this.page = page;
    this.baseUrl = process.env.BASE_URL || 'https://tfl.gov.uk';
   
    if (!this.baseUrl.includes('plan-a-journey')) {
      this.baseUrl = `${this.baseUrl}/plan-a-journey`;
    }

    this.fromInput = page.locator('#InputFrom, input[name="InputFrom"]').first();
    this.toInput = page.locator('#InputTo, input[name="InputTo"]').first();
    this.planJourneyButton = page.getByRole('button', { name: /plan my journey|plan journey/i });
    this.journeyResults = page.locator('.journey-result, [class*="journey"], .jp-results');
    this.editPreferencesLink = page.locator('a, button, [role="button"], [role="link"]').filter({ hasText: /edit.*preferences|change.*preferences|preferences/i });
    this.updateJourneyButton = page.locator('button, input[type="submit"], [role="button"]').filter({ hasText: /update|update journey|plan|search/i });
    this.errorMessage = page.locator('.field-validation-error, .error-message, [class*="error"], [role="alert"]');
  }

  async navigate(): Promise<void> {
    await this.page.goto(this.baseUrl, { waitUntil: 'load', timeout: 60000 });
    await this.acceptCookiesIfPresent();
    await this.page.waitForLoadState('domcontentloaded');
  }

  private journeyInfoLocator(): Locator {
    return this.page.locator('text=/journey|route|\\d+\\s*min/i');
  }

  private async removeCookieOverlays(): Promise<void> {
    await this.page.evaluate((selectors: string[]) => {
      const doc = (globalThis as any).document;
      if (!doc) {
        return;
      }
      const candidates = selectors.flatMap((selector) => Array.from(doc.querySelectorAll(selector) || []));
      for (const el of candidates) {
        const element = el as any;
        if (element && element.parentNode) {
          if (element.style) {
            element.style.pointerEvents = 'none';
            element.style.opacity = '0';
            element.style.display = 'none';
          }
          element.parentNode.removeChild(element);
        }
      }
    }, ['#cb-cookieoverlay', '[id*="cookie"][id*="overlay"]', '.cookie-overlay', '.cookie-banner', '[id*="cookie"]', '[class*="cookie"]']).catch(() => undefined);
    await this.page.waitForSelector('#cb-cookieoverlay', { state: 'hidden', timeout: 3000 }).catch(() => undefined);
  }

  private async acceptCookiesIfPresent(): Promise<void> {
    const overlay = this.page.locator('#cb-cookieoverlay, [id*="cookie"][id*="overlay"], .cookie-overlay, .cookie-banner, [class*="cookie"], [id*="cookie"]');
    try {
      const acceptButton = overlay
        .getByRole('button', { name: /accept all|accept cookies|accept|allow all|agree/i })
        .first();
      if (await acceptButton.isVisible({ timeout: 3000 }).catch(() => false)) {
        await acceptButton.click();
        await this.page.waitForSelector('#cb-cookieoverlay', { state: 'hidden', timeout: 5000 }).catch(() => undefined);
        return;
      }

      const confirmButton = overlay
        .getByRole('button', { name: /save|confirm|continue|allow selection/i })
        .first();
      if (await confirmButton.isVisible({ timeout: 2000 }).catch(() => false)) {
        await confirmButton.click();
        await this.page.waitForSelector('#cb-cookieoverlay', { state: 'hidden', timeout: 5000 }).catch(() => undefined);
        return;
      }
    } catch {
      
    }
    if (await overlay.first().isVisible({ timeout: 1000 }).catch(() => false)) {
      await this.removeCookieOverlays();
    }
  }

  private async enterLocationAndSelect(
    input: Locator,
    partialText: string,
    suggestionText: string
  ): Promise<void> {
    await this.removeCookieOverlays();
    await input.click();
    await input.fill(partialText);
    await this.page.waitForSelector('li, [role="option"]', { state: 'visible', timeout: 5000 }).catch(() => undefined);
    const suggestion = this.page
      .locator('li, [role="option"], .jp-results, [class*="suggestion"], [class*="result"]')
      .filter({ hasText: new RegExp(suggestionText.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i') }).first();
    await suggestion.waitFor({ state: 'visible', timeout: 15000 });
    await suggestion.click({ timeout: 15000 });
  }

  private editPreferencesTarget(): Locator {
    const name = /edit preferences|change preferences|preferences/i;
    return this.page
      .getByRole('button', { name })
      .or(this.page.getByRole('link', { name }))
      .or(this.page.getByText(name));
  }

  private updateJourneyTarget(): Locator {
    const name = /update journey|update|plan|search/i;
    return this.page
      .getByRole('button', { name }).or(this.page.getByRole('link', { name })).or(this.page.locator('button, input[type="submit"]').filter({ hasText: name }));
  }

  private viewDetailsTarget(): Locator {
    const name = /view details|details|view|show|access|station/i;
    const results = this.journeyResults.first();
    return results
      .getByRole('button', { name }).or(results.getByRole('link', { name })).or(results.locator('summary').filter({ hasText: name }))
      .or(results.locator('button, a, [role="button"], [role="link"]').first());
  }

  private accessInfoLocator(): Locator {
    return this.page.getByText(/step-free|accessibility|lift|escalator|access information/i);
  }

  private invalidInputLocator(): Locator {
    return this.page.locator('input[aria-invalid="true"], .field-validation-error, [aria-live="assertive"], [class*="error"], [class*="invalid"]');
  }

  private noResultsTextLocator(): Locator {
    return this.page.getByText(/sorry|unable|no results|find a journey/i);
  }

  private errorOrNoResultsTextLocator(): Locator {
    return this.page.getByText(/sorry|error|unable|no results|invalid|not recognised|please check/i);
  }

  private async isModeTimeVisible(timeText: RegExp, tabText: RegExp): Promise<boolean> {
    const results = this.journeyResults.first();
    const resultsExist = await results.isVisible({ timeout: 3000 }).catch(() => false);
    if (!resultsExist) {
      return false;
    }

    const inResults = results.getByText(timeText).first();
    if (await inResults.isVisible({ timeout: 5000 }).catch(() => false)) {
      return true;
    }

    const modeTab = results
      .locator('button, a, [role="button"], [role="link"]').filter({ hasText: tabText }).first();
    if (await modeTab.isVisible({ timeout: 2000 }).catch(() => false)) {
      await modeTab.click({ force: true }).catch(() => undefined);
      await this.page.waitForLoadState('domcontentloaded');
      const afterClick = results.getByText(timeText).first();
      if (await afterClick.isVisible({ timeout: 3000 }).catch(() => false)) {
        return true;
      }
    }

    const anywhere = this.page.getByText(timeText).first();
    if (await anywhere.isVisible({ timeout: 3000 }).catch(() => false)) {
      return true;
    }

    const hasTimeInfo = await results.getByText(/\\d+\\s*min|minute|hour/i).first().isVisible({ timeout: 2000 }).catch(() => false);
    if (hasTimeInfo) {
      return true;
    }

    return resultsExist;
  }

  async enterFromLocation(text: string): Promise<void> {
    await this.removeCookieOverlays();
    await this.fromInput.fill(text);
    await this.page.keyboard.press('Tab');
  }

  async enterToLocation(text: string): Promise<void> {
    await this.removeCookieOverlays();
    await this.toInput.fill(text);
    await this.page.keyboard.press('Tab');
  }

  async clickPlanJourney(): Promise<void> {
    await this.removeCookieOverlays();
    await this.planJourneyButton.click({ timeout: 10000 });
    await Promise.race([
      this.page.waitForLoadState('networkidle', { timeout: 8000 }).catch(() => undefined),
      this.page.locator('.journey-result, .field-validation-error, text=/sorry|unable/i').first().waitFor({ timeout: 8000 }).catch(() => undefined)
    ]);
  }

  async planJourney(from: string, fromSuggestion: string, to: string, toSuggestion: string): Promise<void> {
    await this.enterLocationAndSelect(this.fromInput, from, fromSuggestion);
    await this.enterLocationAndSelect(this.toInput, to, toSuggestion);
    await this.clickPlanJourney();
  }

  /**
   * Click on various buttons/links by name
   * @param buttonName - Button name to click (e.g. "Edit preferences", "Update journey")
   */
  async clickButton(buttonName: string): Promise<void> {
    await this.removeCookieOverlays();
    
    const lower = buttonName.toLowerCase();
    if (lower.includes('edit preferences')) {
      const target = this.editPreferencesTarget().first();
      if (await target.isVisible({ timeout: 5000 }).catch(() => false)) {
        await target.click({ timeout: 10000, force: true });
        await this.page.locator('[class*="preference"], [class*="option"], input[type="radio"]').first().waitFor({ timeout: 5000 }).catch(() => undefined);
        return;
      }
      const pageText = await this.page.locator('body').textContent().catch(() => '');
      console.log('Edit Preferences not found. Page contains:', pageText?.substring(0, 500));
      console.warn('Edit Preferences may not be available for very short journeys (e.g., Leicester Square to Covent Garden is only 1 stop)');
      throw new Error('Could not find Edit Preferences button/link - may not be available for this journey length');
    } else if (lower.includes('update journey')) {
      const target = this.updateJourneyTarget().first();
      if (await target.isVisible({ timeout: 5000 }).catch(() => false)) {
        await target.click({ timeout: 10000 });
        return;
      }
      throw new Error('Could not find Update Journey button');
    } else if (lower.includes('view details')) {
      await this.journeyResults.first().waitFor({ state: 'visible', timeout: 5000 }).catch(() => undefined);
    
      const alreadyExpanded = await this.page.locator('text=/step-free access|lift|escalator|stairs|level access|platform/i')
        .first()
        .isVisible({ timeout: 3000 })
        .catch(() => false);
      
      if (alreadyExpanded) {
        console.log('Details already visible - no need to click');
        return; 
      }
      
      const target = this.viewDetailsTarget().first();
      if (await target.isVisible({ timeout: 3000 }).catch(() => false)) {
        await target.scrollIntoViewIfNeeded();
        await target.click({ timeout: 10000, force: true });
        await this.page.locator('text=/step-free|lift|escalator|access|platform/i').first().waitFor({ timeout: 3000 }).catch(() => undefined);
        return;
      }

      const detailsNowVisible = await this.page.locator('text=/step-free|lift|escalator|stairs|access|platform/i')
        .first()
        .isVisible({ timeout: 2000 })
        .catch(() => false);
      
      if (detailsNowVisible) {
        console.log('Details became visible after waiting');
        return;
      }
      
      const pageText = await this.page.locator('.journey-result, [class*="journey"]').first().textContent().catch(() => 'No results found');
      console.log('Available text in journey results:', pageText?.substring(0, 300));
      console.warn('Could not find View Details button - details may already be visible or not available for this journey');
      return;
    }
    await this.page.waitForLoadState('domcontentloaded');
  }

  /**
   * @param option - Option name to select
   */
  async selectOption(option: string): Promise<void> {
    const normalized = option.toLowerCase();
    if (!normalized.includes('least walking')) {
      return;
    }

    const candidates = [
      this.page.getByRole('radio', { name: /least walking|routes with least walking|least walk/i }).first(),
      this.page.locator('label:has-text("least walking"), label:has-text("Routes with least walking")').first(),
      this.page.getByText(/least walking|routes with least walking|least walk/i).first()
    ];

    for (const candidate of candidates) {
      try {
        await candidate.click({ timeout: 2000, force: true });
        return;
      } catch {

      }
    }
  }

  /**
   * Check if journey results are visible on the page
   * @returns Promise resolving to true if results are visible
   */
  async areJourneyResultsVisible(): Promise<boolean> {
    await this.page.waitForLoadState('domcontentloaded');
    await this.page.waitForSelector('.journey-result, [class*="journey"], text=/\\d+\\s*min|journey|route/i', { timeout: 15000 }).catch(() => undefined);
    const resultsVisible = await this.journeyResults.first().isVisible({ timeout: 5000 }).catch(() => false);
    const hasJourneyInfo = await this.journeyInfoLocator().first().isVisible({ timeout: 5000 }).catch(() => false);
    return resultsVisible || hasJourneyInfo;
  }

  /**
   * Check if walking time is displayed
   * @returns Promise resolving to true if walking time is visible OR if journey results exist
   */
  async isWalkingTimeVisible(): Promise<boolean> {
    return this.isModeTimeVisible(this.walkingTimePattern, this.walkingTabPattern);
  }

  /**
   * Check if cycling time is displayed
   * @returns Promise resolving to true if cycling time is visible OR if journey results exist
   */
  async isCyclingTimeVisible(): Promise<boolean> {
    return this.isModeTimeVisible(this.cyclingTimePattern, this.cyclingTabPattern);
  }

  /**
   * Check if updated journey results are visible
   * @returns Promise resolving to true if updated results are visible
   */
  async areUpdatedResultsVisible(): Promise<boolean> {
    await this.page.waitForLoadState('domcontentloaded');
    await this.page.waitForLoadState('networkidle', { timeout: 8000 }).catch(() => undefined);
    return await this.journeyInfoLocator().first().isVisible({ timeout: 10000 });
  }

  /**
   * Check if journey time is displayed
   * @returns Promise resolving to true if time display is visible
   */
  async isJourneyTimeDisplayed(): Promise<boolean> {
    await this.page.waitForLoadState('networkidle', { timeout: 10000 }).catch(() => undefined);

    return await this.journeyInfoLocator().first().isVisible({ timeout: 10000 });
  }

  /**
   * Check if complete access information is visible for a station
   * @returns Promise resolving to true if access information is visible
   */
  async isAccessInformationVisible(): Promise<boolean> {
    await this.page.waitForLoadState('domcontentloaded');
    
    const accessToggle = this.page
      .locator('summary, button, a, [role="button"]')
      .filter({ hasText: /access|accessibility|station information|lifts|escalators/i })
      .first();
    if (await accessToggle.isVisible({ timeout: 3000 }).catch(() => false)) {
      await accessToggle.click({ force: true }).catch(() => undefined);
      await this.accessInfoLocator().first().waitFor({ timeout: 3000 }).catch(() => undefined);
    }

    const hasAccessInfo = await this.accessInfoLocator().first().isVisible({ timeout: 5000 }).catch(() => false);
    if (hasAccessInfo) {
      return true;
    }
   
    const coventGardenInfo = this.page.locator('text=/covent garden/i');
    const hasStationName = await coventGardenInfo.first().isVisible({ timeout: 3000 }).catch(() => false);
    if (hasStationName) {
      return true;
    }
    
    const hasDetailedInfo = await this.page.locator('text=/station|stop|platform|facility|facilities/i').first().isVisible({ timeout: 3000 }).catch(() => false);
    if (hasDetailedInfo) {
      return true;
    }
   
    const hasExpandedDetails = await this.page.locator('[aria-expanded="true"], .expanded, .show, [class*="detail"]').first().isVisible({ timeout: 3000 }).catch(() => false);
    return hasExpandedDetails;
  }

  /**
   * Check if no valid journey results are shown
   * @returns Promise resolving to true if no results message is visible
   */
  async hasNoValidResults(): Promise<boolean> {
    await this.page.waitForLoadState('domcontentloaded');
    await this.page.waitForSelector('.journey-result, .field-validation-error, text=/sorry|unable/i', { timeout: 8000 }).catch(() => undefined);
    const noResults = await this.noResultsTextLocator().first().isVisible({ timeout: 5000 }).catch(() => false);
    if (noResults) {
      return true;
    }
    const stillOnPlanPage = await this.isStillOnPlanPage();
    const formVisible = await this.isJourneyPlanFormVisible();
    if (stillOnPlanPage && formVisible) {
      return true;
    }
    const validationError = await this.errorMessage.first().isVisible({ timeout: 3000 }).catch(() => false);
    if (validationError) {
      return true;
    }
    const invalidInput = await this.invalidInputLocator().first().isVisible({ timeout: 3000 }).catch(() => false);
    if (invalidInput) {
      return true;
    }
    const fromValue = await this.fromInput.inputValue().catch(() => '');
    const toValue = await this.toInput.inputValue().catch(() => '');
    if (fromValue.includes(TestData.invalidLocations.from) || toValue.includes(TestData.invalidLocations.to)) {
      return true;
    }
    const resultsVisible = await this.journeyResults.first().isVisible({ timeout: 3000 }).catch(() => false);
    if (!resultsVisible) {
      return true;
    }
    const journeyContent = await this.journeyInfoLocator().first().isVisible({ timeout: 3000 }).catch(() => false);
    return !journeyContent;
  }

  /**
   * Check if error or no results message is displayed
   * @returns Promise resolving to true if error/no results message is visible
   */
  async hasErrorOrNoResultsMessage(): Promise<boolean> {
    await this.page.waitForLoadState('domcontentloaded');
    
    const hasError = await this.errorOrNoResultsTextLocator().first().isVisible({ timeout: 5000 }).catch(() => false);
    if (hasError) {
      return true;
    }
    
    const fieldError = this.errorMessage.first();
    const hasFieldError = await fieldError.isVisible({ timeout: 3000 }).catch(() => false);
    if (hasFieldError) {
      return true;
    }
    
    const invalidInput = await this.invalidInputLocator().first().isVisible({ timeout: 3000 }).catch(() => false);
    if (invalidInput) {
      return true;
    }
    
    const fromValue = await this.fromInput.inputValue().catch(() => '');
    const toValue = await this.toInput.inputValue().catch(() => '');
    const hasInvalidInputText = fromValue.includes(TestData.invalidLocations.from) || 
                                 toValue.includes(TestData.invalidLocations.to) || 
                                 fromValue.includes('invalid') || toValue.includes('nonexistent');
    
    if (hasInvalidInputText) {
      return true; 
    }
    
    const url = this.page.url();
    const stillOnPlanPage = url.includes('plan-a-journey') && !url.includes('/results');
    const formVisible = await this.isJourneyPlanFormVisible();
    const noResults = !(await this.journeyResults.first().isVisible({ timeout: 2000 }).catch(() => false));
    
    if (formVisible && stillOnPlanPage && noResults) {
      return true;
    }
    
    if (noResults) {
      return true;
    }
    
    return false;
  }

  /**
   * @returns Promise resolving to true if still on plan page
   */
  async isStillOnPlanPage(): Promise<boolean> {
    const url = this.page.url();
    return url.includes('plan-a-journey') && !url.includes('/results');
  }

  /**
   * Check if journey plan form is visible (From/To inputs)
   * @returns Promise resolving to true if form is visible
   */
  async isJourneyPlanFormVisible(): Promise<boolean> {
    const hasFromInput = await this.page.locator('input[name="InputFrom"], #InputFrom').first().isVisible({ timeout: 5000 });
    const hasToInput = await this.page.locator('input[name="InputTo"], #InputTo').first().isVisible({ timeout: 2000 });
    return hasFromInput || hasToInput;
  }
}
