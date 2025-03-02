/// <reference types= "cypress" />

import { SigninPage } from "../PageObject/PageAction/SigninPage";
import { AdditionalCurrencies } from "../PageObject/PageAction/AdditionalCurrencies";
import { faker } from '@faker-js/faker';

const signin = new SigninPage
const newRecipient = new AdditionalCurrencies

describe('Mass Recipients ',function(){

    let userName = 'eea_test_2@volopa.com'
    let password = 'testTest1'
    beforeEach(function(){
        cy.window().then((win) => {
            win.localStorage.clear();
            win.sessionStorage.clear();
        });
        cy.visit('https://webapp6.volopa.com/', { timeout: 10000 })
        cy.viewport(1440,1000)
    })
    it('TC- Mass Payments - Add mass recipients', function(){
        // Step 1: Login once
        signin.Login(userName, password);
    
        // Step 2: Repeat the process after logging in
        Cypress._.times(30, (index) => {  
            cy.log(`Iteration ${index + 1} started`);
    
            const randomName = `QA ${faker.person.firstName()} ${faker.person.lastName()}`;
    
            newRecipient.goToPaymentsDashborad();
            newRecipient.gotoRecipientList();
            newRecipient.addRecipient('United Kingdom{enter}', 'GBP{enter}');
            newRecipient.addBankDetails('GB14BARC20038054413881', 'BUKBGB22');
            newRecipient.individualRecipient(randomName, 'United Kingdom{enter}');
            newRecipient.saveRecipient();
            newRecipient.checkSettelment('be.disabled', 'be.enabled');
    
            cy.log(`Iteration ${index + 1} completed with name: ${randomName}`);
            console.log(`Iteration ${index + 1} completed with name: ${randomName}`);
        });
    });
    
    it('TC-Mass recipient for adding business - ', function(){
        signin.Login(userName, password);
    
        Cypress._.times(30, (index) => {  
            cy.log(`Iteration ${index + 1} started`);
    
            const randomBusinessName = `Business ${faker.company.name()}`;
    
            newRecipient.goToPaymentsDashborad();
            newRecipient.gotoRecipientList();
            newRecipient.addRecipient('UNITED KINGDOM{enter}', 'GBP{enter}');
            newRecipient.addBankDetails('HU42117730161111101800000000', 'AKKHHUHB');
            newRecipient.addBusinessRecipientforMassTesting('United Kingdom{enter}', randomBusinessName);
            newRecipient.saveRecipient();
            newRecipient.checkSettelment('be.disabled', 'be.enabled');
    
            console.log(`Iteration ${index + 1} completed with Business Name: ${randomBusinessName}`);
        });
    });
    
    it('TC- Mass Payments - Add mass recipients', function(){
        // Step 1: Login once
        signin.Login(userName, password);
    
        // Step 2: Repeat the process after logging in
        Cypress._.times(30, (index) => {  
            cy.log(`Iteration ${index + 1} started`);
    
            const randomName = `QA ${faker.person.firstName()} ${faker.person.lastName()}`;
    
            newRecipient.goToPaymentsDashborad();
            newRecipient.gotoRecipientList();
            newRecipient.addRecipient('United Kingdom{enter}', 'GBP{enter}');
            newRecipient.addBankDetails('GB14BARC20038054413881', 'BUKBGB22');
            newRecipient.individualRecipient(randomName, 'United Kingdom{enter}');
            newRecipient.saveRecipient();
            newRecipient.checkSettelment('be.disabled', 'be.enabled');
    
            cy.log(`Iteration ${index + 1} completed with name: ${randomName}`);
            console.log(`Iteration ${index + 1} completed with name: ${randomName}`);
        });
    });
    
    // Code for business recipient with currency GBP
    it('TC-Mass recipient for adding business - ', function(){
    signin.Login(userName, password);

    Cypress._.times(30, (index) => {  
        cy.log(`Iteration ${index + 1} started`);

        const randomBusinessName = `Business ${faker.company.name()}`;

        newRecipient.goToPaymentsDashborad();
        newRecipient.gotoRecipientList();
        newRecipient.addRecipient('UNITED KINGDOM{enter}', 'GBP{enter}');
        newRecipient.addBankDetails('HU42117730161111101800000000', 'AKKHHUHB');
        newRecipient.addBusinessRecipientforMassTesting('United Kingdom{enter}', randomBusinessName);
        newRecipient.saveRecipient();
        newRecipient.checkSettelment('be.disabled', 'be.enabled');

        cy.log(`Iteration ${index + 1} completed with Business Name: ${randomBusinessName}`);
        console.log(`Iteration ${index + 1} completed with Business Name: ${randomBusinessName}`);
    });
    });

    it('TC- Mass Payments - Add mass recipients', function(){
    // Step 1: Login once
    signin.Login(userName, password);

    // Step 2: Repeat the process after logging in
    Cypress._.times(30, (index) => {  
        cy.log(`Iteration ${index + 1} started`);

        const randomName = `QA ${faker.person.firstName()} ${faker.person.lastName()}`;

        newRecipient.goToPaymentsDashborad();
        newRecipient.gotoRecipientList();
        newRecipient.addRecipient('United Kingdom{enter}', 'GBP{enter}');
        newRecipient.addBankDetails('GB14BARC20038054413881', 'BUKBGB22');
        newRecipient.individualRecipient(randomName, 'United Kingdom{enter}');
        newRecipient.saveRecipient();
        newRecipient.checkSettelment('be.disabled', 'be.enabled');

        cy.log(`Iteration ${index + 1} completed with name: ${randomName}`);
        console.log(`Iteration ${index + 1} completed with name: ${randomName}`);
    });
    });

    it('TC-Mass recipient for adding business - ', function(){
    signin.Login(userName, password);

        Cypress._.times(30, (index) => {  
        cy.log(`Iteration ${index + 1} started`);

        const randomBusinessName = `Business ${faker.company.name()}`;

        newRecipient.goToPaymentsDashborad();
        newRecipient.gotoRecipientList();
        newRecipient.addRecipient('UNITED KINGDOM{enter}', 'GBP{enter}');
        newRecipient.addBankDetails('HU42117730161111101800000000', 'AKKHHUHB');
        newRecipient.addBusinessRecipientforMassTesting('United Kingdom{enter}', randomBusinessName);
        newRecipient.saveRecipient();
        newRecipient.checkSettelment('be.disabled', 'be.enabled');

        console.log(`Iteration ${index + 1} completed with Business Name: ${randomBusinessName}`);
    });
    });

    ///for adding recipient with regular payment method
    it('TC- Mass Payments add Ind recipient with regular/priority payment method', function(){
        // Step 1: Login once
        signin.Login(userName, password);
    
        // Step 2: Repeat the process after logging in
        Cypress._.times(30, (index) => {  
            cy.log(`Iteration ${index + 1} started`);
    
            const randomName = `QA ${faker.person.firstName()} ${faker.person.lastName()}`;
    
            newRecipient.goToPaymentsDashborad();
            newRecipient.gotoRecipientList();
            newRecipient.addRecipient('United Kingdom{enter}', 'GBP{enter}');
            newRecipient.addAccountandSortcode('54545455','202524')
            newRecipient.individualRecipient(randomName, 'United Kingdom{enter}');
            newRecipient.saveRecipient();
            newRecipient.checkSettelment('be.enabled', 'be.enabled');
    
            cy.log(`Iteration ${index + 1} completed with name: ${randomName}`);
            console.log(`Iteration ${index + 1} completed with name: ${randomName}`);
        });
        });
    it('TC-Mass Payments add Business recipient with regular/priority payment method ', function(){
            signin.Login(userName, password);
        
                Cypress._.times(30, (index) => {  
                cy.log(`Iteration ${index + 1} started`);
        
                const randomBusinessName = `Business ${faker.company.name()}`;
        
                newRecipient.goToPaymentsDashborad();
                newRecipient.gotoRecipientList();
                newRecipient.addRecipient('UNITED KINGDOM{enter}', 'GBP{enter}');
                newRecipient.addAccountandSortcode('54545455','202524')
                newRecipient.addBusinessRecipientforMassTesting('United Kingdom{enter}', randomBusinessName);
                newRecipient.saveRecipient();
                newRecipient.checkSettelment('be.enabled', 'be.enabled');
        
                console.log(`Iteration ${index + 1} completed with Business Name: ${randomBusinessName}`);
            });
        });
    it('TC- Mass Payments add Ind recipient with regular/priority payment method', function(){
            // Step 1: Login once
            signin.Login(userName, password);
        
            // Step 2: Repeat the process after logging in
            Cypress._.times(30, (index) => {  
                cy.log(`Iteration ${index + 1} started`);
        
                const randomName = `QA ${faker.person.firstName()} ${faker.person.lastName()}`;
        
                newRecipient.goToPaymentsDashborad();
                newRecipient.gotoRecipientList();
                newRecipient.addRecipient('United Kingdom{enter}', 'GBP{enter}');
                newRecipient.addAccountandSortcode('54545455','202524')
                newRecipient.individualRecipient(randomName, 'United Kingdom{enter}');
                newRecipient.saveRecipient();
                newRecipient.checkSettelment('be.enabled', 'be.enabled');
        
                cy.log(`Iteration ${index + 1} completed with name: ${randomName}`);
                console.log(`Iteration ${index + 1} completed with name: ${randomName}`);
            });
        });
    it('TC-Mass Payments add Business recipient with regular/priority payment method ', function(){
                signin.Login(userName, password);
            
                    Cypress._.times(30, (index) => {  
                    cy.log(`Iteration ${index + 1} started`);
            
                    const randomBusinessName = `Business ${faker.company.name()}`;
            
                    newRecipient.goToPaymentsDashborad();
                    newRecipient.gotoRecipientList();
                    newRecipient.addRecipient('UNITED KINGDOM{enter}', 'GBP{enter}');
                    newRecipient.addAccountandSortcode('54545455','202524')
                    newRecipient.addBusinessRecipientforMassTesting('United Kingdom{enter}', randomBusinessName);
                    newRecipient.saveRecipient();
                    newRecipient.checkSettelment('be.enabled', 'be.enabled');
            
                    console.log(`Iteration ${index + 1} completed with Business Name: ${randomBusinessName}`);
                });
        });
    it('TC- Mass Payments add Ind recipient with regular/priority payment method', function(){
            // Step 1: Login once
            signin.Login(userName, password);
        
            // Step 2: Repeat the process after logging in
            Cypress._.times(30, (index) => {  
                cy.log(`Iteration ${index + 1} started`);
        
                const randomName = `QA ${faker.person.firstName()} ${faker.person.lastName()}`;
        
                newRecipient.goToPaymentsDashborad();
                newRecipient.gotoRecipientList();
                newRecipient.addRecipient('United Kingdom{enter}', 'GBP{enter}');
                newRecipient.addAccountandSortcode('54545455','202524')
                newRecipient.individualRecipient(randomName, 'United Kingdom{enter}');
                newRecipient.saveRecipient();
                newRecipient.checkSettelment('be.enabled', 'be.enabled');
        
                cy.log(`Iteration ${index + 1} completed with name: ${randomName}`);
                console.log(`Iteration ${index + 1} completed with name: ${randomName}`);
            });
        });
    it('TC-Mass Payments add Business recipient with regular/priority payment method ', function(){
                signin.Login(userName, password);
            
                    Cypress._.times(30, (index) => {  
                    cy.log(`Iteration ${index + 1} started`);
            
                    const randomBusinessName = `Business ${faker.company.name()}`;
            
                    newRecipient.goToPaymentsDashborad();
                    newRecipient.gotoRecipientList();
                    newRecipient.addRecipient('UNITED KINGDOM{enter}', 'GBP{enter}');
                    newRecipient.addAccountandSortcode('54545455','202524')
                    newRecipient.addBusinessRecipientforMassTesting('United Kingdom{enter}', randomBusinessName);
                    newRecipient.saveRecipient();
                    newRecipient.checkSettelment('be.enabled', 'be.enabled');
            
                    console.log(`Iteration ${index + 1} completed with Business Name: ${randomBusinessName}`);
                });
        });    

})