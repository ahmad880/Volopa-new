/// <reference types = "cypress"/>

import { AdditionalCurrencies } from "../PageObject/PageAction/AdditionalCurrencies";
import { BatchPayments } from "../PageObject/PageAction/BatchPayments";
import { massPayments } from "../PageObject/PageAction/massPayments";
import { NewPayment } from "../PageObject/PageAction/NewPayment";
import { PaymentsDashboard } from "../PageObject/PageAction/PaymentsDashboard";
import { SigninPage } from "../PageObject/PageAction/SigninPage";

const login = new SigninPage
const additionalC = new AdditionalCurrencies
const batchP = new BatchPayments
const paymentD = new PaymentsDashboard
const newP = new NewPayment
const massP = new massPayments
const downloadsFolder = Cypress.config("downloadsFolder")

const currencyList = [
  'GBP', 'USD', 'EUR', 'AUD', 'CAD', 'CHF', 'CNY', 'JPY', 'NZD', 'SEK',
  'NOK', 'INR', 'SGD', 'ZAR', 'HKD', 'THB', 'MXN', 'PLN', 'CZK', 'HUF',
  'TRY', 'ILS', 'AED', 'SAR', 'DKK', 'BHD', 'KES', 'KWD', 'OMR', 'QAR',
  'RON', 'UGX',
];

