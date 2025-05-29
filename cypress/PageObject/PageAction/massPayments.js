export class massPayments {

    gotoFileUpload(){
        cy.get('#rc-tabs-0-tab-\\/payments\\/batch-payments').should('be.visible').should('contain.text','Batch Payments').click()
        cy.get('body > div:nth-child(2) > section:nth-child(1) > main:nth-child(2) > div:nth-child(2) > div:nth-child(1) > div:nth-child(1) > div:nth-child(2) > div:nth-child(1) > div:nth-child(1) > div:nth-child(2)')
        .should('be.visible').should('contain.text','File Upload').click()
        cy.get('.ant-typography.medium.dark-green.fs-28px').should('be.visible').should('contain.text','File Upload')
    }
    gotoTemplateCurrency(currency, CCYHeading){
        cy.get('.ant-select-selector').should('be.visible').click().type(currency)
        cy.get("span[class='ant-select-selection-item'] div[class='ant-space ant-space-horizontal ant-space-align-center']").should('contain.text',CCYHeading)
    }
    downloadTemplate(){
        cy.get('[style="padding-left: 5px; padding-right: 5px;"] > .ant-btn').should('be.enabled').click()
    }
    guidenavigation() {
        cy.get('.ant-spin-dot.ant-spin-dot-spin').should('not.exist') 
        cy.get('a:has(.ant-btn)') // Select the <a> that contains the button
    .should('be.visible')
    .should('contain.text', 'Completing the file upload template')
    .then($a => {
      const url = $a.attr('href'); // Correctly get href from <a>
      expect(url).to.include('https://volopa.com/docs'); // Validate it

      // Optional: Visit the URL to validate the page
      cy.visit(url);
    });
    }
    fileUploader(){
        cy.get('.ant-spin-dot.ant-spin-dot-spin').should('not.exist') 
        cy.get('.ant-upload-drag-container > .ant-row > :nth-child(2)').should('be.visible').should('contain.text','Click or drag file to this area to upload')
    }
    deleteUploadedFile(){
        cy.get('.ant-upload-list-item-name').should('be.visible')
        cy.get('button[title="Remove file"]').click()
        //cy.get('body > div:nth-child(2) > section:nth-child(1) > main:nth-child(2) > div:nth-child(1) > div:nth-child(1) > div:nth-child(3) > div:nth-child(4) > div:nth-child(2) > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > button:nth-child(1)').should('be.disabled')
    }
    gotoFilesinProgress(){
        cy.get('.ant-row-end > .ant-col > .ant-btn').should('be.visible').should('contain.text','Files in Progress').click()
        cy.get('.ant-modal-body').should('be.visible')
        cy.get(':nth-child(2) > :nth-child(1) > [data-testid="container"] > .ant-card-body > :nth-child(1) > .ant-col').should('contain.text','Files in Progress')
    }
    navigatingBackFromFip(){
        cy.get('.ant-modal-close-x').should('be.visible').click()
        cy.get('.ant-card-body > :nth-child(1) > .ant-col > .ant-typography').should('be.visible').should('contain.text','File Upload')
    }
    deleteFip(){
        cy.get('tbody tr:nth-child(2) td:nth-child(5) div:nth-child(1) div:nth-child(2) button:nth-child(1)').should('be.visible').first().click()
        cy.get('div[class="ant-modal"] div[class="ant-modal-body"]').should('be.visible')
        cy.get('.ant-modal-body > :nth-child(1) > .ant-col > .ant-typography').should('contain.text','Are you sure you wish to delete this file?')
        cy.get('.m-t-20 > .ant-col > .dark-green').should('contain.text','All progress will be lost if you delete a file that has been uploaded or is currently in progress')
        cy.get('button[class="ant-btn ant-btn-primary ant-btn-dangerous"]').should('be.visible').should('be.enabled').click()
        cy.get('.ant-notification-notice').should('be.visible').should('contain.text','File successfully deleted.')
    }
    reviewFile(){
        cy.get(':nth-child(4) > .ant-card > .ant-card-body > .ant-row > .ant-col > .ant-btn').should('be.visible').click()
        cy.get('.ant-typography.dark-green.fs-30px').should('not.exist')
        cy.get(':nth-child(1) > .ant-col > .ant-typography').should('be.visible').should('contain.text','File Summary')
    }
    validateValidFile(){
        cy.get('.ant-spin-container > :nth-child(8)').should('be.visible').should('contain.text','Errored Payments - 0')
        cy.get(':nth-child(2) > .ant-btn').should('be.visible').should('be.enabled')
    }
    goToError(){
        cy.get('div:nth-child(9)').should('be.visible').should('contain.text','Click here to view which rows these errors occured on')
        cy.get('.underline').should('be.visible').should('contain.text','Click here').click()
    }
    hardcodederrorsforInvalidFile(){
        //wrong Settlment method
        cy.get('.ant-table-row > :nth-child(4)').should('be.visible').should('contain.text','regular')
        cy.get('.ant-table-row > :nth-child(5)').should('be.visible').should('contain.text', "Invalid settlement method 'regular'. Allowed: priority")
        // missing settlement method
        cy.get(':nth-child(3) > :nth-child(5)').should('be.visible').should('contain.text', 'Settlement method is required.')
        //invalid settlment method
        cy.get(':nth-child(4) > :nth-child(5)').should('be.visible').should('contain.text', "Invalid settlement method 'funky'. Allowed: priority")

        //missing payment reason
        cy.get(':nth-child(5) > :nth-child(5)').should('be.visible').should('contain.text', 'Payment reason is required and cannot exceed 255 characters.')
        //missing payment refrence
        cy.get(':nth-child(6) > :nth-child(5)').should('be.visible').should('contain.text', 'Payment reference is required and cannot exceed 255 characters.')
        //invalid amount format
        cy.get(':nth-child(7) > :nth-child(5)').should('be.visible').should('contain.text', 'The payment amount field format is invalid.')
        //invalid client payee id
        cy.get(':nth-child(8) > :nth-child(5)').should('be.visible').should('contain.text', 'The client payee ID must be alphanumeric.')
        //invalid recipient id
        cy.get(':nth-child(9) > :nth-child(5)').should('be.visible').should('contain.text', 'Invalid recipient ID')
        // recipient with different currency of same client
        cy.get(':nth-child(10) > :nth-child(5)').should('be.visible').should('contain.text', "Recipient ID 19113 has currency 'EUR', but the payment file expects 'GBP'.")

    }
    emptyRecordValidation(){
        cy.get(':nth-child(4) > .ant-col > .ant-typography').should('be.visible')
        cy.get('.underline').click()
        cy.get('.ant-table-row > :nth-child(5)').should('be.visible').should('contain.text', 'CSV file contains invalid recipient_id or empty record found at row:')
    }
    emptyFileValidation(){
        cy.get(':nth-child(4) > .ant-col > .ant-typography').should('be.visible')
        cy.get('.underline').click()
        cy.get('.ant-table-row > :nth-child(5)').should('be.visible').should('contain.text', 'CSV file is empty or contains no valid data.')
    }
    ammededFileHeader(){
        cy.get(':nth-child(4) > .ant-col > .ant-typography').should('be.visible')
        cy.get('.underline').click()
        cy.get('.ant-table-row > :nth-child(5)').should('be.visible').should('contain.text', 'CSV headers do not match expected format.')
    }
    currencyMismatchValidation(){
        cy.get(':nth-child(4) > .ant-col > .ant-typography').should('be.visible')
        cy.get('.underline').click()
        cy.get('.ant-table-row > :nth-child(5)').should('be.visible').should('contain.text', 'Recipient currency does not match the payment file currency (GBP) at row:')
    }
    validateAEAED(){
        cy.get('.ant-table-row > :nth-child(5)').should('be.visible').should('contain.text', "Invalid purpose of payment code 'AAA' for recipient bank country: AE.")
        cy.get(':nth-child(3) > :nth-child(5)').should('be.visible').should('contain.text', 'Purpose of payment code is required for recipient bank country: AE.')
    }
    validateInrErrors(){
        cy.get('.ant-table-row > :nth-child(5)').should('be.visible').should('contain.text', 'Invoice number is required for trade-related purpose of payment code.')
        cy.get(':nth-child(3) > :nth-child(5)').should('be.visible').should('contain.text', 'Invoice date is required for trade-related purpose of payment code.')
        cy.get(':nth-child(4) > :nth-child(5)').should('be.visible').should('contain.text', 'Invoice date must be in YYYY-MM-DD format and is required when the currency is INR.')
        cy.get(':nth-child(5) > :nth-child(5)').should('be.visible').should('contain.text', 'Purpose of payment code is required for currency INR.')
        cy.get(':nth-child(6) > :nth-child(5)').should('be.visible').should('contain.text', "Invalid purpose of payment code 'wrong' for recipient currency: INR.")
        cy.get(':nth-child(7) > :nth-child(5)').should('be.visible').should('contain.text', 'Amount exceeds the INR 1,500,000 limit per invoice for trade-related transactions.')
    }
    validateCNYerrors(){
        cy.get('.ant-table-row > :nth-child(5)').should('be.visible').should('contain.text', 'Purpose of payment code is required for currency CNY.')
        cy.get(':nth-child(3) > :nth-child(5)').should('be.visible').should('contain.text', "Invalid purpose of payment code 'AAA' for recipient currency: CNY.")
    }
    validateSGDerror(){
         cy.get('.ant-table-row > :nth-child(5)').should('be.visible').should('contain.text', 'Payment amount exceeds SGD limit of 200,000')
    }
    validateTRYerror(){
        cy.get('.ant-table-row > :nth-child(5)').should('be.visible').should('contain.text', 'Payment amount exceeds TRY limit of 5,000,000')
    }
    returnFromErrorList(){
        cy.get('a > .ant-btn').should('be.visible').should('be.enabled').click()
        //cy.get(':nth-child(4) > .ant-col').should('be.visible').should('contain.text','File Summary')
    }
    disableProceedButton(){
        cy.get('.ant-tooltip-disabled-compatible-wrapper').should('exist')
    }
    proceedFlow(fundingCCY,CCYHeading){
        

        cy.get(':nth-child(2) > .ant-btn').should('be.visible').should('be.enabled').click()
        cy.get(':nth-child(1) > .ant-col > .ant-typography').should('be.visible').should('contain.text','File Review')
        cy.get('[style="padding-left: 10px; padding-right: 10px; flex: 0 0 220px;"] > .ant-typography').should('be.visible').should('contain.text','Select Funding Currency')
        cy.get('.ant-select-selector').should('be.visible').click()
        cy.get('.ant-select-selector').eq(0).click().wait(5000).type(fundingCCY)
        cy.get("span[class='ant-select-selection-item'] div[class='ant-space ant-space-horizontal ant-space-align-center']").should('contain.text',CCYHeading)
        cy.get('.ant-spin-dot.ant-spin-dot-spin').should('not.exist')
        cy.get('[style=""] > .ant-typography').should('be.visible').should('contain.text','You Send Us')
        
    }
    payRecipients(){
        cy.get(':nth-child(2) > .ant-btn').should('be.visible').should('be.enabled').click()
        cy.get('span[class="ant-typography fs-28px dark-green medium"]').should('be.visible').should('contain.text','Payments Booked - Pending Funds')
        cy.get('div[class="ant-card ant-card-bordered bg-light-grey m-t-10"] div[class="ant-card-body"]').should('be.visible')
    }
    selectCollectionFundingMethod(){
        cy.get(':nth-child(3) > .ant-btn').should('be.visible').should('contain.text','Collections Account').click()
        cy.wait(4000)
    }
    selectEasyTransferFundingMethod(){
        cy.get('[style="margin-left: -2.5px; margin-right: -2.5px; row-gap: 20px;"] > :nth-child(2) > .ant-btn').should('contain.text','Easy Transfer').click()
        cy.wait(4000)
    }
    goToPaymentHistory(){
        cy.get('body > div:nth-child(2) > section:nth-child(1) > main:nth-child(2) > div:nth-child(1) > div:nth-child(1) > div:nth-child(9) > div:nth-child(1) > a:nth-child(1) > button:nth-child(1)').should('be.enabled').click()
        cy.get('.ant-spin-dot').should('not.exist')
    }
    validateYapilyFlow(){
        //cy.get('.ant-row-center.m-t-20 > .ant-col > .ant-space > :nth-child(1) > .ant-btn').click() //fund via asy transfer btn
        cy.get('.header-logo.header-logo--rectangle').should('contain','Choose your bank:')
        cy.get('[data-testid="search-input"]').type('Modelo Sandbox') // search feild
        cy.get('.institution-card-hover').click()
        cy.wait(2000)
        cy.get('[data-testid="footer-continue-button"]').click()
        cy.get('[data-testid="header-title"]').should('contain','Approve your payment')
        cy.get('[data-testid="auth-continue-to-bank"]').invoke('attr', 'target', '_self').click();
    
        cy.get('.ozone-heading-1').should('have.text','Model Bank')
        cy.get('.ozone-heading-3').should('have.text','Please enter your login details to proceed')
        cy.get(':nth-child(1) > .ozone-input').type('mits')
        cy.get('#passwordField').type('mits')
        cy.get('#loginButton').click({force:true})
        cy.get('.ozone-pis-heading-1').should('have.text','Single Domestic Payment Consents (PIS)')
        cy.get("#radio-10000109010102").click()
        cy.get('#confirmButton').click({force:true})
        cy.wait(5000)
        cy.get('[class="ant-typography muli semi-bold fs-24px purple"]').should('contain.text','Funds could take up to 2 hours to be posted.')
        cy.get('.ant-spin-dot').should('not.exist')
        cy.get(':nth-child(2) > .ant-btn').click()      
    }

}