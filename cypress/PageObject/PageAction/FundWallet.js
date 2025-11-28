const variable= require('../PageElements/FundWallet.json')

export class FundWallet {
    goTOFundWalletPage(){
        cy.get(variable.fundWalletLocators.fundWallet).click()
        cy.get(variable.fundWalletLocators.fundWalletNavbar).should('contain.text','Fund Wallet')
    }
    validateAllContent(){
        cy.get(variable.fundWalletLocators.fundWalletHeading).should('contain.text','Fund Your Company Wallet')
        cy.get(variable.fundWalletLocators.fundWalletByAmount).should('contain.text','Fund Wallet By Amount')
        cy.get(variable.fundWalletLocators.walletBalance).should('contain.text','Company Wallet Balance')
    }
    viewAllCurrencies(){
        cy.wait(3000)
        cy.get(variable.fundWalletLocators.viewAllBtn).click()
        cy.wait(1000)
        cy.get(variable.fundWalletLocators.viewAllBtn).click()
    }
    validate_Fund_Wallet(funding) {
    // ---------------------------------
    // FUND WALLET – MAIN APP
    // ---------------------------------
    cy.get(variable.fundWalletLocators.fundWallet).click();
    cy.get(variable.fundWalletLocators.currency1).type(funding);
    cy.get(variable.fundWalletLocators.amount1).type("2");
    cy.get(variable.fundWalletLocators.description1).type("script testing");
    cy.get(variable.fundWalletLocators.confirmbutton).click();
    cy.get("div[class='ant-col ant-col-16'] span[class='ant-typography muli light fs-18px dark-green']").invoke('text').then(ele=>{
        let val1= ele.trim()
        cy.wrap(val1).should('contain','GBP').as('val1')
        cy.log(val1)
    })
    cy.get(variable.fundWalletLocators.popupconfirmxpath).click();
    
    // ---------------------------------
    // YAPILY FLOW
    // ---------------------------------
    cy.origin("https://payments.yapily.com", () => {
        Cypress.on("uncaught:exception", () => false);
        
        cy.get('[data-testid="search-input"]', { timeout: 20000 })
            .type("Modelo");
        cy.get(".institution-card__hover").click();
        cy.get('[data-testid="footer-continue-button"]').click();
        
        // Remove target="_blank" attribute to prevent new tab opening
        // Then click immediately to preserve session state
        cy.get('[data-testid="auth-continue-to-bank"]', { timeout: 10000 })
            .invoke('removeAttr', 'target')
            .click();
    });
    
    // --------------------------------------------------------
    // OZONE FLOW (Direct continuation after Yapily redirect)
    // --------------------------------------------------------
    cy.origin("https://auth1.obie.uk.ozoneapi.io", () => {
        Cypress.on("uncaught:exception", () => false);
        
        // PAGE 1: Login Screen
        cy.get('.ozone-heading-1', { timeout: 30000 })
            .should('contain.text', 'Model Bank');
        cy.get('.ozone-heading-3', { timeout: 20000 })
            .should('contain.text', 'Please enter your login details to proceed');
        
        cy.get(':nth-child(1) > .ozone-input', { timeout: 10000 })
            .should('be.visible')
            .clear()
            .type("mits");
        
        cy.get('#passwordField', { timeout: 10000 })
            .should('be.visible')
            .clear()
            .type("mits");
        
        // Add small wait before clicking login to ensure form is ready
        cy.wait(500);
        cy.get('#loginButton').should('be.enabled').click();
        
        // PAGE 2: Consent Screen
        cy.get('.ozone-pis-heading-1', { timeout: 30000 })
            .should('contain.text', 'Single Domestic Payment Consents (PIS)');
        
        cy.get('#radio-10000109010102', { timeout: 10000 })
            .should('be.visible')
            .click({ force: true });
        
        // Wait a moment for the radio selection to register
        cy.wait(500);
        cy.get('#confirmButton').should('be.enabled').click({ force: true });
    });
    
    // ---------------------------------
    // BACK TO MAIN APP (automatically returns to original origin)
    // ---------------------------------
    Cypress.on("uncaught:exception", () => false);
    
    cy.get(".ant-spin-dot", { timeout: 30000 }).should("not.exist");
    cy.get(".ant-typography.muli.semi-bold.fs-24px.purple", { timeout: 20000 })
        .should("contain.text", "Funds could take up to 2 hours to be posted.");
}


