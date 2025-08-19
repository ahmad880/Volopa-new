const variable1= require('../PageElements/AdditionalCurrencies.json')
const variable= require('../PageElements/PaymentsDashboard.json')
const variable2 = require('../PageElements/BatchPayments.json')

export class AdditionalCurrencies {
    goToPaymentsDashborad(){
        cy.get(variable.paymentsDashboardLocators.menuBtn).should('be.visible').click()
        cy.get(variable.paymentsDashboardLocators.paymentsDashboardBtn).should('be.visible').click()
        cy.get(variable.paymentsDashboardLocators.paymentsDashbordHeading).should('contain.text','Payments Dashboard')
    }
    gotoRecipientList(){
        cy.get(variable1.additionalCurrenciesLocators.recipientList).should('be.visible').click()
        cy.get(variable1.additionalCurrenciesLocators.recipientListHeading).should('contain.text','Recipient List')
    }
    addRecipient(Country ,Currencies,email){
        cy.get(variable1.additionalCurrenciesLocators.addRecipient).should('be.visible').click()
        cy.get(variable1.additionalCurrenciesLocators.selectCountry).should('be.visible').click()
        .get(variable1.additionalCurrenciesLocators.countryDropDownHeading).should('be.visible').type(Country)
        cy.get(variable1.additionalCurrenciesLocators.selectCurrency).should('be.visible').click().wait(3000).type(Currencies)
        cy.get(variable1.additionalCurrenciesLocators.emailHeading).should('be.visible').should('contain.text','Recipient Email Address')
        cy.get('#recipientEmail').type(email)
    }
    addBankDetails(iban,swift){
        cy.get(variable1.additionalCurrenciesLocators.iBAN).should('be.visible').type(iban)
        cy.get(variable1.additionalCurrenciesLocators.sWIFT).should('be.visible').type(swift)
        cy.get(variable1.additionalCurrenciesLocators.bankDetails).should('be.visible')
        
    }
    individualRecipient(Name,country){
        cy.get(variable1.additionalCurrenciesLocators.individual).click()
        cy.get(variable1.additionalCurrenciesLocators.submitBtn).should('be.disabled')
        cy.get(variable1.additionalCurrenciesLocators.firstName).type(Name)
        cy.get(variable1.additionalCurrenciesLocators.lastName).type('Automation')
        cy.get(variable1.additionalCurrenciesLocators.address).type('489 Avenue Louise Brussels 1050')
        cy.get(variable1.additionalCurrenciesLocators.city).type('London')
        //In case of corpay change 7 to 8
        cy.get(':nth-child(8) > .ant-col-xs-24 > .ant-form-item > .ant-row > .ant-form-item-label > .ant-form-item-required > .ant-typography').should('contain.text','Recipient Country')
        cy.get('#beneficiaryCountry').type(country)
    }
    BusinessCNY(name,country){
        cy.get('.m-t-20 > .ant-col-xs-24 > :nth-child(1) > .ant-row > .ant-form-item-label > label > .ant-typography').should('be.visible')
        cy.get(variable1.additionalCurrenciesLocators.businessName).should('be.visible').type(name)
        cy.get(variable1.additionalCurrenciesLocators.businessDescription).should('be.visible').type('Automation')
        cy.get(variable1.additionalCurrenciesLocators.address).should('be.visible').type('Automated address')
        cy.get(variable1.additionalCurrenciesLocators.city).should('be.visible').type('China')
        cy.get('#beneficiaryCountry').type(country)
    }
    individualRecipientMexico(Name,country){
        cy.get(variable1.additionalCurrenciesLocators.individual).click()
        cy.get(variable1.additionalCurrenciesLocators.submitBtn).should('be.disabled')
        cy.get(variable1.additionalCurrenciesLocators.firstName).type(Name)
        cy.get(variable1.additionalCurrenciesLocators.lastName).type('Individual Automation')
        cy.get(variable1.additionalCurrenciesLocators.address).type('489 Avenue Louise Brussels 1050')
        cy.get(variable1.additionalCurrenciesLocators.city).type('London')
        //in case of corpay change 7 to 8
        cy.get(':nth-child(8) > .ant-col-xs-24 > .ant-form-item > .ant-row > .ant-form-item-label > .ant-form-item-required > .ant-typography').should('contain.text','Recipient Country')
        cy.get('#beneficiaryCountry').type(country)
    }
    postCodeState(){
        cy.get('#postcode').type('32013')
        cy.get('#state').type('CAMPECHE{enter}')
    }
    postCodeStateUS(){
        cy.get('#postcode').type('32013')
        cy.get('#state').type('CALIFORNIA{enter}')
    }
    postCodeStateCanada(){
        cy.get('#postcode').type('R3E 2B4')
        cy.get('#state').type('ALBERTA{enter}')
    }
    saveRecipient(){
        cy.wait(3000)
        cy.get(variable1.additionalCurrenciesLocators.submitBtn).click()
        cy.get(variable1.additionalCurrenciesLocators.successMessage).should('be.visible') // success msg
        cy.get(variable1.additionalCurrenciesLocators.payRecipient).click() //Pay this recipient
    }
    addBusinessRecipient(country){
        cy.get(variable1.additionalCurrenciesLocators.businessRecipient).click()
        cy.get(variable1.additionalCurrenciesLocators.businessName).type('Bussines Automation')
        cy.get(variable1.additionalCurrenciesLocators.businessDescription).type('Testing')
        cy.get(variable1.additionalCurrenciesLocators.businessNature).type('Testing')
        cy.get(variable1.additionalCurrenciesLocators.businessWebsite).type('testing.com')
        cy.get(variable1.additionalCurrenciesLocators.address).type('489 Avenue Louise Brussels 1050')
        cy.get(variable1.additionalCurrenciesLocators.city).type('London')
        //in case of corpay change 7 to 8
        cy.get(':nth-child(8) > .ant-col-xs-24 > .ant-form-item > .ant-row > .ant-form-item-label > .ant-form-item-required > .ant-typography').should('contain.text','Recipient Country')
        cy.get('#beneficiaryCountry').type(country)
    }
    addBusinessRecipientCorpay(country, name) {
    cy.get(variable1.additionalCurrenciesLocators.businessRecipient).click();

    // "Business <name> Automation"
    cy.get(variable1.additionalCurrenciesLocators.businessName)
      .type(`Business ${name} Automation`);

    cy.get(variable1.additionalCurrenciesLocators.businessDescription).type('Testing');
    cy.get(variable1.additionalCurrenciesLocators.businessNature).type('Testing');
    cy.get(variable1.additionalCurrenciesLocators.businessWebsite).type('testing.com');
    cy.get(variable1.additionalCurrenciesLocators.address).type('489 Avenue Louise Brussels 1050');
    cy.get(variable1.additionalCurrenciesLocators.city).type('London');

    // In case of Corpay, change the index 7 to 8
    cy.get(':nth-child(8) > .ant-col-xs-24 > .ant-form-item > .ant-row > .ant-form-item-label > .ant-form-item-required > .ant-typography')
      .should('contain.text', 'Recipient Country');

    cy.get('#beneficiaryCountry').type(country);
}
    tryIncorpnumber(number){
        cy.get("label[for='incorporationNumber'] span[class='ant-typography muli semi-bold fs-24px dark-green']").should('be.visible').should('contain.text','Business Incorporation Number')
        cy.get('#incorporationNumber').type(number)
    }
    addBusinessRecipientforMassTesting(country, businessName){
        cy.get(variable1.additionalCurrenciesLocators.businessRecipient).click();
        cy.get(variable1.additionalCurrenciesLocators.businessName).type(businessName);
        cy.get(variable1.additionalCurrenciesLocators.businessDescription).type('Testing');
        cy.get(variable1.additionalCurrenciesLocators.businessNature).type('Testing');
        cy.get(variable1.additionalCurrenciesLocators.businessWebsite).type('testing.com');
        cy.get(variable1.additionalCurrenciesLocators.address).type('489 Avenue Louise Brussels 1050');
        cy.get(variable1.additionalCurrenciesLocators.city).type('London');
        cy.get(':nth-child(8) > .ant-col-xs-24 > .ant-form-item > .ant-row > .ant-form-item-label > .ant-form-item-required > .ant-typography').should('contain.text', 'Recipient Country');
        cy.get('#beneficiaryCountry').type(country);
    }
    
