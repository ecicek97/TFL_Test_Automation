module.exports = {
  default: {
    require: ['step-definitions/ui/**/*.ts', 'support/ui/**/*.ts'],
    requireModule: ['dotenv/config', 'ts-node/register'],
    format: ['progress', 'html:reports/cucumber-report.html', 'json:reports/cucumber-report.json'],
    formatOptions: { snippetInterface: 'async-await' },
    tags: 'not @manual',
    paths: ['features/ui/**/*.feature'],
  },
  ui: {
    require: ['step-definitions/ui/**/*.ts', 'support/ui/**/*.ts'],
    requireModule: ['dotenv/config', 'ts-node/register'],
    format: ['progress', 'html:reports/cucumber-report.html', 'json:reports/cucumber-report.json'],
    formatOptions: { snippetInterface: 'async-await' },
    tags: 'not @manual',
    paths: ['features/ui/**/*.feature'],
  },
  api: {
    require: ['step-definitions/api/**/*.ts', 'support/api/**/*.ts'],
    requireModule: ['dotenv/config', 'ts-node/register'],
    format: ['progress', 'html:reports/cucumber-report.html', 'json:reports/cucumber-report.json'],
    formatOptions: { snippetInterface: 'async-await' },
    tags: 'not @manual',
    paths: ['features/api/**/*.feature'],
  },
};
