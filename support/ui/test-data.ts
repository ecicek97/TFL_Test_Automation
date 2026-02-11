/**
 * Centralized test data configuration
 * Stores all test inputs, expected values, and test-specific data
 */

export const TestData = {
  // Valid journey locations
  validLocations: {
    leicesterSquare: {
      searchText: 'Leicester Square',
      fullName: 'Leicester Square Underground Station',
    },
    coventGarden: {
      searchText: 'Covent Garden',
      fullName: 'Covent Garden Underground Station',
    },
  },

  // Invalid locations for negative testing
  invalidLocations: {
    from: 'xyzinvalid123nonexistent',
    to: 'abcnonexistent456place',
  },

  // Button/Link text
  buttons: {
    editPreferences: 'Edit preferences',
    updateJourney: 'Update journey',
    viewDetails: 'View details',
  },

  // Options
  preferences: {
    leastWalking: 'Routes with least walking',
  },

  // Expected station information
  stations: {
    coventGarden: {
      name: 'Covent Garden Underground Station',
      expectedAccessInfo: ['access', 'lift', 'escalator', 'stairs', 'step-free'],
    },
  },
};

/**
 * Helper function to get station information by name
 * @param name - Station name (e.g., "Leicester Square" or "Covent Garden")
 * @returns Object with searchText and fullName for the station
 */
export function getStationInfo(name: string) {
  const normalized = name.toLowerCase().replace(/\s+/g, '');

  if (normalized.includes('leicester')) {
    return TestData.validLocations.leicesterSquare;
  }

  if (normalized.includes('covent')) {
    return TestData.validLocations.coventGarden;
  }

  // Fallback for other stations not in test data
  return {
    searchText: name,
    fullName: `${name} Underground Station`,
  };
}

export default TestData;
