export class BulkCardControll{
    goToBulkCardControllpage(){
        cy.get('[class="ant-space-item"] [type="button"]').eq(0).click()
        cy.get(':nth-child(3) > .ant-card > .ant-card-body > .ant-space').should('contain.text','Cards').click()
        cy.get('.ant-tabs-nav-list > :nth-child(4)').click()
    }
}