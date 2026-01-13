/// <reference types = "cypress"/>

import { BatchPayments } from "../../PageObject/PageAction/BatchPayments"
import { SigninPage } from "../../PageObject/PageAction/SigninPage"
import { PaymentsDashboard } from "../../PageObject/PageAction/PaymentsDashboard"
import { AdditionalCurrencies } from "../../PageObject/PageAction/AdditionalCurrencies";

const newRecipient = new AdditionalCurrencies
const batchPayments = new BatchPayments
const signin = new SigninPage
const paymentspage = new PaymentsDashboard

describe('Batch Payments',function(){
    let userName = 'Corpay_test1@volopa.com'
    let password = 'testTest1'
    beforeEach(() => {
        cy.visit('https://webapp01.mybusiness.volopa-dev.com/')
        paymentspage.clearCache()
        cy.viewport(1440,1000)
    })
it('TC-AC-051 - Verify that if Currency= AUD and Country = UNITED KINGDOM & client = UK and check priority settlement is enabled and make a batch payment with GBP using Push Funds', function () {

    // ─────────────── Login ───────────────
    signin.Login(userName, password)
    newRecipient.goToPaymentsDashborad()
    newRecipient.gotoRecipientList()

    // ─────────────── Beneficiary 1 ───────────────
    const rand1 = batchPayments.generateRandomString(5)
    const email1 = rand1 + '@yopmail.com'
    const bene1 = 'UK AUD ' + rand1

    newRecipient.addRecipient('UNITED KINGDOM{enter}', 'AUD{enter}', email1)
    newRecipient.addBankDetails('GB73BARC20039538243547', 'AFFLGB22')
    newRecipient.individualRecipient(bene1, 'UNITED KINGDOM{enter}')
    newRecipient.saveRecipient()
    newRecipient.checkSettelment('be.disabled', 'be.enabled')

    // ─────────────── Beneficiary 2 ───────────────
    newRecipient.gotoRecipientList()

    const rand2 = batchPayments.generateRandomString(5)
    const email2 = rand2 + '@yopmail.com'
    const bene2 = 'UK AUD ' + rand2

    newRecipient.addRecipient('UNITED KINGDOM{enter}', 'AUD{enter}', email2)
    newRecipient.addBankDetails('GB73BARC20039538243547', 'AFFLGB22')
    newRecipient.individualRecipient(bene2, 'UNITED KINGDOM{enter}')
    newRecipient.saveRecipient()

    // ─────────────── Batch Payment Flow ───────────────
    batchPayments.goToBatchPaymentPage()
    batchPayments.goToPayMultipleRecipient()

    batchPayments.validateSearchBar(bene1 + '{enter}')
    cy.wait(1500)
    batchPayments.validateSearchBar(bene2 + '{enter}')
    cy.wait(1500)

    // ─────────────── Amounts ───────────────
    const amount1 = '10'
    const amount2 = '15'

    batchPayments.addrecipientDetail(amount1, email1)
    batchPayments.addrecipientDetail1(amount2, email2)


    // ─────────────── Proceed with Push Funds ───────────────
    batchPayments.proceedflow('GBP', 'GBP', 'Push Fund', 'Push Fund')
    batchPayments.validateproceedflowCorpay(amount1, amount2)
})
it('TC-AC-052 - Verify that if Currency= AUD and Country = Australia & client = UK and check priority and regular both settlement are enabled and make a batch payment with GBP using Push Funds', function () {

    // ─────────────── Login ───────────────
    signin.Login(userName, password)
    newRecipient.goToPaymentsDashborad()
    newRecipient.gotoRecipientList()

    // ─────────────── Beneficiary 1 ───────────────
    const rand1 = batchPayments.generateRandomString(5)
    const email1 = rand1 + '@yopmail.com'
    const bene1 = 'Australia AUD ' + rand1

    newRecipient.addRecipient('Australia{enter}', 'AUD{enter}', email1)
    newRecipient.addBankDetailsWithAccNo('ANZBAU3MXXX', '011401533')
    cy.get('#bsb').should('be.visible').type('462541')
    newRecipient.individualRecipient(bene1, 'Australia{enter}')
    newRecipient.saveRecipient()
    newRecipient.checkSettelmentEnabledBoth('be.enabled', 'be.enabled')

    // ─────────────── Beneficiary 2 ───────────────
    newRecipient.gotoRecipientList()

    const rand2 = batchPayments.generateRandomString(5)
    const email2 = rand2 + '@yopmail.com'
    const bene2 = 'Australia AUD ' + rand2

    newRecipient.addRecipient('Australia{enter}', 'AUD{enter}', email2)
    newRecipient.addBankDetailsWithAccNo('ANZBAU3MXXX', '011401533')
    cy.get('#bsb').should('be.visible').type('462541')
    newRecipient.individualRecipient(bene2, 'Australia{enter}')
    newRecipient.saveRecipient()

    // ─────────────── Batch Payment Flow ───────────────
    batchPayments.goToBatchPaymentPage()
    batchPayments.goToPayMultipleRecipient()

    batchPayments.validateSearchBar(bene1 + '{enter}')
    cy.wait(1500)
    batchPayments.validateSearchBar(bene2 + '{enter}')
    cy.wait(1500)

    // ─────────────── Amounts ───────────────
    const amount1 = '10'
    const amount2 = '15'

    batchPayments.addrecipientDetail(amount1, email1)
    batchPayments.selectSettlementByIndex(0)
    batchPayments.addrecipientDetail1(amount2, email2)
    batchPayments.selectSettlementByIndex(1)
    // ─────────────── Proceed with Push Funds ───────────────
    batchPayments.proceedflow('GBP', 'GBP', 'Push Fund', 'Push Fund')
    batchPayments.validateproceedflowCorpay(amount1, amount2)
})
it('TC-AC-053 - Verify that if Currency= CHF and Country = UNITED KINGDOM & client = UK and check priority settlement is enabled and make a batch payment with GBP using Push Funds', function () {

    // ─────────────── Login ───────────────
    signin.Login(userName, password)
    newRecipient.goToPaymentsDashborad()
    newRecipient.gotoRecipientList()

    // ─────────────── Beneficiary 1 ───────────────
    const rand1 = batchPayments.generateRandomString(5)
    const email1 = rand1 + '@yopmail.com'
    const bene1 = 'UK CHF ' + rand1

    newRecipient.addRecipient('UNITED KINGDOM{enter}', 'CHF{enter}', email1)
    newRecipient.addBankDetails('GB73BARC20039538243547', 'AFFLGB22')
    newRecipient.individualRecipient(bene1, 'UNITED KINGDOM{enter}')
    newRecipient.saveRecipient()
    newRecipient.checkSettelment('be.disabled', 'be.enabled')

    // ─────────────── Beneficiary 2 ───────────────
    newRecipient.gotoRecipientList()

    const rand2 = batchPayments.generateRandomString(5)
    const email2 = rand2 + '@yopmail.com'
    const bene2 = 'UK CHF ' + rand2

    newRecipient.addRecipient('UNITED KINGDOM{enter}', 'CHF{enter}', email2)
    newRecipient.addBankDetails('GB73BARC20039538243547', 'AFFLGB22')
    newRecipient.individualRecipient(bene2, 'UNITED KINGDOM{enter}')
    newRecipient.saveRecipient()

    // ─────────────── Batch Payment Flow ───────────────
    batchPayments.goToBatchPaymentPage()
    batchPayments.goToPayMultipleRecipient()

    batchPayments.validateSearchBar(bene1 + '{enter}')
    cy.wait(1500)
    batchPayments.validateSearchBar(bene2 + '{enter}')
    cy.wait(1500)

    // ─────────────── Amounts ───────────────
    const amount1 = '10'
    const amount2 = '15'

    batchPayments.addrecipientDetail(amount1, email1)
    batchPayments.addrecipientDetail1(amount2, email2)

    // ─────────────── Proceed with Push Funds ───────────────
    batchPayments.proceedflow('GBP', 'GBP', 'Push Fund', 'Push Fund')
    batchPayments.validateproceedflowCorpay(amount1, amount2)
})
it('TC-AC-054 - Verify that if Currency= CHF and Country = Switzerland & client = UK and check priority settlement is enabled and make a batch payment with GBP using Push Funds', function () {

    // ─────────────── Login ───────────────
    signin.Login(userName, password)
    newRecipient.goToPaymentsDashborad()
    newRecipient.gotoRecipientList()

    // ─────────────── Beneficiary 1 ───────────────
    const rand1 = batchPayments.generateRandomString(5)
    const email1 = rand1 + '@yopmail.com'
    const bene1 = 'Switzerland CHF ' + rand1

    newRecipient.addRecipient('Switzerland{enter}', 'CHF{enter}', email1)
    newRecipient.addBankDetails('CH5604835012345678009', 'UBSWCHZH80A')
    newRecipient.individualRecipient(bene1, 'Switzerland{enter}')
    newRecipient.saveRecipient()
    newRecipient.checkSettelment('be.disabled', 'be.enabled')

    // ─────────────── Beneficiary 2 ───────────────
    newRecipient.gotoRecipientList()
    const rand2 = batchPayments.generateRandomString(5)
    const email2 = rand2 + '@yopmail.com'
    const bene2 = 'Switzerland CHF ' + rand2

    newRecipient.addRecipient('Switzerland{enter}', 'CHF{enter}', email2)
    newRecipient.addBankDetails('CH5604835012345678009', 'UBSWCHZH80A')
    newRecipient.individualRecipient(bene2, 'Switzerland{enter}')
    newRecipient.saveRecipient()

    // ─────────────── Batch Payment Flow ───────────────
    batchPayments.goToBatchPaymentPage()
    batchPayments.goToPayMultipleRecipient()

    batchPayments.validateSearchBar(bene1 + '{enter}')
    cy.wait(1500)
    batchPayments.validateSearchBar(bene2 + '{enter}')
    cy.wait(1500)

    // ─────────────── Amounts ───────────────
    const amount1 = '10'
    const amount2 = '15'

    batchPayments.addrecipientDetail(amount1, email1)
    batchPayments.addrecipientDetail1(amount2, email2)


    // ─────────────── Proceed with Push Funds ───────────────
    batchPayments.proceedflow('GBP', 'GBP', 'Push Fund', 'Push Fund')
    batchPayments.validateproceedflowCorpay(amount1, amount2)
})
it('TC-AC-055 - Verify that if Currency= THB and Country = UNITED KINGDOM & client = UK and check priority settlement is enabled and make a batch payment with GBP using Push Funds', function () {

    // ─────────────── Login ───────────────
    signin.Login(userName, password)
    newRecipient.goToPaymentsDashborad()
    newRecipient.gotoRecipientList()

    // ─────────────── Beneficiary 1 ───────────────
    const rand1 = batchPayments.generateRandomString(5)
    const email1 = rand1 + '@yopmail.com'
    const bene1 = 'UK THB ' + rand1

    newRecipient.addRecipient('UNITED KINGDOM{enter}', 'THB{enter}', email1)
    newRecipient.addBankDetails('GB73BARC20039538243547', 'AFFLGB22')
    newRecipient.individualRecipient(bene1, 'UNITED KINGDOM{enter}')
    newRecipient.saveRecipient()
    newRecipient.checkSettelment('be.disabled', 'be.enabled')

    // ─────────────── Beneficiary 2 ───────────────
    newRecipient.gotoRecipientList()
    const rand2 = batchPayments.generateRandomString(5)
    const email2 = rand2 + '@yopmail.com'
    const bene2 = 'UK THB ' + rand2

    newRecipient.addRecipient('UNITED KINGDOM{enter}', 'THB{enter}', email2)
    newRecipient.addBankDetails('GB73BARC20039538243547', 'AFFLGB22')
    newRecipient.individualRecipient(bene2, 'UNITED KINGDOM{enter}')
    newRecipient.saveRecipient()

    // ─────────────── Batch Payment Flow ───────────────
    batchPayments.goToBatchPaymentPage()
    batchPayments.goToPayMultipleRecipient()

    batchPayments.validateSearchBar(bene1 + '{enter}')
    cy.wait(1500)
    batchPayments.validateSearchBar(bene2 + '{enter}')
    cy.wait(1500)

    // ─────────────── Amounts ───────────────
    const amount1 = '10'
    const amount2 = '15'

    batchPayments.addrecipientDetail(amount1, email1)
    batchPayments.addrecipientDetail1(amount2, email2)

    // ─────────────── Proceed with Push Funds ───────────────
    batchPayments.proceedflow('GBP', 'GBP', 'Push Fund', 'Push Fund')
    batchPayments.validateproceedflowCorpay(amount1, amount2)
})
it('TC-AC-056 - Verify that if Currency= THB and Country = Thailand & client = UK and check priority settlement is enabled and make a batch payment with GBP using Push Funds', function () {

    // ─────────────── Login ───────────────
    signin.Login(userName, password)
    newRecipient.goToPaymentsDashborad()
    newRecipient.gotoRecipientList()

    // ─────────────── Beneficiary 1 ───────────────
    const rand1 = batchPayments.generateRandomString(5)
    const email1 = rand1 + '@yopmail.com'
    const bene1 = 'Thailand THB ' + rand1

    newRecipient.addRecipient('Thailand{enter}', 'THB{enter}', email1)
    newRecipient.addBankDetailsWithAccNo('BKKBTHBK', '0114015331')
    newRecipient.individualRecipient(bene1, 'Thailand{enter}')
    newRecipient.saveRecipient()
    newRecipient.checkSettelment('be.disabled', 'be.enabled')

    // ─────────────── Beneficiary 2 ───────────────
    newRecipient.gotoRecipientList()
    const rand2 = batchPayments.generateRandomString(5)
    const email2 = rand2 + '@yopmail.com'
    const bene2 = 'Thailand THB ' + rand2

    newRecipient.addRecipient('Thailand{enter}', 'THB{enter}', email2)
    newRecipient.addBankDetailsWithAccNo('BKKBTHBK', '0114015332') // can be a slightly different account
    newRecipient.individualRecipient(bene2, 'Thailand{enter}')
    newRecipient.saveRecipient()

    // ─────────────── Batch Payment Flow ───────────────
    batchPayments.goToBatchPaymentPage()
    batchPayments.goToPayMultipleRecipient()

    batchPayments.validateSearchBar(bene1 + '{enter}')
    cy.wait(1500)
    batchPayments.validateSearchBar(bene2 + '{enter}')
    cy.wait(1500)

    // ─────────────── Amounts ───────────────
    const amount1 = '10'
    const amount2 = '15'

    batchPayments.addrecipientDetail(amount1, email1)
    batchPayments.addrecipientDetail1(amount2, email2)

    // ─────────────── Settlement Validation (Batch) ───────────────
    newRecipient.checkSettelment('be.disabled', 'be.enabled')

    // ─────────────── Proceed with Push Funds ───────────────
    batchPayments.proceedflow('GBP', 'GBP', 'Push Fund', 'Push Fund')
    batchPayments.validateproceedflowCorpay(amount1, amount2)
})
it('TC-AC-057 - Verify that if Currency= HKD and Country = UNITED KINGDOM & client = UK and check priority settlement is enabled and make a batch payment with GBP using Push Funds', function () {

    // ─────────────── Login ───────────────
    signin.Login(userName, password)
    newRecipient.goToPaymentsDashborad()
    newRecipient.gotoRecipientList()

    // ─────────────── Beneficiary 1 ───────────────
    const rand1 = batchPayments.generateRandomString(5)
    const email1 = rand1 + '@yopmail.com'
    const bene1 = 'UK HKD ' + rand1

    newRecipient.addRecipient('UNITED KINGDOM{enter}', 'HKD{enter}', email1)
    newRecipient.addBankDetails('GB73BARC20039538243547', 'AFFLGB22')
    newRecipient.individualRecipient(bene1, 'UNITED KINGDOM{enter}')
    newRecipient.saveRecipient()
    newRecipient.checkSettelment('be.disabled', 'be.enabled')

    // ─────────────── Beneficiary 2 ───────────────
    newRecipient.gotoRecipientList()
    const rand2 = batchPayments.generateRandomString(5)
    const email2 = rand2 + '@yopmail.com'
    const bene2 = 'UK HKD ' + rand2

    newRecipient.addRecipient('UNITED KINGDOM{enter}', 'HKD{enter}', email2)
    newRecipient.addBankDetails('GB73BARC20039538243547', 'AFFLGB22')
    newRecipient.individualRecipient(bene2, 'UNITED KINGDOM{enter}')
    newRecipient.saveRecipient()

    // ─────────────── Batch Payment Flow ───────────────
    batchPayments.goToBatchPaymentPage()
    batchPayments.goToPayMultipleRecipient()

    batchPayments.validateSearchBar(bene1 + '{enter}')
    cy.wait(1500)
    batchPayments.validateSearchBar(bene2 + '{enter}')
    cy.wait(1500)

    // ─────────────── Amounts ───────────────
    const amount1 = '10'
    const amount2 = '15'

    batchPayments.addrecipientDetail(amount1, email1)
    batchPayments.addrecipientDetail1(amount2, email2)

    // ─────────────── Settlement Validation (Batch) ───────────────
    newRecipient.checkSettelment('be.disabled', 'be.enabled')

    // ─────────────── Proceed with Push Funds ───────────────
    batchPayments.proceedflow('GBP', 'GBP', 'Push Fund', 'Push Fund')
    batchPayments.validateproceedflowCorpay(amount1, amount2)
})
it('TC-AC-058 - Verify that if Currency= HKD and Country = Hong Kong & client = UK and check priority settlement is enabled and make a batch payment with GBP using Push Funds', function () {

    // ─────────────── Login ───────────────
    signin.Login(userName, password)
    newRecipient.goToPaymentsDashborad()
    newRecipient.gotoRecipientList()

    // ─────────────── Beneficiary 1 ───────────────
    const rand1 = batchPayments.generateRandomString(5)
    const email1 = rand1 + '@yopmail.com'
    const bene1 = 'Hong Kong HKD ' + rand1

    newRecipient.addRecipient('Hong Kong{enter}', 'HKD{enter}', email1)
    newRecipient.addBankDetailsWithAccNo('HSBCHKHHHKH', '0114015331')
    newRecipient.individualRecipient(bene1, 'Hong Kong{enter}')
    newRecipient.saveRecipient()
    newRecipient.checkSettelment('be.disabled', 'be.enabled')

    // ─────────────── Beneficiary 2 ───────────────
    newRecipient.gotoRecipientList()
    const rand2 = batchPayments.generateRandomString(5)
    const email2 = rand2 + '@yopmail.com'
    const bene2 = 'Hong Kong HKD ' + rand2

    newRecipient.addRecipient('Hong Kong{enter}', 'HKD{enter}', email2)
    newRecipient.addBankDetailsWithAccNo('HSBCHKHHHKH', '0114015332')
    newRecipient.individualRecipient(bene2, 'Hong Kong{enter}')
    newRecipient.saveRecipient()

    // ─────────────── Batch Payment Flow ───────────────
    batchPayments.goToBatchPaymentPage()
    batchPayments.goToPayMultipleRecipient()

    batchPayments.validateSearchBar(bene1 + '{enter}')
    cy.wait(1500)
    batchPayments.validateSearchBar(bene2 + '{enter}')
    cy.wait(1500)

    // ─────────────── Amounts ───────────────
    const amount1 = '10'
    const amount2 = '15'

    batchPayments.addrecipientDetail(amount1, email1)
    batchPayments.addrecipientDetail1(amount2, email2)

    // ─────────────── Settlement Validation (Batch) ───────────────
    newRecipient.checkSettelment('be.disabled', 'be.enabled')

    // ─────────────── Proceed with Push Funds ───────────────
    batchPayments.proceedflow('GBP', 'GBP', 'Push Fund', 'Push Fund')
    batchPayments.validateproceedflowCorpay(amount1, amount2)
})
it('TC-AC-029 - Verify that if Currency= GBP and Country = UNITED KINGDOM & client = UK and check priority and regular both settlement are enabled and make a batch payment with GBP using Push Funds', function () {

    // ─────────────── Login ───────────────
    signin.Login(userName, password)
    newRecipient.goToPaymentsDashborad()
    newRecipient.gotoRecipientList()

    // ─────────────── Beneficiary 1 ───────────────
    const rand1 = batchPayments.generateRandomString(5)
    const email1 = rand1 + '@yopmail.com'
    const bene1 = 'UK GBP ' + rand1

    newRecipient.addRecipient('UNITED KINGDOM{enter}', 'GBP{enter}', email1)
    newRecipient.addBankDetails('GB73BARC20039538243547', 'AFFLGB22')
    cy.get('#sortCode').should('be.visible').type('401276')
    cy.get('#accNumber').should('be.visible').type('56974456')
    newRecipient.individualRecipient(bene1, 'UNITED KINGDOM{enter}')
    newRecipient.saveRecipient()
    newRecipient.checkSettelmentEnabledBoth('be.enabled', 'be.enabled')

    // ─────────────── Beneficiary 2 ───────────────
    newRecipient.gotoRecipientList()
    const rand2 = batchPayments.generateRandomString(5)
    const email2 = rand2 + '@yopmail.com'
    const bene2 = 'UK GBP ' + rand2

    newRecipient.addRecipient('UNITED KINGDOM{enter}', 'GBP{enter}', email2)
    newRecipient.addBankDetails('GB73BARC20039538243547', 'AFFLGB22')
    cy.get('#sortCode').should('be.visible').type('401277')
    cy.get('#accNumber').should('be.visible').type('56974457')
    newRecipient.individualRecipient(bene2, 'UNITED KINGDOM{enter}')
    newRecipient.saveRecipient()

    // ─────────────── Batch Payment Flow ───────────────
    batchPayments.goToBatchPaymentPage()
    batchPayments.goToPayMultipleRecipient()

    batchPayments.validateSearchBar(bene1 + '{enter}')
    cy.wait(1500)
    batchPayments.validateSearchBar(bene2 + '{enter}')
    cy.wait(1500)

    // ─────────────── Amounts ───────────────
    const amount1 = '10'
    const amount2 = '15'

    batchPayments.addrecipientDetail(amount1, email1)
    batchPayments.selectSettlementByIndex(0)
    batchPayments.addrecipientDetail1(amount2, email2)
    batchPayments.selectSettlementByIndex(1)
    // ─────────────── Proceed with Push Funds ───────────────
    batchPayments.proceedflow('EUR', 'EUR', 'Push Fund', 'Push Fund')
    batchPayments.validateproceedflowCorpay(amount1, amount2)
})
it('TC-AC-060 - Verify that if Currency= GBP and Country = UNITED KINGDOM & client = UK and check priority settlement is enabled and make a batch payment with GBP using Push Funds', function () {

    // ─────────────── Login ───────────────
    signin.Login(userName, password)
    newRecipient.goToPaymentsDashborad()
    newRecipient.gotoRecipientList()

    // ─────────────── Beneficiary 1 ───────────────
    const rand1 = batchPayments.generateRandomString(5)
    const email1 = rand1 + '@yopmail.com'
    const bene1 = 'UK GBP Priority ' + rand1

    newRecipient.addRecipient('UNITED KINGDOM{enter}', 'GBP{enter}', email1)
    newRecipient.addBankDetails('GB73BARC20039538243547', 'AFFLGB22')
    cy.get('#sortCode').should('be.visible').type('401276')
    newRecipient.individualRecipient(bene1, 'UNITED KINGDOM{enter}')
    newRecipient.saveRecipient()
    newRecipient.checkSettelment('be.disabled', 'be.enabled')

    // ─────────────── Beneficiary 2 ───────────────
    newRecipient.gotoRecipientList()
    const rand2 = batchPayments.generateRandomString(5)
    const email2 = rand2 + '@yopmail.com'
    const bene2 = 'UK GBP Priority ' + rand2

    newRecipient.addRecipient('UNITED KINGDOM{enter}', 'GBP{enter}', email2)
    newRecipient.addBankDetails('GB73BARC20039538243547', 'AFFLGB22')
    cy.get('#sortCode').should('be.visible').type('401277')
    newRecipient.individualRecipient(bene2, 'UNITED KINGDOM{enter}')
    newRecipient.saveRecipient()

    // ─────────────── Batch Payment Flow ───────────────
    batchPayments.goToBatchPaymentPage()
    batchPayments.goToPayMultipleRecipient()

    batchPayments.validateSearchBar(bene1 + '{enter}')
    cy.wait(1500)
    batchPayments.validateSearchBar(bene2 + '{enter}')
    cy.wait(1500)

    // ─────────────── Amounts ───────────────
    const amount1 = '10'
    const amount2 = '15'

    batchPayments.addrecipientDetail(amount1, email1)
    batchPayments.addrecipientDetail1(amount2, email2)

    // ─────────────── Settlement Validation (Batch) ───────────────
    newRecipient.checkSettelment('be.disabled', 'be.enabled')

    // ─────────────── Proceed with Push Funds ───────────────
    batchPayments.proceedflow('EUR', 'EUR', 'Push Fund', 'Push Fund')
    batchPayments.validateproceedflowCorpay(amount1, amount2)
})

})