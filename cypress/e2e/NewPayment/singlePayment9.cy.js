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
    //UNITED KINGDOM with USD
    //push fund
    it('TC_NP_099 - Add 1 recipient(individual) from the "Add Recipient" page with country = UNITED KINGDOM and currency = USD. After adding, make a single payment to the recipient using GBP and push funds.', function(){
        newRecipient.goToPaymentsDashborad()
        newRecipient.gotoRecipientList()
        let email = batchPayments.generateRandomString(5)+ '@yopmail.com'
        batchPayments.addRecipient('UNITED KINGDOM{enter}' ,'USD{enter}' ,email)
        newRecipient.addBankDetails('GB73BARC20039538243547','AFFLGB22')
        const lName = batchPayments.generateRandomString(6)
        batchPayments.individualRecipient('INDIVIDUAL PF',lName,'UNITED KINGDOM{enter}')
        batchPayments.paymentPurposeGBPEUR()
        cy.get('.ant-select-selector').eq(3).click()
        cy.get('.ant-select-dropdown').eq(3).find('.ant-select-item-option-content').then(Element=>{
            let purposeList = Element.text()
            cy.log(purposeList)
            cy.wrap(purposeList).as('purposeList')
        })
        newRecipient.saveRecipient()
        newPayment.checkSettelment('be.disabled','be.enabled')
        newPayment.proceedflow('{downarrow}{enter}','GBP')
        let amount = '125'
        newPayment.addrecipientDetail(amount, email)
        newPayment.selectFundingMethod('Push Funds')
             //Validate the selected payment purpose
             cy.get('@selectedValue').then(selectedValue=>{
                cy.get(':nth-child(2) > .ant-row > .ant-col > .ant-form-item-control-input > .ant-form-item-control-input-content > .ant-select > .ant-select-selector')
                .should('be.visible').and('contain.text',selectedValue)
            })
          //Validate the selected payment purpose
        cy.get('@selectedValue').then(selectedValue=>{
        cy.get(':nth-child(2) > .ant-row > .ant-col > .ant-form-item-control-input > .ant-form-item-control-input-content > .ant-select > .ant-select-selector')
        .should('be.visible').and('contain.text',selectedValue)
        })
         //Validate Purpose on batch payment
        cy.get('.ant-select-selector').eq(3).click()
        cy.get('.ant-select-dropdown').eq(2).find('.ant-select-item-option-content').then(Element=>{
            let list = Element.text()
            cy.log(list)
            cy.get('@purposeList').then(purposeList=>{
            expect(list).to.eq(purposeList)
            cy.get('.ant-select-selector').eq(3).click() 
        })
          })
          // Validating recipient recived amount
          cy.get(':nth-child(4) > :nth-child(2) > .ant-typography').invoke('text').then((text) => {
            const storedText = text
            cy.wrap(storedText).as('storedText')
            cy.log(storedText)
            })
            cy.get('.ant-col > .ant-btn > span').should('be.visible').click()
            cy.get('.ant-modal-body > :nth-child(1) > .ant-col > .ant-typography').should('be.visible').should('contain.text','Payment Confirmation')
            cy.get('@storedText').then(storedText=>{
                cy.get(':nth-child(5) > .ant-col-8 > .ant-typography')
                .should('be.visible').and('contain.text',storedText)
            })
            cy.get('.ant-row-center.m-t-20 > .ant-col > .ant-space > :nth-child(2) > .ant-btn').should('be.visible').click() // pay recipient
            cy.get('.ant-modal-body > :nth-child(1) > .ant-col').should('be.visible').should('contain.text',' Payment Booked - ')
            cy.get('@storedText').then(storedText=>{
                cy.get(':nth-child(5) > .ant-col-8 > .ant-typography')
                .should('be.visible').and('contain.text',storedText)
            })
            newPayment.cancelPushFunds()
    })
    it('TC_NP_100 - Add 1 recipient(Business) from the "Add Recipient" page with country = UNITED KINGDOM and currency = USD. After adding, make a single payment to the recipient using GBP and push funds.', function(){
        newRecipient.goToPaymentsDashborad()
        newRecipient.gotoRecipientList()
        let email = batchPayments.generateRandomString(5)+ '@yopmail.com'
        batchPayments.addRecipient('UNITED KINGDOM{enter}' ,'USD{enter}' ,email)
        newRecipient.addBankDetails('GB73BARC20039538243547','AFFLGB22')
        cy.get('.ant-space > :nth-child(2) > .ant-card > .ant-card-body').should('be.visible').click()
        const bName = batchPayments.generateRandomString(6)
        batchPayments.addBusinessRecipient('BUSINESS PF'+' '+bName,'UNITED KINGDOM{enter}')
        batchPayments.paymentPurposeGBPEUR()
        cy.get('.ant-select-selector').eq(3).click()
        cy.get('.ant-select-dropdown').eq(3).find('.ant-select-item-option-content').then(Element=>{
            let purposeList = Element.text()
            cy.log(purposeList)
            cy.wrap(purposeList).as('purposeList')
        })
        newRecipient.saveRecipient()
        newPayment.checkSettelment('be.disabled','be.enabled')
        newPayment.proceedflow('{downarrow}{enter}','GBP')
        let amount = '125'
        newPayment.addrecipientDetail(amount, email)
        newPayment.selectFundingMethod('Push Funds')
             //Validate the selected payment purpose
             cy.get('@selectedValue').then(selectedValue=>{
                cy.get(':nth-child(2) > .ant-row > .ant-col > .ant-form-item-control-input > .ant-form-item-control-input-content > .ant-select > .ant-select-selector')
                .should('be.visible').and('contain.text',selectedValue)
            })
          //Validate the selected payment purpose
        cy.get('@selectedValue').then(selectedValue=>{
        cy.get(':nth-child(2) > .ant-row > .ant-col > .ant-form-item-control-input > .ant-form-item-control-input-content > .ant-select > .ant-select-selector')
        .should('be.visible').and('contain.text',selectedValue)
        })
         //Validate Purpose on batch payment
        cy.get('.ant-select-selector').eq(3).click()
        cy.get('.ant-select-dropdown').eq(2).find('.ant-select-item-option-content').then(Element=>{
            let list = Element.text()
            cy.log(list)
            cy.get('@purposeList').then(purposeList=>{
            expect(list).to.eq(purposeList)
            cy.get('.ant-select-selector').eq(3).click() 
        })
          })
          // Validating recipient recived amount
          cy.get(':nth-child(4) > :nth-child(2) > .ant-typography').invoke('text').then((text) => {
            const storedText = text
            cy.wrap(storedText).as('storedText')
            cy.log(storedText)
            })
            cy.get('.ant-col > .ant-btn > span').should('be.visible').click()
            cy.get('.ant-modal-body > :nth-child(1) > .ant-col > .ant-typography').should('be.visible').should('contain.text','Payment Confirmation')
            cy.get('@storedText').then(storedText=>{
                cy.get(':nth-child(5) > .ant-col-8 > .ant-typography')
                .should('be.visible').and('contain.text',storedText)
            })
            cy.get('.ant-row-center.m-t-20 > .ant-col > .ant-space > :nth-child(2) > .ant-btn').should('be.visible').click() // pay recipient
            cy.get('.ant-modal-body > :nth-child(1) > .ant-col').should('be.visible').should('contain.text',' Payment Booked - ')
            cy.get('@storedText').then(storedText=>{
                cy.get(':nth-child(5) > .ant-col-8 > .ant-typography')
                .should('be.visible').and('contain.text',storedText)
            })
            newPayment.cancelPushFunds()
    })
    //Easy Transfer
    it('TC_NP_101 - Add 1 recipient(individual) from the "Add Recipient" page with country = UNITED KINGDOM and currency = USD. After adding, make a single payment to the recipient using GBP and Easy transfer.', function(){
        newRecipient.goToPaymentsDashborad()
        newRecipient.gotoRecipientList()
        let email = batchPayments.generateRandomString(5)+ '@yopmail.com'
        batchPayments.addRecipient('UNITED KINGDOM{enter}' ,'USD{enter}' ,email)
        newRecipient.addBankDetails('GB73BARC20039538243547','AFFLGB22')
        const lName = batchPayments.generateRandomString(6)
        batchPayments.individualRecipient('INDIVIDUAL PF',lName,'UNITED KINGDOM{enter}')
        batchPayments.paymentPurposeGBPEUR()
        cy.get('.ant-select-selector').eq(3).click()
        cy.get('.ant-select-dropdown').eq(3).find('.ant-select-item-option-content').then(Element=>{
            let purposeList = Element.text()
            cy.log(purposeList)
            cy.wrap(purposeList).as('purposeList')
        })
        newRecipient.saveRecipient()
        newPayment.checkSettelment('be.disabled','be.enabled')
        newPayment.proceedflow('{downarrow}{enter}','GBP')
        let amount = '125'
        newPayment.addrecipientDetail(amount, email)
             //Validate the selected payment purpose
             cy.get('@selectedValue').then(selectedValue=>{
                cy.get(':nth-child(2) > .ant-row > .ant-col > .ant-form-item-control-input > .ant-form-item-control-input-content > .ant-select > .ant-select-selector')
                .should('be.visible').and('contain.text',selectedValue)
            })
          //Validate the selected payment purpose
        cy.get('@selectedValue').then(selectedValue=>{
        cy.get(':nth-child(2) > .ant-row > .ant-col > .ant-form-item-control-input > .ant-form-item-control-input-content > .ant-select > .ant-select-selector')
        .should('be.visible').and('contain.text',selectedValue)
        })
         //Validate Purpose on batch payment
        cy.get('.ant-select-selector').eq(3).click()
        cy.get('.ant-select-dropdown').eq(1).find('.ant-select-item-option-content').then(Element=>{
            let list = Element.text()
            cy.log(list)
            cy.get('@purposeList').then(purposeList=>{
            expect(list).to.eq(purposeList)
            cy.get('.ant-select-selector').eq(3).click() 
        })
          })
          // Validating recipient recived amount
          cy.get(':nth-child(4) > :nth-child(2) > .ant-typography').invoke('text').then((text) => {
            const storedText = text
            cy.wrap(storedText).as('storedText')
            cy.log(storedText)
            })
            cy.get('.ant-col > .ant-btn > span').should('be.visible').click()
            cy.get('.ant-modal-body > :nth-child(1) > .ant-col > .ant-typography').should('be.visible').should('contain.text','Payment Confirmation')
            cy.get('@storedText').then(storedText=>{
                cy.get(':nth-child(5) > .ant-col-8 > .ant-typography')
                .should('be.visible').and('contain.text',storedText)
            })
            cy.get('.ant-row-center.m-t-20 > .ant-col > .ant-space > :nth-child(2) > .ant-btn').should('be.visible').click() // pay recipient
            cy.get('.ant-modal-body > :nth-child(1) > .ant-col').should('be.visible').should('contain.text',' Payment Booked - ')
            cy.get('@storedText').then(storedText=>{
                cy.get(':nth-child(5) > .ant-col-8 > .ant-typography')
                .should('be.visible').and('contain.text',storedText)
            })
            newPayment.validateYapilyFlow()
            newPayment.cancelEasyTransfer()
    })
    it('TC_NP_102 - Add 1 recipient(Business) from the "Add Recipient" page with country = UNITED KINGDOM and currency = USD. After adding, make a single payment to the recipient using GBP and Easy transfer..', function(){
        newRecipient.goToPaymentsDashborad()
        newRecipient.gotoRecipientList()
        let email = batchPayments.generateRandomString(5)+ '@yopmail.com'
        batchPayments.addRecipient('UNITED KINGDOM{enter}' ,'USD{enter}' ,email)
        newRecipient.addBankDetails('GB73BARC20039538243547','AFFLGB22')
        cy.get('.ant-space > :nth-child(2) > .ant-card > .ant-card-body').should('be.visible').click()
        const bName = batchPayments.generateRandomString(6)
        batchPayments.addBusinessRecipient('BUSINESS PF'+' '+bName,'UNITED KINGDOM{enter}')
        batchPayments.paymentPurposeGBPEUR()
        cy.get('.ant-select-selector').eq(3).click()
        cy.get('.ant-select-dropdown').eq(3).find('.ant-select-item-option-content').then(Element=>{
            let purposeList = Element.text()
            cy.log(purposeList)
            cy.wrap(purposeList).as('purposeList')
        })
        newRecipient.saveRecipient()
        newPayment.checkSettelment('be.disabled','be.enabled')
        newPayment.proceedflow('{downarrow}{enter}','GBP')
        let amount = '125'
        newPayment.addrecipientDetail(amount, email)
             //Validate the selected payment purpose
             cy.get('@selectedValue').then(selectedValue=>{
                cy.get(':nth-child(2) > .ant-row > .ant-col > .ant-form-item-control-input > .ant-form-item-control-input-content > .ant-select > .ant-select-selector')
                .should('be.visible').and('contain.text',selectedValue)
            })
          //Validate the selected payment purpose
        cy.get('@selectedValue').then(selectedValue=>{
        cy.get(':nth-child(2) > .ant-row > .ant-col > .ant-form-item-control-input > .ant-form-item-control-input-content > .ant-select > .ant-select-selector')
        .should('be.visible').and('contain.text',selectedValue)
        })
         //Validate Purpose on batch payment
        cy.get('.ant-select-selector').eq(3).click()
        cy.get('.ant-select-dropdown').eq(1).find('.ant-select-item-option-content').then(Element=>{
            let list = Element.text()
            cy.log(list)
            cy.get('@purposeList').then(purposeList=>{
            expect(list).to.eq(purposeList)
            cy.get('.ant-select-selector').eq(3).click() 
        })
          })
          // Validating recipient recived amount
          cy.get(':nth-child(4) > :nth-child(2) > .ant-typography').invoke('text').then((text) => {
            const storedText = text
            cy.wrap(storedText).as('storedText')
            cy.log(storedText)
            })
            cy.get('.ant-col > .ant-btn > span').should('be.visible').click()
            cy.get('.ant-modal-body > :nth-child(1) > .ant-col > .ant-typography').should('be.visible').should('contain.text','Payment Confirmation')
            cy.get('@storedText').then(storedText=>{
                cy.get(':nth-child(5) > .ant-col-8 > .ant-typography')
                .should('be.visible').and('contain.text',storedText)
            })
            cy.get('.ant-row-center.m-t-20 > .ant-col > .ant-space > :nth-child(2) > .ant-btn').should('be.visible').click() // pay recipient
            cy.get('.ant-modal-body > :nth-child(1) > .ant-col').should('be.visible').should('contain.text',' Payment Booked - ')
            cy.get('@storedText').then(storedText=>{
                cy.get(':nth-child(5) > .ant-col-8 > .ant-typography')
                .should('be.visible').and('contain.text',storedText)
            })
            newPayment.validateYapilyFlow()
            newPayment.cancelEasyTransfer()
    })
    //China with USD
    //push fund
    it('TC_NP_103 - Add 1 recipient(individual) from the "Add Recipient" page with country = CHINA and currency = USD. After adding, make a single payment to the recipient using GBP and push funds.', function(){
        newRecipient.goToPaymentsDashborad()
        newRecipient.gotoRecipientList()
        let email = batchPayments.generateRandomString(5)+ '@yopmail.com'
        batchPayments.addRecipient('CHINA{enter}' ,'USD{enter}' ,email)
        newRecipient.addBankDetailsWithAccNo('AYCLCNBY','55555555')
        const lName = batchPayments.generateRandomString(6)
        batchPayments.individualRecipient('INDIVIDUAL PF',lName,'CHINA{enter}')
        batchPayments.paymentPurposeGBPEUR()
        cy.get('.ant-select-selector').eq(3).click()
        cy.get('.ant-select-dropdown').eq(3).find('.ant-select-item-option-content').then(Element=>{
            let purposeList = Element.text()
            cy.log(purposeList)
            cy.wrap(purposeList).as('purposeList')
        })
        newRecipient.saveRecipient()
        newPayment.checkSettelment('be.disabled','be.enabled')
        newPayment.proceedflow('{downarrow}{enter}','GBP')
        let amount = '125'
        newPayment.addrecipientDetail(amount, email)
        newPayment.selectFundingMethod('Push Funds')
             //Validate the selected payment purpose
             cy.get('@selectedValue').then(selectedValue=>{
                cy.get(':nth-child(2) > .ant-row > .ant-col > .ant-form-item-control-input > .ant-form-item-control-input-content > .ant-select > .ant-select-selector')
                .should('be.visible').and('contain.text',selectedValue)
            })
          //Validate the selected payment purpose
        cy.get('@selectedValue').then(selectedValue=>{
        cy.get(':nth-child(2) > .ant-row > .ant-col > .ant-form-item-control-input > .ant-form-item-control-input-content > .ant-select > .ant-select-selector')
        .should('be.visible').and('contain.text',selectedValue)
        })
         //Validate Purpose on batch payment
        cy.get('.ant-select-selector').eq(3).click()
        cy.get('.ant-select-dropdown').eq(2).find('.ant-select-item-option-content').then(Element=>{
            let list = Element.text()
            cy.log(list)
            cy.get('@purposeList').then(purposeList=>{
            expect(list).to.eq(purposeList)
            cy.get('.ant-select-selector').eq(3).click() 
        })
          })
          // Validating recipient recived amount
          cy.get(':nth-child(4) > :nth-child(2) > .ant-typography').invoke('text').then((text) => {
            const storedText = text
            cy.wrap(storedText).as('storedText')
            cy.log(storedText)
            })
            cy.get('.ant-col > .ant-btn > span').should('be.visible').click()
            cy.get('.ant-modal-body > :nth-child(1) > .ant-col > .ant-typography').should('be.visible').should('contain.text','Payment Confirmation')
            cy.get('@storedText').then(storedText=>{
                cy.get(':nth-child(5) > .ant-col-8 > .ant-typography')
                .should('be.visible').and('contain.text',storedText)
            })
            cy.get('.ant-row-center.m-t-20 > .ant-col > .ant-space > :nth-child(2) > .ant-btn').should('be.visible').click() // pay recipient
            cy.get('.ant-modal-body > :nth-child(1) > .ant-col').should('be.visible').should('contain.text',' Payment Booked - ')
            cy.get('@storedText').then(storedText=>{
                cy.get(':nth-child(5) > .ant-col-8 > .ant-typography')
                .should('be.visible').and('contain.text',storedText)
            })
            newPayment.cancelPushFunds()
    })
    it('TC_NP_104 - Add 1 recipient(Business) from the "Add Recipient" page with country = CHINAand currency = USD. After adding, make a single payment to the recipient using GBP and push funds.', function(){
        newRecipient.goToPaymentsDashborad()
        newRecipient.gotoRecipientList()
        let email = batchPayments.generateRandomString(5)+ '@yopmail.com'
        batchPayments.addRecipient('CHINA{enter}' ,'USD{enter}' ,email)
        newRecipient.addBankDetailsWithAccNo('AYCLCNBY','55555555')
        cy.get('.ant-space > :nth-child(2) > .ant-card > .ant-card-body').should('be.visible').click()
        const bName = batchPayments.generateRandomString(6)
        batchPayments.addBusinessRecipient('BUSINESS ET'+' '+bName,'CHINA{enter}')
        batchPayments.paymentPurposeGBPEUR()
        cy.get('.ant-select-selector').eq(3).click()
        cy.get('.ant-select-dropdown').eq(3).find('.ant-select-item-option-content').then(Element=>{
            let purposeList = Element.text()
            cy.log(purposeList)
            cy.wrap(purposeList).as('purposeList')
        })
        newRecipient.saveRecipient()
        newPayment.checkSettelment('be.disabled','be.enabled')
        newPayment.proceedflow('{downarrow}{enter}','GBP')
        let amount = '125'
        newPayment.addrecipientDetail(amount, email)
        newPayment.selectFundingMethod('Push Funds')
             //Validate the selected payment purpose
             cy.get('@selectedValue').then(selectedValue=>{
                cy.get(':nth-child(2) > .ant-row > .ant-col > .ant-form-item-control-input > .ant-form-item-control-input-content > .ant-select > .ant-select-selector')
                .should('be.visible').and('contain.text',selectedValue)
            })
          //Validate the selected payment purpose
        cy.get('@selectedValue').then(selectedValue=>{
        cy.get(':nth-child(2) > .ant-row > .ant-col > .ant-form-item-control-input > .ant-form-item-control-input-content > .ant-select > .ant-select-selector')
        .should('be.visible').and('contain.text',selectedValue)
        })
         //Validate Purpose on batch payment
        cy.get('.ant-select-selector').eq(3).click()
        cy.get('.ant-select-dropdown').eq(2).find('.ant-select-item-option-content').then(Element=>{
            let list = Element.text()
            cy.log(list)
            cy.get('@purposeList').then(purposeList=>{
            expect(list).to.eq(purposeList)
            cy.get('.ant-select-selector').eq(3).click() 
        })
          })
          // Validating recipient recived amount
          cy.get(':nth-child(4) > :nth-child(2) > .ant-typography').invoke('text').then((text) => {
            const storedText = text
            cy.wrap(storedText).as('storedText')
            cy.log(storedText)
            })
            cy.get('.ant-col > .ant-btn > span').should('be.visible').click()
            cy.get('.ant-modal-body > :nth-child(1) > .ant-col > .ant-typography').should('be.visible').should('contain.text','Payment Confirmation')
            cy.get('@storedText').then(storedText=>{
                cy.get(':nth-child(5) > .ant-col-8 > .ant-typography')
                .should('be.visible').and('contain.text',storedText)
            })
            cy.get('.ant-row-center.m-t-20 > .ant-col > .ant-space > :nth-child(2) > .ant-btn').should('be.visible').click() // pay recipient
            cy.get('.ant-modal-body > :nth-child(1) > .ant-col').should('be.visible').should('contain.text',' Payment Booked - ')
            cy.get('@storedText').then(storedText=>{
                cy.get(':nth-child(5) > .ant-col-8 > .ant-typography')
                .should('be.visible').and('contain.text',storedText)
            })
            newPayment.cancelPushFunds()
    })
    //Easy Transfer
    it('TC_NP_105 - Add 1 recipient(individual) from the "Add Recipient" page with country = CHINA and currency = USD. After adding, make a single payment to the recipient using GBP and Easy transfer.', function(){
        newRecipient.goToPaymentsDashborad()
        newRecipient.gotoRecipientList()
        let email = batchPayments.generateRandomString(5)+ '@yopmail.com'
        batchPayments.addRecipient('CHINA{enter}' ,'USD{enter}' ,email)
        newRecipient.addBankDetailsWithAccNo('AYCLCNBY','55555555')
        const lName = batchPayments.generateRandomString(6)
        batchPayments.individualRecipient('INDIVIDUAL PF',lName,'CHINA{enter}')
        batchPayments.paymentPurposeGBPEUR()
        cy.get('.ant-select-selector').eq(3).click()
        cy.get('.ant-select-dropdown').eq(3).find('.ant-select-item-option-content').then(Element=>{
            let purposeList = Element.text()
            cy.log(purposeList)
            cy.wrap(purposeList).as('purposeList')
        })
        newRecipient.saveRecipient()
        newPayment.checkSettelment('be.disabled','be.enabled')
        newPayment.proceedflow('{downarrow}{enter}','GBP')
        let amount = '125'
        newPayment.addrecipientDetail(amount, email)
             //Validate the selected payment purpose
             cy.get('@selectedValue').then(selectedValue=>{
                cy.get(':nth-child(2) > .ant-row > .ant-col > .ant-form-item-control-input > .ant-form-item-control-input-content > .ant-select > .ant-select-selector')
                .should('be.visible').and('contain.text',selectedValue)
            })
          //Validate the selected payment purpose
        cy.get('@selectedValue').then(selectedValue=>{
        cy.get(':nth-child(2) > .ant-row > .ant-col > .ant-form-item-control-input > .ant-form-item-control-input-content > .ant-select > .ant-select-selector')
        .should('be.visible').and('contain.text',selectedValue)
        })
         //Validate Purpose on batch payment
        cy.get('.ant-select-selector').eq(3).click()
        cy.get('.ant-select-dropdown').eq(1).find('.ant-select-item-option-content').then(Element=>{
            let list = Element.text()
            cy.log(list)
            cy.get('@purposeList').then(purposeList=>{
            expect(list).to.eq(purposeList)
            cy.get('.ant-select-selector').eq(3).click() 
        })
          })
          // Validating recipient recived amount
          cy.get(':nth-child(4) > :nth-child(2) > .ant-typography').invoke('text').then((text) => {
            const storedText = text
            cy.wrap(storedText).as('storedText')
            cy.log(storedText)
            })
            cy.get('.ant-col > .ant-btn > span').should('be.visible').click()
            cy.get('.ant-modal-body > :nth-child(1) > .ant-col > .ant-typography').should('be.visible').should('contain.text','Payment Confirmation')
            cy.get('@storedText').then(storedText=>{
                cy.get(':nth-child(5) > .ant-col-8 > .ant-typography')
                .should('be.visible').and('contain.text',storedText)
            })
            cy.get('.ant-row-center.m-t-20 > .ant-col > .ant-space > :nth-child(2) > .ant-btn').should('be.visible').click() // pay recipient
            cy.get('.ant-modal-body > :nth-child(1) > .ant-col').should('be.visible').should('contain.text',' Payment Booked - ')
            cy.get('@storedText').then(storedText=>{
                cy.get(':nth-child(5) > .ant-col-8 > .ant-typography')
                .should('be.visible').and('contain.text',storedText)
            })
            newPayment.validateYapilyFlow()
            newPayment.cancelEasyTransfer()
    })
    it('TC_NP_106 - Add 1 recipient(Business) from the "Add Recipient" page with country = CHINA and currency = USD. After adding, make a single payment to the recipient using GBP and Easy transfer..', function(){
        newRecipient.goToPaymentsDashborad()
        newRecipient.gotoRecipientList()
        let email = batchPayments.generateRandomString(5)+ '@yopmail.com'
        batchPayments.addRecipient('CHINA{enter}' ,'USD{enter}' ,email)
        newRecipient.addBankDetailsWithAccNo('AYCLCNBY','55555555')
        cy.get('.ant-space > :nth-child(2) > .ant-card > .ant-card-body').should('be.visible').click()
        const bName = batchPayments.generateRandomString(6)
        batchPayments.addBusinessRecipient('BUSINESS ET'+' '+bName,'CHINA{enter}')
        batchPayments.paymentPurposeGBPEUR()
        cy.get('.ant-select-selector').eq(3).click()
        cy.get('.ant-select-dropdown').eq(3).find('.ant-select-item-option-content').then(Element=>{
            let purposeList = Element.text()
            cy.log(purposeList)
            cy.wrap(purposeList).as('purposeList')
        })
        newRecipient.saveRecipient()
        newPayment.checkSettelment('be.disabled','be.enabled')
        newPayment.proceedflow('{downarrow}{enter}','GBP')
        let amount = '125'
        newPayment.addrecipientDetail(amount, email)
             //Validate the selected payment purpose
             cy.get('@selectedValue').then(selectedValue=>{
                cy.get(':nth-child(2) > .ant-row > .ant-col > .ant-form-item-control-input > .ant-form-item-control-input-content > .ant-select > .ant-select-selector')
                .should('be.visible').and('contain.text',selectedValue)
            })
          //Validate the selected payment purpose
        cy.get('@selectedValue').then(selectedValue=>{
        cy.get(':nth-child(2) > .ant-row > .ant-col > .ant-form-item-control-input > .ant-form-item-control-input-content > .ant-select > .ant-select-selector')
        .should('be.visible').and('contain.text',selectedValue)
        })
         //Validate Purpose on batch payment
        cy.get('.ant-select-selector').eq(3).click()
        cy.get('.ant-select-dropdown').eq(1).find('.ant-select-item-option-content').then(Element=>{
            let list = Element.text()
            cy.log(list)
            cy.get('@purposeList').then(purposeList=>{
            expect(list).to.eq(purposeList)
            cy.get('.ant-select-selector').eq(3).click() 
        })
          })
          // Validating recipient recived amount
          cy.get(':nth-child(4) > :nth-child(2) > .ant-typography').invoke('text').then((text) => {
            const storedText = text
            cy.wrap(storedText).as('storedText')
            cy.log(storedText)
            })
            cy.get('.ant-col > .ant-btn > span').should('be.visible').click()
            cy.get('.ant-modal-body > :nth-child(1) > .ant-col > .ant-typography').should('be.visible').should('contain.text','Payment Confirmation')
            cy.get('@storedText').then(storedText=>{
                cy.get(':nth-child(5) > .ant-col-8 > .ant-typography')
                .should('be.visible').and('contain.text',storedText)
            })
            cy.get('.ant-row-center.m-t-20 > .ant-col > .ant-space > :nth-child(2) > .ant-btn').should('be.visible').click() // pay recipient
            cy.get('.ant-modal-body > :nth-child(1) > .ant-col').should('be.visible').should('contain.text',' Payment Booked - ')
            cy.get('@storedText').then(storedText=>{
                cy.get(':nth-child(5) > .ant-col-8 > .ant-typography')
                .should('be.visible').and('contain.text',storedText)
            })
            newPayment.validateYapilyFlow()
            newPayment.cancelEasyTransfer()
    })
    //INDIA with USD
    //push fund
    it('TC_NP_107 - Add 1 recipient(individual) from the "Add Recipient" page with country = INDIA and currency = USD. After adding, make a single payment to the recipient using GBP and push funds.', function(){
        newRecipient.goToPaymentsDashborad()
        newRecipient.gotoRecipientList()
        let email = batchPayments.generateRandomString(5)+ '@yopmail.com'
        batchPayments.addRecipient('INDIA{downarrow}{enter}' ,'USD{enter}' ,email)
        newRecipient.addBankDetailsWithAccNo('IDIBINBBXXX','55555555')
        const lName = batchPayments.generateRandomString(6)
        batchPayments.individualRecipient('INDIVIDUAL PF',lName,'INDIA{downarrow}{enter}')
        batchPayments.paymentPurposeGBPEUR()
        cy.get('.ant-select-selector').eq(3).click()
        cy.get('.ant-select-dropdown').eq(3).find('.ant-select-item-option-content').then(Element=>{
            let purposeList = Element.text()
            cy.log(purposeList)
            cy.wrap(purposeList).as('purposeList')
        })
        newRecipient.saveRecipient()
        newPayment.checkSettelment('be.disabled','be.enabled')
        newPayment.proceedflow('{downarrow}{enter}','GBP')
        let amount = '125'
        newPayment.addrecipientDetail(amount, email)
        newPayment.selectFundingMethod('Push Funds')
             //Validate the selected payment purpose
             cy.get('@selectedValue').then(selectedValue=>{
                cy.get(':nth-child(2) > .ant-row > .ant-col > .ant-form-item-control-input > .ant-form-item-control-input-content > .ant-select > .ant-select-selector')
                .should('be.visible').and('contain.text',selectedValue)
            })
          //Validate the selected payment purpose
        cy.get('@selectedValue').then(selectedValue=>{
        cy.get(':nth-child(2) > .ant-row > .ant-col > .ant-form-item-control-input > .ant-form-item-control-input-content > .ant-select > .ant-select-selector')
        .should('be.visible').and('contain.text',selectedValue)
        })
         //Validate Purpose on batch payment
        cy.get('.ant-select-selector').eq(3).click()
        cy.get('.ant-select-dropdown').eq(2).find('.ant-select-item-option-content').then(Element=>{
            let list = Element.text()
            cy.log(list)
            cy.get('@purposeList').then(purposeList=>{
            expect(list).to.eq(purposeList)
            cy.get('.ant-select-selector').eq(3).click() 
        })
          })
          // Validating recipient recived amount
          cy.get(':nth-child(4) > :nth-child(2) > .ant-typography').invoke('text').then((text) => {
            const storedText = text
            cy.wrap(storedText).as('storedText')
            cy.log(storedText)
            })
            cy.get('.ant-col > .ant-btn > span').should('be.visible').click()
            cy.get('.ant-modal-body > :nth-child(1) > .ant-col > .ant-typography').should('be.visible').should('contain.text','Payment Confirmation')
            cy.get('@storedText').then(storedText=>{
                cy.get(':nth-child(5) > .ant-col-8 > .ant-typography')
                .should('be.visible').and('contain.text',storedText)
            })
            cy.get('.ant-row-center.m-t-20 > .ant-col > .ant-space > :nth-child(2) > .ant-btn').should('be.visible').click() // pay recipient
            cy.get('.ant-modal-body > :nth-child(1) > .ant-col').should('be.visible').should('contain.text',' Payment Booked - ')
            cy.get('@storedText').then(storedText=>{
                cy.get(':nth-child(5) > .ant-col-8 > .ant-typography')
                .should('be.visible').and('contain.text',storedText)
            })
            newPayment.cancelPushFunds()
    })
    it('TC_NP_108 - Add 1 recipient(Business) from the "Add Recipient" page with country = INDIA and currency = USD. After adding, make a single payment to the recipient using GBP and push funds.', function(){
        newRecipient.goToPaymentsDashborad()
        newRecipient.gotoRecipientList()
        let email = batchPayments.generateRandomString(5)+ '@yopmail.com'
        batchPayments.addRecipient('INDIA{downarrow}{enter}' ,'USD{enter}' ,email)
        newRecipient.addBankDetailsWithAccNo('IDIBINBBXXX','55555555')
        cy.get('.ant-space > :nth-child(2) > .ant-card > .ant-card-body').should('be.visible').click()
        const bName = batchPayments.generateRandomString(6)
        batchPayments.addBusinessRecipient('BUSINESS PF'+' '+bName,'INDIA{downarrow}{enter}')
        batchPayments.paymentPurposeGBPEUR()
        cy.get('.ant-select-selector').eq(3).click()
        cy.get('.ant-select-dropdown').eq(3).find('.ant-select-item-option-content').then(Element=>{
            let purposeList = Element.text()
            cy.log(purposeList)
            cy.wrap(purposeList).as('purposeList')
        })
        newRecipient.saveRecipient()
        newPayment.checkSettelment('be.disabled','be.enabled')
        newPayment.proceedflow('{downarrow}{enter}','GBP')
        let amount = '125'
        newPayment.addrecipientDetail(amount, email)
        newPayment.selectFundingMethod('Push Funds')
             //Validate the selected payment purpose
             cy.get('@selectedValue').then(selectedValue=>{
                cy.get(':nth-child(2) > .ant-row > .ant-col > .ant-form-item-control-input > .ant-form-item-control-input-content > .ant-select > .ant-select-selector')
                .should('be.visible').and('contain.text',selectedValue)
            })
          //Validate the selected payment purpose
        cy.get('@selectedValue').then(selectedValue=>{
        cy.get(':nth-child(2) > .ant-row > .ant-col > .ant-form-item-control-input > .ant-form-item-control-input-content > .ant-select > .ant-select-selector')
        .should('be.visible').and('contain.text',selectedValue)
        })
         //Validate Purpose on batch payment
        cy.get('.ant-select-selector').eq(3).click()
        cy.get('.ant-select-dropdown').eq(2).find('.ant-select-item-option-content').then(Element=>{
            let list = Element.text()
            cy.log(list)
            cy.get('@purposeList').then(purposeList=>{
            expect(list).to.eq(purposeList)
            cy.get('.ant-select-selector').eq(3).click() 
        })
          })
          // Validating recipient recived amount
          cy.get(':nth-child(4) > :nth-child(2) > .ant-typography').invoke('text').then((text) => {
            const storedText = text
            cy.wrap(storedText).as('storedText')
            cy.log(storedText)
            })
            cy.get('.ant-col > .ant-btn > span').should('be.visible').click()
            cy.get('.ant-modal-body > :nth-child(1) > .ant-col > .ant-typography').should('be.visible').should('contain.text','Payment Confirmation')
            cy.get('@storedText').then(storedText=>{
                cy.get(':nth-child(5) > .ant-col-8 > .ant-typography')
                .should('be.visible').and('contain.text',storedText)
            })
            cy.get('.ant-row-center.m-t-20 > .ant-col > .ant-space > :nth-child(2) > .ant-btn').should('be.visible').click() // pay recipient
            cy.get('.ant-modal-body > :nth-child(1) > .ant-col').should('be.visible').should('contain.text',' Payment Booked - ')
            cy.get('@storedText').then(storedText=>{
                cy.get(':nth-child(5) > .ant-col-8 > .ant-typography')
                .should('be.visible').and('contain.text',storedText)
            })
            newPayment.cancelPushFunds()
    })

})