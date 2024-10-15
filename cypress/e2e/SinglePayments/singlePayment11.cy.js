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
     //Hong Kong with usd and easy transfer
     it('TC_NP_129 - Add 1 recipient(individual) from the "Add Recipient" page with country = HongKong and currency = USD. After adding, make a single payment to the recipient using GBP and easy transfer.', function(){
        newRecipient.goToPaymentsDashborad()
        newRecipient.gotoRecipientList()
        let email = batchPayments.generateRandomString(5)+ '@yopmail.com'
        batchPayments.addRecipient('HONG KONG{enter}' ,'USD{enter}' ,email)
        newRecipient.addBankDetailsWithAccNo('HSBCHKHHXXX','55555555')
        const lName = batchPayments.generateRandomString(6)
        batchPayments.individualRecipient('INDIVIDUAL PF',lName,'HONG KONG{enter}')
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
          cy.get('@selectedValue').then(selectedValue => {
            cy.get(`div[class="ant-form-item"] span[title="${selectedValue}"]`)
              .should('be.visible')
              .and('contain.text', selectedValue);
            
         //Validate Purpose list
            cy.get(`div[class="ant-form-item"] span[title="${selectedValue}"]`).click()
            cy.get('.ant-select-dropdown').eq(1).find('.ant-select-item-option-content').then(Element=>{
            let list = Element.text()
            cy.log(list)
            cy.get('@purposeList').then(purposeList=>{
            expect(list).to.eq(purposeList)
            cy.get(`div[class="ant-form-item"] span[title="${selectedValue}"]`).click() 
        })
        });
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
    it('TC_NP_130 - Add 1 recipient(business) from the "Add Recipient" page with country = Hong Kong and currency = USD. After adding, make a single payment to the recipient using GBP and easy transfer.', function(){
        newRecipient.goToPaymentsDashborad()
        newRecipient.gotoRecipientList()
        let email = batchPayments.generateRandomString(5)+ '@yopmail.com'
        batchPayments.addRecipient('HONG KONG{enter}' ,'USD{enter}' ,email)
        newRecipient.addBankDetailsWithAccNo('HSBCHKHHXXX','55555555')
        cy.get('.ant-space > :nth-child(2) > .ant-card > .ant-card-body').should('be.visible').click()
        const bName = batchPayments.generateRandomString(6)
        batchPayments.addBusinessRecipient('BUSINESS PF'+' '+bName,'Hong Kong{enter}')
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
          cy.get('@selectedValue').then(selectedValue => {
            cy.get(`div[class="ant-form-item"] span[title="${selectedValue}"]`)
              .should('be.visible')
              .and('contain.text', selectedValue);
            
         //Validate Purpose list
            cy.get(`div[class="ant-form-item"] span[title="${selectedValue}"]`).click()
            cy.get('.ant-select-dropdown').eq(1).find('.ant-select-item-option-content').then(Element=>{
            let list = Element.text()
            cy.log(list)
            cy.get('@purposeList').then(purposeList=>{
            expect(list).to.eq(purposeList)
            cy.get(`div[class="ant-form-item"] span[title="${selectedValue}"]`).click() 
        })
        });
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
    //Mexico with usd and push funds
    it('TC_NP_131 - Add 1 recipient(individual) from the "Add Recipient" page with country = Mexico and currency = USD. After adding, make a single payment to the recipient using GBP and push funds.', function(){
        newRecipient.goToPaymentsDashborad()
        newRecipient.gotoRecipientList()
        let email = batchPayments.generateRandomString(5)+ '@yopmail.com'
        batchPayments.addRecipient('MEXICO{enter}' ,'USD{enter}' ,email)
        newRecipient.addBankDetailsWithClabe('AFIRMXMT','002010077777777771')
        const lName = batchPayments.generateRandomString(6)
        batchPayments.individualRecipient('INDIVIDUAL Mexico',lName,'Mexico{enter}')
        newRecipient.postCodeState()
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
          cy.get('@selectedValue').then(selectedValue => {
            cy.get(`div[class="ant-form-item"] span[title="${selectedValue}"]`)
              .should('be.visible')
              .and('contain.text', selectedValue);
            
         //Validate Purpose list
            cy.get(`div[class="ant-form-item"] span[title="${selectedValue}"]`).click()
            cy.get('.ant-select-dropdown').eq(2).find('.ant-select-item-option-content').then(Element=>{
            let list = Element.text()
            cy.log(list)
            cy.get('@purposeList').then(purposeList=>{
            expect(list).to.eq(purposeList)
            cy.get(`div[class="ant-form-item"] span[title="${selectedValue}"]`).click() 
        })
        });
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
    it('TC_NP_132 - Add 1 recipient(business) from the "Add Recipient" page with country = Mexico and currency = USD. After adding, make a single payment to the recipient using GBP and push funds.', function(){
        newRecipient.goToPaymentsDashborad()
        newRecipient.gotoRecipientList()
        let email = batchPayments.generateRandomString(5)+ '@yopmail.com'
        batchPayments.addRecipient('MEXICO{enter}' ,'USD{enter}' ,email)
        newRecipient.addBankDetailsWithClabe('AFIRMXMT','002010077777777771')
        cy.get('.ant-space > :nth-child(2) > .ant-card > .ant-card-body').should('be.visible').click()
        const bName = batchPayments.generateRandomString(6)
        batchPayments.addBusinessRecipient('BUSINESS Mexico'+' '+bName,'Mexico{enter}')
        newRecipient.postCodeState()
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
          cy.get('@selectedValue').then(selectedValue => {
            cy.get(`div[class="ant-form-item"] span[title="${selectedValue}"]`)
              .should('be.visible')
              .and('contain.text', selectedValue);
            
         //Validate Purpose list
            cy.get(`div[class="ant-form-item"] span[title="${selectedValue}"]`).click()
            cy.get('.ant-select-dropdown').eq(2).find('.ant-select-item-option-content').then(Element=>{
            let list = Element.text()
            cy.log(list)
            cy.get('@purposeList').then(purposeList=>{
            expect(list).to.eq(purposeList)
            cy.get(`div[class="ant-form-item"] span[title="${selectedValue}"]`).click() 
        })
        });
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
    //Mexico with usd and easy transfer
    it('TC_NP_133 - Add 1 recipient(individual) from the "Add Recipient" page with country = Mexico and currency = USD. After adding, make a single payment to the recipient using GBP and easy transfer.', function(){
        newRecipient.goToPaymentsDashborad()
        newRecipient.gotoRecipientList()
        let email = batchPayments.generateRandomString(5)+ '@yopmail.com'
        batchPayments.addRecipient('MEXICO{enter}' ,'USD{enter}' ,email)
        newRecipient.addBankDetailsWithClabe('AFIRMXMT','002010077777777771')
        const lName = batchPayments.generateRandomString(6)
        batchPayments.individualRecipient('INDIVIDUAL PF',lName,'Mexico{enter}')
        newRecipient.postCodeState()
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
          cy.get('@selectedValue').then(selectedValue => {
            cy.get(`div[class="ant-form-item"] span[title="${selectedValue}"]`)
              .should('be.visible')
              .and('contain.text', selectedValue);
            
         //Validate Purpose list
            cy.get(`div[class="ant-form-item"] span[title="${selectedValue}"]`).click()
            cy.get('.ant-select-dropdown').eq(1).find('.ant-select-item-option-content').then(Element=>{
            let list = Element.text()
            cy.log(list)
            cy.get('@purposeList').then(purposeList=>{
            expect(list).to.eq(purposeList)
            cy.get(`div[class="ant-form-item"] span[title="${selectedValue}"]`).click() 
        })
        });
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
    it('TC_NP_134 - Add 1 recipient(business) from the "Add Recipient" page with country = Mexico and currency = USD. After adding, make a single payment to the recipient using GBP and easy transfer.', function(){
        newRecipient.goToPaymentsDashborad()
        newRecipient.gotoRecipientList()
        let email = batchPayments.generateRandomString(5)+ '@yopmail.com'
        batchPayments.addRecipient('MEXICO{enter}' ,'USD{enter}' ,email)
        newRecipient.addBankDetailsWithClabe('AFIRMXMT','002010077777777771')
        cy.get('.ant-space > :nth-child(2) > .ant-card > .ant-card-body').should('be.visible').click()
        const bName = batchPayments.generateRandomString(6)
        batchPayments.addBusinessRecipient('BUSINESS PF'+' '+bName,'Mexico{enter}')
        newRecipient.postCodeState()
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
          cy.get('@selectedValue').then(selectedValue => {
            cy.get(`div[class="ant-form-item"] span[title="${selectedValue}"]`)
              .should('be.visible')
              .and('contain.text', selectedValue);
            
         //Validate Purpose list
            cy.get(`div[class="ant-form-item"] span[title="${selectedValue}"]`).click()
            cy.get('.ant-select-dropdown').eq(1).find('.ant-select-item-option-content').then(Element=>{
            let list = Element.text()
            cy.log(list)
            cy.get('@purposeList').then(purposeList=>{
            expect(list).to.eq(purposeList)
            cy.get(`div[class="ant-form-item"] span[title="${selectedValue}"]`).click() 
        })
        });
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