/// <reference types= "cypress" />

import { BulkCardControll } from "../PageObject/BulkCardControll"
import { SigninPage} from "../PageObject/PageAction/SigninPage"

const bulkCardControll = new BulkCardControll
const signin = new SigninPage

describe('Wallet Section ',function(){
    let userName = 'qwerty_admin_1'
    let password = 'testTest1'
    beforeEach(()=>{
        cy.visit('/')
        signin.Login(userName, password)
        cy.viewport(1440,1000)
    })
    it('TC_BCC-001 Validate that clicking on "bulk card control" from header navigate the user to bulk card control page',()=>{
        bulkCardControll.goToBulkCardControllpage()
    })
    it('TC_BCC-002 Validate that search functionality is working fine on bulk card control page',()=>{
        bulkCardControll.goToBulkCardControllpage()
        cy.get('.ant-input').type('Mrs. Carmen Ambassador')
    })
    it('TC_BCC-003 Validate that the pagination is working fine on bulk card control page for all tabs',()=>{
        bulkCardControll.goToBulkCardControllpage()
        cy.get(':nth-child(1) > .ant-pagination-next > .ant-pagination-item-link').click()
        cy.wait(2000)
        cy.get(':nth-child(1) > .ant-pagination-prev > .ant-pagination-item-link').click()
    })
    it('TC_BCC-004 Validate the pagination filters work as intended',()=>{
        bulkCardControll.goToBulkCardControllpage()
        cy.get(':nth-child(1) > .ant-pagination-options > .ant-select > .ant-select-selector').click()
    })
    it('TC_BCC-005 Validate that clicking on "select all" radio button selects all the cards',()=>{
        bulkCardControll.goToBulkCardControllpage()
        cy.get(':nth-child(2) > .ant-checkbox-wrapper > .ant-checkbox > .ant-checkbox-input').click({force:true})
    })
    it('TC_BCC-006 Validate that the user is able to add the daily limits on the card, if the card has no limits',()=>{
        bulkCardControll.goToBulkCardControllpage()
        bulkCardControll.editCardLimits(200.20,300.12)
    })
    it('TC_BCC-007 Verify that the updated limits overwrite the existing limits, if the card has already limits for both atm and POS',()=>{
        bulkCardControll.goToBulkCardControllpage()
        bulkCardControll.editCardLimits(200.20,300.12)
        bulkCardControll.editCardLimits(500.20,200.12)
    })
    it.only('TC_BCC-008 Verify that the "Remove Atm limit" and "Remove Pos limit" are functional and work as intended',()=>{
        bulkCardControll.goToBulkCardControllpage()
        //bulkCardControll.editCardLimits(200.20,300.12)
        bulkCardControll.removeCardsLimits()
    })
    it('TC_BCC-009 Verify that the "Remove Atm limit" and "Remove Pos limit" buttons are functional if the card has no limit for both',()=>{
        bulkCardControll.goToBulkCardControllpage()
    })
    it('TC_BCC-010 verify that the" remove Atm limit" button is enabled and working, if the card has only ATM limit',()=>{
        bulkCardControll.goToBulkCardControllpage()
    })

})