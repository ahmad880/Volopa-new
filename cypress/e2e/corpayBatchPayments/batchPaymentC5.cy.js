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
it('TC-AC-041 - Verify that if Currency= NOK and Country = UNITED KINGDOM & client = UK and check priority settlement is enabled and make a batch payment with GBP using Push Funds', function () {

    // ─────────────── Login ───────────────
    signin.Login(userName, password)
    newRecipient.goToPaymentsDashborad()
    newRecipient.gotoRecipientList()

    // ─────────────── Beneficiary 1 ───────────────
    let rand1 = batchPayments.generateRandomString(5)
    let email1 = rand1 + '@yopmail.com'
    let bene1 = 'UK NOK ' + rand1

    newRecipient.addRecipient('UNITED KINGDOM{enter}', 'NOK{enter}', email1)
    newRecipient.addBankDetails('GB73BARC20039538243547', 'AFFLGB22')
    newRecipient.individualRecipient(bene1, 'UNITED KINGDOM{enter}')
    newRecipient.saveRecipient()

    // Settlement validation (recipient level)
    newRecipient.checkSettelment('be.disabled', 'be.enabled')

    // ─────────────── Beneficiary 2 ───────────────
    newRecipient.gotoRecipientList()

    let rand2 = batchPayments.generateRandomString(5)
    let email2 = rand2 + '@yopmail.com'
    let bene2 = 'UK NOK ' + rand2

    newRecipient.addRecipient('UNITED KINGDOM{enter}', 'NOK{enter}', email2)
    newRecipient.addBankDetails('GB73BARC20039538243547', 'AFFLGB22')
    newRecipient.individualRecipient(bene2, 'UNITED KINGDOM{enter}')
    newRecipient.saveRecipient()

    // ─────────────── Batch Payment Flow ───────────────
    batchPayments.goToBatchPaymentPage()
    batchPayments.goToPayMultipleRecipient()

    // Add both beneficiaries
    batchPayments.validateSearchBar(bene1 + '{enter}')
    cy.wait(2000)

    batchPayments.validateSearchBar(bene2 + '{enter}')
    cy.wait(2000)

    // ─────────────── Amount & Purpose ───────────────
    let amount1 = '350'
    let amount2 = '500'

    batchPayments.addrecipientDetail(amount1, email1)
    batchPayments.addrecipientDetail1(amount2, email2)

    // ─────────────── Settlement Validation (Batch level) ───────────────
    batchPayments.checkSettelments1('be.disabled', 'be.enabled')

    // ─────────────── Push Funds (GBP) ───────────────
    batchPayments.proceedflow('GBP', 'GBP', 'Push Fund', 'Push Fund')
    batchPayments.validateproceedflowCorpay(amount1, amount2)
})
it('TC-AC-042 - Verify that if Currency= NOK and Country = Norway & client = UK and check priority and regular both settlement are enabled and make a batch payment with GBP using Push Funds', function () {

    // ─────────────── Login ───────────────
    signin.Login(userName, password)
    newRecipient.goToPaymentsDashborad()
    newRecipient.gotoRecipientList()

    // ─────────────── Beneficiary 1 ───────────────
    let rand1 = batchPayments.generateRandomString(5)
    let email1 = rand1 + '@yopmail.com'
    let bene1 = 'Norway NOK ' + rand1

    newRecipient.addRecipient('Norway{enter}', 'NOK{enter}', email1)
    newRecipient.addBankDetails('NO8330001234567', 'SPTRNO22XXX')
    cy.get('#accNumber').should('be.visible').type('1234572')
    cy.get('#bank_code').should('be.visible').type('2000')
    newRecipient.individualRecipient(bene1, 'Norway{enter}')
    cy.get('#postcode').should('be.visible').type('50505')
    newRecipient.saveRecipient()

    // Settlement validation (recipient level)
    newRecipient.checkSettelmentEnabledBoth('be.enabled', 'be.enabled')

    // ─────────────── Beneficiary 2 ───────────────
    newRecipient.gotoRecipientList()

    let rand2 = batchPayments.generateRandomString(5)
    let email2 = rand2 + '@yopmail.com'
    let bene2 = 'Norway NOK ' + rand2

    newRecipient.addRecipient('Norway{enter}', 'NOK{enter}', email2)
    newRecipient.addBankDetails('NO8330001234567', 'SPTRNO22XXX')
    cy.get('#accNumber').should('be.visible').type('9876543')
    cy.get('#bank_code').should('be.visible').type('2000')
    newRecipient.individualRecipient(bene2, 'Norway{enter}')
    cy.get('#postcode').should('be.visible').type('60606')
    newRecipient.saveRecipient()

    // ─────────────── Batch Payment Flow ───────────────
    batchPayments.goToBatchPaymentPage()
    batchPayments.goToPayMultipleRecipient()

    batchPayments.validateSearchBar(bene1 + '{enter}')
    cy.wait(2000)
    batchPayments.validateSearchBar(bene2 + '{enter}')
    cy.wait(2000)

    // ─────────────── Amounts ───────────────
    let amount1 = '40'
    let amount2 = '65'

    batchPayments.addrecipientDetail(amount1, email1)
    batchPayments.selectSettlementByIndex(0)
    batchPayments.addrecipientDetail1(amount2, email2)
    batchPayments.selectSettlementByIndex(1)
    // ─────────────── Push Funds (GBP) ───────────────
    batchPayments.proceedflow('GBP', 'GBP', 'Push Fund', 'Push Fund')
    batchPayments.validateproceedflowCorpay(amount1, amount2)
})
it('TC-AC-043 - Verify that if Currency= JPY and Country = UNITED KINGDOM & client = UK and check priority settlement is enabled and make a batch payment with GBP using Push Funds', function () {

    // ─────────────── Login ───────────────
    signin.Login(userName, password)
    newRecipient.goToPaymentsDashborad()
    newRecipient.gotoRecipientList()

    // ─────────────── Beneficiary 1 ───────────────
    let rand1 = batchPayments.generateRandomString(5)
    let email1 = rand1 + '@yopmail.com'
    let bene1 = 'UK JPY ' + rand1

    newRecipient.addRecipient('UNITED KINGDOM{enter}', 'JPY{enter}', email1)
    newRecipient.addBankDetails('GB73BARC20039538243547', 'AFFLGB22')
    newRecipient.individualRecipient(bene1, 'UNITED KINGDOM{enter}')
    newRecipient.saveRecipient()

    // Settlement validation (recipient level)
    newRecipient.checkSettelment('be.disabled', 'be.enabled')

    // ─────────────── Beneficiary 2 ───────────────
    newRecipient.gotoRecipientList()

    let rand2 = batchPayments.generateRandomString(5)
    let email2 = rand2 + '@yopmail.com'
    let bene2 = 'UK JPY ' + rand2

    newRecipient.addRecipient('UNITED KINGDOM{enter}', 'JPY{enter}', email2)
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
    let amount1 = '500'
    let amount2 = '750'

    batchPayments.addrecipientDetail(amount1, email1)
    batchPayments.addrecipientDetail1(amount2, email2)

    // ─────────────── Settlement Validation (Batch level) ───────────────
    batchPayments.checkSettelments1('be.disabled', 'be.enabled')

    // ─────────────── Push Funds (GBP) ───────────────
    batchPayments.proceedflow('GBP', 'GBP', 'Push Fund', 'Push Fund')
    batchPayments.validateproceedflowCorpay(amount1, amount2)
})
it('TC-AC-044 - Verify that if Currency= JPY and Country = Japan & client = UK and check priority settlement is enabled and make a batch payment with GBP using Push Funds', function () {

    // ─────────────── Login ───────────────
    signin.Login(userName, password)
    newRecipient.goToPaymentsDashborad()
    newRecipient.gotoRecipientList()

    // ─────────────── Beneficiary 1 ───────────────
    let rand1 = batchPayments.generateRandomString(5)
    let email1 = rand1 + '@yopmail.com'
    let bene1 = 'Japan JPY ' + rand1

    newRecipient.addRecipient('Japan{enter}', 'JPY{enter}', email1)
    newRecipient.addBankDetailsWithAccNo('BOJPJPJTXXX', '049712')
    cy.get('#bankBranch').should('be.visible').type('City branch')
    newRecipient.individualRecipient(bene1, 'Japan{enter}')
    newRecipient.saveRecipient()

    // Settlement validation (recipient level)
    newRecipient.checkSettelment('be.disabled', 'be.enabled')

    // ─────────────── Beneficiary 2 ───────────────
    newRecipient.gotoRecipientList()

    let rand2 = batchPayments.generateRandomString(5)
    let email2 = rand2 + '@yopmail.com'
    let bene2 = 'Japan JPY ' + rand2

    newRecipient.addRecipient('Japan{enter}', 'JPY{enter}', email2)
    newRecipient.addBankDetailsWithAccNo('BOJPJPJTXXX', '049713')
    cy.get('#bankBranch').should('be.visible').type('Main branch')
    newRecipient.individualRecipient(bene2, 'Japan{enter}')
    newRecipient.saveRecipient()

    // ─────────────── Batch Payment Flow ───────────────
    batchPayments.goToBatchPaymentPage()
    batchPayments.goToPayMultipleRecipient()

    batchPayments.validateSearchBar(bene1 + '{enter}')
    cy.wait(1500)
    batchPayments.validateSearchBar(bene2 + '{enter}')
    cy.wait(1500)

    // ─────────────── Amounts ───────────────
    let amount1 = '500'
    let amount2 = '800'

    batchPayments.addrecipientDetail(amount1, email1)
    batchPayments.addrecipientDetail1(amount2, email2)

    // ─────────────── Settlement Validation (Batch level) ───────────────
    batchPayments.checkSettelments1('be.disabled', 'be.enabled')

    // ─────────────── Push Funds (GBP) ───────────────
    batchPayments.proceedflow('GBP', 'GBP', 'Push Fund', 'Push Fund')
    batchPayments.validateproceedflowCorpay(amount1, amount2)
})
it('TC-AC-045 - Verify that if Currency= CAD and Country = UNITED KINGDOM & client = UK and check priority settlement is enabled and make a batch payment with GBP using Push Funds', function () {

    // ─────────────── Login ───────────────
    signin.Login(userName, password)
    newRecipient.goToPaymentsDashborad()
    newRecipient.gotoRecipientList()

    // ─────────────── Beneficiary 1 ───────────────
    let rand1 = batchPayments.generateRandomString(5)
    let email1 = rand1 + '@yopmail.com'
    let bene1 = 'UK CAD ' + rand1

    newRecipient.addRecipient('UNITED KINGDOM{enter}', 'CAD{enter}', email1)
    newRecipient.addBankDetails('GB73BARC20039538243547', 'AFFLGB22')
    newRecipient.individualRecipient(bene1, 'UNITED KINGDOM{enter}')
    newRecipient.saveRecipient()

    // Settlement check (recipient level)
    newRecipient.checkSettelment('be.disabled', 'be.enabled')

    // ─────────────── Beneficiary 2 ───────────────
    newRecipient.gotoRecipientList()

    let rand2 = batchPayments.generateRandomString(5)
    let email2 = rand2 + '@yopmail.com'
    let bene2 = 'UK CAD ' + rand2

    newRecipient.addRecipient('UNITED KINGDOM{enter}', 'CAD{enter}', email2)
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
    let amount1 = '50'
    let amount2 = '70'

    batchPayments.addrecipientDetail(amount1, email1)
    batchPayments.addrecipientDetail1(amount2, email2)

    // ─────────────── Settlement Validation (Batch) ───────────────
    batchPayments.checkSettelments1('be.disabled', 'be.enabled')

    // ─────────────── Push Funds (GBP) ───────────────
    batchPayments.proceedflow('GBP', 'GBP', 'Push Fund', 'Push Fund')
    batchPayments.validateproceedflowCorpay(amount1,amount2)
})
xit('TC-AC-046 - Verify that if Currency= CAD and Country = Canada & client = UK and check priority and regular settlement are enabled and make a batch payment with GBP using Push Funds', function () {

    // ─────────────── Login ───────────────
    signin.Login(userName, password)
    newRecipient.goToPaymentsDashborad()
    newRecipient.gotoRecipientList()

    // ─────────────── Beneficiary 1 ───────────────
    const rand1 = batchPayments.generateRandomString(5)
    const email1 = rand1 + '@yopmail.com'
    const bene1 = 'Canada CAD ' + rand1

    newRecipient.addRecipient('Canada{enter}', 'CAD{enter}', email1)
    newRecipient.addBankDetailsWithAccNo('ROYCCAT2XXX', '0497124')
    cy.get('#bank_code').should('be.visible').type('004')
    cy.get('#branch_code').should('be.visible').type('07171')
    newRecipient.individualRecipient(bene1, 'Canada{enter}')
    newRecipient.postCodeStateCanada()
    newRecipient.saveRecipient()

    // Settlement check (recipient level)
    newRecipient.checkSettelmentEnabledBoth('be.enabled', 'be.enabled')

    // ─────────────── Beneficiary 2 ───────────────
    newRecipient.gotoRecipientList()

    const rand2 = batchPayments.generateRandomString(5)
    const email2 = rand2 + '@yopmail.com'
    const bene2 = 'Canada CAD ' + rand2

    newRecipient.addRecipient('Canada{enter}', 'CAD{enter}', email2)
    newRecipient.addBankDetailsWithAccNo('ROYCCAT2XXX', '0497124')
    cy.get('#bank_code').should('be.visible').type('004')
    cy.get('#branch_code').should('be.visible').type('07171')
    newRecipient.individualRecipient(bene2, 'Canada{enter}')
    newRecipient.postCodeStateCanada()
    newRecipient.saveRecipient()

    // ─────────────── Batch Payment Flow ───────────────
    batchPayments.goToBatchPaymentPage()
    batchPayments.goToPayMultipleRecipient()

    batchPayments.validateSearchBar(bene1 + '{enter}')
    cy.wait(1500)
    batchPayments.validateSearchBar(bene2 + '{enter}')
    cy.wait(1500)

    // ─────────────── Amounts ───────────────
    const amount1 = '400'
    const amount2 = '600'

    batchPayments.addrecipientDetail(amount1, email1)
    batchPayments.selectSettlementByIndex(0)
    batchPayments.addrecipientDetail1(amount2, email2)
    batchPayments.selectSettlementByIndex(1)

    // ─────────────── Proceed with Push Funds ───────────────
    batchPayments.proceedflow('GBP', 'GBP', 'Push Fund', 'Push Fund')
    batchPayments.validateproceedflowCorpay(amount1, amount2)
})
it('TC-AC-047 - Verify that if Currency= USD and Country = UNITED KINGDOM & client = UK and check priority settlement is enabled and make a batch payment with GBP using Push Funds', function () {

    // ─────────────── Login ───────────────
    signin.Login(userName, password)
    newRecipient.goToPaymentsDashborad()
    newRecipient.gotoRecipientList()

    // ─────────────── Beneficiary 1 ───────────────
    const rand1 = batchPayments.generateRandomString(5)
    const email1 = rand1 + '@yopmail.com'
    const bene1 = 'UK USD ' + rand1

    newRecipient.addRecipient('UNITED KINGDOM{enter}', 'USD{enter}', email1)
    newRecipient.addBankDetails('GB73BARC20039538243547', 'AFFLGB22')
    newRecipient.individualRecipient(bene1, 'UNITED KINGDOM{enter}')
    newRecipient.saveRecipient()
    newRecipient.checkSettelment('be.disabled', 'be.enabled')

    // ─────────────── Beneficiary 2 ───────────────
    newRecipient.gotoRecipientList()

    const rand2 = batchPayments.generateRandomString(5)
    const email2 = rand2 + '@yopmail.com'
    const bene2 = 'UK USD ' + rand2

    newRecipient.addRecipient('UNITED KINGDOM{enter}', 'USD{enter}', email2)
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
    const amount1 = '50'
    const amount2 = '70'

    batchPayments.addrecipientDetail(amount1, email1)
    batchPayments.addrecipientDetail1(amount2, email2)

    // ─────────────── Settlement Validation (Batch) ───────────────
    batchPayments.checkSettelment('be.disabled', 'be.enabled')

    // ─────────────── Proceed with Push Funds ───────────────
    batchPayments.proceedflow('GBP', 'GBP', 'Push Fund', 'Push Fund')
    batchPayments.validateproceedflowCorpay(amount1, amount2)
})
xit('TC-AC-048 - Verify that if Currency= USD and Country = UNITED STATES & client = UK and check priority and regular settlement are enabled and make a batch payment with GBP using Push Funds', function () {

    // ─────────────── Login ───────────────
    signin.Login(userName, password)
    newRecipient.goToPaymentsDashborad()
    newRecipient.gotoRecipientList()

    // ─────────────── Beneficiary 1 ───────────────
    const rand1 = batchPayments.generateRandomString(5)
    const email1 = rand1 + '@yopmail.com'
    const bene1 = 'US USD ' + rand1

    newRecipient.addRecipient('United States{enter}', 'USD{enter}', email1)
    newRecipient.addBankDetailsWithAccNo('USBKUS44', '011401533')
    cy.get('#aba').should('be.visible').type('026009593')
    newRecipient.individualRecipient(bene1, 'United States{enter}')
    newRecipient.postCodeStateUS()
    newRecipient.saveRecipient()
    newRecipient.checkSettelmentEnabledBoth('be.enabled', 'be.enabled')

    // ─────────────── Beneficiary 2 ───────────────
    newRecipient.gotoRecipientList()

    const rand2 = batchPayments.generateRandomString(5)
    const email2 = rand2 + '@yopmail.com'
    const bene2 = 'US USD ' + rand2

    newRecipient.addRecipient('United States{enter}', 'USD{enter}', email2)
    newRecipient.addBankDetailsWithAccNo('USBKUS44', '011401533')
    cy.get('#aba').should('be.visible').type('026009593')
    newRecipient.individualRecipient(bene2, 'United States{enter}')
    newRecipient.postCodeStateUS()
    newRecipient.saveRecipient()

    // ─────────────── Batch Payment Flow ───────────────
    batchPayments.goToBatchPaymentPage()
    batchPayments.goToPayMultipleRecipient()

    batchPayments.validateSearchBar(bene1 + '{enter}')
    cy.wait(1500)
    batchPayments.validateSearchBar(bene2 + '{enter}')
    cy.wait(1500)

    // ─────────────── Amounts ───────────────
    const amount1 = '1000'
    const amount2 = '1500'

    batchPayments.addrecipientDetail(amount1, email1)
    batchPayments.selectSettlementByIndex(0)
    batchPayments.addrecipientDetail1(amount2, email2)
    batchPayments.selectSettlementByIndex(1)
    // ─────────────── Proceed with Push Funds ───────────────
    batchPayments.proceedflow('GBP', 'GBP', 'Push Fund', 'Push Fund')
    batchPayments.validateproceedflowCorpay(amount1, amount2)
})
it('TC-AC-049 - Verify that if Currency= EUR and Country = UNITED KINGDOM & client = UK and check priority and regular settlement are enabled and make a batch payment with GBP using Push Funds', function () {

    // ─────────────── Login ───────────────
    signin.Login(userName, password)
    newRecipient.goToPaymentsDashborad()
    newRecipient.gotoRecipientList()

    // ─────────────── Beneficiary 1 ───────────────
    const rand1 = batchPayments.generateRandomString(5)
    const email1 = rand1 + '@yopmail.com'
    const bene1 = 'UK EUR ' + rand1

    newRecipient.addRecipient('UNITED KINGDOM{enter}', 'EUR{enter}', email1)
    newRecipient.addBankDetails('GB73BARC20039538243547', 'AFFLGB22')
    newRecipient.individualRecipient(bene1, 'UNITED KINGDOM{enter}')
    newRecipient.saveRecipient()
    newRecipient.checkSettelmentEnabledBoth('be.enabled', 'be.enabled')

    // ─────────────── Beneficiary 2 ───────────────
    newRecipient.gotoRecipientList()

    const rand2 = batchPayments.generateRandomString(5)
    const email2 = rand2 + '@yopmail.com'
    const bene2 = 'UK EUR ' + rand2

    newRecipient.addRecipient('UNITED KINGDOM{enter}', 'EUR{enter}', email2)
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
    batchPayments.selectSettlementByIndex(0)
    batchPayments.addrecipientDetail1(amount2, email2)
    batchPayments.selectSettlementByIndex(1)
    // ─────────────── Proceed with Push Funds ───────────────
    batchPayments.proceedflow('GBP', 'GBP', 'Push Fund', 'Push Fund')
    batchPayments.validateproceedflowCorpay(amount1, amount2)
})
it('TC-AC-050 - Verify that if Currency= EUR and Country = Spain & client = UK and check priority and regular both settlement are enabled and make a batch payment with GBP using Push Funds', function () {

    // ─────────────── Login ───────────────
    signin.Login(userName, password)
    newRecipient.goToPaymentsDashborad()
    newRecipient.gotoRecipientList()

    // ─────────────── Beneficiary 1 ───────────────
    const rand1 = batchPayments.generateRandomString(5)
    const email1 = rand1 + '@yopmail.com'
    const bene1 = 'Spain EUR ' + rand1

    newRecipient.addRecipient('SPAIN{enter}', 'EUR{enter}', email1)
    newRecipient.addBankDetails('ES7921000813610123456789', 'CAIXESBBXXX')
    newRecipient.individualRecipient(bene1, 'SPAIN{enter}')
    newRecipient.saveRecipient()
    newRecipient.checkSettelmentEnabledBoth('be.enabled', 'be.enabled')

    // ─────────────── Beneficiary 2 ───────────────
    newRecipient.gotoRecipientList()

    const rand2 = batchPayments.generateRandomString(5)
    const email2 = rand2 + '@yopmail.com'
    const bene2 = 'Spain EUR ' + rand2

    newRecipient.addRecipient('SPAIN{enter}', 'EUR{enter}', email2)
    newRecipient.addBankDetails('ES7921000813610123456789', 'CAIXESBBXXX')
    newRecipient.individualRecipient(bene2, 'SPAIN{enter}')
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

})