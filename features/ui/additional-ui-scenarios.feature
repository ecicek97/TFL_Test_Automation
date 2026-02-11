@manual
Feature: TfL Journey Planner - Additional Scenarios (Documentation)
  These scenarios are proposed for future coverage and are not automated yet.

  # === FUNCTIONAL SCENARIOS (STEP DEFINITIONS DRAFTED) ===

  Scenario: Verify journey planning for different travel modes
    Given I am on the TfL Journey Planner page
    When I select "Public transport" mode
    And I plan a journey from "Leicester Square" to "Covent Garden" using autocomplete suggestions
    Then I should see journey results for public transport

  Scenario: Verify leaving at specific date and time
    Given I am on the TfL Journey Planner page
    When I choose a future date and time
    And I plan a journey from "Leicester Square" to "Covent Garden" using autocomplete suggestions
    Then the results should reflect the chosen date and time

  Scenario: Verify accessibility options affect results
    Given I am on the TfL Journey Planner page
    When I enable step-free access
    And I plan a journey from "Leicester Square" to "Covent Garden" using autocomplete suggestions
    Then the results should show step-free routes

  Scenario: Verify input sanitization for special characters
    Given I am on the TfL Journey Planner page
    When I enter invalid locations with special characters and plan a journey
    Then I should see an error or no results message

  Scenario: Verify responsive layout on mobile viewport
    Given I am on the TfL Journey Planner page
    When I resize the browser to a mobile viewport
    Then the journey planner form should remain usable

  # === FUNCTIONAL SCENARIOS (IDEAS ONLY) ===

  Scenario: Plan journey with different travel modes (Public transport, Cycling, Walking)
    # Verify user can switch between travel modes and get appropriate results
    # Each mode should return relevant journey options

  Scenario: Plan journey with date and time preferences (Leaving vs Arriving)
    # Verify "Leaving" and "Arriving" options work correctly
    # Validate date picker allows future dates
    # Validate time selection affects results

  Scenario: Plan journey with accessibility preferences
    # Test "Full step-free access", "Step-free to platform only", etc.
    # Verify results respect accessibility filters

  Scenario: Plan journey with "Travel via" intermediate stop
    # Add intermediate station and verify route includes it

  Scenario: Plan journey outside London
    # Verify "Search outside London" works for destinations outside TfL network
    # May show different modes or external connections

  Scenario: Swap From and To locations
    # Use swap button if available - verify journey reverses correctly

  Scenario: Recent journeys and favourites
    # If logged in, verify recent journeys appear
    # Verify ability to save/favourite a journey

  Scenario: Plan journey with "Optimise for walking" preference
    # Verify route preference affects displayed options

  Scenario: Plan journey with maximum walking time limit
    # Set "I only want to walk for a maximum of X mins"
    # Verify results respect this constraint

  Scenario: Multi-modal journey (e.g. Tube + Bus)
    # Verify combined transport options display correctly

  # === NON-FUNCTIONAL SCENARIOS (IDEAS ONLY) ===

  Scenario: Page load performance
    # Verify Journey Planner widget loads within acceptable time (e.g. < 5 seconds)
    # Measure Time to Interactive

  Scenario: Responsive design on mobile viewport
    # Verify widget is usable on mobile (320px, 375px widths)
    # Touch targets appropriately sized
    # No horizontal scroll

  Scenario: Keyboard navigation and accessibility (a11y)
    # Tab through all interactive elements
    # Verify ARIA labels and roles
    # Screen reader compatibility
    # Focus visible on focusable elements

  Scenario: Autocomplete performance with slow network
    # Simulate 3G throttling - verify suggestions still appear
    # Appropriate loading indicators

  Scenario: Session/cookie handling
    # Verify preferences persist when "Save these preferences" is used
    # Test behaviour when cookies rejected

  Scenario: Error recovery
    # Verify clear error messages on API failures
    # Retry mechanisms for transient errors

  Scenario: Concurrent users / load
    # Load test the journey planning API
    # Verify response times under load

  Scenario: Cross-browser compatibility
    # Verify widget works in Chrome, Firefox, Safari, Edge
    # Consistent behaviour across browsers

  Scenario: Security - XSS and input sanitization
    # Enter script tags in From/To fields
    # Verify no script execution

  Scenario: Localization (if applicable)
    # Check for language options
    # Verify date/time formats
