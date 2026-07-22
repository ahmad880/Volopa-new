// ***********************************************************
// This example support/e2e.js is processed and
// loaded automatically before your test files.
//
// This is a great place to put global configuration and
// behavior that modifies Cypress.
//
// You can change the location of this file or turn off
// automatically serving support files with the
// 'supportFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/configuration
// ***********************************************************

// Import commands.js using ES2015 syntax:
import './commands'
import 'cypress-if'
import 'cypress-mochawesome-reporter/register';
import 'cypress-real-events/support';
// Visual regression snapshot commands
import { addMatchImageSnapshotCommand } from '@simonsmith/cypress-image-snapshot/command';

// Intercept and retry failed network requests
let requestRetries = {}

Cypress.on('uncaught:exception', (err, runnable) => {
  // Prevent Cypress from failing on network errors
  if (err.message.includes('Network request failed') || 
      err.message.includes('fetch') ||
      err.message.includes('XMLHttpRequest') ||
      err.message.includes('ResizeObserver')) {
    return false
  }
})

beforeEach(() => {
  requestRetries = {};

  cy.intercept('**/*', (req) => {

    const url = req.url;

    if (
      url.endsWith('.js') ||
      url.endsWith('.css') ||
      url.endsWith('.png') ||
      url.endsWith('.jpg')
    ) {
      req.continue();
      return;
    }

    req.continue();

  });
});
// Alternatively you can use CommonJS syntax:
// require('./commands')
// Register visual regression snapshot command globally
addMatchImageSnapshotCommand({
  failureThreshold: 0.01, // 1% difference allowed
  failureThresholdType: 'percent',
  customDiffConfig: { threshold: 0.01 },
  capture: 'viewport', // capture full viewport
});
const app = window.top;
if (!app.document.head.querySelector('[data-hide-command-log-request]')) {
  const style = app.document.createElement('style');
  style.innerHTML =
    '.command-name-request, .command-name-xhr { display: none }';
  style.setAttribute('data-hide-command-log-request', '');

  app.document.head.appendChild(style);
}
Cypress.on('uncaught:exception', (err, runnable) => {
  // Returning false prevents Cypress from failing the test
  return false;
});
Cypress.on('uncaught:exception', (err, runnable) => {
  if (err.message.includes('addEventListener')) {
    return false; // Prevents test from failing
  }


});
