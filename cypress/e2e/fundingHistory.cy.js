/// <reference types = "cypress"/>

import { SigninPage } from "../PageObject/PageAction/SigninPage"
import { FundingHistory } from "../PageObject/PageAction/FundingHistory"

const signin = new SigninPage
const fundingHistory = new FundingHistory

describe('Funding History',function(){
  let userName = 'alexceaki+0141@gmail.com'
  let password = 'testTest1'
  beforeEach(() => {
    cy.visit('https://webapp3.volopa.com/')
      signin.Login(userName, password)
      cy.viewport(1440,1000)
  })
  it('TC-FH-001 - Validate the clicking on "funding history" from header navigate the user to "your transaction history" page', function(){
      fundingHistory.goToFundingHistoryPage()
  })
  it('TC-FH-002 - Validate that search functionality is working fine on "Your transaction history" page with admin', function(){
      fundingHistory.goToFundingHistoryPage()
      fundingHistory.validateSearchField('alex')
  })
  it('TC-FH-003 - Validate that search functionality is working fine on "Your transaction history" page with discription', function(){
      fundingHistory.goToFundingHistoryPage()
      fundingHistory.validateSearchField('Test')
  })
  it('TC-FH-004 - Validate that the pagination is working fine on "your transaction history" page', function(){
      fundingHistory.goToFundingHistoryPage()
      fundingHistory.validatePagination()
  })
  it('TC-FH-005 - Validate the pagination filters work as intended', function(){
    fundingHistory.goToFundingHistoryPage()
    fundingHistory.validatePaginationFilters('10 / page')
    fundingHistory.validateRows(10)
    fundingHistory.validatePaginationFilters('50 / page')
    fundingHistory.validateRows(50)
  })
  it('TC-FH-006 - Verify that by default there should be twenty transaction in transaction history page.', function(){
    fundingHistory.goToFundingHistoryPage()
    fundingHistory.validateDefaultPaginationFilter()
    fundingHistory.validateRows(20)
  })
  it('TC-FH-007 - Verify that the calendar filter gives the accurate result', function(){
    fundingHistory.goToFundingHistoryPage()
    fundingHistory.validateCelenderIcon()
    // changing will be pending
  })
  it('TC-FH-008 - Verify that sorting functionality is working as expected on Date column', function(){
    fundingHistory.goToFundingHistoryPage()
    fundingHistory.validateAscendingDateSorting()
    fundingHistory.validateDescendingDateSorting()
  })
  it('TC-FH-009 - Verify that sorting functionality is working as expected on Admin column', function(){
    fundingHistory.goToFundingHistoryPage()
    fundingHistory.valiadteAscendingAdminSorting()
    fundingHistory.valiadteDescendingAdminSorting()
  })
  it('TC-FH-010 - Verify that sorting functionality is working as expected on Amount column ', function(){
    fundingHistory.goToFundingHistoryPage()
    fundingHistory.validateAscendingAmountSorting()
    fundingHistory.validateDescendingAmountSorting()
  })
  it('TC-FH-011 - Verify that sorting functionality is working as expected on FundingMethod column', function(){
    fundingHistory.goToFundingHistoryPage()
    fundingHistory.valiadteAscendingFundingMethodSorting()
    fundingHistory.valiadteDescendingFundingMethodSorting()
  })
  it('TC-FH-012 - Verify that sorting functionality is working as expected on Status column', function(){
    fundingHistory.goToFundingHistoryPage()
    fundingHistory.validateAscendingStatusSorting()
    fundingHistory.validateDescendingStatusSorting()
  })
  it('TC-FH-013 - Verify that column have sorting icons with them', function(){
    fundingHistory.goToFundingHistoryPage()
    fundingHistory.validateSortingIcon()
  })
  it('TC-FH-014 - Verify that user is able to cancel the funding from funding details page', function(){
    fundingHistory.goToFundingHistoryPage()
    fundingHistory.goToAwaitingFundDetailPage()
    fundingHistory.cancelFunding()
  })
  it('TC-FH-015 - Verify that the user cannot cancel the transaction that has a "Complete" status', function(){
    fundingHistory.goToFundingHistoryPage()
    fundingHistory.goToCompleteFundDetailPage()
  })
  it('TC-FH-016 - Verify that clicking "return" from the funding details page navigate to the your transaction history page ', function(){
    fundingHistory.goToFundingHistoryPage()
    fundingHistory.goToAwaitingFundDetailPage()
    fundingHistory.clickOnReturnBtn()
  })
  xit('TC-FH-017 - Verify that the user can repeat the transaction if it has "Manual Push fund" status', function(){
    fundingHistory.goToFundingHistoryPage()
    
  })
  xit('TC-FH-018 - Verify that the user can repeat the transaction if it has "Easy Transfer" status', function(){
    fundingHistory.goToFundingHistoryPage()
    
  })
})