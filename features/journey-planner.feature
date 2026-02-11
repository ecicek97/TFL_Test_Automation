
Feature: TfL Journey Planner Widget

  As a London traveller
  I want to use the Journey Planner widget on the TfL website
  So that I can plan my journeys and view travel information

  Background:
    Given I am on the TfL Journey Planner page

  Scenario: Verify that a valid journey can be planned using the widget
    When I plan a journey from "Leicester Square" to "Covent Garden" using autocomplete suggestions
    Then I should see journey results
    And the results should display walking time
    And the results should display cycling time

  Scenario: Edit preferences, select routes with least walking, and validate journey time
    When I plan a journey from "Leicester Square" to "Covent Garden" using autocomplete suggestions
    Then I should see journey results
    When I click "Edit preferences"
    And I select "Routes with least walking"
    And I click "Update journey"
    Then I should see updated journey results
    And the journey time should be displayed

  Scenario: Click on View Details and verify complete access information at destination station
    When I plan a journey from "Leicester Square" to "Covent Garden" using autocomplete suggestions
    Then I should see journey results
    When I click "View details"
    Then I should see complete access information for Covent Garden Underground Station

  Scenario: Verify that the widget does not provide results when an invalid journey is planned
    When I enter invalid locations and plan a journey
    Then I should not see valid journey results
    And I should see an error or no results message

  Scenario: Verify that the widget is unable to plan a journey if no locations are entered
    When I attempt to plan a journey without entering any locations
    Then the widget should not plan a journey
    And the journey plan form should remain visible
