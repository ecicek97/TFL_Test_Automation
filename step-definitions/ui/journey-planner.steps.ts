import { Given, When, Then } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import { UiWorld } from '../../support/ui/world';
import { TestData, getStationInfo } from '../../support/ui/test-data';

Given('I am on the TfL Journey Planner page', async function (this: UiWorld) {
  await this.journeyPage.navigate();
});

When('I plan a journey from {string} to {string} using autocomplete suggestions',
  async function (this: UiWorld, from: string, to: string) {
    const fromStation = getStationInfo(from);
    const toStation = getStationInfo(to);

    await this.journeyPage.planJourney(
      fromStation.searchText,
      fromStation.fullName,
      toStation.searchText,
      toStation.fullName
    );
  }
);

When('I enter invalid locations and plan a journey', async function (this: UiWorld) {
  await this.journeyPage.enterFromLocation(TestData.invalidLocations.from);
  await this.journeyPage.enterToLocation(TestData.invalidLocations.to);
  await this.journeyPage.clickPlanJourney();
});

When('I attempt to plan a journey without entering any locations', async function (this: UiWorld) {
  await this.journeyPage.clickPlanJourney();
});

When('I click {string}', async function (this: UiWorld, buttonName: string) {
  await this.journeyPage.clickButton(buttonName);
});

When('I select {string}', async function (this: UiWorld, option: string) {
  await this.journeyPage.selectOption(option);
});

Then('I should see journey results', async function (this: UiWorld) {
  const resultsVisible = await this.journeyPage.areJourneyResultsVisible();
  expect(resultsVisible, 'Expected to see journey results').toBeTruthy();
});

Then('the results should display walking time', async function (this: UiWorld) {
  const isVisible = await this.journeyPage.isWalkingTimeVisible();
  expect(isVisible, 'Expected walking time to be visible').toBeTruthy();
});

Then('the results should display cycling time', async function (this: UiWorld) {
  const isVisible = await this.journeyPage.isCyclingTimeVisible();
  expect(isVisible, 'Expected cycling time to be visible').toBeTruthy();
});

Then('I should see updated journey results', async function (this: UiWorld) {
  const hasContent = await this.journeyPage.areUpdatedResultsVisible();
  expect(hasContent, 'Expected to see updated journey results').toBeTruthy();
});

Then('the journey time should be displayed', async function (this: UiWorld) {
  const isDisplayed = await this.journeyPage.isJourneyTimeDisplayed();
  expect(isDisplayed, 'Expected journey time to be displayed').toBeTruthy();
});

Then('I should see complete access information for Covent Garden Underground Station', async function (this: UiWorld) {
  const isVisible = await this.journeyPage.isAccessInformationVisible();
  expect(isVisible, 'Expected access information to be visible').toBeTruthy();
});

Then('I should not see valid journey results', async function (this: UiWorld) {
  const noResults = await this.journeyPage.hasNoValidResults();
  expect(noResults, 'Expected no valid journey results').toBeTruthy();
});

Then('I should see an error or no results message', async function (this: UiWorld) {
  const hasError = await this.journeyPage.hasErrorOrNoResultsMessage();
  expect(hasError, 'Expected error or no results message').toBeTruthy();
});

Then('the widget should not plan a journey', async function (this: UiWorld) {
  const stillOnPlanPage = await this.journeyPage.isStillOnPlanPage();
  expect(stillOnPlanPage, 'Expected to stay on plan page when no locations entered').toBeTruthy();
});

Then('the journey plan form should remain visible', async function (this: UiWorld) {
  const isFormVisible = await this.journeyPage.isJourneyPlanFormVisible();
  expect(isFormVisible, 'Journey plan form (From/To inputs) should be visible').toBeTruthy();
});
