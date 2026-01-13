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
it('TC-AC-021 - Verify that if Currency= KES and Country = UNITED KINGDOM & client = UK and check priority settlement is enabled and make a payment with GBP using Push Funds', function () {

    // ─────────────── Login & Navigation ───────────────
    signin.Login(userName, password)
    newRecipient.goToPaymentsDashborad()
    newRecipient.gotoRecipientList()

    // ─────────────── First Recipient ───────────────
    const lName = batchPayments.generateRandomString(6)
    const fullName1 = 'UK KES ' + lName

    let email = batchPayments.generateRandomString(5) + '@yopmail.com'
    newRecipient.addRecipient('UNITED KINGDOM{enter}', 'KES{enter}', email)
    newRecipient.addBankDetails('GB73BARC20039538243547', 'AFFLGB22')
    newRecipient.individualRecipient(fullName1, 'UNITED KINGDOM{enter}')
    newRecipient.saveRecipient()

    // ✅ Priority only
    newRecipient.checkSettelment('be.disabled', 'be.enabled')

    // ─────────────── Second Recipient ───────────────
    newRecipient.gotoRecipientList()

    const lName1 = batchPayments.generateRandomString(6)
    const fullName2 = 'UK KES ' + lName1

    let email1 = batchPayments.generateRandomString(5) + '@yopmail.com'
    newRecipient.addRecipient('UNITED KINGDOM{enter}', 'KES{enter}', email1)
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
it('TC-AC-022 - Verify that if Currency= KES and Country = Kenya & client = UK and check priority settlement is enabled and make a payment with GBP using Push Funds', function () {

    // ─────────────── Login & Navigation ───────────────
    signin.Login(userName, password)
    newRecipient.goToPaymentsDashborad()
    newRecipient.gotoRecipientList()

    // ─────────────── First Recipient ───────────────
    const lName = batchPayments.generateRandomString(6)
    const fullName1 = 'Kenya KES ' + lName

    let email = batchPayments.generateRandomString(5) + '@yopmail.com'
    newRecipient.addRecipient('KENYA{enter}', 'KES{enter}', email)
    newRecipient.addBankDetailsWithAccNo('AFRIKENX','049712')
    cy.get('#bankBranch').type('city branch')
    newRecipient.individualRecipient(fullName1, 'KENYA{enter}')
    newRecipient.saveRecipient()

    // ✅ Priority only
    newRecipient.checkSettelment('be.disabled', 'be.enabled')

    // ─────────────── Second Recipient ───────────────
    newRecipient.gotoRecipientList()

    const lName1 = batchPayments.generateRandomString(6)
    const fullName2 = 'Kenya KES ' + lName1

    let email1 = batchPayments.generateRandomString(5) + '@yopmail.com'
    newRecipient.addRecipient('KENYA{enter}', 'KES{enter}', email1)
    newRecipient.addBankDetailsWithAccNo('AFRIKENX','049712')
    cy.get('#bankBranch').type('city branch')
    newRecipient.individualRecipient(fullName2, 'KENYA{enter}')
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
it('TC-AC-023 - Verify that if Currency= UGX and Country = UNITED KINGDOM & client = UK and check priority settlement is enabled and make a payment with GBP using Push Funds', function () {

    // ─────────────── Helpers ───────────────
    const normalizeAmount = (val) => val.toString().replace(/,/g, '');

    // ─────────────── Login & Navigation ───────────────
    signin.Login(userName, password);
    newRecipient.goToPaymentsDashborad();
    newRecipient.gotoRecipientList();

    // ─────────────── First Recipient ───────────────
    const lName = batchPayments.generateRandomString(6);
    const fullName1 = 'UK UGX ' + lName;

    let email = batchPayments.generateRandomString(5) + '@yopmail.com';
    newRecipient.addRecipient('UNITED KINGDOM{enter}', 'UGX{enter}', email);
    newRecipient.addBankDetails('GB73BARC20039538243547', 'AFFLGB22');
    newRecipient.individualRecipient(fullName1, 'UNITED KINGDOM{enter}');
    newRecipient.saveRecipient();
    newRecipient.checkSettelment('be.disabled', 'be.enabled');

    // ─────────────── Second Recipient ───────────────
    newRecipient.gotoRecipientList();

    const lName1 = batchPayments.generateRandomString(6);
    const fullName2 = 'UK UGX ' + lName1;

    let email1 = batchPayments.generateRandomString(5) + '@yopmail.com';
    newRecipient.addRecipient('UNITED KINGDOM{enter}', 'UGX{enter}', email1);
    newRecipient.addBankDetails('GB73BARC20039538243547', 'AFFLGB22');
    newRecipient.individualRecipient(fullName2, 'UNITED KINGDOM{enter}');
    newRecipient.saveRecipient();
    newRecipient.checkSettelment('be.disabled', 'be.enabled');

    // ─────────────── Batch Payment Flow ───────────────
    cy.reload();
    batchPayments.goToBatchPaymentPage();
    batchPayments.goToPayMultipleRecipient();

    // ─────────────── Search Beneficiaries ───────────────
    batchPayments.validateSearchBar(fullName1 + '{enter}');
    cy.wait(3000);
    batchPayments.validateSearchBar(fullName2 + '{enter}');

    // ─────────────── Payment Purpose (Per Bene) ───────────────
    cy.get('.ant-select-selector').eq(1).click();
    cy.get('.ant-select-dropdown')
        .eq(1)
        .find('.ant-select-item-option-content')
        .first()
        .click();

    cy.get('.ant-select-selector').eq(3).click();
    cy.get('.ant-select-dropdown')
        .eq(2)
        .find('.ant-select-item-option-content')
        .first()
        .click();

    // ─────────────── Amount & Settlement Validation ───────────────
    let amount = '250';
    batchPayments.addrecipientDetail(amount, email);
    batchPayments.checkSettelments1('be.disabled', 'be.enabled');

    let amount1 = '260';
    batchPayments.addrecipientDetail1(amount1, email1);
    batchPayments.checkSettelments2('be.disabled', 'be.enabled');

    // ─────────────── Proceed with Payment ───────────────
    batchPayments.proceedflow('GBP', 'GBP', 'Push Fund', 'Push Fund');
    batchPayments.validateproceedflowCorpay(amount, amount1);

    // batchPayments.cancelPushFunds();
});
it('TC-AC-024 - Verify that if Currency= UGX and Country = Uganda & client = UK and check priority settlement is enabled and make a payment with GBP using Push Funds', function () {

    // ─────────────── Login & Navigation ───────────────
    signin.Login(userName, password)
    newRecipient.goToPaymentsDashborad()
    newRecipient.gotoRecipientList()

    // ─────────────── First Recipient ───────────────
    const lName = batchPayments.generateRandomString(6)
    const fullName1 = 'UGANDA UGX ' + lName

    let email = batchPayments.generateRandomString(5) + '@yopmail.com'
    newRecipient.addRecipient('UGANDA{enter}', 'UGX{enter}', email)
    newRecipient.addBankDetailsWithAccNo('CCEIUGKA', '049712')
    newRecipient.individualRecipient(fullName1, 'UGANDA{enter}')
    newRecipient.saveRecipient()
    newRecipient.checkSettelment('be.disabled', 'be.enabled')

    // ─────────────── Second Recipient ───────────────
    newRecipient.gotoRecipientList()

    const lName1 = batchPayments.generateRandomString(6)
    const fullName2 = 'UGANDA UGX ' + lName1

    let email1 = batchPayments.generateRandomString(5) + '@yopmail.com'
    newRecipient.addRecipient('UGANDA{enter}', 'UGX{enter}', email1)
    newRecipient.addBankDetailsWithAccNo('CCEIUGKA', '049712')
    newRecipient.individualRecipient(fullName2, 'UGANDA{enter}')
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
it('TC-AC-025 - Verify that if Currency= BHD and Country = UNITED KINGDOM & client = UK and check priority settlement is enabled and make a payment with GBP using Push Funds', function () {

    // ─────────────── Login & Navigation ───────────────
    signin.Login(userName, password)
    newRecipient.goToPaymentsDashborad()
    newRecipient.gotoRecipientList()

    // ─────────────── First Recipient ───────────────
    const lName = batchPayments.generateRandomString(6)
    const fullName1 = 'UK BHD ' + lName

    let email = batchPayments.generateRandomString(5) + '@yopmail.com'
    newRecipient.addRecipient('UNITED KINGDOM{enter}', 'BHD{enter}', email)
    newRecipient.addBankDetails('GB73BARC20039538243547', 'AFFLGB22')
    newRecipient.individualRecipient(fullName1, 'UNITED KINGDOM{enter}')
    newRecipient.saveRecipient()
    newRecipient.checkSettelment('be.disabled', 'be.enabled')

    // ─────────────── Second Recipient ───────────────
    newRecipient.gotoRecipientList()

    const lName1 = batchPayments.generateRandomString(6)
    const fullName2 = 'UK BHD ' + lName1

    let email1 = batchPayments.generateRandomString(5) + '@yopmail.com'
    newRecipient.addRecipient('UNITED KINGDOM{enter}', 'BHD{enter}', email1)
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
it('TC-AC-026 - Verify that if Currency= BHD and Country = Bahrain & client = UK and check priority settlement is enabled and make a payment with GBP using Push Funds', function () {

    // ─────────────── Login & Navigation ───────────────
    signin.Login(userName, password)
    newRecipient.goToPaymentsDashborad()
    newRecipient.gotoRecipientList()

    // ─────────────── First Recipient ───────────────
    const lName = batchPayments.generateRandomString(6)
    const fullName1 = 'BAHRAIN BHD ' + lName

    let email = batchPayments.generateRandomString(5) + '@yopmail.com'
    newRecipient.addRecipient('BAHRAIN{enter}', 'BHD{enter}', email)
    newRecipient.addBankDetails('BH67BMAG00001299123456', 'ABBGBHBM')
    newRecipient.individualRecipient(fullName1, 'BAHRAIN{enter}')
    newRecipient.saveRecipient()
    newRecipient.checkSettelment('be.disabled', 'be.enabled')

    // ─────────────── Second Recipient ───────────────
    newRecipient.gotoRecipientList()

    const lName1 = batchPayments.generateRandomString(6)
    const fullName2 = 'BAHRAIN BHD ' + lName1

    let email1 = batchPayments.generateRandomString(5) + '@yopmail.com'
    newRecipient.addRecipient('BAHRAIN{enter}', 'BHD{enter}', email1)
    newRecipient.addBankDetails('BH67BMAG00001299123456', 'ABBGBHBM')
    newRecipient.individualRecipient(fullName2, 'BAHRAIN{enter}')
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
it('TC-AC-027 - Verify that if Currency= AED and Country = UNITED KINGDOM & client = UK and check priority settlement is enabled and make a payment with GBP using Push Funds', function () {

    // ─────────────── Login & Navigation ───────────────
    signin.Login(userName, password)
    newRecipient.goToPaymentsDashborad()
    newRecipient.gotoRecipientList()

    // ─────────────── First Recipient ───────────────
    const lName = batchPayments.generateRandomString(6)
    const fullName1 = 'UK AED ' + lName

    let email = batchPayments.generateRandomString(5) + '@yopmail.com'
    newRecipient.addRecipient('UNITED KINGDOM{enter}', 'AED{enter}', email)
    newRecipient.addBankDetails('GB73BARC20039538243547', 'AFFLGB22')
    newRecipient.individualRecipient(fullName1, 'UNITED KINGDOM{enter}')
    newRecipient.saveRecipient()
    newRecipient.checkSettelment('be.disabled', 'be.enabled')

    // ─────────────── Second Recipient ───────────────
    newRecipient.gotoRecipientList()

    const lName1 = batchPayments.generateRandomString(6)
    const fullName2 = 'UK AED ' + lName1

    let email1 = batchPayments.generateRandomString(5) + '@yopmail.com'
    newRecipient.addRecipient('UNITED KINGDOM{enter}', 'AED{enter}', email1)
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
it('TC-AC-028 - Verify that if Currency= AED and Country = UNITED ARAB EMIRATES & client = UK and check priority settlement is enabled and make a payment with GBP using Push Funds', function () {

    // ─────────────── Login & Navigation ───────────────
    signin.Login(userName, password)
    newRecipient.goToPaymentsDashborad()
    newRecipient.gotoRecipientList()

    // ─────────────── First Recipient ───────────────
    const lName = batchPayments.generateRandomString(6)
    const fullName1 = 'United Arab Emirates AED ' + lName

    let email = batchPayments.generateRandomString(5) + '@yopmail.com'
    newRecipient.addRecipient('UNITED ARAB EMIRATES{enter}', 'AED{enter}', email)
    newRecipient.addBankDetails('AE070331234567890123456', 'AARPAEAA')
    newRecipient.individualRecipient(fullName1, 'UNITED ARAB EMIRATES{enter}')
    newRecipient.saveRecipient()
    newRecipient.checkSettelment('be.disabled', 'be.enabled')

    // ─────────────── Second Recipient ───────────────
    newRecipient.gotoRecipientList()

    const lName1 = batchPayments.generateRandomString(6)
    const fullName2 = 'United Arab Emirates AED ' + lName1

    let email1 = batchPayments.generateRandomString(5) + '@yopmail.com'
    newRecipient.addRecipient('UNITED ARAB EMIRATES{enter}', 'AED{enter}', email1)
    newRecipient.addBankDetails('AE070331234567890123456', 'AARPAEAA')
    newRecipient.individualRecipient(fullName2, 'UNITED ARAB EMIRATES{enter}')
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
it('TC-AC-029 - Verify that if Currency= INR and Country = INDIA current & client = UK and check priority settlement is disabled and make a payment with GBP using Push Funds', function () {

    // ─────────────── Login & Navigation ───────────────
    signin.Login(userName, password)
    newRecipient.goToPaymentsDashborad()
    newRecipient.gotoRecipientList()

    // ─────────────── First Recipient ───────────────
    const lName = batchPayments.generateRandomString(6)
    const fullName1 = 'India INR Current ' + lName

    let email = batchPayments.generateRandomString(5) + '@yopmail.com'
    newRecipient.addRecipient('INDIA{downarrow}{enter}', 'INR{enter}', email)
    newRecipient.addIndiaBankDetail()
    newRecipient.indiaAccountType('current{enter}')
    newRecipient.individualRecipient(fullName1, 'INDIA{downarrow}{enter}')
    newRecipient.saveRecipient()
    newRecipient.checkSettelment('be.enabled', 'be.disabled')   // Standard enabled, Priority disabled

    // ─────────────── Second Recipient ───────────────
    newRecipient.gotoRecipientList()

    const lName1 = batchPayments.generateRandomString(6)
    const fullName2 = 'India INR Current ' + lName1

    let email1 = batchPayments.generateRandomString(5) + '@yopmail.com'
    newRecipient.addRecipient('INDIA{downarrow}{enter}', 'INR{enter}', email1)
    newRecipient.addIndiaBankDetail()
    newRecipient.indiaAccountType('current{enter}')
    newRecipient.individualRecipient(fullName2, 'INDIA{downarrow}{enter}')
    newRecipient.saveRecipient()
    newRecipient.checkSettelment('be.enabled', 'be.disabled')

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
    batchPayments.checkSettelments1('be.enabled', 'be.disabled')

    let amount1 = '260'
    batchPayments.addrecipientDetail1(amount1, email1)
    batchPayments.checkSettelments2('be.enabled', 'be.disabled')

    // ─────────────── Proceed with Payment ───────────────
    batchPayments.proceedflow('GBP', 'GBP', 'Push Fund', 'Push Fund')
    batchPayments.validateproceedflowCorpay(amount, amount1)

    // batchPayments.cancelPushFunds()
})
it('TC-AC-030 - Verify that if Currency= INR and Country = INDIA Saving & client = UK and check priority settlement is enabled and make a payment with GBP using Push Funds', function () {

    // ─────────────── Login & Navigation ───────────────
    signin.Login(userName, password)
    newRecipient.goToPaymentsDashborad()
    newRecipient.gotoRecipientList()

    // ─────────────── First Recipient ───────────────
    const lName = batchPayments.generateRandomString(6)
    const fullName1 = 'India INR Saving ' + lName

    let email = batchPayments.generateRandomString(5) + '@yopmail.com'
    newRecipient.addRecipient('INDIA{downarrow}{enter}', 'INR{enter}', email)
    newRecipient.addIndiaBankDetail()
    newRecipient.indiaAccountType('Saving{enter}')
    newRecipient.individualRecipient(fullName1, 'INDIA{downarrow}{enter}')
    newRecipient.saveRecipient()
    newRecipient.checkSettelment('be.enabled', 'be.disabled')   // Regular enabled, Priority disabled

    // ─────────────── Second Recipient ───────────────
    newRecipient.gotoRecipientList()

    const lName1 = batchPayments.generateRandomString(6)
    const fullName2 = 'India INR Saving ' + lName1

    let email1 = batchPayments.generateRandomString(5) + '@yopmail.com'
    newRecipient.addRecipient('INDIA{downarrow}{enter}', 'INR{enter}', email1)
    newRecipient.addIndiaBankDetail()
    newRecipient.indiaAccountType('Saving{enter}')
    newRecipient.individualRecipient(fullName2, 'INDIA{downarrow}{enter}')
    newRecipient.saveRecipient()
    newRecipient.checkSettelment('be.enabled', 'be.disabled')   // Regular enabled, Priority disabled

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
    let amount = '25'
    batchPayments.addrecipientDetail(amount, email)
    //batchPayments.checkSettelments1('be.enabl', 'be.enabled')

    let amount1 = '20'
    batchPayments.addrecipientDetail1(amount1, email1)
    //batchPayments.checkSettelments2('be.disabled', 'be.enabled')

    // ─────────────── Proceed with Payment ───────────────
    batchPayments.proceedflow('GBP', 'GBP', 'Push Fund', 'Push Fund')
    batchPayments.validateproceedflowCorpay(amount, amount1)

    // batchPayments.cancelPushFunds()
})

})