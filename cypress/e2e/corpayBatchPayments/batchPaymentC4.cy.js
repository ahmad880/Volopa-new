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
it('TC-AC-031 - Verify that if Currency= NZD and Country = UNITED KINGDOM & client = UK and check priority settlement is enabled and make a payment with GBP using Push Funds', function () {

    // ─────────────── Login & Navigation ───────────────
    signin.Login(userName, password)
    newRecipient.goToPaymentsDashborad()
    newRecipient.gotoRecipientList()

    // ─────────────── First Recipient ───────────────
    const lName = batchPayments.generateRandomString(6)
    const fullName1 = 'UK NZD ' + lName

    let email = batchPayments.generateRandomString(5) + '@yopmail.com'
    newRecipient.addRecipient('UNITED KINGDOM{enter}', 'NZD{enter}', email)
    newRecipient.addBankDetails('GB73BARC20039538243547', 'AFFLGB22')
    newRecipient.individualRecipient(fullName1, 'UNITED KINGDOM{enter}')
    newRecipient.saveRecipient()
    newRecipient.checkSettelment('be.disabled', 'be.enabled')   // Standard disabled, Priority enabled

    // ─────────────── Second Recipient ───────────────
    newRecipient.gotoRecipientList()

    const lName1 = batchPayments.generateRandomString(6)
    const fullName2 = 'UK NZD ' + lName1

    let email1 = batchPayments.generateRandomString(5) + '@yopmail.com'
    newRecipient.addRecipient('UNITED KINGDOM{enter}', 'NZD{enter}', email1)
    newRecipient.addBankDetails('GB73BARC20039538243547', 'AFFLGB22')
    newRecipient.individualRecipient(fullName2, 'UNITED KINGDOM{enter}')
    newRecipient.saveRecipient()
    newRecipient.checkSettelment('be.disabled', 'be.enabled')

    // ─────────────── Batch Payment Flow ───────────────
    cy.reload()
    batchPayments.goToBatchPaymentPage()
    batchPayments.goToPayMultipleRecipient()

    // ─────────────── Search Beneficiaries ───────────────
    batchPayments.validateSearchBar(fullName1 + '{enter}')
    cy.wait(3000)
    batchPayments.validateSearchBar(fullName2 + '{enter}')

    // ─────────────── Payment Purpose (Per Bene) ───────────────
    cy.get('.ant-select-selector').eq(1).click()
    cy.get('.ant-select-dropdown')
        .eq(1)
        .find('.ant-select-item-option-content')
        .first()
        .click()

    cy.get('.ant-select-selector').eq(3).click()
    cy.get('.ant-select-dropdown')
        .eq(2)
        .find('.ant-select-item-option-content')
        .first()
        .click()

    // ─────────────── Amount & Settlement Validation ───────────────
    let amount = '250'
    batchPayments.addrecipientDetail(amount, email)
    batchPayments.checkSettelments1('be.disabled', 'be.enabled')

    let amount1 = '260'
    batchPayments.addrecipientDetail1(amount1, email1)
    batchPayments.checkSettelments2('be.disabled', 'be.enabled')

    // ─────────────── Proceed with Payment ───────────────
    batchPayments.proceedflow('GBP', 'GBP', 'Push Fund', 'Push Fund')
    batchPayments.validateproceedflowCorpay(amount, amount1)

    // batchPayments.cancelPushFunds()
})
it('TC-AC-032 - Verify that if Currency= NZD and Country = New Zealand & client = UK and check priority settlement is enabled and make a payment with GBP using Push Funds', function () {

    // ─────────────── Login & Navigation ───────────────
    signin.Login(userName, password)
    newRecipient.goToPaymentsDashborad()
    newRecipient.gotoRecipientList()

    // ─────────────── First Recipient ───────────────
    const lName = batchPayments.generateRandomString(6)
    const fullName1 = 'NZ NZD ' + lName

    let email = batchPayments.generateRandomString(5) + '@yopmail.com'
    newRecipient.addRecipient('New Zealand{enter}', 'NZD{enter}', email)
    newRecipient.addBankDetailsWithAccNo('BKNZNZ22', '049712')
    cy.get('#bsb').should('be.visible').type('082082')
    newRecipient.individualRecipient(fullName1, 'New Zealand{enter}')
    cy.get('#postcode').should('be.visible').type('50505')
    newRecipient.saveRecipient()
    newRecipient.checkSettelment('be.disabled', 'be.enabled')   // Standard disabled, Priority enabled

    // ─────────────── Second Recipient ───────────────
    newRecipient.gotoRecipientList()

    const lName1 = batchPayments.generateRandomString(6)
    const fullName2 = 'NZ NZD ' + lName1

    let email1 = batchPayments.generateRandomString(5) + '@yopmail.com'
    newRecipient.addRecipient('New Zealand{enter}', 'NZD{enter}', email1)
    newRecipient.addBankDetailsWithAccNo('BKNZNZ22', '049712')
    cy.get('#bsb').should('be.visible').type('082082')
    newRecipient.individualRecipient(fullName2, 'New Zealand{enter}')
    cy.get('#postcode').should('be.visible').type('50505')
    newRecipient.saveRecipient()
    newRecipient.checkSettelment('be.disabled', 'be.enabled')

    // ─────────────── Batch Payment Flow ───────────────
    cy.reload()
    batchPayments.goToBatchPaymentPage()
    batchPayments.goToPayMultipleRecipient()

    // ─────────────── Search Beneficiaries ───────────────
    batchPayments.validateSearchBar(fullName1 + '{enter}')
    cy.wait(3000)
    batchPayments.validateSearchBar(fullName2 + '{enter}')

    // ─────────────── Payment Purpose (Per Bene) ───────────────
    cy.get('.ant-select-selector').eq(1).click()
    cy.get('.ant-select-dropdown')
        .eq(1)
        .find('.ant-select-item-option-content')
        .first()
        .click()

    cy.get('.ant-select-selector').eq(3).click()
    cy.get('.ant-select-dropdown')
        .eq(2)
        .find('.ant-select-item-option-content')
        .first()
        .click()

    // ─────────────── Amount & Settlement Validation ───────────────
    let amount = '250'
    batchPayments.addrecipientDetail(amount, email)
    batchPayments.checkSettelments1('be.disabled', 'be.enabled')

    let amount1 = '260'
    batchPayments.addrecipientDetail1(amount1, email1)
    batchPayments.checkSettelments2('be.disabled', 'be.enabled')

    // ─────────────── Proceed with Payment ───────────────
    batchPayments.proceedflow('GBP', 'GBP', 'Push Fund', 'Push Fund')
    batchPayments.validateproceedflowCorpay(amount, amount1)

    // batchPayments.cancelPushFunds()
})
it('TC-AC-033 - Verify that if Currency= ZAR and Country = UNITED KINGDOM & client = UK and check priority settlement is enabled and make a payment with GBP using Push Funds', function () {

    // ─────────────── Login & Navigation ───────────────
    signin.Login(userName, password)
    newRecipient.goToPaymentsDashborad()
    newRecipient.gotoRecipientList()

    // ─────────────── First Recipient ───────────────
    const lName = batchPayments.generateRandomString(6)
    const fullName1 = 'UK ZAR ' + lName

    let email = batchPayments.generateRandomString(5) + '@yopmail.com'
    newRecipient.addRecipient('UNITED KINGDOM{enter}', 'ZAR{enter}', email)
    newRecipient.addBankDetails('GB73BARC20039538243547', 'AFFLGB22')
    newRecipient.individualRecipient(fullName1, 'UNITED KINGDOM{enter}')
    newRecipient.saveRecipient()
    newRecipient.checkSettelment('be.disabled', 'be.enabled')

    // ─────────────── Second Recipient ───────────────
    newRecipient.gotoRecipientList()

    const lName1 = batchPayments.generateRandomString(6)
    const fullName2 = 'UK ZAR ' + lName1

    let email1 = batchPayments.generateRandomString(5) + '@yopmail.com'
    newRecipient.addRecipient('UNITED KINGDOM{enter}', 'ZAR{enter}', email1)
    newRecipient.addBankDetails('GB73BARC20039538243547', 'AFFLGB22')
    newRecipient.individualRecipient(fullName2, 'UNITED KINGDOM{enter}')
    newRecipient.saveRecipient()
    newRecipient.checkSettelment('be.disabled', 'be.enabled')

    // ─────────────── Batch Payment Flow ───────────────
    cy.reload()
    batchPayments.goToBatchPaymentPage()
    batchPayments.goToPayMultipleRecipient()

    // ─────────────── Search Beneficiaries ───────────────
    batchPayments.validateSearchBar(fullName1 + '{enter}')
    cy.wait(3000)
    batchPayments.validateSearchBar(fullName2 + '{enter}')

    // ─────────────── Payment Purpose (Per Beneficiary) ───────────────
    cy.get('.ant-select-selector').eq(1).click()
    cy.get('.ant-select-dropdown')
        .eq(1)
        .find('.ant-select-item-option-content')
        .first()
        .click()

    cy.get('.ant-select-selector').eq(3).click()
    cy.get('.ant-select-dropdown')
        .eq(2)
        .find('.ant-select-item-option-content')
        .first()
        .click()

    // ─────────────── Amount & Settlement Validation ───────────────
    let amount = '250'
    batchPayments.addrecipientDetail(amount, email)
    batchPayments.checkSettelments1('be.disabled', 'be.enabled')

    let amount1 = '260'
    batchPayments.addrecipientDetail1(amount1, email1)
    batchPayments.checkSettelments2('be.disabled', 'be.enabled')

    // ─────────────── Proceed with Payment ───────────────
    batchPayments.proceedflow('GBP', 'GBP', 'Push Fund', 'Push Fund')
    batchPayments.validateproceedflowCorpay(amount, amount1)

    // batchPayments.cancelPushFunds()
})
it('TC-AC-034 - Verify that if Currency= ZAR and Country = South Africa & client = UK and check priority settlement is enabled and make a payment with GBP using Push Funds', function () {

    // ─────────────── Login & Navigation ───────────────
    signin.Login(userName, password)
    newRecipient.goToPaymentsDashborad()
    newRecipient.gotoRecipientList()

    // ─────────────── First Recipient ───────────────
    const suffix1 = batchPayments.generateRandomString(5)
    const fullName1 = 'South Africa ZAR ' + suffix1
    const email1 = suffix1 + '@yopmail.com'

    newRecipient.addRecipient('South Africa{enter}', 'ZAR{enter}', email1)
    newRecipient.addBankDetailsWithAccNo('SARBZAJ6XXX', '049712')
    cy.get('#branch_code').should('be.visible').type('755026')
    cy.get('#bankBranch').should('be.visible').type('City branch')
    newRecipient.individualRecipient(fullName1, 'South Africa{enter}')
    newRecipient.saveRecipient()
    newRecipient.checkSettelment('be.disabled', 'be.enabled')

    // ─────────────── Second Recipient ───────────────
    newRecipient.gotoRecipientList()

    const suffix2 = batchPayments.generateRandomString(5)
    const fullName2 = 'South Africa ZAR ' + suffix2
    const email2 = suffix2 + '@yopmail.com'

    newRecipient.addRecipient('South Africa{enter}', 'ZAR{enter}', email2)
    newRecipient.addBankDetailsWithAccNo('SARBZAJ6XXX', '049712')
    cy.get('#branch_code').should('be.visible').type('755026')
    cy.get('#bankBranch').should('be.visible').type('City branch')
    newRecipient.individualRecipient(fullName2, 'South Africa{enter}')
    newRecipient.saveRecipient()
    newRecipient.checkSettelment('be.disabled', 'be.enabled')

    // ─────────────── Batch Payment Flow ───────────────
    cy.reload()
    batchPayments.goToBatchPaymentPage()
    batchPayments.goToPayMultipleRecipient()

    // ─────────────── Search & Select Beneficiaries ───────────────
    batchPayments.validateSearchBar(fullName1 + '{enter}')
    cy.wait(2000)
    batchPayments.validateSearchBar(fullName2 + '{enter}')

    // ─────────────── Payment Purpose (Per Beneficiary) ───────────────
    cy.get('.ant-select-selector').eq(1).click()
    cy.get('.ant-select-dropdown')
        .eq(1)
        .find('.ant-select-item-option-content')
        .first()
        .click()

    cy.get('.ant-select-selector').eq(3).click()
    cy.get('.ant-select-dropdown')
        .eq(2)
        .find('.ant-select-item-option-content')
        .first()
        .click()

    // ─────────────── Amount & Settlement Validation ───────────────
    const amount1 = '250'
    batchPayments.addrecipientDetail(amount1, email1)
    batchPayments.checkSettelments1('be.disabled', 'be.enabled')

    const amount2 = '260'
    batchPayments.addrecipientDetail1(amount2, email2)
    batchPayments.checkSettelments2('be.disabled', 'be.enabled')

    // ─────────────── Proceed Payment ───────────────
    batchPayments.proceedflow('GBP', 'GBP', 'Push Fund', 'Push Fund')
    batchPayments.validateproceedflowCorpay(amount1, amount2)

    // batchPayments.cancelPushFunds()
})
it('TC-AC-035 - Verify that if Currency= PLN and Country = UNITED KINGDOM & client = UK and check priority settlement is enabled and make a payment with GBP using Push Funds', function () {

    // ─────────────── Login & Navigation ───────────────
    signin.Login(userName, password)
    newRecipient.goToPaymentsDashborad()
    newRecipient.gotoRecipientList()

    // ─────────────── First Recipient ───────────────
    const suffix1 = batchPayments.generateRandomString(5)
    const fullName1 = 'UK PLN ' + suffix1
    const email1 = suffix1 + '@yopmail.com'

    newRecipient.addRecipient('UNITED KINGDOM{enter}', 'PLN{enter}', email1)
    newRecipient.addBankDetails('GB73BARC20039538243547', 'AFFLGB22')
    newRecipient.individualRecipient(fullName1, 'UNITED KINGDOM{enter}')
    newRecipient.saveRecipient()
    newRecipient.checkSettelment('be.disabled', 'be.enabled')

    // ─────────────── Second Recipient ───────────────
    newRecipient.gotoRecipientList()

    const suffix2 = batchPayments.generateRandomString(5)
    const fullName2 = 'UK PLN ' + suffix2
    const email2 = suffix2 + '@yopmail.com'

    newRecipient.addRecipient('UNITED KINGDOM{enter}', 'PLN{enter}', email2)
    newRecipient.addBankDetails('GB73BARC20039538243547', 'AFFLGB22')
    newRecipient.individualRecipient(fullName2, 'UNITED KINGDOM{enter}')
    newRecipient.saveRecipient()
    newRecipient.checkSettelment('be.disabled', 'be.enabled')

    // ─────────────── Batch Payment Flow ───────────────
    cy.reload()
    batchPayments.goToBatchPaymentPage()
    batchPayments.goToPayMultipleRecipient()

    // ─────────────── Search & Select Beneficiaries ───────────────
    batchPayments.validateSearchBar(fullName1 + '{enter}')
    cy.wait(2000)
    batchPayments.validateSearchBar(fullName2 + '{enter}')

    // ─────────────── Payment Purpose (Per Beneficiary) ───────────────
    cy.get('.ant-select-selector').eq(1).click()
    cy.get('.ant-select-dropdown')
        .eq(1)
        .find('.ant-select-item-option-content')
        .first()
        .click()

    cy.get('.ant-select-selector').eq(3).click()
    cy.get('.ant-select-dropdown')
        .eq(2)
        .find('.ant-select-item-option-content')
        .first()
        .click()

    // ─────────────── Amount & Settlement Validation ───────────────
    const amount1 = '210'
    batchPayments.addrecipientDetail(amount1, email1)
    batchPayments.checkSettelments1('be.disabled', 'be.enabled')

    const amount2 = '220'
    batchPayments.addrecipientDetail1(amount2, email2)
    batchPayments.checkSettelments2('be.disabled', 'be.enabled')

    // ─────────────── Proceed Payment ───────────────
    batchPayments.proceedflow('GBP', 'GBP', 'Push Fund', 'Push Fund')
    batchPayments.validateproceedflowCorpay(amount1, amount2)

    // batchPayments.cancelPushFunds()
})
it('TC-AC-036 - Verify that if Currency= PLN and Country = Poland & client = UK and check priority settlement is enabled and make a payment with GBP using Push Funds', function () {

    // ─────────────── Login & Navigation ───────────────
    signin.Login(userName, password)
    newRecipient.goToPaymentsDashborad()
    newRecipient.gotoRecipientList()

    // ─────────────── First Recipient ───────────────
    const suffix1 = batchPayments.generateRandomString(6)
    const fullName1 = 'Poland PLN ' + suffix1
    const email1 = suffix1 + '@yopmail.com'

    newRecipient.addRecipient('Poland{enter}', 'PLN{enter}', email1)
    newRecipient.addBankDetails('PL10105000997603123456789123', 'BPKOPLPWXXX')
    newRecipient.individualRecipient(fullName1, 'Poland{enter}')
    newRecipient.saveRecipient()
    newRecipient.checkSettelment('be.disabled', 'be.enabled')

    // ─────────────── Second Recipient ───────────────
    newRecipient.gotoRecipientList()

    const suffix2 = batchPayments.generateRandomString(6)
    const fullName2 = 'Poland PLN ' + suffix2
    const email2 = suffix2 + '@yopmail.com'

    newRecipient.addRecipient('Poland{enter}', 'PLN{enter}', email2)
    newRecipient.addBankDetails('PL10105000997603123456789123', 'BPKOPLPWXXX')
    newRecipient.individualRecipient(fullName2, 'Poland{enter}')
    newRecipient.saveRecipient()
    newRecipient.checkSettelment('be.disabled', 'be.enabled')

    // ─────────────── Batch Payment Flow ───────────────
    cy.reload()
    batchPayments.goToBatchPaymentPage()
    batchPayments.goToPayMultipleRecipient()

    // ─────────────── Search Beneficiaries ───────────────
    batchPayments.validateSearchBar(fullName1 + '{enter}')
    cy.wait(2000)
    batchPayments.validateSearchBar(fullName2 + '{enter}')

    // ─────────────── Payment Purpose (Per Bene) ───────────────
    cy.get('.ant-select-selector').eq(1).click()
    cy.get('.ant-select-dropdown')
        .eq(1)
        .find('.ant-select-item-option-content')
        .first()
        .click()

    cy.get('.ant-select-selector').eq(3).click()
    cy.get('.ant-select-dropdown')
        .eq(2)
        .find('.ant-select-item-option-content')
        .first()
        .click()

    // ─────────────── Amount & Settlement Validation ───────────────
    const amount1 = '230'
    batchPayments.addrecipientDetail(amount1, email1)
    batchPayments.checkSettelments1('be.disabled', 'be.enabled')

    const amount2 = '240'
    batchPayments.addrecipientDetail1(amount2, email2)
    batchPayments.checkSettelments2('be.disabled', 'be.enabled')

    // ─────────────── Proceed with Payment ───────────────
    batchPayments.proceedflow('GBP', 'GBP', 'Push Fund', 'Push Fund')
    batchPayments.validateproceedflowCorpay(amount1, amount2)

    // batchPayments.cancelPushFunds()
})
it('TC-AC-037 - Verify that if Currency= DKK and Country = UNITED KINGDOM & client = UK and check priority settlement is enabled and make a payment with GBP using Push Funds', function () {

    // ─────────────── Login & Navigation ───────────────
    signin.Login(userName, password)
    newRecipient.goToPaymentsDashborad()
    newRecipient.gotoRecipientList()

    // ─────────────── First Recipient ───────────────
    const suffix1 = batchPayments.generateRandomString(6)
    const fullName1 = 'UK DKK ' + suffix1
    const email1 = suffix1 + '@yopmail.com'

    newRecipient.addRecipient('UNITED KINGDOM{enter}', 'DKK{enter}', email1)
    newRecipient.addBankDetails('GB73BARC20039538243547', 'AFFLGB22')
    newRecipient.individualRecipient(fullName1, 'UNITED KINGDOM{enter}')
    newRecipient.saveRecipient()
    newRecipient.checkSettelment('be.disabled', 'be.enabled')

    // ─────────────── Second Recipient ───────────────
    newRecipient.gotoRecipientList()

    const suffix2 = batchPayments.generateRandomString(6)
    const fullName2 = 'UK DKK ' + suffix2
    const email2 = suffix2 + '@yopmail.com'

    newRecipient.addRecipient('UNITED KINGDOM{enter}', 'DKK{enter}', email2)
    newRecipient.addBankDetails('GB73BARC20039538243547', 'AFFLGB22')
    newRecipient.individualRecipient(fullName2, 'UNITED KINGDOM{enter}')
    newRecipient.saveRecipient()
    newRecipient.checkSettelment('be.disabled', 'be.enabled')

    // ─────────────── Batch Payment Flow ───────────────
    cy.reload()
    batchPayments.goToBatchPaymentPage()
    batchPayments.goToPayMultipleRecipient()

    // ─────────────── Search Beneficiaries ───────────────
    batchPayments.validateSearchBar(fullName1 + '{enter}')
    cy.wait(2000)
    batchPayments.validateSearchBar(fullName2 + '{enter}')

    // ─────────────── Payment Purpose (Per Bene) ───────────────
    cy.get('.ant-select-selector').eq(1).click()
    cy.get('.ant-select-dropdown')
        .eq(1)
        .find('.ant-select-item-option-content')
        .first()
        .click()

    cy.get('.ant-select-selector').eq(3).click()
    cy.get('.ant-select-dropdown')
        .eq(2)
        .find('.ant-select-item-option-content')
        .first()
        .click()

    // ─────────────── Amount & Settlement Validation ───────────────
    const amount1 = '210'
    batchPayments.addrecipientDetail(amount1, email1)
    batchPayments.checkSettelments1('be.disabled', 'be.enabled')

    const amount2 = '220'
    batchPayments.addrecipientDetail1(amount2, email2)
    batchPayments.checkSettelments2('be.disabled', 'be.enabled')

    // ─────────────── Proceed with Payment ───────────────
    batchPayments.proceedflow('GBP', 'GBP', 'Push Fund', 'Push Fund')
    batchPayments.validateproceedflowCorpay(amount1, amount2)

    // batchPayments.cancelPushFunds()
})
it('TC-AC-038 - Verify that if Currency= DKK and Country = Denmark & client = UK and check priority and regular both settlement are enabled and make a batch payment with GBP using Push Funds', function () {

    // ─────────────── Login ───────────────
    signin.Login(userName, password)
    newRecipient.goToPaymentsDashborad()
    newRecipient.gotoRecipientList()

    // ─────────────── Create Beneficiary 1 ───────────────
    let random1 = batchPayments.generateRandomString(5)
    let email1 = random1 + '@yopmail.com'
    let bene1 = 'Denmark DKK ' + random1

    newRecipient.addRecipient('Denmark{enter}', 'DKK{enter}', email1)
    newRecipient.addBankDetails('DK9520000123456789', 'NDEADKKKXXX')

    cy.get('#accNumber').should('be.visible').type('1234578912')
    cy.get('#bank_code').should('be.visible').type('2000')
    newRecipient.individualRecipient(bene1, 'Denmark{enter}')
    cy.get('#postcode').should('be.visible').type('50505')
    newRecipient.saveRecipient()

    // ─────────────── Create Beneficiary 2 ───────────────
    newRecipient.gotoRecipientList()

    let random2 = batchPayments.generateRandomString(5)
    let email2 = random2 + '@yopmail.com'
    let bene2 = 'Denmark DKK ' + random2

    newRecipient.addRecipient('Denmark{enter}', 'DKK{enter}', email2)
    newRecipient.addBankDetails('DK9520000123456789', 'NDEADKKKXXX')

    cy.get('#accNumber').should('be.visible').type('2234578912')
    cy.get('#bank_code').should('be.visible').type('2000')
    newRecipient.individualRecipient(bene2, 'Denmark{enter}')
    cy.get('#postcode').should('be.visible').type('50505')
    newRecipient.saveRecipient()

    // ─────────────── Batch Payment ───────────────
    batchPayments.goToBatchPaymentPage()
    batchPayments.goToPayMultipleRecipient()

    // Search & add Beneficiary 1
    batchPayments.validateSearchBar(bene1 + '{enter}')
    cy.wait(2000)

    // Search & add Beneficiary 2
    batchPayments.validateSearchBar(bene2 + '{enter}')
    cy.wait(2000)

    // ─────────────── Payment Details ───────────────
    let amount1 = '300'
    let amount2 = '400'

    batchPayments.addrecipientDetail(amount1, email1)
    batchPayments.selectSettlementByIndex(0)
    batchPayments.addrecipientDetail1(amount2, email2)
    batchPayments.selectSettlementByIndex(1)

    // ─────────────── Settlement Validation ───────────────
    

    // ─────────────── Push Funds (GBP) ───────────────
    batchPayments.proceedflow('GBP', 'GBP', 'Push Fund', 'Push Fund')
    batchPayments.validateproceedflowCorpay(amount1, amount2)
})
it('TC-AC-039 - Verify that if Currency= SEK and Country = UNITED KINGDOM & client = UK and check priority settlement is enabled and make a batch payment with GBP using Push Funds', function () {

    // ─────────────── Login ───────────────
    signin.Login(userName, password)
    newRecipient.goToPaymentsDashborad()
    newRecipient.gotoRecipientList()

    // ─────────────── Beneficiary 1 ───────────────
    let rand1 = batchPayments.generateRandomString(5)
    let email1 = rand1 + '@yopmail.com'
    let bene1 = 'UK SEK ' + rand1

    newRecipient.addRecipient('UNITED KINGDOM{enter}', 'SEK{enter}', email1)
    newRecipient.addBankDetails('GB73BARC20039538243547', 'AFFLGB22')
    newRecipient.individualRecipient(bene1, 'UNITED KINGDOM{enter}')
    newRecipient.saveRecipient()

    // Settlement validation (single bene screen)
    newRecipient.checkSettelment('be.disabled', 'be.enabled')

    // ─────────────── Beneficiary 2 ───────────────
    newRecipient.gotoRecipientList()

    let rand2 = batchPayments.generateRandomString(5)
    let email2 = rand2 + '@yopmail.com'
    let bene2 = 'UK SEK ' + rand2

    newRecipient.addRecipient('UNITED KINGDOM{enter}', 'SEK{enter}', email2)
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
    let amount1 = '250'
    let amount2 = '350'

    batchPayments.addrecipientDetail(amount1, email1)
    batchPayments.addrecipientDetail1(amount2, email2)

    // ─────────────── Settlement Validation (Batch) ───────────────
    batchPayments.checkSettelments1('be.disabled', 'be.enabled')

    // ─────────────── Push Funds (GBP) ───────────────
    batchPayments.proceedflow('GBP', 'GBP', 'Push Fund', 'Push Fund')
    batchPayments.validateproceedflowCorpay(amount1, amount2)
})
it('TC-AC-040 - Verify that if Currency= SEK and Country = SWEDEN & client = UK and check priority settlement is enabled and make a batch payment with GBP using Push Funds', function () {

    // ─────────────── Login ───────────────
    signin.Login(userName, password)
    newRecipient.goToPaymentsDashborad()
    newRecipient.gotoRecipientList()

    // ─────────────── Beneficiary 1 ───────────────
    let rand1 = batchPayments.generateRandomString(5)
    let email1 = rand1 + '@yopmail.com'
    let bene1 = 'Sweden SEK ' + rand1

    newRecipient.addRecipient('Sweden{enter}', 'SEK{enter}', email1)
    newRecipient.addBankDetails('SE7280000810340009783242', 'SWEDSESSXXX')
    newRecipient.individualRecipient(bene1, 'Sweden{enter}')
    cy.get('#postcode').should('be.visible').type('50505')
    newRecipient.saveRecipient()

    // Settlement validation (single bene screen)
    newRecipient.checkSettelment('be.disabled', 'be.enabled')

    // ─────────────── Beneficiary 2 ───────────────
    newRecipient.gotoRecipientList()

    let rand2 = batchPayments.generateRandomString(5)
    let email2 = rand2 + '@yopmail.com'
    let bene2 = 'Sweden SEK ' + rand2

    newRecipient.addRecipient('Sweden{enter}', 'SEK{enter}', email2)
    newRecipient.addBankDetails('SE7280000810340009783242', 'SWEDSESSXXX')
    newRecipient.individualRecipient(bene2, 'Sweden{enter}')
    cy.get('#postcode').should('be.visible').type('50505')
    newRecipient.saveRecipient()

    // ─────────────── Batch Payment Flow ───────────────
    batchPayments.goToBatchPaymentPage()
    batchPayments.goToPayMultipleRecipient()

    // Add both beneficiaries
    batchPayments.validateSearchBar(bene1 + '{enter}')
    cy.wait(2000)

    batchPayments.validateSearchBar(bene2 + '{enter}')
    cy.wait(2000)

    // ─────────────── Amount & Purpose (per bene) ───────────────
    let amount1 = '300'
    let amount2 = '450'

    batchPayments.addrecipientDetail(amount1, email1)
    batchPayments.addrecipientDetail1(amount2, email2)

    // ─────────────── Settlement Validation (Batch) ───────────────
    batchPayments.checkSettelments1('be.disabled', 'be.enabled')

    // ─────────────── Push Funds (GBP) ───────────────
    batchPayments.proceedflow('GBP', 'GBP', 'Push Fund', 'Push Fund')
    batchPayments.validateproceedflowCorpay(amount1, amount2)
})

})