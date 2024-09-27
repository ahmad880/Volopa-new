///<reference types = "Cypress" />
const variable1= require('../PageElements/Signup.json')
import { ReuseableCode } from "../../support/ReuseableCode"
const reuseableCode = new ReuseableCode
export class SignupPage{

   signup_button(){
        cy.get(variable1.signupLocators.signUpButton).click({force:true})
   }
    signup_Form1(){
        cy.get(variable1.signupLocators.userAccount).should('contain','User Account')// validation
        cy.get(variable1.signupLocators.setUpUserAccount).should('have.text','Set up user account')// validation
        cy.get(variable1.signupLocators.bussinesEmail).should('contain','Business Email Address')
        const email = (reuseableCode.RandomString(7))+ ('@yopmail.com')
        cy.log(email)
        cy.get(variable1.signupLocators.bussinesEmailInput).type(email)
        cy.get(variable1.signupLocators.password).should('contain','Password')
        cy.get(variable1.signupLocators.passwordInput).type('testTest1')
        cy.get(variable1.signupLocators.confirmPassword).should('have.text','Confirm Password')
        cy.get(variable1.signupLocators.confirmPasswordInput).type('testTest1')
        cy.get(variable1.signupLocators.securityQuestion).should('have.text','Security Question')
        cy.get(variable1.signupLocators.securityQuestionInput).select(2).should('contain','What was the name of your first pet?')
        cy.get(variable1.signupLocators.securityAnswer).should('contain','Security Answer')
        cy.get(variable1.signupLocators.securityAnswerInput).type('cat')
        cy.get(variable1.signupLocators.hearAboutUs).should('have.text','How did you hear about us?')
        cy.get(variable1.signupLocators.hearAboutUsInput).select(1).should('contain','Search engine')
        cy.get(variable1.signupLocators.nextButton).click({force:true})
    }
    Signup_Form2(){
            //Form 2
        cy.get(variable1.signupLocators.personalDetailsHeader).should('contain','Personal Details')
        cy.get(variable1.signupLocators.personalDetails).should('have.text','Personal Details')
        cy.get(variable1.signupLocators.title).should('have.text','Title')
        cy.get(variable1.signupLocators.titleInput).select(1).should('contain','Mr.')
        cy.get(variable1.signupLocators.firstName).should('have.text','First Name')
        const FirstName = reuseableCode.getRandomFirstName()
        cy.log(FirstName)
        cy.get(variable1.signupLocators.firstNameInput).type(FirstName)
        cy.get(variable1.signupLocators.lastName).should('have.text','Last Name')
        const LastName = reuseableCode.getRandomLastName()
        cy.log(LastName)
        cy.get(variable1.signupLocators.lastNameInput).type(LastName)
        cy.get(variable1.signupLocators.dOB).type('2002-12-23')
        cy.get(variable1.signupLocators.mobileNumber).should('have.text','Mobile Number')
        const PhoneNo = reuseableCode.getRandomPhoneNumber()
        const PhoneNumber= "+92345"+PhoneNo
        cy.log(PhoneNumber)
        cy.get(variable1.signupLocators.mobileNumberInput).type(PhoneNumber)
        cy.get(variable1.signupLocators.nextButton).click({foece:true})
    }
    signup_Form3(){
        //Form-3
        cy.get(variable1.signupLocators.companyDetails).should('contain','Company Details')
        cy.get(variable1.signupLocators.aboutYourBusiness).should('have.text','Tell us about your business')
        cy.get(variable1.signupLocators.companyType).should('have.text','Company Type')
        cy.get(variable1.signupLocators.companyTypeInput).select(1).should('contain','PLC')
        cy.get(variable1.signupLocators.companyName).should('have.text','Company Name')
        cy.get(variable1.signupLocators.companyNameInput).type('ABC')
        cy.get(variable1.signupLocators.yourPosition).should('have.text','Your Position')
        cy.get(variable1.signupLocators.yourPositionInput).type('Tester')
        cy.get(variable1.signupLocators.countryOfCompany).should('contain','Country of Company Registration')
        cy.get(variable1.signupLocators.countryOfCompanyInput).select(1).should('contain','United Kingdom')
        cy.get(variable1.signupLocators.registrationNumber).should('contain','Company Registration Number')
        cy.get(variable1.signupLocators.registrationNumberInput).type('NB2314')
        cy.get(variable1.signupLocators.businessCategory).should('contain','Business Category/Industry')
        cy.get(variable1.signupLocators.businessCategoryInput).select(1).should('contain','Aerospace')
        cy.get(variable1.signupLocators.companyDescription).should('contain','Company Description')
        cy.get(variable1.signupLocators.companyDescriptionInput).type('testing automation ')
        cy.get(variable1.signupLocators.registeredAddress).should('contain','Registered Address')
        cy.get(variable1.signupLocators.address).should('contain','Address')
        cy.get(variable1.signupLocators.addressInput).type('London')
        cy.get(variable1.signupLocators.city).should('contain','City')
        cy.get(variable1.signupLocators.cityInput).type('London Uk')
        cy.get(variable1.signupLocators.postcode).should('contain','Postcode')
        cy.get(variable1.signupLocators.postcodeInput).type('Po1')
        cy.get(variable1.signupLocators.country).should('have.text','Country')
        cy.get(variable1.signupLocators.countryInput).select(1).should('contain','United Kingdom')
        cy.get(variable1.signupLocators.tradingAddress).should('have.text','Trading Address')
        cy.get(variable1.signupLocators.addressCheckbox).should('be.checked')
        cy.get(variable1.signupLocators.nextButton).click({force:true})
    }
    signuo_Form4(){
        //Form-4
        cy.get(variable1.signupLocators.prepaidCards).click({force:true})
        cy.get(variable1.signupLocators.nextButton).click({force:true})
    }
    signup_Form5(){
        //Form-5
        cy.get(variable1.signupLocators.expectedUsage).should('contain','Expected Usage')
        cy.get(variable1.signupLocators.first12Months).should('contain','How many cards will you need in the first 12 months?')
        cy.get(variable1.signupLocators.first12MonthsInput).type('2')
        cy.get(variable1.signupLocators.nonATMTransactions).should('contain','What do you think will be the average monthly value of non-ATM transactions per card?')
        cy.get(variable1.signupLocators.nonATMTransactionsInput).type('150000')
        cy.get(variable1.signupLocators.aTMWithdrawals).should('contain','What do you think will be the average monthly value of ATM withdrawals per card?')
        cy.get(variable1.signupLocators.aTMWithdrawalsInput).type('300000')
        cy.get(variable1.signupLocators.loadedEachCard).should('contain','What do you think will be the average monthly value loaded on to each card?')
        cy.get(variable1.signupLocators.loadedEachCardInput).type('200000')
        cy.get(variable1.signupLocators.nextButton).click({force:true})

        //Form-6
        cy.get(variable1.signupLocators.nextButton).click({force:true})


    }
    Form1_VAlidation(){
        this.signup_button()
        cy.get(variable1.signupLocators.setUpUserAccount).should('have.text','Set up user account')
        cy.scrollTo("bottom")
        cy.get(variable1.signupLocators.nextButton).click({force:true})
        cy.get(variable1.signupErrorLocators.blankEmailError).should('have.text','Email Primary cannot be blank.')
        cy.get(variable1.signupErrorLocators.blankPasswordError).should('have.text','Password cannot be blank.')
        cy.get(variable1.signupErrorLocators.securityQuestionError).should('have.text','Security Question cannot be blank.')
        cy.get(variable1.signupErrorLocators.securityAnswerError).should('have.text','Security Answer cannot be blank.')
        cy.get(variable1.signupErrorLocators.hearAboutUsError).should('have.text','Hear About Us Id cannot be blank.')
        cy.reload()
        this.signup_Form1()
    }

