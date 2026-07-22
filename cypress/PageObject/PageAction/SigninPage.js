const el = require('../PageElements/Signin.json').signinLocators;

export class SigninPage {
    Login(email, password) {
        cy.get(el.welcomeHeading).should('contain', 'Welcome Back!');
        cy.get(el.username).type(email);
        cy.get(el.password).type(password);
        cy.get(el.submitBtn).should('be.visible').click({ force: true });
    }

    signinflow() {
        cy.get(el.welcomeHeading).should('contain', 'Welcome Back!');
        cy.get(el.submitBtn).should('be.visible').click({ force: true });
        cy.get(el.usernameError).should('have.text', 'Please Enter Your Username/email');
        cy.get(el.passwordError).should('have.text', 'Please Enter Your Password');
        cy.get(el.username).type('testnew@volopa.com');
        cy.get(el.password).type('testTest1@');
        cy.get(el.submitBtn).should('be.visible').click({ force: true });
    }

    negativesigninflow() {
        cy.get(el.welcomeHeading).should('contain', 'Welcome Back!');
        cy.get(el.submitBtn).should('be.visible').click({ force: true });
        cy.get(el.usernameError).should('have.text', 'Please Enter Your Username/email');
        cy.get(el.passwordError).should('have.text', 'Please Enter Your Password');
        cy.get(el.username).type('testnew@volopa.com');
        cy.get(el.password).type('testTest1');
        cy.get(el.submitBtn).should('be.visible').click({ force: true });
        cy.get(el.errorToast).should('be.visible');
    }

    forgetPassword() {
        cy.get(el.forgotPasswordLink).eq(0).click({ force: true });
        cy.get(el.forgotInstruction)
          .should('have.text', 'Please enter your email to receive a link to reset your password');
        cy.get(el.forgotSubmitBtn).should('be.visible').click({ force: true });
        cy.get(el.forgotEmailError).should('have.text', 'Please Enter Your Username/email');
        cy.get(el.forgotEmail).type('testnew@volopa.com');
        cy.get(el.forgotSubmitBtn).should('be.visible').click({ force: true });
        cy.get(el.forgotSuccessText)
          .should('have.text', 'Please check your email for a link to reset your password');
        cy.get(el.forgotBackBtn).should('be.visible').click({ force: true }).wait(2000);
    }

    required_field() {
        cy.get(el.submitBtn).click({ force: true });
        cy.get(el.usernameError).should('contain.text', 'Please Enter Your Username/email');
        cy.get(el.passwordError).should('contain', 'Please Enter Your Password');
    }
}