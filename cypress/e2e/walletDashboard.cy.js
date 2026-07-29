/// <reference types = "cypress"/>

import { SigninPage } from "../PageObject/PageAction/SigninPage"
import { WalletDashboard } from "../PageObject/PageAction/WalletDashboard"
import { FundWallet } from "../PageObject/PageAction/FundWallet"

const signin = new SigninPage
const walletpage = new WalletDashboard
const fundWallet = new FundWallet

describe('WalletDashboard',function(){
    let userName = 'testnew@volopa.com'
    let password = 'testTest1@'
    beforeEach(() => {
        cy.window().then((win) => {
            win.localStorage.clear();
            win.sessionStorage.clear();
        });
        cy.visit('https://webapp02.mybusiness.volopa-dev.com/') 
        signin.Login(userName, password)
        cy.viewport(1440,1000)
    })

    it('TC_WD_001 - validate All content on the dashboard page', function(){
        walletpage.validateAllContentOnDashbordPage()
    })
    it('TC_WD_002 - Validate "Total Companay Balance" on dashboard', function(){
        walletpage.validateCardtotalBalance()
    })
    it('TC_WD_003 - Validate that clicking on card balance naviagte the user to card section', function(){
        walletpage.clickOnCardBalanceAndValidate()
    })
    it('TC_WD_004 -Validate "Rate Checker"  from Wallet dashboard', function(){
        walletpage.validateRateChecker()
    })
    it('TC_WD_005 -validate that clicking on "Mark all as read" from recent activities marks all as read', function(){
        walletpage.validateMarkAsRead()
        walletpage.validateRateChecker()
    })
    it('TC_WD_006 -Validate that clicking on "show all" from wallet breakdown expands the table with more currencies', function(){
        walletpage.clickOnShowAll()
    })
    it('TC_WD_007 - Validate the user can repeat recent transactions as Manual Push Funds from wallet dashboard', function () {
        fundWallet.goTOFundWalletPage();
        fundWallet.fund_manual_pushGBP();
      
        cy.wait(5000);
      cy.get('[data-testid="fh-return-btn"]').should('be.visible').should('contain.text', 'Return').click();
      cy.get('[data-testid="wallet-dashboard-tab"]').click();
      cy.reload()

        // Wait for table to be visible
        cy.get('[data-testid="wd-transaction-row"]').should('be.visible');
        
        // Click on repeat button for 'Manual Push Funds'
        cy.get('@manualamount').then((manualAmount) => {
  const amount = manualAmount.match(/\d+(\.\d+)?/)[0];

  cy.get('[data-row-key="0"]')
    .should('contain.text', 'Manual Push Funds')
    .should('contain.text', amount)
    .find('[data-testid="wd-repeat-transaction-btn"]')
    .click();


      
          // Confirm repeat
          cy.get('[data-testid="wd-repeat-confirm-btn"]').click();
      
          // Verify confirmation header
          cy.get('.ant-spin-container > :nth-child(1) > .ant-col > .ant-typography')
            .should('have.text', 'Funding Confirmation');
      
          // Capture the amount shown
          cy.get('[data-testid="funding-amount-pf-value-repeat"]')
            .invoke('text')
            .then((text) => {
              const amount = text.trim().replace(/USD/g, '');
              cy.log(`Manual Amount: ${amount}`);
              cy.wrap(amount).as('manualamount');
            });
      
          // Submit the repeat funding
          cy.get('[data-testid="repeat-pf-confirm-btn"]')
            .first()
            .should('be.visible')
            .click();
      
          cy.wait(2000);
      
          cy.get('[data-testid="repeat-funding-status-text"]')
            .first()
            .invoke('text')
            .then((text) => {
              expect(text.trim()).to.be.oneOf([
                'Funding Complete',
                'Pending Funds',
                'Limits Authorization Failed',
              ]);
            });
      
          // Click "Done" or return to dashboard 
          cy.get('[data-testid="wd-dashboard-btn"]')
            .click();
      
          cy.wait(3000);
      
          // Navigate to transaction history
          cy.get('[data-testid="nav-transaction-history"]')
            .click();
      
          cy.get('[data-testid="transaction-history-heading"]')
            .should('have.text', 'Your Transaction History');
      
          // Click on details of second row transaction
          cy.get('[data-testid="fh-transaction-row"]')
            .first()
            .click();
      
          // Verify that the amount matches previous
          cy.get('@manualamount').then((manualamount) => {
            cy.get('[data-testid="transaction-detail-amount"]')
              .first()
              .invoke('text')
              .then((ele2) => {
                const val = ele2.trim();
                expect(val).to.contain(manualamount);
              });
          });
        });
      });
    it('TC_WD_008 -Validate the user can repeat recent transactions as Easy Transfer from wallet dashboard', function(){
        fundWallet.goTOFundWalletPage() 
        fundWallet.validate_Fund_Wallet('GBP{enter}')
        cy.get('[data-testid="yapily-return-to-dashboard"]').click()
        cy.wait(5000)
        cy.get('[data-testid="wd-transaction-row"]').should('be.visible').first().click()
        cy.get('.ant-table-row').should('be.visible')
        cy.get('[data-testid="wd-recent-tx-first-tab"]').contains('Easy Transfer').if().then(ele=>{
            ele.parents('.ant-table-row').find('[data-testid="wd-repeat-transaction-btn"]').click()
            cy.get('[data-testid="wd-repeat-confirm-btn"]').click()
            cy.wait(3000)
            walletpage.fundEasyTransfer()
        })
    })
    it('TC_WD_09 -Validate convert balance,fund card,fund wallet navigations from wallet dashboard', function(){
        walletpage.navigationChecking()
    })
})