///<reference types = "Cypress" />

import { SignupPage } from "../PageObject/PageAction/SignupPage"
import { ReuseableCode } from "../support/ReuseableCode"

const registration = new SignupPage
const Reuse = new ReuseableCode

describe('Volopa',function(){
    beforeEach(()=>{
        cy.visit('/')
    })
    it('TC_SU-001  Sign up complete flow  ',()=>{
       registration.signup_button()
        registration.signup_Form1()
        registration.Signup_Form2()
        registration.signup_Form3()
        registration.signuo_Form4()
        registration.signup_Form5()

    })
    it('TC_SU-002  Validate and add "User Account" details on signup page with valid Password Strength Input Register with a password that meets the specified strength requirements.',()=>{
        registration.Form1_VAlidation()
    })
    it('TC_SU-003 Validate and add "Personal Account" details on signup page',()=>{
        registration.Form2_Validation()
    })
    it('TC_SU-004 Validate and add "Company Details" on sign  up page',()=>{
        registration.Form3_VAlidation()
    })
    it('TC_SU-005 Validate  and add "Select Services tab" in sign up page  ',()=>{
        registration.form4_validation()
    })
    it('TC_SU-006 Validate  and add "Expected Usage tab" in sign up page  ',()=>{
        registration.form5_validation()
    })
    it('TC_SU-007 Validate  and add "Confirmation tab" in sign up page  ',()=>{
        registration.form6_validation()
    })
    it('TC_SU-008 Validate Password Strength and Email: Input Register with a password that not meets the specified strength requirements.',()=>{
        registration.signup_passwordValidation()
    })
})