    Form2_Validation() {
        this.signup_button()
        this.signup_Form1()
        cy.get(variable1.signupLocators.personalDetails).should('have.text','Personal Details')
        cy.get(variable1.signupLocators.nextButton).click({force:true})
        cy.get(variable1.signupErrorLocators.titleError).should('have.text','Title cannot be blank.')
        cy.get(variable1.signupErrorLocators.firstNameError).should('have.text','First Name cannot be blank.')
        cy.get(variable1.signupErrorLocators.lastNameError).should('have.text','Last Name cannot be blank.')
        cy.get(variable1.signupErrorLocators.dOBError).should;('have.text','Dob cannot be blank.')
        cy.get(variable1.signupErrorLocators.telephoneError).should('have.text','Telephone Mobile cannot be blank.')
        cy.reload()
        this.Signup_Form2()
    }
    Form3_VAlidation(){
        this.signup_button()
        this.signup_Form1()
        this.Signup_Form2()
        cy.wait(2000)
        cy.scrollTo("bottom")
        cy.get(variable1.signupLocators.nextButton).click({force:true})
        cy.get(variable1.signupLocators.aboutYourBusiness).should('have.text','Tell us about your business')
        cy.get(variable1.signupErrorLocators.companyTypeError).should('contain','Company Type cannot be blank.')
        cy.get(variable1.signupErrorLocators.companyNameError).should('contain','Company Name cannot be blank.')
        cy.get(variable1.signupErrorLocators.position).should('contain','Please enter a value for Position.')
        cy.get(variable1.signupErrorLocators.registrationCountryError).should('have.text','Please enter a value for Company Registration Country.')
        cy.get(variable1.signupErrorLocators.companyNumberError).should('have.text','Please enter a value for Company Number.')
        cy.get(variable1.signupErrorLocators.companyIndustryError).should('have.text','Company Industry Type cannot be blank.')
        cy.get(variable1.signupErrorLocators.companyDescriptionError).should('have.text','Company Description cannot be blank.')
        cy.get(variable1.signupErrorLocators.registeredAddressError).should('have.text','Registered Address')
        cy.get(variable1.signupErrorLocators.companyAddressError).should('have.text','Company Address cannot be blank.')
        cy.get(variable1.signupErrorLocators.companyCityError).should('have.text','Company City cannot be blank.')
        cy.get(variable1.signupErrorLocators.companyPostcodeError).should('have.text','Company Postcode cannot be blank.')
        cy.get(variable1.signupErrorLocators.companyCountryError).should('have.text','Company Country cannot be blank.')
        cy.reload()
        this.signup_Form3()
    }
    form4_validation(){
        this.signup_button()
        this.signup_Form1()
        this.Signup_Form2()
        this.signup_Form3()
        cy.get(variable1.signupLocators.nextButton).should('be.visible').click()
        cy.get(variable1.signupErrorLocators.internationalPayments).eq(0).should('have.text','International Payments')
        cy.get(variable1.signupErrorLocators.internationalPayments).eq(1).should('have.text','Prepaid Cards')
        cy.reload()
        this.signuo_Form4()
    }
    form5_validation(){
        this.signup_button()
        this.signup_Form1()
        this.Signup_Form2()
        this.signup_Form3()
        this.signuo_Form4()
        cy.get(variable1.signupErrorLocators.tellUsABit).should('contain','Tell us a bit about how you expect to use the service')
        cy.scrollTo('bottom')
        cy.get('[type="submit"]').should('be.visible').click({force:true})
        cy.wait(2000)
        cy.get(variable1.signupErrorLocators.estimatedCard).eq(0).should;('have.text','Estimated Card Amount cannot be blank.')
        cy.get(variable1.signupErrorLocators.estimatedCard).eq(1).should('have.text','Estimated Monthly Card Non Atm Amount cannot be blank.')
        cy.get(variable1.signupErrorLocators.estimatedCard).eq(2).should('have.text','Estimated Monthly Card Atm Amount cannot be blank.')
        cy.get(variable1.signupErrorLocators.estimatedCard).eq(3).should('have.text','Estimated Monthly Card Load Amount cannot be blank.')
        cy.reload()
       // this.signup_Form5()
    }
    form6_validation(){
        this.signup_button()
        this.signup_Form1()
        this.Signup_Form2()
        this.signup_Form3()
        this.signuo_Form4()
        this.signup_Form5()
        cy.get('#submitBusinessForm div:nth-child(4) div:nth-child(2)').invoke('text').then(text=>{
            cy.wrap(text).as('companyEmail') //alias as companyEmail
        })
        cy.get('#submitBusinessForm div:nth-child(6) div:nth-child(2)').invoke('text').then(text=>{
            cy.wrap(text).as('SecurityAnswer')
        })
        
        cy.get(variable1.signupErrorLocators.editButton).should('contain.text','EDIT').click()
        cy.get('@companyEmail').then(companyEmail=>{
            cy.get('#signupbusinessapi-emailprimary').invoke('val').then(businessEmail=>{
                //const businessEmail = ele.text()
                cy.wrap(companyEmail).should('contain', businessEmail)
               
            })
        })
        cy.get('@SecurityAnswer').then(SecurityAnswer=>{
            cy.get('#signupbusinessapi-securityanswer').invoke('val').then(securityans=>{
                cy.wrap(SecurityAnswer).should('contain',securityans)
            })
        })
        cy.go('back')
        //Personal details varification
        cy.get('#submitBusinessForm div:nth-child(9) div:first-child').should('contain','Personal details')
        cy.get('div:nth-child(11) div:nth-child(2)').invoke('text').then(text=>{
            cy.wrap(text).as('FirstName')
        })
        //LastName Alias
        cy.get('div:nth-child(12) div:nth-child(2)').invoke('text').then(LastName=>{
            cy.wrap(LastName).as("LastName")
        })
        //PhoneNo alias
        cy.get('div:nth-child(14) div:nth-child(2)').invoke('text').then(PhoneNo=>{
            cy.wrap(PhoneNo).as("PhoneNo")
        })
        cy.get(':nth-child(9) > .col-sm-3 > .btn').should('contain.text','EDIT').click()
        cy.get('@FirstName').then(FirstName=>{
            cy.get('#signupbusinessapi-firstname').invoke('val').then(Fname=>{
                cy.wrap(FirstName).should('contain',Fname)
            })
         })
         cy.get('@LastName').then(LastName=>{
                cy.get('#signupbusinessapi-lastname').invoke('val').then(Lname=>{
                    cy.wrap(LastName).should('contain',Lname)
                })
        })
        cy.get('@PhoneNo').then(PhoneNo=>{
            cy.get('#signupbusinessapi-telephonemobile').invoke('val').then(phonenumber=>{
                cy.wrap(PhoneNo).should('contain',phonenumber)
            })
        })
        cy.go('back')
        cy.get("button[type='submit']").click({force:true})
    }
    signup_passwordValidation(){
        this.signup_button()
        cy.get(variable1.signupLocators.bussinesEmail).should('contain','Business Email Address')
        cy.get(variable1.signupLocators.bussinesEmailInput).type('Qatest')
        cy.get(variable1.signupLocators.password).should('contain','Password')
        cy.get(variable1.signupLocators.passwordInput).type('testest12')
        cy.get(variable1.signupLocators.confirmPassword).should('have.text','Confirm Password')
        cy.get(variable1.signupLocators.confirmPasswordInput).type('testTest1')
        cy.get(variable1.signupLocators.nextButton).click({force:true})
        cy.get(variable1.signupErrorLocators.worngEmailError).should('contain','Email Primary is not a valid email address.')
        cy.get(variable1.signupErrorLocators.worngPasswordError).should('contain','Password must have at least 1 capital letter')
        cy.get(variable1.signupErrorLocators.worngConfrimPassword).should('contain','Passwords do not match')
    }
}