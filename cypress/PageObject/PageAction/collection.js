const variable1= require('../PageElements/collection.json')

export class collection {
    goToCollection(){
        cy.get(variable1.collectionLocators.menuButton).click()
        //cy.get(variable1.collectionLocators.loadingIcon).should('not.exist')
        cy.get(variable1.collectionLocators.collectionFromMenu).should('contain.text','Collection').click()
        cy.get(variable1.collectionLocators.collectionHeading).should('be.visible').should('contain.text','Collections Dashboard')
    }
    getCurrencyBalance(currency) {
        cy.wait(4000);
    
        return cy.get('[class="ant-typography fs-18px semi-bold right-align-text"]')
            .then($elements => {
                // Filter the elements to find the one containing the currency
                const element = $elements.toArray().find(el => el.innerText.includes(currency));
                
                if (element) {
                    const text = element.innerText;
                    const amount = text.match(/[\d,]+\.\d{2}/)[0];
                    return cy.wrap(amount);
                } else {
                    cy.log('No currency found');
                    return cy.wrap('0.00');
                }
            });
    }
    
    
}
