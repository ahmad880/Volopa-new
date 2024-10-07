/// <reference types = "cypress"/>

import { SigninPage } from "../PageObject/PageAction/SigninPage"
import { RecipientList } from "../PageObject/PageAction/RecipientList"
import { PaymentsDashboard } from "../PageObject/PageAction/PaymentsDashboard"
import { AdditionalCurrencies } from "../PageObject/PageAction/AdditionalCurrencies"

const signin = new SigninPage
const newRecipient = new AdditionalCurrencies
const paymentspage = new PaymentsDashboard
const recipientListpage = new RecipientList

describe('Recipient List',function(){
    let userName = 'testnew@volopa.com'
    let password = 'testTest1'
    beforeEach(() => {
        cy.visit('/')
        paymentspage.clearCache()
        signin.Login(userName, password)
        cy.viewport(1440,1000)
    })

    it('TC_RL_001 - Verify that user landed on the Recipient List page', function(){
        paymentspage.goToPaymentsDashborad()
        recipientListpage.goToRecipientListPage()
    })
    it('TC_RL_002 - Verify that serach bar is working accurately on "Recipient List" page', function(){
        paymentspage.goToPaymentsDashborad()
        recipientListpage.goToRecipientListPage()
        recipientListpage.validateSearchField('UK{enter}')
    })
    it('TC_RL_003 - Verify that user landed on Add Recipient page', function(){
        paymentspage.goToPaymentsDashborad()
        recipientListpage.goToRecipientListPage()
        recipientListpage.validateAddRecipient()
    })
    it('TC_RL_004 - Verify that user is able to add recipient', function(){
        paymentspage.goToPaymentsDashborad()
        recipientListpage.goToRecipientListPage()
        newRecipient.addRecipient('Austria{enter}' ,'THB{enter}')
        newRecipient.addBankDetails('AT145400087511432863','AGRXATWW')
        recipientListpage.individualRecipient('tester','Austria{enter}')
        newRecipient.saveRecipient()
    })
    xit('TC_RL_005 - Verify that accurate error messages are apearing while adding a recipient', function(){
        paymentspage.goToPaymentsDashborad()
        recipientListpage.goToRecipientListPage()
        recipientListpage.validateAddRecipient()
    })
    xit('TC_RL_006 - Verify that missing the required fields, user is not able to add recipients.', function(){
        paymentspage.goToPaymentsDashborad()
        recipientListpage.goToRecipientListPage()
        recipientListpage.validateAddRecipient()
    })
    it('TC_RL_007 - Verify that on clicking "Pay" button present on the Recipient List page, user navigates to New Payments page', function(){
        paymentspage.goToPaymentsDashborad()
        recipientListpage.goToRecipientListPage()
        recipientListpage.clickOnPayBtn()
    })
    it('TC_RL_008 - Verify that "Recipient Country" fields location is after City fields and it is visible on UI only for recipients with SEK to Sweden', function(){
        paymentspage.goToPaymentsDashborad()
        recipientListpage.goToRecipientListPage()
        newRecipient.addRecipient('SWEDEN{enter}' ,'SEK{enter}')
        recipientListpage.addBankDetails('SE9395348672527177463212','AAFCSEMM')
        recipientListpage.validateRecipientCountry()
    })
    it('TC_RL_009 - Verify that "Recipient Country" fields location is after City fields and it is visible on UI only for recipients with DKK to Denmark', function(){
        paymentspage.goToPaymentsDashborad()
        recipientListpage.goToRecipientListPage()
        newRecipient.addRecipient('DENMARK{enter}' ,'DKK{enter}')
        recipientListpage.addBankDetails('DK1150518423211772','AKSHDK22')
        recipientListpage.validateRecipientCountry()
    })
    it('TC_RL_010 - Verify that "Recipient Country" fields location is after City fields and it is visible on UI only for recipients with NOK to Norway', function(){
        paymentspage.goToPaymentsDashborad()
        recipientListpage.goToRecipientListPage()
        newRecipient.addRecipient('NORWAY{enter}' ,'NOK{enter}')
        recipientListpage.addBankDetails('NO9386011117947','ADNANOKK')
        recipientListpage.validateRecipientCountry()
    })
    it('TC_RL_011 - Verify that "Recipient Country" is a mandatory field for the users NOK to Norway', function(){
        paymentspage.goToPaymentsDashborad()
        recipientListpage.goToRecipientListPage()
        newRecipient.addRecipient('NORWAY{enter}' ,'NOK{enter}')
        recipientListpage.addBankDetails('NO9386011117947','ADNANOKK')
        recipientListpage.validateRecipientCountry()
        recipientListpage.verifyRecipientCountryfield()
    })
    it('TC_RL_012 - Verify that "Recipient Country" is a mandatory field for the users DKK to DENMARK', function(){
        paymentspage.goToPaymentsDashborad()
        recipientListpage.goToRecipientListPage()
        newRecipient.addRecipient('DENMARK{enter}' ,'DKK{enter}')
        recipientListpage.addBankDetails('DK1150518423211772','AKSHDK22')
        recipientListpage.validateRecipientCountry()
        recipientListpage.verifyRecipientCountryfield()
    })
    it('TC_RL_013 - Verify that "Recipient Country" is a mandatory field for the users SEK to SWEDEN', function(){
        paymentspage.goToPaymentsDashborad()
        recipientListpage.goToRecipientListPage()
        newRecipient.addRecipient('SWEDEN{enter}' ,'SEK{enter}')
        recipientListpage.addBankDetails('SE9395348672527177463212','AAFCSEMM')
        recipientListpage.validateRecipientCountry()
        recipientListpage.verifyRecipientCountryfield()
    })
    it('TC_RL_014 - Verify that clicking on a recipient, user is able to navigate to Recipient Details page', function(){
        paymentspage.goToPaymentsDashborad()
        recipientListpage.goToRecipientListPage()
        recipientListpage.validateRecipientDetails()
    })
    it('TC_RL_015 - Verify that clicking "Remove" button, user is able to remove a recipient', function(){
        paymentspage.goToPaymentsDashborad()
        recipientListpage.goToRecipientListPage()
        recipientListpage.validateRecipientDetails()
        recipientListpage.clickOnRemoveBtn()
    })
    it('TC_RL_016 - Verify that clicking "View History" button,user should be on "Payment History" page.', function(){
        paymentspage.goToPaymentsDashborad()
        recipientListpage.goToRecipientListPage()
        recipientListpage.validateRecipientDetails()
        recipientListpage.validateVeiwHistoryBtn()
    })
    it('TC_RL_017 - Validate that the pagination is working fine on "Recipient List" page', function(){
        paymentspage.goToPaymentsDashborad()
        recipientListpage.goToRecipientListPage()
       recipientListpage.validatePagination()
    })
    it('TC_RL_018 - Validate the pagination filters work as intended', function(){
        paymentspage.goToPaymentsDashborad()
        recipientListpage.goToRecipientListPage()
        recipientListpage.validatePaginationFilters('20 / page')
        cy.wait(2000)
        recipientListpage.validatePaginationFilters('50 / page')
    })
    it('TC_RL_019 - Verify that by default there should be 10 recipents in Recipients List page.', function(){
        paymentspage.goToPaymentsDashborad()
        recipientListpage.goToRecipientListPage()
        recipientListpage.validateDefaultPaginationFilter()
    })
    it('TC_RL_020 - Verify that user is able to delete recipients', function(){
        paymentspage.goToPaymentsDashborad()
        recipientListpage.goToRecipientListPage()
        //run the loop to that index (how many recipients you want to delete)
        for (let i = 0; i < 1; i++) {
            recipientListpage.deleteRecipient();
            cy.wait(1000); 
        }
    })
})