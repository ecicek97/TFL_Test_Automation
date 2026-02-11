# TfL Journey Planner – Test Automation Framework

**STA Coding Challenge – Senior Test Analyst Role**  
Automated UI tests for the TfL (Transport for London) Journey Planner widget at [https://tfl.gov.uk/plan-a-journey](https://tfl.gov.uk/plan-a-journey).

## Challenge Requirements Compliance

✅ **Language:** TypeScript  
✅ **Gherkin Syntax:** All scenarios written in Cucumber/Gherkin  
✅ **UI Automation:** Playwright with Chromium  
✅ **5 Minimum Scenarios:** All required test scenarios implemented and passing  
✅ **Public Repository:** Hosted on GitHub  
✅ **README:** Development decisions documented  
✅ **AI Disclaimer:** Included below

---

## Tech Stack

- **Language:** TypeScript
- **UI Automation:** Playwright
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
# Run all journey planner tests (headless)
npm test

# Run with browser visible
npm run test:headed

# Run with HTML/JSON reports
npm run test:report
```

Reports are written to `reports/` (HTML, JSON, screenshots on failure).

---

## Project Structure

```
TFL_TestAutomation/
├── features/
│   ├── journey-planner.feature    # 5 automated scenarios
│   └── additional-scenarios.feature  # Extra scenarios (documentation only)
├── step-definitions/
│   └── journey-planner.steps.ts   # Step implementations
├── pages/
│   └── JourneyPlannerPage.ts      # Page Object for Journey Planner
├── support/
│   ├── world.ts                   # Cucumber world (browser setup)
│   ├── hooks.ts                   # Before/After hooks
│   └── ensure-reports-dir.ts      # Report directory setup
├── reports/                       # Generated reports
├── cucumber.js                    # Cucumber config
├── playwright.config.ts           # Playwright config
├── tsconfig.json
├── package.json
└── README.md
```

---

## Implemented Scenarios (5 Minimum - Per Challenge Requirements)

The framework implements the exact scenarios specified in the STA Coding Challenge:

1. **Verify that a valid journey can be planned using the widget** – From "Leicester Square Underground Station" to "Covent Garden Underground Station" using autocomplete suggestions (not entering complete text). Validates results for both walking and cycling time.

2. **Edit preferences, select routes with least walking, and validate journey time** – Once journey is planned, clicks "Edit preferences", selects "Routes with least walking", updates journey, and validates the journey time is displayed.

3. **Click on "View Details" and verify complete access information** – Opens "View Details" after journey planning and verifies complete access information at Covent Garden Underground Station.

4. **Verify that the widget does not provide results when an invalid journey is planned** – Tests with 1 or more invalid locations entered into the widget and expects no valid results.

5. **Verify that the widget is unable to plan a journey if no locations are entered** – Attempts to plan a journey without entering any locations and verifies the widget cannot plan.

---

## Additional Scenarios (Documentation Only)

See `features/additional-scenarios.feature` for extra functional and non-functional ideas, including:

- Travel modes (public transport, cycling, walking)
- Date/time preferences (leaving vs arriving)
- Accessibility options
- Performance and load
- Responsive and cross-browser behaviour
- Security (e.g. input sanitisation)
- Keyboard navigation and accessibility (a11y)

---

## Development Decisions

### TypeScript + Playwright

- TypeScript for type safety and maintainability.
- Playwright for fast, stable UI tests with built-in waits, auto-retry, and strong debugging support.

### Gherkin / Cucumber

- Scenarios written in natural language.
- Shared vocabulary for BAs, developers, and QA.
- Easy to add more scenarios without changing step logic.

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
- **Cookies:** TfL may show cookie banners; the framework attempts to accept them.
- **Rate limiting:** Frequent runs may be affected by TfL’s rate limiting.
- **Invalid journey behaviour:** Exact error messaging may differ; assertions are kept flexible.

---

## AI Disclaimer

**Use of AI:**  
This project was developed with assistance from AI tools (including code generation and refactoring). All code has been reviewed and adapted for correctness, maintainability, and alignment with the requirements. Tests have been designed to be robust and maintainable.

---

## License

ISC
