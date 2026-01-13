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
it('TC-AC-001 - Verify that if Currency= SGD and Country = UNITED KINGDOM & client = UK and check priority and regular both settlement are enabled and make a payment with GBP using Push Funds', function () {

    // ─────────────── Login & Navigation ───────────────
    signin.Login(userName, password)
    newRecipient.goToPaymentsDashborad()
    newRecipient.gotoRecipientList()

    // ─────────────── First Recipient ───────────────
    const lName = batchPayments.generateRandomString(6)
    const fullName1 = 'CORPAY IND one ' + lName

    let email = batchPayments.generateRandomString(5) + '@yopmail.com'
    newRecipient.addRecipient('UNITED KINGDOM{enter}', 'SGD{enter}', email)
    newRecipient.addBankDetails('GB73BARC20039538243547', 'AFFLGB22')

    // ✅ Use lname here
    newRecipient.individualRecipient(fullName1, 'UNITED KINGDOM{enter}')
    newRecipient.saveRecipient()
    newRecipient.checkSettelment('be.disabled', 'be.enabled')

    // ─────────────── Second Recipient ───────────────
    newRecipient.gotoRecipientList()

    const lName1 = batchPayments.generateRandomString(6)
    const fullName2 = 'CORPAY IND two ' + lName1

    let email1 = batchPayments.generateRandomString(5) + '@yopmail.com'
    newRecipient.addRecipient('UNITED KINGDOM{enter}', 'SGD{enter}', email1)
    newRecipient.addBankDetails('GB73BARC20039538243547', 'AFFLGB22')

    // ✅ Use lname here
    newRecipient.individualRecipient(fullName2, 'UNITED KINGDOM{enter}')
    newRecipient.saveRecipient()
    newRecipient.checkSettelment('be.disabled', 'be.enabled')

    // ─────────────── Batch Payment Flow ───────────────
    cy.reload()
    batchPayments.goToBatchPaymentPage()
    batchPayments.goToPayMultipleRecipient()

    // ─────────────── Search Using Exact Names ───────────────
    batchPayments.validateSearchBar(fullName1 + '{enter}')
    cy.wait(3000)
    batchPayments.validateSearchBar(fullName2 + '{enter}')

    // ─────────────── Payment Purpose (Each Bene) ───────────────
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
it('TC-AC-002 - Verify that if Currency= SGD and Country = Singapore & client = UK and check priority and regular both settlement are enabled and make a payment with GBP using Push Funds', function () {

    // ─────────────── Login & Navigation ───────────────
    signin.Login(userName, password)
    newRecipient.goToPaymentsDashborad()
    newRecipient.gotoRecipientList()

    // ─────────────── First Recipient ───────────────
    const lName = batchPayments.generateRandomString(6)
    const fullName1 = 'SN ' + lName

    let email = batchPayments.generateRandomString(5) + '@yopmail.com'
    newRecipient.addRecipient('SINGAPORE{enter}', 'SGD{enter}', email)
    newRecipient.addBankDetailsWithAccNo('ACLPSGSG', '049712')
    newRecipient.singaporeCorpayDeatails('1111', '123')
    newRecipient.individualRecipient(fullName1, 'SINGAPORE{enter}')
    newRecipient.saveRecipient()

    // ✅ Both settlements enabled
    newRecipient.checkSettelmentEnabledBoth('be.enabled', 'be.enabled')

    // ─────────────── Second Recipient ───────────────
    newRecipient.gotoRecipientList()

    const lName1 = batchPayments.generateRandomString(6)
    const fullName2 = 'SN ' + lName1

    let email1 = batchPayments.generateRandomString(5) + '@yopmail.com'
    newRecipient.addRecipient('SINGAPORE{enter}', 'SGD{enter}', email1)
    newRecipient.addBankDetailsWithAccNo('ACLPSGSG', '049712')
    newRecipient.singaporeCorpayDeatails('1111', '123')
    newRecipient.individualRecipient(fullName2, 'SINGAPORE{enter}')
    newRecipient.saveRecipient()

    // ✅ Both settlements enabled
    newRecipient.checkSettelmentEnabledBoth('be.enabled', 'be.enabled')

    // ─────────────── Batch Payment Flow (UNCHANGED) ───────────────
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
    batchPayments.selectSettlementByIndex(0)
    let amount1 = '260'
    batchPayments.addrecipientDetail1(amount1, email1)
    batchPayments.selectSettlementByIndex(1)
    

    // ─────────────── Proceed with Payment ───────────────
    batchPayments.proceedflow('GBP', 'GBP', 'Push Fund', 'Push Fund')
    batchPayments.validateproceedflowCorpay(amount, amount1)
})
it('TC-AC-003 - Verify that if Currency= TRY and Country = UNITED KINGDOM & client = UK and check priority settlement is enabled and make a payment with GBP using Push Funds', function () {

    // ─────────────── Login & Navigation ───────────────
    signin.Login(userName, password)
    newRecipient.goToPaymentsDashborad()
    newRecipient.gotoRecipientList()

    // ─────────────── First Recipient ───────────────
    const lName = batchPayments.generateRandomString(6)
    const fullName1 = 'UK TRY ' + lName

    let email = batchPayments.generateRandomString(5) + '@yopmail.com'
    newRecipient.addRecipient('UNITED KINGDOM{enter}', 'TRY{enter}', email)
    newRecipient.addBankDetails('GB73BARC20039538243547', 'AFFLGB22')
    newRecipient.individualRecipient(fullName1, 'UNITED KINGDOM{enter}')
    newRecipient.saveRecipient()

    // ✅ Only priority enabled
    newRecipient.checkSettelment('be.disabled', 'be.enabled')

    // ─────────────── Second Recipient ───────────────
    newRecipient.gotoRecipientList()

    const lName1 = batchPayments.generateRandomString(6)
    const fullName2 = 'UK TRY ' + lName1

    let email1 = batchPayments.generateRandomString(5) + '@yopmail.com'
    newRecipient.addRecipient('UNITED KINGDOM{enter}', 'TRY{enter}', email1)
    newRecipient.addBankDetails('GB73BARC20039538243547', 'AFFLGB22')
    newRecipient.individualRecipient(fullName2, 'UNITED KINGDOM{enter}')
    newRecipient.saveRecipient()

    // ✅ Only priority enabled
    newRecipient.checkSettelment('be.disabled', 'be.enabled')

    // ─────────────── Batch Payment Flow (UNCHANGED) ───────────────
    cy.reload()
    batchPayments.goToBatchPaymentPage()
    batchPayments.goToPayMultipleRecipient()

    // ─────────────── Search Beneficiaries ───────────────
    batchPayments.validateSearchBar(fullName1 + '{enter}')
    cy.wait(4000)
    batchPayments.validateSearchBar(fullName2 + '{enter}')

    // ─────────────── Payment Purpose (Each Bene) ───────────────
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
it('TC-AC-004 - Verify that if Currency= TRY and Country = Turkey & client = UK and check priority settlement is enabled and make a payment with GBP using Push Funds', function () {

    // ─────────────── Login & Navigation ───────────────
    signin.Login(userName, password)
    newRecipient.goToPaymentsDashborad()
    newRecipient.gotoRecipientList()

    // ─────────────── First Recipient ───────────────
    const lName = batchPayments.generateRandomString(6)
    const fullName1 = 'Turkey TRY ' + lName

    let email = batchPayments.generateRandomString(5) + '@yopmail.com'
    newRecipient.addRecipient('TURKEY{enter}', 'TRY{enter}', email)
    newRecipient.addBankDetails('TR690006245145456117494371', 'CAYTTRIS002')
    newRecipient.individualRecipient(fullName1, 'TURKEY{enter}')
    newRecipient.saveRecipient()

    // ✅ Priority only enabled
    newRecipient.checkSettelment('be.disabled', 'be.enabled')

    // ─────────────── Second Recipient ───────────────
    newRecipient.gotoRecipientList()

    const lName1 = batchPayments.generateRandomString(6)
    const fullName2 = 'Turkey TRY ' + lName1

    let email1 = batchPayments.generateRandomString(5) + '@yopmail.com'
    newRecipient.addRecipient('TURKEY{enter}', 'TRY{enter}', email1)
    newRecipient.addBankDetails('TR690006245145456117494371', 'CAYTTRIS002')
    newRecipient.individualRecipient(fullName2, 'TURKEY{enter}')
    newRecipient.saveRecipient()

    // ✅ Priority only enabled
    newRecipient.checkSettelment('be.disabled', 'be.enabled')

    // ─────────────── Batch Payment Flow (UNCHANGED) ───────────────
    cy.reload()
    batchPayments.goToBatchPaymentPage()
    batchPayments.goToPayMultipleRecipient()

    // ─────────────── Search Beneficiaries ───────────────
    batchPayments.validateSearchBar(fullName1 + '{enter}')
    cy.wait(3000)
    batchPayments.validateSearchBar(fullName2 + '{enter}')

    // ─────────────── Payment Purpose (Each Bene) ───────────────
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
it('TC-AC-005 - Verify that if Currency= KWD and Country = UNITED KINGDOM & client = UK and check priority settlement is enabled and make a payment with GBP using Push Funds', function () {

    // ─────────────── Login & Navigation ───────────────
    signin.Login(userName, password)
    newRecipient.goToPaymentsDashborad()
    newRecipient.gotoRecipientList()

    // ─────────────── First Recipient ───────────────
    const lName = batchPayments.generateRandomString(6)
    const fullName1 = 'UK KWD ' + lName

    let email = batchPayments.generateRandomString(5) + '@yopmail.com'
    newRecipient.addRecipient('UNITED KINGDOM{enter}', 'KWD{enter}', email)
    newRecipient.addBankDetails('GB73BARC20039538243547', 'AFFLGB22')
    newRecipient.individualRecipient(fullName1, 'UNITED KINGDOM{enter}')
    newRecipient.saveRecipient()

    // ✅ Priority only enabled
    newRecipient.checkSettelment('be.disabled', 'be.enabled')

    // ─────────────── Second Recipient ───────────────
    newRecipient.gotoRecipientList()

    const lName1 = batchPayments.generateRandomString(6)
    const fullName2 = 'UK KWD ' + lName1

    let email1 = batchPayments.generateRandomString(5) + '@yopmail.com'
    newRecipient.addRecipient('UNITED KINGDOM{enter}', 'KWD{enter}', email1)
    newRecipient.addBankDetails('GB73BARC20039538243547', 'AFFLGB22')
    newRecipient.individualRecipient(fullName2, 'UNITED KINGDOM{enter}')
    newRecipient.saveRecipient()

    // ✅ Priority only enabled
    newRecipient.checkSettelment('be.disabled', 'be.enabled')

    // ─────────────── Batch Payment Flow (UNCHANGED) ───────────────
    cy.reload()
    batchPayments.goToBatchPaymentPage()
    batchPayments.goToPayMultipleRecipient()

    // ─────────────── Search Beneficiaries ───────────────
    batchPayments.validateSearchBar(fullName1 + '{enter}')
    cy.wait(3000)
    batchPayments.validateSearchBar(fullName2 + '{enter}')

    // ─────────────── Payment Purpose (Each Bene) ───────────────
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
it('TC-AC-006 - Verify that if Currency= KWD and Country = Kuwait & client = UK and check priority settlement is enabled and make a payment with GBP using Push Funds', function () {

    // ─────────────── Login & Navigation ───────────────
    signin.Login(userName, password)
    newRecipient.goToPaymentsDashborad()
    newRecipient.gotoRecipientList()

    // ─────────────── First Recipient ───────────────
    const lName = batchPayments.generateRandomString(6)
    const fullName1 = 'Kuwait KWD ' + lName

    let email = batchPayments.generateRandomString(5) + '@yopmail.com'
    newRecipient.addRecipient('KUWAIT{enter}', 'KWD{enter}', email)
    newRecipient.addBankDetails('KW81CBKU0000000000001234560101', 'ABKKKWKW')
    newRecipient.individualRecipient(fullName1, 'KUWAIT{enter}')
    newRecipient.saveRecipient()

    // ✅ Priority only enabled
    newRecipient.checkSettelment('be.disabled', 'be.enabled')

    // ─────────────── Second Recipient ───────────────
    newRecipient.gotoRecipientList()

    const lName1 = batchPayments.generateRandomString(6)
    const fullName2 = 'Kuwait KWD ' + lName1

    let email1 = batchPayments.generateRandomString(5) + '@yopmail.com'
    newRecipient.addRecipient('KUWAIT{enter}', 'KWD{enter}', email1)
    newRecipient.addBankDetails('KW81CBKU0000000000001234560101', 'ABKKKWKW')
    newRecipient.individualRecipient(fullName2, 'KUWAIT{enter}')
    newRecipient.saveRecipient()

    // ✅ Priority only enabled
    newRecipient.checkSettelment('be.disabled', 'be.enabled')

    // ─────────────── Batch Payment Flow (UNCHANGED) ───────────────
    cy.reload()
    batchPayments.goToBatchPaymentPage()
    batchPayments.goToPayMultipleRecipient()

    // ─────────────── Search Beneficiaries ───────────────
    batchPayments.validateSearchBar(fullName1 + '{enter}')
    cy.wait(3000)
    batchPayments.validateSearchBar(fullName2 + '{enter}')

    // ─────────────── Payment Purpose (Each Bene) ───────────────
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
it('TC-AC-007 - Verify that if Currency= OMR and Country = UNITED KINGDOM & client = UK and check priority settlement is enabled and make a payment with GBP using Push Funds', function () {

    // ─────────────── Login & Navigation ───────────────
    signin.Login(userName, password)
    newRecipient.goToPaymentsDashborad()
    newRecipient.gotoRecipientList()

    // ─────────────── First Recipient ───────────────
    const lName = batchPayments.generateRandomString(6)
    const fullName1 = 'UK OMR ' + lName

    let email = batchPayments.generateRandomString(5) + '@yopmail.com'
    newRecipient.addRecipient('UNITED KINGDOM{enter}', 'OMR{enter}', email)
    newRecipient.addBankDetails('GB73BARC20039538243547', 'AFFLGB22')
    newRecipient.individualRecipient(fullName1, 'UNITED KINGDOM{enter}')
    newRecipient.saveRecipient()

    // ✅ Priority only enabled
    newRecipient.checkSettelment('be.disabled', 'be.enabled')

    // ─────────────── Second Recipient ───────────────
    newRecipient.gotoRecipientList()

    const lName1 = batchPayments.generateRandomString(6)
    const fullName2 = 'UK OMR ' + lName1

    let email1 = batchPayments.generateRandomString(5) + '@yopmail.com'
    newRecipient.addRecipient('UNITED KINGDOM{enter}', 'OMR{enter}', email1)
    newRecipient.addBankDetails('GB73BARC20039538243547', 'AFFLGB22')
    newRecipient.individualRecipient(fullName2, 'UNITED KINGDOM{enter}')
    newRecipient.saveRecipient()

    // ✅ Priority only enabled
    newRecipient.checkSettelment('be.disabled', 'be.enabled')

    // ─────────────── Batch Payment Flow (UNCHANGED) ───────────────
    cy.reload()
    batchPayments.goToBatchPaymentPage()
    batchPayments.goToPayMultipleRecipient()

    // ─────────────── Search Beneficiaries ───────────────
    batchPayments.validateSearchBar(fullName1 + '{enter}')
    cy.wait(3000)
    batchPayments.validateSearchBar(fullName2 + '{enter}')

    // ─────────────── Payment Purpose (Each Bene) ───────────────
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
it('TC-AC-008 - Verify that if Currency= OMR and Country = OMAN & client = UK and check priority settlement is enabled and make a payment with GBP using Push Funds', function () {

    // ─────────────── Login & Navigation ───────────────
    signin.Login(userName, password)
    newRecipient.goToPaymentsDashborad()
    newRecipient.gotoRecipientList()

    // ─────────────── First Recipient ───────────────
    const lName = batchPayments.generateRandomString(6)
    const fullName1 = 'OMAN OMR ' + lName

    let email = batchPayments.generateRandomString(5) + '@yopmail.com'
    newRecipient.addRecipient('OMAN{enter}', 'OMR{enter}', email)
    newRecipient.addBankDetails('OM040280000012345678901', 'BDOFOMRUMIB')
    newRecipient.individualRecipient(fullName1, 'OMAN{enter}')
    newRecipient.saveRecipient()

    // ✅ Priority only
    newRecipient.checkSettelment('be.disabled', 'be.enabled')

    // ─────────────── Second Recipient ───────────────
    newRecipient.gotoRecipientList()

    const lName1 = batchPayments.generateRandomString(6)
    const fullName2 = 'OMAN OMR ' + lName1

    let email1 = batchPayments.generateRandomString(5) + '@yopmail.com'
    newRecipient.addRecipient('OMAN{enter}', 'OMR{enter}', email1)
    newRecipient.addBankDetails('OM040280000012345678901', 'BDOFOMRUMIB')
    newRecipient.individualRecipient(fullName2, 'OMAN{enter}')
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
it('TC-AC-009 - Verify that if Currency= SAR and Country = UNITED KINGDOM & client = UK and check priority settlement is enabled and make a payment with GBP using Push Funds', function () {

    // ─────────────── Login & Navigation ───────────────
    signin.Login(userName, password)
    newRecipient.goToPaymentsDashborad()
    newRecipient.gotoRecipientList()

    // ─────────────── First Recipient ───────────────
    const lName = batchPayments.generateRandomString(6)
    const fullName1 = 'UK SAR ' + lName

    let email = batchPayments.generateRandomString(5) + '@yopmail.com'
    newRecipient.addRecipient('UNITED KINGDOM{enter}', 'SAR{enter}', email)
    newRecipient.addBankDetails('GB73BARC20039538243547', 'AFFLGB22')
    newRecipient.individualRecipient(fullName1, 'UNITED KINGDOM{enter}')
    newRecipient.saveRecipient()

    // ✅ Priority only
    newRecipient.checkSettelment('be.disabled', 'be.enabled')

    // ─────────────── Second Recipient ───────────────
    newRecipient.gotoRecipientList()

    const lName1 = batchPayments.generateRandomString(6)
    const fullName2 = 'UK SAR ' + lName1

    let email1 = batchPayments.generateRandomString(5) + '@yopmail.com'
    newRecipient.addRecipient('UNITED KINGDOM{enter}', 'SAR{enter}', email1)
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
it('TC-AC-010 - Verify that if Currency= SAR and Country = Saudi Arabia & client = UK and check priority settlement is enabled and make a payment with GBP using Push Funds', function () {

    // ─────────────── Login & Navigation ───────────────
    signin.Login(userName, password)
    newRecipient.goToPaymentsDashborad()
    newRecipient.gotoRecipientList()

    // ─────────────── First Recipient ───────────────
    const lName = batchPayments.generateRandomString(6)
    const fullName1 = 'Saudi Arabia SAR ' + lName

    let email = batchPayments.generateRandomString(5) + '@yopmail.com'
    newRecipient.addRecipient('SAUDI ARABIA{enter}', 'SAR{enter}', email)
    newRecipient.addBankDetails('SA0380000000608010167519', 'AIASSARI')
    newRecipient.individualRecipient(fullName1, 'SAUDI ARABIA{enter}')
    newRecipient.saveRecipient()

    // ✅ Priority only
    newRecipient.checkSettelment('be.disabled', 'be.enabled')

    // ─────────────── Second Recipient ───────────────
    newRecipient.gotoRecipientList()

    const lName1 = batchPayments.generateRandomString(6)
    const fullName2 = 'Saudi Arabia SAR ' + lName1

    let email1 = batchPayments.generateRandomString(5) + '@yopmail.com'
    newRecipient.addRecipient('SAUDI ARABIA{enter}', 'SAR{enter}', email1)
    newRecipient.addBankDetails('SA0380000000608010167519', 'AIASSARI')
    newRecipient.individualRecipient(fullName2, 'SAUDI ARABIA{enter}')
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