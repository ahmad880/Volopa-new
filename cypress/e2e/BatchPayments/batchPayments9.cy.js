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
        cy.visit('https://webapp08.volopa-dev.com/')
        paymentspage.clearCache()
        cy.viewport(1440,1000)
    })
        //United State with USD
    //push fund
    it('TC_BP_091 - Add 2 recipients(individual) from the "Add Recipient" page with country = UNITED STATES and currency = USD. After adding, make a batch payment to these recipients using GBP and push funds.', function(){
        signin.Login(userName, password)
        newRecipient.goToPaymentsDashborad()
        newRecipient.gotoRecipientList()
        let email = batchPayments.generateRandomString(5)+ '@yopmail.com'
        batchPayments.addRecipient('UNITED STATES{enter}' ,'USD{enter}' ,email)
        newRecipient.addBankDetailsWithAccNo('USBKUS44','011401533')
        cy.get('#aba').type('026009593')
        const lName = batchPayments.generateRandomString(6)
        batchPayments.individualRecipient('UNITED STATES USD PF',lName,'UNITED STATES{enter}')
        newRecipient.postCodeState()
        batchPayments.paymentPurposeGBPEUR()
        cy.get('.ant-select-selector').eq(3).click()
        cy.get('.ant-select-dropdown').eq(3).find('.ant-select-item-option-content').then(Element=>{
            let purposeList = Element.text()
            cy.log(purposeList)
            cy.wrap(purposeList).as('purposeList')
        })
        newRecipient.saveRecipient()
        //newRecipient.checkSettelment('be.disabled','be.enabled')
        newRecipient.gotoRecipientList()
        let email1 = batchPayments.generateRandomString(5)+ '@yopmail.com'
        batchPayments.addRecipient('UNITED STATES{enter}' ,'USD{enter}' ,email1)
        newRecipient.addBankDetailsWithAccNo('MMMCUS44','55555555')
        cy.get('#aba').type('026009593')
        const lName1 = batchPayments.generateRandomString(6)
        batchPayments.individualRecipient('UNITED STATES USD PF',lName1,'UNITED STATES{enter}')
        newRecipient.postCodeState()
        batchPayments.paymentPurpose1GBPEUR()
        cy.get('.ant-select-selector').eq(3).click()
        cy.get('.ant-select-dropdown').eq(3).find('.ant-select-item-option-content').then(Element=>{
            let purposeList1 = Element.text()
            cy.log(purposeList1)
            cy.wrap(purposeList1).as('purposeList1')
        })
        newRecipient.saveRecipient()
        //newRecipient.checkSettelment('be.disabled','be.enabled')
        cy.reload()
        batchPayments.goToBatchPaymentPage()
        batchPayments.goToPayMultipleRecipient()
        let name= 'UNITED STATES USD PF'+' '+ lName+'{enter}'
        batchPayments.validateSearchBar(name)
        cy.get(5000)
        let name1 = 'UNITED STATES USD PF'+' ' + lName1+'{enter}'
        batchPayments.validateSearchBar(name1)
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
            cy.wait(1000)
            cy.get('.ant-select-selector').eq(6).click()
            cy.get('.ant-select-dropdown').eq(2).find('.ant-select-item-option-content').then(Element=>{
                let list = Element.text()
                cy.log(list)
                cy.get('@purposeList1').then(purposeList1=>{
                    expect(list).to.eq(purposeList1)
                    cy.get('.ant-select-selector').eq(6).click()
                })
            })
         let amount = '250'
         batchPayments.addrecipientDetailEUR(amount, email)
         batchPayments.checkSettelments1('be.enabled','be.enabled')
         cy.get('[class="ant-btn ant-btn-primary ant-btn-background-ghost"]').eq(0).should('be.visible').click()
        let amount1= 260
        batchPayments.addrecipientDetail1EUR(amount1, email1)
        batchPayments.checkSettelments2('be.enabled','be.enabled')
        batchPayments.proceedflow('GBP','GBP','Push Fund','Push Fund')
        batchPayments.validateproceedflow(amount,amount1)
    })
    it('TC_BP_092 - Add 2 recipients(Business) from the "Add Recipient" page with country = UNITED STATES and currency = USD. After adding, make a batch payment to these recipients using GBP and push funds.', function(){
        signin.Login(userName, password)
        newRecipient.goToPaymentsDashborad()
        newRecipient.gotoRecipientList()
        let email = batchPayments.generateRandomString(5)+ '@yopmail.com'
        batchPayments.addRecipient('UNITED STATES{enter}' ,'USD{enter}' ,email)
        newRecipient.addBankDetailsWithAccNo('USBKUS44','011401533')
        cy.get('#aba').type('026009593')
        cy.get('.ant-space > :nth-child(2) > .ant-card > .ant-card-body').should('be.visible').click()
        const bName = batchPayments.generateRandomString(6)
        batchPayments.addBusinessRecipient('BUSINESS UNITED STATES USD'+' '+bName,'UNITED STATES{enter}')
        newRecipient.postCodeState()
        batchPayments.paymentPurposeGBPEUR()
        cy.get('.ant-select-selector').eq(3).click()
        cy.get('.ant-select-dropdown').eq(3).find('.ant-select-item-option-content').then(Element=>{
            let purposeList = Element.text()
            cy.log(purposeList)
            cy.wrap(purposeList).as('purposeList')
        })
        newRecipient.saveRecipient()
        //newRecipient.checkSettelment('be.disabled','be.enabled')
        newRecipient.gotoRecipientList()
        let email1 = batchPayments.generateRandomString(5)+ '@yopmail.com'
        batchPayments.addRecipient('UNITED STATES{enter}' ,'USD{enter}' ,email1)
        newRecipient.addBankDetailsWithAccNo('MMMCUS44','55555555')
        cy.get('#aba').type('026009593')
        cy.get('.ant-space > :nth-child(2) > .ant-card > .ant-card-body').should('be.visible').click()
        const bName1 = batchPayments.generateRandomString(6)
        batchPayments.addBusinessRecipient('BUSINESS UNITED STATES USD'+ ' '+bName1,'UNITED STATES{enter}')
        newRecipient.postCodeState()
        batchPayments.paymentPurpose1GBPEUR()
        cy.get('.ant-select-selector').eq(3).click()
        cy.get('.ant-select-dropdown').eq(3).find('.ant-select-item-option-content').then(Element=>{
            let purposeList1 = Element.text()
            cy.log(purposeList1)
            cy.wrap(purposeList1).as('purposeList1')
        })
        newRecipient.saveRecipient()
        //newRecipient.checkSettelment('be.disabled','be.enabled')
        cy.reload()
        batchPayments.goToBatchPaymentPage()
        batchPayments.goToPayMultipleRecipient()
        let name= 'BUSINESS UNITED STATES USD'+' '+ bName+'{enter}'
        batchPayments.validateSearchBar(name)
        cy.wait(5000)
        let name1 = 'BUSINESS UNITED STATES USD'+' ' + bName1+'{enter}'
        batchPayments.validateSearchBar(name1)
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
            cy.wait(1000)
            cy.get('.ant-select-selector').eq(6).click()
            cy.get('.ant-select-dropdown').eq(2).find('.ant-select-item-option-content').then(Element=>{
                let list = Element.text()
                cy.log(list)
                cy.get('@purposeList1').then(purposeList1=>{
                    expect(list).to.eq(purposeList1)
                    cy.get('.ant-select-selector').eq(6).click()
                })
            })
        let amount = '250'
        batchPayments.addrecipientDetailEUR(amount, email)
        batchPayments.checkSettelments1('be.enabled','be.enabled')
        cy.get('[class="ant-btn ant-btn-primary ant-btn-background-ghost"]').eq(0).should('be.visible').click()
        let amount1= 260
        batchPayments.addrecipientDetail1EUR(amount1, email1)
        batchPayments.checkSettelments2('be.enabled','be.enabled')
        batchPayments.proceedflow('GBP','GBP','Push Fund','Push Fund')
        batchPayments.validateproceedflow(amount,amount1)
    })
    //Easy Transfer
    it('TC_BP_093 - Add 2 recipients(individual) from the "Add Recipient" page with country = UNITED STATES and currency = USD. After adding, make a batch payment to these recipients using GBP and easy transfer.', function(){
        signin.Login(userName, password)
        newRecipient.goToPaymentsDashborad()
        newRecipient.gotoRecipientList()
        let email = batchPayments.generateRandomString(5)+ '@yopmail.com'
        batchPayments.addRecipient('UNITED STATES{enter}' ,'USD{enter}' ,email)
        newRecipient.addBankDetailsWithAccNo('MMMCUS44','55555555')
        cy.get('#aba').type('026009593')
        const lName = batchPayments.generateRandomString(6)
        batchPayments.individualRecipient('UNITED STATES USD ET',lName,'UNITED STATES{enter}')
        newRecipient.postCodeState()
        batchPayments.paymentPurposeGBPEUR()
        cy.get('.ant-select-selector').eq(3).click()
        cy.get('.ant-select-dropdown').eq(3).find('.ant-select-item-option-content').then(Element=>{
            let purposeList = Element.text()
            cy.log(purposeList)
            cy.wrap(purposeList).as('purposeList')
        })
        newRecipient.saveRecipient()
       // newRecipient.checkSettelment('be.disabled','be.enabled')
        newRecipient.gotoRecipientList()
        let email1 = batchPayments.generateRandomString(5)+ '@yopmail.com'
        batchPayments.addRecipient('UNITED STATES{enter}' ,'USD{enter}' ,email1)
        newRecipient.addBankDetailsWithAccNo('MMMCUS44','55555555')
        cy.get('#aba').type('026009593')
        const lName1 = batchPayments.generateRandomString(6)
        batchPayments.individualRecipient('UNITED STATES USD ET',lName1,'UNITED STATES{enter}')
        newRecipient.postCodeState()
        batchPayments.paymentPurpose1GBPEUR()
        cy.get('.ant-select-selector').eq(3).click()
        cy.get('.ant-select-dropdown').eq(3).find('.ant-select-item-option-content').then(Element=>{
            let purposeList1 = Element.text()
            cy.log(purposeList1)
            cy.wrap(purposeList1).as('purposeList1')
        })
        newRecipient.saveRecipient()
        //newRecipient.checkSettelment('be.disabled','be.enabled')
        cy.reload()
        batchPayments.goToBatchPaymentPage()
        batchPayments.goToPayMultipleRecipient()
        let name= 'UNITED STATES USD ET'+' '+ lName+'{enter}'
        batchPayments.validateSearchBar(name)
        cy.wait(5000)
        let name1 = 'UNITED STATES USD ET'+' ' + lName1+'{enter}'
        batchPayments.validateSearchBar(name1)
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
            cy.wait(1000)
            cy.get('.ant-select-selector').eq(6).click()
            cy.get('.ant-select-dropdown').eq(2).find('.ant-select-item-option-content').then(Element=>{
                let list = Element.text()
                cy.log(list)
                cy.get('@purposeList1').then(purposeList1=>{
                    expect(list).to.eq(purposeList1)
                    cy.get('.ant-select-selector').eq(6).click()
                })
            })
        let amount = '250'
        batchPayments.addrecipientDetailEUR(amount, email)
        batchPayments.checkSettelments1('be.enabled','be.enabled')
        cy.get('[class="ant-btn ant-btn-primary ant-btn-background-ghost"]').eq(0).should('be.visible').click()
        let amount1= 260
        batchPayments.addrecipientDetail1EUR(amount1, email1)
        batchPayments.checkSettelments2('be.enabled','be.enabled')
        batchPayments.proceedflow('GBP','GBP','Easy Transfer','Easy Transfer')
        batchPayments.validateproceedflow(amount,amount1)
        batchPayments.validateYapilyFlow()
    })
    it('TC_BP_094 - Add 2 recipients(Business) from the "Add Recipient" page with country = UNITED STATES and currency = USD. After adding, make a batch payment to these recipients using GBP and easy transfer.', function(){
        signin.Login(userName, password)
        newRecipient.goToPaymentsDashborad()
        newRecipient.gotoRecipientList()
        let email = batchPayments.generateRandomString(5)+ '@yopmail.com'
        batchPayments.addRecipient('UNITED STATES{enter}' ,'USD{enter}' ,email)
        newRecipient.addBankDetailsWithAccNo('MMMCUS44','55555555')
        cy.get('#aba').type('026009593')
        cy.get('.ant-space > :nth-child(2) > .ant-card > .ant-card-body').should('be.visible').click()
        const bName = batchPayments.generateRandomString(6)
        batchPayments.addBusinessRecipient('BUSINESS UNITED STATES USD'+' '+bName,'UNITED STATES{enter}')
        newRecipient.postCodeState()
        batchPayments.paymentPurposeGBPEUR()
        cy.get('.ant-select-selector').eq(3).click()
        cy.get('.ant-select-dropdown').eq(3).find('.ant-select-item-option-content').then(Element=>{
            let purposeList = Element.text()
            cy.log(purposeList)
            cy.wrap(purposeList).as('purposeList')
        })
        newRecipient.saveRecipient()
       // newRecipient.checkSettelment('be.disabled','be.enabled')
        newRecipient.gotoRecipientList()
        let email1 = batchPayments.generateRandomString(5)+ '@yopmail.com'
        batchPayments.addRecipient('UNITED STATES{enter}' ,'USD{enter}' ,email1)
        newRecipient.addBankDetailsWithAccNo('MMMCUS44','55555555')
        cy.get('#aba').type('026009593')
        cy.get('.ant-space > :nth-child(2) > .ant-card > .ant-card-body').should('be.visible').click()
        const bName1 = batchPayments.generateRandomString(6)
        batchPayments.addBusinessRecipient('BUSINESS UNITED STATES USD'+ ' '+bName1,'UNITED STATES{enter}')
        newRecipient.postCodeState()
        batchPayments.paymentPurpose1GBPEUR()
        cy.get('.ant-select-selector').eq(3).click()
        cy.get('.ant-select-dropdown').eq(3).find('.ant-select-item-option-content').then(Element=>{
            let purposeList1 = Element.text()
            cy.log(purposeList1)
            cy.wrap(purposeList1).as('purposeList1')
        })
        newRecipient.saveRecipient()
        //newRecipient.checkSettelment('be.disabled','be.enabled')
        cy.reload()
        batchPayments.goToBatchPaymentPage()
        batchPayments.goToPayMultipleRecipient()
        let name= 'BUSINESS UNITED STATES USD'+' '+ bName+'{enter}'
        batchPayments.validateSearchBar(name)
        cy.wait(5000)
        let name1 = 'BUSINESS UNITED STATES USD'+' ' + bName1+'{enter}'
        batchPayments.validateSearchBar(name1)
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
            cy.wait(1000)
            cy.get('.ant-select-selector').eq(6).click()
            cy.get('.ant-select-dropdown').eq(2).find('.ant-select-item-option-content').then(Element=>{
                let list = Element.text()
                cy.log(list)
                cy.get('@purposeList1').then(purposeList1=>{
                    expect(list).to.eq(purposeList1)
                    cy.get('.ant-select-selector').eq(6).click()
                })
            })
        let amount = '250'
        batchPayments.addrecipientDetailEUR(amount, email)
        batchPayments.checkSettelments1('be.enabled','be.enabled')
        cy.get('[class="ant-btn ant-btn-primary ant-btn-background-ghost"]').eq(0).should('be.visible').click()
        let amount1= 260
        batchPayments.addrecipientDetail1EUR(amount1, email1)
        batchPayments.checkSettelments2('be.enabled','be.enabled')
        batchPayments.proceedflow('GBP','GBP','Easy Transfer','Easy Transfer')
        batchPayments.validateproceedflow(amount,amount1)
        batchPayments.validateYapilyFlow()
    })
    //UNITED KINGDOM with USD
    //push fund
    it.only('TC_BP_095 - Add 2 recipients(individual) from the "Add Recipient" page with country = UNITED KINGDOM and currency = USD. After adding, make a batch payment to these recipients using GBP and push funds.', function(){
        signin.Login(userName, password)
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
        //newRecipient.checkSettelment('be.enabled','be.disabled')
        newRecipient.gotoRecipientList()
        let email1 = batchPayments.generateRandomString(5)+ '@yopmail.com'
        batchPayments.addRecipient('UNITED KINGDOM{enter}' ,'USD{enter}' ,email1)
        newRecipient.addBankDetails('GB73BARC20039538243547','AFFLGB22')
        const lName1 = batchPayments.generateRandomString(6)
        batchPayments.individualRecipient('INDIVIDUAL USD PF',lName1,'UNITED KINGDOM{enter}')
        batchPayments.paymentPurpose1GBPEUR()
        cy.get('.ant-select-selector').eq(3).click()
        cy.get('.ant-select-dropdown').eq(3).find('.ant-select-item-option-content').then(Element=>{
            let purposeList1 = Element.text()
            cy.log(purposeList1)
            cy.wrap(purposeList1).as('purposeList1')
        })
        newRecipient.saveRecipient()
        //newRecipient.checkSettelment('be.enabled','be.disabled')
        cy.reload()
        batchPayments.goToBatchPaymentPage()
        batchPayments.goToPayMultipleRecipient()
        let name= 'INDIVIDUAL PF'+' '+ lName+'{enter}'
        batchPayments.validateSearchBar(name)
        cy.wait(5000)
        let name1 = 'INDIVIDUAL USD PF'+' ' + lName1+'{enter}'
        batchPayments.validateSearchBar(name1)
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
            cy.wait(1000)
            cy.get('.ant-select-selector').eq(6).click()
            cy.get('.ant-select-dropdown').eq(2).find('.ant-select-item-option-content').then(Element=>{
                let list = Element.text()
                cy.log(list)
                cy.get('@purposeList1').then(purposeList1=>{
                    expect(list).to.eq(purposeList1)
                    cy.get('.ant-select-selector').eq(6).click()       
                })
            })
        let amount = '250'
        batchPayments.addrecipientDetailEUR(amount, email)
        batchPayments.checkSettelments1('be.disabled','be.enabled')
        let amount1= 260
        batchPayments.addrecipientDetail1MXN(amount1, email1)
        batchPayments.checkSettelments2('be.disabled','be.enabled')
        batchPayments.proceedflow('GBP','GBP','Push Fund','Push Fund')
        batchPayments.validateproceedflow(amount,amount1)
    })
    it.only('TC_BP_096 - Add 2 recipients(business) from the "Add Recipient" page with country = UNITED KINGDOM and currency = USD. After adding, make a batch payment to these recipients using GBP and push funds.', function(){
        signin.Login(userName, password)
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
        //newRecipient.checkSettelment('be.enabled','be.disabled')
        newRecipient.gotoRecipientList()
        let email1 = batchPayments.generateRandomString(5)+ '@yopmail.com'
        batchPayments.addRecipient('UNITED KINGDOM{enter}' ,'USD{enter}' ,email1)
        newRecipient.addBankDetails('GB73BARC20039538243547','AFFLGB22')
        cy.get('.ant-space > :nth-child(2) > .ant-card > .ant-card-body').should('be.visible').click()
        const bName1 = batchPayments.generateRandomString(6)
        batchPayments.addBusinessRecipient('BUSINESS USD PF'+ ' '+bName1,'UNITED KINGDOM{enter}')
        batchPayments.paymentPurpose1GBPEUR()
        cy.get('.ant-select-selector').eq(3).click()
        cy.get('.ant-select-dropdown').eq(3).find('.ant-select-item-option-content').then(Element=>{
            let purposeList1 = Element.text()
            cy.log(purposeList1)
            cy.wrap(purposeList1).as('purposeList1')
        })
        newRecipient.saveRecipient()
        //newRecipient.checkSettelment('be.enabled','be.disabled')
        cy.reload()
        batchPayments.goToBatchPaymentPage()
        batchPayments.goToPayMultipleRecipient()
        let name= 'BUSINESS PF'+' '+ bName+'{enter}'
        batchPayments.validateSearchBar(name)
        cy.wait(5000)
        let name1 = 'BUSINESS USD PF'+' ' + bName1+'{enter}'
        batchPayments.validateSearchBar(name1)
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
            cy.wait(1000)
            cy.get('.ant-select-selector').eq(6).click()
            cy.get('.ant-select-dropdown').eq(2).find('.ant-select-item-option-content').then(Element=>{
                let list = Element.text()
                cy.log(list)
                cy.get('@purposeList1').then(purposeList1=>{
                    expect(list).to.eq(purposeList1)
                    cy.get('.ant-select-selector').eq(6).click()
                })
            })
        let amount = '250'
        batchPayments.addrecipientDetailEUR(amount, email)
        batchPayments.checkSettelments1('be.disabled','be.enabled')
        let amount1= 260
        batchPayments.addrecipientDetail1MXN(amount1, email1)
        batchPayments.checkSettelments2('be.disabled','be.enabled')
        batchPayments.proceedflow('GBP','GBP','Push Fund','Push Fund')
        batchPayments.validateproceedflow(amount,amount1)
    })
    //Easy Transfer
    it('TC_BP_097 - Add 2 recipients(individual) from the "Add Recipient" page with country = UNITED KINGDOM and currency = USD. After adding, make a batch payment to these recipients using GBP and easy transfer.', function(){
        signin.Login(userName, password)
        newRecipient.goToPaymentsDashborad()
        newRecipient.gotoRecipientList()
        let email = batchPayments.generateRandomString(5)+ '@yopmail.com'
        batchPayments.addRecipient('UNITED KINGDOM{enter}' ,'USD{enter}' ,email)
        newRecipient.addBankDetails('GB73BARC20039538243547','AFFLGB22')
        const lName = batchPayments.generateRandomString(6)
        batchPayments.individualRecipient('INDIVIDUAL ET',lName,'UNITED KINGDOM{enter}')
        batchPayments.paymentPurposeGBPEUR()
        cy.get('.ant-select-selector').eq(3).click()
        cy.get('.ant-select-dropdown').eq(3).find('.ant-select-item-option-content').then(Element=>{
            let purposeList = Element.text()
            cy.log(purposeList)
            cy.wrap(purposeList).as('purposeList')
        })
        newRecipient.saveRecipient()
        //newRecipient.checkSettelment('be.enabled','be.disabled')
        newRecipient.gotoRecipientList()
        let email1 = batchPayments.generateRandomString(5)+ '@yopmail.com'
        batchPayments.addRecipient('UNITED KINGDOM{enter}' ,'USD{enter}' ,email1)
        newRecipient.addBankDetails('GB73BARC20039538243547','AFFLGB22')
        const lName1 = batchPayments.generateRandomString(6)
        batchPayments.individualRecipient('INDIVIDUAL USD ET',lName1,'UNITED KINGDOM{enter}')
        batchPayments.paymentPurpose1GBPEUR()
        cy.get('.ant-select-selector').eq(3).click()
        cy.get('.ant-select-dropdown').eq(3).find('.ant-select-item-option-content').then(Element=>{
            let purposeList1 = Element.text()
            cy.log(purposeList1)
            cy.wrap(purposeList1).as('purposeList1')
        })
        newRecipient.saveRecipient()
        //newRecipient.checkSettelment('be.enabled','be.disabled')
        cy.reload()
        batchPayments.goToBatchPaymentPage()
        batchPayments.goToPayMultipleRecipient()
        let name= 'INDIVIDUAL ET'+' '+ lName+'{enter}'
        batchPayments.validateSearchBar(name)
        cy.wait(5000)
        let name1 = 'INDIVIDUAL USD ET'+' ' + lName1+'{enter}'
        batchPayments.validateSearchBar(name1)
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
            cy.wait(1000)
            cy.get('.ant-select-selector').eq(6).click()
            cy.get('.ant-select-dropdown').eq(2).find('.ant-select-item-option-content').then(Element=>{
                let list = Element.text()
                cy.log(list)
                cy.get('@purposeList1').then(purposeList1=>{
                    expect(list).to.eq(purposeList1)
                    cy.get('.ant-select-selector').eq(6).click()
                })
            })
        let amount = '250'
        batchPayments.addrecipientDetailEUR(amount, email)
        batchPayments.checkSettelments1('be.disabled','be.enabled')
        let amount1= 260
        batchPayments.addrecipientDetail1MXN(amount1, email1)
        batchPayments.checkSettelments2('be.disabled','be.enabled')
        batchPayments.proceedflow('GBP','GBP','Easy Transfer','Easy Transfer')
        batchPayments.validateproceedflow(amount,amount1)
        batchPayments.validateYapilyFlow()
    })
    it('TC_BP_098 - Add 2 recipients(business) from the "Add Recipient" page with country = UNITED KINGDOM and currency = USD. After adding, make a batch payment to these recipients using GBP and easy transfer', function(){
        signin.Login(userName, password)
        newRecipient.goToPaymentsDashborad()
        newRecipient.gotoRecipientList()
        let email = batchPayments.generateRandomString(5)+ '@yopmail.com'
        batchPayments.addRecipient('UNITED KINGDOM{enter}' ,'USD{enter}' ,email)
        newRecipient.addBankDetails('GB73BARC20039538243547','AFFLGB22')
        cy.get('.ant-space > :nth-child(2) > .ant-card > .ant-card-body').should('be.visible').click()
        const bName = batchPayments.generateRandomString(6)
        batchPayments.addBusinessRecipient('BUSINESS ET'+' '+bName,'UNITED KINGDOM{enter}')
        batchPayments.paymentPurposeGBPEUR()
        cy.get('.ant-select-selector').eq(3).click()
        cy.get('.ant-select-dropdown').eq(3).find('.ant-select-item-option-content').then(Element=>{
            let purposeList = Element.text()
            cy.log(purposeList)
            cy.wrap(purposeList).as('purposeList')
        })
        newRecipient.saveRecipient()
        //newRecipient.checkSettelment('be.enabled','be.disabled')
        newRecipient.gotoRecipientList()
        let email1 = batchPayments.generateRandomString(5)+ '@yopmail.com'
        batchPayments.addRecipient('UNITED KINGDOM{enter}' ,'USD{enter}' ,email1)
        newRecipient.addBankDetails('GB73BARC20039538243547','AFFLGB22')
        cy.get('.ant-space > :nth-child(2) > .ant-card > .ant-card-body').should('be.visible').click()
        const bName1 = batchPayments.generateRandomString(6)
        batchPayments.addBusinessRecipient('BUSINESS USD ET'+ ' '+bName1,'UNITED KINGDOM{enter}')
        batchPayments.paymentPurpose1GBPEUR()
        cy.get('.ant-select-selector').eq(3).click()
        cy.get('.ant-select-dropdown').eq(3).find('.ant-select-item-option-content').then(Element=>{
            let purposeList1 = Element.text()
            cy.log(purposeList1)
            cy.wrap(purposeList1).as('purposeList1')
        })
        newRecipient.saveRecipient()
        //newRecipient.checkSettelment('be.enabled','be.disabled')
        cy.reload()
        batchPayments.goToBatchPaymentPage()
        batchPayments.goToPayMultipleRecipient()
        let name= 'BUSINESS ET'+' '+ bName+'{enter}'
        batchPayments.validateSearchBar(name)
        cy.wait(5000)
        let name1 = 'BUSINESS USD ET'+' ' + bName1+'{enter}'
        batchPayments.validateSearchBar(name1)
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
            cy.wait(1000)
            cy.get('.ant-select-selector').eq(6).click()
            cy.get('.ant-select-dropdown').eq(2).find('.ant-select-item-option-content').then(Element=>{
                let list = Element.text()
                cy.log(list)
                cy.get('@purposeList1').then(purposeList1=>{
                    expect(list).to.eq(purposeList1)
                    cy.get('.ant-select-selector').eq(6).click()
                })
            })
        let amount = '250'
        batchPayments.addrecipientDetailEUR(amount, email)
        batchPayments.checkSettelments1('be.disabled','be.enabled')
        let amount1= 260
        batchPayments.addrecipientDetail1MXN(amount1, email1)
        batchPayments.checkSettelments2('be.disabled','be.enabled')
        batchPayments.proceedflow('GBP','GBP','Easy Transfer','Easy Transfer')
        batchPayments.validateproceedflow(amount,amount1)
        batchPayments.validateYapilyFlow()
    })

})