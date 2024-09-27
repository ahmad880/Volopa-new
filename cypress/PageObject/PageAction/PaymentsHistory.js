const variable = require('../PageElements/PaymentsHistory.json')

export class PaymentsHistory {
  goToPaymentsHistory(){
    cy.get(variable.paymentsHistoryPageLocators.paymentsHistoryHeader).should('be.visible').click()
    cy.get(variable.paymentsHistoryPageLocators.paymentsHistoryHeading).should('contain.text','Payment History')
  }
  validateSearchBar(name){
    cy.get(variable.paymentsHistoryPageLocators.loadingIcon).should('not.exist')
    cy.get(variable.paymentsHistoryPageLocators.SearchBar).should('exist').type(name)
    
  }
  validatePagination(){
    cy.get(variable.paymentsHistoryPageLocators.loadingIcon).should('not.exist')
      const isNextButtonEnabled = () => {
         return cy.get(variable.paymentsHistoryPageLocators.nextPageArrow).then($button => {
          return !$button.prop('disabled');
        });
        };
      
        // Loop until the "Next" button is disabled
      const validatePages = () => {
      isNextButtonEnabled().then(enabled => {
         if (enabled) {
            // Perform validations specific to each page
            // For example, assert that certain elements exist or have specific content
            cy.get(variable.paymentsHistoryPageLocators.rowFirst).eq(0).should('exist')
            // Click the "Next" button
            cy.get(variable.paymentsHistoryPageLocators.nextPageArrow).click();
            cy.get(variable.paymentsHistoryPageLocators.loadingIcon).should('not.exist')
            // Wait for the page to load (adjust as needed)
            //cy.wait(1000); // Adjust the wait time as needed
        
            // Recursively call the function to validate the next page
            validatePages();
          } 
          else {
            // Assert that the "Next" button is now disabled
            cy.get(variable.paymentsHistoryPageLocators.nextPageArrow).should('be.disabled')
      
            // Assert any element on the last page to confirm arrival (optional)
            // cy.get('.last-page-element').should('exist'); // Replace with actual selector for element on last page
          }
        });
      };
        
      // Start validating pages
    validatePages();
  }
  validatePaginationFilters(filter){
    cy.get(variable.paymentsHistoryPageLocators.loadingIcon).should('not.exist')
    cy.get(variable.paymentsHistoryPageLocators.pageFilters).click()
    cy.contains(filter).click()
  }
  validateDefaultPaginationFilter(filter){
    cy.get(variable.paymentsHistoryPageLocators.loadingIcon).should('not.exist')
    cy.get(variable.paymentsHistoryPageLocators.defaultPagination).should('contain.text', filter)
  }
  validateRows(row){
    cy.get(variable.paymentsHistoryPageLocators.loadingIcon).should('not.exist')
    cy.get(variable.paymentsHistoryPageLocators.allRows).should('have.length', row)
  }
  validateRepeatBtn(){
    cy.get(variable.paymentsHistoryPageLocators.repeatBtn).should('be.visible').click()
    cy.get(variable.paymentsHistoryPageLocators.repeatYesBtn).should('be.visible').click()
    cy.get(variable.paymentsHistoryPageLocators.createPaymentHeading).should('contain.text','Create a Payment')
  }
  goToDraftPayments(){
    cy.get(variable.paymentsHistoryPageLocators.draftPaymentsBtn).should('be.visible').click()
    cy.get(variable.paymentsHistoryPageLocators.draftPaymentsHeading).should('contain.text','Draft Payments')
  }
  goToReviewPayments(){
    cy.get(variable.paymentsHistoryPageLocators.reviewBtn).eq(1).should('be.visible').click()
    cy.get(variable.paymentsHistoryPageLocators.paymentConfirmation).should('contain.text','Payment Confirmation')
  }
  goToDraftPaymentsDashboard(){
    cy.get(variable.paymentsHistoryPageLocators.returnPaymentDashboard).should('be.visible').click()
    cy.get(variable.paymentsHistoryPageLocators.draftPaymentsHeading).should('contain.text','Draft Payments')
  }
  goToDeleteDreft(){
    cy.get(variable.paymentsHistoryPageLocators.draftPaymentsBtn).should('be.visible')
  }
  goToPaymentsHistoryBtn(){
    cy.get(variable.paymentsHistoryPageLocators.paymentsHistoryBtn).should('be.visible').click()
    cy.get(variable.paymentsHistoryPageLocators.paymentsHistoryHeading).should('contain.text','Payment History')
  }
  goToManualTrade(){
    cy.get(variable.paymentsHistoryPageLocators.loadingIcon).should('not.exist')
    cy.get(variable.paymentsHistoryPageLocators.manualTradeBtn).should('be.visible').click()
    cy.get(variable.paymentsHistoryPageLocators.manualTradeHeading).should('be.visible').should('contain.text','Manual Trade History')
  }
  goToSpecificManualTrade(){
    cy.get(variable.paymentsHistoryPageLocators.rowFirst).eq(0).should('be.visible').click()
    cy.get(variable.paymentsHistoryPageLocators.specificManualTradeHeading).should('be.visible').should('contain.text','Specific Manual Trade History')
  }
  validateDownloadPDF(){
    cy.get(variable.paymentsHistoryPageLocators.loadingIcon).should('not.exist')
    cy.get('.ant-row-end > .ant-btn').click()
  }
}