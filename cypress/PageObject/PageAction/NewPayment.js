const variable1= require('../PageElements/NewPayment.json')

export class NewPayment {
    goToNewPaymentPage(){
        cy.get(variable1.newPaymentPageLocators.newPaymentHeader).should('be.visible').click()
        cy.get(variable1.newPaymentPageLocators.createAPayment).should('contain.text','Create a Payment')
    }
    validateSearchField(search){
        cy.get(variable1.newPaymentPageLocators.searchField).should('be.visible').type(search)
        cy.get(variable1.newPaymentPageLocators.createAPayment).should('contain.text','Create a Payment')
    }
    validateAddRecipient(){
        cy.get(variable1.newPaymentPageLocators.searchField).should('be.visible').click()
        cy.get(variable1.newPaymentPageLocators.addRecipient).should('be.visible').click()
        cy.get(variable1.newPaymentPageLocators.addRecipientPageHeading).should('contain.text','Recipient Details')
    }
    selectCurrency(currency){
        cy.get(variable1.newPaymentPageLocators.enterPaymentDetailsHeading).should('contain.text','Enter Payment Details')
        cy.get(variable1.newPaymentPageLocators.selectCurrency).should('exist').click()
        cy.get('[src*="/static/media/'+currency+'"]').eq(0).should('be.visible').click()
        cy.get(variable1.newPaymentPageLocators.sendAmount).type('170')
    }
    checkFundingMethod(){
        cy.get(variable1.newPaymentPageLocators.fundingMethodHeading).should('contain.text','Funding Method')
        cy.get(variable1.newPaymentPageLocators.fundingMethodField).should('be.disabled')
    }
    validateFxRateTimer(){
        cy.get(variable1.newPaymentPageLocators.fxRateTimer).should('be.visible').should('contain.text','30s')
        cy.wait(30000)
        cy.get(variable1.newPaymentPageLocators.fxRateTimer).should('be.visible').should('contain.text','0s')
        cy.get(variable1.newPaymentPageLocators.fxRateTimer).should('be.visible').should('contain.text','30s')
    }
    validatePayTheRecipient(){
        cy.get('div[class="ant-select ant-select-in-form-item b-g ant-select-single ant-select-show-arrow ant-select-show-search"] div[class="ant-select-selector"]').should('be.visible').click()
        cy.get("div[title='Payment of Salaries']").click()
        cy.get('.m-t-20 > :nth-child(1) > .ant-card > .ant-card-body > :nth-child(1) > .ant-col > .ant-space > [style=""] > .ant-typography').should('contain.text','Payment Reference')
        cy.get('#paymentReference').should('be.visible').type('Single')
        cy.get('.ant-row-end.m-t-20 > .ant-col > .ant-btn').should('be.visible').click()//procee btn
        cy.get('.ant-typography.fs-24px.medium.dark-green').should('contain.text','Payment Confirmation') // confirmation msg
        cy.get("div[class='ant-row ant-row-center m-t-20'] div:nth-child(2) button:nth-child(1)").should('be.visible').click() //pay btn
        cy.get('.ant-typography.ant-typography-success.fs-24px.medium').should('contain.text',' Payment Booked - ') //Success msg
    }
    validateVeiwPayment(){
        cy.get('.ant-row-center.m-t-20 > .ant-col > .ant-space > :nth-child(1) > .ant-btn').click()//view payment
        cy.get(':nth-child(1) > .ant-col > .ant-typography').should('contain.text','Payment History')
    }
    validatePaymentHistory(){
        
    }
    checkSettelment(regular,priority){
        cy.get(variable1.newPaymentPageLocators.createAPaymentPageHeading).should('be.visible')
        cy.get(variable1.newPaymentPageLocators.settelmentRegular).should('be.visible').should(regular)
        cy.get(variable1.newPaymentPageLocators.settelmentPeriority).should('be.visible').should(priority)
    }
    proceedflow(fundingCCY,CCYHeading){
        cy.get(variable1.newPaymentPageLocators.loadingIcon).should('not.exist')
        cy.get('.ant-select-selector').eq(0).click().wait(5000).type(fundingCCY)
        cy.get("span[class='ant-select-selection-item'] div[class='ant-space ant-space-horizontal ant-space-align-center']").should('contain.text',CCYHeading)
        cy.get(variable1.newPaymentPageLocators.loadingIcon).should('not.exist')
    }
    addrecipientDetail(amount ,email){
        cy.get(variable1.newPaymentPageLocators.amount).type(amount)
        cy.get('#email').should('contain.value',email ,{force:true})
        //cy.get(variable1.newPaymentPageLocators.reasonForPaymentDropDown).eq(0).click()
        //cy.get(variable1.newPaymentPageLocators.selectReasonForPayment).eq(0).click({force:true})
        cy.get(variable1.newPaymentPageLocators.paymentReferences).type('Single')
    }
    iNRDetails(){
        cy.get(':nth-child(2) > .ant-col-xs-24 > :nth-child(1) > .ant-col > .ant-space > [style=""] > .ant-typography').should('be.visible').should('contain.text','Invoice Number')
        cy.get('#invoiceNumber').type('345210')
        cy.get('.ant-col-xs-24 > :nth-child(3) > .ant-col > .ant-space > [style=""] > .ant-typography').should('be.visible').should('contain.text','Invoice Date')
        //cy.get('#invoiceDate').type('2024-06-26')

        // Click the first date input to open calendar
    cy.get('input[placeholder="Select date"]').eq(0).click();

    // Select today's date from the calendar (this element usually has a special class)
    cy.get('.ant-picker-cell-today').click(); // Selects current date

    }
    selectFundingMethod(option) {
        // Ensure the page has loaded
        cy.get('.ant-row-space-between > :nth-child(1) > :nth-child(1) > .ant-col > .ant-space > [style=""] > .ant-typography')
            .should('contain.text', 'Funding Method');
        cy.get(variable1.newPaymentPageLocators.loadingIcon)
            .should('not.exist');
    
        // Open the dropdown
        cy.get(':nth-child(1) > :nth-child(2) > :nth-child(1) > .ant-form-item > .ant-row > .ant-col > .ant-form-item-control-input > .ant-form-item-control-input-content > .ant-select > .ant-select-selector')
            .click();
    
        // Ensure the option is a string and not null or undefined
        if (typeof option === 'string' && option.trim() !== '') {
            // Search and select the option passed as a parameter
            cy.get('.ant-select-dropdown:not(.ant-select-dropdown-hidden)')  // Find visible dropdown
                .should('be.visible')
                .within(() => {
                    cy.get('.ant-select-item-option-content')  // Get all dropdown options
                        .contains(option)                     // Match the option passed as parameter
                        .click();                             // Click the matched option
                });
    
            // Verify that the correct option is selected
            cy.get(':nth-child(1) > :nth-child(2) > :nth-child(1) > .ant-form-item > .ant-row > .ant-col > .ant-form-item-control-input > .ant-form-item-control-input-content > .ant-select > .ant-select-selector')
                .should('contain.text', option);              // Validate the selected option is correct
        } else {
            throw new Error('Invalid dropdown option. Please provide a valid string.');
        }
    }
    
