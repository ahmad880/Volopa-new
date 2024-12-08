export class BulkCardControll{
    goToBulkCardControllpage(){
        cy.get('[class="ant-space-item"] [type="button"]').eq(0).click()
        cy.get(':nth-child(3) > .ant-card > .ant-card-body > .ant-space').should('contain.text','Cards').click()
        cy.get('.ant-tabs-nav-list > :nth-child(4)').click()
    }
    editCardLimits(atmLimit,posLimit){
        cy.get(':nth-child(1) > .ant-checkbox-wrapper > .ant-checkbox > .ant-checkbox-input').eq(0).click()
        cy.get(':nth-child(1) > .ant-space > :nth-child(2) > .ant-input-number > .ant-input-number-input-wrap > .ant-input-number-input').type(atmLimit)
        cy.get('.ant-row-space-between > :nth-child(1) > .ant-space > :nth-child(3) > .ant-btn').click()
        cy.get('.ant-notification-notice').should('contain.text','Daily atm limits updated for selected cards')
        cy.wait(1000)
        cy.get(':nth-child(1) > .ant-checkbox-wrapper > .ant-checkbox > .ant-checkbox-input').eq(0).click()
        cy.get(':nth-child(2) > .ant-space > :nth-child(2) > .ant-input-number > .ant-input-number-input-wrap > .ant-input-number-input').type(posLimit)
        cy.get(':nth-child(2) > .ant-space > :nth-child(3) > .ant-btn').click()
        cy.get('.ant-notification-notice').should('contain.text','Daily pos limits updated for selected cards')
        cy.reload()                                         
        cy.get('.ant-spin-dot').should('not.exist')
        cy.get('tbody tr:nth-child(2) td:nth-child(3)').should('contain.text',atmLimit)
        cy.get('tbody tr:nth-child(2) td:nth-child(4)').should('contain.text',posLimit)
    }
    removeCardsLimits(){
        cy.get('[style="text-align: right;"] > .ant-space > [style=""] > .ant-btn').click()
        cy.get('.ant-notification-notice').should('contain.text','Daily limits updated for card')
        cy.wait(2000)
        cy.get('[style="text-align: right;"] > .ant-space > :nth-child(2) > .ant-btn').eq().click()
        cy.get('.ant-notification-notice').should('contain.text','Daily limits updated for card')
    }
}