const variable1= require('../PageElements/AdditionalCurrencies.json')
const variable= require('../PageElements/PaymentsDashboard.json')

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
    addRecipient(Country ,Currencies){
        cy.get(variable1.additionalCurrenciesLocators.addRecipient).should('be.visible').click()
        cy.get(variable1.additionalCurrenciesLocators.selectCountry).should('be.visible').click()
        .get(variable1.additionalCurrenciesLocators.countryDropDownHeading).should('be.visible').type(Country)
        cy.get(variable1.additionalCurrenciesLocators.selectCurrency).should('be.visible').click().wait(3000).type(Currencies)
        // cy.get(variable1.additionalCurrenciesLocators.emailHeading).should('be.visible').should('contain.text','Recipient Email Address')
        // cy.get(variable1.additionalCurrenciesLocators.emailFeild).should('be.visible').type('email@volopa.com')
    }
    addBankDetails(iban,swift){
        cy.get(variable1.additionalCurrenciesLocators.iBAN).should('be.visible').type(iban)
        cy.get(variable1.additionalCurrenciesLocators.sWIFT).should('be.visible').type(swift)
        cy.get(variable1.additionalCurrenciesLocators.bankDetails).should('be.visible')
    }
    individualRecipient(Name){
        cy.get(variable1.additionalCurrenciesLocators.individual).click()
        cy.get(variable1.additionalCurrenciesLocators.submitBtn).should('be.disabled')
        cy.get(variable1.additionalCurrenciesLocators.firstName).type(Name)
        cy.get(variable1.additionalCurrenciesLocators.lastName).type('Individual Automation')
        cy.get(variable1.additionalCurrenciesLocators.address).type('489 Avenue Louise Brussels 1050')
        cy.get(variable1.additionalCurrenciesLocators.city).type('London')
    }
    individualRecipientMexico(Name){
        cy.get(variable1.additionalCurrenciesLocators.individual).click()
        cy.get(variable1.additionalCurrenciesLocators.submitBtn).should('be.disabled')
        cy.get(variable1.additionalCurrenciesLocators.firstName).type(Name)
        cy.get(variable1.additionalCurrenciesLocators.lastName).type('Individual Automation')
        cy.get(variable1.additionalCurrenciesLocators.address).type('489 Avenue Louise Brussels 1050')
        cy.get(variable1.additionalCurrenciesLocators.city).type('London')
    }
    postCodeState(){
        cy.get('#postcode').type('54000')
        cy.get('#state').type('Monterry')
    }
    saveRecipient(){
        cy.get(variable1.additionalCurrenciesLocators.submitBtn).click()
        cy.get(variable1.additionalCurrenciesLocators.successMessage).should('be.visible') // success msg
        cy.get(variable1.additionalCurrenciesLocators.payRecipient).click() //Pay this recipient
    }
    addBusinessRecipient(){
        cy.get(variable1.additionalCurrenciesLocators.businessRecipient).click()
        cy.get(variable1.additionalCurrenciesLocators.businessName).type('Bussines Automation')
        cy.get(variable1.additionalCurrenciesLocators.businessDescription).type('Testing')
        cy.get(variable1.additionalCurrenciesLocators.businessNature).type('Testing')
        cy.get(variable1.additionalCurrenciesLocators.businessWebsite).type('testing.com')
        cy.get(variable1.additionalCurrenciesLocators.address).type('489 Avenue Louise Brussels 1050')
        cy.get(variable1.additionalCurrenciesLocators.city).type('London')
    }
    addBankDetailsWithAccNo(swift,accNo){
        cy.get(variable1.additionalCurrenciesLocators.sWIFT).should('be.visible').type(swift)
        cy.get(variable1.additionalCurrenciesLocators.accountNo).should('be.visible').type(accNo)
        cy.get(variable1.additionalCurrenciesLocators.bankDetails).should('be.visible')
    }
    checkSettelment(regular,priority){
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
        cy.get('#crossBorderPurposeCode').click()
        cy.get('[class="ant-select-item ant-select-item-option"]').eq(0).should('be.visible').click()
    }
    // For only INDIA
    addIndiaBankDetail(){
        cy.get(variable1.additionalCurrenciesLocators.accountNo).type('00001299123456')
        cy.get('#ifsc').type('UTIB0000004')
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
        cy.get('.ant-space-item > .ant-card > .ant-card-body').click()
    }
}