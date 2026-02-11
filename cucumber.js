module.exports = {
  default: {
    require: ['step-definitions/**/*.ts', 'support/**/*.ts'],
    requireModule: ['dotenv/config', 'ts-node/register'],
    format: ['progress', 'html:reports/cucumber-report.html', 'json:reports/cucumber-report.json'],
    formatOptions: { snippetInterface: 'async-await' },
    paths: ['features/journey-planner.feature'],
  },
};
