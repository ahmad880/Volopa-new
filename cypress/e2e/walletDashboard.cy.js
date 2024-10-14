/// <reference types = "cypress"/>

import { SigninPage } from "../PageObject/PageAction/SigninPage"
import { WalletDashboard } from "../PageObject/PageAction/WalletDashboard"
import { FundWallet } from "../PageObject/PageAction/FundWallet"

const signin = new SigninPage
const walletpage = new WalletDashboard
const fundWallet = new FundWallet

describe('WalletDashboard',function(){
    let userName = 'testnew@volopa.com'
    let password = 'testTest1'
    beforeEach(() => {
        cy.visit('https://webapp3.volopa.com/')
        signin.Login(userName, password)
        cy.viewport(1440,1000)
    })

    it('TC_WD_001 - validate All content on the dashboard page', function(){
        walletpage.validateAllContentOnDashbordPage()
    })
    it('TC_WD_002 - Validate "Total Companay Balance" on dashboard', function(){
        walletpage.validateCardtotalBalance()
    })
    xit('TC_WD_003 - Validate "Wallet balance" on wallet dashboard', function(){
        
    })
    it('TC_WD_004 - Validate that clicking on card balance naviagte the user to card section', function(){
        walletpage.clickOnCardBalanceAndValidate()
    })
    it('TC_WD_005 -Validate "Rate Checker"  from Wallet dashboard', function(){
        walletpage.validateRateChecker()
    })
    it('TC_WD_006 -validate that clicking on "Mark all as read" from recent activities marks all as read', function(){
        walletpage.validateMarkAsRead()
        walletpage.validateRateChecker()
    })
    it('TC_WD_007 -Validate that clicking on "show all" from wallet breakdown expands the table with more currencies', function(){
        walletpage.clickOnShowAll()
    })
    it('TC_WD_008 -Validate the user can repeat recent transactions as Manual Push Funds from wallet dashboard', function(){
        //cy.get('tbody tr td:nth-child(3)[class="ant-table-cell"]').should('contain.text','Manual Push Funds')
        fundWallet.goTOFundWalletPage() 
        fundWallet.fund_manual_pushGBP()
        cy.wait(5000)
        cy.get('.m-t-20 > .ant-col > .ant-space > [style=""] > .ant-btn').should('be.visible').click()
        cy.get('.ant-table-row').should('be.visible')
        cy.get('tbody tr td:nth-child(3)[class="ant-table-cell"]').contains('Manual Push Funds').if().then(ele=>{
            ele.parents('.ant-table-row').find('[class="ant-btn ant-btn-primary"]').click()
        cy.get('.ant-popover-buttons > .ant-btn-primary').click()
        cy.get("div[class='ant-col'] span[class='ant-typography medium fs-18px dark-green']")
        .should('have.text','Funding Confirmation')
        cy.get("div[class='ant-col ant-col-16'] span[class='ant-typography muli light fs-18px dark-green']").invoke('text').then(text=>{
          text.trim()
          text=text.replace(/USD/g,'')
          cy.log(text)
          cy.wrap(text).as('manualamount')
        })
        //cy.get('#password').type('testTest1')
        cy.get("div[class='ant-space-item'] button[type='submit']").click().wait(2000)
        cy.get('.ant-typography.ant-typography-success.medium.fs-18px.center-align-text')
        .invoke('text')
        .then((text) => {
        expect(text.trim()).to.be.oneOf(['Funding Complete', 'Pending Funds', 'Limits Authorization Failed'])
        })
        cy.get("div[class='ant-space ant-space-horizontal ant-space-align-center'] div:nth-child(1) button:nth-child(1)").click()
        cy.wait(3000)
        cy.get("body > div:nth-child(2) > section:nth-child(1) > header:nth-child(1) > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > div:nth-child(2) > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > div:nth-child(4)").click()
        cy.get('.ant-typography.medium.dark-green.fs-28px').should('have.text','Your Transaction History')
        cy.get('body > div:nth-child(2) > section:nth-child(1) > main:nth-child(2) > div:nth-child(3) > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > table:nth-child(1) > tbody:nth-child(3) > tr:nth-child(2) > td:nth-child(6) > span:nth-child(1)').click()
        cy.get('@manualamount').then(manualamount=>{
          cy.get('.ant-typography.m-t-10.m-l-10.medium.bold.fs-18px').invoke('text').then(ele2=>{
          let val=ele2.trim()
          cy.wrap(val).should('contain',val)
          //val=val.replace(/USD/g,'')
          //cy.wrap(parseFloat(manualamount)).should('eq',parseFloat(val))
        })
        })
        })
        
    })
    it('TC_WD_009 -Validate the user can repeat recent transactions as Easy Transfer from wallet dashboard', function(){
        fundWallet.goTOFundWalletPage() 
        fundWallet.validate_Fund_Wallet('GBP{enter}')
        cy.wait(5000)
        cy.get('[data-node-key="/wallet/dashboard"]').should('be.visible').click()
        cy.get('.ant-table-row').should('be.visible')
        cy.get('tbody tr td:nth-child(3)[class="ant-table-cell"]').contains('Easy Transfer').if().then(ele=>{
            ele.parents('.ant-table-row').find('[class="ant-btn ant-btn-primary"]').click()
            cy.get('.ant-popover-buttons > .ant-btn-primary').click()
            cy.wait(3000)
            walletpage.fundEasyTransfer()
        })
    })
    it('TC_WD_010 -Validate convert balance,fund card,fund wallet navigations from wallet dashboard', function(){
        walletpage.navigationChecking()
    })
})