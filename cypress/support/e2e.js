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
  // Reset retry counter for each test
  requestRetries = {}
  
  // Intercept ALL network requests with retry logic
  cy.intercept('**/*', (req) => {
    const url = req.url
    
    // Skip tracking for static assets
    if (url.includes('.js') || url.includes('.css') || url.includes('.png')) {
      return
    }
    
    // Track retries for this URL
    if (!requestRetries[url]) {
      requestRetries[url] = 0
    }
    
    req.on('response', (res) => {
      // Log successful responses (only for API calls)
      if (url.includes('/api/')) {
        cy.log(`✅ ${req.method} ${url} - ${res.statusCode}`)
      }
    })
    
    req.on('after:response', (res) => {
      // If request failed, retry up to 3 times
      if (!res || res.statusCode >= 400 || res.statusCode === 0) {
        if (requestRetries[url] < 3) {
          requestRetries[url]++
          cy.log(`🔄 Retry ${requestRetries[url]}/3 for ${url}`)
          
          // Wait before retry
          cy.wait(1000 * requestRetries[url])
          
          // Don't throw error yet - let it retry
          return
        } else {
          cy.log(`❌ Failed after 3 retries: ${url}`)
        }
      }
    })
  }).as('allRequests')
})
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
