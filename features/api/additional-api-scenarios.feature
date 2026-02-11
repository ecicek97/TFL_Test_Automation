@manual
Feature: Open Library API - Additional Scenarios (Documentation)
  These scenarios are proposed for future coverage and are not automated yet.

  Scenario: Verify response content type is JSON
    Given I request the Open Library books endpoint
    Then the response should have content type "application/json"

  Scenario: Verify only requested bibkeys are returned
    Given I request the Open Library books endpoint
    Then the response should include only the requested bibkeys

  Scenario: Verify missing bibkey returns empty result
    Given I request the Open Library books endpoint with an unknown bibkey
    Then the response should not include that bibkey

  Scenario: Verify cover images are cached and stable
    Given I request the Open Library books endpoint
    Then each thumbnail should be served with cache headers

  Scenario: Verify preview and info URLs are reachable
    Given I request the Open Library books endpoint
    Then each preview url should respond successfully
    And each info url should respond successfully

  Scenario: Verify thumbnail dimensions are expected for size "S"
    Given I request the Open Library books endpoint
    Then each thumbnail image should have dimensions within the expected small range
