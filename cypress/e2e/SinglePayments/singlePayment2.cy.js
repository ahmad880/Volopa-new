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
     // push fund
     it('TC_NP_011 - Verify that payments to the recipients with ABA code with currency USD & country US should have both Settlement Methods (Regular, priority) enabled. using GBP and push funds.', function(){
        newRecipient.goToPaymentsDashborad()
        newRecipient.gotoRecipientList()
        let email = batchPayments.generateRandomString(5)+ '@yopmail.com'
        batchPayments.addRecipient('United States{enter}' ,'USD{enter}' ,email)
        newRecipient.addBankDetailsWithAccNo('MMMCUS44','55555555')
        cy.get('#aba').type('026009593')
        const lName = batchPayments.generateRandomString(6)
        batchPayments.individualRecipient('INDIVIDUAL USD PF',lName,'UNITED States{enter}')
        newRecipient.postCodeState()
        batchPayments.paymentPurposeGBPEUR()
        cy.get('.ant-select-selector').eq(3).click()
        cy.get('.ant-select-dropdown').eq(3).find('.ant-select-item-option-content').then(Element=>{
            let purposeList = Element.text()
            cy.log(purposeList)
            cy.wrap(purposeList).as('purposeList')
        })
        newRecipient.saveRecipient()
        newPayment.checkSettelment('be.enabled','be.enabled')
        newPayment.proceedflow('{downarrow}{enter}','GBP')
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
    })
    it('TC_NP_012 - Verify that payments to the recipients without ABA code with currency USD & country US should have both Settlement Methods (Regular, priority) enabled. using GBP and push funds.', function(){
      newRecipient.goToPaymentsDashborad()
      newRecipient.gotoRecipientList()
      let email = batchPayments.generateRandomString(5)+ '@yopmail.com'
      batchPayments.addRecipient('United States{enter}' ,'USD{enter}' ,email)
      newRecipient.addBankDetailsWithAccNo('MMMCUS44','55555555')
      const lName = batchPayments.generateRandomString(6)
      batchPayments.individualRecipient('INDIVIDUAL USD PF',lName,'UNITED States{enter}')
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
    })
    it('TC_NP_013 - Verify that payments to the recipients without ABA code with currency USD & country US should have only priority Settlement Method enabled using GBP and push funds.', function(){
      newRecipient.goToPaymentsDashborad()
      newRecipient.gotoRecipientList()
      let email = batchPayments.generateRandomString(5)+ '@yopmail.com'
      batchPayments.addRecipient('United States{enter}' ,'EUR{enter}' ,email)
      newRecipient.addBankDetailsWithAccNo('MMMCUS44','55555555')
      const lName = batchPayments.generateRandomString(6)
      batchPayments.individualRecipient('INDIVIDUAL EUR PF',lName,'UNITED States{enter}')
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
    })
    it('TC_NP_014 - Verify that payments to the recipients with ABA code with country US & currency Euro should have only priority Settlement Method enabled. using GBP and push funds.', function(){
    newRecipient.goToPaymentsDashborad()
    newRecipient.gotoRecipientList()
    let email = batchPayments.generateRandomString(5)+ '@yopmail.com'
    batchPayments.addRecipient('United States{enter}' ,'EUR{enter}' ,email)
    newRecipient.addBankDetailsWithAccNo('MMMCUS44','55555555')
    cy.get('#aba').type('026009593')
    const lName = batchPayments.generateRandomString(6)
    batchPayments.individualRecipient('INDIVIDUAL EUR PF',lName,'UNITED States{enter}')
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
    })
    it('TC_NP_015 - Verify that payments to the recipients without ABA code with country US & currency Euro should have only priority Settlement Method enabled. using GBP and push funds.', function(){
        newRecipient.goToPaymentsDashborad()
        newRecipient.gotoRecipientList()
        let email = batchPayments.generateRandomString(5)+ '@yopmail.com'
        batchPayments.addRecipient('United States{enter}' ,'EUR{enter}' ,email)
        newRecipient.addBankDetailsWithAccNo('MMMCUS44','55555555')
        cy.get('#aba').type('026009593')
        const lName = batchPayments.generateRandomString(6)
        batchPayments.individualRecipient('INDIVIDUAL EUR PF',lName,'UNITED States{enter}')
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
        newPayment.proceedflow('{enter}','GBP')
        let amount = '125'
        newPayment.addrecipientDetail(amount, email)
        newPayment.selectFundingMethod('Push Funds')
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
            cy.get('.ant-col > .ant-btn > span').should('be.visible').click()
            cy.get('.ant-modal-body > :nth-child(1) > .ant-col > .ant-typography').should('be.visible').should('contain.text','Payment Confirmation')
            cy.get('.ant-row-center.m-t-20 > .ant-col > .ant-space > :nth-child(2) > .ant-btn').should('be.visible').click() // pay recipient
            cy.get('.ant-modal-body > :nth-child(1) > .ant-col').should('be.visible').should('contain.text',' Payment Booked - ')
    })
    it('TC_NP_017 - Add 1 recipient(individual) from the "Add Recipient" page with country = United Arab Emirates and currency = AED. After adding, make a single payment to the recipient using GBP and push funds.', function(){
        newRecipient.goToPaymentsDashborad()
        newRecipient.gotoRecipientList()
        let email = batchPayments.generateRandomString(5)+ '@yopmail.com'
        batchPayments.addRecipient('United Arab Emirates{enter}' ,'AED{enter}' ,email)
        newRecipient.addBankDetails('AE070331234567890123456','AARPAEAA')
        const lName = batchPayments.generateRandomString(6)
        batchPayments.individualRecipient('INDIVIDUAL AED PF',lName,'United Arab Emirates{enter}')
        batchPayments.paymentPurpose()
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
         //Validate Purpose on batch payment
        cy.get('.ant-select-selector').eq(2).click()
        cy.get('.ant-select-dropdown').eq(2).find('.ant-select-item-option-content').then(Element=>{
            let list = Element.text()
            cy.log(list)
            cy.get('@purposeList').then(purposeList=>{
            expect(list).to.eq(purposeList)
            cy.get('.ant-select-selector').eq(2).click()
        })
          })
            cy.get('.ant-col > .ant-btn > span').should('be.visible').click()
            cy.get('.ant-modal-body > :nth-child(1) > .ant-col > .ant-typography').should('be.visible').should('contain.text','Payment Confirmation')
            cy.get('.ant-row-center.m-t-20 > .ant-col > .ant-space > :nth-child(2) > .ant-btn').should('be.visible').click() // pay recipient
            cy.get('.ant-modal-body > :nth-child(1) > .ant-col').should('be.visible').should('contain.text',' Payment Booked - ')
            newPayment.cancelPushFunds()
    })
    it('TC_NP_018 - Add 1 recipient(individual) from the "Add Recipient" page with country = India and currency = INR. After adding, make a single payment to the recipient using GBP and push funds.', function(){
        newRecipient.goToPaymentsDashborad()
        newRecipient.gotoRecipientList()
        let email = batchPayments.generateRandomString(5)+ '@yopmail.com'
        batchPayments.addRecipient('INDIA{downarrow}{enter}' ,'INR{enter}' ,email)
        newRecipient.addIndiaBankDetail()
        const lName = batchPayments.generateRandomString(6)
        batchPayments.individualRecipient('INDIVIDUAL AED PF',lName,'INDIA{downarrow}{enter}')
        batchPayments.paymentPurpose()
        cy.get('.ant-select-selector').eq(3).click()
        cy.get('.ant-select-dropdown').eq(3).find('.ant-select-item-option-content').then(Element=>{
            let purposeList = Element.text()
            cy.log(purposeList)
            cy.wrap(purposeList).as('purposeList')
        })
        newRecipient.saveRecipient()
        newPayment.checkSettelment('be.enabled','be.disabled')
        newPayment.proceedflow('{downarrow}{enter}','GBP')
        let amount = '125'
        newPayment.addrecipientDetail(amount, email)
        newPayment.selectFundingMethod('Push Funds')
         //Validate Purpose on batch payment
        cy.get('.ant-select-selector').eq(2).click()
        cy.get('.ant-select-dropdown').eq(2).find('.ant-select-item-option-content').then(Element=>{
            let list = Element.text()
            cy.log(list)
            cy.get('@purposeList').then(purposeList=>{
            expect(list).to.eq(purposeList)
            cy.get('.ant-select-selector').eq(2).click()
        })
          })
          newPayment.iNRDetails()
            cy.get('.ant-col > .ant-btn > span').should('be.visible').click()
            cy.get('.ant-modal-body > :nth-child(1) > .ant-col > .ant-typography').should('be.visible').should('contain.text','Payment Confirmation')
            cy.get('.ant-row-center.m-t-20 > .ant-col > .ant-space > :nth-child(2) > .ant-btn').should('be.visible').click() // pay recipient
            cy.get('.ant-modal-body > :nth-child(1) > .ant-col').should('be.visible').should('contain.text',' Payment Booked - ')
            newPayment.cancelPushFunds()
    })
    it('TC_NP_019 - Add 1 recipient(individual) from the "Add Recipient" page with country = CHINA and currency = CNY. After adding, make a single payment to the recipient using GBP and push funds.', function(){
        newRecipient.goToPaymentsDashborad()
        newRecipient.gotoRecipientList()
        let email = batchPayments.generateRandomString(5)+ '@yopmail.com'
        batchPayments.addRecipient('CHINA{enter}' ,'CNY{enter}' ,email)
        newRecipient.addBankDetailsChina('AYCLCNBY','55555555','501100000011')
        const bName = batchPayments.generateRandomString(6)
        batchPayments.addBusinessRecipient('INDIVIDUAL PF'+' '+bName,'CHINA{enter}')
        batchPayments.paymentPurposeChina()
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
         //Validate Purpose on batch payment
        cy.get('.ant-select-selector').eq(2).click()
        cy.get('.ant-select-dropdown').eq(2).find('.ant-select-item-option-content').then(Element=>{
            let list = Element.text()
            cy.log(list)
            cy.get('@purposeList').then(purposeList=>{
            expect(list).to.eq(purposeList)
            cy.get('.ant-select-selector').eq(2).click()
        })
          })
            cy.get('.ant-col > .ant-btn > span').should('be.visible').click()
            cy.get('.ant-modal-body > :nth-child(1) > .ant-col > .ant-typography').should('be.visible').should('contain.text','Payment Confirmation')
            cy.get('.ant-row-center.m-t-20 > .ant-col > .ant-space > :nth-child(2) > .ant-btn').should('be.visible').click() // pay recipient
            cy.get('.ant-modal-body > :nth-child(1) > .ant-col').should('be.visible').should('contain.text',' Payment Booked - ')
            newPayment.cancelPushFunds()
    })
    it('TC_NP_020 - Add 1 recipient(individual) from the "Add Recipient" page with country = United Kingdom and currency = EUR. After adding, make a single payment to the recipient using GBP and push funds.', function(){
        newRecipient.goToPaymentsDashborad()
        newRecipient.gotoRecipientList()
        let email = batchPayments.generateRandomString(5)+ '@yopmail.com'
        batchPayments.addRecipient('United Kingdom{enter}' ,'EUR{enter}' ,email)
        newRecipient.addBankDetails('GB73BARC20039538243547','AFFLGB22')
        const lName = batchPayments.generateRandomString(6)
        batchPayments.individualRecipient('INDIVIDUAL EUR PF',lName,'United Kingdom{enter}')
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
            cy.get('.ant-col > .ant-btn > span').should('be.visible').click()
            cy.get('.ant-modal-body > :nth-child(1) > .ant-col > .ant-typography').should('be.visible').should('contain.text','Payment Confirmation')
            cy.get('.ant-row-center.m-t-20 > .ant-col > .ant-space > :nth-child(2) > .ant-btn').should('be.visible').click() // pay recipient
            cy.get('.ant-modal-body > :nth-child(1) > .ant-col').should('be.visible').should('contain.text',' Payment Booked - ')
            newPayment.cancelPushFunds()
    })
    it('TC_NP_021 - Add 1 recipient(individual) from the "Add Recipient" page with country = United Kingdom and currency = GBP. After adding, make a single payment to the recipient using EUR and push funds.', function(){
        newRecipient.goToPaymentsDashborad()
        newRecipient.gotoRecipientList()
        let email = batchPayments.generateRandomString(5)+ '@yopmail.com'
        batchPayments.addRecipient('United Kingdom{enter}' ,'GBP{enter}' ,email)
        newRecipient.addBankDetails('GB73BARC20039538243547','AFFLGB22')
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
        newPayment.checkSettelment('be.disabled','be.enabled')
        newPayment.proceedflow('{enter}','EUR')
        let amount = '130'
        newPayment.addrecipientDetail(amount, email)
        newPayment.selectFundingMethod('Push Funds')
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
            cy.get('.ant-col > .ant-btn > span').should('be.visible').click()
            cy.get('.ant-modal-body > :nth-child(1) > .ant-col > .ant-typography').should('be.visible').should('contain.text','Payment Confirmation')
            cy.get('.ant-row-center.m-t-20 > .ant-col > .ant-space > :nth-child(2) > .ant-btn').should('be.visible').click() // pay recipient
            cy.get('.ant-modal-body > :nth-child(1) > .ant-col').should('be.visible').should('contain.text',' Payment Booked - ')
    })
    // Individual Easy Transfer
    it('TC_NP_022 - Add 1 recipient(individual) from the "Add Recipient" page with country = United Arab Emirates and currency = AED. After adding, make a single payment to the recipient using GBP and easy transfer.', function(){
        //Easy Transfer
        newRecipient.goToPaymentsDashborad()
        newRecipient.gotoRecipientList()
        let email = batchPayments.generateRandomString(5)+ '@yopmail.com'
        batchPayments.addRecipient('United Arab Emirates{enter}' ,'AED{enter}' ,email)
        newRecipient.addBankDetails('AE070331234567890123456','AARPAEAA')
        const lName = batchPayments.generateRandomString(6)
        batchPayments.individualRecipient('INDIVIDUAL AED PF',lName,'United Arab Emirates{enter}')
        batchPayments.paymentPurpose()
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
         //Validate Purpose on batch payment
        cy.get('.ant-select-selector').eq(2).click()
        cy.get('.ant-select-dropdown').eq(1).find('.ant-select-item-option-content').then(Element=>{
            let list = Element.text()
            cy.log(list)
            cy.get('@purposeList').then(purposeList=>{
            expect(list).to.eq(purposeList)
            cy.get('.ant-select-selector').eq(2).click()
        })
          })
            cy.get('.ant-col > .ant-btn > span').should('be.visible').click()
            cy.get('.ant-modal-body > :nth-child(1) > .ant-col > .ant-typography').should('be.visible').should('contain.text','Payment Confirmation')
            cy.get('.ant-row-center.m-t-20 > .ant-col > .ant-space > :nth-child(2) > .ant-btn').should('be.visible').click() // pay recipient
            cy.get('.ant-modal-body > :nth-child(1) > .ant-col').should('be.visible').should('contain.text',' Payment Booked - ')
            newPayment.validateYapilyFlow()
            newPayment.cancelEasyTransfer()
    })
    it('TC_NP_023 - Add 1 recipient(individual) from the "Add Recipient" page with country = India and currency = INR. After adding, make a new payment to the recipient using GBP and easy transfer.', function(){
        //easy transfer
        newRecipient.goToPaymentsDashborad()
        newRecipient.gotoRecipientList()
        let email = batchPayments.generateRandomString(5)+ '@yopmail.com'
        batchPayments.addRecipient('INDIA{downarrow}{enter}' ,'INR{enter}' ,email)
        newRecipient.addIndiaBankDetail()
        const lName = batchPayments.generateRandomString(6)
        batchPayments.individualRecipient('INDIVIDUAL AED PF',lName,'INDIA{downarrow}{enter}')
        batchPayments.paymentPurpose()
        cy.get('.ant-select-selector').eq(3).click()
        cy.get('.ant-select-dropdown').eq(3).find('.ant-select-item-option-content').then(Element=>{
            let purposeList = Element.text()
            cy.log(purposeList)
            cy.wrap(purposeList).as('purposeList')
        })
        newRecipient.saveRecipient()
        newPayment.checkSettelment('be.enabled','be.disabled')
        newPayment.proceedflow('{downarrow}{enter}','GBP')
        let amount = '125'
        newPayment.addrecipientDetail(amount, email)
         //Validate Purpose on batch payment
        cy.get('.ant-select-selector').eq(2).click()
        cy.get('.ant-select-dropdown').eq(1).find('.ant-select-item-option-content').then(Element=>{
            let list = Element.text()
            cy.log(list)
            cy.get('@purposeList').then(purposeList=>{
            expect(list).to.eq(purposeList)
            cy.get('.ant-select-selector').eq(2).click()
        })
          })
          newPayment.iNRDetails()
            cy.get('.ant-col > .ant-btn > span').should('be.visible').click()
            cy.get('.ant-modal-body > :nth-child(1) > .ant-col > .ant-typography').should('be.visible').should('contain.text','Payment Confirmation')
            cy.get('.ant-row-center.m-t-20 > .ant-col > .ant-space > :nth-child(2) > .ant-btn').should('be.visible').click() // pay recipient
            cy.get('.ant-modal-body > :nth-child(1) > .ant-col').should('be.visible').should('contain.text',' Payment Booked - ')
            newPayment.validateYapilyFlow()
            newPayment.cancelEasyTransfer()
    })
    it('TC_NP_024 -Add 1 recipient(individual) from the "Add Recipient" page with country = CHINA and currency = CNY. After adding, make a single payment to the recipient using GBP and easy transfer.', function(){
        newRecipient.goToPaymentsDashborad()
        newRecipient.gotoRecipientList()
        let email = batchPayments.generateRandomString(5)+ '@yopmail.com'
        batchPayments.addRecipient('CHINA{enter}' ,'CNY{enter}' ,email)
        newRecipient.addBankDetailsChina('AYCLCNBY','55555555','501100000011')
        const bName = batchPayments.generateRandomString(6)
        batchPayments.addBusinessRecipient('INDIVIDUAL PF'+' '+bName,'CHINA{enter}')
        batchPayments.paymentPurposeChina()
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
         //Validate Purpose on batch payment
        cy.get('.ant-select-selector').eq(2).click()
        cy.get('.ant-select-dropdown').eq(1).find('.ant-select-item-option-content').then(Element=>{
            let list = Element.text()
            cy.log(list)
            cy.get('@purposeList').then(purposeList=>{
            expect(list).to.eq(purposeList)
            cy.get('.ant-select-selector').eq(2).click()
        })
          })
            cy.get('.ant-col > .ant-btn > span').should('be.visible').click()
            cy.get('.ant-modal-body > :nth-child(1) > .ant-col > .ant-typography').should('be.visible').should('contain.text','Payment Confirmation')
            cy.get('.ant-row-center.m-t-20 > .ant-col > .ant-space > :nth-child(2) > .ant-btn').should('be.visible').click() // pay recipient
            cy.get('.ant-modal-body > :nth-child(1) > .ant-col').should('be.visible').should('contain.text',' Payment Booked - ')
            newPayment.validateYapilyFlow()
            newPayment.cancelEasyTransfer()
    })
    it('TC_NP_025 - Add 1 recipient(individual) from the "Add Recipient" page with country = United Kingdom and currency = EUR. After adding, make a single payment to the recipient using GBP and easy transfer.', function(){
        newRecipient.goToPaymentsDashborad()
        newRecipient.gotoRecipientList()
        let email = batchPayments.generateRandomString(5)+ '@yopmail.com'
        batchPayments.addRecipient('United Kingdom{enter}' ,'EUR{enter}' ,email)
        newRecipient.addBankDetails('GB73BARC20039538243547','AFFLGB22')
        const lName = batchPayments.generateRandomString(6)
        batchPayments.individualRecipient('INDIVIDUAL EUR PF',lName,'United Kingdom{enter}')
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
            cy.get('.ant-col > .ant-btn > span').should('be.visible').click()
            cy.get('.ant-modal-body > :nth-child(1) > .ant-col > .ant-typography').should('be.visible').should('contain.text','Payment Confirmation')
            cy.get('.ant-row-center.m-t-20 > .ant-col > .ant-space > :nth-child(2) > .ant-btn').should('be.visible').click() // pay recipient
            cy.get('.ant-modal-body > :nth-child(1) > .ant-col').should('be.visible').should('contain.text',' Payment Booked - ')
            newPayment.validateYapilyFlow()
            newPayment.cancelEasyTransfer()
    })
    it('TC_NP_026 - Add 1 recipient(individual) from the "Add Recipient" page with country = United Kingdom and currency = GBP. After adding, make a single payment to the recipient using EUR and easy trasfer', function(){
        newRecipient.goToPaymentsDashborad()
        newRecipient.gotoRecipientList()
        let email = batchPayments.generateRandomString(5)+ '@yopmail.com'
        batchPayments.addRecipient('United Kingdom{enter}' ,'GBP{enter}' ,email)
        newRecipient.addBankDetails('GB73BARC20039538243547','AFFLGB22')
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
        newPayment.checkSettelment('be.disabled','be.enabled')
        newPayment.proceedflow('{enter}','EUR')
        let amount = '130'
        newPayment.addrecipientDetail(amount, email)
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
            cy.get('.ant-col > .ant-btn > span').should('be.visible').click()
            cy.get('.ant-modal-body > :nth-child(1) > .ant-col > .ant-typography').should('be.visible').should('contain.text','Payment Confirmation')
            cy.get('.ant-row-center.m-t-20 > .ant-col > .ant-space > :nth-child(2) > .ant-btn').should('be.visible').click() // pay recipient
            cy.get('.ant-modal-body > :nth-child(1) > .ant-col').should('be.visible').should('contain.text',' Payment Booked - ')
            newPayment.validateYapilyFlow()
    })

})