    validateYapilyFlow(){
        cy.get('.ant-row-center.m-t-20 > .ant-col > .ant-space > :nth-child(1) > .ant-btn').click() //fund via asy transfer btn
        cy.origin("https://payments.yapily.com", () => {
        Cypress.on("uncaught:exception", () => false);
        
        cy.get('[data-testid="search-input"]', { timeout: 20000 })
            .type("Modelo");
        cy.get(".institution-card__hover").click();
        cy.get('[data-testid="footer-continue-button"]').click();
        
        // Remove target="_blank" attribute to prevent new tab opening
        // Then click immediately to preserve session state
        cy.get('[data-testid="auth-continue-to-bank"]', { timeout: 10000 })
            .invoke('removeAttr', 'target')
            .click();
    });
    
    // --------------------------------------------------------
    // OZONE FLOW (Direct continuation after Yapily redirect)
    // --------------------------------------------------------
    cy.origin("https://auth1.obie.uk.ozoneapi.io", () => {
        Cypress.on("uncaught:exception", () => false);
        
        // PAGE 1: Login Screen
        cy.get('.ozone-heading-1', { timeout: 30000 })
            .should('contain.text', 'Model Bank');
        cy.get('.ozone-heading-3', { timeout: 20000 })
            .should('contain.text', 'Please enter your login details to proceed');
        
        cy.get(':nth-child(1) > .ozone-input', { timeout: 10000 })
            .should('be.visible')
            .clear()
            .type("mits");
        
        cy.get('#passwordField', { timeout: 10000 })
            .should('be.visible')
            .clear()
            .type("mits");
        
        // Add small wait before clicking login to ensure form is ready
        cy.wait(500);
        cy.get('#loginButton').should('be.enabled').click();
        
        // PAGE 2: Consent Screen
        cy.get('.ozone-pis-heading-1', { timeout: 30000 })
            .should('contain.text', 'Single Domestic Payment Consents (PIS)');
        
        cy.get('#radio-10000109010102', { timeout: 10000 })
            .should('be.visible')
            .click({ force: true });
        
        // Wait a moment for the radio selection to register
        cy.wait(500);
        cy.get('#confirmButton').should('be.enabled').click({ force: true });
    });
    
    // ---------------------------------
    // BACK TO MAIN APP (automatically returns to original origin)
    // ---------------------------------
    Cypress.on("uncaught:exception", () => false);
    
    cy.get(".ant-spin-dot", { timeout: 30000 }).should("not.exist");
    cy.get(".ant-typography.muli.semi-bold.fs-24px.purple", { timeout: 20000 })
        .should("contain.text", "Funds could take up to 2 hours to be posted.");
               
    }
    cancelPushFunds() {
        // Click on view payment
        cy.get('.ant-row-center.m-t-20 > .ant-col > .ant-space > :nth-child(1) > .ant-btn').should('be.visible').click();
        cy.get(variable1.newPaymentPageLocators.loadingIcon).should('not.exist');
    
        // Click on the 1st row item
        cy.get('[data-row-key="0"] > :nth-child(2)').should('be.visible').click();
    
        // Now check if the 'Cancel Payment' button exists and is visible
        cy.get('body').find('.ant-btn.ant-btn-danger').then($button => {
            if ($button.length > 0) {
                // If the button exists, click on 'Cancel Payment'
                cy.wrap($button).should('contain.text', 'Cancel Payment').and('be.visible').click();
    
                // Verify the confirmation popover
                cy.get('.ant-popover-inner-content')
                  .should('be.visible')
                  .and('contain.text', 'Are you sure you want to cancel this Payment?');
                
                // Confirm by clicking the primary 'Yes' button
                cy.get('button[class="ant-btn ant-btn-primary ant-btn-sm"]').should('be.visible').click();
    
                // Assert that one of the two possible messages is displayed
                cy.get('.ant-notification-notice').should('be.visible').then($notice => {
                    const noticeText = $notice.text();
                    expect(noticeText).to.satisfy(text => 
                        text.includes('Please Contact Support In order to cancel this payment, you need to contact our support team via email (support@volopa.com) or phone (+44 333 400 1287)') ||
                        text.includes('Payment has been successfully cancelled')
                    );
                });
            }
        });
    }

