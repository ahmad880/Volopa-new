const variable= require('../PageElements/ConvertBalances.json')
const variable1= require('../PageElements/WalletDashboard.json')
export class ConvertBalances {
    goToConvertBalancesAndValidate(){
        cy.get(variable.convertBalances.convertBalance).click()
        cy.get(variable.convertBalances.mainHeading).should('contain.text','Convert Balances')
    }
    validateCompanyWalletBalance(){
        cy.get(variable.convertBalances.companyWalletBalance).should('contain.text','Company Wallet Balance')
    }
    validateViewAllCurrenciesBtn(){
        cy.get(variable.convertBalances.viewAllCurrenciesBtn).click()
        cy.wait(2000)
        cy.get(variable.convertBalances.viewAllCurrenciesBtn).click()
    }
    validateConvertBalance(){
        cy.wait(2000)
        cy.get(variable.convertBalances.convertTo).type('EUR{enter}')
        cy.get(variable.convertBalances.convertFrom).type('GBP{enter}')
        cy.wait(2000)
        cy.get(variable.convertBalances.convertToValue).type('2')
        cy.get(variable.convertBalances.convertBtn).click()
        cy.wait(3000)
        let c1;
        let c2;
        cy.get(variable1.walletDashboardLocators.value1).invoke('val').then((text1)=>{
             c1=text1.trim()
            cy.log('Value1:',c1);
        })
    
        cy.get(variable1.walletDashboardLocators.value2).invoke('val').then((text2)=>{
             c2=text2.trim()
            cy.log('Value2:',c2);
         }).then(()=>{
            cy.wait(2000)
        cy.get(variable1.walletDashboardLocators.dashboard).click()
        cy.reload()
        cy.get(variable1.walletDashboardLocators.istrecent).click()
        cy.get(variable1.walletDashboardLocators.Valuee1).invoke('text').should('contain',c1)
        cy.get(variable1.walletDashboardLocators.Valuee2).invoke('text').should('contain',c2)
      })
    }
    convertInsufficientBalance(){
        cy.wait(2000)
        cy.get(variable.convertBalances.convertTo).type('GBP{enter}')
        cy.get(variable.convertBalances.convertFrom).type('CAD{enter}')
        cy.wait(2000)
        cy.get(variable.convertBalances.convertFromValue).type('100')
        cy.get(variable.convertBalances.convertBtn).click()
        cy.wait(3000)
        cy.get(variable.convertBalances.insufficientPopUp).should('contain.text','Insufficient funds, please check your balance.')
    }
    convertZeroBalance(){
        cy.wait(2000)
        cy.get(variable.convertBalances.convertTo).type('GBP{enter}')
        cy.get(variable.convertBalances.convertFrom).type('CAD{enter}')
        cy.wait(2000)
        cy.get(variable.convertBalances.convertFromValue).type('0')
        cy.get(variable.convertBalances.convertBtn).should('be.disabled')
        //cy.wait(3000)
    }
    clickonConvertMore(){
        cy.wait(2000)
        cy.get(variable.convertBalances.convertTo).type('EUR{enter}')
        cy.get(variable.convertBalances.convertFrom).type('GBP{enter}')
        cy.wait(2000)
        cy.get(variable.convertBalances.convertFromValue).type('2')
        cy.get(variable.convertBalances.convertBtn).click()
        cy.wait(3000)
        cy.get(variable.convertBalances.convertMoreBtn).click()
        cy.get(variable.convertBalances.mainHeading).should('contain.text','Convert Balances')
    }
}