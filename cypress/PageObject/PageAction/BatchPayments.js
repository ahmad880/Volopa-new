const variable = require('../PageElements/BatchPayments.json')
const variable1= require('../PageElements/AdditionalCurrencies.json')
export class BatchPayments {
    goToBatchPaymentPage(){
        cy.get(variable.batchPaymentsPageLocators.batchPaymentsHeader).click()
        cy.get('.ant-card-body > .ant-row > .ant-col > .ant-space').should('be.visible').click()
        //cy.get(variable.batchPaymentsPageLocators.batchPaymentsHeading).should('contain.text','Pay Multiple Recipients')
    }
    goToPayMultipleRecipient(){
        //cy.get(variable.batchPaymentsPageLocators.multipleRecipient).should('be.visible').click()
        cy.get(variable.batchPaymentsPageLocators.loadingIcon).should('not.exist')
        cy.get(variable.batchPaymentsPageLocators.multipleRecipientHeading).should('contain.text','Pay Multiple Recipients')
    }
    validateSearchBar(name){
       // cy.wait(60000)
        cy.get(variable.batchPaymentsPageLocators.loadingIcon).should('not.exist')
        cy.get(variable.batchPaymentsPageLocators.searchField).eq(0).type(name)
        cy.get(variable.batchPaymentsPageLocators.recipientDetailHeading).should('contain.text','Recipient Details').click()
    }
    validateSearchBar1(name){
        // cy.wait(60000)
         cy.get(variable.batchPaymentsPageLocators.loadingIcon).should('not.exist')
         cy.get(variable.batchPaymentsPageLocators.searchField1).eq(0).type(name)
         cy.get(variable.batchPaymentsPageLocators.recipientDetailHeading).should('contain.text','Recipient Details').click()
     }
    goToAddNewRecipient(){
        cy.get(variable.batchPaymentsPageLocators.searchField).click().wait(2000)
        cy.get(variable.batchPaymentsPageLocators.addRecipientBtn).click()
        cy.get(variable.batchPaymentsPageLocators.recipientDetailPageHeading).should('contain.text','Recipient Details')
    }
    addRecipientDetails(){
        cy.get(variable.batchPaymentsPageLocators.paymentDetailHeading).should('contain.text','Enter Payment Details')
        cy.get(variable.batchPaymentsPageLocators.amount).eq(0).type('130')
        cy.get(variable.batchPaymentsPageLocators.reasonForPaymentDropDown).click()
        cy.get(variable.batchPaymentsPageLocators.selectReasonForPayment).eq(0).click()
        cy.get(variable.batchPaymentsPageLocators.paymentReferences).eq(0).type('Single')
        cy.get(variable.batchPaymentsPageLocators.proceedtoPayBtn).click()
        cy.get(variable.batchPaymentsPageLocators.paymentSummary).should('contain.text','Payment Summary')
    }
    addSettlement(){
        cy.get(':nth-child(3) > .ant-col > .ant-space > [style=""] > .ant-typography').should('be.visible').should('contain.text','Settlement Method')
        cy.get(':nth-child(4) > .ant-col > .ant-space > [style=""] > .ant-btn').should('be.visible').click()
    }
    fxrateChecker(){
        cy.get(variable.batchPaymentsPageLocators.fundingCurrency).click()
        cy.get(variable.batchPaymentsPageLocators.selectfundingCurrency).eq(0).click()
        cy.get(variable.batchPaymentsPageLocators.fxRateTimer).should('be.visible').should('contain.text','30s')
        cy.wait(30000)
        cy.get(variable.batchPaymentsPageLocators.fxRateTimer).should('be.visible').should('contain.text','0s')
        cy.get(variable.batchPaymentsPageLocators.fxRateTimer).should('be.visible').should('contain.text','30s')
    }
    disabledFundingMethod(){
        cy.get(variable.batchPaymentsPageLocators.fundingCurrency).click()
        cy.get(variable.batchPaymentsPageLocators.fundingCurrencyAUD).should('be.visible').click()
        cy.get(variable.batchPaymentsPageLocators.disabledFundingMethod).should('be.disabled')
    }
    validateYapilyFlow(){
        cy.get('.ant-row-center.m-t-20 > .ant-col > .ant-space > :nth-child(1) > .ant-btn').click() //fund via asy transfer btn
        cy.get('.mb-3').should('contain.text','Choose your bank:') //heading
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
    paymentSummaryPageDetails(){
        cy.get(variable.batchPaymentsPageLocators.fundingCurrency).click()
        cy.get(variable.batchPaymentsPageLocators.fundingCurrencyAUD).should('be.visible').click()
        cy.get(':nth-child(2) > .ant-btn').click()//Proceed to pay
        cy.get('.ant-space > :nth-child(2) > .ant-btn').click()//pay recipient btn
        cy.get('.ant-typography-success').should('be.visible').should('contain.text',' Payment Booked - ')
    }
    goToViewPayment(){
        cy.get("div[class='ant-modal-root'] div[class='ant-space ant-space-horizontal ant-space-align-center'] div:nth-child(1) button:nth-child(1)").should('be.visible').click()// view payment btn
        cy.get('.ant-typography.medium.dark-green.fs-28px').should('be.visible').should('contain.text','Payment History')
    }
    goToNewPayment(){
        cy.get('[class*="ant-btn-background-ghost"]').eq(1).should('be.visible').click()//newPayments Btn
        cy.get(variable.batchPaymentsPageLocators.multipleRecipientHeading).should('contain.text','Pay Multiple Recipients')
    }
    goToDashboard(){
        cy.get(':nth-child(3) > .ant-btn').should('be.visible').click()//Dashboard Btn.
        cy.get('.ant-tabs-tab-active').should('be.visible').should('contain.text','Payments Dashboard')
    }
    paymentPurpose(){
        cy.get('#paymentPurpose').click()
        cy.get('[class="ant-select-item ant-select-item-option"]').eq(0).should('be.visible').then(option => {
            const selectedValue = option.text(); // Get the text of the selected option
            option.click(); // Click to select the option
            cy.wrap(selectedValue).as('selectedValue')
            // Log the selected value
            cy.log(`Selected value: ${selectedValue}`);
        });
    }
    paymentPurpose1(){
        cy.get('#paymentPurpose').click()
        cy.get('[class="ant-select-item ant-select-item-option"]').eq(1).should('be.visible').then(option => {
            const selectedValue1 = option.text(); // Get the text of the selected option
            option.click(); // Click to select the option

            // Log the selected value
            cy.log(`Selected value1: ${selectedValue1}`);
        });
    }
    generateRandomString(length) {
        const characters = 'abcdefghijklmnopqrstuvwxyz';
        let randomString = '';
    
        for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        randomString += characters.charAt(randomIndex);
        }
        return randomString;
    }
    individualRecipient(fName,lName,country){
        cy.get(variable1.additionalCurrenciesLocators.individual).click()
        cy.get(variable1.additionalCurrenciesLocators.submitBtn).should('be.disabled')
        cy.get(variable1.additionalCurrenciesLocators.firstName).type(fName)
        cy.get(variable1.additionalCurrenciesLocators.lastName).type(lName)
        cy.get(variable1.additionalCurrenciesLocators.address).type('489 Avenue Louise Brussels 1050')
        cy.get(variable1.additionalCurrenciesLocators.city).type('London')
        //in case of corpay change 7 to 8
        cy.get(':nth-child(8) > .ant-col-xs-24 > .ant-form-item > .ant-row > .ant-form-item-label > .ant-form-item-required > .ant-typography').should('contain.text','Recipient Country')
        cy.get('#beneficiaryCountry').type(country)
    }
    addrecipientDetail(amount ,email){
        cy.get(variable.batchPaymentsPageLocators.paymentDetailHeading).should('contain.text','Enter Payment Details')
        cy.get(variable.batchPaymentsPageLocators.amount).eq(0).type(amount)
        cy.get('[placeholder="Enter email"]').eq(0).should('contain.value',email ,{force:true})
        //cy.get(variable.batchPaymentsPageLocators.reasonForPaymentDropDown).eq(1).click()
        cy.get(':nth-child(1) > .ant-col-xs-24 > .ant-card > .ant-card-body > :nth-child(3) > .ant-col-xxl-0 > :nth-child(9) > .ant-col > :nth-child(1) > .ant-select-selector').click()
        cy.get(variable.batchPaymentsPageLocators.selectReasonForPayment).eq(0).click({force:true})
        cy.get(variable.batchPaymentsPageLocators.paymentReferences).eq(0).type('Single', {force:true})
    }
    iNRDetails1() {
    // Get today's date (used for asserting if needed)
    const today = new Date();
    const day = String(today.getDate()).padStart(2, '0');
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const year = today.getFullYear();
    const formattedDate = `${day}/${month}/${year}`;

    // Check Invoice Number Label
    cy.get(':nth-child(2) > .ant-col-xs-24 > .ant-card > .ant-card-body > :nth-child(3) > .ant-col-xxl-0 > :nth-child(10) > :nth-child(1) > .ant-col > .ant-space > [style=""] > .ant-typography')
        .should('be.visible')
        .should('contain.text', 'Invoice Number');

    // Enter Invoice Number
    cy.get(':nth-child(2) > .ant-col-xs-24 > .ant-card > .ant-card-body > :nth-child(3) > .ant-col-xxl-0 > :nth-child(10) > :nth-child(2) > .ant-col > .ant-input')
        .type('345210');

    // Check Invoice Date Label
    cy.get(':nth-child(2) > .ant-col-xs-24 > .ant-card > .ant-card-body > :nth-child(3) > .ant-col-xxl-0 > :nth-child(10) > :nth-child(3) > .ant-col > .ant-space > [style=""] > .ant-typography')
        .should('contain.text', 'Invoice Date');

    cy.get('input[placeholder="Select date"]').eq(2).click();

// Ensure calendar is visible
cy.get('.ant-picker-dropdown')
  .should('be.visible')
  .last() // get the last visible dropdown (if multiple exist)
  .within(() => {
    // Click today's date from that specific calendar
    cy.get('.ant-picker-cell-today').click();
  });
}

