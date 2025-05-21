export class massPayments {

    gotoFileUpload(){
        cy.get('#rc-tabs-0-tab-\\/payments\\/batch-payments').should('be.visible').should('contain.text','Batch Payments').click()
        cy.get('body > div:nth-child(2) > section:nth-child(1) > main:nth-child(2) > div:nth-child(2) > div:nth-child(1) > div:nth-child(1) > div:nth-child(2) > div:nth-child(1) > div:nth-child(1) > div:nth-child(2)')
        .should('be.visible').should('contain.text','File Upload').click()
        cy.get('.ant-typography.medium.dark-green.fs-28px').should('be.visible').should('contain.text','File Upload')
    }
    gotoTemplateCurrency(currency, CCYHeading){
        cy.get('.ant-select-selector').should('be.visible').click().type(currency)
        cy.get("span[class='ant-select-selection-item'] div[class='ant-space ant-space-horizontal ant-space-align-center']").should('contain.text',CCYHeading)
    }
    downloadTemplate(){
        cy.get('[style="padding-left: 5px; padding-right: 5px;"] > .ant-btn').should('be.enabled').click()
    }
    guidenavigation() {
        cy.get('.ant-spin-dot.ant-spin-dot-spin').should('not.exist') 
        cy.get('a:has(.ant-btn)') // Select the <a> that contains the button
    .should('be.visible')
    .should('contain.text', 'Completing the file upload template')
    .then($a => {
      const url = $a.attr('href'); // Correctly get href from <a>
      expect(url).to.include('https://volopa.com/docs'); // Validate it

      // Optional: Visit the URL to validate the page
      cy.visit(url);
    });
    }
    fileUploader(){
        cy.get('.ant-spin-dot.ant-spin-dot-spin').should('not.exist') 
        cy.get('.ant-upload-drag-container > .ant-row > :nth-child(2)').should('be.visible').should('contain.text','Click or drag file to this area to upload')
    }
    deleteUploadedFile(){
        cy.get('.ant-upload-list-item-name').should('be.visible')
        cy.get('button[title="Remove file"]').click()
        //cy.get('body > div:nth-child(2) > section:nth-child(1) > main:nth-child(2) > div:nth-child(1) > div:nth-child(1) > div:nth-child(3) > div:nth-child(4) > div:nth-child(2) > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > button:nth-child(1)').should('be.disabled')
    }
    gotoFilesinProgress(){
        cy.get('.ant-row-end > .ant-col > .ant-btn').should('be.visible').should('contain.text','Files in Progress').click()
        cy.get('.ant-modal-body').should('be.visible')
        cy.get(':nth-child(2) > :nth-child(1) > [data-testid="container"] > .ant-card-body > :nth-child(1) > .ant-col').should('contain.text','Files in Progress')
    }
    navigatingBackFromFip(){
        cy.get('.ant-modal-close-x').should('be.visible').click()
        cy.get('.ant-card-body > :nth-child(1) > .ant-col > .ant-typography').should('be.visible').should('contain.text','File Upload')
    }
    deleteFip(){
        cy.get('tbody tr:nth-child(2) td:nth-child(5) div:nth-child(1) div:nth-child(2) button:nth-child(1)').should('be.visible').first().click()
        cy.get('div[class="ant-modal"] div[class="ant-modal-body"]').should('be.visible')
        cy.get('.ant-modal-body > :nth-child(1) > .ant-col > .ant-typography').should('contain.text','Are you sure you wish to delete this file?')
        cy.get('.m-t-20 > .ant-col > .dark-green').should('contain.text','All progress will be lost if you delete a file that has been uploaded or is currently in progress')
        cy.get('button[class="ant-btn ant-btn-primary ant-btn-dangerous"]').should('be.visible').should('be.enabled').click()
        cy.get('.ant-notification-notice').should('be.visible').should('contain.text','File successfully deleted.')
    }
    
}