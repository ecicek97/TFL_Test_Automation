
Feature: Open Library Books API
  As a consumer of the Open Library API
  I want predictable responses for known bibkeys
  So I can validate response performance and content

  Scenario: Validate response status, timing, and content
    Given I request the Open Library books endpoint
    Then the response status should be 200
    And the response time should be below the threshold
    And the response should contain the expected number of results
    And the response should match the expected book data
    And the response thumbnails should match the stored images

  Scenario: Validate thumbnail URLs and image content
    Given I request the Open Library books endpoint
    Then each book should have a valid thumbnail url
    And each thumbnail should be a non-empty jpeg image
