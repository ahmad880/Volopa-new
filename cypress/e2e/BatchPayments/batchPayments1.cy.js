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

    it('TC_BP_001 - Verify that user landed on the Batch Payments page', function(){
        signin.Login(userName, password)
        paymentspage.goToPaymentsDashborad()
        batchPayments.goToBatchPaymentPage()
    })
    it('TC_BP_002 - Verify that user landed on Pay Multiple Recipients page', function(){
        signin.Login(userName, password)
        paymentspage.goToPaymentsDashborad()
        batchPayments.goToBatchPaymentPage()
        batchPayments.goToPayMultipleRecipient()
    })
    it('TC_BP_003 - Verify that user can search the existing recipients in the search bar', function(){
        signin.Login(userName, password)
        paymentspage.goToPaymentsDashborad()
        batchPayments.goToBatchPaymentPage()
        batchPayments.goToPayMultipleRecipient()
        batchPayments.validateSearchBar('hamza QA{enter}')
    })
    it('TC_BP_004 - Verify that "Add New Recipient" button under Seach Bar naviagtes to Recipient Details Page', function(){
        signin.Login(userName, password)
        paymentspage.goToPaymentsDashborad()
        batchPayments.goToBatchPaymentPage()
        batchPayments.goToPayMultipleRecipient()
        batchPayments.goToAddNewRecipient()
    })
    it('TC_BP_005 - Verify that "Add New Recipient" button under Seach Bar naviagtes to Recipient Details Page', function(){
        signin.Login(userName, password)
        paymentspage.goToPaymentsDashborad()
        batchPayments.goToBatchPaymentPage()
        batchPayments.goToPayMultipleRecipient()
        batchPayments.validateSearchBar('hamza QA{enter}')
        batchPayments.addSettlement()
        batchPayments.addRecipientDetails()
        batchPayments.fxrateChecker()
    })
    it('TC_BP_006 - Verify that user navigates to Payment Summary page', function(){
        signin.Login(userName, password)
        paymentspage.goToPaymentsDashborad()
        batchPayments.goToBatchPaymentPage()
        batchPayments.goToPayMultipleRecipient()
        batchPayments.validateSearchBar('hamza QA{enter}')
        batchPayments.addSettlement()
        batchPayments.addRecipientDetails()
    })
    xit('TC_BP_007 - Verify that Funding Method (Easy Transfer and Push Funds) is not available for currencies other than GBP and Euro', function(){
        signin.Login(userName, password)
        paymentspage.goToPaymentsDashborad()
        batchPayments.goToBatchPaymentPage()
        batchPayments.goToPayMultipleRecipient()
        batchPayments.validateSearchBar('hamza QA{enter}')
        batchPayments.addSettlement()
        batchPayments.addRecipientDetails()
        batchPayments.disabledFundingMethod()
    })
    xit('TC_BP_009 - Verify that Yapily flow journey and transaction is completed', function(){
        signin.Login(userName, password)
        paymentspage.goToPaymentsDashborad()
        batchPayments.goToBatchPaymentPage()
        batchPayments.goToPayMultipleRecipient()
        batchPayments.validateSearchBar()
        batchPayments.addRecipientDetails()
        batchPayments.validateYapilyFlow()
    })
    it('TC_BP_010 - Verify that user can view payment after paying a recipient', function(){
        signin.Login(userName, password)
        paymentspage.goToPaymentsDashborad()
        batchPayments.goToBatchPaymentPage()
        batchPayments.goToPayMultipleRecipient()
        batchPayments.validateSearchBar('hamza QA{enter}')
        batchPayments.addSettlement()
        batchPayments.addRecipientDetails()
        batchPayments.paymentSummaryPageDetails()
        batchPayments.goToViewPayment()
    })
    it('TC_BP_011 - Verify that user can pay new payment right after paying a recipient', function(){
        signin.Login(userName, password)
        paymentspage.goToPaymentsDashborad()
        batchPayments.goToBatchPaymentPage()
        batchPayments.goToPayMultipleRecipient()
        batchPayments.validateSearchBar('hamza QA{enter}')
        batchPayments.addSettlement()
        batchPayments.addRecipientDetails()
        batchPayments.paymentSummaryPageDetails()
        batchPayments.goToNewPayment()
    })
    it('TC_BP_012 - Verify that after paying recipients, user is able to return to the payment dashboard.', function(){
        signin.Login(userName, password)
        paymentspage.goToPaymentsDashborad()
        batchPayments.goToBatchPaymentPage()
        batchPayments.goToPayMultipleRecipient()
        batchPayments.validateSearchBar('hamza QA{enter}')
        batchPayments.addSettlement()
        batchPayments.addRecipientDetails()
        batchPayments.paymentSummaryPageDetails()
        batchPayments.goToDashboard()
    })
 // Carmen Casses for batch payment
 // individual recipients
 // push fund
    it('TC_BP_013 - Add 2 recipients(individual) from the "Add Recipient" page with country = United Arab Emirates and currency = AED. After adding, make a batch payment to these recipients using GBP and push funds.', function(){
        signin.Login(userName, password)
        newRecipient.goToPaymentsDashborad()
        newRecipient.gotoRecipientList()
        let email = batchPayments.generateRandomString(5)+ '@yopmail.com'
        batchPayments.addRecipient('UNITED ARAB EMIRATES{enter}' ,'AED{enter}' ,email)
        newRecipient.addBankDetails('AE070331234567890123456','AARPAEAA')
        const lName = batchPayments.generateRandomString(6)
        batchPayments.individualRecipient('INDIVIDUAL PF',lName,'UNITED ARAB EMIRATES{enter}')
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
        batchPayments.individualRecipient('INDIVIDUAL AED PF',lName1,'UNITED ARAB EMIRATES{enter}')
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
        let name= 'INDIVIDUAL PF'+' '+ lName+'{enter}'
        batchPayments.validateSearchBar(name)
        cy.wait(5000)
        let name1 = 'INDIVIDUAL AED PF'+' ' + lName1+'{enter}'
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
        batchPayments.cancelPushFunds()
    })
    it('TC_BP_014 - Add 2 recipients(individual) from the "Add Recipient" page with country = India and currency = INR. After adding, make a batch payment to these recipients using GBP and push funds.', function(){
        signin.Login(userName, password)
        newRecipient.goToPaymentsDashborad()
        newRecipient.gotoRecipientList()
        let email = batchPayments.generateRandomString(5)+ '@yopmail.com'
        batchPayments.addRecipient('INDIA{downarrow}{enter}' ,'INR{enter}' ,email)
        newRecipient.addIndiaBankDetail()
        const lName = batchPayments.generateRandomString(6)
        batchPayments.individualRecipient('INDIVIDUAL PF',lName,'INDIA{downarrow}{enter}')
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
        batchPayments.individualRecipient('INDIVIDUAL INR PF',lName1,'INDIA{downarrow}{enter}')
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
        let name= 'INDIVIDUAL PF'+' '+ lName+'{enter}'
        batchPayments.validateSearchBar(name)
        cy.wait(5000)
        let name1 = 'INDIVIDUAL INR PF'+' ' + lName1+'{enter}'
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
        batchPayments.cancelPushFunds()
    })
    it('TC_BP_015 - Add 2 recipients(individual) from the "Add Recipient" page with country = CHINA and currency = CNY. After adding, make a batch payment to these recipients using GBP and push funds.', function(){
        signin.Login(userName, password)
        newRecipient.goToPaymentsDashborad()
        newRecipient.gotoRecipientList()
        let email = batchPayments.generateRandomString(5)+ '@yopmail.com'
        batchPayments.addRecipient('CHINA{enter}' ,'CNY{enter}' ,email)
        newRecipient.addBankDetailsChina('AYCLCNBY','55555555','501100000011')
        const bName = batchPayments.generateRandomString(6)
        batchPayments.addBusinessRecipient('INDIVIDUAL PF'+' '+bName,'CHINA{enter}')
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
        batchPayments.addBusinessRecipient('INDIVIDUAL CNY PF'+ ' '+bName1,'CHINA{enter}')
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
       
        let name= 'INDIVIDUAL PF'+' '+ bName+'{enter}'
        batchPayments.validateSearchBar(name)
        cy.wait(5000)
        let name1 = 'INDIVIDUAL CNY PF'+' ' + bName1+'{enter}'
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
        batchPayments.proceedflow('GBP','GBP','Push Fund','Push Fund')
        batchPayments.validateproceedflow(amount,amount1)
        batchPayments.cancelPushFunds()
    
    })
    it('TC_BP_016 - Add 2 recipients(individual) from the "Add Recipient" page with country = UNITED KINGDOM and currency = EUR. After adding, make a batch payment to these recipients using GBP and push funds.', function(){
        signin.Login(userName, password)
        newRecipient.goToPaymentsDashborad()
        newRecipient.gotoRecipientList()
        let email = batchPayments.generateRandomString(5)+ '@yopmail.com'
        batchPayments.addRecipient('UNITED KINGDOM{enter}' ,'EUR{enter}' ,email)
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
        batchPayments.addRecipient('UNITED KINGDOM{enter}' ,'EUR{enter}' ,email1)
        newRecipient.addBankDetails('GB73BARC20039538243547','AFFLGB22')
        const lName1 = batchPayments.generateRandomString(6)
        batchPayments.individualRecipient('INDIVIDUAL EUR PF',lName1,'UNITED KINGDOM{enter}')
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
        let name1 = 'INDIVIDUAL EUR PF'+' ' + lName1+'{enter}'
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
    it('TC_BP_017 - Add 2 recipients(individual) from the "Add Recipient" page with country = UNITED KINGDOM and currency = GBP. After adding, make a batch payment to these recipients using EUR and push funds.', function(){
        signin.Login(userName, password)
        newRecipient.goToPaymentsDashborad()
        newRecipient.gotoRecipientList()
        let email = batchPayments.generateRandomString(5)+ '@yopmail.com'
        batchPayments.addRecipient('UNITED KINGDOM{enter}' ,'GBP{enter}' ,email)
        newRecipient.addBankDetails('GB73BARC20039538243547','AFFLGB22')
        batchPayments.validateAccSortNo()
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
        batchPayments.addRecipient('UNITED KINGDOM{enter}' ,'GBP{enter}' ,email1)
        newRecipient.addBankDetails('GB73BARC20039538243547','AFFLGB22')
        batchPayments.validateAccSortNo()
        const lName1 = batchPayments.generateRandomString(6)
        batchPayments.individualRecipient('INDIVIDUAL GBP PF',lName1,'UNITED KINGDOM{enter}')
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
        let name1 = 'INDIVIDUAL GBP PF'+' ' + lName1+'{enter}'
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
})