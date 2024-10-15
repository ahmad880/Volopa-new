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
     // Individual Easy Transfer
     it('TC_NP_040 - Add 1 recipient(individual) from the "Add Recipient" page with country = Germany and currency = EUR. After adding, make a single payment to the recipient using GBP and easy transfer.', function(){
        newRecipient.goToPaymentsDashborad()
        newRecipient.gotoRecipientList()
        let email = batchPayments.generateRandomString(5)+ '@yopmail.com'
        batchPayments.addRecipient('GERMANY{enter}' ,'EUR{enter}' ,email)
        newRecipient.addBankDetails('DE40500105171359375129','AARBDE5W100')
        const lName = batchPayments.generateRandomString(6)
        batchPayments.individualRecipient('INDIVIDUAL GBP PF',lName,'United Kingdom{enter}')
        batchPayments.paymentPurposeGBPEUR()
        cy.get('.ant-select-selector').eq(3).click()
        cy.get('.ant-select-dropdown').eq(3).find('.ant-select-item-option-content').then(Element=>{
            let purposeList = Element.text()
            cy.log(purposeList)
            cy.wrap(purposeList).as('purposeList')
        })
        newRecipient.saveRecipient()
        newPayment.checkSettelment('be.enabled','be.enabled')
        newPayment.proceedflow('{enter}','GBP')
        let amount = '125'
        newPayment.addrecipientDetail(amount, email)
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
    it('TC_NP_041 - Add 1 recipient(individual) from the "Add Recipient" page with country = France and currency = EUR. After adding, make a single payment to the recipient using GBP and easy transfer.', function(){
        newRecipient.goToPaymentsDashborad()
        newRecipient.gotoRecipientList()
        let email = batchPayments.generateRandomString(5)+ '@yopmail.com'
        batchPayments.addRecipient('FRANCE{enter}' ,'EUR{enter}' ,email)
        newRecipient.addBankDetails('FR1420041010050500013M02606','GASKFRPPXXX')
        const lName = batchPayments.generateRandomString(6)
        batchPayments.individualRecipient('INDIVIDUAL GBP PF',lName,'United Kingdom{enter}')
        batchPayments.paymentPurposeGBPEUR()
        cy.get('.ant-select-selector').eq(3).click()
        cy.get('.ant-select-dropdown').eq(3).find('.ant-select-item-option-content').then(Element=>{
            let purposeList = Element.text()
            cy.log(purposeList)
            cy.wrap(purposeList).as('purposeList')
        })
        newRecipient.saveRecipient()
        newPayment.checkSettelment('be.enabled','be.enabled')
        newPayment.proceedflow('{enter}','GBP')
        let amount = '125'
        newPayment.addrecipientDetail(amount, email)
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
    it('TC_NP_042 - Add 1 recipient(individual) from the "Add Recipient" page with country = Spain and currency = EUR. After adding, make a single payment to the recipient using GBP and easy transfer.', function(){
        newRecipient.goToPaymentsDashborad()
        newRecipient.gotoRecipientList()
        let email = batchPayments.generateRandomString(5)+ '@yopmail.com'
        batchPayments.addRecipient('SPAIN{enter}' ,'EUR{enter}' ,email)
        newRecipient.addBankDetails('ES9121000418450200051332','CAGLESMMCOP')
        const lName = batchPayments.generateRandomString(6)
        batchPayments.individualRecipient('INDIVIDUAL GBP PF',lName,'United Kingdom{enter}')
        batchPayments.paymentPurposeGBPEUR()
        cy.get('.ant-select-selector').eq(3).click()
        cy.get('.ant-select-dropdown').eq(3).find('.ant-select-item-option-content').then(Element=>{
            let purposeList = Element.text()
            cy.log(purposeList)
            cy.wrap(purposeList).as('purposeList')
        })
        newRecipient.saveRecipient()
        newPayment.checkSettelment('be.enabled','be.enabled')
        newPayment.proceedflow('{enter}','GBP')
        let amount = '125'
        newPayment.addrecipientDetail(amount, email)
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
    it('TC_NP_043 - Add 1 recipient(individual) from the "Add Recipient" page with country = Italy and currency = EUR. After adding, make a single payment to the recipient using GBP and easy transfer.', function(){
        newRecipient.goToPaymentsDashborad()
        newRecipient.gotoRecipientList()
        let email = batchPayments.generateRandomString(5)+ '@yopmail.com'
        batchPayments.addRecipient('ITALY{enter}' ,'EUR{enter}' ,email)
        newRecipient.addBankDetails('IT60X0542811101000000123456','FCRRITM1XXX')
        const lName = batchPayments.generateRandomString(6)
        batchPayments.individualRecipient('INDIVIDUAL GBP PF',lName,'ITALY{enter}')
        batchPayments.paymentPurposeGBPEUR()
        cy.get('.ant-select-selector').eq(3).click()
        cy.get('.ant-select-dropdown').eq(3).find('.ant-select-item-option-content').then(Element=>{
            let purposeList = Element.text()
            cy.log(purposeList)
            cy.wrap(purposeList).as('purposeList')
        })
        newRecipient.saveRecipient()
        newPayment.checkSettelment('be.enabled','be.enabled')
        newPayment.proceedflow('{enter}','GBP')
        let amount = '125'
        newPayment.addrecipientDetail(amount, email)
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
    it('TC_NP_044 - Add 1 recipient(individual) from the "Add Recipient" page with country = Malta and currency = EUR. After adding, make a single payment to the recipient using GBP and easy transfer.', function(){
        newRecipient.goToPaymentsDashborad()
        newRecipient.gotoRecipientList()
        let email = batchPayments.generateRandomString(5)+ '@yopmail.com'
        batchPayments.addRecipient('MALTA{enter}' ,'EUR{enter}' ,email)
        newRecipient.addBankDetails('MT84MALT011000012345MTLCAST001S','IESCMTM1XXX')
        const lName = batchPayments.generateRandomString(6)
        batchPayments.individualRecipient('INDIVIDUAL GBP PF',lName,'MALTA{enter}')
        batchPayments.paymentPurposeGBPEUR()
        cy.get('.ant-select-selector').eq(3).click()
        cy.get('.ant-select-dropdown').eq(3).find('.ant-select-item-option-content').then(Element=>{
            let purposeList = Element.text()
            cy.log(purposeList)
            cy.wrap(purposeList).as('purposeList')
        })
        newRecipient.saveRecipient()
        newPayment.checkSettelment('be.enabled','be.enabled')
        newPayment.proceedflow('{enter}','GBP')
        let amount = '125'
        newPayment.addrecipientDetail(amount, email)
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
    //Business Recipient Push Fund
    it('TC_NP_045 - Add 1 recipient(Business) from the "Add Recipient" page with country = Germany and currency = EUR. After adding, make a single payment to the recipient using GBP and push funds.', function(){
        newRecipient.goToPaymentsDashborad()
        newRecipient.gotoRecipientList()
        let email = batchPayments.generateRandomString(5)+ '@yopmail.com'
        batchPayments.addRecipient('GERMANY{enter}' ,'EUR{enter}' ,email)
        newRecipient.addBankDetails('DE40500105171359375129','AARBDE5W100')
        cy.get('.ant-space > :nth-child(2) > .ant-card > .ant-card-body').should('be.visible').click()
        const bName = batchPayments.generateRandomString(6)
        batchPayments.addBusinessRecipient('BUSINESS EUR'+' '+bName,'GERMANY{enter}')
        batchPayments.paymentPurposeGBPEUR()
        cy.get('.ant-select-selector').eq(3).click()
        cy.get('.ant-select-dropdown').eq(3).find('.ant-select-item-option-content').then(Element=>{
            let purposeList = Element.text()
            cy.log(purposeList)
            cy.wrap(purposeList).as('purposeList')
        })
        newRecipient.saveRecipient()
        newPayment.checkSettelment('be.enabled','be.enabled')
        newPayment.proceedflow('{enter}','GBP')
        let amount = '125'
        newPayment.addrecipientDetail(amount, email)
        newPayment.selectFundingMethod('Push Funds')
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
    it('TC_NP_046 - Add 1 recipient(Business) from the "Add Recipient" page with country = France and currency = EUR. After adding, make a single payment to the recipient using GBP and push funds.', function(){
        newRecipient.goToPaymentsDashborad()
        newRecipient.gotoRecipientList()
        let email = batchPayments.generateRandomString(5)+ '@yopmail.com'
        batchPayments.addRecipient('FRANCE{enter}' ,'EUR{enter}' ,email)
        newRecipient.addBankDetails('FR1420041010050500013M02606','GASKFRPPXXX')
        cy.get('.ant-space > :nth-child(2) > .ant-card > .ant-card-body').should('be.visible').click()
        const bName = batchPayments.generateRandomString(6)
        batchPayments.addBusinessRecipient('BUSINESS EUR'+' '+bName,'FRANCE{enter}')
        batchPayments.paymentPurposeGBPEUR()
        cy.get('.ant-select-selector').eq(3).click()
        cy.get('.ant-select-dropdown').eq(3).find('.ant-select-item-option-content').then(Element=>{
            let purposeList = Element.text()
            cy.log(purposeList)
            cy.wrap(purposeList).as('purposeList')
        })
        newRecipient.saveRecipient()
        newPayment.checkSettelment('be.enabled','be.enabled')
        newPayment.proceedflow('{enter}','GBP')
        let amount = '125'
        newPayment.addrecipientDetail(amount, email)
        newPayment.selectFundingMethod('Push Funds')
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
    it('TC_NP_047 - Add 1 recipient(Business) from the "Add Recipient" page with country = Spain and currency = EUR. After adding, make a single payment to the recipient using GBP and push funds.', function(){
        newRecipient.goToPaymentsDashborad()
        newRecipient.gotoRecipientList()
        let email = batchPayments.generateRandomString(5)+ '@yopmail.com'
        batchPayments.addRecipient('SPAIN{enter}' ,'EUR{enter}' ,email)
        newRecipient.addBankDetails('ES9121000418450200051332','CAGLESMMCOP')
        cy.get('.ant-space > :nth-child(2) > .ant-card > .ant-card-body').should('be.visible').click()
        const bName = batchPayments.generateRandomString(6)
        batchPayments.addBusinessRecipient('BUSINESS EUR'+' '+bName,'SPAIN{enter}')
        batchPayments.paymentPurposeGBPEUR()
        cy.get('.ant-select-selector').eq(3).click()
        cy.get('.ant-select-dropdown').eq(3).find('.ant-select-item-option-content').then(Element=>{
            let purposeList = Element.text()
            cy.log(purposeList)
            cy.wrap(purposeList).as('purposeList')
        })
        newRecipient.saveRecipient()
        newPayment.checkSettelment('be.enabled','be.enabled')
        newPayment.proceedflow('{enter}','GBP')
        let amount = '125'
        newPayment.addrecipientDetail(amount, email)
        newPayment.selectFundingMethod('Push Funds')
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
    it('TC_NP_048 - Add 1 recipient(Business) from the "Add Recipient" page with country = Italy and currency = EUR. After adding, make a single payment to the recipient using GBP and push funds.', function(){
        newRecipient.goToPaymentsDashborad()
        newRecipient.gotoRecipientList()
        let email = batchPayments.generateRandomString(5)+ '@yopmail.com'
        batchPayments.addRecipient('ITALY{enter}' ,'EUR{enter}' ,email)
        newRecipient.addBankDetails('IT60X0542811101000000123456','FCRRITM1XXX')
        cy.get('.ant-space > :nth-child(2) > .ant-card > .ant-card-body').should('be.visible').click()
        const bName = batchPayments.generateRandomString(6)
        batchPayments.addBusinessRecipient('BUSINESS EUR'+' '+bName,'ITALY{enter}')
        batchPayments.paymentPurposeGBPEUR()
        cy.get('.ant-select-selector').eq(3).click()
        cy.get('.ant-select-dropdown').eq(3).find('.ant-select-item-option-content').then(Element=>{
            let purposeList = Element.text()
            cy.log(purposeList)
            cy.wrap(purposeList).as('purposeList')
        })
        newRecipient.saveRecipient()
        newPayment.checkSettelment('be.enabled','be.enabled')
        newPayment.proceedflow('{enter}','GBP')
        let amount = '125'
        newPayment.addrecipientDetail(amount, email)
        newPayment.selectFundingMethod('Push Funds')
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
    it('TC_NP_049 - Add 1 recipient(Business) from the "Add Recipient" page with country = Malta and currency = EUR. After adding, make a single payment to the recipient using GBP and push funds.', function(){
        newRecipient.goToPaymentsDashborad()
        newRecipient.gotoRecipientList()
        let email = batchPayments.generateRandomString(5)+ '@yopmail.com'
        batchPayments.addRecipient('MALTA{enter}' ,'EUR{enter}' ,email)
        newRecipient.addBankDetails('MT84MALT011000012345MTLCAST001S','IESCMTM1XXX')
        cy.get('.ant-space > :nth-child(2) > .ant-card > .ant-card-body').should('be.visible').click()
        const bName = batchPayments.generateRandomString(6)
        batchPayments.addBusinessRecipient('BUSINESS EUR'+' '+bName,'MALTA{enter}')
        batchPayments.paymentPurposeGBPEUR()
        cy.get('.ant-select-selector').eq(3).click()
        cy.get('.ant-select-dropdown').eq(3).find('.ant-select-item-option-content').then(Element=>{
            let purposeList = Element.text()
            cy.log(purposeList)
            cy.wrap(purposeList).as('purposeList')
        })
        newRecipient.saveRecipient()
        newPayment.checkSettelment('be.enabled','be.enabled')
        newPayment.proceedflow('{enter}','GBP')
        let amount = '125'
        newPayment.addrecipientDetail(amount, email)
        newPayment.selectFundingMethod('Push Funds')
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
    // Business Easy Transfer
    it('TC_NP_050 - Add 1 recipient(Business) from the "Add Recipient" page with country = Germany and currency = EUR. After adding, make a single payment to the recipient using GBP and easy transfer.', function(){
        newRecipient.goToPaymentsDashborad()
        newRecipient.gotoRecipientList()
        let email = batchPayments.generateRandomString(5)+ '@yopmail.com'
        batchPayments.addRecipient('GERMANY{enter}' ,'EUR{enter}' ,email)
        newRecipient.addBankDetails('DE40500105171359375129','AARBDE5W100')
        cy.get('.ant-space > :nth-child(2) > .ant-card > .ant-card-body').should('be.visible').click()
        const bName = batchPayments.generateRandomString(6)
        batchPayments.addBusinessRecipient('BUSINESS EUR'+' '+bName,'GERMANY{enter}')
        batchPayments.paymentPurposeGBPEUR()
        cy.get('.ant-select-selector').eq(3).click()
        cy.get('.ant-select-dropdown').eq(3).find('.ant-select-item-option-content').then(Element=>{
            let purposeList = Element.text()
            cy.log(purposeList)
            cy.wrap(purposeList).as('purposeList')
        })
        newRecipient.saveRecipient()
        newPayment.checkSettelment('be.enabled','be.enabled')
        newPayment.proceedflow('{enter}','GBP')
        let amount = '125'
        newPayment.addrecipientDetail(amount, email)
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
    it('TC_NP_051 - Add 1 recipient(Business) from the "Add Recipient" page with country = France and currency = EUR. After adding, make a single payment to the recipient using GBP and easy transfer.', function(){
        newRecipient.goToPaymentsDashborad()
        newRecipient.gotoRecipientList()
        let email = batchPayments.generateRandomString(5)+ '@yopmail.com'
        batchPayments.addRecipient('FRANCE{enter}' ,'EUR{enter}' ,email)
        newRecipient.addBankDetails('FR1420041010050500013M02606','GASKFRPPXXX')
        cy.get('.ant-space > :nth-child(2) > .ant-card > .ant-card-body').should('be.visible').click()
        const bName = batchPayments.generateRandomString(6)
        batchPayments.addBusinessRecipient('BUSINESS EUR'+' '+bName,'FRANCE{enter}')
        batchPayments.paymentPurposeGBPEUR()
        cy.get('.ant-select-selector').eq(3).click()
        cy.get('.ant-select-dropdown').eq(3).find('.ant-select-item-option-content').then(Element=>{
            let purposeList = Element.text()
            cy.log(purposeList)
            cy.wrap(purposeList).as('purposeList')
        })
        newRecipient.saveRecipient()
        newPayment.checkSettelment('be.enabled','be.enabled')
        newPayment.proceedflow('{enter}','GBP')
        let amount = '125'
        newPayment.addrecipientDetail(amount, email)
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
    it('TC_NP_052 - Add 1 recipient(Business) from the "Add Recipient" page with country = Spain and currency = EUR. After adding, make a single payment to the recipient using GBP and easy transfer.', function(){
        newRecipient.goToPaymentsDashborad()
        newRecipient.gotoRecipientList()
        let email = batchPayments.generateRandomString(5)+ '@yopmail.com'
        batchPayments.addRecipient('SPAIN{enter}' ,'EUR{enter}' ,email)
        newRecipient.addBankDetails('ES9121000418450200051332','CAGLESMMCOP')
        cy.get('.ant-space > :nth-child(2) > .ant-card > .ant-card-body').should('be.visible').click()
        const bName = batchPayments.generateRandomString(6)
        batchPayments.addBusinessRecipient('BUSINESS EUR'+' '+bName,'SPAIN{enter}')
        batchPayments.paymentPurposeGBPEUR()
        cy.get('.ant-select-selector').eq(3).click()
        cy.get('.ant-select-dropdown').eq(3).find('.ant-select-item-option-content').then(Element=>{
            let purposeList = Element.text()
            cy.log(purposeList)
            cy.wrap(purposeList).as('purposeList')
        })
        newRecipient.saveRecipient()
        newPayment.checkSettelment('be.enabled','be.enabled')
        newPayment.proceedflow('{enter}','GBP')
        let amount = '125'
        newPayment.addrecipientDetail(amount, email)
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
    it('TC_NP_053 - Add 1 recipient(Business) from the "Add Recipient" page with country = Italy and currency = EUR. After adding, make a single payment to the recipient using GBP and easy transfer.', function(){
        newRecipient.goToPaymentsDashborad()
        newRecipient.gotoRecipientList()
        let email = batchPayments.generateRandomString(5)+ '@yopmail.com'
        batchPayments.addRecipient('ITALY{enter}' ,'EUR{enter}' ,email)
        newRecipient.addBankDetails('IT60X0542811101000000123456','FCRRITM1XXX')
        const lName = batchPayments.generateRandomString(6)
        batchPayments.individualRecipient('INDIVIDUAL GBP PF',lName,'ITALY{enter}')
        batchPayments.paymentPurposeGBPEUR()
        cy.get('.ant-select-selector').eq(3).click()
        cy.get('.ant-select-dropdown').eq(3).find('.ant-select-item-option-content').then(Element=>{
            let purposeList = Element.text()
            cy.log(purposeList)
            cy.wrap(purposeList).as('purposeList')
        })
        newRecipient.saveRecipient()
        newPayment.checkSettelment('be.enabled','be.enabled')
        newPayment.proceedflow('{enter}','GBP')
        let amount = '125'
        newPayment.addrecipientDetail(amount, email)
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
    it('TC_NP_054 - Add 1 recipient(Business) from the "Add Recipient" page with country = Malta and currency = EUR. After adding, make a single payment to the recipient using GBP and easy transfer.', function(){
        newRecipient.goToPaymentsDashborad()
        newRecipient.gotoRecipientList()
        let email = batchPayments.generateRandomString(5)+ '@yopmail.com'
        batchPayments.addRecipient('MALTA{enter}' ,'EUR{enter}' ,email)
        newRecipient.addBankDetails('MT84MALT011000012345MTLCAST001S','IESCMTM1XXX')
        cy.get('.ant-space > :nth-child(2) > .ant-card > .ant-card-body').should('be.visible').click()
        const bName = batchPayments.generateRandomString(6)
        batchPayments.addBusinessRecipient('BUSINESS EUR'+' '+bName,'MALTA{enter}')
        batchPayments.paymentPurposeGBPEUR()
        cy.get('.ant-select-selector').eq(3).click()
        cy.get('.ant-select-dropdown').eq(3).find('.ant-select-item-option-content').then(Element=>{
            let purposeList = Element.text()
            cy.log(purposeList)
            cy.wrap(purposeList).as('purposeList')
        })
        newRecipient.saveRecipient()
        newPayment.checkSettelment('be.enabled','be.enabled')
        newPayment.proceedflow('{enter}','GBP')
        let amount = '125'
        newPayment.addrecipientDetail(amount, email)
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

})