/// <reference types = "cypress"/>

import { SigninPage } from "../PageObject/PageAction/SigninPage"
import { PaymentsDashboard } from "../PageObject/PageAction/PaymentsDashboard"

const signin = new SigninPage
const paymentspage = new PaymentsDashboard

describe('Payments Dashboard',function(){
    let userName = 'testnew@volopa.com'
    let password = 'testTest1'
    beforeEach(() => {
        cy.window().then((win) => {
            win.localStorage.clear();
            win.sessionStorage.clear();
        });
    cy.visit('https://webapp4.volopa.com/login')
        paymentspage.clearCache()
        signin.Login(userName, password)
        cy.viewport(1440,1000)
    })

    it('TC_PD_001 - Verify that user landed on the Payments Dashboard page', function(){
        paymentspage.goToPaymentsDashborad()
    })
    xit('TC_PD_002 - Validate that the the total company wallet balance is equal to the sum of wallet balance + card balance', function(){
        paymentspage.goToPaymentsDashborad()
        paymentspage.validateCardtotalBalance()
    })
    it('TC_PD_003 - Verify that user is redirecting to Recipient List screen', function(){
        paymentspage.goToPaymentsDashborad()
        paymentspage.goToAddRecipient()
    })
    it('TC_PD_004 - Verify that user is redirecting to New Payment screen', function(){
        paymentspage.goToPaymentsDashborad()
        paymentspage.goToNewPayment()
    })
    it('TC_PD_005 - Verify that user is redirecting to Batch Payment screen', function(){
        paymentspage.goToPaymentsDashborad()
        paymentspage.goToNewBatchPayments()
    })
    it('TC_PD_006 - Verify that recent activities is appearing in the "Recent Activity" section', function(){
        paymentspage.goToPaymentsDashborad()
        paymentspage.validateRecentActivity()
    })
    it('TC_PD_007 - Verify that repeated recipients are appearing in the "Frequent Recipients" section', function(){
        paymentspage.goToPaymentsDashborad()
        paymentspage.validateFrequentRecipients()
    })
    it('TC_PD_008 - Verify that "Pay" button present on Payment Dashboard page in Frequent Recipients section is diecting to New Payment page', function(){
        paymentspage.goToPaymentsDashborad()
        paymentspage.clickOnPayBtn()
    })
    it('TC_PD_009 - Verify that recent payments are appearing in Payment History section', function(){
        paymentspage.goToPaymentsDashborad()
        paymentspage.validateRecentPayments()
    })
    xit('TC_PD_010 - Verify that information on the Recent Activity section are accurate', function(){
        paymentspage.goToPaymentsDashborad()
       
    })
    it('TC_PD_011 - Verify that "Repeat" button present on Payment Dashboard page in Recent Payments section is diecting to New Payment page', function(){
        paymentspage.goToPaymentsDashborad()
       paymentspage.clickOnRepeatBtn()
    })
})