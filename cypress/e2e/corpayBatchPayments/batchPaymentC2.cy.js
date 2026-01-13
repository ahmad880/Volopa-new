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
it('TC-AC-011 - Verify that if Currency= QAR and Country = UNITED KINGDOM & client = UK and check priority settlement is enabled and make a payment with GBP using Push Funds', function () {

    // ─────────────── Login & Navigation ───────────────
    signin.Login(userName, password)
    newRecipient.goToPaymentsDashborad()
    newRecipient.gotoRecipientList()

    // ─────────────── First Recipient ───────────────
    const lName = batchPayments.generateRandomString(6)
    const fullName1 = 'UK QAR ' + lName

    let email = batchPayments.generateRandomString(5) + '@yopmail.com'
    newRecipient.addRecipient('UNITED KINGDOM{enter}', 'QAR{enter}', email)
    newRecipient.addBankDetails('GB73BARC20039538243547', 'AFFLGB22')
    newRecipient.individualRecipient(fullName1, 'UNITED KINGDOM{enter}')
    newRecipient.saveRecipient()

    // ✅ Priority only
    newRecipient.checkSettelment('be.disabled', 'be.enabled')

    // ─────────────── Second Recipient ───────────────
    newRecipient.gotoRecipientList()

    const lName1 = batchPayments.generateRandomString(6)
    const fullName2 = 'UK QAR ' + lName1

    let email1 = batchPayments.generateRandomString(5) + '@yopmail.com'
    newRecipient.addRecipient('UNITED KINGDOM{enter}', 'QAR{enter}', email1)
    newRecipient.addBankDetails('GB73BARC20039538243547', 'AFFLGB22')
    newRecipient.individualRecipient(fullName2, 'UNITED KINGDOM{enter}')
    newRecipient.saveRecipient()

    // ✅ Priority only
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
it('TC-AC-012 - Verify that if Currency= QAR and Country = QATAR & client = UK and check priority settlement is enabled and make a payment with GBP using Push Funds', function () {

    // ─────────────── Login & Navigation ───────────────
    signin.Login(userName, password)
    newRecipient.goToPaymentsDashborad()
    newRecipient.gotoRecipientList()

    // ─────────────── First Recipient ───────────────
    const lName = batchPayments.generateRandomString(6)
    const fullName1 = 'Qatar QAR ' + lName

    let email = batchPayments.generateRandomString(5) + '@yopmail.com'
    newRecipient.addRecipient('QATAR{enter}', 'QAR{enter}', email)
    newRecipient.addBankDetails('QA58DOHB00001234567890ABCDEFG', 'ALZAQAQA')
    newRecipient.individualRecipient(fullName1, 'QATAR{enter}')
    newRecipient.saveRecipient()

    // ✅ Priority only
    newRecipient.checkSettelment('be.disabled', 'be.enabled')

    // ─────────────── Second Recipient ───────────────
    newRecipient.gotoRecipientList()

    const lName1 = batchPayments.generateRandomString(6)
    const fullName2 = 'Qatar QAR ' + lName1

    let email1 = batchPayments.generateRandomString(5) + '@yopmail.com'
    newRecipient.addRecipient('QATAR{enter}', 'QAR{enter}', email1)
    newRecipient.addBankDetails('QA58DOHB00001234567890ABCDEFG', 'ALZAQAQA')
    newRecipient.individualRecipient(fullName2, 'QATAR{enter}')
    newRecipient.saveRecipient()

    // ✅ Priority only
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
it('TC-AC-013 - Verify that if Currency= CZK and Country = UNITED KINGDOM & client = UK and check priority settlement is enabled and make a payment with GBP using Push Funds', function () {

    // ─────────────── Login & Navigation ───────────────
    signin.Login(userName, password)
    newRecipient.goToPaymentsDashborad()
    newRecipient.gotoRecipientList()

    // ─────────────── First Recipient ───────────────
    const lName = batchPayments.generateRandomString(6)
    const fullName1 = 'UK CZK ' + lName

    let email = batchPayments.generateRandomString(5) + '@yopmail.com'
    newRecipient.addRecipient('UNITED KINGDOM{enter}', 'CZK{enter}', email)
    newRecipient.addBankDetails('GB73BARC20039538243547', 'AFFLGB22')
    newRecipient.individualRecipient(fullName1, 'UNITED KINGDOM{enter}')
    newRecipient.saveRecipient()

    // ✅ Priority only
    newRecipient.checkSettelment('be.disabled', 'be.enabled')

    // ─────────────── Second Recipient ───────────────
    newRecipient.gotoRecipientList()

    const lName1 = batchPayments.generateRandomString(6)
    const fullName2 = 'UK CZK ' + lName1

    let email1 = batchPayments.generateRandomString(5) + '@yopmail.com'
    newRecipient.addRecipient('UNITED KINGDOM{enter}', 'CZK{enter}', email1)
    newRecipient.addBankDetails('GB73BARC20039538243547', 'AFFLGB22')
    newRecipient.individualRecipient(fullName2, 'UNITED KINGDOM{enter}')
    newRecipient.saveRecipient()

    // ✅ Priority only
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
it('TC-AC-014 - Verify that if Currency= CZK and Country = Czech Republic & client = UK and check priority settlement is enabled and make a payment with GBP using Push Funds', function () {

    // ─────────────── Login & Navigation ───────────────
    signin.Login(userName, password)
    newRecipient.goToPaymentsDashborad()
    newRecipient.gotoRecipientList()

    // ─────────────── First Recipient ───────────────
    const lName = batchPayments.generateRandomString(6)
    const fullName1 = 'Czech Republic CZK ' + lName

    let email = batchPayments.generateRandomString(5) + '@yopmail.com'
    newRecipient.addRecipient('Czech Republic{enter}', 'CZK{enter}', email)
    newRecipient.addBankDetails('CZ5508000000001234567899', 'AKCNCZP2')
    newRecipient.individualRecipient(fullName1, 'Czech Republic{enter}')
    newRecipient.saveRecipient()

    // ✅ Priority only
    newRecipient.checkSettelment('be.disabled', 'be.enabled')

    // ─────────────── Second Recipient ───────────────
    newRecipient.gotoRecipientList()

    const lName1 = batchPayments.generateRandomString(6)
    const fullName2 = 'Czech Republic CZK ' + lName1

    let email1 = batchPayments.generateRandomString(5) + '@yopmail.com'
    newRecipient.addRecipient('Czech Republic{enter}', 'CZK{enter}', email1)
    newRecipient.addBankDetails('CZ5508000000001234567899', 'AKCNCZP2')
    newRecipient.individualRecipient(fullName2, 'Czech Republic{enter}')
    newRecipient.saveRecipient()

    // ✅ Priority only
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
it('TC-AC-015 - Verify that if Currency= RON and Country = UNITED KINGDOM & client = UK and check priority settlement is enabled and make a payment with GBP using Push Funds', function () {

    // ─────────────── Login & Navigation ───────────────
    signin.Login(userName, password)
    newRecipient.goToPaymentsDashborad()
    newRecipient.gotoRecipientList()

    // ─────────────── First Recipient ───────────────
    const lName = batchPayments.generateRandomString(6)
    const fullName1 = 'UK RON ' + lName

    let email = batchPayments.generateRandomString(5) + '@yopmail.com'
    newRecipient.addRecipient('UNITED KINGDOM{enter}', 'RON{enter}', email)
    newRecipient.addBankDetails('GB73BARC20039538243547', 'BACXROBUXXX')
    newRecipient.individualRecipient(fullName1, 'UNITED KINGDOM{enter}')
    newRecipient.saveRecipient()

    // ✅ Priority only
    newRecipient.checkSettelment('be.disabled', 'be.enabled')

    // ─────────────── Second Recipient ───────────────
    newRecipient.gotoRecipientList()

    const lName1 = batchPayments.generateRandomString(6)
    const fullName2 = 'UK RON ' + lName1

    let email1 = batchPayments.generateRandomString(5) + '@yopmail.com'
    newRecipient.addRecipient('UNITED KINGDOM{enter}', 'RON{enter}', email1)
    newRecipient.addBankDetails('GB73BARC20039538243547', 'BACXROBUXXX')
    newRecipient.individualRecipient(fullName2, 'UNITED KINGDOM{enter}')
    newRecipient.saveRecipient()

    // ✅ Priority only
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
it('TC-AC-016 - Verify that if Currency= RON and Country = Romania & client = UK and check priority settlement is enabled and make a payment with GBP using Push Funds', function () {

    // ─────────────── Login & Navigation ───────────────
    signin.Login(userName, password)
    newRecipient.goToPaymentsDashborad()
    newRecipient.gotoRecipientList()

    // ─────────────── First Recipient ───────────────
    const lName = batchPayments.generateRandomString(6)
    const fullName1 = 'Romania RON ' + lName

    let email = batchPayments.generateRandomString(5) + '@yopmail.com'
    newRecipient.addRecipient('ROMANIA{enter}', 'RON{enter}', email)
    newRecipient.addBankDetails('RO66BACX0000001234567890', 'BACXROBUXXX')
    newRecipient.individualRecipient(fullName1, 'ROMANIA{enter}')
    newRecipient.saveRecipient()

    // ✅ Priority only
    newRecipient.checkSettelment('be.disabled', 'be.enabled')

    // ─────────────── Second Recipient ───────────────
    newRecipient.gotoRecipientList()

    const lName1 = batchPayments.generateRandomString(6)
    const fullName2 = 'Romania RON ' + lName1

    let email1 = batchPayments.generateRandomString(5) + '@yopmail.com'
    newRecipient.addRecipient('ROMANIA{enter}', 'RON{enter}', email1)
    newRecipient.addBankDetails('RO66BACX0000001234567890', 'BACXROBUXXX')
    newRecipient.individualRecipient(fullName2, 'ROMANIA{enter}')
    newRecipient.saveRecipient()

    // ✅ Priority only
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
it('TC-AC-017 - Verify that if Currency= ILS and Country = UNITED KINGDOM & client = UK and check priority settlement is enabled and make a payment with GBP using Push Funds', function () {

    // ─────────────── Login & Navigation ───────────────
    signin.Login(userName, password)
    newRecipient.goToPaymentsDashborad()
    newRecipient.gotoRecipientList()

    // ─────────────── First Recipient ───────────────
    const lName = batchPayments.generateRandomString(6)
    const fullName1 = 'UK ILS ' + lName

    let email = batchPayments.generateRandomString(5) + '@yopmail.com'
    newRecipient.addRecipient('UNITED KINGDOM{enter}', 'ILS{enter}', email)
    newRecipient.addBankDetails('GB73BARC20039538243547', 'AFFLGB22')
    newRecipient.individualRecipient(fullName1, 'UNITED KINGDOM{enter}')
    newRecipient.saveRecipient()

    // ✅ Priority only
    newRecipient.checkSettelment('be.disabled', 'be.enabled')

    // ─────────────── Second Recipient ───────────────
    newRecipient.gotoRecipientList()

    const lName1 = batchPayments.generateRandomString(6)
    const fullName2 = 'UK ILS ' + lName1

    let email1 = batchPayments.generateRandomString(5) + '@yopmail.com'
    newRecipient.addRecipient('UNITED KINGDOM{enter}', 'ILS{enter}', email1)
    newRecipient.addBankDetails('GB73BARC20039538243547', 'AFFLGB22')
    newRecipient.individualRecipient(fullName2, 'UNITED KINGDOM{enter}')
    newRecipient.saveRecipient()

    // ✅ Priority only
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
it('TC-AC-018 - Verify that if Currency= ILS and Country = ISRAEL & client = UK and check priority settlement is enabled and make a payment with GBP using Push Funds', function () {

    // ─────────────── Login & Navigation ───────────────
    signin.Login(userName, password)
    newRecipient.goToPaymentsDashborad()
    newRecipient.gotoRecipientList()

    // ─────────────── First Recipient ───────────────
    const lName = batchPayments.generateRandomString(6)
    const fullName1 = 'Israel ILS ' + lName

    let email = batchPayments.generateRandomString(5) + '@yopmail.com'
    newRecipient.addRecipient('ISRAEL{enter}', 'ILS{enter}', email)
    newRecipient.addBankDetails('IL170108000000012612345', 'ASRIILIC')
    newRecipient.individualRecipient(fullName1, 'ISRAEL{enter}')
    newRecipient.saveRecipient()

    // ✅ Priority only
    newRecipient.checkSettelment('be.disabled', 'be.enabled')

    // ─────────────── Second Recipient ───────────────
    newRecipient.gotoRecipientList()

    const lName1 = batchPayments.generateRandomString(6)
    const fullName2 = 'Israel ILS ' + lName1

    let email1 = batchPayments.generateRandomString(5) + '@yopmail.com'
    newRecipient.addRecipient('ISRAEL{enter}', 'ILS{enter}', email1)
    newRecipient.addBankDetails('IL170108000000012612345', 'ASRIILIC')
    newRecipient.individualRecipient(fullName2, 'ISRAEL{enter}')
    newRecipient.saveRecipient()

    // ✅ Priority only
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
it('TC-AC-019 - Verify that if Currency= HUF and Country = UNITED KINGDOM & client = UK and check priority settlement is enabled and make a payment with GBP using Push Funds', function () {

    // ─────────────── Login & Navigation ───────────────
    signin.Login(userName, password)
    newRecipient.goToPaymentsDashborad()
    newRecipient.gotoRecipientList()

    // ─────────────── First Recipient ───────────────
    const lName = batchPayments.generateRandomString(6)
    const fullName1 = 'UK HUF ' + lName

    let email = batchPayments.generateRandomString(5) + '@yopmail.com'
    newRecipient.addRecipient('UNITED KINGDOM{enter}', 'HUF{enter}', email)
    newRecipient.addBankDetails('GB73BARC20039538243547', 'AFFLGB22')
    newRecipient.individualRecipient(fullName1, 'UNITED KINGDOM{enter}')
    newRecipient.saveRecipient()

    // ✅ Priority only
    newRecipient.checkSettelment('be.disabled', 'be.enabled')

    // ─────────────── Second Recipient ───────────────
    newRecipient.gotoRecipientList()

    const lName1 = batchPayments.generateRandomString(6)
    const fullName2 = 'UK HUF ' + lName1

    let email1 = batchPayments.generateRandomString(5) + '@yopmail.com'
    newRecipient.addRecipient('UNITED KINGDOM{enter}', 'HUF{enter}', email1)
    newRecipient.addBankDetails('GB73BARC20039538243547', 'AFFLGB22')
    newRecipient.individualRecipient(fullName2, 'UNITED KINGDOM{enter}')
    newRecipient.saveRecipient()

    // ✅ Priority only
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
it('TC-AC-020 - Verify that if Currency= HUF and Country = Hungary & client = UK and check priority settlement is enabled and make a payment with GBP using Push Funds', function () {

    // ─────────────── Login & Navigation ───────────────
    signin.Login(userName, password)
    newRecipient.goToPaymentsDashborad()
    newRecipient.gotoRecipientList()

    // ─────────────── First Recipient ───────────────
    const lName = batchPayments.generateRandomString(6)
    const fullName1 = 'Hungary HUF ' + lName

    let email = batchPayments.generateRandomString(5) + '@yopmail.com'
    newRecipient.addRecipient('HUNGARY{enter}', 'HUF{enter}', email)
    newRecipient.addBankDetails('HU42117730161111101800000000', 'AKKHHUHB')
    newRecipient.individualRecipient(fullName1, 'HUNGARY{enter}')
    newRecipient.saveRecipient()

    // ✅ Priority only
    newRecipient.checkSettelment('be.disabled', 'be.enabled')

    // ─────────────── Second Recipient ───────────────
    newRecipient.gotoRecipientList()

    const lName1 = batchPayments.generateRandomString(6)
    const fullName2 = 'Hungary HUF ' + lName1

    let email1 = batchPayments.generateRandomString(5) + '@yopmail.com'
    newRecipient.addRecipient('HUNGARY{enter}', 'HUF{enter}', email1)
    newRecipient.addBankDetails('HU42117730161111101800000000', 'AKKHHUHB')
    newRecipient.individualRecipient(fullName2, 'HUNGARY{enter}')
    newRecipient.saveRecipient()

    // ✅ Priority only
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

})