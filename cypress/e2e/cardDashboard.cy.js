/// <reference types = "cypress"/>

import { values } from "pdf-lib"
import { CardDashboard } from "../PageObject/CardDashboard"
import { SigninPage } from "../PageObject/PageAction/SigninPage"

const signin = new SigninPage
const cardDashboard = new CardDashboard

describe('CardDashboard TS_003 ',function(){
    let userName = 'alexceaki+0141@gmail.com'
    let password = 'testTest1'
    beforeEach(() => {
        cy.visit('https://uiredevelopment.volopa.com/')
        signin.Login(userName, password)
        cy.get('[class="ant-space-item"] [type="button"]').eq(0).click()
        cy.get(':nth-child(3) > .ant-card > .ant-card-body > .ant-space').should('contain.text','Cards').click()
        cy.viewport(1440,1000)
    })

    it ('TC_CD_001 - validate that the user is able to navigate to the card section from menu', function(){
        cardDashboard.vlidateMainPageHeading()
        cardDashboard.validateAllContentOnDashbordPage()
    })
    it ('TC_CD_002 -Validate that all the content on the dashboard is completely visible  ', function(){
        cardDashboard.vlidateMainPageHeading()
        cardDashboard.validateAllContentOnDashbordPage()
    })
    it ('TC_CD_003 -Validate that the the total company wallet balance is equal to the sum of wallet balance + card balance ', function(){
        cardDashboard.vlidateMainPageHeading()
        cardDashboard.validateCardtotalBalance()
    })
    it ('TC_CD_004 -Valiadte that the forward and backward arrow icons are functional on recent activity', function(){
        cardDashboard.vlidateMainPageHeading()
        cy.wait(6000)
        cy.get('.ant-space > :nth-child(2) > a').click({force:true})
        cy.wait(2000)
        cy.get('[style=""] > a').click({force:true})
    })
    it ('TC_CD_005 -Valiadte that clicking on "view all" from frequently used cards naviagte the user to the cards sectipn', function(){
        cardDashboard.vlidateMainPageHeading()
        cy.get("a[href='/cards/cards']").click()
        cy.get('.ant-typography.medium.dark-green.fs-28px').should('contain.text','Cards')
    })
    it ('TC_CD_006 -Valiadte that clicking on "view all" from card transaction history navigate the user to the transaction history page ', function(){
        cardDashboard.vlidateMainPageHeading()
        cy.get("a[href='/cards/transaction-history']").click()
        cy.get('.ant-typography.medium.dark-green.fs-28px').should('contain.text','Transaction History')
    })
    it ('TC_CD_007 - Validate that the frequently used cards is displaying 3 cards', function(){
        cardDashboard.vlidateMainPageHeading()
        cy.get('[class="ant-typography fs-25px medium dark-green"]').eq(0).should('contain.text','Frequently Used Cards')
        cy.get('[class="ant-card ant-card-bordered b-2-grey body-height-130 m-10"]').should('have.length.at.least', 3)

    })
    xit ('TC_CD_008 -Validate that when the user clicks on any transaction from card transaction history, it naviagtes to the specific card transaction page and verify it has correct data', function(){
        // cardDashboard.vlidateMainPageHeading()
        // cardDashboard.goToCardsPage()
        // cardDashboard.goToSpecificCardPage()
        // cy.get(':nth-child(5) > .ant-btn').click()
        // cy.wait(2000)
        // cy.get(':nth-child(5) > .ant-btn').click()
        // cy.get("input[placeholder='Enter Trigger Amount']").type('100')
        // cy.get("input[placeholder='Enter Fund by Amount']").type('100')
        // cy.wait(1000)
        // cy.get("button[ant-click-animating-without-extra-node='false']").click()
        // cy.get('.ant-notification-notice').should('exist')
    })
    xit ('TC_CD_009 -Validate that clicking on any card from frequently used navigates to the manage specific card page and verify it has same data', function(){
        cardDashboard.vlidateMainPageHeading()
        cy.get("[class='slick-slide slick-active slick-current'] [class='ant-typography fs-18px medium dark-green p-l-20']").invoke('text')
        .then(($element) => {
            const elementText = $element.text();
            const modifiedText = elementText.replace(/\u00a0/g, '');
            cy.log(modifiedText)
            cy.get("[class='slick-slide slick-active slick-current'] [class='ant-typography fs-18px medium dark-green right-align-text p-r-20']").then(($number) => {
                const number = $number.text()
                cy.get("[class='slick-slide slick-active slick-current'] [class='ant-card ant-card-bordered b-2-grey body-height-130 m-10']").click()
                cy.get('[class="ant-typography fs-18px medium dark-green"]').eq(0).invoke('text').then(($element1) => {
                    const elementText1 = $element1.text();
                    const modifiedText1 = elementText1.replace(/\u00a0/g, '');
                    cy.log(modifiedText1)
                    cy.get('[class="ant-typography fs-18px medium dark-green"]').eq(1).then(($number1) => {
                        const number1 = $number1.text()
                        expect(modifiedText).to.equal(modifiedText1)
                        expect(number1).to.equal(number)
                    })
                })
            })
        })
    })
    it ('TC_CD_010 -validate that the user is able to convert balance within a card from card dashboard', function(){
        cardDashboard.vlidateMainPageHeading()
        cardDashboard.convertBalanceFromCard()
        cardDashboard.validatecurrencyConversion('{enter}','GBP{enter}','10.00')
    })
    it ("TC_CD_011 -Validate that the user can't convert the balance if the 'convert from' amount is greater than the amount in the card ", function(){
        cardDashboard.vlidateMainPageHeading()
        cardDashboard.convertBalanceFromCard()
        cardDashboard.insuficientcurrencyConversion('{enter}','10.00')
    })
    it ('TC_CD_012 -Validate that the Fx Rate displays when user enter both amounts (convert from and convert to)', function(){
        cardDashboard.vlidateMainPageHeading()
        cardDashboard.convertBalanceFromCard()
        cardDashboard.validateFXRate('{enter}','GBP{enter}','10.00')
    })
    it('TC_CD_013 -Valiadte that confirm button is enabled when the user enter both amount for currency conversion', function(){
        cardDashboard.vlidateMainPageHeading()
        cardDashboard.convertBalanceFromCard()
        cardDashboard.selectCurrencies('{enter}','GBP{enter}')  
        cardDashboard.validateConvertButton('10.00')
    })
    it('TC_CD_014 -Verify that the correct amount is displayed on conversion complete pop up', function(){
        cardDashboard.vlidateMainPageHeading()
        cardDashboard.convertBalanceFromCard()
        cardDashboard.selectCurrencies('{enter}','GBP{enter}')  
        cardDashboard.validateConvertButton('10.00')
    })  
    it('TC_CD_015 -validate that clicking on "view all currencies"  from card balance table expands the table on the convert balance page', function(){
        cardDashboard.vlidateMainPageHeading()
        cardDashboard.convertBalanceFromCard()
        cardDashboard.verifyCardViewAllCurrecies()
    }) 
    it('TC_CD_016 -validate that clicking on "view all currencies"  from company Payment balance table expands the table on the convert balance page', function(){
        cardDashboard.vlidateMainPageHeading()
        cardDashboard.convertBalanceFromCard()
        cardDashboard.verifyCompanyPaymentAllCurrecies()
    }) 
    it('TC_CD_017 -Validate that user is able to fund the card successfully', function(){
        cardDashboard.vlidateMainPageHeading()
        cardDashboard.fundTheCard()
        cardDashboard.selectFundCardCurrencies('EUR{enter}','10.00')
        //cardDashboard.verifyCompanyPaymentAllCurrecies()
    }) 
    it('TC_CD_018 -Validate that the user cant fund the card if the amount is greater than the available balance from the company Payment balance', function(){
        cardDashboard.vlidateMainPageHeading()
        cardDashboard.fundTheCard()
        cardDashboard.insufficientFundCard('{enter}','10.00')
    })
    it('TC_CD_019 -Validate that the reset button remove the inputted data on new card fund page', function(){
        cardDashboard.vlidateMainPageHeading()
        cardDashboard.fundTheCard()
        cardDashboard.ResetFundCardValues('{enter}','10.00')
    })
    it('TC_CD_20 -Validate that the user is able to withdraw fund from the card successfully', function(){
        cardDashboard.vlidateMainPageHeading()
        cardDashboard.selectWithdrawCard()
        cardDashboard.withdrawFundFromCard('EUR{enter}','10.00')     
    })
    it('TC_CD_21 -Valiadte that the user cant withdarw fund from card if card balance is lower than eneterd amount', function(){
        cardDashboard.vlidateMainPageHeading()
        cardDashboard.selectWithdrawCard()
        cardDashboard.insufficientWithdrawFund('{enter}','10.00')     
    })
})