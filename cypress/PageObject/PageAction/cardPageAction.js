const variable3= require('../PageElements/card.json')
export class cardPageActions{
    card_currency_conversion(){
       cy.get(variable3.cardPageLocators.menuButton).click()
       cy.get(variable3.cardPageLocators.cardButton).click()
       cy.get(variable3.cardPageLocators.cardDashboard).should('have.text','Cards Dashboard')
       cy.get(variable3.cardPageLocators.convet_balance).click()
       cy.get(variable3.cardPageLocators.card_selection).should('have.text','Convert Balance Card Selection')
       cy.get(variable3.cardPageLocators.confirmCard).click()
       cy.get(variable3.cardPageLocators.convert_balance_page).should('have.text','Convert Balances')
       cy.get(variable3.cardPageLocators.convertTo).type('USD{enter}')
       cy.wait(4500)
       cy.get(variable3.cardPageLocators.convertFrom).type('EUR{enter}')
       cy.wait(4500)
       cy.get(variable3.cardPageLocators.value).type(10)
       cy.get(variable3.cardPageLocators.convertButton).should('be.enabled')
       cy.get(variable3.cardPageLocators.convertButton).click()
       cy.wait(6000)
       cy.get(variable3.cardPageLocators.conversion_complete).should('have.text','Conversion Complete')
       cy.wait(3000)
       cy.get(variable3.cardPageLocators.cancelButton).click()

    }
    fundCard(){
        cy.get(variable3.cardPageLocators.menuButton).click()
       cy.get(variable3.cardPageLocators.cardButton).click()
       cy.get(variable3.cardPageLocators.cardDashboard).should('have.text','Cards Dashboard')
       cy.get(variable3.cardPageLocators.fundCard).click()
       cy.get(variable3.cardPageLocators.card_selection1).should('have.text','Fund Card Selection')
       cy.get(variable3.cardPageLocators.confirmCard1).click()
       cy.get(variable3.cardPageLocators.new_card_fund).should('have.text','New Card Fund')
       cy.get(variable3.cardPageLocators.convertTo1).click()

       
       for(let i=0;i<=10; i++){
        let currency =cy.get(variable3.cardPageLocators.itemLocator);
        if(currency==='NOK'){
            break;
        }
        cy.get(variable3.cardPageLocators.dropdown).type('{downarrow}')
       
       }
    // for (let i = 0; i < 5; i++) {
    //     cy.get(variable3.cardPageLocators.itemLocator).invoke('text').then((currency) => {
    //         if (currency === 'CAD') {
    //             // If the desired currency is found, click on it
    //             cy.get(variable3.cardPageLocators.itemLocator).click();
    //         } else {
    //             // If not found, type the down arrow to scroll down
    //             cy.get(variable3.cardPageLocators.dropdown).type('{downarrow}');
    //         }
    //     });
    //}


    // let found = false;

    // for (let i = 0; i < 5 && !found; i++) {
    //     cy.get(variable3.cardPageLocators.itemLocator).invoke('text').then((currency) => {
    //         if (currency.trim() === 'CAD') {
    //             found = true;  // Set found to true to break the loop
    //             cy.get(variable3.cardPageLocators.itemLocator).click();
    //         } else {
    //             cy.get(variable3.cardPageLocators.dropdown).type('{downarrow}');
    //         }
    //     });
    // }
    
       
    


      // cy.contains(variable3.cardPageLocators.dropdown,'NOK').click()
       
       cy.get(variable3.cardPageLocators.amount).type(100)
       cy.get(variable3.cardPageLocators.description).type('test script')
       cy.get(variable3.cardPageLocators.confirmButton).should('be.enabled')
       cy.get(variable3.cardPageLocators.confirmButton).click()
         //"dropdown":".ant-select-dropdown ant-select-dropdown-placement-bottomLeft  ant-select-dropdown-hidden"
    }
}