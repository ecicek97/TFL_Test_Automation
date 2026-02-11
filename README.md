# TfL Journey Planner – Test Automation Framework

**STA Coding Challenge – Senior Test Analyst Role**  
Automated UI tests for the TfL (Transport for London) Journey Planner widget at [https://tfl.gov.uk/plan-a-journey](https://tfl.gov.uk/plan-a-journey).

## Challenge Requirements Compliance

✅ **Language:** TypeScript  
✅ **Gherkin Syntax:** All scenarios written in Cucumber/Gherkin  
✅ **UI Automation:** Playwright with Chromium  
✅ **API Automation:** Playwright API request context  
✅ **5 Minimum Scenarios:** All required test scenarios implemented and passing  
✅ **Public Repository:** Hosted on GitHub  
✅ **README:** Development decisions documented  
✅ **AI Disclaimer:** Included below

---

## Tech Stack

- **Language:** TypeScript
- **UI Automation:** Playwright
- **API Automation:** Playwright API request context
- **BDD:** Cucumber (Gherkin syntax)
- **Runtime:** Node.js

---

## Prerequisites

- Node.js 18+ 
- npm or yarn

---

## Installation

```bash
npm install
npx playwright install chromium
```

### Environment Configuration

Copy `.env.example` to `.env` and adjust if needed:

```bash
cp .env.example .env
```

| Variable | Description | Default |
|----------|-------------|---------|
| `BASE_URL` | TfL Journey Planner URL | `https://tfl.gov.uk/plan-a-journey` |
| `TFL_APP_ID` | (Optional) TfL API app ID | - |
| `TFL_APP_KEY` | (Optional) TfL API app key | - |
| `TEST_USERNAME` | (Optional) Test user for future login features | - |
| `TEST_PASSWORD` | (Optional) Test user password | - |

---

## Running Tests

```bash
# Run UI tests (headless)
npm test

# Run UI tests with browser visible
npm run test:headed

# Run API tests
npm run test:api

# Run UI tests with HTML/JSON reports
npm run test:report

# Advanced: Run with specific Cucumber profile
npx cucumber-js --profile ui    # UI tests
npx cucumber-js --profile api   # API tests
```

Reports are written to `reports/` (HTML, JSON, screenshots on failure).

---

## Project Structure

```
TFL_TestAutomation/
├── features/
│   ├── ui/
│   │   ├── journey-planner.feature    # 5 automated scenarios
│   │   └── additional-ui-scenarios.feature # Extra UI scenarios (documentation only)
│   └── api/
│       ├── openlibrary-api.feature    # Open Library API scenarios
│       └── additional-api-scenarios.feature # Extra API scenarios (documentation only)
├── step-definitions/
│   ├── ui/
│   │   └── journey-planner.steps.ts   # UI step implementations
│   └── api/
│       └── openlibrary-api.steps.ts   # API step implementations
├── pages/
│   └── JourneyPlannerPage.ts      # Page Object for Journey Planner
├── support/
│   ├── ui/
│   │   ├── world.ts               # UI Cucumber world (browser setup)
│   │   ├── hooks.ts               # UI hooks
│   │   └── test-data.ts           # UI test data
│   ├── api/
│   │   ├── world.ts               # API Cucumber world (request setup)
│   │   ├── hooks.ts               # API hooks
│   │   └── openlibrary-test-data.ts # API test data
│   └── ensure-reports-dir.ts      # Report directory setup
├── api-fixtures/
│   └── openlibrary/               # Baseline thumbnail images
├── reports/                       # Generated reports
├── cucumber.js                    # Cucumber config
├── playwright.config.ts           # Playwright config
├── tsconfig.json
├── package.json
└── README.md
```

---

## Implemented Scenarios (5 Minimum - Per Challenge Requirements)

The framework implements all 5 scenarios specified in the STA Coding Challenge:

1. **Valid journey planning using the widget** (Leicester Square → Covent Garden via autocomplete)
2. **Edit preferences and select routes with least walking**
3. **View Details and verify complete access information**
4. **Invalid journey handling** (widget does not provide results for invalid locations)
5. **Empty input validation** (widget cannot plan journey without locations)

See [features/ui/journey-planner.feature](features/ui/journey-planner.feature) for complete Gherkin scenarios and implementation details.

---

## Additional Scenarios (Documentation Only)

For API-related coverage candidates, see [features/api/additional-api-scenarios.feature](features/api/additional-api-scenarios.feature). Examples include:

- Content-type validation
- Bibkey filtering and missing key behavior
- Cache headers for thumbnails
- Preview and info URL reachability
- Thumbnail dimension checks

For UI-related functional and non-functional candidates, see [features/ui/additional-ui-scenarios.feature](features/ui/additional-ui-scenarios.feature). Examples include:

- Travel modes (public transport, cycling, walking)
- Date and time preferences (leaving vs arriving)
- Accessibility options
- Performance and load
- Responsive and cross-browser behavior
- Security (for example, input sanitization)
- Keyboard navigation and accessibility (a11y)

---

## Development Decisions

### Page Object Model (POM)

- `JourneyPlannerPage` encapsulates selectors and actions.
- Reduces duplication and isolates UI changes.
- Central place to maintain locators as the TfL site evolves.

### Selector Strategy

- Prefer `getByRole`, `getByText`, and semantic locators for resilience.
- Fallback to IDs/names where required (e.g. `#InputFrom`, `#InputTo`).
- Timeouts tuned for TfL’s autocomplete and AJAX behaviour.

### Autocomplete Handling

- Type partial text (e.g. “Leicester Square”) and wait for suggestions.
- Select from the suggestion list instead of entering full text.
- Uses flexible locators for different suggestion list structures.

### Error Handling

- Cookie banner handled via optional accept (does not fail if absent).
- Screenshots on failure for debugging.
- Fallbacks for varying page structure and messages.

### Reports

- Cucumber HTML and JSON reports.
- Failure screenshots in `reports/screenshots/`.

---

## Known Considerations

- **TfL UI changes:** Selectors may need updates if the Journey Planner layout changes.
- **Cookies:** TFL may show cookie banners; the framework attempts to accept them.
- **Rate limiting:** Frequent runs may be affected by TfL’s rate limiting.
- **Invalid journey behaviour:** Exact error messaging may differ; assertions are kept flexible.
- **Open Library API data drift:** If the API returns different metadata or new thumbnails, update the baseline images in `api-fixtures/openlibrary` and expected values in `support/api/openlibrary-test-data.ts`.

---

## Open Library API Tests

The API scenarios validate:

- Response status and timing
- Expected number of results
- Known book metadata for each bibkey
- Thumbnail URL validity and image content type
- Pixel-level thumbnail comparison against stored baseline images in `api-fixtures/openlibrary`

---

## AI Disclaimer

**Use of AI:**  
This project was developed with assistance from AI tools.

---

## License

ISC
