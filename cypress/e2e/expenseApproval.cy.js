/// <reference types = "cypress"/>

import { SigninPage } from "../PageObject/PageAction/SigninPage"
import { ExpenseApproval } from "../PageObject/PageAction/ExpenseApproval"

const signin = new SigninPage
const expenseApproval = new ExpenseApproval

describe('Transaction History - Filter Approval Status', function () {
    let userName = 'CTS_client_UK@gmail.com'
    let password = 'testTest1'

    beforeEach(() => {
        cy.window().then((win) => {
            win.localStorage.clear();
            win.sessionStorage.clear();
        });
        cy.visit('https://webapp02.mybusiness.volopa-dev.com/')
        signin.Login(userName, password)
        cy.viewport(1440, 1000)
        expenseApproval.goToTransactionHistory()
        expenseApproval.waitForTableLoad()
    })

    it('TC_EA_001 - Verify that filtering by "Unsubmitted" shows only Unsubmitted rows, or the empty state when none exist', function () {
        expenseApproval.selectApprovalStatusFilter('unsubmitted')
        expenseApproval.validateRowsMatchStatus('unsubmitted')
    })

    it('TC_EA_002 - Verify that filtering by "In review" shows only In review rows, or the empty state when none exist', function () {
        expenseApproval.selectApprovalStatusFilter('in-review')
        expenseApproval.validateRowsMatchStatus('in-review')
    })

    it('TC_EA_003 - Verify that filtering by "More Information required" shows only More Information required rows, or the empty state when none exist', function () {
        expenseApproval.selectApprovalStatusFilter('more-info-required')
        expenseApproval.validateRowsMatchStatus('more-info-required')
    })

    it('TC_EA_004 - Verify that filtering by "Approved" shows only Approved rows, or the empty state when none exist', function () {
        expenseApproval.selectApprovalStatusFilter('approved')
        expenseApproval.validateRowsMatchStatus('approved')
    })

    it('TC_EA_005 - Verify that filtering by "Rejected" shows only Rejected rows, or the empty state when none exist', function () {
        expenseApproval.selectApprovalStatusFilter('unapproved')
        expenseApproval.validateRowsMatchStatus('unapproved')
    })
})

describe('Accounting Transactions (Expenses) - Filter Approval Status', function () {
    let userName = 'CTS_client_UK@gmail.com'
    let password = 'testTest1'

    beforeEach(() => {
        cy.window().then((win) => {
            win.localStorage.clear();
            win.sessionStorage.clear();
        });
        cy.visit('https://webapp02.mybusiness.volopa-dev.com/')
        signin.Login(userName, password)
        cy.viewport(1440, 1000)
        expenseApproval.goToAccountingExpenseTransactions()
    })

    it('TC_EA_006 - Verify that filtering by "Unsubmitted" shows only Unsubmitted rows, or the empty state when none exist', function () {
        expenseApproval.selectApprovalStatusFilter('unsubmitted')
        expenseApproval.validateRowsMatchStatus('unsubmitted')
    })

    it('TC_EA_007 - Verify that filtering by "In review" shows only In review rows, or the empty state when none exist', function () {
        expenseApproval.selectApprovalStatusFilter('in-review')
        expenseApproval.validateRowsMatchStatus('in-review')
    })

    it('TC_EA_008 - Verify that filtering by "More Information required" shows only More Information required rows, or the empty state when none exist', function () {
        expenseApproval.selectApprovalStatusFilter('more-info-required')
        expenseApproval.validateRowsMatchStatus('more-info-required')
    })

    it('TC_EA_009 - Verify that filtering by "Approved" shows only Approved rows, or the empty state when none exist', function () {
        expenseApproval.selectApprovalStatusFilter('approved')
        expenseApproval.validateRowsMatchStatus('approved')
    })

    it('TC_EA_010 - Verify that filtering by "Rejected" shows only Rejected rows, or the empty state when none exist', function () {
        expenseApproval.selectApprovalStatusFilter('unapproved')
        expenseApproval.validateRowsMatchStatus('unapproved')
    })
})
