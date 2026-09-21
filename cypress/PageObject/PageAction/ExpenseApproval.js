const el = require('../PageElements/ExpenseApproval.json').expenseApprovalLocators;

const APPROVAL_STATUS_ROW_COLOR = {
    'unsubmitted':          'rgb(24, 24, 24)',   // #181818
    'in-review':            'rgb(13, 0, 199)',   // #0D00C7
    'more-info-required':   'rgb(242, 182, 110)',// #F2B66E
    'approved':             'rgb(16, 133, 72)',  // #108548
    'unapproved':           'rgb(151, 27, 47)',  // #971B2F (Rejected)
};

export class ExpenseApproval {
    goToTransactionHistory() {
        
        cy.url().should('not.include', '/login');
        cy.location('origin').then((origin) => {
            cy.visit(`${origin}/cards/transaction-history`);
        });
        cy.contains('Transaction History').should('be.visible');
    }

    
    goToAccountingExpenseTransactions() {
        cy.url().should('not.include', '/login');
        cy.location('origin').then((origin) => {
            cy.visit(`${origin}/accounting/configuration`);
        });

        cy.url().should('include', '/accounting/configuration');
        cy.contains('button', 'Refresh Data', { timeout: 30000 }).should('be.visible');
        cy.get('.ant-spin-spinning', { timeout: 30000 }).should('not.exist');
        cy.contains('.ant-tabs-tab', 'Transactions').click();
        cy.url().should('include', '/accounting/expense-transactions');
        cy.get(el.filterApprovalStatusBtn, { timeout: 30000 }).should('be.visible');
        this.waitForTableLoad();
    }

    waitForTableLoad() {
        cy.get(el.transactionTableLoadingSpin).should('not.exist');
    }

    selectApprovalStatusFilter(statusValue) {
        const radioLocator = el.filterApprovalStatusRadio.replace('{value}', statusValue);
        cy.get(el.filterApprovalStatusBtn).should('be.visible').trigger('mouseover');
        cy.get(radioLocator).should('exist').click({ force: true }).should('be.checked');
        this.waitForTableLoad();
    }

    validateRowsMatchStatus(statusValue) {
        const expectedColor = APPROVAL_STATUS_ROW_COLOR[statusValue];
        cy.get(el.transactionTableEmptyState).if('visible').then(() => {
            cy.get(el.transactionTableEmptyText).should('contain.text', 'No Data');
        }).else().then(() => {
            cy.get(el.transactionTableRows)
                .should('have.length.greaterThan', 0)
                .each(($row) => {
                    cy.wrap($row).find('td').first().should('have.css', 'border-left-color', expectedColor);
                });
        });
    }
}