    cancelEasyTransfer() {
        cy.get(variable1.newPaymentPageLocators.loadingIcon).should('not.exist');
    
        // Click on the 1st row item
        cy.get('[data-row-key="0"] > :nth-child(2)').should('be.visible').click();
    
        // Now check if the 'Cancel Payment' button exists and is visible
        cy.get('body').find('.ant-btn.ant-btn-danger').then($button => {
            if ($button.length > 0) {
                // If the button exists, click on 'Cancel Payment'
                cy.wrap($button).should('contain.text', 'Cancel Payment').and('be.visible').click();
    
                // Verify the confirmation popover
                cy.get('.ant-popover-inner-content')
                  .should('be.visible')
                  .and('contain.text', 'Are you sure you want to cancel this Payment?');
                
                // Confirm by clicking the primary 'Yes' button
                cy.get('button[class="ant-btn ant-btn-primary ant-btn-sm"]').should('be.visible').click();
    
                // Assert that one of the two possible messages is displayed
                cy.get('.ant-notification-notice').should('be.visible').then($notice => {
                    const noticeText = $notice.text();
                    expect(noticeText).to.satisfy(text => 
                        text.includes('Please Contact Support In order to cancel this payment, you need to contact our support team via email (support@volopa.com) or phone (+44 333 400 1287)') ||
                        text.includes('Payment has been successfully cancelled')
                    );
                });
            }
        });
    }  
    
