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

    let userName = 'Corpay_test3@volopa.com';
    let password = 'testTest1';
    let apiEnv;   // dynamic env stored here

    beforeEach(() => {

        cy.visit('https://webapp01.mybusiness.volopa-dev.com/', { timeout: 10000 });
        cy.viewport(1440, 1000);

        cy.url().then((url) => {

            // Extract env number dynamically from webappXX
            const match = url.match(/webapp(\d+)\./);
            const envNumber = match ? match[1] : '01';  

            apiEnv = `VolopaApiOauth2WebApp${envNumber}`;
            Cypress.env("apiEnv", apiEnv);
        });

    });
    //Before executing Approval workflow cases, make sure no approval rule is set
    // change the approver, login user if need to run on differnt client
    //need to make a change to this function validateApprovedproceedflow() in batchpayment.js
    //Approval workflow for single Payment
    it('Verify that approval workflow is working correctly for GBP using push funds for single payments.', function () {
        signin.Login(userName, password);
    
        // steps to add approval rule
        newPayment.goToSettingCorpay();
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
        newRecipient.postCodeStateUS();
        //batchPayments.paymentPurposeGBPEUR();
    
        // cy.get('.ant-select-selector').eq(4).click();
        // cy.get('.ant-select-dropdown').eq(4).find('.ant-select-item-option-content').then(Element => {
        //     let purposeList = Element.text();
        //     cy.log(purposeList);
        //     cy.wrap(purposeList).as('purposeList');
        // });
    
        newRecipient.saveRecipient();
        //newPayment.checkSettelment('be.enabled', 'be.enabled');
        newPayment.proceedflow('{downarrow}{enter}', 'GBP');
    
        let amount = '410';
        newPayment.addrecipientDetail(amount, email);
        newPayment.selectFundingMethod('Push Funds');
    
       // Open the payment purpose dropdown
cy.get('div.ant-form-item .ant-select-selector')
  .eq(2)       // 3rd dropdown
  .click()     // open dropdown

// Click the first option directly
cy.get('.ant-select-dropdown')
  .last()      // pick the last rendered dropdown
  .find('.ant-select-item-option')
  .eq(0)       // first option
  .click({ force: true }) // force click in case of re-render


    
        // Validating recipient received amount
        cy.get(':nth-child(3) > :nth-child(2) > .ant-typography').invoke('text').then((text) => {
            const storedText = text;
            cy.wrap(storedText).as('storedText');
            cy.log(storedText);
        });
    
        cy.get('.ant-col > .ant-btn > span').should('be.visible').click();
        cy.get('.ant-modal-body > :nth-child(1) > .ant-col > .ant-typography').should('be.visible').should('contain.text', 'Payment Confirmation');
    
        cy.get('@storedText').then(storedText => {
            cy.get(':nth-child(4) > .ant-col-8 > .ant-typography')
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
        signin.Login('corpayapprover1@volopa.com', password);
        newPayment.goToNotification();
        newPayment.approvalNotification();
    
        // Validation on payment confirmation modal Approver user
        cy.get('.ant-modal-body > :nth-child(1) > .ant-col > .ant-typography')
            .should('be.visible')
            .should('contain.text', 'Payment Confirmation');
    
        cy.get('@storedText').then(storedText => {
            cy.get(':nth-child(4) > .ant-col-8 > .ant-typography')
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
    newPayment.goToSettingCorpay();
    newPayment.goToNotificationSetting();
    newPayment.goToApprovalWorkFlow();
    newPayment.removeApprovalrule()
    newPayment.saveApprovalRule();
    });
    xit('Verify that approval workflow is working correctly for GBP using Easy Transfer for single payment.', function () {
        signin.Login(userName, password);
    
        // steps to add approval rule
        newPayment.goToSettingCorpay();
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
        newRecipient.postCodeStateUS();
        //batchPayments.paymentPurposeGBPEUR();
    
        // cy.get('.ant-select-selector').eq(4).click();
        // cy.get('.ant-select-dropdown').eq(4).find('.ant-select-item-option-content').then(Element => {
        //     let purposeList = Element.text();
        //     cy.log(purposeList);
        //     cy.wrap(purposeList).as('purposeList');
        // });
    
        newRecipient.saveRecipient();
        //newPayment.checkSettelment('be.enabled', 'be.enabled');
        newPayment.proceedflow('{downarrow}{enter}', 'GBP');
    
        let amount = '310';
        newPayment.addrecipientDetail(amount, email);
        newPayment.selectFundingMethod('Easy Transfer');
        // Open the payment purpose dropdown
cy.get('div.ant-form-item .ant-select-selector')
  .eq(2)       // 3rd dropdown
  .click()     // open dropdown

// Click the first option directly
cy.get('.ant-select-dropdown')
  .last()      // pick the last rendered dropdown
  .find('.ant-select-item-option')
  .eq(0)       // first option
  .click({ force: true }) // force click in case of re-render
        
          
    
        // Validating recipient received amount
        cy.get(':nth-child(3) > :nth-child(2) > .ant-typography').invoke('text').then((text) => {
            const storedText = text;
            cy.wrap(storedText).as('storedText');
            cy.log(storedText);
        });
    
        cy.get('.ant-col > .ant-btn > span').should('be.visible').click();
        cy.get('.ant-modal-body > :nth-child(1) > .ant-col > .ant-typography').should('be.visible').should('contain.text', 'Payment Confirmation');
    
        cy.get('@storedText').then(storedText => {
            cy.get(':nth-child(4) > .ant-col-8 > .ant-typography')
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
        signin.Login('corpayapprover1@volopa.com', password);
        newPayment.goToNotification();
        newPayment.approvalNotification();
    
        // Validation on payment confirmation modal Approver user
        cy.get('.ant-modal-body > :nth-child(1) > .ant-col > .ant-typography')
            .should('be.visible')
            .should('contain.text', 'Payment Confirmation');
    
        cy.get('@storedText').then(storedText => {
            cy.get(':nth-child(4) > .ant-col-8 > .ant-typography')
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
    newPayment.goToSettingCorpay();
    newPayment.goToNotificationSetting();
    newPayment.goToApprovalWorkFlow();
    newPayment.removeApprovalrule()
    newPayment.saveApprovalRule();
    });
    //Volopa Collection Account method is not available for Corpay Clients
    xit('Verify that approval workflow is working correctly for GBP using Volopa Collection Account for single payment.', function () {
        signin.Login(userName, password);
    
        // steps to add approval rule
        newPayment.goToSettingCorpay();
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
        newRecipient.postCodeStateUS();
        //batchPayments.paymentPurposeGBPEUR();
    
        newRecipient.saveRecipient();
        //newPayment.checkSettelment('be.enabled', 'be.enabled');
        newPayment.proceedflow('{downarrow}{enter}', 'GBP');
    
        let amount = '400';
        newPayment.addrecipientDetail(amount, email);
        newPayment.selectFundingMethod('Volopa Collection Account');
    
        // Open the payment purpose dropdown
cy.get('div.ant-form-item .ant-select-selector')
  .eq(2)       // 3rd dropdown
  .click()     // open dropdown

// Click the first option directly
cy.get('.ant-select-dropdown')
  .last()      // pick the last rendered dropdown
  .find('.ant-select-item-option')
  .eq(0)       // first option
  .click({ force: true }) // force click in case of re-render
    
        // Validating recipient received amount
        cy.get(':nth-child(3) > :nth-child(2) > .ant-typography').invoke('text').then((text) => {
            const storedText = text;
            cy.wrap(storedText).as('storedText');
            cy.log(storedText);
        });
    
        cy.get('.ant-col > .ant-btn > span').should('be.visible').click();
        cy.get('.ant-modal-body > :nth-child(1) > .ant-col > .ant-typography').should('be.visible').should('contain.text', 'Payment Confirmation');
    
        cy.get('@storedText').then(storedText => {
            cy.get(':nth-child(4) > .ant-col-8 > .ant-typography')
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
        signin.Login('corpayapprover1@volopa.com', password);
        newPayment.goToNotification();
        newPayment.approvalNotification();
    
        // Validation on payment confirmation modal Approver user
        cy.get('.ant-modal-body > :nth-child(1) > .ant-col > .ant-typography')
            .should('be.visible')
            .should('contain.text', 'Payment Confirmation');
    
        cy.get('@storedText').then(storedText => {
            cy.get(':nth-child(4) > .ant-col-8 > .ant-typography')
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
    newPayment.goToSettingCorpay();
    newPayment.goToNotificationSetting();
    newPayment.goToApprovalWorkFlow();
    newPayment.removeApprovalrule()
    newPayment.saveApprovalRule();
    });
    //Approval workflow for batch payments
    it('Verify that approval workflow is working correctly for GBP using Push Funds for Batch payment.', function () {
        signin.Login(userName, password);
    
        // steps to add approval rule
        newPayment.goToSettingCorpay();
        newPayment.goToNotificationSetting();
        newPayment.goToApprovalWorkFlow();
        newPayment.setCurrencyforApproval('{enter}', 'GBP', '300');
        newPayment.setApprover('Approver{enter}');
        newPayment.saveApprovalRule();
    
        // create a payment for approval
        newRecipient.goToPaymentsDashborad();
        newRecipient.gotoRecipientList();
        let email = batchPayments.generateRandomString(5) + '@yopmail.com';
        batchPayments.addRecipient('UNITED ARAB EMIRATES{enter}', 'AED{enter}', email);
        newRecipient.addBankDetails('AE070331234567890123456', 'AARPAEAA');
        const lName = batchPayments.generateRandomString(6);
        batchPayments.individualRecipient('INDIVIDUAL ET', lName, 'UNITED ARAB EMIRATES{enter}');
        //batchPayments.paymentPurpose();
        // cy.get('.ant-select-selector').eq(3).click();
        // cy.get('.ant-select-dropdown').eq(3).find('.ant-select-item-option-content').then(Element => {
        //     let purposeList = Element.text();
        //     cy.log(purposeList);
        //     cy.wrap(purposeList).as('purposeList');
        // });
        newRecipient.saveRecipient();
        newRecipient.checkSettelment('be.disabled', 'be.enabled');
    
        newRecipient.gotoRecipientList();
        let email1 = batchPayments.generateRandomString(5) + '@yopmail.com';
        batchPayments.addRecipient('UNITED ARAB EMIRATES{enter}', 'AED{enter}', email1);
        newRecipient.addBankDetails('AE070331234567890123456', 'AARPAEAA');
        const lName1 = batchPayments.generateRandomString(6);
        batchPayments.individualRecipient('INDIVIDUAL AED ET', lName1, 'UNITED ARAB EMIRATES{enter}');
        //batchPayments.paymentPurpose1();
        // cy.get('.ant-select-selector').eq(3).click();
        // cy.get('.ant-select-dropdown').eq(3).find('.ant-select-item-option-content').then(Element => {
        //     let purposeList1 = Element.text();
        //     cy.log(purposeList1);
        //     cy.wrap(purposeList1).as('purposeList1');
        // });
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
    
        // First purpose dropdown
cy.get('.ant-select-selector')
  .eq(1)
  .click();

cy.get('.ant-select-dropdown')
  .last()
  .find('.ant-select-item-option')
  .eq(0)
  .click({ force: true });

// Second purpose dropdown
cy.wait(500);

cy.get('.ant-select-selector')
  .eq(3)
  .click();

cy.get('.ant-select-dropdown')
  .last()
  .find('.ant-select-item-option')
  .eq(0)
  .click({ force: true });
    
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
        signin.Login('corpayapprover1@volopa.com', password);
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
        cy.contains('button', 'View Payment').click()
        cy.get('.ant-spin-dot').should('not.exist');
    
        // Validate the payment history
        cy.get('[data-row-key="0"] > :nth-child(4)').should('be.visible').should('contain.text', 'Batch');
        cy.get('[data-row-key="1"] > :nth-child(4)').should('be.visible').should('contain.text', 'Batch');
        cy.get('[data-row-key="0"] > :nth-child(8) > .ant-space').should('be.visible').should('contain.text', amount1);
        cy.get('[data-row-key="1"] > :nth-child(8) > .ant-space').should('be.visible').should('contain.text', amount);
    
        // Remove the Approval Rule
        newPayment.goToSettingCorpay();
        newPayment.goToNotificationSetting();
        newPayment.goToApprovalWorkFlow();
        newPayment.removeApprovalrule();
        newPayment.saveApprovalRule();
    });
    //Volopa Collection Account method is not available for Corpay Clients
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
        cy.get('.ant-select-selector').eq(3).click();
        cy.get('.ant-select-dropdown').eq(2).find('.ant-select-item-option-content').then(Element => {
            let list = Element.text();
            cy.log(list);
            cy.get('@purposeList1').then(purposeList1 => {
                expect(list).to.eq(purposeList1);
                cy.get('.ant-select-selector').eq(3).click();
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
        signin.Login('hamzaQA3@volopa.com','testTest1');
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
    it('Verify that approval workflow is working correctly for GBP using Easy Transfer for Batch payment.', function () {
        signin.Login(userName, password);
    
        // steps to add approval rule
        newPayment.goToSettingCorpay();
        newPayment.goToNotificationSetting();
        newPayment.goToApprovalWorkFlow();
        newPayment.setCurrencyforApproval('{enter}', 'GBP', '300');
        newPayment.setApprover('Approver{enter}');
        newPayment.saveApprovalRule();
    
        // create a payment for approval
        newRecipient.goToPaymentsDashborad();
        newRecipient.gotoRecipientList();
        let email = batchPayments.generateRandomString(5) + '@yopmail.com';
        batchPayments.addRecipient('UNITED ARAB EMIRATES{enter}', 'AED{enter}', email);
        newRecipient.addBankDetails('AE070331234567890123456', 'AARPAEAA');
        const lName = batchPayments.generateRandomString(6);
        batchPayments.individualRecipient('INDIVIDUAL ET', lName, 'UNITED ARAB EMIRATES{enter}');
        // batchPayments.paymentPurpose();
        // cy.get('.ant-select-selector').eq(3).click();
        // cy.get('.ant-select-dropdown').eq(3).find('.ant-select-item-option-content').then(Element => {
        //     let purposeList = Element.text();
        //     cy.log(purposeList);
        //     cy.wrap(purposeList).as('purposeList');
        // });
        newRecipient.saveRecipient();
        newRecipient.checkSettelment('be.disabled', 'be.enabled');
    
        newRecipient.gotoRecipientList();
        let email1 = batchPayments.generateRandomString(5) + '@yopmail.com';
        batchPayments.addRecipient('UNITED ARAB EMIRATES{enter}', 'AED{enter}', email1);
        newRecipient.addBankDetails('AE070331234567890123456', 'AARPAEAA');
        const lName1 = batchPayments.generateRandomString(6);
        batchPayments.individualRecipient('INDIVIDUAL AED ET', lName1, 'UNITED ARAB EMIRATES{enter}');
        // batchPayments.paymentPurpose1();
        // cy.get('.ant-select-selector').eq(3).click();
        // cy.get('.ant-select-dropdown').eq(3).find('.ant-select-item-option-content').then(Element => {
        //     let purposeList1 = Element.text();
        //     cy.log(purposeList1);
        //     cy.wrap(purposeList1).as('purposeList1');
        // });
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
    
        // First purpose dropdown
cy.get('.ant-select-selector')
  .eq(1)
  .click();

cy.get('.ant-select-dropdown')
  .last()
  .find('.ant-select-item-option')
  .eq(0)
  .click({ force: true });

// Second purpose dropdown
cy.wait(500);

cy.get('.ant-select-selector')
  .eq(3)
  .click();

cy.get('.ant-select-dropdown')
  .last()
  .find('.ant-select-item-option')
  .eq(0)
  .click({ force: true });
    
        let amount = '930';
        batchPayments.addrecipientDetail(amount, email);
        batchPayments.checkSettelments1('be.disabled', 'be.enabled');
        let amount1 = 940;
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
        signin.Login('corpayapprover1@volopa.com', password);
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
            cy.get('div[class="ant-space ant-space-horizontal ant-space-align-center"] div:nth-child(2) button:nth-child(1)').should('be.visible').click()
        // // Navigate to View Payment
        // cy.get(':nth-child(4) > .ant-col > .ant-space > :nth-child(1) > .ant-btn').should('be.visible').click();
        // cy.get('.ant-spin-dot').should('not.exist');
    
        // Validate the payment history
        cy.get('[data-row-key="0"] > :nth-child(4)').should('be.visible').should('contain.text', 'Batch');
        cy.get('[data-row-key="1"] > :nth-child(4)').should('be.visible').should('contain.text', 'Batch');
        cy.get('[data-row-key="0"] > :nth-child(8) > .ant-space').should('be.visible').should('contain.text', amount1);
        cy.get('[data-row-key="1"] > :nth-child(8) > .ant-space').should('be.visible').should('contain.text', amount);
    
        // Remove the Approval Rule
        newPayment.goToSettingCorpay();
        newPayment.goToNotificationSetting();
        newPayment.goToApprovalWorkFlow();
        newPayment.removeApprovalrule();
        newPayment.saveApprovalRule();
    });

})