    iNRDetails() {
    // Get today's date (for formatting or assertions if needed)
    const today = new Date();
    const day = String(today.getDate()).padStart(2, '0');
    const month = String(today.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed
    const year = today.getFullYear();
    const formattedDate = `${day}/${month}/${year}`;

    // Check Invoice Number Label
    cy.get(':nth-child(1) > .ant-col-xs-24 > .ant-card > .ant-card-body > :nth-child(3) > .ant-col-xxl-0 > :nth-child(10) > :nth-child(1) > .ant-col > .ant-space > [style=""] > .ant-typography')
        .should('contain.text', 'Invoice Number');

    // Enter Invoice Number
    cy.get(':nth-child(1) > .ant-col-xs-24 > .ant-card > .ant-card-body > :nth-child(3) > .ant-col-xxl-0 > :nth-child(10) > :nth-child(2) > .ant-col > .ant-input')
        .type('985210');

    // Check Invoice Date Label
    cy.get(':nth-child(1) > .ant-col-xs-24 > .ant-card > .ant-card-body > :nth-child(3) > .ant-col-xxl-0 > :nth-child(10) > :nth-child(3) > .ant-col > .ant-space > [style=""] > .ant-typography')
        .should('contain.text', 'Invoice Date');

    // Click the first date input to open calendar
    cy.get('input[placeholder="Select date"]').eq(0).click();

    // Select today's date from the calendar (this element usually has a special class)
    cy.get('.ant-picker-cell-today').click(); // Selects current date
}

    addrecipientDetailINR(amount ,email){
        cy.get(variable.batchPaymentsPageLocators.paymentDetailHeading).should('contain.text','Enter Payment Details')
        cy.get(variable.batchPaymentsPageLocators.amount).eq(0).type(amount)
        cy.get(':nth-child(1) > .ant-col-xs-24 > .ant-card > .ant-card-body > :nth-child(3) > .ant-col-xxl-0 > :nth-child(6) > .ant-col > .ant-input').should('contain.value',email ,{force:true})
        //cy.get(variable.batchPaymentsPageLocators.reasonForPaymentDropDown).eq(1).click()
        cy.get(':nth-child(1) > .ant-col-xs-24 > .ant-card > .ant-card-body > :nth-child(3) > .ant-col-xxl-0 > :nth-child(9) > .ant-col > :nth-child(1) > .ant-select-selector').click()
        cy.get(variable.batchPaymentsPageLocators.selectReasonForPayment).eq(0).click({force:true})
        cy.get(':nth-child(1) > .ant-col-xs-24 > .ant-card > .ant-card-body > :nth-child(3) > .ant-col-xxl-0 > :nth-child(12) > .ant-col > .ant-input').type('Single')
    }
    addrecipientDetail1INR(amount1 ,email1){
        cy.get(variable.batchPaymentsPageLocators.paymentDetailHeading).should('contain.text','Enter Payment Details')
        cy.get(variable.batchPaymentsPageLocators.amount1).eq(2).type(amount1)
        cy.get(':nth-child(2) > .ant-col-xs-24 > .ant-card > .ant-card-body > :nth-child(3) > .ant-col-xxl-0 > :nth-child(6) > .ant-col > .ant-input').should('contain.value',email1)
        cy.get(':nth-child(2) > .ant-col-xs-24 > .ant-card > .ant-card-body > :nth-child(3) > .ant-col-xxl-0 > :nth-child(9) > .ant-col > :nth-child(1) > .ant-select-selector').click()
        cy.get("[class='ant-select-dropdown ant-select-dropdown-placement-bottomLeft '] div[title*=' '] div[class='ant-select-item-option-content']").eq(0).click({force:true})
        cy.get(':nth-child(2) > .ant-col-xs-24 > .ant-card > .ant-card-body > :nth-child(3) > .ant-col-xxl-0 > :nth-child(12) > .ant-col > .ant-input').type('Single', {force:true})
    }
    addrecipientDetail1(amount1 ,email1){
        cy.get(variable.batchPaymentsPageLocators.paymentDetailHeading).should('contain.text','Enter Payment Details')
        cy.get(variable.batchPaymentsPageLocators.amount1).eq(2).type(amount1)
        cy.get('[placeholder="Enter email"]').eq(2).should('contain.value',email1)
        cy.get(':nth-child(2) > .ant-col-xs-24 > .ant-card > .ant-card-body > :nth-child(3) > .ant-col-xxl-0 > :nth-child(9) > .ant-col > :nth-child(1) > .ant-select-selector').click()
        cy.get("[class='ant-select-dropdown ant-select-dropdown-placement-bottomLeft '] div[title*=' '] div[class='ant-select-item-option-content']").eq(0).click({force:true})
        cy.get(variable.batchPaymentsPageLocators.paymentReferences).eq(1).type('Single', {force:true})
    }
    addrecipientDetails1(amount1 ,email1){
        cy.get(variable.batchPaymentsPageLocators.paymentDetailHeading).should('contain.text','Enter Payment Details')
        cy.get(variable.batchPaymentsPageLocators.amount1).type(amount1)
        cy.get('#email_1_1').should('contain.value',email1)
        cy.get(':nth-child(2) > .ant-col-xs-24 > .ant-card > .ant-card-body > :nth-child(3) > .ant-col-xxl-0 > :nth-child(9) > .ant-col-24 > :nth-child(2) > .ant-row > .ant-col > .ant-form-item-control-input > .ant-form-item-control-input-content > .ant-select > .ant-select-selector').click().type('{downarrow}{enter}')
        cy.get(variable.batchPaymentsPageLocators.paymentReferences1).type('Single')
    }
    proceedflow(fundingCCY,CCYHeading,fundingMethod,methodHeading){
        cy.get('.ant-col-xxl-2 > .ant-row > .ant-col > .ant-btn').click()
        cy.get('.ant-typography.dark-green.fs-18px.medium').should('contain.text','Select Funding Currency')
        cy.get('.ant-select-selector').click().wait(2000)
        cy.get('.rc-virtual-list-holder-inner').contains(fundingCCY).click()
        cy.get("span[class='ant-select-selection-item'] div[class='ant-space ant-space-horizontal ant-space-align-center']").should('contain.text',CCYHeading)
        cy.get("div[class='ant-select full-percent-width ant-select-single ant-select-show-arrow'] div[class='ant-select-selector']").click().wait(1000)
        cy.contains(fundingMethod).should('be.visible').click()
        cy.wait(3000)
        cy.get(variable.batchPaymentsPageLocators.loadingIcon).should('not.exist')
        cy.get(':nth-child(1) > .ant-col > .ant-space > .ant-space-item > .ant-typography').click()
        cy.get("div[class='ant-select full-percent-width ant-select-single ant-select-show-arrow'] div[class='ant-select-selector']").should('contain.text',methodHeading)
    }
    validateproceedflow(amount,amount1){
        cy.get('.row-border > :nth-child(2)').should('be.visible').should('contain.text',amount)
        cy.get('[data-row-key="1"] > :nth-child(2)').should('be.visible').should('contain.text',amount1)
        const expectedAmount = parseInt(amount1) + parseInt(amount);
        //in case of corpay change to n changes to 3
        cy.get(':nth-child(4) > .ant-col-8 > .ant-typography')
        .should('be.visible')
        .invoke('text')
        .then((text) => {
            const cleanedText = text.replace(/,/g, '').trim(); // Only remove commas
            const actualAmount = parseFloat(cleanedText); // Use parseFloat to handle decimals
            expect(actualAmount).to.eq(expectedAmount);
        });
        cy.get(':nth-child(2) > .ant-btn').click()
        cy.get(':nth-child(2) > :nth-child(1) > .ant-card > .ant-card-body').should('be.visible')
        cy.get('.ant-space > :nth-child(2) > .ant-btn').click()
        cy.get('.ant-modal-body').should('be.visible')
        const expectedAmount1 = parseInt(amount1) + parseInt(amount);

        cy.get('.ant-col-24 > :nth-child(4) > .ant-col-8 > .ant-typography')
        .should('be.visible')
        .invoke('text')
        .then((text) => {
            const cleanedText = text.replace(/,/g, '').trim(); // Only remove commas
            const actualAmount = parseFloat(cleanedText); // Use parseFloat to handle decimals
            expect(actualAmount).to.eq(expectedAmount1);
        });
        //cy.get(variable.batchPaymentsPageLocators.paymentSummary).should('contain.text','Payment Summary')
    }
    validateApprovedproceedflow(amount,amount1){
        cy.get('.row-border > :nth-child(2)').should('be.visible').should('contain.text',amount)
        cy.get('[data-row-key="1"] > :nth-child(2)').should('be.visible').should('contain.text',amount1)
        const expectedAmount = parseInt(amount1) + parseInt(amount);

        cy.get(':nth-child(4) > .ant-col-8 > .ant-typography')
        .should('be.visible')
        .invoke('text')
        .then((text) => {
            const cleanedText = text.replace(/,/g, '').trim(); // Only remove commas
            const actualAmount = parseFloat(cleanedText); // Use parseFloat to handle decimals
            expect(actualAmount).to.eq(expectedAmount);
        });
        cy.get(':nth-child(2) > .ant-btn').click()
        cy.get(':nth-child(2) > :nth-child(1) > .ant-card > .ant-card-body').should('be.visible')
        cy.get('.ant-form > :nth-child(3) > .ant-col > .ant-typography').should('be.visible').should('contain.text','The FX contract for International Payments that are pending approval is not booked. The live FX contract will be displayed to the Approver at the point of approval')
        cy.get('.ant-space > :nth-child(2) > .ant-btn').should('be.visible').should('contain.text','Submit for Approval').click()
        cy.get('.ant-modal-body').should('be.visible')
        cy.get('.ant-modal-body > :nth-child(1)').should('be.visible').should('contain.text','Submitted for Approval')
        const expectedAmount1 = parseInt(amount1) + parseInt(amount);

        cy.get('.ant-col-24 > :nth-child(4) > .ant-col-8 > .ant-typography')
        .should('be.visible')
        .invoke('text')
        .then((text) => {
            const cleanedText = text.replace(/,/g, '').trim(); // Only remove commas
            const actualAmount = parseFloat(cleanedText); // Use parseFloat to handle decimals
            expect(actualAmount).to.eq(expectedAmount1);
        });
        cy.get(':nth-child(5) > .ant-col > .ant-typography').should('be.visible').should('contain.text','Pending Approval')

        cy.get(':nth-child(4) > .ant-col > .ant-space > [style=""] > .ant-btn').should('be.visible').should('be.enabled').click()
    }

    validateScheduledproceedflow(amount,amount1, date){
        cy.get('.row-border > :nth-child(2)').should('be.visible').should('contain.text',amount)
        cy.get('[data-row-key="1"] > :nth-child(2)').should('be.visible').should('contain.text',amount1)
        const expectedAmount = parseInt(amount1) + parseInt(amount);

        cy.get(':nth-child(4) > .ant-col-8 > .ant-typography')
        .should('be.visible')
        .invoke('text')
        .then((text) => {
            const cleanedText = text.replace(/,/g, '').trim(); // Only remove commas
            const actualAmount = parseFloat(cleanedText); // Use parseFloat to handle decimals
            expect(actualAmount).to.eq(expectedAmount);
        });
        function getFutureWorkingDate(n) {
            const d = new Date();  // today
            let added = 0;
          
            // count n working days
            while (added < n) {
              d.setDate(d.getDate() + 1);
              const dow = d.getDay();       // 0=Sun … 6=Sat
              if (dow !== 0 && dow !== 6) { // Mon-Fri only
                added++;
              }
            }
          
            // sanity: if final date is weekend (can happen when today is weekend)
            let dow = d.getDay();
            if (dow === 6) d.setDate(d.getDate() + 2); // Sat → Mon
            if (dow === 0) d.setDate(d.getDate() + 1); // Sun → Mon
          
            // formats
            const yyyy = d.getFullYear();
            const mm   = String(d.getMonth() + 1).padStart(2, '0');
            const dd   = String(d.getDate()).padStart(2, '0');
          
            return {
              dateObj   : d,
              titleFmt  : `${yyyy}-${mm}-${dd}`,      // for <td title="">
              displayFmt: `${dd}-${mm}-${yyyy}`,      // DD-MM-YYYY
              longFmt   : `Scheduled for ${d.toLocaleDateString(
                            'en-US',
                            { month:'long', day:'numeric', year:'numeric' }
                          )}`
            };
          }

          const plusDays = date;
const { titleFmt, displayFmt, longFmt } = getFutureWorkingDate(plusDays);

// 1. open the calendar
cy.get('.ant-picker-input').click();

// 2. pick the calculated working day
cy.get(`td[title='${titleFmt}'] div.ant-picker-cell-inner`).click();

// 3. compact DD-MM-YYYY check
cy.get('.ant-col-9 > .ant-typography')
  .should('have.text', displayFmt);

        cy.get(':nth-child(2) > .ant-btn').click()
        cy.get(':nth-child(2) > :nth-child(1) > .ant-card > .ant-card-body').should('be.visible')

        
        cy.get('.ant-space > :nth-child(2) > .ant-btn').should('be.visible').click()
        //cy.get('.ant-form > :nth-child(3) > .ant-col > .ant-typography').should('be.visible').should('contain.text','NOTE: Exchange Rate & Amounts are indicative only. Exchange Rates & Amounts are confirmed in time for the scheduled Expected Delivery date.')
        cy.wait(2500)
        cy.get('.ant-space > :nth-child(2) > .ant-btn').should('be.visible').should('contain.text','Schedule Payment').click({force: true})
        cy.get('.ant-modal-body').should('be.visible')
        cy.get('.ant-modal-body > :nth-child(1)').should('be.visible').should('contain.text','Payment Scheduled')
        const expectedAmount1 = parseInt(amount1) + parseInt(amount);

        cy.get('.ant-col-24 > :nth-child(4) > .ant-col-8 > .ant-typography')
        .should('be.visible')
        .invoke('text')
        .then((text) => {
            const cleanedText = text.replace(/,/g, '').trim(); // Only remove commas
            const actualAmount = parseFloat(cleanedText); // Use parseFloat to handle decimals
            expect(actualAmount).to.eq(expectedAmount1);
        });

        cy.get(':nth-child(4) > .ant-col > .ant-space > :nth-child(1) > .ant-btn').should('be.visible').should('be.enabled').first().click()
    }
    approveBatchPayment(){
        cy.get(':nth-child(3) > .ant-btn').should('be.visible').should('be.enabled').click()
    }
    
    addRecipient(Country ,Currencies ,email){
        cy.get(variable1.additionalCurrenciesLocators.addRecipient).should('be.visible').click()
        cy.get(variable1.additionalCurrenciesLocators.selectCountry).should('be.visible').click()
        .get(variable1.additionalCurrenciesLocators.countryDropDownHeading).should('be.visible').type(Country)
        cy.get(variable1.additionalCurrenciesLocators.selectCurrency).should('be.visible').click().wait(5000).type(Currencies)
        cy.get(variable1.additionalCurrenciesLocators.emailHeading).should('be.visible').should('contain.text','Recipient Email Address')
        cy.get(variable1.additionalCurrenciesLocators.emailFeild).should('be.visible').type(email)
    }
     //only chnina
    addBusinessRecipient(bName,country){
        cy.get(variable1.additionalCurrenciesLocators.businessName).type(bName)
        cy.get(variable1.additionalCurrenciesLocators.businessDescription).type('Testing')
        cy.get(variable1.additionalCurrenciesLocators.businessNature).type('Testing')
        cy.get(variable1.additionalCurrenciesLocators.businessWebsite).type('testing.com')
        cy.get(variable1.additionalCurrenciesLocators.address).type('489 Avenue Louise Brussels 1050')
        cy.get(variable1.additionalCurrenciesLocators.city).type('London')
        //in case of corpay change 7 to 8
        cy.get(':nth-child(8) > .ant-col-xs-24 > .ant-form-item > .ant-row > .ant-form-item-label > .ant-form-item-required > .ant-typography').should('contain.text','Recipient Country')
        cy.get('#beneficiaryCountry').type(country)
    }
    paymentPurposeChina(){
        cy.get('div[rules="[object Object]"] div[class="ant-select-selector"]')
        .click()
        cy.get('[class="ant-select-item ant-select-item-option"]').eq(0).should('be.visible').then(option => {
            const selectedValue = option.text(); // Get the text of the selected option
            option.click(); // Click to select the option
            cy.wrap(selectedValue).as('selectedValue')
            // Log the selected value
            cy.log(`Selected value: ${selectedValue}`);
        });
    }
    paymentPurposeGBPEUR(){
        cy.get('#paymentPurpose').click()
        cy.get('[class="ant-select-item ant-select-item-option"]').eq(0).should('be.visible').then(option => {
            const selectedValue = option.text(); // Get the text of the selected option
            option.click(); // Click to select the option
            cy.wrap(selectedValue).as('selectedValue')
            // Log the selected value
            cy.log(`Selected value: ${selectedValue}`);
        });
    }
    paymentPurpose1GBPEUR(){
        cy.get('#paymentPurpose').click()
        cy.get('[class="ant-select-item ant-select-item-option"]').eq(1).should('be.visible').then(option => {
            const selectedValue1 = option.text(); // Get the text of the selected option
            option.click(); // Click to select the option

            // Log the selected value
            cy.log(`Selected value1: ${selectedValue1}`);
        });
    }
    addrecipientDetailEUR(amount ,email){
        cy.get(variable.batchPaymentsPageLocators.paymentDetailHeading).should('contain.text','Enter Payment Details')
        cy.get(variable.batchPaymentsPageLocators.amount).eq(0).type(amount)
        cy.get(':nth-child(1) > .ant-col-xs-24 > .ant-card > .ant-card-body > :nth-child(3) > .ant-col-xxl-0 > :nth-child(6) > .ant-col > .ant-input').should('contain.value',email ,{force:true})
        //cy.get(variable.batchPaymentsPageLocators.reasonForPaymentDropDown).eq(1).click()
        cy.get(':nth-child(1) > .ant-col-xs-24 > .ant-card > .ant-card-body > :nth-child(3) > .ant-col-xxl-0 > :nth-child(9) > .ant-col > .full-percent-width > .ant-select-selector').click()
        cy.get(variable.batchPaymentsPageLocators.selectReasonForPayment).eq(0).click({force:true})
        cy.get(variable.batchPaymentsPageLocators.paymentReferences).eq(0).type('Single', {force:true})
    }
    addrecipientDetail1EUR(amount1 ,email1){
        cy.get(variable.batchPaymentsPageLocators.paymentDetailHeading).should('contain.text','Enter Payment Details')
        cy.get(variable.batchPaymentsPageLocators.amount1).eq(2).type(amount1)
        cy.get('[class="ant-btn ant-btn-primary ant-btn-background-ghost"]').eq(0).should('be.visible').click()
        cy.get(':nth-child(2) > .ant-col-xs-24 > .ant-card > .ant-card-body > :nth-child(3) > .ant-col-xxl-0 > :nth-child(6) > .ant-col > .ant-input').should('contain.value',email1)
        cy.get(':nth-child(2) > .ant-col-xs-24 > .ant-card > .ant-card-body > :nth-child(3) > .ant-col-xxl-0 > :nth-child(9) > .ant-col > .full-percent-width > .ant-select-selector').click()
        cy.get("[class='ant-select-dropdown ant-select-dropdown-placement-bottomLeft '] div[title*=' '] div[class='ant-select-item-option-content']").eq(0).click({force:true})
        cy.get(variable.batchPaymentsPageLocators.paymentReferences).eq(1).type('Single', {force:true})
    }
    addrecipientDetail1MXN(amount1 ,email1){
        cy.get(variable.batchPaymentsPageLocators.paymentDetailHeading).should('contain.text','Enter Payment Details')
        cy.get(variable.batchPaymentsPageLocators.amount1).eq(2).type(amount1)
        cy.get(':nth-child(2) > .ant-col-xs-24 > .ant-card > .ant-card-body > :nth-child(3) > .ant-col-xxl-0 > :nth-child(6) > .ant-col > .ant-input').should('contain.value',email1)
        cy.get(':nth-child(2) > .ant-col-xs-24 > .ant-card > .ant-card-body > :nth-child(3) > .ant-col-xxl-0 > :nth-child(9) > .ant-col > .full-percent-width > .ant-select-selector').click()
        cy.get("[class='ant-select-dropdown ant-select-dropdown-placement-bottomLeft '] div[title*=' '] div[class='ant-select-item-option-content']").eq(0).click({force:true})
        cy.get(variable.batchPaymentsPageLocators.paymentReferences).eq(1).type('Single', {force:true})
    }
    proceedflowEUR(fundingMethod,methodHeading){
        cy.get('.ant-col-xxl-2 > .ant-row > .ant-col > .ant-btn').click()
        cy.get('.ant-typography.dark-green.fs-18px.medium').should('contain.text','Select Funding Currency')
        cy.get('.ant-select-selector').click().wait(3000).type('{enter}')
        cy.get("span[class='ant-select-selection-item'] div[class='ant-space ant-space-horizontal ant-space-align-center']").should('contain.text','GBP')
        cy.get(':nth-child(2) > [style="padding-left: 6px; padding-right: 6px; flex: 0 0 90px;"] > .ant-select > .ant-select-selector').click().type(fundingMethod)
        cy.get(variable.batchPaymentsPageLocators.loadingIcon).should('not.exist')
        cy.get(':nth-child(1) > .ant-col > .ant-space > .ant-space-item > .ant-typography').click()
        cy.get("div[class='ant-select ant-select-single ant-select-show-arrow'] span[class='ant-select-selection-item']").should('contain.text',methodHeading)
    }
    proceedflowGBP(fundingMethod,methodHeading){
        cy.get('.ant-col-xxl-2 > .ant-row > .ant-col > .ant-btn').click()
        cy.get('.ant-typography.dark-green.fs-18px.medium').should('contain.text','Select Funding Currency')
        cy.get('.ant-select-selector').click().wait(3000).type('{enter}')
        cy.get("span[class='ant-select-selection-item'] div[class='ant-space ant-space-horizontal ant-space-align-center']").should('contain.text','EUR')
        cy.get(':nth-child(2) > [style="padding-left: 6px; padding-right: 6px; flex: 0 0 90px;"] > .ant-select > .ant-select-selector').click().type(fundingMethod)
        cy.get(variable.batchPaymentsPageLocators.loadingIcon).should('not.exist')
        cy.get(':nth-child(1) > .ant-col > .ant-space > .ant-space-item > .ant-typography').click()
        cy.get("div[class='ant-select ant-select-single ant-select-show-arrow'] span[class='ant-select-selection-item']").should('contain.text',methodHeading)
    }
    validateAccSortNo(){
        cy.get(':nth-child(3) > .ant-form-item > .ant-row > .ant-form-item-label > label > .ant-typography').should('contain.text','Account Number')
        cy.get('#accNumber').should('be.visible').type('31510604')
        cy.get(':nth-child(4) > .ant-form-item > .ant-row > .ant-form-item-label > label > .ant-typography').should('contain.text','Sort Code')
        cy.get('#sortCode').should('be.visible').type('100000')
    }
    addBankDetailAUS(swift,accNo,bsb){
        cy.get(variable1.additionalCurrenciesLocators.sWIFT).should('be.visible').type(swift)
        cy.get(variable1.additionalCurrenciesLocators.accountNo).should('be.visible').type(accNo)
        cy.get("label[for='bsb'] span[class='ant-typography muli semi-bold fs-24px dark-green']").should('be.visible').should('contain.text','Bsb')
        cy.get('#bsb').should('be.visible').type(bsb)
        cy.get(variable1.additionalCurrenciesLocators.bankDetails).should('be.visible')
    }
    addBankDetailCAD(swift,accNo,bankcode,branchCode){
        cy.get(variable1.additionalCurrenciesLocators.sWIFT).should('be.visible').type(swift)
        cy.get(variable1.additionalCurrenciesLocators.accountNo).should('be.visible').type(accNo)
        cy.get("label[for='bank_code'] span[class='ant-typography muli semi-bold fs-24px dark-green']").should('be.visible').should('contain.text','Bank Code')
        cy.get('#bank_code').should('be.visible').type(bankcode)
        cy.get("label[for='branch_code'] span[class='ant-typography muli semi-bold fs-24px dark-green']").should('be.visible').should('contain.text','Branch Code')
        cy.get('#branch_code').should('be.visible').type(branchCode)
        cy.get(variable1.additionalCurrenciesLocators.bankDetails).should('be.visible')
    }
    addBankDetailHKD(swift,accNo,bankcode){
        cy.get(variable1.additionalCurrenciesLocators.sWIFT).should('be.visible').type(swift)
        cy.get(variable1.additionalCurrenciesLocators.accountNo).should('be.visible').type(accNo)
        cy.get("label[for='bank_code'] span[class='ant-typography muli semi-bold fs-24px dark-green']").should('be.visible').should('contain.text','Bank Code')
        cy.get('#bank_code').should('be.visible').type(bankcode)
        cy.get(variable1.additionalCurrenciesLocators.bankDetails).should('be.visible')
    }
    addrecipientDetail1AEDUSD(amount1 ,email1){
        cy.get(variable.batchPaymentsPageLocators.paymentDetailHeading).should('contain.text','Enter Payment Details')
        cy.get(variable.batchPaymentsPageLocators.amount1).eq(2).type(amount1)
        cy.get(':nth-child(2) > .ant-col-xs-24 > .ant-card > .ant-card-body > :nth-child(3) > .ant-col-xxl-0 > :nth-child(6) > .ant-col > .ant-input').should('contain.value',email1)
        cy.get(':nth-child(2) > .ant-col-xs-24 > .ant-card > .ant-card-body > :nth-child(3) > .ant-col-xxl-0 > :nth-child(9) > .ant-col > :nth-child(1) > .ant-select-selector').click()
        cy.get("[class='ant-select-dropdown ant-select-dropdown-placement-bottomLeft '] div[title*=' '] div[class='ant-select-item-option-content']").eq(0).click({force:true})
        cy.get(':nth-child(2) > .ant-col-xs-24 > .ant-card > .ant-card-body > :nth-child(3) > .ant-col-xxl-0 > :nth-child(11) > .ant-col > .ant-input').type('Single')
    }
    checkSettelments1(regular,priority){
        cy.get(':nth-child(1) > .ant-col-xs-24 > .ant-card > .ant-card-body > :nth-child(3) > .ant-col-xxl-0 > :nth-child(4) > .ant-col > .ant-space > [style=""] > .ant-btn').should('be.visible').should(regular)
        cy.get(':nth-child(1) > .ant-col-xs-24 > .ant-card > .ant-card-body > :nth-child(3) > .ant-col-xxl-0 > :nth-child(4) > .ant-col > .ant-space > :nth-child(2) > .ant-btn').should('be.visible').should(priority)
    }
    checkSettelments2(regular,priority){
        cy.get(':nth-child(2) > .ant-col-xs-24 > .ant-card > .ant-card-body > :nth-child(3) > .ant-col-xxl-0 > :nth-child(4) > .ant-col > .ant-space > [style=""] > .ant-btn').should('be.visible').should(regular)
        cy.get(':nth-child(2) > .ant-col-xs-24 > .ant-card > .ant-card-body > :nth-child(3) > .ant-col-xxl-0 > :nth-child(4) > .ant-col > .ant-space > :nth-child(2) > .ant-btn').should('be.visible').should(priority)
    }
    addIndvidualRecipientFromBatch(){
        cy.get('#recipientBankCountry').should('be.visible').click().get(variable1.additionalCurrenciesLocators.countryDropDownHeading).should('be.visible').type('united kingdom{enter}')
        cy.get('#recipientCurrency').should('be.visible').wait(2000).type('GBP{enter}')
        cy.get(':nth-child(4) > :nth-child(1) > .ant-form-item > .ant-row > .ant-form-item-label').should('contain.text','IBAN')
        cy.get('#iban').should('be.visible').type('GB29NWBK60161331926819')
        cy.get('#swift').should('be.visible').type('AWAXGB21')
        cy.get('#accNumber').should('be.visible').type('12345678')
        cy.get('#sortCode').should('be.visible').type('521455')
        cy.get('.ant-col-sm-17 > .ant-card > .ant-card-body').should('be.visible')
        cy.get('.ant-space-vertical > :nth-child(1) > .ant-space > [style=""] > .ant-typography').should('contain.text','Bank Detail Summary')
        cy.get('[style=""] > .ant-card > .ant-card-body').should('be.visible')
        cy.get('[style=""] > .ant-card > .ant-card-body > :nth-child(2) > .ant-col > .ant-typography').should('contain.text','Individual').click()
        cy.get('.m-t-20 > .ant-col-xs-24 > :nth-child(1) > .ant-row > .ant-form-item-label').should('be.visible').should('contain.text','First Name')
        cy.get('#firstName').scrollIntoView()
        cy.get('#firstName').should('be.visible').type('Individual Recipient')
        cy.get('#lastName').should('be.visible').type('Through Batch')
        cy.get('#address').should('be.visible').type('House no 11 Texas')
        cy.get('#beneficiaryCity').should('be.visible').type('Texas')
        cy.get('#beneficiaryCountry').should('be.visible').type('United Kingdom{enter}')
        //cy.get('#paymentPurpose').should('be.visible').click()
        //cy.get('[class="ant-select-item ant-select-item-option"]').eq(1).should('be.visible').click()
        cy.get('#submit').should('be.visible').should('be.enabled').click()
        cy.get('.ant-notification-notice-message').should('be.visible').should('contain.text','Recipient Added Successfully!')
        cy.get('.ant-card-body > .ant-row-space-between > :nth-child(1)').should('be.visible').should('contain.text','Recipient Details')
        cy.get('.ant-tabs-nav-list > :nth-child(2)').should('be.visible').click()
        cy.get('[data-row-key="0"] > :nth-child(1)').should('be.visible').should('contain.text','Individual Recipient Through Batch')

    }
    addBusinessRecipientFromBatch(){
        cy.get('#recipientBankCountry').should('be.visible').click().get(variable1.additionalCurrenciesLocators.countryDropDownHeading).should('be.visible').type('united kingdom{enter}')
        cy.get('#recipientCurrency').should('be.visible').wait(2000).type('GBP{enter}')
        cy.get(':nth-child(4) > :nth-child(1) > .ant-form-item > .ant-row > .ant-form-item-label').should('contain.text','IBAN')
        cy.get('#iban').should('be.visible').type('GB29NWBK60161331926819')
        cy.get('#swift').should('be.visible').type('AWAXGB21')
        cy.get('#accNumber').should('be.visible').type('12345677')
        cy.get('#sortCode').should('be.visible').type('521455')
        cy.get('.ant-col-sm-17 > .ant-card > .ant-card-body').should('be.visible')
        cy.get('.ant-space-vertical > :nth-child(1) > .ant-space > [style=""] > .ant-typography').should('contain.text','Bank Detail Summary')
        cy.get('.ant-space > :nth-child(2) > .ant-card > .ant-card-body').should('be.visible')
        cy.get(':nth-child(2) > .ant-card > .ant-card-body > :nth-child(2) > .ant-col > .ant-typography').should('contain.text','Business').click()
        cy.get('#businessName').scrollIntoView()
        cy.get('#businessName').type('Business Recipient Through Batch')
        cy.get('#businessDescription').should('be.visible').type('manual testing')
        cy.get('#businessNature').should('be.visible').type('automation')
        cy.get('#businessWebsite').should('be.visible').type('www.testing.com')
        cy.get('#address').should('be.visible').type('House no 11 Texas')
        cy.get('#beneficiaryCity').should('be.visible').type('Texas')
        cy.get('#beneficiaryCountry').should('be.visible').type('United Kingdom{enter}')
        //cy.get(':nth-child(8) > .ant-col-xs-24 > :nth-child(1) > .ant-row > .ant-form-item-control > .ant-form-item-control-input > .ant-form-item-control-input-content > .ant-select > .ant-select-selector').should('be.visible').click()
        //cy.get('[class="ant-select-item ant-select-item-option"]').eq(1).should('be.visible').click()
        cy.get('#submit').should('be.visible').should('be.enabled').click()
        cy.get('.ant-notification-notice-message').should('be.visible').should('contain.text','Recipient Added Successfully!')
        cy.get('.ant-card-body > .ant-row-space-between > :nth-child(1)').should('be.visible').should('contain.text','Recipient Details')
        cy.get('.ant-tabs-nav-list > :nth-child(2)').should('be.visible').click()
        cy.get('[data-row-key="0"] > :nth-child(1)').should('be.visible').should('contain.text','Business Recipient Through Batch')

    }
    viewDetails(){
        let selectedValue1;
        cy.get('.ant-select-selection-overflow').should('be.visible').click()
       
        cy.get('[class="rc-virtual-list-holder-inner"] [title*=" "]').eq(1).should('be.visible').then(option => {
             selectedValue1 = option.text(); // Get the text of the selected option
            option.click(); // Click to select the option

            // Log the selected value
            cy.log(`Selected value1: ${selectedValue1}`);
            cy.wait(3000)
        });
        //cy.get('[style="padding-left: 8px; padding-right: 8px; flex: 1 1 auto;"] > .ant-space > :nth-child(1) > .ant-typography').should('contain.text',selectedValue1)
        cy.get('[style="padding-left: 8px; padding-right: 8px; flex: 1 1 auto;"] > .ant-space > :nth-child(1) > .ant-typography')
          .should('be.visible')
          .invoke('text') // Get the text content
          .then(displayedValue => {
              // Log the displayed value
              cy.log(`Displayed value: ${displayedValue}`);
              // Compare the displayed value with selectedValue1
              expect(displayedValue).to.equal(selectedValue1);
          }).then(() => {
          cy.get('[style="padding-left: 8px; padding-right: 8px; flex: 1 1 auto;"] > .ant-row > .ant-col > .ant-typography').should('be.visible').should('contain.text','View Details').click()
          cy.get(':nth-child(1) > .ant-col > .ant-typography')
          .should('be.visible')
          .should('contain.text','Recipient Details')
          cy.get(':nth-child(4) > .ant-col > .ant-table-wrapper > .ant-spin-nested-loading > .ant-spin-container > [data-testid="container"] > .ant-table-container > .ant-table-content > table > .ant-table-tbody > .ant-table-row > :nth-child(1)')
          .should('be.visible')
          .should('contain.text',selectedValue1)
        });
    }

    cancelEasyTransfer() {
        cy.get(variable.batchPaymentsPageLocators.loadingIcon).should('not.exist');
    
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
                  .and('contain.text', 'Are you sure you want to cancel this batch payment?');
                
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
    cancelPushFunds() {
        // Click on view payment
        cy.get('.ant-row-center.m-t-20 > .ant-col > .ant-space > :nth-child(1) > .ant-btn').should('be.visible').click();
        cy.get(variable.batchPaymentsPageLocators.loadingIcon).should('not.exist');
    
        // Click on the 1st row item
        cy.get('[data-row-key="0"] > :nth-child(2)').should('be.visible').click();
    
        // Now check if the 'Cancel Payment' button exists and is visible
        cy.get('body').find('.ant-btn.ant-btn-danger').then($button => {
            if ($button.length > 0) {
                // If the button exists, click on 'Cancel Payment'
                cy.wrap($button).should('contain.text', 'Cancel Batch').and('be.visible').click();
    
                // Verify the confirmation popover
                cy.get('.ant-popover-inner-content')
                  .should('be.visible')
                  .and('contain.text', 'Are you sure you want to cancel this Batch?');
                
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
}