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
it('TC-AC-061 - Verify that if Currency= CNY and Country = UNITED KINGDOM & client = UK and check priority settlement is enabled and make a batch payment with GBP using Push Funds', function () {

    // ─────────────── Login ───────────────
    signin.Login(userName, password)
    newRecipient.goToPaymentsDashborad()
    newRecipient.gotoRecipientList()

    // ─────────────── Beneficiary 1 ───────────────
    const rand1 = batchPayments.generateRandomString(5)
    const email1 = rand1 + '@yopmail.com'
    const bene1 = 'UK CNY ' + rand1

    newRecipient.addRecipient('UNITED KINGDOM{enter}', 'CNY{enter}', email1)
    newRecipient.addBankDetails('GB73BARC20039538243547', 'AFFLGB22')
    newRecipient.individualRecipient(bene1, 'UNITED KINGDOM{enter}')
    newRecipient.saveRecipient()
    newRecipient.checkSettelment('be.disabled', 'be.enabled')

    // ─────────────── Beneficiary 2 ───────────────
    newRecipient.gotoRecipientList()
    const rand2 = batchPayments.generateRandomString(5)
    const email2 = rand2 + '@yopmail.com'
    const bene2 = 'UK CNY ' + rand2

    newRecipient.addRecipient('UNITED KINGDOM{enter}', 'CNY{enter}', email2)
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

//new added currencies
it('TC-AC-062 - Verify that if Currency = PKR and Country = UNITED KINGDOM & client = UK and check priority settlement is enabled and make a batch payment with GBP using Push Funds', function () {

    // ─────────────── Login ───────────────
    signin.Login(userName, password)
    newRecipient.goToPaymentsDashborad()
    newRecipient.gotoRecipientList()

    // ─────────────── Beneficiary 1 ───────────────
    const rand1 = batchPayments.generateRandomString(5)
    const email1 = rand1 + '@yopmail.com'
    const bene1 = 'UK PKR ' + rand1

    newRecipient.addRecipient('UNITED KINGDOM{enter}', 'PKR{enter}', email1)
    newRecipient.addBankDetails('PK36SCBL0000001123456702', 'AIINPKKA')
    newRecipient.individualRecipient(bene1, 'UNITED KINGDOM{enter}')
    newRecipient.saveRecipient()
    newRecipient.checkSettelment('be.disabled', 'be.enabled')

    // ─────────────── Beneficiary 2 ───────────────
    newRecipient.gotoRecipientList()

    const rand2 = batchPayments.generateRandomString(5)
    const email2 = rand2 + '@yopmail.com'
    const bene2 = 'UK PKR ' + rand2

    newRecipient.addRecipient('UNITED KINGDOM{enter}', 'PKR{enter}', email2)
    newRecipient.addBankDetails('PK36SCBL0000001123456702', 'AIINPKKA')
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
it('TC-AC-063 - Verify that if Currency = PKR and Country = Pakistan & client = UK and check priority settlement is enabled and make a batch payment with GBP using Push Funds', function () {

    // ─────────────── Login ───────────────
    signin.Login(userName, password)
    newRecipient.goToPaymentsDashborad()
    newRecipient.gotoRecipientList()

    // ─────────────── Beneficiary 1 ───────────────
    const rand1 = batchPayments.generateRandomString(5)
    const email1 = rand1 + '@yopmail.com'
    const bene1 = 'Pakistan PKR ' + rand1

    newRecipient.addRecipient('Pakistan{enter}', 'PKR{enter}', email1)
    newRecipient.addBankDetails('PK36SCBL0000001123456702', 'AIINPKKA')
    newRecipient.individualRecipient(bene1, 'Pakistan{enter}')
    newRecipient.saveRecipient()
    newRecipient.checkSettelment('be.disabled', 'be.enabled')

    // ─────────────── Beneficiary 2 ───────────────
    newRecipient.gotoRecipientList()

    const rand2 = batchPayments.generateRandomString(5)
    const email2 = rand2 + '@yopmail.com'
    const bene2 = 'Pakistan PKR ' + rand2

    newRecipient.addRecipient('Pakistan{enter}', 'PKR{enter}', email2)
    newRecipient.addBankDetails('PK36SCBL0000001123456702', 'AIINPKKA')
    newRecipient.individualRecipient(bene2, 'Pakistan{enter}')
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
it('TC-AC-064 - Verify that if Currency = MUR and Country = UNITED KINGDOM & client = UK and check priority settlement is enabled and make a batch payment with GBP using Push Funds', function () {

    // ─────────────── Login ───────────────
    signin.Login(userName, password)
    newRecipient.goToPaymentsDashborad()
    newRecipient.gotoRecipientList()

    // ─────────────── Beneficiary 1 ───────────────
    const rand1 = batchPayments.generateRandomString(5)
    const email1 = rand1 + '@yopmail.com'
    const bene1 = 'UK MUR ' + rand1

    newRecipient.addRecipient('UNITED KINGDOM{enter}', 'MUR{enter}', email1)
    newRecipient.addBankDetails(
        'MU43BOMM0101123456789101000MUR',
        'MCBLMUMUXXX'
    )
    newRecipient.individualRecipient(bene1, 'UNITED KINGDOM{enter}')
    newRecipient.saveRecipient()
    newRecipient.checkSettelment('be.disabled', 'be.enabled')

    // ─────────────── Beneficiary 2 ───────────────
    newRecipient.gotoRecipientList()

    const rand2 = batchPayments.generateRandomString(5)
    const email2 = rand2 + '@yopmail.com'
    const bene2 = 'UK MUR ' + rand2

    newRecipient.addRecipient('UNITED KINGDOM{enter}', 'MUR{enter}', email2)
    newRecipient.addBankDetails(
        'MU43BOMM0101123456789101000MUR',
        'MCBLMUMUXXX'
    )
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
it('TC-AC-065 - Verify that if Currency = MUR and Country = Mauritius & client = UK and check priority settlement is enabled and make a batch payment with GBP using Push Funds', function () {

    // ─────────────── Login ───────────────
    signin.Login(userName, password)
    newRecipient.goToPaymentsDashborad()
    newRecipient.gotoRecipientList()

    // ─────────────── Beneficiary 1 ───────────────
    const rand1 = batchPayments.generateRandomString(5)
    const email1 = rand1 + '@yopmail.com'
    const bene1 = 'Mauritius MUR ' + rand1

    newRecipient.addRecipient('Mauritius{enter}', 'MUR{enter}', email1)
    newRecipient.addBankDetails(
        'MU43BOMM0101123456789101000MUR',
        'MCBLMUMUXXX'
    )
    newRecipient.individualRecipient(bene1, 'Mauritius{enter}')
    newRecipient.saveRecipient()
    newRecipient.checkSettelment('be.disabled', 'be.enabled')

    // ─────────────── Beneficiary 2 ───────────────
    newRecipient.gotoRecipientList()

    const rand2 = batchPayments.generateRandomString(5)
    const email2 = rand2 + '@yopmail.com'
    const bene2 = 'Mauritius MUR ' + rand2

    newRecipient.addRecipient('Mauritius{enter}', 'MUR{enter}', email2)
    newRecipient.addBankDetails(
        'MU43BOMM0101123456789101000MUR',
        'MCBLMUMUXXX'
    )
    newRecipient.individualRecipient(bene2, 'Mauritius{enter}')
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
it('TC-AC-066 - Verify that if Currency = GHS and Country = UNITED KINGDOM & client = UK and check priority settlement is enabled and make a batch payment with GBP using Push Funds', function () {

    // ─────────────── Login ───────────────
    signin.Login(userName, password)
    newRecipient.goToPaymentsDashborad()
    newRecipient.gotoRecipientList()

    // ─────────────── Beneficiary 1 ───────────────
    const rand1 = batchPayments.generateRandomString(5)
    const email1 = rand1 + '@yopmail.com'
    const bene1 = 'UK GHS ' + rand1

    newRecipient.addRecipient('UNITED KINGDOM{enter}', 'GHS{enter}', email1)
    newRecipient.addBankDetails(
        'MU43BOMM0101123456789101000MUR',
        'MCBLMUMUXXX'
    )
    newRecipient.individualRecipient(bene1, 'UNITED KINGDOM{enter}')
    newRecipient.saveRecipient()
    newRecipient.checkSettelment('be.disabled', 'be.enabled')

    // ─────────────── Beneficiary 2 ───────────────
    newRecipient.gotoRecipientList()

    const rand2 = batchPayments.generateRandomString(5)
    const email2 = rand2 + '@yopmail.com'
    const bene2 = 'UK GHS ' + rand2

    newRecipient.addRecipient('UNITED KINGDOM{enter}', 'GHS{enter}', email2)
    newRecipient.addBankDetails(
        'MU43BOMM0101123456789101000MUR',
        'MCBLMUMUXXX'
    )
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
it('TC-AC-067 - Verify that if Currency = GHS and Country = Ghana & client = UK and check priority settlement is enabled and make a batch payment with GBP using Push Funds', function () {

    // ─────────────── Login ───────────────
    signin.Login(userName, password)
    newRecipient.goToPaymentsDashborad()
    newRecipient.gotoRecipientList()

    // ─────────────── Beneficiary 1 ───────────────
    const rand1 = batchPayments.generateRandomString(5)
    const email1 = rand1 + '@yopmail.com'
    const bene1 = 'Ghana GHS ' + rand1

    newRecipient.addRecipient('Ghana{enter}', 'GHS{enter}', email1)
    newRecipient.addBankDetailsWithAccNo('BARCGHACCSS', '0114015331')
    newRecipient.individualRecipient(bene1, 'Ghana{enter}')
    newRecipient.saveRecipient()
    newRecipient.checkSettelment('be.disabled', 'be.enabled')

    // ─────────────── Beneficiary 2 ───────────────
    newRecipient.gotoRecipientList()

    const rand2 = batchPayments.generateRandomString(5)
    const email2 = rand2 + '@yopmail.com'
    const bene2 = 'Ghana GHS ' + rand2

    newRecipient.addRecipient('Ghana{enter}', 'GHS{enter}', email2)
    newRecipient.addBankDetailsWithAccNo('BARCGHACCSS', '0114015331')
    newRecipient.individualRecipient(bene2, 'Ghana{enter}')
    newRecipient.saveRecipient()

    // ─────────────── Batch Payment Flow ───────────────
    batchPayments.goToBatchPaymentPage()
    batchPayments.goToPayMultipleRecipient()

    batchPayments.validateSearchBar(bene1 + '{enter}')
    cy.wait(1500)
    batchPayments.validateSearchBar(bene2 + '{enter}')
    cy.wait(1500)

    // ─────────────── Amounts ───────────────
    const amount1 = '12'
    const amount2 = '18'

    batchPayments.addrecipientDetail(amount1, email1)
    batchPayments.addrecipientDetail1(amount2, email2)

    // ─────────────── Settlement Validation (Batch) ───────────────
    newRecipient.checkSettelment('be.disabled', 'be.enabled')

    // ─────────────── Proceed with Push Funds ───────────────
    batchPayments.proceedflow('GBP', 'GBP', 'Push Fund', 'Push Fund')
    batchPayments.validateproceedflowCorpay(amount1, amount2)
})
it('TC-AC-068 - Verify (business) that if Currency = CNY and Country = China & client = UK and check priority settlement is enabled and make a batch payment with GBP using Push Funds', function () {

    // ─────────────── Login ───────────────
    signin.Login(userName, password)
    newRecipient.goToPaymentsDashborad()
    newRecipient.gotoRecipientList()

    // ─────────────── Beneficiary 1 (Business) ───────────────
    const rand1 = batchPayments.generateRandomString(5)
    const email1 = rand1 + '@yopmail.com'
    const bene1 = 'CNY China Business ' + rand1

    newRecipient.addRecipient('China{enter}', 'CNY{enter}', email1)
    newRecipient.addBankDetailsChina('AFFLGB22', '55555555', '103100000026')
    newRecipient.BusinessCNY(bene1, 'China{enter}')
    newRecipient.saveRecipient()
    newRecipient.checkSettelment('be.disabled', 'be.enabled')

    // ─────────────── Beneficiary 2 (Business) ───────────────
    newRecipient.gotoRecipientList()

    const rand2 = batchPayments.generateRandomString(5)
    const email2 = rand2 + '@yopmail.com'
    const bene2 = 'CNY China Business ' + rand2

    newRecipient.addRecipient('China{enter}', 'CNY{enter}', email2)
    newRecipient.addBankDetailsChina('AFFLGB22', '55555555', '103100000026')
    newRecipient.BusinessCNY(bene2, 'China{enter}')
    newRecipient.saveRecipient()

    // ─────────────── Batch Payment Flow ───────────────
    batchPayments.goToBatchPaymentPage()
    batchPayments.goToPayMultipleRecipient()

    batchPayments.validateSearchBar(bene1 + '{enter}')
    cy.wait(1500)
    batchPayments.validateSearchBar(bene2 + '{enter}')
    cy.wait(1500)

    // ─────────────── Amounts ───────────────
    const amount1 = '20'
    const amount2 = '30'

    batchPayments.addrecipientDetail(amount1, email1)
    batchPayments.addrecipientDetail1(amount2, email2)

    // ─────────────── Settlement Validation (Batch) ───────────────
    newRecipient.checkSettelment('be.disabled', 'be.enabled')

    // ─────────────── Proceed with EUR Push Funds ───────────────
    batchPayments.proceedflow('GBP', 'GBP', 'Push Fund', 'Push Fund')
    batchPayments.validateproceedflowCorpay(amount1, amount2)
})

//Easy Transfer
it('TC-AC-069 - Verify that if Currency= GBP and Country = UNITED KINGDOM & client = UK and check priority and regular both settlement are enabled and make a batch payment with GBP using Easy Transfer', function () {

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
    batchPayments.proceedflow('EUR', 'EUR', 'Easy Transfer', 'Easy Transfer')
    batchPayments.validateproceedflowCorpay(amount1, amount2)
    batchPayments.validateYapilyFlow()
})
it('TC-AC-070 - Verify that if Currency= EUR and Country = Spain & client = UK and check priority and regular both settlement are enabled and make a batch payment with GBP using Easy Transfer', function () {

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
    batchPayments.proceedflow('GBP', 'GBP', 'Easy Transfer', 'Easy Transfer')
    batchPayments.validateproceedflowCorpay(amount1, amount2)
    batchPayments.validateYapilyFlow()
})

})