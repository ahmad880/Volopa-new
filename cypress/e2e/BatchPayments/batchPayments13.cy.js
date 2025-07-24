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
    let userName = 'uk_test_1@volopa.com'
    let password = 'testTest1'
    beforeEach(() => {
        cy.visit('https://webapp02.volopa-dev.com/')
        paymentspage.clearCache()
        cy.viewport(1440,1000)
    })
        //HONG KONG with USD
    //push fund
    it.only('TC_BP_123 - Add 2 recipients(individual) from the "Add Recipient" page with country = HONG KONG and currency = USD. After adding, make a batch payment to these recipients using GBP and push funds.', function(){
        signin.Login(userName, password)
        newRecipient.goToPaymentsDashborad()
        newRecipient.gotoRecipientList()
        let email = batchPayments.generateRandomString(5)+ '@yopmail.com'
        batchPayments.addRecipient('HONG KONG{enter}' ,'USD{enter}' ,email)
        newRecipient.addBankDetailsWithAccNo('HSBCHKHHXXX','55555555')
        const lName = batchPayments.generateRandomString(6)
        batchPayments.individualRecipient('HONG KONG PF',lName,'HONG KONG{enter}')
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
        batchPayments.addRecipient('HONG KONG{enter}' ,'USD{enter}' ,email1)
        newRecipient.addBankDetailsWithAccNo('HSBCHKHHXXX','55555555')
        const lName1 = batchPayments.generateRandomString(6)
        batchPayments.individualRecipient('HONG KONG USD PF',lName1,'HONG KONG{enter}')
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
        let name= 'HONG KONG PF'+' '+ lName+'{enter}'
        batchPayments.validateSearchBar(name)
        cy.wait(5000)
        let name1 = 'HONG KONG USD PF'+' ' + lName1+'{enter}'
        batchPayments.validateSearchBar(name1)
            //Validate Purpose on batch payment
            cy.get('.ant-select-selector').eq(1).click()
            cy.get('.ant-select-dropdown').eq(1).find('.ant-select-item-option-content').then(Element=>{
                let list = Element.text()
                cy.log(list)
                cy.get('@purposeList').then(purposeList=>{
                    expect(list).to.eq(purposeList)
                    cy.get('.ant-select-selector').eq(1).click()
                })
            })
            cy.wait(1000)
            cy.get('.ant-select-selector').eq(3).click()
            cy.get('.ant-select-dropdown').eq(2).find('.ant-select-item-option-content').then(Element=>{
                let list = Element.text()
                cy.log(list)
                cy.get('@purposeList1').then(purposeList1=>{
                    expect(list).to.eq(purposeList1)
                    cy.get('.ant-select-selector').eq(3).click()
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
    it.only('TC_BP_124 - Add 2 recipients(business) from the "Add Recipient" page with country = HONG KONG and currency = USD. After adding, make a batch payment to these recipients using GBP and push funds.', function(){
        signin.Login(userName, password)
        newRecipient.goToPaymentsDashborad()
        newRecipient.gotoRecipientList()
        let email = batchPayments.generateRandomString(5)+ '@yopmail.com'
        batchPayments.addRecipient('HONG KONG{enter}' ,'USD{enter}' ,email)
        newRecipient.addBankDetailsWithAccNo('HSBCHKHHXXX','55555555')
        cy.get('.ant-space > :nth-child(2) > .ant-card > .ant-card-body').should('be.visible').click()
        const bName = batchPayments.generateRandomString(6)
        batchPayments.addBusinessRecipient('BUSINESS USD'+' '+bName,'HONG KONG{enter}')
        
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
        batchPayments.addRecipient('HONG KONG{enter}' ,'USD{enter}' ,email1)
        newRecipient.addBankDetailsWithAccNo('HSBCHKHHXXX','55555555')
        cy.get('.ant-space > :nth-child(2) > .ant-card > .ant-card-body').should('be.visible').click()
        const bName1 = batchPayments.generateRandomString(6)
        batchPayments.addBusinessRecipient('BUSINESS HONG KONG USD'+ ' '+bName1,'HONG KONG{enter}')
       
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
        let name= 'BUSINESS USD'+' '+ bName+'{enter}'
        batchPayments.validateSearchBar(name)
        cy.wait(5000)
        let name1 = 'BUSINESS HONG KONG USD'+' ' + bName1+'{enter}'
        batchPayments.validateSearchBar(name1)
            //Validate Purpose on batch payment
            cy.get('.ant-select-selector').eq(1).click()
            cy.get('.ant-select-dropdown').eq(1).find('.ant-select-item-option-content').then(Element=>{
                let list = Element.text()
                cy.log(list)
                cy.get('@purposeList').then(purposeList=>{
                    expect(list).to.eq(purposeList)
                    cy.get('.ant-select-selector').eq(1).click()
                })
            })
            cy.wait(1000)
            cy.get('.ant-select-selector').eq(3).click()
            cy.get('.ant-select-dropdown').eq(2).find('.ant-select-item-option-content').then(Element=>{
                let list = Element.text()
                cy.log(list)
                cy.get('@purposeList1').then(purposeList1=>{
                    expect(list).to.eq(purposeList1)
                    cy.get('.ant-select-selector').eq(3).click()
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
    //easy transfer
    it('TC_BP_125 - Add 2 recipients(individual) from the "Add Recipient" page with country = HONG KONG and currency = USD. After adding, make a batch payment to these recipients using GBP and easy transfer', function(){
        signin.Login(userName, password)
        newRecipient.goToPaymentsDashborad()
        newRecipient.gotoRecipientList()
        let email = batchPayments.generateRandomString(5)+ '@yopmail.com'
        batchPayments.addRecipient('HONG KONG{enter}' ,'USD{enter}' ,email)
        newRecipient.addBankDetailsWithAccNo('HSBCHKHHXXX','55555555')
        const lName = batchPayments.generateRandomString(6)
        batchPayments.individualRecipient('HONG KONG ET',lName,'HONG KONG{enter}')
        
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
        batchPayments.addRecipient('HONG KONG{enter}' ,'USD{enter}' ,email1)
        newRecipient.addBankDetailsWithAccNo('HSBCHKHHXXX','55555555')
        const lName1 = batchPayments.generateRandomString(6)
        batchPayments.individualRecipient('HONG KONG USD ET',lName1,'HONG KONG{enter}')
       
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
        let name= 'HONG KONG ET'+' '+ lName+'{enter}'
        batchPayments.validateSearchBar(name)
        cy.wait(5000)
        let name1 = 'HONG KONG USD ET'+' ' + lName1+'{enter}'
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
    it('TC_BP_126 - Add 2 recipients(business) from the "Add Recipient" page with country = HONG KONG and currency = USD. After adding, make a batch payment to these recipients using GBP and easy transfer', function(){
        signin.Login(userName, password)
        newRecipient.goToPaymentsDashborad()
        newRecipient.gotoRecipientList()
        let email = batchPayments.generateRandomString(5)+ '@yopmail.com'
        batchPayments.addRecipient('HONG KONG{enter}' ,'USD{enter}' ,email)
        newRecipient.addBankDetailsWithAccNo('HSBCHKHHXXX','55555555')
        cy.get('.ant-space > :nth-child(2) > .ant-card > .ant-card-body').should('be.visible').click()
        const bName = batchPayments.generateRandomString(6)
        batchPayments.addBusinessRecipient('BUSINESS USD'+' '+bName,'HONG KONG{enter}')
        
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
        batchPayments.addRecipient('HONG KONG{enter}' ,'USD{enter}' ,email1)
        newRecipient.addBankDetailsWithAccNo('HSBCHKHHXXX','55555555')
        cy.get('.ant-space > :nth-child(2) > .ant-card > .ant-card-body').should('be.visible').click()
        const bName1 = batchPayments.generateRandomString(6)
        batchPayments.addBusinessRecipient('BUSINESS HONG KONG USD'+ ' '+bName1,'HONG KONG{enter}')
       
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
        let name= 'BUSINESS USD'+' '+ bName+'{enter}'
        batchPayments.validateSearchBar(name)
        cy.wait(5000)
        let name1 = 'BUSINESS HONG KONG USD'+' ' + bName1+'{enter}'
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
    //MEXICO with USD
    //individual
    it.only('TC_BP_127 - Add 2 recipients(individual) from the "Add Recipient" page with country = MEXICO and currency = USD. After adding, make a batch payment to these recipients using GBP and push funds.', function(){
        signin.Login(userName, password)
        newRecipient.goToPaymentsDashborad()
        newRecipient.gotoRecipientList()
        let email = batchPayments.generateRandomString(5)+ '@yopmail.com'
        batchPayments.addRecipient('MEXICO{enter}' ,'USD{enter}' ,email)
        newRecipient.addBankDetailsWithClabe('AFIRMXMT','002010077777777771')
        const lName = batchPayments.generateRandomString(6)
        batchPayments.individualRecipient('MEXICO PF',lName,'MEXICO{enter}')
        newRecipient.postCodeState()
        batchPayments.paymentPurposeGBPEUR()
        cy.get('.ant-select-selector').eq(4).click()
        cy.get('.ant-select-dropdown').eq(4).find('.ant-select-item-option-content').then(Element=>{
            let purposeList = Element.text()
            cy.log(purposeList)
            cy.wrap(purposeList).as('purposeList')
        })
        newRecipient.saveRecipient()
        //newRecipient.checkSettelment('be.disabled','be.enabled')
        newRecipient.gotoRecipientList()
        let email1 = batchPayments.generateRandomString(5)+ '@yopmail.com'
        batchPayments.addRecipient('MEXICO{enter}' ,'USD{enter}' ,email1)
        newRecipient.addBankDetailsWithClabe('AFIRMXMT','002010077777777771')
        const lName1 = batchPayments.generateRandomString(6)
        batchPayments.individualRecipient('MEXICO USD PF',lName1,'MEXICO{enter}')
        newRecipient.postCodeState()
        batchPayments.paymentPurpose1GBPEUR()
        cy.get('.ant-select-selector').eq(4).click()
        cy.get('.ant-select-dropdown').eq(4).find('.ant-select-item-option-content').then(Element=>{
            let purposeList1 = Element.text()
            cy.log(purposeList1)
            cy.wrap(purposeList1).as('purposeList1')
        })
        newRecipient.saveRecipient()
        //newRecipient.checkSettelment('be.disabled','be.enabled')
        cy.reload()
        batchPayments.goToBatchPaymentPage()
        batchPayments.goToPayMultipleRecipient()
        let name= 'MEXICO PF'+' '+ lName+'{enter}'
        batchPayments.validateSearchBar(name)
        cy.wait(5000)
        let name1 = 'MEXICO USD PF'+' ' + lName1+'{enter}'
        batchPayments.validateSearchBar(name1)
            //Validate Purpose on batch payment
            cy.get('.ant-select-selector').eq(1).click()
            cy.get('.ant-select-dropdown').eq(1).find('.ant-select-item-option-content').then(Element=>{
                let list = Element.text()
                cy.log(list)
                cy.get('@purposeList').then(purposeList=>{
                    expect(list).to.eq(purposeList)
                    cy.get('.ant-select-selector').eq(1).click()
                })
            })
            cy.wait(1000)
            cy.get('.ant-select-selector').eq(3).click()
            cy.get('.ant-select-dropdown').eq(2).find('.ant-select-item-option-content').then(Element=>{
                let list = Element.text()
                cy.log(list)
                cy.get('@purposeList1').then(purposeList1=>{
                    expect(list).to.eq(purposeList1)
                    cy.get('.ant-select-selector').eq(3).click()
                })
            })
        let amount = '250'
        batchPayments.addrecipientDetailEUR(amount, email)
        batchPayments.checkSettelments1('be.disabled','be.enabled')
        let amount1= 260
        batchPayments.addrecipientDetail1MXN(amount1, email1)
        batchPayments.checkSettelments1('be.disabled','be.enabled')
        batchPayments.proceedflow('GBP','GBP','Push Fund','Push Fund')
        batchPayments.validateproceedflow(amount,amount1)
    })
    it('TC_BP_128 - Add 2 recipients(individual) from the "Add Recipient" page with country = MEXICO and currency = USD. After adding, make a batch payment to these recipients using GBP and easy transfer', function(){
        signin.Login(userName, password)
        newRecipient.goToPaymentsDashborad()
        newRecipient.gotoRecipientList()
        let email = batchPayments.generateRandomString(5)+ '@yopmail.com'
        batchPayments.addRecipient('MEXICO{enter}' ,'USD{enter}' ,email)
        newRecipient.addBankDetailsWithClabe('AFIRMXMT','002010077777777771')
        const lName = batchPayments.generateRandomString(6)
        batchPayments.individualRecipient('MEXICO ET',lName,'MEXICO{enter}')
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
        batchPayments.addRecipient('MEXICO{enter}' ,'USD{enter}' ,email1)
        newRecipient.addBankDetailsWithClabe('AFIRMXMT','002010077777777771')
        const lName1 = batchPayments.generateRandomString(6)
        batchPayments.individualRecipient('MEXICO USD ET',lName1,'MEXICO{enter}')
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
        let name= 'MEXICO ET'+' '+ lName+'{enter}'
        batchPayments.validateSearchBar(name)
        cy.wait(5000)
        let name1 = 'MEXICO USD ET'+' ' + lName1+'{enter}'
        batchPayments.validateSearchBar(name1)
            //Validate Purpose on batch payment
            cy.get('.ant-select-selector').eq(1).click()
            cy.get('.ant-select-dropdown').eq(1).find('.ant-select-item-option-content').then(Element=>{
                let list = Element.text()
                cy.log(list)
                cy.get('@purposeList').then(purposeList=>{
                    expect(list).to.eq(purposeList)
                    cy.get('.ant-select-selector').eq(1).click()
                })
            })
            cy.wait(1000)
            cy.get('.ant-select-selector').eq(3).click()
            cy.get('.ant-select-dropdown').eq(2).find('.ant-select-item-option-content').then(Element=>{
                let list = Element.text()
                cy.log(list)
                cy.get('@purposeList1').then(purposeList1=>{
                    expect(list).to.eq(purposeList1)
                    cy.get('.ant-select-selector').eq(3).click()
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
    //business
    it('TC_BP_129 - Add 2 recipients(business) from the "Add Recipient" page with country = MEXICO and currency = USD. After adding, make a batch payment to these recipients using GBP and easy transfer', function(){
        signin.Login(userName, password)
        newRecipient.goToPaymentsDashborad()
        newRecipient.gotoRecipientList()
        let email = batchPayments.generateRandomString(5)+ '@yopmail.com'
        batchPayments.addRecipient('MEXICO{enter}' ,'USD{enter}' ,email)
        newRecipient.addBankDetailsWithClabe('AFIRMXMT','002010077777777771')
        cy.get('.ant-space > :nth-child(2) > .ant-card > .ant-card-body').should('be.visible').click()
        const bName = batchPayments.generateRandomString(6)
        batchPayments.addBusinessRecipient('BUSINESS USD'+' '+bName,'MEXICO{enter}')
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
        batchPayments.addRecipient('MEXICO{enter}' ,'USD{enter}' ,email1)
        newRecipient.addBankDetailsWithClabe('AFIRMXMT','002010077777777771')
        cy.get('.ant-space > :nth-child(2) > .ant-card > .ant-card-body').should('be.visible').click()
        const bName1 = batchPayments.generateRandomString(6)
        batchPayments.addBusinessRecipient('BUSINESS MEXICO USD'+ ' '+bName1,'MEXICO{enter}')
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
        let name= 'BUSINESS USD'+' '+ bName+'{enter}'
        batchPayments.validateSearchBar(name)
        cy.wait(5000)
        let name1 = 'BUSINESS MEXICO USD'+' ' + bName1+'{enter}'
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
    })
    it('TC_BP_130 - Add 2 recipients(business) from the "Add Recipient" page with country = MEXICO and currency = USD. After adding, make a batch payment to these recipients using GBP and easy transfer.', function(){
        signin.Login(userName, password)
        newRecipient.goToPaymentsDashborad()
        newRecipient.gotoRecipientList()
        let email = batchPayments.generateRandomString(5)+ '@yopmail.com'
        batchPayments.addRecipient('MEXICO{enter}' ,'USD{enter}' ,email)
        newRecipient.addBankDetailsWithClabe('AFIRMXMT','002010077777777771')
        cy.get('.ant-space > :nth-child(2) > .ant-card > .ant-card-body').should('be.visible').click()
        const bName = batchPayments.generateRandomString(6)
        batchPayments.addBusinessRecipient('BUSINESS USD'+' '+bName,'MEXICO{enter}')
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
        batchPayments.addRecipient('MEXICO{enter}' ,'USD{enter}' ,email1)
        newRecipient.addBankDetailsWithClabe('AFIRMXMT','002010077777777771')
        cy.get('.ant-space > :nth-child(2) > .ant-card > .ant-card-body').should('be.visible').click()
        const bName1 = batchPayments.generateRandomString(6)
        batchPayments.addBusinessRecipient('BUSINESS MEXICO USD'+ ' '+bName1,'MEXICO{enter}')
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
        let name= 'BUSINESS USD'+' '+ bName+'{enter}'
        batchPayments.validateSearchBar(name)
        cy.wait(5000)
        let name1 = 'BUSINESS MEXICO USD'+' ' + bName1+'{enter}'
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
        batchPayments.checkSettelments1('be.disabled','be.enabled')
        batchPayments.proceedflow('GBP','GBP','Easy Transfer','Easy Transfer')
        batchPayments.validateproceedflow(amount,amount1)
        batchPayments.validateYapilyFlow()
    })
    it('TC_BP_131 - Verify that user is able to add Individual recipient through batch payment page', function(){
        signin.Login(userName, password)
        newRecipient.goToPaymentsDashborad()
        batchPayments.goToBatchPaymentPage()
        batchPayments.goToPayMultipleRecipient()
        batchPayments.goToAddNewRecipient()
        batchPayments.addIndvidualRecipientFromBatch()
        
    })
    it('TC_BP_132 - Verify that user is able to add Business recipient through batch payment page', function(){
        signin.Login(userName, password)
        newRecipient.goToPaymentsDashborad()
        batchPayments.goToBatchPaymentPage()
        batchPayments.goToPayMultipleRecipient()
        batchPayments.goToAddNewRecipient()
        batchPayments.addBusinessRecipientFromBatch()
        
    })
    it('TC_BP_133 - Verify that user can see the details of recipient on batch payment page by clicking View Details', function(){
        signin.Login(userName, password)
        newRecipient.goToPaymentsDashborad()
        batchPayments.goToBatchPaymentPage()
        batchPayments.goToPayMultipleRecipient()
        batchPayments.viewDetails()
    })
    it('TC_BP_056 - Add 2 recipients(individual) from the "Add Recipient" page with country = AUSTRALIA and currency = AUD. After adding, make a batch payment to these recipients using GBP and easy transfer', function(){
        signin.Login(userName, password)
        newRecipient.goToPaymentsDashborad()
        newRecipient.gotoRecipientList()
        let email = batchPayments.generateRandomString(5)+ '@yopmail.com'
        batchPayments.addRecipient('AUSTRALIA{enter}' ,'AUD{enter}' ,email)
        batchPayments.addBankDetailAUS('ABNAAU2BXXX','123456789','939200')
        const lName = batchPayments.generateRandomString(6)
        batchPayments.individualRecipient('AUSTRALIA ET',lName,'AUSTRALIA{enter}')
        cy.get('#postcode').type('54000')
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
        batchPayments.addRecipient('AUSTRALIA{enter}' ,'AUD{enter}' ,email1)
        batchPayments.addBankDetailAUS('ABNAAU2BXXX','123456789','939200')
        const lName1 = batchPayments.generateRandomString(6)
        batchPayments.individualRecipient('AUSTRALIA AUD ET',lName1,'AUSTRALIA{enter}')
        cy.get('#postcode').type('54000')
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
        let name= 'AUSTRALIA ET'+' '+ lName+'{enter}'
        batchPayments.validateSearchBar(name)
        cy.wait(5000)
        let name1 = 'AUSTRALIA AUD ET'+' ' + lName1+'{enter}'
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
    it('TC_BP_029 - Add 2 recipients(business) from the "Add Recipient" page with country = UNITED KINGDOM and currency = EUR. After adding, make a batch payment to these recipients using GBP and easy transfer', function(){
        signin.Login(userName, password)    
        newRecipient.goToPaymentsDashborad()
            newRecipient.gotoRecipientList()
            let email = batchPayments.generateRandomString(5)+ '@yopmail.com'
            batchPayments.addRecipient('UNITED KINGDOM{enter}' ,'EUR{enter}' ,email)
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
            batchPayments.addRecipient('UNITED KINGDOM{enter}' ,'EUR{enter}' ,email1)
            newRecipient.addBankDetails('GB73BARC20039538243547','AFFLGB22')
            cy.get('.ant-space > :nth-child(2) > .ant-card > .ant-card-body').should('be.visible').click()
            const bName1 = batchPayments.generateRandomString(6)
            batchPayments.addBusinessRecipient('BUSINESS EUR ET'+ ' '+bName1,'UNITED KINGDOM{enter}')
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
            let name1 = 'BUSINESS EUR ET'+' ' + bName1+'{enter}'
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
})