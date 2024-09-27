const variable= require('../PageElements/FundingHistory.json')
export class FundingHistory{
  goToFundingHistoryPage(){
    cy.get(variable.fundingHistoryLocators.fundingHistory).click()
    cy.get(variable.fundingHistoryLocators.mainHeading).should('contain','Your Transaction History')
    cy.wait(7000)
  }
  validateSearchField(search){
    cy.get(variable.fundingHistoryLocators.searchField).type(search)
  }
  validatePagination(){
      const isNextButtonEnabled = () => {
          return cy.get(variable.fundingHistoryLocators.nextPageArrow).then($button => {
            return !$button.prop('disabled');
          });
        };
    
        // Loop until the "Next" button is disabled
        const validatePages = () => {
          isNextButtonEnabled().then(enabled => {
            if (enabled) {
              // Perform validations specific to each page
              // For example, assert that certain elements exist or have specific content
              cy.get(variable.fundingHistoryLocators.rowFirst).eq(0).should('exist')
              // Click the "Next" button
              cy.get(variable.fundingHistoryLocators.nextPageArrow).click();
      
              // Wait for the page to load (adjust as needed)
              cy.wait(1000); // Adjust the wait time as needed
      
              // Recursively call the function to validate the next page
              validatePages();
            } else {
              // Assert that the "Next" button is now disabled
              cy.get(variable.fundingHistoryLocators.nextPageArrow).should('be.disabled');
    
              // Assert any element on the last page to confirm arrival (optional)
             // cy.get('.last-page-element').should('exist'); // Replace with actual selector for element on last page
            }
          });
        };
      
        // Start validating pages
        validatePages();
  }
  validatePaginationFilters(filter){
    cy.get(variable.fundingHistoryLocators.pageFilters).click()
    cy.contains(filter).click()
  }
  validateRows(row){
    cy.get(variable.fundingHistoryLocators.allRows).should('have.length', row)
  }
  validateDefaultPaginationFilter(){
    cy.get(variable.fundingHistoryLocators.defaultPagination).should('contain.text','20 / page')
  }
  validateCelenderIcon(){
    cy.get(variable.fundingHistoryLocators.clickOnCelenderIcon).click()
    cy.get(variable.fundingHistoryLocators.celender).find("td[title='2024-09-05']").click()
    cy.get(variable.fundingHistoryLocators.selectedDate).should('contain.text','September 5, 2024')
  }
  validateSortingIcon(){
    cy.get(variable.fundingHistoryLocators.sortingIcon).eq(0).should('exist')
    cy.get(variable.fundingHistoryLocators.sortingIcon).eq(1).should('exist')
    cy.get(variable.fundingHistoryLocators.sortingIcon).eq(2).should('exist')
    cy.get(variable.fundingHistoryLocators.sortingIcon).eq(3).should('exist')
    cy.get(variable.fundingHistoryLocators.sortingIcon).eq(4).should('exist')
    cy.get(variable.fundingHistoryLocators.sortingIcon).eq(5).should('exist')
    cy.get(variable.fundingHistoryLocators.sortingIcon).eq(6).should('exist')
  }
  goToAwaitingFundDetailPage(){
    cy.get(variable.fundingHistoryLocators.clickOnAwaitingFund).eq(0).click()
  }
  cancelFunding(){
    cy.get(variable.fundingHistoryLocators.cancelFunding).click()
  }
  goToCompleteFundDetailPage(){
    cy.get(variable.fundingHistoryLocators.completeFund).contains('Complete').eq(0).click()
    cy.get(variable.fundingHistoryLocators.cancelFunding).should('be.disabled')
  }
  clickOnReturnBtn(){
    cy.get(variable.fundingHistoryLocators.returnBtn).click()
  }
  validateAscendingAmountSorting() {
    cy.get(variable.fundingHistoryLocators.amountButton).click()
    cy.wait(5000)
    cy.get(variable.fundingHistoryLocators.transactionRow).then(($transactionRows) => {
    const totalRows = $transactionRows.length;
    
    // Previous amount for comparison
    let previousAmount;
    // Loop through each transaction row
    for (let i = 0; i < totalRows; i++) {
      // Construct the current amount selector
      //const currentAmountSelector = cy.get('[class=ant-typography]')
      //cy.log(currentAmountSelector)//to see what exactly the locator is
      // Get the current amount and parse it
      cy.get('tr td:nth-child(6) [class="ant-typography"]').eq(0+i).invoke('text').then((currentAmountString) => {
        const currentAmount = parseFloat(currentAmountString.replace(/[^\d.]/g, ''));
        // Check if it's the first row or not
        if (i === 0) {
          // First row, no previous amount to compare
          previousAmount = currentAmount;
        } else {
          // Compare current amount with previous amount
          expect(currentAmount).to.be.gte(previousAmount);
          // Update previous amount for next iteration
          previousAmount = currentAmount;
        }
      });
    }
  });

  // Check for the next page button if exist go to next page and repeat
  //need to change logic for next page
  //use logic of cancel funding i.e make a function check all pages
  // cy.get(variable.fundingHistoryLocators.nextPageButton).then(($nextPageButton) => {
  //   if ($nextPageButton.is(':visible')) {
  //     cy.log('Navigating to the next page');
  //     cy.get(variable.fundingHistoryLocators.pageSelector).click();
  //     this.validateAmountSorting();
  //   } else {
  //     cy.log('No more pages to validate');
  //   }
  // });
}
validateDescendingAmountSorting() {
  cy.get('.ant-table-column-sort > .ant-table-column-sorters > .ant-table-column-title').click()
  cy.wait(5000)
  cy.get(variable.fundingHistoryLocators.transactionRow).then(($transactionRows) => {
      const totalRows = $transactionRows.length;
      // Previous amount for comparison
      let previousAmount;
      // Loop through each transaction row
      for (let i = 0; i < totalRows; i++) {
          // Construct the current amount selector
          //const currentAmountSelector = cy.get('[class=ant-typography]')
          //cy.log(currentAmountSelector)//to see what exactly the locator is
          // Get the current amount and parse it
          cy.get('tr td:nth-child(6) [class="ant-typography"]').eq(0 + i).invoke('text').then((currentAmountString) => {
              const currentAmount = parseFloat(currentAmountString.replace(/[^\d.]/g, ''));
              // Check if it's the first row or not
              if (i === 0) {
                  // First row, no previous amount to compare
                  previousAmount = currentAmount;
              }else {
                  // Compare current amount with previous amount
                  expect(currentAmount).to.be.lte(previousAmount);
                  // Update previous amount for next iteration
                  previousAmount = currentAmount;
              }
          });
      }
  });

}
validateAscendingDateSorting(){
  cy.get(variable.fundingHistoryLocators.SubmissionDateButton).click()
  cy.get(variable.fundingHistoryLocators.transactionRow).then(($transactionRows) => {
    const totalRows = $transactionRows.length;
    const currentDateSelector = variable.fundingHistoryLocators.dateColumn;
    let previousDate;
  
    for (let i = 0; i < totalRows; i++) {
      cy.get(currentDateSelector).eq(i).invoke('text').then((currentDateString) => {
        // Trim the text and store in a variable
        const trimmedDateString = currentDateString.trim();
        cy.log(trimmedDateString)
        // Parse the date using JavaScript Date object
        const dateComponents = trimmedDateString.split(' ');
        const month = dateComponents[0];
        const day = parseInt(dateComponents[1]);
        const year = parseInt(dateComponents[2]);
        const newDate = new Date(`${month} ${day}, ${year} 00:00:00 GMT`);
        // Check if it's the first row or not
        if (i === 0) {
          // First row, no previous date to compare
          previousDate = newDate;
        } else {
          // Compare current date with previous date
          expect(newDate).to.be.gte(previousDate);
          // Update previous date for the next iteration
          previousDate = newDate;
        }
      });
    }
  });
    
}
validateDescendingDateSorting(){
  cy.get('.ant-table-column-sort > .ant-table-column-sorters > .ant-table-column-title').click()
  cy.get(variable.fundingHistoryLocators.transactionRow).then(($transactionRows) => {
    const totalRows = $transactionRows.length;
    const currentDateSelector = variable.fundingHistoryLocators.dateColumn;
    let previousDate;
    for (let i = 0; i < totalRows; i++) {
      cy.get(currentDateSelector).eq(i).invoke('text').then((currentDateString) => {
        // Trim the text and store in a variable
        const trimmedDateString = currentDateString.trim();
        cy.log(trimmedDateString)
        // Parse the date using JavaScript Date object
        const dateComponents = trimmedDateString.split(' ');
        const month = dateComponents[0];
        const day = parseInt(dateComponents[1]);
        const year = parseInt(dateComponents[2]);
        const newDate = new Date(`${month} ${day}, ${year} 00:00:00 GMT`);
  
        // Check if it's the first row or not
        if (i === 0) {
          // First row, no previous date to compare
          previousDate = newDate;
        } else {
          // Compare current date with previous date
          expect(newDate).to.be.lte(previousDate);
          // Update previous date for the next iteration
          previousDate = newDate;
        }
      });
    }
  });
   
}
valiadteAscendingAdminSorting(){
  cy.get(variable.fundingHistoryLocators.adminButton).click()
  cy.get(variable.fundingHistoryLocators.transactionRow).then(($transactionRows) => {
    const totalRows = $transactionRows.length;
    const adminColumnSelector = variable.fundingHistoryLocators.adminColumnSorting;
    let previousFirstLetter;
    for (let i = 0; i < totalRows; i++) {
      // Get the current admin name text within the current row
      cy.get(adminColumnSelector).eq(i).invoke('text').then((currentAdminName) => {
        // Extract the first letter of the admin name
        const currentFirstLetter = currentAdminName.trim().charAt(0).toLowerCase();
  
        // Check if it's the first row or not
        if (i === 0) {
          // First row, no previous first letter to compare
          previousFirstLetter = currentFirstLetter;
        } else {
          // Compare current first letter with the previous one
          expect(currentFirstLetter >= previousFirstLetter).to.be.true;
          // Update previous first letter for the next iteration
          previousFirstLetter = currentFirstLetter;
        }
      });
    }
  });
}

valiadteDescendingAdminSorting(){
  cy.get('.ant-table-column-sort > .ant-table-column-sorters > .ant-table-column-title').click()
  cy.get(variable.fundingHistoryLocators.transactionRow).then(($transactionRows) => {
    const totalRows = $transactionRows.length;
    const adminColumnSelector = variable.fundingHistoryLocators.adminColumnSorting;
    let previousFirstLetter;
    for (let i = 0; i < totalRows; i++) {
      // Get the current admin name text within the current row
      cy.get(adminColumnSelector).eq(i).invoke('text').then((currentAdminName) => {
        // Extract the first letter of the admin name
        const currentFirstLetter = currentAdminName.trim().charAt(0).toLowerCase();
  
        // Check if it's the first row or not
        if (i === 0) {
          // First row, no previous first letter to compare
          previousFirstLetter = currentFirstLetter;
        } else {
          // Compare current first letter with the previous one
          expect(currentFirstLetter <= previousFirstLetter).to.be.true;
          // Update previous first letter for the next iteration
          previousFirstLetter = currentFirstLetter;
        }
      });
    }
  });
}

valiadteAscendingFundingMethodSorting(){
  cy.get(variable.fundingHistoryLocators.fundingMethodButton).click()
  cy.wait(3000)
  cy.get(variable.fundingHistoryLocators.transactionRow).then(($transactionRows) => {
    const totalRows = $transactionRows.length;
    const fMethodColumnSelector = variable.fundingHistoryLocators.fundingMethodColumn;
    let previousFirstLetter;
    for (let i = 0; i < totalRows; i++) {
      // Get the current admin name text within the current row
      cy.get(fMethodColumnSelector).eq(i).invoke('text').then((currentFundingMethod) => {
        // Extract the first letter of the admin name
        const currentFirstLetter = currentFundingMethod.trim().charAt(0).toLowerCase();
  
        // Check if it's the first row or not
        if (i === 0) {
          // First row, no previous first letter to compare
          previousFirstLetter = currentFirstLetter;
        } else {
          // Compare current first letter with the previous one
          expect(currentFirstLetter >= previousFirstLetter).to.be.true;
          // Update previous first letter for the next iteration
          previousFirstLetter = currentFirstLetter;
        }
      });
    }
  });
}

valiadteDescendingFundingMethodSorting(){
  cy.get(variable.fundingHistoryLocators.fundingMethodButton).click()
  cy.get(variable.fundingHistoryLocators.transactionRow).then(($transactionRows) => {
    const totalRows = $transactionRows.length;
    const fMethodColumnSelector = variable.fundingHistoryLocators.fundingMethodColumn;
    let previousFirstLetter;
    for (let i = 0; i < totalRows; i++) {
      // Get the current admin name text within the current row
      cy.get(fMethodColumnSelector).eq(i).invoke('text').then((currentFundingMethod) => {
        // Extract the first letter of the admin name
        const currentFirstLetter = currentFundingMethod.trim().charAt(0).toLowerCase();
  
        // Check if it's the first row or not
        if (i === 0) {
          // First row, no previous first letter to compare
          previousFirstLetter = currentFirstLetter;
        } else {
          // Compare current first letter with the previous one
          expect(currentFirstLetter <= previousFirstLetter).to.be.true;
          // Update previous first letter for the next iteration
          previousFirstLetter = currentFirstLetter;
        }
      });
    }
  });
}
validateAscendingStatusSorting(){
  cy.get(variable.fundingHistoryLocators.StatusButton).click()
  cy.get(variable.fundingHistoryLocators.transactionRow).then(($transactionRows) => {
    const totalRows = $transactionRows.length;
    const statusColumnSelector = variable.fundingHistoryLocators.statusColumnSorting;
    
    let previousFirstLetter;
    
    for (let i = 0; i < totalRows; i++) {
      // Get the current admin name text within the current row
      cy.get(statusColumnSelector).eq(i).invoke('text').then((currentStatus) => {
        // Extract the first letter of the admin name
        const currentFirstLetter = currentStatus.trim().charAt(0).toLowerCase();
  
        // Check if it's the first row or not
        if (i === 0) {
          // First row, no previous first letter to compare
          previousFirstLetter = currentFirstLetter;
        } else {
          // Compare current first letter with the previous one
          expect(currentFirstLetter >= previousFirstLetter).to.be.true;
          // Update previous first letter for the next iteration
          previousFirstLetter = currentFirstLetter;
        }
      });
    }
  });
}
validateDescendingStatusSorting(){
  cy.get('.ant-table-column-sort > .ant-table-column-sorters > .ant-table-column-title').click()
  cy.get(variable.fundingHistoryLocators.transactionRow).then(($transactionRows) => {
    const totalRows = $transactionRows.length;
    const statusColumnSelector = variable.fundingHistoryLocators.statusColumnSorting;
    
    let previousFirstLetter;
    
    for (let i = 0; i < totalRows; i++) {
      // Get the current admin name text within the current row
      cy.get(statusColumnSelector).eq(i).invoke('text').then((currentStatus) => {
        // Extract the first letter of the admin name
        const currentFirstLetter = currentStatus.trim().charAt(0).toLowerCase();
  
        // Check if it's the first row or not
        if (i === 0) {
          // First row, no previous first letter to compare
          previousFirstLetter = currentFirstLetter;
        } else {
          // Compare current first letter with the previous one
          expect(currentFirstLetter <= previousFirstLetter).to.be.true;
          // Update previous first letter for the next iteration
          previousFirstLetter = currentFirstLetter;
        }
      });
    }
  });
}
}