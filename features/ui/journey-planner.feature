Feature: TfL Journey Planner Widget

  As a London traveler
  I want to use the Journey Planner widget on the TfL website
  So that I can plan journeys and view travel information

  Background:
    Given I am on the TfL Journey Planner page

  Scenario: Plan a valid journey using the widget
    When I plan a journey from "Leicester Square" to "Covent Garden" using autocomplete suggestions
    Then I should see journey results
    And the results should display walking time
    And the results should display cycling time

  Scenario: Update preferences to minimize walking and validate journey time
    When I plan a journey from "Leicester Square" to "Covent Garden" using autocomplete suggestions
    Then I should see journey results
    When I click "Edit preferences"
    And I select "Routes with least walking"
    And I click "Update journey"
    Then I should see updated journey results
    And the journey time should be displayed

  Scenario: View details and verify full access information at the destination station
    When I plan a journey from "Leicester Square" to "Covent Garden" using autocomplete suggestions
    Then I should see journey results
    When I click "View details"
    Then I should see complete access information for Covent Garden Underground Station

  Scenario: No results are returned for an invalid journey
    When I enter invalid locations and plan a journey
    Then I should not see valid journey results
    And I should see an error or no results message

  Scenario: The widget does not plan a journey when locations are missing
    When I attempt to plan a journey without entering any locations
    Then the widget should not plan a journey
    And the journey plan form should remain visible
