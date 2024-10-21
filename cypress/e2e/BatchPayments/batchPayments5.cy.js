/// <reference types = "Cypress"/>

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
        cy.visit('https://webapp2.volopa.com/')
        paymentspage.clearCache()
        signin.Login(userName, password)
        cy.viewport(1440,1000)
    })
    //push fund individual other countries
    it('TC_BP_051 - Add 2 recipients(individual) from the "Add Recipient" page with country = AUSTRALIA and currency = AUD. After adding, make a batch payment to these recipients using GBP and push funds.', function(){
        newRecipient.goToPaymentsDashborad()
        newRecipient.gotoRecipientList()
        let email = batchPayments.generateRandomString(5)+ '@yopmail.com'
        batchPayments.addRecipient('AUSTRALIA{enter}' ,'AUD{enter}' ,email)
        batchPayments.addBankDetailAUS('ABNAAU2BXXX','123456789','939200')
        const lName = batchPayments.generateRandomString(6)
        batchPayments.individualRecipient('AUSTRALIA PF',lName,'AUSTRALIA{enter}')
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
        batchPayments.individualRecipient('AUSTRALIA AUD PF',lName1,'AUSTRALIA{enter}')
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
        let name= 'AUSTRALIA PF'+' '+ lName+'{enter}'
        batchPayments.validateSearchBar(name)
        cy.wait(5000)
        let name1 = 'AUSTRALIA AUD PF'+' ' + lName1+'{enter}'
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
    it('TC_BP_052 - Add 2 recipients(individual) from the "Add Recipient" page with country = CANADA and currency = CAD. After adding, make a batch payment to these recipients using GBP and push funds.', function(){
        newRecipient.goToPaymentsDashborad()
        newRecipient.gotoRecipientList()
        let email = batchPayments.generateRandomString(5)+ '@yopmail.com'
        batchPayments.addRecipient('CANADA{enter}' ,'CAD{enter}' ,email)
        batchPayments.addBankDetailCAD('BNDCCAMMXXX','26207729','004','01372')
        const lName = batchPayments.generateRandomString(6)
        batchPayments.individualRecipient('CANADA PF',lName,'CANADA{enter}')
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
        batchPayments.addRecipient('CANADA{enter}' ,'CAD{enter}' ,email1)
        batchPayments.addBankDetailCAD('BNDCCAMMXXX','26207729','004','01372')
        const lName1 = batchPayments.generateRandomString(6)
        batchPayments.individualRecipient('CANADA CAD PF',lName1,'CANADA{enter}')
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
        let name= 'CANADA PF'+' '+ lName+'{enter}'
        batchPayments.validateSearchBar(name)
        cy.wait(5000)
        let name1 = 'CANADA CAD PF'+' ' + lName1+'{enter}'
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
    it('TC_BP_053 - Add 2 recipients(individual) from the "Add Recipient" page with country = SINGAPORE and currency = SGD. After adding, make a batch payment to these recipients using GBP and push funds.', function(){
        newRecipient.goToPaymentsDashborad()
        newRecipient.gotoRecipientList()
        let email = batchPayments.generateRandomString(5)+ '@yopmail.com'
        batchPayments.addRecipient('SINGAPORE{enter}' ,'SGD{enter}' ,email)
        newRecipient.addBankDetailsWithAccNo('ACLPSGSG','049712')
        const lName = batchPayments.generateRandomString(6)
        batchPayments.individualRecipient('SINGAPORE PF',lName,'SINGAPORE{enter}')
        
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
        batchPayments.addRecipient('SINGAPORE{enter}' ,'SGD{enter}' ,email1)
        newRecipient.addBankDetailsWithAccNo('ACLPSGSG','049712')
        const lName1 = batchPayments.generateRandomString(6)
        batchPayments.individualRecipient('SINGAPORE SGD PF',lName1,'SINGAPORE{enter}')
       
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
        let name= 'SINGAPORE PF'+' '+ lName+'{enter}'
        batchPayments.validateSearchBar(name)
        cy.wait(5000)
        let name1 = 'SINGAPORE SGD PF'+' ' + lName1+'{enter}'
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
    it('TC_BP_054 - Add 2 recipients(individual) from the "Add Recipient" page with country = HONG KONG and currency = HKD. After adding, make a batch payment to these recipients using GBP and push funds.', function(){
        newRecipient.goToPaymentsDashborad()
        newRecipient.gotoRecipientList()
        let email = batchPayments.generateRandomString(5)+ '@yopmail.com'
        batchPayments.addRecipient('HONG KONG{enter}' ,'HKD{enter}' ,email)
        batchPayments.addBankDetailHKD('HSBCHKHH','1234657890','004')
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
        batchPayments.addRecipient('HONG KONG{enter}' ,'HKD{enter}' ,email1)
        batchPayments.addBankDetailHKD('HSBCHKHH','1234657890','004')
        const lName1 = batchPayments.generateRandomString(6)
        batchPayments.individualRecipient('HONG KONG HKD PF',lName1,'HONG KONG{enter}')
       
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
        let name1 = 'HONG KONG HKD PF'+' ' + lName1+'{enter}'
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
    it('TC_BP_055 - Add 2 recipients(individual) from the "Add Recipient" page with country = MEXICO and currency = MXN. After adding, make a batch payment to these recipients using GBP and push funds.', function(){
        newRecipient.goToPaymentsDashborad()
        newRecipient.gotoRecipientList()
        let email = batchPayments.generateRandomString(5)+ '@yopmail.com'
        batchPayments.addRecipient('MEXICO{enter}' ,'MXN{enter}' ,email)
        newRecipient.addBankDetailsWithClabe('AFIRMXMT','002010077777777771')
        const lName = batchPayments.generateRandomString(6)
        batchPayments.individualRecipient('MEXICO PF',lName,'MEXICO{enter}')
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
        batchPayments.addRecipient('MEXICO{enter}' ,'MXN{enter}' ,email1)
        newRecipient.addBankDetailsWithClabe('AFIRMXMT','002010077777777771')
        const lName1 = batchPayments.generateRandomString(6)
        batchPayments.individualRecipient('MEXICO MXN PF',lName1,'MEXICO{enter}')
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
        let name= 'MEXICO PF'+' '+ lName+'{enter}'
        batchPayments.validateSearchBar(name)
        cy.wait(5000)
        let name1 = 'MEXICO MXN PF'+' ' + lName1+'{enter}'
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
    //Easy Transfer individual other countries
    it('TC_BP_056 - Add 2 recipients(individual) from the "Add Recipient" page with country = AUSTRALIA and currency = AUD. After adding, make a batch payment to these recipients using GBP and easy transfer', function(){
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
    it('TC_BP_057 - Add 2 recipients(individual) from the "Add Recipient" page with country = CANADA and currency = CAD. After adding, make a batch payment to these recipients using GBP and easy transfer', function(){
        newRecipient.goToPaymentsDashborad()
        newRecipient.gotoRecipientList()
        let email = batchPayments.generateRandomString(5)+ '@yopmail.com'
        batchPayments.addRecipient('CANADA{enter}' ,'CAD{enter}' ,email)
        batchPayments.addBankDetailCAD('BNDCCAMMXXX','26207729','004','01372')
        const lName = batchPayments.generateRandomString(6)
        batchPayments.individualRecipient('CANADA ET',lName,'CANADA{enter}')
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
        batchPayments.addRecipient('CANADA{enter}' ,'CAD{enter}' ,email1)
        batchPayments.addBankDetailCAD('BNDCCAMMXXX','26207729','004','01372')
        const lName1 = batchPayments.generateRandomString(6)
        batchPayments.individualRecipient('CANADA CAD ET',lName1,'CANADA{enter}')
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
        let name= 'CANADA ET'+' '+ lName+'{enter}'
        batchPayments.validateSearchBar(name)
        cy.wait(5000)
        let name1 = 'CANADA CAD ET'+' ' + lName1+'{enter}'
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
    it('TC_BP_058 - Add 2 recipients(individual) from the "Add Recipient" page with country = SINGAPORE and currency = SGD. After adding, make a batch payment to these recipients using GBP and easy transfer', function(){
        newRecipient.goToPaymentsDashborad()
        newRecipient.gotoRecipientList()
        let email = batchPayments.generateRandomString(5)+ '@yopmail.com'
        batchPayments.addRecipient('SINGAPORE{enter}' ,'SGD{enter}' ,email)
        newRecipient.addBankDetailsWithAccNo('ACLPSGSG','049712')
        const lName = batchPayments.generateRandomString(6)
        batchPayments.individualRecipient('SINGAPORE ET',lName,'SINGAPORE{enter}')
        
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
        batchPayments.addRecipient('SINGAPORE{enter}' ,'SGD{enter}' ,email1)
        newRecipient.addBankDetailsWithAccNo('ACLPSGSG','049712')
        const lName1 = batchPayments.generateRandomString(6)
        batchPayments.individualRecipient('SINGAPORE SGD ET',lName1,'SINGAPORE{enter}')
       
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
        let name= 'SINGAPORE ET'+' '+ lName+'{enter}'
        batchPayments.validateSearchBar(name)
        cy.wait(5000)
        let name1 = 'SINGAPORE SGD ET'+' ' + lName1+'{enter}'
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
    it('TC_BP_059 - Add 2 recipients(individual) from the "Add Recipient" page with country = HONG KONG and currency = HKD. After adding, make a batch payment to these recipients using GBP and easy transfer', function(){
        newRecipient.goToPaymentsDashborad()
        newRecipient.gotoRecipientList()
        let email = batchPayments.generateRandomString(5)+ '@yopmail.com'
        batchPayments.addRecipient('HONG KONG{enter}' ,'HKD{enter}' ,email)
        batchPayments.addBankDetailHKD('HSBCHKHH','1234657890','004')
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
        batchPayments.addRecipient('HONG KONG{enter}' ,'HKD{enter}' ,email1)
        batchPayments.addBankDetailHKD('HSBCHKHH','1234657890','004')
        const lName1 = batchPayments.generateRandomString(6)
        batchPayments.individualRecipient('HONG KONG HKD ET',lName1,'HONG KONG{enter}')
       
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
        let name1 = 'HONG KONG HKD ET'+' ' + lName1+'{enter}'
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
    it('TC_BP_060 - Add 2 recipients(individual) from the "Add Recipient" page with country = MEXICO and currency = MXN. After adding, make a batch payment to these recipients using GBP and easy transfer', function(){
        newRecipient.goToPaymentsDashborad()
        newRecipient.gotoRecipientList()
        let email = batchPayments.generateRandomString(5)+ '@yopmail.com'
        batchPayments.addRecipient('MEXICO{enter}' ,'MXN{enter}' ,email)
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
        batchPayments.addRecipient('MEXICO{enter}' ,'MXN{enter}' ,email1)
        newRecipient.addBankDetailsWithClabe('AFIRMXMT','002010077777777771')
        const lName1 = batchPayments.generateRandomString(6)
        batchPayments.individualRecipient('MEXICO MXN ET',lName1,'MEXICO{enter}')
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
        let name1 = 'MEXICO MXN ET'+' ' + lName1+'{enter}'
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