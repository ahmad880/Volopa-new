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

describe('New Payment',function(){
    let userName = 'testnew@volopa.com'
    let password = 'testTest1'
    beforeEach(() => {
        cy.visit('https://webapp3.volopa.com/')
        paymentspage.clearCache()
        signin.Login(userName, password)
        cy.viewport(1440,1000)
    })
    it('TC_NP_001 - Verify that user landed on the New Payment page', function(){
        paymentspage.goToPaymentsDashborad()
        newPayment.goToNewPaymentPage()
    })
    it('TC_NP_002 - Verify that user can search the existing recipients in the search bar', function(){
        paymentspage.goToPaymentsDashborad()
        newPayment.goToNewPaymentPage()
        newPayment.validateSearchField('Y17{enter}')
    })
    it('TC_NP_003 - Verify that "Add recipient" button under Seach Bar navigates to Recipient Details Page', function(){
        paymentspage.goToPaymentsDashborad()
        newPayment.goToNewPaymentPage()
        newPayment.validateAddRecipient()
    })
    it('TC_NP_004 - Verify that user is able to navigate Create a Payment page', function(){
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
    it('TC_NP_006 - Verify that FX rate is appearing and will refresh every 30 seconds.', function(){
        paymentspage.goToPaymentsDashborad()
        newPayment.goToNewPaymentPage()
        newPayment.validateSearchField('hamza QA{enter}')
        newPayment.proceedflow('{enter}','GBP')
        cy.get('#youSend').type('200')
        newPayment.validateFxRateTimer()
    })
    it('TC_NP_007 - Verify that user is able to navigate "Recipient Details" on clicking the "View Details" button under the "Recipient Details" tag present on Create a payment Page', function(){
        paymentspage.goToPaymentsDashborad()
        newPayment.goToNewPaymentPage()
        newPayment.validateSearchField('hamza QA{enter}')
        cy.get(':nth-child(1) > .ant-col-24 > .ant-card > .ant-card-body > .ant-row-space-between > :nth-child(1)').should('contain.text','Recipient Details')
        cy.get('[style="padding-left: 12px; padding-right: 12px; flex: 1 1 auto;"] > .ant-row > .ant-col').should('be.visible').click()
        cy.get(':nth-child(1) > .ant-col > .ant-typography').should('contain.text','Recipient Details')
    })
    it('TC_NP_008 - Verify that user is able to pay the recipient (Not yapily flow - Currencies other than "Euro" and "GBP")', function(){
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
        paymentspage.goToPaymentsDashborad()
        newPayment.goToNewPaymentPage()
        newPayment.validateSearchField('hamza QA{enter}')
        newPayment.proceedflow('{enter}','GBP')
        cy.get('#youSend').type('200')
        newPayment.validatePayTheRecipient()
        cy.get('.ant-row-center.m-t-20 > .ant-col > .ant-space > :nth-child(2) > .ant-btn').should('be.visible').and('contain.text','View Payment').click()
        cy.get(':nth-child(1) > .ant-col > .ant-typography').should('be.visible').and('contain.text','Payment History')
    })

})