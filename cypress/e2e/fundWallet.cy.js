/// <reference types = "cypress"/>

import { SigninPage } from "../PageObject/PageAction/SigninPage";
import { FundWallet } from "../PageObject/PageAction/FundWallet"

const signin = new SigninPage
const fundWallet = new FundWallet

describe('FundWallet ',function(){
    let userName = 'uk_test_1@volopa.com'
    let password = 'testTest1'
    beforeEach(() => {
        cy.window().then((win) => {
            win.localStorage.clear();
            win.sessionStorage.clear();
        });
        cy.visit('https://webapp08.volopa-dev.com')
        signin.Login(userName, password)
        cy.viewport(1440,1000)
    })
    it('TC_FW_001 -Validate the clicking on "fund wallet" from header navigate the user to "fund your company wallet page"', function(){
        fundWallet.goTOFundWalletPage() 
    })
    it('TC_FW_002 - Validate that the "company wallet balance" table is displayed on fund your company wallet page', function(){
        fundWallet.goTOFundWalletPage()
        fundWallet.validateCompanyWalletBalance()
        
    })
    it('TC_FW_003 - validate All content on the Fund Wallet page', function(){
        fundWallet.goTOFundWalletPage()
        fundWallet.validateAllContent()
    })
    it('TC_FW_004 - validate that clicking on the View allfrom the Company wallaet Balance display all currencies', function(){
        fundWallet.goTOFundWalletPage()
        fundWallet.viewAllCurrencies()
    })
    //Easy transfer
    it('TC_FW_005 - validate that the user is able to fund the company wallet with "euro" with easy transfer', function(){
        fundWallet.goTOFundWalletPage() 
        fundWallet.validate_Fund_Wallet1('EUR{enter}')
    })
    it('TC_FW_006 - validate that the user is able to fund the company wallet with "GBP" with easy transfer', function(){
        fundWallet.goTOFundWalletPage() 
        fundWallet.validate_Fund_Wallet('GBP{enter}')
    })
    //push funds
    it('TC_FW_007 - validate that the user is able to fund the company wallet with "euro" with manual push fund', function(){
        fundWallet.goTOFundWalletPage() 
        fundWallet.fund_manual_push('EUR{enter}')
    })
    it('TC_FW_008 - validate that the user is able to fund the company wallet with "GBP" with manual push fund', function(){
        fundWallet.goTOFundWalletPage() 
        fundWallet.fund_manual_pushGBP()
    })
    it('TC_FW_009 - validate that the user is able to fund the company wallet with "USD" with manual push fund', function(){
        fundWallet.goTOFundWalletPage() 
        fundWallet.fund_manual_push('USD{enter}')
    })
    // Volopa collection account
    it('TC_FW_010 - validate that the user is able to fund the company wallet with "euro" with Volopa Collection Account', function(){
        fundWallet.goTOFundWalletPage() 
        fundWallet.fund_collection_account('EUR{enter}')
    })
    it('TC_FW_011 - validate that the user is able to fund the company wallet with "USD" with Volopa Collection Account', function(){
        fundWallet.goTOFundWalletPage() 
        fundWallet.fund_collection_account('USD{enter}')
    })
    it('TC_FW_012 - validate that the user is able to fund the company wallet with "USD" with Volopa Collection Account', function(){
        fundWallet.goTOFundWalletPage() 
        fundWallet.fund_collection_account('GBP{enter}')
    })

    xit('TC_FW_013 - Validate that user cant fund the wallet if input wrong password on confirmation pop-up', function(){
        fundWallet.goTOFundWalletPage() 
        fundWallet.fund_manual_pushWorngPass()
    })
})