    goToSetting(){
        cy.get(variable1.newPaymentPageLocators.menuicon).should('be.visible').click()
        cy.get('.ant-card-body')
        .contains('span', 'Settings')
        .click()
        cy.get(variable1.newPaymentPageLocators.companyAccount).should('contain.text','Company Account')
        
    }
    goToSettingCorpay(){
        cy.get(variable1.newPaymentPageLocators.menuicon).should('be.visible').click()
        cy.get(variable1.newPaymentPageLocators.settingfromMenuCorpay).should('be.visible').should('contain.text','Settings').click()
        cy.get(variable1.newPaymentPageLocators.companyAccount).should('contain.text','Company Account')
        
    }
    goToNotificationSetting(){
        cy.get(variable1.newPaymentPageLocators.notificationSetting).should('be.visible').should('contain.text','Notification Settings').click()
        cy.get(variable1.newPaymentPageLocators.notificationSettingHeader).should('be.visible').should('contain.text','Notification Settings')
    }
    goToApprovalWorkFlow(){
        cy.get(variable1.newPaymentPageLocators.workflowApproval).should('be.visible').should('contain.text','Workflow Approvals')
        cy.get(variable1.newPaymentPageLocators.workflowApprovalEdit).should('be.visible').click()
        cy.get(variable1.newPaymentPageLocators.workflowRulesHeading).should('contain.text','Workflow Approval Rules')
    }
    setCurrencyforApproval(currency,cHeading,amount){
        cy.get(variable1.newPaymentPageLocators.currencyEdit).should('be.visible').click()
        cy.get(variable1.newPaymentPageLocators.currencyDropdown).should('be.visible').click()
        cy.get('.ant-select-selector').eq(0).click().wait(5000).type(currency)
        cy.get("span[class='ant-select-selection-item'] div[class='ant-space ant-space-horizontal ant-space-align-center']").should('contain.text',cHeading)
        cy.get(variable1.newPaymentPageLocators.approvalAmount).should('be.visible').type(amount)
    }
    setApprover(approver){
        cy.get(variable1.newPaymentPageLocators.approverEdit).should('be.visible').click()
        cy.get(variable1.newPaymentPageLocators.approverDropdown).should('be.visible').type(approver)

    }
    saveApprovalRule(){
        cy.get(variable1.newPaymentPageLocators.saveapprovalRule).should('be.visible').click()
        cy.get(variable1.newPaymentPageLocators.successNotification).should('be.visible').should('contain.text','Changes saved successfully')
    }
    returnToPaymentDashboard(){
        cy.get(variable1.newPaymentPageLocators.returnpaymentDashbaord).should('be.visible').click()
        cy.get(variable1.newPaymentPageLocators.Paymentdashboard).should('be.visible').should('contain.text','Payments Dashboard')
    }
    goToDraftPayment(){
        cy.get(variable1.newPaymentPageLocators.draftHeader).should('be.visible').should('contain.text','Draft Payments').click()
        cy.get(':nth-child(1) > a > .ant-card > .ant-card-body > :nth-child(2)').should('contain.text','Draft Payments').click()
    }
    logout(){
        cy.get(variable1.newPaymentPageLocators.profileIcon).should('be.visible').click()
        cy.wait(4000)
        cy.get(variable1.newPaymentPageLocators.logout).click()
        cy.get(variable1.newPaymentPageLocators.welcomeBack).should('contain','Welcome Back!')
    }
    goToNotification(){
        cy.get(variable1.newPaymentPageLocators.notification).should('be.visible').click()
    }
    approvalNotification(){
        cy.get(variable1.newPaymentPageLocators.istNotification).should('be.visible').should('contain.text','New payment pending your approval. Click here to review and approve.')
        cy.get('span').contains('Review').first().click()
    }
    approvingSinglePayment(){
        cy.get('.ant-modal-body').should('be.visible')
        cy.get('.ant-modal-body > :nth-child(1) > .ant-col > .ant-typography').should('contain.text','Payment Confirmation')
        cy.get(':nth-child(3) > .ant-btn').should('be.visible').should('be.enabled').click()
        cy.get('.ant-modal-body > :nth-child(1)').should('contain.text','Payment Booked - Pending Funds')
    }
    validateApprovedPayment(){
        cy.get('div[class="ant-modal-root"] div[class="ant-space ant-space-horizontal ant-space-align-center"] div:nth-child(1) button:nth-child(1)').should('be.visible').click()
        cy.get('[data-row-key="0"] > :nth-child(4)').should('be.visible').should('contain.text','Single')
    }
    validateApprovedEasyTransferPayment(){
        cy.get('div[class="ant-space ant-space-horizontal ant-space-align-center"] div:nth-child(2) button:nth-child(1)').should('be.visible').click()
        cy.get('[data-row-key="0"] > :nth-child(4)').should('be.visible').should('contain.text','Single')
    }
    removeApprovalrule(){
        cy.get(variable1.newPaymentPageLocators.deleteCurrency).should('be.visible').click()
        cy.get(variable1.newPaymentPageLocators.deleteApprover).should('be.visible').click()
    }
    
    
    
    
}