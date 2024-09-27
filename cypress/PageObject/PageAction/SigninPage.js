export class SigninPage{
    Login(email, password){
        cy.get(".ant-typography.fs-18px.medium").should('contain','Welcome Back!')
        cy.get("#username").type(email)
        cy.get("#password").type(password)
        cy.get("button[type='submit'] span").should('be.visible').click({force:true})
    }
    
    signinflow(){
        cy.get(".ant-typography.fs-18px.medium").should('contain','Welcome Back!')
        cy.get("button[type='submit'] span").should('be.visible').click({force:true})
        cy.get("div[id='username_help'] div[class='ant-form-item-explain-error']")
        .should('have.text','Please Enter Your Username/email')
        cy.get("div[id='password_help'] div[class='ant-form-item-explain-error']")
        .should('have.text','Please Enter Your Password')
        cy.get("#username").type('alexceaki+0141@gmail.com')
        cy.get("#password").type('testTest1')
        cy.get("button[type='submit'] span").should('be.visible').click({force:true})
    }
    forgetPassword(){
        cy.get('[class="dark-green fs-18px bold underline"]').eq(0).click({force:true})
        cy.get(".ant-typography.fs-18px.medium.center-align-text")
        .should('have.text','Please enter your email to receive a link to reset your password')
        cy.get("button[type='submit'] span").should('be.visible').click({force:true})
        cy.get(".ant-form-item-explain-error").should('have.text','Please Enter Your Username/email')
        cy.get("#username").type('alexceaki+0141@gmail.com')
        cy.get("button[type='submit'] span").should('be.visible').click({force:true})
        cy.get(".ant-typography.fs-18px.medium.center-align-text").should('have.text','Please check your email for a link to reset your password')
        cy.get("button[type='button'] span").should('be.visible').click({force:true}).wait(2000)

        cy.visit('https://mailtrap.io/signin')
        cy.get('#user_email').type('talha.naeem@volopa.com')
        cy.get('.login_next_button.button.button--medium.button--block').click({force:true})
        cy.get('#user_password').type('testTest1')
        cy.get("input[value='Log In']").click({force:true})
        cy.get("a[title='My Inbox']").should('be.visible').click()
        cy.get(".i18m0o91.i16w2k3p.isActive").click()
        //ifram started
       // cy.get("tbody tr td:nth-child(2) p:nth-child(1) a:nth-child(1)").click()
       cy.iframe("iframe[title='Message view']").find("tbody tr td:nth-child(2) p:nth-child(1) a:nth-child(1)").click()
    
    
        
    

    }
    required_field(){
        cy.get("button[type='submit']").click({force:true})
        cy.get("div[id='username_help'] div[class='ant-form-item-explain-error']")
        .should('contain.text','Please Enter Your Username/email')
        cy.get("div[id='password_help'] div[class='ant-form-item-explain-error']")
        .should('contain','Please Enter Your Password')
    }
}