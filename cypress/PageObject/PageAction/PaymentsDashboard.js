const variable1= require('../PageElements/PaymentsDashboard.json')
const variable= require('../PageElements/WalletDashboard.json')

export class PaymentsDashboard {
    clearCache(){
        sessionStorage.clear()
        cy.clearAllCookies({ log: true })
        cy.clearAllLocalStorage('your item', { log: true })
        cy.clearAllSessionStorage()
    }
    goToPaymentsDashborad(){
        cy.get(variable1.paymentsDashboardLocators.menuBtn).should('be.visible').click()
        cy.get(variable1.paymentsDashboardLocators.paymentsDashboardBtn).should('be.visible').click()
        cy.get(variable1.paymentsDashboardLocators.paymentsDashbordHeading).should('contain.text','Payments Dashboard')
    }
    validateCardtotalBalance(){
        cy.wait(9000)
        cy.get(variable.walletDashboardLocators.totalCompanyBalanceValue).eq(0).then((value1)=>{
         let Total=value1.text().trim()
        Total = Total.replace(/,/g, '').replace(/[\p{Sc}]/gu, ' ').replace(/&nbsp;/g, '');
        cy.log(Total)
       let wbalance, cbalance
        cy.wait(2000)
        cy.get(variable.walletDashboardLocators.walletBalanceValue).eq(1).then((ele)=>{
         wbalance= ele.text().trim()
         wbalance = wbalance.replace(/,/g, '').replace(/[\p{Sc}]/gu, ' ');
         cy.log(wbalance)
         cy.wait(2000)
         cy.get(variable.walletDashboardLocators.cardsBalanceValue).then((ele1)=>{
           cy.log(ele1)
           cbalance=ele1.text().trim()
           cbalance = cbalance.replace(/,/g, '').replace(/[\p{Sc}]/gu, ' ');
           cy.log(cbalance)
           const  value =(parseFloat(wbalance)+parseFloat(cbalance)).toFixed(2);
           cy.log('Total value:', value);
           cy.log(Total)
           cy.wrap(parseFloat(value)).should('eq', parseFloat(Total));
        })
        })
        })
    }
    goToAddRecipient(){
        cy.get(variable1.paymentsDashboardLocators.AddARecipient).click()
        cy.get(variable1.paymentsDashboardLocators.recipientListPageHeading).should('contain.text','Recipient List')
    }
    goToNewPayment(){
        cy.get(variable1.paymentsDashboardLocators.newPayment).click()
        cy.get(variable1.paymentsDashboardLocators.createAPayment).should('contain.text','Create a Payment')
    }
    goToNewBatchPayments(){
        cy.get(variable1.paymentsDashboardLocators.newBatchPayment).click()
        cy.get(variable1.paymentsDashboardLocators.batchPaymentHeading).should('contain.text','Batch Payments')
    }
    validateRecentActivity(){
        cy.get(variable1.paymentsDashboardLocators.recentActivity).should('contain.text','Recent Activity - ')
        cy.get(variable1.paymentsDashboardLocators.recentActivities).should('be.visible')
    }
    validateFrequentRecipients(){
        cy.get(variable1.paymentsDashboardLocators.frequentRecipientsList).eq(0).should('exist')
        cy.get(variable1.paymentsDashboardLocators.viewAllBtn).eq(0).should('be.visible').click()
        cy.get(variable1.paymentsDashboardLocators.recipientListPageHeading).should('contain.text','Recipient List')
    }
    clickOnPayBtn(){
        cy.get(variable1.paymentsDashboardLocators.frequentRecipientsList).eq(0).should('exist')
        cy.get(variable1.paymentsDashboardLocators.payBtn).click()
        cy.get(variable1.paymentsDashboardLocators.createAPayment).should('contain.text','Create a Payment')
    }
    validateRecentPayments(){
        cy.get(variable1.paymentsDashboardLocators.recentPayments).should('contain.text','Recent Payments')
        cy.get(variable1.paymentsDashboardLocators.recentPaymentsSection).should('exist')
        cy.get(variable1.paymentsDashboardLocators.viewAllBtn).eq(1).should('be.visible').click()
        cy.get(variable1.paymentsDashboardLocators.paymentHistoryHeading).should('contain.text','Payment History')
    }
    clickOnRepeatBtn(){
        cy.get(variable1.paymentsDashboardLocators.recentPayments).should('contain.text','Recent Payments')
        cy.get(variable1.paymentsDashboardLocators.repeatBtn).should('contain.text','Repeat').click()
        cy.get(variable1.paymentsDashboardLocators.createAPayment).should('contain.text','Create a Payment')
    }
    deleteRecipient(){
        cy.get('[data-row-key="0"] > :nth-child(1)').click()
        cy.get(':nth-child(2) > .ant-btn').click()
        cy.get('.ant-popover-inner-content').should('be.visible')
        cy.get('.ant-popover-buttons > .ant-btn-primary').click()
        cy.wait(4000)
    }
}
