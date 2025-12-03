const variable1= require('../PageElements/RecipientList.json')

export class RecipientList {
    goToRecipientListPage(){
        cy.get(variable1.recipientListPageLocators.recipientListHeader).should('be.visible').click()
        cy.get(variable1.recipientListPageLocators.recipientListPageHeading).should('contain.text','Recipient List')
    }
    validateSearchField(search){
        cy.get(variable1.recipientListPageLocators.searchField).should('be.visible').type(search)
    }
    validateAddRecipient(){
        cy.get(variable1.recipientListPageLocators.addRecipient).should('be.visible').click()
        cy.get(variable1.recipientListPageLocators.addRecipientPageHeading).should('contain.text','Recipient Details')
    }
    clickOnPayBtn(){
        cy.get(variable1.recipientListPageLocators.payBtn).should('be.visible').click()
        cy.get(variable1.recipientListPageLocators.newPaymentPageHeading).should('contain.text','Create a Payment')
    }
    validateRecipientCountry(){
        cy.get(variable1.recipientListPageLocators.individual).click()
        cy.get(variable1.recipientListPageLocators.recipientCountry).should('contain.text','Recipient Country')
    }
    addBankDetails(iban,swift){
        cy.get(variable1.recipientListPageLocators.iBAN).should('be.visible').type(iban)
        cy.get(variable1.recipientListPageLocators.sWIFT).should('be.visible').type(swift)
        cy.get(variable1.recipientListPageLocators.accNumber).click()
        cy.get(variable1.recipientListPageLocators.bankDetails).should('be.visible')
    }
    verifyRecipientCountryfield(){
        cy.get(variable1.recipientListPageLocators.firstName).type('QA Tester')
        cy.get(variable1.recipientListPageLocators.lastName).type('Individual Automation')
        cy.get(variable1.recipientListPageLocators.postcode).type('54000')
        cy.get(variable1.recipientListPageLocators.address).type('489 Avenue Louise Brussels 1050')
        cy.get(variable1.recipientListPageLocators.city).type('London')
        cy.get(variable1.recipientListPageLocators.submitBtn).click()
        cy.get(variable1.recipientListPageLocators.recipientCountryError).should('contain.text','Please select recipient country')
    }
    validateRecipientDetails(){
        cy.get(variable1.recipientListPageLocators.recipientListRows).eq(0).should('be.visible').click()
        cy.get(variable1.recipientListPageLocators.recipientDetailsPageHeading).should('contain.text','Recipient Details')
    }
    clickOnRemoveBtn(){
        cy.get(variable1.recipientListPageLocators.removeBtn).should('be.visible').click()
        cy.get(variable1.recipientListPageLocators.removeBtn1).should('be.visible').click()
    }
    validateVeiwHistoryBtn(){
        cy.get(variable1.recipientListPageLocators.veiwHistoryBtn).should('be.visible').click()
        cy.get(variable1.recipientListPageLocators.paymentHistoryPageHeading).should('contain.text','Payment History')
    }
    validatePagination(){        
        cy.get('.ant-select-selector').first().click();
            cy.contains('100 / page').click().wait(3000)

            const isNextButtonEnabled = () => {
            return cy.get(variable1.recipientListPageLocators.nextPageArrow).first().then($button => {
              return !$button.prop('disabled');
            });
          };
      
          // Loop until the "Next" button is disabled
          const validatePages = () => {
            isNextButtonEnabled().then(enabled => {
              if (enabled) {
                // Perform validations specific to each page
                // For example, assert that certain elements exist or have specific content
                cy.get(variable1.recipientListPageLocators.recipientListRows).eq(0).should('be.visible')
                // Click the "Next" button
                cy.get(variable1.recipientListPageLocators.nextPageArrow).first().should('be.visible').click();
        
                // Recursively call the function to validate the next page
                validatePages();
              } else {
                // Assert that the "Next" button is now disabled
                cy.get(variable1.recipientListPageLocators.nextPageArrow).first().should('be.disabled');
      
                // Assert any element on the last page to confirm arrival (optional)
               // cy.get('.last-page-element').should('exist'); // Replace with actual selector for element on last page
              }
            });
          };
        
          // Start validating pages
          validatePages();
    }
    validateDefaultPaginationFilter(){
        cy.get(variable1.recipientListPageLocators.defaultPagination).should('contain.text','100 / page')
    }
    validatePaginationFilters(filter){
        cy.get(variable1.recipientListPageLocators.pageFilters).first().click()
        cy.contains(filter).click()
    }
    deleteRecipient(){
        cy.get('[data-row-key="0"] > :nth-child(1)').click()
        cy.get(':nth-child(2) > .ant-btn').click()
        cy.get('.ant-popover-inner-content').should('be.visible')
        cy.get('.ant-popover-buttons > .ant-btn-primary').click()
       // cy.get("div[id='rc-tabs-0-tab-/payments/recipient-list']").click()
        cy.wait(4000)
    }
    individualRecipient(Name,country){
        cy.get(variable1.recipientListPageLocators.individual).click()
        cy.get(variable1.recipientListPageLocators.submitBtn).should('be.disabled')
        cy.get(variable1.recipientListPageLocators.firstName).type(Name)
        cy.get(variable1.recipientListPageLocators.lastName).type('Individual Automation')
        cy.get(variable1.recipientListPageLocators.address).type('489 Avenue Louise Brussels 1050')
        cy.get(variable1.recipientListPageLocators.city).type('London')
        cy.get(':nth-child(8) > .ant-col-xs-24 > .ant-form-item > .ant-row > .ant-form-item-label > .ant-form-item-required > .ant-typography').should('contain.text','Recipient Country')
        cy.get('#beneficiaryCountry').type(country)
    }
}