/// <reference types = "cypress"/>


import { SigninPage } from "../PageObject/PageAction/SigninPage"
import { NewPayment } from "../PageObject/PageAction/NewPayment"
import { PaymentsDashboard } from "../PageObject/PageAction/PaymentsDashboard"
import { AdditionalCurrencies } from "../PageObject/PageAction/AdditionalCurrencies"
import { BatchPayments } from "../PageObject/PageAction/BatchPayments"

const newRecipient = new AdditionalCurrencies
const batchPayments = new BatchPayments
const signin = new SigninPage
const paymentspage = new PaymentsDashboard
const newPayment = new NewPayment

describe('New Payment', function () {

    let userName = 'testnew@volopa.com';
    let password = 'testTest1@';
    let apiEnv;   // dynamic env stored here

    beforeEach(() => {

        cy.visit('https://webapp04.volopa-dev.com/', { timeout: 10000 });
        cy.viewport(1440, 1000);

        cy.url().then((url) => {

            // Extract env number dynamically from webappXX
            const match = url.match(/webapp(\d+)\./);
            const envNumber = match ? match[1] : '01';  

            apiEnv = `VolopaApiOauth2WebApp${envNumber}`;
            Cypress.env("apiEnv", apiEnv);
        });

    });

    it('TC_NP_001 - Verify that user landed on the New Payment page', function(){
        signin.Login(userName, password)
        paymentspage.goToPaymentsDashborad()
        newPayment.goToNewPaymentPage()
    })
    it('TC_NP_002 - Verify that user can search the existing recipients in the search bar', function(){
        signin.Login(userName, password)
        paymentspage.goToPaymentsDashborad()
        newPayment.goToNewPaymentPage()
        newPayment.validateSearchField('Y17{enter}')
    })
    it('TC_NP_003 - Verify that "Add recipient" button under Seach Bar navigates to Recipient Details Page', function(){
        signin.Login(userName, password)
        paymentspage.goToPaymentsDashborad()
        newPayment.goToNewPaymentPage()
        newPayment.validateAddRecipient()
    })
    it('TC_NP_004 - Verify that user is able to navigate Create a Payment page', function(){
        signin.Login(userName, password)
        paymentspage.goToPaymentsDashborad()
        newPayment.goToNewPaymentPage()
        newPayment.validateSearchField('qa tester{enter}')
    })
    xit('TC_NP_005 - Verify that Funding Method (Easy Transfer) is not available for currencies other than GBP and Euro', function(){
        paymentspage.goToPaymentsDashborad()
        newPayment.goToNewPaymentPage()
        newPayment.validateSearchField('hamza QA{enter}')
        newPayment.selectCurrency("AUD")
        newPayment.checkFundingMethod()
    })
    xit('TC_NP_006 - Verify that FX rate is appearing and will refresh every 30 seconds.', function(){
        signin.Login(userName, password)
        paymentspage.goToPaymentsDashborad()
        newPayment.goToNewPaymentPage()
        newPayment.validateSearchField('hamza QA{enter}')
        newPayment.proceedflow('{enter}','GBP')
        cy.get('#youSend').type('200')
        newPayment.validateFxRateTimer()
    })
    xit('TC_NP_007 - Verify that user is able to navigate "Recipient Details" on clicking the "View Details" button under the "Recipient Details" tag present on Create a payment Page', function(){
        signin.Login(userName, password)
        paymentspage.goToPaymentsDashborad()
        newPayment.goToNewPaymentPage()
        newPayment.validateSearchField('hamza QA{enter}')
        cy.get(':nth-child(1) > .ant-col-24 > .ant-card > .ant-card-body > .ant-row-space-between > :nth-child(1)').should('contain.text','Recipient Details')
        cy.get('[style="padding-left: 12px; padding-right: 12px; flex: 1 1 auto;"] > .ant-row > .ant-col').should('be.visible').click()
        cy.get(':nth-child(1) > .ant-col > .ant-typography').should('contain.text','Recipient Details')
    })
    xit('TC_NP_008 - Verify that user is able to pay the recipient (Not yapily flow - Currencies other than "Euro" and "GBP")', function(){
        paymentspage.goToPaymentsDashborad()
        newPayment.goToNewPaymentPage()
        newPayment.validateSearchField('hamza QA{enter}')
        newPayment.proceedflow('{downarrow}{enter}','USD')
        cy.get('#youSend').type('200')
        newPayment.validatePayTheRecipient()
        newPayment.validateVeiwPayment()
        cy.get('.ant-tabs-nav-list > :nth-child(5)').click()
        cy.get('[data-row-key="0"] > :nth-child(2)').should('exist')
        const date = '[data-row-key="0"] > :nth-child(2)'
        cy.get(date).then($dateElement => {
            // Assuming the date is stored as text inside the element
            const dateValue = $dateElement.text();
            cy.log('Date value:', dateValue);
        })
        cy.get('[data-row-key="0"] > :nth-child(3)').should('exist')
        const payment = '[data-row-key="0"] > :nth-child(3)'
        cy.get(payment).then($payment => {
            // Assuming the date is stored as text inside the element
            const paymentstatus = $payment.text();
            cy.log('payment:', paymentstatus);
            cy.get('[data-row-key="0"] > :nth-child(2)').click()
            cy.get(':nth-child(4) > .ant-card-body > .ant-row > :nth-child(2)').should('exist')
        const payment1 = ':nth-child(4) > .ant-card-body > .ant-row > :nth-child(2)'
        cy.get(payment1).then($payment1 => {
            // Assuming the date is stored as text inside the element
            const paymentstatus1 = $payment1.text();
            cy.log('payment:', paymentstatus1);
            expect(paymentstatus).to.equal(paymentstatus1)
        })
        })
    })
    it('TC_NP_009 - Verify that after paying the recipient, user is able to proceed to a new payment', function(){
        signin.Login(userName, password)
        paymentspage.goToPaymentsDashborad()
        newPayment.goToNewPaymentPage()
        newPayment.validateSearchField('hamza QA{enter}')
        newPayment.proceedflow('{enter}','GBP')
        cy.get('#youSend').type('200')
        newPayment.validatePayTheRecipient()
        cy.get(':nth-child(3) > .ant-btn').should('be.visible').and('contain.text','New Payment').click()//new payment
        cy.get(':nth-child(1) > .ant-col > .ant-typography').should('be.visible').and('contain.text','Create a Payment')
    })
    it('TC_NP_010 - Verify that after paying the recipient, user is able to naviagte to view payment', function(){
        signin.Login(userName, password)
        paymentspage.goToPaymentsDashborad()
        newPayment.goToNewPaymentPage()
        newPayment.validateSearchField('hamza QA{enter}')
        newPayment.proceedflow('{enter}','GBP')
        cy.get('#youSend').type('200')
        newPayment.validatePayTheRecipient()
        cy.get('.ant-row-center.m-t-20 > .ant-col > .ant-space > :nth-child(2) > .ant-btn').should('be.visible').and('contain.text','View Payment').click()
        cy.get(':nth-child(1) > .ant-col > .ant-typography').should('be.visible').and('contain.text','Payment History')
    })  
// special cases 
    // push fund
    it('TC_NP_011 - Verify that payments to the recipients with ABA code with currency USD & country US should have both Settlement Methods (Regular, priority) enabled. using GBP and push funds.', function(){
        signin.Login(userName, password)
        newRecipient.goToPaymentsDashborad()
        newRecipient.gotoRecipientList()
        let email = batchPayments.generateRandomString(5)+ '@yopmail.com'
        batchPayments.addRecipient('United States{enter}' ,'USD{enter}' ,email)
        newRecipient.addBankDetailsWithAccNo('MMMCUS44','55555555')
        cy.get('#aba').type('026009593')
        const lName = batchPayments.generateRandomString(6)
        batchPayments.individualRecipient('INDIVIDUAL USD PF',lName,'UNITED States{enter}')
        newRecipient.postCodeStateUS()
        batchPayments.paymentPurposeGBPEUR()
        cy.get('.ant-select-selector').eq(4).click()
        cy.get('.ant-select-dropdown').eq(4).find('.ant-select-item-option-content').then(Element=>{
            let purposeList = Element.text()
            cy.log(purposeList)
            cy.wrap(purposeList).as('purposeList')
        })
        newRecipient.saveRecipient()
        newPayment.checkSettelment('be.enabled','be.enabled')
        newPayment.proceedflow('{downarrow}{enter}','GBP')
        let amount = '125'
        newPayment.addrecipientDetail(amount, email)
        newPayment.selectFundingMethod('Push Funds')

          // ───── Intercept Quote API ─────
  cy.intercept(
            'POST',
            `https://main-api.volopa-dev.com/${Cypress.env("apiEnv")}/exchange/b2b/self/quote/temp`
        ).as('quoteApi');

  // ───── Wait for API and Compare Values ─────
  cy.wait('@quoteApi').then(({ response }) => {
    const receive = response.body.data.receive;
    const recipientReceives = response.body.data.recipient[0].receives;

    cy.wrap(recipientReceives).as('recipientReceives');
    cy.log(`Receive: ${receive}`);
    cy.log(`Recipient Receives: ${recipientReceives}`);

    expect(receive).to.eq(recipientReceives); // Final comparison
  });

         //Validate the selected payment purpose
         cy.get('@selectedValue').then(selectedValue=>{
            cy.get('.ant-col-sm-20 > :nth-child(2) > :nth-child(1) > .ant-form-item > .ant-row > .ant-col > .ant-form-item-control-input > .ant-form-item-control-input-content > .ant-select > .ant-select-selector')
            .should('be.visible').and('contain.text',selectedValue)
        })
         //Validate Purpose on batch payment
        cy.get('.ant-select-selector').eq(2).click()
        cy.get('.ant-select-dropdown').eq(2).find('.ant-select-item-option-content').then(Element=>{
            let list = Element.text()
            cy.log(list)
            cy.get('@purposeList').then(purposeList=>{
            expect(list).to.eq(purposeList)
            cy.get('.ant-select-selector').eq(2).click()
            })
            })
             // Validating recipient recived amount
          cy.get(':nth-child(4) > :nth-child(2) > .ant-typography').invoke('text').then((text) => {
            const storedText = text
            cy.wrap(storedText).as('storedText')
            cy.log(storedText)
            })
            cy.get('.ant-col > .ant-btn > span').should('be.visible').click()
            cy.get('.ant-modal-body > :nth-child(1) > .ant-col > .ant-typography').should('be.visible').should('contain.text','Payment Confirmation')
            cy.get('@storedText').then(storedText=>{
                cy.get(':nth-child(5) > .ant-col-8 > .ant-typography')
                .should('be.visible').and('contain.text',storedText)
            })
            cy.get('.ant-row-center.m-t-20 > .ant-col > .ant-space > :nth-child(2) > .ant-btn').should('be.visible').click() // pay recipient
            cy.get('.ant-modal-body > :nth-child(1) > .ant-col').should('be.visible').should('contain.text',' Payment Booked - ')
            cy.get('@storedText').then(storedText=>{
                cy.get(':nth-child(5) > .ant-col-8 > .ant-typography')
                .should('be.visible').and('contain.text',storedText)
            })
    })
    it('TC_NP_012 - Verify that payments to the recipients without ABA code with currency USD & country US should have both Settlement Methods (Regular, priority) enabled. using GBP and push funds.', function(){
        signin.Login(userName, password)
        newRecipient.goToPaymentsDashborad()
      newRecipient.gotoRecipientList()
      let email = batchPayments.generateRandomString(5)+ '@yopmail.com'
      batchPayments.addRecipient('United States{enter}' ,'USD{enter}' ,email)
      newRecipient.addBankDetailsWithAccNo('MMMCUS44','55555555')
      const lName = batchPayments.generateRandomString(6)
      batchPayments.individualRecipient('INDIVIDUAL USD PF',lName,'UNITED States{enter}')
      newRecipient.postCodeStateUS()
      batchPayments.paymentPurposeGBPEUR()
      cy.get('.ant-select-selector').eq(4).click()
      cy.get('.ant-select-dropdown').eq(4).find('.ant-select-item-option-content').then(Element=>{
          let purposeList = Element.text()
          cy.log(purposeList)
          cy.wrap(purposeList).as('purposeList')
        })
      newRecipient.saveRecipient()
      newPayment.checkSettelment('be.disabled','be.enabled')
      newPayment.proceedflow('{downarrow}{enter}','GBP')
      let amount = '125'
      newPayment.addrecipientDetail(amount, email)
      newPayment.selectFundingMethod('Push Funds')

        // ───── Intercept Quote API ─────
  cy.intercept(
            'POST',
            `https://main-api.volopa-dev.com/${Cypress.env("apiEnv")}/exchange/b2b/self/quote/temp`
        ).as('quoteApi');

  // ───── Wait for API and Compare Values ─────
  cy.wait('@quoteApi').then(({ response }) => {
    const receive = response.body.data.receive;
    const recipientReceives = response.body.data.recipient[0].receives;

    cy.wrap(recipientReceives).as('recipientReceives');
    cy.log(`Receive: ${receive}`);
    cy.log(`Recipient Receives: ${recipientReceives}`);

    expect(receive).to.eq(recipientReceives); // Final comparison
  });
      //Validate the selected payment purpose
      cy.get('@selectedValue').then(selectedValue=>{
         cy.get('.ant-col-sm-20 > :nth-child(2) > :nth-child(1) > .ant-form-item > .ant-row > .ant-col > .ant-form-item-control-input > .ant-form-item-control-input-content > .ant-select > .ant-select-selector')
         .should('be.visible').and('contain.text',selectedValue)
        })
       //Validate Purpose on batch payment
      cy.get('.ant-select-selector').eq(2).click()
      cy.get('.ant-select-dropdown').eq(2).find('.ant-select-item-option-content').then(Element=>{
          let list = Element.text()
          cy.log(list)
          cy.get('@purposeList').then(purposeList=>{
          expect(list).to.eq(purposeList)
          cy.get('.ant-select-selector').eq(2).click()
          })
          })
                // Validating recipient recived amount
        cy.get(':nth-child(4) > :nth-child(2) > .ant-typography').invoke('text').then((text) => {
            const storedText = text
            cy.wrap(storedText).as('storedText')
            cy.log(storedText)
            })
        cy.get('.ant-col > .ant-btn > span').should('be.visible').click()
        cy.get('.ant-modal-body > :nth-child(1) > .ant-col > .ant-typography').should('be.visible').should('contain.text','Payment Confirmation')
        cy.get('@storedText').then(storedText=>{
        cy.get(':nth-child(5) > .ant-col-8 > .ant-typography')
            .should('be.visible').and('contain.text',storedText)
        })
        cy.get('.ant-row-center.m-t-20 > .ant-col > .ant-space > :nth-child(2) > .ant-btn').should('be.visible').click() // pay recipient
        cy.get('.ant-modal-body > :nth-child(1) > .ant-col').should('be.visible').should('contain.text',' Payment Booked - ')
        cy.get('@storedText').then(storedText=>{
        cy.get(':nth-child(5) > .ant-col-8 > .ant-typography')
            .should('be.visible').and('contain.text',storedText)
        })
    })
    it('TC_NP_013 - Verify that payments to the recipients without ABA code with currency EUR & country US should have only priority Settlement Method enabled using GBP and push funds.', function(){
        signin.Login(userName, password)
        newRecipient.goToPaymentsDashborad()
      newRecipient.gotoRecipientList()
      let email = batchPayments.generateRandomString(5)+ '@yopmail.com'
      batchPayments.addRecipient('United States{enter}' ,'EUR{enter}' ,email)
      newRecipient.addBankDetailsWithAccNo('MMMCUS44','55555555')
      const lName = batchPayments.generateRandomString(6)
      batchPayments.individualRecipient('INDIVIDUAL EUR PF',lName,'UNITED States{enter}')
      newRecipient.postCodeStateUS()
      batchPayments.paymentPurposeGBPEUR()
      cy.get('.ant-select-selector').eq(4).click()
      cy.get('.ant-select-dropdown').eq(4).find('.ant-select-item-option-content').then(Element=>{
          let purposeList = Element.text()
          cy.log(purposeList)
          cy.wrap(purposeList).as('purposeList')
      })
      newRecipient.saveRecipient()
      newPayment.checkSettelment('be.disabled','be.enabled')
      newPayment.proceedflow('{enter}','GBP')
      let amount = '225'
      newPayment.addrecipientDetail(amount, email)
      newPayment.selectFundingMethod('Push Funds')

        // ───── Intercept Quote API ─────
  cy.intercept(
            'POST',
            `https://main-api.volopa-dev.com/${Cypress.env("apiEnv")}/exchange/b2b/self/quote/temp`
        ).as('quoteApi');

  // ───── Wait for API and Compare Values ─────
  cy.wait('@quoteApi').then(({ response }) => {
    const receive = response.body.data.receive;
    const recipientReceives = response.body.data.recipient[0].receives;

    cy.wrap(recipientReceives).as('recipientReceives');
    cy.log(`Receive: ${receive}`);
    cy.log(`Recipient Receives: ${recipientReceives}`);

    expect(receive).to.eq(recipientReceives); // Final comparison
  });
      //Validate the selected payment purpose
      cy.get('@selectedValue').then(selectedValue=>{
         cy.get('.ant-col-sm-20 > :nth-child(2) > :nth-child(1) > .ant-form-item > .ant-row > .ant-col > .ant-form-item-control-input > .ant-form-item-control-input-content > .ant-select > .ant-select-selector')
         .should('be.visible').and('contain.text',selectedValue)
        })
       //Validate Purpose on batch payment
      cy.get('.ant-select-selector').eq(2).click()
      cy.get('.ant-select-dropdown').eq(2).find('.ant-select-item-option-content').then(Element=>{
          let list = Element.text()
          cy.log(list)
          cy.get('@purposeList').then(purposeList=>{
          expect(list).to.eq(purposeList)
          cy.get('.ant-select-selector').eq(2).click()
          })
          })
                // Validating recipient recived amount
                cy.get(':nth-child(4) > :nth-child(2) > .ant-typography').invoke('text').then((text) => {
                    const storedText = text
                    cy.wrap(storedText).as('storedText')
                    cy.log(storedText)
                    })
                cy.get('.ant-col > .ant-btn > span').should('be.visible').click()
                cy.get('.ant-modal-body > :nth-child(1) > .ant-col > .ant-typography').should('be.visible').should('contain.text','Payment Confirmation')
                cy.get('@storedText').then(storedText=>{
                cy.get(':nth-child(5) > .ant-col-8 > .ant-typography')
                    .should('be.visible').and('contain.text',storedText)
                })
                cy.get('.ant-row-center.m-t-20 > .ant-col > .ant-space > :nth-child(2) > .ant-btn').should('be.visible').click() // pay recipient
                cy.get('.ant-modal-body > :nth-child(1) > .ant-col').should('be.visible').should('contain.text',' Payment Booked - ')
                cy.get('@storedText').then(storedText=>{
                cy.get(':nth-child(5) > .ant-col-8 > .ant-typography')
                    .should('be.visible').and('contain.text',storedText)
                })
    })
    it('TC_NP_014 - Verify that payments to the recipients with ABA code with country US & currency Euro should have only priority Settlement Method enabled. using GBP and push funds.', function(){
        signin.Login(userName, password)
    newRecipient.goToPaymentsDashborad()
    newRecipient.gotoRecipientList()
    let email = batchPayments.generateRandomString(5)+ '@yopmail.com'
    batchPayments.addRecipient('United States{enter}' ,'EUR{enter}' ,email)
    newRecipient.addBankDetailsWithAccNo('MMMCUS44','55555555')
    cy.get('#aba').type('026009593')
    const lName = batchPayments.generateRandomString(6)
    batchPayments.individualRecipient('INDIVIDUAL EUR PF',lName,'UNITED States{enter}')
    newRecipient.postCodeStateUS()
    batchPayments.paymentPurposeGBPEUR()
    cy.get('.ant-select-selector').eq(4).click()
    cy.get('.ant-select-dropdown').eq(4).find('.ant-select-item-option-content').then(Element=>{
        let purposeList = Element.text()
        cy.log(purposeList)
        cy.wrap(purposeList).as('purposeList')
    })
    newRecipient.saveRecipient()
    newPayment.checkSettelment('be.disabled','be.enabled')
    newPayment.proceedflow('{enter}','GBP')
    let amount = '325'
    newPayment.addrecipientDetail(amount, email)
    newPayment.selectFundingMethod('Push Funds')

      // ───── Intercept Quote API ─────
  cy.intercept(
            'POST',
            `https://main-api.volopa-dev.com/${Cypress.env("apiEnv")}/exchange/b2b/self/quote/temp`
        ).as('quoteApi');

  // ───── Wait for API and Compare Values ─────
  cy.wait('@quoteApi').then(({ response }) => {
    const receive = response.body.data.receive;
    const recipientReceives = response.body.data.recipient[0].receives;

    cy.wrap(recipientReceives).as('recipientReceives');
    cy.log(`Receive: ${receive}`);
    cy.log(`Recipient Receives: ${recipientReceives}`);

    expect(receive).to.eq(recipientReceives); // Final comparison
  });
    //Validate the selected payment purpose
    cy.get('@selectedValue').then(selectedValue=>{
       cy.get('.ant-col-sm-20 > :nth-child(2) > :nth-child(1) > .ant-form-item > .ant-row > .ant-col > .ant-form-item-control-input > .ant-form-item-control-input-content > .ant-select > .ant-select-selector')
       .should('be.visible').and('contain.text',selectedValue)
      })
     //Validate Purpose on batch payment
    cy.get('.ant-select-selector').eq(2).click()
    cy.get('.ant-select-dropdown').eq(2).find('.ant-select-item-option-content').then(Element=>{
        let list = Element.text()
        cy.log(list)
        cy.get('@purposeList').then(purposeList=>{
        expect(list).to.eq(purposeList)
        cy.get('.ant-select-selector').eq(2).click()
    })
      })
                // Validating recipient recived amount
                cy.get(':nth-child(4) > :nth-child(2) > .ant-typography').invoke('text').then((text) => {
                    const storedText = text
                    cy.wrap(storedText).as('storedText')
                    cy.log(storedText)
                    })
                cy.get('.ant-col > .ant-btn > span').should('be.visible').click()
                cy.get('.ant-modal-body > :nth-child(1) > .ant-col > .ant-typography').should('be.visible').should('contain.text','Payment Confirmation')
                cy.get('@storedText').then(storedText=>{
                cy.get(':nth-child(5) > .ant-col-8 > .ant-typography')
                    .should('be.visible').and('contain.text',storedText)
                })
                cy.get('.ant-row-center.m-t-20 > .ant-col > .ant-space > :nth-child(2) > .ant-btn').should('be.visible').click() // pay recipient
                cy.get('.ant-modal-body > :nth-child(1) > .ant-col').should('be.visible').should('contain.text',' Payment Booked - ')
                cy.get('@storedText').then(storedText=>{
                cy.get(':nth-child(5) > .ant-col-8 > .ant-typography')
                    .should('be.visible').and('contain.text',storedText)
                })
    })
    it('TC_NP_015 - Verify that payments to the recipients without ABA code with country US & currency Euro should have only priority Settlement Method enabled. using GBP and push funds.', function(){
        signin.Login(userName, password)
        newRecipient.goToPaymentsDashborad()
        newRecipient.gotoRecipientList()
        let email = batchPayments.generateRandomString(5)+ '@yopmail.com'
        batchPayments.addRecipient('United States{enter}' ,'EUR{enter}' ,email)
        newRecipient.addBankDetailsWithAccNo('MMMCUS44','55555555')
        cy.get('#aba').type('026009593')
        const lName = batchPayments.generateRandomString(6)
        batchPayments.individualRecipient('INDIVIDUAL EUR PF',lName,'UNITED States{enter}')
        newRecipient.postCodeStateUS()
        batchPayments.paymentPurposeGBPEUR()
        cy.get('.ant-select-selector').eq(4).click()
        cy.get('.ant-select-dropdown').eq(4).find('.ant-select-item-option-content').then(Element=>{
            let purposeList = Element.text()
            cy.log(purposeList)
            cy.wrap(purposeList).as('purposeList')
        })
        newRecipient.saveRecipient()
        newPayment.checkSettelment('be.disabled','be.enabled')
        newPayment.proceedflow('{enter}','GBP')
        let amount = '425'
        newPayment.addrecipientDetail(amount, email)
        newPayment.selectFundingMethod('Push Funds')

          // ───── Intercept Quote API ─────
  cy.intercept(
            'POST',
            `https://main-api.volopa-dev.com/${Cypress.env("apiEnv")}/exchange/b2b/self/quote/temp`
        ).as('quoteApi');

  // ───── Wait for API and Compare Values ─────
  cy.wait('@quoteApi').then(({ response }) => {
    const receive = response.body.data.receive;
    const recipientReceives = response.body.data.recipient[0].receives;

    cy.wrap(recipientReceives).as('recipientReceives');
    cy.log(`Receive: ${receive}`);
    cy.log(`Recipient Receives: ${recipientReceives}`);

    expect(receive).to.eq(recipientReceives); // Final comparison
  });
         //Validate Purpose on batch payment
        cy.get('.ant-select-selector').eq(2).click()
        cy.get('.ant-select-dropdown').eq(2).find('.ant-select-item-option-content').then(Element=>{
            let list = Element.text()
            cy.log(list)
            cy.get('@purposeList').then(purposeList=>{
            expect(list).to.eq(purposeList)
            cy.get('.ant-select-selector').eq(2).click()
        })
          })
            cy.get('.ant-col > .ant-btn > span').should('be.visible').click()
            cy.get('.ant-modal-body > :nth-child(1) > .ant-col > .ant-typography').should('be.visible').should('contain.text','Payment Confirmation')
            cy.get('.ant-row-center.m-t-20 > .ant-col > .ant-space > :nth-child(2) > .ant-btn').should('be.visible').click() // pay recipient
            cy.get('.ant-modal-body > :nth-child(1) > .ant-col').should('be.visible').should('contain.text',' Payment Booked - ')
    })
    it('TC_NP_017 - Add 1 recipient(individual) from the "Add Recipient" page with country = United Arab Emirates and currency = AED. After adding, make a single payment to the recipient using GBP and push funds.', function(){
        signin.Login(userName, password)
        newRecipient.goToPaymentsDashborad()
        newRecipient.gotoRecipientList()
        let email = batchPayments.generateRandomString(5)+ '@yopmail.com'
        batchPayments.addRecipient('United Arab Emirates{enter}' ,'AED{enter}' ,email)
        newRecipient.addBankDetails('AE070331234567890123456','AARPAEAA')
        const lName = batchPayments.generateRandomString(6)
        batchPayments.individualRecipient('INDIVIDUAL AED PF',lName,'United Arab Emirates{enter}')
        batchPayments.paymentPurpose()
        cy.get('.ant-select-selector').eq(3).click()
        cy.get('.ant-select-dropdown').eq(3).find('.ant-select-item-option-content').then(Element=>{
            let purposeList = Element.text()
            cy.log(purposeList)
            cy.wrap(purposeList).as('purposeList')
        })
        newRecipient.saveRecipient()
        newPayment.checkSettelment('be.disabled','be.enabled')
        newPayment.proceedflow('{downarrow}{enter}','GBP')
        let amount = '125'
        newPayment.addrecipientDetail(amount, email)
        newPayment.selectFundingMethod('Push Funds')

          // ───── Intercept Quote API ─────
  cy.intercept(
            'POST',
            `https://main-api.volopa-dev.com/${Cypress.env("apiEnv")}/exchange/b2b/self/quote/temp`
        ).as('quoteApi');

  // ───── Wait for API and Compare Values ─────
  cy.wait('@quoteApi').then(({ response }) => {
    const receive = response.body.data.receive;
    const recipientReceives = response.body.data.recipient[0].receives;

    cy.wrap(recipientReceives).as('recipientReceives');
    cy.log(`Receive: ${receive}`);
    cy.log(`Recipient Receives: ${recipientReceives}`);

    expect(receive).to.eq(recipientReceives); // Final comparison
  });
         //Validate Purpose on batch payment
        cy.get('.ant-select-selector').eq(2).click()
        cy.get('.ant-select-dropdown').eq(2).find('.ant-select-item-option-content').then(Element=>{
            let list = Element.text()
            cy.log(list)
            cy.get('@purposeList').then(purposeList=>{
            expect(list).to.eq(purposeList)
            cy.get('.ant-select-selector').eq(2).click()
        })
          })
            cy.get('.ant-col > .ant-btn > span').should('be.visible').click()
            cy.get('.ant-modal-body > :nth-child(1) > .ant-col > .ant-typography').should('be.visible').should('contain.text','Payment Confirmation')
            cy.get('.ant-row-center.m-t-20 > .ant-col > .ant-space > :nth-child(2) > .ant-btn').should('be.visible').click() // pay recipient
            cy.get('.ant-modal-body > :nth-child(1) > .ant-col').should('be.visible').should('contain.text',' Payment Booked - ')
            //////newPayment.cancelPushFunds()
    })
    it('TC_NP_018 - Add 1 recipient(individual) from the "Add Recipient" page with country = India and currency = INR. After adding, make a single payment to the recipient using GBP and push funds.', function(){
        signin.Login(userName, password)
        newRecipient.goToPaymentsDashborad()
        newRecipient.gotoRecipientList()
        let email = batchPayments.generateRandomString(5)+ '@yopmail.com'
        batchPayments.addRecipient('INDIA{downarrow}{enter}' ,'INR{enter}' ,email)
        newRecipient.addIndiaBankDetail()
        const lName = batchPayments.generateRandomString(6)
        batchPayments.individualRecipient('INDIVIDUAL INR PF',lName,'INDIA{downarrow}{enter}')
        batchPayments.paymentPurpose()
        cy.get('.ant-select-selector').eq(3).click()
        cy.get('.ant-select-dropdown').eq(3).find('.ant-select-item-option-content').then(Element=>{
            let purposeList = Element.text()
            cy.log(purposeList)
            cy.wrap(purposeList).as('purposeList')
        })
        newRecipient.saveRecipient()
        newPayment.checkSettelment('be.enabled','be.disabled')
        newPayment.proceedflow('{downarrow}{enter}','GBP')
        let amount = '125'
        newPayment.addrecipientDetail(amount, email)
        newPayment.selectFundingMethod('Push Funds')

          // ───── Intercept Quote API ─────
  cy.intercept(
            'POST',
            `https://main-api.volopa-dev.com/${Cypress.env("apiEnv")}/exchange/b2b/self/quote/temp`
        ).as('quoteApi');

  // ───── Wait for API and Compare Values ─────
  cy.wait('@quoteApi').then(({ response }) => {
    const receive = response.body.data.receive;
    const recipientReceives = response.body.data.recipient[0].receives;

    cy.wrap(recipientReceives).as('recipientReceives');
    cy.log(`Receive: ${receive}`);
    cy.log(`Recipient Receives: ${recipientReceives}`);

    expect(receive).to.eq(recipientReceives); // Final comparison
  });
         //Validate Purpose on batch payment
        cy.get('.ant-select-selector').eq(2).click()
        cy.get('.ant-select-dropdown').eq(2).find('.ant-select-item-option-content').then(Element=>{
            let list = Element.text()
            cy.log(list)
            cy.get('@purposeList').then(purposeList=>{
            expect(list).to.eq(purposeList)
            cy.get('.ant-select-selector').eq(2).click()
        })
          })
          newPayment.iNRDetails()
            cy.get('.ant-col > .ant-btn > span').should('be.visible').click()
            cy.get('.ant-modal-body > :nth-child(1) > .ant-col > .ant-typography').should('be.visible').should('contain.text','Payment Confirmation')
            cy.get('.ant-row-center.m-t-20 > .ant-col > .ant-space > :nth-child(2) > .ant-btn').should('be.visible').click() // pay recipient
            cy.get('.ant-modal-body > :nth-child(1) > .ant-col').should('be.visible').should('contain.text',' Payment Booked - ')
            //////newPayment.cancelPushFunds()
    })
    it('TC_NP_019 - Add 1 recipient(individual) from the "Add Recipient" page with country = CHINA and currency = CNY. After adding, make a single payment to the recipient using GBP and push funds.', function(){
        signin.Login(userName, password)
        newRecipient.goToPaymentsDashborad()
        newRecipient.gotoRecipientList()
        let email = batchPayments.generateRandomString(5)+ '@yopmail.com'
        batchPayments.addRecipient('CHINA{enter}' ,'CNY{enter}' ,email)
        newRecipient.addBankDetailsChina('AYCLCNBY','55555555','501100000011')
        const bName = batchPayments.generateRandomString(6)
        batchPayments.addBusinessRecipient('INDIVIDUAL PF'+' '+bName,'CHINA{enter}')
        batchPayments.paymentPurposeGBPEUR()
        cy.get('.ant-select-selector').eq(3).click()
        cy.get('.ant-select-dropdown').eq(3).find('.ant-select-item-option-content').then(Element=>{
            let purposeList = Element.text()
            cy.log(purposeList)
            cy.wrap(purposeList).as('purposeList')
        })
        newRecipient.saveRecipient()
        newPayment.checkSettelment('be.disabled','be.enabled')
        newPayment.proceedflow('{downarrow}{enter}','GBP')
        let amount = '260'
        newPayment.addrecipientDetail(amount, email)
        newPayment.selectFundingMethod('Push Funds')

          // ───── Intercept Quote API ─────
  cy.intercept(
            'POST',
            `https://main-api.volopa-dev.com/${Cypress.env("apiEnv")}/exchange/b2b/self/quote/temp`
        ).as('quoteApi');

  // ───── Wait for API and Compare Values ─────
  cy.wait('@quoteApi').then(({ response }) => {
    const receive = response.body.data.receive;
    const recipientReceives = response.body.data.recipient[0].receives;

    cy.wrap(recipientReceives).as('recipientReceives');
    cy.log(`Receive: ${receive}`);
    cy.log(`Recipient Receives: ${recipientReceives}`);

    expect(receive).to.eq(recipientReceives); // Final comparison
  });
         //Validate Purpose on batch payment
        cy.get('.ant-select-selector').eq(2).click()
        cy.get('.ant-select-dropdown').eq(2).find('.ant-select-item-option-content').then(Element=>{
            let list = Element.text()
            cy.log(list)
            cy.get('@purposeList').then(purposeList=>{
            expect(list).to.eq(purposeList)
            cy.get('.ant-select-selector').eq(2).click()
        })
          })
            cy.get('.ant-col > .ant-btn > span').should('be.visible').click()
            cy.get('.ant-modal-body > :nth-child(1) > .ant-col > .ant-typography').should('be.visible').should('contain.text','Payment Confirmation')
            cy.get('.ant-row-center.m-t-20 > .ant-col > .ant-space > :nth-child(2) > .ant-btn').should('be.visible').click() // pay recipient
            cy.get('.ant-modal-body > :nth-child(1) > .ant-col').should('be.visible').should('contain.text',' Payment Booked - ')
            //////newPayment.cancelPushFunds()
    })
    it('TC_NP_020 - Add 1 recipient(individual) from the "Add Recipient" page with country = United Kingdom and currency = EUR. After adding, make a single payment to the recipient using GBP and push funds.', function(){
        signin.Login(userName, password)
        newRecipient.goToPaymentsDashborad()
        newRecipient.gotoRecipientList()
        let email = batchPayments.generateRandomString(5)+ '@yopmail.com'
        batchPayments.addRecipient('United Kingdom{enter}' ,'EUR{enter}' ,email)
        newRecipient.addBankDetails('GB73BARC20039538243547','AFFLGB22')
        const lName = batchPayments.generateRandomString(6)
        batchPayments.individualRecipient('INDIVIDUAL EUR PF',lName,'United Kingdom{enter}')
        batchPayments.paymentPurposeGBPEUR()
        cy.get('.ant-select-selector').eq(3).click()
        cy.get('.ant-select-dropdown').eq(3).find('.ant-select-item-option-content').then(Element=>{
            let purposeList = Element.text()
            cy.log(purposeList)
            cy.wrap(purposeList).as('purposeList')
        })
        newRecipient.saveRecipient()
        newPayment.checkSettelment('be.enabled','be.enabled')
        newPayment.proceedflow('{enter}','GBP')
        let amount = '125'
        newPayment.addrecipientDetail(amount, email)
        newPayment.selectFundingMethod('Push Funds')

          // ───── Intercept Quote API ─────
  cy.intercept(
            'POST',
            `https://main-api.volopa-dev.com/${Cypress.env("apiEnv")}/exchange/b2b/self/quote/temp`
        ).as('quoteApi');

  // ───── Wait for API and Compare Values ─────
  cy.wait('@quoteApi').then(({ response }) => {
    const receive = response.body.data.receive;
    const recipientReceives = response.body.data.recipient[0].receives;

    cy.wrap(recipientReceives).as('recipientReceives');
    cy.log(`Receive: ${receive}`);
    cy.log(`Recipient Receives: ${recipientReceives}`);

    expect(receive).to.eq(recipientReceives); // Final comparison
  });
         //Validate Purpose on batch payment
        cy.get('.ant-select-selector').eq(2).click()
        cy.get('.ant-select-dropdown').eq(2).find('.ant-select-item-option-content').then(Element=>{
            let list = Element.text()
            cy.log(list)
            cy.get('@purposeList').then(purposeList=>{
            expect(list).to.eq(purposeList)
            cy.get('.ant-select-selector').eq(2).click()
        })
          })
            cy.get('.ant-col > .ant-btn > span').should('be.visible').click()
            cy.get('.ant-modal-body > :nth-child(1) > .ant-col > .ant-typography').should('be.visible').should('contain.text','Payment Confirmation')
            cy.get('.ant-row-center.m-t-20 > .ant-col > .ant-space > :nth-child(2) > .ant-btn').should('be.visible').click() // pay recipient
            cy.get('.ant-modal-body > :nth-child(1) > .ant-col').should('be.visible').should('contain.text',' Payment Booked - ')
            //////newPayment.cancelPushFunds()
    })
    it('TC_NP_021 - Add 1 recipient(individual) from the "Add Recipient" page with country = United Kingdom and currency = GBP. After adding, make a single payment to the recipient using EUR and push funds.', function(){
        signin.Login(userName, password)
        newRecipient.goToPaymentsDashborad()
        newRecipient.gotoRecipientList()
        let email = batchPayments.generateRandomString(5)+ '@yopmail.com'
        batchPayments.addRecipient('United Kingdom{enter}' ,'GBP{enter}' ,email)
        newRecipient.addBankDetails('GB73BARC20039538243547','AFFLGB22')
        cy.get(':nth-child(4) > .ant-form-item > .ant-row > .ant-form-item-label > label > .ant-typography').should('be.visible').should('contain.text','Sort Code')
        cy.get('#sortCode').type('770440')
        const lName = batchPayments.generateRandomString(6)
        batchPayments.individualRecipient('INDIVIDUAL GBP PF',lName,'United Kingdom{enter}')
        batchPayments.paymentPurposeGBPEUR()
        cy.get('.ant-select-selector').eq(3).click()
        cy.get('.ant-select-dropdown').eq(3).find('.ant-select-item-option-content').then(Element=>{
            let purposeList = Element.text()
            cy.log(purposeList)
            cy.wrap(purposeList).as('purposeList')
        })
        newRecipient.saveRecipient()
        newPayment.checkSettelment('be.disabled','be.enabled')
        newPayment.proceedflow('{enter}','EUR')
        let amount = '230'
        newPayment.addrecipientDetail(amount, email)
        newPayment.selectFundingMethod('Push Funds')

          // ───── Intercept Quote API ─────
  cy.intercept(
            'POST',
            `https://main-api.volopa-dev.com/${Cypress.env("apiEnv")}/exchange/b2b/self/quote/temp`
        ).as('quoteApi');

  // ───── Wait for API and Compare Values ─────
  cy.wait('@quoteApi').then(({ response }) => {
    const receive = response.body.data.receive;
    const recipientReceives = response.body.data.recipient[0].receives;

    cy.wrap(recipientReceives).as('recipientReceives');
    cy.log(`Receive: ${receive}`);
    cy.log(`Recipient Receives: ${recipientReceives}`);

    expect(receive).to.eq(recipientReceives); // Final comparison
  });
         //Validate Purpose on batch payment
        cy.get('.ant-select-selector').eq(2).click()
        cy.get('.ant-select-dropdown').eq(2).find('.ant-select-item-option-content').then(Element=>{
            let list = Element.text()
            cy.log(list)
            cy.get('@purposeList').then(purposeList=>{
            expect(list).to.eq(purposeList)
            cy.get('.ant-select-selector').eq(2).click()
        })
          })
            cy.get('.ant-col > .ant-btn > span').should('be.visible').click()
            cy.get('.ant-modal-body > :nth-child(1) > .ant-col > .ant-typography').should('be.visible').should('contain.text','Payment Confirmation')
            cy.get('.ant-row-center.m-t-20 > .ant-col > .ant-space > :nth-child(2) > .ant-btn').should('be.visible').click() // pay recipient
            cy.get('.ant-modal-body > :nth-child(1) > .ant-col').should('be.visible').should('contain.text',' Payment Booked - ')
    })
    // Individual Easy Transfer
    it('TC_NP_022 - Add 1 recipient(individual) from the "Add Recipient" page with country = United Arab Emirates and currency = AED. After adding, make a single payment to the recipient using GBP and easy transfer.', function(){
        //Easy Transfer
        signin.Login(userName, password)
        newRecipient.goToPaymentsDashborad()
        newRecipient.gotoRecipientList()
        let email = batchPayments.generateRandomString(5)+ '@yopmail.com'
        batchPayments.addRecipient('United Arab Emirates{enter}' ,'AED{enter}' ,email)
        newRecipient.addBankDetails('AE070331234567890123456','AARPAEAA')
        const lName = batchPayments.generateRandomString(6)
        batchPayments.individualRecipient('INDIVIDUAL AED PF',lName,'United Arab Emirates{enter}')
        batchPayments.paymentPurpose()
        cy.get('.ant-select-selector').eq(3).click()
        cy.get('.ant-select-dropdown').eq(3).find('.ant-select-item-option-content').then(Element=>{
            let purposeList = Element.text()
            cy.log(purposeList)
            cy.wrap(purposeList).as('purposeList')
        })
        newRecipient.saveRecipient()
        newPayment.checkSettelment('be.disabled','be.enabled')
        newPayment.proceedflow('{downarrow}{enter}','GBP')
        let amount = '125'
        newPayment.addrecipientDetail(amount, email)
         //Validate Purpose on batch payment
        cy.get('.ant-select-selector').eq(2).click()
        cy.get('.ant-select-dropdown').eq(1).find('.ant-select-item-option-content').then(Element=>{
            let list = Element.text()
            cy.log(list)
            cy.get('@purposeList').then(purposeList=>{
            expect(list).to.eq(purposeList)
            cy.get('.ant-select-selector').eq(2).click()
        })
          })
            cy.get('.ant-col > .ant-btn > span').should('be.visible').click()
            cy.get('.ant-modal-body > :nth-child(1) > .ant-col > .ant-typography').should('be.visible').should('contain.text','Payment Confirmation')
            cy.get('.ant-row-center.m-t-20 > .ant-col > .ant-space > :nth-child(2) > .ant-btn').should('be.visible').click() // pay recipient
            cy.get('.ant-modal-body > :nth-child(1) > .ant-col').should('be.visible').should('contain.text',' Payment Booked - ')
            newPayment.validateYapilyFlow()
            ////newPayment.cancelEasyTransfer()
    })
    it('TC_NP_023 - Add 1 recipient(individual) from the "Add Recipient" page with country = India and currency = INR. After adding, make a new payment to the recipient using GBP and easy transfer.', function(){
        //easy transfer
        signin.Login(userName, password)
        newRecipient.goToPaymentsDashborad()
        newRecipient.gotoRecipientList()
        let email = batchPayments.generateRandomString(5)+ '@yopmail.com'
        batchPayments.addRecipient('INDIA{downarrow}{enter}' ,'INR{enter}' ,email)
        newRecipient.addIndiaBankDetail()
        const lName = batchPayments.generateRandomString(6)
        batchPayments.individualRecipient('INDIVIDUAL AED PF',lName,'INDIA{downarrow}{enter}')
        batchPayments.paymentPurpose()
        cy.get('.ant-select-selector').eq(3).click()
        cy.get('.ant-select-dropdown').eq(3).find('.ant-select-item-option-content').then(Element=>{
            let purposeList = Element.text()
            cy.log(purposeList)
            cy.wrap(purposeList).as('purposeList')
        })
        newRecipient.saveRecipient()
        newPayment.checkSettelment('be.enabled','be.disabled')
        newPayment.proceedflow('{downarrow}{enter}','GBP')
        let amount = '125'
        newPayment.addrecipientDetail(amount, email)
         //Validate Purpose on batch payment
        cy.get('.ant-select-selector').eq(2).click()
        cy.get('.ant-select-dropdown').eq(1).find('.ant-select-item-option-content').then(Element=>{
            let list = Element.text()
            cy.log(list)
            cy.get('@purposeList').then(purposeList=>{
            expect(list).to.eq(purposeList)
            cy.get('.ant-select-selector').eq(2).click()
        })
          })
          newPayment.iNRDetails()
            cy.get('.ant-col > .ant-btn > span').should('be.visible').click()
            cy.get('.ant-modal-body > :nth-child(1) > .ant-col > .ant-typography').should('be.visible').should('contain.text','Payment Confirmation')
            cy.get('.ant-row-center.m-t-20 > .ant-col > .ant-space > :nth-child(2) > .ant-btn').should('be.visible').click() // pay recipient
            cy.get('.ant-modal-body > :nth-child(1) > .ant-col').should('be.visible').should('contain.text',' Payment Booked - ')
            newPayment.validateYapilyFlow()
            ////newPayment.cancelEasyTransfer()
    })
    it('TC_NP_024 -Add 1 recipient(individual) from the "Add Recipient" page with country = CHINA and currency = CNY. After adding, make a single payment to the recipient using GBP and easy transfer.', function(){
        signin.Login(userName, password)
        newRecipient.goToPaymentsDashborad()
        newRecipient.gotoRecipientList()
        let email = batchPayments.generateRandomString(5)+ '@yopmail.com'
        batchPayments.addRecipient('CHINA{enter}' ,'CNY{enter}' ,email)
        newRecipient.addBankDetailsChina('AYCLCNBY','55555555','501100000011')
        const bName = batchPayments.generateRandomString(6)
        batchPayments.addBusinessRecipient('INDIVIDUAL PF'+' '+bName,'CHINA{enter}')
        batchPayments.paymentPurposeChina()
        cy.get('.ant-select-selector').eq(3).click()
        cy.get('.ant-select-dropdown').eq(3).find('.ant-select-item-option-content').then(Element=>{
            let purposeList = Element.text()
            cy.log(purposeList)
            cy.wrap(purposeList).as('purposeList')
        })
        newRecipient.saveRecipient()
        newPayment.checkSettelment('be.disabled','be.enabled')
        newPayment.proceedflow('{downarrow}{enter}','GBP')
        let amount = '125'
        newPayment.addrecipientDetail(amount, email)
         //Validate Purpose on batch payment
        cy.get('.ant-select-selector').eq(2).click()
        cy.get('.ant-select-dropdown').eq(1).find('.ant-select-item-option-content').then(Element=>{
            let list = Element.text()
            cy.log(list)
            cy.get('@purposeList').then(purposeList=>{
            expect(list).to.eq(purposeList)
            cy.get('.ant-select-selector').eq(2).click()
        })
          })
            cy.get('.ant-col > .ant-btn > span').should('be.visible').click()
            cy.get('.ant-modal-body > :nth-child(1) > .ant-col > .ant-typography').should('be.visible').should('contain.text','Payment Confirmation')
            cy.get('.ant-row-center.m-t-20 > .ant-col > .ant-space > :nth-child(2) > .ant-btn').should('be.visible').click() // pay recipient
            cy.get('.ant-modal-body > :nth-child(1) > .ant-col').should('be.visible').should('contain.text',' Payment Booked - ')
            newPayment.validateYapilyFlow()
            //newPayment.cancelEasyTransfer()
    })
    it('TC_NP_025 - Add 1 recipient(individual) from the "Add Recipient" page with country = United Kingdom and currency = EUR. After adding, make a single payment to the recipient using GBP and easy transfer.', function(){
        signin.Login(userName, password)
        newRecipient.goToPaymentsDashborad()
        newRecipient.gotoRecipientList()
        let email = batchPayments.generateRandomString(5)+ '@yopmail.com'
        batchPayments.addRecipient('United Kingdom{enter}' ,'EUR{enter}' ,email)
        newRecipient.addBankDetails('GB73BARC20039538243547','AFFLGB22')
        const lName = batchPayments.generateRandomString(6)
        batchPayments.individualRecipient('INDIVIDUAL EUR PF',lName,'United Kingdom{enter}')
        batchPayments.paymentPurposeGBPEUR()
        cy.get('.ant-select-selector').eq(3).click()
        cy.get('.ant-select-dropdown').eq(3).find('.ant-select-item-option-content').then(Element=>{
            let purposeList = Element.text()
            cy.log(purposeList)
            cy.wrap(purposeList).as('purposeList')
        })
        newRecipient.saveRecipient()
        newPayment.checkSettelment('be.enabled','be.enabled')
        newPayment.proceedflow('{enter}','GBP')
        let amount = '125'
        newPayment.addrecipientDetail(amount, email)
         //Validate Purpose on batch payment
        cy.get('.ant-select-selector').eq(2).click()
        cy.get('.ant-select-dropdown').eq(1).find('.ant-select-item-option-content').then(Element=>{
            let list = Element.text()
            cy.log(list)
            cy.get('@purposeList').then(purposeList=>{
            expect(list).to.eq(purposeList)
            cy.get('.ant-select-selector').eq(2).click()
        })
          })
            cy.get('.ant-col > .ant-btn > span').should('be.visible').click()
            cy.get('.ant-modal-body > :nth-child(1) > .ant-col > .ant-typography').should('be.visible').should('contain.text','Payment Confirmation')
            cy.get('.ant-row-center.m-t-20 > .ant-col > .ant-space > :nth-child(2) > .ant-btn').should('be.visible').click() // pay recipient
            cy.get('.ant-modal-body > :nth-child(1) > .ant-col').should('be.visible').should('contain.text',' Payment Booked - ')
            newPayment.validateYapilyFlow()
            //newPayment.cancelEasyTransfer()
    })
    it('TC_NP_026 - Add 1 recipient(individual) from the "Add Recipient" page with country = United Kingdom and currency = GBP. After adding, make a single payment to the recipient using EUR and easy trasfer', function(){
        signin.Login(userName, password)
        newRecipient.goToPaymentsDashborad()
        newRecipient.gotoRecipientList()
        let email = batchPayments.generateRandomString(5)+ '@yopmail.com'
        batchPayments.addRecipient('United Kingdom{enter}' ,'GBP{enter}' ,email)
        newRecipient.addBankDetails('GB73BARC20039538243547','AFFLGB22')
        const lName = batchPayments.generateRandomString(6)
        batchPayments.individualRecipient('INDIVIDUAL GBP PF',lName,'United Kingdom{enter}')
        batchPayments.paymentPurposeGBPEUR()
        cy.get('.ant-select-selector').eq(3).click()
        cy.get('.ant-select-dropdown').eq(3).find('.ant-select-item-option-content').then(Element=>{
            let purposeList = Element.text()
            cy.log(purposeList)
            cy.wrap(purposeList).as('purposeList')
        })
        newRecipient.saveRecipient()
        newPayment.checkSettelment('be.disabled','be.enabled')
        newPayment.proceedflow('{enter}','EUR')
        let amount = '130'
        newPayment.addrecipientDetail(amount, email)
         //Validate Purpose on batch payment
        cy.get('.ant-select-selector').eq(2).click()
        cy.get('.ant-select-dropdown').eq(1).find('.ant-select-item-option-content').then(Element=>{
            let list = Element.text()
            cy.log(list)
            cy.get('@purposeList').then(purposeList=>{
            expect(list).to.eq(purposeList)
            cy.get('.ant-select-selector').eq(2).click()
        })
          })
            cy.get('.ant-col > .ant-btn > span').should('be.visible').click()
            cy.get('.ant-modal-body > :nth-child(1) > .ant-col > .ant-typography').should('be.visible').should('contain.text','Payment Confirmation')
            cy.get('.ant-row-center.m-t-20 > .ant-col > .ant-space > :nth-child(2) > .ant-btn').should('be.visible').click() // pay recipient
            cy.get('.ant-modal-body > :nth-child(1) > .ant-col').should('be.visible').should('contain.text',' Payment Booked - ')
            newPayment.validateYapilyFlow()
    })
    //Business Recipient Push Fund
    it('TC_NP_027 - Add 1 recipient(business) from the "Add Recipient" page with country = United Arab Emirates and currency = AED. After adding, make a new payment to the recipient using GBP and push funds.', function(){
        signin.Login(userName, password)
        newRecipient.goToPaymentsDashborad()
        newRecipient.gotoRecipientList()
        let email = batchPayments.generateRandomString(5)+ '@yopmail.com'
        batchPayments.addRecipient('United Arab Emirates{enter}' ,'AED{enter}' ,email)
        newRecipient.addBankDetails('AE070331234567890123456','AARPAEAA')
        cy.get('.ant-space > :nth-child(2) > .ant-card > .ant-card-body').should('be.visible').click()
        const bName = batchPayments.generateRandomString(6)
        batchPayments.addBusinessRecipient('BUSINESS PF'+' '+bName,'UNITED ARAB EMIRATES{enter}')
        batchPayments.paymentPurpose()
        cy.get('.ant-select-selector').eq(3).click()
        cy.get('.ant-select-dropdown').eq(3).find('.ant-select-item-option-content').then(Element=>{
            let purposeList = Element.text()
            cy.log(purposeList)
            cy.wrap(purposeList).as('purposeList')
        })
        newRecipient.saveRecipient()
        newPayment.checkSettelment('be.disabled','be.enabled')
        newPayment.proceedflow('{downarrow}{enter}','GBP')
        let amount = '125'
        newPayment.addrecipientDetail(amount, email)
        newPayment.selectFundingMethod('Push Funds')

          // ───── Intercept Quote API ─────
  cy.intercept(
            'POST',
            `https://main-api.volopa-dev.com/${Cypress.env("apiEnv")}/exchange/b2b/self/quote/temp`
        ).as('quoteApi');

  // ───── Wait for API and Compare Values ─────
  cy.wait('@quoteApi').then(({ response }) => {
    const receive = response.body.data.receive;
    const recipientReceives = response.body.data.recipient[0].receives;

    cy.wrap(recipientReceives).as('recipientReceives');
    cy.log(`Receive: ${receive}`);
    cy.log(`Recipient Receives: ${recipientReceives}`);

    expect(receive).to.eq(recipientReceives); // Final comparison
  });
         //Validate Purpose on batch payment
        cy.get('.ant-select-selector').eq(2).click()
        cy.get('.ant-select-dropdown').eq(2).find('.ant-select-item-option-content').then(Element=>{
            let list = Element.text()
            cy.log(list)
            cy.get('@purposeList').then(purposeList=>{
            expect(list).to.eq(purposeList)
            cy.get('.ant-select-selector').eq(2).click()
        })
          })
            cy.get('.ant-col > .ant-btn > span').should('be.visible').click()
            cy.get('.ant-modal-body > :nth-child(1) > .ant-col > .ant-typography').should('be.visible').should('contain.text','Payment Confirmation')
            cy.get('.ant-row-center.m-t-20 > .ant-col > .ant-space > :nth-child(2) > .ant-btn').should('be.visible').click() // pay recipient
            cy.get('.ant-modal-body > :nth-child(1) > .ant-col').should('be.visible').should('contain.text',' Payment Booked - ')
            //////newPayment.cancelPushFunds()
    })
    it('TC_NP_028 - Add 1 recipient(business) from the "Add Recipient" page with country = India and currency = INR. After adding, make a single payment to the recipient using GBP and push funds.', function(){
        signin.Login(userName, password)
        newRecipient.goToPaymentsDashborad()
        newRecipient.gotoRecipientList()
        let email = batchPayments.generateRandomString(5)+ '@yopmail.com'
        batchPayments.addRecipient('INDIA{downarrow}{enter}' ,'INR{enter}' ,email)
        newRecipient.addIndiaBankDetail()
        cy.get('.ant-space > :nth-child(2) > .ant-card > .ant-card-body').should('be.visible').click()
        const bName = batchPayments.generateRandomString(6)
        batchPayments.addBusinessRecipient('BUSINESS PF'+' '+bName,'INDIA{downarrow}{enter}')
        batchPayments.paymentPurpose()
        cy.get('.ant-select-selector').eq(3).click()
        cy.get('.ant-select-dropdown').eq(3).find('.ant-select-item-option-content').then(Element=>{
            let purposeList = Element.text()
            cy.log(purposeList)
            cy.wrap(purposeList).as('purposeList')
        })
        newRecipient.saveRecipient()
        newPayment.checkSettelment('be.enabled','be.disabled')
        newPayment.proceedflow('{downarrow}{enter}','GBP')
        let amount = '125'
        newPayment.addrecipientDetail(amount, email)
        newPayment.selectFundingMethod('Push Funds')

          // ───── Intercept Quote API ─────
  cy.intercept(
            'POST',
            `https://main-api.volopa-dev.com/${Cypress.env("apiEnv")}/exchange/b2b/self/quote/temp`
        ).as('quoteApi');

  // ───── Wait for API and Compare Values ─────
  cy.wait('@quoteApi').then(({ response }) => {
    const receive = response.body.data.receive;
    const recipientReceives = response.body.data.recipient[0].receives;

    cy.wrap(recipientReceives).as('recipientReceives');
    cy.log(`Receive: ${receive}`);
    cy.log(`Recipient Receives: ${recipientReceives}`);

    expect(receive).to.eq(recipientReceives); // Final comparison
  });
         //Validate Purpose on batch payment
        cy.get('.ant-select-selector').eq(2).click()
        cy.get('.ant-select-dropdown').eq(2).find('.ant-select-item-option-content').then(Element=>{
            let list = Element.text()
            cy.log(list)
            cy.get('@purposeList').then(purposeList=>{
            expect(list).to.eq(purposeList)
            cy.get('.ant-select-selector').eq(2).click()
        })
          })
          newPayment.iNRDetails()
            cy.get('.ant-col > .ant-btn > span').should('be.visible').click()
            cy.get('.ant-modal-body > :nth-child(1) > .ant-col > .ant-typography').should('be.visible').should('contain.text','Payment Confirmation')
            cy.get('.ant-row-center.m-t-20 > .ant-col > .ant-space > :nth-child(2) > .ant-btn').should('be.visible').click() // pay recipient
            cy.get('.ant-modal-body > :nth-child(1) > .ant-col').should('be.visible').should('contain.text',' Payment Booked - ')
            //////newPayment.cancelPushFunds()
    })
    it('TC_NP_029 - Add 1 recipient(business) from the "Add Recipient" page with country = United Kingdom and currency = EUR. After adding, make a single payment to the recipient using GBP and push funds.', function(){
        signin.Login(userName, password)
        newRecipient.goToPaymentsDashborad()
        newRecipient.gotoRecipientList()
        let email = batchPayments.generateRandomString(5)+ '@yopmail.com'
        batchPayments.addRecipient('United Kingdom{enter}' ,'EUR{enter}' ,email)
        newRecipient.addBankDetails('GB73BARC20039538243547','AFFLGB22')
        cy.get('.ant-space > :nth-child(2) > .ant-card > .ant-card-body').should('be.visible').click()
        const bName = batchPayments.generateRandomString(6)
        batchPayments.addBusinessRecipient('BUSINESS PF'+' '+bName,'UNITED KINGDOM{enter}')
        batchPayments.paymentPurposeGBPEUR()
        cy.get('.ant-select-selector').eq(3).click()
        cy.get('.ant-select-dropdown').eq(3).find('.ant-select-item-option-content').then(Element=>{
            let purposeList = Element.text()
            cy.log(purposeList)
            cy.wrap(purposeList).as('purposeList')
        })
        newRecipient.saveRecipient()
        newPayment.checkSettelment('be.enabled','be.enabled')
        newPayment.proceedflow('{enter}','GBP')
        let amount = '125'
        newPayment.addrecipientDetail(amount, email)
        newPayment.selectFundingMethod('Push Funds')

          // ───── Intercept Quote API ─────
  cy.intercept(
            'POST',
            `https://main-api.volopa-dev.com/${Cypress.env("apiEnv")}/exchange/b2b/self/quote/temp`
        ).as('quoteApi');

  // ───── Wait for API and Compare Values ─────
  cy.wait('@quoteApi').then(({ response }) => {
    const receive = response.body.data.receive;
    const recipientReceives = response.body.data.recipient[0].receives;

    cy.wrap(recipientReceives).as('recipientReceives');
    cy.log(`Receive: ${receive}`);
    cy.log(`Recipient Receives: ${recipientReceives}`);

    expect(receive).to.eq(recipientReceives); // Final comparison
  });
        cy.get('@selectedValue').then(selectedValue=>{
            cy.get('.ant-col-sm-20 > :nth-child(2) > :nth-child(1) > .ant-form-item > .ant-row > .ant-col > .ant-form-item-control-input > .ant-form-item-control-input-content > .ant-select > .ant-select-selector')
            .should('be.visible').and('contain.text',selectedValue)
        })
         //Validate Purpose on batch payment
        cy.get('.ant-select-selector').eq(2).click()
        cy.get('.ant-select-dropdown').eq(2).find('.ant-select-item-option-content').then(Element=>{
            let list = Element.text()
            cy.log(list)
            cy.get('@purposeList').then(purposeList=>{
            expect(list).to.eq(purposeList)
            cy.get('.ant-select-selector').eq(2).click()
        })
          })
            cy.get('.ant-col > .ant-btn > span').should('be.visible').click()
            cy.get('.ant-modal-body > :nth-child(1) > .ant-col > .ant-typography').should('be.visible').should('contain.text','Payment Confirmation')
            cy.get('.ant-row-center.m-t-20 > .ant-col > .ant-space > :nth-child(2) > .ant-btn').should('be.visible').click() // pay recipient
            cy.get('.ant-modal-body > :nth-child(1) > .ant-col').should('be.visible').should('contain.text',' Payment Booked - ')
            //////newPayment.cancelPushFunds()
    })
    it('TC_NP_030 - Add 1 recipient(business)  from the "Add Recipient" page with country = United Kingdom and currency = GBP. After adding, make a single payment to the recipient using EUR and push funds.', function(){
        signin.Login(userName, password)
        newRecipient.goToPaymentsDashborad()
        newRecipient.gotoRecipientList()
        let email = batchPayments.generateRandomString(5)+ '@yopmail.com'
        batchPayments.addRecipient('United Kingdom{enter}' ,'GBP{enter}' ,email)
        newRecipient.addBankDetails('GB73BARC20039538243547','AFFLGB22')
        // cy.get(':nth-child(4) > .ant-form-item > .ant-row > .ant-form-item-label > label > .ant-typography').should('be.visible').should('contain.text','Sort Code')
        // cy.get('#sortCode').type('770440')
        cy.get('.ant-space > :nth-child(2) > .ant-card > .ant-card-body').should('be.visible').click()
        const bName = batchPayments.generateRandomString(6)
        batchPayments.addBusinessRecipient('BUSINESS PF'+' '+bName,'UNITED KINGDOM{enter}')
        batchPayments.paymentPurposeGBPEUR()
        cy.get('.ant-select-selector').eq(3).click()
        cy.get('.ant-select-dropdown').eq(3).find('.ant-select-item-option-content').then(Element=>{
            let purposeList = Element.text()
            cy.log(purposeList)
            cy.wrap(purposeList).as('purposeList')
        })
        newRecipient.saveRecipient()
        newPayment.checkSettelment('be.disabled','be.enabled')
        newPayment.proceedflow('{enter}','EUR')
        let amount = '250'
        newPayment.addrecipientDetail(amount, email)
        newPayment.selectFundingMethod('Push Funds')

          // ───── Intercept Quote API ─────
  cy.intercept(
            'POST',
            `https://main-api.volopa-dev.com/${Cypress.env("apiEnv")}/exchange/b2b/self/quote/temp`
        ).as('quoteApi');

  // ───── Wait for API and Compare Values ─────
  cy.wait('@quoteApi').then(({ response }) => {
    const receive = response.body.data.receive;
    const recipientReceives = response.body.data.recipient[0].receives;

    cy.wrap(recipientReceives).as('recipientReceives');
    cy.log(`Receive: ${receive}`);
    cy.log(`Recipient Receives: ${recipientReceives}`);

    expect(receive).to.eq(recipientReceives); // Final comparison
  });
        //Validate the selected payment purpose
        cy.get('@selectedValue').then(selectedValue=>{
            cy.get('.ant-col-sm-20 > :nth-child(2) > :nth-child(1) > .ant-form-item > .ant-row > .ant-col > .ant-form-item-control-input > .ant-form-item-control-input-content > .ant-select > .ant-select-selector')
            .should('be.visible').and('contain.text',selectedValue)
        })
         //Validate Purpose on batch payment
        cy.get('.ant-select-selector').eq(2).click()
        cy.get('.ant-select-dropdown').eq(2).find('.ant-select-item-option-content').then(Element=>{
            let list = Element.text()
            cy.log(list)
            cy.get('@purposeList').then(purposeList=>{
            expect(list).to.eq(purposeList)
            cy.get('.ant-select-selector').eq(2).click()
        })
          })
          // Validating recipient recived amount
          cy.get(':nth-child(4) > :nth-child(2) > .ant-typography').invoke('text').then((text) => {
            const storedText = text
            cy.wrap(storedText).as('storedText')
            cy.log(storedText)
            })
            cy.get('.ant-col > .ant-btn > span').should('be.visible').click()
            cy.get('.ant-modal-body > :nth-child(1) > .ant-col > .ant-typography').should('be.visible').should('contain.text','Payment Confirmation')
            cy.get('@storedText').then(storedText=>{
                cy.get(':nth-child(5) > .ant-col-8 > .ant-typography')
                .should('be.visible').and('contain.text',storedText)
            })
            cy.get('.ant-row-center.m-t-20 > .ant-col > .ant-space > :nth-child(2) > .ant-btn').should('be.visible').click() // pay recipient
            cy.get('.ant-modal-body > :nth-child(1) > .ant-col').should('be.visible').should('contain.text',' Payment Booked - ')
            cy.get('@storedText').then(storedText=>{
                cy.get(':nth-child(5) > .ant-col-8 > .ant-typography')
                .should('be.visible').and('contain.text',storedText)
            })
            //////newPayment.cancelPushFunds()
    })
    //Business Recipient easy transfer
    it('TC_NP_031 - Add 1 recipient(business) from the "Add Recipient" page with country = United Arab Emirates and currency = AED. After adding, make a single payment to the recipient using GBP and easy transfer.', function(){
        //Easy Transfer
        signin.Login(userName, password)
        newRecipient.goToPaymentsDashborad()
        newRecipient.gotoRecipientList()
        let email = batchPayments.generateRandomString(5)+ '@yopmail.com'
        batchPayments.addRecipient('United Arab Emirates{enter}' ,'AED{enter}' ,email)
        newRecipient.addBankDetails('AE070331234567890123456','AARPAEAA')
        cy.get('.ant-space > :nth-child(2) > .ant-card > .ant-card-body').should('be.visible').click()
        const bName = batchPayments.generateRandomString(6)
        batchPayments.addBusinessRecipient('BUSINESS PF'+' '+bName,'UNITED ARAB EMIRATES{enter}')
        batchPayments.paymentPurpose()
        cy.get('.ant-select-selector').eq(3).click()
        cy.get('.ant-select-dropdown').eq(3).find('.ant-select-item-option-content').then(Element=>{
            let purposeList = Element.text()
            cy.log(purposeList)
            cy.wrap(purposeList).as('purposeList')
        })
        newRecipient.saveRecipient()
        newPayment.checkSettelment('be.disabled','be.enabled')
        newPayment.proceedflow('{downarrow}{enter}','GBP')
        let amount = '125'
        newPayment.addrecipientDetail(amount, email)
        cy.get('@selectedValue').then(selectedValue=>{
            cy.get('.ant-col-sm-20 > :nth-child(2) > :nth-child(1) > :nth-child(1) > .ant-row > .ant-col > .ant-form-item-control-input > .ant-form-item-control-input-content > .ant-select > .ant-select-selector')
            .should('be.visible').and('contain.text',selectedValue)
        })
         //Validate Purpose on batch payment
        cy.get('.ant-select-selector').eq(2).click()
        cy.get('.ant-select-dropdown').eq(1).find('.ant-select-item-option-content').then(Element=>{
            let list = Element.text()
            cy.log(list)
            cy.get('@purposeList').then(purposeList=>{
            expect(list).to.eq(purposeList)
            cy.get('.ant-select-selector').eq(2).click()
        })
          })
          // Validating recipient recived amount
          cy.get(':nth-child(4) > :nth-child(2) > .ant-typography').invoke('text').then((text) => {
            const storedText = text
            cy.wrap(storedText).as('storedText')
            cy.log(storedText)
            })
            cy.get('.ant-col > .ant-btn > span').should('be.visible').click()
            cy.get('.ant-modal-body > :nth-child(1) > .ant-col > .ant-typography').should('be.visible').should('contain.text','Payment Confirmation')
            cy.get('.ant-row-center.m-t-20 > .ant-col > .ant-space > :nth-child(2) > .ant-btn').should('be.visible').click() // pay recipient
            cy.get('.ant-modal-body > :nth-child(1) > .ant-col').should('be.visible').should('contain.text',' Payment Booked - ')
            cy.get('@storedText').then(storedText=>{
                cy.get(':nth-child(5) > .ant-col-8 > .ant-typography')
                .should('be.visible').and('contain.text',storedText)
            })
            newPayment.validateYapilyFlow()
            //newPayment.cancelEasyTransfer()
    })
    it('TC_NP_032 - Add 1 recipient(business) from the "Add Recipient" page with country = India and currency = INR. After adding, make a new payment to the recipient using GBP and easy transfer.', function(){
        signin.Login(userName, password)
        newRecipient.goToPaymentsDashborad()
        newRecipient.gotoRecipientList()
        let email = batchPayments.generateRandomString(5)+ '@yopmail.com'
        batchPayments.addRecipient('INDIA{downarrow}{enter}' ,'INR{enter}' ,email)
        newRecipient.addIndiaBankDetail()
        cy.get('.ant-space > :nth-child(2) > .ant-card > .ant-card-body').should('be.visible').click()
        const bName = batchPayments.generateRandomString(6)
        batchPayments.addBusinessRecipient('BUSINESS PF'+' '+bName,'INDIA{downarrow}{enter}')
        batchPayments.paymentPurpose()
        cy.get('.ant-select-selector').eq(3).click()
        cy.get('.ant-select-dropdown').eq(3).find('.ant-select-item-option-content').then(Element=>{
            let purposeList = Element.text()
            cy.log(purposeList)
            cy.wrap(purposeList).as('purposeList')
        })
        newRecipient.saveRecipient()
        newPayment.checkSettelment('be.enabled','be.disabled')
        newPayment.proceedflow('{downarrow}{enter}','GBP')
        let amount = '125'
        newPayment.addrecipientDetail(amount, email)
        cy.get('@selectedValue').then(selectedValue=>{
            cy.get('.ant-col-sm-20 > :nth-child(2) > :nth-child(1) > :nth-child(1) > .ant-row > .ant-col > .ant-form-item-control-input > .ant-form-item-control-input-content > .ant-select > .ant-select-selector')
            .should('be.visible').and('contain.text',selectedValue)
        })
         //Validate Purpose on batch payment
        cy.get('.ant-select-selector').eq(2).click()
        cy.get('.ant-select-dropdown').eq(1).find('.ant-select-item-option-content').then(Element=>{
            let list = Element.text()
            cy.log(list)
            cy.get('@purposeList').then(purposeList=>{
            expect(list).to.eq(purposeList)
            cy.get('.ant-select-selector').eq(2).click()
        })
          })
          newPayment.iNRDetails()
              // Validating recipient recived amount
              cy.get(':nth-child(4) > :nth-child(2) > .ant-typography').invoke('text').then((text) => {
                const storedText = text
                cy.wrap(storedText).as('storedText')
                cy.log(storedText)
                })
            cy.get('.ant-col > .ant-btn > span').should('be.visible').click()
            cy.get('.ant-modal-body > :nth-child(1) > .ant-col > .ant-typography').should('be.visible').should('contain.text','Payment Confirmation')
            cy.get('@storedText').then(storedText=>{
                cy.get(':nth-child(5) > .ant-col-8 > .ant-typography')
                .should('be.visible').and('contain.text',storedText)
            })
            cy.get('.ant-row-center.m-t-20 > .ant-col > .ant-space > :nth-child(2) > .ant-btn').should('be.visible').click() // pay recipient
            cy.get('.ant-modal-body > :nth-child(1) > .ant-col').should('be.visible').should('contain.text',' Payment Booked - ')
            cy.get('@storedText').then(storedText=>{
                cy.get(':nth-child(5) > .ant-col-8 > .ant-typography')
                .should('be.visible').and('contain.text',storedText)
            })
            newPayment.validateYapilyFlow()
            //newPayment.cancelEasyTransfer()
    })
    it.only('TC_NP_033 - Add 1 recipient(business) from the "Add Recipient" page with country = United Kingdom and currency = EUR. After adding, make a single payment to the recipient using GBP and easy transfer.', function(){
        signin.Login(userName, password)
        newRecipient.goToPaymentsDashborad()
        newRecipient.gotoRecipientList()
        let email = batchPayments.generateRandomString(5)+ '@yopmail.com'
        batchPayments.addRecipient('United Kingdom{enter}' ,'EUR{enter}' ,email)
        newRecipient.addBankDetails('GB73BARC20039538243547','AFFLGB22')
        cy.get('.ant-space > :nth-child(2) > .ant-card > .ant-card-body').should('be.visible').click()
        const bName = batchPayments.generateRandomString(6)
        batchPayments.addBusinessRecipient('BUSINESS PF'+' '+bName,'UNITED KINGDOM{enter}')
        batchPayments.paymentPurposeGBPEUR()
        cy.get('.ant-select-selector').eq(3).click()
        cy.get('.ant-select-dropdown').eq(3).find('.ant-select-item-option-content').then(Element=>{
            let purposeList = Element.text()
            cy.log(purposeList)
            cy.wrap(purposeList).as('purposeList')
        })
        newRecipient.saveRecipient()
        newPayment.checkSettelment('be.enabled','be.enabled')
        newPayment.proceedflow('{enter}','GBP')
        let amount = '125'
        newPayment.addrecipientDetail(amount, email)
        cy.get('@selectedValue').then(selectedValue=>{
            cy.get('.ant-col-sm-20 > :nth-child(2) > :nth-child(1) > :nth-child(1) > .ant-row > .ant-col > .ant-form-item-control-input > .ant-form-item-control-input-content > .ant-select > .ant-select-selector')
            .should('be.visible').and('contain.text',selectedValue)
        })
         //Validate Purpose on batch payment
        cy.get('.ant-select-selector').eq(2).click()
        cy.get('.ant-select-dropdown').eq(1).find('.ant-select-item-option-content').then(Element=>{
            let list = Element.text()
            cy.log(list)
            cy.get('@purposeList').then(purposeList=>{
            expect(list).to.eq(purposeList)
            cy.get('.ant-select-selector').eq(2).click()
        })
          })
            // Validating recipient recived amount
            cy.get(':nth-child(4) > :nth-child(2) > .ant-typography').invoke('text').then((text) => {
                const storedText = text
                cy.wrap(storedText).as('storedText')
                cy.log(storedText)
                })
            cy.get('.ant-col > .ant-btn > span').should('be.visible').click()
            cy.get('.ant-modal-body > :nth-child(1) > .ant-col > .ant-typography').should('be.visible').should('contain.text','Payment Confirmation')
            cy.get('@storedText').then(storedText=>{
                cy.get(':nth-child(5) > .ant-col-8 > .ant-typography')
                .should('be.visible').and('contain.text',storedText)
            })
            cy.get('.ant-row-center.m-t-20 > .ant-col > .ant-space > :nth-child(2) > .ant-btn').should('be.visible').click() // pay recipient
            cy.get('.ant-modal-body > :nth-child(1) > .ant-col').should('be.visible').should('contain.text',' Payment Booked - ')
            cy.get('@storedText').then(storedText=>{
                cy.get(':nth-child(5) > .ant-col-8 > .ant-typography')
                .should('be.visible').and('contain.text',storedText)
            })
            newPayment.validateYapilyFlow()
            //newPayment.cancelEasyTransfer()
    })
    it('TC_NP_034 - Add 1 recipient(business)  from the "Add Recipient" page with country = United Kingdom and currency = GBP. After adding, make a single payment to the recipient using EUR and easy transfer.', function(){
        signin.Login(userName, password)
        newRecipient.goToPaymentsDashborad()
        newRecipient.gotoRecipientList()
        let email = batchPayments.generateRandomString(5)+ '@yopmail.com'
        batchPayments.addRecipient('United Kingdom{enter}' ,'GBP{enter}' ,email)
        newRecipient.addBankDetails('GB73BARC20039538243547','AFFLGB22')
        cy.get('.ant-space > :nth-child(2) > .ant-card > .ant-card-body').should('be.visible').click()
        const bName = batchPayments.generateRandomString(6)
        batchPayments.addBusinessRecipient('BUSINESS PF'+' '+bName,'UNITED KINGDOM{enter}')
        batchPayments.paymentPurposeGBPEUR()
        cy.get('.ant-select-selector').eq(3).click()
        cy.get('.ant-select-dropdown').eq(3).find('.ant-select-item-option-content').then(Element=>{
            let purposeList = Element.text()
            cy.log(purposeList)
            cy.wrap(purposeList).as('purposeList')
        })
        newRecipient.saveRecipient()
        newPayment.checkSettelment('be.disabled','be.enabled')
        newPayment.proceedflow('{enter}','EUR')
        let amount = '130'
        newPayment.addrecipientDetail(amount, email)
        //Validate the selected payment purpose
        cy.get('@selectedValue').then(selectedValue=>{
            cy.get('.ant-col-sm-20 > :nth-child(2) > :nth-child(1) > :nth-child(1) > .ant-row > .ant-col > .ant-form-item-control-input > .ant-form-item-control-input-content > .ant-select > .ant-select-selector')
            .should('be.visible').and('contain.text',selectedValue)
        })
         //Validate Purpose on batch payment
        cy.get('.ant-select-selector').eq(2).click()
        cy.get('.ant-select-dropdown').eq(1).find('.ant-select-item-option-content').then(Element=>{
            let list = Element.text()
            cy.log(list)
            cy.get('@purposeList').then(purposeList=>{
            expect(list).to.eq(purposeList)
            cy.get('.ant-select-selector').eq(2).click()
        })
          })
          // Validating recipient recived amount
          cy.get(':nth-child(4) > :nth-child(2) > .ant-typography').invoke('text').then((text) => {
            const storedText = text
            cy.wrap(storedText).as('storedText')
            cy.log(storedText)
            })
            cy.get('.ant-col > .ant-btn > span').should('be.visible').click()
            cy.get('.ant-modal-body > :nth-child(1) > .ant-col > .ant-typography').should('be.visible').should('contain.text','Payment Confirmation')
            cy.get('@storedText').then(storedText=>{
                cy.get(':nth-child(5) > .ant-col-8 > .ant-typography')
                .should('be.visible').and('contain.text',storedText)
            })
            cy.get('.ant-row-center.m-t-20 > .ant-col > .ant-space > :nth-child(2) > .ant-btn').should('be.visible').click() // pay recipient
            cy.get('.ant-modal-body > :nth-child(1) > .ant-col').should('be.visible').should('contain.text',' Payment Booked - ')
            cy.get('@storedText').then(storedText=>{
                cy.get(':nth-child(5) > .ant-col-8 > .ant-typography')
                .should('be.visible').and('contain.text',storedText)
            })
            newPayment.validateYapilyFlow()
            ////newPayment.cancelEasyTransfer()
    })
    // Individual Push Fund 
    it('TC_NP_035 - Add 1 recipient(individual) from the "Add Recipient" page with country = Germany and currency = EUR. After adding, make a single payment to the recipient using GBP and push funds.', function(){
        signin.Login(userName, password)
        newRecipient.goToPaymentsDashborad()
        newRecipient.gotoRecipientList()
        let email = batchPayments.generateRandomString(5)+ '@yopmail.com'
        batchPayments.addRecipient('GERMANY{enter}' ,'EUR{enter}' ,email)
        newRecipient.addBankDetails('DE40500105171359375129','AARBDE5W100')
        const lName = batchPayments.generateRandomString(6)
        batchPayments.individualRecipient('INDIVIDUAL GBP PF',lName,'United Kingdom{enter}')
        batchPayments.paymentPurposeGBPEUR()
        cy.get('.ant-select-selector').eq(3).click()
        cy.get('.ant-select-dropdown').eq(3).find('.ant-select-item-option-content').then(Element=>{
            let purposeList = Element.text()
            cy.log(purposeList)
            cy.wrap(purposeList).as('purposeList')
        })
        newRecipient.saveRecipient()
        newPayment.checkSettelment('be.enabled','be.enabled')
        newPayment.proceedflow('{enter}','GBP')
        let amount = '125'
        newPayment.addrecipientDetail(amount, email)
        newPayment.selectFundingMethod('Push Funds')

          // ───── Intercept Quote API ─────
  cy.intercept(
            'POST',
            `https://main-api.volopa-dev.com/${Cypress.env("apiEnv")}/exchange/b2b/self/quote/temp`
        ).as('quoteApi');

  // ───── Wait for API and Compare Values ─────
  cy.wait('@quoteApi').then(({ response }) => {
    const receive = response.body.data.receive;
    const recipientReceives = response.body.data.recipient[0].receives;

    cy.wrap(recipientReceives).as('recipientReceives');
    cy.log(`Receive: ${receive}`);
    cy.log(`Recipient Receives: ${recipientReceives}`);

    expect(receive).to.eq(recipientReceives); // Final comparison
  });
             //Validate the selected payment purpose
             cy.get('@selectedValue').then(selectedValue=>{
                cy.get('.ant-col-sm-20 > :nth-child(2) > :nth-child(1) > .ant-form-item > .ant-row > .ant-col > .ant-form-item-control-input > .ant-form-item-control-input-content > .ant-select > .ant-select-selector')
                .should('be.visible').and('contain.text',selectedValue)
            })
         //Validate Purpose on batch payment
        cy.get('.ant-select-selector').eq(2).click()
        cy.get('.ant-select-dropdown').eq(2).find('.ant-select-item-option-content').then(Element=>{
            let list = Element.text()
            cy.log(list)
            cy.get('@purposeList').then(purposeList=>{
            expect(list).to.eq(purposeList)
            cy.get('.ant-select-selector').eq(2).click() 
        })
          })
          // Validating recipient recived amount
          cy.get(':nth-child(4) > :nth-child(2) > .ant-typography').invoke('text').then((text) => {
            const storedText = text
            cy.wrap(storedText).as('storedText')
            cy.log(storedText)
            })
            cy.get('.ant-col > .ant-btn > span').should('be.visible').click()
            cy.get('.ant-modal-body > :nth-child(1) > .ant-col > .ant-typography').should('be.visible').should('contain.text','Payment Confirmation')
            cy.get('@storedText').then(storedText=>{
                cy.get(':nth-child(5) > .ant-col-8 > .ant-typography')
                .should('be.visible').and('contain.text',storedText)
            })
            cy.get('.ant-row-center.m-t-20 > .ant-col > .ant-space > :nth-child(2) > .ant-btn').should('be.visible').click() // pay recipient
            cy.get('.ant-modal-body > :nth-child(1) > .ant-col').should('be.visible').should('contain.text',' Payment Booked - ')
            cy.get('@storedText').then(storedText=>{
                cy.get(':nth-child(5) > .ant-col-8 > .ant-typography')
                .should('be.visible').and('contain.text',storedText)
            })
            //////newPayment.cancelPushFunds()
    })
    it('TC_NP_036 - Add 1 recipient(individual) from the "Add Recipient" page with country = France and currency = EUR. After adding, make a single payment to the recipient using GBP and push funds.', function(){
        signin.Login(userName, password)
        newRecipient.goToPaymentsDashborad()
        newRecipient.gotoRecipientList()
        let email = batchPayments.generateRandomString(5)+ '@yopmail.com'
        batchPayments.addRecipient('FRANCE{enter}' ,'EUR{enter}' ,email)
        newRecipient.addBankDetails('FR1420041010050500013M02606','GASKFRPPXXX')
        const lName = batchPayments.generateRandomString(6)
        batchPayments.individualRecipient('INDIVIDUAL GBP PF',lName,'United Kingdom{enter}')
        batchPayments.paymentPurposeGBPEUR()
        cy.get('.ant-select-selector').eq(3).click()
        cy.get('.ant-select-dropdown').eq(3).find('.ant-select-item-option-content').then(Element=>{
            let purposeList = Element.text()
            cy.log(purposeList)
            cy.wrap(purposeList).as('purposeList')
        })
        newRecipient.saveRecipient()
        newPayment.checkSettelment('be.enabled','be.enabled')
        newPayment.proceedflow('{enter}','GBP')
        let amount = '125'
        newPayment.addrecipientDetail(amount, email)
        newPayment.selectFundingMethod('Push Funds')

          // ───── Intercept Quote API ─────
  cy.intercept(
            'POST',
            `https://main-api.volopa-dev.com/${Cypress.env("apiEnv")}/exchange/b2b/self/quote/temp`
        ).as('quoteApi');

  // ───── Wait for API and Compare Values ─────
  cy.wait('@quoteApi').then(({ response }) => {
    const receive = response.body.data.receive;
    const recipientReceives = response.body.data.recipient[0].receives;

    cy.wrap(recipientReceives).as('recipientReceives');
    cy.log(`Receive: ${receive}`);
    cy.log(`Recipient Receives: ${recipientReceives}`);

    expect(receive).to.eq(recipientReceives); // Final comparison
  });
             //Validate the selected payment purpose
             cy.get('@selectedValue').then(selectedValue=>{
                cy.get('.ant-col-sm-20 > :nth-child(2) > :nth-child(1) > .ant-form-item > .ant-row > .ant-col > .ant-form-item-control-input > .ant-form-item-control-input-content > .ant-select > .ant-select-selector')
                .should('be.visible').and('contain.text',selectedValue)
            })
         //Validate Purpose on batch payment
        cy.get('.ant-select-selector').eq(2).click()
        cy.get('.ant-select-dropdown').eq(2).find('.ant-select-item-option-content').then(Element=>{
            let list = Element.text()
            cy.log(list)
            cy.get('@purposeList').then(purposeList=>{
            expect(list).to.eq(purposeList)
            cy.get('.ant-select-selector').eq(2).click() 
        })
          })
       // Validating recipient recived amount
       cy.get(':nth-child(4) > :nth-child(2) > .ant-typography').invoke('text').then((text) => {
        const storedText = text
        cy.wrap(storedText).as('storedText')
        cy.log(storedText)
        })
        cy.get('.ant-col > .ant-btn > span').should('be.visible').click()
        cy.get('.ant-modal-body > :nth-child(1) > .ant-col > .ant-typography').should('be.visible').should('contain.text','Payment Confirmation')
        cy.get('@storedText').then(storedText=>{
            cy.get(':nth-child(5) > .ant-col-8 > .ant-typography')
            .should('be.visible').and('contain.text',storedText)
        })
        cy.get('.ant-row-center.m-t-20 > .ant-col > .ant-space > :nth-child(2) > .ant-btn').should('be.visible').click() // pay recipient
        cy.get('.ant-modal-body > :nth-child(1) > .ant-col').should('be.visible').should('contain.text',' Payment Booked - ')
        cy.get('@storedText').then(storedText=>{
            cy.get(':nth-child(5) > .ant-col-8 > .ant-typography')
            .should('be.visible').and('contain.text',storedText)
        })
        //////newPayment.cancelPushFunds()
    })
    it('TC_NP_037 - Add 1 recipient(individual) from the "Add Recipient" page with country = Spain and currency = EUR. After adding, make a single payment to the recipient using GBP and push funds.', function(){
        signin.Login(userName, password)
        newRecipient.goToPaymentsDashborad()
        newRecipient.gotoRecipientList()
        let email = batchPayments.generateRandomString(5)+ '@yopmail.com'
        batchPayments.addRecipient('SPAIN{enter}' ,'EUR{enter}' ,email)
        newRecipient.addBankDetails('ES9121000418450200051332','CAGLESMMCOP')
        const lName = batchPayments.generateRandomString(6)
        batchPayments.individualRecipient('INDIVIDUAL GBP PF',lName,'United Kingdom{enter}')
        batchPayments.paymentPurposeGBPEUR()
        cy.get('.ant-select-selector').eq(3).click()
        cy.get('.ant-select-dropdown').eq(3).find('.ant-select-item-option-content').then(Element=>{
            let purposeList = Element.text()
            cy.log(purposeList)
            cy.wrap(purposeList).as('purposeList')
        })
        newRecipient.saveRecipient()
        newPayment.checkSettelment('be.enabled','be.enabled')
        newPayment.proceedflow('{enter}','GBP')
        let amount = '125'
        newPayment.addrecipientDetail(amount, email)
        newPayment.selectFundingMethod('Push Funds')

          // ───── Intercept Quote API ─────
  cy.intercept(
            'POST',
            `https://main-api.volopa-dev.com/${Cypress.env("apiEnv")}/exchange/b2b/self/quote/temp`
        ).as('quoteApi');

  // ───── Wait for API and Compare Values ─────
  cy.wait('@quoteApi').then(({ response }) => {
    const receive = response.body.data.receive;
    const recipientReceives = response.body.data.recipient[0].receives;

    cy.wrap(recipientReceives).as('recipientReceives');
    cy.log(`Receive: ${receive}`);
    cy.log(`Recipient Receives: ${recipientReceives}`);

    expect(receive).to.eq(recipientReceives); // Final comparison
  });
             //Validate the selected payment purpose
             cy.get('@selectedValue').then(selectedValue=>{
                cy.get('.ant-col-sm-20 > :nth-child(2) > :nth-child(1) > .ant-form-item > .ant-row > .ant-col > .ant-form-item-control-input > .ant-form-item-control-input-content > .ant-select > .ant-select-selector')
                .should('be.visible').and('contain.text',selectedValue)
            })
         //Validate Purpose on batch payment
        cy.get('.ant-select-selector').eq(2).click()
        cy.get('.ant-select-dropdown').eq(2).find('.ant-select-item-option-content').then(Element=>{
            let list = Element.text()
            cy.log(list)
            cy.get('@purposeList').then(purposeList=>{
            expect(list).to.eq(purposeList)
            cy.get('.ant-select-selector').eq(2).click() 
        })
          })
       // Validating recipient recived amount
       cy.get(':nth-child(4) > :nth-child(2) > .ant-typography').invoke('text').then((text) => {
        const storedText = text
        cy.wrap(storedText).as('storedText')
        cy.log(storedText)
        })
        cy.get('.ant-col > .ant-btn > span').should('be.visible').click()
        cy.get('.ant-modal-body > :nth-child(1) > .ant-col > .ant-typography').should('be.visible').should('contain.text','Payment Confirmation')
        cy.get('@storedText').then(storedText=>{
            cy.get(':nth-child(5) > .ant-col-8 > .ant-typography')
            .should('be.visible').and('contain.text',storedText)
        })
        cy.get('.ant-row-center.m-t-20 > .ant-col > .ant-space > :nth-child(2) > .ant-btn').should('be.visible').click() // pay recipient
        cy.get('.ant-modal-body > :nth-child(1) > .ant-col').should('be.visible').should('contain.text',' Payment Booked - ')
        cy.get('@storedText').then(storedText=>{
            cy.get(':nth-child(5) > .ant-col-8 > .ant-typography')
            .should('be.visible').and('contain.text',storedText)
        })
        //////newPayment.cancelPushFunds()
    })
    it('TC_NP_038 - Add 1 recipient(individual) from the "Add Recipient" page with country = Italy and currency = EUR. After adding, make a single payment to the recipient using GBP and push funds.', function(){
        signin.Login(userName, password)
        newRecipient.goToPaymentsDashborad()
        newRecipient.gotoRecipientList()
        let email = batchPayments.generateRandomString(5)+ '@yopmail.com'
        batchPayments.addRecipient('ITALY{enter}' ,'EUR{enter}' ,email)
        newRecipient.addBankDetails('IT60X0542811101000000123456','FCRRITM1XXX')
        const lName = batchPayments.generateRandomString(6)
        batchPayments.individualRecipient('INDIVIDUAL GBP PF',lName,'United Kingdom{enter}')
        batchPayments.paymentPurposeGBPEUR()
        cy.get('.ant-select-selector').eq(3).click()
        cy.get('.ant-select-dropdown').eq(3).find('.ant-select-item-option-content').then(Element=>{
            let purposeList = Element.text()
            cy.log(purposeList)
            cy.wrap(purposeList).as('purposeList')
        })
        newRecipient.saveRecipient()
        newPayment.checkSettelment('be.enabled','be.enabled')
        newPayment.proceedflow('{enter}','GBP')
        let amount = '125'
        newPayment.addrecipientDetail(amount, email)
        newPayment.selectFundingMethod('Push Funds')

          // ───── Intercept Quote API ─────
  cy.intercept(
            'POST',
            `https://main-api.volopa-dev.com/${Cypress.env("apiEnv")}/exchange/b2b/self/quote/temp`
        ).as('quoteApi');

  // ───── Wait for API and Compare Values ─────
  cy.wait('@quoteApi').then(({ response }) => {
    const receive = response.body.data.receive;
    const recipientReceives = response.body.data.recipient[0].receives;

    cy.wrap(recipientReceives).as('recipientReceives');
    cy.log(`Receive: ${receive}`);
    cy.log(`Recipient Receives: ${recipientReceives}`);

    expect(receive).to.eq(recipientReceives); // Final comparison
  });
             //Validate the selected payment purpose
             cy.get('@selectedValue').then(selectedValue=>{
                cy.get('.ant-col-sm-20 > :nth-child(2) > :nth-child(1) > .ant-form-item > .ant-row > .ant-col > .ant-form-item-control-input > .ant-form-item-control-input-content > .ant-select > .ant-select-selector')
                .should('be.visible').and('contain.text',selectedValue)
            })
         //Validate Purpose on batch payment
        cy.get('.ant-select-selector').eq(2).click()
        cy.get('.ant-select-dropdown').eq(2).find('.ant-select-item-option-content').then(Element=>{
            let list = Element.text()
            cy.log(list)
            cy.get('@purposeList').then(purposeList=>{
            expect(list).to.eq(purposeList)
            cy.get('.ant-select-selector').eq(2).click() 
        })
          })
       // Validating recipient recived amount
       cy.get(':nth-child(4) > :nth-child(2) > .ant-typography').invoke('text').then((text) => {
        const storedText = text
        cy.wrap(storedText).as('storedText')
        cy.log(storedText)
        })
        cy.get('.ant-col > .ant-btn > span').should('be.visible').click()
        cy.get('.ant-modal-body > :nth-child(1) > .ant-col > .ant-typography').should('be.visible').should('contain.text','Payment Confirmation')
        cy.get('@storedText').then(storedText=>{
            cy.get(':nth-child(5) > .ant-col-8 > .ant-typography')
            .should('be.visible').and('contain.text',storedText)
        })
        cy.get('.ant-row-center.m-t-20 > .ant-col > .ant-space > :nth-child(2) > .ant-btn').should('be.visible').click() // pay recipient
        cy.get('.ant-modal-body > :nth-child(1) > .ant-col').should('be.visible').should('contain.text',' Payment Booked - ')
        cy.get('@storedText').then(storedText=>{
            cy.get(':nth-child(5) > .ant-col-8 > .ant-typography')
            .should('be.visible').and('contain.text',storedText)
        })
        //////newPayment.cancelPushFunds()
    })
    it('TC_NP_039 - Add 1 recipient(individual) from the "Add Recipient" page with country = Malta and currency = EUR. After adding, make a single payment to the recipient using GBP and push funds.', function(){
        signin.Login(userName, password)
        newRecipient.goToPaymentsDashborad()
        newRecipient.gotoRecipientList()
        let email = batchPayments.generateRandomString(5)+ '@yopmail.com'
        batchPayments.addRecipient('MALTA{enter}' ,'EUR{enter}' ,email)
        newRecipient.addBankDetails('MT84MALT011000012345MTLCAST001S','IESCMTM1XXX')
        const lName = batchPayments.generateRandomString(6)
        batchPayments.individualRecipient('INDIVIDUAL GBP PF',lName,'United Kingdom{enter}')
        batchPayments.paymentPurposeGBPEUR()
        cy.get('.ant-select-selector').eq(3).click()
        cy.get('.ant-select-dropdown').eq(3).find('.ant-select-item-option-content').then(Element=>{
            let purposeList = Element.text()
            cy.log(purposeList)
            cy.wrap(purposeList).as('purposeList')
        })
        newRecipient.saveRecipient()
        newPayment.checkSettelment('be.enabled','be.enabled')
        newPayment.proceedflow('{enter}','GBP')
        let amount = '125'
        newPayment.addrecipientDetail(amount, email)
        newPayment.selectFundingMethod('Push Funds')

          // ───── Intercept Quote API ─────
  cy.intercept(
            'POST',
            `https://main-api.volopa-dev.com/${Cypress.env("apiEnv")}/exchange/b2b/self/quote/temp`
        ).as('quoteApi');

  // ───── Wait for API and Compare Values ─────
  cy.wait('@quoteApi').then(({ response }) => {
    const receive = response.body.data.receive;
    const recipientReceives = response.body.data.recipient[0].receives;

    cy.wrap(recipientReceives).as('recipientReceives');
    cy.log(`Receive: ${receive}`);
    cy.log(`Recipient Receives: ${recipientReceives}`);

    expect(receive).to.eq(recipientReceives); // Final comparison
  });
                //Validate the selected payment purpose
        cy.get('@selectedValue').then(selectedValue=>{
            cy.get('.ant-col-sm-20 > :nth-child(2) > :nth-child(1) > .ant-form-item > .ant-row > .ant-col > .ant-form-item-control-input > .ant-form-item-control-input-content > .ant-select > .ant-select-selector')
            .should('be.visible').and('contain.text',selectedValue)
        })
         //Validate Purpose on batch payment
        cy.get('.ant-select-selector').eq(2).click()
        cy.get('.ant-select-dropdown').eq(2).find('.ant-select-item-option-content').then(Element=>{
            let list = Element.text()
            cy.log(list)
            cy.get('@purposeList').then(purposeList=>{
            expect(list).to.eq(purposeList)
            cy.get('.ant-select-selector').eq(2).click() 
        })
          })
       // Validating recipient recived amount
       cy.get(':nth-child(4) > :nth-child(2) > .ant-typography').invoke('text').then((text) => {
        const storedText = text
        cy.wrap(storedText).as('storedText')
        cy.log(storedText)
        })
        cy.get('.ant-col > .ant-btn > span').should('be.visible').click()
        cy.get('.ant-modal-body > :nth-child(1) > .ant-col > .ant-typography').should('be.visible').should('contain.text','Payment Confirmation')
        cy.get('@storedText').then(storedText=>{
            cy.get(':nth-child(5) > .ant-col-8 > .ant-typography')
            .should('be.visible').and('contain.text',storedText)
        })
        cy.get('.ant-row-center.m-t-20 > .ant-col > .ant-space > :nth-child(2) > .ant-btn').should('be.visible').click() // pay recipient
        cy.get('.ant-modal-body > :nth-child(1) > .ant-col').should('be.visible').should('contain.text',' Payment Booked - ')
        cy.get('@storedText').then(storedText=>{
            cy.get(':nth-child(5) > .ant-col-8 > .ant-typography')
            .should('be.visible').and('contain.text',storedText)
        })
        //////newPayment.cancelPushFunds()
    })
    // Individual Easy Transfer
    it('TC_NP_040 - Add 1 recipient(individual) from the "Add Recipient" page with country = Germany and currency = EUR. After adding, make a single payment to the recipient using GBP and easy transfer.', function(){
        signin.Login(userName, password)
        newRecipient.goToPaymentsDashborad()
        newRecipient.gotoRecipientList()
        let email = batchPayments.generateRandomString(5)+ '@yopmail.com'
        batchPayments.addRecipient('GERMANY{enter}' ,'EUR{enter}' ,email)
        newRecipient.addBankDetails('DE40500105171359375129','AARBDE5W100')
        const lName = batchPayments.generateRandomString(6)
        batchPayments.individualRecipient('INDIVIDUAL GBP PF',lName,'United Kingdom{enter}')
        batchPayments.paymentPurposeGBPEUR()
        cy.get('.ant-select-selector').eq(3).click()
        cy.get('.ant-select-dropdown').eq(3).find('.ant-select-item-option-content').then(Element=>{
            let purposeList = Element.text()
            cy.log(purposeList)
            cy.wrap(purposeList).as('purposeList')
        })
        newRecipient.saveRecipient()
        newPayment.checkSettelment('be.enabled','be.enabled')
        newPayment.proceedflow('{enter}','GBP')
        let amount = '125'
        newPayment.addrecipientDetail(amount, email)
                //Validate the selected payment purpose
        cy.get('@selectedValue').then(selectedValue=>{
            cy.get('.ant-col-sm-20 > :nth-child(2) > :nth-child(1) > :nth-child(1) > .ant-row > .ant-col > .ant-form-item-control-input > .ant-form-item-control-input-content > .ant-select > .ant-select-selector')
            .should('be.visible').and('contain.text',selectedValue)
        })
         //Validate Purpose on batch payment
        cy.get('.ant-select-selector').eq(2).click()
        cy.get('.ant-select-dropdown').eq(1).find('.ant-select-item-option-content').then(Element=>{
            let list = Element.text()
            cy.log(list)
            cy.get('@purposeList').then(purposeList=>{
            expect(list).to.eq(purposeList)
            cy.get('.ant-select-selector').eq(2).click()
        })
          })
       // Validating recipient recived amount
       cy.get(':nth-child(4) > :nth-child(2) > .ant-typography').invoke('text').then((text) => {
        const storedText = text
        cy.wrap(storedText).as('storedText')
        cy.log(storedText)
        })
        cy.get('.ant-col > .ant-btn > span').should('be.visible').click()
        cy.get('.ant-modal-body > :nth-child(1) > .ant-col > .ant-typography').should('be.visible').should('contain.text','Payment Confirmation')
        cy.get('@storedText').then(storedText=>{
            cy.get(':nth-child(5) > .ant-col-8 > .ant-typography')
            .should('be.visible').and('contain.text',storedText)
        })
        cy.get('.ant-row-center.m-t-20 > .ant-col > .ant-space > :nth-child(2) > .ant-btn').should('be.visible').click() // pay recipient
        cy.get('.ant-modal-body > :nth-child(1) > .ant-col').should('be.visible').should('contain.text',' Payment Booked - ')
        cy.get('@storedText').then(storedText=>{
            cy.get(':nth-child(5) > .ant-col-8 > .ant-typography')
            .should('be.visible').and('contain.text',storedText)
        })
        newPayment.validateYapilyFlow()
        //newPayment.cancelEasyTransfer()
    })
    it('TC_NP_041 - Add 1 recipient(individual) from the "Add Recipient" page with country = France and currency = EUR. After adding, make a single payment to the recipient using GBP and easy transfer.', function(){
        signin.Login(userName, password)
        newRecipient.goToPaymentsDashborad()
        newRecipient.gotoRecipientList()
        let email = batchPayments.generateRandomString(5)+ '@yopmail.com'
        batchPayments.addRecipient('FRANCE{enter}' ,'EUR{enter}' ,email)
        newRecipient.addBankDetails('FR1420041010050500013M02606','GASKFRPPXXX')
        const lName = batchPayments.generateRandomString(6)
        batchPayments.individualRecipient('INDIVIDUAL GBP PF',lName,'United Kingdom{enter}')
        batchPayments.paymentPurposeGBPEUR()
        cy.get('.ant-select-selector').eq(3).click()
        cy.get('.ant-select-dropdown').eq(3).find('.ant-select-item-option-content').then(Element=>{
            let purposeList = Element.text()
            cy.log(purposeList)
            cy.wrap(purposeList).as('purposeList')
        })
        newRecipient.saveRecipient()
        newPayment.checkSettelment('be.enabled','be.enabled')
        newPayment.proceedflow('{enter}','GBP')
        let amount = '125'
        newPayment.addrecipientDetail(amount, email)
                //Validate the selected payment purpose
        cy.get('@selectedValue').then(selectedValue=>{
            cy.get('.ant-col-sm-20 > :nth-child(2) > :nth-child(1) > :nth-child(1) > .ant-row > .ant-col > .ant-form-item-control-input > .ant-form-item-control-input-content > .ant-select > .ant-select-selector')
            .should('be.visible').and('contain.text',selectedValue)
        })
         //Validate Purpose on batch payment
        cy.get('.ant-select-selector').eq(2).click()
        cy.get('.ant-select-dropdown').eq(1).find('.ant-select-item-option-content').then(Element=>{
            let list = Element.text()
            cy.log(list)
            cy.get('@purposeList').then(purposeList=>{
            expect(list).to.eq(purposeList)
            cy.get('.ant-select-selector').eq(2).click()
        })
          })
       // Validating recipient recived amount
       cy.get(':nth-child(4) > :nth-child(2) > .ant-typography').invoke('text').then((text) => {
        const storedText = text
        cy.wrap(storedText).as('storedText')
        cy.log(storedText)
        })
        cy.get('.ant-col > .ant-btn > span').should('be.visible').click()
        cy.get('.ant-modal-body > :nth-child(1) > .ant-col > .ant-typography').should('be.visible').should('contain.text','Payment Confirmation')
        cy.get('@storedText').then(storedText=>{
            cy.get(':nth-child(5) > .ant-col-8 > .ant-typography')
            .should('be.visible').and('contain.text',storedText)
        })
        cy.get('.ant-row-center.m-t-20 > .ant-col > .ant-space > :nth-child(2) > .ant-btn').should('be.visible').click() // pay recipient
        cy.get('.ant-modal-body > :nth-child(1) > .ant-col').should('be.visible').should('contain.text',' Payment Booked - ')
        cy.get('@storedText').then(storedText=>{
            cy.get(':nth-child(5) > .ant-col-8 > .ant-typography')
            .should('be.visible').and('contain.text',storedText)
        })
        newPayment.validateYapilyFlow()
        //newPayment.cancelEasyTransfer()
    })
    it('TC_NP_042 - Add 1 recipient(individual) from the "Add Recipient" page with country = Spain and currency = EUR. After adding, make a single payment to the recipient using GBP and easy transfer.', function(){
        signin.Login(userName, password)
        newRecipient.goToPaymentsDashborad()
        newRecipient.gotoRecipientList()
        let email = batchPayments.generateRandomString(5)+ '@yopmail.com'
        batchPayments.addRecipient('SPAIN{enter}' ,'EUR{enter}' ,email)
        newRecipient.addBankDetails('ES9121000418450200051332','CAGLESMMCOP')
        const lName = batchPayments.generateRandomString(6)
        batchPayments.individualRecipient('INDIVIDUAL GBP PF',lName,'United Kingdom{enter}')
        batchPayments.paymentPurposeGBPEUR()
        cy.get('.ant-select-selector').eq(3).click()
        cy.get('.ant-select-dropdown').eq(3).find('.ant-select-item-option-content').then(Element=>{
            let purposeList = Element.text()
            cy.log(purposeList)
            cy.wrap(purposeList).as('purposeList')
        })
        newRecipient.saveRecipient()
        newPayment.checkSettelment('be.enabled','be.enabled')
        newPayment.proceedflow('{enter}','GBP')
        let amount = '125'
        newPayment.addrecipientDetail(amount, email)
                //Validate the selected payment purpose
        cy.get('@selectedValue').then(selectedValue=>{
            cy.get('.ant-col-sm-20 > :nth-child(2) > :nth-child(1) > :nth-child(1) > .ant-row > .ant-col > .ant-form-item-control-input > .ant-form-item-control-input-content > .ant-select > .ant-select-selector')
            .should('be.visible').and('contain.text',selectedValue)
        })
         //Validate Purpose on batch payment
        cy.get('.ant-select-selector').eq(2).click()
        cy.get('.ant-select-dropdown').eq(1).find('.ant-select-item-option-content').then(Element=>{
            let list = Element.text()
            cy.log(list)
            cy.get('@purposeList').then(purposeList=>{
            expect(list).to.eq(purposeList)
            cy.get('.ant-select-selector').eq(2).click()
        })
          })
       // Validating recipient recived amount
       cy.get(':nth-child(4) > :nth-child(2) > .ant-typography').invoke('text').then((text) => {
        const storedText = text
        cy.wrap(storedText).as('storedText')
        cy.log(storedText)
        })
        cy.get('.ant-col > .ant-btn > span').should('be.visible').click()
        cy.get('.ant-modal-body > :nth-child(1) > .ant-col > .ant-typography').should('be.visible').should('contain.text','Payment Confirmation')
        cy.get('@storedText').then(storedText=>{
            cy.get(':nth-child(5) > .ant-col-8 > .ant-typography')
            .should('be.visible').and('contain.text',storedText)
        })
        cy.get('.ant-row-center.m-t-20 > .ant-col > .ant-space > :nth-child(2) > .ant-btn').should('be.visible').click() // pay recipient
        cy.get('.ant-modal-body > :nth-child(1) > .ant-col').should('be.visible').should('contain.text',' Payment Booked - ')
        cy.get('@storedText').then(storedText=>{
            cy.get(':nth-child(5) > .ant-col-8 > .ant-typography')
            .should('be.visible').and('contain.text',storedText)
        })
        newPayment.validateYapilyFlow()
        //newPayment.cancelEasyTransfer()
    })
    it('TC_NP_043 - Add 1 recipient(individual) from the "Add Recipient" page with country = Italy and currency = EUR. After adding, make a single payment to the recipient using GBP and easy transfer.', function(){
        signin.Login(userName, password)
        newRecipient.goToPaymentsDashborad()
        newRecipient.gotoRecipientList()
        let email = batchPayments.generateRandomString(5)+ '@yopmail.com'
        batchPayments.addRecipient('ITALY{enter}' ,'EUR{enter}' ,email)
        newRecipient.addBankDetails('IT60X0542811101000000123456','FCRRITM1XXX')
        const lName = batchPayments.generateRandomString(6)
        batchPayments.individualRecipient('INDIVIDUAL GBP PF',lName,'ITALY{enter}')
        batchPayments.paymentPurposeGBPEUR()
        cy.get('.ant-select-selector').eq(3).click()
        cy.get('.ant-select-dropdown').eq(3).find('.ant-select-item-option-content').then(Element=>{
            let purposeList = Element.text()
            cy.log(purposeList)
            cy.wrap(purposeList).as('purposeList')
        })
        newRecipient.saveRecipient()
        newPayment.checkSettelment('be.enabled','be.enabled')
        newPayment.proceedflow('{enter}','GBP')
        let amount = '125'
        newPayment.addrecipientDetail(amount, email)
                //Validate the selected payment purpose
        cy.get('@selectedValue').then(selectedValue=>{
            cy.get('.ant-col-sm-20 > :nth-child(2) > :nth-child(1) > :nth-child(1) > .ant-row > .ant-col > .ant-form-item-control-input > .ant-form-item-control-input-content > .ant-select > .ant-select-selector')
            .should('be.visible').and('contain.text',selectedValue)
        })
         //Validate Purpose on batch payment
        cy.get('.ant-select-selector').eq(2).click()
        cy.get('.ant-select-dropdown').eq(1).find('.ant-select-item-option-content').then(Element=>{
            let list = Element.text()
            cy.log(list)
            cy.get('@purposeList').then(purposeList=>{
            expect(list).to.eq(purposeList)
            cy.get('.ant-select-selector').eq(2).click()
        })
          })
       // Validating recipient recived amount
       cy.get(':nth-child(4) > :nth-child(2) > .ant-typography').invoke('text').then((text) => {
        const storedText = text
        cy.wrap(storedText).as('storedText')
        cy.log(storedText)
        })
        cy.get('.ant-col > .ant-btn > span').should('be.visible').click()
        cy.get('.ant-modal-body > :nth-child(1) > .ant-col > .ant-typography').should('be.visible').should('contain.text','Payment Confirmation')
        cy.get('@storedText').then(storedText=>{
            cy.get(':nth-child(5) > .ant-col-8 > .ant-typography')
            .should('be.visible').and('contain.text',storedText)
        })
        cy.get('.ant-row-center.m-t-20 > .ant-col > .ant-space > :nth-child(2) > .ant-btn').should('be.visible').click() // pay recipient
        cy.get('.ant-modal-body > :nth-child(1) > .ant-col').should('be.visible').should('contain.text',' Payment Booked - ')
        cy.get('@storedText').then(storedText=>{
            cy.get(':nth-child(5) > .ant-col-8 > .ant-typography')
            .should('be.visible').and('contain.text',storedText)
        })
        newPayment.validateYapilyFlow()
        //newPayment.cancelEasyTransfer()
    })
    it('TC_NP_044 - Add 1 recipient(individual) from the "Add Recipient" page with country = Malta and currency = EUR. After adding, make a single payment to the recipient using GBP and easy transfer.', function(){
        signin.Login(userName, password)
        newRecipient.goToPaymentsDashborad()
        newRecipient.gotoRecipientList()
        let email = batchPayments.generateRandomString(5)+ '@yopmail.com'
        batchPayments.addRecipient('MALTA{enter}' ,'EUR{enter}' ,email)
        newRecipient.addBankDetails('MT84MALT011000012345MTLCAST001S','IESCMTM1XXX')
        const lName = batchPayments.generateRandomString(6)
        batchPayments.individualRecipient('INDIVIDUAL GBP PF',lName,'MALTA{enter}')
        batchPayments.paymentPurposeGBPEUR()
        cy.get('.ant-select-selector').eq(3).click()
        cy.get('.ant-select-dropdown').eq(3).find('.ant-select-item-option-content').then(Element=>{
            let purposeList = Element.text()
            cy.log(purposeList)
            cy.wrap(purposeList).as('purposeList')
        })
        newRecipient.saveRecipient()
        newPayment.checkSettelment('be.enabled','be.enabled')
        newPayment.proceedflow('{enter}','GBP')
        let amount = '125'
        newPayment.addrecipientDetail(amount, email)
                //Validate the selected payment purpose
        cy.get('@selectedValue').then(selectedValue=>{
            cy.get('.ant-col-sm-20 > :nth-child(2) > :nth-child(1) > :nth-child(1) > .ant-row > .ant-col > .ant-form-item-control-input > .ant-form-item-control-input-content > .ant-select > .ant-select-selector')
            .should('be.visible').and('contain.text',selectedValue)
        })
         //Validate Purpose on batch payment
        cy.get('.ant-select-selector').eq(2).click()
        cy.get('.ant-select-dropdown').eq(1).find('.ant-select-item-option-content').then(Element=>{
            let list = Element.text()
            cy.log(list)
            cy.get('@purposeList').then(purposeList=>{
            expect(list).to.eq(purposeList)
            cy.get('.ant-select-selector').eq(2).click()
        })
          })
       // Validating recipient recived amount
       cy.get(':nth-child(4) > :nth-child(2) > .ant-typography').invoke('text').then((text) => {
        const storedText = text
        cy.wrap(storedText).as('storedText')
        cy.log(storedText)
        })
        cy.get('.ant-col > .ant-btn > span').should('be.visible').click()
        cy.get('.ant-modal-body > :nth-child(1) > .ant-col > .ant-typography').should('be.visible').should('contain.text','Payment Confirmation')
        cy.get('@storedText').then(storedText=>{
            cy.get(':nth-child(5) > .ant-col-8 > .ant-typography')
            .should('be.visible').and('contain.text',storedText)
        })
        cy.get('.ant-row-center.m-t-20 > .ant-col > .ant-space > :nth-child(2) > .ant-btn').should('be.visible').click() // pay recipient
        cy.get('.ant-modal-body > :nth-child(1) > .ant-col').should('be.visible').should('contain.text',' Payment Booked - ')
        cy.get('@storedText').then(storedText=>{
            cy.get(':nth-child(5) > .ant-col-8 > .ant-typography')
            .should('be.visible').and('contain.text',storedText)
        })
        newPayment.validateYapilyFlow()
        //newPayment.cancelEasyTransfer()
    })
    //Business Recipient Push Fund
    it('TC_NP_045 - Add 1 recipient(Business) from the "Add Recipient" page with country = Germany and currency = EUR. After adding, make a single payment to the recipient using GBP and push funds.', function(){
        signin.Login(userName, password)
        newRecipient.goToPaymentsDashborad()
        newRecipient.gotoRecipientList()
        let email = batchPayments.generateRandomString(5)+ '@yopmail.com'
        batchPayments.addRecipient('GERMANY{enter}' ,'EUR{enter}' ,email)
        newRecipient.addBankDetails('DE40500105171359375129','AARBDE5W100')
        cy.get('.ant-space > :nth-child(2) > .ant-card > .ant-card-body').should('be.visible').click()
        const bName = batchPayments.generateRandomString(6)
        batchPayments.addBusinessRecipient('BUSINESS EUR'+' '+bName,'GERMANY{enter}')
        batchPayments.paymentPurposeGBPEUR()
        cy.get('.ant-select-selector').eq(3).click()
        cy.get('.ant-select-dropdown').eq(3).find('.ant-select-item-option-content').then(Element=>{
            let purposeList = Element.text()
            cy.log(purposeList)
            cy.wrap(purposeList).as('purposeList')
        })
        newRecipient.saveRecipient()
        newPayment.checkSettelment('be.enabled','be.enabled')
        newPayment.proceedflow('{enter}','GBP')
        let amount = '125'
        newPayment.addrecipientDetail(amount, email)
        newPayment.selectFundingMethod('Push Funds')
          // ───── Intercept Quote API ─────
  cy.intercept(
            'POST',
            `https://main-api.volopa-dev.com/${Cypress.env("apiEnv")}/exchange/b2b/self/quote/temp`
        ).as('quoteApi');

  // ───── Wait for API and Compare Values ─────
  cy.wait('@quoteApi').then(({ response }) => {
    const receive = response.body.data.receive;
    const recipientReceives = response.body.data.recipient[0].receives;

    cy.wrap(recipientReceives).as('recipientReceives');
    cy.log(`Receive: ${receive}`);
    cy.log(`Recipient Receives: ${recipientReceives}`);

    expect(receive).to.eq(recipientReceives); // Final comparison
  });
          //Validate the selected payment purpose
        cy.get('@selectedValue').then(selectedValue=>{
        cy.get('.ant-col-sm-20 > :nth-child(2) > :nth-child(1) > .ant-form-item > .ant-row > .ant-col > .ant-form-item-control-input > .ant-form-item-control-input-content > .ant-select > .ant-select-selector')
        .should('be.visible').and('contain.text',selectedValue)
        })
         //Validate Purpose on batch payment
        cy.get('.ant-select-selector').eq(2).click()
        cy.get('.ant-select-dropdown').eq(2).find('.ant-select-item-option-content').then(Element=>{
            let list = Element.text()
            cy.log(list)
            cy.get('@purposeList').then(purposeList=>{
            expect(list).to.eq(purposeList)
            cy.get('.ant-select-selector').eq(2).click() 
        })
          })
          // Validating recipient recived amount
          cy.get(':nth-child(4) > :nth-child(2) > .ant-typography').invoke('text').then((text) => {
            const storedText = text
            cy.wrap(storedText).as('storedText')
            cy.log(storedText)
            })
            cy.get('.ant-col > .ant-btn > span').should('be.visible').click()
            cy.get('.ant-modal-body > :nth-child(1) > .ant-col > .ant-typography').should('be.visible').should('contain.text','Payment Confirmation')
            cy.get('@storedText').then(storedText=>{
                cy.get(':nth-child(5) > .ant-col-8 > .ant-typography')
                .should('be.visible').and('contain.text',storedText)
            })
            cy.get('.ant-row-center.m-t-20 > .ant-col > .ant-space > :nth-child(2) > .ant-btn').should('be.visible').click() // pay recipient
            cy.get('.ant-modal-body > :nth-child(1) > .ant-col').should('be.visible').should('contain.text',' Payment Booked - ')
            cy.get('@storedText').then(storedText=>{
                cy.get(':nth-child(5) > .ant-col-8 > .ant-typography')
                .should('be.visible').and('contain.text',storedText)
            })
            //////newPayment.cancelPushFunds()
    })
    it('TC_NP_046 - Add 1 recipient(Business) from the "Add Recipient" page with country = France and currency = EUR. After adding, make a single payment to the recipient using GBP and push funds.', function(){
        signin.Login(userName, password)
        newRecipient.goToPaymentsDashborad()
        newRecipient.gotoRecipientList()
        let email = batchPayments.generateRandomString(5)+ '@yopmail.com'
        batchPayments.addRecipient('FRANCE{enter}' ,'EUR{enter}' ,email)
        newRecipient.addBankDetails('FR1420041010050500013M02606','GASKFRPPXXX')
        cy.get('.ant-space > :nth-child(2) > .ant-card > .ant-card-body').should('be.visible').click()
        const bName = batchPayments.generateRandomString(6)
        batchPayments.addBusinessRecipient('BUSINESS EUR'+' '+bName,'FRANCE{enter}')
        batchPayments.paymentPurposeGBPEUR()
        cy.get('.ant-select-selector').eq(3).click()
        cy.get('.ant-select-dropdown').eq(3).find('.ant-select-item-option-content').then(Element=>{
            let purposeList = Element.text()
            cy.log(purposeList)
            cy.wrap(purposeList).as('purposeList')
        })
        newRecipient.saveRecipient()
        newPayment.checkSettelment('be.enabled','be.enabled')
        newPayment.proceedflow('{enter}','GBP')
        let amount = '125'
        newPayment.addrecipientDetail(amount, email)
        newPayment.selectFundingMethod('Push Funds')

          // ───── Intercept Quote API ─────
  cy.intercept(
            'POST',
            `https://main-api.volopa-dev.com/${Cypress.env("apiEnv")}/exchange/b2b/self/quote/temp`
        ).as('quoteApi');

  // ───── Wait for API and Compare Values ─────
  cy.wait('@quoteApi').then(({ response }) => {
    const receive = response.body.data.receive;
    const recipientReceives = response.body.data.recipient[0].receives;

    cy.wrap(recipientReceives).as('recipientReceives');
    cy.log(`Receive: ${receive}`);
    cy.log(`Recipient Receives: ${recipientReceives}`);

    expect(receive).to.eq(recipientReceives); // Final comparison
  });
             //Validate the selected payment purpose
             cy.get('@selectedValue').then(selectedValue=>{
                cy.get('.ant-col-sm-20 > :nth-child(2) > :nth-child(1) > .ant-form-item > .ant-row > .ant-col > .ant-form-item-control-input > .ant-form-item-control-input-content > .ant-select > .ant-select-selector')
                .should('be.visible').and('contain.text',selectedValue)
            })
         //Validate Purpose on batch payment
        cy.get('.ant-select-selector').eq(2).click()
        cy.get('.ant-select-dropdown').eq(2).find('.ant-select-item-option-content').then(Element=>{
            let list = Element.text()
            cy.log(list)
            cy.get('@purposeList').then(purposeList=>{
            expect(list).to.eq(purposeList)
            cy.get('.ant-select-selector').eq(2).click() 
        })
          })
       // Validating recipient recived amount
       cy.get(':nth-child(4) > :nth-child(2) > .ant-typography').invoke('text').then((text) => {
        const storedText = text
        cy.wrap(storedText).as('storedText')
        cy.log(storedText)
        })
        cy.get('.ant-col > .ant-btn > span').should('be.visible').click()
        cy.get('.ant-modal-body > :nth-child(1) > .ant-col > .ant-typography').should('be.visible').should('contain.text','Payment Confirmation')
        cy.get('@storedText').then(storedText=>{
            cy.get(':nth-child(5) > .ant-col-8 > .ant-typography')
            .should('be.visible').and('contain.text',storedText)
        })
        cy.get('.ant-row-center.m-t-20 > .ant-col > .ant-space > :nth-child(2) > .ant-btn').should('be.visible').click() // pay recipient
        cy.get('.ant-modal-body > :nth-child(1) > .ant-col').should('be.visible').should('contain.text',' Payment Booked - ')
        cy.get('@storedText').then(storedText=>{
            cy.get(':nth-child(5) > .ant-col-8 > .ant-typography')
            .should('be.visible').and('contain.text',storedText)
        })
        //////newPayment.cancelPushFunds()
    })
    it('TC_NP_047 - Add 1 recipient(Business) from the "Add Recipient" page with country = Spain and currency = EUR. After adding, make a single payment to the recipient using GBP and push funds.', function(){
        signin.Login(userName, password)
        newRecipient.goToPaymentsDashborad()
        newRecipient.gotoRecipientList()
        let email = batchPayments.generateRandomString(5)+ '@yopmail.com'
        batchPayments.addRecipient('SPAIN{enter}' ,'EUR{enter}' ,email)
        newRecipient.addBankDetails('ES9121000418450200051332','CAGLESMMCOP')
        cy.get('.ant-space > :nth-child(2) > .ant-card > .ant-card-body').should('be.visible').click()
        const bName = batchPayments.generateRandomString(6)
        batchPayments.addBusinessRecipient('BUSINESS EUR'+' '+bName,'SPAIN{enter}')
        batchPayments.paymentPurposeGBPEUR()
        cy.get('.ant-select-selector').eq(3).click()
        cy.get('.ant-select-dropdown').eq(3).find('.ant-select-item-option-content').then(Element=>{
            let purposeList = Element.text()
            cy.log(purposeList)
            cy.wrap(purposeList).as('purposeList')
        })
        newRecipient.saveRecipient()
        newPayment.checkSettelment('be.enabled','be.enabled')
        newPayment.proceedflow('{enter}','GBP')
        let amount = '125'
        newPayment.addrecipientDetail(amount, email)
        newPayment.selectFundingMethod('Push Funds')

          // ───── Intercept Quote API ─────
  cy.intercept(
            'POST',
            `https://main-api.volopa-dev.com/${Cypress.env("apiEnv")}/exchange/b2b/self/quote/temp`
        ).as('quoteApi');

  // ───── Wait for API and Compare Values ─────
  cy.wait('@quoteApi').then(({ response }) => {
    const receive = response.body.data.receive;
    const recipientReceives = response.body.data.recipient[0].receives;

    cy.wrap(recipientReceives).as('recipientReceives');
    cy.log(`Receive: ${receive}`);
    cy.log(`Recipient Receives: ${recipientReceives}`);

    expect(receive).to.eq(recipientReceives); // Final comparison
  });
             //Validate the selected payment purpose
             cy.get('@selectedValue').then(selectedValue=>{
                cy.get('.ant-col-sm-20 > :nth-child(2) > :nth-child(1) > .ant-form-item > .ant-row > .ant-col > .ant-form-item-control-input > .ant-form-item-control-input-content > .ant-select > .ant-select-selector')
                .should('be.visible').and('contain.text',selectedValue)
            })
         //Validate Purpose on batch payment
        cy.get('.ant-select-selector').eq(2).click()
        cy.get('.ant-select-dropdown').eq(2).find('.ant-select-item-option-content').then(Element=>{
            let list = Element.text()
            cy.log(list)
            cy.get('@purposeList').then(purposeList=>{
            expect(list).to.eq(purposeList)
            cy.get('.ant-select-selector').eq(2).click() 
        })
          })
       // Validating recipient recived amount
       cy.get(':nth-child(4) > :nth-child(2) > .ant-typography').invoke('text').then((text) => {
        const storedText = text
        cy.wrap(storedText).as('storedText')
        cy.log(storedText)
        })
        cy.get('.ant-col > .ant-btn > span').should('be.visible').click()
        cy.get('.ant-modal-body > :nth-child(1) > .ant-col > .ant-typography').should('be.visible').should('contain.text','Payment Confirmation')
        cy.get('@storedText').then(storedText=>{
            cy.get(':nth-child(5) > .ant-col-8 > .ant-typography')
            .should('be.visible').and('contain.text',storedText)
        })
        cy.get('.ant-row-center.m-t-20 > .ant-col > .ant-space > :nth-child(2) > .ant-btn').should('be.visible').click() // pay recipient
        cy.get('.ant-modal-body > :nth-child(1) > .ant-col').should('be.visible').should('contain.text',' Payment Booked - ')
        cy.get('@storedText').then(storedText=>{
            cy.get(':nth-child(5) > .ant-col-8 > .ant-typography')
            .should('be.visible').and('contain.text',storedText)
        })
        //////newPayment.cancelPushFunds()
    })
    it('TC_NP_048 - Add 1 recipient(Business) from the "Add Recipient" page with country = Italy and currency = EUR. After adding, make a single payment to the recipient using GBP and push funds.', function(){
        signin.Login(userName, password)
        newRecipient.goToPaymentsDashborad()
        newRecipient.gotoRecipientList()
        let email = batchPayments.generateRandomString(5)+ '@yopmail.com'
        batchPayments.addRecipient('ITALY{enter}' ,'EUR{enter}' ,email)
        newRecipient.addBankDetails('IT60X0542811101000000123456','FCRRITM1XXX')
        cy.get('.ant-space > :nth-child(2) > .ant-card > .ant-card-body').should('be.visible').click()
        const bName = batchPayments.generateRandomString(6)
        batchPayments.addBusinessRecipient('BUSINESS EUR'+' '+bName,'ITALY{enter}')
        batchPayments.paymentPurposeGBPEUR()
        cy.get('.ant-select-selector').eq(3).click()
        cy.get('.ant-select-dropdown').eq(3).find('.ant-select-item-option-content').then(Element=>{
            let purposeList = Element.text()
            cy.log(purposeList)
            cy.wrap(purposeList).as('purposeList')
        })
        newRecipient.saveRecipient()
        newPayment.checkSettelment('be.enabled','be.enabled')
        newPayment.proceedflow('{enter}','GBP')
        let amount = '125'
        newPayment.addrecipientDetail(amount, email)
        newPayment.selectFundingMethod('Push Funds')

          // ───── Intercept Quote API ─────
  cy.intercept(
            'POST',
            `https://main-api.volopa-dev.com/${Cypress.env("apiEnv")}/exchange/b2b/self/quote/temp`
        ).as('quoteApi');

  // ───── Wait for API and Compare Values ─────
  cy.wait('@quoteApi').then(({ response }) => {
    const receive = response.body.data.receive;
    const recipientReceives = response.body.data.recipient[0].receives;

    cy.wrap(recipientReceives).as('recipientReceives');
    cy.log(`Receive: ${receive}`);
    cy.log(`Recipient Receives: ${recipientReceives}`);

    expect(receive).to.eq(recipientReceives); // Final comparison
  });
             //Validate the selected payment purpose
             cy.get('@selectedValue').then(selectedValue=>{
                cy.get('.ant-col-sm-20 > :nth-child(2) > :nth-child(1) > .ant-form-item > .ant-row > .ant-col > .ant-form-item-control-input > .ant-form-item-control-input-content > .ant-select > .ant-select-selector')
                .should('be.visible').and('contain.text',selectedValue)
            })
         //Validate Purpose on batch payment
        cy.get('.ant-select-selector').eq(2).click()
        cy.get('.ant-select-dropdown').eq(2).find('.ant-select-item-option-content').then(Element=>{
            let list = Element.text()
            cy.log(list)
            cy.get('@purposeList').then(purposeList=>{
            expect(list).to.eq(purposeList)
            cy.get('.ant-select-selector').eq(2).click() 
        })
          })
       // Validating recipient recived amount
       cy.get(':nth-child(4) > :nth-child(2) > .ant-typography').invoke('text').then((text) => {
        const storedText = text
        cy.wrap(storedText).as('storedText')
        cy.log(storedText)
        })
        cy.get('.ant-col > .ant-btn > span').should('be.visible').click()
        cy.get('.ant-modal-body > :nth-child(1) > .ant-col > .ant-typography').should('be.visible').should('contain.text','Payment Confirmation')
        cy.get('@storedText').then(storedText=>{
            cy.get(':nth-child(5) > .ant-col-8 > .ant-typography')
            .should('be.visible').and('contain.text',storedText)
        })
        cy.get('.ant-row-center.m-t-20 > .ant-col > .ant-space > :nth-child(2) > .ant-btn').should('be.visible').click() // pay recipient
        cy.get('.ant-modal-body > :nth-child(1) > .ant-col').should('be.visible').should('contain.text',' Payment Booked - ')
        cy.get('@storedText').then(storedText=>{
            cy.get(':nth-child(5) > .ant-col-8 > .ant-typography')
            .should('be.visible').and('contain.text',storedText)
        })
        //////newPayment.cancelPushFunds()
    })
    it('TC_NP_049 - Add 1 recipient(Business) from the "Add Recipient" page with country = Malta and currency = EUR. After adding, make a single payment to the recipient using GBP and push funds.', function(){
        signin.Login(userName, password)
        newRecipient.goToPaymentsDashborad()
        newRecipient.gotoRecipientList()
        let email = batchPayments.generateRandomString(5)+ '@yopmail.com'
        batchPayments.addRecipient('MALTA{enter}' ,'EUR{enter}' ,email)
        newRecipient.addBankDetails('MT84MALT011000012345MTLCAST001S','IESCMTM1XXX')
        cy.get('.ant-space > :nth-child(2) > .ant-card > .ant-card-body').should('be.visible').click()
        const bName = batchPayments.generateRandomString(6)
        batchPayments.addBusinessRecipient('BUSINESS EUR'+' '+bName,'MALTA{enter}')
        batchPayments.paymentPurposeGBPEUR()
        cy.get('.ant-select-selector').eq(3).click()
        cy.get('.ant-select-dropdown').eq(3).find('.ant-select-item-option-content').then(Element=>{
            let purposeList = Element.text()
            cy.log(purposeList)
            cy.wrap(purposeList).as('purposeList')
        })
        newRecipient.saveRecipient()
        newPayment.checkSettelment('be.enabled','be.enabled')
        newPayment.proceedflow('{enter}','GBP')
        let amount = '125'
        newPayment.addrecipientDetail(amount, email)
        newPayment.selectFundingMethod('Push Funds')

          // ───── Intercept Quote API ─────
  cy.intercept(
            'POST',
            `https://main-api.volopa-dev.com/${Cypress.env("apiEnv")}/exchange/b2b/self/quote/temp`
        ).as('quoteApi');

  // ───── Wait for API and Compare Values ─────
  cy.wait('@quoteApi').then(({ response }) => {
    const receive = response.body.data.receive;
    const recipientReceives = response.body.data.recipient[0].receives;

    cy.wrap(recipientReceives).as('recipientReceives');
    cy.log(`Receive: ${receive}`);
    cy.log(`Recipient Receives: ${recipientReceives}`);

    expect(receive).to.eq(recipientReceives); // Final comparison
  });
                //Validate the selected payment purpose
        cy.get('@selectedValue').then(selectedValue=>{
            cy.get('.ant-col-sm-20 > :nth-child(2) > :nth-child(1) > .ant-form-item > .ant-row > .ant-col > .ant-form-item-control-input > .ant-form-item-control-input-content > .ant-select > .ant-select-selector')
            .should('be.visible').and('contain.text',selectedValue)
        })
         //Validate Purpose on batch payment
        cy.get('.ant-select-selector').eq(2).click()
        cy.get('.ant-select-dropdown').eq(2).find('.ant-select-item-option-content').then(Element=>{
            let list = Element.text()
            cy.log(list)
            cy.get('@purposeList').then(purposeList=>{
            expect(list).to.eq(purposeList)
            cy.get('.ant-select-selector').eq(2).click() 
        })
          })
       // Validating recipient recived amount
       cy.get(':nth-child(4) > :nth-child(2) > .ant-typography').invoke('text').then((text) => {
        const storedText = text
        cy.wrap(storedText).as('storedText')
        cy.log(storedText)
        })
        cy.get('.ant-col > .ant-btn > span').should('be.visible').click()
        cy.get('.ant-modal-body > :nth-child(1) > .ant-col > .ant-typography').should('be.visible').should('contain.text','Payment Confirmation')
        cy.get('@storedText').then(storedText=>{
            cy.get(':nth-child(5) > .ant-col-8 > .ant-typography')
            .should('be.visible').and('contain.text',storedText)
        })
        cy.get('.ant-row-center.m-t-20 > .ant-col > .ant-space > :nth-child(2) > .ant-btn').should('be.visible').click() // pay recipient
        cy.get('.ant-modal-body > :nth-child(1) > .ant-col').should('be.visible').should('contain.text',' Payment Booked - ')
        cy.get('@storedText').then(storedText=>{
            cy.get(':nth-child(5) > .ant-col-8 > .ant-typography')
            .should('be.visible').and('contain.text',storedText)
        })
        //////newPayment.cancelPushFunds()
    })
    // Business Easy Transfer
    it('TC_NP_050 - Add 1 recipient(Business) from the "Add Recipient" page with country = Germany and currency = EUR. After adding, make a single payment to the recipient using GBP and easy transfer.', function(){
        signin.Login(userName, password)
        newRecipient.goToPaymentsDashborad()
        newRecipient.gotoRecipientList()
        let email = batchPayments.generateRandomString(5)+ '@yopmail.com'
        batchPayments.addRecipient('GERMANY{enter}' ,'EUR{enter}' ,email)
        newRecipient.addBankDetails('DE40500105171359375129','AARBDE5W100')
        cy.get('.ant-space > :nth-child(2) > .ant-card > .ant-card-body').should('be.visible').click()
        const bName = batchPayments.generateRandomString(6)
        batchPayments.addBusinessRecipient('BUSINESS EUR'+' '+bName,'GERMANY{enter}')
        batchPayments.paymentPurposeGBPEUR()
        cy.get('.ant-select-selector').eq(3).click()
        cy.get('.ant-select-dropdown').eq(3).find('.ant-select-item-option-content').then(Element=>{
            let purposeList = Element.text()
            cy.log(purposeList)
            cy.wrap(purposeList).as('purposeList')
        })
        newRecipient.saveRecipient()
        newPayment.checkSettelment('be.enabled','be.enabled')
        newPayment.proceedflow('{enter}','GBP')
        let amount = '125'
        newPayment.addrecipientDetail(amount, email)
                //Validate the selected payment purpose
        cy.get('@selectedValue').then(selectedValue=>{
            cy.get('.ant-col-sm-20 > :nth-child(2) > :nth-child(1) > :nth-child(1) > .ant-row > .ant-col > .ant-form-item-control-input > .ant-form-item-control-input-content > .ant-select > .ant-select-selector')
            .should('be.visible').and('contain.text',selectedValue)
        })
         //Validate Purpose on batch payment
        cy.get('.ant-select-selector').eq(2).click()
        cy.get('.ant-select-dropdown').eq(1).find('.ant-select-item-option-content').then(Element=>{
            let list = Element.text()
            cy.log(list)
            cy.get('@purposeList').then(purposeList=>{
            expect(list).to.eq(purposeList)
            cy.get('.ant-select-selector').eq(2).click()
        })
          })
       // Validating recipient recived amount
       cy.get(':nth-child(4) > :nth-child(2) > .ant-typography').invoke('text').then((text) => {
        const storedText = text
        cy.wrap(storedText).as('storedText')
        cy.log(storedText)
        })
        cy.get('.ant-col > .ant-btn > span').should('be.visible').click()
        cy.get('.ant-modal-body > :nth-child(1) > .ant-col > .ant-typography').should('be.visible').should('contain.text','Payment Confirmation')
        cy.get('@storedText').then(storedText=>{
            cy.get(':nth-child(5) > .ant-col-8 > .ant-typography')
            .should('be.visible').and('contain.text',storedText)
        })
        cy.get('.ant-row-center.m-t-20 > .ant-col > .ant-space > :nth-child(2) > .ant-btn').should('be.visible').click() // pay recipient
        cy.get('.ant-modal-body > :nth-child(1) > .ant-col').should('be.visible').should('contain.text',' Payment Booked - ')
        cy.get('@storedText').then(storedText=>{
            cy.get(':nth-child(5) > .ant-col-8 > .ant-typography')
            .should('be.visible').and('contain.text',storedText)
        })
        newPayment.validateYapilyFlow()
        //newPayment.cancelEasyTransfer()
    })
    it('TC_NP_051 - Add 1 recipient(Business) from the "Add Recipient" page with country = France and currency = EUR. After adding, make a single payment to the recipient using GBP and easy transfer.', function(){
        signin.Login(userName, password)
        newRecipient.goToPaymentsDashborad()
        newRecipient.gotoRecipientList()
        let email = batchPayments.generateRandomString(5)+ '@yopmail.com'
        batchPayments.addRecipient('FRANCE{enter}' ,'EUR{enter}' ,email)
        newRecipient.addBankDetails('FR1420041010050500013M02606','GASKFRPPXXX')
        cy.get('.ant-space > :nth-child(2) > .ant-card > .ant-card-body').should('be.visible').click()
        const bName = batchPayments.generateRandomString(6)
        batchPayments.addBusinessRecipient('BUSINESS EUR'+' '+bName,'FRANCE{enter}')
        batchPayments.paymentPurposeGBPEUR()
        cy.get('.ant-select-selector').eq(3).click()
        cy.get('.ant-select-dropdown').eq(3).find('.ant-select-item-option-content').then(Element=>{
            let purposeList = Element.text()
            cy.log(purposeList)
            cy.wrap(purposeList).as('purposeList')
        })
        newRecipient.saveRecipient()
        newPayment.checkSettelment('be.enabled','be.enabled')
        newPayment.proceedflow('{enter}','GBP')
        let amount = '125'
        newPayment.addrecipientDetail(amount, email)
                //Validate the selected payment purpose
        cy.get('@selectedValue').then(selectedValue=>{
            cy.get('.ant-col-sm-20 > :nth-child(2) > :nth-child(1) > :nth-child(1) > .ant-row > .ant-col > .ant-form-item-control-input > .ant-form-item-control-input-content > .ant-select > .ant-select-selector')
            .should('be.visible').and('contain.text',selectedValue)
        })
         //Validate Purpose on batch payment
        cy.get('.ant-select-selector').eq(2).click()
        cy.get('.ant-select-dropdown').eq(1).find('.ant-select-item-option-content').then(Element=>{
            let list = Element.text()
            cy.log(list)
            cy.get('@purposeList').then(purposeList=>{
            expect(list).to.eq(purposeList)
            cy.get('.ant-select-selector').eq(2).click()
        })
          })
       // Validating recipient recived amount
       cy.get(':nth-child(4) > :nth-child(2) > .ant-typography').invoke('text').then((text) => {
        const storedText = text
        cy.wrap(storedText).as('storedText')
        cy.log(storedText)
        })
        cy.get('.ant-col > .ant-btn > span').should('be.visible').click()
        cy.get('.ant-modal-body > :nth-child(1) > .ant-col > .ant-typography').should('be.visible').should('contain.text','Payment Confirmation')
        cy.get('@storedText').then(storedText=>{
            cy.get(':nth-child(5) > .ant-col-8 > .ant-typography')
            .should('be.visible').and('contain.text',storedText)
        })
        cy.get('.ant-row-center.m-t-20 > .ant-col > .ant-space > :nth-child(2) > .ant-btn').should('be.visible').click() // pay recipient
        cy.get('.ant-modal-body > :nth-child(1) > .ant-col').should('be.visible').should('contain.text',' Payment Booked - ')
        cy.get('@storedText').then(storedText=>{
            cy.get(':nth-child(5) > .ant-col-8 > .ant-typography')
            .should('be.visible').and('contain.text',storedText)
        })
            newPayment.validateYapilyFlow()
            //newPayment.cancelEasyTransfer()
    })
    it('TC_NP_052 - Add 1 recipient(Business) from the "Add Recipient" page with country = Spain and currency = EUR. After adding, make a single payment to the recipient using GBP and easy transfer.', function(){
        signin.Login(userName, password)
        newRecipient.goToPaymentsDashborad()
        newRecipient.gotoRecipientList()
        let email = batchPayments.generateRandomString(5)+ '@yopmail.com'
        batchPayments.addRecipient('SPAIN{enter}' ,'EUR{enter}' ,email)
        newRecipient.addBankDetails('ES9121000418450200051332','CAGLESMMCOP')
        cy.get('.ant-space > :nth-child(2) > .ant-card > .ant-card-body').should('be.visible').click()
        const bName = batchPayments.generateRandomString(6)
        batchPayments.addBusinessRecipient('BUSINESS EUR'+' '+bName,'SPAIN{enter}')
        batchPayments.paymentPurposeGBPEUR()
        cy.get('.ant-select-selector').eq(3).click()
        cy.get('.ant-select-dropdown').eq(3).find('.ant-select-item-option-content').then(Element=>{
            let purposeList = Element.text()
            cy.log(purposeList)
            cy.wrap(purposeList).as('purposeList')
        })
        newRecipient.saveRecipient()
        newPayment.checkSettelment('be.enabled','be.enabled')
        newPayment.proceedflow('{enter}','GBP')
        let amount = '125'
        newPayment.addrecipientDetail(amount, email)
                //Validate the selected payment purpose
        cy.get('@selectedValue').then(selectedValue=>{
            cy.get('.ant-col-sm-20 > :nth-child(2) > :nth-child(1) > :nth-child(1) > .ant-row > .ant-col > .ant-form-item-control-input > .ant-form-item-control-input-content > .ant-select > .ant-select-selector')
            .should('be.visible').and('contain.text',selectedValue)
        })
         //Validate Purpose on batch payment
        cy.get('.ant-select-selector').eq(2).click()
        cy.get('.ant-select-dropdown').eq(1).find('.ant-select-item-option-content').then(Element=>{
            let list = Element.text()
            cy.log(list)
            cy.get('@purposeList').then(purposeList=>{
            expect(list).to.eq(purposeList)
            cy.get('.ant-select-selector').eq(2).click()
        })
          })
       // Validating recipient recived amount
       cy.get(':nth-child(4) > :nth-child(2) > .ant-typography').invoke('text').then((text) => {
        const storedText = text
        cy.wrap(storedText).as('storedText')
        cy.log(storedText)
        })
        cy.get('.ant-col > .ant-btn > span').should('be.visible').click()
        cy.get('.ant-modal-body > :nth-child(1) > .ant-col > .ant-typography').should('be.visible').should('contain.text','Payment Confirmation')
        cy.get('@storedText').then(storedText=>{
            cy.get(':nth-child(5) > .ant-col-8 > .ant-typography')
            .should('be.visible').and('contain.text',storedText)
        })
        cy.get('.ant-row-center.m-t-20 > .ant-col > .ant-space > :nth-child(2) > .ant-btn').should('be.visible').click() // pay recipient
        cy.get('.ant-modal-body > :nth-child(1) > .ant-col').should('be.visible').should('contain.text',' Payment Booked - ')
        cy.get('@storedText').then(storedText=>{
            cy.get(':nth-child(5) > .ant-col-8 > .ant-typography')
            .should('be.visible').and('contain.text',storedText)
        })
            newPayment.validateYapilyFlow()
            //newPayment.cancelEasyTransfer()
    })
    it('TC_NP_053 - Add 1 recipient(Business) from the "Add Recipient" page with country = Italy and currency = EUR. After adding, make a single payment to the recipient using GBP and easy transfer.', function(){
        signin.Login(userName, password)
        newRecipient.goToPaymentsDashborad()
        newRecipient.gotoRecipientList()
        let email = batchPayments.generateRandomString(5)+ '@yopmail.com'
        batchPayments.addRecipient('ITALY{enter}' ,'EUR{enter}' ,email)
        newRecipient.addBankDetails('IT60X0542811101000000123456','FCRRITM1XXX')
        const lName = batchPayments.generateRandomString(6)
        batchPayments.individualRecipient('INDIVIDUAL GBP PF',lName,'ITALY{enter}')
        batchPayments.paymentPurposeGBPEUR()
        cy.get('.ant-select-selector').eq(3).click()
        cy.get('.ant-select-dropdown').eq(3).find('.ant-select-item-option-content').then(Element=>{
            let purposeList = Element.text()
            cy.log(purposeList)
            cy.wrap(purposeList).as('purposeList')
        })
        newRecipient.saveRecipient()
        newPayment.checkSettelment('be.enabled','be.enabled')
        newPayment.proceedflow('{enter}','GBP')
        let amount = '125'
        newPayment.addrecipientDetail(amount, email)
                //Validate the selected payment purpose
        cy.get('@selectedValue').then(selectedValue=>{
            cy.get('.ant-col-sm-20 > :nth-child(2) > :nth-child(1) > :nth-child(1) > .ant-row > .ant-col > .ant-form-item-control-input > .ant-form-item-control-input-content > .ant-select > .ant-select-selector')
            .should('be.visible').and('contain.text',selectedValue)
        })
         //Validate Purpose on batch payment
        cy.get('.ant-select-selector').eq(2).click()
        cy.get('.ant-select-dropdown').eq(1).find('.ant-select-item-option-content').then(Element=>{
            let list = Element.text()
            cy.log(list)
            cy.get('@purposeList').then(purposeList=>{
            expect(list).to.eq(purposeList)
            cy.get('.ant-select-selector').eq(2).click()
        })
          })
       // Validating recipient recived amount
       cy.get(':nth-child(4) > :nth-child(2) > .ant-typography').invoke('text').then((text) => {
        const storedText = text
        cy.wrap(storedText).as('storedText')
        cy.log(storedText)
        })
        cy.get('.ant-col > .ant-btn > span').should('be.visible').click()
        cy.get('.ant-modal-body > :nth-child(1) > .ant-col > .ant-typography').should('be.visible').should('contain.text','Payment Confirmation')
        cy.get('@storedText').then(storedText=>{
            cy.get(':nth-child(5) > .ant-col-8 > .ant-typography')
            .should('be.visible').and('contain.text',storedText)
        })
        cy.get('.ant-row-center.m-t-20 > .ant-col > .ant-space > :nth-child(2) > .ant-btn').should('be.visible').click() // pay recipient
        cy.get('.ant-modal-body > :nth-child(1) > .ant-col').should('be.visible').should('contain.text',' Payment Booked - ')
        cy.get('@storedText').then(storedText=>{
            cy.get(':nth-child(5) > .ant-col-8 > .ant-typography')
            .should('be.visible').and('contain.text',storedText)
        })
        newPayment.validateYapilyFlow()
        //newPayment.cancelEasyTransfer()
    })
    it('TC_NP_054 - Add 1 recipient(Business) from the "Add Recipient" page with country = Malta and currency = EUR. After adding, make a single payment to the recipient using GBP and easy transfer.', function(){
        signin.Login(userName, password)
        newRecipient.goToPaymentsDashborad()
        newRecipient.gotoRecipientList()
        let email = batchPayments.generateRandomString(5)+ '@yopmail.com'
        batchPayments.addRecipient('MALTA{enter}' ,'EUR{enter}' ,email)
        newRecipient.addBankDetails('MT84MALT011000012345MTLCAST001S','IESCMTM1XXX')
        cy.get('.ant-space > :nth-child(2) > .ant-card > .ant-card-body').should('be.visible').click()
        const bName = batchPayments.generateRandomString(6)
        batchPayments.addBusinessRecipient('BUSINESS EUR'+' '+bName,'MALTA{enter}')
        batchPayments.paymentPurposeGBPEUR()
        cy.get('.ant-select-selector').eq(3).click()
        cy.get('.ant-select-dropdown').eq(3).find('.ant-select-item-option-content').then(Element=>{
            let purposeList = Element.text()
            cy.log(purposeList)
            cy.wrap(purposeList).as('purposeList')
        })
        newRecipient.saveRecipient()
        newPayment.checkSettelment('be.enabled','be.enabled')
        newPayment.proceedflow('{enter}','GBP')
        let amount = '125'
        newPayment.addrecipientDetail(amount, email)
                //Validate the selected payment purpose
        cy.get('@selectedValue').then(selectedValue=>{
            cy.get('.ant-col-sm-20 > :nth-child(2) > :nth-child(1) > :nth-child(1) > .ant-row > .ant-col > .ant-form-item-control-input > .ant-form-item-control-input-content > .ant-select > .ant-select-selector')
            .should('be.visible').and('contain.text',selectedValue)
        })
         //Validate Purpose on batch payment
        cy.get('.ant-select-selector').eq(2).click()
        cy.get('.ant-select-dropdown').eq(1).find('.ant-select-item-option-content').then(Element=>{
            let list = Element.text()
            cy.log(list)
            cy.get('@purposeList').then(purposeList=>{
            expect(list).to.eq(purposeList)
            cy.get('.ant-select-selector').eq(2).click()
        })
          })
       // Validating recipient recived amount
       cy.get(':nth-child(4) > :nth-child(2) > .ant-typography').invoke('text').then((text) => {
        const storedText = text
        cy.wrap(storedText).as('storedText')
        cy.log(storedText)
        })
        cy.get('.ant-col > .ant-btn > span').should('be.visible').click()
        cy.get('.ant-modal-body > :nth-child(1) > .ant-col > .ant-typography').should('be.visible').should('contain.text','Payment Confirmation')
        cy.get('@storedText').then(storedText=>{
            cy.get(':nth-child(5) > .ant-col-8 > .ant-typography')
            .should('be.visible').and('contain.text',storedText)
        })
        cy.get('.ant-row-center.m-t-20 > .ant-col > .ant-space > :nth-child(2) > .ant-btn').should('be.visible').click() // pay recipient
        cy.get('.ant-modal-body > :nth-child(1) > .ant-col').should('be.visible').should('contain.text',' Payment Booked - ')
        cy.get('@storedText').then(storedText=>{
            cy.get(':nth-child(5) > .ant-col-8 > .ant-typography')
            .should('be.visible').and('contain.text',storedText)
        })
        newPayment.validateYapilyFlow()
        //newPayment.cancelEasyTransfer()
    })
    // Individual Push Fund
    it('TC_NP_55 - Add 1 recipient(individual) from the "Add Recipient" page with country = Australia and currency = AUD. After adding, make a single payment to the recipient using GBP and push funds.', function(){
        signin.Login(userName, password)
        newRecipient.goToPaymentsDashborad()
        newRecipient.gotoRecipientList()
        let email = batchPayments.generateRandomString(5)+ '@yopmail.com'
        batchPayments.addRecipient('AUSTRALIA{enter}' ,'AUD{enter}' ,email)
        batchPayments.addBankDetailAUS('ABNAAU2BXXX','123456789','939200')
        const lName = batchPayments.generateRandomString(6)
        batchPayments.individualRecipient('INDIVIDUAL Australia ',lName,'Australia{enter}')
        cy.get('#postcode').type('54000')
        batchPayments.paymentPurposeGBPEUR()
        cy.get('.ant-select-selector').eq(3).click()
        cy.get('.ant-select-dropdown').eq(3).find('.ant-select-item-option-content').then(Element=>{
            let purposeList = Element.text()
            cy.log(purposeList)
            cy.wrap(purposeList).as('purposeList')
        })
        newRecipient.saveRecipient()
        newPayment.checkSettelment('be.enabled','be.enabled')
        newPayment.proceedflow('{downarrow}{enter}','GBP')
        let amount = '125'
        newPayment.addrecipientDetail(amount, email)
        newPayment.selectFundingMethod('Push Funds')
          // ───── Intercept Quote API ─────
  cy.intercept(
            'POST',
            `https://main-api.volopa-dev.com/${Cypress.env("apiEnv")}/exchange/b2b/self/quote/temp`
        ).as('quoteApi');

  // ───── Wait for API and Compare Values ─────
  cy.wait('@quoteApi').then(({ response }) => {
    const receive = response.body.data.receive;
    const recipientReceives = response.body.data.recipient[0].receives;

    cy.wrap(recipientReceives).as('recipientReceives');
    cy.log(`Receive: ${receive}`);
    cy.log(`Recipient Receives: ${recipientReceives}`);

    expect(receive).to.eq(recipientReceives); // Final comparison
  });
         //Validate the selected payment purpose
         cy.get('@selectedValue').then(selectedValue=>{
            cy.get('.ant-col-sm-20 > :nth-child(2) > :nth-child(1) > .ant-form-item > .ant-row > .ant-col > .ant-form-item-control-input > .ant-form-item-control-input-content > .ant-select > .ant-select-selector')
            .should('be.visible').and('contain.text',selectedValue)
            })
         //Validate Purpose on single payment
        cy.get('.ant-select-selector').eq(2).click()
        cy.get('.ant-select-dropdown').eq(2).find('.ant-select-item-option-content').then(Element=>{
            let list = Element.text()
            cy.log(list)
            cy.get('@purposeList').then(purposeList=>{
            expect(list).to.eq(purposeList)
            cy.get('.ant-select-selector').eq(2).click()
        })
          })
            // Validating recipient recived amount
          cy.get(':nth-child(4) > :nth-child(2) > .ant-typography').invoke('text').then((text) => {
            const storedText = text
            cy.wrap(storedText).as('storedText')
            cy.log(storedText)
            })
            cy.get('.ant-col > .ant-btn > span').should('be.visible').click()
            cy.get('.ant-modal-body > :nth-child(1) > .ant-col > .ant-typography').should('be.visible').should('contain.text','Payment Confirmation')
            cy.get('@storedText').then(storedText=>{
                cy.get(':nth-child(5) > .ant-col-8 > .ant-typography')
                .should('be.visible').and('contain.text',storedText)
            })
            cy.get('.ant-row-center.m-t-20 > .ant-col > .ant-space > :nth-child(2) > .ant-btn').should('be.visible').click() // pay recipient
            cy.get('.ant-modal-body > :nth-child(1) > .ant-col').should('be.visible').should('contain.text',' Payment Booked - ')
            cy.get('@storedText').then(storedText=>{
                cy.get(':nth-child(5) > .ant-col-8 > .ant-typography')
                .should('be.visible').and('contain.text',storedText)
            })
            //////newPayment.cancelPushFunds()
    })
    it('TC_NP_56 - Add 1 recipient(individual) from the "Add Recipient" page with country = Canada and currency = CAD. After adding, make a single payment to the recipient using GBP and push funds.', function(){
        signin.Login(userName, password)
        newRecipient.goToPaymentsDashborad()
        newRecipient.gotoRecipientList()
        let email = batchPayments.generateRandomString(5)+ '@yopmail.com'
        batchPayments.addRecipient('CANADA{enter}' ,'CAD{enter}' ,email)
        batchPayments.addBankDetailCAD('BNDCCAMMXXX','26207729','004','01372')
        const lName = batchPayments.generateRandomString(6)
        batchPayments.individualRecipient('INDIVIDUAL Canada ',lName,'Canada{enter}')
        newRecipient.postCodeStateCanada()
        batchPayments.paymentPurposeGBPEUR()
        cy.get('.ant-select-selector').eq(4).click()
        cy.get('.ant-select-dropdown').eq(4).find('.ant-select-item-option-content').then(Element=>{
            let purposeList = Element.text()
            cy.log(purposeList)
            cy.wrap(purposeList).as('purposeList')
        })
        newRecipient.saveRecipient()
        newPayment.checkSettelment('be.enabled','be.enabled')
        newPayment.proceedflow('{downarrow}{enter}','GBP')
        let amount = '125'
        newPayment.addrecipientDetail(amount, email)
        newPayment.selectFundingMethod('Push Funds')

          // ───── Intercept Quote API ─────
  cy.intercept(
            'POST',
            `https://main-api.volopa-dev.com/${Cypress.env("apiEnv")}/exchange/b2b/self/quote/temp`
        ).as('quoteApi');

  // ───── Wait for API and Compare Values ─────
  cy.wait('@quoteApi').then(({ response }) => {
    const receive = response.body.data.receive;
    const recipientReceives = response.body.data.recipient[0].receives;

    cy.wrap(recipientReceives).as('recipientReceives');
    cy.log(`Receive: ${receive}`);
    cy.log(`Recipient Receives: ${recipientReceives}`);

    expect(receive).to.eq(recipientReceives); // Final comparison
  });
         //Validate the selected payment purpose
         cy.get('@selectedValue').then(selectedValue=>{
            cy.get('.ant-col-sm-20 > :nth-child(2) > :nth-child(1) > .ant-form-item > .ant-row > .ant-col > .ant-form-item-control-input > .ant-form-item-control-input-content > .ant-select > .ant-select-selector')
            .should('be.visible').and('contain.text',selectedValue)
            })
         //Validate Purpose on single payment
        cy.get('.ant-select-selector').eq(2).click()
        cy.get('.ant-select-dropdown').eq(2).find('.ant-select-item-option-content').then(Element=>{
            let list = Element.text()
            cy.log(list)
            cy.get('@purposeList').then(purposeList=>{
            expect(list).to.eq(purposeList)
            cy.get('.ant-select-selector').eq(2).click()
        })
          })
            // Validating recipient recived amount
          cy.get(':nth-child(4) > :nth-child(2) > .ant-typography').invoke('text').then((text) => {
            const storedText = text
            cy.wrap(storedText).as('storedText')
            cy.log(storedText)
            })
            cy.get('.ant-col > .ant-btn > span').should('be.visible').click()
            cy.get('.ant-modal-body > :nth-child(1) > .ant-col > .ant-typography').should('be.visible').should('contain.text','Payment Confirmation')
            cy.get('@storedText').then(storedText=>{
                cy.get(':nth-child(5) > .ant-col-8 > .ant-typography')
                .should('be.visible').and('contain.text',storedText)
            })
            cy.get('.ant-row-center.m-t-20 > .ant-col > .ant-space > :nth-child(2) > .ant-btn').should('be.visible').click() // pay recipient
            cy.get('.ant-modal-body > :nth-child(1) > .ant-col').should('be.visible').should('contain.text',' Payment Booked - ')
            cy.get('@storedText').then(storedText=>{
                cy.get(':nth-child(5) > .ant-col-8 > .ant-typography')
                .should('be.visible').and('contain.text',storedText)
            })
            //////newPayment.cancelPushFunds()
    })
    it('TC_NP_57 - Add 1 recipient(individual) from the "Add Recipient" page with country = Singapore and currency = SGD. After adding, make a single payment to the recipient using GBP and push funds.', function(){
        signin.Login(userName, password)
        newRecipient.goToPaymentsDashborad()
        newRecipient.gotoRecipientList()
        let email = batchPayments.generateRandomString(5)+ '@yopmail.com'
        batchPayments.addRecipient('SINGAPORE{enter}' ,'SGD{enter}' ,email)
        newRecipient.addBankDetailsWithAccNo('ACLPSGSG','049712')
        const lName = batchPayments.generateRandomString(6)
        batchPayments.individualRecipient('INDIVIDUAL Singapore ',lName,'Singapore{enter}')
        
        batchPayments.paymentPurposeGBPEUR()
        cy.get('.ant-select-selector').eq(3).click()
        cy.get('.ant-select-dropdown').eq(3).find('.ant-select-item-option-content').then(Element=>{
            let purposeList = Element.text()
            cy.log(purposeList)
            cy.wrap(purposeList).as('purposeList')
        })
        newRecipient.saveRecipient()
        newPayment.checkSettelment('be.enabled','be.enabled')
        newPayment.proceedflow('{downarrow}{enter}','GBP')
        let amount = '125'
        newPayment.addrecipientDetail(amount, email)
        newPayment.selectFundingMethod('Push Funds')

          // ───── Intercept Quote API ─────
  cy.intercept(
            'POST',
            `https://main-api.volopa-dev.com/${Cypress.env("apiEnv")}/exchange/b2b/self/quote/temp`
        ).as('quoteApi');

  // ───── Wait for API and Compare Values ─────
  cy.wait('@quoteApi').then(({ response }) => {
    const receive = response.body.data.receive;
    const recipientReceives = response.body.data.recipient[0].receives;

    cy.wrap(recipientReceives).as('recipientReceives');
    cy.log(`Receive: ${receive}`);
    cy.log(`Recipient Receives: ${recipientReceives}`);

    expect(receive).to.eq(recipientReceives); // Final comparison
  });
         //Validate the selected payment purpose
         cy.get('@selectedValue').then(selectedValue=>{
            cy.get('.ant-col-sm-20 > :nth-child(2) > :nth-child(1) > .ant-form-item > .ant-row > .ant-col > .ant-form-item-control-input > .ant-form-item-control-input-content > .ant-select > .ant-select-selector')
            .should('be.visible').and('contain.text',selectedValue)
            })
         //Validate Purpose on single payment
        cy.get('.ant-select-selector').eq(2).click()
        cy.get('.ant-select-dropdown').eq(2).find('.ant-select-item-option-content').then(Element=>{
            let list = Element.text()
            cy.log(list)
            cy.get('@purposeList').then(purposeList=>{
            expect(list).to.eq(purposeList)
            cy.get('.ant-select-selector').eq(2).click()
        })
          })
            // Validating recipient recived amount
          cy.get(':nth-child(4) > :nth-child(2) > .ant-typography').invoke('text').then((text) => {
            const storedText = text
            cy.wrap(storedText).as('storedText')
            cy.log(storedText)
            })
            cy.get('.ant-col > .ant-btn > span').should('be.visible').click()
            cy.get('.ant-modal-body > :nth-child(1) > .ant-col > .ant-typography').should('be.visible').should('contain.text','Payment Confirmation')
            cy.get('@storedText').then(storedText=>{
                cy.get(':nth-child(5) > .ant-col-8 > .ant-typography')
                .should('be.visible').and('contain.text',storedText)
            })
            cy.get('.ant-row-center.m-t-20 > .ant-col > .ant-space > :nth-child(2) > .ant-btn').should('be.visible').click() // pay recipient
            cy.get('.ant-modal-body > :nth-child(1) > .ant-col').should('be.visible').should('contain.text',' Payment Booked - ')
            cy.get('@storedText').then(storedText=>{
                cy.get(':nth-child(5) > .ant-col-8 > .ant-typography')
                .should('be.visible').and('contain.text',storedText)
            })
            //////newPayment.cancelPushFunds()
    })
    it('TC_NP_58 - Add 1 recipient(individual) from the "Add Recipient" page with country = HongKong and currency = HKD. After adding, make a single payment to the recipient using GBP and push funds.', function(){
        signin.Login(userName, password)
        newRecipient.goToPaymentsDashborad()
        newRecipient.gotoRecipientList()
        let email = batchPayments.generateRandomString(5)+ '@yopmail.com'
        batchPayments.addRecipient('HONG KONG{enter}' ,'HKD{enter}' ,email)
        batchPayments.addBankDetailHKD('HSBCHKHH','1234657890','004')
        const lName = batchPayments.generateRandomString(6)
        batchPayments.individualRecipient('INDIVIDUAL HongKong ',lName,'HONG KONG{enter}')
        
        batchPayments.paymentPurposeGBPEUR()
        cy.get('.ant-select-selector').eq(3).click()
        cy.get('.ant-select-dropdown').eq(3).find('.ant-select-item-option-content').then(Element=>{
            let purposeList = Element.text()
            cy.log(purposeList)
            cy.wrap(purposeList).as('purposeList')
        })
        newRecipient.saveRecipient()
        newPayment.checkSettelment('be.enabled','be.enabled')
        newPayment.proceedflow('{downarrow}{enter}','GBP')
        let amount = '125'
        newPayment.addrecipientDetail(amount, email)
        newPayment.selectFundingMethod('Push Funds')

          // ───── Intercept Quote API ─────
  cy.intercept(
            'POST',
            `https://main-api.volopa-dev.com/${Cypress.env("apiEnv")}/exchange/b2b/self/quote/temp`
        ).as('quoteApi');

  // ───── Wait for API and Compare Values ─────
  cy.wait('@quoteApi').then(({ response }) => {
    const receive = response.body.data.receive;
    const recipientReceives = response.body.data.recipient[0].receives;

    cy.wrap(recipientReceives).as('recipientReceives');
    cy.log(`Receive: ${receive}`);
    cy.log(`Recipient Receives: ${recipientReceives}`);

    expect(receive).to.eq(recipientReceives); // Final comparison
  });
         //Validate the selected payment purpose
         cy.get('@selectedValue').then(selectedValue=>{
            cy.get('.ant-col-sm-20 > :nth-child(2) > :nth-child(1) > .ant-form-item > .ant-row > .ant-col > .ant-form-item-control-input > .ant-form-item-control-input-content > .ant-select > .ant-select-selector')
            .should('be.visible').and('contain.text',selectedValue)
            })
         //Validate Purpose on single payment
        cy.get('.ant-select-selector').eq(2).click()
        cy.get('.ant-select-dropdown').eq(2).find('.ant-select-item-option-content').then(Element=>{
            let list = Element.text()
            cy.log(list)
            cy.get('@purposeList').then(purposeList=>{
            expect(list).to.eq(purposeList)
            cy.get('.ant-select-selector').eq(2).click()
        })
          })
            // Validating recipient recived amount
          cy.get(':nth-child(4) > :nth-child(2) > .ant-typography').invoke('text').then((text) => {
            const storedText = text
            cy.wrap(storedText).as('storedText')
            cy.log(storedText)
            })
            cy.get('.ant-col > .ant-btn > span').should('be.visible').click()
            cy.get('.ant-modal-body > :nth-child(1) > .ant-col > .ant-typography').should('be.visible').should('contain.text','Payment Confirmation')
            cy.get('@storedText').then(storedText=>{
                cy.get(':nth-child(5) > .ant-col-8 > .ant-typography')
                .should('be.visible').and('contain.text',storedText)
            })
            cy.get('.ant-row-center.m-t-20 > .ant-col > .ant-space > :nth-child(2) > .ant-btn').should('be.visible').click() // pay recipient
            cy.get('.ant-modal-body > :nth-child(1) > .ant-col').should('be.visible').should('contain.text',' Payment Booked - ')
            cy.get('@storedText').then(storedText=>{
                cy.get(':nth-child(5) > .ant-col-8 > .ant-typography')
                .should('be.visible').and('contain.text',storedText)
            })
            //////newPayment.cancelPushFunds()
    })
    xit('TC_NP_59 - Add 1 recipient(individual) from the "Add Recipient" page with country = Mexico and currency = MXN. After adding, make a single payment to the recipient using GBP and push funds.', function(){
        signin.Login(userName, password)
        newRecipient.goToPaymentsDashborad()
        newRecipient.gotoRecipientList()
        let email = batchPayments.generateRandomString(5)+ '@yopmail.com'
        batchPayments.addRecipient('MEXICO{enter}' ,'MXN{enter}' ,email)
        newRecipient.addBankDetailsWithClabe('AFIRMXMT','002010077777777771')
        //cy.get(':nth-child(5) > .ant-col-xs-24 > .ant-form-item > .ant-row > .ant-form-item-label > .ant-form-item-required > .ant-typography').should('contain.text','Bank Account Type')
        //cy.get('#accountType').type('Saving{enter}') just for corpay
        const lName = batchPayments.generateRandomString(6)
        batchPayments.individualRecipient('INDIVIDUAL Mexico ',lName,'Mexico{enter}')
        newRecipient.postCodeState()
        batchPayments.paymentPurposeGBPEUR()
        cy.get('.ant-select-selector').eq(4).click()
        cy.get('.ant-select-dropdown').eq(4).find('.ant-select-item-option-content').then(Element=>{
            let purposeList = Element.text()
            cy.log(purposeList)
            cy.wrap(purposeList).as('purposeList')
        })
        newRecipient.saveRecipient()
        newPayment.checkSettelment('be.disabled','be.enabled')
        newPayment.proceedflow('{downarrow}{enter}','GBP')
        let amount = '125'
        newPayment.addrecipientDetail(amount, email)
        newPayment.selectFundingMethod('Push Funds')

          // ───── Intercept Quote API ─────
  cy.intercept(
            'POST',
            `https://main-api.volopa-dev.com/${Cypress.env("apiEnv")}/exchange/b2b/self/quote/temp`
        ).as('quoteApi');

  // ───── Wait for API and Compare Values ─────
  cy.wait('@quoteApi').then(({ response }) => {
    const receive = response.body.data.receive;
    const recipientReceives = response.body.data.recipient[0].receives;

    cy.wrap(recipientReceives).as('recipientReceives');
    cy.log(`Receive: ${receive}`);
    cy.log(`Recipient Receives: ${recipientReceives}`);

    expect(receive).to.eq(recipientReceives); // Final comparison
  });
         //Validate the selected payment purpose
         cy.get('@selectedValue').then(selectedValue=>{
           cy.get('.ant-col-sm-20 > :nth-child(2) > :nth-child(1) > .ant-form-item > .ant-row > .ant-col > .ant-form-item-control-input > .ant-form-item-control-input-content > .ant-select > .ant-select-selector')
            .should('be.visible').and('contain.text',selectedValue)
            })
         //Validate Purpose on single payment
        cy.get('.ant-select-selector').eq(2).click()
        cy.get('.ant-select-dropdown').eq(2).find('.ant-select-item-option-content').then(Element=>{
            let list = Element.text()
            cy.log(list)
            cy.get('@purposeList').then(purposeList=>{
            expect(list).to.eq(purposeList)
            cy.get('.ant-select-selector').eq(2).click()
        })
          })
            // Validating recipient recived amount
          cy.get(':nth-child(4) > :nth-child(2) > .ant-typography').invoke('text').then((text) => {
            const storedText = text
            cy.wrap(storedText).as('storedText')
            cy.log(storedText)
            })
            cy.get('.ant-col > .ant-btn > span').should('be.visible').click()
            cy.get('.ant-modal-body > :nth-child(1) > .ant-col > .ant-typography').should('be.visible').should('contain.text','Payment Confirmation')
            cy.get('@storedText').then(storedText=>{
                cy.get(':nth-child(5) > .ant-col-8 > .ant-typography')
                .should('be.visible').and('contain.text',storedText)
            })
            cy.get('.ant-row-center.m-t-20 > .ant-col > .ant-space > :nth-child(2) > .ant-btn').should('be.visible').click() // pay recipient
            cy.get('.ant-modal-body > :nth-child(1) > .ant-col').should('be.visible').should('contain.text',' Payment Booked - ')
            cy.get('@storedText').then(storedText=>{
                cy.get(':nth-child(5) > .ant-col-8 > .ant-typography')
                .should('be.visible').and('contain.text',storedText)
            })
            //////newPayment.cancelPushFunds()
    })
    // Individual Easy Transfer
    it('TC_NP_60 - Add 1 recipient(individual) from the "Add Recipient" page with country = Australia and currency = AUD. After adding, make a single payment to the recipient using GBP and easy transfer.', function(){
        signin.Login(userName, password)
        newRecipient.goToPaymentsDashborad()
        newRecipient.gotoRecipientList()
        let email = batchPayments.generateRandomString(5)+ '@yopmail.com'
        batchPayments.addRecipient('AUSTRALIA{enter}' ,'AUD{enter}' ,email)
        batchPayments.addBankDetailAUS('ABNAAU2BXXX','123456789','939200')
        const lName = batchPayments.generateRandomString(6)
        batchPayments.individualRecipient('INDIVIDUAL Australia ',lName,'Australia{enter}')
        cy.get('#postcode').type('54000')
        batchPayments.paymentPurposeGBPEUR()
        cy.get('.ant-select-selector').eq(3).click()
        cy.get('.ant-select-dropdown').eq(3).find('.ant-select-item-option-content').then(Element=>{
            let purposeList = Element.text()
            cy.log(purposeList)
            cy.wrap(purposeList).as('purposeList')
        })
        newRecipient.saveRecipient()
        newPayment.checkSettelment('be.enabled','be.enabled')
        newPayment.proceedflow('{downarrow}{enter}','GBP')
        let amount = '125'
        newPayment.addrecipientDetail(amount, email)
         //Validate the selected payment purpose
         cy.get('@selectedValue').then(selectedValue=>{
            cy.get('.ant-col-sm-20 > :nth-child(2) > :nth-child(1) > :nth-child(1) > .ant-row > .ant-col > .ant-form-item-control-input > .ant-form-item-control-input-content > .ant-select > .ant-select-selector')
            .should('be.visible').and('contain.text',selectedValue)
            })
         //Validate Purpose on single payment
        cy.get('.ant-select-selector').eq(2).click()
        cy.get('.ant-select-dropdown').eq(1).find('.ant-select-item-option-content').then(Element=>{
            let list = Element.text()
            cy.log(list)
            cy.get('@purposeList').then(purposeList=>{
            expect(list).to.eq(purposeList)
            cy.get('.ant-select-selector').eq(2).click()
        })
          })
            // Validating recipient recived amount
          cy.get(':nth-child(4) > :nth-child(2) > .ant-typography').invoke('text').then((text) => {
            const storedText = text
            cy.wrap(storedText).as('storedText')
            cy.log(storedText)
            })
            cy.get('.ant-col > .ant-btn > span').should('be.visible').click()
            cy.get('.ant-modal-body > :nth-child(1) > .ant-col > .ant-typography').should('be.visible').should('contain.text','Payment Confirmation')
            cy.get('@storedText').then(storedText=>{
                cy.get(':nth-child(5) > .ant-col-8 > .ant-typography')
                .should('be.visible').and('contain.text',storedText)
            })
            cy.get('.ant-row-center.m-t-20 > .ant-col > .ant-space > :nth-child(2) > .ant-btn').should('be.visible').click() // pay recipient
            cy.get('.ant-modal-body > :nth-child(1) > .ant-col').should('be.visible').should('contain.text',' Payment Booked - ')
            cy.get('@storedText').then(storedText=>{
                cy.get(':nth-child(5) > .ant-col-8 > .ant-typography')
                .should('be.visible').and('contain.text',storedText)
            })
            newPayment.validateYapilyFlow()
            //newPayment.cancelEasyTransfer()
    })
    it('TC_NP_61 - Add 1 recipient(individual) from the "Add Recipient" page with country = Canada and currency = CAD. After adding, make a single payment to the recipient using GBP and easy transfer.', function(){
        signin.Login(userName, password)
        newRecipient.goToPaymentsDashborad()
        newRecipient.gotoRecipientList()
        let email = batchPayments.generateRandomString(5)+ '@yopmail.com'
        batchPayments.addRecipient('CANADA{enter}' ,'CAD{enter}' ,email)
        batchPayments.addBankDetailCAD('BNDCCAMMXXX','26207729','004','01372')
        const lName = batchPayments.generateRandomString(6)
        batchPayments.individualRecipient('INDIVIDUAL CANADA ',lName,'CANADA{enter}')
        newRecipient.postCodeState()
        batchPayments.paymentPurposeGBPEUR()
        cy.get('.ant-select-selector').eq(3).click()
        cy.get('.ant-select-dropdown').eq(3).find('.ant-select-item-option-content').then(Element=>{
            let purposeList = Element.text()
            cy.log(purposeList)
            cy.wrap(purposeList).as('purposeList')
        })
        newRecipient.saveRecipient()
        newPayment.checkSettelment('be.enabled','be.enabled')
        newPayment.proceedflow('{downarrow}{enter}','GBP')
        let amount = '125'
        newPayment.addrecipientDetail(amount, email)
         //Validate the selected payment purpose
         cy.get('@selectedValue').then(selectedValue=>{
            cy.get('.ant-col-sm-20 > :nth-child(2) > :nth-child(1) > :nth-child(1) > .ant-row > .ant-col > .ant-form-item-control-input > .ant-form-item-control-input-content > .ant-select > .ant-select-selector')
            .should('be.visible').and('contain.text',selectedValue)
            })
         //Validate Purpose on single payment
        cy.get('.ant-select-selector').eq(2).click()
        cy.get('.ant-select-dropdown').eq(1).find('.ant-select-item-option-content').then(Element=>{
            let list = Element.text()
            cy.log(list)
            cy.get('@purposeList').then(purposeList=>{
            expect(list).to.eq(purposeList)
            cy.get('.ant-select-selector').eq(2).click()
        })
          })
            // Validating recipient recived amount
          cy.get(':nth-child(4) > :nth-child(2) > .ant-typography').invoke('text').then((text) => {
            const storedText = text
            cy.wrap(storedText).as('storedText')
            cy.log(storedText)
            })
            cy.get('.ant-col > .ant-btn > span').should('be.visible').click()
            cy.get('.ant-modal-body > :nth-child(1) > .ant-col > .ant-typography').should('be.visible').should('contain.text','Payment Confirmation')
            cy.get('@storedText').then(storedText=>{
                cy.get(':nth-child(5) > .ant-col-8 > .ant-typography')
                .should('be.visible').and('contain.text',storedText)
            })
            cy.get('.ant-row-center.m-t-20 > .ant-col > .ant-space > :nth-child(2) > .ant-btn').should('be.visible').click() // pay recipient
            cy.get('.ant-modal-body > :nth-child(1) > .ant-col').should('be.visible').should('contain.text',' Payment Booked - ')
            cy.get('@storedText').then(storedText=>{
                cy.get(':nth-child(5) > .ant-col-8 > .ant-typography')
                .should('be.visible').and('contain.text',storedText)
            })
            newPayment.validateYapilyFlow()
            //newPayment.cancelEasyTransfer()
    })
    it('TC_NP_62 - Add 1 recipient(individual) from the "Add Recipient" page with country = Singapore and currency = SGD. After adding, make a single payment to the recipient using GBP and easy transfer.', function(){
        signin.Login(userName, password)
        newRecipient.goToPaymentsDashborad()
        newRecipient.gotoRecipientList()
        let email = batchPayments.generateRandomString(5)+ '@yopmail.com'
        batchPayments.addRecipient('SINGAPORE{enter}' ,'SGD{enter}' ,email)
        newRecipient.addBankDetailsWithAccNo('ACLPSGSG','049712')
        const lName = batchPayments.generateRandomString(6)
        batchPayments.individualRecipient('INDIVIDUAL Singapore ',lName,'Singapore{enter}')
        batchPayments.paymentPurposeGBPEUR()
        cy.get('.ant-select-selector').eq(3).click()
        cy.get('.ant-select-dropdown').eq(3).find('.ant-select-item-option-content').then(Element=>{
            let purposeList = Element.text()
            cy.log(purposeList)
            cy.wrap(purposeList).as('purposeList')
        })
        newRecipient.saveRecipient()
        newPayment.checkSettelment('be.enabled','be.enabled')
        newPayment.proceedflow('{downarrow}{enter}','GBP')
        let amount = '125'
        newPayment.addrecipientDetail(amount, email)
         //Validate the selected payment purpose
         cy.get('@selectedValue').then(selectedValue=>{
            cy.get('.ant-col-sm-20 > :nth-child(2) > :nth-child(1) > :nth-child(1) > .ant-row > .ant-col > .ant-form-item-control-input > .ant-form-item-control-input-content > .ant-select > .ant-select-selector')
            .should('be.visible').and('contain.text',selectedValue)
            })
         //Validate Purpose on single payment
        cy.get('.ant-select-selector').eq(2).click()
        cy.get('.ant-select-dropdown').eq(1).find('.ant-select-item-option-content').then(Element=>{
            let list = Element.text()
            cy.log(list)
            cy.get('@purposeList').then(purposeList=>{
            expect(list).to.eq(purposeList)
            cy.get('.ant-select-selector').eq(2).click()
        })
          })
            // Validating recipient recived amount
          cy.get(':nth-child(4) > :nth-child(2) > .ant-typography').invoke('text').then((text) => {
            const storedText = text
            cy.wrap(storedText).as('storedText')
            cy.log(storedText)
            })
            cy.get('.ant-col > .ant-btn > span').should('be.visible').click()
            cy.get('.ant-modal-body > :nth-child(1) > .ant-col > .ant-typography').should('be.visible').should('contain.text','Payment Confirmation')
            cy.get('@storedText').then(storedText=>{
                cy.get(':nth-child(5) > .ant-col-8 > .ant-typography')
                .should('be.visible').and('contain.text',storedText)
            })
            cy.get('.ant-row-center.m-t-20 > .ant-col > .ant-space > :nth-child(2) > .ant-btn').should('be.visible').click() // pay recipient
            cy.get('.ant-modal-body > :nth-child(1) > .ant-col').should('be.visible').should('contain.text',' Payment Booked - ')
            cy.get('@storedText').then(storedText=>{
                cy.get(':nth-child(5) > .ant-col-8 > .ant-typography')
                .should('be.visible').and('contain.text',storedText)
            })
            newPayment.validateYapilyFlow()
            //newPayment.cancelEasyTransfer()
    })
    it('TC_NP_63 - Add 1 recipient(individual) from the "Add Recipient" page with country = HongKong and currency = HKD. After adding, make a single payment to the recipient using GBP and easy transfer.', function(){
        signin.Login(userName, password)
        newRecipient.goToPaymentsDashborad()
        newRecipient.gotoRecipientList()
        let email = batchPayments.generateRandomString(5)+ '@yopmail.com'
        batchPayments.addRecipient('HONG KONG{enter}' ,'HKD{enter}' ,email)
        batchPayments.addBankDetailHKD('HSBCHKHH','1234657890','004')
        const lName = batchPayments.generateRandomString(6)
        batchPayments.individualRecipient('INDIVIDUAL HongKong ',lName,'HONG KONG{enter}')
        batchPayments.paymentPurposeGBPEUR()
        cy.get('.ant-select-selector').eq(3).click()
        cy.get('.ant-select-dropdown').eq(3).find('.ant-select-item-option-content').then(Element=>{
            let purposeList = Element.text()
            cy.log(purposeList)
            cy.wrap(purposeList).as('purposeList')
        })
        newRecipient.saveRecipient()
        newPayment.checkSettelment('be.enabled','be.enabled')
        newPayment.proceedflow('{downarrow}{enter}','GBP')
        let amount = '125'
        newPayment.addrecipientDetail(amount, email)
         //Validate the selected payment purpose
         cy.get('@selectedValue').then(selectedValue=>{
            cy.get('.ant-col-sm-20 > :nth-child(2) > :nth-child(1) > :nth-child(1) > .ant-row > .ant-col > .ant-form-item-control-input > .ant-form-item-control-input-content > .ant-select > .ant-select-selector')
            .should('be.visible').and('contain.text',selectedValue)
            })
         //Validate Purpose on single payment
        cy.get('.ant-select-selector').eq(2).click()
        cy.get('.ant-select-dropdown').eq(1).find('.ant-select-item-option-content').then(Element=>{
            let list = Element.text()
            cy.log(list)
            cy.get('@purposeList').then(purposeList=>{
            expect(list).to.eq(purposeList)
            cy.get('.ant-select-selector').eq(2).click()
        })
          })
            // Validating recipient recived amount
          cy.get(':nth-child(4) > :nth-child(2) > .ant-typography').invoke('text').then((text) => {
            const storedText = text
            cy.wrap(storedText).as('storedText')
            cy.log(storedText)
            })
            cy.get('.ant-col > .ant-btn > span').should('be.visible').click()
            cy.get('.ant-modal-body > :nth-child(1) > .ant-col > .ant-typography').should('be.visible').should('contain.text','Payment Confirmation')
            cy.get('@storedText').then(storedText=>{
                cy.get(':nth-child(5) > .ant-col-8 > .ant-typography')
                .should('be.visible').and('contain.text',storedText)
            })
            cy.get('.ant-row-center.m-t-20 > .ant-col > .ant-space > :nth-child(2) > .ant-btn').should('be.visible').click() // pay recipient
            cy.get('.ant-modal-body > :nth-child(1) > .ant-col').should('be.visible').should('contain.text',' Payment Booked - ')
            cy.get('@storedText').then(storedText=>{
                cy.get(':nth-child(5) > .ant-col-8 > .ant-typography')
                .should('be.visible').and('contain.text',storedText)
            })
            newPayment.validateYapilyFlow()
            //newPayment.cancelEasyTransfer()
    })
    xit('TC_NP_64 - Add 1 recipient(individual) from the "Add Recipient" page with country = Mexico and currency = MXN. After adding, make a single payment to the recipient using GBP and easy transfer.', function(){
        signin.Login(userName, password)
        newRecipient.goToPaymentsDashborad()
        newRecipient.gotoRecipientList()
        let email = batchPayments.generateRandomString(5)+ '@yopmail.com'
        batchPayments.addRecipient('MEXICO{enter}' ,'MXN{enter}' ,email)
        newRecipient.addBankDetailsWithClabe('AFIRMXMT','002010077777777771')
        cy.get(':nth-child(5) > .ant-col-xs-24 > .ant-form-item > .ant-row > .ant-form-item-label > .ant-form-item-required > .ant-typography').should('contain.text','Bank Account Type')
        cy.get('#accountType').type('Saving{enter}')
        const lName = batchPayments.generateRandomString(6)
        batchPayments.individualRecipient('INDIVIDUAL Mexico ',lName,'Mexico{enter}')
        newRecipient.postCodeState()
        batchPayments.paymentPurposeGBPEUR()
        cy.get('.ant-select-selector').eq(3).click()
        cy.get('.ant-select-dropdown').eq(3).find('.ant-select-item-option-content').then(Element=>{
            let purposeList = Element.text()
            cy.log(purposeList)
            cy.wrap(purposeList).as('purposeList')
        })
        newRecipient.saveRecipient()
        newPayment.checkSettelment('be.disabled','be.enabled')
        newPayment.proceedflow('{downarrow}{enter}','GBP')
        let amount = '125'
        newPayment.addrecipientDetail(amount, email)
         //Validate the selected payment purpose
         cy.get('@selectedValue').then(selectedValue=>{
            cy.get('.ant-col-sm-20 > :nth-child(2) > :nth-child(1) > :nth-child(1) > .ant-row > .ant-col > .ant-form-item-control-input > .ant-form-item-control-input-content > .ant-select > .ant-select-selector')
            .should('be.visible').and('contain.text',selectedValue)
            })
         //Validate Purpose on single payment
        cy.get('.ant-select-selector').eq(3).click()
        cy.get('.ant-select-dropdown').eq(1).find('.ant-select-item-option-content').then(Element=>{
            let list = Element.text()
            cy.log(list)
            cy.get('@purposeList').then(purposeList=>{
            expect(list).to.eq(purposeList)
            cy.get('.ant-select-selector').eq(3).click()
        })
          })
            // Validating recipient recived amount
          cy.get(':nth-child(4) > :nth-child(2) > .ant-typography').invoke('text').then((text) => {
            const storedText = text
            cy.wrap(storedText).as('storedText')
            cy.log(storedText)
            })
            cy.get('.ant-col > .ant-btn > span').should('be.visible').click()
            cy.get('.ant-modal-body > :nth-child(1) > .ant-col > .ant-typography').should('be.visible').should('contain.text','Payment Confirmation')
            cy.get('@storedText').then(storedText=>{
                cy.get(':nth-child(5) > .ant-col-8 > .ant-typography')
                .should('be.visible').and('contain.text',storedText)
            })
            cy.get('.ant-row-center.m-t-20 > .ant-col > .ant-space > :nth-child(2) > .ant-btn').should('be.visible').click() // pay recipient
            cy.get('.ant-modal-body > :nth-child(1) > .ant-col').should('be.visible').should('contain.text',' Payment Booked - ')
            cy.get('@storedText').then(storedText=>{
                cy.get(':nth-child(5) > .ant-col-8 > .ant-typography')
                .should('be.visible').and('contain.text',storedText)
            })
            newPayment.validateYapilyFlow()
            //newPayment.cancelEasyTransfer()
    })
    // Business Push Fund
    it('TC_NP_65 - Add 1 recipient(Business)  from the "Add Recipient" page with country = Australia and currency = AUD. After adding, make a single payment to the recipient using GBP and push funds.', function(){
        signin.Login(userName, password)
        newRecipient.goToPaymentsDashborad()
        newRecipient.gotoRecipientList()
        let email = batchPayments.generateRandomString(5)+ '@yopmail.com'
        batchPayments.addRecipient('AUSTRALIA{enter}' ,'AUD{enter}' ,email)
        batchPayments.addBankDetailAUS('ABNAAU2BXXX','123456789','939200')
        cy.get('.ant-space > :nth-child(2) > .ant-card > .ant-card-body').should('be.visible').click()
        const bName = batchPayments.generateRandomString(6)
        batchPayments.addBusinessRecipient('BUSINESS AUD'+' '+bName,'AUSTRALIA{enter}')
        cy.get('#postcode').type('54000')
        batchPayments.paymentPurposeGBPEUR()
        cy.get('.ant-select-selector').eq(3).click()
        cy.get('.ant-select-dropdown').eq(3).find('.ant-select-item-option-content').then(Element=>{
            let purposeList = Element.text()
            cy.log(purposeList)
            cy.wrap(purposeList).as('purposeList')
        })
        newRecipient.saveRecipient()
        newPayment.checkSettelment('be.enabled','be.enabled')
        newPayment.proceedflow('{downarrow}{enter}','GBP')
        let amount = '125'
        newPayment.addrecipientDetail(amount, email)
        newPayment.selectFundingMethod('Push Funds')

          // ───── Intercept Quote API ─────
  cy.intercept(
            'POST',
            `https://main-api.volopa-dev.com/${Cypress.env("apiEnv")}/exchange/b2b/self/quote/temp`
        ).as('quoteApi');

  // ───── Wait for API and Compare Values ─────
  cy.wait('@quoteApi').then(({ response }) => {
    const receive = response.body.data.receive;
    const recipientReceives = response.body.data.recipient[0].receives;

    cy.wrap(recipientReceives).as('recipientReceives');
    cy.log(`Receive: ${receive}`);
    cy.log(`Recipient Receives: ${recipientReceives}`);

    expect(receive).to.eq(recipientReceives); // Final comparison
  });
         //Validate the selected payment purpose
         cy.get('@selectedValue').then(selectedValue=>{
            cy.get('.ant-col-sm-20 > :nth-child(2) > :nth-child(1) > .ant-form-item > .ant-row > .ant-col > .ant-form-item-control-input > .ant-form-item-control-input-content > .ant-select > .ant-select-selector')
            .should('be.visible').and('contain.text',selectedValue)
            })
         //Validate Purpose on single payment
        cy.get('.ant-select-selector').eq(2).click()
        cy.get('.ant-select-dropdown').eq(2).find('.ant-select-item-option-content').then(Element=>{
            let list = Element.text()
            cy.log(list)
            cy.get('@purposeList').then(purposeList=>{
            expect(list).to.eq(purposeList)
            cy.get('.ant-select-selector').eq(2).click()
        })
          })
            // Validating recipient recived amount
          cy.get(':nth-child(4) > :nth-child(2) > .ant-typography').invoke('text').then((text) => {
            const storedText = text
            cy.wrap(storedText).as('storedText')
            cy.log(storedText)
            })
            cy.get('.ant-col > .ant-btn > span').should('be.visible').click()
            cy.get('.ant-modal-body > :nth-child(1) > .ant-col > .ant-typography').should('be.visible').should('contain.text','Payment Confirmation')
            cy.get('@storedText').then(storedText=>{
                cy.get(':nth-child(5) > .ant-col-8 > .ant-typography')
                .should('be.visible').and('contain.text',storedText)
            })
            cy.get('.ant-row-center.m-t-20 > .ant-col > .ant-space > :nth-child(2) > .ant-btn').should('be.visible').click() // pay recipient
            cy.get('.ant-modal-body > :nth-child(1) > .ant-col').should('be.visible').should('contain.text',' Payment Booked - ')
            cy.get('@storedText').then(storedText=>{
                cy.get(':nth-child(5) > .ant-col-8 > .ant-typography')
                .should('be.visible').and('contain.text',storedText)
            })
            //////newPayment.cancelPushFunds()
    })
    it('TC_NP_66 - Add 1 recipient(Business) from the "Add Recipient" page with country = Canada and currency = CAD. After adding, make a single payment to the recipient using GBP and push funds.', function(){
        signin.Login(userName, password)
        newRecipient.goToPaymentsDashborad()
        newRecipient.gotoRecipientList()
        let email = batchPayments.generateRandomString(5)+ '@yopmail.com'
        batchPayments.addRecipient('CANADA{enter}' ,'CAD{enter}' ,email)
        batchPayments.addBankDetailCAD('BCANCAW2','26207729','004','01372')
        cy.get('.ant-space > :nth-child(2) > .ant-card > .ant-card-body').should('be.visible').click()
        const bName = batchPayments.generateRandomString(6)
        batchPayments.addBusinessRecipient('BUSINESS CAD'+' '+bName,'CANADA{enter}')
        newRecipient.postCodeStateCanada()
        batchPayments.paymentPurposeGBPEUR()
        cy.get('.ant-select-selector').eq(4).click()
        cy.get('.ant-select-dropdown').eq(4).find('.ant-select-item-option-content').then(Element=>{
            let purposeList = Element.text()
            cy.log(purposeList)
            cy.wrap(purposeList).as('purposeList')
        })
        newRecipient.saveRecipient()
        newPayment.checkSettelment('be.enabled','be.enabled')
        newPayment.proceedflow('{downarrow}{enter}','GBP')
        let amount = '125'
        newPayment.addrecipientDetail(amount, email)
        newPayment.selectFundingMethod('Push Funds')

          // ───── Intercept Quote API ─────
  cy.intercept(
            'POST',
            `https://main-api.volopa-dev.com/${Cypress.env("apiEnv")}/exchange/b2b/self/quote/temp`
        ).as('quoteApi');

  // ───── Wait for API and Compare Values ─────
  cy.wait('@quoteApi').then(({ response }) => {
    const receive = response.body.data.receive;
    const recipientReceives = response.body.data.recipient[0].receives;

    cy.wrap(recipientReceives).as('recipientReceives');
    cy.log(`Receive: ${receive}`);
    cy.log(`Recipient Receives: ${recipientReceives}`);

    expect(receive).to.eq(recipientReceives); // Final comparison
  });
         //Validate the selected payment purpose
         cy.get('@selectedValue').then(selectedValue=>{
            cy.get('.ant-col-sm-20 > :nth-child(2) > :nth-child(1) > .ant-form-item > .ant-row > .ant-col > .ant-form-item-control-input > .ant-form-item-control-input-content > .ant-select > .ant-select-selector')
            .should('be.visible').and('contain.text',selectedValue)
            })
         //Validate Purpose on single payment
        cy.get('.ant-select-selector').eq(2).click()
        cy.get('.ant-select-dropdown').eq(2).find('.ant-select-item-option-content').then(Element=>{
            let list = Element.text()
            cy.log(list)
            cy.get('@purposeList').then(purposeList=>{
            expect(list).to.eq(purposeList)
            cy.get('.ant-select-selector').eq(2).click()
        })
          })
            // Validating recipient recived amount
          cy.get(':nth-child(4) > :nth-child(2) > .ant-typography').invoke('text').then((text) => {
            const storedText = text
            cy.wrap(storedText).as('storedText')
            cy.log(storedText)
            })
            cy.get('.ant-col > .ant-btn > span').should('be.visible').click()
            cy.get('.ant-modal-body > :nth-child(1) > .ant-col > .ant-typography').should('be.visible').should('contain.text','Payment Confirmation')
            cy.get('@storedText').then(storedText=>{
                cy.get(':nth-child(5) > .ant-col-8 > .ant-typography')
                .should('be.visible').and('contain.text',storedText)
            })
            cy.get('.ant-row-center.m-t-20 > .ant-col > .ant-space > :nth-child(2) > .ant-btn').should('be.visible').click() // pay recipient
            cy.get('.ant-modal-body > :nth-child(1) > .ant-col').should('be.visible').should('contain.text',' Payment Booked - ')
            cy.get('@storedText').then(storedText=>{
                cy.get(':nth-child(5) > .ant-col-8 > .ant-typography')
                .should('be.visible').and('contain.text',storedText)
            })
            //////newPayment.cancelPushFunds()
    })
    it('TC_NP_67 - Add 1 recipient(Business) from the "Add Recipient" page with country = Singapore and currency = SGD. After adding, make a single payment to the recipient using GBP and push funds.', function(){
        signin.Login(userName, password)
        newRecipient.goToPaymentsDashborad()
        newRecipient.gotoRecipientList()
        let email = batchPayments.generateRandomString(5)+ '@yopmail.com'
        batchPayments.addRecipient('SINGAPORE{enter}' ,'SGD{enter}' ,email)
        newRecipient.addBankDetailsWithAccNo('ACLPSGSG','049712')
        cy.get('.ant-space > :nth-child(2) > .ant-card > .ant-card-body').should('be.visible').click()
        const bName = batchPayments.generateRandomString(6)
        batchPayments.addBusinessRecipient('BUSINESS SGD'+' '+bName,'SINGAPORE{enter}')
        
        batchPayments.paymentPurposeGBPEUR()
        cy.get('.ant-select-selector').eq(3).click()
        cy.get('.ant-select-dropdown').eq(3).find('.ant-select-item-option-content').then(Element=>{
            let purposeList = Element.text()
            cy.log(purposeList)
            cy.wrap(purposeList).as('purposeList')
        })
        newRecipient.saveRecipient()
        newPayment.checkSettelment('be.enabled','be.enabled')
        newPayment.proceedflow('{downarrow}{enter}','GBP')
        let amount = '125'
        newPayment.addrecipientDetail(amount, email)
        newPayment.selectFundingMethod('Push Funds')

          // ───── Intercept Quote API ─────
  cy.intercept(
            'POST',
            `https://main-api.volopa-dev.com/${Cypress.env("apiEnv")}/exchange/b2b/self/quote/temp`
        ).as('quoteApi');

  // ───── Wait for API and Compare Values ─────
  cy.wait('@quoteApi').then(({ response }) => {
    const receive = response.body.data.receive;
    const recipientReceives = response.body.data.recipient[0].receives;

    cy.wrap(recipientReceives).as('recipientReceives');
    cy.log(`Receive: ${receive}`);
    cy.log(`Recipient Receives: ${recipientReceives}`);

    expect(receive).to.eq(recipientReceives); // Final comparison
  });
         //Validate the selected payment purpose
         cy.get('@selectedValue').then(selectedValue=>{
            cy.get('.ant-col-sm-20 > :nth-child(2) > :nth-child(1) > .ant-form-item > .ant-row > .ant-col > .ant-form-item-control-input > .ant-form-item-control-input-content > .ant-select > .ant-select-selector')
            .should('be.visible').and('contain.text',selectedValue)
            })
         //Validate Purpose on single payment
        cy.get('.ant-select-selector').eq(2).click()
        cy.get('.ant-select-dropdown').eq(2).find('.ant-select-item-option-content').then(Element=>{
            let list = Element.text()
            cy.log(list)
            cy.get('@purposeList').then(purposeList=>{
            expect(list).to.eq(purposeList)
            cy.get('.ant-select-selector').eq(2).click()
        })
          })
            // Validating recipient recived amount
          cy.get(':nth-child(4) > :nth-child(2) > .ant-typography').invoke('text').then((text) => {
            const storedText = text
            cy.wrap(storedText).as('storedText')
            cy.log(storedText)
            })
            cy.get('.ant-col > .ant-btn > span').should('be.visible').click()
            cy.get('.ant-modal-body > :nth-child(1) > .ant-col > .ant-typography').should('be.visible').should('contain.text','Payment Confirmation')
            cy.get('@storedText').then(storedText=>{
                cy.get(':nth-child(5) > .ant-col-8 > .ant-typography')
                .should('be.visible').and('contain.text',storedText)
            })
            cy.get('.ant-row-center.m-t-20 > .ant-col > .ant-space > :nth-child(2) > .ant-btn').should('be.visible').click() // pay recipient
            cy.get('.ant-modal-body > :nth-child(1) > .ant-col').should('be.visible').should('contain.text',' Payment Booked - ')
            cy.get('@storedText').then(storedText=>{
                cy.get(':nth-child(5) > .ant-col-8 > .ant-typography')
                .should('be.visible').and('contain.text',storedText)
            })
            //////newPayment.cancelPushFunds()
    })
    it('TC_NP_68 - Add 1 recipient(Business) from the "Add Recipient" page with country = HongKong and currency = HKD. After adding, make a single payment to the recipient using GBP and push funds.', function(){
        signin.Login(userName, password)
        newRecipient.goToPaymentsDashborad()
        newRecipient.gotoRecipientList()
        let email = batchPayments.generateRandomString(5)+ '@yopmail.com'
        batchPayments.addRecipient('HONG KONG{enter}' ,'HKD{enter}' ,email)
        batchPayments.addBankDetailHKD('HSBCHKHH','5426789521','004')
        cy.get('.ant-space > :nth-child(2) > .ant-card > .ant-card-body').should('be.visible').click()
        const bName = batchPayments.generateRandomString(6)
        batchPayments.addBusinessRecipient('BUSINESS HKD'+' '+bName,'HONG KONG{enter}')
        
        batchPayments.paymentPurposeGBPEUR()
        cy.get('.ant-select-selector').eq(3).click()
        cy.get('.ant-select-dropdown').eq(3).find('.ant-select-item-option-content').then(Element=>{
            let purposeList = Element.text()
            cy.log(purposeList)
            cy.wrap(purposeList).as('purposeList')
        })
        newRecipient.saveRecipient()
        newPayment.checkSettelment('be.enabled','be.enabled')
        newPayment.proceedflow('{downarrow}{enter}','GBP')
        let amount = '125'
        newPayment.addrecipientDetail(amount, email)
        newPayment.selectFundingMethod('Push Funds')

          // ───── Intercept Quote API ─────
  cy.intercept(
            'POST',
            `https://main-api.volopa-dev.com/${Cypress.env("apiEnv")}/exchange/b2b/self/quote/temp`
        ).as('quoteApi');

  // ───── Wait for API and Compare Values ─────
  cy.wait('@quoteApi').then(({ response }) => {
    const receive = response.body.data.receive;
    const recipientReceives = response.body.data.recipient[0].receives;

    cy.wrap(recipientReceives).as('recipientReceives');
    cy.log(`Receive: ${receive}`);
    cy.log(`Recipient Receives: ${recipientReceives}`);

    expect(receive).to.eq(recipientReceives); // Final comparison
  });
         //Validate the selected payment purpose
         cy.get('@selectedValue').then(selectedValue=>{
            cy.get('.ant-col-sm-20 > :nth-child(2) > :nth-child(1) > .ant-form-item > .ant-row > .ant-col > .ant-form-item-control-input > .ant-form-item-control-input-content > .ant-select > .ant-select-selector')
            .should('be.visible').and('contain.text',selectedValue)
            })
         //Validate Purpose on single payment
        cy.get('.ant-select-selector').eq(2).click()
        cy.get('.ant-select-dropdown').eq(2).find('.ant-select-item-option-content').then(Element=>{
            let list = Element.text()
            cy.log(list)
            cy.get('@purposeList').then(purposeList=>{
            expect(list).to.eq(purposeList)
            cy.get('.ant-select-selector').eq(2).click()
        })
          })
            // Validating recipient recived amount
          cy.get(':nth-child(4) > :nth-child(2) > .ant-typography').invoke('text').then((text) => {
            const storedText = text
            cy.wrap(storedText).as('storedText')
            cy.log(storedText)
            })
            cy.get('.ant-col > .ant-btn > span').should('be.visible').click()
            cy.get('.ant-modal-body > :nth-child(1) > .ant-col > .ant-typography').should('be.visible').should('contain.text','Payment Confirmation')
            cy.get('@storedText').then(storedText=>{
                cy.get(':nth-child(5) > .ant-col-8 > .ant-typography')
                .should('be.visible').and('contain.text',storedText)
            })
            cy.get('.ant-row-center.m-t-20 > .ant-col > .ant-space > :nth-child(2) > .ant-btn').should('be.visible').click() // pay recipient
            cy.get('.ant-modal-body > :nth-child(1) > .ant-col').should('be.visible').should('contain.text',' Payment Booked - ')
            cy.get('@storedText').then(storedText=>{
                cy.get(':nth-child(5) > .ant-col-8 > .ant-typography')
                .should('be.visible').and('contain.text',storedText)
            })
            //////newPayment.cancelPushFunds()
    })
    xit('TC_NP_69 - Add 1 recipient(Business) from the "Add Recipient" page with country = Mexico and currency = MXN. After adding, make a single payment to the recipient using GBP and push funds.', function(){
        signin.Login(userName, password)
        newRecipient.goToPaymentsDashborad()
        newRecipient.gotoRecipientList()
        let email = batchPayments.generateRandomString(5)+ '@yopmail.com'
        batchPayments.addRecipient('MEXICO{enter}' ,'MXN{enter}' ,email)
        newRecipient.addBankDetailsWithClabe('AFIRMXMT','002010077777777771')
        //cy.get(':nth-child(5) > .ant-col-xs-24 > .ant-form-item > .ant-row > .ant-form-item-label > .ant-form-item-required > .ant-typography').should('contain.text','Bank Account Type')
        // cy.get('#accountType').type('Saving{enter}')   only for corpay
        cy.get('.ant-space > :nth-child(2) > .ant-card > .ant-card-body').should('be.visible').click()
        const bName = batchPayments.generateRandomString(6)
        batchPayments.addBusinessRecipient('BUSINESS MXN'+' '+bName,'MEXICO{enter}')
        newRecipient.postCodeState()
        batchPayments.paymentPurposeGBPEUR()
        cy.get('.ant-select-selector').eq(4).click()
        cy.get('.ant-select-dropdown').eq(4).find('.ant-select-item-option-content').then(Element=>{
            let purposeList = Element.text()
            cy.log(purposeList)
            cy.wrap(purposeList).as('purposeList')
        })
        newRecipient.saveRecipient()
        newPayment.checkSettelment('be.disabled','be.enabled')
        newPayment.proceedflow('{downarrow}{enter}','GBP')
        let amount = '125'
        newPayment.addrecipientDetail(amount, email)
        newPayment.selectFundingMethod('Push Funds')

          // ───── Intercept Quote API ─────
  cy.intercept(
            'POST',
            `https://main-api.volopa-dev.com/${Cypress.env("apiEnv")}/exchange/b2b/self/quote/temp`
        ).as('quoteApi');

  // ───── Wait for API and Compare Values ─────
  cy.wait('@quoteApi').then(({ response }) => {
    const receive = response.body.data.receive;
    const recipientReceives = response.body.data.recipient[0].receives;

    cy.wrap(recipientReceives).as('recipientReceives');
    cy.log(`Receive: ${receive}`);
    cy.log(`Recipient Receives: ${recipientReceives}`);

    expect(receive).to.eq(recipientReceives); // Final comparison
  });
         //Validate the selected payment purpose
         cy.get('@selectedValue').then(selectedValue=>{
            cy.get('.ant-col-sm-20 > :nth-child(2) > :nth-child(1) > .ant-form-item > .ant-row > .ant-col > .ant-form-item-control-input > .ant-form-item-control-input-content > .ant-select > .ant-select-selector')
            .should('be.visible').and('contain.text',selectedValue)
            })
         //Validate Purpose on single payment
        cy.get('.ant-select-selector').eq(2).click()
        cy.get('.ant-select-dropdown').eq(2).find('.ant-select-item-option-content').then(Element=>{
            let list = Element.text()
            cy.log(list)
            cy.get('@purposeList').then(purposeList=>{
            expect(list).to.eq(purposeList)
            cy.get('.ant-select-selector').eq(2).click()
        })
          })
            // Validating recipient recived amount
          cy.get(':nth-child(4) > :nth-child(2) > .ant-typography').invoke('text').then((text) => {
            const storedText = text
            cy.wrap(storedText).as('storedText')
            cy.log(storedText)
            })
            cy.get('.ant-col > .ant-btn > span').should('be.visible').click()
            cy.get('.ant-modal-body > :nth-child(1) > .ant-col > .ant-typography').should('be.visible').should('contain.text','Payment Confirmation')
            cy.get('@storedText').then(storedText=>{
                cy.get(':nth-child(5) > .ant-col-8 > .ant-typography')
                .should('be.visible').and('contain.text',storedText)
            })
            cy.get('.ant-row-center.m-t-20 > .ant-col > .ant-space > :nth-child(2) > .ant-btn').should('be.visible').click() // pay recipient
            cy.get('.ant-modal-body > :nth-child(1) > .ant-col').should('be.visible').should('contain.text',' Payment Booked - ')
            cy.get('@storedText').then(storedText=>{
                cy.get(':nth-child(5) > .ant-col-8 > .ant-typography')
                .should('be.visible').and('contain.text',storedText)
            })
            //////newPayment.cancelPushFunds()
    })
    // Business Easy Transfer
    it('TC_NP_70 - Add 1 recipient(Business) from the "Add Recipient" page with country = Australia and currency = AUD. After adding, make a single payment to the recipient using GBP and easy transfer.', function(){
        signin.Login(userName, password)
        newRecipient.goToPaymentsDashborad()
        newRecipient.gotoRecipientList()
        let email = batchPayments.generateRandomString(5)+ '@yopmail.com'
        batchPayments.addRecipient('AUSTRALIA{enter}' ,'AUD{enter}' ,email)
        batchPayments.addBankDetailAUS('ABNAAU2BXXX','123456789','939200')
        cy.get('.ant-space > :nth-child(2) > .ant-card > .ant-card-body').should('be.visible').click()
        const bName = batchPayments.generateRandomString(6)
        batchPayments.addBusinessRecipient('BUSINESS AUD'+' '+bName,'AUSTRALIA{enter}')
        cy.get('#postcode').type('54000')
        batchPayments.paymentPurposeGBPEUR()
        cy.get('.ant-select-selector').eq(3).click()
        cy.get('.ant-select-dropdown').eq(3).find('.ant-select-item-option-content').then(Element=>{
            let purposeList = Element.text()
            cy.log(purposeList)
            cy.wrap(purposeList).as('purposeList')
        })
        newRecipient.saveRecipient()
        newPayment.checkSettelment('be.enabled','be.enabled')
        newPayment.proceedflow('{downarrow}{enter}','GBP')
        let amount = '125'
        newPayment.addrecipientDetail(amount, email)
         //Validate the selected payment purpose
         cy.get('@selectedValue').then(selectedValue=>{
            cy.get('.ant-col-sm-20 > :nth-child(2) > :nth-child(1) > :nth-child(1) > .ant-row > .ant-col > .ant-form-item-control-input > .ant-form-item-control-input-content > .ant-select > .ant-select-selector')
            .should('be.visible').and('contain.text',selectedValue)
            })
         //Validate Purpose on single payment
        cy.get('.ant-select-selector').eq(2).click()
        cy.get('.ant-select-dropdown').eq(1).find('.ant-select-item-option-content').then(Element=>{
            let list = Element.text()
            cy.log(list)
            cy.get('@purposeList').then(purposeList=>{
            expect(list).to.eq(purposeList)
            cy.get('.ant-select-selector').eq(2).click()
        })
          })
            // Validating recipient recived amount
          cy.get(':nth-child(4) > :nth-child(2) > .ant-typography').invoke('text').then((text) => {
            const storedText = text
            cy.wrap(storedText).as('storedText')
            cy.log(storedText)
            })
            cy.get('.ant-col > .ant-btn > span').should('be.visible').click()
            cy.get('.ant-modal-body > :nth-child(1) > .ant-col > .ant-typography').should('be.visible').should('contain.text','Payment Confirmation')
            cy.get('@storedText').then(storedText=>{
                cy.get(':nth-child(5) > .ant-col-8 > .ant-typography')
                .should('be.visible').and('contain.text',storedText)
            })
            cy.get('.ant-row-center.m-t-20 > .ant-col > .ant-space > :nth-child(2) > .ant-btn').should('be.visible').click() // pay recipient
            cy.get('.ant-modal-body > :nth-child(1) > .ant-col').should('be.visible').should('contain.text',' Payment Booked - ')
            cy.get('@storedText').then(storedText=>{
                cy.get(':nth-child(5) > .ant-col-8 > .ant-typography')
                .should('be.visible').and('contain.text',storedText)
            })
            newPayment.validateYapilyFlow()
            //newPayment.cancelEasyTransfer()
    })
    it('TC_NP_71 - Add 1 recipient(Business) from the "Add Recipient" page with country = Canada and currency = CAD. After adding, make a single payment to the recipient using GBP and easy transfer.', function(){
        signin.Login(userName, password)
        newRecipient.goToPaymentsDashborad()
        newRecipient.gotoRecipientList()
        let email = batchPayments.generateRandomString(5)+ '@yopmail.com'
        batchPayments.addRecipient('CANADA{enter}' ,'CAD{enter}' ,email)
        batchPayments.addBankDetailCAD('BNDCCAMMXXX','26207729','004','01372')
        cy.get('.ant-space > :nth-child(2) > .ant-card > .ant-card-body').should('be.visible').click()
        const bName = batchPayments.generateRandomString(6)
        batchPayments.addBusinessRecipient('BUSINESS CAD'+' '+bName,'CANADA{enter}')
        newRecipient.postCodeState()
        batchPayments.paymentPurposeGBPEUR()
        cy.get('.ant-select-selector').eq(3).click()
        cy.get('.ant-select-dropdown').eq(3).find('.ant-select-item-option-content').then(Element=>{
            let purposeList = Element.text()
            cy.log(purposeList)
            cy.wrap(purposeList).as('purposeList')
        })
        newRecipient.saveRecipient()
        newPayment.checkSettelment('be.enabled','be.enabled')
        newPayment.proceedflow('{downarrow}{enter}','GBP')
        let amount = '125'
        newPayment.addrecipientDetail(amount, email)
         //Validate the selected payment purpose
         cy.get('@selectedValue').then(selectedValue=>{
            cy.get('.ant-col-sm-20 > :nth-child(2) > :nth-child(1) > :nth-child(1) > .ant-row > .ant-col > .ant-form-item-control-input > .ant-form-item-control-input-content > .ant-select > .ant-select-selector')
            .should('be.visible').and('contain.text',selectedValue)
            })
         //Validate Purpose on single payment
        cy.get('.ant-select-selector').eq(2).click()
        cy.get('.ant-select-dropdown').eq(1).find('.ant-select-item-option-content').then(Element=>{
            let list = Element.text()
            cy.log(list)
            cy.get('@purposeList').then(purposeList=>{
            expect(list).to.eq(purposeList)
            cy.get('.ant-select-selector').eq(2).click()
        })
          })
            // Validating recipient recived amount
          cy.get(':nth-child(4) > :nth-child(2) > .ant-typography').invoke('text').then((text) => {
            const storedText = text
            cy.wrap(storedText).as('storedText')
            cy.log(storedText)
            })
            cy.get('.ant-col > .ant-btn > span').should('be.visible').click()
            cy.get('.ant-modal-body > :nth-child(1) > .ant-col > .ant-typography').should('be.visible').should('contain.text','Payment Confirmation')
            cy.get('@storedText').then(storedText=>{
                cy.get(':nth-child(5) > .ant-col-8 > .ant-typography')
                .should('be.visible').and('contain.text',storedText)
            })
            cy.get('.ant-row-center.m-t-20 > .ant-col > .ant-space > :nth-child(2) > .ant-btn').should('be.visible').click() // pay recipient
            cy.get('.ant-modal-body > :nth-child(1) > .ant-col').should('be.visible').should('contain.text',' Payment Booked - ')
            cy.get('@storedText').then(storedText=>{
                cy.get(':nth-child(5) > .ant-col-8 > .ant-typography')
                .should('be.visible').and('contain.text',storedText)
            })
            newPayment.validateYapilyFlow()
            //newPayment.cancelEasyTransfer()
    })
    it('TC_NP_72 - Add 1 recipient(Business) from the "Add Recipient" page with country = Singapore and currency = SGD. After adding, make a single payment to the recipient using GBP and easy transfer.', function(){
        signin.Login(userName, password)
        newRecipient.goToPaymentsDashborad()
        newRecipient.gotoRecipientList()
        let email = batchPayments.generateRandomString(5)+ '@yopmail.com'
        batchPayments.addRecipient('SINGAPORE{enter}' ,'SGD{enter}' ,email)
        newRecipient.addBankDetailsWithAccNo('ACLPSGSG','049712')
        cy.get('.ant-space > :nth-child(2) > .ant-card > .ant-card-body').should('be.visible').click()
        const bName = batchPayments.generateRandomString(6)
        batchPayments.addBusinessRecipient('BUSINESS SGD'+' '+bName,'SINGAPORE{enter}')
        batchPayments.paymentPurposeGBPEUR()
        cy.get('.ant-select-selector').eq(3).click()
        cy.get('.ant-select-dropdown').eq(3).find('.ant-select-item-option-content').then(Element=>{
            let purposeList = Element.text()
            cy.log(purposeList)
            cy.wrap(purposeList).as('purposeList')
        })
        newRecipient.saveRecipient()
        newPayment.checkSettelment('be.enabled','be.enabled')
        newPayment.proceedflow('{downarrow}{enter}','GBP')
        let amount = '125'
        newPayment.addrecipientDetail(amount, email)
         //Validate the selected payment purpose
         cy.get('@selectedValue').then(selectedValue=>{
            cy.get('.ant-col-sm-20 > :nth-child(2) > :nth-child(1) > :nth-child(1) > .ant-row > .ant-col > .ant-form-item-control-input > .ant-form-item-control-input-content > .ant-select > .ant-select-selector')
            .should('be.visible').and('contain.text',selectedValue)
            })
         //Validate Purpose on single payment
        cy.get('.ant-select-selector').eq(2).click()
        cy.get('.ant-select-dropdown').eq(1).find('.ant-select-item-option-content').then(Element=>{
            let list = Element.text()
            cy.log(list)
            cy.get('@purposeList').then(purposeList=>{
            expect(list).to.eq(purposeList)
            cy.get('.ant-select-selector').eq(2).click()
        })
          })
            // Validating recipient recived amount
          cy.get(':nth-child(4) > :nth-child(2) > .ant-typography').invoke('text').then((text) => {
            const storedText = text
            cy.wrap(storedText).as('storedText')
            cy.log(storedText)
            })
            cy.get('.ant-col > .ant-btn > span').should('be.visible').click()
            cy.get('.ant-modal-body > :nth-child(1) > .ant-col > .ant-typography').should('be.visible').should('contain.text','Payment Confirmation')
            cy.get('@storedText').then(storedText=>{
                cy.get(':nth-child(5) > .ant-col-8 > .ant-typography')
                .should('be.visible').and('contain.text',storedText)
            })
            cy.get('.ant-row-center.m-t-20 > .ant-col > .ant-space > :nth-child(2) > .ant-btn').should('be.visible').click() // pay recipient
            cy.get('.ant-modal-body > :nth-child(1) > .ant-col').should('be.visible').should('contain.text',' Payment Booked - ')
            cy.get('@storedText').then(storedText=>{
                cy.get(':nth-child(5) > .ant-col-8 > .ant-typography')
                .should('be.visible').and('contain.text',storedText)
            })
            newPayment.validateYapilyFlow()
            //newPayment.cancelEasyTransfer()
    })
    it('TC_NP_73 - Add 1 recipient(Business) from the "Add Recipient" page with country = HongKong and currency = HKD. After adding, make a single payment to the recipient using GBP and easy transfer.', function(){
        signin.Login(userName, password)
        newRecipient.goToPaymentsDashborad()
        newRecipient.gotoRecipientList()
        let email = batchPayments.generateRandomString(5)+ '@yopmail.com'
        batchPayments.addRecipient('HONG KONG{enter}' ,'HKD{enter}' ,email)
        batchPayments.addBankDetailHKD('HSBCHKHH','1234657890','004')
        cy.get('.ant-space > :nth-child(2) > .ant-card > .ant-card-body').should('be.visible').click()
        const bName = batchPayments.generateRandomString(6)
        batchPayments.addBusinessRecipient('BUSINESS HKD'+' '+bName,'HONG KONG{enter}')
        batchPayments.paymentPurposeGBPEUR()
        cy.get('.ant-select-selector').eq(3).click()
        cy.get('.ant-select-dropdown').eq(3).find('.ant-select-item-option-content').then(Element=>{
            let purposeList = Element.text()
            cy.log(purposeList)
            cy.wrap(purposeList).as('purposeList')
        })
        newRecipient.saveRecipient()
        newPayment.checkSettelment('be.enabled','be.enabled')
        newPayment.proceedflow('{downarrow}{enter}','GBP')
        let amount = '125'
        newPayment.addrecipientDetail(amount, email)
         //Validate the selected payment purpose
         cy.get('@selectedValue').then(selectedValue=>{
            cy.get('.ant-col-sm-20 > :nth-child(2) > :nth-child(1) > :nth-child(1) > .ant-row > .ant-col > .ant-form-item-control-input > .ant-form-item-control-input-content > .ant-select > .ant-select-selector')
            .should('be.visible').and('contain.text',selectedValue)
            })
         //Validate Purpose on single payment
        cy.get('.ant-select-selector').eq(2).click()
        cy.get('.ant-select-dropdown').eq(1).find('.ant-select-item-option-content').then(Element=>{
            let list = Element.text()
            cy.log(list)
            cy.get('@purposeList').then(purposeList=>{
            expect(list).to.eq(purposeList)
            cy.get('.ant-select-selector').eq(2).click()
        })
          })
            // Validating recipient recived amount
          cy.get(':nth-child(4) > :nth-child(2) > .ant-typography').invoke('text').then((text) => {
            const storedText = text
            cy.wrap(storedText).as('storedText')
            cy.log(storedText)
            })
            cy.get('.ant-col > .ant-btn > span').should('be.visible').click()
            cy.get('.ant-modal-body > :nth-child(1) > .ant-col > .ant-typography').should('be.visible').should('contain.text','Payment Confirmation')
            cy.get('@storedText').then(storedText=>{
                cy.get(':nth-child(5) > .ant-col-8 > .ant-typography')
                .should('be.visible').and('contain.text',storedText)
            })
            cy.get('.ant-row-center.m-t-20 > .ant-col > .ant-space > :nth-child(2) > .ant-btn').should('be.visible').click() // pay recipient
            cy.get('.ant-modal-body > :nth-child(1) > .ant-col').should('be.visible').should('contain.text',' Payment Booked - ')
            cy.get('@storedText').then(storedText=>{
                cy.get(':nth-child(5) > .ant-col-8 > .ant-typography')
                .should('be.visible').and('contain.text',storedText)
            })
            newPayment.validateYapilyFlow()
            //newPayment.cancelEasyTransfer()
    })
    xit('TC_NP_74 - Add 1 recipient(Business) from the "Add Recipient" page with country = Mexico and currency = MXN. After adding, make a single payment to the recipient using GBP and easy transfer.', function(){
        signin.Login(userName, password)
        newRecipient.goToPaymentsDashborad()
        newRecipient.gotoRecipientList()
        let email = batchPayments.generateRandomString(5)+ '@yopmail.com'
        batchPayments.addRecipient('MEXICO{enter}' ,'MXN{enter}' ,email)
        newRecipient.addBankDetailsWithClabe('AFIRMXMT','002010077777777771')
        cy.get(':nth-child(5) > .ant-col-xs-24 > .ant-form-item > .ant-row > .ant-form-item-label > .ant-form-item-required > .ant-typography').should('contain.text','Bank Account Type')
        cy.get('#accountType').type('Saving{enter}')
        cy.get('.ant-space > :nth-child(2) > .ant-card > .ant-card-body').should('be.visible').click()
        const bName = batchPayments.generateRandomString(6)
        batchPayments.addBusinessRecipient('BUSINESS MXN'+' '+bName,'MEXICO{enter}')
        newRecipient.postCodeState()
        batchPayments.paymentPurposeGBPEUR()
        cy.get('.ant-select-selector').eq(3).click()
        cy.get('.ant-select-dropdown').eq(3).find('.ant-select-item-option-content').then(Element=>{
            let purposeList = Element.text()
            cy.log(purposeList)
            cy.wrap(purposeList).as('purposeList')
        })
        newRecipient.saveRecipient()
        newPayment.checkSettelment('be.disabled','be.enabled')
        newPayment.proceedflow('{downarrow}{enter}','GBP')
        let amount = '125'
        newPayment.addrecipientDetail(amount, email)
         //Validate the selected payment purpose
         cy.get('@selectedValue').then(selectedValue=>{
            cy.get('.ant-col-sm-20 > :nth-child(2) > :nth-child(1) > :nth-child(1) > .ant-row > .ant-col > .ant-form-item-control-input > .ant-form-item-control-input-content > .ant-select > .ant-select-selector')
            .should('be.visible').and('contain.text',selectedValue)
            })
         //Validate Purpose on single payment
        cy.get('.ant-select-selector').eq(3).click()
        cy.get('.ant-select-dropdown').eq(1).find('.ant-select-item-option-content').then(Element=>{
            let list = Element.text()
            cy.log(list)
            cy.get('@purposeList').then(purposeList=>{
            expect(list).to.eq(purposeList)
            cy.get('.ant-select-selector').eq(3).click()
        })
          })
            // Validating recipient recived amount
          cy.get(':nth-child(4) > :nth-child(2) > .ant-typography').invoke('text').then((text) => {
            const storedText = text
            cy.wrap(storedText).as('storedText')
            cy.log(storedText)
            })
            cy.get('.ant-col > .ant-btn > span').should('be.visible').click()
            cy.get('.ant-modal-body > :nth-child(1) > .ant-col > .ant-typography').should('be.visible').should('contain.text','Payment Confirmation')
            cy.get('@storedText').then(storedText=>{
                cy.get(':nth-child(5) > .ant-col-8 > .ant-typography')
                .should('be.visible').and('contain.text',storedText)
            })
            cy.get('.ant-row-center.m-t-20 > .ant-col > .ant-space > :nth-child(2) > .ant-btn').should('be.visible').click() // pay recipient
            cy.get('.ant-modal-body > :nth-child(1) > .ant-col').should('be.visible').should('contain.text',' Payment Booked - ')
            cy.get('@storedText').then(storedText=>{
                cy.get(':nth-child(5) > .ant-col-8 > .ant-typography')
                .should('be.visible').and('contain.text',storedText)
            })
            newPayment.validateYapilyFlow()
            //newPayment.cancelEasyTransfer()
    })
    // Individual Push Fund 
    it('TC_NP_075 - Add 1 recipient(individual) from the "Add Recipient" page with country = Germany and currency = USD. After adding, make a single payment to the recipient using GBP and push funds.', function(){
        signin.Login(userName, password)
        newRecipient.goToPaymentsDashborad()
        newRecipient.gotoRecipientList()
        let email = batchPayments.generateRandomString(5)+ '@yopmail.com'
        batchPayments.addRecipient('GERMANY{enter}' ,'USD{enter}' ,email)
        newRecipient.addBankDetails('DE40500105171359375129','AARBDE5W100')
        const lName = batchPayments.generateRandomString(6)
        batchPayments.individualRecipient('INDIVIDUAL GBP PF',lName,'United Kingdom{enter}')
        batchPayments.paymentPurposeGBPEUR()
        cy.get('.ant-select-selector').eq(3).click()
        cy.get('.ant-select-dropdown').eq(3).find('.ant-select-item-option-content').then(Element=>{
            let purposeList = Element.text()
            cy.log(purposeList)
            cy.wrap(purposeList).as('purposeList')
        })
        newRecipient.saveRecipient()
        newPayment.checkSettelment('be.disabled','be.enabled')
        newPayment.proceedflow('{downarrow}{enter}','GBP')
        let amount = '125'
        newPayment.addrecipientDetail(amount, email)
        newPayment.selectFundingMethod('Push Funds')

          // ───── Intercept Quote API ─────
  cy.intercept(
            'POST',
            `https://main-api.volopa-dev.com/${Cypress.env("apiEnv")}/exchange/b2b/self/quote/temp`
        ).as('quoteApi');

  // ───── Wait for API and Compare Values ─────
  cy.wait('@quoteApi').then(({ response }) => {
    const receive = response.body.data.receive;
    const recipientReceives = response.body.data.recipient[0].receives;

    cy.wrap(recipientReceives).as('recipientReceives');
    cy.log(`Receive: ${receive}`);
    cy.log(`Recipient Receives: ${recipientReceives}`);

    expect(receive).to.eq(recipientReceives); // Final comparison
  });
             //Validate the selected payment purpose
             cy.get('@selectedValue').then(selectedValue=>{
                cy.get('.ant-col-sm-20 > :nth-child(2) > :nth-child(1) > .ant-form-item > .ant-row > .ant-col > .ant-form-item-control-input > .ant-form-item-control-input-content > .ant-select > .ant-select-selector')
                .should('be.visible').and('contain.text',selectedValue)
            })
         //Validate Purpose on batch payment
        cy.get('.ant-select-selector').eq(2).click()
        cy.get('.ant-select-dropdown').eq(2).find('.ant-select-item-option-content').then(Element=>{
            let list = Element.text()
            cy.log(list)
            cy.get('@purposeList').then(purposeList=>{
            expect(list).to.eq(purposeList)
            cy.get('.ant-select-selector').eq(2).click() 
        })
          })
          // Validating recipient recived amount
          cy.get(':nth-child(4) > :nth-child(2) > .ant-typography').invoke('text').then((text) => {
            const storedText = text
            cy.wrap(storedText).as('storedText')
            cy.log(storedText)
            })
            cy.get('.ant-col > .ant-btn > span').should('be.visible').click()
            cy.get('.ant-modal-body > :nth-child(1) > .ant-col > .ant-typography').should('be.visible').should('contain.text','Payment Confirmation')
            cy.get('@storedText').then(storedText=>{
                cy.get(':nth-child(5) > .ant-col-8 > .ant-typography')
                .should('be.visible').and('contain.text',storedText)
            })
            cy.get('.ant-row-center.m-t-20 > .ant-col > .ant-space > :nth-child(2) > .ant-btn').should('be.visible').click() // pay recipient
            cy.get('.ant-modal-body > :nth-child(1) > .ant-col').should('be.visible').should('contain.text',' Payment Booked - ')
            cy.get('@storedText').then(storedText=>{
                cy.get(':nth-child(5) > .ant-col-8 > .ant-typography')
                .should('be.visible').and('contain.text',storedText)
            })
            //////newPayment.cancelPushFunds()
    })
    it('TC_NP_076 - Add 1 recipient(individual) from the "Add Recipient" page with country = France and currency = USD. After adding, make a single payment to the recipient using GBP and push funds.', function(){
        signin.Login(userName, password)
        newRecipient.goToPaymentsDashborad()
        newRecipient.gotoRecipientList()
        let email = batchPayments.generateRandomString(5)+ '@yopmail.com'
        batchPayments.addRecipient('FRANCE{enter}' ,'USD{enter}' ,email)
        newRecipient.addBankDetails('FR1420041010050500013M02606','GASKFRPPXXX')
        const lName = batchPayments.generateRandomString(6)
        batchPayments.individualRecipient('INDIVIDUAL GBP PF',lName,'United Kingdom{enter}')
        batchPayments.paymentPurposeGBPEUR()
        cy.get('.ant-select-selector').eq(3).click()
        cy.get('.ant-select-dropdown').eq(3).find('.ant-select-item-option-content').then(Element=>{
            let purposeList = Element.text()
            cy.log(purposeList)
            cy.wrap(purposeList).as('purposeList')
        })
        newRecipient.saveRecipient()
        newPayment.checkSettelment('be.disabled','be.enabled')
        newPayment.proceedflow('{downarrow}{enter}','GBP')
        let amount = '125'
        newPayment.addrecipientDetail(amount, email)
        newPayment.selectFundingMethod('Push Funds')

          // ───── Intercept Quote API ─────
  cy.intercept(
            'POST',
            `https://main-api.volopa-dev.com/${Cypress.env("apiEnv")}/exchange/b2b/self/quote/temp`
        ).as('quoteApi');

  // ───── Wait for API and Compare Values ─────
  cy.wait('@quoteApi').then(({ response }) => {
    const receive = response.body.data.receive;
    const recipientReceives = response.body.data.recipient[0].receives;

    cy.wrap(recipientReceives).as('recipientReceives');
    cy.log(`Receive: ${receive}`);
    cy.log(`Recipient Receives: ${recipientReceives}`);

    expect(receive).to.eq(recipientReceives); // Final comparison
  });
             //Validate the selected payment purpose
             cy.get('@selectedValue').then(selectedValue=>{
                cy.get('.ant-col-sm-20 > :nth-child(2) > :nth-child(1) > .ant-form-item > .ant-row > .ant-col > .ant-form-item-control-input > .ant-form-item-control-input-content > .ant-select > .ant-select-selector')
                .should('be.visible').and('contain.text',selectedValue)
            })
         //Validate Purpose on batch payment
        cy.get('.ant-select-selector').eq(2).click()
        cy.get('.ant-select-dropdown').eq(2).find('.ant-select-item-option-content').then(Element=>{
            let list = Element.text()
            cy.log(list)
            cy.get('@purposeList').then(purposeList=>{
            expect(list).to.eq(purposeList)
            cy.get('.ant-select-selector').eq(2).click() 
        })
          })
       // Validating recipient recived amount
       cy.get(':nth-child(4) > :nth-child(2) > .ant-typography').invoke('text').then((text) => {
        const storedText = text
        cy.wrap(storedText).as('storedText')
        cy.log(storedText)
        })
        cy.get('.ant-col > .ant-btn > span').should('be.visible').click()
        cy.get('.ant-modal-body > :nth-child(1) > .ant-col > .ant-typography').should('be.visible').should('contain.text','Payment Confirmation')
        cy.get('@storedText').then(storedText=>{
            cy.get(':nth-child(5) > .ant-col-8 > .ant-typography')
            .should('be.visible').and('contain.text',storedText)
        })
        cy.get('.ant-row-center.m-t-20 > .ant-col > .ant-space > :nth-child(2) > .ant-btn').should('be.visible').click() // pay recipient
        cy.get('.ant-modal-body > :nth-child(1) > .ant-col').should('be.visible').should('contain.text',' Payment Booked - ')
        cy.get('@storedText').then(storedText=>{
            cy.get(':nth-child(5) > .ant-col-8 > .ant-typography')
            .should('be.visible').and('contain.text',storedText)
        })
        //////newPayment.cancelPushFunds()
    })
    it('TC_NP_077 - Add 1 recipient(individual) from the "Add Recipient" page with country = Spain and currency = USD. After adding, make a single payment to the recipient using GBP and push funds.', function(){
        signin.Login(userName, password)
        newRecipient.goToPaymentsDashborad()
        newRecipient.gotoRecipientList()
        let email = batchPayments.generateRandomString(5)+ '@yopmail.com'
        batchPayments.addRecipient('SPAIN{enter}' ,'USD{enter}' ,email)
        newRecipient.addBankDetails('ES9121000418450200051332','CAGLESMMCOP')
        const lName = batchPayments.generateRandomString(6)
        batchPayments.individualRecipient('INDIVIDUAL GBP PF',lName,'United Kingdom{enter}')
        batchPayments.paymentPurposeGBPEUR()
        cy.get('.ant-select-selector').eq(3).click()
        cy.get('.ant-select-dropdown').eq(3).find('.ant-select-item-option-content').then(Element=>{
            let purposeList = Element.text()
            cy.log(purposeList)
            cy.wrap(purposeList).as('purposeList')
        })
        newRecipient.saveRecipient()
        newPayment.checkSettelment('be.disabled','be.enabled')
        newPayment.proceedflow('{downarrow}{enter}','GBP')
        let amount = '125'
        newPayment.addrecipientDetail(amount, email)
        newPayment.selectFundingMethod('Push Funds')

          // ───── Intercept Quote API ─────
  cy.intercept(
            'POST',
            `https://main-api.volopa-dev.com/${Cypress.env("apiEnv")}/exchange/b2b/self/quote/temp`
        ).as('quoteApi');

  // ───── Wait for API and Compare Values ─────
  cy.wait('@quoteApi').then(({ response }) => {
    const receive = response.body.data.receive;
    const recipientReceives = response.body.data.recipient[0].receives;

    cy.wrap(recipientReceives).as('recipientReceives');
    cy.log(`Receive: ${receive}`);
    cy.log(`Recipient Receives: ${recipientReceives}`);

    expect(receive).to.eq(recipientReceives); // Final comparison
  });
             //Validate the selected payment purpose
             cy.get('@selectedValue').then(selectedValue=>{
                cy.get('.ant-col-sm-20 > :nth-child(2) > :nth-child(1) > .ant-form-item > .ant-row > .ant-col > .ant-form-item-control-input > .ant-form-item-control-input-content > .ant-select > .ant-select-selector')
                .should('be.visible').and('contain.text',selectedValue)
            })
         //Validate Purpose on batch payment
        cy.get('.ant-select-selector').eq(2).click()
        cy.get('.ant-select-dropdown').eq(2).find('.ant-select-item-option-content').then(Element=>{
            let list = Element.text()
            cy.log(list)
            cy.get('@purposeList').then(purposeList=>{
            expect(list).to.eq(purposeList)
            cy.get('.ant-select-selector').eq(2).click() 
        })
          })
       // Validating recipient recived amount
       cy.get(':nth-child(4) > :nth-child(2) > .ant-typography').invoke('text').then((text) => {
        const storedText = text
        cy.wrap(storedText).as('storedText')
        cy.log(storedText)
        })
        cy.get('.ant-col > .ant-btn > span').should('be.visible').click()
        cy.get('.ant-modal-body > :nth-child(1) > .ant-col > .ant-typography').should('be.visible').should('contain.text','Payment Confirmation')
        cy.get('@storedText').then(storedText=>{
            cy.get(':nth-child(5) > .ant-col-8 > .ant-typography')
            .should('be.visible').and('contain.text',storedText)
        })
        cy.get('.ant-row-center.m-t-20 > .ant-col > .ant-space > :nth-child(2) > .ant-btn').should('be.visible').click() // pay recipient
        cy.get('.ant-modal-body > :nth-child(1) > .ant-col').should('be.visible').should('contain.text',' Payment Booked - ')
        cy.get('@storedText').then(storedText=>{
            cy.get(':nth-child(5) > .ant-col-8 > .ant-typography')
            .should('be.visible').and('contain.text',storedText)
        })
        //////newPayment.cancelPushFunds()
    })
    it('TC_NP_078 - Add 1 recipient(individual) from the "Add Recipient" page with country = Italy and currency = USD. After adding, make a single payment to the recipient using GBP and push funds.', function(){
        signin.Login(userName, password)
        newRecipient.goToPaymentsDashborad()
        newRecipient.gotoRecipientList()
        let email = batchPayments.generateRandomString(5)+ '@yopmail.com'
        batchPayments.addRecipient('ITALY{enter}' ,'USD{enter}' ,email)
        newRecipient.addBankDetails('IT60X0542811101000000123456','FCRRITM1XXX')
        const lName = batchPayments.generateRandomString(6)
        batchPayments.individualRecipient('INDIVIDUAL GBP PF',lName,'United Kingdom{enter}')
        batchPayments.paymentPurposeGBPEUR()
        cy.get('.ant-select-selector').eq(3).click()
        cy.get('.ant-select-dropdown').eq(3).find('.ant-select-item-option-content').then(Element=>{
            let purposeList = Element.text()
            cy.log(purposeList)
            cy.wrap(purposeList).as('purposeList')
        })
        newRecipient.saveRecipient()
        newPayment.checkSettelment('be.disabled','be.enabled')
        newPayment.proceedflow('{downarrow}{enter}','GBP')
        let amount = '125'
        newPayment.addrecipientDetail(amount, email)
        newPayment.selectFundingMethod('Push Funds')

          // ───── Intercept Quote API ─────
  cy.intercept(
            'POST',
            `https://main-api.volopa-dev.com/${Cypress.env("apiEnv")}/exchange/b2b/self/quote/temp`
        ).as('quoteApi');

  // ───── Wait for API and Compare Values ─────
  cy.wait('@quoteApi').then(({ response }) => {
    const receive = response.body.data.receive;
    const recipientReceives = response.body.data.recipient[0].receives;

    cy.wrap(recipientReceives).as('recipientReceives');
    cy.log(`Receive: ${receive}`);
    cy.log(`Recipient Receives: ${recipientReceives}`);

    expect(receive).to.eq(recipientReceives); // Final comparison
  });
             //Validate the selected payment purpose
             cy.get('@selectedValue').then(selectedValue=>{
                cy.get('.ant-col-sm-20 > :nth-child(2) > :nth-child(1) > .ant-form-item > .ant-row > .ant-col > .ant-form-item-control-input > .ant-form-item-control-input-content > .ant-select > .ant-select-selector')
                .should('be.visible').and('contain.text',selectedValue)
            })
         //Validate Purpose on batch payment
        cy.get('.ant-select-selector').eq(2).click()
        cy.get('.ant-select-dropdown').eq(2).find('.ant-select-item-option-content').then(Element=>{
            let list = Element.text()
            cy.log(list)
            cy.get('@purposeList').then(purposeList=>{
            expect(list).to.eq(purposeList)
            cy.get('.ant-select-selector').eq(2).click() 
        })
          })
       // Validating recipient recived amount
       cy.get(':nth-child(4) > :nth-child(2) > .ant-typography').invoke('text').then((text) => {
        const storedText = text
        cy.wrap(storedText).as('storedText')
        cy.log(storedText)
        })
        cy.get('.ant-col > .ant-btn > span').should('be.visible').click()
        cy.get('.ant-modal-body > :nth-child(1) > .ant-col > .ant-typography').should('be.visible').should('contain.text','Payment Confirmation')
        cy.get('@storedText').then(storedText=>{
            cy.get(':nth-child(5) > .ant-col-8 > .ant-typography')
            .should('be.visible').and('contain.text',storedText)
        })
        cy.get('.ant-row-center.m-t-20 > .ant-col > .ant-space > :nth-child(2) > .ant-btn').should('be.visible').click() // pay recipient
        cy.get('.ant-modal-body > :nth-child(1) > .ant-col').should('be.visible').should('contain.text',' Payment Booked - ')
        cy.get('@storedText').then(storedText=>{
            cy.get(':nth-child(5) > .ant-col-8 > .ant-typography')
            .should('be.visible').and('contain.text',storedText)
        })
        //////newPayment.cancelPushFunds()
    })
    it('TC_NP_079 - Add 1 recipient(individual) from the "Add Recipient" page with country = Malta and currency = USD. After adding, make a single payment to the recipient using GBP and push funds.', function(){
        signin.Login(userName, password)
        newRecipient.goToPaymentsDashborad()
        newRecipient.gotoRecipientList()
        let email = batchPayments.generateRandomString(5)+ '@yopmail.com'
        batchPayments.addRecipient('MALTA{enter}' ,'USD{enter}' ,email)
        newRecipient.addBankDetails('MT84MALT011000012345MTLCAST001S','IESCMTM1XXX')
        const lName = batchPayments.generateRandomString(6)
        batchPayments.individualRecipient('INDIVIDUAL GBP PF',lName,'United Kingdom{enter}')
        batchPayments.paymentPurposeGBPEUR()
        cy.get('.ant-select-selector').eq(3).click()
        cy.get('.ant-select-dropdown').eq(3).find('.ant-select-item-option-content').then(Element=>{
            let purposeList = Element.text()
            cy.log(purposeList)
            cy.wrap(purposeList).as('purposeList')
        })
        newRecipient.saveRecipient()
        newPayment.checkSettelment('be.disabled','be.enabled')
        newPayment.proceedflow('{downarrow}{enter}','GBP')
        let amount = '125'
        newPayment.addrecipientDetail(amount, email)
        newPayment.selectFundingMethod('Push Funds')

          // ───── Intercept Quote API ─────
  cy.intercept(
            'POST',
            `https://main-api.volopa-dev.com/${Cypress.env("apiEnv")}/exchange/b2b/self/quote/temp`
        ).as('quoteApi');

  // ───── Wait for API and Compare Values ─────
  cy.wait('@quoteApi').then(({ response }) => {
    const receive = response.body.data.receive;
    const recipientReceives = response.body.data.recipient[0].receives;

    cy.wrap(recipientReceives).as('recipientReceives');
    cy.log(`Receive: ${receive}`);
    cy.log(`Recipient Receives: ${recipientReceives}`);

    expect(receive).to.eq(recipientReceives); // Final comparison
  });
                //Validate the selected payment purpose
        cy.get('@selectedValue').then(selectedValue=>{
            cy.get('.ant-col-sm-20 > :nth-child(2) > :nth-child(1) > .ant-form-item > .ant-row > .ant-col > .ant-form-item-control-input > .ant-form-item-control-input-content > .ant-select > .ant-select-selector')
            .should('be.visible').and('contain.text',selectedValue)
        })
         //Validate Purpose on batch payment
        cy.get('.ant-select-selector').eq(2).click()
        cy.get('.ant-select-dropdown').eq(2).find('.ant-select-item-option-content').then(Element=>{
            let list = Element.text()
            cy.log(list)
            cy.get('@purposeList').then(purposeList=>{
            expect(list).to.eq(purposeList)
            cy.get('.ant-select-selector').eq(2).click() 
        })
          })
       // Validating recipient recived amount
       cy.get(':nth-child(4) > :nth-child(2) > .ant-typography').invoke('text').then((text) => {
        const storedText = text
        cy.wrap(storedText).as('storedText')
        cy.log(storedText)
        })
        cy.get('.ant-col > .ant-btn > span').should('be.visible').click()
        cy.get('.ant-modal-body > :nth-child(1) > .ant-col > .ant-typography').should('be.visible').should('contain.text','Payment Confirmation')
        cy.get('@storedText').then(storedText=>{
            cy.get(':nth-child(5) > .ant-col-8 > .ant-typography')
            .should('be.visible').and('contain.text',storedText)
        })
        cy.get('.ant-row-center.m-t-20 > .ant-col > .ant-space > :nth-child(2) > .ant-btn').should('be.visible').click() // pay recipient
        cy.get('.ant-modal-body > :nth-child(1) > .ant-col').should('be.visible').should('contain.text',' Payment Booked - ')
        cy.get('@storedText').then(storedText=>{
            cy.get(':nth-child(5) > .ant-col-8 > .ant-typography')
            .should('be.visible').and('contain.text',storedText)
        })
        //////newPayment.cancelPushFunds()
    })
    // Individual Easy Transfer
    it('TC_NP_080 - Add 1 recipient(individual) from the "Add Recipient" page with country = Germany and currency = USD. After adding, make a single payment to the recipient using GBP and easy transfer.', function(){
        signin.Login(userName, password)
        newRecipient.goToPaymentsDashborad()
        newRecipient.gotoRecipientList()
        let email = batchPayments.generateRandomString(5)+ '@yopmail.com'
        batchPayments.addRecipient('GERMANY{enter}' ,'USD{enter}' ,email)
        newRecipient.addBankDetails('DE40500105171359375129','AARBDE5W100')
        const lName = batchPayments.generateRandomString(6)
        batchPayments.individualRecipient('INDIVIDUAL GBP PF',lName,'United Kingdom{enter}')
        batchPayments.paymentPurposeGBPEUR()
        cy.get('.ant-select-selector').eq(3).click()
        cy.get('.ant-select-dropdown').eq(3).find('.ant-select-item-option-content').then(Element=>{
            let purposeList = Element.text()
            cy.log(purposeList)
            cy.wrap(purposeList).as('purposeList')
        })
        newRecipient.saveRecipient()
        newPayment.checkSettelment('be.disabled','be.enabled')
        newPayment.proceedflow('{downarrow}{enter}','GBP')
        let amount = '125'
        newPayment.addrecipientDetail(amount, email)
                //Validate the selected payment purpose
        cy.get('@selectedValue').then(selectedValue=>{
            cy.get('.ant-col-sm-20 > :nth-child(2) > :nth-child(1) > :nth-child(1) > .ant-row > .ant-col > .ant-form-item-control-input > .ant-form-item-control-input-content > .ant-select > .ant-select-selector')
            .should('be.visible').and('contain.text',selectedValue)
        })
         //Validate Purpose on batch payment
        cy.get('.ant-select-selector').eq(2).click()
        cy.get('.ant-select-dropdown').eq(1).find('.ant-select-item-option-content').then(Element=>{
            let list = Element.text()
            cy.log(list)
            cy.get('@purposeList').then(purposeList=>{
            expect(list).to.eq(purposeList)
            cy.get('.ant-select-selector').eq(2).click()
        })
          })
       // Validating recipient recived amount
       cy.get(':nth-child(4) > :nth-child(2) > .ant-typography').invoke('text').then((text) => {
        const storedText = text
        cy.wrap(storedText).as('storedText')
        cy.log(storedText)
        })
        cy.get('.ant-col > .ant-btn > span').should('be.visible').click()
        cy.get('.ant-modal-body > :nth-child(1) > .ant-col > .ant-typography').should('be.visible').should('contain.text','Payment Confirmation')
        cy.get('@storedText').then(storedText=>{
            cy.get(':nth-child(5) > .ant-col-8 > .ant-typography')
            .should('be.visible').and('contain.text',storedText)
        })
        cy.get('.ant-row-center.m-t-20 > .ant-col > .ant-space > :nth-child(2) > .ant-btn').should('be.visible').click() // pay recipient
        cy.get('.ant-modal-body > :nth-child(1) > .ant-col').should('be.visible').should('contain.text',' Payment Booked - ')
        cy.get('@storedText').then(storedText=>{
            cy.get(':nth-child(5) > .ant-col-8 > .ant-typography')
            .should('be.visible').and('contain.text',storedText)
        })
        newPayment.validateYapilyFlow()
        //newPayment.cancelEasyTransfer()
    })
    it('TC_NP_081 - Add 1 recipient(individual) from the "Add Recipient" page with country = France and currency = USD. After adding, make a single payment to the recipient using GBP and easy transfer.', function(){
        signin.Login(userName, password)
        newRecipient.goToPaymentsDashborad()
        newRecipient.gotoRecipientList()
        let email = batchPayments.generateRandomString(5)+ '@yopmail.com'
        batchPayments.addRecipient('FRANCE{enter}' ,'USD{enter}' ,email)
        newRecipient.addBankDetails('FR1420041010050500013M02606','GASKFRPPXXX')
        const lName = batchPayments.generateRandomString(6)
        batchPayments.individualRecipient('INDIVIDUAL GBP PF',lName,'United Kingdom{enter}')
        batchPayments.paymentPurposeGBPEUR()
        cy.get('.ant-select-selector').eq(3).click()
        cy.get('.ant-select-dropdown').eq(3).find('.ant-select-item-option-content').then(Element=>{
            let purposeList = Element.text()
            cy.log(purposeList)
            cy.wrap(purposeList).as('purposeList')
        })
        newRecipient.saveRecipient()
        newPayment.checkSettelment('be.disabled','be.enabled')
        newPayment.proceedflow('{downarrow}{enter}','GBP')
        let amount = '125'
        newPayment.addrecipientDetail(amount, email)
                //Validate the selected payment purpose
        cy.get('@selectedValue').then(selectedValue=>{
            cy.get('.ant-col-sm-20 > :nth-child(2) > :nth-child(1) > :nth-child(1) > .ant-row > .ant-col > .ant-form-item-control-input > .ant-form-item-control-input-content > .ant-select > .ant-select-selector')
            .should('be.visible').and('contain.text',selectedValue)
        })
         //Validate Purpose on batch payment
        cy.get('.ant-select-selector').eq(2).click()
        cy.get('.ant-select-dropdown').eq(1).find('.ant-select-item-option-content').then(Element=>{
            let list = Element.text()
            cy.log(list)
            cy.get('@purposeList').then(purposeList=>{
            expect(list).to.eq(purposeList)
            cy.get('.ant-select-selector').eq(2).click()
        })
          })
       // Validating recipient recived amount
       cy.get(':nth-child(4) > :nth-child(2) > .ant-typography').invoke('text').then((text) => {
        const storedText = text
        cy.wrap(storedText).as('storedText')
        cy.log(storedText)
        })
        cy.get('.ant-col > .ant-btn > span').should('be.visible').click()
        cy.get('.ant-modal-body > :nth-child(1) > .ant-col > .ant-typography').should('be.visible').should('contain.text','Payment Confirmation')
        cy.get('@storedText').then(storedText=>{
            cy.get(':nth-child(5) > .ant-col-8 > .ant-typography')
            .should('be.visible').and('contain.text',storedText)
        })
        cy.get('.ant-row-center.m-t-20 > .ant-col > .ant-space > :nth-child(2) > .ant-btn').should('be.visible').click() // pay recipient
        cy.get('.ant-modal-body > :nth-child(1) > .ant-col').should('be.visible').should('contain.text',' Payment Booked - ')
        cy.get('@storedText').then(storedText=>{
            cy.get(':nth-child(5) > .ant-col-8 > .ant-typography')
            .should('be.visible').and('contain.text',storedText)
        })
            newPayment.validateYapilyFlow()
            //newPayment.cancelEasyTransfer()
    })
    it('TC_NP_082 - Add 1 recipient(individual) from the "Add Recipient" page with country = Spain and currency = USD. After adding, make a single payment to the recipient using GBP and easy transfer.', function(){
        signin.Login(userName, password)
        newRecipient.goToPaymentsDashborad()
        newRecipient.gotoRecipientList()
        let email = batchPayments.generateRandomString(5)+ '@yopmail.com'
        batchPayments.addRecipient('SPAIN{enter}' ,'USD{enter}' ,email)
        newRecipient.addBankDetails('ES9121000418450200051332','CAGLESMMCOP')
        const lName = batchPayments.generateRandomString(6)
        batchPayments.individualRecipient('INDIVIDUAL GBP PF',lName,'United Kingdom{enter}')
        batchPayments.paymentPurposeGBPEUR()
        cy.get('.ant-select-selector').eq(3).click()
        cy.get('.ant-select-dropdown').eq(3).find('.ant-select-item-option-content').then(Element=>{
            let purposeList = Element.text()
            cy.log(purposeList)
            cy.wrap(purposeList).as('purposeList')
        })
        newRecipient.saveRecipient()
        newPayment.checkSettelment('be.disabled','be.enabled')
        newPayment.proceedflow('{downarrow}{enter}','GBP')
        let amount = '125'
        newPayment.addrecipientDetail(amount, email)
                //Validate the selected payment purpose
        cy.get('@selectedValue').then(selectedValue=>{
            cy.get('.ant-col-sm-20 > :nth-child(2) > :nth-child(1) > :nth-child(1) > .ant-row > .ant-col > .ant-form-item-control-input > .ant-form-item-control-input-content > .ant-select > .ant-select-selector')
            .should('be.visible').and('contain.text',selectedValue)
        })
         //Validate Purpose on batch payment
        cy.get('.ant-select-selector').eq(2).click()
        cy.get('.ant-select-dropdown').eq(1).find('.ant-select-item-option-content').then(Element=>{
            let list = Element.text()
            cy.log(list)
            cy.get('@purposeList').then(purposeList=>{
            expect(list).to.eq(purposeList)
            cy.get('.ant-select-selector').eq(2).click()
        })
          })
       // Validating recipient recived amount
       cy.get(':nth-child(4) > :nth-child(2) > .ant-typography').invoke('text').then((text) => {
        const storedText = text
        cy.wrap(storedText).as('storedText')
        cy.log(storedText)
        })
        cy.get('.ant-col > .ant-btn > span').should('be.visible').click()
        cy.get('.ant-modal-body > :nth-child(1) > .ant-col > .ant-typography').should('be.visible').should('contain.text','Payment Confirmation')
        cy.get('@storedText').then(storedText=>{
            cy.get(':nth-child(5) > .ant-col-8 > .ant-typography')
            .should('be.visible').and('contain.text',storedText)
        })
        cy.get('.ant-row-center.m-t-20 > .ant-col > .ant-space > :nth-child(2) > .ant-btn').should('be.visible').click() // pay recipient
        cy.get('.ant-modal-body > :nth-child(1) > .ant-col').should('be.visible').should('contain.text',' Payment Booked - ')
        cy.get('@storedText').then(storedText=>{
            cy.get(':nth-child(5) > .ant-col-8 > .ant-typography')
            .should('be.visible').and('contain.text',storedText)
        })
            newPayment.validateYapilyFlow()
            //newPayment.cancelEasyTransfer()
    })
    it('TC_NP_083 - Add 1 recipient(individual) from the "Add Recipient" page with country = Italy and currency = USD. After adding, make a single payment to the recipient using GBP and easy transfer.', function(){
        signin.Login(userName, password)
        newRecipient.goToPaymentsDashborad()
        newRecipient.gotoRecipientList()
        let email = batchPayments.generateRandomString(5)+ '@yopmail.com'
        batchPayments.addRecipient('ITALY{enter}' ,'USD{enter}' ,email)
        newRecipient.addBankDetails('IT60X0542811101000000123456','FCRRITM1XXX')
        const lName = batchPayments.generateRandomString(6)
        batchPayments.individualRecipient('INDIVIDUAL GBP PF',lName,'ITALY{enter}')
        batchPayments.paymentPurposeGBPEUR()
        cy.get('.ant-select-selector').eq(3).click()
        cy.get('.ant-select-dropdown').eq(3).find('.ant-select-item-option-content').then(Element=>{
            let purposeList = Element.text()
            cy.log(purposeList)
            cy.wrap(purposeList).as('purposeList')
        })
        newRecipient.saveRecipient()
        newPayment.checkSettelment('be.disabled','be.enabled')
        newPayment.proceedflow('{downarrow}{enter}','GBP')
        let amount = '125'
        newPayment.addrecipientDetail(amount, email)
                //Validate the selected payment purpose
        cy.get('@selectedValue').then(selectedValue=>{
            cy.get('.ant-col-sm-20 > :nth-child(2) > :nth-child(1) > :nth-child(1) > .ant-row > .ant-col > .ant-form-item-control-input > .ant-form-item-control-input-content > .ant-select > .ant-select-selector')
            .should('be.visible').and('contain.text',selectedValue)
        })
         //Validate Purpose on batch payment
        cy.get('.ant-select-selector').eq(2).click()
        cy.get('.ant-select-dropdown').eq(1).find('.ant-select-item-option-content').then(Element=>{
            let list = Element.text()
            cy.log(list)
            cy.get('@purposeList').then(purposeList=>{
            expect(list).to.eq(purposeList)
            cy.get('.ant-select-selector').eq(2).click()
        })
          })
       // Validating recipient recived amount
       cy.get(':nth-child(4) > :nth-child(2) > .ant-typography').invoke('text').then((text) => {
        const storedText = text
        cy.wrap(storedText).as('storedText')
        cy.log(storedText)
        })
        cy.get('.ant-col > .ant-btn > span').should('be.visible').click()
        cy.get('.ant-modal-body > :nth-child(1) > .ant-col > .ant-typography').should('be.visible').should('contain.text','Payment Confirmation')
        cy.get('@storedText').then(storedText=>{
            cy.get(':nth-child(5) > .ant-col-8 > .ant-typography')
            .should('be.visible').and('contain.text',storedText)
        })
        cy.get('.ant-row-center.m-t-20 > .ant-col > .ant-space > :nth-child(2) > .ant-btn').should('be.visible').click() // pay recipient
        cy.get('.ant-modal-body > :nth-child(1) > .ant-col').should('be.visible').should('contain.text',' Payment Booked - ')
        cy.get('@storedText').then(storedText=>{
            cy.get(':nth-child(5) > .ant-col-8 > .ant-typography')
            .should('be.visible').and('contain.text',storedText)
        })
        newPayment.validateYapilyFlow()
        //newPayment.cancelEasyTransfer()
    })
    it('TC_NP_084 - Add 1 recipient(individual) from the "Add Recipient" page with country = Malta and currency = USD. After adding, make a single payment to the recipient using GBP and easy transfer.', function(){
        signin.Login(userName, password)
        newRecipient.goToPaymentsDashborad()
        newRecipient.gotoRecipientList()
        let email = batchPayments.generateRandomString(5)+ '@yopmail.com'
        batchPayments.addRecipient('MALTA{enter}' ,'USD{enter}' ,email)
        newRecipient.addBankDetails('MT84MALT011000012345MTLCAST001S','IESCMTM1XXX')
        const lName = batchPayments.generateRandomString(6)
        batchPayments.individualRecipient('INDIVIDUAL GBP PF',lName,'MALTA{enter}')
        batchPayments.paymentPurposeGBPEUR()
        cy.get('.ant-select-selector').eq(3).click()
        cy.get('.ant-select-dropdown').eq(3).find('.ant-select-item-option-content').then(Element=>{
            let purposeList = Element.text()
            cy.log(purposeList)
            cy.wrap(purposeList).as('purposeList')
        })
        newRecipient.saveRecipient()
        newPayment.checkSettelment('be.disabled','be.enabled')
        newPayment.proceedflow('{downarrow}{enter}','GBP')
        let amount = '125'
        newPayment.addrecipientDetail(amount, email)
                //Validate the selected payment purpose
        cy.get('@selectedValue').then(selectedValue=>{
            cy.get('.ant-col-sm-20 > :nth-child(2) > :nth-child(1) > :nth-child(1) > .ant-row > .ant-col > .ant-form-item-control-input > .ant-form-item-control-input-content > .ant-select > .ant-select-selector')
            .should('be.visible').and('contain.text',selectedValue)
        })
         //Validate Purpose on batch payment
        cy.get('.ant-select-selector').eq(2).click()
        cy.get('.ant-select-dropdown').eq(1).find('.ant-select-item-option-content').then(Element=>{
            let list = Element.text()
            cy.log(list)
            cy.get('@purposeList').then(purposeList=>{
            expect(list).to.eq(purposeList)
            cy.get('.ant-select-selector').eq(2).click()
        })
          })
       // Validating recipient recived amount
       cy.get(':nth-child(4) > :nth-child(2) > .ant-typography').invoke('text').then((text) => {
        const storedText = text
        cy.wrap(storedText).as('storedText')
        cy.log(storedText)
        })
        cy.get('.ant-col > .ant-btn > span').should('be.visible').click()
        cy.get('.ant-modal-body > :nth-child(1) > .ant-col > .ant-typography').should('be.visible').should('contain.text','Payment Confirmation')
        cy.get('@storedText').then(storedText=>{
            cy.get(':nth-child(5) > .ant-col-8 > .ant-typography')
            .should('be.visible').and('contain.text',storedText)
        })
        cy.get('.ant-row-center.m-t-20 > .ant-col > .ant-space > :nth-child(2) > .ant-btn').should('be.visible').click() // pay recipient
        cy.get('.ant-modal-body > :nth-child(1) > .ant-col').should('be.visible').should('contain.text',' Payment Booked - ')
        cy.get('@storedText').then(storedText=>{
            cy.get(':nth-child(5) > .ant-col-8 > .ant-typography')
            .should('be.visible').and('contain.text',storedText)
        })
        newPayment.validateYapilyFlow()
        //newPayment.cancelEasyTransfer()
    })
    // Business Push Fund 
    it('TC_NP_085 - Add 1 recipient(Business) from the "Add Recipient" page with country = Germany and currency = USD. After adding, make a single payment to the recipient using GBP and push funds.', function(){
        signin.Login(userName, password)
        newRecipient.goToPaymentsDashborad()
        newRecipient.gotoRecipientList()
        let email = batchPayments.generateRandomString(5)+ '@yopmail.com'
        batchPayments.addRecipient('GERMANY{enter}' ,'USD{enter}' ,email)
        newRecipient.addBankDetails('DE40500105171359375129','AARBDE5W100')
        cy.get('.ant-space > :nth-child(2) > .ant-card > .ant-card-body').should('be.visible').click()
        const bName = batchPayments.generateRandomString(6)
        batchPayments.addBusinessRecipient('BUSINESS USD'+' '+bName,'GERMANY{enter}')
        batchPayments.paymentPurposeGBPEUR()
        cy.get('.ant-select-selector').eq(3).click()
        cy.get('.ant-select-dropdown').eq(3).find('.ant-select-item-option-content').then(Element=>{
            let purposeList = Element.text()
            cy.log(purposeList)
            cy.wrap(purposeList).as('purposeList')
        })
        newRecipient.saveRecipient()
        newPayment.checkSettelment('be.disabled','be.enabled')
        newPayment.proceedflow('{downarrow}{enter}','GBP')
        let amount = '125'
        newPayment.addrecipientDetail(amount, email)
        newPayment.selectFundingMethod('Push Funds')

          // ───── Intercept Quote API ─────
  cy.intercept(
            'POST',
            `https://main-api.volopa-dev.com/${Cypress.env("apiEnv")}/exchange/b2b/self/quote/temp`
        ).as('quoteApi');

  // ───── Wait for API and Compare Values ─────
  cy.wait('@quoteApi').then(({ response }) => {
    const receive = response.body.data.receive;
    const recipientReceives = response.body.data.recipient[0].receives;

    cy.wrap(recipientReceives).as('recipientReceives');
    cy.log(`Receive: ${receive}`);
    cy.log(`Recipient Receives: ${recipientReceives}`);

    expect(receive).to.eq(recipientReceives); // Final comparison
  });
             //Validate the selected payment purpose
             cy.get('@selectedValue').then(selectedValue=>{
                cy.get('.ant-col-sm-20 > :nth-child(2) > :nth-child(1) > .ant-form-item > .ant-row > .ant-col > .ant-form-item-control-input > .ant-form-item-control-input-content > .ant-select > .ant-select-selector')
                .should('be.visible').and('contain.text',selectedValue)
            })
         //Validate Purpose on batch payment
        cy.get('.ant-select-selector').eq(2).click()
        cy.get('.ant-select-dropdown').eq(2).find('.ant-select-item-option-content').then(Element=>{
            let list = Element.text()
            cy.log(list)
            cy.get('@purposeList').then(purposeList=>{
            expect(list).to.eq(purposeList)
            cy.get('.ant-select-selector').eq(2).click() 
        })
          })
          // Validating recipient recived amount
          cy.get(':nth-child(4) > :nth-child(2) > .ant-typography').invoke('text').then((text) => {
            const storedText = text
            cy.wrap(storedText).as('storedText')
            cy.log(storedText)
            })
            cy.get('.ant-col > .ant-btn > span').should('be.visible').click()
            cy.get('.ant-modal-body > :nth-child(1) > .ant-col > .ant-typography').should('be.visible').should('contain.text','Payment Confirmation')
            cy.get('@storedText').then(storedText=>{
                cy.get(':nth-child(5) > .ant-col-8 > .ant-typography')
                .should('be.visible').and('contain.text',storedText)
            })
            cy.get('.ant-row-center.m-t-20 > .ant-col > .ant-space > :nth-child(2) > .ant-btn').should('be.visible').click() // pay recipient
            cy.get('.ant-modal-body > :nth-child(1) > .ant-col').should('be.visible').should('contain.text',' Payment Booked - ')
            cy.get('@storedText').then(storedText=>{
                cy.get(':nth-child(5) > .ant-col-8 > .ant-typography')
                .should('be.visible').and('contain.text',storedText)
            })
            //////newPayment.cancelPushFunds()
    })
    it('TC_NP_086 - Add 1 recipient(Business) from the "Add Recipient" page with country = France and currency = USD. After adding, make a single payment to the recipient using GBP and push funds.', function(){
        signin.Login(userName, password)
        newRecipient.goToPaymentsDashborad()
        newRecipient.gotoRecipientList()
        let email = batchPayments.generateRandomString(5)+ '@yopmail.com'
        batchPayments.addRecipient('FRANCE{enter}' ,'USD{enter}' ,email)
        newRecipient.addBankDetails('FR1420041010050500013M02606','GASKFRPPXXX')
        cy.get('.ant-space > :nth-child(2) > .ant-card > .ant-card-body').should('be.visible').click()
        const bName = batchPayments.generateRandomString(6)
        batchPayments.addBusinessRecipient('BUSINESS USD'+' '+bName,'FRANCE{enter}')
        batchPayments.paymentPurposeGBPEUR()
        cy.get('.ant-select-selector').eq(3).click()
        cy.get('.ant-select-dropdown').eq(3).find('.ant-select-item-option-content').then(Element=>{
            let purposeList = Element.text()
            cy.log(purposeList)
            cy.wrap(purposeList).as('purposeList')
        })
        newRecipient.saveRecipient()
        newPayment.checkSettelment('be.disabled','be.enabled')
        newPayment.proceedflow('{downarrow}{enter}','GBP')
        let amount = '125'
        newPayment.addrecipientDetail(amount, email)
        newPayment.selectFundingMethod('Push Funds')

          // ───── Intercept Quote API ─────
  cy.intercept(
            'POST',
            `https://main-api.volopa-dev.com/${Cypress.env("apiEnv")}/exchange/b2b/self/quote/temp`
        ).as('quoteApi');

  // ───── Wait for API and Compare Values ─────
  cy.wait('@quoteApi').then(({ response }) => {
    const receive = response.body.data.receive;
    const recipientReceives = response.body.data.recipient[0].receives;

    cy.wrap(recipientReceives).as('recipientReceives');
    cy.log(`Receive: ${receive}`);
    cy.log(`Recipient Receives: ${recipientReceives}`);

    expect(receive).to.eq(recipientReceives); // Final comparison
  });
             //Validate the selected payment purpose
             cy.get('@selectedValue').then(selectedValue=>{
                cy.get('.ant-col-sm-20 > :nth-child(2) > :nth-child(1) > .ant-form-item > .ant-row > .ant-col > .ant-form-item-control-input > .ant-form-item-control-input-content > .ant-select > .ant-select-selector')
                .should('be.visible').and('contain.text',selectedValue)
            })
         //Validate Purpose on batch payment
        cy.get('.ant-select-selector').eq(2).click()
        cy.get('.ant-select-dropdown').eq(2).find('.ant-select-item-option-content').then(Element=>{
            let list = Element.text()
            cy.log(list)
            cy.get('@purposeList').then(purposeList=>{
            expect(list).to.eq(purposeList)
            cy.get('.ant-select-selector').eq(2).click() 
        })
          })
       // Validating recipient recived amount
       cy.get(':nth-child(4) > :nth-child(2) > .ant-typography').invoke('text').then((text) => {
        const storedText = text
        cy.wrap(storedText).as('storedText')
        cy.log(storedText)
        })
        cy.get('.ant-col > .ant-btn > span').should('be.visible').click()
        cy.get('.ant-modal-body > :nth-child(1) > .ant-col > .ant-typography').should('be.visible').should('contain.text','Payment Confirmation')
        cy.get('@storedText').then(storedText=>{
            cy.get(':nth-child(5) > .ant-col-8 > .ant-typography')
            .should('be.visible').and('contain.text',storedText)
        })
        cy.get('.ant-row-center.m-t-20 > .ant-col > .ant-space > :nth-child(2) > .ant-btn').should('be.visible').click() // pay recipient
        cy.get('.ant-modal-body > :nth-child(1) > .ant-col').should('be.visible').should('contain.text',' Payment Booked - ')
        cy.get('@storedText').then(storedText=>{
            cy.get(':nth-child(5) > .ant-col-8 > .ant-typography')
            .should('be.visible').and('contain.text',storedText)
        })
        //////newPayment.cancelPushFunds()
    })
    it('TC_NP_087 - Add 1 recipient(Business) from the "Add Recipient" page with country = Spain and currency = USD. After adding, make a single payment to the recipient using GBP and push funds.', function(){
        signin.Login(userName, password)
        newRecipient.goToPaymentsDashborad()
        newRecipient.gotoRecipientList()
        let email = batchPayments.generateRandomString(5)+ '@yopmail.com'
        batchPayments.addRecipient('SPAIN{enter}' ,'USD{enter}' ,email)
        newRecipient.addBankDetails('ES9121000418450200051332','CAGLESMMCOP')
        cy.get('.ant-space > :nth-child(2) > .ant-card > .ant-card-body').should('be.visible').click()
        const bName = batchPayments.generateRandomString(6)
        batchPayments.addBusinessRecipient('BUSINESS USD'+' '+bName,'SPAIN{enter}')
        batchPayments.paymentPurposeGBPEUR()
        cy.get('.ant-select-selector').eq(3).click()
        cy.get('.ant-select-dropdown').eq(3).find('.ant-select-item-option-content').then(Element=>{
            let purposeList = Element.text()
            cy.log(purposeList)
            cy.wrap(purposeList).as('purposeList')
        })
        newRecipient.saveRecipient()
        newPayment.checkSettelment('be.disabled','be.enabled')
        newPayment.proceedflow('{downarrow}{enter}','GBP')
        let amount = '125'
        newPayment.addrecipientDetail(amount, email)
        newPayment.selectFundingMethod('Push Funds')

          // ───── Intercept Quote API ─────
  cy.intercept(
            'POST',
            `https://main-api.volopa-dev.com/${Cypress.env("apiEnv")}/exchange/b2b/self/quote/temp`
        ).as('quoteApi');

  // ───── Wait for API and Compare Values ─────
  cy.wait('@quoteApi').then(({ response }) => {
    const receive = response.body.data.receive;
    const recipientReceives = response.body.data.recipient[0].receives;

    cy.wrap(recipientReceives).as('recipientReceives');
    cy.log(`Receive: ${receive}`);
    cy.log(`Recipient Receives: ${recipientReceives}`);

    expect(receive).to.eq(recipientReceives); // Final comparison
  });
             //Validate the selected payment purpose
             cy.get('@selectedValue').then(selectedValue=>{
                cy.get('.ant-col-sm-20 > :nth-child(2) > :nth-child(1) > .ant-form-item > .ant-row > .ant-col > .ant-form-item-control-input > .ant-form-item-control-input-content > .ant-select > .ant-select-selector')
                .should('be.visible').and('contain.text',selectedValue)
            })
         //Validate Purpose on batch payment
        cy.get('.ant-select-selector').eq(2).click()
        cy.get('.ant-select-dropdown').eq(2).find('.ant-select-item-option-content').then(Element=>{
            let list = Element.text()
            cy.log(list)
            cy.get('@purposeList').then(purposeList=>{
            expect(list).to.eq(purposeList)
            cy.get('.ant-select-selector').eq(2).click() 
        })
          })
       // Validating recipient recived amount
       cy.get(':nth-child(4) > :nth-child(2) > .ant-typography').invoke('text').then((text) => {
        const storedText = text
        cy.wrap(storedText).as('storedText')
        cy.log(storedText)
        })
        cy.get('.ant-col > .ant-btn > span').should('be.visible').click()
        cy.get('.ant-modal-body > :nth-child(1) > .ant-col > .ant-typography').should('be.visible').should('contain.text','Payment Confirmation')
        cy.get('@storedText').then(storedText=>{
            cy.get(':nth-child(5) > .ant-col-8 > .ant-typography')
            .should('be.visible').and('contain.text',storedText)
        })
        cy.get('.ant-row-center.m-t-20 > .ant-col > .ant-space > :nth-child(2) > .ant-btn').should('be.visible').click() // pay recipient
        cy.get('.ant-modal-body > :nth-child(1) > .ant-col').should('be.visible').should('contain.text',' Payment Booked - ')
        cy.get('@storedText').then(storedText=>{
            cy.get(':nth-child(5) > .ant-col-8 > .ant-typography')
            .should('be.visible').and('contain.text',storedText)
        })
        //////newPayment.cancelPushFunds()
    })
    it('TC_NP_088 - Add 1 recipient(Business) from the "Add Recipient" page with country = Italy and currency = USD. After adding, make a single payment to the recipient using GBP and push funds.', function(){
        signin.Login(userName, password)
        newRecipient.goToPaymentsDashborad()
        newRecipient.gotoRecipientList()
        let email = batchPayments.generateRandomString(5)+ '@yopmail.com'
        batchPayments.addRecipient('ITALY{enter}' ,'USD{enter}' ,email)
        newRecipient.addBankDetails('IT60X0542811101000000123456','FCRRITM1XXX')
        cy.get('.ant-space > :nth-child(2) > .ant-card > .ant-card-body').should('be.visible').click()
        const bName = batchPayments.generateRandomString(6)
        batchPayments.addBusinessRecipient('BUSINESS USD'+' '+bName,'ITALY{enter}')
        batchPayments.paymentPurposeGBPEUR()
        cy.get('.ant-select-selector').eq(3).click()
        cy.get('.ant-select-dropdown').eq(3).find('.ant-select-item-option-content').then(Element=>{
            let purposeList = Element.text()
            cy.log(purposeList)
            cy.wrap(purposeList).as('purposeList')
        })
        newRecipient.saveRecipient()
        newPayment.checkSettelment('be.disabled','be.enabled')
        newPayment.proceedflow('{downarrow}{enter}','GBP')
        let amount = '125'
        newPayment.addrecipientDetail(amount, email)
        newPayment.selectFundingMethod('Push Funds')

          // ───── Intercept Quote API ─────
  cy.intercept(
            'POST',
            `https://main-api.volopa-dev.com/${Cypress.env("apiEnv")}/exchange/b2b/self/quote/temp`
        ).as('quoteApi');

  // ───── Wait for API and Compare Values ─────
  cy.wait('@quoteApi').then(({ response }) => {
    const receive = response.body.data.receive;
    const recipientReceives = response.body.data.recipient[0].receives;

    cy.wrap(recipientReceives).as('recipientReceives');
    cy.log(`Receive: ${receive}`);
    cy.log(`Recipient Receives: ${recipientReceives}`);

    expect(receive).to.eq(recipientReceives); // Final comparison
  });
             //Validate the selected payment purpose
             cy.get('@selectedValue').then(selectedValue=>{
                cy.get('.ant-col-sm-20 > :nth-child(2) > :nth-child(1) > .ant-form-item > .ant-row > .ant-col > .ant-form-item-control-input > .ant-form-item-control-input-content > .ant-select > .ant-select-selector')
                .should('be.visible').and('contain.text',selectedValue)
            })
         //Validate Purpose on batch payment
        cy.get('.ant-select-selector').eq(2).click()
        cy.get('.ant-select-dropdown').eq(2).find('.ant-select-item-option-content').then(Element=>{
            let list = Element.text()
            cy.log(list)
            cy.get('@purposeList').then(purposeList=>{
            expect(list).to.eq(purposeList)
            cy.get('.ant-select-selector').eq(2).click() 
        })
          })
       // Validating recipient recived amount
       cy.get(':nth-child(4) > :nth-child(2) > .ant-typography').invoke('text').then((text) => {
        const storedText = text
        cy.wrap(storedText).as('storedText')
        cy.log(storedText)
        })
        cy.get('.ant-col > .ant-btn > span').should('be.visible').click()
        cy.get('.ant-modal-body > :nth-child(1) > .ant-col > .ant-typography').should('be.visible').should('contain.text','Payment Confirmation')
        cy.get('@storedText').then(storedText=>{
            cy.get(':nth-child(5) > .ant-col-8 > .ant-typography')
            .should('be.visible').and('contain.text',storedText)
        })
        cy.get('.ant-row-center.m-t-20 > .ant-col > .ant-space > :nth-child(2) > .ant-btn').should('be.visible').click() // pay recipient
        cy.get('.ant-modal-body > :nth-child(1) > .ant-col').should('be.visible').should('contain.text',' Payment Booked - ')
        cy.get('@storedText').then(storedText=>{
            cy.get(':nth-child(5) > .ant-col-8 > .ant-typography')
            .should('be.visible').and('contain.text',storedText)
        })
        //////newPayment.cancelPushFunds()
    })
    it('TC_NP_089 - Add 1 recipient(Business) from the "Add Recipient" page with country = Malta and currency = USD. After adding, make a single payment to the recipient using GBP and push funds.', function(){
        signin.Login(userName, password)
        newRecipient.goToPaymentsDashborad()
        newRecipient.gotoRecipientList()
        let email = batchPayments.generateRandomString(5)+ '@yopmail.com'
        batchPayments.addRecipient('MALTA{enter}' ,'USD{enter}' ,email)
        newRecipient.addBankDetails('MT84MALT011000012345MTLCAST001S','IESCMTM1XXX')
        cy.get('.ant-space > :nth-child(2) > .ant-card > .ant-card-body').should('be.visible').click()
        const bName = batchPayments.generateRandomString(6)
        batchPayments.addBusinessRecipient('BUSINESS USD'+' '+bName,'MALTA{enter}')
        batchPayments.paymentPurposeGBPEUR()
        cy.get('.ant-select-selector').eq(3).click()
        cy.get('.ant-select-dropdown').eq(3).find('.ant-select-item-option-content').then(Element=>{
            let purposeList = Element.text()
            cy.log(purposeList)
            cy.wrap(purposeList).as('purposeList')
        })
        newRecipient.saveRecipient()
        newPayment.checkSettelment('be.disabled','be.enabled')
        newPayment.proceedflow('{downarrow}{enter}','GBP')
        let amount = '125'
        newPayment.addrecipientDetail(amount, email)
        newPayment.selectFundingMethod('Push Funds')

          // ───── Intercept Quote API ─────
  cy.intercept(
            'POST',
            `https://main-api.volopa-dev.com/${Cypress.env("apiEnv")}/exchange/b2b/self/quote/temp`
        ).as('quoteApi');

  // ───── Wait for API and Compare Values ─────
  cy.wait('@quoteApi').then(({ response }) => {
    const receive = response.body.data.receive;
    const recipientReceives = response.body.data.recipient[0].receives;

    cy.wrap(recipientReceives).as('recipientReceives');
    cy.log(`Receive: ${receive}`);
    cy.log(`Recipient Receives: ${recipientReceives}`);

    expect(receive).to.eq(recipientReceives); // Final comparison
  });
                //Validate the selected payment purpose
        cy.get('@selectedValue').then(selectedValue=>{
            cy.get('.ant-col-sm-20 > :nth-child(2) > :nth-child(1) > .ant-form-item > .ant-row > .ant-col > .ant-form-item-control-input > .ant-form-item-control-input-content > .ant-select > .ant-select-selector')
            .should('be.visible').and('contain.text',selectedValue)
        })
         //Validate Purpose on batch payment
        cy.get('.ant-select-selector').eq(2).click()
        cy.get('.ant-select-dropdown').eq(2).find('.ant-select-item-option-content').then(Element=>{
            let list = Element.text()
            cy.log(list)
            cy.get('@purposeList').then(purposeList=>{
            expect(list).to.eq(purposeList)
            cy.get('.ant-select-selector').eq(2).click() 
        })
          })
       // Validating recipient recived amount
       cy.get(':nth-child(4) > :nth-child(2) > .ant-typography').invoke('text').then((text) => {
        const storedText = text
        cy.wrap(storedText).as('storedText')
        cy.log(storedText)
        })
        cy.get('.ant-col > .ant-btn > span').should('be.visible').click()
        cy.get('.ant-modal-body > :nth-child(1) > .ant-col > .ant-typography').should('be.visible').should('contain.text','Payment Confirmation')
        cy.get('@storedText').then(storedText=>{
            cy.get(':nth-child(5) > .ant-col-8 > .ant-typography')
            .should('be.visible').and('contain.text',storedText)
        })
        cy.get('.ant-row-center.m-t-20 > .ant-col > .ant-space > :nth-child(2) > .ant-btn').should('be.visible').click() // pay recipient
        cy.get('.ant-modal-body > :nth-child(1) > .ant-col').should('be.visible').should('contain.text',' Payment Booked - ')
        cy.get('@storedText').then(storedText=>{
            cy.get(':nth-child(5) > .ant-col-8 > .ant-typography')
            .should('be.visible').and('contain.text',storedText)
        })
        //////newPayment.cancelPushFunds()
    })
    // Business Easy Transfer
    it('TC_NP_090 - Add 1 recipient(Business) from the "Add Recipient" page with country = Germany and currency = USD. After adding, make a single payment to the recipient using GBP and easy transfer.', function(){
        signin.Login(userName, password)
        newRecipient.goToPaymentsDashborad()
        newRecipient.gotoRecipientList()
        let email = batchPayments.generateRandomString(5)+ '@yopmail.com'
        batchPayments.addRecipient('GERMANY{enter}' ,'USD{enter}' ,email)
        newRecipient.addBankDetails('DE40500105171359375129','AARBDE5W100')
        cy.get('.ant-space > :nth-child(2) > .ant-card > .ant-card-body').should('be.visible').click()
        const bName = batchPayments.generateRandomString(6)
        batchPayments.addBusinessRecipient('BUSINESS USD'+' '+bName,'GERMANY{enter}')
        batchPayments.paymentPurposeGBPEUR()
        cy.get('.ant-select-selector').eq(3).click()
        cy.get('.ant-select-dropdown').eq(3).find('.ant-select-item-option-content').then(Element=>{
            let purposeList = Element.text()
            cy.log(purposeList)
            cy.wrap(purposeList).as('purposeList')
        })
        newRecipient.saveRecipient()
        newPayment.checkSettelment('be.disabled','be.enabled')
        newPayment.proceedflow('{downarrow}{enter}','GBP')
        let amount = '125'
        newPayment.addrecipientDetail(amount, email)
                //Validate the selected payment purpose
        cy.get('@selectedValue').then(selectedValue=>{
            cy.get('.ant-col-sm-20 > :nth-child(2) > :nth-child(1) > :nth-child(1) > .ant-row > .ant-col > .ant-form-item-control-input > .ant-form-item-control-input-content > .ant-select > .ant-select-selector')
            .should('be.visible').and('contain.text',selectedValue)
        })
         //Validate Purpose on batch payment
        cy.get('.ant-select-selector').eq(2).click()
        cy.get('.ant-select-dropdown').eq(1).find('.ant-select-item-option-content').then(Element=>{
            let list = Element.text()
            cy.log(list)
            cy.get('@purposeList').then(purposeList=>{
            expect(list).to.eq(purposeList)
            cy.get('.ant-select-selector').eq(2).click()
        })
          })
       // Validating recipient recived amount
       cy.get(':nth-child(4) > :nth-child(2) > .ant-typography').invoke('text').then((text) => {
        const storedText = text
        cy.wrap(storedText).as('storedText')
        cy.log(storedText)
        })
        cy.get('.ant-col > .ant-btn > span').should('be.visible').click()
        cy.get('.ant-modal-body > :nth-child(1) > .ant-col > .ant-typography').should('be.visible').should('contain.text','Payment Confirmation')
        cy.get('@storedText').then(storedText=>{
            cy.get(':nth-child(5) > .ant-col-8 > .ant-typography')
            .should('be.visible').and('contain.text',storedText)
        })
        cy.get('.ant-row-center.m-t-20 > .ant-col > .ant-space > :nth-child(2) > .ant-btn').should('be.visible').click() // pay recipient
        cy.get('.ant-modal-body > :nth-child(1) > .ant-col').should('be.visible').should('contain.text',' Payment Booked - ')
        cy.get('@storedText').then(storedText=>{
            cy.get(':nth-child(5) > .ant-col-8 > .ant-typography')
            .should('be.visible').and('contain.text',storedText)
        })
        newPayment.validateYapilyFlow()
        //newPayment.cancelEasyTransfer()
    })
    it('TC_NP_091 - Add 1 recipient(Business) from the "Add Recipient" page with country = France and currency = USD. After adding, make a single payment to the recipient using GBP and easy transfer.', function(){
        signin.Login(userName, password)
        newRecipient.goToPaymentsDashborad()
        newRecipient.gotoRecipientList()
        let email = batchPayments.generateRandomString(5)+ '@yopmail.com'
        batchPayments.addRecipient('FRANCE{enter}' ,'USD{enter}' ,email)
        newRecipient.addBankDetails('FR1420041010050500013M02606','GASKFRPPXXX')
        cy.get('.ant-space > :nth-child(2) > .ant-card > .ant-card-body').should('be.visible').click()
        const bName = batchPayments.generateRandomString(6)
        batchPayments.addBusinessRecipient('BUSINESS USD'+' '+bName,'FRANCE{enter}')
        batchPayments.paymentPurposeGBPEUR()
        cy.get('.ant-select-selector').eq(3).click()
        cy.get('.ant-select-dropdown').eq(3).find('.ant-select-item-option-content').then(Element=>{
            let purposeList = Element.text()
            cy.log(purposeList)
            cy.wrap(purposeList).as('purposeList')
        })
        newRecipient.saveRecipient()
        newPayment.checkSettelment('be.disabled','be.enabled')
        newPayment.proceedflow('{downarrow}{enter}','GBP')
        let amount = '125'
        newPayment.addrecipientDetail(amount, email)
                //Validate the selected payment purpose
        cy.get('@selectedValue').then(selectedValue=>{
            cy.get('.ant-col-sm-20 > :nth-child(2) > :nth-child(1) > :nth-child(1) > .ant-row > .ant-col > .ant-form-item-control-input > .ant-form-item-control-input-content > .ant-select > .ant-select-selector')
            .should('be.visible').and('contain.text',selectedValue)
        })
         //Validate Purpose on batch payment
        cy.get('.ant-select-selector').eq(2).click()
        cy.get('.ant-select-dropdown').eq(1).find('.ant-select-item-option-content').then(Element=>{
            let list = Element.text()
            cy.log(list)
            cy.get('@purposeList').then(purposeList=>{
            expect(list).to.eq(purposeList)
            cy.get('.ant-select-selector').eq(2).click()
        })
          })
       // Validating recipient recived amount
       cy.get(':nth-child(4) > :nth-child(2) > .ant-typography').invoke('text').then((text) => {
        const storedText = text
        cy.wrap(storedText).as('storedText')
        cy.log(storedText)
        })
        cy.get('.ant-col > .ant-btn > span').should('be.visible').click()
        cy.get('.ant-modal-body > :nth-child(1) > .ant-col > .ant-typography').should('be.visible').should('contain.text','Payment Confirmation')
        cy.get('@storedText').then(storedText=>{
            cy.get(':nth-child(5) > .ant-col-8 > .ant-typography')
            .should('be.visible').and('contain.text',storedText)
        })
        cy.get('.ant-row-center.m-t-20 > .ant-col > .ant-space > :nth-child(2) > .ant-btn').should('be.visible').click() // pay recipient
        cy.get('.ant-modal-body > :nth-child(1) > .ant-col').should('be.visible').should('contain.text',' Payment Booked - ')
        cy.get('@storedText').then(storedText=>{
            cy.get(':nth-child(5) > .ant-col-8 > .ant-typography')
            .should('be.visible').and('contain.text',storedText)
        })
            newPayment.validateYapilyFlow()
            //newPayment.cancelEasyTransfer()
    })
    it('TC_NP_092 - Add 1 recipient(Business) from the "Add Recipient" page with country = Spain and currency = USD. After adding, make a single payment to the recipient using GBP and easy transfer.', function(){
        signin.Login(userName, password)
        newRecipient.goToPaymentsDashborad()
        newRecipient.gotoRecipientList()
        let email = batchPayments.generateRandomString(5)+ '@yopmail.com'
        batchPayments.addRecipient('SPAIN{enter}' ,'USD{enter}' ,email)
        newRecipient.addBankDetails('ES9121000418450200051332','CAGLESMMCOP')
        cy.get('.ant-space > :nth-child(2) > .ant-card > .ant-card-body').should('be.visible').click()
        const bName = batchPayments.generateRandomString(6)
        batchPayments.addBusinessRecipient('BUSINESS USD'+' '+bName,'SPAIN{enter}')
        batchPayments.paymentPurposeGBPEUR()
        cy.get('.ant-select-selector').eq(3).click()
        cy.get('.ant-select-dropdown').eq(3).find('.ant-select-item-option-content').then(Element=>{
            let purposeList = Element.text()
            cy.log(purposeList)
            cy.wrap(purposeList).as('purposeList')
        })
        newRecipient.saveRecipient()
        newPayment.checkSettelment('be.disabled','be.enabled')
        newPayment.proceedflow('{downarrow}{enter}','GBP')
        let amount = '125'
        newPayment.addrecipientDetail(amount, email)
                //Validate the selected payment purpose
        cy.get('@selectedValue').then(selectedValue=>{
            cy.get('.ant-col-sm-20 > :nth-child(2) > :nth-child(1) > :nth-child(1) > .ant-row > .ant-col > .ant-form-item-control-input > .ant-form-item-control-input-content > .ant-select > .ant-select-selector')
            .should('be.visible').and('contain.text',selectedValue)
        })
         //Validate Purpose on batch payment
        cy.get('.ant-select-selector').eq(2).click()
        cy.get('.ant-select-dropdown').eq(1).find('.ant-select-item-option-content').then(Element=>{
            let list = Element.text()
            cy.log(list)
            cy.get('@purposeList').then(purposeList=>{
            expect(list).to.eq(purposeList)
            cy.get('.ant-select-selector').eq(2).click()
        })
          })
       // Validating recipient recived amount
       cy.get(':nth-child(4) > :nth-child(2) > .ant-typography').invoke('text').then((text) => {
        const storedText = text
        cy.wrap(storedText).as('storedText')
        cy.log(storedText)
        })
        cy.get('.ant-col > .ant-btn > span').should('be.visible').click()
        cy.get('.ant-modal-body > :nth-child(1) > .ant-col > .ant-typography').should('be.visible').should('contain.text','Payment Confirmation')
        cy.get('@storedText').then(storedText=>{
            cy.get(':nth-child(5) > .ant-col-8 > .ant-typography')
            .should('be.visible').and('contain.text',storedText)
        })
        cy.get('.ant-row-center.m-t-20 > .ant-col > .ant-space > :nth-child(2) > .ant-btn').should('be.visible').click() // pay recipient
        cy.get('.ant-modal-body > :nth-child(1) > .ant-col').should('be.visible').should('contain.text',' Payment Booked - ')
        cy.get('@storedText').then(storedText=>{
            cy.get(':nth-child(5) > .ant-col-8 > .ant-typography')
            .should('be.visible').and('contain.text',storedText)
        })
            newPayment.validateYapilyFlow()
            //newPayment.cancelEasyTransfer()
    })
    it('TC_NP_093 - Add 1 recipient(Business) from the "Add Recipient" page with country = Italy and currency = USD. After adding, make a single payment to the recipient using GBP and easy transfer.', function(){
        signin.Login(userName, password)
        newRecipient.goToPaymentsDashborad()
        newRecipient.gotoRecipientList()
        let email = batchPayments.generateRandomString(5)+ '@yopmail.com'
        batchPayments.addRecipient('ITALY{enter}' ,'USD{enter}' ,email)
        newRecipient.addBankDetails('IT60X0542811101000000123456','FCRRITM1XXX')
        cy.get('.ant-space > :nth-child(2) > .ant-card > .ant-card-body').should('be.visible').click()
        const bName = batchPayments.generateRandomString(6)
        batchPayments.addBusinessRecipient('BUSINESS USD'+' '+bName,'ITALY{enter}')
        batchPayments.paymentPurposeGBPEUR()
        cy.get('.ant-select-selector').eq(3).click()
        cy.get('.ant-select-dropdown').eq(3).find('.ant-select-item-option-content').then(Element=>{
            let purposeList = Element.text()
            cy.log(purposeList)
            cy.wrap(purposeList).as('purposeList')
        })
        newRecipient.saveRecipient()
        newPayment.checkSettelment('be.disabled','be.enabled')
        newPayment.proceedflow('{downarrow}{enter}','GBP')
        let amount = '125'
        newPayment.addrecipientDetail(amount, email)
                //Validate the selected payment purpose
        cy.get('@selectedValue').then(selectedValue=>{
            cy.get('.ant-col-sm-20 > :nth-child(2) > :nth-child(1) > :nth-child(1) > .ant-row > .ant-col > .ant-form-item-control-input > .ant-form-item-control-input-content > .ant-select > .ant-select-selector')
            .should('be.visible').and('contain.text',selectedValue)
        })
         //Validate Purpose on batch payment
        cy.get('.ant-select-selector').eq(2).click()
        cy.get('.ant-select-dropdown').eq(1).find('.ant-select-item-option-content').then(Element=>{
            let list = Element.text()
            cy.log(list)
            cy.get('@purposeList').then(purposeList=>{
            expect(list).to.eq(purposeList)
            cy.get('.ant-select-selector').eq(2).click()
        })
          })
       // Validating recipient recived amount
       cy.get(':nth-child(4) > :nth-child(2) > .ant-typography').invoke('text').then((text) => {
        const storedText = text
        cy.wrap(storedText).as('storedText')
        cy.log(storedText)
        })
        cy.get('.ant-col > .ant-btn > span').should('be.visible').click()
        cy.get('.ant-modal-body > :nth-child(1) > .ant-col > .ant-typography').should('be.visible').should('contain.text','Payment Confirmation')
        cy.get('@storedText').then(storedText=>{
            cy.get(':nth-child(5) > .ant-col-8 > .ant-typography')
            .should('be.visible').and('contain.text',storedText)
        })
        cy.get('.ant-row-center.m-t-20 > .ant-col > .ant-space > :nth-child(2) > .ant-btn').should('be.visible').click() // pay recipient
        cy.get('.ant-modal-body > :nth-child(1) > .ant-col').should('be.visible').should('contain.text',' Payment Booked - ')
        cy.get('@storedText').then(storedText=>{
            cy.get(':nth-child(5) > .ant-col-8 > .ant-typography')
            .should('be.visible').and('contain.text',storedText)
        })
        newPayment.validateYapilyFlow()
        //newPayment.cancelEasyTransfer()
    })
    it('TC_NP_094 - Add 1 recipient(Business) from the "Add Recipient" page with country = Malta and currency = USD. After adding, make a single payment to the recipient using GBP and easy transfer.', function(){
        signin.Login(userName, password)
        newRecipient.goToPaymentsDashborad()
        newRecipient.gotoRecipientList()
        let email = batchPayments.generateRandomString(5)+ '@yopmail.com'
        batchPayments.addRecipient('MALTA{enter}' ,'USD{enter}' ,email)
        newRecipient.addBankDetails('MT84MALT011000012345MTLCAST001S','IESCMTM1XXX')
        cy.get('.ant-space > :nth-child(2) > .ant-card > .ant-card-body').should('be.visible').click()
        const bName = batchPayments.generateRandomString(6)
        batchPayments.addBusinessRecipient('BUSINESS USD'+' '+bName,'MALTA{enter}')
        batchPayments.paymentPurposeGBPEUR()
        cy.get('.ant-select-selector').eq(3).click()
        cy.get('.ant-select-dropdown').eq(3).find('.ant-select-item-option-content').then(Element=>{
            let purposeList = Element.text()
            cy.log(purposeList)
            cy.wrap(purposeList).as('purposeList')
        })
        newRecipient.saveRecipient()
        newPayment.checkSettelment('be.disabled','be.enabled')
        newPayment.proceedflow('{downarrow}{enter}','GBP')
        let amount = '125'
        newPayment.addrecipientDetail(amount, email)
                //Validate the selected payment purpose
        cy.get('@selectedValue').then(selectedValue=>{
            cy.get('.ant-col-sm-20 > :nth-child(2) > :nth-child(1) > :nth-child(1) > .ant-row > .ant-col > .ant-form-item-control-input > .ant-form-item-control-input-content > .ant-select > .ant-select-selector')
            .should('be.visible').and('contain.text',selectedValue)
        })
         //Validate Purpose on batch payment
        cy.get('.ant-select-selector').eq(2).click()
        cy.get('.ant-select-dropdown').eq(1).find('.ant-select-item-option-content').then(Element=>{
            let list = Element.text()
            cy.log(list)
            cy.get('@purposeList').then(purposeList=>{
            expect(list).to.eq(purposeList)
            cy.get('.ant-select-selector').eq(2).click()
        })
          })
       // Validating recipient recived amount
       cy.get(':nth-child(4) > :nth-child(2) > .ant-typography').invoke('text').then((text) => {
        const storedText = text
        cy.wrap(storedText).as('storedText')
        cy.log(storedText)
        })
        cy.get('.ant-col > .ant-btn > span').should('be.visible').click()
        cy.get('.ant-modal-body > :nth-child(1) > .ant-col > .ant-typography').should('be.visible').should('contain.text','Payment Confirmation')
        cy.get('@storedText').then(storedText=>{
            cy.get(':nth-child(5) > .ant-col-8 > .ant-typography')
            .should('be.visible').and('contain.text',storedText)
        })
        cy.get('.ant-row-center.m-t-20 > .ant-col > .ant-space > :nth-child(2) > .ant-btn').should('be.visible').click() // pay recipient
        cy.get('.ant-modal-body > :nth-child(1) > .ant-col').should('be.visible').should('contain.text',' Payment Booked - ')
        cy.get('@storedText').then(storedText=>{
            cy.get(':nth-child(5) > .ant-col-8 > .ant-typography')
            .should('be.visible').and('contain.text',storedText)
        })
        newPayment.validateYapilyFlow()
        //newPayment.cancelEasyTransfer()
    })
    //United State with USD
    //push fund
    it('TC_NP_095 - Add 1 recipient(individual) from the "Add Recipient" page with country = UNITED STATES and currency = USD. After adding, make a single payment to the recipient using GBP and push funds.', function(){
        signin.Login(userName, password)
        newRecipient.goToPaymentsDashborad()
        newRecipient.gotoRecipientList()
        let email = batchPayments.generateRandomString(5)+ '@yopmail.com'
        batchPayments.addRecipient('UNITED STATES{enter}' ,'USD{enter}' ,email)
        newRecipient.addBankDetailsWithAccNo('MMMCUS44','55555555')
        const lName = batchPayments.generateRandomString(6)
        batchPayments.individualRecipient('UNITED STATES USD PF',lName,'UNITED STATES{enter}')
        newRecipient.postCodeStateUS()
        batchPayments.paymentPurposeGBPEUR()
        cy.get('.ant-select-selector').eq(4).click()
        cy.get('.ant-select-dropdown').eq(4).find('.ant-select-item-option-content').then(Element=>{
            let purposeList = Element.text()
            cy.log(purposeList)
            cy.wrap(purposeList).as('purposeList')
        })
        newRecipient.saveRecipient()
        newPayment.checkSettelment('be.disabled','be.enabled')
        newPayment.proceedflow('{downarrow}{enter}','GBP')
        let amount = '125'
        newPayment.addrecipientDetail(amount, email)
        newPayment.selectFundingMethod('Push Funds')

          // ───── Intercept Quote API ─────
  cy.intercept(
            'POST',
            `https://main-api.volopa-dev.com/${Cypress.env("apiEnv")}/exchange/b2b/self/quote/temp`
        ).as('quoteApi');

  // ───── Wait for API and Compare Values ─────
  cy.wait('@quoteApi').then(({ response }) => {
    const receive = response.body.data.receive;
    const recipientReceives = response.body.data.recipient[0].receives;

    cy.wrap(recipientReceives).as('recipientReceives');
    cy.log(`Receive: ${receive}`);
    cy.log(`Recipient Receives: ${recipientReceives}`);

    expect(receive).to.eq(recipientReceives); // Final comparison
  });
             //Validate the selected payment purpose
             cy.get('@selectedValue').then(selectedValue=>{
                cy.get('.ant-col-sm-20 > :nth-child(2) > :nth-child(1) > .ant-form-item > .ant-row > .ant-col > .ant-form-item-control-input > .ant-form-item-control-input-content > .ant-select > .ant-select-selector')
                .should('be.visible').and('contain.text',selectedValue)
            })
         //Validate Purpose on batch payment
        cy.get('.ant-select-selector').eq(2).click()
        cy.get('.ant-select-dropdown').eq(2).find('.ant-select-item-option-content').then(Element=>{
            let list = Element.text()
            cy.log(list)
            cy.get('@purposeList').then(purposeList=>{
            expect(list).to.eq(purposeList)
            cy.get('.ant-select-selector').eq(2).click() 
        })
          })
          // Validating recipient recived amount
          cy.get(':nth-child(4) > :nth-child(2) > .ant-typography').invoke('text').then((text) => {
            const storedText = text
            cy.wrap(storedText).as('storedText')
            cy.log(storedText)
            })
            cy.get('.ant-col > .ant-btn > span').should('be.visible').click()
            cy.get('.ant-modal-body > :nth-child(1) > .ant-col > .ant-typography').should('be.visible').should('contain.text','Payment Confirmation')
            cy.get('@storedText').then(storedText=>{
                cy.get(':nth-child(5) > .ant-col-8 > .ant-typography')
                .should('be.visible').and('contain.text',storedText)
            })
            cy.get('.ant-row-center.m-t-20 > .ant-col > .ant-space > :nth-child(2) > .ant-btn').should('be.visible').click() // pay recipient
            cy.get('.ant-modal-body > :nth-child(1) > .ant-col').should('be.visible').should('contain.text',' Payment Booked - ')
            cy.get('@storedText').then(storedText=>{
                cy.get(':nth-child(5) > .ant-col-8 > .ant-typography')
                .should('be.visible').and('contain.text',storedText)
            })
            //////newPayment.cancelPushFunds()
    })
    it('TC_NP_096 - Add 1 recipient(Business) from the "Add Recipient" page with country = UNITED STATES and currency = USD. After adding, make a single payment to the recipient using GBP and push funds.', function(){
        signin.Login(userName, password)
        newRecipient.goToPaymentsDashborad()
        newRecipient.gotoRecipientList()
        let email = batchPayments.generateRandomString(5)+ '@yopmail.com'
        batchPayments.addRecipient('UNITED STATES{enter}' ,'USD{enter}' ,email)
        newRecipient.addBankDetailsWithAccNo('MMMCUS44','55555555')
        cy.get('.ant-space > :nth-child(2) > .ant-card > .ant-card-body').should('be.visible').click()
        const bName = batchPayments.generateRandomString(6)
        batchPayments.addBusinessRecipient('BUSINESS UNITED STATES USD'+' '+bName,'UNITED STATES{enter}')
        newRecipient.postCodeStateUS()
        batchPayments.paymentPurposeGBPEUR()
        cy.get('.ant-select-selector').eq(4).click()
        cy.get('.ant-select-dropdown').eq(4).find('.ant-select-item-option-content').then(Element=>{
            let purposeList = Element.text()
            cy.log(purposeList)
            cy.wrap(purposeList).as('purposeList')
        })
        newRecipient.saveRecipient()
        newPayment.checkSettelment('be.disabled','be.enabled')
        newPayment.proceedflow('{downarrow}{enter}','GBP')
        let amount = '125'
        newPayment.addrecipientDetail(amount, email)
        newPayment.selectFundingMethod('Push Funds')

          // ───── Intercept Quote API ─────
  cy.intercept(
            'POST',
            `https://main-api.volopa-dev.com/${Cypress.env("apiEnv")}/exchange/b2b/self/quote/temp`
        ).as('quoteApi');

  // ───── Wait for API and Compare Values ─────
  cy.wait('@quoteApi').then(({ response }) => {
    const receive = response.body.data.receive;
    const recipientReceives = response.body.data.recipient[0].receives;

    cy.wrap(recipientReceives).as('recipientReceives');
    cy.log(`Receive: ${receive}`);
    cy.log(`Recipient Receives: ${recipientReceives}`);

    expect(receive).to.eq(recipientReceives); // Final comparison
  });
             //Validate the selected payment purpose
             cy.get('@selectedValue').then(selectedValue=>{
                cy.get('.ant-col-sm-20 > :nth-child(2) > :nth-child(1) > .ant-form-item > .ant-row > .ant-col > .ant-form-item-control-input > .ant-form-item-control-input-content > .ant-select > .ant-select-selector')
                .should('be.visible').and('contain.text',selectedValue)
            })
         //Validate Purpose on batch payment
        cy.get('.ant-select-selector').eq(2).click()
        cy.get('.ant-select-dropdown').eq(2).find('.ant-select-item-option-content').then(Element=>{
            let list = Element.text()
            cy.log(list)
            cy.get('@purposeList').then(purposeList=>{
            expect(list).to.eq(purposeList)
            cy.get('.ant-select-selector').eq(2).click() 
        })
          })
          // Validating recipient recived amount
          cy.get(':nth-child(4) > :nth-child(2) > .ant-typography').invoke('text').then((text) => {
            const storedText = text
            cy.wrap(storedText).as('storedText')
            cy.log(storedText)
            })
            cy.get('.ant-col > .ant-btn > span').should('be.visible').click()
            cy.get('.ant-modal-body > :nth-child(1) > .ant-col > .ant-typography').should('be.visible').should('contain.text','Payment Confirmation')
            cy.get('@storedText').then(storedText=>{
                cy.get(':nth-child(5) > .ant-col-8 > .ant-typography')
                .should('be.visible').and('contain.text',storedText)
            })
            cy.get('.ant-row-center.m-t-20 > .ant-col > .ant-space > :nth-child(2) > .ant-btn').should('be.visible').click() // pay recipient
            cy.get('.ant-modal-body > :nth-child(1) > .ant-col').should('be.visible').should('contain.text',' Payment Booked - ')
            cy.get('@storedText').then(storedText=>{
                cy.get(':nth-child(5) > .ant-col-8 > .ant-typography')
                .should('be.visible').and('contain.text',storedText)
            })
            //////newPayment.cancelPushFunds()
    })
    //Easy Transfer
    it('TC_NP_097 - Add 1 recipient(individual) from the "Add Recipient" page with country = UNITED STATES and currency = USD. After adding, make a single payment to the recipient using GBP and easy transfer.', function(){
        signin.Login(userName, password)
        newRecipient.goToPaymentsDashborad()
        newRecipient.gotoRecipientList()
        let email = batchPayments.generateRandomString(5)+ '@yopmail.com'
        batchPayments.addRecipient('UNITED STATES{enter}' ,'USD{enter}' ,email)
        newRecipient.addBankDetailsWithAccNo('MMMCUS44','55555555')
        const lName = batchPayments.generateRandomString(6)
        batchPayments.individualRecipient('UNITED STATES USD PF',lName,'UNITED STATES{enter}')
        newRecipient.postCodeState()
        batchPayments.paymentPurposeGBPEUR()
        cy.get('.ant-select-selector').eq(3).click()
        cy.get('.ant-select-dropdown').eq(3).find('.ant-select-item-option-content').then(Element=>{
            let purposeList = Element.text()
            cy.log(purposeList)
            cy.wrap(purposeList).as('purposeList')
        })
        newRecipient.saveRecipient()
        newPayment.checkSettelment('be.disabled','be.enabled')
        newPayment.proceedflow('{downarrow}{enter}','GBP')
        let amount = '125'
        newPayment.addrecipientDetail(amount, email)
             //Validate the selected payment purpose
             cy.get('@selectedValue').then(selectedValue=>{
                cy.get('.ant-col-sm-20 > :nth-child(2) > :nth-child(1) > :nth-child(1) > .ant-row > .ant-col > .ant-form-item-control-input > .ant-form-item-control-input-content > .ant-select > .ant-select-selector')
                .should('be.visible').and('contain.text',selectedValue)
            })
          //Validate the selected payment purpose
        cy.get('@selectedValue').then(selectedValue=>{
        cy.get('.ant-col-sm-20 > :nth-child(2) > :nth-child(1) > :nth-child(1) > .ant-row > .ant-col > .ant-form-item-control-input > .ant-form-item-control-input-content > .ant-select > .ant-select-selector')
        .should('be.visible').and('contain.text',selectedValue)
        })
         //Validate Purpose on batch payment
        cy.get('.ant-select-selector').eq(2).click()
        cy.get('.ant-select-dropdown').eq(1).find('.ant-select-item-option-content').then(Element=>{
            let list = Element.text()
            cy.log(list)
            cy.get('@purposeList').then(purposeList=>{
            expect(list).to.eq(purposeList)
            cy.get('.ant-select-selector').eq(2).click() 
        })
          })
          // Validating recipient recived amount
          cy.get(':nth-child(4) > :nth-child(2) > .ant-typography').invoke('text').then((text) => {
            const storedText = text
            cy.wrap(storedText).as('storedText')
            cy.log(storedText)
            })
            cy.get('.ant-col > .ant-btn > span').should('be.visible').click()
            cy.get('.ant-modal-body > :nth-child(1) > .ant-col > .ant-typography').should('be.visible').should('contain.text','Payment Confirmation')
            cy.get('@storedText').then(storedText=>{
                cy.get(':nth-child(5) > .ant-col-8 > .ant-typography')
                .should('be.visible').and('contain.text',storedText)
            })
            cy.get('.ant-row-center.m-t-20 > .ant-col > .ant-space > :nth-child(2) > .ant-btn').should('be.visible').click() // pay recipient
            cy.get('.ant-modal-body > :nth-child(1) > .ant-col').should('be.visible').should('contain.text',' Payment Booked - ')
            cy.get('@storedText').then(storedText=>{
                cy.get(':nth-child(5) > .ant-col-8 > .ant-typography')
                .should('be.visible').and('contain.text',storedText)
            })
            newPayment.validateYapilyFlow()
            //newPayment.cancelEasyTransfer()
    })
    it('TC_NP_098 - Add 1 recipient(Business) from the "Add Recipient" page with country = UNITED STATES and currency = USD. After adding, make a single payment to the recipient using GBP and Easy transfer.', function(){
        signin.Login(userName, password)
        newRecipient.goToPaymentsDashborad()
        newRecipient.gotoRecipientList()
        let email = batchPayments.generateRandomString(5)+ '@yopmail.com'
        batchPayments.addRecipient('UNITED STATES{enter}' ,'USD{enter}' ,email)
        newRecipient.addBankDetailsWithAccNo('MMMCUS44','55555555')
        cy.get('.ant-space > :nth-child(2) > .ant-card > .ant-card-body').should('be.visible').click()
        const bName = batchPayments.generateRandomString(6)
        batchPayments.addBusinessRecipient('BUSINESS UNITED STATES USD'+' '+bName,'UNITED STATES{enter}')
        newRecipient.postCodeState()
        batchPayments.paymentPurposeGBPEUR()
        cy.get('.ant-select-selector').eq(3).click()
        cy.get('.ant-select-dropdown').eq(3).find('.ant-select-item-option-content').then(Element=>{
            let purposeList = Element.text()
            cy.log(purposeList)
            cy.wrap(purposeList).as('purposeList')
        })
        newRecipient.saveRecipient()
        newPayment.checkSettelment('be.disabled','be.enabled')
        newPayment.proceedflow('{downarrow}{enter}','GBP')
        let amount = '125'
        newPayment.addrecipientDetail(amount, email)
             //Validate the selected payment purpose
             cy.get('@selectedValue').then(selectedValue=>{
                cy.get('.ant-col-sm-20 > :nth-child(2) > :nth-child(1) > :nth-child(1) > .ant-row > .ant-col > .ant-form-item-control-input > .ant-form-item-control-input-content > .ant-select > .ant-select-selector')
                .should('be.visible').and('contain.text',selectedValue)
            })
          //Validate the selected payment purpose
        cy.get('@selectedValue').then(selectedValue=>{
        cy.get('.ant-col-sm-20 > :nth-child(2) > :nth-child(1) > :nth-child(1) > .ant-row > .ant-col > .ant-form-item-control-input > .ant-form-item-control-input-content > .ant-select > .ant-select-selector')
        .should('be.visible').and('contain.text',selectedValue)
        })
         //Validate Purpose on batch payment
        cy.get('.ant-select-selector').eq(2).click()
        cy.get('.ant-select-dropdown').eq(1).find('.ant-select-item-option-content').then(Element=>{
            let list = Element.text()
            cy.log(list)
            cy.get('@purposeList').then(purposeList=>{
            expect(list).to.eq(purposeList)
            cy.get('.ant-select-selector').eq(2).click() 
        })
          })
          // Validating recipient recived amount
          cy.get(':nth-child(4) > :nth-child(2) > .ant-typography').invoke('text').then((text) => {
            const storedText = text
            cy.wrap(storedText).as('storedText')
            cy.log(storedText)
            })
            cy.get('.ant-col > .ant-btn > span').should('be.visible').click()
            cy.get('.ant-modal-body > :nth-child(1) > .ant-col > .ant-typography').should('be.visible').should('contain.text','Payment Confirmation')
            cy.get('@storedText').then(storedText=>{
                cy.get(':nth-child(5) > .ant-col-8 > .ant-typography')
                .should('be.visible').and('contain.text',storedText)
            })
            cy.get('.ant-row-center.m-t-20 > .ant-col > .ant-space > :nth-child(2) > .ant-btn').should('be.visible').click() // pay recipient
            cy.get('.ant-modal-body > :nth-child(1) > .ant-col').should('be.visible').should('contain.text',' Payment Booked - ')
            cy.get('@storedText').then(storedText=>{
                cy.get(':nth-child(5) > .ant-col-8 > .ant-typography')
                .should('be.visible').and('contain.text',storedText)
            })
            newPayment.validateYapilyFlow()
            //newPayment.cancelEasyTransfer()
    })
    //UNITED KINGDOM with USD
    //push fund
    it('TC_NP_099 - Add 1 recipient(individual) from the "Add Recipient" page with country = UNITED KINGDOM and currency = USD. After adding, make a single payment to the recipient using GBP and push funds.', function(){
        signin.Login(userName, password)
        newRecipient.goToPaymentsDashborad()
        newRecipient.gotoRecipientList()
        let email = batchPayments.generateRandomString(5)+ '@yopmail.com'
        batchPayments.addRecipient('UNITED KINGDOM{enter}' ,'USD{enter}' ,email)
        newRecipient.addBankDetails('GB73BARC20039538243547','AFFLGB22')
        const lName = batchPayments.generateRandomString(6)
        batchPayments.individualRecipient('INDIVIDUAL PF',lName,'UNITED KINGDOM{enter}')
        batchPayments.paymentPurposeGBPEUR()
        cy.get('.ant-select-selector').eq(3).click()
        cy.get('.ant-select-dropdown').eq(3).find('.ant-select-item-option-content').then(Element=>{
            let purposeList = Element.text()
            cy.log(purposeList)
            cy.wrap(purposeList).as('purposeList')
        })
        newRecipient.saveRecipient()
        newPayment.checkSettelment('be.disabled','be.enabled')
        newPayment.proceedflow('{downarrow}{enter}','GBP')
        let amount = '125'
        newPayment.addrecipientDetail(amount, email)
        newPayment.selectFundingMethod('Push Funds')

          // ───── Intercept Quote API ─────
  cy.intercept(
            'POST',
            `https://main-api.volopa-dev.com/${Cypress.env("apiEnv")}/exchange/b2b/self/quote/temp`
        ).as('quoteApi');

  // ───── Wait for API and Compare Values ─────
  cy.wait('@quoteApi').then(({ response }) => {
    const receive = response.body.data.receive;
    const recipientReceives = response.body.data.recipient[0].receives;

    cy.wrap(recipientReceives).as('recipientReceives');
    cy.log(`Receive: ${receive}`);
    cy.log(`Recipient Receives: ${recipientReceives}`);

    expect(receive).to.eq(recipientReceives); // Final comparison
  });
             //Validate the selected payment purpose
             cy.get('@selectedValue').then(selectedValue=>{
                cy.get('.ant-col-sm-20 > :nth-child(2) > :nth-child(1) > .ant-form-item > .ant-row > .ant-col > .ant-form-item-control-input > .ant-form-item-control-input-content > .ant-select > .ant-select-selector')
                .should('be.visible').and('contain.text',selectedValue)
            })
         //Validate Purpose on batch payment
        cy.get('.ant-select-selector').eq(2).click()
        cy.get('.ant-select-dropdown').eq(2).find('.ant-select-item-option-content').then(Element=>{
            let list = Element.text()
            cy.log(list)
            cy.get('@purposeList').then(purposeList=>{
            expect(list).to.eq(purposeList)
            cy.get('.ant-select-selector').eq(2).click() 
        })
          })
          // Validating recipient recived amount
          cy.get(':nth-child(4) > :nth-child(2) > .ant-typography').invoke('text').then((text) => {
            const storedText = text
            cy.wrap(storedText).as('storedText')
            cy.log(storedText)
            })
            cy.get('.ant-col > .ant-btn > span').should('be.visible').click()
            cy.get('.ant-modal-body > :nth-child(1) > .ant-col > .ant-typography').should('be.visible').should('contain.text','Payment Confirmation')
            cy.get('@storedText').then(storedText=>{
                cy.get(':nth-child(5) > .ant-col-8 > .ant-typography')
                .should('be.visible').and('contain.text',storedText)
            })
            cy.get('.ant-row-center.m-t-20 > .ant-col > .ant-space > :nth-child(2) > .ant-btn').should('be.visible').click() // pay recipient
            cy.get('.ant-modal-body > :nth-child(1) > .ant-col').should('be.visible').should('contain.text',' Payment Booked - ')
            cy.get('@storedText').then(storedText=>{
                cy.get(':nth-child(5) > .ant-col-8 > .ant-typography')
                .should('be.visible').and('contain.text',storedText)
            })
            //////newPayment.cancelPushFunds()
    })
    it('TC_NP_100 - Add 1 recipient(Business) from the "Add Recipient" page with country = UNITED KINGDOM and currency = USD. After adding, make a single payment to the recipient using GBP and push funds.', function(){
        signin.Login(userName, password)
        newRecipient.goToPaymentsDashborad()
        newRecipient.gotoRecipientList()
        let email = batchPayments.generateRandomString(5)+ '@yopmail.com'
        batchPayments.addRecipient('UNITED KINGDOM{enter}' ,'USD{enter}' ,email)
        newRecipient.addBankDetails('GB73BARC20039538243547','AFFLGB22')
        cy.get('.ant-space > :nth-child(2) > .ant-card > .ant-card-body').should('be.visible').click()
        const bName = batchPayments.generateRandomString(6)
        batchPayments.addBusinessRecipient('BUSINESS PF'+' '+bName,'UNITED KINGDOM{enter}')
        batchPayments.paymentPurposeGBPEUR()
        cy.get('.ant-select-selector').eq(3).click()
        cy.get('.ant-select-dropdown').eq(3).find('.ant-select-item-option-content').then(Element=>{
            let purposeList = Element.text()
            cy.log(purposeList)
            cy.wrap(purposeList).as('purposeList')
        })
        newRecipient.saveRecipient()
        newPayment.checkSettelment('be.disabled','be.enabled')
        newPayment.proceedflow('{downarrow}{enter}','GBP')
        let amount = '125'
        newPayment.addrecipientDetail(amount, email)
        newPayment.selectFundingMethod('Push Funds')

          // ───── Intercept Quote API ─────
  cy.intercept(
            'POST',
            `https://main-api.volopa-dev.com/${Cypress.env("apiEnv")}/exchange/b2b/self/quote/temp`
        ).as('quoteApi');

  // ───── Wait for API and Compare Values ─────
  cy.wait('@quoteApi').then(({ response }) => {
    const receive = response.body.data.receive;
    const recipientReceives = response.body.data.recipient[0].receives;

    cy.wrap(recipientReceives).as('recipientReceives');
    cy.log(`Receive: ${receive}`);
    cy.log(`Recipient Receives: ${recipientReceives}`);

    expect(receive).to.eq(recipientReceives); // Final comparison
  });
             //Validate the selected payment purpose
             cy.get('@selectedValue').then(selectedValue=>{
                cy.get('.ant-col-sm-20 > :nth-child(2) > :nth-child(1) > .ant-form-item > .ant-row > .ant-col > .ant-form-item-control-input > .ant-form-item-control-input-content > .ant-select > .ant-select-selector')
                .should('be.visible').and('contain.text',selectedValue)
            })
         //Validate Purpose on batch payment
        cy.get('.ant-select-selector').eq(2).click()
        cy.get('.ant-select-dropdown').eq(2).find('.ant-select-item-option-content').then(Element=>{
            let list = Element.text()
            cy.log(list)
            cy.get('@purposeList').then(purposeList=>{
            expect(list).to.eq(purposeList)
            cy.get('.ant-select-selector').eq(2).click() 
        })
          })
          // Validating recipient recived amount
          cy.get(':nth-child(4) > :nth-child(2) > .ant-typography').invoke('text').then((text) => {
            const storedText = text
            cy.wrap(storedText).as('storedText')
            cy.log(storedText)
            })
            cy.get('.ant-col > .ant-btn > span').should('be.visible').click()
            cy.get('.ant-modal-body > :nth-child(1) > .ant-col > .ant-typography').should('be.visible').should('contain.text','Payment Confirmation')
            cy.get('@storedText').then(storedText=>{
                cy.get(':nth-child(5) > .ant-col-8 > .ant-typography')
                .should('be.visible').and('contain.text',storedText)
            })
            cy.get('.ant-row-center.m-t-20 > .ant-col > .ant-space > :nth-child(2) > .ant-btn').should('be.visible').click() // pay recipient
            cy.get('.ant-modal-body > :nth-child(1) > .ant-col').should('be.visible').should('contain.text',' Payment Booked - ')
            cy.get('@storedText').then(storedText=>{
                cy.get(':nth-child(5) > .ant-col-8 > .ant-typography')
                .should('be.visible').and('contain.text',storedText)
            })
            //////newPayment.cancelPushFunds()
    })
    //Easy Transfer
    it('TC_NP_101 - Add 1 recipient(individual) from the "Add Recipient" page with country = UNITED KINGDOM and currency = USD. After adding, make a single payment to the recipient using GBP and Easy transfer.', function(){
        signin.Login(userName, password)
        newRecipient.goToPaymentsDashborad()
        newRecipient.gotoRecipientList()
        let email = batchPayments.generateRandomString(5)+ '@yopmail.com'
        batchPayments.addRecipient('UNITED KINGDOM{enter}' ,'USD{enter}' ,email)
        newRecipient.addBankDetails('GB73BARC20039538243547','AFFLGB22')
        const lName = batchPayments.generateRandomString(6)
        batchPayments.individualRecipient('INDIVIDUAL PF',lName,'UNITED KINGDOM{enter}')
        batchPayments.paymentPurposeGBPEUR()
        cy.get('.ant-select-selector').eq(3).click()
        cy.get('.ant-select-dropdown').eq(3).find('.ant-select-item-option-content').then(Element=>{
            let purposeList = Element.text()
            cy.log(purposeList)
            cy.wrap(purposeList).as('purposeList')
        })
        newRecipient.saveRecipient()
        newPayment.checkSettelment('be.disabled','be.enabled')
        newPayment.proceedflow('{downarrow}{enter}','GBP')
        let amount = '125'
        newPayment.addrecipientDetail(amount, email)
             //Validate the selected payment purpose
             cy.get('@selectedValue').then(selectedValue=>{
                cy.get('.ant-col-sm-20 > :nth-child(2) > :nth-child(1) > :nth-child(1) > .ant-row > .ant-col > .ant-form-item-control-input > .ant-form-item-control-input-content > .ant-select > .ant-select-selector')
                .should('be.visible').and('contain.text',selectedValue)
            })
          //Validate the selected payment purpose
        cy.get('@selectedValue').then(selectedValue=>{
        cy.get('.ant-col-sm-20 > :nth-child(2) > :nth-child(1) > :nth-child(1) > .ant-row > .ant-col > .ant-form-item-control-input > .ant-form-item-control-input-content > .ant-select > .ant-select-selector')
        .should('be.visible').and('contain.text',selectedValue)
        })
         //Validate Purpose on batch payment
        cy.get('.ant-select-selector').eq(2).click()
        cy.get('.ant-select-dropdown').eq(1).find('.ant-select-item-option-content').then(Element=>{
            let list = Element.text()
            cy.log(list)
            cy.get('@purposeList').then(purposeList=>{
            expect(list).to.eq(purposeList)
            cy.get('.ant-select-selector').eq(2).click() 
        })
          })
          // Validating recipient recived amount
          cy.get(':nth-child(4) > :nth-child(2) > .ant-typography').invoke('text').then((text) => {
            const storedText = text
            cy.wrap(storedText).as('storedText')
            cy.log(storedText)
            })
            cy.get('.ant-col > .ant-btn > span').should('be.visible').click()
            cy.get('.ant-modal-body > :nth-child(1) > .ant-col > .ant-typography').should('be.visible').should('contain.text','Payment Confirmation')
            cy.get('@storedText').then(storedText=>{
                cy.get(':nth-child(5) > .ant-col-8 > .ant-typography')
                .should('be.visible').and('contain.text',storedText)
            })
            cy.get('.ant-row-center.m-t-20 > .ant-col > .ant-space > :nth-child(2) > .ant-btn').should('be.visible').click() // pay recipient
            cy.get('.ant-modal-body > :nth-child(1) > .ant-col').should('be.visible').should('contain.text',' Payment Booked - ')
            cy.get('@storedText').then(storedText=>{
                cy.get(':nth-child(5) > .ant-col-8 > .ant-typography')
                .should('be.visible').and('contain.text',storedText)
            })
            newPayment.validateYapilyFlow()
            //newPayment.cancelEasyTransfer()
    })
    it('TC_NP_102 - Add 1 recipient(Business) from the "Add Recipient" page with country = UNITED KINGDOM and currency = USD. After adding, make a single payment to the recipient using GBP and Easy transfer..', function(){
        signin.Login(userName, password)
        newRecipient.goToPaymentsDashborad()
        newRecipient.gotoRecipientList()
        let email = batchPayments.generateRandomString(5)+ '@yopmail.com'
        batchPayments.addRecipient('UNITED KINGDOM{enter}' ,'USD{enter}' ,email)
        newRecipient.addBankDetails('GB73BARC20039538243547','AFFLGB22')
        cy.get('.ant-space > :nth-child(2) > .ant-card > .ant-card-body').should('be.visible').click()
        const bName = batchPayments.generateRandomString(6)
        batchPayments.addBusinessRecipient('BUSINESS PF'+' '+bName,'UNITED KINGDOM{enter}')
        batchPayments.paymentPurposeGBPEUR()
        cy.get('.ant-select-selector').eq(3).click()
        cy.get('.ant-select-dropdown').eq(3).find('.ant-select-item-option-content').then(Element=>{
            let purposeList = Element.text()
            cy.log(purposeList)
            cy.wrap(purposeList).as('purposeList')
        })
        newRecipient.saveRecipient()
        newPayment.checkSettelment('be.disabled','be.enabled')
        newPayment.proceedflow('{downarrow}{enter}','GBP')
        let amount = '125'
        newPayment.addrecipientDetail(amount, email)
             //Validate the selected payment purpose
             cy.get('@selectedValue').then(selectedValue=>{
                cy.get('.ant-col-sm-20 > :nth-child(2) > :nth-child(1) > :nth-child(1) > .ant-row > .ant-col > .ant-form-item-control-input > .ant-form-item-control-input-content > .ant-select > .ant-select-selector')
                .should('be.visible').and('contain.text',selectedValue)
            })
          //Validate the selected payment purpose
        cy.get('@selectedValue').then(selectedValue=>{
        cy.get('.ant-col-sm-20 > :nth-child(2) > :nth-child(1) > :nth-child(1) > .ant-row > .ant-col > .ant-form-item-control-input > .ant-form-item-control-input-content > .ant-select > .ant-select-selector')
        .should('be.visible').and('contain.text',selectedValue)
        })
         //Validate Purpose on batch payment
        cy.get('.ant-select-selector').eq(2).click()
        cy.get('.ant-select-dropdown').eq(1).find('.ant-select-item-option-content').then(Element=>{
            let list = Element.text()
            cy.log(list)
            cy.get('@purposeList').then(purposeList=>{
            expect(list).to.eq(purposeList)
            cy.get('.ant-select-selector').eq(2).click() 
        })
          })
          // Validating recipient recived amount
          cy.get(':nth-child(4) > :nth-child(2) > .ant-typography').invoke('text').then((text) => {
            const storedText = text
            cy.wrap(storedText).as('storedText')
            cy.log(storedText)
            })
            cy.get('.ant-col > .ant-btn > span').should('be.visible').click()
            cy.get('.ant-modal-body > :nth-child(1) > .ant-col > .ant-typography').should('be.visible').should('contain.text','Payment Confirmation')
            cy.get('@storedText').then(storedText=>{
                cy.get(':nth-child(5) > .ant-col-8 > .ant-typography')
                .should('be.visible').and('contain.text',storedText)
            })
            cy.get('.ant-row-center.m-t-20 > .ant-col > .ant-space > :nth-child(2) > .ant-btn').should('be.visible').click() // pay recipient
            cy.get('.ant-modal-body > :nth-child(1) > .ant-col').should('be.visible').should('contain.text',' Payment Booked - ')
            cy.get('@storedText').then(storedText=>{
                cy.get(':nth-child(5) > .ant-col-8 > .ant-typography')
                .should('be.visible').and('contain.text',storedText)
            })
            newPayment.validateYapilyFlow()
            //newPayment.cancelEasyTransfer()
    })
    //China with USD
    //push fund
    it('TC_NP_103 - Add 1 recipient(individual) from the "Add Recipient" page with country = CHINA and currency = USD. After adding, make a single payment to the recipient using GBP and push funds.', function(){
        signin.Login(userName, password)
        newRecipient.goToPaymentsDashborad()
        newRecipient.gotoRecipientList()
        let email = batchPayments.generateRandomString(5)+ '@yopmail.com'
        batchPayments.addRecipient('CHINA{enter}' ,'USD{enter}' ,email)
        newRecipient.addBankDetailsWithAccNo('AYCLCNBY','55555555')
        const lName = batchPayments.generateRandomString(6)
        batchPayments.individualRecipient('INDIVIDUAL PF',lName,'CHINA{enter}')
        batchPayments.paymentPurposeGBPEUR()
        cy.get('.ant-select-selector').eq(3).click()
        cy.get('.ant-select-dropdown').eq(3).find('.ant-select-item-option-content').then(Element=>{
            let purposeList = Element.text()
            cy.log(purposeList)
            cy.wrap(purposeList).as('purposeList')
        })
        newRecipient.saveRecipient()
        newPayment.checkSettelment('be.disabled','be.enabled')
        newPayment.proceedflow('{downarrow}{enter}','GBP')
        let amount = '125'
        newPayment.addrecipientDetail(amount, email)
        newPayment.selectFundingMethod('Push Funds')

          // ───── Intercept Quote API ─────
  cy.intercept(
            'POST',
            `https://main-api.volopa-dev.com/${Cypress.env("apiEnv")}/exchange/b2b/self/quote/temp`
        ).as('quoteApi');

  // ───── Wait for API and Compare Values ─────
  cy.wait('@quoteApi').then(({ response }) => {
    const receive = response.body.data.receive;
    const recipientReceives = response.body.data.recipient[0].receives;

    cy.wrap(recipientReceives).as('recipientReceives');
    cy.log(`Receive: ${receive}`);
    cy.log(`Recipient Receives: ${recipientReceives}`);

    expect(receive).to.eq(recipientReceives); // Final comparison
  });
             //Validate the selected payment purpose
             cy.get('@selectedValue').then(selectedValue=>{
                cy.get('.ant-col-sm-20 > :nth-child(2) > :nth-child(1) > .ant-form-item > .ant-row > .ant-col > .ant-form-item-control-input > .ant-form-item-control-input-content > .ant-select > .ant-select-selector')
                .should('be.visible').and('contain.text',selectedValue)
            })

         //Validate Purpose on batch payment
        cy.get('.ant-select-selector').eq(2).click()
        cy.get('.ant-select-dropdown').eq(2).find('.ant-select-item-option-content').then(Element=>{
            let list = Element.text()
            cy.log(list)
            cy.get('@purposeList').then(purposeList=>{
            expect(list).to.eq(purposeList)
            cy.get('.ant-select-selector').eq(2).click() 
        })
          })
          // Validating recipient recived amount
          cy.get(':nth-child(4) > :nth-child(2) > .ant-typography').invoke('text').then((text) => {
            const storedText = text
            cy.wrap(storedText).as('storedText')
            cy.log(storedText)
            })
            cy.get('.ant-col > .ant-btn > span').should('be.visible').click()
            cy.get('.ant-modal-body > :nth-child(1) > .ant-col > .ant-typography').should('be.visible').should('contain.text','Payment Confirmation')
            cy.get('@storedText').then(storedText=>{
                cy.get(':nth-child(5) > .ant-col-8 > .ant-typography')
                .should('be.visible').and('contain.text',storedText)
            })
            cy.get('.ant-row-center.m-t-20 > .ant-col > .ant-space > :nth-child(2) > .ant-btn').should('be.visible').click() // pay recipient
            cy.get('.ant-modal-body > :nth-child(1) > .ant-col').should('be.visible').should('contain.text',' Payment Booked - ')
            cy.get('@storedText').then(storedText=>{
                cy.get(':nth-child(5) > .ant-col-8 > .ant-typography')
                .should('be.visible').and('contain.text',storedText)
            })
            //////newPayment.cancelPushFunds()
    })
    it('TC_NP_104 - Add 1 recipient(Business) from the "Add Recipient" page with country = CHINAand currency = USD. After adding, make a single payment to the recipient using GBP and push funds.', function(){
        signin.Login(userName, password)
        newRecipient.goToPaymentsDashborad()
        newRecipient.gotoRecipientList()
        let email = batchPayments.generateRandomString(5)+ '@yopmail.com'
        batchPayments.addRecipient('CHINA{enter}' ,'USD{enter}' ,email)
        newRecipient.addBankDetailsWithAccNo('AYCLCNBY','55555555')
        cy.get('.ant-space > :nth-child(2) > .ant-card > .ant-card-body').should('be.visible').click()
        const bName = batchPayments.generateRandomString(6)
        batchPayments.addBusinessRecipient('BUSINESS ET'+' '+bName,'CHINA{enter}')
        batchPayments.paymentPurposeGBPEUR()
        cy.get('.ant-select-selector').eq(3).click()
        cy.get('.ant-select-dropdown').eq(3).find('.ant-select-item-option-content').then(Element=>{
            let purposeList = Element.text()
            cy.log(purposeList)
            cy.wrap(purposeList).as('purposeList')
        })
        newRecipient.saveRecipient()
        newPayment.checkSettelment('be.disabled','be.enabled')
        newPayment.proceedflow('{downarrow}{enter}','GBP')
        let amount = '125'
        newPayment.addrecipientDetail(amount, email)
        newPayment.selectFundingMethod('Push Funds')

          // ───── Intercept Quote API ─────
  cy.intercept(
            'POST',
            `https://main-api.volopa-dev.com/${Cypress.env("apiEnv")}/exchange/b2b/self/quote/temp`
        ).as('quoteApi');

  // ───── Wait for API and Compare Values ─────
  cy.wait('@quoteApi').then(({ response }) => {
    const receive = response.body.data.receive;
    const recipientReceives = response.body.data.recipient[0].receives;

    cy.wrap(recipientReceives).as('recipientReceives');
    cy.log(`Receive: ${receive}`);
    cy.log(`Recipient Receives: ${recipientReceives}`);

    expect(receive).to.eq(recipientReceives); // Final comparison
  });
             //Validate the selected payment purpose
             cy.get('@selectedValue').then(selectedValue=>{
                cy.get('.ant-col-sm-20 > :nth-child(2) > :nth-child(1) > .ant-form-item > .ant-row > .ant-col > .ant-form-item-control-input > .ant-form-item-control-input-content > .ant-select > .ant-select-selector')
                .should('be.visible').and('contain.text',selectedValue)
            })
         //Validate Purpose on batch payment
        cy.get('.ant-select-selector').eq(2).click()
        cy.get('.ant-select-dropdown').eq(2).find('.ant-select-item-option-content').then(Element=>{
            let list = Element.text()
            cy.log(list)
            cy.get('@purposeList').then(purposeList=>{
            expect(list).to.eq(purposeList)
            cy.get('.ant-select-selector').eq(2).click() 
        })
          })
          // Validating recipient recived amount
          cy.get(':nth-child(4) > :nth-child(2) > .ant-typography').invoke('text').then((text) => {
            const storedText = text
            cy.wrap(storedText).as('storedText')
            cy.log(storedText)
            })
            cy.get('.ant-col > .ant-btn > span').should('be.visible').click()
            cy.get('.ant-modal-body > :nth-child(1) > .ant-col > .ant-typography').should('be.visible').should('contain.text','Payment Confirmation')
            cy.get('@storedText').then(storedText=>{
                cy.get(':nth-child(5) > .ant-col-8 > .ant-typography')
                .should('be.visible').and('contain.text',storedText)
            })
            cy.get('.ant-row-center.m-t-20 > .ant-col > .ant-space > :nth-child(2) > .ant-btn').should('be.visible').click() // pay recipient
            cy.get('.ant-modal-body > :nth-child(1) > .ant-col').should('be.visible').should('contain.text',' Payment Booked - ')
            cy.get('@storedText').then(storedText=>{
                cy.get(':nth-child(5) > .ant-col-8 > .ant-typography')
                .should('be.visible').and('contain.text',storedText)
            })
            //////newPayment.cancelPushFunds()
    })
    //Easy Transfer
    it('TC_NP_105 - Add 1 recipient(individual) from the "Add Recipient" page with country = CHINA and currency = USD. After adding, make a single payment to the recipient using GBP and Easy transfer.', function(){
        signin.Login(userName, password)
        newRecipient.goToPaymentsDashborad()
        newRecipient.gotoRecipientList()
        let email = batchPayments.generateRandomString(5)+ '@yopmail.com'
        batchPayments.addRecipient('CHINA{enter}' ,'USD{enter}' ,email)
        newRecipient.addBankDetailsWithAccNo('AYCLCNBY','55555555')
        const lName = batchPayments.generateRandomString(6)
        batchPayments.individualRecipient('INDIVIDUAL PF',lName,'CHINA{enter}')
        batchPayments.paymentPurposeGBPEUR()
        cy.get('.ant-select-selector').eq(3).click()
        cy.get('.ant-select-dropdown').eq(3).find('.ant-select-item-option-content').then(Element=>{
            let purposeList = Element.text()
            cy.log(purposeList)
            cy.wrap(purposeList).as('purposeList')
        })
        newRecipient.saveRecipient()
        newPayment.checkSettelment('be.disabled','be.enabled')
        newPayment.proceedflow('{downarrow}{enter}','GBP')
        let amount = '125'
        newPayment.addrecipientDetail(amount, email)
             //Validate the selected payment purpose
             cy.get('@selectedValue').then(selectedValue=>{
                cy.get('.ant-col-sm-20 > :nth-child(2) > :nth-child(1) > :nth-child(1) > .ant-row > .ant-col > .ant-form-item-control-input > .ant-form-item-control-input-content > .ant-select > .ant-select-selector')
                .should('be.visible').and('contain.text',selectedValue)
            })
          //Validate the selected payment purpose
        cy.get('@selectedValue').then(selectedValue=>{
        cy.get('.ant-col-sm-20 > :nth-child(2) > :nth-child(1) > :nth-child(1) > .ant-row > .ant-col > .ant-form-item-control-input > .ant-form-item-control-input-content > .ant-select > .ant-select-selector')
        .should('be.visible').and('contain.text',selectedValue)
        })
         //Validate Purpose on batch payment
        cy.get('.ant-select-selector').eq(2).click()
        cy.get('.ant-select-dropdown').eq(1).find('.ant-select-item-option-content').then(Element=>{
            let list = Element.text()
            cy.log(list)
            cy.get('@purposeList').then(purposeList=>{
            expect(list).to.eq(purposeList)
            cy.get('.ant-select-selector').eq(2).click() 
        })
          })
          // Validating recipient recived amount
          cy.get(':nth-child(4) > :nth-child(2) > .ant-typography').invoke('text').then((text) => {
            const storedText = text
            cy.wrap(storedText).as('storedText')
            cy.log(storedText)
            })
            cy.get('.ant-col > .ant-btn > span').should('be.visible').click()
            cy.get('.ant-modal-body > :nth-child(1) > .ant-col > .ant-typography').should('be.visible').should('contain.text','Payment Confirmation')
            cy.get('@storedText').then(storedText=>{
                cy.get(':nth-child(5) > .ant-col-8 > .ant-typography')
                .should('be.visible').and('contain.text',storedText)
            })
            cy.get('.ant-row-center.m-t-20 > .ant-col > .ant-space > :nth-child(2) > .ant-btn').should('be.visible').click() // pay recipient
            cy.get('.ant-modal-body > :nth-child(1) > .ant-col').should('be.visible').should('contain.text',' Payment Booked - ')
            cy.get('@storedText').then(storedText=>{
                cy.get(':nth-child(5) > .ant-col-8 > .ant-typography')
                .should('be.visible').and('contain.text',storedText)
            })
            newPayment.validateYapilyFlow()
            //newPayment.cancelEasyTransfer()
    })
    it('TC_NP_106 - Add 1 recipient(Business) from the "Add Recipient" page with country = CHINA and currency = USD. After adding, make a single payment to the recipient using GBP and Easy transfer..', function(){
        signin.Login(userName, password)
        newRecipient.goToPaymentsDashborad()
        newRecipient.gotoRecipientList()
        let email = batchPayments.generateRandomString(5)+ '@yopmail.com'
        batchPayments.addRecipient('CHINA{enter}' ,'USD{enter}' ,email)
        newRecipient.addBankDetailsWithAccNo('AYCLCNBY','55555555')
        cy.get('.ant-space > :nth-child(2) > .ant-card > .ant-card-body').should('be.visible').click()
        const bName = batchPayments.generateRandomString(6)
        batchPayments.addBusinessRecipient('BUSINESS ET'+' '+bName,'CHINA{enter}')
        batchPayments.paymentPurposeGBPEUR()
        cy.get('.ant-select-selector').eq(3).click()
        cy.get('.ant-select-dropdown').eq(3).find('.ant-select-item-option-content').then(Element=>{
            let purposeList = Element.text()
            cy.log(purposeList)
            cy.wrap(purposeList).as('purposeList')
        })
        newRecipient.saveRecipient()
        newPayment.checkSettelment('be.disabled','be.enabled')
        newPayment.proceedflow('{downarrow}{enter}','GBP')
        let amount = '125'
        newPayment.addrecipientDetail(amount, email)
             //Validate the selected payment purpose
             cy.get('@selectedValue').then(selectedValue=>{
                cy.get('.ant-col-sm-20 > :nth-child(2) > :nth-child(1) > :nth-child(1) > .ant-row > .ant-col > .ant-form-item-control-input > .ant-form-item-control-input-content > .ant-select > .ant-select-selector')
                .should('be.visible').and('contain.text',selectedValue)
            })
          //Validate the selected payment purpose
        cy.get('@selectedValue').then(selectedValue=>{
        cy.get('.ant-col-sm-20 > :nth-child(2) > :nth-child(1) > :nth-child(1) > .ant-row > .ant-col > .ant-form-item-control-input > .ant-form-item-control-input-content > .ant-select > .ant-select-selector')
        .should('be.visible').and('contain.text',selectedValue)
        })
         //Validate Purpose on batch payment
        cy.get('.ant-select-selector').eq(2).click()
        cy.get('.ant-select-dropdown').eq(1).find('.ant-select-item-option-content').then(Element=>{
            let list = Element.text()
            cy.log(list)
            cy.get('@purposeList').then(purposeList=>{
            expect(list).to.eq(purposeList)
            cy.get('.ant-select-selector').eq(2).click() 
        })
          })
          // Validating recipient recived amount
          cy.get(':nth-child(4) > :nth-child(2) > .ant-typography').invoke('text').then((text) => {
            const storedText = text
            cy.wrap(storedText).as('storedText')
            cy.log(storedText)
            })
            cy.get('.ant-col > .ant-btn > span').should('be.visible').click()
            cy.get('.ant-modal-body > :nth-child(1) > .ant-col > .ant-typography').should('be.visible').should('contain.text','Payment Confirmation')
            cy.get('@storedText').then(storedText=>{
                cy.get(':nth-child(5) > .ant-col-8 > .ant-typography')
                .should('be.visible').and('contain.text',storedText)
            })
            cy.get('.ant-row-center.m-t-20 > .ant-col > .ant-space > :nth-child(2) > .ant-btn').should('be.visible').click() // pay recipient
            cy.get('.ant-modal-body > :nth-child(1) > .ant-col').should('be.visible').should('contain.text',' Payment Booked - ')
            cy.get('@storedText').then(storedText=>{
                cy.get(':nth-child(5) > .ant-col-8 > .ant-typography')
                .should('be.visible').and('contain.text',storedText)
            })
            newPayment.validateYapilyFlow()
            //newPayment.cancelEasyTransfer()
    })
    //INDIA with USD
    //push fund
    it('TC_NP_107 - Add 1 recipient(individual) from the "Add Recipient" page with country = INDIA and currency = USD. After adding, make a single payment to the recipient using GBP and push funds.', function(){
        signin.Login(userName, password)
        newRecipient.goToPaymentsDashborad()
        newRecipient.gotoRecipientList()
        let email = batchPayments.generateRandomString(5)+ '@yopmail.com'
        batchPayments.addRecipient('INDIA{downarrow}{enter}' ,'USD{enter}' ,email)
        newRecipient.addBankDetailsWithAccNo('IDIBINBBXXX','55555555')
        const lName = batchPayments.generateRandomString(6)
        batchPayments.individualRecipient('INDIVIDUAL PF',lName,'INDIA{downarrow}{enter}')
        batchPayments.paymentPurposeGBPEUR()
        cy.get('.ant-select-selector').eq(3).click()
        cy.get('.ant-select-dropdown').eq(3).find('.ant-select-item-option-content').then(Element=>{
            let purposeList = Element.text()
            cy.log(purposeList)
            cy.wrap(purposeList).as('purposeList')
        })
        newRecipient.saveRecipient()
        newPayment.checkSettelment('be.disabled','be.enabled')
        newPayment.proceedflow('{downarrow}{enter}','GBP')
        let amount = '125'
        newPayment.addrecipientDetail(amount, email)
        newPayment.selectFundingMethod('Push Funds')

          // ───── Intercept Quote API ─────
  cy.intercept(
            'POST',
            `https://main-api.volopa-dev.com/${Cypress.env("apiEnv")}/exchange/b2b/self/quote/temp`
        ).as('quoteApi');

  // ───── Wait for API and Compare Values ─────
  cy.wait('@quoteApi').then(({ response }) => {
    const receive = response.body.data.receive;
    const recipientReceives = response.body.data.recipient[0].receives;

    cy.wrap(recipientReceives).as('recipientReceives');
    cy.log(`Receive: ${receive}`);
    cy.log(`Recipient Receives: ${recipientReceives}`);

    expect(receive).to.eq(recipientReceives); // Final comparison
  });
          //Validate the selected payment purpose
        cy.get('@selectedValue').then(selectedValue=>{
        cy.get('.ant-col-sm-20 > :nth-child(2) > :nth-child(1) > .ant-form-item > .ant-row > .ant-col > .ant-form-item-control-input > .ant-form-item-control-input-content > .ant-select > .ant-select-selector')
        })
         //Validate Purpose on batch payment
        cy.get('.ant-select-selector').eq(2).click()
        cy.get('.ant-select-dropdown').eq(2).find('.ant-select-item-option-content').then(Element=>{
            let list = Element.text()
            cy.log(list)
            cy.get('@purposeList').then(purposeList=>{
            expect(list).to.eq(purposeList)
            cy.get('.ant-select-selector').eq(2).click() 
        })
          })
          // Validating recipient recived amount
          cy.get(':nth-child(4) > :nth-child(2) > .ant-typography').invoke('text').then((text) => {
            const storedText = text
            cy.wrap(storedText).as('storedText')
            cy.log(storedText)
            })
            cy.get('.ant-col > .ant-btn > span').should('be.visible').click()
            cy.get('.ant-modal-body > :nth-child(1) > .ant-col > .ant-typography').should('be.visible').should('contain.text','Payment Confirmation')
            cy.get('@storedText').then(storedText=>{
                cy.get(':nth-child(5) > .ant-col-8 > .ant-typography')
                .should('be.visible').and('contain.text',storedText)
            })
            cy.get('.ant-row-center.m-t-20 > .ant-col > .ant-space > :nth-child(2) > .ant-btn').should('be.visible').click() // pay recipient
            cy.get('.ant-modal-body > :nth-child(1) > .ant-col').should('be.visible').should('contain.text',' Payment Booked - ')
            cy.get('@storedText').then(storedText=>{
                cy.get(':nth-child(5) > .ant-col-8 > .ant-typography')
                .should('be.visible').and('contain.text',storedText)
            })
            //////newPayment.cancelPushFunds()
    })
    it('TC_NP_108 - Add 1 recipient(Business) from the "Add Recipient" page with country = INDIA and currency = USD. After adding, make a single payment to the recipient using GBP and push funds.', function(){
        signin.Login(userName, password)
        newRecipient.goToPaymentsDashborad()
        newRecipient.gotoRecipientList()
        let email = batchPayments.generateRandomString(5)+ '@yopmail.com'
        batchPayments.addRecipient('INDIA{downarrow}{enter}' ,'USD{enter}' ,email)
        newRecipient.addBankDetailsWithAccNo('IDIBINBBXXX','55555555')
        cy.get('.ant-space > :nth-child(2) > .ant-card > .ant-card-body').should('be.visible').click()
        const bName = batchPayments.generateRandomString(6)
        batchPayments.addBusinessRecipient('BUSINESS PF'+' '+bName,'INDIA{downarrow}{enter}')
        batchPayments.paymentPurposeGBPEUR()
        cy.get('.ant-select-selector').eq(3).click()
        cy.get('.ant-select-dropdown').eq(3).find('.ant-select-item-option-content').then(Element=>{
            let purposeList = Element.text()
            cy.log(purposeList)
            cy.wrap(purposeList).as('purposeList')
        })
        newRecipient.saveRecipient()
        newPayment.checkSettelment('be.disabled','be.enabled')
        newPayment.proceedflow('{downarrow}{enter}','GBP')
        let amount = '125'
        newPayment.addrecipientDetail(amount, email)
        newPayment.selectFundingMethod('Push Funds')

          // ───── Intercept Quote API ─────
  cy.intercept(
            'POST',
            `https://main-api.volopa-dev.com/${Cypress.env("apiEnv")}/exchange/b2b/self/quote/temp`
        ).as('quoteApi');

  // ───── Wait for API and Compare Values ─────
  cy.wait('@quoteApi').then(({ response }) => {
    const receive = response.body.data.receive;
    const recipientReceives = response.body.data.recipient[0].receives;

    cy.wrap(recipientReceives).as('recipientReceives');
    cy.log(`Receive: ${receive}`);
    cy.log(`Recipient Receives: ${recipientReceives}`);

    expect(receive).to.eq(recipientReceives); // Final comparison
  });
             //Validate the selected payment purpose
             cy.get('@selectedValue').then(selectedValue=>{
                cy.get('.ant-col-sm-20 > :nth-child(2) > :nth-child(1) > .ant-form-item > .ant-row > .ant-col > .ant-form-item-control-input > .ant-form-item-control-input-content > .ant-select > .ant-select-selector')
                .should('be.visible').and('contain.text',selectedValue)
            })
         //Validate Purpose on batch payment
        cy.get('.ant-select-selector').eq(2).click()
        cy.get('.ant-select-dropdown').eq(2).find('.ant-select-item-option-content').then(Element=>{
            let list = Element.text()
            cy.log(list)
            cy.get('@purposeList').then(purposeList=>{
            expect(list).to.eq(purposeList)
            cy.get('.ant-select-selector').eq(2).click() 
        })
          })
          // Validating recipient recived amount
          cy.get(':nth-child(4) > :nth-child(2) > .ant-typography').invoke('text').then((text) => {
            const storedText = text
            cy.wrap(storedText).as('storedText')
            cy.log(storedText)
            })
            cy.get('.ant-col > .ant-btn > span').should('be.visible').click()
            cy.get('.ant-modal-body > :nth-child(1) > .ant-col > .ant-typography').should('be.visible').should('contain.text','Payment Confirmation')
            cy.get('@storedText').then(storedText=>{
                cy.get(':nth-child(5) > .ant-col-8 > .ant-typography')
                .should('be.visible').and('contain.text',storedText)
            })
            cy.get('.ant-row-center.m-t-20 > .ant-col > .ant-space > :nth-child(2) > .ant-btn').should('be.visible').click() // pay recipient
            cy.get('.ant-modal-body > :nth-child(1) > .ant-col').should('be.visible').should('contain.text',' Payment Booked - ')
            cy.get('@storedText').then(storedText=>{
                cy.get(':nth-child(5) > .ant-col-8 > .ant-typography')
                .should('be.visible').and('contain.text',storedText)
            })
            //////newPayment.cancelPushFunds()
    })
    //Easy Transfer
    it('TC_NP_109 - Add 1 recipient(individual) from the "Add Recipient" page with country = INDIA and currency = USD. After adding, make a single payment to the recipient using GBP and Easy transfer.', function(){
        signin.Login(userName, password)
        newRecipient.goToPaymentsDashborad()
        newRecipient.gotoRecipientList()
        let email = batchPayments.generateRandomString(5)+ '@yopmail.com'
        batchPayments.addRecipient('INDIA{downarrow}{enter}' ,'USD{enter}' ,email)
        newRecipient.addBankDetailsWithAccNo('IDIBINBBXXX','55555555')
        const lName = batchPayments.generateRandomString(6)
        batchPayments.individualRecipient('INDIVIDUAL PF',lName,'INDIA{downarrow}{enter}')
        batchPayments.paymentPurposeGBPEUR()
        cy.get('.ant-select-selector').eq(3).click()
        cy.get('.ant-select-dropdown').eq(3).find('.ant-select-item-option-content').then(Element=>{
            let purposeList = Element.text()
            cy.log(purposeList)
            cy.wrap(purposeList).as('purposeList')
        })
        newRecipient.saveRecipient()
        newPayment.checkSettelment('be.disabled','be.enabled')
        newPayment.proceedflow('{downarrow}{enter}','GBP')
        let amount = '125'
        newPayment.addrecipientDetail(amount, email)
             //Validate the selected payment purpose
             cy.get('@selectedValue').then(selectedValue=>{
                cy.get('.ant-col-sm-20 > :nth-child(2) > :nth-child(1) > :nth-child(1) > .ant-row > .ant-col > .ant-form-item-control-input > .ant-form-item-control-input-content > .ant-select > .ant-select-selector')
                .should('be.visible').and('contain.text',selectedValue)
            })
          //Validate the selected payment purpose
        cy.get('@selectedValue').then(selectedValue=>{
        cy.get('.ant-col-sm-20 > :nth-child(2) > :nth-child(1) > :nth-child(1) > .ant-row > .ant-col > .ant-form-item-control-input > .ant-form-item-control-input-content > .ant-select > .ant-select-selector')
        .should('be.visible').and('contain.text',selectedValue)
        })
         //Validate Purpose on batch payment
        cy.get('.ant-select-selector').eq(2).click()
        cy.get('.ant-select-dropdown').eq(1).find('.ant-select-item-option-content').then(Element=>{
            let list = Element.text()
            cy.log(list)
            cy.get('@purposeList').then(purposeList=>{
            expect(list).to.eq(purposeList)
            cy.get('.ant-select-selector').eq(2).click() 
        })
          })
          // Validating recipient recived amount
          cy.get(':nth-child(4) > :nth-child(2) > .ant-typography').invoke('text').then((text) => {
            const storedText = text
            cy.wrap(storedText).as('storedText')
            cy.log(storedText)
            })
            cy.get('.ant-col > .ant-btn > span').should('be.visible').click()
            cy.get('.ant-modal-body > :nth-child(1) > .ant-col > .ant-typography').should('be.visible').should('contain.text','Payment Confirmation')
            cy.get('@storedText').then(storedText=>{
                cy.get(':nth-child(5) > .ant-col-8 > .ant-typography')
                .should('be.visible').and('contain.text',storedText)
            })
            cy.get('.ant-row-center.m-t-20 > .ant-col > .ant-space > :nth-child(2) > .ant-btn').should('be.visible').click() // pay recipient
            cy.get('.ant-modal-body > :nth-child(1) > .ant-col').should('be.visible').should('contain.text',' Payment Booked - ')
            cy.get('@storedText').then(storedText=>{
                cy.get(':nth-child(5) > .ant-col-8 > .ant-typography')
                .should('be.visible').and('contain.text',storedText)
            })
            newPayment.validateYapilyFlow()
            //newPayment.cancelEasyTransfer()
    })
    it('TC_NP_110 - Add 1 recipient(Business) from the "Add Recipient" page with country = CHINA and currency = USD. After adding, make a single payment to the recipient using GBP and Easy transfer..', function(){
        signin.Login(userName, password)
        newRecipient.goToPaymentsDashborad()
        newRecipient.gotoRecipientList()
        let email = batchPayments.generateRandomString(5)+ '@yopmail.com'
        batchPayments.addRecipient('INDIA{downarrow}{enter}' ,'USD{enter}' ,email)
        newRecipient.addBankDetailsWithAccNo('IDIBINBBXXX','55555555')
        cy.get('.ant-space > :nth-child(2) > .ant-card > .ant-card-body').should('be.visible').click()
        const bName = batchPayments.generateRandomString(6)
        batchPayments.addBusinessRecipient('BUSINESS PF'+' '+bName,'INDIA{downarrow}{enter}')
        batchPayments.paymentPurposeGBPEUR()
        cy.get('.ant-select-selector').eq(3).click()
        cy.get('.ant-select-dropdown').eq(3).find('.ant-select-item-option-content').then(Element=>{
            let purposeList = Element.text()
            cy.log(purposeList)
            cy.wrap(purposeList).as('purposeList')
        })
        newRecipient.saveRecipient()
        newPayment.checkSettelment('be.disabled','be.enabled')
        newPayment.proceedflow('{downarrow}{enter}','GBP')
        let amount = '125'
        newPayment.addrecipientDetail(amount, email)
             //Validate the selected payment purpose
             cy.get('@selectedValue').then(selectedValue=>{
                cy.get('.ant-col-sm-20 > :nth-child(2) > :nth-child(1) > :nth-child(1) > .ant-row > .ant-col > .ant-form-item-control-input > .ant-form-item-control-input-content > .ant-select > .ant-select-selector')
                .should('be.visible').and('contain.text',selectedValue)
            })
          //Validate the selected payment purpose
        cy.get('@selectedValue').then(selectedValue=>{
        cy.get('.ant-col-sm-20 > :nth-child(2) > :nth-child(1) > :nth-child(1) > .ant-row > .ant-col > .ant-form-item-control-input > .ant-form-item-control-input-content > .ant-select > .ant-select-selector')
        .should('be.visible').and('contain.text',selectedValue)
        })
         //Validate Purpose on batch payment
        cy.get('.ant-select-selector').eq(2).click()
        cy.get('.ant-select-dropdown').eq(1).find('.ant-select-item-option-content').then(Element=>{
            let list = Element.text()
            cy.log(list)
            cy.get('@purposeList').then(purposeList=>{
            expect(list).to.eq(purposeList)
            cy.get('.ant-select-selector').eq(2).click() 
        })
          })
          // Validating recipient recived amount
          cy.get(':nth-child(4) > :nth-child(2) > .ant-typography').invoke('text').then((text) => {
            const storedText = text
            cy.wrap(storedText).as('storedText')
            cy.log(storedText)
            })
            cy.get('.ant-col > .ant-btn > span').should('be.visible').click()
            cy.get('.ant-modal-body > :nth-child(1) > .ant-col > .ant-typography').should('be.visible').should('contain.text','Payment Confirmation')
            cy.get('@storedText').then(storedText=>{
                cy.get(':nth-child(5) > .ant-col-8 > .ant-typography')
                .should('be.visible').and('contain.text',storedText)
            })
            cy.get('.ant-row-center.m-t-20 > .ant-col > .ant-space > :nth-child(2) > .ant-btn').should('be.visible').click() // pay recipient
            cy.get('.ant-modal-body > :nth-child(1) > .ant-col').should('be.visible').should('contain.text',' Payment Booked - ')
            cy.get('@storedText').then(storedText=>{
                cy.get(':nth-child(5) > .ant-col-8 > .ant-typography')
                .should('be.visible').and('contain.text',storedText)
            })
            newPayment.validateYapilyFlow()
            //newPayment.cancelEasyTransfer()
    })

    //UAE with usd and push funds
    it('TC_NP_111 - Add 1 recipient(individual) from the "Add Recipient" page with country = UAE and currency = USD. After adding, make a single payment to the recipient using GBP and push funds.', function(){
        signin.Login(userName, password)
        newRecipient.goToPaymentsDashborad()
        newRecipient.gotoRecipientList()
        let email = batchPayments.generateRandomString(5)+ '@yopmail.com'
        batchPayments.addRecipient('UNITED ARAB EMIRATES{enter}' ,'USD{enter}' ,email)
        newRecipient.addBankDetails('AE070331234567890123456','AARPAEAA')
        const lName = batchPayments.generateRandomString(6)
        batchPayments.individualRecipient('INDIVIDUAL PF',lName,'INDIA{downarrow}{enter}')
        batchPayments.paymentPurpose()
        cy.get('.ant-select-selector').eq(3).click()
        cy.get('.ant-select-dropdown').eq(3).find('.ant-select-item-option-content').then(Element=>{
            let purposeList = Element.text()
            cy.log(purposeList)
            cy.wrap(purposeList).as('purposeList')
        })
        newRecipient.saveRecipient()
        newPayment.checkSettelment('be.disabled','be.enabled')
        newPayment.proceedflow('{downarrow}{enter}','GBP')
        let amount = '125'
        newPayment.addrecipientDetail(amount, email)
        newPayment.selectFundingMethod('Push Funds')

          // ───── Intercept Quote API ─────
  cy.intercept(
            'POST',
            `https://main-api.volopa-dev.com/${Cypress.env("apiEnv")}/exchange/b2b/self/quote/temp`
        ).as('quoteApi');

  // ───── Wait for API and Compare Values ─────
  cy.wait('@quoteApi').then(({ response }) => {
    const receive = response.body.data.receive;
    const recipientReceives = response.body.data.recipient[0].receives;

    cy.wrap(recipientReceives).as('recipientReceives');
    cy.log(`Receive: ${receive}`);
    cy.log(`Recipient Receives: ${recipientReceives}`);

    expect(receive).to.eq(recipientReceives); // Final comparison
  });
            
          //Validate the selected payment purpose
          cy.get('@selectedValue').then(selectedValue => {
            cy.get(`div[class="ant-form-item"] span[title="${selectedValue}"]`)
              .should('be.visible')
              .and('contain.text', selectedValue);
            
         //Validate Purpose list
            cy.get(`div[class="ant-form-item"] span[title="${selectedValue}"]`).click()
            cy.get('.ant-select-dropdown').eq(2).find('.ant-select-item-option-content').then(Element=>{
            let list = Element.text()
            cy.log(list)
            cy.get('@purposeList').then(purposeList=>{
            expect(list).to.eq(purposeList)
            cy.get('.ant-select-selector').eq(2).click() 
        })
        });
          })
          // Validating recipient recived amount
          cy.get(':nth-child(4) > :nth-child(2) > .ant-typography').invoke('text').then((text) => {
            const storedText = text
            cy.wrap(storedText).as('storedText')
            cy.log(storedText)
            })
            cy.get('.ant-col > .ant-btn > span').should('be.visible').click()
            cy.get('.ant-modal-body > :nth-child(1) > .ant-col > .ant-typography').should('be.visible').should('contain.text','Payment Confirmation')
            cy.get('@storedText').then(storedText=>{
                cy.get(':nth-child(5) > .ant-col-8 > .ant-typography')
                .should('be.visible').and('contain.text',storedText)
            })
            cy.get('.ant-row-center.m-t-20 > .ant-col > .ant-space > :nth-child(2) > .ant-btn').should('be.visible').click() // pay recipient
            cy.get('.ant-modal-body > :nth-child(1) > .ant-col').should('be.visible').should('contain.text',' Payment Booked - ')
            cy.get('@storedText').then(storedText=>{
                cy.get(':nth-child(5) > .ant-col-8 > .ant-typography')
                .should('be.visible').and('contain.text',storedText)
            })
            cy.wait(2000)
            //////newPayment.cancelPushFunds()
    })
    it('TC_NP_112 - Add 1 recipient(business) from the "Add Recipient" page with country = UAE and currency = USD. After adding, make a single payment to the recipient using GBP and push funds.', function(){
        signin.Login(userName, password)
        newRecipient.goToPaymentsDashborad()
        newRecipient.gotoRecipientList()
        let email = batchPayments.generateRandomString(5)+ '@yopmail.com'
        batchPayments.addRecipient('UNITED ARAB EMIRATES{enter}' ,'USD{enter}' ,email)
        newRecipient.addBankDetails('AE070331234567890123456','AARPAEAA')
        cy.get('.ant-space > :nth-child(2) > .ant-card > .ant-card-body').should('be.visible').click()
        const bName = batchPayments.generateRandomString(6)
        batchPayments.addBusinessRecipient('BUSINESS PF'+' '+bName,'United Arab Emirates{enter}')
        batchPayments.paymentPurpose()
        cy.get('.ant-select-selector').eq(3).click()
        cy.get('.ant-select-dropdown').eq(3).find('.ant-select-item-option-content').then(Element=>{
            let purposeList = Element.text()
            cy.log(purposeList)
            cy.wrap(purposeList).as('purposeList')
        })
        newRecipient.saveRecipient()
        newPayment.checkSettelment('be.disabled','be.enabled')
        newPayment.proceedflow('{downarrow}{enter}','GBP')
        let amount = '125'
        newPayment.addrecipientDetail(amount, email)
        newPayment.selectFundingMethod('Push Funds')

          // ───── Intercept Quote API ─────
  cy.intercept(
            'POST',
            `https://main-api.volopa-dev.com/${Cypress.env("apiEnv")}/exchange/b2b/self/quote/temp`
        ).as('quoteApi');

  // ───── Wait for API and Compare Values ─────
  cy.wait('@quoteApi').then(({ response }) => {
    const receive = response.body.data.receive;
    const recipientReceives = response.body.data.recipient[0].receives;

    cy.wrap(recipientReceives).as('recipientReceives');
    cy.log(`Receive: ${receive}`);
    cy.log(`Recipient Receives: ${recipientReceives}`);

    expect(receive).to.eq(recipientReceives); // Final comparison
  });
            
          //Validate the selected payment purpose
          cy.get('@selectedValue').then(selectedValue => {
            cy.get(`div[class="ant-form-item"] span[title="${selectedValue}"]`)
              .should('be.visible')
              .and('contain.text', selectedValue);
            
         //Validate Purpose list
            cy.get(`div[class="ant-form-item"] span[title="${selectedValue}"]`).click()
            cy.get('.ant-select-dropdown').eq(2).find('.ant-select-item-option-content').then(Element=>{
            let list = Element.text()
            cy.log(list)
            cy.get('@purposeList').then(purposeList=>{
            expect(list).to.eq(purposeList)
            cy.get('.ant-select-selector').eq(2).click() 
        })
        });
          })
          // Validating recipient recived amount
          cy.get(':nth-child(4) > :nth-child(2) > .ant-typography').invoke('text').then((text) => {
            const storedText = text
            cy.wrap(storedText).as('storedText')
            cy.log(storedText)
            })
            cy.get('.ant-col > .ant-btn > span').should('be.visible').click()
            cy.get('.ant-modal-body > :nth-child(1) > .ant-col > .ant-typography').should('be.visible').should('contain.text','Payment Confirmation')
            cy.get('@storedText').then(storedText=>{
                cy.get(':nth-child(5) > .ant-col-8 > .ant-typography')
                .should('be.visible').and('contain.text',storedText)
            })
            cy.get('.ant-row-center.m-t-20 > .ant-col > .ant-space > :nth-child(2) > .ant-btn').should('be.visible').click() // pay recipient
            cy.get('.ant-modal-body > :nth-child(1) > .ant-col').should('be.visible').should('contain.text',' Payment Booked - ')
            cy.get('@storedText').then(storedText=>{
                cy.get(':nth-child(5) > .ant-col-8 > .ant-typography')
                .should('be.visible').and('contain.text',storedText)
            })
            //////newPayment.cancelPushFunds()
    })
    //UAE with usd and easy transfer
    it('TC_NP_113 - Add 1 recipient(individual) from the "Add Recipient" page with country = UAE and currency = USD. After adding, make a single payment to the recipient using GBP and easy transfer.', function(){
        signin.Login(userName, password)
        newRecipient.goToPaymentsDashborad()
        newRecipient.gotoRecipientList()
        let email = batchPayments.generateRandomString(5)+ '@yopmail.com'
        batchPayments.addRecipient('UNITED ARAB EMIRATES{enter}' ,'USD{enter}' ,email)
        newRecipient.addBankDetails('AE070331234567890123456','AARPAEAA')
        const lName = batchPayments.generateRandomString(6)
        batchPayments.individualRecipient('INDIVIDUAL PF',lName,'INDIA{downarrow}{enter}')
        batchPayments.paymentPurpose()
        cy.get('.ant-select-selector').eq(3).click()
        cy.get('.ant-select-dropdown').eq(3).find('.ant-select-item-option-content').then(Element=>{
            let purposeList = Element.text()
            cy.log(purposeList)
            cy.wrap(purposeList).as('purposeList')
        })
        newRecipient.saveRecipient()
        newPayment.checkSettelment('be.disabled','be.enabled')
        newPayment.proceedflow('{downarrow}{enter}','GBP')
        let amount = '125'
        newPayment.addrecipientDetail(amount, email)
            
          //Validate the selected payment purpose
          cy.get('@selectedValue').then(selectedValue => {
            cy.get(`div[class="ant-form-item"] span[title="${selectedValue}"]`)
              .should('be.visible')
              .and('contain.text', selectedValue);
            
         //Validate Purpose list
            cy.get(`div[class="ant-form-item"] span[title="${selectedValue}"]`).click()
            cy.get('.ant-select-dropdown').eq(1).find('.ant-select-item-option-content').then(Element=>{
            let list = Element.text()
            cy.log(list)
            cy.get('@purposeList').then(purposeList=>{
            expect(list).to.eq(purposeList)
            cy.get('.ant-select-selector').eq(2).click() 
        })
        });
          })
          // Validating recipient recived amount
          cy.get(':nth-child(4) > :nth-child(2) > .ant-typography').invoke('text').then((text) => {
            const storedText = text
            cy.wrap(storedText).as('storedText')
            cy.log(storedText)
            })
            cy.get('.ant-col > .ant-btn > span').should('be.visible').click()
            cy.get('.ant-modal-body > :nth-child(1) > .ant-col > .ant-typography').should('be.visible').should('contain.text','Payment Confirmation')
            cy.get('@storedText').then(storedText=>{
                cy.get(':nth-child(5) > .ant-col-8 > .ant-typography')
                .should('be.visible').and('contain.text',storedText)
            })
            cy.get('.ant-row-center.m-t-20 > .ant-col > .ant-space > :nth-child(2) > .ant-btn').should('be.visible').click() // pay recipient
            cy.get('.ant-modal-body > :nth-child(1) > .ant-col').should('be.visible').should('contain.text',' Payment Booked - ')
            cy.get('@storedText').then(storedText=>{
                cy.get(':nth-child(5) > .ant-col-8 > .ant-typography')
                .should('be.visible').and('contain.text',storedText)
            })
            newPayment.validateYapilyFlow()
            //newPayment.cancelEasyTransfer()
    })
    it('TC_NP_114 - Add 1 recipient(business) from the "Add Recipient" page with country = UAE and currency = USD. After adding, make a single payment to the recipient using GBP and easy transfer.', function(){
        signin.Login(userName, password)
        newRecipient.goToPaymentsDashborad()
        newRecipient.gotoRecipientList()
        let email = batchPayments.generateRandomString(5)+ '@yopmail.com'
        batchPayments.addRecipient('UNITED ARAB EMIRATES{enter}' ,'USD{enter}' ,email)
        newRecipient.addBankDetails('AE070331234567890123456','AARPAEAA')
        cy.get('.ant-space > :nth-child(2) > .ant-card > .ant-card-body').should('be.visible').click()
        const bName = batchPayments.generateRandomString(6)
        batchPayments.addBusinessRecipient('BUSINESS PF'+' '+bName,'United Arab Emirates{enter}')
        batchPayments.paymentPurpose()
        cy.get('.ant-select-selector').eq(3).click()
        cy.get('.ant-select-dropdown').eq(3).find('.ant-select-item-option-content').then(Element=>{
            let purposeList = Element.text()
            cy.log(purposeList)
            cy.wrap(purposeList).as('purposeList')
        })
        newRecipient.saveRecipient()
        newPayment.checkSettelment('be.disabled','be.enabled')
        newPayment.proceedflow('{downarrow}{enter}','GBP')
        let amount = '125'
        newPayment.addrecipientDetail(amount, email)
            
          //Validate the selected payment purpose
          cy.get('@selectedValue').then(selectedValue => {
            cy.get(`div[class="ant-form-item"] span[title="${selectedValue}"]`)
              .should('be.visible')
              .and('contain.text', selectedValue);
            
         //Validate Purpose list
            cy.get(`div[class="ant-form-item"] span[title="${selectedValue}"]`).click()
            cy.get('.ant-select-dropdown').eq(1).find('.ant-select-item-option-content').then(Element=>{
            let list = Element.text()
            cy.log(list)
            cy.get('@purposeList').then(purposeList=>{
            expect(list).to.eq(purposeList)
            cy.get('.ant-select-selector').eq(2).click() 
        })
        });
          })
          // Validating recipient recived amount
          cy.get(':nth-child(4) > :nth-child(2) > .ant-typography').invoke('text').then((text) => {
            const storedText = text
            cy.wrap(storedText).as('storedText')
            cy.log(storedText)
            })
            cy.get('.ant-col > .ant-btn > span').should('be.visible').click()
            cy.get('.ant-modal-body > :nth-child(1) > .ant-col > .ant-typography').should('be.visible').should('contain.text','Payment Confirmation')
            cy.get('@storedText').then(storedText=>{
                cy.get(':nth-child(5) > .ant-col-8 > .ant-typography')
                .should('be.visible').and('contain.text',storedText)
            })
            cy.get('.ant-row-center.m-t-20 > .ant-col > .ant-space > :nth-child(2) > .ant-btn').should('be.visible').click() // pay recipient
            cy.get('.ant-modal-body > :nth-child(1) > .ant-col').should('be.visible').should('contain.text',' Payment Booked - ')
            cy.get('@storedText').then(storedText=>{
                cy.get(':nth-child(5) > .ant-col-8 > .ant-typography')
                .should('be.visible').and('contain.text',storedText)
            })
            newPayment.validateYapilyFlow()
            //newPayment.cancelEasyTransfer()
    })
    //Australia with usd and push funds
    it('TC_NP_115 - Add 1 recipient(individual) from the "Add Recipient" page with country = Australia and currency = USD. After adding, make a single payment to the recipient using GBP and push funds.', function(){
        signin.Login(userName, password)
        newRecipient.goToPaymentsDashborad()
        newRecipient.gotoRecipientList()
        let email = batchPayments.generateRandomString(5)+ '@yopmail.com'
        batchPayments.addRecipient('AUSTRALIA{enter}' ,'USD{enter}' ,email)
        newRecipient.addBankDetailsWithAccNo('ABNAAU2BOBU','55555555')
        const lName = batchPayments.generateRandomString(6)
        batchPayments.individualRecipient('INDIVIDUAL PF',lName,'Australia{enter}')
        batchPayments.paymentPurposeGBPEUR()
        cy.get('.ant-select-selector').eq(3).click()
        cy.get('.ant-select-dropdown').eq(3).find('.ant-select-item-option-content').then(Element=>{
            let purposeList = Element.text()
            cy.log(purposeList)
            cy.wrap(purposeList).as('purposeList')
        })
        newRecipient.saveRecipient()
        newPayment.checkSettelment('be.disabled','be.enabled')
        newPayment.proceedflow('{downarrow}{enter}','GBP')
        let amount = '125'
        newPayment.addrecipientDetail(amount, email)
        newPayment.selectFundingMethod('Push Funds')

          // ───── Intercept Quote API ─────
  cy.intercept(
            'POST',
            `https://main-api.volopa-dev.com/${Cypress.env("apiEnv")}/exchange/b2b/self/quote/temp`
        ).as('quoteApi');

  // ───── Wait for API and Compare Values ─────
  cy.wait('@quoteApi').then(({ response }) => {
    const receive = response.body.data.receive;
    const recipientReceives = response.body.data.recipient[0].receives;

    cy.wrap(recipientReceives).as('recipientReceives');
    cy.log(`Receive: ${receive}`);
    cy.log(`Recipient Receives: ${recipientReceives}`);

    expect(receive).to.eq(recipientReceives); // Final comparison
  });
            
          //Validate the selected payment purpose
          cy.get('@selectedValue').then(selectedValue => {
            cy.get(`div[class="ant-form-item"] span[title="${selectedValue}"]`)
              .should('be.visible')
              .and('contain.text', selectedValue);
            
         //Validate Purpose list
            cy.get(`div[class="ant-form-item"] span[title="${selectedValue}"]`).click()
            cy.get('.ant-select-dropdown').eq(2).find('.ant-select-item-option-content').then(Element=>{
            let list = Element.text()
            cy.log(list)
            cy.get('@purposeList').then(purposeList=>{
            expect(list).to.eq(purposeList)
            cy.get(`div[class="ant-form-item"] span[title="${selectedValue}"]`).click()
        })
        });
          })
          // Validating recipient recived amount
          cy.get(':nth-child(4) > :nth-child(2) > .ant-typography').invoke('text').then((text) => {
            const storedText = text
            cy.wrap(storedText).as('storedText')
            cy.log(storedText)
            })
            cy.get('.ant-col > .ant-btn > span').should('be.visible').click()
            cy.get('.ant-modal-body > :nth-child(1) > .ant-col > .ant-typography').should('be.visible').should('contain.text','Payment Confirmation')
            cy.get('@storedText').then(storedText=>{
                cy.get(':nth-child(5) > .ant-col-8 > .ant-typography')
                .should('be.visible').and('contain.text',storedText)
            })
            cy.get('.ant-row-center.m-t-20 > .ant-col > .ant-space > :nth-child(2) > .ant-btn').should('be.visible').click() // pay recipient
            cy.get('.ant-modal-body > :nth-child(1) > .ant-col').should('be.visible').should('contain.text',' Payment Booked - ')
            cy.get('@storedText').then(storedText=>{
                cy.get(':nth-child(5) > .ant-col-8 > .ant-typography')
                .should('be.visible').and('contain.text',storedText)
            })
            //////newPayment.cancelPushFunds()
    })
    it('TC_NP_116 - Add 1 recipient(business) from the "Add Recipient" page with country = Australia and currency = USD. After adding, make a single payment to the recipient using GBP and push funds.', function(){
        signin.Login(userName, password)
        newRecipient.goToPaymentsDashborad()
        newRecipient.gotoRecipientList()
        let email = batchPayments.generateRandomString(5)+ '@yopmail.com'
        batchPayments.addRecipient('AUSTRALIA{enter}' ,'USD{enter}' ,email)
        newRecipient.addBankDetailsWithAccNo('ABNAAU2BOBU','55555555')
        cy.get('.ant-space > :nth-child(2) > .ant-card > .ant-card-body').should('be.visible').click()
        const bName = batchPayments.generateRandomString(6)
        batchPayments.addBusinessRecipient('BUSINESS PF'+' '+bName,'Australia{enter}')
        batchPayments.paymentPurposeGBPEUR()
        cy.get('.ant-select-selector').eq(3).click()
        cy.get('.ant-select-dropdown').eq(3).find('.ant-select-item-option-content').then(Element=>{
            let purposeList = Element.text()
            cy.log(purposeList)
            cy.wrap(purposeList).as('purposeList')
        })
        newRecipient.saveRecipient()
        newPayment.checkSettelment('be.disabled','be.enabled')
        newPayment.proceedflow('{downarrow}{enter}','GBP')
        let amount = '125'
        newPayment.addrecipientDetail(amount, email)
        newPayment.selectFundingMethod('Push Funds')

          // ───── Intercept Quote API ─────
  cy.intercept(
            'POST',
            `https://main-api.volopa-dev.com/${Cypress.env("apiEnv")}/exchange/b2b/self/quote/temp`
        ).as('quoteApi');

  // ───── Wait for API and Compare Values ─────
  cy.wait('@quoteApi').then(({ response }) => {
    const receive = response.body.data.receive;
    const recipientReceives = response.body.data.recipient[0].receives;

    cy.wrap(recipientReceives).as('recipientReceives');
    cy.log(`Receive: ${receive}`);
    cy.log(`Recipient Receives: ${recipientReceives}`);

    expect(receive).to.eq(recipientReceives); // Final comparison
  });
            
          //Validate the selected payment purpose
          cy.get('@selectedValue').then(selectedValue => {
            cy.get(`div[class="ant-form-item"] span[title="${selectedValue}"]`)
              .should('be.visible')
              .and('contain.text', selectedValue);
            
         //Validate Purpose list
            cy.get(`div[class="ant-form-item"] span[title="${selectedValue}"]`).click()
            cy.get('.ant-select-dropdown').eq(2).find('.ant-select-item-option-content').then(Element=>{
            let list = Element.text()
            cy.log(list)
            cy.get('@purposeList').then(purposeList=>{
            expect(list).to.eq(purposeList)
            cy.get(`div[class="ant-form-item"] span[title="${selectedValue}"]`).click()
        })
        });
          })
          // Validating recipient recived amount
          cy.get(':nth-child(4) > :nth-child(2) > .ant-typography').invoke('text').then((text) => {
            const storedText = text
            cy.wrap(storedText).as('storedText')
            cy.log(storedText)
            })
            cy.get('.ant-col > .ant-btn > span').should('be.visible').click()
            cy.get('.ant-modal-body > :nth-child(1) > .ant-col > .ant-typography').should('be.visible').should('contain.text','Payment Confirmation')
            cy.get('@storedText').then(storedText=>{
                cy.get(':nth-child(5) > .ant-col-8 > .ant-typography')
                .should('be.visible').and('contain.text',storedText)
            })
            cy.get('.ant-row-center.m-t-20 > .ant-col > .ant-space > :nth-child(2) > .ant-btn').should('be.visible').click() // pay recipient
            cy.get('.ant-modal-body > :nth-child(1) > .ant-col').should('be.visible').should('contain.text',' Payment Booked - ')
            cy.get('@storedText').then(storedText=>{
                cy.get(':nth-child(5) > .ant-col-8 > .ant-typography')
                .should('be.visible').and('contain.text',storedText)
            })
            //////newPayment.cancelPushFunds()
    })

     //Australia with usd and easy transfer
     it('TC_NP_117 - Add 1 recipient(individual) from the "Add Recipient" page with country = Australia and currency = USD. After adding, make a single payment to the recipient using GBP and easy transfer.', function(){
        signin.Login(userName, password)
        newRecipient.goToPaymentsDashborad()
        newRecipient.gotoRecipientList()
        let email = batchPayments.generateRandomString(5)+ '@yopmail.com'
        batchPayments.addRecipient('AUSTRALIA{enter}' ,'USD{enter}' ,email)
        newRecipient.addBankDetailsWithAccNo('ABNAAU2BOBU','55555555')
        const lName = batchPayments.generateRandomString(6)
        batchPayments.individualRecipient('INDIVIDUAL PF',lName,'Australia{enter}')
        batchPayments.paymentPurposeGBPEUR()
        cy.get('.ant-select-selector').eq(3).click()
        cy.get('.ant-select-dropdown').eq(3).find('.ant-select-item-option-content').then(Element=>{
            let purposeList = Element.text()
            cy.log(purposeList)
            cy.wrap(purposeList).as('purposeList')
        })
        newRecipient.saveRecipient()
        newPayment.checkSettelment('be.disabled','be.enabled')
        newPayment.proceedflow('{downarrow}{enter}','GBP')
        let amount = '125'
        newPayment.addrecipientDetail(amount, email)
            
          //Validate the selected payment purpose
          cy.get('@selectedValue').then(selectedValue => {
            cy.get(`div[class="ant-form-item"] span[title="${selectedValue}"]`)
              .should('be.visible')
              .and('contain.text', selectedValue);
            
         //Validate Purpose list
            cy.get(`div[class="ant-form-item"] span[title="${selectedValue}"]`).click()
            cy.get('.ant-select-dropdown').eq(1).find('.ant-select-item-option-content').then(Element=>{
            let list = Element.text()
            cy.log(list)
            cy.get('@purposeList').then(purposeList=>{
            expect(list).to.eq(purposeList)
            cy.get(`div[class="ant-form-item"] span[title="${selectedValue}"]`).click() 
        })
        });
          })
          // Validating recipient recived amount
          cy.get(':nth-child(4) > :nth-child(2) > .ant-typography').invoke('text').then((text) => {
            const storedText = text
            cy.wrap(storedText).as('storedText')
            cy.log(storedText)
            })
            cy.get('.ant-col > .ant-btn > span').should('be.visible').click()
            cy.get('.ant-modal-body > :nth-child(1) > .ant-col > .ant-typography').should('be.visible').should('contain.text','Payment Confirmation')
            cy.get('@storedText').then(storedText=>{
                cy.get(':nth-child(5) > .ant-col-8 > .ant-typography')
                .should('be.visible').and('contain.text',storedText)
            })
            cy.get('.ant-row-center.m-t-20 > .ant-col > .ant-space > :nth-child(2) > .ant-btn').should('be.visible').click() // pay recipient
            cy.get('.ant-modal-body > :nth-child(1) > .ant-col').should('be.visible').should('contain.text',' Payment Booked - ')
            cy.get('@storedText').then(storedText=>{
                cy.get(':nth-child(5) > .ant-col-8 > .ant-typography')
                .should('be.visible').and('contain.text',storedText)
            })
            newPayment.validateYapilyFlow()
            //newPayment.cancelEasyTransfer()
    })
    it('TC_NP_118 - Add 1 recipient(business) from the "Add Recipient" page with country = Australia and currency = USD. After adding, make a single payment to the recipient using GBP and easy transfer.', function(){
        signin.Login(userName, password)
        newRecipient.goToPaymentsDashborad()
        newRecipient.gotoRecipientList()
        let email = batchPayments.generateRandomString(5)+ '@yopmail.com'
        batchPayments.addRecipient('AUSTRALIA{enter}' ,'USD{enter}' ,email)
        newRecipient.addBankDetailsWithAccNo('ABNAAU2BOBU','55555555')
        cy.get('.ant-space > :nth-child(2) > .ant-card > .ant-card-body').should('be.visible').click()
        const bName = batchPayments.generateRandomString(6)
        batchPayments.addBusinessRecipient('BUSINESS PF'+' '+bName,'Australia{enter}')
        batchPayments.paymentPurposeGBPEUR()
        cy.get('.ant-select-selector').eq(3).click()
        cy.get('.ant-select-dropdown').eq(3).find('.ant-select-item-option-content').then(Element=>{
            let purposeList = Element.text()
            cy.log(purposeList)
            cy.wrap(purposeList).as('purposeList')
        })
        newRecipient.saveRecipient()
        newPayment.checkSettelment('be.disabled','be.enabled')
        newPayment.proceedflow('{downarrow}{enter}','GBP')
        let amount = '125'
        newPayment.addrecipientDetail(amount, email)
            
          //Validate the selected payment purpose
          cy.get('@selectedValue').then(selectedValue => {
            cy.get(`div[class="ant-form-item"] span[title="${selectedValue}"]`)
              .should('be.visible')
              .and('contain.text', selectedValue);
            
         //Validate Purpose list
            cy.get(`div[class="ant-form-item"] span[title="${selectedValue}"]`).click()
            cy.get('.ant-select-dropdown').eq(1).find('.ant-select-item-option-content').then(Element=>{
            let list = Element.text()
            cy.log(list)
            cy.get('@purposeList').then(purposeList=>{
            expect(list).to.eq(purposeList)
            cy.get(`div[class="ant-form-item"] span[title="${selectedValue}"]`).click() 
        })
        });
          })
          // Validating recipient recived amount
          cy.get(':nth-child(4) > :nth-child(2) > .ant-typography').invoke('text').then((text) => {
            const storedText = text
            cy.wrap(storedText).as('storedText')
            cy.log(storedText)
            })
            cy.get('.ant-col > .ant-btn > span').should('be.visible').click()
            cy.get('.ant-modal-body > :nth-child(1) > .ant-col > .ant-typography').should('be.visible').should('contain.text','Payment Confirmation')
            cy.get('@storedText').then(storedText=>{
                cy.get(':nth-child(5) > .ant-col-8 > .ant-typography')
                .should('be.visible').and('contain.text',storedText)
            })
            cy.get('.ant-row-center.m-t-20 > .ant-col > .ant-space > :nth-child(2) > .ant-btn').should('be.visible').click() // pay recipient
            cy.get('.ant-modal-body > :nth-child(1) > .ant-col').should('be.visible').should('contain.text',' Payment Booked - ')
            cy.get('@storedText').then(storedText=>{
                cy.get(':nth-child(5) > .ant-col-8 > .ant-typography')
                .should('be.visible').and('contain.text',storedText)
            })
            newPayment.validateYapilyFlow()
            //newPayment.cancelEasyTransfer()
    })
    //Canada with usd and push funds
    it('TC_NP_119 - Add 1 recipient(individual) from the "Add Recipient" page with country = Canada and currency = USD. After adding, make a single payment to the recipient using GBP and push funds.', function(){
        signin.Login(userName, password)
        newRecipient.goToPaymentsDashborad()
        newRecipient.gotoRecipientList()
        let email = batchPayments.generateRandomString(5)+ '@yopmail.com'
        batchPayments.addRecipient('CANADA{enter}' ,'USD{enter}' ,email)
        newRecipient.addBankDetailsWithAccNo('BCANCAW2','26207729')
        const lName = batchPayments.generateRandomString(6)
        batchPayments.individualRecipient('INDIVIDUAL Canada',lName,'Canada{enter}')
        newRecipient.postCodeStateCanada()
        batchPayments.paymentPurposeGBPEUR()
        cy.get('.ant-select-selector').eq(4).click()
        cy.get('.ant-select-dropdown').eq(4).find('.ant-select-item-option-content').then(Element=>{
            let purposeList = Element.text()
            cy.log(purposeList)
            cy.wrap(purposeList).as('purposeList')
        })
        newRecipient.saveRecipient()
        newPayment.checkSettelment('be.disabled','be.enabled')
        newPayment.proceedflow('{downarrow}{enter}','GBP')
        let amount = '125'
        newPayment.addrecipientDetail(amount, email)
        newPayment.selectFundingMethod('Push Funds')

          // ───── Intercept Quote API ─────
  cy.intercept(
            'POST',
            `https://main-api.volopa-dev.com/${Cypress.env("apiEnv")}/exchange/b2b/self/quote/temp`
        ).as('quoteApi');

  // ───── Wait for API and Compare Values ─────
  cy.wait('@quoteApi').then(({ response }) => {
    const receive = response.body.data.receive;
    const recipientReceives = response.body.data.recipient[0].receives;

    cy.wrap(recipientReceives).as('recipientReceives');
    cy.log(`Receive: ${receive}`);
    cy.log(`Recipient Receives: ${recipientReceives}`);

    expect(receive).to.eq(recipientReceives); // Final comparison
  });
            
          //Validate the selected payment purpose
          cy.get('@selectedValue').then(selectedValue => {
            cy.get(`div[class="ant-form-item"] span[title="${selectedValue}"]`)
              .should('be.visible')
              .and('contain.text', selectedValue);
            
         //Validate Purpose list
            cy.get(`div[class="ant-form-item"] span[title="${selectedValue}"]`).click()
            cy.get('.ant-select-dropdown').eq(2).find('.ant-select-item-option-content').then(Element=>{
            let list = Element.text()
            cy.log(list)
            cy.get('@purposeList').then(purposeList=>{
            expect(list).to.eq(purposeList)
            cy.get(`div[class="ant-form-item"] span[title="${selectedValue}"]`).click() 
        })
        });
          })
          // Validating recipient recived amount
          cy.get(':nth-child(4) > :nth-child(2) > .ant-typography').invoke('text').then((text) => {
            const storedText = text
            cy.wrap(storedText).as('storedText')
            cy.log(storedText)
            })
            cy.get('.ant-col > .ant-btn > span').should('be.visible').click()
            cy.get('.ant-modal-body > :nth-child(1) > .ant-col > .ant-typography').should('be.visible').should('contain.text','Payment Confirmation')
            cy.get('@storedText').then(storedText=>{
                cy.get(':nth-child(5) > .ant-col-8 > .ant-typography')
                .should('be.visible').and('contain.text',storedText)
            })
            cy.get('.ant-row-center.m-t-20 > .ant-col > .ant-space > :nth-child(2) > .ant-btn').should('be.visible').click() // pay recipient
            cy.get('.ant-modal-body > :nth-child(1) > .ant-col').should('be.visible').should('contain.text',' Payment Booked - ')
            cy.get('@storedText').then(storedText=>{
                cy.get(':nth-child(5) > .ant-col-8 > .ant-typography')
                .should('be.visible').and('contain.text',storedText)
            })
            //////newPayment.cancelPushFunds()
    })
    it('TC_NP_120 - Add 1 recipient(business) from the "Add Recipient" page with country = Canada and currency = USD. After adding, make a single payment to the recipient using GBP and push funds.', function(){
        signin.Login(userName, password)
        newRecipient.goToPaymentsDashborad()
        newRecipient.gotoRecipientList()
        let email = batchPayments.generateRandomString(5)+ '@yopmail.com'
        batchPayments.addRecipient('CANADA{enter}' ,'USD{enter}' ,email)
        newRecipient.addBankDetailsWithAccNo('ROYCCAT2','55555555')
        cy.get('.ant-space > :nth-child(2) > .ant-card > .ant-card-body').should('be.visible').click()
        const bName = batchPayments.generateRandomString(6)
        batchPayments.addBusinessRecipient('BUSINESS Canada'+' '+bName,'Canada{enter}')
        newRecipient.postCodeStateCanada()
        batchPayments.paymentPurposeGBPEUR()
        cy.get('.ant-select-selector').eq(4).click()
        cy.get('.ant-select-dropdown').eq(4).find('.ant-select-item-option-content').then(Element=>{
            let purposeList = Element.text()
            cy.log(purposeList)
            cy.wrap(purposeList).as('purposeList')
        })
        newRecipient.saveRecipient()
        newPayment.checkSettelment('be.disabled','be.enabled')
        newPayment.proceedflow('{downarrow}{enter}','GBP')
        let amount = '125'
        newPayment.addrecipientDetail(amount, email)
        newPayment.selectFundingMethod('Push Funds')

          // ───── Intercept Quote API ─────
  cy.intercept(
            'POST',
            `https://main-api.volopa-dev.com/${Cypress.env("apiEnv")}/exchange/b2b/self/quote/temp`
        ).as('quoteApi');

  // ───── Wait for API and Compare Values ─────
  cy.wait('@quoteApi').then(({ response }) => {
    const receive = response.body.data.receive;
    const recipientReceives = response.body.data.recipient[0].receives;

    cy.wrap(recipientReceives).as('recipientReceives');
    cy.log(`Receive: ${receive}`);
    cy.log(`Recipient Receives: ${recipientReceives}`);

    expect(receive).to.eq(recipientReceives); // Final comparison
  });
            
          //Validate the selected payment purpose
          cy.get('@selectedValue').then(selectedValue => {
            cy.get(`div[class="ant-form-item"] span[title="${selectedValue}"]`)
              .should('be.visible')
              .and('contain.text', selectedValue);
            
         //Validate Purpose list
            cy.get(`div[class="ant-form-item"] span[title="${selectedValue}"]`).click()
            cy.get('.ant-select-dropdown').eq(2).find('.ant-select-item-option-content').then(Element=>{
            let list = Element.text()
            cy.log(list)
            cy.get('@purposeList').then(purposeList=>{
            expect(list).to.eq(purposeList)
            cy.get(`div[class="ant-form-item"] span[title="${selectedValue}"]`).click() 
        })
        });
          })
          // Validating recipient recived amount
          cy.get(':nth-child(4) > :nth-child(2) > .ant-typography').invoke('text').then((text) => {
            const storedText = text
            cy.wrap(storedText).as('storedText')
            cy.log(storedText)
            })
            cy.get('.ant-col > .ant-btn > span').should('be.visible').click()
            cy.get('.ant-modal-body > :nth-child(1) > .ant-col > .ant-typography').should('be.visible').should('contain.text','Payment Confirmation')
            cy.get('@storedText').then(storedText=>{
                cy.get(':nth-child(5) > .ant-col-8 > .ant-typography')
                .should('be.visible').and('contain.text',storedText)
            })
            cy.get('.ant-row-center.m-t-20 > .ant-col > .ant-space > :nth-child(2) > .ant-btn').should('be.visible').click() // pay recipient
            cy.get('.ant-modal-body > :nth-child(1) > .ant-col').should('be.visible').should('contain.text',' Payment Booked - ')
            cy.get('@storedText').then(storedText=>{
                cy.get(':nth-child(5) > .ant-col-8 > .ant-typography')
                .should('be.visible').and('contain.text',storedText)
            })
            //////newPayment.cancelPushFunds()
    })
    //Canada with usd and easy transfer
    it('TC_NP_121 - Add 1 recipient(individual) from the "Add Recipient" page with country = Canada and currency = USD. After adding, make a single payment to the recipient using GBP and easy transfer.', function(){
        signin.Login(userName, password)
        newRecipient.goToPaymentsDashborad()
        newRecipient.gotoRecipientList()
        let email = batchPayments.generateRandomString(5)+ '@yopmail.com'
        batchPayments.addRecipient('CANADA{enter}' ,'USD{enter}' ,email)
        newRecipient.addBankDetailsWithAccNo('ROYCCAT2','55555555')
        const lName = batchPayments.generateRandomString(6)
        batchPayments.individualRecipient('INDIVIDUAL PF',lName,'Canada{enter}')
        newRecipient.postCodeStateCanada()
        batchPayments.paymentPurposeGBPEUR()
        cy.get('.ant-select-selector').eq(4).click()
        cy.get('.ant-select-dropdown').eq(4).find('.ant-select-item-option-content').then(Element=>{
            let purposeList = Element.text()
            cy.log(purposeList)
            cy.wrap(purposeList).as('purposeList')
        })
        newRecipient.saveRecipient()
        newPayment.checkSettelment('be.disabled','be.enabled')
        newPayment.proceedflow('{downarrow}{enter}','GBP')
        let amount = '125'
        newPayment.addrecipientDetail(amount, email)
            
          //Validate the selected payment purpose
          cy.get('@selectedValue').then(selectedValue => {
            cy.get(`div[class="ant-form-item"] span[title="${selectedValue}"]`)
              .should('be.visible')
              .and('contain.text', selectedValue);
            
         //Validate Purpose list
            cy.get(`div[class="ant-form-item"] span[title="${selectedValue}"]`).click()
            cy.get('.ant-select-dropdown').eq(1).find('.ant-select-item-option-content').then(Element=>{
            let list = Element.text()
            cy.log(list)
            cy.get('@purposeList').then(purposeList=>{
            expect(list).to.eq(purposeList)
            cy.get(`div[class="ant-form-item"] span[title="${selectedValue}"]`).click() 
        })
        });
          })
          // Validating recipient recived amount
          cy.get(':nth-child(4) > :nth-child(2) > .ant-typography').invoke('text').then((text) => {
            const storedText = text
            cy.wrap(storedText).as('storedText')
            cy.log(storedText)
            })
            cy.get('.ant-col > .ant-btn > span').should('be.visible').click()
            cy.get('.ant-modal-body > :nth-child(1) > .ant-col > .ant-typography').should('be.visible').should('contain.text','Payment Confirmation')
            cy.get('@storedText').then(storedText=>{
                cy.get(':nth-child(5) > .ant-col-8 > .ant-typography')
                .should('be.visible').and('contain.text',storedText)
            })
            cy.get('.ant-row-center.m-t-20 > .ant-col > .ant-space > :nth-child(2) > .ant-btn').should('be.visible').click() // pay recipient
            cy.get('.ant-modal-body > :nth-child(1) > .ant-col').should('be.visible').should('contain.text',' Payment Booked - ')
            cy.get('@storedText').then(storedText=>{
                cy.get(':nth-child(5) > .ant-col-8 > .ant-typography')
                .should('be.visible').and('contain.text',storedText)
            })
            newPayment.validateYapilyFlow()
            //newPayment.cancelEasyTransfer()
    })
    it('TC_NP_122 - Add 1 recipient(business) from the "Add Recipient" page with country = Australia and currency = USD. After adding, make a single payment to the recipient using GBP and easy transfer.', function(){
        signin.Login(userName, password)
        newRecipient.goToPaymentsDashborad()
        newRecipient.gotoRecipientList()
        let email = batchPayments.generateRandomString(5)+ '@yopmail.com'
        batchPayments.addRecipient('CANADA{enter}' ,'USD{enter}' ,email)
        newRecipient.addBankDetailsWithAccNo('ROYCCAT2','55555555')
        cy.get('.ant-space > :nth-child(2) > .ant-card > .ant-card-body').should('be.visible').click()
        const bName = batchPayments.generateRandomString(6)
        batchPayments.addBusinessRecipient('BUSINESS PF'+' '+bName,'Canada{enter}')
        newRecipient.postCodeState()
        batchPayments.paymentPurposeGBPEUR()
        cy.get('.ant-select-selector').eq(4).click()
        cy.get('.ant-select-dropdown').eq(4).find('.ant-select-item-option-content').then(Element=>{
            let purposeList = Element.text()
            cy.log(purposeList)
            cy.wrap(purposeList).as('purposeList')
        })
        newRecipient.saveRecipient()
        newPayment.checkSettelment('be.disabled','be.enabled')
        newPayment.proceedflow('{downarrow}{enter}','GBP')
        let amount = '125'
        newPayment.addrecipientDetail(amount, email)
            
          //Validate the selected payment purpose
          cy.get('@selectedValue').then(selectedValue => {
            cy.get(`div[class="ant-form-item"] span[title="${selectedValue}"]`)
              .should('be.visible')
              .and('contain.text', selectedValue);
            
         //Validate Purpose list
            cy.get(`div[class="ant-form-item"] span[title="${selectedValue}"]`).click()
            cy.get('.ant-select-dropdown').eq(1).find('.ant-select-item-option-content').then(Element=>{
            let list = Element.text()
            cy.log(list)
            cy.get('@purposeList').then(purposeList=>{
            expect(list).to.eq(purposeList)
            cy.get(`div[class="ant-form-item"] span[title="${selectedValue}"]`).click() 
        })
        });
          })
          // Validating recipient recived amount
          cy.get(':nth-child(4) > :nth-child(2) > .ant-typography').invoke('text').then((text) => {
            const storedText = text
            cy.wrap(storedText).as('storedText')
            cy.log(storedText)
            })
            cy.get('.ant-col > .ant-btn > span').should('be.visible').click()
            cy.get('.ant-modal-body > :nth-child(1) > .ant-col > .ant-typography').should('be.visible').should('contain.text','Payment Confirmation')
            cy.get('@storedText').then(storedText=>{
                cy.get(':nth-child(5) > .ant-col-8 > .ant-typography')
                .should('be.visible').and('contain.text',storedText)
            })
            cy.get('.ant-row-center.m-t-20 > .ant-col > .ant-space > :nth-child(2) > .ant-btn').should('be.visible').click() // pay recipient
            cy.get('.ant-modal-body > :nth-child(1) > .ant-col').should('be.visible').should('contain.text',' Payment Booked - ')
            cy.get('@storedText').then(storedText=>{
                cy.get(':nth-child(5) > .ant-col-8 > .ant-typography')
                .should('be.visible').and('contain.text',storedText)
            })
            newPayment.validateYapilyFlow()
            //newPayment.cancelEasyTransfer()
    })

    //Singapore with usd and push funds
    it('TC_NP_123 - Add 1 recipient(individual) from the "Add Recipient" page with country = Singapore and currency = USD. After adding, make a single payment to the recipient using GBP and push funds.', function(){
        signin.Login(userName, password)
        newRecipient.goToPaymentsDashborad()
        newRecipient.gotoRecipientList()
        let email = batchPayments.generateRandomString(5)+ '@yopmail.com'
        batchPayments.addRecipient('SINGAPORE{enter}' ,'USD{enter}' ,email)
        newRecipient.addBankDetailsWithAccNo('HSBCSGS2','55555555')
        const lName = batchPayments.generateRandomString(6)
        batchPayments.individualRecipient('INDIVIDUAL Singapore',lName,'Singapore{enter}')
        batchPayments.paymentPurposeGBPEUR()
        cy.get('.ant-select-selector').eq(3).click()
        cy.get('.ant-select-dropdown').eq(3).find('.ant-select-item-option-content').then(Element=>{
            let purposeList = Element.text()
            cy.log(purposeList)
            cy.wrap(purposeList).as('purposeList')
        })
        newRecipient.saveRecipient()
        newPayment.checkSettelment('be.disabled','be.enabled')
        newPayment.proceedflow('{downarrow}{enter}','GBP')
        let amount = '125'
        newPayment.addrecipientDetail(amount, email)
        newPayment.selectFundingMethod('Push Funds')

          // ───── Intercept Quote API ─────
  cy.intercept(
            'POST',
            `https://main-api.volopa-dev.com/${Cypress.env("apiEnv")}/exchange/b2b/self/quote/temp`
        ).as('quoteApi');

  // ───── Wait for API and Compare Values ─────
  cy.wait('@quoteApi').then(({ response }) => {
    const receive = response.body.data.receive;
    const recipientReceives = response.body.data.recipient[0].receives;

    cy.wrap(recipientReceives).as('recipientReceives');
    cy.log(`Receive: ${receive}`);
    cy.log(`Recipient Receives: ${recipientReceives}`);

    expect(receive).to.eq(recipientReceives); // Final comparison
  });
            
          //Validate the selected payment purpose
          cy.get('@selectedValue').then(selectedValue => {
            cy.get(`div[class="ant-form-item"] span[title="${selectedValue}"]`)
              .should('be.visible')
              .and('contain.text', selectedValue);
            
         //Validate Purpose list
            cy.get(`div[class="ant-form-item"] span[title="${selectedValue}"]`).click()
            cy.get('.ant-select-dropdown').eq(2).find('.ant-select-item-option-content').then(Element=>{
            let list = Element.text()
            cy.log(list)
            cy.get('@purposeList').then(purposeList=>{
            expect(list).to.eq(purposeList)
            cy.get(`div[class="ant-form-item"] span[title="${selectedValue}"]`).click() 
        })
        });
          })
          // Validating recipient recived amount
          cy.get(':nth-child(4) > :nth-child(2) > .ant-typography').invoke('text').then((text) => {
            const storedText = text
            cy.wrap(storedText).as('storedText')
            cy.log(storedText)
            })
            cy.get('.ant-col > .ant-btn > span').should('be.visible').click()
            cy.get('.ant-modal-body > :nth-child(1) > .ant-col > .ant-typography').should('be.visible').should('contain.text','Payment Confirmation')
            cy.get('@storedText').then(storedText=>{
                cy.get(':nth-child(5) > .ant-col-8 > .ant-typography')
                .should('be.visible').and('contain.text',storedText)
            })
            cy.get('.ant-row-center.m-t-20 > .ant-col > .ant-space > :nth-child(2) > .ant-btn').should('be.visible').click() // pay recipient
            cy.get('.ant-modal-body > :nth-child(1) > .ant-col').should('be.visible').should('contain.text',' Payment Booked - ')
            cy.get('@storedText').then(storedText=>{
                cy.get(':nth-child(5) > .ant-col-8 > .ant-typography')
                .should('be.visible').and('contain.text',storedText)
            })
            //////newPayment.cancelPushFunds()
    })
    it('TC_NP_124 - Add 1 recipient(business) from the "Add Recipient" page with country = Singapore and currency = USD. After adding, make a single payment to the recipient using GBP and push funds.', function(){
        signin.Login(userName, password)
        newRecipient.goToPaymentsDashborad()
        newRecipient.gotoRecipientList()
        let email = batchPayments.generateRandomString(5)+ '@yopmail.com'
        batchPayments.addRecipient('SINGAPORE{enter}' ,'USD{enter}' ,email)
        newRecipient.addBankDetailsWithAccNo('HSBCSGS2','55555555')
        cy.get('.ant-space > :nth-child(2) > .ant-card > .ant-card-body').should('be.visible').click()
        const bName = batchPayments.generateRandomString(6)
        batchPayments.addBusinessRecipient('BUSINESS Singapore'+' '+bName,'Singapore{enter}')
        batchPayments.paymentPurposeGBPEUR()
        cy.get('.ant-select-selector').eq(3).click()
        cy.get('.ant-select-dropdown').eq(3).find('.ant-select-item-option-content').then(Element=>{
            let purposeList = Element.text()
            cy.log(purposeList)
            cy.wrap(purposeList).as('purposeList')
        })
        newRecipient.saveRecipient()
        newPayment.checkSettelment('be.disabled','be.enabled')
        newPayment.proceedflow('{downarrow}{enter}','GBP')
        let amount = '125'
        newPayment.addrecipientDetail(amount, email)
        newPayment.selectFundingMethod('Push Funds')

          // ───── Intercept Quote API ─────
  cy.intercept(
            'POST',
            `https://main-api.volopa-dev.com/${Cypress.env("apiEnv")}/exchange/b2b/self/quote/temp`
        ).as('quoteApi');

  // ───── Wait for API and Compare Values ─────
  cy.wait('@quoteApi').then(({ response }) => {
    const receive = response.body.data.receive;
    const recipientReceives = response.body.data.recipient[0].receives;

    cy.wrap(recipientReceives).as('recipientReceives');
    cy.log(`Receive: ${receive}`);
    cy.log(`Recipient Receives: ${recipientReceives}`);

    expect(receive).to.eq(recipientReceives); // Final comparison
  });
            
          //Validate the selected payment purpose
          cy.get('@selectedValue').then(selectedValue => {
            cy.get(`div[class="ant-form-item"] span[title="${selectedValue}"]`)
              .should('be.visible')
              .and('contain.text', selectedValue);
            
         //Validate Purpose list
            cy.get(`div[class="ant-form-item"] span[title="${selectedValue}"]`).click()
            cy.get('.ant-select-dropdown').eq(2).find('.ant-select-item-option-content').then(Element=>{
            let list = Element.text()
            cy.log(list)
            cy.get('@purposeList').then(purposeList=>{
            expect(list).to.eq(purposeList)
            cy.get(`div[class="ant-form-item"] span[title="${selectedValue}"]`).click() 
        })
        });
          })
          // Validating recipient recived amount
          cy.get(':nth-child(4) > :nth-child(2) > .ant-typography').invoke('text').then((text) => {
            const storedText = text
            cy.wrap(storedText).as('storedText')
            cy.log(storedText)
            })
            cy.get('.ant-col > .ant-btn > span').should('be.visible').click()
            cy.get('.ant-modal-body > :nth-child(1) > .ant-col > .ant-typography').should('be.visible').should('contain.text','Payment Confirmation')
            cy.get('@storedText').then(storedText=>{
                cy.get(':nth-child(5) > .ant-col-8 > .ant-typography')
                .should('be.visible').and('contain.text',storedText)
            })
            cy.get('.ant-row-center.m-t-20 > .ant-col > .ant-space > :nth-child(2) > .ant-btn').should('be.visible').click() // pay recipient
            cy.get('.ant-modal-body > :nth-child(1) > .ant-col').should('be.visible').should('contain.text',' Payment Booked - ')
            cy.get('@storedText').then(storedText=>{
                cy.get(':nth-child(5) > .ant-col-8 > .ant-typography')
                .should('be.visible').and('contain.text',storedText)
            })
            //////newPayment.cancelPushFunds()
    })
    //Singapore with usd and easy transfer
    it('TC_NP_125 - Add 1 recipient(individual) from the "Add Recipient" page with country = Singapore and currency = USD. After adding, make a single payment to the recipient using GBP and easy transfer.', function(){
        signin.Login(userName, password)
        newRecipient.goToPaymentsDashborad()
        newRecipient.gotoRecipientList()
        let email = batchPayments.generateRandomString(5)+ '@yopmail.com'
        batchPayments.addRecipient('SINGAPORE{enter}' ,'USD{enter}' ,email)
        newRecipient.addBankDetailsWithAccNo('HSBCSGS2','55555555')
        const lName = batchPayments.generateRandomString(6)
        batchPayments.individualRecipient('INDIVIDUAL PF',lName,'Singapore{enter}')
        batchPayments.paymentPurposeGBPEUR()
        cy.get('.ant-select-selector').eq(3).click()
        cy.get('.ant-select-dropdown').eq(3).find('.ant-select-item-option-content').then(Element=>{
            let purposeList = Element.text()
            cy.log(purposeList)
            cy.wrap(purposeList).as('purposeList')
        })
        newRecipient.saveRecipient()
        newPayment.checkSettelment('be.disabled','be.enabled')
        newPayment.proceedflow('{downarrow}{enter}','GBP')
        let amount = '125'
        newPayment.addrecipientDetail(amount, email)
            
          //Validate the selected payment purpose
          cy.get('@selectedValue').then(selectedValue => {
            cy.get(`div[class="ant-form-item"] span[title="${selectedValue}"]`)
              .should('be.visible')
              .and('contain.text', selectedValue);
            
         //Validate Purpose list
            cy.get(`div[class="ant-form-item"] span[title="${selectedValue}"]`).click()
            cy.get('.ant-select-dropdown').eq(1).find('.ant-select-item-option-content').then(Element=>{
            let list = Element.text()
            cy.log(list)
            cy.get('@purposeList').then(purposeList=>{
            expect(list).to.eq(purposeList)
            cy.get(`div[class="ant-form-item"] span[title="${selectedValue}"]`).click() 
        })
        });
          })
          // Validating recipient recived amount
          cy.get(':nth-child(4) > :nth-child(2) > .ant-typography').invoke('text').then((text) => {
            const storedText = text
            cy.wrap(storedText).as('storedText')
            cy.log(storedText)
            })
            cy.get('.ant-col > .ant-btn > span').should('be.visible').click()
            cy.get('.ant-modal-body > :nth-child(1) > .ant-col > .ant-typography').should('be.visible').should('contain.text','Payment Confirmation')
            cy.get('@storedText').then(storedText=>{
                cy.get(':nth-child(5) > .ant-col-8 > .ant-typography')
                .should('be.visible').and('contain.text',storedText)
            })
            cy.get('.ant-row-center.m-t-20 > .ant-col > .ant-space > :nth-child(2) > .ant-btn').should('be.visible').click() // pay recipient
            cy.get('.ant-modal-body > :nth-child(1) > .ant-col').should('be.visible').should('contain.text',' Payment Booked - ')
            cy.get('@storedText').then(storedText=>{
                cy.get(':nth-child(5) > .ant-col-8 > .ant-typography')
                .should('be.visible').and('contain.text',storedText)
            })
            newPayment.validateYapilyFlow()
            //newPayment.cancelEasyTransfer()
    })
    it('TC_NP_126 - Add 1 recipient(business) from the "Add Recipient" page with country = Singapore and currency = USD. After adding, make a single payment to the recipient using GBP and easy transfer.', function(){
        signin.Login(userName, password)
        newRecipient.goToPaymentsDashborad()
        newRecipient.gotoRecipientList()
        let email = batchPayments.generateRandomString(5)+ '@yopmail.com'
        batchPayments.addRecipient('SINGAPORE{enter}' ,'USD{enter}' ,email)
        newRecipient.addBankDetailsWithAccNo('HSBCSGS2','55555555')
        cy.get('.ant-space > :nth-child(2) > .ant-card > .ant-card-body').should('be.visible').click()
        const bName = batchPayments.generateRandomString(6)
        batchPayments.addBusinessRecipient('BUSINESS PF'+' '+bName,'singapore{enter}')
        batchPayments.paymentPurposeGBPEUR()
        cy.get('.ant-select-selector').eq(3).click()
        cy.get('.ant-select-dropdown').eq(3).find('.ant-select-item-option-content').then(Element=>{
            let purposeList = Element.text()
            cy.log(purposeList)
            cy.wrap(purposeList).as('purposeList')
        })
        newRecipient.saveRecipient()
        newPayment.checkSettelment('be.disabled','be.enabled')
        newPayment.proceedflow('{downarrow}{enter}','GBP')
        let amount = '125'
        newPayment.addrecipientDetail(amount, email)
            
          //Validate the selected payment purpose
          cy.get('@selectedValue').then(selectedValue => {
            cy.get(`div[class="ant-form-item"] span[title="${selectedValue}"]`)
              .should('be.visible')
              .and('contain.text', selectedValue);
            
         //Validate Purpose list
            cy.get(`div[class="ant-form-item"] span[title="${selectedValue}"]`).click()
            cy.get('.ant-select-dropdown').eq(1).find('.ant-select-item-option-content').then(Element=>{
            let list = Element.text()
            cy.log(list)
            cy.get('@purposeList').then(purposeList=>{
            expect(list).to.eq(purposeList)
            cy.get(`div[class="ant-form-item"] span[title="${selectedValue}"]`).click() 
        })
        });
          })
          // Validating recipient recived amount
          cy.get(':nth-child(4) > :nth-child(2) > .ant-typography').invoke('text').then((text) => {
            const storedText = text
            cy.wrap(storedText).as('storedText')
            cy.log(storedText)
            })
            cy.get('.ant-col > .ant-btn > span').should('be.visible').click()
            cy.get('.ant-modal-body > :nth-child(1) > .ant-col > .ant-typography').should('be.visible').should('contain.text','Payment Confirmation')
            cy.get('@storedText').then(storedText=>{
                cy.get(':nth-child(5) > .ant-col-8 > .ant-typography')
                .should('be.visible').and('contain.text',storedText)
            })
            cy.get('.ant-row-center.m-t-20 > .ant-col > .ant-space > :nth-child(2) > .ant-btn').should('be.visible').click() // pay recipient
            cy.get('.ant-modal-body > :nth-child(1) > .ant-col').should('be.visible').should('contain.text',' Payment Booked - ')
            cy.get('@storedText').then(storedText=>{
                cy.get(':nth-child(5) > .ant-col-8 > .ant-typography')
                .should('be.visible').and('contain.text',storedText)
            })
            newPayment.validateYapilyFlow()
            //newPayment.cancelEasyTransfer()
    })
    //Hong Kong with usd and push funds
    it('TC_NP_127 - Add 1 recipient(individual) from the "Add Recipient" page with country = Hong Kong and currency = USD. After adding, make a single payment to the recipient using GBP and push funds.', function(){
        signin.Login(userName, password)
        newRecipient.goToPaymentsDashborad()
        newRecipient.gotoRecipientList()
        let email = batchPayments.generateRandomString(5)+ '@yopmail.com'
        batchPayments.addRecipient('HONG KONG{enter}' ,'USD{enter}' ,email)
        newRecipient.addBankDetailsWithAccNo('HSBCHKHHXXX','55555555')
        const lName = batchPayments.generateRandomString(6)
        batchPayments.individualRecipient('INDIVIDUAL Hongkong',lName,'Hong Kong{enter}')
        batchPayments.paymentPurposeGBPEUR()
        cy.get('.ant-select-selector').eq(3).click()
        cy.get('.ant-select-dropdown').eq(3).find('.ant-select-item-option-content').then(Element=>{
            let purposeList = Element.text()
            cy.log(purposeList)
            cy.wrap(purposeList).as('purposeList')
        })
        newRecipient.saveRecipient()
        newPayment.checkSettelment('be.disabled','be.enabled')
        newPayment.proceedflow('{downarrow}{enter}','GBP')
        let amount = '125'
        newPayment.addrecipientDetail(amount, email)
        newPayment.selectFundingMethod('Push Funds')
        
          // ───── Intercept Quote API ─────
  cy.intercept(
            'POST',
            `https://main-api.volopa-dev.com/${Cypress.env("apiEnv")}/exchange/b2b/self/quote/temp`
        ).as('quoteApi');

  // ───── Wait for API and Compare Values ─────
  cy.wait('@quoteApi').then(({ response }) => {
    const receive = response.body.data.receive;
    const recipientReceives = response.body.data.recipient[0].receives;

    cy.wrap(recipientReceives).as('recipientReceives');
    cy.log(`Receive: ${receive}`);
    cy.log(`Recipient Receives: ${recipientReceives}`);

    expect(receive).to.eq(recipientReceives); // Final comparison
  });
          //Validate the selected payment purpose
          cy.get('@selectedValue').then(selectedValue => {
            cy.get(`div[class="ant-form-item"] span[title="${selectedValue}"]`)
              .should('be.visible')
              .and('contain.text', selectedValue);
            
         //Validate Purpose list
            cy.get(`div[class="ant-form-item"] span[title="${selectedValue}"]`).click()
            cy.get('.ant-select-dropdown').eq(2).find('.ant-select-item-option-content').then(Element=>{
            let list = Element.text()
            cy.log(list)
            cy.get('@purposeList').then(purposeList=>{
            expect(list).to.eq(purposeList)
            cy.get(`div[class="ant-form-item"] span[title="${selectedValue}"]`).click() 
        })
        });
          })
          // Validating recipient recived amount
          cy.get(':nth-child(4) > :nth-child(2) > .ant-typography').invoke('text').then((text) => {
            const storedText = text
            cy.wrap(storedText).as('storedText')
            cy.log(storedText)
            })
            cy.get('.ant-col > .ant-btn > span').should('be.visible').click()
            cy.get('.ant-modal-body > :nth-child(1) > .ant-col > .ant-typography').should('be.visible').should('contain.text','Payment Confirmation')
            cy.get('@storedText').then(storedText=>{
                cy.get(':nth-child(5) > .ant-col-8 > .ant-typography')
                .should('be.visible').and('contain.text',storedText)
            })
            cy.get('.ant-row-center.m-t-20 > .ant-col > .ant-space > :nth-child(2) > .ant-btn').should('be.visible').click() // pay recipient
            cy.get('.ant-modal-body > :nth-child(1) > .ant-col').should('be.visible').should('contain.text',' Payment Booked - ')
            cy.get('@storedText').then(storedText=>{
                cy.get(':nth-child(5) > .ant-col-8 > .ant-typography')
                .should('be.visible').and('contain.text',storedText)
            })
            //////newPayment.cancelPushFunds()
    })
    it('TC_NP_128 - Add 1 recipient(business) from the "Add Recipient" page with country = HongKong and currency = USD. After adding, make a single payment to the recipient using GBP and push funds.', function(){
        signin.Login(userName, password)
        newRecipient.goToPaymentsDashborad()
        newRecipient.gotoRecipientList()
        let email = batchPayments.generateRandomString(5)+ '@yopmail.com'
        batchPayments.addRecipient('HONG KONG{enter}' ,'USD{enter}' ,email)
        newRecipient.addBankDetailsWithAccNo('HSBCHKHHXXX','55555555')
        cy.get('.ant-space > :nth-child(2) > .ant-card > .ant-card-body').should('be.visible').click()
        const bName = batchPayments.generateRandomString(6)
        batchPayments.addBusinessRecipient('BUSINESS HongKong'+' '+bName,'Hong Kong{enter}')
        batchPayments.paymentPurposeGBPEUR()
        cy.get('.ant-select-selector').eq(3).click()
        cy.get('.ant-select-dropdown').eq(3).find('.ant-select-item-option-content').then(Element=>{
            let purposeList = Element.text()
            cy.log(purposeList)
            cy.wrap(purposeList).as('purposeList')
        })
        newRecipient.saveRecipient()
        newPayment.checkSettelment('be.disabled','be.enabled')
        newPayment.proceedflow('{downarrow}{enter}','GBP')
        let amount = '125'
        newPayment.addrecipientDetail(amount, email)
        newPayment.selectFundingMethod('Push Funds')

          // ───── Intercept Quote API ─────
  cy.intercept(
            'POST',
            `https://main-api.volopa-dev.com/${Cypress.env("apiEnv")}/exchange/b2b/self/quote/temp`
        ).as('quoteApi');

  // ───── Wait for API and Compare Values ─────
  cy.wait('@quoteApi').then(({ response }) => {
    const receive = response.body.data.receive;
    const recipientReceives = response.body.data.recipient[0].receives;

    cy.wrap(recipientReceives).as('recipientReceives');
    cy.log(`Receive: ${receive}`);
    cy.log(`Recipient Receives: ${recipientReceives}`);

    expect(receive).to.eq(recipientReceives); // Final comparison
  });
            
          //Validate the selected payment purpose
          cy.get('@selectedValue').then(selectedValue => {
            cy.get(`div[class="ant-form-item"] span[title="${selectedValue}"]`)
              .should('be.visible')
              .and('contain.text', selectedValue);
            
         //Validate Purpose list
            cy.get(`div[class="ant-form-item"] span[title="${selectedValue}"]`).click()
            cy.get('.ant-select-dropdown').eq(2).find('.ant-select-item-option-content').then(Element=>{
            let list = Element.text()
            cy.log(list)
            cy.get('@purposeList').then(purposeList=>{
            expect(list).to.eq(purposeList)
            cy.get(`div[class="ant-form-item"] span[title="${selectedValue}"]`).click() 
        })
        });
          })
          // Validating recipient recived amount
          cy.get(':nth-child(4) > :nth-child(2) > .ant-typography').invoke('text').then((text) => {
            const storedText = text
            cy.wrap(storedText).as('storedText')
            cy.log(storedText)
            })
            cy.get('.ant-col > .ant-btn > span').should('be.visible').click()
            cy.get('.ant-modal-body > :nth-child(1) > .ant-col > .ant-typography').should('be.visible').should('contain.text','Payment Confirmation')
            cy.get('@storedText').then(storedText=>{
                cy.get(':nth-child(5) > .ant-col-8 > .ant-typography')
                .should('be.visible').and('contain.text',storedText)
            })
            cy.get('.ant-row-center.m-t-20 > .ant-col > .ant-space > :nth-child(2) > .ant-btn').should('be.visible').click() // pay recipient
            cy.get('.ant-modal-body > :nth-child(1) > .ant-col').should('be.visible').should('contain.text',' Payment Booked - ')
            cy.get('@storedText').then(storedText=>{
                cy.get(':nth-child(5) > .ant-col-8 > .ant-typography')
                .should('be.visible').and('contain.text',storedText)
            })
            //////newPayment.cancelPushFunds()
    })

    //Hong Kong with usd and easy transfer
    it('TC_NP_129 - Add 1 recipient(individual) from the "Add Recipient" page with country = HongKong and currency = USD. After adding, make a single payment to the recipient using GBP and easy transfer.', function(){
        signin.Login(userName, password)
        newRecipient.goToPaymentsDashborad()
        newRecipient.gotoRecipientList()
        let email = batchPayments.generateRandomString(5)+ '@yopmail.com'
        batchPayments.addRecipient('HONG KONG{enter}' ,'USD{enter}' ,email)
        newRecipient.addBankDetailsWithAccNo('HSBCHKHHXXX','55555555')
        const lName = batchPayments.generateRandomString(6)
        batchPayments.individualRecipient('INDIVIDUAL PF',lName,'HONG KONG{enter}')
        batchPayments.paymentPurposeGBPEUR()
        cy.get('.ant-select-selector').eq(3).click()
        cy.get('.ant-select-dropdown').eq(3).find('.ant-select-item-option-content').then(Element=>{
            let purposeList = Element.text()
            cy.log(purposeList)
            cy.wrap(purposeList).as('purposeList')
        })
        newRecipient.saveRecipient()
        newPayment.checkSettelment('be.disabled','be.enabled')
        newPayment.proceedflow('{downarrow}{enter}','GBP')
        let amount = '125'
        newPayment.addrecipientDetail(amount, email)
            
          //Validate the selected payment purpose
          cy.get('@selectedValue').then(selectedValue => {
            cy.get(`div[class="ant-form-item"] span[title="${selectedValue}"]`)
              .should('be.visible')
              .and('contain.text', selectedValue);
            
         //Validate Purpose list
            cy.get(`div[class="ant-form-item"] span[title="${selectedValue}"]`).click()
            cy.get('.ant-select-dropdown').eq(1).find('.ant-select-item-option-content').then(Element=>{
            let list = Element.text()
            cy.log(list)
            cy.get('@purposeList').then(purposeList=>{
            expect(list).to.eq(purposeList)
            cy.get(`div[class="ant-form-item"] span[title="${selectedValue}"]`).click() 
        })
        });
          })
          // Validating recipient recived amount
          cy.get(':nth-child(4) > :nth-child(2) > .ant-typography').invoke('text').then((text) => {
            const storedText = text
            cy.wrap(storedText).as('storedText')
            cy.log(storedText)
            })
            cy.get('.ant-col > .ant-btn > span').should('be.visible').click()
            cy.get('.ant-modal-body > :nth-child(1) > .ant-col > .ant-typography').should('be.visible').should('contain.text','Payment Confirmation')
            cy.get('@storedText').then(storedText=>{
                cy.get(':nth-child(5) > .ant-col-8 > .ant-typography')
                .should('be.visible').and('contain.text',storedText)
            })
            cy.get('.ant-row-center.m-t-20 > .ant-col > .ant-space > :nth-child(2) > .ant-btn').should('be.visible').click() // pay recipient
            cy.get('.ant-modal-body > :nth-child(1) > .ant-col').should('be.visible').should('contain.text',' Payment Booked - ')
            cy.get('@storedText').then(storedText=>{
                cy.get(':nth-child(5) > .ant-col-8 > .ant-typography')
                .should('be.visible').and('contain.text',storedText)
            })
            newPayment.validateYapilyFlow()
            //newPayment.cancelEasyTransfer()
    })
    it('TC_NP_130 - Add 1 recipient(business) from the "Add Recipient" page with country = Hong Kong and currency = USD. After adding, make a single payment to the recipient using GBP and easy transfer.', function(){
        signin.Login(userName, password)
        newRecipient.goToPaymentsDashborad()
        newRecipient.gotoRecipientList()
        let email = batchPayments.generateRandomString(5)+ '@yopmail.com'
        batchPayments.addRecipient('HONG KONG{enter}' ,'USD{enter}' ,email)
        newRecipient.addBankDetailsWithAccNo('HSBCHKHHXXX','55555555')
        cy.get('.ant-space > :nth-child(2) > .ant-card > .ant-card-body').should('be.visible').click()
        const bName = batchPayments.generateRandomString(6)
        batchPayments.addBusinessRecipient('BUSINESS PF'+' '+bName,'Hong Kong{enter}')
        batchPayments.paymentPurposeGBPEUR()
        cy.get('.ant-select-selector').eq(3).click()
        cy.get('.ant-select-dropdown').eq(3).find('.ant-select-item-option-content').then(Element=>{
            let purposeList = Element.text()
            cy.log(purposeList)
            cy.wrap(purposeList).as('purposeList')
        })
        newRecipient.saveRecipient()
        newPayment.checkSettelment('be.disabled','be.enabled')
        newPayment.proceedflow('{downarrow}{enter}','GBP')
        let amount = '125'
        newPayment.addrecipientDetail(amount, email)
            
          //Validate the selected payment purpose
          cy.get('@selectedValue').then(selectedValue => {
            cy.get(`div[class="ant-form-item"] span[title="${selectedValue}"]`)
              .should('be.visible')
              .and('contain.text', selectedValue);
            
         //Validate Purpose list
            cy.get(`div[class="ant-form-item"] span[title="${selectedValue}"]`).click()
            cy.get('.ant-select-dropdown').eq(1).find('.ant-select-item-option-content').then(Element=>{
            let list = Element.text()
            cy.log(list)
            cy.get('@purposeList').then(purposeList=>{
            expect(list).to.eq(purposeList)
            cy.get(`div[class="ant-form-item"] span[title="${selectedValue}"]`).click() 
        })
        });
          })
          // Validating recipient recived amount
          cy.get(':nth-child(4) > :nth-child(2) > .ant-typography').invoke('text').then((text) => {
            const storedText = text
            cy.wrap(storedText).as('storedText')
            cy.log(storedText)
            })
            cy.get('.ant-col > .ant-btn > span').should('be.visible').click()
            cy.get('.ant-modal-body > :nth-child(1) > .ant-col > .ant-typography').should('be.visible').should('contain.text','Payment Confirmation')
            cy.get('@storedText').then(storedText=>{
                cy.get(':nth-child(5) > .ant-col-8 > .ant-typography')
                .should('be.visible').and('contain.text',storedText)
            })
            cy.get('.ant-row-center.m-t-20 > .ant-col > .ant-space > :nth-child(2) > .ant-btn').should('be.visible').click() // pay recipient
            cy.get('.ant-modal-body > :nth-child(1) > .ant-col').should('be.visible').should('contain.text',' Payment Booked - ')
            cy.get('@storedText').then(storedText=>{
                cy.get(':nth-child(5) > .ant-col-8 > .ant-typography')
                .should('be.visible').and('contain.text',storedText)
            })
            newPayment.validateYapilyFlow()
            //newPayment.cancelEasyTransfer()
    })
    //Mexico with usd and push funds
    it('TC_NP_131 - Add 1 recipient(individual) from the "Add Recipient" page with country = Mexico and currency = USD. After adding, make a single payment to the recipient using GBP and push funds.', function(){
        signin.Login(userName, password)
        newRecipient.goToPaymentsDashborad()
        newRecipient.gotoRecipientList()
        let email = batchPayments.generateRandomString(5)+ '@yopmail.com'
        batchPayments.addRecipient('MEXICO{enter}' ,'USD{enter}' ,email)
        newRecipient.addBankDetailsWithClabe('AFIRMXMT','002010077777777771')
        const lName = batchPayments.generateRandomString(6)
        batchPayments.individualRecipient('INDIVIDUAL Mexico',lName,'Mexico{enter}')
        newRecipient.postCodeState()
        batchPayments.paymentPurposeGBPEUR()
        cy.get('.ant-select-selector').eq(4).click()
        cy.get('.ant-select-dropdown').eq(4).find('.ant-select-item-option-content').then(Element=>{
            let purposeList = Element.text()
            cy.log(purposeList)
            cy.wrap(purposeList).as('purposeList')
        })
        newRecipient.saveRecipient()
        newPayment.checkSettelment('be.disabled','be.enabled')
        newPayment.proceedflow('{downarrow}{enter}','GBP')
        let amount = '225'
        newPayment.addrecipientDetail(amount, email)
        newPayment.selectFundingMethod('Push Funds')

          // ───── Intercept Quote API ─────
  cy.intercept(
            'POST',
            `https://main-api.volopa-dev.com/${Cypress.env("apiEnv")}/exchange/b2b/self/quote/temp`
        ).as('quoteApi');

  // ───── Wait for API and Compare Values ─────
  cy.wait('@quoteApi').then(({ response }) => {
    const receive = response.body.data.receive;
    const recipientReceives = response.body.data.recipient[0].receives;

    cy.wrap(recipientReceives).as('recipientReceives');
    cy.log(`Receive: ${receive}`);
    cy.log(`Recipient Receives: ${recipientReceives}`);

    expect(receive).to.eq(recipientReceives); // Final comparison
  });
            
          //Validate the selected payment purpose
          cy.get('@selectedValue').then(selectedValue => {
            cy.get(`div[class="ant-form-item"] span[title="${selectedValue}"]`)
              .should('be.visible')
              .and('contain.text', selectedValue);
            
         //Validate Purpose list
            cy.get(`div[class="ant-form-item"] span[title="${selectedValue}"]`).click()
            cy.get('.ant-select-dropdown').eq(2).find('.ant-select-item-option-content').then(Element=>{
            let list = Element.text()
            cy.log(list)
            cy.get('@purposeList').then(purposeList=>{
            expect(list).to.eq(purposeList)
            cy.get(`div[class="ant-form-item"] span[title="${selectedValue}"]`).click() 
        })
        });
          })
          // Validating recipient recived amount
          cy.get(':nth-child(4) > :nth-child(2) > .ant-typography').invoke('text').then((text) => {
            const storedText = text
            cy.wrap(storedText).as('storedText')
            cy.log(storedText)
            })
            cy.get('.ant-col > .ant-btn > span').should('be.visible').click()
            cy.get('.ant-modal-body > :nth-child(1) > .ant-col > .ant-typography').should('be.visible').should('contain.text','Payment Confirmation')
            cy.get('@storedText').then(storedText=>{
                cy.get(':nth-child(5) > .ant-col-8 > .ant-typography')
                .should('be.visible').and('contain.text',storedText)
            })
            cy.get('.ant-row-center.m-t-20 > .ant-col > .ant-space > :nth-child(2) > .ant-btn').should('be.visible').click() // pay recipient
            cy.get('.ant-modal-body > :nth-child(1) > .ant-col').should('be.visible').should('contain.text',' Payment Booked - ')
            cy.get('@storedText').then(storedText=>{
                cy.get(':nth-child(5) > .ant-col-8 > .ant-typography')
                .should('be.visible').and('contain.text',storedText)
            })
            //////newPayment.cancelPushFunds()
    })
    it('TC_NP_132 - Add 1 recipient(business) from the "Add Recipient" page with country = Mexico and currency = USD. After adding, make a single payment to the recipient using GBP and push funds.', function(){
        signin.Login(userName, password)
        newRecipient.goToPaymentsDashborad()
        newRecipient.gotoRecipientList()
        let email = batchPayments.generateRandomString(5)+ '@yopmail.com'
        batchPayments.addRecipient('MEXICO{enter}' ,'USD{enter}' ,email)
        newRecipient.addBankDetailsWithClabe('AFIRMXMT','002010077777777771')
        cy.get('.ant-space > :nth-child(2) > .ant-card > .ant-card-body').should('be.visible').click()
        const bName = batchPayments.generateRandomString(6)
        batchPayments.addBusinessRecipient('BUSINESS Mexico'+' '+bName,'Mexico{enter}')
        newRecipient.postCodeState()
        batchPayments.paymentPurposeGBPEUR()
        cy.get('.ant-select-selector').eq(4).click()
        cy.get('.ant-select-dropdown').eq(4).find('.ant-select-item-option-content').then(Element=>{
            let purposeList = Element.text()
            cy.log(purposeList)
            cy.wrap(purposeList).as('purposeList')
        })
        newRecipient.saveRecipient()
        newPayment.checkSettelment('be.disabled','be.enabled')
        newPayment.proceedflow('{downarrow}{enter}','GBP')
        let amount = '125'
        newPayment.addrecipientDetail(amount, email)
        newPayment.selectFundingMethod('Push Funds')

          // ───── Intercept Quote API ─────
  cy.intercept(
            'POST',
            `https://main-api.volopa-dev.com/${Cypress.env("apiEnv")}/exchange/b2b/self/quote/temp`
        ).as('quoteApi');

  // ───── Wait for API and Compare Values ─────
  cy.wait('@quoteApi').then(({ response }) => {
    const receive = response.body.data.receive;
    const recipientReceives = response.body.data.recipient[0].receives;

    cy.wrap(recipientReceives).as('recipientReceives');
    cy.log(`Receive: ${receive}`);
    cy.log(`Recipient Receives: ${recipientReceives}`);

    expect(receive).to.eq(recipientReceives); // Final comparison
  });
            
          //Validate the selected payment purpose
          cy.get('@selectedValue').then(selectedValue => {
            cy.get(`div[class="ant-form-item"] span[title="${selectedValue}"]`)
              .should('be.visible')
              .and('contain.text', selectedValue);
            
         //Validate Purpose list
            cy.get(`div[class="ant-form-item"] span[title="${selectedValue}"]`).click()
            cy.get('.ant-select-dropdown').eq(2).find('.ant-select-item-option-content').then(Element=>{
            let list = Element.text()
            cy.log(list)
            cy.get('@purposeList').then(purposeList=>{
            expect(list).to.eq(purposeList)
            cy.get(`div[class="ant-form-item"] span[title="${selectedValue}"]`).click() 
        })
        });
          })
          // Validating recipient recived amount
          cy.get(':nth-child(4) > :nth-child(2) > .ant-typography').invoke('text').then((text) => {
            const storedText = text
            cy.wrap(storedText).as('storedText')
            cy.log(storedText)
            })
            cy.get('.ant-col > .ant-btn > span').should('be.visible').click()
            cy.get('.ant-modal-body > :nth-child(1) > .ant-col > .ant-typography').should('be.visible').should('contain.text','Payment Confirmation')
            cy.get('@storedText').then(storedText=>{
                cy.get(':nth-child(5) > .ant-col-8 > .ant-typography')
                .should('be.visible').and('contain.text',storedText)
            })
            cy.get('.ant-row-center.m-t-20 > .ant-col > .ant-space > :nth-child(2) > .ant-btn').should('be.visible').click() // pay recipient
            cy.get('.ant-modal-body > :nth-child(1) > .ant-col').should('be.visible').should('contain.text',' Payment Booked - ')
            cy.get('@storedText').then(storedText=>{
                cy.get(':nth-child(5) > .ant-col-8 > .ant-typography')
                .should('be.visible').and('contain.text',storedText)
            })
            //////newPayment.cancelPushFunds()
    })
    //Mexico with usd and easy transfer
    it('TC_NP_133 - Add 1 recipient(individual) from the "Add Recipient" page with country = Mexico and currency = USD. After adding, make a single payment to the recipient using GBP and easy transfer.', function(){
        signin.Login(userName, password)
        newRecipient.goToPaymentsDashborad()
        newRecipient.gotoRecipientList()
        let email = batchPayments.generateRandomString(5)+ '@yopmail.com'
        batchPayments.addRecipient('MEXICO{enter}' ,'USD{enter}' ,email)
        newRecipient.addBankDetailsWithClabe('AFIRMXMT','002010077777777771')
        const lName = batchPayments.generateRandomString(6)
        batchPayments.individualRecipient('INDIVIDUAL PF',lName,'Mexico{enter}')
        newRecipient.postCodeState()
        batchPayments.paymentPurposeGBPEUR()
        cy.get('.ant-select-selector').eq(3).click()
        cy.get('.ant-select-dropdown').eq(3).find('.ant-select-item-option-content').then(Element=>{
            let purposeList = Element.text()
            cy.log(purposeList)
            cy.wrap(purposeList).as('purposeList')
        })
        newRecipient.saveRecipient()
        newPayment.checkSettelment('be.disabled','be.enabled')
        newPayment.proceedflow('{downarrow}{enter}','GBP')
        let amount = '125'
        newPayment.addrecipientDetail(amount, email)
            
          //Validate the selected payment purpose
          cy.get('@selectedValue').then(selectedValue => {
            cy.get(`div[class="ant-form-item"] span[title="${selectedValue}"]`)
              .should('be.visible')
              .and('contain.text', selectedValue);
            
         //Validate Purpose list
            cy.get(`div[class="ant-form-item"] span[title="${selectedValue}"]`).click()
            cy.get('.ant-select-dropdown').eq(1).find('.ant-select-item-option-content').then(Element=>{
            let list = Element.text()
            cy.log(list)
            cy.get('@purposeList').then(purposeList=>{
            expect(list).to.eq(purposeList)
            cy.get(`div[class="ant-form-item"] span[title="${selectedValue}"]`).click() 
        })
        });
          })
          // Validating recipient recived amount
          cy.get(':nth-child(4) > :nth-child(2) > .ant-typography').invoke('text').then((text) => {
            const storedText = text
            cy.wrap(storedText).as('storedText')
            cy.log(storedText)
            })
            cy.get('.ant-col > .ant-btn > span').should('be.visible').click()
            cy.get('.ant-modal-body > :nth-child(1) > .ant-col > .ant-typography').should('be.visible').should('contain.text','Payment Confirmation')
            cy.get('@storedText').then(storedText=>{
                cy.get(':nth-child(5) > .ant-col-8 > .ant-typography')
                .should('be.visible').and('contain.text',storedText)
            })
            cy.get('.ant-row-center.m-t-20 > .ant-col > .ant-space > :nth-child(2) > .ant-btn').should('be.visible').click() // pay recipient
            cy.get('.ant-modal-body > :nth-child(1) > .ant-col').should('be.visible').should('contain.text',' Payment Booked - ')
            cy.get('@storedText').then(storedText=>{
                cy.get(':nth-child(5) > .ant-col-8 > .ant-typography')
                .should('be.visible').and('contain.text',storedText)
            })
            newPayment.validateYapilyFlow()
            //newPayment.cancelEasyTransfer()
    })
    it('TC_NP_134 - Add 1 recipient(business) from the "Add Recipient" page with country = Mexico and currency = USD. After adding, make a single payment to the recipient using GBP and easy transfer.', function(){
        signin.Login(userName, password)
        newRecipient.goToPaymentsDashborad()
        newRecipient.gotoRecipientList()
        let email = batchPayments.generateRandomString(5)+ '@yopmail.com'
        batchPayments.addRecipient('MEXICO{enter}' ,'USD{enter}' ,email)
        newRecipient.addBankDetailsWithClabe('AFIRMXMT','002010077777777771')
        cy.get('.ant-space > :nth-child(2) > .ant-card > .ant-card-body').should('be.visible').click()
        const bName = batchPayments.generateRandomString(6)
        batchPayments.addBusinessRecipient('BUSINESS PF'+' '+bName,'Mexico{enter}')
        newRecipient.postCodeState()
        batchPayments.paymentPurposeGBPEUR()
        cy.get('.ant-select-selector').eq(3).click()
        cy.get('.ant-select-dropdown').eq(3).find('.ant-select-item-option-content').then(Element=>{
            let purposeList = Element.text()
            cy.log(purposeList)
            cy.wrap(purposeList).as('purposeList')
        })
        newRecipient.saveRecipient()
        newPayment.checkSettelment('be.disabled','be.enabled')
        newPayment.proceedflow('{downarrow}{enter}','GBP')
        let amount = '125'
        newPayment.addrecipientDetail(amount, email)
            
          //Validate the selected payment purpose
          cy.get('@selectedValue').then(selectedValue => {
            cy.get(`div[class="ant-form-item"] span[title="${selectedValue}"]`)
              .should('be.visible')
              .and('contain.text', selectedValue);
            
         //Validate Purpose list
            cy.get(`div[class="ant-form-item"] span[title="${selectedValue}"]`).click()
            cy.get('.ant-select-dropdown').eq(1).find('.ant-select-item-option-content').then(Element=>{
            let list = Element.text()
            cy.log(list)
            cy.get('@purposeList').then(purposeList=>{
            expect(list).to.eq(purposeList)
            cy.get(`div[class="ant-form-item"] span[title="${selectedValue}"]`).click() 
        })
        });
          })
          // Validating recipient recived amount
          cy.get(':nth-child(4) > :nth-child(2) > .ant-typography').invoke('text').then((text) => {
            const storedText = text
            cy.wrap(storedText).as('storedText')
            cy.log(storedText)
            })
            cy.get('.ant-col > .ant-btn > span').should('be.visible').click()
            cy.get('.ant-modal-body > :nth-child(1) > .ant-col > .ant-typography').should('be.visible').should('contain.text','Payment Confirmation')
            cy.get('@storedText').then(storedText=>{
                cy.get(':nth-child(5) > .ant-col-8 > .ant-typography')
                .should('be.visible').and('contain.text',storedText)
            })
            cy.get('.ant-row-center.m-t-20 > .ant-col > .ant-space > :nth-child(2) > .ant-btn').should('be.visible').click() // pay recipient
            cy.get('.ant-modal-body > :nth-child(1) > .ant-col').should('be.visible').should('contain.text',' Payment Booked - ')
            cy.get('@storedText').then(storedText=>{
                cy.get(':nth-child(5) > .ant-col-8 > .ant-typography')
                .should('be.visible').and('contain.text',storedText)
            })
            newPayment.validateYapilyFlow()
            //newPayment.cancelEasyTransfer()
    })
    //Before executing Approval workflow cases, make sure no approval rule is set
    // change the approver, login user if need to run on differnt client
    //Approval workflow for single Payment
    xit('Verify that approval workflow is working correctly for GBP using push funds for single payments.', function () {
        signin.Login(userName, password);
    
        // steps to add approval rule
        newPayment.goToSetting();
        newPayment.goToNotificationSetting();
        newPayment.goToApprovalWorkFlow();
        newPayment.setCurrencyforApproval('{enter}', 'GBP', '300');
        newPayment.setApprover('hamza{enter}');
        newPayment.saveApprovalRule();
    
        // create a payment for approval
        newRecipient.goToPaymentsDashborad();
        newRecipient.gotoRecipientList();
        let email = batchPayments.generateRandomString(5) + '@yopmail.com';
        batchPayments.addRecipient('United States{enter}', 'USD{enter}', email);
        newRecipient.addBankDetailsWithAccNo('MMMCUS44', '55555555');
        cy.get('#aba').type('026009593');
        const lName = batchPayments.generateRandomString(6);
        batchPayments.individualRecipient('INDIVIDUAL USD PF', lName, 'UNITED States{enter}');
        newRecipient.postCodeState();
        batchPayments.paymentPurposeGBPEUR();
    
        cy.get('.ant-select-selector').eq(3).click();
        cy.get('.ant-select-dropdown').eq(3).find('.ant-select-item-option-content').then(Element => {
            let purposeList = Element.text();
            cy.log(purposeList);
            cy.wrap(purposeList).as('purposeList');
        });
    
        newRecipient.saveRecipient();
        newPayment.checkSettelment('be.enabled', 'be.enabled');
        newPayment.proceedflow('{downarrow}{enter}', 'GBP');
    
        let amount = '400';
        newPayment.addrecipientDetail(amount, email);
        newPayment.selectFundingMethod('Push Funds');
    
        // Validate the selected payment purpose
        cy.get('@selectedValue').then(selectedValue => {
            cy.get('.ant-col-sm-20 > :nth-child(2) > :nth-child(1) > :nth-child(1) > .ant-row > .ant-col > .ant-form-item-control-input > .ant-form-item-control-input-content > .ant-select > .ant-select-selector')
                .should('be.visible').and('contain.text', selectedValue);
        });
    
        // Validate Purpose on Single payment
        cy.get('.ant-select-selector').eq(3).click();
        cy.get('.ant-select-dropdown').eq(2).find('.ant-select-item-option-content').then(Element => {
            let list = Element.text();
            cy.log(list);
            cy.get('@purposeList').then(purposeList => {
                expect(list).to.eq(purposeList);
                cy.get('.ant-select-selector').eq(3).click();
            });
        });
    
        // Validating recipient received amount
        cy.get(':nth-child(4) > :nth-child(2) > .ant-typography').invoke('text').then((text) => {
            const storedText = text;
            cy.wrap(storedText).as('storedText');
            cy.log(storedText);
        });
    
        cy.get('.ant-col > .ant-btn > span').should('be.visible').click();
        cy.get('.ant-modal-body > :nth-child(1) > .ant-col > .ant-typography').should('be.visible').should('contain.text', 'Payment Confirmation');
    
        cy.get('@storedText').then(storedText => {
            cy.get(':nth-child(5) > .ant-col-8 > .ant-typography')
                .should('be.visible').and('contain.text', storedText);
        });
    
        cy.get('.ant-row-center.m-t-20 > .ant-col > .ant-space > :nth-child(2) > .ant-btn')
            .should('be.visible')
            .should('contain.text', 'Submit for Approval')
            .click(); // pay recipient
    
        cy.get('.ant-modal-body > :nth-child(1) > .ant-col')
            .should('be.visible')
            .should('contain.text', 'Submitted for Approval');
    
        // Get the selected recipient name and store it as an alias
        cy.get('[style="margin-left: -12px; margin-right: -12px; row-gap: 12px;"] > :nth-child(2) > :nth-child(1) > :nth-child(2) > .ant-typography')
            .invoke('text')
            .then(text => {
                cy.wrap(text.trim()).as('selectedRecipient');
            });
    
        cy.get('@storedText').then(storedText => {
            cy.get(':nth-child(5) > .ant-col-8 > .ant-typography')
                .should('be.visible').and('contain.text', storedText);
        });
    
        // Return to payment dashboard
        newPayment.returnToPaymentDashboard();
        newPayment.goToDraftPayment();
    
        // validate the draft payment for submitter
        cy.get('@selectedRecipient').then(storedText => {
            cy.get('.ant-table-row > :nth-child(5)')
                .should('be.visible')
                .and('contain.text', storedText);
        });
    
        cy.get('@storedText').then(storedText => {
            cy.get('.ant-table-row > :nth-child(7)')
                .should('be.visible').and('contain.text', storedText);
        });
    
        // logout the submitter user
        newPayment.logout();
    
        // Login as Approver User
        signin.Login('hamzaQA3@volopa.com', password);
        newPayment.goToNotification();
        newPayment.approvalNotification();
    
        // Validation on payment confirmation modal Approver user
        cy.get('.ant-modal-body > :nth-child(1) > .ant-col > .ant-typography')
            .should('be.visible')
            .should('contain.text', 'Payment Confirmation');
    
        cy.get('@storedText').then(storedText => {
            cy.get(':nth-child(5) > .ant-col-8 > .ant-typography')
                .should('be.visible').and('contain.text', storedText);
        });
    
        cy.get('@selectedRecipient').then(storedText => {
            cy.get('[style="margin-left: -12px; margin-right: -12px; row-gap: 12px;"] > :nth-child(2) > :nth-child(1) > :nth-child(2) > .ant-typography')
                .should('be.visible')
                .and('contain.text', storedText);
        });
    
        // Approving the payment
        newPayment.approvingSinglePayment();
        newPayment.validateApprovedPayment();
    
        // validate the payment history for approver
        cy.get('@selectedRecipient').then(storedText => {
            cy.get('[data-row-key="0"] > :nth-child(6)')
                .should('be.visible')
                .and('contain.text', storedText);
        });
    
        cy.get('@storedText').then(storedText => {
            cy.get('[data-row-key="0"] > :nth-child(8) > .ant-space')
                .should('be.visible').and('contain.text', storedText);
        });
        // Steps to remove the approval rule
    newPayment.goToSetting();
    newPayment.goToNotificationSetting();
    newPayment.goToApprovalWorkFlow();
    newPayment.removeApprovalrule()
    newPayment.saveApprovalRule();
    });
    xit('Verify that approval workflow is working correctly for GBP using Easy Transfer for single payment.', function () {
        signin.Login('Corpay_test1@volopa.com', password);
    
        // steps to add approval rule
        newPayment.goToSetting();
        newPayment.goToNotificationSetting();
        newPayment.goToApprovalWorkFlow();
        newPayment.setCurrencyforApproval('{enter}', 'GBP', '300');
        newPayment.setApprover('Approver{enter}');
        newPayment.saveApprovalRule();
    
        // create a payment for approval
        newRecipient.goToPaymentsDashborad();
        newRecipient.gotoRecipientList();
        let email = batchPayments.generateRandomString(5) + '@yopmail.com';
        batchPayments.addRecipient('United States{enter}', 'USD{enter}', email);
        newRecipient.addBankDetailsWithAccNo('MMMCUS44', '55555555');
        cy.get('#aba').type('026009593');
        const lName = batchPayments.generateRandomString(6);
        batchPayments.individualRecipient('INDIVIDUAL USD PF', lName, 'UNITED States{enter}');
        newRecipient.postCodeState();
        batchPayments.paymentPurposeGBPEUR();
    
        cy.get('.ant-select-selector').eq(3).click();
        cy.get('.ant-select-dropdown').eq(3).find('.ant-select-item-option-content').then(Element => {
            let purposeList = Element.text();
            cy.log(purposeList);
            cy.wrap(purposeList).as('purposeList');
        });
    
        newRecipient.saveRecipient();
        newPayment.checkSettelment('be.enabled', 'be.enabled');
        newPayment.proceedflow('{downarrow}{enter}', 'GBP');
    
        let amount = '310';
        newPayment.addrecipientDetail(amount, email);
        newPayment.selectFundingMethod('Easy Transfer');
    
        // Validate the selected payment purpose
        cy.get('@selectedValue').then(selectedValue => {
            cy.get('.ant-col-sm-20 > :nth-child(2) > :nth-child(1) > :nth-child(1) > .ant-row > .ant-col > .ant-form-item-control-input > .ant-form-item-control-input-content > .ant-select > .ant-select-selector')
                .should('be.visible').and('contain.text', selectedValue);
        });
    
        // Validate Purpose on Single payment
        cy.get('.ant-select-selector').eq(3).click();
        cy.get('.ant-select-dropdown').eq(2).find('.ant-select-item-option-content').then(Element => {
            let list = Element.text();
            cy.log(list);
            cy.get('@purposeList').then(purposeList => {
                expect(list).to.eq(purposeList);
                cy.get('.ant-select-selector').eq(3).click();
            });
        });
    
        // Validating recipient received amount
        cy.get(':nth-child(4) > :nth-child(2) > .ant-typography').invoke('text').then((text) => {
            const storedText = text;
            cy.wrap(storedText).as('storedText');
            cy.log(storedText);
        });
    
        cy.get('.ant-col > .ant-btn > span').should('be.visible').click();
        cy.get('.ant-modal-body > :nth-child(1) > .ant-col > .ant-typography').should('be.visible').should('contain.text', 'Payment Confirmation');
    
        cy.get('@storedText').then(storedText => {
            cy.get(':nth-child(5) > .ant-col-8 > .ant-typography')
                .should('be.visible').and('contain.text', storedText);
        });
    
        cy.get('.ant-row-center.m-t-20 > .ant-col > .ant-space > :nth-child(2) > .ant-btn')
            .should('be.visible')
            .should('contain.text', 'Submit for Approval')
            .click(); // pay recipient
    
        cy.get('.ant-modal-body > :nth-child(1) > .ant-col')
            .should('be.visible')
            .should('contain.text', 'Submitted for Approval');
    
        // Get the selected recipient name and store it as an alias
        cy.get('[style="margin-left: -12px; margin-right: -12px; row-gap: 12px;"] > :nth-child(2) > :nth-child(1) > :nth-child(2) > .ant-typography')
            .invoke('text')
            .then(text => {
                cy.wrap(text.trim()).as('selectedRecipient');
            });
    
        cy.get('@storedText').then(storedText => {
            cy.get(':nth-child(5) > .ant-col-8 > .ant-typography')
                .should('be.visible').and('contain.text', storedText);
        });
    
        // Return to payment dashboard
        newPayment.returnToPaymentDashboard();
        newPayment.goToDraftPayment();
    
        // validate the draft payment for submitter
        cy.get('@selectedRecipient').then(storedText => {
            cy.get('.ant-table-row > :nth-child(5)')
                .should('be.visible')
                .and('contain.text', storedText);
        });
    
        cy.get('@storedText').then(storedText => {
            cy.get('.ant-table-row > :nth-child(7)')
                .should('be.visible').and('contain.text', storedText);
        });
    
        // logout the submitter user
        newPayment.logout();
    
        // Login as Approver User
        signin.Login('corpayapprover@volopa.com', password);
        newPayment.goToNotification();
        newPayment.approvalNotification();
    
        // Validation on payment confirmation modal Approver user
        cy.get('.ant-modal-body > :nth-child(1) > .ant-col > .ant-typography')
            .should('be.visible')
            .should('contain.text', 'Payment Confirmation');
    
        cy.get('@storedText').then(storedText => {
            cy.get(':nth-child(5) > .ant-col-8 > .ant-typography')
                .should('be.visible').and('contain.text', storedText);
        });
    
        cy.get('@selectedRecipient').then(storedText => {
            cy.get('[style="margin-left: -12px; margin-right: -12px; row-gap: 12px;"] > :nth-child(2) > :nth-child(1) > :nth-child(2) > .ant-typography')
                .should('be.visible')
                .and('contain.text', storedText);
        });
    
        // Approving the payment
        newPayment.approvingSinglePayment();
        newPayment.validateYapilyFlow()
        newPayment.validateApprovedEasyTransferPayment()
    
        // validate the payment history for approver
        cy.get('@selectedRecipient').then(storedText => {
            cy.get('[data-row-key="0"] > :nth-child(6)')
                .should('be.visible')
                .and('contain.text', storedText);
        });
    
        cy.get('@storedText').then(storedText => {
            cy.get('[data-row-key="0"] > :nth-child(8) > .ant-space')
                .should('be.visible').and('contain.text', storedText);
        });
        // Steps to remove the approval rule
    newPayment.goToSetting();
    newPayment.goToNotificationSetting();
    newPayment.goToApprovalWorkFlow();
    newPayment.removeApprovalrule()
    newPayment.saveApprovalRule();
    });
    xit('Verify that approval workflow is working correctly for GBP using Volopa Collection Account for single payment.', function () {
        signin.Login(userName, password);
    
        // steps to add approval rule
        newPayment.goToSetting();
        newPayment.goToNotificationSetting();
        newPayment.goToApprovalWorkFlow();
        newPayment.setCurrencyforApproval('{enter}', 'GBP', '300');
        newPayment.setApprover('Hamza{enter}');
        newPayment.saveApprovalRule();
    
        // create a payment for approval
        newRecipient.goToPaymentsDashborad();
        newRecipient.gotoRecipientList();
        let email = batchPayments.generateRandomString(5) + '@yopmail.com';
        batchPayments.addRecipient('United States{enter}', 'USD{enter}', email);
        newRecipient.addBankDetailsWithAccNo('MMMCUS44', '55555555');
        cy.get('#aba').type('026009593');
        const lName = batchPayments.generateRandomString(6);
        batchPayments.individualRecipient('INDIVIDUAL USD PF', lName, 'UNITED States{enter}');
        newRecipient.postCodeState();
        batchPayments.paymentPurposeGBPEUR();
    
        cy.get('.ant-select-selector').eq(3).click();
        cy.get('.ant-select-dropdown').eq(3).find('.ant-select-item-option-content').then(Element => {
            let purposeList = Element.text();
            cy.log(purposeList);
            cy.wrap(purposeList).as('purposeList');
        });
    
        newRecipient.saveRecipient();
        newPayment.checkSettelment('be.enabled', 'be.enabled');
        newPayment.proceedflow('{downarrow}{enter}', 'GBP');
    
        let amount = '400';
        newPayment.addrecipientDetail(amount, email);
        newPayment.selectFundingMethod('Volopa Collection Account');
    
        // Validate the selected payment purpose
        cy.get('@selectedValue').then(selectedValue => {
            cy.get('.ant-col-sm-20 > :nth-child(2) > :nth-child(1) > :nth-child(1) > .ant-row > .ant-col > .ant-form-item-control-input > .ant-form-item-control-input-content > .ant-select > .ant-select-selector')
                .should('be.visible').and('contain.text', selectedValue);
        });
    
        // Validate Purpose on Single payment
        cy.get('.ant-select-selector').eq(3).click();
        cy.get('.ant-select-dropdown').eq(2).find('.ant-select-item-option-content').then(Element => {
            let list = Element.text();
            cy.log(list);
            cy.get('@purposeList').then(purposeList => {
                expect(list).to.eq(purposeList);
                cy.get('.ant-select-selector').eq(3).click();
            });
        });
    
        // Validating recipient received amount
        cy.get(':nth-child(4) > :nth-child(2) > .ant-typography').invoke('text').then((text) => {
            const storedText = text;
            cy.wrap(storedText).as('storedText');
            cy.log(storedText);
        });
    
        cy.get('.ant-col > .ant-btn > span').should('be.visible').click();
        cy.get('.ant-modal-body > :nth-child(1) > .ant-col > .ant-typography').should('be.visible').should('contain.text', 'Payment Confirmation');
    
        cy.get('@storedText').then(storedText => {
            cy.get(':nth-child(5) > .ant-col-8 > .ant-typography')
                .should('be.visible').and('contain.text', storedText);
        });
    
        cy.get('.ant-row-center.m-t-20 > .ant-col > .ant-space > :nth-child(2) > .ant-btn')
            .should('be.visible')
            .should('contain.text', 'Submit for Approval')
            .click(); // pay recipient
    
        cy.get('.ant-modal-body > :nth-child(1) > .ant-col')
            .should('be.visible')
            .should('contain.text', 'Submitted for Approval');
    
        // Get the selected recipient name and store it as an alias
        cy.get('[style="margin-left: -12px; margin-right: -12px; row-gap: 12px;"] > :nth-child(2) > :nth-child(1) > :nth-child(2) > .ant-typography')
            .invoke('text')
            .then(text => {
                cy.wrap(text.trim()).as('selectedRecipient');
            });
    
        cy.get('@storedText').then(storedText => {
            cy.get(':nth-child(5) > .ant-col-8 > .ant-typography')
                .should('be.visible').and('contain.text', storedText);
        });
    
        // Return to payment dashboard
        newPayment.returnToPaymentDashboard();
        newPayment.goToDraftPayment();
    
        // validate the draft payment for submitter
        cy.get('@selectedRecipient').then(storedText => {
            cy.get('.ant-table-row > :nth-child(5)')
                .should('be.visible')
                .and('contain.text', storedText);
        });
    
        cy.get('@storedText').then(storedText => {
            cy.get('.ant-table-row > :nth-child(7)')
                .should('be.visible').and('contain.text', storedText);
        });
    
        // logout the submitter user
        newPayment.logout();
    
        // Login as Approver User
        signin.Login('hamzaQA3@volopa.com', password);
        newPayment.goToNotification();
        newPayment.approvalNotification();
    
        // Validation on payment confirmation modal Approver user
        cy.get('.ant-modal-body > :nth-child(1) > .ant-col > .ant-typography')
            .should('be.visible')
            .should('contain.text', 'Payment Confirmation');
    
        cy.get('@storedText').then(storedText => {
            cy.get(':nth-child(5) > .ant-col-8 > .ant-typography')
                .should('be.visible').and('contain.text', storedText);
        });
    
        cy.get('@selectedRecipient').then(storedText => {
            cy.get('[style="margin-left: -12px; margin-right: -12px; row-gap: 12px;"] > :nth-child(2) > :nth-child(1) > :nth-child(2) > .ant-typography')
                .should('be.visible')
                .and('contain.text', storedText);
        });
    
        // Approving the payment
        newPayment.approvingSinglePayment();
        newPayment.validateApprovedPayment();
    
        // validate the payment history for approver
        cy.get('@selectedRecipient').then(storedText => {
            cy.get('[data-row-key="0"] > :nth-child(6)')
                .should('be.visible')
                .and('contain.text', storedText);
        });
    
        cy.get('@storedText').then(storedText => {
            cy.get('[data-row-key="0"] > :nth-child(8) > .ant-space')
                .should('be.visible').and('contain.text', storedText);
        });
        // Steps to remove the approval rule
    newPayment.goToSetting();
    newPayment.goToNotificationSetting();
    newPayment.goToApprovalWorkFlow();
    newPayment.removeApprovalrule()
    newPayment.saveApprovalRule();
    });
    //Approval workflow for batch payments
    xit('Verify that approval workflow is working correctly for GBP using Push Funds for Batch payment.', function () {
        signin.Login('testnew@volopa.com', password);
    
        // steps to add approval rule
        newPayment.goToSetting();
        newPayment.goToNotificationSetting();
        newPayment.goToApprovalWorkFlow();
        newPayment.setCurrencyforApproval('{enter}', 'GBP', '300');
        newPayment.setApprover('Hamza{enter}');
        newPayment.saveApprovalRule();
    
        // create a payment for approval
        newRecipient.goToPaymentsDashborad();
        newRecipient.gotoRecipientList();
        let email = batchPayments.generateRandomString(5) + '@yopmail.com';
        batchPayments.addRecipient('UNITED ARAB EMIRATES{enter}', 'AED{enter}', email);
        newRecipient.addBankDetails('AE070331234567890123456', 'AARPAEAA');
        const lName = batchPayments.generateRandomString(6);
        batchPayments.individualRecipient('INDIVIDUAL ET', lName, 'UNITED ARAB EMIRATES{enter}');
        batchPayments.paymentPurpose();
        cy.get('.ant-select-selector').eq(3).click();
        cy.get('.ant-select-dropdown').eq(3).find('.ant-select-item-option-content').then(Element => {
            let purposeList = Element.text();
            cy.log(purposeList);
            cy.wrap(purposeList).as('purposeList');
        });
        newRecipient.saveRecipient();
        newRecipient.checkSettelment('be.disabled', 'be.enabled');
    
        newRecipient.gotoRecipientList();
        let email1 = batchPayments.generateRandomString(5) + '@yopmail.com';
        batchPayments.addRecipient('UNITED ARAB EMIRATES{enter}', 'AED{enter}', email1);
        newRecipient.addBankDetails('AE070331234567890123456', 'AARPAEAA');
        const lName1 = batchPayments.generateRandomString(6);
        batchPayments.individualRecipient('INDIVIDUAL AED ET', lName1, 'UNITED ARAB EMIRATES{enter}');
        batchPayments.paymentPurpose1();
        cy.get('.ant-select-selector').eq(3).click();
        cy.get('.ant-select-dropdown').eq(3).find('.ant-select-item-option-content').then(Element => {
            let purposeList1 = Element.text();
            cy.log(purposeList1);
            cy.wrap(purposeList1).as('purposeList1');
        });
        newRecipient.saveRecipient();
        newRecipient.checkSettelment('be.disabled', 'be.enabled');
    
        cy.reload();
        batchPayments.goToBatchPaymentPage();
        batchPayments.goToPayMultipleRecipient();
        let name = 'INDIVIDUAL ET' + ' ' + lName + '{enter}';
        batchPayments.validateSearchBar(name);
        cy.wait(5000);
        let name1 = 'INDIVIDUAL AED ET' + ' ' + lName1 + '{enter}';
        batchPayments.validateSearchBar(name1);
    
        // Validate Purpose on batch payment
        cy.get('.ant-select-selector').eq(1).click();
        cy.get('.ant-select-dropdown').eq(1).find('.ant-select-item-option-content').then(Element => {
            let list = Element.text();
            cy.log(list);
            cy.get('@purposeList').then(purposeList => {
                expect(list).to.eq(purposeList);
                cy.get('.ant-select-selector').eq(1).click();
            });
        });
        cy.wait(1000);
        cy.get('.ant-select-selector').eq(5).click();
        cy.get('.ant-select-dropdown').eq(2).find('.ant-select-item-option-content').then(Element => {
            let list = Element.text();
            cy.log(list);
            cy.get('@purposeList1').then(purposeList1 => {
                expect(list).to.eq(purposeList1);
                cy.get('.ant-select-selector').eq(5).click();
            });
        });
    
        let amount = '900';
        batchPayments.addrecipientDetail(amount, email);
        batchPayments.checkSettelments1('be.disabled', 'be.enabled');
        let amount1 = 910;
        batchPayments.addrecipientDetail1(amount1, email1);
        batchPayments.checkSettelments2('be.disabled', 'be.enabled');
        batchPayments.proceedflow('GBP', 'GBP', 'Push Funds', 'Push Funds');
        batchPayments.validateApprovedproceedflow(amount, amount1);
    
        // Return to Draft payment
        newPayment.goToDraftPayment();
    
        // Validate the amount and amount1 on Draft payment for Submitter
        cy.get('tbody tr:nth-child(3) td:nth-child(7)')
            .should('be.visible')
            .invoke('text')
            .then((text) => {
                const cleanedText = text.replace(/,/g, '').trim(); // e.g. '800.00'
                const actual = parseFloat(cleanedText);
                expect(actual).to.eq(parseFloat(amount));
            });
    
        cy.get('tbody tr:nth-child(2) td:nth-child(7)')
            .should('be.visible')
            .invoke('text')
            .then((text) => {
                const cleanedText = text.replace(/,/g, '').trim(); // e.g. '950.00'
                const actual = parseFloat(cleanedText);
                expect(actual).to.eq(amount1);
            });
    
        // Logout the submitter user
        newPayment.logout();
    
        // Login as Approver User
        signin.Login('hamzaQA3@volopa.com', password);
        newPayment.goToNotification();
        newPayment.approvalNotification();
    
        // Validation on Approver Side for Recipient Receive amount, it'll not validate decimal amount
        let expectedSum = parseInt(amount) + amount1;
        cy.get("div[class='ant-col ant-col-8'] span[class='ant-typography muli extra-bold dark-green fs-18px']")
            .should('be.visible')
            .invoke('text')
            .then((text) => {
                const cleanedText = text
                    .replace(/,/g, '')
                    .split('.')[0]
                    .trim();
    
                expect(parseInt(cleanedText)).to.eq(expectedSum);
            });
    
        // Approving the payment
        batchPayments.approveBatchPayment();
    
        // Validate batch approval Modal
        cy.get('.ant-modal-body > :nth-child(1)').should('be.visible').should('contain.text', 'Payment Booked - Pending Funds');
        cy.get('.ant-col-24 > :nth-child(4) > .ant-col-8')
            .should('be.visible')
            .invoke('text')
            .then((text) => {
                const cleanedText1 = text
                    .replace(/,/g, '')
                    .split('.')[0]
                    .trim();
    
                expect(parseInt(cleanedText1)).to.eq(expectedSum);
            });
    
        // Navigate to View Payment
        cy.get(':nth-child(4) > .ant-col > .ant-space > :nth-child(1) > .ant-btn').should('be.visible').click();
        cy.get('.ant-spin-dot').should('not.exist');
    
        // Validate the payment history
        cy.get('[data-row-key="0"] > :nth-child(4)').should('be.visible').should('contain.text', 'Batch');
        cy.get('[data-row-key="1"] > :nth-child(4)').should('be.visible').should('contain.text', 'Batch');
        cy.get('[data-row-key="0"] > :nth-child(8) > .ant-space').should('be.visible').should('contain.text', amount1);
        cy.get('[data-row-key="1"] > :nth-child(8) > .ant-space').should('be.visible').should('contain.text', amount);
    
        // Remove the Approval Rule
        newPayment.goToSetting();
        newPayment.goToNotificationSetting();
        newPayment.goToApprovalWorkFlow();
        newPayment.removeApprovalrule();
        newPayment.saveApprovalRule();
    });
    xit('Verify that approval workflow is working correctly for GBP using Volopa Collection Account for Batch payment.', function () {
        signin.Login('testnew@volopa.com', password);
    
        // steps to add approval rule
        newPayment.goToSetting();
        newPayment.goToNotificationSetting();
        newPayment.goToApprovalWorkFlow();
        newPayment.setCurrencyforApproval('{enter}', 'GBP', '300');
        newPayment.setApprover('Hamza{enter}');
        newPayment.saveApprovalRule();
    
        // create a payment for approval
        newRecipient.goToPaymentsDashborad();
        newRecipient.gotoRecipientList();
        let email = batchPayments.generateRandomString(5) + '@yopmail.com';
        batchPayments.addRecipient('UNITED ARAB EMIRATES{enter}', 'AED{enter}', email);
        newRecipient.addBankDetails('AE070331234567890123456', 'AARPAEAA');
        const lName = batchPayments.generateRandomString(6);
        batchPayments.individualRecipient('INDIVIDUAL ET', lName, 'UNITED ARAB EMIRATES{enter}');
        batchPayments.paymentPurpose();
        cy.get('.ant-select-selector').eq(3).click();
        cy.get('.ant-select-dropdown').eq(3).find('.ant-select-item-option-content').then(Element => {
            let purposeList = Element.text();
            cy.log(purposeList);
            cy.wrap(purposeList).as('purposeList');
        });
        newRecipient.saveRecipient();
        newRecipient.checkSettelment('be.disabled', 'be.enabled');
    
        newRecipient.gotoRecipientList();
        let email1 = batchPayments.generateRandomString(5) + '@yopmail.com';
        batchPayments.addRecipient('UNITED ARAB EMIRATES{enter}', 'AED{enter}', email1);
        newRecipient.addBankDetails('AE070331234567890123456', 'AARPAEAA');
        const lName1 = batchPayments.generateRandomString(6);
        batchPayments.individualRecipient('INDIVIDUAL AED ET', lName1, 'UNITED ARAB EMIRATES{enter}');
        batchPayments.paymentPurpose1();
        cy.get('.ant-select-selector').eq(3).click();
        cy.get('.ant-select-dropdown').eq(3).find('.ant-select-item-option-content').then(Element => {
            let purposeList1 = Element.text();
            cy.log(purposeList1);
            cy.wrap(purposeList1).as('purposeList1');
        });
        newRecipient.saveRecipient();
        newRecipient.checkSettelment('be.disabled', 'be.enabled');
    
        cy.reload();
        batchPayments.goToBatchPaymentPage();
        batchPayments.goToPayMultipleRecipient();
        let name = 'INDIVIDUAL ET' + ' ' + lName + '{enter}';
        batchPayments.validateSearchBar(name);
        cy.wait(5000);
        let name1 = 'INDIVIDUAL AED ET' + ' ' + lName1 + '{enter}';
        batchPayments.validateSearchBar(name1);
    
        // Validate Purpose on batch payment
        cy.get('.ant-select-selector').eq(1).click();
        cy.get('.ant-select-dropdown').eq(1).find('.ant-select-item-option-content').then(Element => {
            let list = Element.text();
            cy.log(list);
            cy.get('@purposeList').then(purposeList => {
                expect(list).to.eq(purposeList);
                cy.get('.ant-select-selector').eq(1).click();
            });
        });
        cy.wait(1000);
        cy.get('.ant-select-selector').eq(5).click();
        cy.get('.ant-select-dropdown').eq(2).find('.ant-select-item-option-content').then(Element => {
            let list = Element.text();
            cy.log(list);
            cy.get('@purposeList1').then(purposeList1 => {
                expect(list).to.eq(purposeList1);
                cy.get('.ant-select-selector').eq(5).click();
            });
        });
    
        let amount = '915';
        batchPayments.addrecipientDetail(amount, email);
        batchPayments.checkSettelments1('be.disabled', 'be.enabled');
        let amount1 = 920;
        batchPayments.addrecipientDetail1(amount1, email1);
        batchPayments.checkSettelments2('be.disabled', 'be.enabled');
        batchPayments.proceedflow('GBP', 'GBP', 'Volopa Collection Account', 'Volopa Collection Account');
        batchPayments.validateApprovedproceedflow(amount, amount1);
    
        // Return to Draft payment
        newPayment.goToDraftPayment();
    
        // Validate the amount and amount1 on Draft payment for Submitter
        cy.get('tbody tr:nth-child(3) td:nth-child(7)')
            .should('be.visible')
            .invoke('text')
            .then((text) => {
                const cleanedText = text.replace(/,/g, '').trim(); // e.g. '800.00'
                const actual = parseFloat(cleanedText);
                expect(actual).to.eq(parseFloat(amount));
            });
    
        cy.get('tbody tr:nth-child(2) td:nth-child(7)')
            .should('be.visible')
            .invoke('text')
            .then((text) => {
                const cleanedText = text.replace(/,/g, '').trim(); // e.g. '950.00'
                const actual = parseFloat(cleanedText);
                expect(actual).to.eq(amount1);
            });
    
        // Logout the submitter user
        newPayment.logout();
    
        // Login as Approver User
        signin.Login('hamzaQA3@volopa.com', password);
        newPayment.goToNotification();
        newPayment.approvalNotification();
    
        // Validation on Approver Side for Recipient Receive amount, it'll not validate decimal amount
        let expectedSum = parseInt(amount) + amount1;
        cy.get("div[class='ant-col ant-col-8'] span[class='ant-typography muli extra-bold dark-green fs-18px']")
            .should('be.visible')
            .invoke('text')
            .then((text) => {
                const cleanedText = text
                    .replace(/,/g, '')
                    .split('.')[0]
                    .trim();
    
                expect(parseInt(cleanedText)).to.eq(expectedSum);
            });
    
        // Approving the payment
        batchPayments.approveBatchPayment();
    
        // Validate batch approval Modal
        cy.get('.ant-modal-body > :nth-child(1)').should('be.visible').should('contain.text', 'Payment Booked - Pending Funds');
        cy.get('.ant-col-24 > :nth-child(4) > .ant-col-8')
            .should('be.visible')
            .invoke('text')
            .then((text) => {
                const cleanedText1 = text
                    .replace(/,/g, '')
                    .split('.')[0]
                    .trim();
    
                expect(parseInt(cleanedText1)).to.eq(expectedSum);
            });
    
        // Navigate to View Payment
        cy.get(':nth-child(4) > .ant-col > .ant-space > :nth-child(1) > .ant-btn').should('be.visible').click();
        cy.get('.ant-spin-dot').should('not.exist');
    
        // Validate the payment history
        cy.get('[data-row-key="0"] > :nth-child(4)').should('be.visible').should('contain.text', 'Batch');
        cy.get('[data-row-key="1"] > :nth-child(4)').should('be.visible').should('contain.text', 'Batch');
        cy.get('[data-row-key="0"] > :nth-child(8) > .ant-space').should('be.visible').should('contain.text', amount1);
        cy.get('[data-row-key="1"] > :nth-child(8) > .ant-space').should('be.visible').should('contain.text', amount);
    
        // Remove the Approval Rule
        newPayment.goToSetting();
        newPayment.goToNotificationSetting();
        newPayment.goToApprovalWorkFlow();
        newPayment.removeApprovalrule();
        newPayment.saveApprovalRule();
    });
    xit('Verify that approval workflow is working correctly for GBP using Easy Transfer for Batch payment.', function () {
        signin.Login(userName, password);
    
        // steps to add approval rule
        newPayment.goToSetting();
        newPayment.goToNotificationSetting();
        newPayment.goToApprovalWorkFlow();
        newPayment.setCurrencyforApproval('{enter}', 'GBP', '300');
        newPayment.setApprover('hamza{enter}');
        newPayment.saveApprovalRule();
    
        // create a payment for approval
        newRecipient.goToPaymentsDashborad();
        newRecipient.gotoRecipientList();
        let email = batchPayments.generateRandomString(5) + '@yopmail.com';
        batchPayments.addRecipient('UNITED ARAB EMIRATES{enter}', 'AED{enter}', email);
        newRecipient.addBankDetails('AE070331234567890123456', 'AARPAEAA');
        const lName = batchPayments.generateRandomString(6);
        batchPayments.individualRecipient('INDIVIDUAL ET', lName, 'UNITED ARAB EMIRATES{enter}');
        batchPayments.paymentPurpose();
        cy.get('.ant-select-selector').eq(3).click();
        cy.get('.ant-select-dropdown').eq(3).find('.ant-select-item-option-content').then(Element => {
            let purposeList = Element.text();
            cy.log(purposeList);
            cy.wrap(purposeList).as('purposeList');
        });
        newRecipient.saveRecipient();
        newRecipient.checkSettelment('be.disabled', 'be.enabled');
    
        newRecipient.gotoRecipientList();
        let email1 = batchPayments.generateRandomString(5) + '@yopmail.com';
        batchPayments.addRecipient('UNITED ARAB EMIRATES{enter}', 'AED{enter}', email1);
        newRecipient.addBankDetails('AE070331234567890123456', 'AARPAEAA');
        const lName1 = batchPayments.generateRandomString(6);
        batchPayments.individualRecipient('INDIVIDUAL AED ET', lName1, 'UNITED ARAB EMIRATES{enter}');
        batchPayments.paymentPurpose1();
        cy.get('.ant-select-selector').eq(3).click();
        cy.get('.ant-select-dropdown').eq(3).find('.ant-select-item-option-content').then(Element => {
            let purposeList1 = Element.text();
            cy.log(purposeList1);
            cy.wrap(purposeList1).as('purposeList1');
        });
        newRecipient.saveRecipient();
        newRecipient.checkSettelment('be.disabled', 'be.enabled');
    
        cy.reload();
        batchPayments.goToBatchPaymentPage();
        batchPayments.goToPayMultipleRecipient();
        let name = 'INDIVIDUAL ET' + ' ' + lName + '{enter}';
        batchPayments.validateSearchBar(name);
        cy.wait(5000);
        let name1 = 'INDIVIDUAL AED ET' + ' ' + lName1 + '{enter}';
        batchPayments.validateSearchBar(name1);
    
        // Validate Purpose on batch payment
        cy.get('.ant-select-selector').eq(1).click();
        cy.get('.ant-select-dropdown').eq(1).find('.ant-select-item-option-content').then(Element => {
            let list = Element.text();
            cy.log(list);
            cy.get('@purposeList').then(purposeList => {
                expect(list).to.eq(purposeList);
                cy.get('.ant-select-selector').eq(1).click();
            });
        });
        cy.wait(1000);
        cy.get('.ant-select-selector').eq(5).click();
        cy.get('.ant-select-dropdown').eq(2).find('.ant-select-item-option-content').then(Element => {
            let list = Element.text();
            cy.log(list);
            cy.get('@purposeList1').then(purposeList1 => {
                expect(list).to.eq(purposeList1);
                cy.get('.ant-select-selector').eq(5).click();
            });
        });
    
        let amount = '920';
        batchPayments.addrecipientDetail(amount, email);
        batchPayments.checkSettelments1('be.disabled', 'be.enabled');
        let amount1 = 935;
        batchPayments.addrecipientDetail1(amount1, email1);
        batchPayments.checkSettelments2('be.disabled', 'be.enabled');
        batchPayments.proceedflow('GBP', 'GBP', 'Easy Transfer', 'Easy Transfer');
        batchPayments.validateApprovedproceedflow(amount, amount1);
        
        // Return to Draft payment
        newPayment.goToDraftPayment();
    
        // Validate the amount and amount1 on Draft payment for Submitter
        cy.get('tbody tr:nth-child(3) td:nth-child(7)')
            .should('be.visible')
            .invoke('text')
            .then((text) => {
                const cleanedText = text.replace(/,/g, '').trim(); // e.g. '800.00'
                const actual = parseFloat(cleanedText);
                expect(actual).to.eq(parseFloat(amount));
            });
    
        cy.get('tbody tr:nth-child(2) td:nth-child(7)')
            .should('be.visible')
            .invoke('text')
            .then((text) => {
                const cleanedText = text.replace(/,/g, '').trim(); // e.g. '950.00'
                const actual = parseFloat(cleanedText);
                expect(actual).to.eq(amount1);
            });
    
        // Logout the submitter user
        newPayment.logout();
    
        // Login as Approver User
        signin.Login('hamzaQA3@volopa.com', password);
        newPayment.goToNotification();
        newPayment.approvalNotification();
    
        // Validation on Approver Side for Recipient Receive amount, it'll not validate decimal amount
        let expectedSum = parseInt(amount) + amount1;
        cy.get("div[class='ant-col ant-col-8'] span[class='ant-typography muli extra-bold dark-green fs-18px']")
            .should('be.visible')
            .invoke('text')
            .then((text) => {
                const cleanedText = text
                    .replace(/,/g, '')
                    .split('.')[0]
                    .trim();
    
                expect(parseInt(cleanedText)).to.eq(expectedSum);
            });
    
        // Approving the payment
        batchPayments.approveBatchPayment();
        
        // Validate batch approval Modal
        cy.get('.ant-modal-body > :nth-child(1)').should('be.visible').should('contain.text', 'Payment Booked - Pending Funds');
        cy.get('.ant-col-24 > :nth-child(4) > .ant-col-8')
            .should('be.visible')
            .invoke('text')
            .then((text) => {
                const cleanedText1 = text
                    .replace(/,/g, '')
                    .split('.')[0]
                    .trim();
    
                expect(parseInt(cleanedText1)).to.eq(expectedSum);
            });
            newPayment.validateYapilyFlow()
        // // Navigate to View Payment
        // cy.get(':nth-child(4) > .ant-col > .ant-space > :nth-child(1) > .ant-btn').should('be.visible').click();
        // cy.get('.ant-spin-dot').should('not.exist');
    
        // Validate the payment history
        cy.get('[data-row-key="0"] > :nth-child(4)').should('be.visible').should('contain.text', 'Batch');
        cy.get('[data-row-key="1"] > :nth-child(4)').should('be.visible').should('contain.text', 'Batch');
        cy.get('[data-row-key="0"] > :nth-child(8) > .ant-space').should('be.visible').should('contain.text', amount1);
        cy.get('[data-row-key="1"] > :nth-child(8) > .ant-space').should('be.visible').should('contain.text', amount);
    
        // Remove the Approval Rule
        newPayment.goToSetting();
        newPayment.goToNotificationSetting();
        newPayment.goToApprovalWorkFlow();
        newPayment.removeApprovalrule();
        newPayment.saveApprovalRule();
    });

    //Single Schedued payments push funds
    xit('Verify that Scheduled payment is working correctly for GBP using Push Funds for single payments for today+2 .', function () {
        signin.Login(userName, password);
        // create a Scheduled payment
        newRecipient.goToPaymentsDashborad();
        newRecipient.gotoRecipientList();
        let email = batchPayments.generateRandomString(5) + '@yopmail.com';
        batchPayments.addRecipient('United States{enter}', 'USD{enter}', email);
        newRecipient.addBankDetailsWithAccNo('MMMCUS44', '55555555');
        cy.get('#aba').type('026009593');
        const lName = batchPayments.generateRandomString(6);
        batchPayments.individualRecipient('INDIVIDUAL USD PF', lName, 'UNITED States{enter}');
        newRecipient.postCodeState();
        batchPayments.paymentPurposeGBPEUR();
    
        cy.get('.ant-select-selector').eq(3).click();
        cy.get('.ant-select-dropdown').eq(3).find('.ant-select-item-option-content').then(Element => {
            let purposeList = Element.text();
            cy.log(purposeList);
            cy.wrap(purposeList).as('purposeList');
        });
    
        newRecipient.saveRecipient();
        newPayment.checkSettelment('be.enabled', 'be.enabled');
        newPayment.proceedflow('{downarrow}{enter}', 'GBP');
    
        let amount = '320';
        newPayment.addrecipientDetail(amount, email);
        newPayment.selectFundingMethod('Push Funds');
    
        // Validate the selected payment purpose
        cy.get('@selectedValue').then(selectedValue => {
            cy.get('.ant-col-sm-20 > :nth-child(2) > :nth-child(1) > :nth-child(1) > .ant-row > .ant-col > .ant-form-item-control-input > .ant-form-item-control-input-content > .ant-select > .ant-select-selector')
                .should('be.visible').and('contain.text', selectedValue);
        });
    
        // Validate Purpose on Single payment
        cy.get('.ant-select-selector').eq(3).click();

        cy.get('.ant-select-dropdown:visible', { timeout: 10000 }).should('be.visible')
          .find('.ant-select-item-option-content').then(Element => {
              const list = Element.text();
              cy.log(list);
              cy.get('@purposeList').then(purposeList => {
                  expect(list).to.eq(purposeList);
                  cy.get('.ant-select-selector').eq(3).click();
              });
          });
    
        // Validating recipient received amount
        cy.get(':nth-child(4) > :nth-child(2) > .ant-typography').invoke('text').then((text) => {
            const storedText = text;
            cy.wrap(storedText).as('storedText');
            cy.log(storedText);
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
          const plusDays = 3;
          const { titleFmt, displayFmt, longFmt } = getFutureWorkingDate(plusDays);
          
          // 1. open the calendar
          cy.get('.ant-picker-input').click();
          
          // 2. pick the calculated working day
          cy.get(`td[title='${titleFmt}'] div.ant-picker-cell-inner`).click();
          
          // 3. compact DD-MM-YYYY check
          cy.get("div.ant-row.ant-row-space-between.m-t-20 span.ant-typography.muli.light.fs-18px.dark-green")
            .should('have.text', displayFmt);
        
         
        cy.get('.ant-col > .ant-btn > span').should('be.visible').click();
        cy.get('.ant-modal-body > :nth-child(1) > .ant-col > .ant-typography').should('be.visible').should('contain.text', 'Payment Confirmation');
    
        cy.get('@storedText').then(storedText => {
            cy.get(':nth-child(5) > .ant-col-8 > .ant-typography')
                .should('be.visible').and('contain.text', storedText);
        });
    
        cy.get('.ant-row-center.m-t-20 > .ant-col > .ant-space > :nth-child(2) > .ant-btn')
            .should('be.visible')
            .should('contain.text', 'Schedule Payment')
            .click(); // pay recipient
    
        cy.get('.ant-modal-body > :nth-child(1) > .ant-col')
            .should('be.visible')
            .should('contain.text', 'Payment Scheduled');
    
        // Get the selected recipient name and store it as an alias
        cy.get('[style="margin-left: -12px; margin-right: -12px; row-gap: 12px;"] > :nth-child(2) > :nth-child(1) > :nth-child(2) > .ant-typography')
            .invoke('text')
            .then(text => {
                cy.wrap(text.trim()).as('selectedRecipient');
            });
    
        cy.get('@storedText').then(storedText => {
            cy.get(':nth-child(5) > .ant-col-8 > .ant-typography')
                .should('be.visible').and('contain.text', storedText);
        });
    
        // Return to payment dashboard
        cy.get(':nth-child(5) > .ant-col > .ant-space > :nth-child(1) > .ant-btn').should('be.visible').click()
        cy.get(':nth-child(1) > .ant-col > .ant-typography').should('be.visible').should('contain.text','Draft Payments')
        
    
        // validate the draft payment for submitter
        cy.get('@selectedRecipient').then(storedText => {
            cy.get('.ant-table-row > :nth-child(5)')
                .should('be.visible')
                .and('contain.text', storedText);
        });
    
        cy.get('@storedText').then(storedText => {
            cy.get('.ant-table-row > :nth-child(7)')
                .should('be.visible').and('contain.text', storedText);
        });

        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        const longFmt1  = `Scheduled for ${new Date(titleFmt).toLocaleDateString('en-US', options)}`;
        // e.g. "Scheduled for May 21, 2025"

        cy.get('tbody tr:nth-child(2) td:nth-child(4)')
        .should('be.visible')
        .and('have.text', longFmt1);
    
    }); 
    xit('Verify that Scheduled payment is working correctly for GBP using Push Funds for single payments for today+3 .', function () {
        signin.Login(userName, password);
        // create a Scheduled payment
        newRecipient.goToPaymentsDashborad();
        newRecipient.gotoRecipientList();
        let email = batchPayments.generateRandomString(5) + '@yopmail.com';
        batchPayments.addRecipient('United States{enter}', 'USD{enter}', email);
        newRecipient.addBankDetailsWithAccNo('MMMCUS44', '55555555');
        cy.get('#aba').type('026009593');
        const lName = batchPayments.generateRandomString(6);
        batchPayments.individualRecipient('INDIVIDUAL USD PF', lName, 'UNITED States{enter}');
        newRecipient.postCodeState();
        batchPayments.paymentPurposeGBPEUR();
    
        cy.get('.ant-select-selector').eq(3).click();
        cy.get('.ant-select-dropdown').eq(3).find('.ant-select-item-option-content').then(Element => {
            let purposeList = Element.text();
            cy.log(purposeList);
            cy.wrap(purposeList).as('purposeList');
        });
    
        newRecipient.saveRecipient();
        newPayment.checkSettelment('be.enabled', 'be.enabled');
        newPayment.proceedflow('{downarrow}{enter}', 'GBP');
    
        let amount = '330';
        newPayment.addrecipientDetail(amount, email);
        newPayment.selectFundingMethod('Push Funds');
    
        // Validate the selected payment purpose
        cy.get('@selectedValue').then(selectedValue => {
            cy.get('.ant-col-sm-20 > :nth-child(2) > :nth-child(1) > :nth-child(1) > .ant-row > .ant-col > .ant-form-item-control-input > .ant-form-item-control-input-content > .ant-select > .ant-select-selector')
                .should('be.visible').and('contain.text', selectedValue);
        });
    
        // Validate Purpose on Single payment
        cy.get('.ant-select-selector').eq(3).click();

        cy.get('.ant-select-dropdown:visible', { timeout: 10000 }).should('be.visible')
          .find('.ant-select-item-option-content').then(Element => {
              const list = Element.text();
              cy.log(list);
              cy.get('@purposeList').then(purposeList => {
                  expect(list).to.eq(purposeList);
                  cy.get('.ant-select-selector').eq(3).click();
              });
          });
    
        // Validating recipient received amount
        cy.get(':nth-child(4) > :nth-child(2) > .ant-typography').invoke('text').then((text) => {
            const storedText = text;
            cy.wrap(storedText).as('storedText');
            cy.log(storedText);
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
          const plusDays = 4;
          const { titleFmt, displayFmt, longFmt } = getFutureWorkingDate(plusDays);
          
          // 1. open the calendar
          cy.get('.ant-picker-input').click();
          
          // 2. pick the calculated working day
          cy.get(`td[title='${titleFmt}'] div.ant-picker-cell-inner`).click();
          
          // 3. compact DD-MM-YYYY check
          cy.get("div.ant-row.ant-row-space-between.m-t-20 span.ant-typography.muli.light.fs-18px.dark-green")
            .should('have.text', displayFmt);
        
         
        cy.get('.ant-col > .ant-btn > span').should('be.visible').click();
        cy.get('.ant-modal-body > :nth-child(1) > .ant-col > .ant-typography').should('be.visible').should('contain.text', 'Payment Confirmation');
    
        cy.get('@storedText').then(storedText => {
            cy.get(':nth-child(5) > .ant-col-8 > .ant-typography')
                .should('be.visible').and('contain.text', storedText);
        });
    
        cy.get('.ant-row-center.m-t-20 > .ant-col > .ant-space > :nth-child(2) > .ant-btn')
            .should('be.visible')
            .should('contain.text', 'Schedule Payment')
            .click(); // pay recipient
    
        cy.get('.ant-modal-body > :nth-child(1) > .ant-col')
            .should('be.visible')
            .should('contain.text', 'Payment Scheduled');
    
        // Get the selected recipient name and store it as an alias
        cy.get('[style="margin-left: -12px; margin-right: -12px; row-gap: 12px;"] > :nth-child(2) > :nth-child(1) > :nth-child(2) > .ant-typography')
            .invoke('text')
            .then(text => {
                cy.wrap(text.trim()).as('selectedRecipient');
            });
    
        cy.get('@storedText').then(storedText => {
            cy.get(':nth-child(5) > .ant-col-8 > .ant-typography')
                .should('be.visible').and('contain.text', storedText);
        });
    
        // Return to payment dashboard
        cy.get(':nth-child(5) > .ant-col > .ant-space > :nth-child(1) > .ant-btn').should('be.visible').click()
        cy.get(':nth-child(1) > .ant-col > .ant-typography').should('be.visible').should('contain.text','Draft Payments')
        
    
        // validate the draft payment for submitter
        cy.get('@selectedRecipient').then(storedText => {
            cy.get('.ant-table-row > :nth-child(5)')
                .should('be.visible')
                .and('contain.text', storedText);
        });
    
        cy.get('@storedText').then(storedText => {
            cy.get('.ant-table-row > :nth-child(7)')
                .should('be.visible').and('contain.text', storedText);
        });

        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        const longFmt1  = `Scheduled for ${new Date(titleFmt).toLocaleDateString('en-US', options)}`;
        // e.g. "Scheduled for May 21, 2025"

        cy.get('tbody tr:nth-child(2) td:nth-child(4)')
        .should('be.visible')
        .and('have.text', longFmt1);
    
    });
    //Batch Schedued payments push funds
    xit('Verify that Scheduled payment is working correctly for GBP using Push Funds for Batch payments for today+2 .', function () {
        signin.Login(userName, password);
        // create a Scheduled payment
        newRecipient.goToPaymentsDashborad();
        newRecipient.gotoRecipientList();
        let email = batchPayments.generateRandomString(5) + '@yopmail.com';
        batchPayments.addRecipient('UNITED ARAB EMIRATES{enter}', 'AED{enter}', email);
        newRecipient.addBankDetails('AE070331234567890123456', 'AARPAEAA');
        const lName = batchPayments.generateRandomString(6);
        batchPayments.individualRecipient('INDIVIDUAL ET', lName, 'UNITED ARAB EMIRATES{enter}');
        batchPayments.paymentPurpose();
        cy.get('.ant-select-selector').eq(3).click();
        cy.get('.ant-select-dropdown').eq(3).find('.ant-select-item-option-content').then(Element => {
            let purposeList = Element.text();
            cy.log(purposeList);
            cy.wrap(purposeList).as('purposeList');
        });
        newRecipient.saveRecipient();
        newRecipient.checkSettelment('be.disabled', 'be.enabled');
    
        newRecipient.gotoRecipientList();
        let email1 = batchPayments.generateRandomString(5) + '@yopmail.com';
        batchPayments.addRecipient('UNITED ARAB EMIRATES{enter}', 'AED{enter}', email1);
        newRecipient.addBankDetails('AE070331234567890123456', 'AARPAEAA');
        const lName1 = batchPayments.generateRandomString(6);
        batchPayments.individualRecipient('INDIVIDUAL AED ET', lName1, 'UNITED ARAB EMIRATES{enter}');
        batchPayments.paymentPurpose1();
        cy.get('.ant-select-selector').eq(3).click();
        cy.get('.ant-select-dropdown').eq(3).find('.ant-select-item-option-content').then(Element => {
            let purposeList1 = Element.text();
            cy.log(purposeList1);
            cy.wrap(purposeList1).as('purposeList1');
        });
        newRecipient.saveRecipient();
        newRecipient.checkSettelment('be.disabled', 'be.enabled');
    
        cy.reload();
        batchPayments.goToBatchPaymentPage();
        batchPayments.goToPayMultipleRecipient();
        let name = 'INDIVIDUAL ET' + ' ' + lName + '{enter}';
        batchPayments.validateSearchBar(name);
        cy.wait(5000);
        let name1 = 'INDIVIDUAL AED ET' + ' ' + lName1 + '{enter}';
        batchPayments.validateSearchBar(name1);
    
        // Validate Purpose on batch payment
        cy.get('.ant-select-selector').eq(1).click();
        cy.get('.ant-select-dropdown').eq(1).find('.ant-select-item-option-content').then(Element => {
            let list = Element.text();
            cy.log(list);
            cy.get('@purposeList').then(purposeList => {
                expect(list).to.eq(purposeList);
                cy.get('.ant-select-selector').eq(1).click();
            });
        });
        cy.wait(1000);
        cy.get('.ant-select-selector').eq(5).click();
        cy.get('.ant-select-dropdown').eq(2).find('.ant-select-item-option-content').then(Element => {
            let list = Element.text();
            cy.log(list);
            cy.get('@purposeList1').then(purposeList1 => {
                expect(list).to.eq(purposeList1);
                cy.get('.ant-select-selector').eq(5).click();
            });
        });
    
        let amount = '510';
        batchPayments.addrecipientDetail(amount, email);
        batchPayments.checkSettelments1('be.disabled', 'be.enabled');
        let amount1 = 520;
        batchPayments.addrecipientDetail1(amount1, email1);
        batchPayments.checkSettelments2('be.disabled', 'be.enabled');
        batchPayments.proceedflow('GBP', 'GBP', 'Push Funds', 'Push Funds');
        batchPayments.validateScheduledproceedflow(amount, amount1, 3);
        //validate the draft payment

        cy.get('tbody tr:nth-child(2) td:nth-child(3)').should('be.visible').should('contain.text', 'Batch');
        cy.get('tbody tr:nth-child(3) td:nth-child(3)').should('be.visible').should('contain.text', 'Batch');
        cy.get('tbody tr:nth-child(3) td:nth-child(7)').should('be.visible').should('contain.text', amount);
        cy.get('tbody tr:nth-child(2) td:nth-child(7)').should('be.visible').should('contain.text', amount1);
    
    });
    it('Verify that Scheduled payment is working correctly for GBP using Push Funds for Batch payments for today+3 .', function () {
        signin.Login(userName, password);
        // create a Scheduled payment
        newRecipient.goToPaymentsDashborad();
        newRecipient.gotoRecipientList();
        let email = batchPayments.generateRandomString(5) + '@yopmail.com';
        batchPayments.addRecipient('UNITED ARAB EMIRATES{enter}', 'AED{enter}', email);
        newRecipient.addBankDetails('AE070331234567890123456', 'AARPAEAA');
        const lName = batchPayments.generateRandomString(6);
        batchPayments.individualRecipient('INDIVIDUAL ET', lName, 'UNITED ARAB EMIRATES{enter}');
        batchPayments.paymentPurpose();
        cy.get('.ant-select-selector').eq(3).click();
        cy.get('.ant-select-dropdown').eq(3).find('.ant-select-item-option-content').then(Element => {
            let purposeList = Element.text();
            cy.log(purposeList);
            cy.wrap(purposeList).as('purposeList');
        });
        newRecipient.saveRecipient();
        newRecipient.checkSettelment('be.disabled', 'be.enabled');
    
        newRecipient.gotoRecipientList();
        let email1 = batchPayments.generateRandomString(5) + '@yopmail.com';
        batchPayments.addRecipient('UNITED ARAB EMIRATES{enter}', 'AED{enter}', email1);
        newRecipient.addBankDetails('AE070331234567890123456', 'AARPAEAA');
        const lName1 = batchPayments.generateRandomString(6);
        batchPayments.individualRecipient('INDIVIDUAL AED ET', lName1, 'UNITED ARAB EMIRATES{enter}');
        batchPayments.paymentPurpose1();
        cy.get('.ant-select-selector').eq(3).click();
        cy.get('.ant-select-dropdown').eq(3).find('.ant-select-item-option-content').then(Element => {
            let purposeList1 = Element.text();
            cy.log(purposeList1);
            cy.wrap(purposeList1).as('purposeList1');
        });
        newRecipient.saveRecipient();
        newRecipient.checkSettelment('be.disabled', 'be.enabled');
    
        cy.reload();
        batchPayments.goToBatchPaymentPage();
        batchPayments.goToPayMultipleRecipient();
        let name = 'INDIVIDUAL ET' + ' ' + lName + '{enter}';
        batchPayments.validateSearchBar(name);
        cy.wait(5000);
        let name1 = 'INDIVIDUAL AED ET' + ' ' + lName1 + '{enter}';
        batchPayments.validateSearchBar(name1);
    
        // Validate Purpose on batch payment
        cy.get('.ant-select-selector').eq(1).click();
        cy.get('.ant-select-dropdown').eq(1).find('.ant-select-item-option-content').then(Element => {
            let list = Element.text();
            cy.log(list);
            cy.get('@purposeList').then(purposeList => {
                expect(list).to.eq(purposeList);
                cy.get('.ant-select-selector').eq(1).click();
            });
        });
        cy.wait(1000);
        cy.get('.ant-select-selector').eq(5).click();
        cy.get('.ant-select-dropdown').eq(2).find('.ant-select-item-option-content').then(Element => {
            let list = Element.text();
            cy.log(list);
            cy.get('@purposeList1').then(purposeList1 => {
                expect(list).to.eq(purposeList1);
                cy.get('.ant-select-selector').eq(5).click();
            });
        });
    
        let amount = '310';
        batchPayments.addrecipientDetail(amount, email);
        batchPayments.checkSettelments1('be.disabled', 'be.enabled');
        let amount1 = 320;
        batchPayments.addrecipientDetail1(amount1, email1);
        batchPayments.checkSettelments2('be.disabled', 'be.enabled');
        batchPayments.proceedflow('GBP', 'GBP', 'Push Funds', 'Push Funds');
        batchPayments.validateScheduledproceedflow(amount, amount1, 4);
        //validate the draft payment
        
        cy.get('tbody tr:nth-child(2) td:nth-child(3)').should('be.visible').should('contain.text', 'Batch');
        cy.get('tbody tr:nth-child(3) td:nth-child(3)').should('be.visible').should('contain.text', 'Batch');
        cy.get('tbody tr:nth-child(3) td:nth-child(7)').should('be.visible').should('contain.text', amount);
        cy.get('tbody tr:nth-child(2) td:nth-child(7)').should('be.visible').should('contain.text', amount1);
    
    });

    //to if not coevered
    // AE/USD, CN/USD, BH/USD, IN/USD
    //these are exotic countries/currencies that requires a special POP for the payment to process, previously we were getting an error for accepting the qoute on these pair due to change of POP
    //need to fix the approval and scheduled payments for tcc, currently it's not working not sure why
 
})