    addBankDetailsWithAccNo(swift,accNo){
        cy.get(variable1.additionalCurrenciesLocators.sWIFT).should('be.visible').type(swift)
        cy.get(variable1.additionalCurrenciesLocators.accountNo).should('be.visible').type(accNo)
        cy.get(variable1.additionalCurrenciesLocators.bankDetails).should('be.visible')
    }
    singaporeCorpayDeatails(bankcode,branchcode){
        cy.get('#bank_code').type(bankcode)
        cy.get('#branch_code').type(branchcode)
    }
    indiaAccountType(type){
        cy.get('#accountType').should('be.visible').type(type)
    }
    checkSettelment(regular,priority){
        cy.get(variable2.batchPaymentsPageLocators.loadingIcon).should('not.exist')
        cy.get(variable1.additionalCurrenciesLocators.createAPaymentPageHeading).should('be.visible')
        cy.get(variable1.additionalCurrenciesLocators.settelmentRegular).should('be.visible').should(regular)
        cy.get(variable1.additionalCurrenciesLocators.settelmentPeriority).should('be.visible').should(priority)
    }
    checkAmountLimit(amount,errormsg){
        cy.get(variable1.additionalCurrenciesLocators.amountField).type(amount)
        cy.get(variable1.additionalCurrenciesLocators.amountErrorMsg).should('contain.text',errormsg)
    }
    addBankDetailsWithClabe(swift,clabe){
        cy.get(variable1.additionalCurrenciesLocators.sWIFT).should('be.visible').type(swift)
        cy.get(variable1.additionalCurrenciesLocators.clabe).should('be.visible').type(clabe)
        cy.get(variable1.additionalCurrenciesLocators.bankDetails).should('be.visible')
        
    }
    mexicoCorpay(accountType){
        cy.get('#accountType').should('be.visible').type(accountType)
    }
    checkSettelmentEnabledBoth(regular,priority){
        cy.get(variable1.additionalCurrenciesLocators.createAPaymentPageHeading).should('be.visible')
        cy.wait(3000)
        cy.get(variable1.additionalCurrenciesLocators.regularEnabled).should('be.visible').should(regular)
        cy.get(variable1.additionalCurrenciesLocators.settelmentPeriority).should('be.visible').should(priority)
    }
    // For only Mexico
    validateAddRecipient(country){
        cy.get(variable1.additionalCurrenciesLocators.addRecipient).should('be.visible').click()
        cy.get(variable1.additionalCurrenciesLocators.selectCountry).should('be.visible').click({force:true})
        .get(variable1.additionalCurrenciesLocators.countryDropDownHeading).should('be.visible').type(country)
    }
    validateCLABEFeild1(currencies){
        cy.get(variable1.additionalCurrenciesLocators.selectCurrency).should('be.visible').click({force:true}).wait(3000).type(currencies)
        cy.get(variable1.additionalCurrenciesLocators.clabeFeild).should('be.visible').should('contain.text','CLABE')
    }
    validateCLABEFeild2(currency){
        cy.get(variable1.additionalCurrenciesLocators.selectCurrency1).type(currency)
        cy.get(variable1.additionalCurrenciesLocators.clabeFeild).should('be.visible').should('contain.text','CLABE')
    }
    paymentPurpose(){
        cy.get('#paymentPurpose').click()
        cy.get('[class="ant-select-item ant-select-item-option"]').eq(0).should('be.visible').click()
    }
    // For only INDIA
    addIndiaBankDetail(){
        cy.get(variable1.additionalCurrenciesLocators.accountNo).type('00001299123456')
        cy.get('#ifsc').type('UTIB0000004')
        // cy.get(':nth-child(5) > .ant-col-xs-24 > .ant-form-item > .ant-row > .ant-form-item-label > .ant-form-item-required > .ant-typography').should('contain.text','Bank Account Type')
        // cy.get('#accountType').type('Current{enter}')
    }
    // For Bahrain
    selectCurrency(country,currency){
        cy.get(variable1.additionalCurrenciesLocators.selectCountry).should('be.visible').click({force:true})
        .get(variable1.additionalCurrenciesLocators.countryDropDownHeading).should('be.visible').type(country)
        cy.get(variable1.additionalCurrenciesLocators.selectCurrency).should('be.visible').click({force:true}).wait(3000).type(currency)
    }
    validateErrorMsg(){
        cy.get(variable1.additionalCurrenciesLocators.submitBtn).click()
        cy.get('.ant-form-item-explain-error').should('contain.text','Please select Payment Purpose')
    }
    addBankDetailsChina(swift,accNo,cNAPS){
        cy.get(variable1.additionalCurrenciesLocators.sWIFT).should('be.visible').type(swift)
        cy.get(variable1.additionalCurrenciesLocators.accountNo).should('be.visible').type(accNo)
        cy.get('#cnaps').should('be.visible').type(cNAPS)
        cy.get(variable1.additionalCurrenciesLocators.bankDetails).should('be.visible')
        cy.get('.ant-space-item > .ant-card > .ant-card-body > :nth-child(2) > .ant-col > .ant-typography').click()
    }
    addAccountandSortcode(account,sortCode){
        cy.get('#accNumber').should('be.visible').type(account)
        cy.get('#sortCode').should('be.visible').type(sortCode)
        //cy.get(variable1.additionalCurrenciesLocators.bankDetails).should('be.visible')
    }
    paymentPurpose1() {
        cy.get('#paymentPurpose').click();
        
        // Generate a random index between 0 and 5
        const randomIndex = Cypress._.random(0, 5);
        
        cy.get('[class="ant-select-item ant-select-item-option"]')
          .eq(randomIndex)
          .should('be.visible')
          .click();
    
        // Log the selected index for debugging
        console.log(`Selected payment purpose index: ${randomIndex}`);
    }
}