/// <reference types= "cypress" />

import { SigninPage } from "../PageObject/PageAction/SigninPage";
import { AdditionalCurrencies } from "../PageObject/PageAction/AdditionalCurrencies";
import { faker } from '@faker-js/faker';

const signin = new SigninPage
const newRecipient = new AdditionalCurrencies

describe('Mass Recipients ',function(){

    let userName = 'uk_test_2@volopa.com'
    let password = 'testTest1'
    beforeEach(function(){
        cy.window().then((win) => {
            win.localStorage.clear();
            win.sessionStorage.clear();
        });
        cy.visit('https://webapp6.volopa.com/', { timeout: 10000 })
        cy.viewport(1440,1000)
    })
    it.only('TC-Mass recipient for adding business - ', function(){
            signin.Login(userName, password);
    
            Cypress._.times(50, () => {  
                cy.log('Iteration started');
    
                const randomBusinessName = `Business ${faker.company.name()}`;
    
                newRecipient.goToPaymentsDashborad();
                newRecipient.gotoRecipientList();
                newRecipient.addRecipient('UNITED KINGDOM{enter}', 'GBP{enter}');
                newRecipient.addBankDetails('HU42117730161111101800000000', 'AKKHHUHB');
                newRecipient.addBusinessRecipientforMassTesting('United Kingdom{enter}', randomBusinessName);
                newRecipient.saveRecipient();
                newRecipient.checkSettelment('be.disabled', 'be.enabled');
    
                cy.log(`Iteration completed with Business Name: ${randomBusinessName}`);
            });
        });

    // Code for business recipient with currency GBP
        it.only('TC-Mass recipient for adding business - ', function(){
            signin.Login(userName, password);
    
            Cypress._.times(50, () => {  
                cy.log('Iteration started');
    
                const randomBusinessName = `Business ${faker.company.name()}`;
    
                newRecipient.goToPaymentsDashborad();
                newRecipient.gotoRecipientList();
                newRecipient.addRecipient('UNITED KINGDOM{enter}', 'GBP{enter}');
                newRecipient.addBankDetails('HU42117730161111101800000000', 'AKKHHUHB');
                newRecipient.addBusinessRecipientforMassTesting('United Kingdom{enter}', randomBusinessName);
                newRecipient.saveRecipient();
                newRecipient.checkSettelment('be.disabled', 'be.enabled');
    
                cy.log(`Iteration completed with Business Name: ${randomBusinessName}`);
            });
        });  

        it.only('TC-Mass recipient for adding business - ', function(){
            signin.Login(userName, password);
    
            Cypress._.times(50, () => {  
                cy.log('Iteration started');
    
                const randomBusinessName = `Business ${faker.company.name()}`;
    
                newRecipient.goToPaymentsDashborad();
                newRecipient.gotoRecipientList();
                newRecipient.addRecipient('UNITED KINGDOM{enter}', 'GBP{enter}');
                newRecipient.addBankDetails('HU42117730161111101800000000', 'AKKHHUHB');
                newRecipient.addBusinessRecipientforMassTesting('United Kingdom{enter}', randomBusinessName);
                newRecipient.saveRecipient();
                newRecipient.checkSettelment('be.disabled', 'be.enabled');
    
                cy.log(`Iteration completed with Business Name: ${randomBusinessName}`);
            });
        });

    // Code for business recipient with currency GBP
        it.only('TC-Mass recipient for adding business - ', function(){
            signin.Login(userName, password);
    
            Cypress._.times(50, () => {  
                cy.log('Iteration started');
    
                const randomBusinessName = `Business ${faker.company.name()}`;
    
                newRecipient.goToPaymentsDashborad();
                newRecipient.gotoRecipientList();
                newRecipient.addRecipient('UNITED KINGDOM{enter}', 'GBP{enter}');
                newRecipient.addBankDetails('HU42117730161111101800000000', 'AKKHHUHB');
                newRecipient.addBusinessRecipientforMassTesting('United Kingdom{enter}', randomBusinessName);
                newRecipient.saveRecipient();
                newRecipient.checkSettelment('be.disabled', 'be.enabled');
    
                cy.log(`Iteration completed with Business Name: ${randomBusinessName}`);
            });
        });
        it.only('TC-Mass recipient for adding business - ', function(){
            signin.Login(userName, password);
    
            Cypress._.times(50, () => {  
                cy.log('Iteration started');
    
                const randomBusinessName = `Business ${faker.company.name()}`;
    
                newRecipient.goToPaymentsDashborad();
                newRecipient.gotoRecipientList();
                newRecipient.addRecipient('UNITED KINGDOM{enter}', 'GBP{enter}');
                newRecipient.addBankDetails('HU42117730161111101800000000', 'AKKHHUHB');
                newRecipient.addBusinessRecipientforMassTesting('United Kingdom{enter}', randomBusinessName);
                newRecipient.saveRecipient();
                newRecipient.checkSettelment('be.disabled', 'be.enabled');
    
                cy.log(`Iteration completed with Business Name: ${randomBusinessName}`);
            });
        });

    // Code for business recipient with currency GBP
        it.only('TC-Mass recipient for adding business - ', function(){
            signin.Login(userName, password);
    
            Cypress._.times(50, () => {  
                cy.log('Iteration started');
    
                const randomBusinessName = `Business ${faker.company.name()}`;
    
                newRecipient.goToPaymentsDashborad();
                newRecipient.gotoRecipientList();
                newRecipient.addRecipient('UNITED KINGDOM{enter}', 'GBP{enter}');
                newRecipient.addBankDetails('HU42117730161111101800000000', 'AKKHHUHB');
                newRecipient.addBusinessRecipientforMassTesting('United Kingdom{enter}', randomBusinessName);
                newRecipient.saveRecipient();
                newRecipient.checkSettelment('be.disabled', 'be.enabled');
    
                cy.log(`Iteration completed with Business Name: ${randomBusinessName}`);
            });
        });
        it.only('TC-Mass recipient for adding business - ', function(){
            signin.Login(userName, password);
    
            Cypress._.times(50, () => {  
                cy.log('Iteration started');
    
                const randomBusinessName = `Business ${faker.company.name()}`;
    
                newRecipient.goToPaymentsDashborad();
                newRecipient.gotoRecipientList();
                newRecipient.addRecipient('UNITED KINGDOM{enter}', 'GBP{enter}');
                newRecipient.addBankDetails('HU42117730161111101800000000', 'AKKHHUHB');
                newRecipient.addBusinessRecipientforMassTesting('United Kingdom{enter}', randomBusinessName);
                newRecipient.saveRecipient();
                newRecipient.checkSettelment('be.disabled', 'be.enabled');
    
                cy.log(`Iteration completed with Business Name: ${randomBusinessName}`);
            });
        });

    // Code for business recipient with currency GBP
        it.only('TC-Mass recipient for adding business - ', function(){
            signin.Login(userName, password);
    
            Cypress._.times(50, () => {  
                cy.log('Iteration started');
    
                const randomBusinessName = `Business ${faker.company.name()}`;
    
                newRecipient.goToPaymentsDashborad();
                newRecipient.gotoRecipientList();
                newRecipient.addRecipient('UNITED KINGDOM{enter}', 'GBP{enter}');
                newRecipient.addBankDetails('HU42117730161111101800000000', 'AKKHHUHB');
                newRecipient.addBusinessRecipientforMassTesting('United Kingdom{enter}', randomBusinessName);
                newRecipient.saveRecipient();
                newRecipient.checkSettelment('be.disabled', 'be.enabled');
    
                cy.log(`Iteration completed with Business Name: ${randomBusinessName}`);
            });
        });   
    


})