const variable = require('../PageElements/PaymentsHistory.json')

export class PaymentsHistory {
  goToPaymentsHistory(){
    cy.get(variable.paymentsHistoryPageLocators.paymentsHistoryHeader).should('be.visible').click()
    cy.get(variable.paymentsHistoryPageLocators.paymentsHistoryHeading).should('contain.text','Payment History')
  }
  validateSearchBar(name){
    cy.get(variable.paymentsHistoryPageLocators.loadingIcon).should('not.exist')
    cy.get(variable.paymentsHistoryPageLocators.SearchBar).should('exist').type(name)
    
  }
  validatePagination(){
    cy.get(variable.paymentsHistoryPageLocators.loadingIcon).should('not.exist')
      const isNextButtonEnabled = () => {
         return cy.get(variable.paymentsHistoryPageLocators.nextPageArrow).then($button => {
          return !$button.prop('disabled');
        });
        };
      
        // Loop until the "Next" button is disabled
      const validatePages = () => {
      isNextButtonEnabled().then(enabled => {
         if (enabled) {
            // Perform validations specific to each page
            // For example, assert that certain elements exist or have specific content
            cy.get(variable.paymentsHistoryPageLocators.rowFirst).eq(0).should('exist')
            // Click the "Next" button
            cy.get(variable.paymentsHistoryPageLocators.nextPageArrow).click();
            cy.get(variable.paymentsHistoryPageLocators.loadingIcon).should('not.exist')
            // Wait for the page to load (adjust as needed)
            //cy.wait(1000); // Adjust the wait time as needed
        
            // Recursively call the function to validate the next page
            validatePages();
          } 
          else {
            // Assert that the "Next" button is now disabled
            cy.get(variable.paymentsHistoryPageLocators.nextPageArrow).should('be.disabled')
      
            // Assert any element on the last page to confirm arrival (optional)
            // cy.get('.last-page-element').should('exist'); // Replace with actual selector for element on last page
          }
        });
      };
        
      // Start validating pages
    validatePages();
  }
  validatePaginationFilters(filter){
    cy.get(variable.paymentsHistoryPageLocators.loadingIcon).should('not.exist')
    cy.get(variable.paymentsHistoryPageLocators.pageFilters).click()
    cy.contains(filter).click()
  }
  validateDefaultPaginationFilter(filter){
    cy.get(variable.paymentsHistoryPageLocators.loadingIcon).should('not.exist')
    cy.get(variable.paymentsHistoryPageLocators.defaultPagination).should('contain.text', filter)
  }
  validateRows(row){
    cy.get(variable.paymentsHistoryPageLocators.loadingIcon).should('not.exist')
    cy.get(variable.paymentsHistoryPageLocators.allRows).should('have.length', row)
  }
  validateRepeatBtn(){
    cy.get('tbody tr:nth-child(2) td:nth-child(4)').invoke('text').then((text) => {
    const recipientName = text.trim(); // Store the text and remove any extra spaces
    cy.log(recipientName); // Logs the value for debugging
    cy.wrap(recipientName).as('recipientName')
    })
    cy.get('tbody tr:nth-child(2) td:nth-child(6)').invoke('text').then((text) => {
      const receiveAmount = text.trim().replace(/[^\d.]/g, '') // Store the text and remove any extra spaces
      cy.log(receiveAmount) // Logs the value for debugging
      cy.wrap(receiveAmount).as('receiveAmount')
    })
    cy.get(variable.paymentsHistoryPageLocators.repeatBtn).should('be.visible').click()
    cy.get(variable.paymentsHistoryPageLocators.repeatYesBtn).should('be.visible').click()
    cy.get(variable.paymentsHistoryPageLocators.createPaymentHeading).should('contain.text','Create a Payment')
    cy.get('[style="padding-left: 12px; padding-right: 12px; flex: 1 1 auto;"] > .ant-space > :nth-child(1) > .ant-typography')
    .invoke('text')
    .then((recipientName1) => {
    cy.get('@recipientName').then((recipientName) => {
      expect(recipientName1.trim()).to.equal(recipientName); // Compare the two texts
    });
    })
    cy.get(':nth-child(4) > :nth-child(2) > .ant-typography').invoke('text').then((receiveAmount1) => {
    cy.get('@receiveAmount').then((receiveAmount) => {
      expect(receiveAmount1.trim()).to.equal(receiveAmount); // Compare the two texts
    });
    })
    cy.get(variable.paymentsHistoryPageLocators.loadingIcon).should('not.exist')
    cy.get('.ant-row-end.m-t-20 > .ant-col > .ant-btn').should('be.visible').click()
    cy.get(variable.paymentsHistoryPageLocators.paymentConfirmation).should('be.visible').should('contain.text','Payment Confirmation')
    cy.get('.ant-row-center.m-t-20 > .ant-col > .ant-space > :nth-child(2) > .ant-btn').should('be.visible').click()
    cy.get('.ant-modal-body > :nth-child(1) > .ant-col').should('be.visible').should('contain.text',' Payment Booked - ')
  }
  goToDraftPayments(){
    cy.get(variable.paymentsHistoryPageLocators.draftnavBar).should('contain.text','Draft Payments').click()
    cy.get(variable.paymentsHistoryPageLocators.draftPaymentsBtn).should('be.visible').click()
    cy.get(variable.paymentsHistoryPageLocators.draftPaymentsHeading).should('contain.text','Draft Payments')
  }
  goToReviewPayments(){
    cy.get('.ant-spin-nested-loading > :nth-child(1) > .ant-spin > .ant-spin-dot').should('not.exist')
    cy.get(variable.paymentsHistoryPageLocators.reviewBtn).eq(1).should('be.visible').click()
    cy.get(variable.paymentsHistoryPageLocators.paymentConfirmation).should('contain.text','Payment Confirmation')
  }
  goToDraftPaymentsDashboard(){
    cy.get(variable.paymentsHistoryPageLocators.returnPaymentDashboard).should('be.visible').click()
    cy.get(variable.paymentsHistoryPageLocators.draftPaymentsHeading).should('contain.text','Draft Payments')
  }
  goToDeleteDreft(){
    cy.get(variable.paymentsHistoryPageLocators.deleteDraft).should('be.visible')
  }
  goToPaymentsHistoryBtn(){
    cy.get(variable.paymentsHistoryPageLocators.paymentsHistoryBtn).should('be.visible').click()
    cy.get(variable.paymentsHistoryPageLocators.paymentsHistoryHeading).should('contain.text','Payment History')
  }
  goToManualTrade(){
    cy.get(variable.paymentsHistoryPageLocators.loadingIcon).should('not.exist')
    cy.get(variable.paymentsHistoryPageLocators.manualTradeBtn).should('be.visible').click()
    cy.get(variable.paymentsHistoryPageLocators.manualTradeHeading).should('be.visible').should('contain.text','Manual Trade History')
  }
  goToSpecificManualTrade(){
    cy.get(variable.paymentsHistoryPageLocators.rowFirst).eq(0).should('be.visible').click()
    cy.get(variable.paymentsHistoryPageLocators.specificManualTradeHeading).should('be.visible').should('contain.text','Specific Manual Trade History')
  }
  validateDownloadPDF(){
    cy.get(variable.paymentsHistoryPageLocators.loadingIcon).should('not.exist')
    cy.get('.ant-row-end > .ant-btn').click()
  }
  verifyPaymentReports()
  {
    cy.get(variable.paymentsHistoryPageLocators.paymentReportsBtn).should('be.visible').should('contain.text','Payment Reports').click()
    cy.get(variable.paymentsHistoryPageLocators.paymentReportsHeading).should('be.visible').should('contain.text','Payment Reports')
  }
  selectReportsFilters(Month,monthFrom,monthTo)
  {
    var monthToRow=this.GetMonthRow(monthTo)
    var monthToColumn=this.GetMonthColumn(monthTo)
    cy.log(monthToRow)
    cy.log(monthToColumn)
    cy.get(variable.paymentsHistoryPageLocators.paymentReportsFilterButton).should('be.visible').should('contain.text','Filter').click()
    cy.get('#rc_select_6').invoke('removeAttr','unselectable').click()
    cy.get('#rc_select_6').invoke('removeAttr','readonly').click()
    cy.get('#rc_select_6').click().type(Month)
    cy.get(variable.paymentsHistoryPageLocators.FromMonthLabel).should('be.visible')
    cy.get(variable.paymentsHistoryPageLocators.ToMonthLabel).should('be.visible')
    cy.get(':nth-child(1) > .ant-picker > .ant-picker-input > input').click()
    cy.get('.ant-picker-cell-inner').contains(monthFrom).click()
    cy.wait(2000)
    cy.get(':nth-child(2) > .ant-picker > .ant-picker-input > input').click()
    cy.get('table').eq(2).find('tr').eq(monthToRow).find('td').eq(monthToColumn).contains(monthTo).click()
    
  }
  verifyPaymentReportsFilter(monthFrom,monthTo)
  {
    
    cy.get(':nth-child(2) > .ant-btn > span').should('be.visible').should('contain.text','Confirm').click()
    cy.wait(2000)
    cy.get('table').eq(0).then(table => {
      cy.wrap(table)
          .find('.ant-table-tbody tr td:nth-child(2)')
          .each(($element)=>{ 
                cy.log($element)
              cy.wrap($element)
              .invoke('text')                 
              .then((text) => {
                if(text!='')
                {
                  cy.log(text)
                  // cy.wait(2000)
                  const extractedMonth = text.substring(15,text.length-5); // Store the text in the variable
                  cy.log(extractedMonth) // Log the text
                  var datfrom = new Date('1 ' + monthFrom + ' 1999');
                  var monthFromNumber=datfrom.getMonth()+1
                  var datTo = new Date('1 ' + monthTo + ' 1999');
                  var monthToNumber=datTo.getMonth()+1
                  var datReport=new Date('1 ' + extractedMonth + ' 1999');
                  var monthReport=datReport.getMonth()+1
                  cy.log(monthFromNumber);
                  cy.log(monthToNumber)
                  cy.log(monthReport)
                  if(monthReport> 0)
                  {
                    expect(monthReport).to.be.within(monthFromNumber,monthToNumber)
                  }
                }
              });
              
          
        })
        });

  }
  GetMonthRow(monthTo)
  {
    if(monthTo==='Jan'||monthTo==='Feb' ||monthTo==='Mar')
    {
      return 0  
    }
    else if(monthTo==='Apr',monthTo==='May'||monthTo==='Jun')
    {
      return 1
    }
    else if(monthTo==='Jul'||monthTo==='Aug'||monthTo==='Sep')
    {
      return 2
    }
    else if(monthTo==='Oct'||monthTo==='Nov'||monthTo==='Dec')
    {
      return 3
    }
  }
  GetMonthColumn(monthTo)
  {
    if(monthTo==='Jan'||monthTo==='Apr'||monthTo==='Jul'||monthTo==='Oct')
    {
      return 0  
    }
    else if(monthTo==='Feb',monthTo==='May'||monthTo==='Aug'||monthTo==='Nov')
    {
      return 1
    }
    else if(monthTo==='Mar'||monthTo==='Jun'||monthTo==='Sep'||monthTo==='Dec')
    {
      return 2
    }
  }
  cancelReportsFilter()
  {
    
    cy.get(':nth-child(2) > .ant-row > .ant-col > .ant-space > [style=""] > .ant-btn > span').should('be.visible').should('contain.text','Cancel').click()
    cy.get('.ant-modal-body > .ant-row-space-between').should('not.be.visible')
    cy.get('.ant-col > .ant-typography').should('be.visible').should('contain.text','Payment Reports')
    
  }
  navigateToUser()
  {
      cy.get('table').eq(0).then(table => {
      cy.wrap(table)
          .find('.ant-table-tbody tr td:nth-child(2)')
          .eq(1)
          .click()
      });

      
  }
  verifySpecificPaymentHistoryPage()
  {

    cy.get('[data-testid="container"] > .ant-card-body > :nth-child(1) > .ant-col > .ant-typography').should('be.visible').should('contain.text','Specific Payment History')

  }
  downloadPDFStatement()
  {
    cy.get('.ant-row-end > .ant-btn > .ant-space > :nth-child(2)').should('be.visible').should('contain.text','Download PDF Statement').click()   
  }
  selectPaymentReport()
  {
    cy.get('table').eq(0).then(table => {
      cy.wrap(table)
          .find('.ant-table-tbody tr td:nth-child(4)')
          .eq(1)
          .click()
      });
  }
  downloadSelectedPaymentReport()
  {
    cy.get(':nth-child(2) > .ant-space > .ant-space-item > .ant-btn > span').click()
  }
  confirmDownloadReport()
  {
    //cy.get('#\:r0\:').should('be.visible').should('contain.text','Download Confirmation')
    cy.get('.ant-row > :nth-child(1) > .ant-btn > span').should('be.visible').should('contain.text','Download').click()
  }
  verifyDownloadReport(path)
  {
    cy.get('table').eq(0).then(table => {
      cy.wrap(table)
          .find('.ant-table-tbody tr td:nth-child(2)')
          .eq(1)
          .invoke('text')
          .then(text => {
              const FileName = text.trim(); // Store the text in the variable
              cy.log(FileName)
              const downloadsFolder = Cypress.config("downloadsFolder");
              cy.readFile(path.join(downloadsFolder, FileName+".xlsx")).should("exist");
          });
      });
  }
  verifyPDFStatement(path)
  {
    cy.get(':nth-child(2) > :nth-child(1) > :nth-child(1) > .ant-card-body > .ant-row > :nth-child(2) > .ant-typography').invoke('text').then((text) => {
      cy.wrap(text).as('FileName');
      const FileName=text.trim()
      const downloadsFolder = Cypress.config("downloadsFolder");
      cy.readFile(path.join(downloadsFolder, FileName+".pdf")).should("exist");
    }); 
  }
  verifyRepeatBatch()
  {
    cy.get(':nth-child(2) > .ant-btn > .ant-space > :nth-child(2)').should('be.visible').should('contain.text','Repeat Batch').click()
    cy.wait(2000)
    cy.get('[data-testid="container"] > .ant-card-body > :nth-child(1) > .ant-col > .ant-typography').should('be.visible').should('contain.text','Pay Multiple Recipients')
    cy.get('.ant-tabs-tab-active').should('contain.text','Batch Payments')
  }
  verifyRepeatPayment()
  {
    cy.get(':nth-child(2) > .ant-row > .ant-col > .ant-btn > .ant-space > :nth-child(2)').click()
    cy.wait(2000)
    cy.get('.ant-tabs-tab-active').should('contain.text','New Payment')
  }
  fillData()
  {
    cy.get(':nth-child(6) > .ant-col > .ant-input').should('be.visible').type("Notes")
    cy.get('.m-b-10 > .ant-col > .ant-input').should('be.visible').type("Invoice Reference Number")
  }
  savePaymentHistory()
  {
    cy.get('.ant-row-center.ant-row-bottom > :nth-child(2) > .ant-row > .ant-col > .ant-btn > span').should('be.visible').should('contain.text','Save').click()
    cy.wait(2000)
    cy.get('.ant-notification-notice-message').should('be.visible').should('contain.text','Changes saved successfully')
  }
}