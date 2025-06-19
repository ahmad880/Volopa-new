const variable1= require('../PageElements/WalletDashboard.json')
const variable= require('../PageElements/FundWallet.json')
export class WalletDashboard {
    validateAllContentOnDashbordPage(){
        cy.get(variable1.walletDashboardLocators.totalCompanyBalance).should('contain.text','Total Company Balance')
        cy.get(variable1.walletDashboardLocators.walletBalance).should('contain.text','Wallet Balance')
        cy.get(variable1.walletDashboardLocators.cardsBalance).should('contain.text','Cards Balance')
        cy.get(variable1.walletDashboardLocators.convertBalances).should('contain.text','Convert Balances')
        cy.get(variable1.walletDashboardLocators.fundCard).eq(1).should('contain.text','Fund Card')
        cy.get(variable1.walletDashboardLocators.fundWallet).eq(2).should('contain.text','Fund Wallet')
        cy.get(variable1.walletDashboardLocators.RecentActivity).should('contain.text','Recent Activity - ')
        cy.get(variable1.walletDashboardLocators.walletBreakdown).should('contain.text','Wallet Breakdown')
        cy.get(variable1.walletDashboardLocators.rateChecker).should('contain.text','Rate Checker')
        cy.get(variable1.walletDashboardLocators.recentFundingHistory).should('contain.text','Recent Funding History')
    }
    validateCardtotalBalance(){
        cy.wait(9000)
        cy.get(variable1.walletDashboardLocators.totalCompanyBalanceValue).eq(0).then((value1)=>{
        let Total=value1.text().trim()
        Total = Total.replace(/,/g, '').replace(/[\p{Sc}]/gu, ' ').replace(/&nbsp;/g, '');
        cy.log(Total)
        let wbalance, cbalance
        cy.wait(2000)
        cy.get(variable1.walletDashboardLocators.walletBalanceValue).eq(1).then((ele)=>{
         wbalance= ele.text().trim()
         wbalance = wbalance.replace(/,/g, '').replace(/[\p{Sc}]/gu, ' ');
         cy.log(wbalance)
         cy.wait(2000)
         cy.get(variable1.walletDashboardLocators.cardsBalanceValue).then((ele1)=>{
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
    clickOnCardBalanceAndValidate(){
        cy.get(variable1.walletDashboardLocators.cardsBalance).click()
        cy.get(variable1.walletDashboardLocators.cardDashboard).should('contain.text','Cards Dashboard')
    }
    validateRateChecker(){
        cy.get(variable1.walletDashboardLocators.rateChecker).should('contain','Rate Checker')
        cy.get(variable1.walletDashboardLocators.convertTo).type('AUD{enter}')
        cy.get(variable1.walletDashboardLocators.convertFrom).type('GBP{enter}')
        cy.get(variable1.walletDashboardLocators.convertFromValue).type(2)
        cy.get(variable1.walletDashboardLocators.convertBtn).should('be.visible').click({force:true})
        //cy.url().should('include','convert-balances')
        cy.get("button[type='submit'] span").should('be.visible').click()
        cy.wait(3000)
        this.Verify_Convertion_Comleted()
    }
    Verify_Convertion_Comleted(){
        cy.get(variable1.walletDashboardLocators.convertBtn).click()
        cy.wait(4000)
        cy.get(variable1.walletDashboardLocators.assertion1).should('have.text',"Conversion Complete")
          cy.wait(3000)
          //assertion to check the amount on conversion complete popup and recent activity are same
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
              cy.wait(3000)
          cy.get(variable1.walletDashboardLocators.dashboard).click()
          cy.reload()
          cy.get(variable1.walletDashboardLocators.istrecent).click()
          cy.get(variable1.walletDashboardLocators.Valuee1).invoke('text').should('contain',c1)
          cy.get(variable1.walletDashboardLocators.Valuee2).invoke('text').should('contain',c2)
        })
    }
    validateMarkAsRead(){
        cy.get(variable1.walletDashboardLocators.markAsRead).click()
        cy.log('this step is just to avoid failure')
        cy.get(variable1.walletDashboardLocators.noRecentActivities).should('contain.text','No Recent Activities')
    }
    clickOnShowAll(){
        cy.get(variable1.walletDashboardLocators.showAllBtn).click()
        cy.wait(3000)
        cy.get(variable1.walletDashboardLocators.showAllBtn).click()
    }
    navigationChecking(){
        cy.get(variable1.walletDashboardLocators.convertBalances).click()
        cy.get(variable1.walletDashboardLocators.convertBalancesPage).should('contain.text','Convert Balances')
        cy.get(variable1.walletDashboardLocators.walletDashboard).click()
        cy.get(variable1.walletDashboardLocators.fundCard).eq(1).click()
        cy.get(variable1.walletDashboardLocators.fundCardSelection).should('contain.text','Fund Card Selection')
        cy.get(variable1.walletDashboardLocators.crossBtn).click()
        cy.get(variable1.walletDashboardLocators.fundWallet).eq(2).click()
        cy.get(variable1.walletDashboardLocators.fundWalletPage).should('contain.text','Fund Wallet')
    }
    fundEasyTransfer(){
        cy.get(variable.fundWalletLocators.popupheading).should('contain','Fund via Easy Transfer (Open Banking)')
        cy.get("div[class='ant-col ant-col-16'] span[class='ant-typography muli light fs-18px dark-green']").invoke('text').then(ele=>{
            let val1= ele.trim()
            cy.wrap(val1).should('contain','GBP').as('val1')
            cy.log(val1)
            
          })
          cy.get(variable.fundWalletLocators.popupconfirmxpath).click()
          cy.wait(10000)
          cy.get('[data-testid="select-bank-text"]').should('contain.text','Choose your bank')
          cy.get('[data-testid="search-input"]').type('Modelo')
          cy.get('.institution-card-hover').click() //removed the assertion for text
        
        //   cy.get(".pb-2.currency-style").invoke('text').then((ele)=>{
        //     amount1=ele.trim()
        //     amount1= amount1.replace(/£/g,'')
        //     cy.log('amount', amount1)
        //     cy.wrap(amount1).as('Amount')
        //   })
          cy.wait(2000)
          cy.get('[data-testid="footer-continue-button"]').click()
          cy.get('[data-testid="header-title"]').should('contain','Approve your payment')
          cy.get('strong').invoke('removeAttr', 'target').click()   
          cy.get('.ozone-heading-1').should('have.text','Model Bank')
          cy.get('.ozone-heading-3').should('have.text','Please enter your login details to proceed')
          cy.get(':nth-child(1) > .ozone-input').type('mits')
          cy.get('#passwordField').type('mits')
            cy.get('#loginButton').click({force:true})
            cy.get('.ozone-pis-heading-1').should('have.text','Single Domestic Payment Consents (PIS)')
            cy.get("#radio-10000109010102").click()
            cy.get('#confirmButton').click({force:true})
            cy.get('.ant-spin-dot').should('not.exist')
            cy.get('[class="ant-typography muli semi-bold fs-24px purple"]').should('contain.text','Funds could take up to 2 hours to be posted.')
            cy.get(':nth-child(2) > .ant-btn').click()
            cy.get(variable.fundWalletLocators.validationamoungt).click()
            cy.get('@val1').then(val1=>{
            cy.get('.ant-typography.m-t-10.m-l-10.medium.bold.fs-18px').invoke('text').then(ele1=>{
                let ele = ele1.split('.')
                let val= ele[0].trim()
              cy.wrap(val).should('contain','GBP')
              cy.log(val)
              //val=val.replace(/GBP/g,'')
              cy.wrap(val).should('eq',val1)  
            })
    })
    }
}