    fund_manual_push(funding1){
        cy.get(variable.fundWalletLocators.fundWallet).click()
        cy.get(variable.fundWalletLocators.fundWalletHeading).should('have.text','Fund Your Company Wallet')
        cy.get(variable.fundWalletLocators.calculatorheading).should('have.text','Fund Wallet By Amount')
      
        //cy.get(variable.fundWalletLocators.currency1).click()
        cy.get(variable.fundWalletLocators.currency1).type(funding1)
        cy.get('.ant-input-number-input-wrap').type(2)
        cy.get('.ant-col-xs-24 > .ant-form-item > .ant-row > .ant-form-item-control > .ant-form-item-control-input > .ant-form-item-control-input-content > .ant-select > .ant-select-selector > .ant-select-selection-item').click()
        cy.contains('Manual Push Fund').click()
        cy.get(variable.fundWalletLocators.description1).type('script testing')
        cy.get(variable.fundWalletLocators.confirmbutton).should('be.visible').click()
        cy.wait(5000)
        cy.get('.ant-card-grid > :nth-child(1) > .ant-col > .ant-typography')
        .should('have.text','Funding Confirmation')
        cy.get("div[class='ant-col ant-col-16'] span[class='ant-typography muli light fs-18px dark-green']").invoke('text').then(text=>{
          text.trim()
          text=text.replace(/USD/g,'')
          cy.log(text)
          cy.wrap(text).as('manualamount')
        })
       // cy.get('#password').type('testTest1')
        cy.get("button[type='submit'] span").click({force:true}).wait(2000)
        cy.get(".ant-typography.ant-typography-success.medium.fs-18px.center-align-text").invoke('text')
        .then((text) => {
        expect(text.trim()).to.be.oneOf(['Funding Complete', 'Pending Funds'])
        })
        cy.get("div[class='ant-space ant-space-horizontal ant-space-align-center'] div:nth-child(1) button:nth-child(1)").click()
        cy.wait(3000)
        cy.get("body > div:nth-child(2) > section:nth-child(1) > header:nth-child(1) > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > div:nth-child(2) > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > div:nth-child(4)").click()
        cy.get('.ant-typography.medium.dark-green.fs-28px').should('have.text','Your Transaction History')
        cy.get(variable.fundWalletLocators.validationamoungt).click()
        cy.get('@manualamount').then(manualamount=>{
          cy.get('.ant-typography.m-t-10.m-l-10.medium.bold.fs-18px').invoke('text').then(ele2=>{
          let val=ele2.trim()
          cy.wrap(val).should('contain',val)
          //val=val.replace(/USD/g,'')
          //cy.wrap(parseFloat(manualamount)).should('eq',parseFloat(val))
        })
        })
    }
    fund_collection_account(funding1){
        cy.get(variable.fundWalletLocators.fundWallet).click()
        cy.get(variable.fundWalletLocators.fundWalletHeading).should('have.text','Fund Your Company Wallet')
        cy.get(variable.fundWalletLocators.calculatorheading).should('have.text','Fund Wallet By Amount')
      
        //cy.get(variable.fundWalletLocators.currency1).click()
        cy.get(variable.fundWalletLocators.currency1).type(funding1)
        cy.get('.ant-input-number-input-wrap').type(2)
        cy.get('.ant-col-xs-24 > .ant-form-item > .ant-row > .ant-form-item-control > .ant-form-item-control-input > .ant-form-item-control-input-content > .ant-select > .ant-select-selector > .ant-select-selection-item').click()
        cy.contains('Volopa Collection Account').click()
        cy.get(variable.fundWalletLocators.description1).type('script testing')
        cy.get(variable.fundWalletLocators.confirmbutton).should('be.visible').click()
        cy.wait(5000)
        cy.get('.ant-card-grid > :nth-child(1) > .ant-col > .ant-typography')
        .should('have.text','Funding Confirmation')
        cy.get("div[class='ant-col ant-col-16'] span[class='ant-typography muli light fs-18px dark-green']").invoke('text').then(text=>{
          text.trim()
          text=text.replace(/USD/g,'')
          cy.log(text)
          cy.wrap(text).as('manualamount')
        })
       // cy.get('#password').type('testTest1')
        cy.get("button[type='submit'] span").click({force:true}).wait(2000)
        cy.get(".ant-typography.ant-typography-success.medium.fs-18px.center-align-text").invoke('text')
        .then((text) => {
        expect(text.trim()).to.be.oneOf(['Funding Complete', 'Pending Funds'])
        })
        cy.get("div[class='ant-space ant-space-horizontal ant-space-align-center'] div:nth-child(1) button:nth-child(1)").click()
        cy.wait(3000)
        cy.get("body > div:nth-child(2) > section:nth-child(1) > header:nth-child(1) > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > div:nth-child(2) > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > div:nth-child(4)").click()
        cy.get('.ant-typography.medium.dark-green.fs-28px').should('have.text','Your Transaction History')
        cy.get(variable.fundWalletLocators.validationamoungt).click()
        cy.get('@manualamount').then(manualamount=>{
          cy.get('.ant-typography.m-t-10.m-l-10.medium.bold.fs-18px').invoke('text').then(ele2=>{
          let val=ele2.trim()
          cy.wrap(val).should('contain',val)
          //val=val.replace(/USD/g,'')
          //cy.wrap(parseFloat(manualamount)).should('eq',parseFloat(val))
        })
        })
    }
    fund_manual_pushGBP(){
      cy.get(variable.fundWalletLocators.fundWallet).click()
      cy.get(variable.fundWalletLocators.fundWalletHeading).should('have.text','Fund Your Company Wallet')
      cy.get(variable.fundWalletLocators.calculatorheading).should('have.text','Fund Wallet By Amount')
    
      //cy.get(variable.fundWalletLocators.currency1).click()
      cy.get(variable.fundWalletLocators.currency1).type('GBP{enter}')
      cy.get('.ant-input-number-input-wrap').type(2)
      cy.get('.ant-col-xs-24 > .ant-form-item > .ant-row > .ant-form-item-control > .ant-form-item-control-input > .ant-form-item-control-input-content > .ant-select > .ant-select-selector > .ant-select-selection-item').click()
      cy.contains('Manual Push Fund').click()
      cy.get(variable.fundWalletLocators.description1).type('script testing')
      cy.get(variable.fundWalletLocators.confirmbutton).should('be.visible').click()
      cy.wait(5000)
      cy.get('.ant-card-grid > :nth-child(1) > .ant-col > .ant-typography')
      .should('have.text','Funding Confirmation')
      cy.get("div[class='ant-col ant-col-16'] span[class='ant-typography muli light fs-18px dark-green']").invoke('text').then(text=>{
        text.trim()
        text=text.replace(/USD/g,'')
        cy.log(text)
        cy.wrap(text).as('manualamount')
      })
      //cy.get('#password').type('testTest1')
      cy.get("button[type='submit'] span").click({force:true}).wait(2000)
    }
    fund_manual_pushWorngPass(){
      cy.get(variable.fundWalletLocators.fundWallet).click()
      cy.get(variable.fundWalletLocators.fundWalletHeading).should('have.text','Fund Your Company Wallet')
      cy.get(variable.fundWalletLocators.calculatorheading).should('have.text','Fund Wallet By Amount')
    
      //cy.get(variable.fundWalletLocators.currency1).click()
      cy.get(variable.fundWalletLocators.currency1).type('GBP{enter}')
      cy.get('.ant-input-number-input-wrap').type(2)
      cy.get('.ant-col-xs-24 > .ant-form-item > .ant-row > .ant-form-item-control > .ant-form-item-control-input > .ant-form-item-control-input-content > .ant-select > .ant-select-selector > .ant-select-selection-item').click()
      cy.contains('Manual Push Fund').click()
      cy.get(variable.fundWalletLocators.description1).type('script testing')
      cy.get(variable.fundWalletLocators.confirmbutton).should('be.visible').click()
      cy.wait(5000)
      cy.get("div[class='ant-col'] span[class='ant-typography medium fs-18px dark-green']")
      .should('have.text','Funding Confirmation')
      cy.get("div[class='ant-col ant-col-16'] span[class='ant-typography muli light fs-18px dark-green']").invoke('text').then(text=>{
        text.trim()
        text=text.replace(/USD/g,'')
        cy.log(text)
        cy.wrap(text).as('manualamount')
      })
     // cy.get('#password').type('testTest')
      cy.get("button[type='submit'] span").click({force:true}).wait(2000)
      cy.get('.ant-notification-notice').should('exist')
    }
    validateCompanyWalletBalance(){
      cy.get(variable.fundWalletLocators.walletBalance).should('contain.text','Company Wallet Balance')
      cy.get(variable.fundWalletLocators.rowInCompanyWalletBalance).should('be.visible')
    }
    validate_Fund_Wallet1(funding){
      let amount1,amount;
        cy.get(variable.fundWalletLocators.fundWallet).click()
        cy.get(variable.fundWalletLocators.fundWalletHeading).should('have.text','Fund Your Company Wallet')
        cy.get(variable.fundWalletLocators.calculatorheading).should('have.text','Fund Wallet By Amount')
        cy.get(variable.fundWalletLocators.currency1).type(funding)
        cy.get(variable.fundWalletLocators.amount1).type(2)
        //for validate at history page 
        cy.get(variable.fundWalletLocators.amount1).invoke('text').then(text=>{
          cy.wrap(text).as('Amount1')
        })
        cy.get(variable.fundWalletLocators.description1).type('script testing').wait(2000)
        cy.get(variable.fundWalletLocators.confirmbutton).should('be.visible').click({force:true})
        cy.wait(3000)
        cy.get(variable.fundWalletLocators.popupheading).should('contain','Fund via Easy Transfer (Open Banking)')
        cy.get("div[class='ant-col ant-col-16'] span[class='ant-typography muli light fs-18px dark-green']").invoke('text').then(ele=>{
        let val1= ele.trim()
        cy.wrap(val1).should('contain','EUR').as('val1')
        cy.log(val1)
    })
        cy.get(variable.fundWalletLocators.popupconfirmxpath).click()
        cy.wait(10000)
        // ---------------------------------
            // YAPILY FLOW
            // ---------------------------------
            cy.origin("https://payments.yapily.com", () => {
                Cypress.on("uncaught:exception", () => false);
                
                cy.get('.mb-3', { timeout: 20000 }).should('contain.text','Choose your bank')
                cy.get('[data-testid="search-input"]').type('Modelo')
                cy.get('.institution-card__hover').click()
                
                cy.wait(2000)
                cy.get('[data-testid="footer-continue-button"]').click()
                //cy.get('[data-testid="header-title"]', { timeout: 10000 }).should('contain','Approve your payment')
                
                // Remove target="_blank" attribute to prevent new tab opening
                // Then click immediately to preserve session state
                cy.get('[data-testid="auth-continue-to-bank"]', { timeout: 10000 })
                    .invoke('removeAttr', 'target')
                    .click();
            });
            
            // --------------------------------------------------------
            // OZONE FLOW (Direct continuation after Yapily redirect)
            // --------------------------------------------------------
            cy.origin("https://auth1.obie.uk.ozoneapi.io", () => {
                Cypress.on("uncaught:exception", () => false);
                
                // PAGE 1: Login Screen
                cy.get('.ozone-heading-1', { timeout: 30000 }).should('have.text','Model Bank')
                cy.get('.ozone-heading-3', { timeout: 20000 }).should('have.text','Please enter your login details to proceed')
                
                cy.get(':nth-child(1) > .ozone-input', { timeout: 10000 })
                    .should('be.visible')
                    .clear()
                    .type('mits')
                
                cy.get('#passwordField', { timeout: 10000 })
                    .should('be.visible')
                    .clear()
                    .type('mits')
                
                // Add small wait before clicking login to ensure form is ready
                cy.wait(500)
                cy.get('#loginButton').should('be.enabled').click({force:true})
                
                // PAGE 2: Consent Screen
                cy.get('.ozone-pis-heading-1', { timeout: 30000 }).should('have.text','Single Domestic Payment Consents (PIS)')
                
                cy.get("#radio-10000109010102", { timeout: 10000 })
                    .should('be.visible')
                    .click({force:true})
                
                // Wait a moment for the radio selection to register
                cy.wait(500)
                cy.get('#confirmButton').should('be.enabled').click({force:true})
            });
            
            // ---------------------------------
            // BACK TO MAIN APP
            // ---------------------------------
            Cypress.on("uncaught:exception", () => false);
            
            cy.get('.ant-spin-dot', { timeout: 30000 }).should('not.exist')
            cy.get('[class="ant-typography muli semi-bold fs-24px purple"]', { timeout: 20000 })
                .should('contain.text','Funds could take up to 2 hours to be posted.')
            cy.get(':nth-child(2) > .ant-btn').click()
            cy.get(variable.fundWalletLocators.validationamoungt).click()
            
            cy.get('@val1').then(val1=>{
                cy.get('.ant-typography.m-t-10.m-l-10.medium.bold.fs-18px').invoke('text').then(ele1=>{
                    let ele = ele1.split('.')
                    let val= ele[0].trim()
                    cy.wrap(val).should('contain','EUR')
                    cy.log(val)
                    cy.wrap(val).should('eq',val1)  
                })
            })
  }
}