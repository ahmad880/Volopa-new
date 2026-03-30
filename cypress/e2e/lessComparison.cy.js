/// <reference types="cypress" />

import { SigninPage } from "../PageObject/PageAction/SigninPage";
import { FundingHistory } from "../PageObject/PageAction/FundingHistory";

const signin = new SigninPage();
const fundingHistory = new FundingHistory();

describe('Funding History – LESS / Color Visual Regression', function () {

  const userName = 'testnew@volopa.com';
  const password = 'testTest1@';

  const BASELINE_URL = 'https://webapp01.mybusiness.volopa-dev.com/';
  const DEPLOYED_URL = 'https://webapp04.mybusiness.volopa-dev.com/';

  const fundingHistoryTab = "[id='rc-tabs-0-tab-/wallet/funding-history']";

  /**
   * Login and navigate to Funding History page
   */
  const loginAndOpenFundingHistory = (url) => {
    // Clear old sessions
    cy.clearCookies();
    cy.clearLocalStorage();
    cy.window().then((win) => {
      win.sessionStorage.clear();
    });

    // Visit the URL
    cy.visit(url);

    // Login every time
    signin.Login(userName, password);

    // Set viewport
    cy.viewport(1440, 1000);

    // Wait for funding history tab to appear & click it
    cy.get(fundingHistoryTab, { timeout: 30000 })
      .should('be.visible')
      .click();

    // Wait for Funding History page to fully load
    cy.url().should('include', '/wallet/funding-history');

    // Wait for a key table or list to render (replace selector with actual table/list)
    //cy.get('table.funding-history-table', { timeout: 30000 }).should('be.visible');

    // Ensure any dynamic styles or LESS are applied
    cy.wait(1000); // minimal wait if necessary
  };

  it('should match Funding History colors between baseline and deployed apps', () => {

    // ================= BASELINE =================
    loginAndOpenFundingHistory(BASELINE_URL);

    // Create / validate baseline snapshot
    cy.matchImageSnapshot('funding-history-less-baseline');

    // ================= DEPLOYED =================
    loginAndOpenFundingHistory(DEPLOYED_URL);

    // Compare deployed UI against baseline snapshot
    cy.matchImageSnapshot('funding-history-less-baseline');
  });
});