describe('Mass Payment',function(){
    let userName = 'testnew@volopa.com'
    let password = 'testTest1'
    beforeEach(() => {
        cy.visit('/', { timeout: 10000 })
        paymentD.clearCache()
        cy.viewport(1440,1000)
    })

it('Verify that user have access to File upload Feature', function(){
    login.Login(userName,password)
    paymentD.goToPaymentsDashborad()
    massP.gotoFileUpload()
})
it('verify that download templates are available and downloadable for all available currencies', () => {

    login.Login(userName,password)
    paymentD.goToPaymentsDashborad()
    massP.gotoFileUpload() 
    cy.get('.ant-spin-dot.ant-spin-dot-spin').should('not.exist') 
  cy.wrap(currencyList).each((currency) => {
      // Step 1: Open dropdown
      cy.get('.ant-select-selector')
    .should('be.visible')
    .click({ force: true });

      cy.get('input.ant-select-selection-search-input')
  .should('exist')
  .should('be.visible')
  .click({ force: true })
  .clear({ force: true })
  .type(`${currency}{enter}`, { force: true });

      // Step 3: Verify currency selected
      cy.get("span.ant-select-selection-item").should('contain.text', currency);

      // Step 4: Click download
      cy.get('[style="padding-left: 5px; padding-right: 5px;"] > .ant-btn')
        .should('be.enabled')
        .click();
    cy.wait(4000)
      // Step 5: Wait and validate file download (adjust path as needed)
      const downloadsFolder = Cypress.config('downloadsFolder');
      const expectedFileName = `${currency}_payments_file.csv`; // or adjust pattern
      cy.readFile(`${downloadsFolder}/${expectedFileName}`, { timeout: 10000 }).should('exist');
    });

  // Step 6: Delete all downloaded files at the end
  cy.task('deleteDownloads');
});
it('Verify that Completing the file upload template guide is navigating to the correct place', function(){
    login.Login(userName,password)
    paymentD.goToPaymentsDashborad()
    massP.gotoFileUpload()
    massP.guidenavigation()
})
it('Verify that the user is able to upload the file', function(){
    login.Login(userName,password)
    paymentD.goToPaymentsDashborad()
    massP.gotoFileUpload()
    massP.fileUploader()
    //Upload the file from fixtures folder
    const fileName = 'uploadFiles/CNY file.csv'
    const justFileName = fileName.split('/').pop()
    cy.get('input[type="file"]').attachFile(fileName)
    cy.wait(1000)
    cy.get('.ant-upload-list-item-name').should('contain.text',justFileName)
 })
 it('Verify that the user is able to delete the uploaded file', function(){
    login.Login(userName,password)
    paymentD.goToPaymentsDashborad()
    massP.gotoFileUpload()
    massP.fileUploader()
    //Upload the file from fixtures folder
    const fileName = 'uploadFiles/CNY file.csv'
    const justFileName = fileName.split('/').pop()
    cy.get('input[type="file"]').attachFile(fileName)
    cy.get('.ant-upload-list-item-name').should('contain.text',justFileName)
     cy.wait(2000)
    massP.deleteUploadedFile()
 })
 it('Verify that the user is able to navigate to Files in progress', function(){
    login.Login(userName,password)
    paymentD.goToPaymentsDashborad()
    massP.gotoFileUpload()
    massP.gotoFilesinProgress() 
 })
 it('Verify that the user is correctly redirected from file in progress modal to file upload page', function(){
    login.Login(userName,password)
    paymentD.goToPaymentsDashborad()
    massP.gotoFileUpload()
    massP.gotoFilesinProgress()
    massP.navigatingBackFromFip()
 })
 it('Verify that the user is able to delete the Files in progress from modal', function(){
    login.Login(userName,password)
    paymentD.goToPaymentsDashborad()
    massP.gotoFileUpload()
    const fileName = 'uploadFiles/CNY file.csv'
    const justFileName = fileName.split('/').pop()
    cy.get('input[type="file"]').attachFile(fileName)
    cy.wait(1000)
    cy.get('.ant-upload-list-item-name').should('contain.text',justFileName)
    cy.wait(3000)
    massP.gotoFilesinProgress()
    massP.deleteFip()
 })
 it('Verify that the user is able to upload the valid file(no errors)', function(){
    login.Login(userName,password)
    paymentD.goToPaymentsDashborad()
    massP.gotoFileUpload()
    const fileName = 'uploadFiles/Valid GBP file.csv'
    const justFileName = fileName.split('/').pop()
    cy.get('input[type="file"]').attachFile(fileName)
    cy.wait(1000)
    cy.get('.ant-upload-list-item-name').should('contain.text',justFileName)
    cy.wait(3000)
    massP.reviewFile()
    massP.validateValidFile()
 })
 it('Verify that system throws correct validation message on file(General errors)', function(){
    login.Login(userName,password)
    paymentD.goToPaymentsDashborad()
    massP.gotoFileUpload()
    const fileName = 'uploadFiles/Invalid File.csv'
    const justFileName = fileName.split('/').pop()
    cy.get('input[type="file"]').attachFile(fileName)
    cy.wait(1000)
    cy.get('.ant-upload-list-item-name').should('contain.text',justFileName)
    cy.wait(3000)
    massP.reviewFile()
    massP.goToError()
    massP.hardcodederrorsforInvalidFile()
 })
 it('Verify that system throws correct error if there is an empty row within the file record and stop processing', function(){
    login.Login(userName,password)
    paymentD.goToPaymentsDashborad()
    massP.gotoFileUpload()
    const fileName = 'uploadFiles/Empty Record.csv'
    const justFileName = fileName.split('/').pop()
    cy.get('input[type="file"]').attachFile(fileName)
    cy.wait(1000)
    cy.get('.ant-upload-list-item-name').should('contain.text',justFileName)
    cy.wait(3000)
    massP.reviewFile()
    //massP.goToError()
    massP.emptyRecordValidation()
    massP.returnFromErrorList()
    massP.disableProceedButton()
 })
 it('Verify that system throws correct if there is an missing recipient id within the file record and stop processing', function(){
    login.Login(userName,password)
    paymentD.goToPaymentsDashborad()
    massP.gotoFileUpload()
    const fileName = 'uploadFiles/missing recipient id.csv'
    const justFileName = fileName.split('/').pop()
    cy.get('input[type="file"]').attachFile(fileName)
    cy.wait(1000)
    cy.get('.ant-upload-list-item-name').should('contain.text',justFileName)
    cy.wait(3000)
    massP.reviewFile()
    //massP.goToError()
    massP.emptyRecordValidation()
    massP.returnFromErrorList()
    massP.disableProceedButton()
 })
 it('Verify that system throws correct error if there is no record/empty file and stop processing', function(){
    login.Login(userName,password)
    paymentD.goToPaymentsDashborad()
    massP.gotoFileUpload()
    const fileName = 'uploadFiles/empty file.csv'
    const justFileName = fileName.split('/').pop()
    cy.get('input[type="file"]').attachFile(fileName)
    cy.wait(1000)
    cy.get('.ant-upload-list-item-name').should('contain.text',justFileName)
    cy.wait(3000)
    massP.reviewFile()
    //massP.goToError()
    massP.emptyFileValidation()
    massP.returnFromErrorList()
    massP.disableProceedButton()
 })
 it('Verify that system throws correct error if files header are ammended/changed and stop processing', function(){
    login.Login(userName,password)
    paymentD.goToPaymentsDashborad()
    massP.gotoFileUpload()
    const fileName = 'uploadFiles/ammeded header file.csv'
    const justFileName = fileName.split('/').pop()
    cy.get('input[type="file"]').attachFile(fileName)
    cy.wait(1000)
    cy.get('.ant-upload-list-item-name').should('contain.text',justFileName)
    cy.wait(3000)
    massP.reviewFile()
    //massP.goToError()
    massP.ammededFileHeader()
    massP.returnFromErrorList()
    massP.disableProceedButton()
 })
 it('Verify that system throws correct error if there is currency mismatch and stop processing', function(){
    login.Login(userName,password)
    paymentD.goToPaymentsDashborad()
    massP.gotoFileUpload()
    const fileName = 'uploadFiles/currency mismatch file.csv'
    const justFileName = fileName.split('/').pop()
    cy.get('input[type="file"]').attachFile(fileName)
    cy.wait(1000)
    cy.get('.ant-upload-list-item-name').should('contain.text',justFileName)
    cy.wait(3000)
    massP.reviewFile()
    //massP.goToError()
    massP.currencyMismatchValidation()
    massP.returnFromErrorList()
    massP.disableProceedButton()
 })
 it('Verify that system throws correct error for missing and invalid purpose code for AE/AED', function(){
    login.Login(userName,password)
    paymentD.goToPaymentsDashborad()
    massP.gotoFileUpload()
    const fileName = 'uploadFiles/AED file.csv'
    const justFileName = fileName.split('/').pop()
    cy.get('input[type="file"]').attachFile(fileName)
    cy.wait(1000)
    cy.get('.ant-upload-list-item-name').should('contain.text',justFileName)
    cy.wait(3000)
    massP.reviewFile()
    massP.goToError()
    massP.validateAEAED()
 })
 it('Verify that system throws correct error for INR currency', function(){
    login.Login(userName,password)
    paymentD.goToPaymentsDashborad()
    massP.gotoFileUpload()
    const fileName = 'uploadFiles/INR file.csv'
    const justFileName = fileName.split('/').pop()
    cy.get('input[type="file"]').attachFile(fileName)
    cy.wait(1000)
    cy.get('.ant-upload-list-item-name').should('contain.text',justFileName)
    cy.wait(3000)
    massP.reviewFile()
    massP.goToError()
    massP.validateInrErrors()
 })
 it('Verify that system throws correct error for missing and invalid purpose code for CNY', function(){
    login.Login(userName,password)
    paymentD.goToPaymentsDashborad()
    massP.gotoFileUpload()
    const fileName = 'uploadFiles/CNY file.csv'
    const justFileName = fileName.split('/').pop()
    cy.get('input[type="file"]').attachFile(fileName)
    cy.wait(1000)
    cy.get('.ant-upload-list-item-name').should('contain.text',justFileName)
    cy.wait(3000)
    massP.reviewFile()
    massP.goToError()
    massP.validateCNYerrors()
 })
 it('Verify that system throws correct error for exceeding payment for SGD currency', function(){
    login.Login(userName,password)
    paymentD.goToPaymentsDashborad()
    massP.gotoFileUpload()
    const fileName = 'uploadFiles/SGD file.csv'
    const justFileName = fileName.split('/').pop()
    cy.get('input[type="file"]').attachFile(fileName)
    cy.wait(1000)
    cy.get('.ant-upload-list-item-name').should('contain.text',justFileName)
    cy.wait(3000)
    massP.reviewFile()
    massP.goToError()
    massP.validateSGDerror()
 })
 it('Verify that system throws correct error for exceeding payment for TRY currency', function(){
    login.Login(userName,password)
    paymentD.goToPaymentsDashborad()
    massP.gotoFileUpload()
    const fileName = 'uploadFiles/TRY file.csv'
    const justFileName = fileName.split('/').pop()
    cy.get('input[type="file"]').attachFile(fileName)
    cy.wait(1000)
    cy.get('.ant-upload-list-item-name').should('contain.text',justFileName)
    cy.wait(3000)
    massP.reviewFile()
    massP.goToError()
    massP.validateTRYerror()
 })
 it('Verify that the user is able to upload and proceed the valid file(no errors) using GBP and push funds(same currency)', function () {
  login.Login(userName, password);
  paymentD.goToPaymentsDashborad();
  massP.gotoFileUpload();

  const fileName = 'uploadFiles/Valid GBP file.csv';
  const justFileName = fileName.split('/').pop();

  cy.get('input[type="file"]').attachFile(fileName);
  cy.wait(1000);
  cy.get('.ant-upload-list-item-name').should('contain.text', justFileName);
  cy.wait(3000);

  massP.reviewFile();
  massP.validateValidFile();

  // Invoking the recipient receive amount
  cy.get(':nth-child(7) > .ant-col > .ant-typography > .bold')
    .should('be.visible')
    .invoke('text')
    .then((text) => {
      const amount = text.trim();
      cy.log('Fetched amount from page:', amount);
      expect(amount).to.not.be.empty;
      cy.wrap(amount).as('paymentAmount');
    });

  // Invoking the file currency for later validation
  cy.get(':nth-child(7) > .ant-col > .ant-typography')
    .should('be.visible')
    .invoke('text')
    .then((text) => {
      const currency = text.split('-')[0].trim(); // e.g., "GBP"
      cy.wrap(currency).as('currencyCode'); // Alias the string
    });

  // Invoking the total count of payments
  cy.get('body > div:nth-child(2) > section:nth-child(1) > main:nth-child(2) > div:nth-child(1) > div:nth-child(1) > div:nth-child(5) > div:nth-child(1) > span:nth-child(1)')
    .invoke('text')
    .then((text) => {
      const count = parseInt(text.split('-')[1].trim()); // Get number after '-'
      cy.wrap(count).as('paymentCount');
    });

  massP.proceedFlow('GBP{enter}', 'GBP');

  // Validating the recipient receive amount
  cy.get('@paymentAmount').then((expectedAmount) => {
    cy.get('.row-border > :nth-child(2)')
      .should('be.visible')
      .invoke('text')
      .then((actualAmount) => {
        const cleanActual = actualAmount.trim();
        cy.log('Actual amount from table:', cleanActual);
        expect(cleanActual).to.eq(expectedAmount);
      });
  });

  // Validating the file currency
  cy.get('@currencyCode').then((currency) => {
    cy.get('.row-border > :nth-child(1)')
      .should('contain.text', currency);
  });

  // Invoking the "you send us" amount
  cy.get('.m-t-40 > .ant-col > .ant-card > .ant-card-body > .ant-space > :nth-child(2) > .ant-typography')
    .invoke('text')
    .then((amountText) => {
      const trimmed = amountText.replace(/\s+/g, ''); // e.g., "462.50GBP"
      cy.wrap(trimmed).as('paymentAmountnew');
    });

  // Pay the file
  massP.payRecipients();

  // Validate the currency on Final Review last page
  cy.get('@currencyCode').then((currency) => {
    cy.get('tr[class="ant-table-row ant-table-row-level-0 row-border medium fs-18px "] td:nth-child(1)')
      .should('contain.text', currency);
  });

  // Validate the amount on Final Review last page
  cy.get('@paymentAmount').then((expectedAmount) => {
    cy.get('tr[class="ant-table-row ant-table-row-level-0 row-border medium fs-18px "] td:nth-child(2)')
      .should('be.visible')
      .invoke('text')
      .then((actualAmount) => {
        const cleanActual = actualAmount.trim();
        cy.log('Actual amount from table:', cleanActual);
        expect(cleanActual).to.eq(expectedAmount);
      });
  });

  massP.goToPaymentHistory();

  // Validate the payment history
  cy.get('@paymentCount').then((count) => {
    const today = new Date();
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    const formattedDate = today.toLocaleDateString('en-US', options);

    for (let i = 0; i < count; i++) {
      // Validate date column
      cy.get(`[data-row-key="${i}"] > :nth-child(2)`)
        .should('contain.text', formattedDate);

      // Assert 'File' is present in column 4
      cy.get(`[data-row-key="${i}"] > :nth-child(4)`)
        .should('contain.text', 'File');

      // Assert amount matches the one captured earlier
      cy.get('@paymentAmountnew').then((expectedAmount) => {
        cy.get(`[data-row-key="${i}"] > :nth-child(7)`)
          .should('contain.text', expectedAmount);
      });
    }
  });
});
it('Verify that the user is able to upload and proceed the valid file(no errors) using GBP and Volopa Collection Account(same currency)', function () {
  login.Login(userName, password);
  paymentD.goToPaymentsDashborad();
  massP.gotoFileUpload();

  const fileName = 'uploadFiles/Valid GBP file.csv';
  const justFileName = fileName.split('/').pop();

  cy.get('input[type="file"]').attachFile(fileName);
  cy.wait(1000);
  cy.get('.ant-upload-list-item-name').should('contain.text', justFileName);
  cy.wait(3000);

  massP.reviewFile();
  massP.validateValidFile();

  // Invoking the recipient receive amount
  cy.get(':nth-child(7) > .ant-col > .ant-typography > .bold')
    .should('be.visible')
    .invoke('text')
    .then((text) => {
      const amount = text.trim();
      cy.log('Fetched amount from page:', amount);
      expect(amount).to.not.be.empty;
      cy.wrap(amount).as('paymentAmount');
    });

  // Invoking the file currency for later validation
  cy.get(':nth-child(7) > .ant-col > .ant-typography')
    .should('be.visible')
    .invoke('text')
    .then((text) => {
      const currency = text.split('-')[0].trim(); // e.g., "GBP"
      cy.wrap(currency).as('currencyCode'); // Alias the string
    });

  // Invoking the total count of payments
  cy.get('body > div:nth-child(2) > section:nth-child(1) > main:nth-child(2) > div:nth-child(1) > div:nth-child(1) > div:nth-child(5) > div:nth-child(1) > span:nth-child(1)')
    .invoke('text')
    .then((text) => {
      const count = parseInt(text.split('-')[1].trim()); // Get number after '-'
      cy.wrap(count).as('paymentCount');
    });

  massP.proceedFlow('GBP{enter}', 'GBP');

  // Validating the recipient receive amount
  cy.get('@paymentAmount').then((expectedAmount) => {
    cy.get('.row-border > :nth-child(2)')
      .should('be.visible')
      .invoke('text')
      .then((actualAmount) => {
        const cleanActual = actualAmount.trim();
        cy.log('Actual amount from table:', cleanActual);
        expect(cleanActual).to.eq(expectedAmount);
      });
  });

  // Validating the file currency
  cy.get('@currencyCode').then((currency) => {
    cy.get('.row-border > :nth-child(1)')
      .should('contain.text', currency);
  });

  // Invoking the "you send us" amount
  cy.get('.m-t-40 > .ant-col > .ant-card > .ant-card-body > .ant-space > :nth-child(2) > .ant-typography')
    .invoke('text')
    .then((amountText) => {
      const trimmed = amountText.replace(/\s+/g, ''); // e.g., "462.50GBP"
      cy.wrap(trimmed).as('paymentAmountnew');
    });

  // Pay the file
  massP.payRecipients();

  // Validate the currency on Final Review last page
  cy.get('@currencyCode').then((currency) => {
    cy.get('tr[class="ant-table-row ant-table-row-level-0 row-border medium fs-18px "] td:nth-child(1)')
      .should('contain.text', currency);
  });

  // Validate the amount on Final Review last page
  cy.get('@paymentAmount').then((expectedAmount) => {
    cy.get('tr[class="ant-table-row ant-table-row-level-0 row-border medium fs-18px "] td:nth-child(2)')
      .should('be.visible')
      .invoke('text')
      .then((actualAmount) => {
        const cleanActual = actualAmount.trim();
        cy.log('Actual amount from table:', cleanActual);
        expect(cleanActual).to.eq(expectedAmount);
      });
  });
  massP.selectCollectionFundingMethod()
  massP.goToPaymentHistory();

  // Validate the payment history
  cy.get('@paymentCount').then((count) => {
    const today = new Date();
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    const formattedDate = today.toLocaleDateString('en-US', options);

    for (let i = 0; i < count; i++) {
      // Validate date column
      cy.get(`[data-row-key="${i}"] > :nth-child(2)`)
        .should('contain.text', formattedDate);

      // Assert 'File' is present in column 4
      cy.get(`[data-row-key="${i}"] > :nth-child(4)`)
        .should('contain.text', 'File');

      // Assert amount matches the one captured earlier
      cy.get('@paymentAmountnew').then((expectedAmount) => {
        cy.get(`[data-row-key="${i}"] > :nth-child(7)`)
          .should('contain.text', expectedAmount);
      });
    }
  });
});
it('Verify that the user is able to upload and proceed the valid file(no errors) using EUR and push funds(different currency)', function () {
  login.Login(userName, password);
  paymentD.goToPaymentsDashborad();
  massP.gotoFileUpload();

  const fileName = 'uploadFiles/Valid GBP file.csv';
  const justFileName = fileName.split('/').pop();

  cy.get('input[type="file"]').attachFile(fileName);
  cy.wait(1000);
  cy.get('.ant-upload-list-item-name').should('contain.text', justFileName);
  cy.wait(3000);

  massP.reviewFile();
  massP.validateValidFile();

  // Invoking the recipient receive amount
  cy.get(':nth-child(7) > .ant-col > .ant-typography > .bold')
    .should('be.visible')
    .invoke('text')
    .then((text) => {
      const amount = text.trim();
      cy.log('Fetched amount from page:', amount);
      expect(amount).to.not.be.empty;
      cy.wrap(amount).as('paymentAmount');
    });

  // Invoking the file currency for later validation
  cy.get(':nth-child(7) > .ant-col > .ant-typography')
    .should('be.visible')
    .invoke('text')
    .then((text) => {
      const currency = text.split('-')[0].trim(); // e.g., "GBP"
      cy.wrap(currency).as('currencyCode'); // Alias the string
    });

  // Invoking the total count of payments
  cy.get('body > div:nth-child(2) > section:nth-child(1) > main:nth-child(2) > div:nth-child(1) > div:nth-child(1) > div:nth-child(5) > div:nth-child(1) > span:nth-child(1)')
    .invoke('text')
    .then((text) => {
      const count = parseInt(text.split('-')[1].trim()); // Get number after '-'
      cy.wrap(count).as('paymentCount');
    });

  massP.proceedFlow('EUR{enter}', 'EUR');

  // Validating the recipient receive amount
  cy.get('@paymentAmount').then((expectedAmount) => {
    cy.get('.row-border > :nth-child(2)')
      .should('be.visible')
      .invoke('text')
      .then((actualAmount) => {
        const cleanActual = actualAmount.trim();
        cy.log('Actual amount from table:', cleanActual);
        expect(cleanActual).to.eq(expectedAmount);
      });
  });

  // Validating the file currency
  cy.get('@currencyCode').then((currency) => {
    cy.get('.row-border > :nth-child(1)')
      .should('contain.text', currency);
  });

  // Invoking the "you send us" amount
  cy.get('.m-t-40 > .ant-col > .ant-card > .ant-card-body > .ant-space > :nth-child(2) > .ant-typography')
    .invoke('text')
    .then((amountText) => {
      const trimmed = amountText.replace(/\s+/g, ''); // e.g., "462.50GBP"
      cy.wrap(trimmed).as('paymentAmountnew');
    });

  // Pay the file
  massP.payRecipients();

  // Validate the currency on Final Review last page
  cy.get('@currencyCode').then((currency) => {
    cy.get('tr[class="ant-table-row ant-table-row-level-0 row-border medium fs-18px "] td:nth-child(1)')
      .should('contain.text', currency);
  });

  // Validate the amount on Final Review last page
  cy.get('@paymentAmount').then((expectedAmount) => {
    cy.get('tr[class="ant-table-row ant-table-row-level-0 row-border medium fs-18px "] td:nth-child(2)')
      .should('be.visible')
      .invoke('text')
      .then((actualAmount) => {
        const cleanActual = actualAmount.trim();
        cy.log('Actual amount from table:', cleanActual);
        expect(cleanActual).to.eq(expectedAmount);
      });
  });

  massP.goToPaymentHistory();

  // Validate the payment history
  cy.get('@paymentCount').then((count) => {
    const today = new Date();
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    const formattedDate = today.toLocaleDateString('en-US', options);

    for (let i = 0; i < count; i++) {
      // Validate date column
      cy.get(`[data-row-key="${i}"] > :nth-child(2)`)
        .should('contain.text', formattedDate);

      // Assert 'File' is present in column 4
      cy.get(`[data-row-key="${i}"] > :nth-child(4)`)
        .should('contain.text', 'File');

      // Assert amount matches the one captured earlier
      cy.get('@paymentAmountnew').then((expectedAmount) => {
        cy.get(`[data-row-key="${i}"] > :nth-child(7)`)
          .should('contain.text', expectedAmount);
      });
    }
  });
});
it('Verify that the user is able to upload and proceed the valid file(no errors) using EUR and Volopa Collection Account(different currency)', function () {
  login.Login(userName, password);
  paymentD.goToPaymentsDashborad();
  massP.gotoFileUpload();

  const fileName = 'uploadFiles/Valid GBP file.csv';
  const justFileName = fileName.split('/').pop();

  cy.get('input[type="file"]').attachFile(fileName);
  cy.wait(1000);
  cy.get('.ant-upload-list-item-name').should('contain.text', justFileName);
  cy.wait(3000);

  massP.reviewFile();
  massP.validateValidFile();

  // Invoking the recipient receive amount
  cy.get(':nth-child(7) > .ant-col > .ant-typography > .bold')
    .should('be.visible')
    .invoke('text')
    .then((text) => {
      const amount = text.trim();
      cy.log('Fetched amount from page:', amount);
      expect(amount).to.not.be.empty;
      cy.wrap(amount).as('paymentAmount');
    });

  // Invoking the file currency for later validation
  cy.get(':nth-child(7) > .ant-col > .ant-typography')
    .should('be.visible')
    .invoke('text')
    .then((text) => {
      const currency = text.split('-')[0].trim(); // e.g., "GBP"
      cy.wrap(currency).as('currencyCode'); // Alias the string
    });

  // Invoking the total count of payments
  cy.get('body > div:nth-child(2) > section:nth-child(1) > main:nth-child(2) > div:nth-child(1) > div:nth-child(1) > div:nth-child(5) > div:nth-child(1) > span:nth-child(1)')
    .invoke('text')
    .then((text) => {
      const count = parseInt(text.split('-')[1].trim()); // Get number after '-'
      cy.wrap(count).as('paymentCount');
    });

  massP.proceedFlow('EUR{enter}', 'EUR');

  // Validating the recipient receive amount
  cy.get('@paymentAmount').then((expectedAmount) => {
    cy.get('.row-border > :nth-child(2)')
      .should('be.visible')
      .invoke('text')
      .then((actualAmount) => {
        const cleanActual = actualAmount.trim();
        cy.log('Actual amount from table:', cleanActual);
        expect(cleanActual).to.eq(expectedAmount);
      });
  });

  // Validating the file currency
  cy.get('@currencyCode').then((currency) => {
    cy.get('.row-border > :nth-child(1)')
      .should('contain.text', currency);
  });

  // Invoking the "you send us" amount
  cy.get('.m-t-40 > .ant-col > .ant-card > .ant-card-body > .ant-space > :nth-child(2) > .ant-typography')
    .invoke('text')
    .then((amountText) => {
      const trimmed = amountText.replace(/\s+/g, ''); // e.g., "462.50GBP"
      cy.wrap(trimmed).as('paymentAmountnew');
    });

  // Pay the file
  massP.payRecipients();

  // Validate the currency on Final Review last page
  cy.get('@currencyCode').then((currency) => {
    cy.get('tr[class="ant-table-row ant-table-row-level-0 row-border medium fs-18px "] td:nth-child(1)')
      .should('contain.text', currency);
  });

  // Validate the amount on Final Review last page
  cy.get('@paymentAmount').then((expectedAmount) => {
    cy.get('tr[class="ant-table-row ant-table-row-level-0 row-border medium fs-18px "] td:nth-child(2)')
      .should('be.visible')
      .invoke('text')
      .then((actualAmount) => {
        const cleanActual = actualAmount.trim();
        cy.log('Actual amount from table:', cleanActual);
        expect(cleanActual).to.eq(expectedAmount);
      });
  });
  massP.selectCollectionFundingMethod()
  massP.goToPaymentHistory();

  // Validate the payment history
  cy.get('@paymentCount').then((count) => {
    const today = new Date();
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    const formattedDate = today.toLocaleDateString('en-US', options);

    for (let i = 0; i < count; i++) {
      // Validate date column
      cy.get(`[data-row-key="${i}"] > :nth-child(2)`)
        .should('contain.text', formattedDate);

      // Assert 'File' is present in column 4
      cy.get(`[data-row-key="${i}"] > :nth-child(4)`)
        .should('contain.text', 'File');

      // Assert amount matches the one captured earlier
      cy.get('@paymentAmountnew').then((expectedAmount) => {
        cy.get(`[data-row-key="${i}"] > :nth-child(7)`)
          .should('contain.text', expectedAmount);
      });
    }
  });
});
it.only('Verify that the user is able to upload and proceed the valid file(no errors) using GBP and Easy Transfer(same currency)', function () {
  login.Login(userName, password);
  paymentD.goToPaymentsDashborad();
  massP.gotoFileUpload();

  const fileName = 'uploadFiles/Valid GBP file.csv';
  const justFileName = fileName.split('/').pop();

  cy.get('input[type="file"]').attachFile(fileName);
  cy.wait(1000);
  cy.get('.ant-upload-list-item-name').should('contain.text', justFileName);
  cy.wait(3000);

  massP.reviewFile();
  massP.validateValidFile();

  // Invoking the recipient receive amount
  cy.get(':nth-child(7) > .ant-col > .ant-typography > .bold')
    .should('be.visible')
    .invoke('text')
    .then((text) => {
      const amount = text.trim();
      cy.log('Fetched amount from page:', amount);
      expect(amount).to.not.be.empty;
      cy.wrap(amount).as('paymentAmount');
    });

  // Invoking the file currency for later validation
  cy.get(':nth-child(7) > .ant-col > .ant-typography')
    .should('be.visible')
    .invoke('text')
    .then((text) => {
      const currency = text.split('-')[0].trim(); // e.g., "GBP"
      cy.wrap(currency).as('currencyCode'); // Alias the string
    });

  // Invoking the total count of payments
  cy.get('body > div:nth-child(2) > section:nth-child(1) > main:nth-child(2) > div:nth-child(1) > div:nth-child(1) > div:nth-child(5) > div:nth-child(1) > span:nth-child(1)')
    .invoke('text')
    .then((text) => {
      const count = parseInt(text.split('-')[1].trim()); // Get number after '-'
      cy.wrap(count).as('paymentCount');
    });

  massP.proceedFlow('GBP{enter}', 'GBP');

  // Validating the recipient receive amount
  cy.get('@paymentAmount').then((expectedAmount) => {
    cy.get('.row-border > :nth-child(2)')
      .should('be.visible')
      .invoke('text')
      .then((actualAmount) => {
        const cleanActual = actualAmount.trim();
        cy.log('Actual amount from table:', cleanActual);
        expect(cleanActual).to.eq(expectedAmount);
      });
  });

  // Validating the file currency
  cy.get('@currencyCode').then((currency) => {
    cy.get('.row-border > :nth-child(1)')
      .should('contain.text', currency);
  });

  // Invoking the "you send us" amount
  cy.get('.m-t-40 > .ant-col > .ant-card > .ant-card-body > .ant-space > :nth-child(2) > .ant-typography')
    .invoke('text')
    .then((amountText) => {
      const trimmed = amountText.replace(/\s+/g, ''); // e.g., "462.50GBP"
      cy.wrap(trimmed).as('paymentAmountnew');
    });

  // Pay the file
  massP.payRecipients();

  // Validate the currency on Final Review last page
  cy.get('@currencyCode').then((currency) => {
    cy.get('tr[class="ant-table-row ant-table-row-level-0 row-border medium fs-18px "] td:nth-child(1)')
      .should('contain.text', currency);
  });

  // Validate the amount on Final Review last page
  cy.get('@paymentAmount').then((expectedAmount) => {
    cy.get('tr[class="ant-table-row ant-table-row-level-0 row-border medium fs-18px "] td:nth-child(2)')
      .should('be.visible')
      .invoke('text')
      .then((actualAmount) => {
        const cleanActual = actualAmount.trim();
        cy.log('Actual amount from table:', cleanActual);
        expect(cleanActual).to.eq(expectedAmount);
      });
  });
  massP.selectEasyTransferFundingMethod()
  massP.validateYapilyFlow()
  //massP.goToPaymentHistory();

  // Validate the payment history
  cy.get('@paymentCount').then((count) => {
    const today = new Date();
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    const formattedDate = today.toLocaleDateString('en-US', options);

    for (let i = 0; i < count; i++) {
      // Validate date column
      cy.get(`[data-row-key="${i}"] > :nth-child(2)`)
        .should('contain.text', formattedDate);

      // Assert 'File' is present in column 4
      cy.get(`[data-row-key="${i}"] > :nth-child(4)`)
        .should('contain.text', 'File');

      // Assert amount matches the one captured earlier
      cy.get('@paymentAmountnew').then((expectedAmount) => {
        cy.get(`[data-row-key="${i}"] > :nth-child(7)`)
          .should('contain.text', expectedAmount);
      });
    }
  });
});




})
