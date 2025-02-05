///<reference types = "cypress"/>

import { SigninPage } from "../PageObject/PageAction/SigninPage";

const Login = new SigninPage

describe('',function(){
    beforeEach(()=>{
        cy.visit('/')
    })
it('TC_SIN_001 Input: Enter a valid email address and password.',()=>{
    Login.signinflow()
})
xit('TC_SIN_002 Input: Click on the "Forgot Password" link and follow the password recovery process.',()=>{
    Login.forgetPassword()
})
it('TC_SIN_004 Input: Attempt to sign in with empty email and password fields.',()=>{
    Login.required_field()
})
it('TC_SIN_005 Verify that eye icon in password field works correctly.',()=>{
    Login.signinflow()
    cy.get('.ant-typography.light-green.medium.fs-28px').should('be.visible').should('contain.text','Total Company Balance')
})


})