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
    let userName = 'testnew@volopa.com'
    let password = 'testTest1'
    beforeEach(() => {
        cy.visit('https://webapp4.volopa.com/')
        paymentspage.clearCache()
        cy.viewport(1440,1000)
    })
    // Easy Transfer
    it('TC_BP_018 - Add 2 recipients(individual) from the "Add Recipient" page with country = United Arab Emirates and currency = AED. After adding, make a batch payment to these recipients using GBP and easy transfer.', function(){
        signin.Login(userName, password)    
        newRecipient.goToPaymentsDashborad()
            newRecipient.gotoRecipientList()
            let email = batchPayments.generateRandomString(5)+ '@yopmail.com'
            batchPayments.addRecipient('UNITED ARAB EMIRATES{enter}' ,'AED{enter}' ,email)
            newRecipient.addBankDetails('AE070331234567890123456','AARPAEAA')
            const lName = batchPayments.generateRandomString(6)
            batchPayments.individualRecipient('INDIVIDUAL ET',lName,'UNITED ARAB EMIRATES{enter}')
            batchPayments.paymentPurpose()
            cy.get('.ant-select-selector').eq(3).click()
            cy.get('.ant-select-dropdown').eq(3).find('.ant-select-item-option-content').then(Element=>{
                let purposeList = Element.text()
                cy.log(purposeList)
                cy.wrap(purposeList).as('purposeList')
            })
            newRecipient.saveRecipient()
            newRecipient.checkSettelment('be.disabled','be.enabled')
            newRecipient.gotoRecipientList()
            let email1 = batchPayments.generateRandomString(5)+ '@yopmail.com'
            batchPayments.addRecipient('UNITED ARAB EMIRATES{enter}' ,'AED{enter}' ,email1)
            newRecipient.addBankDetails('AE070331234567890123456','AARPAEAA')
            const lName1 = batchPayments.generateRandomString(6)
            batchPayments.individualRecipient('INDIVIDUAL AED ET',lName1,'UNITED ARAB EMIRATES{enter}')
            batchPayments.paymentPurpose1()
            cy.get('.ant-select-selector').eq(3).click()
            cy.get('.ant-select-dropdown').eq(3).find('.ant-select-item-option-content').then(Element=>{
                let purposeList1 = Element.text()
                cy.log(purposeList1)
                cy.wrap(purposeList1).as('purposeList1')
            })
            newRecipient.saveRecipient()
            newRecipient.checkSettelment('be.disabled','be.enabled')
            cy.reload()
            batchPayments.goToBatchPaymentPage()
            batchPayments.goToPayMultipleRecipient()
            let name= 'INDIVIDUAL ET'+' '+ lName+'{enter}'
            batchPayments.validateSearchBar(name)
            cy.wait(5000)
            let name1 = 'INDIVIDUAL AED ET'+' ' + lName1+'{enter}'
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
                cy.get('.ant-select-selector').eq(5).click()
                cy.get('.ant-select-dropdown').eq(2).find('.ant-select-item-option-content').then(Element=>{
                    let list = Element.text()
                    cy.log(list)
                    cy.get('@purposeList1').then(purposeList1=>{
                        expect(list).to.eq(purposeList1)
                        cy.get('.ant-select-selector').eq(5).click()
                    })
                })
            let amount = '250'
            batchPayments.addrecipientDetail(amount, email)
            batchPayments.checkSettelments1('be.disabled','be.enabled')
            let amount1= 260
            batchPayments.addrecipientDetail1(amount1, email1)
            batchPayments.checkSettelments2('be.disabled','be.enabled')
            batchPayments.proceedflow('GBP','GBP','Easy Transfer','Easy Transfer')
            batchPayments.validateproceedflow(amount,amount1)
            batchPayments.validateYapilyFlow()
    })
    it('TC_BP_019 - Add 2 recipients(individual) from the "Add Recipient" page with country = India and currency = INR. After adding, make a batch payment to these recipients using GBP and easy transfer.', function(){
        signin.Login(userName, password)    
        newRecipient.goToPaymentsDashborad()
            newRecipient.gotoRecipientList()
            let email = batchPayments.generateRandomString(5)+ '@yopmail.com'
            batchPayments.addRecipient('INDIA{downarrow}{enter}' ,'INR{enter}' ,email)
            newRecipient.addIndiaBankDetail()
            const lName = batchPayments.generateRandomString(6)
            batchPayments.individualRecipient('INDIVIDUAL ET',lName,'INDIA{downarrow}{enter}')
            batchPayments.paymentPurpose()
            cy.get('.ant-select-selector').eq(3).click()
            cy.get('.ant-select-dropdown').eq(3).find('.ant-select-item-option-content').then(Element=>{
                let purposeList = Element.text()
                cy.log(purposeList)
                cy.wrap(purposeList).as('purposeList')
            })
            newRecipient.saveRecipient()
            newRecipient.checkSettelment('be.enabled','be.disabled')
            newRecipient.gotoRecipientList()
            let email1 = batchPayments.generateRandomString(5)+ '@yopmail.com'
            batchPayments.addRecipient('INDIA{downarrow}{enter}' ,'INR{enter}' ,email1)
            newRecipient.addIndiaBankDetail()
            const lName1 = batchPayments.generateRandomString(6)
            batchPayments.individualRecipient('INDIVIDUAL INR ET',lName1,'INDIA{downarrow}{enter}')
            batchPayments.paymentPurpose1()
            cy.get('.ant-select-selector').eq(3).click()
            cy.get('.ant-select-dropdown').eq(3).find('.ant-select-item-option-content').then(Element=>{
                let purposeList1 = Element.text()
                cy.log(purposeList1)
                cy.wrap(purposeList1).as('purposeList1')
            })
            newRecipient.saveRecipient()
            newRecipient.checkSettelment('be.enabled','be.disabled')
            cy.reload()
            batchPayments.goToBatchPaymentPage()
            batchPayments.goToPayMultipleRecipient()
            let name= 'INDIVIDUAL ET'+' '+ lName+'{enter}'
            batchPayments.validateSearchBar(name)
            cy.wait(5000)
            let name1 = 'INDIVIDUAL INR ET'+' ' + lName1+'{enter}'
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
                cy.get('.ant-select-selector').eq(5).click()
                cy.get('.ant-select-dropdown').eq(2).find('.ant-select-item-option-content').then(Element=>{
                    let list = Element.text()
                    cy.log(list)
                    cy.get('@purposeList1').then(purposeList1=>{
                        expect(list).to.eq(purposeList1)
                        cy.get('.ant-select-selector').eq(5).click()
                    })
                })
            let amount = '250'
            batchPayments.addrecipientDetailINR(amount, email)
            batchPayments.checkSettelments1('be.enabled','be.disabled')
            batchPayments.iNRDetails()
            let amount1= 260
            batchPayments.addrecipientDetail1INR(amount1, email1)
            batchPayments.checkSettelments2('be.enabled','be.disabled')
            batchPayments.iNRDetails1()
            batchPayments.proceedflow('GBP','GBP','Easy Transfer','Easy Transfer')
            batchPayments.validateproceedflow(amount,amount1)
            batchPayments.validateYapilyFlow()
    })
    it('TC_BP_020 - Add 2 recipients(individual) from the "Add Recipient" page with country = CHINA and currency = CNY. After adding, make a batch payment to these recipients using GBP and easy transfer.', function(){
        signin.Login(userName, password)    
        newRecipient.goToPaymentsDashborad()
            newRecipient.gotoRecipientList()
            let email = batchPayments.generateRandomString(5)+ '@yopmail.com'
            batchPayments.addRecipient('CHINA{enter}' ,'CNY{enter}' ,email)
            newRecipient.addBankDetailsChina('AYCLCNBY','55555555','501100000011')
            const bName = batchPayments.generateRandomString(6)
            batchPayments.addBusinessRecipient('INDIVIDUAL ET'+' '+bName,'CHINA{enter}')
            //batchPayments.paymentPurpose()
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
            batchPayments.addRecipient('CHINA{enter}' ,'CNY{enter}' ,email1)
            newRecipient.addBankDetailsChina('AYCLCNBY','55555555','501100000011')
            const bName1 = batchPayments.generateRandomString(6)
            batchPayments.addBusinessRecipient('INDIVIDUAL CNY ET'+ ' '+bName1,'CHINA{enter}')
            //batchPayments.paymentPurpose1()
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
           
            let name= 'INDIVIDUAL ET'+' '+ bName+'{enter}'
            batchPayments.validateSearchBar(name)
            cy.wait(5000)
            let name1 = 'INDIVIDUAL CNY ET'+' ' + bName1+'{enter}'
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
            cy.get('.ant-select-selector').eq(5).click()
            cy.get('.ant-select-dropdown').eq(2).find('.ant-select-item-option-content').then(Element=>{
                let list = Element.text()
                cy.log(list)
                cy.get('@purposeList1').then(purposeList1=>{
                    expect(list).to.eq(purposeList1)
                    cy.get('.ant-select-selector').eq(5).click()
                })
            })
    
            let amount = '260'
            batchPayments.addrecipientDetail(amount, email)
            batchPayments.checkSettelments1('be.disabled','be.enabled')
            let amount1= 265
            batchPayments.addrecipientDetail1(amount1, email1)
            batchPayments.checkSettelments2('be.disabled','be.enabled')
            batchPayments.proceedflow('GBP','GBP','Easy Transfer','Easy Transfer')
            batchPayments.validateproceedflow(amount,amount1)
            batchPayments.validateYapilyFlow()
    })
    it('TC_BP_021 - Add 2 recipients(individual) from the "Add Recipient" page with country = UNITED KINGDOM and currency = EUR. After adding, make a batch payment to these recipients using GBP and easy transfer.', function(){
        signin.Login(userName, password)    
        newRecipient.goToPaymentsDashborad()
            newRecipient.gotoRecipientList()
            let email = batchPayments.generateRandomString(5)+ '@yopmail.com'
            batchPayments.addRecipient('UNITED KINGDOM{enter}' ,'EUR{enter}' ,email)
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
            batchPayments.addRecipient('UNITED KINGDOM{enter}' ,'EUR{enter}' ,email1)
            newRecipient.addBankDetails('GB73BARC20039538243547','AFFLGB22')
            const lName1 = batchPayments.generateRandomString(6)
            batchPayments.individualRecipient('INDIVIDUAL EUR ET',lName1,'UNITED KINGDOM{enter}')
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
            let name1 = 'INDIVIDUAL EUR ET'+' ' + lName1+'{enter}'
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
    it('TC_BP_022 - Add 2 recipients(individual) from the "Add Recipient" page with country = UNITED KINGDOM and currency = GBP. After adding, make a batch payment to these recipients using EUR and easy transfer.', function(){
        signin.Login(userName, password)    
        newRecipient.goToPaymentsDashborad()
            newRecipient.gotoRecipientList()
            let email = batchPayments.generateRandomString(5)+ '@yopmail.com'
            batchPayments.addRecipient('UNITED KINGDOM{enter}' ,'GBP{enter}' ,email)
            newRecipient.addBankDetails('GB73BARC20039538243547','AFFLGB22')
            batchPayments.validateAccSortNo()
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
            batchPayments.addRecipient('UNITED KINGDOM{enter}' ,'GBP{enter}' ,email1)
            newRecipient.addBankDetails('GB73BARC20039538243547','AFFLGB22')
            batchPayments.validateAccSortNo()
            const lName1 = batchPayments.generateRandomString(6)
            batchPayments.individualRecipient('INDIVIDUAL GBP ET',lName1,'UNITED KINGDOM{enter}')
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
            let name1 = 'INDIVIDUAL GBP ET'+' ' + lName1+'{enter}'
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
            batchPayments.proceedflow('EUR','EUR','Easy Transfer','Easy Transfer')
            batchPayments.validateproceedflow(amount,amount1)
            batchPayments.validateYapilyFlow()
            //batchPayments.cancelEasyTransfer()
    })
    //Business recipient
        // Push Fund
    it('TC_BP_023 - Add 2 recipients(business) from the "Add Recipient" page with country = United Arab Emirates and currency = AED. After adding, make a batch payment to these recipients using GBP and push funds.', function(){
        signin.Login(userName, password)    
        newRecipient.goToPaymentsDashborad()
            newRecipient.gotoRecipientList()
            let email = batchPayments.generateRandomString(5)+ '@yopmail.com'
            batchPayments.addRecipient('UNITED ARAB EMIRATES{enter}' ,'AED{enter}' ,email)
            newRecipient.addBankDetails('AE070331234567890123456','AARPAEAA')
            cy.get('.ant-space > :nth-child(2) > .ant-card > .ant-card-body').should('be.visible').click()
            const bName = batchPayments.generateRandomString(6)
            batchPayments.addBusinessRecipient('BUSINESS PF'+' '+bName,'UNITED ARAB EMIRATES{enter}')
            batchPayments.paymentPurpose()
            cy.get('.ant-select-selector').eq(3).click()
            cy.get('.ant-select-dropdown').eq(3).find('.ant-select-item-option-content').then(Element=>{
                let purposeList = Element.text()
                cy.log(purposeList)
                cy.wrap(purposeList).as('purposeList')
            })
            newRecipient.saveRecipient()
            newRecipient.checkSettelment('be.disabled','be.enabled')
            newRecipient.gotoRecipientList()
            let email1 = batchPayments.generateRandomString(5)+ '@yopmail.com'
            batchPayments.addRecipient('UNITED ARAB EMIRATES{enter}' ,'AED{enter}' ,email1)
            newRecipient.addBankDetails('AE070331234567890123456','AARPAEAA')
            cy.get('.ant-space > :nth-child(2) > .ant-card > .ant-card-body').should('be.visible').click()
            const bName1 = batchPayments.generateRandomString(6)
            batchPayments.addBusinessRecipient('BUSINESS AED PF'+ ' '+bName1,'UNITED ARAB EMIRATES{enter}')
            batchPayments.paymentPurpose1()
            cy.get('.ant-select-selector').eq(3).click()
            cy.get('.ant-select-dropdown').eq(3).find('.ant-select-item-option-content').then(Element=>{
                let purposeList1 = Element.text()
                cy.log(purposeList1)
                cy.wrap(purposeList1).as('purposeList1')
            })
            newRecipient.saveRecipient()
            newRecipient.checkSettelment('be.disabled','be.enabled')
            cy.reload()
            batchPayments.goToBatchPaymentPage()
            batchPayments.goToPayMultipleRecipient()
            let name= 'BUSINESS PF'+' '+ bName+'{enter}'
            batchPayments.validateSearchBar(name)
            cy.wait(5000)
            let name1 = 'BUSINESS AED PF'+' ' + bName1+'{enter}'
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
                cy.get('.ant-select-selector').eq(5).click()
                cy.get('.ant-select-dropdown').eq(2).find('.ant-select-item-option-content').then(Element=>{
                    let list = Element.text()
                    cy.log(list)
                    cy.get('@purposeList1').then(purposeList1=>{
                        expect(list).to.eq(purposeList1)
                        cy.get('.ant-select-selector').eq(5).click()
                    })
                })
            let amount = '250'
            batchPayments.addrecipientDetail(amount, email)
            batchPayments.checkSettelments1('be.disabled','be.enabled')
            let amount1= 260
            batchPayments.addrecipientDetail1(amount1, email1)
            batchPayments.checkSettelments2('be.disabled','be.enabled')
            batchPayments.proceedflow('GBP','GBP','Push Fund','Push Fund')
            batchPayments.validateproceedflow(amount,amount1)
    })
    it('TC_BP_024 - Add 2 recipients(business) from the "Add Recipient" page with country = India and currency = INR. After adding, make a batch payment to these recipients using GBP and push funds.', function(){
        signin.Login(userName, password)    
        newRecipient.goToPaymentsDashborad()
            newRecipient.gotoRecipientList()
            let email = batchPayments.generateRandomString(5)+ '@yopmail.com'
            batchPayments.addRecipient('INDIA{downarrow}{enter}' ,'INR{enter}' ,email)
            newRecipient.addIndiaBankDetail()
            cy.get('.ant-space > :nth-child(2) > .ant-card > .ant-card-body').should('be.visible').click()
            const bName = batchPayments.generateRandomString(6)
            batchPayments.addBusinessRecipient('BUSINESS PF'+' '+bName,'INDIA{downarrow}{enter}')
            batchPayments.paymentPurpose()
            cy.get('.ant-select-selector').eq(3).click()
            cy.get('.ant-select-dropdown').eq(3).find('.ant-select-item-option-content').then(Element=>{
                let purposeList = Element.text()
                cy.log(purposeList)
                cy.wrap(purposeList).as('purposeList')
            })
            newRecipient.saveRecipient()
            newRecipient.checkSettelment('be.enabled','be.disabled')
            newRecipient.gotoRecipientList()
            let email1 = batchPayments.generateRandomString(5)+ '@yopmail.com'
            batchPayments.addRecipient('INDIA{downarrow}{enter}' ,'INR{enter}' ,email1)
            newRecipient.addIndiaBankDetail()
            cy.get('.ant-space > :nth-child(2) > .ant-card > .ant-card-body').should('be.visible').click()
            const bName1 = batchPayments.generateRandomString(6)
            batchPayments.addBusinessRecipient('BUSINESS INR PF'+ ' '+bName1,'INDIA{downarrow}{enter}')
            batchPayments.paymentPurpose1()
            cy.get('.ant-select-selector').eq(3).click()
            cy.get('.ant-select-dropdown').eq(3).find('.ant-select-item-option-content').then(Element=>{
                let purposeList1 = Element.text()
                cy.log(purposeList1)
                cy.wrap(purposeList1).as('purposeList1')
            })
            newRecipient.saveRecipient()
            newRecipient.checkSettelment('be.enabled','be.disabled')
            cy.reload()
            batchPayments.goToBatchPaymentPage()
            batchPayments.goToPayMultipleRecipient()
            let name= 'BUSINESS PF'+' '+ bName+'{enter}'
            batchPayments.validateSearchBar(name)
            cy.wait(5000)
            let name1 = 'BUSINESS INR PF'+' ' + bName1+'{enter}'
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
                cy.get('.ant-select-selector').eq(5).click()
                cy.get('.ant-select-dropdown').eq(2).find('.ant-select-item-option-content').then(Element=>{
                    let list = Element.text()
                    cy.log(list)
                    cy.get('@purposeList1').then(purposeList1=>{
                        expect(list).to.eq(purposeList1)
                        cy.get('.ant-select-selector').eq(5).click()
                    })
                })
            let amount = '250'
            batchPayments.addrecipientDetailINR(amount, email)
            batchPayments.checkSettelments1('be.enabled','be.disabled')
            batchPayments.iNRDetails()
            let amount1= 260
            batchPayments.addrecipientDetail1INR(amount1, email1)
            batchPayments.checkSettelments2('be.enabled','be.disabled')
            batchPayments.iNRDetails1()
            batchPayments.proceedflow('GBP','GBP','Push Fund','Push Fund')
            batchPayments.validateproceedflow(amount,amount1)
    })
    it('TC_BP_025 - Add 2 recipients(business) from the "Add Recipient" page with country = UNITED KINGDOM and currency = EUR. After adding, make a batch payment to these recipients using GBP and push funds.', function(){
        signin.Login(userName, password)    
        newRecipient.goToPaymentsDashborad()
            newRecipient.gotoRecipientList()
            let email = batchPayments.generateRandomString(5)+ '@yopmail.com'
            batchPayments.addRecipient('UNITED KINGDOM{enter}' ,'EUR{enter}' ,email)
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
            batchPayments.addRecipient('UNITED KINGDOM{enter}' ,'EUR{enter}' ,email1)
            newRecipient.addBankDetails('GB73BARC20039538243547','AFFLGB22')
            cy.get('.ant-space > :nth-child(2) > .ant-card > .ant-card-body').should('be.visible').click()
            const bName1 = batchPayments.generateRandomString(6)
            batchPayments.addBusinessRecipient('BUSINESS EUR PF'+ ' '+bName1,'UNITED KINGDOM{enter}')
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
            let name1 = 'BUSINESS EUR PF'+' ' + bName1+'{enter}'
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
    it('TC_BP_026 - Add 2 recipients(business) from the "Add Recipient" page with country = UNITED KINGDOM and currency = GBP. After adding, make a batch payment to these recipients using EUR and push funds.', function(){
        signin.Login(userName, password)    
        newRecipient.goToPaymentsDashborad()
            newRecipient.gotoRecipientList()
            let email = batchPayments.generateRandomString(5)+ '@yopmail.com'
            batchPayments.addRecipient('UNITED KINGDOM{enter}' ,'GBP{enter}' ,email)
            newRecipient.addBankDetails('GB73BARC20039538243547','AFFLGB22')
            batchPayments.validateAccSortNo()
            cy.get('.ant-space > :nth-child(2) > .ant-card > .ant-card-body').should('be.visible').click()
            const bName = batchPayments.generateRandomString(6)
            batchPayments.addBusinessRecipient('BUsINESS PF'+' '+bName,'UNITED KINGDOM{enter}')
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
            batchPayments.addRecipient('UNITED KINGDOM{enter}' ,'GBP{enter}' ,email1)
            newRecipient.addBankDetails('GB73BARC20039538243547','AFFLGB22')
            batchPayments.validateAccSortNo()
            cy.get('.ant-space > :nth-child(2) > .ant-card > .ant-card-body').should('be.visible').click()
            const bName1 = batchPayments.generateRandomString(6)
            batchPayments.addBusinessRecipient('BUSINESS GBP PF'+ ' '+bName1,'UNITED KINGDOM{enter}')
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
            let name1 = 'BUSINESS GBP PF'+' ' + bName1+'{enter}'
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
            batchPayments.proceedflow('EUR','EUR','Push Fund','Push Fund')
            batchPayments.validateproceedflow(amount,amount1)
    })
    //Easy Transfer
    it('TC_BP_027 - Add 2 recipients(business) from the "Add Recipient" page with country = United Arab Emirates and currency = AED. After adding, make a batch payment to these recipients using GBP and easy transfer', function(){
        signin.Login(userName, password)    
        newRecipient.goToPaymentsDashborad()
            newRecipient.gotoRecipientList()
            let email = batchPayments.generateRandomString(5)+ '@yopmail.com'
            batchPayments.addRecipient('UNITED ARAB EMIRATES{enter}' ,'AED{enter}' ,email)
            newRecipient.addBankDetails('AE070331234567890123456','AARPAEAA')
            cy.get('.ant-space > :nth-child(2) > .ant-card > .ant-card-body').should('be.visible').click()
            const bName = batchPayments.generateRandomString(6)
            batchPayments.addBusinessRecipient('BUSINESS ET'+' '+bName,'UNITED ARAB EMIRATES{enter}')
            batchPayments.paymentPurpose()
            cy.get('.ant-select-selector').eq(3).click()
            cy.get('.ant-select-dropdown').eq(3).find('.ant-select-item-option-content').then(Element=>{
                let purposeList = Element.text()
                cy.log(purposeList)
                cy.wrap(purposeList).as('purposeList')
            })
            newRecipient.saveRecipient()
            newRecipient.checkSettelment('be.disabled','be.enabled')
            newRecipient.gotoRecipientList()
            let email1 = batchPayments.generateRandomString(5)+ '@yopmail.com'
            batchPayments.addRecipient('UNITED ARAB EMIRATES{enter}' ,'AED{enter}' ,email1)
            newRecipient.addBankDetails('AE070331234567890123456','AARPAEAA')
            cy.get('.ant-space > :nth-child(2) > .ant-card > .ant-card-body').should('be.visible').click()
            const bName1 = batchPayments.generateRandomString(6)
            batchPayments.addBusinessRecipient('BUSINESS AED ET'+ ' '+bName1,'UNITED ARAB EMIRATES{enter}')
            batchPayments.paymentPurpose1()
            cy.get('.ant-select-selector').eq(3).click()
            cy.get('.ant-select-dropdown').eq(3).find('.ant-select-item-option-content').then(Element=>{
                let purposeList1 = Element.text()
                cy.log(purposeList1)
                cy.wrap(purposeList1).as('purposeList1')
            })
            newRecipient.saveRecipient()
            newRecipient.checkSettelment('be.disabled','be.enabled')
            cy.reload()
            batchPayments.goToBatchPaymentPage()
            batchPayments.goToPayMultipleRecipient()
            let name= 'BUSINESS ET'+' '+ bName+'{enter}'
            batchPayments.validateSearchBar(name)
            cy.wait(5000)
            let name1 = 'BUSINESS AED ET'+' ' + bName1+'{enter}'
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
                cy.get('.ant-select-selector').eq(5).click()
                cy.get('.ant-select-dropdown').eq(2).find('.ant-select-item-option-content').then(Element=>{
                    let list = Element.text()
                    cy.log(list)
                    cy.get('@purposeList1').then(purposeList1=>{
                        expect(list).to.eq(purposeList1)
                        cy.get('.ant-select-selector').eq(5).click()
                    })
                })
            let amount = '250'
            batchPayments.addrecipientDetail(amount, email)
            batchPayments.checkSettelments1('be.disabled','be.enabled')
            let amount1= 260
            batchPayments.addrecipientDetail1(amount1, email1)
            batchPayments.checkSettelments2('be.disabled','be.enabled')
            batchPayments.proceedflow('GBP','GBP','Easy Transfer','Easy Transfer')
            batchPayments.validateproceedflow(amount,amount1)
            batchPayments.validateYapilyFlow()
    })
    it('TC_BP_028 - Add 2 recipients(business) from the "Add Recipient" page with country = India and currency = INR. After adding, make a batch payment to these recipients using GBP and easy transfer', function(){
        signin.Login(userName, password)    
        newRecipient.goToPaymentsDashborad()
            newRecipient.gotoRecipientList()
            let email = batchPayments.generateRandomString(5)+ '@yopmail.com'
            batchPayments.addRecipient('INDIA{downarrow}{enter}' ,'INR{enter}' ,email)
            newRecipient.addIndiaBankDetail()
            cy.get('.ant-space > :nth-child(2) > .ant-card > .ant-card-body').should('be.visible').click()
            const bName = batchPayments.generateRandomString(6)
            batchPayments.addBusinessRecipient('BUSINESS ET'+' '+bName,'INDIA{downarrow}{enter}')
            batchPayments.paymentPurpose()
            cy.get('.ant-select-selector').eq(3).click()
            cy.get('.ant-select-dropdown').eq(3).find('.ant-select-item-option-content').then(Element=>{
                let purposeList = Element.text()
                cy.log(purposeList)
                cy.wrap(purposeList).as('purposeList')
            })
            newRecipient.saveRecipient()
            newRecipient.checkSettelment('be.enabled','be.disabled')
            newRecipient.gotoRecipientList()
            let email1 = batchPayments.generateRandomString(5)+ '@yopmail.com'
            batchPayments.addRecipient('INDIA{downarrow}{enter}' ,'INR{enter}' ,email1)
            newRecipient.addIndiaBankDetail()
            cy.get('.ant-space > :nth-child(2) > .ant-card > .ant-card-body').should('be.visible').click()
            const bName1 = batchPayments.generateRandomString(6)
            batchPayments.addBusinessRecipient('BUSINESS INR ET'+ ' '+bName1,'INDIA{downarrow}{enter}')
            batchPayments.paymentPurpose1()
            cy.get('.ant-select-selector').eq(3).click()
            cy.get('.ant-select-dropdown').eq(3).find('.ant-select-item-option-content').then(Element=>{
                let purposeList1 = Element.text()
                cy.log(purposeList1)
                cy.wrap(purposeList1).as('purposeList1')
            })
            newRecipient.saveRecipient()
            newRecipient.checkSettelment('be.enabled','be.disabled')
            cy.reload()
            batchPayments.goToBatchPaymentPage()
            batchPayments.goToPayMultipleRecipient()
            let name= 'BUSINESS ET'+' '+ bName+'{enter}'
            batchPayments.validateSearchBar(name)
            cy.wait(5000)
            let name1 = 'BUSINESS INR ET'+' ' + bName1+'{enter}'
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
                cy.get('.ant-select-selector').eq(5).click()
                cy.get('.ant-select-dropdown').eq(2).find('.ant-select-item-option-content').then(Element=>{
                    let list = Element.text()
                    cy.log(list)
                    cy.get('@purposeList1').then(purposeList1=>{
                        expect(list).to.eq(purposeList1)
                        cy.get('.ant-select-selector').eq(5).click()
                    })
                })
            let amount = '250'
            batchPayments.addrecipientDetailINR(amount, email)
            batchPayments.checkSettelments1('be.enabled','be.disabled')
            batchPayments.iNRDetails()
            let amount1= 260
            batchPayments.addrecipientDetail1INR(amount1, email1)
            batchPayments.checkSettelments2('be.enabled','be.disabled')
            batchPayments.iNRDetails1()
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
    it('TC_BP_030 - Add 2 recipients(business) from the "Add Recipient" page with country = UNITED KINGDOM and currency = GBP. After adding, make a batch payment to these recipients using EUR and easy transfer', function(){
        signin.Login(userName, password)    
        newRecipient.goToPaymentsDashborad()
            newRecipient.gotoRecipientList()
            let email = batchPayments.generateRandomString(5)+ '@yopmail.com'
            batchPayments.addRecipient('UNITED KINGDOM{enter}' ,'GBP{enter}' ,email)
            newRecipient.addBankDetails('GB73BARC20039538243547','AFFLGB22')
            batchPayments.validateAccSortNo()
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
            batchPayments.addRecipient('UNITED KINGDOM{enter}' ,'GBP{enter}' ,email1)
            newRecipient.addBankDetails('GB73BARC20039538243547','AFFLGB22')
            batchPayments.validateAccSortNo()
            cy.get('.ant-space > :nth-child(2) > .ant-card > .ant-card-body').should('be.visible').click()
            const bName1 = batchPayments.generateRandomString(6)
            batchPayments.addBusinessRecipient('BUSINESS GBP ET'+ ' '+bName1,'UNITED KINGDOM{enter}')
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
            let name1 = 'BUSINESS GBP ET'+' ' + bName1+'{enter}'
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
            batchPayments.proceedflow('EUR','EUR','Easy Transfer','Easy Transfer')
            batchPayments.validateproceedflow(amount,amount1)
            batchPayments.validateYapilyFlow()
    })
})    