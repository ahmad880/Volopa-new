///<reference types = "cypress"/>

import { SigninPage } from "../PageObject/PageAction/SigninPage";

const Login = new SigninPage

describe('',function(){
    beforeEach(()=>{
        cy.visit('https://webapp06.mybusiness.volopa-dev.com/')
        cy.viewport(1440,1000)
    })
it('TC_SIN_001 Input: Enter a valid email address and password.',()=>{
    Login.signinflow()
})
it('TC_SIN_002 Input: Click on the "Forgot Password" link and follow the password recovery process.',()=>{
    Login.forgetPassword()
})
it('TC_SIN_003 Input: Attempt to sign in with empty email and password fields.',()=>{
    Login.required_field()
})
it('TC_SIN_004 Verify that user is able to sign in with valid credentials.',()=>{
    Login.signinflow()
    cy.get("[data-testid='wd-total-company-balance-label']")
  .should('be.visible').should('contain.text','Total Company Balance')
})
it('TC_SIN_005 Verify that user is not able to sign in with invalid credentials.',()=>{
    Login.negativesigninflow()
    
})


})