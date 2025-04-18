/// <reference types = "cypress"/>

import { PaymentsHistory } from "../PageObject/PageAction/PaymentsHistory"
import { SigninPage } from "../PageObject/PageAction/SigninPage"
import { PaymentsDashboard } from "../PageObject/PageAction/PaymentsDashboard"
const fs = require('fs');
const path = require('path');
const { PDFDocument } = require('pdf-lib');

const paymentsHistory = new PaymentsHistory
const signin = new SigninPage
const paymentspage = new PaymentsDashboard

describe('Payments History',function(){
    let userName = 'qwerty_admin_2'
    let password = 'testTest1'
    beforeEach(() => {
        cy.window().then((win) => {
            win.localStorage.clear();
            win.sessionStorage.clear();
        });
        cy.visit('https://webapp07.volopa-dev.com')
        paymentspage.clearCache()
        signin.Login(userName, password)
        cy.viewport(1440,1000)
    })

    it('TC_PH_001 - Verify that user landed on the Payments History page', function(){
        paymentspage.goToPaymentsDashborad()
        paymentsHistory.goToPaymentsHistory()
    })
    it('TC_PH_002 - Verify that Search Bar present on the Payments History page is working fine', function(){
        paymentspage.goToPaymentsDashborad()
        paymentsHistory.goToPaymentsHistory()
        paymentsHistory.validateSearchBar('Ali')
    })
    xit('TC_PH_003 - Validate that the pagination is working fine on "Payements History" page', function(){
        paymentspage.goToPaymentsDashborad()
        paymentsHistory.goToPaymentsHistory()
        paymentsHistory.validatePaginationFilters('100 / page')
        paymentsHistory.validatePagination()
    })
    it('TC_PH_004 - Validate the pagination filters work as intended', function(){
        paymentspage.goToPaymentsDashborad()
        paymentsHistory.goToPaymentsHistory()
        paymentsHistory.validatePaginationFilters('10 / page')
        paymentsHistory.validateRows(10)
        paymentsHistory.validatePaginationFilters('50 / page')
        paymentsHistory.validateRows(50)
    })
    it('TC_PH_005 - Verify that by default there should be 20 recipents in Payment History page.', function(){
        paymentspage.goToPaymentsDashborad()
        paymentsHistory.goToPaymentsHistory()
        paymentsHistory.validateDefaultPaginationFilter('20 / page')
    })
    it('TC_PH_006 - Verify that on clicking "Repeat" button, user navigates to New Payment page and is able to repeat it', function(){
        paymentspage.goToPaymentsDashborad()
        paymentsHistory.goToPaymentsHistory()
        paymentsHistory.validateRepeatBtn()
    })
    it('TC_PH_007 - Verify that on clicking "Draft Payments" button, user navigates to Drafts Payment page', function(){
        paymentspage.goToPaymentsDashborad()
        paymentsHistory.goToPaymentsHistory()
        paymentsHistory.goToDraftPayments()
    })
    it('TC_PH_008 - Verify that on clicking "Review" button, user navigates to Payments Summary page', function(){
        paymentspage.goToPaymentsDashborad()
        paymentsHistory.goToPaymentsHistory()
        paymentsHistory.goToDraftPayments()
        paymentsHistory.goToReviewPayments()
    })
    it('TC_PH_009 - Verify that on clicking "Return to Draft Payments" button, user navigates to Draft Payments page', function(){
        paymentspage.goToPaymentsDashborad()
        paymentsHistory.goToPaymentsHistory()
        paymentsHistory.goToDraftPayments()
        paymentsHistory.goToReviewPayments()
        paymentsHistory.goToDraftPaymentsDashboard()
    })
    it('TC_PH_010 - Verify that on clicking "Delete Draft" button, user is able to delete it and navigates to Draft Payments page', function(){
        paymentspage.goToPaymentsDashborad()
        paymentsHistory.goToPaymentsHistory()
        paymentsHistory.goToDraftPayments()
        paymentsHistory.goToReviewPayments()
        paymentsHistory.goToDeleteDreft()
    })
    xit('TC_PH_011 - Verify that on clicking "Pay Recipient" button, user is able to delete it and navigates to Draft Payments page', function(){
        paymentspage.goToPaymentsDashborad()
        paymentsHistory.goToPaymentsHistory()
        paymentsHistory.goToDraftPayments()
        paymentsHistory.goToReviewPayments()
        
    })
    it('TC_PH_012 - Validate that the pagination is working fine on "Draft Payment" page', function(){
        paymentspage.goToPaymentsDashborad()
        paymentsHistory.goToPaymentsHistory()
        paymentsHistory.goToDraftPayments()
        paymentsHistory.validatePagination()
    })
    it('TC_PH_013 - Validate the pagination filters work as intended on Draft Payments page', function(){
        paymentspage.goToPaymentsDashborad()
        paymentsHistory.goToPaymentsHistory()
        paymentsHistory.goToDraftPayments()
        paymentsHistory.validatePaginationFilters('10 / page')
        paymentsHistory.validateRows(10)
        paymentsHistory.validatePaginationFilters('50 / page')
    })
    it('TC_PH_014 - Verify that by default there should be 10 recipents in Draft Payments page.', function(){
        paymentspage.goToPaymentsDashborad()
        paymentsHistory.goToPaymentsHistory()
        paymentsHistory.goToDraftPayments()
        paymentsHistory.validateDefaultPaginationFilter('10 / page')
    })
    it('TC_PH_015 - Verify that on clicking "Payment History" button present on Draft Payments page, the user is bale to navigate to "Payment History" page', function(){
        paymentspage.goToPaymentsDashborad()
        paymentsHistory.goToPaymentsHistory()
        paymentsHistory.goToDraftPayments()
        paymentsHistory.goToPaymentsHistoryBtn()
    })
    it('TC_PH_016 - Verify that Search Bar present on the Draft Payments page is working fine', function(){
        paymentspage.goToPaymentsDashborad()
        paymentsHistory.goToPaymentsHistory()
        paymentsHistory.goToDraftPayments()
        paymentsHistory.validateSearchBar('Hamza')
    })
    it('TC_PH_017 - Verify that on clicking "Manual Trade/Payments History" button, the user is bale to navigate to "Manual Trade History" page', function(){
        paymentspage.goToPaymentsDashborad()
        paymentsHistory.goToPaymentsHistory()
        paymentsHistory.goToManualTrade()
    })
    it('TC_PH_018 - Verify that Search Bar present on "Manual Trade/Payments History" is working fine', function(){
        paymentspage.goToPaymentsDashborad()
        paymentsHistory.goToPaymentsHistory()
        paymentsHistory.goToManualTrade()
        paymentsHistory.validateSearchBar('Account')
    })
    it('TC_PH_019 - Validate that the pagination is working fine on "Manual Trade/Payments History" page', function(){
        paymentspage.goToPaymentsDashborad()
        paymentsHistory.goToPaymentsHistory()
        paymentsHistory.goToManualTrade()
        paymentsHistory.validatePagination()
    })
    it('TC_PH_020 - Validate the pagination filters work as intended on "Manual Trade/Payments History" page', function(){
        paymentspage.goToPaymentsDashborad()
        paymentsHistory.goToPaymentsHistory()
        paymentsHistory.goToManualTrade()
        paymentsHistory.validatePaginationFilters('10 / page')
        paymentsHistory.validateRows(10)
        paymentsHistory.validatePaginationFilters('50 / page')
        paymentsHistory.validateRows(50)
    })
    it('TC_PH_021 - Verify that by default there should be 20 recipents in "Manual Trade/Payments History" page.', function(){
        paymentspage.goToPaymentsDashborad()
        paymentsHistory.goToPaymentsHistory()
        paymentsHistory.goToManualTrade()
        paymentsHistory.validateDefaultPaginationFilter('20 / page')
    })
    it('TC_PH_022 - Verify that by clicking on a recipient in "Manual Trade/Payments History", the user navigates to Specific Manual Trade History page', function(){
        paymentspage.goToPaymentsDashborad()
        paymentsHistory.goToPaymentsHistory()
        paymentsHistory.goToManualTrade()
        paymentsHistory.goToSpecificManualTrade()
    })
    xit('TC_PH_023 - Verify that by clicking on "Download PDF Statement" in "Manual Trade/Payments History" page, the user is able to download it', function(){
        paymentspage.goToPaymentsDashborad()
        paymentsHistory.goToPaymentsHistory()
        paymentsHistory.goToManualTrade()
        paymentsHistory.goToSpecificManualTrade()
        cy.get('.ant-spin-dot.ant-spin-dot-spin').should('not.exist')
        cy.get('.ant-row-end > .ant-btn').click(); // Replace with your actual button selector

        const downloadedFilePath = path.join(downloadsFolder, '15477.pdf'); // Replace with the actual file name

        // Wait for the file to be downloaded
        cy.wait(2000); // Adjust the wait time as needed

        // Read the downloaded PDF file
        cy.readFile(downloadedFilePath, 'binary', { timeout: 15000 }).then((pdfData) => {
            // Parse the PDF file
            const uint8Array = new Uint8Array(pdfData.length);
            for (let i = 0; i < pdfData.length; i++) {
                uint8Array[i] = pdfData.charCodeAt(i);
            }

            return PDFDocument.load(uint8Array);
        }).then((pdfDoc) => {
            // Extract text from the PDF
            return pdfDoc.getTextContent();
        }).then((textContent) => {
            // Perform your assertions here
            const pdfText = textContent.items.map(item => item.str).join(' ');
            expect(pdfText).to.include('15477'); // Replace with the expected text in the PDF
        });
    })
    it('TC_PH_024 - Verify that by clicking on "Payment Reports" Payments History page, the user navigates to Payment Reports page', function(){
        paymentspage.goToPaymentsDashborad()
        paymentsHistory.goToPaymentsHistory()
        paymentsHistory.verifyPaymentReports()
    })
    it('TC_PH_025 - Verify that user is able to download "Payment Reports" present in Payment Reports page', function(){
        paymentspage.goToPaymentsDashborad()
        paymentsHistory.goToPaymentsHistory()
        paymentsHistory.verifyPaymentReports()
        paymentsHistory.selectPaymentReport()
        paymentsHistory.downloadSelectedPaymentReport()
        paymentsHistory.confirmDownloadReport()
        paymentsHistory.verifyDownloadReport(path)
       
    })
    it('TC_PH_026 - Verify that user is able to select filters for "Payment Reports" present in Payment Reports page', function(){
        paymentspage.goToPaymentsDashborad()
        paymentsHistory.goToPaymentsHistory()
        paymentsHistory.verifyPaymentReports()
        paymentsHistory.selectReportsFilters('Month{enter}','Jan','May')
        paymentsHistory.verifyPaymentReportsFilter('Jan','May')
    })
    it('TC_PH_027 - Verify that on clicking "Cancel", user is able to navigate back to the Payment Reports page', function(){
        paymentspage.goToPaymentsDashborad()
        paymentsHistory.goToPaymentsHistory()
        paymentsHistory.verifyPaymentReports()
        paymentsHistory.selectReportsFilters('Month{enter}','Jan','Feb')
        paymentsHistory.cancelReportsFilter()
    })
    it('TC_PH_028 - Verify that on clicking a recipient, the user is able to navigate to Specific Payment History page', function(){
        paymentspage.goToPaymentsDashborad()
        paymentsHistory.goToPaymentsHistory()
        paymentsHistory.navigateToUser()
        paymentsHistory.verifySpecificPaymentHistoryPage()
    })
    it('TC_PH_029 - Verify that on clicking "Download PDF Statement", user is able to download PDF statement', function(){
        paymentspage.goToPaymentsDashborad()
        paymentsHistory.goToPaymentsHistory()
        paymentsHistory.navigateToUser()
        paymentsHistory.verifySpecificPaymentHistoryPage()
        paymentsHistory.downloadPDFStatement()
        paymentsHistory.verifyPDFStatement(path)
              
    })
    it('TC_PH_030 - Verify that on clicking "Repeat Batch", user is able to repeat that batch payment and navigates to Batch Payments page', function(){
        paymentspage.goToPaymentsDashborad()
        paymentsHistory.goToPaymentsHistory()
        paymentsHistory.navigateToUser()
        paymentsHistory.verifyRepeatBatch()             
    })
    it('TC_PH_031 - Verify that on clicking "Repeat" button, user is able to repeat that payment and navigates to New Payment page', function(){
        paymentspage.goToPaymentsDashborad()
        paymentsHistory.goToPaymentsHistory()
        paymentsHistory.navigateToUser()
        paymentsHistory.verifyRepeatPayment()             
    })
    it('TC_PH_032 - Verify that user is able to fill in the fields of Notes and Invoice Reference Number. Also he is able to add attachments. Lastly he is able to save that payment history on clicking "Save" button.', function(){
        paymentspage.goToPaymentsDashborad()
        paymentsHistory.goToPaymentsHistory()
        paymentsHistory.navigateToUser()
        paymentsHistory.fillData()   
        paymentsHistory.savePaymentHistory()       
    })
})