/// <reference types = "cypress"/>


import { SigninPage } from "../PageObject/PageAction/SigninPage"
import { NewPayment } from "../PageObject/PageAction/NewPayment"
import { PaymentsDashboard } from "../PageObject/PageAction/PaymentsDashboard"
import { AdditionalCurrencies } from "../PageObject/PageAction/AdditionalCurrencies"
import { BatchPayments } from "../PageObject/PageAction/BatchPayments"

const newRecipient = new AdditionalCurrencies
const batchPayments = new BatchPayments
const signin = new SigninPage
const paymentspage = new PaymentsDashboard
const newPayment = new NewPayment

const API_BASE_URL = "https://main-api.volopa-dev.com/VolopaApiOauth2";
// main API new server
//https://devapi.volopa.com/VolopaApiOauth2
// https://main-api.volopa-dev.com/OAuth2

describe('Single Payment Corpay',function(){
    let userName = 'Corpay_test1@volopa.com'
    let password = 'testTest1'
    beforeEach(() => {
       const baseUrl = 'https://webapp01.mybusiness.volopa-dev.com/';
       cy.visit(baseUrl);
        //paymentspage.clearCache()
        cy.viewport(1440,1000)
    })

    it('TC-AC-001 - Verify that if Currency = SGD and Country = UNITED KINGDOM & client = UK and check priority settlement is enabled and make a payment with GBP using Push Funds', function () {
  // ─────────────── Setup & Recipient Creation ───────────────
  signin.Login(userName, password); // your existing login method

  newRecipient.goToPaymentsDashborad();
  newRecipient.gotoRecipientList();

  const email = batchPayments.generateRandomString(5) + '@yopmail.com';
  newRecipient.addRecipient('UNITED KINGDOM{enter}', 'SGD{enter}', email);
  newRecipient.addBankDetails('GB73BARC20039538243547', 'AFFLGB22');
  newRecipient.individualRecipient('UK SGD', 'UNITED KINGDOM{enter}');
  newRecipient.saveRecipient();
  newRecipient.checkSettelment('be.disabled', 'be.enabled');

  // ─────────────── Payment Flow ───────────────
  newPayment.proceedflow('{downarrow}{enter}', 'GBP');
  const amount = '10';
  newPayment.addrecipientDetail(amount, email);
  newPayment.selectFundingMethod('Push Funds');
  const apiEnv = this.apiEnv;
  // ───── Intercept Quote API ─────
  cy.intercept(
  'POST',
  '**/VolopaApiOauth2WebApp*/exchange/b2b/self/quote/temp'
).as('quoteApi');

  // ───── Wait for API and Compare Values ─────
  cy.wait('@quoteApi').then(({ response }) => {
    const receive = response.body.data.receive;
    const recipientReceives = response.body.data.recipient[0].receives;

    cy.wrap(recipientReceives).as('recipientReceives');
    cy.log(`Receive: ${receive}`);
    cy.log(`Recipient Receives: ${recipientReceives}`);

    expect(receive).to.eq(recipientReceives); // Final comparison
  });

  // ── Validate payment‑reason field ─────────────────────────
  cy.get('.ant-select-selector')
    .eq(2)
    .should(($el) => {
      expect($el.text().trim(), 'reason field should start empty').to.equal('');
    })
    .click(); // Open dropdown

  // Pick a random reason option
  cy.get('.ant-select-dropdown')
    .last()
    .find('.ant-select-item-option')
    .its('length')
    .then((total) => {
      const idx = Math.min(7, Cypress._.random(0, total - 1));
      cy.get('.ant-select-dropdown')
        .last()
        .find('.ant-select-item-option')
        .eq(idx)
        .click();
    });

  // ── Validate recipient‑received amount ─────────────────────
  cy.get(':nth-child(3) > :nth-child(2) > .ant-typography')
    .invoke('text')
    .then((uiText) => {
      const trimmedUiText = uiText.trim();
      cy.wrap(trimmedUiText).as('uiReceives');
    });

  // Compare UI vs API value
  cy.get('@recipientReceives').then((recipientReceives) => {
    cy.get('@uiReceives').then((uiReceives) => {
      cy.log(`UI: ${uiReceives}, API: ${recipientReceives}`);
      expect(uiReceives).to.eq(recipientReceives);
    });
  });

  // ─────────────── Confirmation Screens ───────────────
  cy.get('.ant-col > .ant-btn > span').should('be.visible').click();

  cy.get('.ant-modal-body > :nth-child(1) > .ant-col > .ant-typography')
    .should('be.visible')
    .and('contain.text', 'Payment Confirmation');

  cy.get('@recipientReceives').then((recipientReceives) => {
    cy.get(':nth-child(4) > .ant-col-8 > .ant-typography')
      .should('be.visible')
      .and('contain.text', recipientReceives);
  });

  // Pay recipient
  cy.get(
    '.ant-row-center.m-t-20 > .ant-col > .ant-space > :nth-child(2) > .ant-btn'
  )
    .should('be.visible')
    .click();

  cy.get('.ant-modal-body > :nth-child(1) > .ant-col')
    .should('be.visible')
    .and('contain.text', ' Payment Booked - ');

  cy.get('@recipientReceives').then((recipientReceives) => {
    cy.get(':nth-child(5) > .ant-col-8 > .ant-typography')
      .should('be.visible')
      .and('contain.text', recipientReceives);
  });
    });

    it('TC-AC-002 - Verify that if Currency= SGD and Country = Singapore & client = UK and check priority and regular both settlement are enabled and make a payment with GBP using Push Funds',function () {
    // ─────────────── Setup & Recipient Creation ───────────────
        signin.Login(userName, password)
        newRecipient.goToPaymentsDashborad()
        newRecipient.gotoRecipientList()
        let email = batchPayments.generateRandomString(5)+ '@yopmail.com'
        newRecipient.addRecipient('SINGAPORE{enter}' ,'SGD{enter}',email)
        newRecipient.addBankDetailsWithAccNo('ACLPSGSG','049712')
        newRecipient.singaporeCorpayDeatails('1111','123')
        newRecipient.individualRecipient('SN SGD','SINGAPORE{enter}')
        newRecipient.saveRecipient()
        newRecipient.checkSettelmentEnabledBoth('be.enabled','be.enabled')

    // ─────────────── Payment Flow ───────────────
    newPayment.proceedflow('{downarrow}{enter}', 'GBP');
    const amount = '10';
    newPayment.addrecipientDetail(amount, email);
    newPayment.selectFundingMethod('Push Funds');
      const apiEnv = this.apiEnv;

    cy.intercept(
  'POST',
  '**/VolopaApiOauth2WebApp*/exchange/b2b/self/quote/temp'
).as('quoteApi');

  // ───── Wait for API and Compare Values ─────
  cy.wait('@quoteApi').then(({ response }) => {
    const receive = response.body.data.receive;
    const recipientReceives = response.body.data.recipient[0].receives;

    cy.wrap(recipientReceives).as('recipientReceives');
    cy.log(`Receive: ${receive}`);
    cy.log(`Recipient Receives: ${recipientReceives}`);

    expect(receive).to.eq(recipientReceives); // Final comparison
  });

    /* ── Validate payment‑reason field ───────────────────────── */
    // 1️⃣ Ensure the field starts empty
    cy.get('.ant-select-selector')
      .eq(2)
      .should(($el) => {
        expect(
          $el.text().trim(),
          'reason field should start empty'
        ).to.equal('');
      })
      .click(); // open dropdown

    // 2️⃣ Pick a random option between 1 and 10
    cy.get('.ant-select-dropdown')
      .last()
      .find('.ant-select-item-option')
      .its('length')
      .then((total) => {
        const idx = Math.min(7, Cypress._.random(0, total - 1));
        cy.get('.ant-select-dropdown')
          .last()
          .find('.ant-select-item-option')
          .eq(idx)
          .click();
      });

    /* ── Validate recipient‑received amount ───────────────────── */
    cy.get(':nth-child(3) > :nth-child(2) > .ant-typography')
    .invoke('text')
    .then((uiText) => {
      const trimmedUiText = uiText.trim();
      cy.wrap(trimmedUiText).as('uiReceives');
    });

  // Compare UI vs API value
  cy.get('@recipientReceives').then((recipientReceives) => {
    cy.get('@uiReceives').then((uiReceives) => {
      cy.log(`UI: ${uiReceives}, API: ${recipientReceives}`);
      expect(uiReceives).to.eq(recipientReceives);
    });
  });
    // ─────────────── Confirmation Screens ───────────────
    cy.get('.ant-col > .ant-btn > span').should('be.visible').click();

  cy.get('.ant-modal-body > :nth-child(1) > .ant-col > .ant-typography')
    .should('be.visible')
    .and('contain.text', 'Payment Confirmation');

  cy.get('@recipientReceives').then((recipientReceives) => {
    cy.get(':nth-child(4) > .ant-col-8 > .ant-typography')
      .should('be.visible')
      .and('contain.text', recipientReceives);
  });

  // Pay recipient
  cy.get(
    '.ant-row-center.m-t-20 > .ant-col > .ant-space > :nth-child(2) > .ant-btn'
  )
    .should('be.visible')
    .click();

  cy.get('.ant-modal-body > :nth-child(1) > .ant-col')
    .should('be.visible')
    .and('contain.text', ' Payment Booked - ');

  cy.get('@recipientReceives').then((recipientReceives) => {
    cy.get(':nth-child(5) > .ant-col-8 > .ant-typography')
      .should('be.visible')
      .and('contain.text', recipientReceives);
  });
    })
    xit('TC-AC-003 - Verify that if Currency= MXN and Country = UNITED KINGDOM & client = UK and check priority settlement is enabled and make a payment with GBP using Push Funds',function () {
    // ─────────────── Setup & Recipient Creation ───────────────
        signin.Login(userName, password)
        newRecipient.goToPaymentsDashborad()
        newRecipient.gotoRecipientList()
        let email = batchPayments.generateRandomString(5)+ '@yopmail.com'
        newRecipient.addRecipient('UNITED KINGDOM{enter}' ,'MXN{enter}',email)
        newRecipient.addBankDetails('GB73BARC20039538243547','AFFLGB22')
        newRecipient.individualRecipient('UK MXN','UNITED KINGDOM{enter}')
        newRecipient.saveRecipient()
        newRecipient.checkSettelment('be.disabled','be.enabled')

    // ─────────────── Payment Flow ───────────────
    newPayment.proceedflow('{downarrow}{enter}', 'GBP');
    const amount = '10';
    newPayment.addrecipientDetail(amount, email);
    newPayment.selectFundingMethod('Push Funds');

    const apiEnv = this.apiEnv;
  // ───── Intercept Quote API ─────
  cy.intercept(
  'POST',
  '**/VolopaApiOauth2WebApp*/exchange/b2b/self/quote/temp'
).as('quoteApi');

  // ───── Wait for API and Compare Values ─────
  cy.wait('@quoteApi').then(({ response }) => {
    const receive = response.body.data.receive;
    const recipientReceives = response.body.data.recipient[0].receives;

    cy.wrap(recipientReceives).as('recipientReceives');
    cy.log(`Receive: ${receive}`);
    cy.log(`Recipient Receives: ${recipientReceives}`);

    expect(receive).to.eq(recipientReceives); // Final comparison
  });

    /* ── Validate payment‑reason field ───────────────────────── */
    // 1️⃣ Ensure the field starts empty
    cy.get('.ant-select-selector')
      .eq(2)
      .should(($el) => {
        expect(
          $el.text().trim(),
          'reason field should start empty'
        ).to.equal('');
      })
      .click(); // open dropdown

    // 2️⃣ Pick a random option between 1 and 10
    cy.get('.ant-select-dropdown')
      .last()
      .find('.ant-select-item-option')
      .its('length')
      .then((total) => {
        const idx = Math.min(7, Cypress._.random(0, total - 1));
        cy.get('.ant-select-dropdown')
          .last()
          .find('.ant-select-item-option')
          .eq(idx)
          .click();
      });

    /* ── Validate recipient‑received amount ───────────────────── */
    cy.get(':nth-child(3) > :nth-child(2) > .ant-typography')
    .invoke('text')
    .then((uiText) => {
      const trimmedUiText = uiText.trim();
      cy.wrap(trimmedUiText).as('uiReceives');
    });

  // Compare UI vs API value
  cy.get('@recipientReceives').then((recipientReceives) => {
    cy.get('@uiReceives').then((uiReceives) => {
      cy.log(`UI: ${uiReceives}, API: ${recipientReceives}`);
      expect(uiReceives).to.eq(recipientReceives);
    });
  });
    // ─────────────── Confirmation Screens ───────────────
    cy.get('.ant-col > .ant-btn > span').should('be.visible').click();

  cy.get('.ant-modal-body > :nth-child(1) > .ant-col > .ant-typography')
    .should('be.visible')
    .and('contain.text', 'Payment Confirmation');

  cy.get('@recipientReceives').then((recipientReceives) => {
    cy.get(':nth-child(4) > .ant-col-8 > .ant-typography')
      .should('be.visible')
      .and('contain.text', recipientReceives);
  });

  // Pay recipient
  cy.get(
    '.ant-row-center.m-t-20 > .ant-col > .ant-space > :nth-child(2) > .ant-btn'
  )
    .should('be.visible')
    .click();

  cy.get('.ant-modal-body > :nth-child(1) > .ant-col')
    .should('be.visible')
    .and('contain.text', ' Payment Booked - ');

  cy.get('@recipientReceives').then((recipientReceives) => {
    cy.get(':nth-child(5) > .ant-col-8 > .ant-typography')
      .should('be.visible')
      .and('contain.text', recipientReceives);
  });
    })
    xit('TC-AC-004 - Verify that if Currency= MXN and Country = Mexico Checking & client = UK and check priority settlement is enabled and make a payment with GBP using Push Funds',function () {
    // ─────────────── Setup & Recipient Creation ───────────────
        signin.Login(userName, password)
        newRecipient.goToPaymentsDashborad()
        newRecipient.gotoRecipientList()
        let email = batchPayments.generateRandomString(5)+ '@yopmail.com'
        newRecipient.addRecipient('MEXICO{enter}' ,'MXN{enter}',email)
        newRecipient.addBankDetailsWithClabe('AFIRMXMT','002010077777777771')
        newRecipient.mexicoCorpay('Checking{enter}')
        newRecipient.individualRecipientMexico('QA Checking MXN','MEXICO{enter}')
        newRecipient.postCodeState()
        newRecipient.saveRecipient()
        newRecipient.checkSettelment('be.disabled','be.enabled')

    // ─────────────── Payment Flow ───────────────
    newPayment.proceedflow('{downarrow}{enter}', 'GBP');
    const amount = '10';
    newPayment.addrecipientDetail(amount, email);
    newPayment.selectFundingMethod('Push Funds');
      const apiEnv = this.apiEnv;
    // ───── Intercept Quote API ─────
  cy.intercept(
  'POST',
  '**/VolopaApiOauth2WebApp*/exchange/b2b/self/quote/temp'
).as('quoteApi');

  // ───── Wait for API and Compare Values ─────
  cy.wait('@quoteApi').then(({ response }) => {
    const receive = response.body.data.receive;
    const recipientReceives = response.body.data.recipient[0].receives;

    cy.wrap(recipientReceives).as('recipientReceives');
    cy.log(`Receive: ${receive}`);
    cy.log(`Recipient Receives: ${recipientReceives}`);

    expect(receive).to.eq(recipientReceives); // Final comparison
  });

    /* ── Validate payment‑reason field ───────────────────────── */
    // 1️⃣ Ensure the field starts empty
    cy.get('.ant-select-selector')
      .eq(2)
      .should(($el) => {
        expect(
          $el.text().trim(),
          'reason field should start empty'
        ).to.equal('');
      })
      .click(); // open dropdown

    // 2️⃣ Pick a random option between 1 and 10
    cy.get('.ant-select-dropdown')
      .last()
      .find('.ant-select-item-option')
      .its('length')
      .then((total) => {
        const idx = Math.min(7, Cypress._.random(0, total - 1));
        cy.get('.ant-select-dropdown')
          .last()
          .find('.ant-select-item-option')
          .eq(idx)
          .click();
      });

    /* ── Validate recipient‑received amount ───────────────────── */
    cy.get(':nth-child(3) > :nth-child(2) > .ant-typography')
    .invoke('text')
    .then((uiText) => {
      const trimmedUiText = uiText.trim();
      cy.wrap(trimmedUiText).as('uiReceives');
    });

  // Compare UI vs API value
  cy.get('@recipientReceives').then((recipientReceives) => {
    cy.get('@uiReceives').then((uiReceives) => {
      cy.log(`UI: ${uiReceives}, API: ${recipientReceives}`);
      expect(uiReceives).to.eq(recipientReceives);
    });
  });

    // ─────────────── Confirmation Screens ───────────────
    cy.get('.ant-col > .ant-btn > span').should('be.visible').click();

  cy.get('.ant-modal-body > :nth-child(1) > .ant-col > .ant-typography')
    .should('be.visible')
    .and('contain.text', 'Payment Confirmation');

  cy.get('@recipientReceives').then((recipientReceives) => {
    cy.get(':nth-child(4) > .ant-col-8 > .ant-typography')
      .should('be.visible')
      .and('contain.text', recipientReceives);
  });

  // Pay recipient
  cy.get(
    '.ant-row-center.m-t-20 > .ant-col > .ant-space > :nth-child(2) > .ant-btn'
  )
    .should('be.visible')
    .click();

  cy.get('.ant-modal-body > :nth-child(1) > .ant-col')
    .should('be.visible')
    .and('contain.text', ' Payment Booked - ');

  cy.get('@recipientReceives').then((recipientReceives) => {
    cy.get(':nth-child(5) > .ant-col-8 > .ant-typography')
      .should('be.visible')
      .and('contain.text', recipientReceives);
  });
    })
    xit('TC-AC-005 - Verify that if Currency= MXN and Country = Mexico Saving & client = UK and check priority settlement is enabled and make a payment with GBP using Push Funds',function () {
    // ─────────────── Setup & Recipient Creation ───────────────
        signin.Login(userName, password)
        newRecipient.goToPaymentsDashborad()
        newRecipient.gotoRecipientList()
        let email = batchPayments.generateRandomString(5)+ '@yopmail.com'
        newRecipient.addRecipient('MEXICO{enter}' ,'MXN{enter}',email)
        newRecipient.addBankDetailsWithClabe('AFIRMXMT','002010077777777771')
        newRecipient.mexicoCorpay('Saving{enter}')
        newRecipient.individualRecipientMexico('QA Saving MXN','MEXICO{enter}')
        newRecipient.postCodeState()
        newRecipient.saveRecipient()
        newRecipient.checkSettelment('be.disabled','be.enabled')

    // ─────────────── Payment Flow ───────────────
    newPayment.proceedflow('{downarrow}{enter}', 'GBP');
    const amount = '10';
    newPayment.addrecipientDetail(amount, email);
    newPayment.selectFundingMethod('Push Funds');
      const apiEnv = this.apiEnv;

    // ───── Intercept Quote API ─────
  cy.intercept(
  'POST',
  '**/VolopaApiOauth2WebApp*/exchange/b2b/self/quote/temp'
).as('quoteApi');

  // ───── Wait for API and Compare Values ─────
  cy.wait('@quoteApi').then(({ response }) => {
    const receive = response.body.data.receive;
    const recipientReceives = response.body.data.recipient[0].receives;

    cy.wrap(recipientReceives).as('recipientReceives');
    cy.log(`Receive: ${receive}`);
    cy.log(`Recipient Receives: ${recipientReceives}`);

    expect(receive).to.eq(recipientReceives); // Final comparison
  });

    /* ── Validate payment‑reason field ───────────────────────── */
    // 1️⃣ Ensure the field starts empty
    cy.get('.ant-select-selector')
      .eq(2)
      .should(($el) => {
        expect(
          $el.text().trim(),
          'reason field should start empty'
        ).to.equal('');
      })
      .click(); // open dropdown

    // 2️⃣ Pick a random option between 1 and 10
    cy.get('.ant-select-dropdown')
      .last()
      .find('.ant-select-item-option')
      .its('length')
      .then((total) => {
        const idx = Math.min(9, Cypress._.random(0, total - 1));
        cy.get('.ant-select-dropdown')
          .last()
          .find('.ant-select-item-option')
          .eq(idx)
          .click();
      });

    /* ── Validate recipient‑received amount ───────────────────── */
    cy.get(':nth-child(3) > :nth-child(2) > .ant-typography')
    .invoke('text')
    .then((uiText) => {
      const trimmedUiText = uiText.trim();
      cy.wrap(trimmedUiText).as('uiReceives');
    });

  // Compare UI vs API value
  cy.get('@recipientReceives').then((recipientReceives) => {
    cy.get('@uiReceives').then((uiReceives) => {
      cy.log(`UI: ${uiReceives}, API: ${recipientReceives}`);
      expect(uiReceives).to.eq(recipientReceives);
    });
  });

    // ─────────────── Confirmation Screens ───────────────
    cy.get('.ant-col > .ant-btn > span').should('be.visible').click();

  cy.get('.ant-modal-body > :nth-child(1) > .ant-col > .ant-typography')
    .should('be.visible')
    .and('contain.text', 'Payment Confirmation');

  cy.get('@recipientReceives').then((recipientReceives) => {
    cy.get(':nth-child(4) > .ant-col-8 > .ant-typography')
      .should('be.visible')
      .and('contain.text', recipientReceives);
  });

  // Pay recipient
  cy.get(
    '.ant-row-center.m-t-20 > .ant-col > .ant-space > :nth-child(2) > .ant-btn'
  )
    .should('be.visible')
    .click();

  cy.get('.ant-modal-body > :nth-child(1) > .ant-col')
    .should('be.visible')
    .and('contain.text', ' Payment Booked - ');

  cy.get('@recipientReceives').then((recipientReceives) => {
    cy.get(':nth-child(5) > .ant-col-8 > .ant-typography')
      .should('be.visible')
      .and('contain.text', recipientReceives);
  });
    })
    it('TC-AC-006 - Verify that if Currency= TRY and Country = UNITED KINGDOM & client = UK and check priority settlement is enabled and make a payment with GBP using Push Funds',function () {
    // ─────────────── Setup & Recipient Creation ───────────────
        signin.Login(userName, password)
        newRecipient.goToPaymentsDashborad()
        newRecipient.gotoRecipientList()
        let email = batchPayments.generateRandomString(5)+ '@yopmail.com'
        newRecipient.addRecipient('UNITED KINGDOM{enter}' ,'TRY{enter}',email)
        newRecipient.addBankDetails('GB73BARC20039538243547','AFFLGB22')
        newRecipient.individualRecipient('UK TRY','UNITED KINGDOM{enter}')
        newRecipient.saveRecipient()
        newRecipient.checkSettelment('be.disabled','be.enabled')

    // ─────────────── Payment Flow ───────────────
    newPayment.proceedflow('{downarrow}{enter}', 'GBP');
    const amount = '10';
    newPayment.addrecipientDetail(amount, email);
    newPayment.selectFundingMethod('Push Funds');
      const apiEnv = this.apiEnv;
    // ───── Intercept Quote API ─────
  cy.intercept(
  'POST',
  '**/VolopaApiOauth2WebApp*/exchange/b2b/self/quote/temp'
).as('quoteApi');

  // ───── Wait for API and Compare Values ─────
  cy.wait('@quoteApi').then(({ response }) => {
    const receive = response.body.data.receive;
    const recipientReceives = response.body.data.recipient[0].receives;

    cy.wrap(recipientReceives).as('recipientReceives');
    cy.log(`Receive: ${receive}`);
    cy.log(`Recipient Receives: ${recipientReceives}`);

    expect(receive).to.eq(recipientReceives); // Final comparison
  });

    /* ── Validate payment‑reason field ───────────────────────── */
    // 1️⃣ Ensure the field starts empty
    cy.get('.ant-select-selector')
      .eq(2)
      .should(($el) => {
        expect(
          $el.text().trim(),
          'reason field should start empty'
        ).to.equal('');
      })
      .click(); // open dropdown

    // 2️⃣ Pick a random option between 1 and 10
    cy.get('.ant-select-dropdown')
      .last()
      .find('.ant-select-item-option')
      .its('length')
      .then((total) => {
        const idx = Math.min(7, Cypress._.random(0, total - 1));
        cy.get('.ant-select-dropdown')
          .last()
          .find('.ant-select-item-option')
          .eq(idx)
          .click();
      });

    /* ── Validate recipient‑received amount ───────────────────── */
    cy.get(':nth-child(3) > :nth-child(2) > .ant-typography')
    .invoke('text')
    .then((uiText) => {
      const trimmedUiText = uiText.trim();
      cy.wrap(trimmedUiText).as('uiReceives');
    });

  // Compare UI vs API value
  cy.get('@recipientReceives').then((recipientReceives) => {
    cy.get('@uiReceives').then((uiReceives) => {
      cy.log(`UI: ${uiReceives}, API: ${recipientReceives}`);
      expect(uiReceives).to.eq(recipientReceives);
    });
  });

    // ─────────────── Confirmation Screens ───────────────
    cy.get('.ant-col > .ant-btn > span').should('be.visible').click();

  cy.get('.ant-modal-body > :nth-child(1) > .ant-col > .ant-typography')
    .should('be.visible')
    .and('contain.text', 'Payment Confirmation');

  cy.get('@recipientReceives').then((recipientReceives) => {
    cy.get(':nth-child(4) > .ant-col-8 > .ant-typography')
      .should('be.visible')
      .and('contain.text', recipientReceives);
  });

  // Pay recipient
  cy.get(
    '.ant-row-center.m-t-20 > .ant-col > .ant-space > :nth-child(2) > .ant-btn'
  )
    .should('be.visible')
    .click();

  cy.get('.ant-modal-body > :nth-child(1) > .ant-col')
    .should('be.visible')
    .and('contain.text', ' Payment Booked - ');

  cy.get('@recipientReceives').then((recipientReceives) => {
    cy.get(':nth-child(5) > .ant-col-8 > .ant-typography')
      .should('be.visible')
      .and('contain.text', recipientReceives);
  });
    })
    it('TC-AC-007 - Verify that if Currency= TRY and Country = Turkey & client = UK and check priority settlement is enabled and make a payment with GBP using Push Funds',function () {
    // ─────────────── Setup & Recipient Creation ───────────────
        signin.Login(userName, password)
        newRecipient.goToPaymentsDashborad()
        newRecipient.gotoRecipientList()
        let email = batchPayments.generateRandomString(5)+ '@yopmail.com'
        newRecipient.addRecipient('TURKEY{enter}' ,'TRY{enter}',email)
        newRecipient.addBankDetails('TR690006245145456117494371','CAYTTRIS002')
        newRecipient.individualRecipient('Turkey TRY','TURKEY{enter}')
        newRecipient.saveRecipient()
        //newRecipient.checkAmountLimit('5000001','Maximum limit for TRY is 5,000,000.00')
        newRecipient.checkSettelment('be.disabled','be.enabled')

    // ─────────────── Payment Flow ───────────────
    newPayment.proceedflow('{downarrow}{enter}', 'GBP');
    const amount = '10';
    newPayment.addrecipientDetail(amount, email);
    newPayment.selectFundingMethod('Push Funds');
      const apiEnv = this.apiEnv;

    // ───── Intercept Quote API ─────
  cy.intercept(
  'POST',
  '**/VolopaApiOauth2WebApp*/exchange/b2b/self/quote/temp'
).as('quoteApi');

  // ───── Wait for API and Compare Values ─────
  cy.wait('@quoteApi').then(({ response }) => {
    const receive = response.body.data.receive;
    const recipientReceives = response.body.data.recipient[0].receives;

    cy.wrap(recipientReceives).as('recipientReceives');
    cy.log(`Receive: ${receive}`);
    cy.log(`Recipient Receives: ${recipientReceives}`);

    expect(receive).to.eq(recipientReceives); // Final comparison
  });

    /* ── Validate payment‑reason field ───────────────────────── */
    // 1️⃣ Ensure the field starts empty
    cy.get('.ant-select-selector')
      .eq(2)
      .should(($el) => {
        expect(
          $el.text().trim(),
          'reason field should start empty'
        ).to.equal('');
      })
      .click(); // open dropdown

    // 2️⃣ Pick a random option between 1 and 10
    cy.get('.ant-select-dropdown')
      .last()
      .find('.ant-select-item-option')
      .its('length')
      .then((total) => {
        const idx = Math.min(7, Cypress._.random(0, total - 1));
        cy.get('.ant-select-dropdown')
          .last()
          .find('.ant-select-item-option')
          .eq(idx)
          .click();
      });

    /* ── Validate recipient‑received amount ───────────────────── */
    cy.get(':nth-child(3) > :nth-child(2) > .ant-typography')
    .invoke('text')
    .then((uiText) => {
      const trimmedUiText = uiText.trim();
      cy.wrap(trimmedUiText).as('uiReceives');
    });

  // Compare UI vs API value
  cy.get('@recipientReceives').then((recipientReceives) => {
    cy.get('@uiReceives').then((uiReceives) => {
      cy.log(`UI: ${uiReceives}, API: ${recipientReceives}`);
      expect(uiReceives).to.eq(recipientReceives);
    });
  });
    // ─────────────── Confirmation Screens ───────────────
    cy.get('.ant-col > .ant-btn > span').should('be.visible').click();

  cy.get('.ant-modal-body > :nth-child(1) > .ant-col > .ant-typography')
    .should('be.visible')
    .and('contain.text', 'Payment Confirmation');

  cy.get('@recipientReceives').then((recipientReceives) => {
    cy.get(':nth-child(4) > .ant-col-8 > .ant-typography')
      .should('be.visible')
      .and('contain.text', recipientReceives);
  });

  // Pay recipient
  cy.get(
    '.ant-row-center.m-t-20 > .ant-col > .ant-space > :nth-child(2) > .ant-btn'
  )
    .should('be.visible')
    .click();

  cy.get('.ant-modal-body > :nth-child(1) > .ant-col')
    .should('be.visible')
    .and('contain.text', ' Payment Booked - ');

  cy.get('@recipientReceives').then((recipientReceives) => {
    cy.get(':nth-child(5) > .ant-col-8 > .ant-typography')
      .should('be.visible')
      .and('contain.text', recipientReceives);
  });
    })
    it('TC-AC-008 - Verify that if Currency= KWD and Country = UNITED KINGDOM & client = UK and check priority settlement is enabled and make a payment with GBP using Push Funds',function () {
    // ─────────────── Setup & Recipient Creation ───────────────
        signin.Login(userName, password)
        newRecipient.goToPaymentsDashborad()
        newRecipient.gotoRecipientList()
        let email = batchPayments.generateRandomString(5)+ '@yopmail.com'
        newRecipient.addRecipient('UNITED KINGDOM{enter}' ,'KWD{enter}',email)
        newRecipient.addBankDetails('GB73BARC20039538243547','AFFLGB22')
        newRecipient.individualRecipient('UK KWD','UNITED KINGDOM{enter}')
        newRecipient.saveRecipient()
        newRecipient.checkSettelment('be.disabled','be.enabled')

    // ─────────────── Payment Flow ───────────────
    newPayment.proceedflow('{downarrow}{enter}', 'GBP');
    const amount = '10';
    newPayment.addrecipientDetail(amount, email);
    newPayment.selectFundingMethod('Push Funds');
      const apiEnv = this.apiEnv;

    // ───── Intercept Quote API ─────
  cy.intercept(
  'POST',
  '**/VolopaApiOauth2WebApp*/exchange/b2b/self/quote/temp'
).as('quoteApi');

  // ───── Wait for API and Compare Values ─────
  cy.wait('@quoteApi').then(({ response }) => {
    const receive = response.body.data.receive;
    const recipientReceives = response.body.data.recipient[0].receives;

    cy.wrap(recipientReceives).as('recipientReceives');
    cy.log(`Receive: ${receive}`);
    cy.log(`Recipient Receives: ${recipientReceives}`);

    expect(receive).to.eq(recipientReceives); // Final comparison
  });

    /* ── Validate payment‑reason field ───────────────────────── */
    // 1️⃣ Ensure the field starts empty
    cy.get('.ant-select-selector')
      .eq(2)
      .should(($el) => {
        expect(
          $el.text().trim(),
          'reason field should start empty'
        ).to.equal('');
      })
      .click(); // open dropdown

    // 2️⃣ Pick a random option between 1 and 10
    cy.get('.ant-select-dropdown')
      .last()
      .find('.ant-select-item-option')
      .its('length')
      .then((total) => {
        const idx = Math.min(7, Cypress._.random(0, total - 1));
        cy.get('.ant-select-dropdown')
          .last()
          .find('.ant-select-item-option')
          .eq(idx)
          .click();
      });

    /* ── Validate recipient‑received amount ───────────────────── */
    cy.get(':nth-child(3) > :nth-child(2) > .ant-typography')
    .invoke('text')
    .then((uiText) => {
      const trimmedUiText = uiText.trim();
      cy.wrap(trimmedUiText).as('uiReceives');
    });

  // Compare UI vs API value
  cy.get('@recipientReceives').then((recipientReceives) => {
    cy.get('@uiReceives').then((uiReceives) => {
      cy.log(`UI: ${uiReceives}, API: ${recipientReceives}`);
      expect(uiReceives).to.eq(recipientReceives);
    });
  });

    // ─────────────── Confirmation Screens ───────────────
    cy.get('.ant-col > .ant-btn > span').should('be.visible').click();

  cy.get('.ant-modal-body > :nth-child(1) > .ant-col > .ant-typography')
    .should('be.visible')
    .and('contain.text', 'Payment Confirmation');

  cy.get('@recipientReceives').then((recipientReceives) => {
    cy.get(':nth-child(4) > .ant-col-8 > .ant-typography')
      .should('be.visible')
      .and('contain.text', recipientReceives);
  });

  // Pay recipient
  cy.get(
    '.ant-row-center.m-t-20 > .ant-col > .ant-space > :nth-child(2) > .ant-btn'
  )
    .should('be.visible')
    .click();

  cy.get('.ant-modal-body > :nth-child(1) > .ant-col')
    .should('be.visible')
    .and('contain.text', ' Payment Booked - ');

  cy.get('@recipientReceives').then((recipientReceives) => {
    cy.get(':nth-child(5) > .ant-col-8 > .ant-typography')
      .should('be.visible')
      .and('contain.text', recipientReceives);
  });
    })
    it('TC-AC-009 - Verify that if Currency= KWD and Country = Kuwait & client = UK and check priority settlement is enabled and make a payment with GBP using Push Funds',function () {
    // ─────────────── Setup & Recipient Creation ───────────────
         signin.Login(userName, password)
        newRecipient.goToPaymentsDashborad()
        newRecipient.gotoRecipientList()
        let email = batchPayments.generateRandomString(5)+ '@yopmail.com'
        newRecipient.addRecipient('KUWAIT{enter}' ,'KWD{enter}',email)
        newRecipient.addBankDetails('KW81CBKU0000000000001234560101','ABKKKWKW')
        newRecipient.individualRecipient('Kuwait KWD','KUWAIT{enter}')
        newRecipient.saveRecipient()
        newRecipient.checkSettelment('be.disabled','be.enabled')

    // ─────────────── Payment Flow ───────────────
    newPayment.proceedflow('{downarrow}{enter}', 'GBP');
    const amount = '10';
    newPayment.addrecipientDetail(amount, email);
    newPayment.selectFundingMethod('Push Funds');
      const apiEnv = this.apiEnv;
    // ───── Intercept Quote API ─────
  cy.intercept(
  'POST',
  '**/VolopaApiOauth2WebApp*/exchange/b2b/self/quote/temp'
).as('quoteApi');

  // ───── Wait for API and Compare Values ─────
  cy.wait('@quoteApi').then(({ response }) => {
    const receive = response.body.data.receive;
    const recipientReceives = response.body.data.recipient[0].receives;

    cy.wrap(recipientReceives).as('recipientReceives');
    cy.log(`Receive: ${receive}`);
    cy.log(`Recipient Receives: ${recipientReceives}`);

    expect(receive).to.eq(recipientReceives); // Final comparison
  });


    /* ── Validate payment‑reason field ───────────────────────── */
    // 1️⃣ Ensure the field starts empty
    cy.get('.ant-select-selector')
      .eq(2)
      .should(($el) => {
        expect(
          $el.text().trim(),
          'reason field should start empty'
        ).to.equal('');
      })
      .click(); // open dropdown

    // 2️⃣ Pick a random option between 1 and 10
    cy.get('.ant-select-dropdown')
      .last()
      .find('.ant-select-item-option')
      .its('length')
      .then((total) => {
        const idx = Math.min(7, Cypress._.random(0, total - 1));
        cy.get('.ant-select-dropdown')
          .last()
          .find('.ant-select-item-option')
          .eq(idx)
          .click();
      });

    /* ── Validate recipient‑received amount ───────────────────── */
    cy.get(':nth-child(3) > :nth-child(2) > .ant-typography')
    .invoke('text')
    .then((uiText) => {
      const trimmedUiText = uiText.trim();
      cy.wrap(trimmedUiText).as('uiReceives');
    });

  // Compare UI vs API value
  cy.get('@recipientReceives').then((recipientReceives) => {
    cy.get('@uiReceives').then((uiReceives) => {
      cy.log(`UI: ${uiReceives}, API: ${recipientReceives}`);
      expect(uiReceives).to.eq(recipientReceives);
    });
  });

    // ─────────────── Confirmation Screens ───────────────
    cy.get('.ant-col > .ant-btn > span').should('be.visible').click();

  cy.get('.ant-modal-body > :nth-child(1) > .ant-col > .ant-typography')
    .should('be.visible')
    .and('contain.text', 'Payment Confirmation');

  cy.get('@recipientReceives').then((recipientReceives) => {
    cy.get(':nth-child(4) > .ant-col-8 > .ant-typography')
      .should('be.visible')
      .and('contain.text', recipientReceives);
  });

  // Pay recipient
  cy.get(
    '.ant-row-center.m-t-20 > .ant-col > .ant-space > :nth-child(2) > .ant-btn'
  )
    .should('be.visible')
    .click();

  cy.get('.ant-modal-body > :nth-child(1) > .ant-col')
    .should('be.visible')
    .and('contain.text', ' Payment Booked - ');

  cy.get('@recipientReceives').then((recipientReceives) => {
    cy.get(':nth-child(5) > .ant-col-8 > .ant-typography')
      .should('be.visible')
      .and('contain.text', recipientReceives);
  });
    })
    it('TC-AC-010 - Verify that if Currency= OMR and Country = UNITED KINGDOM & client = UK and check priority settlement is enabled and make a payment with GBP using Push Funds',function () {
    // ─────────────── Setup & Recipient Creation ───────────────
        signin.Login(userName, password)
        newRecipient.goToPaymentsDashborad()
        newRecipient.gotoRecipientList()
        let email = batchPayments.generateRandomString(5)+ '@yopmail.com'
        newRecipient.addRecipient('UNITED KINGDOM{enter}' ,'OMR{enter}',email)
        newRecipient.addBankDetails('GB73BARC20039538243547','AFFLGB22')
        newRecipient.individualRecipient('UK OMR','UNITED KINGDOM{enter}')
        newRecipient.saveRecipient()
        newRecipient.checkSettelment('be.disabled','be.enabled')

    // ─────────────── Payment Flow ───────────────
    newPayment.proceedflow('{downarrow}{enter}', 'GBP');
    const amount = '10';
    newPayment.addrecipientDetail(amount, email);
    newPayment.selectFundingMethod('Push Funds');
            const apiEnv = this.apiEnv;

    // ───── Intercept Quote API ─────
  cy.intercept(
  'POST',
  '**/VolopaApiOauth2WebApp*/exchange/b2b/self/quote/temp'
).as('quoteApi');

  // ───── Wait for API and Compare Values ─────
  cy.wait('@quoteApi').then(({ response }) => {
    const receive = response.body.data.receive;
    const recipientReceives = response.body.data.recipient[0].receives;

    cy.wrap(recipientReceives).as('recipientReceives');
    cy.log(`Receive: ${receive}`);
    cy.log(`Recipient Receives: ${recipientReceives}`);

    expect(receive).to.eq(recipientReceives); // Final comparison
  });

    /* ── Validate payment‑reason field ───────────────────────── */
    // 1️⃣ Ensure the field starts empty
    cy.get('.ant-select-selector')
      .eq(2)
      .should(($el) => {
        expect(
          $el.text().trim(),
          'reason field should start empty'
        ).to.equal('');
      })
      .click(); // open dropdown

    // 2️⃣ Pick a random option between 1 and 10
    cy.get('.ant-select-dropdown')
      .last()
      .find('.ant-select-item-option')
      .its('length')
      .then((total) => {
        const idx = Math.min(7, Cypress._.random(0, total - 1));
        cy.get('.ant-select-dropdown')
          .last()
          .find('.ant-select-item-option')
          .eq(idx)
          .click();
      });

    /* ── Validate recipient‑received amount ───────────────────── */
    cy.get(':nth-child(3) > :nth-child(2) > .ant-typography')
    .invoke('text')
    .then((uiText) => {
      const trimmedUiText = uiText.trim();
      cy.wrap(trimmedUiText).as('uiReceives');
    });

  // Compare UI vs API value
  cy.get('@recipientReceives').then((recipientReceives) => {
    cy.get('@uiReceives').then((uiReceives) => {
      cy.log(`UI: ${uiReceives}, API: ${recipientReceives}`);
      expect(uiReceives).to.eq(recipientReceives);
    });
  });
    // ─────────────── Confirmation Screens ───────────────
    cy.get('.ant-col > .ant-btn > span').should('be.visible').click();

  cy.get('.ant-modal-body > :nth-child(1) > .ant-col > .ant-typography')
    .should('be.visible')
    .and('contain.text', 'Payment Confirmation');

  cy.get('@recipientReceives').then((recipientReceives) => {
    cy.get(':nth-child(4) > .ant-col-8 > .ant-typography')
      .should('be.visible')
      .and('contain.text', recipientReceives);
  });

  // Pay recipient
  cy.get(
    '.ant-row-center.m-t-20 > .ant-col > .ant-space > :nth-child(2) > .ant-btn'
  )
    .should('be.visible')
    .click();

  cy.get('.ant-modal-body > :nth-child(1) > .ant-col')
    .should('be.visible')
    .and('contain.text', ' Payment Booked - ');

  cy.get('@recipientReceives').then((recipientReceives) => {
    cy.get(':nth-child(5) > .ant-col-8 > .ant-typography')
      .should('be.visible')
      .and('contain.text', recipientReceives);
  });
    })
    it('TC-AC-011 - Verify that if Currency= OMR and Country = OMAN & client = UK and check priority settlement is enabled and make a payment with GBP using Push Funds',function () {
    // ─────────────── Setup & Recipient Creation ───────────────
        signin.Login(userName, password)
        newRecipient.goToPaymentsDashborad()
        newRecipient.gotoRecipientList()
        let email = batchPayments.generateRandomString(5)+ '@yopmail.com'
        newRecipient.addRecipient('OMAN{enter}' ,'OMR{enter}',email)
        newRecipient.addBankDetails('OM040280000012345678901','BDOFOMRUMIB')
        newRecipient.individualRecipient('OMAN OMR','OMAN{enter}')
        newRecipient.saveRecipient()
        newRecipient.checkSettelment('be.disabled','be.enabled')

    // ─────────────── Payment Flow ───────────────
    newPayment.proceedflow('{downarrow}{enter}', 'GBP');
    const amount = '10';
    newPayment.addrecipientDetail(amount, email);
    newPayment.selectFundingMethod('Push Funds');
      const apiEnv = this.apiEnv;
    // ───── Intercept Quote API ─────
  cy.intercept(
  'POST',
  '**/VolopaApiOauth2WebApp*/exchange/b2b/self/quote/temp'
).as('quoteApi');

  // ───── Wait for API and Compare Values ─────
  cy.wait('@quoteApi').then(({ response }) => {
    const receive = response.body.data.receive;
    const recipientReceives = response.body.data.recipient[0].receives;

    cy.wrap(recipientReceives).as('recipientReceives');
    cy.log(`Receive: ${receive}`);
    cy.log(`Recipient Receives: ${recipientReceives}`);

    expect(receive).to.eq(recipientReceives); // Final comparison
  });

    /* ── Validate payment‑reason field ───────────────────────── */
    // 1️⃣ Ensure the field starts empty
    cy.get('.ant-select-selector')
      .eq(2)
      .should(($el) => {
        expect(
          $el.text().trim(),
          'reason field should start empty'
        ).to.equal('');
      })
      .click(); // open dropdown

    // 2️⃣ Pick a random option between 1 and 10
    cy.get('.ant-select-dropdown')
      .last()
      .find('.ant-select-item-option')
      .its('length')
      .then((total) => {
        const idx = Math.min(7, Cypress._.random(0, total - 1));
        cy.get('.ant-select-dropdown')
          .last()
          .find('.ant-select-item-option')
          .eq(idx)
          .click();
      });

    /* ── Validate recipient‑received amount ───────────────────── */
    cy.get(':nth-child(3) > :nth-child(2) > .ant-typography')
    .invoke('text')
    .then((uiText) => {
      const trimmedUiText = uiText.trim();
      cy.wrap(trimmedUiText).as('uiReceives');
    });

  // Compare UI vs API value
  cy.get('@recipientReceives').then((recipientReceives) => {
    cy.get('@uiReceives').then((uiReceives) => {
      cy.log(`UI: ${uiReceives}, API: ${recipientReceives}`);
      expect(uiReceives).to.eq(recipientReceives);
    });
  });


    // ─────────────── Confirmation Screens ───────────────
    cy.get('.ant-col > .ant-btn > span').should('be.visible').click();

  cy.get('.ant-modal-body > :nth-child(1) > .ant-col > .ant-typography')
    .should('be.visible')
    .and('contain.text', 'Payment Confirmation');

  cy.get('@recipientReceives').then((recipientReceives) => {
    cy.get(':nth-child(4) > .ant-col-8 > .ant-typography')
      .should('be.visible')
      .and('contain.text', recipientReceives);
  });

  // Pay recipient
  cy.get(
    '.ant-row-center.m-t-20 > .ant-col > .ant-space > :nth-child(2) > .ant-btn'
  )
    .should('be.visible')
    .click();

  cy.get('.ant-modal-body > :nth-child(1) > .ant-col')
    .should('be.visible')
    .and('contain.text', ' Payment Booked - ');

  cy.get('@recipientReceives').then((recipientReceives) => {
    cy.get(':nth-child(5) > .ant-col-8 > .ant-typography')
      .should('be.visible')
      .and('contain.text', recipientReceives);
  });
    })
    it('TC-AC-012 - Verify that if Currency= SAR and Country = UNITED KINGDOM & client = UK and check priority settlement is enabled and make a payment with GBP using Push Funds',function () {
    // ─────────────── Setup & Recipient Creation ───────────────
        signin.Login(userName, password)
        newRecipient.goToPaymentsDashborad()
        newRecipient.gotoRecipientList()
        let email = batchPayments.generateRandomString(5)+ '@yopmail.com'
        newRecipient.addRecipient('UNITED KINGDOM{enter}' ,'SAR{enter}',email)
        newRecipient.addBankDetails('GB73BARC20039538243547','AFFLGB22')
        newRecipient.individualRecipient('UK SAR','UNITED KINGDOM{enter}')
        newRecipient.saveRecipient()
        newRecipient.checkSettelment('be.disabled','be.enabled')

    // ─────────────── Payment Flow ───────────────
    newPayment.proceedflow('{downarrow}{enter}', 'GBP');
    const amount = '10';
    newPayment.addrecipientDetail(amount, email);
    newPayment.selectFundingMethod('Push Funds');
      const apiEnv = this.apiEnv;
    // ───── Intercept Quote API ─────
  cy.intercept(
  'POST',
  '**/VolopaApiOauth2WebApp*/exchange/b2b/self/quote/temp'
).as('quoteApi');

  // ───── Wait for API and Compare Values ─────
  cy.wait('@quoteApi').then(({ response }) => {
    const receive = response.body.data.receive;
    const recipientReceives = response.body.data.recipient[0].receives;

    cy.wrap(recipientReceives).as('recipientReceives');
    cy.log(`Receive: ${receive}`);
    cy.log(`Recipient Receives: ${recipientReceives}`);

    expect(receive).to.eq(recipientReceives); // Final comparison
  });

    /* ── Validate payment‑reason field ───────────────────────── */
    // 1️⃣ Ensure the field starts empty
    cy.get('.ant-select-selector')
      .eq(2)
      .should(($el) => {
        expect(
          $el.text().trim(),
          'reason field should start empty'
        ).to.equal('');
      })
      .click(); // open dropdown

    // 2️⃣ Pick a random option between 1 and 10
    cy.get('.ant-select-dropdown')
      .last()
      .find('.ant-select-item-option')
      .its('length')
      .then((total) => {
        const idx = Math.min(7, Cypress._.random(0, total - 1));
        cy.get('.ant-select-dropdown')
          .last()
          .find('.ant-select-item-option')
          .eq(idx)
          .click();
      });

    /* ── Validate recipient‑received amount ───────────────────── */
    cy.get(':nth-child(3) > :nth-child(2) > .ant-typography')
    .invoke('text')
    .then((uiText) => {
      const trimmedUiText = uiText.trim();
      cy.wrap(trimmedUiText).as('uiReceives');
    });

  // Compare UI vs API value
  cy.get('@recipientReceives').then((recipientReceives) => {
    cy.get('@uiReceives').then((uiReceives) => {
      cy.log(`UI: ${uiReceives}, API: ${recipientReceives}`);
      expect(uiReceives).to.eq(recipientReceives);
    });
  });


    // ─────────────── Confirmation Screens ───────────────
    cy.get('.ant-col > .ant-btn > span').should('be.visible').click();

  cy.get('.ant-modal-body > :nth-child(1) > .ant-col > .ant-typography')
    .should('be.visible')
    .and('contain.text', 'Payment Confirmation');

  cy.get('@recipientReceives').then((recipientReceives) => {
    cy.get(':nth-child(4) > .ant-col-8 > .ant-typography')
      .should('be.visible')
      .and('contain.text', recipientReceives);
  });

  // Pay recipient
  cy.get(
    '.ant-row-center.m-t-20 > .ant-col > .ant-space > :nth-child(2) > .ant-btn'
  )
    .should('be.visible')
    .click();

  cy.get('.ant-modal-body > :nth-child(1) > .ant-col')
    .should('be.visible')
    .and('contain.text', ' Payment Booked - ');

  cy.get('@recipientReceives').then((recipientReceives) => {
    cy.get(':nth-child(5) > .ant-col-8 > .ant-typography')
      .should('be.visible')
      .and('contain.text', recipientReceives);
  });
    })
    it('TC-AC-013 - Verify that if Currency= SAR and Country = Saudi Arabia & client = UK and check priority settlement is enabled and make a payment with GBP using Push Funds',function () {
    // ─────────────── Setup & Recipient Creation ───────────────
        signin.Login(userName, password)
        newRecipient.goToPaymentsDashborad()
        newRecipient.gotoRecipientList()
        let email = batchPayments.generateRandomString(5)+ '@yopmail.com'
        newRecipient.addRecipient('SAUDI ARABIA{enter}' ,'SAR{enter}',email)
        newRecipient.addBankDetails('SA0380000000608010167519','AIASSARI')
        newRecipient.individualRecipient('Saudia Arabia SAR','SAUDI ARABIA{enter}')
        newRecipient.saveRecipient()
        newRecipient.checkSettelment('be.disabled','be.enabled')

    // ─────────────── Payment Flow ───────────────
    newPayment.proceedflow('{downarrow}{enter}', 'GBP');
    const amount = '10';
    newPayment.addrecipientDetail(amount, email);
    newPayment.selectFundingMethod('Push Funds');
            const apiEnv = this.apiEnv;

    // ───── Intercept Quote API ─────
  cy.intercept(
  'POST',
  '**/VolopaApiOauth2WebApp*/exchange/b2b/self/quote/temp'
).as('quoteApi');

  // ───── Wait for API and Compare Values ─────
  cy.wait('@quoteApi').then(({ response }) => {
    const receive = response.body.data.receive;
    const recipientReceives = response.body.data.recipient[0].receives;

    cy.wrap(recipientReceives).as('recipientReceives');
    cy.log(`Receive: ${receive}`);
    cy.log(`Recipient Receives: ${recipientReceives}`);

    expect(receive).to.eq(recipientReceives); // Final comparison
  });

    /* ── Validate payment‑reason field ───────────────────────── */
    // 1️⃣ Ensure the field starts empty
    cy.get('.ant-select-selector')
      .eq(2)
      .should(($el) => {
        expect(
          $el.text().trim(),
          'reason field should start empty'
        ).to.equal('');
      })
      .click(); // open dropdown

    // 2️⃣ Pick a random option between 1 and 10
    cy.get('.ant-select-dropdown')
      .last()
      .find('.ant-select-item-option')
      .its('length')
      .then((total) => {
        const idx = Math.min(7, Cypress._.random(0, total - 1));
        cy.get('.ant-select-dropdown')
          .last()
          .find('.ant-select-item-option')
          .eq(idx)
          .click();
      });

    /* ── Validate recipient‑received amount ───────────────────── */
    cy.get(':nth-child(3) > :nth-child(2) > .ant-typography')
    .invoke('text')
    .then((uiText) => {
      const trimmedUiText = uiText.trim();
      cy.wrap(trimmedUiText).as('uiReceives');
    });

  // Compare UI vs API value
  cy.get('@recipientReceives').then((recipientReceives) => {
    cy.get('@uiReceives').then((uiReceives) => {
      cy.log(`UI: ${uiReceives}, API: ${recipientReceives}`);
      expect(uiReceives).to.eq(recipientReceives);
    });
  });


    // ─────────────── Confirmation Screens ───────────────
    cy.get('.ant-col > .ant-btn > span').should('be.visible').click();

  cy.get('.ant-modal-body > :nth-child(1) > .ant-col > .ant-typography')
    .should('be.visible')
    .and('contain.text', 'Payment Confirmation');

  cy.get('@recipientReceives').then((recipientReceives) => {
    cy.get(':nth-child(4) > .ant-col-8 > .ant-typography')
      .should('be.visible')
      .and('contain.text', recipientReceives);
  });

  // Pay recipient
  cy.get(
    '.ant-row-center.m-t-20 > .ant-col > .ant-space > :nth-child(2) > .ant-btn'
  )
    .should('be.visible')
    .click();

  cy.get('.ant-modal-body > :nth-child(1) > .ant-col')
    .should('be.visible')
    .and('contain.text', ' Payment Booked - ');

  cy.get('@recipientReceives').then((recipientReceives) => {
    cy.get(':nth-child(5) > .ant-col-8 > .ant-typography')
      .should('be.visible')
      .and('contain.text', recipientReceives);
  });
    })
    it('TC-AC-014 - Verify that if Currency= QAR and Country = UNITED KINGDOM & client = UK and check priority settlement is enabled and make a payment with GBP using Push Funds',function () {
    // ─────────────── Setup & Recipient Creation ───────────────
        signin.Login(userName, password)
        newRecipient.goToPaymentsDashborad()
        newRecipient.gotoRecipientList()
        let email = batchPayments.generateRandomString(5)+ '@yopmail.com'
        newRecipient.addRecipient('UNITED KINGDOM{enter}' ,'QAR{enter}',email)
        newRecipient.addBankDetails('GB73BARC20039538243547','AFFLGB22')
        newRecipient.individualRecipient('UK QAR','UNITED KINGDOM{enter}')
        newRecipient.saveRecipient()
        newRecipient.checkSettelment('be.disabled','be.enabled')

    // ─────────────── Payment Flow ───────────────
    newPayment.proceedflow('{downarrow}{enter}', 'GBP');
    const amount = '10';
    newPayment.addrecipientDetail(amount, email);
    newPayment.selectFundingMethod('Push Funds');
      const apiEnv = this.apiEnv;

    // ───── Intercept Quote API ─────
  cy.intercept(
  'POST',
  '**/VolopaApiOauth2WebApp*/exchange/b2b/self/quote/temp'
).as('quoteApi');

  // ───── Wait for API and Compare Values ─────
  cy.wait('@quoteApi').then(({ response }) => {
    const receive = response.body.data.receive;
    const recipientReceives = response.body.data.recipient[0].receives;

    cy.wrap(recipientReceives).as('recipientReceives');
    cy.log(`Receive: ${receive}`);
    cy.log(`Recipient Receives: ${recipientReceives}`);

    expect(receive).to.eq(recipientReceives); // Final comparison
  });

    /* ── Validate payment‑reason field ───────────────────────── */
    // 1️⃣ Ensure the field starts empty
    cy.get('.ant-select-selector')
      .eq(2)
      .should(($el) => {
        expect(
          $el.text().trim(),
          'reason field should start empty'
        ).to.equal('');
      })
      .click(); // open dropdown

    // 2️⃣ Pick a random option between 1 and 10
    cy.get('.ant-select-dropdown')
      .last()
      .find('.ant-select-item-option')
      .its('length')
      .then((total) => {
        const idx = Math.min(7, Cypress._.random(0, total - 1));
        cy.get('.ant-select-dropdown')
          .last()
          .find('.ant-select-item-option')
          .eq(idx)
          .click();
      });

    /* ── Validate recipient‑received amount ───────────────────── */
    cy.get(':nth-child(3) > :nth-child(2) > .ant-typography')
    .invoke('text')
    .then((uiText) => {
      const trimmedUiText = uiText.trim();
      cy.wrap(trimmedUiText).as('uiReceives');
    });

  // Compare UI vs API value
  cy.get('@recipientReceives').then((recipientReceives) => {
    cy.get('@uiReceives').then((uiReceives) => {
      cy.log(`UI: ${uiReceives}, API: ${recipientReceives}`);
      expect(uiReceives).to.eq(recipientReceives);
    });
  });


    // ─────────────── Confirmation Screens ───────────────
    cy.get('.ant-col > .ant-btn > span').should('be.visible').click();

  cy.get('.ant-modal-body > :nth-child(1) > .ant-col > .ant-typography')
    .should('be.visible')
    .and('contain.text', 'Payment Confirmation');

  cy.get('@recipientReceives').then((recipientReceives) => {
    cy.get(':nth-child(4) > .ant-col-8 > .ant-typography')
      .should('be.visible')
      .and('contain.text', recipientReceives);
  });

  // Pay recipient
  cy.get(
    '.ant-row-center.m-t-20 > .ant-col > .ant-space > :nth-child(2) > .ant-btn'
  )
    .should('be.visible')
    .click();

  cy.get('.ant-modal-body > :nth-child(1) > .ant-col')
    .should('be.visible')
    .and('contain.text', ' Payment Booked - ');

  cy.get('@recipientReceives').then((recipientReceives) => {
    cy.get(':nth-child(5) > .ant-col-8 > .ant-typography')
      .should('be.visible')
      .and('contain.text', recipientReceives);
  });
    })
    it('TC-AC-015 - Verify that if Currency= QAR and Country = QATAR & client = UK and check priority settlement is enabled and make a payment with GBP using Push Funds',function () {
    // ─────────────── Setup & Recipient Creation ───────────────
         signin.Login(userName, password)
        newRecipient.goToPaymentsDashborad()
        newRecipient.gotoRecipientList()
        let email = batchPayments.generateRandomString(5)+ '@yopmail.com'
        newRecipient.addRecipient('QATAR{enter}' ,'QAR{enter}',email)
        newRecipient.addBankDetails('QA58DOHB00001234567890ABCDEFG','ALZAQAQA')
        newRecipient.individualRecipient('Qatar QAR','QATAR{enter}')
        newRecipient.saveRecipient()
        newRecipient.checkSettelment('be.disabled','be.enabled')

    // ─────────────── Payment Flow ───────────────
    newPayment.proceedflow('{downarrow}{enter}', 'GBP');
    const amount = '10';
    newPayment.addrecipientDetail(amount, email);
    newPayment.selectFundingMethod('Push Funds');
      const apiEnv = this.apiEnv;

    // ───── Intercept Quote API ─────
  cy.intercept(
  'POST',
  '**/VolopaApiOauth2WebApp*/exchange/b2b/self/quote/temp'
).as('quoteApi');

  // ───── Wait for API and Compare Values ─────
  cy.wait('@quoteApi').then(({ response }) => {
    const receive = response.body.data.receive;
    const recipientReceives = response.body.data.recipient[0].receives;

    cy.wrap(recipientReceives).as('recipientReceives');
    cy.log(`Receive: ${receive}`);
    cy.log(`Recipient Receives: ${recipientReceives}`);

    expect(receive).to.eq(recipientReceives); // Final comparison
  });

    /* ── Validate payment‑reason field ───────────────────────── */
    // 1️⃣ Ensure the field starts empty
    cy.get('.ant-select-selector')
      .eq(2)
      .should(($el) => {
        expect(
          $el.text().trim(),
          'reason field should start empty'
        ).to.equal('');
      })
      .click(); // open dropdown

    // 2️⃣ Pick a random option between 1 and 10
    cy.get('.ant-select-dropdown')
      .last()
      .find('.ant-select-item-option')
      .its('length')
      .then((total) => {
        const idx = Math.min(7, Cypress._.random(0, total - 1));
        cy.get('.ant-select-dropdown')
          .last()
          .find('.ant-select-item-option')
          .eq(idx)
          .click();
      });

    /* ── Validate recipient‑received amount ───────────────────── */
    cy.get(':nth-child(3) > :nth-child(2) > .ant-typography')
    .invoke('text')
    .then((uiText) => {
      const trimmedUiText = uiText.trim();
      cy.wrap(trimmedUiText).as('uiReceives');
    });

  // Compare UI vs API value
  cy.get('@recipientReceives').then((recipientReceives) => {
    cy.get('@uiReceives').then((uiReceives) => {
      cy.log(`UI: ${uiReceives}, API: ${recipientReceives}`);
      expect(uiReceives).to.eq(recipientReceives);
    });
  });


    // ─────────────── Confirmation Screens ───────────────
    cy.get('.ant-col > .ant-btn > span').should('be.visible').click();

  cy.get('.ant-modal-body > :nth-child(1) > .ant-col > .ant-typography')
    .should('be.visible')
    .and('contain.text', 'Payment Confirmation');

  cy.get('@recipientReceives').then((recipientReceives) => {
    cy.get(':nth-child(4) > .ant-col-8 > .ant-typography')
      .should('be.visible')
      .and('contain.text', recipientReceives);
  });

  // Pay recipient
  cy.get(
    '.ant-row-center.m-t-20 > .ant-col > .ant-space > :nth-child(2) > .ant-btn'
  )
    .should('be.visible')
    .click();

  cy.get('.ant-modal-body > :nth-child(1) > .ant-col')
    .should('be.visible')
    .and('contain.text', ' Payment Booked - ');

  cy.get('@recipientReceives').then((recipientReceives) => {
    cy.get(':nth-child(5) > .ant-col-8 > .ant-typography')
      .should('be.visible')
      .and('contain.text', recipientReceives);
  });
    })
    it('TC-AC-016 - Verify that if Currency= CZK and Country = UNITED KINGDOM & client = UK and check priority settlement is enabled and make a payment with GBP using Push Funds',function () {
    // ─────────────── Setup & Recipient Creation ───────────────
        signin.Login(userName, password)
        newRecipient.goToPaymentsDashborad()
        newRecipient.gotoRecipientList()
        let email = batchPayments.generateRandomString(5)+ '@yopmail.com'
        newRecipient.addRecipient('UNITED KINGDOM{enter}' ,'CZK{enter}',email)
        newRecipient.addBankDetails('GB73BARC20039538243547','AFFLGB22')
        newRecipient.individualRecipient('UK CZK','UNITED KINGDOM{enter}')
        newRecipient.saveRecipient()
        newRecipient.checkSettelment('be.disabled','be.enabled')

    // ─────────────── Payment Flow ───────────────
    newPayment.proceedflow('{downarrow}{enter}', 'GBP');
    const amount = '10';
    newPayment.addrecipientDetail(amount, email);
    newPayment.selectFundingMethod('Push Funds');
      const apiEnv = this.apiEnv;
    // ───── Intercept Quote API ─────
  cy.intercept(
  'POST',
  '**/VolopaApiOauth2WebApp*/exchange/b2b/self/quote/temp'
).as('quoteApi');

  // ───── Wait for API and Compare Values ─────
  cy.wait('@quoteApi').then(({ response }) => {
    const receive = response.body.data.receive;
    const recipientReceives = response.body.data.recipient[0].receives;

    cy.wrap(recipientReceives).as('recipientReceives');
    cy.log(`Receive: ${receive}`);
    cy.log(`Recipient Receives: ${recipientReceives}`);

    expect(receive).to.eq(recipientReceives); // Final comparison
  });

    /* ── Validate payment‑reason field ───────────────────────── */
    // 1️⃣ Ensure the field starts empty
    cy.get('.ant-select-selector')
      .eq(2)
      .should(($el) => {
        expect(
          $el.text().trim(),
          'reason field should start empty'
        ).to.equal('');
      })
      .click(); // open dropdown

    // 2️⃣ Pick a random option between 1 and 10
    cy.get('.ant-select-dropdown')
      .last()
      .find('.ant-select-item-option')
      .its('length')
      .then((total) => {
        const idx = Math.min(7, Cypress._.random(0, total - 1));
        cy.get('.ant-select-dropdown')
          .last()
          .find('.ant-select-item-option')
          .eq(idx)
          .click();
      });

    /* ── Validate recipient‑received amount ───────────────────── */
    cy.get(':nth-child(3) > :nth-child(2) > .ant-typography')
    .invoke('text')
    .then((uiText) => {
      const trimmedUiText = uiText.trim();
      cy.wrap(trimmedUiText).as('uiReceives');
    });

  // Compare UI vs API value
  cy.get('@recipientReceives').then((recipientReceives) => {
    cy.get('@uiReceives').then((uiReceives) => {
      cy.log(`UI: ${uiReceives}, API: ${recipientReceives}`);
      expect(uiReceives).to.eq(recipientReceives);
    });
  });


    // ─────────────── Confirmation Screens ───────────────
    cy.get('.ant-col > .ant-btn > span').should('be.visible').click();

  cy.get('.ant-modal-body > :nth-child(1) > .ant-col > .ant-typography')
    .should('be.visible')
    .and('contain.text', 'Payment Confirmation');

  cy.get('@recipientReceives').then((recipientReceives) => {
    cy.get(':nth-child(4) > .ant-col-8 > .ant-typography')
      .should('be.visible')
      .and('contain.text', recipientReceives);
  });

  // Pay recipient
  cy.get(
    '.ant-row-center.m-t-20 > .ant-col > .ant-space > :nth-child(2) > .ant-btn'
  )
    .should('be.visible')
    .click();

  cy.get('.ant-modal-body > :nth-child(1) > .ant-col')
    .should('be.visible')
    .and('contain.text', ' Payment Booked - ');

  cy.get('@recipientReceives').then((recipientReceives) => {
    cy.get(':nth-child(5) > .ant-col-8 > .ant-typography')
      .should('be.visible')
      .and('contain.text', recipientReceives);
  });
    })
    it('TC-AC-017 - Verify that if Currency= CZK and Country = Czech Republic & client = UK and check priority settlement is enabled and make a payment with GBP using Push Funds',function () {
    // ─────────────── Setup & Recipient Creation ───────────────
         signin.Login(userName, password)
        newRecipient.goToPaymentsDashborad()
        newRecipient.gotoRecipientList()
        let email = batchPayments.generateRandomString(5)+ '@yopmail.com'
        newRecipient.addRecipient('Czech Republic{enter}' ,'CZK{enter}',email)
        newRecipient.addBankDetails('CZ5508000000001234567899','AKCNCZP2')
        newRecipient.individualRecipient('Czech Republic CZK','Czech Republic{enter}')
        newRecipient.saveRecipient()
        newRecipient.checkSettelment('be.disabled','be.enabled')

    // ─────────────── Payment Flow ───────────────
    newPayment.proceedflow('{downarrow}{enter}', 'GBP');
    const amount = '10';
    newPayment.addrecipientDetail(amount, email);
    newPayment.selectFundingMethod('Push Funds');
      const apiEnv = this.apiEnv;
    // ───── Intercept Quote API ─────
  cy.intercept(
  'POST',
  '**/VolopaApiOauth2WebApp*/exchange/b2b/self/quote/temp'
).as('quoteApi');

  // ───── Wait for API and Compare Values ─────
  cy.wait('@quoteApi').then(({ response }) => {
    const receive = response.body.data.receive;
    const recipientReceives = response.body.data.recipient[0].receives;

    cy.wrap(recipientReceives).as('recipientReceives');
    cy.log(`Receive: ${receive}`);
    cy.log(`Recipient Receives: ${recipientReceives}`);

    expect(receive).to.eq(recipientReceives); // Final comparison
  });

    /* ── Validate payment‑reason field ───────────────────────── */
    // 1️⃣ Ensure the field starts empty
    cy.get('.ant-select-selector')
      .eq(2)
      .should(($el) => {
        expect(
          $el.text().trim(),
          'reason field should start empty'
        ).to.equal('');
      })
      .click(); // open dropdown

    // 2️⃣ Pick a random option between 1 and 10
    cy.get('.ant-select-dropdown')
      .last()
      .find('.ant-select-item-option')
      .its('length')
      .then((total) => {
        const idx = Math.min(7, Cypress._.random(0, total - 1));
        cy.get('.ant-select-dropdown')
          .last()
          .find('.ant-select-item-option')
          .eq(idx)
          .click();
      });

    /* ── Validate recipient‑received amount ───────────────────── */
    cy.get(':nth-child(3) > :nth-child(2) > .ant-typography')
    .invoke('text')
    .then((uiText) => {
      const trimmedUiText = uiText.trim();
      cy.wrap(trimmedUiText).as('uiReceives');
    });

  // Compare UI vs API value
  cy.get('@recipientReceives').then((recipientReceives) => {
    cy.get('@uiReceives').then((uiReceives) => {
      cy.log(`UI: ${uiReceives}, API: ${recipientReceives}`);
      expect(uiReceives).to.eq(recipientReceives);
    });
  });


    // ─────────────── Confirmation Screens ───────────────
    cy.get('.ant-col > .ant-btn > span').should('be.visible').click();

  cy.get('.ant-modal-body > :nth-child(1) > .ant-col > .ant-typography')
    .should('be.visible')
    .and('contain.text', 'Payment Confirmation');

  cy.get('@recipientReceives').then((recipientReceives) => {
    cy.get(':nth-child(4) > .ant-col-8 > .ant-typography')
      .should('be.visible')
      .and('contain.text', recipientReceives);
  });

  // Pay recipient
  cy.get(
    '.ant-row-center.m-t-20 > .ant-col > .ant-space > :nth-child(2) > .ant-btn'
  )
    .should('be.visible')
    .click();

  cy.get('.ant-modal-body > :nth-child(1) > .ant-col')
    .should('be.visible')
    .and('contain.text', ' Payment Booked - ');

  cy.get('@recipientReceives').then((recipientReceives) => {
    cy.get(':nth-child(5) > .ant-col-8 > .ant-typography')
      .should('be.visible')
      .and('contain.text', recipientReceives);
  });
    })
    it('TC-AC-018 - Verify that if Currency= RON and Country = UNITED KINGDOM & client = UK and check priority settlement is enabled and make a payment with GBP using Push Funds',function () {
    // ─────────────── Setup & Recipient Creation ───────────────
        signin.Login(userName, password)
        newRecipient.goToPaymentsDashborad()
        newRecipient.gotoRecipientList()
        let email = batchPayments.generateRandomString(5)+ '@yopmail.com'
        newRecipient.addRecipient('UNITED KINGDOM{enter}' ,'RON{enter}',email)
        newRecipient.addBankDetails('GB73BARC20039538243547','BACXROBUXXX')
        newRecipient.individualRecipient('UK RON','UNITED KINGDOM{enter}')
        newRecipient.saveRecipient()
        newRecipient.checkSettelment('be.disabled','be.enabled')

    // ─────────────── Payment Flow ───────────────
    newPayment.proceedflow('{downarrow}{enter}', 'GBP');
    const amount = '10';
    newPayment.addrecipientDetail(amount, email);
    newPayment.selectFundingMethod('Push Funds');
      const apiEnv = this.apiEnv;
    // ───── Intercept Quote API ─────
  cy.intercept(
  'POST',
  '**/VolopaApiOauth2WebApp*/exchange/b2b/self/quote/temp'
).as('quoteApi');

  // ───── Wait for API and Compare Values ─────
  cy.wait('@quoteApi').then(({ response }) => {
    const receive = response.body.data.receive;
    const recipientReceives = response.body.data.recipient[0].receives;

    cy.wrap(recipientReceives).as('recipientReceives');
    cy.log(`Receive: ${receive}`);
    cy.log(`Recipient Receives: ${recipientReceives}`);

    expect(receive).to.eq(recipientReceives); // Final comparison
  });

    /* ── Validate payment‑reason field ───────────────────────── */
    // 1️⃣ Ensure the field starts empty
    cy.get('.ant-select-selector')
      .eq(2)
      .should(($el) => {
        expect(
          $el.text().trim(),
          'reason field should start empty'
        ).to.equal('');
      })
      .click(); // open dropdown

    // 2️⃣ Pick a random option between 1 and 10
    cy.get('.ant-select-dropdown')
      .last()
      .find('.ant-select-item-option')
      .its('length')
      .then((total) => {
        const idx = Math.min(7, Cypress._.random(0, total - 1));
        cy.get('.ant-select-dropdown')
          .last()
          .find('.ant-select-item-option')
          .eq(idx)
          .click();
      });

    /* ── Validate recipient‑received amount ───────────────────── */
    cy.get(':nth-child(3) > :nth-child(2) > .ant-typography')
    .invoke('text')
    .then((uiText) => {
      const trimmedUiText = uiText.trim();
      cy.wrap(trimmedUiText).as('uiReceives');
    });

  // Compare UI vs API value
  cy.get('@recipientReceives').then((recipientReceives) => {
    cy.get('@uiReceives').then((uiReceives) => {
      cy.log(`UI: ${uiReceives}, API: ${recipientReceives}`);
      expect(uiReceives).to.eq(recipientReceives);
    });
  });


    // ─────────────── Confirmation Screens ───────────────
    cy.get('.ant-col > .ant-btn > span').should('be.visible').click();

  cy.get('.ant-modal-body > :nth-child(1) > .ant-col > .ant-typography')
    .should('be.visible')
    .and('contain.text', 'Payment Confirmation');

  cy.get('@recipientReceives').then((recipientReceives) => {
    cy.get(':nth-child(4) > .ant-col-8 > .ant-typography')
      .should('be.visible')
      .and('contain.text', recipientReceives);
  });

  // Pay recipient
  cy.get(
    '.ant-row-center.m-t-20 > .ant-col > .ant-space > :nth-child(2) > .ant-btn'
  )
    .should('be.visible')
    .click();

  cy.get('.ant-modal-body > :nth-child(1) > .ant-col')
    .should('be.visible')
    .and('contain.text', ' Payment Booked - ');

  cy.get('@recipientReceives').then((recipientReceives) => {
    cy.get(':nth-child(5) > .ant-col-8 > .ant-typography')
      .should('be.visible')
      .and('contain.text', recipientReceives);
  });
    })
    it('TC-AC-019 - Verify that if Currency= RON and Country = Romania & client = UK and check priority settlement is enabled and make a payment with GBP using Push Funds',function () {
    // ─────────────── Setup & Recipient Creation ───────────────
        signin.Login(userName, password)
        newRecipient.goToPaymentsDashborad()
        newRecipient.gotoRecipientList()
        let email = batchPayments.generateRandomString(5)+ '@yopmail.com'
        newRecipient.addRecipient('ROMANIA{enter}' ,'RON{enter}',email)
        newRecipient.addBankDetails('RO66BACX0000001234567890','BACXROBUXXX')
        newRecipient.individualRecipient('ROMANIA RON','ROMANIA{enter}')
        newRecipient.saveRecipient()
        newRecipient.checkSettelment('be.disabled','be.enabled')

    // ─────────────── Payment Flow ───────────────
    newPayment.proceedflow('{downarrow}{enter}', 'GBP');
    const amount = '10';
    newPayment.addrecipientDetail(amount, email);
    newPayment.selectFundingMethod('Push Funds');
      const apiEnv = this.apiEnv;
    // ───── Intercept Quote API ─────
  cy.intercept(
  'POST',
  '**/VolopaApiOauth2WebApp*/exchange/b2b/self/quote/temp'
).as('quoteApi');

  // ───── Wait for API and Compare Values ─────
  cy.wait('@quoteApi').then(({ response }) => {
    const receive = response.body.data.receive;
    const recipientReceives = response.body.data.recipient[0].receives;

    cy.wrap(recipientReceives).as('recipientReceives');
    cy.log(`Receive: ${receive}`);
    cy.log(`Recipient Receives: ${recipientReceives}`);

    expect(receive).to.eq(recipientReceives); // Final comparison
  });

    /* ── Validate payment‑reason field ───────────────────────── */
    // 1️⃣ Ensure the field starts empty
    cy.get('.ant-select-selector')
      .eq(2)
      .should(($el) => {
        expect(
          $el.text().trim(),
          'reason field should start empty'
        ).to.equal('');
      })
      .click(); // open dropdown

    // 2️⃣ Pick a random option between 1 and 10
    cy.get('.ant-select-dropdown')
      .last()
      .find('.ant-select-item-option')
      .its('length')
      .then((total) => {
        const idx = Math.min(7, Cypress._.random(0, total - 1));
        cy.get('.ant-select-dropdown')
          .last()
          .find('.ant-select-item-option')
          .eq(idx)
          .click();
      });

    /* ── Validate recipient‑received amount ───────────────────── */
    cy.get(':nth-child(3) > :nth-child(2) > .ant-typography')
    .invoke('text')
    .then((uiText) => {
      const trimmedUiText = uiText.trim();
      cy.wrap(trimmedUiText).as('uiReceives');
    });

  // Compare UI vs API value
  cy.get('@recipientReceives').then((recipientReceives) => {
    cy.get('@uiReceives').then((uiReceives) => {
      cy.log(`UI: ${uiReceives}, API: ${recipientReceives}`);
      expect(uiReceives).to.eq(recipientReceives);
    });
  });


    // ─────────────── Confirmation Screens ───────────────
    cy.get('.ant-col > .ant-btn > span').should('be.visible').click();

  cy.get('.ant-modal-body > :nth-child(1) > .ant-col > .ant-typography')
    .should('be.visible')
    .and('contain.text', 'Payment Confirmation');

  cy.get('@recipientReceives').then((recipientReceives) => {
    cy.get(':nth-child(4) > .ant-col-8 > .ant-typography')
      .should('be.visible')
      .and('contain.text', recipientReceives);
  });

  // Pay recipient
  cy.get(
    '.ant-row-center.m-t-20 > .ant-col > .ant-space > :nth-child(2) > .ant-btn'
  )
    .should('be.visible')
    .click();

  cy.get('.ant-modal-body > :nth-child(1) > .ant-col')
    .should('be.visible')
    .and('contain.text', ' Payment Booked - ');

  cy.get('@recipientReceives').then((recipientReceives) => {
    cy.get(':nth-child(5) > .ant-col-8 > .ant-typography')
      .should('be.visible')
      .and('contain.text', recipientReceives);
  });
    })
    it('TC-AC-020 - Verify that if Currency= ILS and Country = UNITED KINGDOM & client = UK and check priority settlement is enabled and make a payment with GBP using Push Funds',function () {
    // ─────────────── Setup & Recipient Creation ───────────────
        signin.Login(userName, password)
        newRecipient.goToPaymentsDashborad()
        newRecipient.gotoRecipientList()
        let email = batchPayments.generateRandomString(5)+ '@yopmail.com'
        newRecipient.addRecipient('UNITED KINGDOM{enter}' ,'ILS{enter}',email)
        newRecipient.addBankDetails('GB73BARC20039538243547','AFFLGB22')
        newRecipient.individualRecipient('UK ILS','UNITED KINGDOM{enter}')
        newRecipient.saveRecipient()
        newRecipient.checkSettelment('be.disabled','be.enabled')

    // ─────────────── Payment Flow ───────────────
    newPayment.proceedflow('{downarrow}{enter}', 'GBP');
    const amount = '10';
    newPayment.addrecipientDetail(amount, email);
    newPayment.selectFundingMethod('Push Funds');
      const apiEnv = this.apiEnv;
    // ───── Intercept Quote API ─────
  cy.intercept(
  'POST',
  '**/VolopaApiOauth2WebApp*/exchange/b2b/self/quote/temp'
).as('quoteApi');

  // ───── Wait for API and Compare Values ─────
  cy.wait('@quoteApi').then(({ response }) => {
    const receive = response.body.data.receive;
    const recipientReceives = response.body.data.recipient[0].receives;

    cy.wrap(recipientReceives).as('recipientReceives');
    cy.log(`Receive: ${receive}`);
    cy.log(`Recipient Receives: ${recipientReceives}`);

    expect(receive).to.eq(recipientReceives); // Final comparison
  });

    /* ── Validate payment‑reason field ───────────────────────── */
    // 1️⃣ Ensure the field starts empty
    cy.get('.ant-select-selector')
      .eq(2)
      .should(($el) => {
        expect(
          $el.text().trim(),
          'reason field should start empty'
        ).to.equal('');
      })
      .click(); // open dropdown

    // 2️⃣ Pick a random option between 1 and 10
    cy.get('.ant-select-dropdown')
      .last()
      .find('.ant-select-item-option')
      .its('length')
      .then((total) => {
        const idx = Math.min(7, Cypress._.random(0, total - 1));
        cy.get('.ant-select-dropdown')
          .last()
          .find('.ant-select-item-option')
          .eq(idx)
          .click();
      });

    /* ── Validate recipient‑received amount ───────────────────── */
    cy.get(':nth-child(3) > :nth-child(2) > .ant-typography')
    .invoke('text')
    .then((uiText) => {
      const trimmedUiText = uiText.trim();
      cy.wrap(trimmedUiText).as('uiReceives');
    });

  // Compare UI vs API value
  cy.get('@recipientReceives').then((recipientReceives) => {
    cy.get('@uiReceives').then((uiReceives) => {
      cy.log(`UI: ${uiReceives}, API: ${recipientReceives}`);
      expect(uiReceives).to.eq(recipientReceives);
    });
  });


    // ─────────────── Confirmation Screens ───────────────
    cy.get('.ant-col > .ant-btn > span').should('be.visible').click();

  cy.get('.ant-modal-body > :nth-child(1) > .ant-col > .ant-typography')
    .should('be.visible')
    .and('contain.text', 'Payment Confirmation');

  cy.get('@recipientReceives').then((recipientReceives) => {
    cy.get(':nth-child(4) > .ant-col-8 > .ant-typography')
      .should('be.visible')
      .and('contain.text', recipientReceives);
  });

  // Pay recipient
  cy.get(
    '.ant-row-center.m-t-20 > .ant-col > .ant-space > :nth-child(2) > .ant-btn'
  )
    .should('be.visible')
    .click();

  cy.get('.ant-modal-body > :nth-child(1) > .ant-col')
    .should('be.visible')
    .and('contain.text', ' Payment Booked - ');

  cy.get('@recipientReceives').then((recipientReceives) => {
    cy.get(':nth-child(5) > .ant-col-8 > .ant-typography')
      .should('be.visible')
      .and('contain.text', recipientReceives);
  });
    })
    it('TC-AC-021 - Verify that if Currency= ILS and Country = ISRAEL & client = UK and check priority settlement is enabled and make a payment with GBP using Push Funds',function () {
    // ─────────────── Setup & Recipient Creation ───────────────
        signin.Login(userName, password)
        newRecipient.goToPaymentsDashborad()
        newRecipient.gotoRecipientList()
        let email = batchPayments.generateRandomString(5)+ '@yopmail.com'
        newRecipient.addRecipient('ISRAEL{enter}' ,'ILS{enter}',email)
        newRecipient.addBankDetails('IL170108000000012612345','ASRIILIC')
        newRecipient.individualRecipient('ISRAEL ILS','ISRAEL{enter}')
        newRecipient.saveRecipient()
        newRecipient.checkSettelment('be.disabled','be.enabled')

    // ─────────────── Payment Flow ───────────────
    newPayment.proceedflow('{downarrow}{enter}', 'GBP');
    const amount = '10';
    newPayment.addrecipientDetail(amount, email);
    newPayment.selectFundingMethod('Push Funds');
      const apiEnv = this.apiEnv;
    // ───── Intercept Quote API ─────
  cy.intercept(
  'POST',
  '**/VolopaApiOauth2WebApp*/exchange/b2b/self/quote/temp'
).as('quoteApi');

  // ───── Wait for API and Compare Values ─────
  cy.wait('@quoteApi').then(({ response }) => {
    const receive = response.body.data.receive;
    const recipientReceives = response.body.data.recipient[0].receives;

    cy.wrap(recipientReceives).as('recipientReceives');
    cy.log(`Receive: ${receive}`);
    cy.log(`Recipient Receives: ${recipientReceives}`);

    expect(receive).to.eq(recipientReceives); // Final comparison
  });

    /* ── Validate payment‑reason field ───────────────────────── */
    // 1️⃣ Ensure the field starts empty
    cy.get('.ant-select-selector')
      .eq(2)
      .should(($el) => {
        expect(
          $el.text().trim(),
          'reason field should start empty'
        ).to.equal('');
      })
      .click(); // open dropdown

    // 2️⃣ Pick a random option between 1 and 10
    cy.get('.ant-select-dropdown')
      .last()
      .find('.ant-select-item-option')
      .its('length')
      .then((total) => {
        const idx = Math.min(7, Cypress._.random(0, total - 1));
        cy.get('.ant-select-dropdown')
          .last()
          .find('.ant-select-item-option')
          .eq(idx)
          .click();
      });

    /* ── Validate recipient‑received amount ───────────────────── */
    cy.get(':nth-child(3) > :nth-child(2) > .ant-typography')
    .invoke('text')
    .then((uiText) => {
      const trimmedUiText = uiText.trim();
      cy.wrap(trimmedUiText).as('uiReceives');
    });

  // Compare UI vs API value
  cy.get('@recipientReceives').then((recipientReceives) => {
    cy.get('@uiReceives').then((uiReceives) => {
      cy.log(`UI: ${uiReceives}, API: ${recipientReceives}`);
      expect(uiReceives).to.eq(recipientReceives);
    });
  });


    // ─────────────── Confirmation Screens ───────────────
    cy.get('.ant-col > .ant-btn > span').should('be.visible').click();

  cy.get('.ant-modal-body > :nth-child(1) > .ant-col > .ant-typography')
    .should('be.visible')
    .and('contain.text', 'Payment Confirmation');

  cy.get('@recipientReceives').then((recipientReceives) => {
    cy.get(':nth-child(4) > .ant-col-8 > .ant-typography')
      .should('be.visible')
      .and('contain.text', recipientReceives);
  });

  // Pay recipient
  cy.get(
    '.ant-row-center.m-t-20 > .ant-col > .ant-space > :nth-child(2) > .ant-btn'
  )
    .should('be.visible')
    .click();

  cy.get('.ant-modal-body > :nth-child(1) > .ant-col')
    .should('be.visible')
    .and('contain.text', ' Payment Booked - ');

  cy.get('@recipientReceives').then((recipientReceives) => {
    cy.get(':nth-child(5) > .ant-col-8 > .ant-typography')
      .should('be.visible')
      .and('contain.text', recipientReceives);
  });
    })
    it('TC-AC-022 - Verify that if Currency= HUF and Country = UNITED KINGDOM & client = UK and check priority settlement is enabled and make a payment with GBP using Push Funds', function () {

  // ─────────────── Setup & Recipient Creation ───────────────
  signin.Login(userName, password)
  newRecipient.goToPaymentsDashborad()
  newRecipient.gotoRecipientList()

  let email = batchPayments.generateRandomString(5) + '@yopmail.com'
  newRecipient.addRecipient('UNITED KINGDOM{enter}', 'HUF{enter}', email)
  newRecipient.addBankDetails('GB73BARC20039538243547', 'AFFLGB22')
  newRecipient.individualRecipient('UK HUF', 'UNITED KINGDOM{enter}')
  newRecipient.saveRecipient()
  newRecipient.checkSettelment('be.disabled', 'be.enabled')
    // ───── Intercept Quote API ─────
  cy.intercept(
    'POST',
    '**/VolopaApiOauth2WebApp*/exchange/b2b/self/quote/temp'
  ).as('quoteApi')
  // ─────────────── Payment Flow ───────────────
  newPayment.proceedflow('{downarrow}{enter}', 'GBP')
  const amount = '10'
  newPayment.addrecipientDetail(amount, email)
  newPayment.selectFundingMethod('Push Funds')

  const apiEnv = this.apiEnv
  const normalizeStr = (val) => val.replace(/,/g, '').trim()

  

  // ───── Wait for API and Compare API Values ─────
  cy.wait('@quoteApi').then(({ response }) => {
    const receive = response.body.data.receive
    const recipientReceives = response.body.data.recipient[0].receives

    cy.wrap(recipientReceives).as('recipientReceives')

    cy.log(`Receive: ${receive}`)
    cy.log(`Recipient Receives: ${recipientReceives}`)

    expect(normalizeStr(receive)).to.eq(normalizeStr(recipientReceives))
  })

  /* ── Validate payment-reason field ───────────────────────── */
  cy.get('.ant-select-selector')
    .eq(2)
    .should(($el) => {
      expect(
        $el.text().trim(),
        'reason field should start empty'
      ).to.equal('')
    })
    .click()

  cy.get('.ant-select-dropdown')
    .last()
    .find('.ant-select-item-option')
    .its('length')
    .then((total) => {
      const idx = Math.min(7, Cypress._.random(0, total - 1))
      cy.get('.ant-select-dropdown')
        .last()
        .find('.ant-select-item-option')
        .eq(idx)
        .click()
    })

  /* ── Validate recipient-received amount (UI vs API) ───────── */
  cy.get(':nth-child(3) > :nth-child(2) > .ant-typography')
    .invoke('text')
    .then((uiText) => {
      cy.wrap(uiText.trim()).as('uiReceives')
    })

  cy.get('@recipientReceives').then((recipientReceives) => {
    cy.get('@uiReceives').then((uiReceives) => {
      cy.log(`UI: ${uiReceives}, API: ${recipientReceives}`)
      expect(
        normalizeStr(uiReceives)
      ).to.eq(
        normalizeStr(recipientReceives)
      )
    })
  })

  // ─────────────── Confirmation Screens ───────────────
  cy.get('.ant-col > .ant-btn > span')
    .should('be.visible')
    .click()

  cy.get('.ant-modal-body > :nth-child(1) > .ant-col > .ant-typography')
    .should('be.visible')
    .and('contain.text', 'Payment Confirmation')

  cy.get('@recipientReceives').then((recipientReceives) => {
    cy.get(':nth-child(4) > .ant-col-8 > .ant-typography')
      .should('be.visible')
      .invoke('text')
      .then((uiText) => {
        expect(
          normalizeStr(uiText)
        ).to.eq(
          normalizeStr(recipientReceives)
        )
      })
  })

  // ─────────────── Pay Recipient ───────────────
  cy.get(
    '.ant-row-center.m-t-20 > .ant-col > .ant-space > :nth-child(2) > .ant-btn'
  )
    .should('be.visible')
    .click()

  cy.get('.ant-modal-body > :nth-child(1) > .ant-col')
    .should('be.visible')
    .and('contain.text', ' Payment Booked - ')

  cy.get('@recipientReceives').then((recipientReceives) => {
    cy.get(':nth-child(5) > .ant-col-8 > .ant-typography')
      .should('be.visible')
      .invoke('text')
      .then((uiText) => {
        expect(
          normalizeStr(uiText)
        ).to.eq(
          normalizeStr(recipientReceives)
        )
      })
  })

    })
    it('TC-AC-023 - Verify that if Currency= HUF and Country = Hungary & client = UK and check priority settlement is enabled and make a payment with GBP using Push Funds', function () {

  // ─────────────── Setup & Recipient Creation ───────────────
  signin.Login(userName, password)
  newRecipient.goToPaymentsDashborad()
  newRecipient.gotoRecipientList()

  let email = batchPayments.generateRandomString(5) + '@yopmail.com'
  newRecipient.addRecipient('HUNGARY{enter}', 'HUF{enter}', email)
  newRecipient.addBankDetails('HU42117730161111101800000000', 'AKKHHUHB')
  newRecipient.individualRecipient('Hungary HUF', 'HUNGARY{enter}')
  newRecipient.saveRecipient()
  newRecipient.checkSettelment('be.disabled', 'be.enabled')

  // ─────────────── Payment Flow ───────────────
  newPayment.proceedflow('{downarrow}{enter}', 'GBP')
  const amount = '10'
  newPayment.addrecipientDetail(amount, email)
  newPayment.selectFundingMethod('Push Funds')

  const apiEnv = this.apiEnv
  const normalizeStr = (val) => val.replace(/,/g, '').trim()

  // ───── Intercept Quote API ─────
  cy.intercept(
    'POST',
    '**/VolopaApiOauth2WebApp*/exchange/b2b/self/quote/temp'
  ).as('quoteApi')

  // ───── Wait for API and Compare API Values ─────
  cy.wait('@quoteApi').then(({ response }) => {
    const receive = response.body.data.receive
    const recipientReceives = response.body.data.recipient[0].receives

    cy.wrap(recipientReceives).as('recipientReceives')

    cy.log(`Receive: ${receive}`)
    cy.log(`Recipient Receives: ${recipientReceives}`)

    expect(normalizeStr(receive)).to.eq(normalizeStr(recipientReceives))
  })

  /* ── Validate payment-reason field ───────────────────────── */
  cy.get('.ant-select-selector')
    .eq(2)
    .should(($el) => {
      expect(
        $el.text().trim(),
        'reason field should start empty'
      ).to.equal('')
    })
    .click()

  cy.get('.ant-select-dropdown')
    .last()
    .find('.ant-select-item-option')
    .its('length')
    .then((total) => {
      const idx = Math.min(7, Cypress._.random(0, total - 1))
      cy.get('.ant-select-dropdown')
        .last()
        .find('.ant-select-item-option')
        .eq(idx)
        .click()
    })

  /* ── Validate recipient-received amount (UI vs API) ───────── */
  cy.get(':nth-child(3) > :nth-child(2) > .ant-typography')
    .invoke('text')
    .then((uiText) => {
      cy.wrap(uiText.trim()).as('uiReceives')
    })

  cy.get('@recipientReceives').then((recipientReceives) => {
    cy.get('@uiReceives').then((uiReceives) => {
      cy.log(`UI: ${uiReceives}, API: ${recipientReceives}`)
      expect(
        normalizeStr(uiReceives)
      ).to.eq(
        normalizeStr(recipientReceives)
      )
    })
  })

  // ─────────────── Confirmation Screens ───────────────
  cy.get('.ant-col > .ant-btn > span')
    .should('be.visible')
    .click()

  cy.get('.ant-modal-body > :nth-child(1) > .ant-col > .ant-typography')
    .should('be.visible')
    .and('contain.text', 'Payment Confirmation')

  cy.get('@recipientReceives').then((recipientReceives) => {
    cy.get(':nth-child(4) > .ant-col-8 > .ant-typography')
      .should('be.visible')
      .invoke('text')
      .then((uiText) => {
        expect(
          normalizeStr(uiText)
        ).to.eq(
          normalizeStr(recipientReceives)
        )
      })
  })

  // ─────────────── Pay Recipient ───────────────
  cy.get(
    '.ant-row-center.m-t-20 > .ant-col > .ant-space > :nth-child(2) > .ant-btn'
  )
    .should('be.visible')
    .click()

  cy.get('.ant-modal-body > :nth-child(1) > .ant-col')
    .should('be.visible')
    .and('contain.text', ' Payment Booked - ')

  cy.get('@recipientReceives').then((recipientReceives) => {
    cy.get(':nth-child(5) > .ant-col-8 > .ant-typography')
      .should('be.visible')
      .invoke('text')
      .then((uiText) => {
        expect(
          normalizeStr(uiText)
        ).to.eq(
          normalizeStr(recipientReceives)
        )
      })
  })

  })

    it('TC-AC-024 - Verify that if Currency= KES and Country = UNITED KINGDOM & client = UK and check priority settlement is enabled and make a payment with GBP using Push Funds',function () {
    // ─────────────── Setup & Recipient Creation ───────────────
        signin.Login(userName, password)
        newRecipient.goToPaymentsDashborad()
        newRecipient.gotoRecipientList()
        let email = batchPayments.generateRandomString(5)+ '@yopmail.com'
        newRecipient.addRecipient('UNITED KINGDOM{enter}' ,'KES{enter}',email)
        newRecipient.addBankDetails('GB73BARC20039538243547','AFFLGB22')
        newRecipient.individualRecipient('UK KES','UNITED KINGDOM{enter}')
        newRecipient.saveRecipient()
        newRecipient.checkSettelment('be.disabled','be.enabled')

    // ─────────────── Payment Flow ───────────────
    newPayment.proceedflow('{downarrow}{enter}', 'GBP');
    const amount = '10';
    newPayment.addrecipientDetail(amount, email);
    newPayment.selectFundingMethod('Push Funds');
      const apiEnv = this.apiEnv;
    // ───── Intercept Quote API ─────
  cy.intercept(
  'POST',
  '**/VolopaApiOauth2WebApp*/exchange/b2b/self/quote/temp'
).as('quoteApi');

  // ───── Wait for API and Compare Values ─────
  cy.wait('@quoteApi').then(({ response }) => {
    const receive = response.body.data.receive;
    const recipientReceives = response.body.data.recipient[0].receives;

    cy.wrap(recipientReceives).as('recipientReceives');
    cy.log(`Receive: ${receive}`);
    cy.log(`Recipient Receives: ${recipientReceives}`);

    expect(receive).to.eq(recipientReceives); // Final comparison
  });

    /* ── Validate payment‑reason field ───────────────────────── */
    // 1️⃣ Ensure the field starts empty
    cy.get('.ant-select-selector')
      .eq(2)
      .should(($el) => {
        expect(
          $el.text().trim(),
          'reason field should start empty'
        ).to.equal('');
      })
      .click(); // open dropdown

    // 2️⃣ Pick a random option between 1 and 10
    cy.get('.ant-select-dropdown')
      .last()
      .find('.ant-select-item-option')
      .its('length')
      .then((total) => {
        const idx = Math.min(7, Cypress._.random(0, total - 1));
        cy.get('.ant-select-dropdown')
          .last()
          .find('.ant-select-item-option')
          .eq(idx)
          .click();
      });

    /* ── Validate recipient‑received amount ───────────────────── */
    cy.get(':nth-child(3) > :nth-child(2) > .ant-typography')
    .invoke('text')
    .then((uiText) => {
      const trimmedUiText = uiText.trim();
      cy.wrap(trimmedUiText).as('uiReceives');
    });

  // Compare UI vs API value
  cy.get('@recipientReceives').then((recipientReceives) => {
    cy.get('@uiReceives').then((uiReceives) => {
      cy.log(`UI: ${uiReceives}, API: ${recipientReceives}`);
      expect(uiReceives).to.eq(recipientReceives);
    });
  });


    // ─────────────── Confirmation Screens ───────────────
    cy.get('.ant-col > .ant-btn > span').should('be.visible').click();

  cy.get('.ant-modal-body > :nth-child(1) > .ant-col > .ant-typography')
    .should('be.visible')
    .and('contain.text', 'Payment Confirmation');

  cy.get('@recipientReceives').then((recipientReceives) => {
    cy.get(':nth-child(4) > .ant-col-8 > .ant-typography')
      .should('be.visible')
      .and('contain.text', recipientReceives);
  });

  // Pay recipient
  cy.get(
    '.ant-row-center.m-t-20 > .ant-col > .ant-space > :nth-child(2) > .ant-btn'
  )
    .should('be.visible')
    .click();

  cy.get('.ant-modal-body > :nth-child(1) > .ant-col')
    .should('be.visible')
    .and('contain.text', ' Payment Booked - ');

  cy.get('@recipientReceives').then((recipientReceives) => {
    cy.get(':nth-child(5) > .ant-col-8 > .ant-typography')
      .should('be.visible')
      .and('contain.text', recipientReceives);
  });
    })
    it('TC-AC-025 - Verify that if Currency= KES and Country = Kenya & client = UK and check priority settlement is enabled and make a payment with GBP using Push Funds',function () {
    // ─────────────── Setup & Recipient Creation ───────────────
        signin.Login(userName, password)
        newRecipient.goToPaymentsDashborad()
        newRecipient.gotoRecipientList()
        let email = batchPayments.generateRandomString(5)+ '@yopmail.com'
        newRecipient.addRecipient('KENYA{enter}' ,'KES{enter}',email)
        newRecipient.addBankDetailsWithAccNo('AFRIKENX','049712')
        cy.get('#bankBranch').type('city branch')
        newRecipient.individualRecipient('Kenya KES','KENYA{enter}')
        newRecipient.saveRecipient()
        newRecipient.checkSettelment('be.disabled','be.enabled')

    // ─────────────── Payment Flow ───────────────
    newPayment.proceedflow('{downarrow}{enter}', 'GBP');
    const amount = '10';
    newPayment.addrecipientDetail(amount, email);
    newPayment.selectFundingMethod('Push Funds');
      const apiEnv = this.apiEnv;
    // ───── Intercept Quote API ─────
  cy.intercept(
  'POST',
  '**/VolopaApiOauth2WebApp*/exchange/b2b/self/quote/temp'
).as('quoteApi');

  // ───── Wait for API and Compare Values ─────
  cy.wait('@quoteApi').then(({ response }) => {
    const receive = response.body.data.receive;
    const recipientReceives = response.body.data.recipient[0].receives;

    cy.wrap(recipientReceives).as('recipientReceives');
    cy.log(`Receive: ${receive}`);
    cy.log(`Recipient Receives: ${recipientReceives}`);

    expect(receive).to.eq(recipientReceives); // Final comparison
  });

    /* ── Validate payment‑reason field ───────────────────────── */
    // 1️⃣ Ensure the field starts empty
    cy.get('.ant-select-selector')
      .eq(2)
      .should(($el) => {
        expect(
          $el.text().trim(),
          'reason field should start empty'
        ).to.equal('');
      })
      .click(); // open dropdown

    // 2️⃣ Pick a random option between 1 and 10
    cy.get('.ant-select-dropdown')
      .last()
      .find('.ant-select-item-option')
      .its('length')
      .then((total) => {
        const idx = Math.min(7, Cypress._.random(0, total - 1));
        cy.get('.ant-select-dropdown')
          .last()
          .find('.ant-select-item-option')
          .eq(idx)
          .click();
      });

    /* ── Validate recipient‑received amount ───────────────────── */
    cy.get(':nth-child(3) > :nth-child(2) > .ant-typography')
    .invoke('text')
    .then((uiText) => {
      const trimmedUiText = uiText.trim();
      cy.wrap(trimmedUiText).as('uiReceives');
    });

  // Compare UI vs API value
  cy.get('@recipientReceives').then((recipientReceives) => {
    cy.get('@uiReceives').then((uiReceives) => {
      cy.log(`UI: ${uiReceives}, API: ${recipientReceives}`);
      expect(uiReceives).to.eq(recipientReceives);
    });
  });


    // ─────────────── Confirmation Screens ───────────────
    cy.get('.ant-col > .ant-btn > span').should('be.visible').click();

  cy.get('.ant-modal-body > :nth-child(1) > .ant-col > .ant-typography')
    .should('be.visible')
    .and('contain.text', 'Payment Confirmation');

  cy.get('@recipientReceives').then((recipientReceives) => {
    cy.get(':nth-child(4) > .ant-col-8 > .ant-typography')
      .should('be.visible')
      .and('contain.text', recipientReceives);
  });

  // Pay recipient
  cy.get(
    '.ant-row-center.m-t-20 > .ant-col > .ant-space > :nth-child(2) > .ant-btn'
  )
    .should('be.visible')
    .click();

  cy.get('.ant-modal-body > :nth-child(1) > .ant-col')
    .should('be.visible')
    .and('contain.text', ' Payment Booked - ');

  cy.get('@recipientReceives').then((recipientReceives) => {
    cy.get(':nth-child(5) > .ant-col-8 > .ant-typography')
      .should('be.visible')
      .and('contain.text', recipientReceives);
  });
    })
    it('TC-AC-026 - Verify that if Currency= UGX and Country = UNITED KINGDOM & client = UK and check priority settlement is enabled and make a payment with GBP using Push Funds',function () {

    // ─────────────── Helpers ───────────────
    const normalizeAmount = (val) =>
      val.toString().replace(/,/g, '');

    // ─────────────── Setup & Recipient Creation ───────────────
    signin.Login(userName, password);
    newRecipient.goToPaymentsDashborad();
    newRecipient.gotoRecipientList();

    const email = batchPayments.generateRandomString(5) + '@yopmail.com';

    newRecipient.addRecipient('UNITED KINGDOM{enter}', 'UGX{enter}', email);
    newRecipient.addBankDetails('GB73BARC20039538243547', 'AFFLGB22');
    newRecipient.individualRecipient('UK UGX', 'UNITED KINGDOM{enter}');
    newRecipient.saveRecipient();
    newRecipient.checkSettelment('be.disabled', 'be.enabled');

    // ─────────────── Intercept Quote API (MUST BE BEFORE FLOW) ───────────────
    cy.intercept(
      'POST',
      '**/VolopaApiOauth2WebApp*/exchange/b2b/self/quote/temp'
    ).as('quoteApi');

    // ─────────────── Payment Flow ───────────────
    newPayment.proceedflow('{downarrow}{enter}', 'GBP');

    const amount = '10';
    newPayment.addrecipientDetail(amount, email);
    newPayment.selectFundingMethod('Push Funds');

    // ─────────────── API Validation ───────────────
    cy.wait('@quoteApi', { timeout: 20000 }).then(({ response }) => {
      const receive = response.body.data.receive;
      const recipientReceives = response.body.data.recipient[0].receives;

      cy.wrap(normalizeAmount(recipientReceives)).as('recipientReceives');

      expect(
        normalizeAmount(receive),
        'API receive vs recipient receives'
      ).to.eq(normalizeAmount(recipientReceives));
    });

    // ─────────────── Validate payment reason ───────────────
    cy.get('.ant-select-selector')
      .eq(2)
      .should(($el) => {
        expect($el.text().trim()).to.eq('');
      })
      .click();

    cy.get('.ant-select-dropdown')
      .last()
      .find('.ant-select-item-option')
      .its('length')
      .then((total) => {
        const idx = Math.min(7, Cypress._.random(0, total - 1));
        cy.get('.ant-select-dropdown')
          .last()
          .find('.ant-select-item-option')
          .eq(idx)
          .click();
      });

    // ─────────────── UI vs API Validation ───────────────
    cy.get(':nth-child(3) > :nth-child(2) > .ant-typography')
      .invoke('text')
      .then((uiText) => {
        cy.get('@recipientReceives').then((apiReceives) => {
          expect(
            normalizeAmount(uiText.trim()),
            'UI vs API recipient amount'
          ).to.eq(apiReceives);
        });
      });

    // ─────────────── Confirmation Screen ───────────────
    cy.get('.ant-col > .ant-btn > span').should('be.visible').click();

    cy.get('.ant-modal-body > :nth-child(1) > .ant-col > .ant-typography')
      .should('be.visible')
      .and('contain.text', 'Payment Confirmation');

    cy.get('@recipientReceives').then((apiReceives) => {
      cy.get(':nth-child(4) > .ant-col-8 > .ant-typography')
        .invoke('text')
        .then((uiText) => {
          expect(
            normalizeAmount(uiText.trim()),
            'Confirmation screen amount'
          ).to.eq(apiReceives);
        });
    });

    // ─────────────── Pay Recipient ───────────────
    cy.get(
      '.ant-row-center.m-t-20 > .ant-col > .ant-space > :nth-child(2) > .ant-btn'
    )
      .should('be.visible')
      .click();

    cy.get('.ant-modal-body > :nth-child(1) > .ant-col')
      .should('be.visible')
      .and('contain.text', ' Payment Booked - ');

    cy.get('@recipientReceives').then((apiReceives) => {
      cy.get(':nth-child(5) > .ant-col-8 > .ant-typography')
        .invoke('text')
        .then((uiText) => {
          expect(
            normalizeAmount(uiText.trim()),
            'Payment booked amount'
          ).to.eq(apiReceives);
        });
    });
  }
);

  it('TC-AC-027 - Verify that if Currency= UGX and Country = Uganda & client = UK and check priority settlement is enabled and make a payment with GBP using Push Funds', function () {

  // ─────────────── Setup & Recipient Creation ───────────────
  signin.Login(userName, password)
  newRecipient.goToPaymentsDashborad()
  newRecipient.gotoRecipientList()

  let email = batchPayments.generateRandomString(5) + '@yopmail.com'
  newRecipient.addRecipient('UGANDA{enter}', 'UGX{enter}', email)
  newRecipient.addBankDetailsWithAccNo('CCEIUGKA', '049712')
  newRecipient.individualRecipient('UGANDA UGX', 'UGANDA{enter}')
  newRecipient.saveRecipient()
  newRecipient.checkSettelment('be.disabled', 'be.enabled')
// ───── Intercept Quote API ─────
  cy.intercept(
    'POST',
    '**/VolopaApiOauth2WebApp*/exchange/b2b/self/quote/temp'
  ).as('quoteApi')
  // ─────────────── Payment Flow ───────────────
  newPayment.proceedflow('{downarrow}{enter}', 'GBP')
  const amount = '10'
  newPayment.addrecipientDetail(amount, email)
  newPayment.selectFundingMethod('Push Funds')

  const apiEnv = this.apiEnv
  const normalizeStr = (val) => val.replace(/,/g, '').trim()

  

  // ───── Wait for API and Compare API Values ─────
  cy.wait('@quoteApi').then(({ response }) => {
    const receive = response.body.data.receive
    const recipientReceives = response.body.data.recipient[0].receives

    cy.wrap(recipientReceives).as('recipientReceives')

    cy.log(`Receive: ${receive}`)
    cy.log(`Recipient Receives: ${recipientReceives}`)

    expect(normalizeStr(receive)).to.eq(normalizeStr(recipientReceives))
  })

  /* ── Validate payment-reason field ───────────────────────── */
  cy.get('.ant-select-selector')
    .eq(2)
    .should(($el) => {
      expect(
        $el.text().trim(),
        'reason field should start empty'
      ).to.equal('')
    })
    .click()

  cy.get('.ant-select-dropdown')
    .last()
    .find('.ant-select-item-option')
    .its('length')
    .then((total) => {
      const idx = Math.min(7, Cypress._.random(0, total - 1))
      cy.get('.ant-select-dropdown')
        .last()
        .find('.ant-select-item-option')
        .eq(idx)
        .click()
    })

  /* ── Validate recipient-received amount (UI vs API) ───────── */
  cy.get(':nth-child(3) > :nth-child(2) > .ant-typography')
    .invoke('text')
    .then((uiText) => {
      cy.wrap(uiText.trim()).as('uiReceives')
    })

  cy.get('@recipientReceives').then((recipientReceives) => {
    cy.get('@uiReceives').then((uiReceives) => {
      cy.log(`UI: ${uiReceives}, API: ${recipientReceives}`)
      expect(
        normalizeStr(uiReceives)
      ).to.eq(
        normalizeStr(recipientReceives)
      )
    })
  })

  // ─────────────── Confirmation Screens ───────────────
  cy.get('.ant-col > .ant-btn > span')
    .should('be.visible')
    .click()

  cy.get('.ant-modal-body > :nth-child(1) > .ant-col > .ant-typography')
    .should('be.visible')
    .and('contain.text', 'Payment Confirmation')

  cy.get('@recipientReceives').then((recipientReceives) => {
    cy.get(':nth-child(4) > .ant-col-8 > .ant-typography')
      .should('be.visible')
      .invoke('text')
      .then((uiText) => {
        expect(
          normalizeStr(uiText)
        ).to.eq(
          normalizeStr(recipientReceives)
        )
      })
  })

  // ─────────────── Pay Recipient ───────────────
  cy.get(
    '.ant-row-center.m-t-20 > .ant-col > .ant-space > :nth-child(2) > .ant-btn'
  )
    .should('be.visible')
    .click()

  cy.get('.ant-modal-body > :nth-child(1) > .ant-col')
    .should('be.visible')
    .and('contain.text', ' Payment Booked - ')

  cy.get('@recipientReceives').then((recipientReceives) => {
    cy.get(':nth-child(5) > .ant-col-8 > .ant-typography')
      .should('be.visible')
      .invoke('text')
      .then((uiText) => {
        expect(
          normalizeStr(uiText)
        ).to.eq(
          normalizeStr(recipientReceives)
        )
      })
  })

  })

    it('TC-AC-028 - Verify that if Currency= BHD and Country = UNITED KINGDOM & client = UK and check priority settlement is enabled and make a payment with GBP using Push Funds',function () {
    // ─────────────── Setup & Recipient Creation ───────────────
        signin.Login(userName, password)
        newRecipient.goToPaymentsDashborad()
        newRecipient.gotoRecipientList()
        let email = batchPayments.generateRandomString(5)+ '@yopmail.com'
        newRecipient.addRecipient('UNITED KINGDOM{enter}' ,'BHD{enter}',email)
        newRecipient.addBankDetails('GB73BARC20039538243547','AFFLGB22')
        newRecipient.individualRecipient('UK BHD','UNITED KINGDOM{enter}')
        newRecipient.saveRecipient()
        newRecipient.checkSettelment('be.disabled','be.enabled')

    // ─────────────── Payment Flow ───────────────
    newPayment.proceedflow('{downarrow}{enter}', 'GBP');
    const amount = '10';
    newPayment.addrecipientDetail(amount, email);
    newPayment.selectFundingMethod('Push Funds');
      const apiEnv = this.apiEnv;
    // ───── Intercept Quote API ─────
  cy.intercept(
  'POST',
  '**/VolopaApiOauth2WebApp*/exchange/b2b/self/quote/temp'
).as('quoteApi');

  // ───── Wait for API and Compare Values ─────
  cy.wait('@quoteApi').then(({ response }) => {
    const receive = response.body.data.receive;
    const recipientReceives = response.body.data.recipient[0].receives;

    cy.wrap(recipientReceives).as('recipientReceives');
    cy.log(`Receive: ${receive}`);
    cy.log(`Recipient Receives: ${recipientReceives}`);

    expect(receive).to.eq(recipientReceives); // Final comparison
  });

    /* ── Validate payment‑reason field ───────────────────────── */
    // 1️⃣ Ensure the field starts empty
    cy.get('.ant-select-selector')
      .eq(2)
      .should(($el) => {
        expect(
          $el.text().trim(),
          'reason field should start empty'
        ).to.equal('');
      })
      .click(); // open dropdown

    // 2️⃣ Pick a random option between 1 and 10
    cy.get('.ant-select-dropdown')
      .last()
      .find('.ant-select-item-option')
      .its('length')
      .then((total) => {
        const idx = Math.min(7, Cypress._.random(0, total - 1));
        cy.get('.ant-select-dropdown')
          .last()
          .find('.ant-select-item-option')
          .eq(idx)
          .click();
      });

    /* ── Validate recipient‑received amount ───────────────────── */
    cy.get(':nth-child(3) > :nth-child(2) > .ant-typography')
    .invoke('text')
    .then((uiText) => {
      const trimmedUiText = uiText.trim();
      cy.wrap(trimmedUiText).as('uiReceives');
    });

  // Compare UI vs API value
  cy.get('@recipientReceives').then((recipientReceives) => {
    cy.get('@uiReceives').then((uiReceives) => {
      cy.log(`UI: ${uiReceives}, API: ${recipientReceives}`);
      expect(uiReceives).to.eq(recipientReceives);
    });
  });


    // ─────────────── Confirmation Screens ───────────────
    cy.get('.ant-col > .ant-btn > span').should('be.visible').click();

  cy.get('.ant-modal-body > :nth-child(1) > .ant-col > .ant-typography')
    .should('be.visible')
    .and('contain.text', 'Payment Confirmation');

  cy.get('@recipientReceives').then((recipientReceives) => {
    cy.get(':nth-child(4) > .ant-col-8 > .ant-typography')
      .should('be.visible')
      .and('contain.text', recipientReceives);
  });

  // Pay recipient
  cy.get(
    '.ant-row-center.m-t-20 > .ant-col > .ant-space > :nth-child(2) > .ant-btn'
  )
    .should('be.visible')
    .click();

  cy.get('.ant-modal-body > :nth-child(1) > .ant-col')
    .should('be.visible')
    .and('contain.text', ' Payment Booked - ');

  cy.get('@recipientReceives').then((recipientReceives) => {
    cy.get(':nth-child(5) > .ant-col-8 > .ant-typography')
      .should('be.visible')
      .and('contain.text', recipientReceives);
  });
    })
    it('TC-AC-029 - Verify that if Currency= BHD and Country = Bahrain & client = UK and check priority settlement is enabled and make a payment with GBP using Push Funds',function () {
    // ─────────────── Setup & Recipient Creation ───────────────
        signin.Login(userName, password)
        newRecipient.goToPaymentsDashborad()
        newRecipient.gotoRecipientList()
        let email = batchPayments.generateRandomString(5)+ '@yopmail.com'
        newRecipient.addRecipient('BAHRAIN{enter}' ,'BHD{enter}',email)
        newRecipient.addBankDetails('BH67BMAG00001299123456','ABBGBHBM')
        newRecipient.individualRecipient('BAHRAIN BHD','BAHRAIN{enter}')
        newRecipient.saveRecipient()
        newRecipient.checkSettelment('be.disabled','be.enabled')

    // ─────────────── Payment Flow ───────────────
    newPayment.proceedflow('{downarrow}{enter}', 'GBP');
    const amount = '10';
    newPayment.addrecipientDetail(amount, email);
    newPayment.selectFundingMethod('Push Funds');
      const apiEnv = this.apiEnv;
    // ───── Intercept Quote API ─────
  cy.intercept(
  'POST',
  '**/VolopaApiOauth2WebApp*/exchange/b2b/self/quote/temp'
).as('quoteApi');

  // ───── Wait for API and Compare Values ─────
  cy.wait('@quoteApi').then(({ response }) => {
    const receive = response.body.data.receive;
    const recipientReceives = response.body.data.recipient[0].receives;

    cy.wrap(recipientReceives).as('recipientReceives');
    cy.log(`Receive: ${receive}`);
    cy.log(`Recipient Receives: ${recipientReceives}`);

    expect(receive).to.eq(recipientReceives); // Final comparison
  });

    /* ── Validate payment‑reason field ───────────────────────── */
    // 1️⃣ Ensure the field starts empty
    cy.get('.ant-select-selector')
      .eq(2)
      .should(($el) => {
        expect(
          $el.text().trim(),
          'reason field should start empty'
        ).to.equal('');
      })
      .click(); // open dropdown

    // 2️⃣ Pick a random option between 1 and 10
    cy.get('.ant-select-dropdown')
      .last()
      .find('.ant-select-item-option')
      .its('length')
      .then((total) => {
        const idx = Math.min(7, Cypress._.random(0, total - 1));
        cy.get('.ant-select-dropdown')
          .last()
          .find('.ant-select-item-option')
          .eq(idx)
          .click();
      });

    /* ── Validate recipient‑received amount ───────────────────── */
    cy.get(':nth-child(3) > :nth-child(2) > .ant-typography')
    .invoke('text')
    .then((uiText) => {
      const trimmedUiText = uiText.trim();
      cy.wrap(trimmedUiText).as('uiReceives');
    });

  // Compare UI vs API value
  cy.get('@recipientReceives').then((recipientReceives) => {
    cy.get('@uiReceives').then((uiReceives) => {
      cy.log(`UI: ${uiReceives}, API: ${recipientReceives}`);
      expect(uiReceives).to.eq(recipientReceives);
    });
  });


    // ─────────────── Confirmation Screens ───────────────
    cy.get('.ant-col > .ant-btn > span').should('be.visible').click();

  cy.get('.ant-modal-body > :nth-child(1) > .ant-col > .ant-typography')
    .should('be.visible')
    .and('contain.text', 'Payment Confirmation');

  cy.get('@recipientReceives').then((recipientReceives) => {
    cy.get(':nth-child(4) > .ant-col-8 > .ant-typography')
      .should('be.visible')
      .and('contain.text', recipientReceives);
  });

  // Pay recipient
  cy.get(
    '.ant-row-center.m-t-20 > .ant-col > .ant-space > :nth-child(2) > .ant-btn'
  )
    .should('be.visible')
    .click();

  cy.get('.ant-modal-body > :nth-child(1) > .ant-col')
    .should('be.visible')
    .and('contain.text', ' Payment Booked - ');

  cy.get('@recipientReceives').then((recipientReceives) => {
    cy.get(':nth-child(5) > .ant-col-8 > .ant-typography')
      .should('be.visible')
      .and('contain.text', recipientReceives);
  });
    })
    it('TC-AC-030 - Verify that if Currency= AED and Country = UNITED KINGDOM & client = UK and check priority settlement is enabled and make a payment with GBP using Push Funds',function () {
    // ─────────────── Setup & Recipient Creation ───────────────
        signin.Login(userName, password)
        newRecipient.goToPaymentsDashborad()
        newRecipient.gotoRecipientList()
        let email = batchPayments.generateRandomString(5)+ '@yopmail.com'
        newRecipient.addRecipient('UNITED KINGDOM{enter}' ,'AED{enter}',email)
        newRecipient.addBankDetails('GB73BARC20039538243547','AFFLGB22')
        newRecipient.individualRecipient('UK AED','UNITED KINGDOM{enter}')
        newRecipient.saveRecipient()
        newRecipient.checkSettelment('be.disabled','be.enabled')

    // ─────────────── Payment Flow ───────────────
    newPayment.proceedflow('{downarrow}{enter}', 'GBP');
    const amount = '10';
    newPayment.addrecipientDetail(amount, email);
    newPayment.selectFundingMethod('Push Funds');
      const apiEnv = this.apiEnv;
    // ───── Intercept Quote API ─────
  cy.intercept(
  'POST',
  '**/VolopaApiOauth2WebApp*/exchange/b2b/self/quote/temp'
).as('quoteApi');

  // ───── Wait for API and Compare Values ─────
  cy.wait('@quoteApi').then(({ response }) => {
    const receive = response.body.data.receive;
    const recipientReceives = response.body.data.recipient[0].receives;

    cy.wrap(recipientReceives).as('recipientReceives');
    cy.log(`Receive: ${receive}`);
    cy.log(`Recipient Receives: ${recipientReceives}`);

    expect(receive).to.eq(recipientReceives); // Final comparison
  });

    /* ── Validate payment‑reason field ───────────────────────── */
    // 1️⃣ Ensure the field starts empty
    cy.get('.ant-select-selector')
      .eq(2)
      .should(($el) => {
        expect(
          $el.text().trim(),
          'reason field should start empty'
        ).to.equal('');
      })
      .click(); // open dropdown

    // 2️⃣ Pick a random option between 1 and 10
    cy.get('.ant-select-dropdown')
      .last()
      .find('.ant-select-item-option')
      .its('length')
      .then((total) => {
        const idx = Math.min(7, Cypress._.random(0, total - 1));
        cy.get('.ant-select-dropdown')
          .last()
          .find('.ant-select-item-option')
          .eq(idx)
          .click();
      });

    /* ── Validate recipient‑received amount ───────────────────── */
    cy.get(':nth-child(3) > :nth-child(2) > .ant-typography')
    .invoke('text')
    .then((uiText) => {
      const trimmedUiText = uiText.trim();
      cy.wrap(trimmedUiText).as('uiReceives');
    });

  // Compare UI vs API value
  cy.get('@recipientReceives').then((recipientReceives) => {
    cy.get('@uiReceives').then((uiReceives) => {
      cy.log(`UI: ${uiReceives}, API: ${recipientReceives}`);
      expect(uiReceives).to.eq(recipientReceives);
    });
  });


    // ─────────────── Confirmation Screens ───────────────
    cy.get('.ant-col > .ant-btn > span').should('be.visible').click();

  cy.get('.ant-modal-body > :nth-child(1) > .ant-col > .ant-typography')
    .should('be.visible')
    .and('contain.text', 'Payment Confirmation');

  cy.get('@recipientReceives').then((recipientReceives) => {
    cy.get(':nth-child(4) > .ant-col-8 > .ant-typography')
      .should('be.visible')
      .and('contain.text', recipientReceives);
  });

  // Pay recipient
  cy.get(
    '.ant-row-center.m-t-20 > .ant-col > .ant-space > :nth-child(2) > .ant-btn'
  )
    .should('be.visible')
    .click();

  cy.get('.ant-modal-body > :nth-child(1) > .ant-col')
    .should('be.visible')
    .and('contain.text', ' Payment Booked - ');

  cy.get('@recipientReceives').then((recipientReceives) => {
    cy.get(':nth-child(5) > .ant-col-8 > .ant-typography')
      .should('be.visible')
      .and('contain.text', recipientReceives);
  });
    })
    it('TC-AC-031 - Verify that if Currency= AED and Country = UNITED ARAB EMIRATES & client = UK and check priority settlement is enabled and make a payment with GBP using Push Funds',function () {
    // ─────────────── Setup & Recipient Creation ───────────────
        signin.Login(userName, password)
        newRecipient.goToPaymentsDashborad()
        newRecipient.gotoRecipientList()
        let email = batchPayments.generateRandomString(5)+ '@yopmail.com'
        newRecipient.addRecipient('UNITED ARAB EMIRATES{enter}' ,'AED{enter}',email)
        newRecipient.addBankDetails('AE070331234567890123456','AARPAEAA')
        newRecipient.individualRecipient('United Arab Emirates AED','UNITED ARAB EMIRATES{enter}')
        newRecipient.saveRecipient()
        newRecipient.checkSettelment('be.disabled','be.enabled')

    // ─────────────── Payment Flow ───────────────
    newPayment.proceedflow('{downarrow}{enter}', 'GBP');
    const amount = '10';
    newPayment.addrecipientDetail(amount, email);
    newPayment.selectFundingMethod('Push Funds');
      const apiEnv = this.apiEnv;
    // ───── Intercept Quote API ─────
  cy.intercept(
  'POST',
  '**/VolopaApiOauth2WebApp*/exchange/b2b/self/quote/temp'
).as('quoteApi');

  // ───── Wait for API and Compare Values ─────
  cy.wait('@quoteApi').then(({ response }) => {
    const receive = response.body.data.receive;
    const recipientReceives = response.body.data.recipient[0].receives;

    cy.wrap(recipientReceives).as('recipientReceives');
    cy.log(`Receive: ${receive}`);
    cy.log(`Recipient Receives: ${recipientReceives}`);

    expect(receive).to.eq(recipientReceives); // Final comparison
  });

    /* ── Validate payment‑reason field ───────────────────────── */
    // 1️⃣ Ensure the field starts empty
    cy.get('.ant-select-selector')
      .eq(2)
      .should(($el) => {
        expect(
          $el.text().trim(),
          'reason field should start empty'
        ).to.equal('');
      })
      .click(); // open dropdown

    // 2️⃣ Pick a random option between 1 and 10
    cy.get('.ant-select-dropdown')
      .last()
      .find('.ant-select-item-option')
      .its('length')
      .then((total) => {
        const idx = Math.min(7, Cypress._.random(0, total - 1));
        cy.get('.ant-select-dropdown')
          .last()
          .find('.ant-select-item-option')
          .eq(idx)
          .click();
      });

    /* ── Validate recipient‑received amount ───────────────────── */
    cy.get(':nth-child(3) > :nth-child(2) > .ant-typography')
    .invoke('text')
    .then((uiText) => {
      const trimmedUiText = uiText.trim();
      cy.wrap(trimmedUiText).as('uiReceives');
    });

  // Compare UI vs API value
  cy.get('@recipientReceives').then((recipientReceives) => {
    cy.get('@uiReceives').then((uiReceives) => {
      cy.log(`UI: ${uiReceives}, API: ${recipientReceives}`);
      expect(uiReceives).to.eq(recipientReceives);
    });
  });


    // ─────────────── Confirmation Screens ───────────────
    cy.get('.ant-col > .ant-btn > span').should('be.visible').click();

  cy.get('.ant-modal-body > :nth-child(1) > .ant-col > .ant-typography')
    .should('be.visible')
    .and('contain.text', 'Payment Confirmation');

  cy.get('@recipientReceives').then((recipientReceives) => {
    cy.get(':nth-child(4) > .ant-col-8 > .ant-typography')
      .should('be.visible')
      .and('contain.text', recipientReceives);
  });

  // Pay recipient
  cy.get(
    '.ant-row-center.m-t-20 > .ant-col > .ant-space > :nth-child(2) > .ant-btn'
  )
    .should('be.visible')
    .click();

  cy.get('.ant-modal-body > :nth-child(1) > .ant-col')
    .should('be.visible')
    .and('contain.text', ' Payment Booked - ');

  cy.get('@recipientReceives').then((recipientReceives) => {
    cy.get(':nth-child(5) > .ant-col-8 > .ant-typography')
      .should('be.visible')
      .and('contain.text', recipientReceives);
  });
    })
    it('TC-AC-032 - Verify that if Currency= INR and Country = INDIA current & client = UK and check priority settlement is enabled and make a payment with GBP using Push Funds',function () {
    // ─────────────── Setup & Recipient Creation ───────────────
        signin.Login(userName, password)
        newRecipient.goToPaymentsDashborad()
        newRecipient.gotoRecipientList()
        let email = batchPayments.generateRandomString(5)+ '@yopmail.com'
        newRecipient.addRecipient('INDIA{downarrow}{enter}' ,'INR{enter}',email)
        newRecipient.addIndiaBankDetail()
        newRecipient.indiaAccountType('current{enter}')
        newRecipient.individualRecipient('India INR Current','INDIA{downarrow}{enter}')
        newRecipient.saveRecipient()
        newRecipient.checkSettelment('be.enabled','be.disabled')

    // ─────────────── Payment Flow ───────────────
    newPayment.proceedflow('{downarrow}{enter}', 'GBP');
    const amount = '10';
    newPayment.addrecipientDetail(amount, email);
    newPayment.selectFundingMethod('Push Funds');
      const apiEnv = this.apiEnv;
    // ───── Intercept Quote API ─────
  cy.intercept(
  'POST',
  '**/VolopaApiOauth2WebApp*/exchange/b2b/self/quote/temp'
).as('quoteApi');

  // ───── Wait for API and Compare Values ─────
  cy.wait('@quoteApi').then(({ response }) => {
    const receive = response.body.data.receive;
    const recipientReceives = response.body.data.recipient[0].receives;

    cy.wrap(recipientReceives).as('recipientReceives');
    cy.log(`Receive: ${receive}`);
    cy.log(`Recipient Receives: ${recipientReceives}`);

    expect(receive).to.eq(recipientReceives); // Final comparison
  });

    /* ── Validate payment‑reason field ───────────────────────── */
    // 1️⃣ Ensure the field starts empty
    cy.get('.ant-select-selector')
      .eq(2)
      .should(($el) => {
        expect(
          $el.text().trim(),
          'reason field should start empty'
        ).to.equal('');
      })
      .click(); // open dropdown

    // 2️⃣ Pick a random option between 1 and 10
    cy.get('.ant-select-dropdown')
      .last()
      .find('.ant-select-item-option')
      .its('length')
      .then((total) => {
        const idx = Math.min(7, Cypress._.random(0, total - 1));
        cy.get('.ant-select-dropdown')
          .last()
          .find('.ant-select-item-option')
          .eq(idx)
          .click();
      });

    /* ── Validate recipient‑received amount ───────────────────── */
    cy.get(':nth-child(3) > :nth-child(2) > .ant-typography')
    .invoke('text')
    .then((uiText) => {
      const trimmedUiText = uiText.trim();
      cy.wrap(trimmedUiText).as('uiReceives');
    });

  // Compare UI vs API value
  cy.get('@recipientReceives').then((recipientReceives) => {
    cy.get('@uiReceives').then((uiReceives) => {
      cy.log(`UI: ${uiReceives}, API: ${recipientReceives}`);
      expect(uiReceives).to.eq(recipientReceives);
    });
  });


    // ─────────────── Confirmation Screens ───────────────
    cy.get('.ant-col > .ant-btn > span').should('be.visible').click();

  cy.get('.ant-modal-body > :nth-child(1) > .ant-col > .ant-typography')
    .should('be.visible')
    .and('contain.text', 'Payment Confirmation');

  cy.get('@recipientReceives').then((recipientReceives) => {
    cy.get(':nth-child(4) > .ant-col-8 > .ant-typography')
      .should('be.visible')
      .and('contain.text', recipientReceives);
  });

  // Pay recipient
  cy.get(
    '.ant-row-center.m-t-20 > .ant-col > .ant-space > :nth-child(2) > .ant-btn'
  )
    .should('be.visible')
    .click();

  cy.get('.ant-modal-body > :nth-child(1) > .ant-col')
    .should('be.visible')
    .and('contain.text', ' Payment Booked - ');

  cy.get('@recipientReceives').then((recipientReceives) => {
    cy.get(':nth-child(5) > .ant-col-8 > .ant-typography')
      .should('be.visible')
      .and('contain.text', recipientReceives);
  });
    })
    it('TC-AC-033 - Verify that if Currency= INR and Country = INDIA Saving & client = UK and check priority settlement is enabled and make a payment with GBP using Push Funds',function () {
    // ─────────────── Setup & Recipient Creation ───────────────
        signin.Login(userName, password)
        newRecipient.goToPaymentsDashborad()
        newRecipient.gotoRecipientList()
        let email = batchPayments.generateRandomString(5)+ '@yopmail.com'
        newRecipient.addRecipient('INDIA{downarrow}{enter}' ,'INR{enter}',email)
        newRecipient.addIndiaBankDetail()
        newRecipient.indiaAccountType('Saving{enter}')
        newRecipient.individualRecipient('India INR Saving','INDIA{downarrow}{enter}')
        newRecipient.saveRecipient()
        newRecipient.checkSettelment('be.enabled','be.disabled')

    // ─────────────── Payment Flow ───────────────
    newPayment.proceedflow('{downarrow}{enter}', 'GBP');
    const amount = '10';
    newPayment.addrecipientDetail(amount, email);
    newPayment.selectFundingMethod('Push Funds');
      const apiEnv = this.apiEnv;
    // ───── Intercept Quote API ─────
  cy.intercept(
  'POST',
  '**/VolopaApiOauth2WebApp*/exchange/b2b/self/quote/temp'
).as('quoteApi');

  // ───── Wait for API and Compare Values ─────
  cy.wait('@quoteApi').then(({ response }) => {
    const receive = response.body.data.receive;
    const recipientReceives = response.body.data.recipient[0].receives;

    cy.wrap(recipientReceives).as('recipientReceives');
    cy.log(`Receive: ${receive}`);
    cy.log(`Recipient Receives: ${recipientReceives}`);

    expect(receive).to.eq(recipientReceives); // Final comparison
  });

    /* ── Validate payment‑reason field ───────────────────────── */
    // 1️⃣ Ensure the field starts empty
    cy.get('.ant-select-selector')
      .eq(2)
      .should(($el) => {
        expect(
          $el.text().trim(),
          'reason field should start empty'
        ).to.equal('');
      })
      .click(); // open dropdown

    // 2️⃣ Pick a random option between 1 and 10
    cy.get('.ant-select-dropdown')
      .last()
      .find('.ant-select-item-option')
      .its('length')
      .then((total) => {
        const idx = Math.min(7, Cypress._.random(0, total - 1));
        cy.get('.ant-select-dropdown')
          .last()
          .find('.ant-select-item-option')
          .eq(idx)
          .click();
      });

    /* ── Validate recipient‑received amount ───────────────────── */
    cy.get(':nth-child(3) > :nth-child(2) > .ant-typography')
    .invoke('text')
    .then((uiText) => {
      const trimmedUiText = uiText.trim();
      cy.wrap(trimmedUiText).as('uiReceives');
    });

  // Compare UI vs API value
  cy.get('@recipientReceives').then((recipientReceives) => {
    cy.get('@uiReceives').then((uiReceives) => {
      cy.log(`UI: ${uiReceives}, API: ${recipientReceives}`);
      expect(uiReceives).to.eq(recipientReceives);
    });
  });


    // ─────────────── Confirmation Screens ───────────────
    cy.get('.ant-col > .ant-btn > span').should('be.visible').click();

  cy.get('.ant-modal-body > :nth-child(1) > .ant-col > .ant-typography')
    .should('be.visible')
    .and('contain.text', 'Payment Confirmation');

  cy.get('@recipientReceives').then((recipientReceives) => {
    cy.get(':nth-child(4) > .ant-col-8 > .ant-typography')
      .should('be.visible')
      .and('contain.text', recipientReceives);
  });

  // Pay recipient
  cy.get(
    '.ant-row-center.m-t-20 > .ant-col > .ant-space > :nth-child(2) > .ant-btn'
  )
    .should('be.visible')
    .click();

  cy.get('.ant-modal-body > :nth-child(1) > .ant-col')
    .should('be.visible')
    .and('contain.text', ' Payment Booked - ');

  cy.get('@recipientReceives').then((recipientReceives) => {
    cy.get(':nth-child(5) > .ant-col-8 > .ant-typography')
      .should('be.visible')
      .and('contain.text', recipientReceives);
  });
    })
    it('TC-AC-034 - Verify that if Currency= NZD and Country = UNITED KINGDOM & client = UK and check priority settlement is enabled and make a payment with GBP using Push Funds',function () {
    // ─────────────── Setup & Recipient Creation ───────────────
        signin.Login(userName, password)
        newRecipient.goToPaymentsDashborad()
        newRecipient.gotoRecipientList()
        let email = batchPayments.generateRandomString(5)+ '@yopmail.com'
        newRecipient.addRecipient('UNITED KINGDOM{enter}' ,'NZD{enter}',email)
        newRecipient.addBankDetails('GB73BARC20039538243547','AFFLGB22')
        newRecipient.individualRecipient('UK NZD','UNITED KINGDOM{enter}')
        newRecipient.saveRecipient()
        newRecipient.checkSettelment('be.disabled','be.enabled')

    // ─────────────── Payment Flow ───────────────
    newPayment.proceedflow('{downarrow}{enter}', 'GBP');
    const amount = '10';
    newPayment.addrecipientDetail(amount, email);
    newPayment.selectFundingMethod('Push Funds');
      const apiEnv = this.apiEnv;
    // ───── Intercept Quote API ─────
  cy.intercept(
  'POST',
  '**/VolopaApiOauth2WebApp*/exchange/b2b/self/quote/temp'
).as('quoteApi');

  // ───── Wait for API and Compare Values ─────
  cy.wait('@quoteApi').then(({ response }) => {
    const receive = response.body.data.receive;
    const recipientReceives = response.body.data.recipient[0].receives;

    cy.wrap(recipientReceives).as('recipientReceives');
    cy.log(`Receive: ${receive}`);
    cy.log(`Recipient Receives: ${recipientReceives}`);

    expect(receive).to.eq(recipientReceives); // Final comparison
  });

    /* ── Validate payment‑reason field ───────────────────────── */
    // 1️⃣ Ensure the field starts empty
    cy.get('.ant-select-selector')
      .eq(2)
      .should(($el) => {
        expect(
          $el.text().trim(),
          'reason field should start empty'
        ).to.equal('');
      })
      .click(); // open dropdown

    // 2️⃣ Pick a random option between 1 and 10
    cy.get('.ant-select-dropdown')
      .last()
      .find('.ant-select-item-option')
      .its('length')
      .then((total) => {
        const idx = Math.min(7, Cypress._.random(0, total - 1));
        cy.get('.ant-select-dropdown')
          .last()
          .find('.ant-select-item-option')
          .eq(idx)
          .click();
      });

    /* ── Validate recipient‑received amount ───────────────────── */
    cy.get(':nth-child(3) > :nth-child(2) > .ant-typography')
    .invoke('text')
    .then((uiText) => {
      const trimmedUiText = uiText.trim();
      cy.wrap(trimmedUiText).as('uiReceives');
    });

  // Compare UI vs API value
  cy.get('@recipientReceives').then((recipientReceives) => {
    cy.get('@uiReceives').then((uiReceives) => {
      cy.log(`UI: ${uiReceives}, API: ${recipientReceives}`);
      expect(uiReceives).to.eq(recipientReceives);
    });
  });


    // ─────────────── Confirmation Screens ───────────────
    cy.get('.ant-col > .ant-btn > span').should('be.visible').click();

  cy.get('.ant-modal-body > :nth-child(1) > .ant-col > .ant-typography')
    .should('be.visible')
    .and('contain.text', 'Payment Confirmation');

  cy.get('@recipientReceives').then((recipientReceives) => {
    cy.get(':nth-child(4) > .ant-col-8 > .ant-typography')
      .should('be.visible')
      .and('contain.text', recipientReceives);
  });

  // Pay recipient
  cy.get(
    '.ant-row-center.m-t-20 > .ant-col > .ant-space > :nth-child(2) > .ant-btn'
  )
    .should('be.visible')
    .click();

  cy.get('.ant-modal-body > :nth-child(1) > .ant-col')
    .should('be.visible')
    .and('contain.text', ' Payment Booked - ');

  cy.get('@recipientReceives').then((recipientReceives) => {
    cy.get(':nth-child(5) > .ant-col-8 > .ant-typography')
      .should('be.visible')
      .and('contain.text', recipientReceives);
  });
    })
    xit('TC-AC-035 - Verify that if Currency= NZD and Country = New Zealand & client = UK and check priority settlement is enabled and make a payment with GBP using Push Funds',function () {
    // ─────────────── Setup & Recipient Creation ───────────────
        signin.Login(userName, password)
        newRecipient.goToPaymentsDashborad()
        newRecipient.gotoRecipientList()
        let email = batchPayments.generateRandomString(5)+ '@yopmail.com'
        newRecipient.addRecipient('New Zealand{enter}' ,'NZD{enter}',email)
        newRecipient.addBankDetailsWithAccNo('BKNZNZ22','049712')
        cy.get('#bsb').should('be.visible').type('739629')
        newRecipient.individualRecipient('New Zealand NZD','New Zealand{enter}')
        newRecipient.saveRecipient()
        newRecipient.checkSettelment('be.disabled','be.enabled')

    // ─────────────── Payment Flow ───────────────
    newPayment.proceedflow('{downarrow}{enter}', 'GBP');
    const amount = '10';
    newPayment.addrecipientDetail(amount, email);
    newPayment.selectFundingMethod('Push Funds');
      const apiEnv = this.apiEnv;
    // ───── Intercept Quote API ─────
  cy.intercept(
  'POST',
  '**/VolopaApiOauth2WebApp*/exchange/b2b/self/quote/temp'
).as('quoteApi');

  // ───── Wait for API and Compare Values ─────
  cy.wait('@quoteApi').then(({ response }) => {
    const receive = response.body.data.receive;
    const recipientReceives = response.body.data.recipient[0].receives;

    cy.wrap(recipientReceives).as('recipientReceives');
    cy.log(`Receive: ${receive}`);
    cy.log(`Recipient Receives: ${recipientReceives}`);

    expect(receive).to.eq(recipientReceives); // Final comparison
  });

    /* ── Validate payment‑reason field ───────────────────────── */
    // 1️⃣ Ensure the field starts empty
    cy.get('.ant-select-selector')
      .eq(2)
      .should(($el) => {
        expect(
          $el.text().trim(),
          'reason field should start empty'
        ).to.equal('');
      })
      .click(); // open dropdown

    // 2️⃣ Pick a random option between 1 and 10
    cy.get('.ant-select-dropdown')
      .last()
      .find('.ant-select-item-option')
      .its('length')
      .then((total) => {
        const idx = Math.min(7, Cypress._.random(0, total - 1));
        cy.get('.ant-select-dropdown')
          .last()
          .find('.ant-select-item-option')
          .eq(idx)
          .click();
      });

    /* ── Validate recipient‑received amount ───────────────────── */
    cy.get(':nth-child(3) > :nth-child(2) > .ant-typography')
    .invoke('text')
    .then((uiText) => {
      const trimmedUiText = uiText.trim();
      cy.wrap(trimmedUiText).as('uiReceives');
    });

  // Compare UI vs API value
  cy.get('@recipientReceives').then((recipientReceives) => {
    cy.get('@uiReceives').then((uiReceives) => {
      cy.log(`UI: ${uiReceives}, API: ${recipientReceives}`);
      expect(uiReceives).to.eq(recipientReceives);
    });
  });


    // ─────────────── Confirmation Screens ───────────────
    cy.get('.ant-col > .ant-btn > span').should('be.visible').click();

  cy.get('.ant-modal-body > :nth-child(1) > .ant-col > .ant-typography')
    .should('be.visible')
    .and('contain.text', 'Payment Confirmation');

  cy.get('@recipientReceives').then((recipientReceives) => {
    cy.get(':nth-child(4) > .ant-col-8 > .ant-typography')
      .should('be.visible')
      .and('contain.text', recipientReceives);
  });

  // Pay recipient
  cy.get(
    '.ant-row-center.m-t-20 > .ant-col > .ant-space > :nth-child(2) > .ant-btn'
  )
    .should('be.visible')
    .click();

  cy.get('.ant-modal-body > :nth-child(1) > .ant-col')
    .should('be.visible')
    .and('contain.text', ' Payment Booked - ');

  cy.get('@recipientReceives').then((recipientReceives) => {
    cy.get(':nth-child(5) > .ant-col-8 > .ant-typography')
      .should('be.visible')
      .and('contain.text', recipientReceives);
  });
    })
    it('TC-AC-036 - Verify that if Currency= ZAR and Country = UNITED KINGDOM & client = UK and check priority settlement is enabled and make a payment with GBP using Push Funds',function () {
    // ─────────────── Setup & Recipient Creation ───────────────
        signin.Login(userName, password)
        newRecipient.goToPaymentsDashborad()
        newRecipient.gotoRecipientList()
        let email = batchPayments.generateRandomString(5)+ '@yopmail.com'
        newRecipient.addRecipient('UNITED KINGDOM{enter}' ,'ZAR{enter}',email)
        newRecipient.addBankDetails('GB73BARC20039538243547','AFFLGB22')
        newRecipient.individualRecipient('UK ZAR','UNITED KINGDOM{enter}')
        newRecipient.saveRecipient()
        newRecipient.checkSettelment('be.disabled','be.enabled')

    // ─────────────── Payment Flow ───────────────
    newPayment.proceedflow('{downarrow}{enter}', 'GBP');
    const amount = '10';
    newPayment.addrecipientDetail(amount, email);
    newPayment.selectFundingMethod('Push Funds');
      const apiEnv = this.apiEnv;
    // ───── Intercept Quote API ─────
  cy.intercept(
  'POST',
  '**/VolopaApiOauth2WebApp*/exchange/b2b/self/quote/temp'
).as('quoteApi');

  // ───── Wait for API and Compare Values ─────
  cy.wait('@quoteApi').then(({ response }) => {
    const receive = response.body.data.receive;
    const recipientReceives = response.body.data.recipient[0].receives;

    cy.wrap(recipientReceives).as('recipientReceives');
    cy.log(`Receive: ${receive}`);
    cy.log(`Recipient Receives: ${recipientReceives}`);

    expect(receive).to.eq(recipientReceives); // Final comparison
  });

    /* ── Validate payment‑reason field ───────────────────────── */
    // 1️⃣ Ensure the field starts empty
    cy.get('.ant-select-selector')
      .eq(2)
      .should(($el) => {
        expect(
          $el.text().trim(),
          'reason field should start empty'
        ).to.equal('');
      })
      .click(); // open dropdown

    // 2️⃣ Pick a random option between 1 and 10
    cy.get('.ant-select-dropdown')
      .last()
      .find('.ant-select-item-option')
      .its('length')
      .then((total) => {
        const idx = Math.min(7, Cypress._.random(0, total - 1));
        cy.get('.ant-select-dropdown')
          .last()
          .find('.ant-select-item-option')
          .eq(idx)
          .click();
      });

    /* ── Validate recipient‑received amount ───────────────────── */
    cy.get(':nth-child(3) > :nth-child(2) > .ant-typography')
    .invoke('text')
    .then((uiText) => {
      const trimmedUiText = uiText.trim();
      cy.wrap(trimmedUiText).as('uiReceives');
    });

  // Compare UI vs API value
  cy.get('@recipientReceives').then((recipientReceives) => {
    cy.get('@uiReceives').then((uiReceives) => {
      cy.log(`UI: ${uiReceives}, API: ${recipientReceives}`);
      expect(uiReceives).to.eq(recipientReceives);
    });
  });


    // ─────────────── Confirmation Screens ───────────────
    cy.get('.ant-col > .ant-btn > span').should('be.visible').click();

  cy.get('.ant-modal-body > :nth-child(1) > .ant-col > .ant-typography')
    .should('be.visible')
    .and('contain.text', 'Payment Confirmation');

  cy.get('@recipientReceives').then((recipientReceives) => {
    cy.get(':nth-child(4) > .ant-col-8 > .ant-typography')
      .should('be.visible')
      .and('contain.text', recipientReceives);
  });

  // Pay recipient
  cy.get(
    '.ant-row-center.m-t-20 > .ant-col > .ant-space > :nth-child(2) > .ant-btn'
  )
    .should('be.visible')
    .click();

  cy.get('.ant-modal-body > :nth-child(1) > .ant-col')
    .should('be.visible')
    .and('contain.text', ' Payment Booked - ');

  cy.get('@recipientReceives').then((recipientReceives) => {
    cy.get(':nth-child(5) > .ant-col-8 > .ant-typography')
      .should('be.visible')
      .and('contain.text', recipientReceives);
  });
    })
    it('TC-AC-037 - Verify that if Currency= ZAR and Country = South Africa & client = UK and check priority settlement is enabled and make a payment with GBP using Push Funds',function () {
    // ─────────────── Setup & Recipient Creation ───────────────
        signin.Login(userName, password)
        newRecipient.goToPaymentsDashborad()
        newRecipient.gotoRecipientList()
        let email = batchPayments.generateRandomString(5)+ '@yopmail.com'
        newRecipient.addRecipient('South Africa{enter}' ,'ZAR{enter}',email)
        newRecipient.addBankDetailsWithAccNo('SARBZAJ6XXX','049712')
        cy.get('#branch_code').should('be.visible').type('755026')
        cy.get('#bankBranch').should('be.visible').type('City branch')
        newRecipient.individualRecipient('South Africa ZAR','South Africa{enter}')
        newRecipient.saveRecipient()
        newRecipient.checkSettelment('be.disabled','be.enabled')

    // ─────────────── Payment Flow ───────────────
    newPayment.proceedflow('{downarrow}{enter}', 'GBP');
    const amount = '10';
    newPayment.addrecipientDetail(amount, email);
    newPayment.selectFundingMethod('Push Funds');
      const apiEnv = this.apiEnv;
    // ───── Intercept Quote API ─────
  cy.intercept(
  'POST',
  '**/VolopaApiOauth2WebApp*/exchange/b2b/self/quote/temp'
).as('quoteApi');

  // ───── Wait for API and Compare Values ─────
  cy.wait('@quoteApi').then(({ response }) => {
    const receive = response.body.data.receive;
    const recipientReceives = response.body.data.recipient[0].receives;

    cy.wrap(recipientReceives).as('recipientReceives');
    cy.log(`Receive: ${receive}`);
    cy.log(`Recipient Receives: ${recipientReceives}`);

    expect(receive).to.eq(recipientReceives); // Final comparison
  });

    /* ── Validate payment‑reason field ───────────────────────── */
    // 1️⃣ Ensure the field starts empty
    cy.get('.ant-select-selector')
      .eq(2)
      .should(($el) => {
        expect(
          $el.text().trim(),
          'reason field should start empty'
        ).to.equal('');
      })
      .click(); // open dropdown

    // 2️⃣ Pick a random option between 1 and 10
    cy.get('.ant-select-dropdown')
      .last()
      .find('.ant-select-item-option')
      .its('length')
      .then((total) => {
        const idx = Math.min(7, Cypress._.random(0, total - 1));
        cy.get('.ant-select-dropdown')
          .last()
          .find('.ant-select-item-option')
          .eq(idx)
          .click();
      });

    /* ── Validate recipient‑received amount ───────────────────── */
    cy.get(':nth-child(3) > :nth-child(2) > .ant-typography')
    .invoke('text')
    .then((uiText) => {
      const trimmedUiText = uiText.trim();
      cy.wrap(trimmedUiText).as('uiReceives');
    });

  // Compare UI vs API value
  cy.get('@recipientReceives').then((recipientReceives) => {
    cy.get('@uiReceives').then((uiReceives) => {
      cy.log(`UI: ${uiReceives}, API: ${recipientReceives}`);
      expect(uiReceives).to.eq(recipientReceives);
    });
  });


    // ─────────────── Confirmation Screens ───────────────
    cy.get('.ant-col > .ant-btn > span').should('be.visible').click();

  cy.get('.ant-modal-body > :nth-child(1) > .ant-col > .ant-typography')
    .should('be.visible')
    .and('contain.text', 'Payment Confirmation');

  cy.get('@recipientReceives').then((recipientReceives) => {
    cy.get(':nth-child(4) > .ant-col-8 > .ant-typography')
      .should('be.visible')
      .and('contain.text', recipientReceives);
  });

  // Pay recipient
  cy.get(
    '.ant-row-center.m-t-20 > .ant-col > .ant-space > :nth-child(2) > .ant-btn'
  )
    .should('be.visible')
    .click();

  cy.get('.ant-modal-body > :nth-child(1) > .ant-col')
    .should('be.visible')
    .and('contain.text', ' Payment Booked - ');

  cy.get('@recipientReceives').then((recipientReceives) => {
    cy.get(':nth-child(5) > .ant-col-8 > .ant-typography')
      .should('be.visible')
      .and('contain.text', recipientReceives);
  });
    })
    it('TC-AC-038 - Verify that if Currency= PLN and Country = UNITED KINGDOM & client = UK and check priority settlement is enabled and make a payment with GBP using Push Funds',function () {
    // ─────────────── Setup & Recipient Creation ───────────────
        signin.Login(userName, password)
        newRecipient.goToPaymentsDashborad()
        newRecipient.gotoRecipientList()
        let email = batchPayments.generateRandomString(5)+ '@yopmail.com'
        newRecipient.addRecipient('UNITED KINGDOM{enter}' ,'PLN{enter}',email)
        newRecipient.addBankDetails('GB73BARC20039538243547','AFFLGB22')
        newRecipient.individualRecipient('UK PLN','UNITED KINGDOM{enter}')
        newRecipient.saveRecipient()
        newRecipient.checkSettelment('be.disabled','be.enabled')

    // ─────────────── Payment Flow ───────────────
    newPayment.proceedflow('{downarrow}{enter}', 'GBP');
    const amount = '10';
    newPayment.addrecipientDetail(amount, email);
    newPayment.selectFundingMethod('Push Funds');
      const apiEnv = this.apiEnv;
    // ───── Intercept Quote API ─────
  cy.intercept(
  'POST',
  '**/VolopaApiOauth2WebApp*/exchange/b2b/self/quote/temp'
).as('quoteApi');

  // ───── Wait for API and Compare Values ─────
  cy.wait('@quoteApi').then(({ response }) => {
    const receive = response.body.data.receive;
    const recipientReceives = response.body.data.recipient[0].receives;

    cy.wrap(recipientReceives).as('recipientReceives');
    cy.log(`Receive: ${receive}`);
    cy.log(`Recipient Receives: ${recipientReceives}`);

    expect(receive).to.eq(recipientReceives); // Final comparison
  });

    /* ── Validate payment‑reason field ───────────────────────── */
    // 1️⃣ Ensure the field starts empty
    cy.get('.ant-select-selector')
      .eq(2)
      .should(($el) => {
        expect(
          $el.text().trim(),
          'reason field should start empty'
        ).to.equal('');
      })
      .click(); // open dropdown

    // 2️⃣ Pick a random option between 1 and 10
    cy.get('.ant-select-dropdown')
      .last()
      .find('.ant-select-item-option')
      .its('length')
      .then((total) => {
        const idx = Math.min(7, Cypress._.random(0, total - 1));
        cy.get('.ant-select-dropdown')
          .last()
          .find('.ant-select-item-option')
          .eq(idx)
          .click();
      });

    /* ── Validate recipient‑received amount ───────────────────── */
    cy.get(':nth-child(3) > :nth-child(2) > .ant-typography')
    .invoke('text')
    .then((uiText) => {
      const trimmedUiText = uiText.trim();
      cy.wrap(trimmedUiText).as('uiReceives');
    });

  // Compare UI vs API value
  cy.get('@recipientReceives').then((recipientReceives) => {
    cy.get('@uiReceives').then((uiReceives) => {
      cy.log(`UI: ${uiReceives}, API: ${recipientReceives}`);
      expect(uiReceives).to.eq(recipientReceives);
    });
  });


    // ─────────────── Confirmation Screens ───────────────
    cy.get('.ant-col > .ant-btn > span').should('be.visible').click();

  cy.get('.ant-modal-body > :nth-child(1) > .ant-col > .ant-typography')
    .should('be.visible')
    .and('contain.text', 'Payment Confirmation');

  cy.get('@recipientReceives').then((recipientReceives) => {
    cy.get(':nth-child(4) > .ant-col-8 > .ant-typography')
      .should('be.visible')
      .and('contain.text', recipientReceives);
  });

  // Pay recipient
  cy.get(
    '.ant-row-center.m-t-20 > .ant-col > .ant-space > :nth-child(2) > .ant-btn'
  )
    .should('be.visible')
    .click();

  cy.get('.ant-modal-body > :nth-child(1) > .ant-col')
    .should('be.visible')
    .and('contain.text', ' Payment Booked - ');

  cy.get('@recipientReceives').then((recipientReceives) => {
    cy.get(':nth-child(5) > .ant-col-8 > .ant-typography')
      .should('be.visible')
      .and('contain.text', recipientReceives);
  });
    })
    it('TC-AC-039 - Verify that if Currency= PLN and Country = Poland & client = UK and check priority settlement is enabled and make a payment with GBP using Push Funds',function () {
    // ─────────────── Setup & Recipient Creation ───────────────
        signin.Login(userName, password)
        newRecipient.goToPaymentsDashborad()
        newRecipient.gotoRecipientList()
        let email = batchPayments.generateRandomString(5)+ '@yopmail.com'
        newRecipient.addRecipient('poland{enter}' ,'PLN{enter}',email)
        newRecipient.addBankDetails('PL10105000997603123456789123','BPKOPLPWXXX')
        newRecipient.individualRecipient('Poland PLN','Poland{enter}')
        newRecipient.saveRecipient()
        newRecipient.checkSettelment('be.disabled','be.enabled')

    // ─────────────── Payment Flow ───────────────
    newPayment.proceedflow('{downarrow}{enter}', 'GBP');
    const amount = '10';
    newPayment.addrecipientDetail(amount, email);
    newPayment.selectFundingMethod('Push Funds');
      const apiEnv = this.apiEnv;
    // ───── Intercept Quote API ─────
  cy.intercept(
  'POST',
  '**/VolopaApiOauth2WebApp*/exchange/b2b/self/quote/temp'
).as('quoteApi');

  // ───── Wait for API and Compare Values ─────
  cy.wait('@quoteApi').then(({ response }) => {
    const receive = response.body.data.receive;
    const recipientReceives = response.body.data.recipient[0].receives;

    cy.wrap(recipientReceives).as('recipientReceives');
    cy.log(`Receive: ${receive}`);
    cy.log(`Recipient Receives: ${recipientReceives}`);

    expect(receive).to.eq(recipientReceives); // Final comparison
  });

    /* ── Validate payment‑reason field ───────────────────────── */
    // 1️⃣ Ensure the field starts empty
    cy.get('.ant-select-selector')
      .eq(2)
      .should(($el) => {
        expect(
          $el.text().trim(),
          'reason field should start empty'
        ).to.equal('');
      })
      .click(); // open dropdown

    // 2️⃣ Pick a random option between 1 and 10
    cy.get('.ant-select-dropdown')
      .last()
      .find('.ant-select-item-option')
      .its('length')
      .then((total) => {
        const idx = Math.min(7, Cypress._.random(0, total - 1));
        cy.get('.ant-select-dropdown')
          .last()
          .find('.ant-select-item-option')
          .eq(idx)
          .click();
      });

    /* ── Validate recipient‑received amount ───────────────────── */
    cy.get(':nth-child(3) > :nth-child(2) > .ant-typography')
    .invoke('text')
    .then((uiText) => {
      const trimmedUiText = uiText.trim();
      cy.wrap(trimmedUiText).as('uiReceives');
    });

  // Compare UI vs API value
  cy.get('@recipientReceives').then((recipientReceives) => {
    cy.get('@uiReceives').then((uiReceives) => {
      cy.log(`UI: ${uiReceives}, API: ${recipientReceives}`);
      expect(uiReceives).to.eq(recipientReceives);
    });
  });


    // ─────────────── Confirmation Screens ───────────────
    cy.get('.ant-col > .ant-btn > span').should('be.visible').click();

  cy.get('.ant-modal-body > :nth-child(1) > .ant-col > .ant-typography')
    .should('be.visible')
    .and('contain.text', 'Payment Confirmation');

  cy.get('@recipientReceives').then((recipientReceives) => {
    cy.get(':nth-child(4) > .ant-col-8 > .ant-typography')
      .should('be.visible')
      .and('contain.text', recipientReceives);
  });

  // Pay recipient
  cy.get(
    '.ant-row-center.m-t-20 > .ant-col > .ant-space > :nth-child(2) > .ant-btn'
  )
    .should('be.visible')
    .click();

  cy.get('.ant-modal-body > :nth-child(1) > .ant-col')
    .should('be.visible')
    .and('contain.text', ' Payment Booked - ');

  cy.get('@recipientReceives').then((recipientReceives) => {
    cy.get(':nth-child(5) > .ant-col-8 > .ant-typography')
      .should('be.visible')
      .and('contain.text', recipientReceives);
  });
    })
    it('TC-AC-040 - Verify that if Currency= DKK and Country = UNITED KINGDOM & client = UK and check priority settlement is enabled and make a payment with GBP using Push Funds',function () {
    // ─────────────── Setup & Recipient Creation ───────────────
        signin.Login(userName, password)
        newRecipient.goToPaymentsDashborad()
        newRecipient.gotoRecipientList()
        let email = batchPayments.generateRandomString(5)+ '@yopmail.com'
        newRecipient.addRecipient('UNITED KINGDOM{enter}' ,'DKK{enter}',email)
        newRecipient.addBankDetails('GB73BARC20039538243547','AFFLGB22')
        newRecipient.individualRecipient('UK DKK','UNITED KINGDOM{enter}')
        newRecipient.saveRecipient()
        newRecipient.checkSettelment('be.disabled','be.enabled')

    // ─────────────── Payment Flow ───────────────
    newPayment.proceedflow('{downarrow}{enter}', 'GBP');
    const amount = '10';
    newPayment.addrecipientDetail(amount, email);
    newPayment.selectFundingMethod('Push Funds');
      const apiEnv = this.apiEnv;
    // ───── Intercept Quote API ─────
  cy.intercept(
  'POST',
  '**/VolopaApiOauth2WebApp*/exchange/b2b/self/quote/temp'
).as('quoteApi');

  // ───── Wait for API and Compare Values ─────
  cy.wait('@quoteApi').then(({ response }) => {
    const receive = response.body.data.receive;
    const recipientReceives = response.body.data.recipient[0].receives;

    cy.wrap(recipientReceives).as('recipientReceives');
    cy.log(`Receive: ${receive}`);
    cy.log(`Recipient Receives: ${recipientReceives}`);

    expect(receive).to.eq(recipientReceives); // Final comparison
  });

    /* ── Validate payment‑reason field ───────────────────────── */
    // 1️⃣ Ensure the field starts empty
    cy.get('.ant-select-selector')
      .eq(2)
      .should(($el) => {
        expect(
          $el.text().trim(),
          'reason field should start empty'
        ).to.equal('');
      })
      .click(); // open dropdown

    // 2️⃣ Pick a random option between 1 and 10
    cy.get('.ant-select-dropdown')
      .last()
      .find('.ant-select-item-option')
      .its('length')
      .then((total) => {
        const idx = Math.min(7, Cypress._.random(0, total - 1));
        cy.get('.ant-select-dropdown')
          .last()
          .find('.ant-select-item-option')
          .eq(idx)
          .click();
      });

    /* ── Validate recipient‑received amount ───────────────────── */
    cy.get(':nth-child(3) > :nth-child(2) > .ant-typography')
    .invoke('text')
    .then((uiText) => {
      const trimmedUiText = uiText.trim();
      cy.wrap(trimmedUiText).as('uiReceives');
    });

  // Compare UI vs API value
  cy.get('@recipientReceives').then((recipientReceives) => {
    cy.get('@uiReceives').then((uiReceives) => {
      cy.log(`UI: ${uiReceives}, API: ${recipientReceives}`);
      expect(uiReceives).to.eq(recipientReceives);
    });
  });


    // ─────────────── Confirmation Screens ───────────────
    cy.get('.ant-col > .ant-btn > span').should('be.visible').click();

  cy.get('.ant-modal-body > :nth-child(1) > .ant-col > .ant-typography')
    .should('be.visible')
    .and('contain.text', 'Payment Confirmation');

  cy.get('@recipientReceives').then((recipientReceives) => {
    cy.get(':nth-child(4) > .ant-col-8 > .ant-typography')
      .should('be.visible')
      .and('contain.text', recipientReceives);
  });

  // Pay recipient
  cy.get(
    '.ant-row-center.m-t-20 > .ant-col > .ant-space > :nth-child(2) > .ant-btn'
  )
    .should('be.visible')
    .click();

  cy.get('.ant-modal-body > :nth-child(1) > .ant-col')
    .should('be.visible')
    .and('contain.text', ' Payment Booked - ');

  cy.get('@recipientReceives').then((recipientReceives) => {
    cy.get(':nth-child(5) > .ant-col-8 > .ant-typography')
      .should('be.visible')
      .and('contain.text', recipientReceives);
  });
    })
    it('TC-AC-041 - Verify that if Currency= DKK and Country = Denmark & client = UK and check priority and regular both settlement are enabled and make a payment with GBP using Push Funds',function () {
    // ─────────────── Setup & Recipient Creation ───────────────
        signin.Login(userName, password)
        newRecipient.goToPaymentsDashborad()
        newRecipient.gotoRecipientList()
        let email = batchPayments.generateRandomString(5)+ '@yopmail.com'
        newRecipient.addRecipient('Denmark{enter}' ,'DKK{enter}',email)
        newRecipient.addBankDetails('DK9520000123456789','NDEADKKKXXX')
        cy.get('#accNumber').should('be.visible').type('1234578912')
        cy.get('#bank_code').should('be.visible').type('2000')
        newRecipient.individualRecipient('Denmark DKK','Denmark{enter}')
        cy.get('#postcode').should('be.visible').type('50505')
        newRecipient.saveRecipient()
        newRecipient.checkSettelmentEnabledBoth('be.enabled','be.enabled')

    // ─────────────── Payment Flow ───────────────
    newPayment.proceedflow('{downarrow}{enter}', 'GBP');
    const amount = '10';
    newPayment.addrecipientDetail(amount, email);
    newPayment.selectFundingMethod('Push Funds');
      const apiEnv = this.apiEnv;
    // ───── Intercept Quote API ─────
  cy.intercept(
  'POST',
  '**/VolopaApiOauth2WebApp*/exchange/b2b/self/quote/temp'
).as('quoteApi');

  // ───── Wait for API and Compare Values ─────
  cy.wait('@quoteApi').then(({ response }) => {
    const receive = response.body.data.receive;
    const recipientReceives = response.body.data.recipient[0].receives;

    cy.wrap(recipientReceives).as('recipientReceives');
    cy.log(`Receive: ${receive}`);
    cy.log(`Recipient Receives: ${recipientReceives}`);

    expect(receive).to.eq(recipientReceives); // Final comparison
  });

    /* ── Validate payment‑reason field ───────────────────────── */
    // 1️⃣ Ensure the field starts empty
    cy.get('.ant-select-selector')
      .eq(2)
      .should(($el) => {
        expect(
          $el.text().trim(),
          'reason field should start empty'
        ).to.equal('');
      })
      .click(); // open dropdown

    // 2️⃣ Pick a random option between 1 and 10
    cy.get('.ant-select-dropdown')
      .last()
      .find('.ant-select-item-option')
      .its('length')
      .then((total) => {
        const idx = Math.min(7, Cypress._.random(0, total - 1));
        cy.get('.ant-select-dropdown')
          .last()
          .find('.ant-select-item-option')
          .eq(idx)
          .click();
      });

    /* ── Validate recipient‑received amount ───────────────────── */
    cy.get(':nth-child(3) > :nth-child(2) > .ant-typography')
    .invoke('text')
    .then((uiText) => {
      const trimmedUiText = uiText.trim();
      cy.wrap(trimmedUiText).as('uiReceives');
    });

  // Compare UI vs API value
  cy.get('@recipientReceives').then((recipientReceives) => {
    cy.get('@uiReceives').then((uiReceives) => {
      cy.log(`UI: ${uiReceives}, API: ${recipientReceives}`);
      expect(uiReceives).to.eq(recipientReceives);
    });
  });


    // ─────────────── Confirmation Screens ───────────────
    cy.get('.ant-col > .ant-btn > span').should('be.visible').click();

  cy.get('.ant-modal-body > :nth-child(1) > .ant-col > .ant-typography')
    .should('be.visible')
    .and('contain.text', 'Payment Confirmation');

  cy.get('@recipientReceives').then((recipientReceives) => {
    cy.get(':nth-child(4) > .ant-col-8 > .ant-typography')
      .should('be.visible')
      .and('contain.text', recipientReceives);
  });

  // Pay recipient
  cy.get(
    '.ant-row-center.m-t-20 > .ant-col > .ant-space > :nth-child(2) > .ant-btn'
  )
    .should('be.visible')
    .click();

  cy.get('.ant-modal-body > :nth-child(1) > .ant-col')
    .should('be.visible')
    .and('contain.text', ' Payment Booked - ');

  cy.get('@recipientReceives').then((recipientReceives) => {
    cy.get(':nth-child(5) > .ant-col-8 > .ant-typography')
      .should('be.visible')
      .and('contain.text', recipientReceives);
  });
    })
    it('TC-AC-042 - Verify that if Currency= SEK and Country = UNITED KINGDOM & client = UK and check priority settlement is enabled and make a payment with GBP using Push Funds',function () {
    // ─────────────── Setup & Recipient Creation ───────────────
        signin.Login(userName, password)
        newRecipient.goToPaymentsDashborad()
        newRecipient.gotoRecipientList()
        let email = batchPayments.generateRandomString(5)+ '@yopmail.com'
        newRecipient.addRecipient('UNITED KINGDOM{enter}' ,'SEK{enter}',email)
        newRecipient.addBankDetails('GB73BARC20039538243547','AFFLGB22')
        newRecipient.individualRecipient('UK SEK','UNITED KINGDOM{enter}')
        newRecipient.saveRecipient()
        newRecipient.checkSettelment('be.disabled','be.enabled')

    // ─────────────── Payment Flow ───────────────
    newPayment.proceedflow('{downarrow}{enter}', 'GBP');
    const amount = '10';
    newPayment.addrecipientDetail(amount, email);
    newPayment.selectFundingMethod('Push Funds');
    const apiEnv = this.apiEnv;
    // ───── Intercept Quote API ─────
  cy.intercept(
  'POST',
  '**/VolopaApiOauth2WebApp*/exchange/b2b/self/quote/temp'
).as('quoteApi');

  // ───── Wait for API and Compare Values ─────
  cy.wait('@quoteApi').then(({ response }) => {
    const receive = response.body.data.receive;
    const recipientReceives = response.body.data.recipient[0].receives;

    cy.wrap(recipientReceives).as('recipientReceives');
    cy.log(`Receive: ${receive}`);
    cy.log(`Recipient Receives: ${recipientReceives}`);

    expect(receive).to.eq(recipientReceives); // Final comparison
  });

    /* ── Validate payment‑reason field ───────────────────────── */
    // 1️⃣ Ensure the field starts empty
    cy.get('.ant-select-selector')
      .eq(2)
      .should(($el) => {
        expect(
          $el.text().trim(),
          'reason field should start empty'
        ).to.equal('');
      })
      .click(); // open dropdown

    // 2️⃣ Pick a random option between 1 and 10
    cy.get('.ant-select-dropdown')
      .last()
      .find('.ant-select-item-option')
      .its('length')
      .then((total) => {
        const idx = Math.min(7, Cypress._.random(0, total - 1));
        cy.get('.ant-select-dropdown')
          .last()
          .find('.ant-select-item-option')
          .eq(idx)
          .click();
      });

    /* ── Validate recipient‑received amount ───────────────────── */
    cy.get(':nth-child(3) > :nth-child(2) > .ant-typography')
    .invoke('text')
    .then((uiText) => {
      const trimmedUiText = uiText.trim();
      cy.wrap(trimmedUiText).as('uiReceives');
    });

  // Compare UI vs API value
  cy.get('@recipientReceives').then((recipientReceives) => {
    cy.get('@uiReceives').then((uiReceives) => {
      cy.log(`UI: ${uiReceives}, API: ${recipientReceives}`);
      expect(uiReceives).to.eq(recipientReceives);
    });
  });


    // ─────────────── Confirmation Screens ───────────────
    cy.get('.ant-col > .ant-btn > span').should('be.visible').click();

  cy.get('.ant-modal-body > :nth-child(1) > .ant-col > .ant-typography')
    .should('be.visible')
    .and('contain.text', 'Payment Confirmation');

  cy.get('@recipientReceives').then((recipientReceives) => {
    cy.get(':nth-child(4) > .ant-col-8 > .ant-typography')
      .should('be.visible')
      .and('contain.text', recipientReceives);
  });

  // Pay recipient
  cy.get(
    '.ant-row-center.m-t-20 > .ant-col > .ant-space > :nth-child(2) > .ant-btn'
  )
    .should('be.visible')
    .click();

  cy.get('.ant-modal-body > :nth-child(1) > .ant-col')
    .should('be.visible')
    .and('contain.text', ' Payment Booked - ');

  cy.get('@recipientReceives').then((recipientReceives) => {
    cy.get(':nth-child(5) > .ant-col-8 > .ant-typography')
      .should('be.visible')
      .and('contain.text', recipientReceives);
  });
    })
    it('TC-AC-043 - Verify that if Currency= SEK and Country = SWEDEN & client = UK and check priority settlement is enabled and make a payment with GBP using Push Funds',function () {
    // ─────────────── Setup & Recipient Creation ───────────────
        signin.Login(userName, password)
        newRecipient.goToPaymentsDashborad()
        newRecipient.gotoRecipientList()
        let email = batchPayments.generateRandomString(5)+ '@yopmail.com'
        newRecipient.addRecipient('Sweden{enter}' ,'SEK{enter}',email)
        newRecipient.addBankDetails('SE7280000810340009783242','SWEDSESSXXX')
        newRecipient.individualRecipient('Sweden SEK','Sweden{enter}')
        cy.get('#postcode').should('be.visible').type('50505')
        newRecipient.saveRecipient()
        newRecipient.checkSettelment('be.disabled','be.enabled')

    // ─────────────── Payment Flow ───────────────
    newPayment.proceedflow('{downarrow}{enter}', 'GBP');
    const amount = '10';
    newPayment.addrecipientDetail(amount, email);
    newPayment.selectFundingMethod('Push Funds');
      const apiEnv = this.apiEnv;
    // ───── Intercept Quote API ─────
  cy.intercept(
  'POST',
  '**/VolopaApiOauth2WebApp*/exchange/b2b/self/quote/temp'
).as('quoteApi');

  // ───── Wait for API and Compare Values ─────
  cy.wait('@quoteApi').then(({ response }) => {
    const receive = response.body.data.receive;
    const recipientReceives = response.body.data.recipient[0].receives;

    cy.wrap(recipientReceives).as('recipientReceives');
    cy.log(`Receive: ${receive}`);
    cy.log(`Recipient Receives: ${recipientReceives}`);

    expect(receive).to.eq(recipientReceives); // Final comparison
  });

    /* ── Validate payment‑reason field ───────────────────────── */
    // 1️⃣ Ensure the field starts empty
    cy.get('.ant-select-selector')
      .eq(2)
      .should(($el) => {
        expect(
          $el.text().trim(),
          'reason field should start empty'
        ).to.equal('');
      })
      .click(); // open dropdown

    // 2️⃣ Pick a random option between 1 and 10
    cy.get('.ant-select-dropdown')
      .last()
      .find('.ant-select-item-option')
      .its('length')
      .then((total) => {
        const idx = Math.min(7, Cypress._.random(0, total - 1));
        cy.get('.ant-select-dropdown')
          .last()
          .find('.ant-select-item-option')
          .eq(idx)
          .click();
      });

    /* ── Validate recipient‑received amount ───────────────────── */
    cy.get(':nth-child(3) > :nth-child(2) > .ant-typography')
    .invoke('text')
    .then((uiText) => {
      const trimmedUiText = uiText.trim();
      cy.wrap(trimmedUiText).as('uiReceives');
    });

  // Compare UI vs API value
  cy.get('@recipientReceives').then((recipientReceives) => {
    cy.get('@uiReceives').then((uiReceives) => {
      cy.log(`UI: ${uiReceives}, API: ${recipientReceives}`);
      expect(uiReceives).to.eq(recipientReceives);
    });
  });


    // ─────────────── Confirmation Screens ───────────────
    cy.get('.ant-col > .ant-btn > span').should('be.visible').click();

  cy.get('.ant-modal-body > :nth-child(1) > .ant-col > .ant-typography')
    .should('be.visible')
    .and('contain.text', 'Payment Confirmation');

  cy.get('@recipientReceives').then((recipientReceives) => {
    cy.get(':nth-child(4) > .ant-col-8 > .ant-typography')
      .should('be.visible')
      .and('contain.text', recipientReceives);
  });

  // Pay recipient
  cy.get(
    '.ant-row-center.m-t-20 > .ant-col > .ant-space > :nth-child(2) > .ant-btn'
  )
    .should('be.visible')
    .click();

  cy.get('.ant-modal-body > :nth-child(1) > .ant-col')
    .should('be.visible')
    .and('contain.text', ' Payment Booked - ');

  cy.get('@recipientReceives').then((recipientReceives) => {
    cy.get(':nth-child(5) > .ant-col-8 > .ant-typography')
      .should('be.visible')
      .and('contain.text', recipientReceives);
  });
    })
    it('TC-AC-044 - Verify that if Currency= NOK and Country = UNITED KINGDOM & client = UK and check priority settlement is enabled and make a payment with GBP using Push Funds',function () {
    // ─────────────── Setup & Recipient Creation ───────────────
        signin.Login(userName, password)
        newRecipient.goToPaymentsDashborad()
        newRecipient.gotoRecipientList()
        let email = batchPayments.generateRandomString(5)+ '@yopmail.com'
        newRecipient.addRecipient('UNITED KINGDOM{enter}' ,'NOK{enter}',email)
        newRecipient.addBankDetails('GB73BARC20039538243547','AFFLGB22')
        newRecipient.individualRecipient('UK NOR','UNITED KINGDOM{enter}')
        newRecipient.saveRecipient()
        newRecipient.checkSettelment('be.disabled','be.enabled')

    // ─────────────── Payment Flow ───────────────
    newPayment.proceedflow('{downarrow}{enter}', 'GBP');
    const amount = '10';
    newPayment.addrecipientDetail(amount, email);
    newPayment.selectFundingMethod('Push Funds');
      const apiEnv = this.apiEnv;
    // ───── Intercept Quote API ─────
  cy.intercept(
  'POST',
  '**/VolopaApiOauth2WebApp*/exchange/b2b/self/quote/temp'
).as('quoteApi');

  // ───── Wait for API and Compare Values ─────
  cy.wait('@quoteApi').then(({ response }) => {
    const receive = response.body.data.receive;
    const recipientReceives = response.body.data.recipient[0].receives;

    cy.wrap(recipientReceives).as('recipientReceives');
    cy.log(`Receive: ${receive}`);
    cy.log(`Recipient Receives: ${recipientReceives}`);

    expect(receive).to.eq(recipientReceives); // Final comparison
  });

    /* ── Validate payment‑reason field ───────────────────────── */
    // 1️⃣ Ensure the field starts empty
    cy.get('.ant-select-selector')
      .eq(2)
      .should(($el) => {
        expect(
          $el.text().trim(),
          'reason field should start empty'
        ).to.equal('');
      })
      .click(); // open dropdown

    // 2️⃣ Pick a random option between 1 and 10
    cy.get('.ant-select-dropdown')
      .last()
      .find('.ant-select-item-option')
      .its('length')
      .then((total) => {
        const idx = Math.min(7, Cypress._.random(0, total - 1));
        cy.get('.ant-select-dropdown')
          .last()
          .find('.ant-select-item-option')
          .eq(idx)
          .click();
      });

    /* ── Validate recipient‑received amount ───────────────────── */
    cy.get(':nth-child(3) > :nth-child(2) > .ant-typography')
    .invoke('text')
    .then((uiText) => {
      const trimmedUiText = uiText.trim();
      cy.wrap(trimmedUiText).as('uiReceives');
    });

  // Compare UI vs API value
  cy.get('@recipientReceives').then((recipientReceives) => {
    cy.get('@uiReceives').then((uiReceives) => {
      cy.log(`UI: ${uiReceives}, API: ${recipientReceives}`);
      expect(uiReceives).to.eq(recipientReceives);
    });
  });


    // ─────────────── Confirmation Screens ───────────────
    cy.get('.ant-col > .ant-btn > span').should('be.visible').click();

  cy.get('.ant-modal-body > :nth-child(1) > .ant-col > .ant-typography')
    .should('be.visible')
    .and('contain.text', 'Payment Confirmation');

  cy.get('@recipientReceives').then((recipientReceives) => {
    cy.get(':nth-child(4) > .ant-col-8 > .ant-typography')
      .should('be.visible')
      .and('contain.text', recipientReceives);
  });

  // Pay recipient
  cy.get(
    '.ant-row-center.m-t-20 > .ant-col > .ant-space > :nth-child(2) > .ant-btn'
  )
    .should('be.visible')
    .click();

  cy.get('.ant-modal-body > :nth-child(1) > .ant-col')
    .should('be.visible')
    .and('contain.text', ' Payment Booked - ');

  cy.get('@recipientReceives').then((recipientReceives) => {
    cy.get(':nth-child(5) > .ant-col-8 > .ant-typography')
      .should('be.visible')
      .and('contain.text', recipientReceives);
  });
    })
    it('TC-AC-045 - Verify that if Currency= NOK and Country = Norway & client = UK and check priority and regular both settlement are enabled and make a payment with GBP using Push Funds',function () {
    // ─────────────── Setup & Recipient Creation ───────────────
        signin.Login(userName, password)
        newRecipient.goToPaymentsDashborad()
        newRecipient.gotoRecipientList()
        let email = batchPayments.generateRandomString(5)+ '@yopmail.com'
        newRecipient.addRecipient('Norway{enter}' ,'NOK{enter}',email)
        newRecipient.addBankDetails('NO8330001234567','SPTRNO22XXX')
        cy.get('#accNumber').should('be.visible').type('1234572')
        cy.get('#bank_code').should('be.visible').type('2000')
        newRecipient.individualRecipient('Denmark DKK','Denmark{enter}')
        cy.get('#postcode').should('be.visible').type('50505')
        newRecipient.saveRecipient()
        newRecipient.checkSettelmentEnabledBoth('be.enabled','be.enabled')

    // ─────────────── Payment Flow ───────────────
    newPayment.proceedflow('{downarrow}{enter}', 'GBP');
    const amount = '10';
    newPayment.addrecipientDetail(amount, email);
    newPayment.selectFundingMethod('Push Funds');
      const apiEnv = this.apiEnv;
    // ───── Intercept Quote API ─────
  cy.intercept(
  'POST',
  '**/VolopaApiOauth2WebApp*/exchange/b2b/self/quote/temp'
).as('quoteApi');

  // ───── Wait for API and Compare Values ─────
  cy.wait('@quoteApi').then(({ response }) => {
    const receive = response.body.data.receive;
    const recipientReceives = response.body.data.recipient[0].receives;

    cy.wrap(recipientReceives).as('recipientReceives');
    cy.log(`Receive: ${receive}`);
    cy.log(`Recipient Receives: ${recipientReceives}`);

    expect(receive).to.eq(recipientReceives); // Final comparison
  });

    /* ── Validate payment‑reason field ───────────────────────── */
    // 1️⃣ Ensure the field starts empty
    cy.get('.ant-select-selector')
      .eq(2)
      .should(($el) => {
        expect(
          $el.text().trim(),
          'reason field should start empty'
        ).to.equal('');
      })
      .click(); // open dropdown

    // 2️⃣ Pick a random option between 1 and 10
    cy.get('.ant-select-dropdown')
      .last()
      .find('.ant-select-item-option')
      .its('length')
      .then((total) => {
        const idx = Math.min(7, Cypress._.random(0, total - 1));
        cy.get('.ant-select-dropdown')
          .last()
          .find('.ant-select-item-option')
          .eq(idx)
          .click();
      });

    /* ── Validate recipient‑received amount ───────────────────── */
    cy.get(':nth-child(3) > :nth-child(2) > .ant-typography')
    .invoke('text')
    .then((uiText) => {
      const trimmedUiText = uiText.trim();
      cy.wrap(trimmedUiText).as('uiReceives');
    });

  // Compare UI vs API value
  cy.get('@recipientReceives').then((recipientReceives) => {
    cy.get('@uiReceives').then((uiReceives) => {
      cy.log(`UI: ${uiReceives}, API: ${recipientReceives}`);
      expect(uiReceives).to.eq(recipientReceives);
    });
  });


    // ─────────────── Confirmation Screens ───────────────
    cy.get('.ant-col > .ant-btn > span').should('be.visible').click();

  cy.get('.ant-modal-body > :nth-child(1) > .ant-col > .ant-typography')
    .should('be.visible')
    .and('contain.text', 'Payment Confirmation');

  cy.get('@recipientReceives').then((recipientReceives) => {
    cy.get(':nth-child(4) > .ant-col-8 > .ant-typography')
      .should('be.visible')
      .and('contain.text', recipientReceives);
  });

  // Pay recipient
  cy.get(
    '.ant-row-center.m-t-20 > .ant-col > .ant-space > :nth-child(2) > .ant-btn'
  )
    .should('be.visible')
    .click();

  cy.get('.ant-modal-body > :nth-child(1) > .ant-col')
    .should('be.visible')
    .and('contain.text', ' Payment Booked - ');

  cy.get('@recipientReceives').then((recipientReceives) => {
    cy.get(':nth-child(5) > .ant-col-8 > .ant-typography')
      .should('be.visible')
      .and('contain.text', recipientReceives);
  });
    })

    it('TC-AC-046 - Verify that if Currency= JPY and Country = UNITED KINGDOM & client = UK and check priority settlement is enabled and make a payment with GBP using Push Funds',function () {
    // ─────────────── Setup & Recipient Creation ───────────────
        signin.Login(userName, password)
        newRecipient.goToPaymentsDashborad()
        newRecipient.gotoRecipientList()
        let email = batchPayments.generateRandomString(5)+ '@yopmail.com'
        newRecipient.addRecipient('UNITED KINGDOM{enter}' ,'JPY{enter}',email)
        newRecipient.addBankDetails('GB73BARC20039538243547','AFFLGB22')
        newRecipient.individualRecipient('UK JPY','UNITED KINGDOM{enter}')
        newRecipient.saveRecipient()
        newRecipient.checkSettelment('be.disabled','be.enabled')

    // ─────────────── Payment Flow ───────────────
    newPayment.proceedflow('{downarrow}{enter}', 'GBP');
    const amount = '10';
    newPayment.addrecipientDetail(amount, email);
    newPayment.selectFundingMethod('Push Funds');
      const apiEnv = this.apiEnv;
    // ───── Intercept Quote API ─────
  cy.intercept(
  'POST',
  '**/VolopaApiOauth2WebApp*/exchange/b2b/self/quote/temp'
).as('quoteApi');

  // ───── Wait for API and Compare Values ─────
  cy.wait('@quoteApi').then(({ response }) => {
    const receive = response.body.data.receive;
    const recipientReceives = response.body.data.recipient[0].receives;

    cy.wrap(recipientReceives).as('recipientReceives');
    cy.log(`Receive: ${receive}`);
    cy.log(`Recipient Receives: ${recipientReceives}`);

    expect(receive).to.eq(recipientReceives); // Final comparison
  });

    /* ── Validate payment‑reason field ───────────────────────── */
    // 1️⃣ Ensure the field starts empty
    cy.get('.ant-select-selector')
      .eq(2)
      .should(($el) => {
        expect(
          $el.text().trim(),
          'reason field should start empty'
        ).to.equal('');
      })
      .click(); // open dropdown

    // 2️⃣ Pick a random option between 1 and 10
    cy.get('.ant-select-dropdown')
      .last()
      .find('.ant-select-item-option')
      .its('length')
      .then((total) => {
        const idx = Math.min(7, Cypress._.random(0, total - 1));
        cy.get('.ant-select-dropdown')
          .last()
          .find('.ant-select-item-option')
          .eq(idx)
          .click();
      });

    /* ── Validate recipient‑received amount ───────────────────── */
    cy.get(':nth-child(3) > :nth-child(2) > .ant-typography')
    .invoke('text')
    .then((uiText) => {
      const trimmedUiText = uiText.trim();
      cy.wrap(trimmedUiText).as('uiReceives');
    });

  // Compare UI vs API value
  cy.get('@recipientReceives').then((recipientReceives) => {
    cy.get('@uiReceives').then((uiReceives) => {
      cy.log(`UI: ${uiReceives}, API: ${recipientReceives}`);
      expect(uiReceives).to.eq(recipientReceives);
    });
  });


    // ─────────────── Confirmation Screens ───────────────
    cy.get('.ant-col > .ant-btn > span').should('be.visible').click();

  cy.get('.ant-modal-body > :nth-child(1) > .ant-col > .ant-typography')
    .should('be.visible')
    .and('contain.text', 'Payment Confirmation');

  cy.get('@recipientReceives').then((recipientReceives) => {
    cy.get(':nth-child(4) > .ant-col-8 > .ant-typography')
      .should('be.visible')
      .and('contain.text', recipientReceives);
  });

  // Pay recipient
  cy.get(
    '.ant-row-center.m-t-20 > .ant-col > .ant-space > :nth-child(2) > .ant-btn'
  )
    .should('be.visible')
    .click();

  cy.get('.ant-modal-body > :nth-child(1) > .ant-col')
    .should('be.visible')
    .and('contain.text', ' Payment Booked - ');

  cy.get('@recipientReceives').then((recipientReceives) => {
    cy.get(':nth-child(5) > .ant-col-8 > .ant-typography')
      .should('be.visible')
      .and('contain.text', recipientReceives);
  });
    })
    it('TC-AC-047 - Verify that if Currency= JPY and Country = Japan & client = UK and check priority settlement is enabled and make a payment with GBP using Push Funds',function () {
    // ─────────────── Setup & Recipient Creation ───────────────
        signin.Login(userName, password)
        newRecipient.goToPaymentsDashborad()
        newRecipient.gotoRecipientList()
        let email = batchPayments.generateRandomString(5)+ '@yopmail.com'
        newRecipient.addRecipient('Japan{enter}' ,'JPY{enter}',email)
        newRecipient.addBankDetailsWithAccNo('BOJPJPJTXXX','049712')
        cy.get('#bankBranch').should('be.visible').type('City branch')
        newRecipient.individualRecipient('Japan JPY','Japan{enter}')
        newRecipient.saveRecipient()
        newRecipient.checkSettelment('be.disabled','be.enabled')

    // ─────────────── Payment Flow ───────────────
    newPayment.proceedflow('{downarrow}{enter}', 'GBP');
    const amount = '10';
    newPayment.addrecipientDetail(amount, email);
    newPayment.selectFundingMethod('Push Funds');
      const apiEnv = this.apiEnv;
    // ───── Intercept Quote API ─────
  cy.intercept(
  'POST',
  '**/VolopaApiOauth2WebApp*/exchange/b2b/self/quote/temp'
).as('quoteApi');

  // ───── Wait for API and Compare Values ─────
  cy.wait('@quoteApi').then(({ response }) => {
    const receive = response.body.data.receive;
    const recipientReceives = response.body.data.recipient[0].receives;

    cy.wrap(recipientReceives).as('recipientReceives');
    cy.log(`Receive: ${receive}`);
    cy.log(`Recipient Receives: ${recipientReceives}`);

    expect(receive).to.eq(recipientReceives); // Final comparison
  });

    /* ── Validate payment‑reason field ───────────────────────── */
    // 1️⃣ Ensure the field starts empty
    cy.get('.ant-select-selector')
      .eq(2)
      .should(($el) => {
        expect(
          $el.text().trim(),
          'reason field should start empty'
        ).to.equal('');
      })
      .click(); // open dropdown

    // 2️⃣ Pick a random option between 1 and 10
    cy.get('.ant-select-dropdown')
      .last()
      .find('.ant-select-item-option')
      .its('length')
      .then((total) => {
        const idx = Math.min(7, Cypress._.random(0, total - 1));
        cy.get('.ant-select-dropdown')
          .last()
          .find('.ant-select-item-option')
          .eq(idx)
          .click();
      });

    /* ── Validate recipient‑received amount ───────────────────── */
    cy.get(':nth-child(3) > :nth-child(2) > .ant-typography')
    .invoke('text')
    .then((uiText) => {
      const trimmedUiText = uiText.trim();
      cy.wrap(trimmedUiText).as('uiReceives');
    });

  // Compare UI vs API value
  cy.get('@recipientReceives').then((recipientReceives) => {
    cy.get('@uiReceives').then((uiReceives) => {
      cy.log(`UI: ${uiReceives}, API: ${recipientReceives}`);
      expect(uiReceives).to.eq(recipientReceives);
    });
  });


    // ─────────────── Confirmation Screens ───────────────
    cy.get('.ant-col > .ant-btn > span').should('be.visible').click();

  cy.get('.ant-modal-body > :nth-child(1) > .ant-col > .ant-typography')
    .should('be.visible')
    .and('contain.text', 'Payment Confirmation');

  cy.get('@recipientReceives').then((recipientReceives) => {
    cy.get(':nth-child(4) > .ant-col-8 > .ant-typography')
      .should('be.visible')
      .and('contain.text', recipientReceives);
  });

  // Pay recipient
  cy.get(
    '.ant-row-center.m-t-20 > .ant-col > .ant-space > :nth-child(2) > .ant-btn'
  )
    .should('be.visible')
    .click();

  cy.get('.ant-modal-body > :nth-child(1) > .ant-col')
    .should('be.visible')
    .and('contain.text', ' Payment Booked - ');

  cy.get('@recipientReceives').then((recipientReceives) => {
    cy.get(':nth-child(5) > .ant-col-8 > .ant-typography')
      .should('be.visible')
      .and('contain.text', recipientReceives);
  });
    })
    it('TC-AC-048 - Verify that if Currency= CAD and Country = UNITED KINGDOM & client = UK and check priority settlement is enabled and make a payment with GBP using Push Funds',function () {
    // ─────────────── Setup & Recipient Creation ───────────────
        signin.Login(userName, password)
        newRecipient.goToPaymentsDashborad()
        newRecipient.gotoRecipientList()
        let email = batchPayments.generateRandomString(5)+ '@yopmail.com'
        newRecipient.addRecipient('UNITED KINGDOM{enter}' ,'CAD{enter}',email)
        newRecipient.addBankDetails('GB73BARC20039538243547','AFFLGB22')
        newRecipient.individualRecipient('UK CAD','UNITED KINGDOM{enter}')
        newRecipient.saveRecipient()
        newRecipient.checkSettelment('be.disabled','be.enabled')

    // ─────────────── Payment Flow ───────────────
    newPayment.proceedflow('{downarrow}{enter}', 'GBP');
    const amount = '10';
    newPayment.addrecipientDetail(amount, email);
    newPayment.selectFundingMethod('Push Funds');
      const apiEnv = this.apiEnv;
    // ───── Intercept Quote API ─────
  cy.intercept(
  'POST',
  '**/VolopaApiOauth2WebApp*/exchange/b2b/self/quote/temp'
).as('quoteApi');

  // ───── Wait for API and Compare Values ─────
  cy.wait('@quoteApi').then(({ response }) => {
    const receive = response.body.data.receive;
    const recipientReceives = response.body.data.recipient[0].receives;

    cy.wrap(recipientReceives).as('recipientReceives');
    cy.log(`Receive: ${receive}`);
    cy.log(`Recipient Receives: ${recipientReceives}`);

    expect(receive).to.eq(recipientReceives); // Final comparison
  });

    /* ── Validate payment‑reason field ───────────────────────── */
    // 1️⃣ Ensure the field starts empty
    cy.get('.ant-select-selector')
      .eq(2)
      .should(($el) => {
        expect(
          $el.text().trim(),
          'reason field should start empty'
        ).to.equal('');
      })
      .click(); // open dropdown

    // 2️⃣ Pick a random option between 1 and 10
    cy.get('.ant-select-dropdown')
      .last()
      .find('.ant-select-item-option')
      .its('length')
      .then((total) => {
        const idx = Math.min(7, Cypress._.random(0, total - 1));
        cy.get('.ant-select-dropdown')
          .last()
          .find('.ant-select-item-option')
          .eq(idx)
          .click();
      });

    /* ── Validate recipient‑received amount ───────────────────── */
    cy.get(':nth-child(3) > :nth-child(2) > .ant-typography')
    .invoke('text')
    .then((uiText) => {
      const trimmedUiText = uiText.trim();
      cy.wrap(trimmedUiText).as('uiReceives');
    });

  // Compare UI vs API value
  cy.get('@recipientReceives').then((recipientReceives) => {
    cy.get('@uiReceives').then((uiReceives) => {
      cy.log(`UI: ${uiReceives}, API: ${recipientReceives}`);
      expect(uiReceives).to.eq(recipientReceives);
    });
  });


    // ─────────────── Confirmation Screens ───────────────
    cy.get('.ant-col > .ant-btn > span').should('be.visible').click();

  cy.get('.ant-modal-body > :nth-child(1) > .ant-col > .ant-typography')
    .should('be.visible')
    .and('contain.text', 'Payment Confirmation');

  cy.get('@recipientReceives').then((recipientReceives) => {
    cy.get(':nth-child(4) > .ant-col-8 > .ant-typography')
      .should('be.visible')
      .and('contain.text', recipientReceives);
  });

  // Pay recipient
  cy.get(
    '.ant-row-center.m-t-20 > .ant-col > .ant-space > :nth-child(2) > .ant-btn'
  )
    .should('be.visible')
    .click();

  cy.get('.ant-modal-body > :nth-child(1) > .ant-col')
    .should('be.visible')
    .and('contain.text', ' Payment Booked - ');

  cy.get('@recipientReceives').then((recipientReceives) => {
    cy.get(':nth-child(5) > .ant-col-8 > .ant-typography')
      .should('be.visible')
      .and('contain.text', recipientReceives);
  });
    })
    it('TC-AC-049 - Verify that if Currency= CAD and Country = Canada & client = UK and check priority and regular settlement are enabled and make a payment with GBP using Push Funds',function () {
    // ─────────────── Setup & Recipient Creation ───────────────
        signin.Login(userName, password)
        newRecipient.goToPaymentsDashborad()
        newRecipient.gotoRecipientList()
        let email = batchPayments.generateRandomString(5)+ '@yopmail.com'
        newRecipient.addRecipient('Canada{enter}' ,'CAD{enter}',email)
        newRecipient.addBankDetailsWithAccNo('ROYCCAT2XXX','0497124')
        cy.get('#bank_code').should('be.visible').type('004')
        cy.get('#branch_code').should('be.visible').type('07171')
        newRecipient.individualRecipient('Canada CAD','Canada{enter}')
        newRecipient.postCodeStateCanada()
        newRecipient.saveRecipient()
        newRecipient.checkSettelmentEnabledBoth('be.enabled','be.enabled')

    // ─────────────── Payment Flow ───────────────
    newPayment.proceedflow('{downarrow}{enter}', 'GBP');
    const amount = '10';
    newPayment.addrecipientDetail(amount, email);
    newPayment.selectFundingMethod('Push Funds');
      const apiEnv = this.apiEnv;
    // ───── Intercept Quote API ─────
  cy.intercept(
  'POST',
  '**/VolopaApiOauth2WebApp*/exchange/b2b/self/quote/temp'
).as('quoteApi');

  // ───── Wait for API and Compare Values ─────
  cy.wait('@quoteApi').then(({ response }) => {
    const receive = response.body.data.receive;
    const recipientReceives = response.body.data.recipient[0].receives;

    cy.wrap(recipientReceives).as('recipientReceives');
    cy.log(`Receive: ${receive}`);
    cy.log(`Recipient Receives: ${recipientReceives}`);

    expect(receive).to.eq(recipientReceives); // Final comparison
  });

    /* ── Validate payment‑reason field ───────────────────────── */
    // 1️⃣ Ensure the field starts empty
    cy.get('.ant-select-selector')
      .eq(2)
      .should(($el) => {
        expect(
          $el.text().trim(),
          'reason field should start empty'
        ).to.equal('');
      })
      .click(); // open dropdown

    // 2️⃣ Pick a random option between 1 and 10
    cy.get('.ant-select-dropdown')
      .last()
      .find('.ant-select-item-option')
      .its('length')
      .then((total) => {
        const idx = Math.min(7, Cypress._.random(0, total - 1));
        cy.get('.ant-select-dropdown')
          .last()
          .find('.ant-select-item-option')
          .eq(idx)
          .click();
      });

    /* ── Validate recipient‑received amount ───────────────────── */
   cy.get(':nth-child(3) > :nth-child(2) > .ant-typography')
    .invoke('text')
    .then((uiText) => {
      const trimmedUiText = uiText.trim();
      cy.wrap(trimmedUiText).as('uiReceives');
    });

  // Compare UI vs API value
  cy.get('@recipientReceives').then((recipientReceives) => {
    cy.get('@uiReceives').then((uiReceives) => {
      cy.log(`UI: ${uiReceives}, API: ${recipientReceives}`);
      expect(uiReceives).to.eq(recipientReceives);
    });
  });


    // ─────────────── Confirmation Screens ───────────────
    cy.get('.ant-col > .ant-btn > span').should('be.visible').click();

  cy.get('.ant-modal-body > :nth-child(1) > .ant-col > .ant-typography')
    .should('be.visible')
    .and('contain.text', 'Payment Confirmation');

  cy.get('@recipientReceives').then((recipientReceives) => {
    cy.get(':nth-child(4) > .ant-col-8 > .ant-typography')
      .should('be.visible')
      .and('contain.text', recipientReceives);
  });

  // Pay recipient
  cy.get(
    '.ant-row-center.m-t-20 > .ant-col > .ant-space > :nth-child(2) > .ant-btn'
  )
    .should('be.visible')
    .click();

  cy.get('.ant-modal-body > :nth-child(1) > .ant-col')
    .should('be.visible')
    .and('contain.text', ' Payment Booked - ');

  cy.get('@recipientReceives').then((recipientReceives) => {
    cy.get(':nth-child(5) > .ant-col-8 > .ant-typography')
      .should('be.visible')
      .and('contain.text', recipientReceives);
  });
    })
    it('TC-AC-050 - Verify that if Currency= USD and Country = UNITED KINGDOM & client = UK and check priority settlement is enabled and make a payment with GBP using Push Funds',function () {
    // ─────────────── Setup & Recipient Creation ───────────────
        signin.Login(userName, password)
        newRecipient.goToPaymentsDashborad()
        newRecipient.gotoRecipientList()
        let email = batchPayments.generateRandomString(5)+ '@yopmail.com'
        newRecipient.addRecipient('UNITED KINGDOM{enter}' ,'USD{enter}',email)
        newRecipient.addBankDetails('GB73BARC20039538243547','AFFLGB22')
        newRecipient.individualRecipient('UK USD','UNITED KINGDOM{enter}')
        newRecipient.saveRecipient()
        newRecipient.checkSettelment('be.disabled','be.enabled')

    // ─────────────── Payment Flow ───────────────
    newPayment.proceedflow('{downarrow}{enter}', 'GBP');
    const amount = '10';
    newPayment.addrecipientDetail(amount, email);
    newPayment.selectFundingMethod('Push Funds');
      const apiEnv = this.apiEnv;
    // ───── Intercept Quote API ─────
  cy.intercept(
  'POST',
  '**/VolopaApiOauth2WebApp*/exchange/b2b/self/quote/temp'
).as('quoteApi');

  // ───── Wait for API and Compare Values ─────
  cy.wait('@quoteApi').then(({ response }) => {
    const receive = response.body.data.receive;
    const recipientReceives = response.body.data.recipient[0].receives;

    cy.wrap(recipientReceives).as('recipientReceives');
    cy.log(`Receive: ${receive}`);
    cy.log(`Recipient Receives: ${recipientReceives}`);

    expect(receive).to.eq(recipientReceives); // Final comparison
  });

    /* ── Validate payment‑reason field ───────────────────────── */
    // 1️⃣ Ensure the field starts empty
    cy.get('.ant-select-selector')
      .eq(2)
      .should(($el) => {
        expect(
          $el.text().trim(),
          'reason field should start empty'
        ).to.equal('');
      })
      .click(); // open dropdown

    // 2️⃣ Pick a random option between 1 and 10
    cy.get('.ant-select-dropdown')
      .last()
      .find('.ant-select-item-option')
      .its('length')
      .then((total) => {
        const idx = Math.min(7, Cypress._.random(0, total - 1));
        cy.get('.ant-select-dropdown')
          .last()
          .find('.ant-select-item-option')
          .eq(idx)
          .click();
      });

    /* ── Validate recipient‑received amount ───────────────────── */
    cy.get(':nth-child(3) > :nth-child(2) > .ant-typography')
    .invoke('text')
    .then((uiText) => {
      const trimmedUiText = uiText.trim();
      cy.wrap(trimmedUiText).as('uiReceives');
    });

  // Compare UI vs API value
  cy.get('@recipientReceives').then((recipientReceives) => {
    cy.get('@uiReceives').then((uiReceives) => {
      cy.log(`UI: ${uiReceives}, API: ${recipientReceives}`);
      expect(uiReceives).to.eq(recipientReceives);
    });
  });


    // ─────────────── Confirmation Screens ───────────────
    cy.get('.ant-col > .ant-btn > span').should('be.visible').click();

  cy.get('.ant-modal-body > :nth-child(1) > .ant-col > .ant-typography')
    .should('be.visible')
    .and('contain.text', 'Payment Confirmation');

  cy.get('@recipientReceives').then((recipientReceives) => {
    cy.get(':nth-child(4) > .ant-col-8 > .ant-typography')
      .should('be.visible')
      .and('contain.text', recipientReceives);
  });

  // Pay recipient
  cy.get(
    '.ant-row-center.m-t-20 > .ant-col > .ant-space > :nth-child(2) > .ant-btn'
  )
    .should('be.visible')
    .click();

  cy.get('.ant-modal-body > :nth-child(1) > .ant-col')
    .should('be.visible')
    .and('contain.text', ' Payment Booked - ');

  cy.get('@recipientReceives').then((recipientReceives) => {
    cy.get(':nth-child(5) > .ant-col-8 > .ant-typography')
      .should('be.visible')
      .and('contain.text', recipientReceives);
  });
    })
    xit('TC-AC-051 - Verify that if Currency= USD and Country = UNITED STATES & client = UK and check priority and regular settlement are enabled and make a payment with GBP using Push Funds',function () {
    // ─────────────── Setup & Recipient Creation ───────────────
        signin.Login(userName, password)
        newRecipient.goToPaymentsDashborad()
        newRecipient.gotoRecipientList()
        let email = batchPayments.generateRandomString(5)+ '@yopmail.com'
        newRecipient.addRecipient('United States{enter}' ,'USD{enter}',email)
        newRecipient.addBankDetailsWithAccNo('USBKUS44','011401533')
        cy.get('#aba').should('be.visible').type('026009593')
        newRecipient.individualRecipient('United States USD','United States{enter}')
        newRecipient.postCodeStateUS()
        newRecipient.saveRecipient()
        //to do (need to check the settlment it's not currently validating iban)
        newRecipient.checkSettelmentEnabledBoth('be.enabled','be.enabled')

    // ─────────────── Payment Flow ───────────────
    newPayment.proceedflow('{downarrow}{enter}', 'GBP');
    const amount = '10';
    newPayment.addrecipientDetail(amount, email);
    newPayment.selectFundingMethod('Push Funds');
      const apiEnv = this.apiEnv;
    // ───── Intercept Quote API ─────
  cy.intercept(
  'POST',
  '**/VolopaApiOauth2WebApp*/exchange/b2b/self/quote/temp'
).as('quoteApi');

  // ───── Wait for API and Compare Values ─────
  cy.wait('@quoteApi').then(({ response }) => {
    const receive = response.body.data.receive;
    const recipientReceives = response.body.data.recipient[0].receives;

    cy.wrap(recipientReceives).as('recipientReceives');
    cy.log(`Receive: ${receive}`);
    cy.log(`Recipient Receives: ${recipientReceives}`);

    expect(receive).to.eq(recipientReceives); // Final comparison
  });

    /* ── Validate payment‑reason field ───────────────────────── */
    // 1️⃣ Ensure the field starts empty
    cy.get('.ant-select-selector')
      .eq(2)
      .should(($el) => {
        expect(
          $el.text().trim(),
          'reason field should start empty'
        ).to.equal('');
      })
      .click(); // open dropdown

    // 2️⃣ Pick a random option between 1 and 10
    cy.get('.ant-select-dropdown')
      .last()
      .find('.ant-select-item-option')
      .its('length')
      .then((total) => {
        const idx = Math.min(7, Cypress._.random(0, total - 1));
        cy.get('.ant-select-dropdown')
          .last()
          .find('.ant-select-item-option')
          .eq(idx)
          .click();
      });

    /* ── Validate recipient‑received amount ───────────────────── */
    cy.get(':nth-child(3) > :nth-child(2) > .ant-typography')
    .invoke('text')
    .then((uiText) => {
      const trimmedUiText = uiText.trim();
      cy.wrap(trimmedUiText).as('uiReceives');
    });

  // Compare UI vs API value
  cy.get('@recipientReceives').then((recipientReceives) => {
    cy.get('@uiReceives').then((uiReceives) => {
      cy.log(`UI: ${uiReceives}, API: ${recipientReceives}`);
      expect(uiReceives).to.eq(recipientReceives);
    });
  });


    // ─────────────── Confirmation Screens ───────────────
    cy.get('.ant-col > .ant-btn > span').should('be.visible').click();

  cy.get('.ant-modal-body > :nth-child(1) > .ant-col > .ant-typography')
    .should('be.visible')
    .and('contain.text', 'Payment Confirmation');

  cy.get('@recipientReceives').then((recipientReceives) => {
    cy.get(':nth-child(4) > .ant-col-8 > .ant-typography')
      .should('be.visible')
      .and('contain.text', recipientReceives);
  });

  // Pay recipient
  cy.get(
    '.ant-row-center.m-t-20 > .ant-col > .ant-space > :nth-child(2) > .ant-btn'
  )
    .should('be.visible')
    .click();

  cy.get('.ant-modal-body > :nth-child(1) > .ant-col')
    .should('be.visible')
    .and('contain.text', ' Payment Booked - ');

  cy.get('@recipientReceives').then((recipientReceives) => {
    cy.get(':nth-child(5) > .ant-col-8 > .ant-typography')
      .should('be.visible')
      .and('contain.text', recipientReceives);
  });
    })
    it('TC-AC-052 - Verify that if Currency= EUR and Country = UNITED KINGDOM & client = UK and check priority and regular settlement are enabled and make a payment with GBP using Push Funds',function () {
    // ─────────────── Setup & Recipient Creation ───────────────
        signin.Login(userName, password)
        newRecipient.goToPaymentsDashborad()
        newRecipient.gotoRecipientList()
        let email = batchPayments.generateRandomString(5)+ '@yopmail.com'
        newRecipient.addRecipient('UNITED KINGDOM{enter}' ,'EUR{enter}',email)
        newRecipient.addBankDetails('GB73BARC20039538243547','AFFLGB22')
        newRecipient.individualRecipient('UK EUR','UNITED KINGDOM{enter}')
        newRecipient.saveRecipient()
        newRecipient.checkSettelmentEnabledBoth('be.enabled','be.enabled')

    // ─────────────── Payment Flow ───────────────
    newPayment.proceedflow('{enter}', 'GBP');
    const amount = '10';
    newPayment.addrecipientDetail(amount, email);
    newPayment.selectFundingMethod('Push Funds');
      const apiEnv = this.apiEnv;
    // ───── Intercept Quote API ─────
  cy.intercept(
  'POST',
  '**/VolopaApiOauth2WebApp*/exchange/b2b/self/quote/temp'
).as('quoteApi');

  // ───── Wait for API and Compare Values ─────
  cy.wait('@quoteApi').then(({ response }) => {
    const receive = response.body.data.receive;
    const recipientReceives = response.body.data.recipient[0].receives;

    cy.wrap(recipientReceives).as('recipientReceives');
    cy.log(`Receive: ${receive}`);
    cy.log(`Recipient Receives: ${recipientReceives}`);

    expect(receive).to.eq(recipientReceives); // Final comparison
  });

    /* ── Validate payment‑reason field ───────────────────────── */
    // 1️⃣ Ensure the field starts empty
    cy.get('.ant-select-selector')
      .eq(2)
      .should(($el) => {
        expect(
          $el.text().trim(),
          'reason field should start empty'
        ).to.equal('');
      })
      .click(); // open dropdown

    // 2️⃣ Pick a random option between 1 and 10
    cy.get('.ant-select-dropdown')
      .last()
      .find('.ant-select-item-option')
      .its('length')
      .then((total) => {
        const idx = Math.min(7, Cypress._.random(0, total - 1));
        cy.get('.ant-select-dropdown')
          .last()
          .find('.ant-select-item-option')
          .eq(idx)
          .click();
      });

    /* ── Validate recipient‑received amount ───────────────────── */
    cy.get(':nth-child(3) > :nth-child(2) > .ant-typography')
    .invoke('text')
    .then((uiText) => {
      const trimmedUiText = uiText.trim();
      cy.wrap(trimmedUiText).as('uiReceives');
    });

  // Compare UI vs API value
  cy.get('@recipientReceives').then((recipientReceives) => {
    cy.get('@uiReceives').then((uiReceives) => {
      cy.log(`UI: ${uiReceives}, API: ${recipientReceives}`);
      expect(uiReceives).to.eq(recipientReceives);
    });
  });


    // ─────────────── Confirmation Screens ───────────────
    cy.get('.ant-col > .ant-btn > span').should('be.visible').click();

  cy.get('.ant-modal-body > :nth-child(1) > .ant-col > .ant-typography')
    .should('be.visible')
    .and('contain.text', 'Payment Confirmation');

  cy.get('@recipientReceives').then((recipientReceives) => {
    cy.get(':nth-child(4) > .ant-col-8 > .ant-typography')
      .should('be.visible')
      .and('contain.text', recipientReceives);
  });

  // Pay recipient
  cy.get(
    '.ant-row-center.m-t-20 > .ant-col > .ant-space > :nth-child(2) > .ant-btn'
  )
    .should('be.visible')
    .click();

  cy.get('.ant-modal-body > :nth-child(1) > .ant-col')
    .should('be.visible')
    .and('contain.text', ' Payment Booked - ');

  cy.get('@recipientReceives').then((recipientReceives) => {
    cy.get(':nth-child(5) > .ant-col-8 > .ant-typography')
      .should('be.visible')
      .and('contain.text', recipientReceives);
  });
    })
    it('TC-AC-053 - Verify that if Currency= EUR and Country = Spain & client = UK and check priority and regular both settlement are enabled and make a payment with GBP using Push Funds',function () {
    // ─────────────── Setup & Recipient Creation ───────────────
        signin.Login(userName, password)
        newRecipient.goToPaymentsDashborad()
        newRecipient.gotoRecipientList()
        let email = batchPayments.generateRandomString(5)+ '@yopmail.com'
        newRecipient.addRecipient('SPain{enter}' ,'EUR{enter}',email)
        newRecipient.addBankDetails('ES7921000813610123456789','CAIXESBBXXX')
        newRecipient.individualRecipient('Spain EUR','Spain{enter}')
        newRecipient.saveRecipient()
        newRecipient.checkSettelmentEnabledBoth('be.enabled','be.enabled')

    // ─────────────── Payment Flow ───────────────
    newPayment.proceedflow('{enter}', 'GBP');
    const amount = '10';
    newPayment.addrecipientDetail(amount, email);
    newPayment.selectFundingMethod('Push Funds');
      const apiEnv = this.apiEnv;
    // ───── Intercept Quote API ─────
  cy.intercept(
  'POST',
  '**/VolopaApiOauth2WebApp*/exchange/b2b/self/quote/temp'
).as('quoteApi');

  // ───── Wait for API and Compare Values ─────
  cy.wait('@quoteApi').then(({ response }) => {
    const receive = response.body.data.receive;
    const recipientReceives = response.body.data.recipient[0].receives;

    cy.wrap(recipientReceives).as('recipientReceives');
    cy.log(`Receive: ${receive}`);
    cy.log(`Recipient Receives: ${recipientReceives}`);

    expect(receive).to.eq(recipientReceives); // Final comparison
  });

    /* ── Validate payment‑reason field ───────────────────────── */
    // 1️⃣ Ensure the field starts empty
    cy.get('.ant-select-selector')
      .eq(2)
      .should(($el) => {
        expect(
          $el.text().trim(),
          'reason field should start empty'
        ).to.equal('');
      })
      .click(); // open dropdown

    // 2️⃣ Pick a random option between 1 and 10
    cy.get('.ant-select-dropdown')
      .last()
      .find('.ant-select-item-option')
      .its('length')
      .then((total) => {
        const idx = Math.min(7, Cypress._.random(0, total - 1));
        cy.get('.ant-select-dropdown')
          .last()
          .find('.ant-select-item-option')
          .eq(idx)
          .click();
      });

    /* ── Validate recipient‑received amount ───────────────────── */
    cy.get(':nth-child(3) > :nth-child(2) > .ant-typography')
    .invoke('text')
    .then((uiText) => {
      const trimmedUiText = uiText.trim();
      cy.wrap(trimmedUiText).as('uiReceives');
    });

  // Compare UI vs API value
  cy.get('@recipientReceives').then((recipientReceives) => {
    cy.get('@uiReceives').then((uiReceives) => {
      cy.log(`UI: ${uiReceives}, API: ${recipientReceives}`);
      expect(uiReceives).to.eq(recipientReceives);
    });
  });


    // ─────────────── Confirmation Screens ───────────────
    cy.get('.ant-col > .ant-btn > span').should('be.visible').click();

  cy.get('.ant-modal-body > :nth-child(1) > .ant-col > .ant-typography')
    .should('be.visible')
    .and('contain.text', 'Payment Confirmation');

  cy.get('@recipientReceives').then((recipientReceives) => {
    cy.get(':nth-child(4) > .ant-col-8 > .ant-typography')
      .should('be.visible')
      .and('contain.text', recipientReceives);
  });

  // Pay recipient
  cy.get(
    '.ant-row-center.m-t-20 > .ant-col > .ant-space > :nth-child(2) > .ant-btn'
  )
    .should('be.visible')
    .click();

  cy.get('.ant-modal-body > :nth-child(1) > .ant-col')
    .should('be.visible')
    .and('contain.text', ' Payment Booked - ');

  cy.get('@recipientReceives').then((recipientReceives) => {
    cy.get(':nth-child(5) > .ant-col-8 > .ant-typography')
      .should('be.visible')
      .and('contain.text', recipientReceives);
  });
    })
    it('TC-AC-054 - Verify that if Currency= AUD and Country = UNITED KINGDOM & client = UK and check priority settlement is enabled and make a payment with GBP using Push Funds',function () {
    // ─────────────── Setup & Recipient Creation ───────────────
        signin.Login(userName, password)
        newRecipient.goToPaymentsDashborad()
        newRecipient.gotoRecipientList()
        let email = batchPayments.generateRandomString(5)+ '@yopmail.com'
        newRecipient.addRecipient('UNITED KINGDOM{enter}' ,'AUD{enter}',email)
        newRecipient.addBankDetails('GB73BARC20039538243547','AFFLGB22')
        newRecipient.individualRecipient('UK AUD','UNITED KINGDOM{enter}')
        newRecipient.saveRecipient()
        newRecipient.checkSettelment('be.disabled','be.enabled')

    // ─────────────── Payment Flow ───────────────
    newPayment.proceedflow('{downarrow}{enter}', 'GBP');
    const amount = '10';
    newPayment.addrecipientDetail(amount, email);
    newPayment.selectFundingMethod('Push Funds');
      const apiEnv = this.apiEnv;
    // ───── Intercept Quote API ─────
  cy.intercept(
  'POST',
  '**/VolopaApiOauth2WebApp*/exchange/b2b/self/quote/temp'
).as('quoteApi');

  // ───── Wait for API and Compare Values ─────
  cy.wait('@quoteApi').then(({ response }) => {
    const receive = response.body.data.receive;
    const recipientReceives = response.body.data.recipient[0].receives;

    cy.wrap(recipientReceives).as('recipientReceives');
    cy.log(`Receive: ${receive}`);
    cy.log(`Recipient Receives: ${recipientReceives}`);

    expect(receive).to.eq(recipientReceives); // Final comparison
  });

    /* ── Validate payment‑reason field ───────────────────────── */
    // 1️⃣ Ensure the field starts empty
    cy.get('.ant-select-selector')
      .eq(2)
      .should(($el) => {
        expect(
          $el.text().trim(),
          'reason field should start empty'
        ).to.equal('');
      })
      .click(); // open dropdown

    // 2️⃣ Pick a random option between 1 and 10
    cy.get('.ant-select-dropdown')
      .last()
      .find('.ant-select-item-option')
      .its('length')
      .then((total) => {
        const idx = Math.min(7, Cypress._.random(0, total - 1));
        cy.get('.ant-select-dropdown')
          .last()
          .find('.ant-select-item-option')
          .eq(idx)
          .click();
      });

    /* ── Validate recipient‑received amount ───────────────────── */
   cy.get(':nth-child(3) > :nth-child(2) > .ant-typography')
    .invoke('text')
    .then((uiText) => {
      const trimmedUiText = uiText.trim();
      cy.wrap(trimmedUiText).as('uiReceives');
    });

  // Compare UI vs API value
  cy.get('@recipientReceives').then((recipientReceives) => {
    cy.get('@uiReceives').then((uiReceives) => {
      cy.log(`UI: ${uiReceives}, API: ${recipientReceives}`);
      expect(uiReceives).to.eq(recipientReceives);
    });
  });


    // ─────────────── Confirmation Screens ───────────────
    cy.get('.ant-col > .ant-btn > span').should('be.visible').click();

  cy.get('.ant-modal-body > :nth-child(1) > .ant-col > .ant-typography')
    .should('be.visible')
    .and('contain.text', 'Payment Confirmation');

  cy.get('@recipientReceives').then((recipientReceives) => {
    cy.get(':nth-child(4) > .ant-col-8 > .ant-typography')
      .should('be.visible')
      .and('contain.text', recipientReceives);
  });

  // Pay recipient
  cy.get(
    '.ant-row-center.m-t-20 > .ant-col > .ant-space > :nth-child(2) > .ant-btn'
  )
    .should('be.visible')
    .click();

  cy.get('.ant-modal-body > :nth-child(1) > .ant-col')
    .should('be.visible')
    .and('contain.text', ' Payment Booked - ');

  cy.get('@recipientReceives').then((recipientReceives) => {
    cy.get(':nth-child(5) > .ant-col-8 > .ant-typography')
      .should('be.visible')
      .and('contain.text', recipientReceives);
  });
    })
    it('TC-AC-055 - Verify that if Currency= AUD and Country = Australia & client = UK and check priority and regular both settlement are enabled and make a payment with GBP using Push Funds',function () {
    // ─────────────── Setup & Recipient Creation ───────────────
        signin.Login(userName, password)
        newRecipient.goToPaymentsDashborad()
        newRecipient.gotoRecipientList()
        let email = batchPayments.generateRandomString(5)+ '@yopmail.com'
        newRecipient.addRecipient('Australia{enter}' ,'AUD{enter}',email)
        newRecipient.addBankDetailsWithAccNo('ANZBAU3MXXX','011401533')
        cy.get('#bsb').should('be.visible').type('462541')
        newRecipient.individualRecipient('Australia AUD','Australia{enter}')
        newRecipient.saveRecipient()
        newRecipient.checkSettelmentEnabledBoth('be.enabled','be.enabled')

    // ─────────────── Payment Flow ───────────────
    newPayment.proceedflow('{downarrow}{enter}', 'GBP');
    const amount = '10';
    newPayment.addrecipientDetail(amount, email);
    newPayment.selectFundingMethod('Push Funds');
      const apiEnv = this.apiEnv;
    // ───── Intercept Quote API ─────
  cy.intercept(
  'POST',
  '**/VolopaApiOauth2WebApp*/exchange/b2b/self/quote/temp'
).as('quoteApi');

  // ───── Wait for API and Compare Values ─────
  cy.wait('@quoteApi').then(({ response }) => {
    const receive = response.body.data.receive;
    const recipientReceives = response.body.data.recipient[0].receives;

    cy.wrap(recipientReceives).as('recipientReceives');
    cy.log(`Receive: ${receive}`);
    cy.log(`Recipient Receives: ${recipientReceives}`);

    expect(receive).to.eq(recipientReceives); // Final comparison
  });

    /* ── Validate payment‑reason field ───────────────────────── */
    // 1️⃣ Ensure the field starts empty
    cy.get('.ant-select-selector')
      .eq(2)
      .should(($el) => {
        expect(
          $el.text().trim(),
          'reason field should start empty'
        ).to.equal('');
      })
      .click(); // open dropdown

    // 2️⃣ Pick a random option between 1 and 10
    cy.get('.ant-select-dropdown')
      .last()
      .find('.ant-select-item-option')
      .its('length')
      .then((total) => {
        const idx = Math.min(7, Cypress._.random(0, total - 1));
        cy.get('.ant-select-dropdown')
          .last()
          .find('.ant-select-item-option')
          .eq(idx)
          .click();
      });

    /* ── Validate recipient‑received amount ───────────────────── */
    cy.get(':nth-child(3) > :nth-child(2) > .ant-typography')
    .invoke('text')
    .then((uiText) => {
      const trimmedUiText = uiText.trim();
      cy.wrap(trimmedUiText).as('uiReceives');
    });

  // Compare UI vs API value
  cy.get('@recipientReceives').then((recipientReceives) => {
    cy.get('@uiReceives').then((uiReceives) => {
      cy.log(`UI: ${uiReceives}, API: ${recipientReceives}`);
      expect(uiReceives).to.eq(recipientReceives);
    });
  });


    // ─────────────── Confirmation Screens ───────────────
    cy.get('.ant-col > .ant-btn > span').should('be.visible').click();

  cy.get('.ant-modal-body > :nth-child(1) > .ant-col > .ant-typography')
    .should('be.visible')
    .and('contain.text', 'Payment Confirmation');

  cy.get('@recipientReceives').then((recipientReceives) => {
    cy.get(':nth-child(4) > .ant-col-8 > .ant-typography')
      .should('be.visible')
      .and('contain.text', recipientReceives);
  });

  // Pay recipient
  cy.get(
    '.ant-row-center.m-t-20 > .ant-col > .ant-space > :nth-child(2) > .ant-btn'
  )
    .should('be.visible')
    .click();

  cy.get('.ant-modal-body > :nth-child(1) > .ant-col')
    .should('be.visible')
    .and('contain.text', ' Payment Booked - ');

  cy.get('@recipientReceives').then((recipientReceives) => {
    cy.get(':nth-child(5) > .ant-col-8 > .ant-typography')
      .should('be.visible')
      .and('contain.text', recipientReceives);
  });
    })
    it('TC-AC-056 - Verify that if Currency= CHF and Country = UNITED KINGDOM & client = UK and check priority settlement is enabled and make a payment with GBP using Push Funds',function () {
    // ─────────────── Setup & Recipient Creation ───────────────
        signin.Login(userName, password)
        newRecipient.goToPaymentsDashborad()
        newRecipient.gotoRecipientList()
        let email = batchPayments.generateRandomString(5)+ '@yopmail.com'
        newRecipient.addRecipient('UNITED KINGDOM{enter}' ,'CHF{enter}',email)
        newRecipient.addBankDetails('GB73BARC20039538243547','AFFLGB22')
        newRecipient.individualRecipient('UK CHF','UNITED KINGDOM{enter}')
        newRecipient.saveRecipient()
        newRecipient.checkSettelment('be.disabled','be.enabled')

    // ─────────────── Payment Flow ───────────────
    newPayment.proceedflow('{downarrow}{enter}', 'GBP');
    const amount = '10';
    newPayment.addrecipientDetail(amount, email);
    newPayment.selectFundingMethod('Push Funds');
      const apiEnv = this.apiEnv;
    // ───── Intercept Quote API ─────
  cy.intercept(
  'POST',
  '**/VolopaApiOauth2WebApp*/exchange/b2b/self/quote/temp'
).as('quoteApi');

  // ───── Wait for API and Compare Values ─────
  cy.wait('@quoteApi').then(({ response }) => {
    const receive = response.body.data.receive;
    const recipientReceives = response.body.data.recipient[0].receives;

    cy.wrap(recipientReceives).as('recipientReceives');
    cy.log(`Receive: ${receive}`);
    cy.log(`Recipient Receives: ${recipientReceives}`);

    expect(receive).to.eq(recipientReceives); // Final comparison
  });

    /* ── Validate payment‑reason field ───────────────────────── */
    // 1️⃣ Ensure the field starts empty
    cy.get('.ant-select-selector')
      .eq(2)
      .should(($el) => {
        expect(
          $el.text().trim(),
          'reason field should start empty'
        ).to.equal('');
      })
      .click(); // open dropdown

    // 2️⃣ Pick a random option between 1 and 10
    cy.get('.ant-select-dropdown')
      .last()
      .find('.ant-select-item-option')
      .its('length')
      .then((total) => {
        const idx = Math.min(7, Cypress._.random(0, total - 1));
        cy.get('.ant-select-dropdown')
          .last()
          .find('.ant-select-item-option')
          .eq(idx)
          .click();
      });

    /* ── Validate recipient‑received amount ───────────────────── */
    cy.get(':nth-child(3) > :nth-child(2) > .ant-typography')
    .invoke('text')
    .then((uiText) => {
      const trimmedUiText = uiText.trim();
      cy.wrap(trimmedUiText).as('uiReceives');
    });

  // Compare UI vs API value
  cy.get('@recipientReceives').then((recipientReceives) => {
    cy.get('@uiReceives').then((uiReceives) => {
      cy.log(`UI: ${uiReceives}, API: ${recipientReceives}`);
      expect(uiReceives).to.eq(recipientReceives);
    });
  });


    // ─────────────── Confirmation Screens ───────────────
    cy.get('.ant-col > .ant-btn > span').should('be.visible').click();

  cy.get('.ant-modal-body > :nth-child(1) > .ant-col > .ant-typography')
    .should('be.visible')
    .and('contain.text', 'Payment Confirmation');

  cy.get('@recipientReceives').then((recipientReceives) => {
    cy.get(':nth-child(4) > .ant-col-8 > .ant-typography')
      .should('be.visible')
      .and('contain.text', recipientReceives);
  });

  // Pay recipient
  cy.get(
    '.ant-row-center.m-t-20 > .ant-col > .ant-space > :nth-child(2) > .ant-btn'
  )
    .should('be.visible')
    .click();

  cy.get('.ant-modal-body > :nth-child(1) > .ant-col')
    .should('be.visible')
    .and('contain.text', ' Payment Booked - ');

  cy.get('@recipientReceives').then((recipientReceives) => {
    cy.get(':nth-child(5) > .ant-col-8 > .ant-typography')
      .should('be.visible')
      .and('contain.text', recipientReceives);
  });
    })
    it('TC-AC-057 - Verify that if Currency= CHF and Country = Switzerland & client = UK and check priority settlement is enabled and make a payment with GBP using Push Funds',function () {
    // ─────────────── Setup & Recipient Creation ───────────────
        signin.Login(userName, password)
        newRecipient.goToPaymentsDashborad()
        newRecipient.gotoRecipientList()
        let email = batchPayments.generateRandomString(5)+ '@yopmail.com'
        newRecipient.addRecipient('Switzerland{enter}' ,'CHF{enter}',email)
        newRecipient.addBankDetails('CH5604835012345678009','UBSWCHZH80A')
        newRecipient.individualRecipient('Switzerland CHF','Switzerland{enter}')
        newRecipient.saveRecipient()
        newRecipient.checkSettelment('be.disabled','be.enabled')

    // ─────────────── Payment Flow ───────────────
    newPayment.proceedflow('{downarrow}{enter}', 'GBP');
    const amount = '10';
    newPayment.addrecipientDetail(amount, email);
    newPayment.selectFundingMethod('Push Funds');
      const apiEnv = this.apiEnv;
    // ───── Intercept Quote API ─────
  cy.intercept(
  'POST',
  '**/VolopaApiOauth2WebApp*/exchange/b2b/self/quote/temp'
).as('quoteApi');

  // ───── Wait for API and Compare Values ─────
  cy.wait('@quoteApi').then(({ response }) => {
    const receive = response.body.data.receive;
    const recipientReceives = response.body.data.recipient[0].receives;

    cy.wrap(recipientReceives).as('recipientReceives');
    cy.log(`Receive: ${receive}`);
    cy.log(`Recipient Receives: ${recipientReceives}`);

    expect(receive).to.eq(recipientReceives); // Final comparison
  });

    /* ── Validate payment‑reason field ───────────────────────── */
    // 1️⃣ Ensure the field starts empty
    cy.get('.ant-select-selector')
      .eq(2)
      .should(($el) => {
        expect(
          $el.text().trim(),
          'reason field should start empty'
        ).to.equal('');
      })
      .click(); // open dropdown

    // 2️⃣ Pick a random option between 1 and 10
    cy.get('.ant-select-dropdown')
      .last()
      .find('.ant-select-item-option')
      .its('length')
      .then((total) => {
        const idx = Math.min(7, Cypress._.random(0, total - 1));
        cy.get('.ant-select-dropdown')
          .last()
          .find('.ant-select-item-option')
          .eq(idx)
          .click();
      });

    /* ── Validate recipient‑received amount ───────────────────── */
    cy.get(':nth-child(3) > :nth-child(2) > .ant-typography')
    .invoke('text')
    .then((uiText) => {
      const trimmedUiText = uiText.trim();
      cy.wrap(trimmedUiText).as('uiReceives');
    });

  // Compare UI vs API value
  cy.get('@recipientReceives').then((recipientReceives) => {
    cy.get('@uiReceives').then((uiReceives) => {
      cy.log(`UI: ${uiReceives}, API: ${recipientReceives}`);
      expect(uiReceives).to.eq(recipientReceives);
    });
  });


    // ─────────────── Confirmation Screens ───────────────
   cy.get('.ant-col > .ant-btn > span').should('be.visible').click();

  cy.get('.ant-modal-body > :nth-child(1) > .ant-col > .ant-typography')
    .should('be.visible')
    .and('contain.text', 'Payment Confirmation');

  cy.get('@recipientReceives').then((recipientReceives) => {
    cy.get(':nth-child(4) > .ant-col-8 > .ant-typography')
      .should('be.visible')
      .and('contain.text', recipientReceives);
  });

  // Pay recipient
  cy.get(
    '.ant-row-center.m-t-20 > .ant-col > .ant-space > :nth-child(2) > .ant-btn'
  )
    .should('be.visible')
    .click();

  cy.get('.ant-modal-body > :nth-child(1) > .ant-col')
    .should('be.visible')
    .and('contain.text', ' Payment Booked - ');

  cy.get('@recipientReceives').then((recipientReceives) => {
    cy.get(':nth-child(5) > .ant-col-8 > .ant-typography')
      .should('be.visible')
      .and('contain.text', recipientReceives);
  });
    })
    it('TC-AC-058 - Verify that if Currency= THB and Country = UNITED KINGDOM & client = UK and check priority settlement is enabled and make a payment with GBP using Push Funds',function () {
    // ─────────────── Setup & Recipient Creation ───────────────
        signin.Login(userName, password)
        newRecipient.goToPaymentsDashborad()
        newRecipient.gotoRecipientList()
        let email = batchPayments.generateRandomString(5)+ '@yopmail.com'
        newRecipient.addRecipient('UNITED KINGDOM{enter}' ,'THB{enter}',email)
        newRecipient.addBankDetails('GB73BARC20039538243547','AFFLGB22')
        newRecipient.individualRecipient('UK THB','UNITED KINGDOM{enter}')
        newRecipient.saveRecipient()
        newRecipient.checkSettelment('be.disabled','be.enabled')

    // ─────────────── Payment Flow ───────────────
    newPayment.proceedflow('{downarrow}{enter}', 'GBP');
    const amount = '10';
    newPayment.addrecipientDetail(amount, email);
    newPayment.selectFundingMethod('Push Funds');
      const apiEnv = this.apiEnv;
    // ───── Intercept Quote API ─────
  cy.intercept(
  'POST',
  '**/VolopaApiOauth2WebApp*/exchange/b2b/self/quote/temp'
).as('quoteApi');

  // ───── Wait for API and Compare Values ─────
  cy.wait('@quoteApi').then(({ response }) => {
    const receive = response.body.data.receive;
    const recipientReceives = response.body.data.recipient[0].receives;

    cy.wrap(recipientReceives).as('recipientReceives');
    cy.log(`Receive: ${receive}`);
    cy.log(`Recipient Receives: ${recipientReceives}`);

    expect(receive).to.eq(recipientReceives); // Final comparison
  });

    /* ── Validate payment‑reason field ───────────────────────── */
    // 1️⃣ Ensure the field starts empty
    cy.get('.ant-select-selector')
      .eq(2)
      .should(($el) => {
        expect(
          $el.text().trim(),
          'reason field should start empty'
        ).to.equal('');
      })
      .click(); // open dropdown

    // 2️⃣ Pick a random option between 1 and 10
    cy.get('.ant-select-dropdown')
      .last()
      .find('.ant-select-item-option')
      .its('length')
      .then((total) => {
        const idx = Math.min(7, Cypress._.random(0, total - 1));
        cy.get('.ant-select-dropdown')
          .last()
          .find('.ant-select-item-option')
          .eq(idx)
          .click();
      });

    /* ── Validate recipient‑received amount ───────────────────── */
    cy.get(':nth-child(3) > :nth-child(2) > .ant-typography')
    .invoke('text')
    .then((uiText) => {
      const trimmedUiText = uiText.trim();
      cy.wrap(trimmedUiText).as('uiReceives');
    });

  // Compare UI vs API value
  cy.get('@recipientReceives').then((recipientReceives) => {
    cy.get('@uiReceives').then((uiReceives) => {
      cy.log(`UI: ${uiReceives}, API: ${recipientReceives}`);
      expect(uiReceives).to.eq(recipientReceives);
    });
  });


    // ─────────────── Confirmation Screens ───────────────
    cy.get('.ant-col > .ant-btn > span').should('be.visible').click();

  cy.get('.ant-modal-body > :nth-child(1) > .ant-col > .ant-typography')
    .should('be.visible')
    .and('contain.text', 'Payment Confirmation');

  cy.get('@recipientReceives').then((recipientReceives) => {
    cy.get(':nth-child(4) > .ant-col-8 > .ant-typography')
      .should('be.visible')
      .and('contain.text', recipientReceives);
  });

  // Pay recipient
  cy.get(
    '.ant-row-center.m-t-20 > .ant-col > .ant-space > :nth-child(2) > .ant-btn'
  )
    .should('be.visible')
    .click();

  cy.get('.ant-modal-body > :nth-child(1) > .ant-col')
    .should('be.visible')
    .and('contain.text', ' Payment Booked - ');

  cy.get('@recipientReceives').then((recipientReceives) => {
    cy.get(':nth-child(5) > .ant-col-8 > .ant-typography')
      .should('be.visible')
      .and('contain.text', recipientReceives);
  });
    })
    it('TC-AC-059 - Verify that if Currency= THB and Country = Thailand & client = UK and check priority settlement is enabled and make a payment with GBP using Push Funds',function () {
    // ─────────────── Setup & Recipient Creation ───────────────
        signin.Login(userName, password)
        newRecipient.goToPaymentsDashborad()
        newRecipient.gotoRecipientList()
        let email = batchPayments.generateRandomString(5)+ '@yopmail.com'
        newRecipient.addRecipient('Thailand{enter}' ,'THB{enter}',email)
        newRecipient.addBankDetailsWithAccNo('BKKBTHBK','0114015331')
        newRecipient.individualRecipient('Thailand THB','Thailand{enter}')
        newRecipient.saveRecipient()
        newRecipient.checkSettelment('be.disabled','be.enabled')

    // ─────────────── Payment Flow ───────────────
    newPayment.proceedflow('{downarrow}{enter}', 'GBP');
    const amount = '10';
    newPayment.addrecipientDetail(amount, email);
    newPayment.selectFundingMethod('Push Funds');
      const apiEnv = this.apiEnv;
    // ───── Intercept Quote API ─────
  cy.intercept(
  'POST',
  '**/VolopaApiOauth2WebApp*/exchange/b2b/self/quote/temp'
).as('quoteApi');

  // ───── Wait for API and Compare Values ─────
  cy.wait('@quoteApi').then(({ response }) => {
    const receive = response.body.data.receive;
    const recipientReceives = response.body.data.recipient[0].receives;

    cy.wrap(recipientReceives).as('recipientReceives');
    cy.log(`Receive: ${receive}`);
    cy.log(`Recipient Receives: ${recipientReceives}`);

    expect(receive).to.eq(recipientReceives); // Final comparison
  });

    /* ── Validate payment‑reason field ───────────────────────── */
    // 1️⃣ Ensure the field starts empty
    cy.get('.ant-select-selector')
      .eq(2)
      .should(($el) => {
        expect(
          $el.text().trim(),
          'reason field should start empty'
        ).to.equal('');
      })
      .click(); // open dropdown

    // 2️⃣ Pick a random option between 1 and 10
    cy.get('.ant-select-dropdown')
      .last()
      .find('.ant-select-item-option')
      .its('length')
      .then((total) => {
        const idx = Math.min(7, Cypress._.random(0, total - 1));
        cy.get('.ant-select-dropdown')
          .last()
          .find('.ant-select-item-option')
          .eq(idx)
          .click();
      });

    /* ── Validate recipient‑received amount ───────────────────── */
    cy.get(':nth-child(3) > :nth-child(2) > .ant-typography')
    .invoke('text')
    .then((uiText) => {
      const trimmedUiText = uiText.trim();
      cy.wrap(trimmedUiText).as('uiReceives');
    });

  // Compare UI vs API value
  cy.get('@recipientReceives').then((recipientReceives) => {
    cy.get('@uiReceives').then((uiReceives) => {
      cy.log(`UI: ${uiReceives}, API: ${recipientReceives}`);
      expect(uiReceives).to.eq(recipientReceives);
    });
  });


    // ─────────────── Confirmation Screens ───────────────
    cy.get('.ant-col > .ant-btn > span').should('be.visible').click();

  cy.get('.ant-modal-body > :nth-child(1) > .ant-col > .ant-typography')
    .should('be.visible')
    .and('contain.text', 'Payment Confirmation');

  cy.get('@recipientReceives').then((recipientReceives) => {
    cy.get(':nth-child(4) > .ant-col-8 > .ant-typography')
      .should('be.visible')
      .and('contain.text', recipientReceives);
  });

  // Pay recipient
  cy.get(
    '.ant-row-center.m-t-20 > .ant-col > .ant-space > :nth-child(2) > .ant-btn'
  )
    .should('be.visible')
    .click();

  cy.get('.ant-modal-body > :nth-child(1) > .ant-col')
    .should('be.visible')
    .and('contain.text', ' Payment Booked - ');

  cy.get('@recipientReceives').then((recipientReceives) => {
    cy.get(':nth-child(5) > .ant-col-8 > .ant-typography')
      .should('be.visible')
      .and('contain.text', recipientReceives);
  });
    })
    it('TC-AC-060 - Verify that if Currency= HKD and Country = UNITED KINGDOM & client = UK and check priority settlement is enabled and make a payment with GBP using Push Funds',function () {
    // ─────────────── Setup & Recipient Creation ───────────────
        signin.Login(userName, password)
        newRecipient.goToPaymentsDashborad()
        newRecipient.gotoRecipientList()
        let email = batchPayments.generateRandomString(5)+ '@yopmail.com'
        newRecipient.addRecipient('UNITED KINGDOM{enter}' ,'HKD{enter}',email)
        newRecipient.addBankDetails('GB73BARC20039538243547','AFFLGB22')
        newRecipient.individualRecipient('UK HKD','UNITED KINGDOM{enter}')
        newRecipient.saveRecipient()
        newRecipient.checkSettelment('be.disabled','be.enabled')

    // ─────────────── Payment Flow ───────────────
    newPayment.proceedflow('{downarrow}{enter}', 'GBP');
    const amount = '10';
    newPayment.addrecipientDetail(amount, email);
    newPayment.selectFundingMethod('Push Funds');
      const apiEnv = this.apiEnv;
    // ───── Intercept Quote API ─────
  cy.intercept(
  'POST',
  '**/VolopaApiOauth2WebApp*/exchange/b2b/self/quote/temp'
).as('quoteApi');

  // ───── Wait for API and Compare Values ─────
  cy.wait('@quoteApi').then(({ response }) => {
    const receive = response.body.data.receive;
    const recipientReceives = response.body.data.recipient[0].receives;

    cy.wrap(recipientReceives).as('recipientReceives');
    cy.log(`Receive: ${receive}`);
    cy.log(`Recipient Receives: ${recipientReceives}`);

    expect(receive).to.eq(recipientReceives); // Final comparison
  });

    /* ── Validate payment‑reason field ───────────────────────── */
    // 1️⃣ Ensure the field starts empty
    cy.get('.ant-select-selector')
      .eq(2)
      .should(($el) => {
        expect(
          $el.text().trim(),
          'reason field should start empty'
        ).to.equal('');
      })
      .click(); // open dropdown

    // 2️⃣ Pick a random option between 1 and 10
    cy.get('.ant-select-dropdown')
      .last()
      .find('.ant-select-item-option')
      .its('length')
      .then((total) => {
        const idx = Math.min(7, Cypress._.random(0, total - 1));
        cy.get('.ant-select-dropdown')
          .last()
          .find('.ant-select-item-option')
          .eq(idx)
          .click();
      });

    /* ── Validate recipient‑received amount ───────────────────── */
    cy.get(':nth-child(3) > :nth-child(2) > .ant-typography')
    .invoke('text')
    .then((uiText) => {
      const trimmedUiText = uiText.trim();
      cy.wrap(trimmedUiText).as('uiReceives');
    });

  // Compare UI vs API value
  cy.get('@recipientReceives').then((recipientReceives) => {
    cy.get('@uiReceives').then((uiReceives) => {
      cy.log(`UI: ${uiReceives}, API: ${recipientReceives}`);
      expect(uiReceives).to.eq(recipientReceives);
    });
  });


    // ─────────────── Confirmation Screens ───────────────
    cy.get('.ant-col > .ant-btn > span').should('be.visible').click();

  cy.get('.ant-modal-body > :nth-child(1) > .ant-col > .ant-typography')
    .should('be.visible')
    .and('contain.text', 'Payment Confirmation');

  cy.get('@recipientReceives').then((recipientReceives) => {
    cy.get(':nth-child(4) > .ant-col-8 > .ant-typography')
      .should('be.visible')
      .and('contain.text', recipientReceives);
  });

  // Pay recipient
  cy.get(
    '.ant-row-center.m-t-20 > .ant-col > .ant-space > :nth-child(2) > .ant-btn'
  )
    .should('be.visible')
    .click();

  cy.get('.ant-modal-body > :nth-child(1) > .ant-col')
    .should('be.visible')
    .and('contain.text', ' Payment Booked - ');

  cy.get('@recipientReceives').then((recipientReceives) => {
    cy.get(':nth-child(5) > .ant-col-8 > .ant-typography')
      .should('be.visible')
      .and('contain.text', recipientReceives);
  });
    })
    it('TC-AC-061 - Verify that if Currency= HKD and Country = Hong Kong & client = UK and check priority settlement is enabled and make a payment with GBP using Push Funds',function () {
    // ─────────────── Setup & Recipient Creation ───────────────
        signin.Login(userName, password)
        newRecipient.goToPaymentsDashborad()
        newRecipient.gotoRecipientList()
        let email = batchPayments.generateRandomString(5)+ '@yopmail.com'
        newRecipient.addRecipient('Hong Kong{enter}' ,'HKD{enter}',email)
        newRecipient.addBankDetailsWithAccNo('HSBCHKHHHKH','0114015331')
        newRecipient.individualRecipient('Hong Kong HKD','Hong Kong{enter}')
        newRecipient.saveRecipient()
        newRecipient.checkSettelment('be.disabled','be.enabled')

    // ─────────────── Payment Flow ───────────────
    newPayment.proceedflow('{downarrow}{enter}', 'GBP');
    const amount = '10';
    newPayment.addrecipientDetail(amount, email);
    newPayment.selectFundingMethod('Push Funds');
      const apiEnv = this.apiEnv;
    // ───── Intercept Quote API ─────
  cy.intercept(
  'POST',
  '**/VolopaApiOauth2WebApp*/exchange/b2b/self/quote/temp'
).as('quoteApi');

  // ───── Wait for API and Compare Values ─────
  cy.wait('@quoteApi').then(({ response }) => {
    const receive = response.body.data.receive;
    const recipientReceives = response.body.data.recipient[0].receives;

    cy.wrap(recipientReceives).as('recipientReceives');
    cy.log(`Receive: ${receive}`);
    cy.log(`Recipient Receives: ${recipientReceives}`);

    expect(receive).to.eq(recipientReceives); // Final comparison
  });

    /* ── Validate payment‑reason field ───────────────────────── */
    // 1️⃣ Ensure the field starts empty
    cy.get('.ant-select-selector')
      .eq(2)
      .should(($el) => {
        expect(
          $el.text().trim(),
          'reason field should start empty'
        ).to.equal('');
      })
      .click(); // open dropdown

    // 2️⃣ Pick a random option between 1 and 10
    cy.get('.ant-select-dropdown')
      .last()
      .find('.ant-select-item-option')
      .its('length')
      .then((total) => {
        const idx = Math.min(7, Cypress._.random(0, total - 1));
        cy.get('.ant-select-dropdown')
          .last()
          .find('.ant-select-item-option')
          .eq(idx)
          .click();
      });

    /* ── Validate recipient‑received amount ───────────────────── */
    cy.get(':nth-child(3) > :nth-child(2) > .ant-typography')
    .invoke('text')
    .then((uiText) => {
      const trimmedUiText = uiText.trim();
      cy.wrap(trimmedUiText).as('uiReceives');
    });

  // Compare UI vs API value
  cy.get('@recipientReceives').then((recipientReceives) => {
    cy.get('@uiReceives').then((uiReceives) => {
      cy.log(`UI: ${uiReceives}, API: ${recipientReceives}`);
      expect(uiReceives).to.eq(recipientReceives);
    });
  });


    // ─────────────── Confirmation Screens ───────────────
    cy.get('.ant-col > .ant-btn > span').should('be.visible').click();

  cy.get('.ant-modal-body > :nth-child(1) > .ant-col > .ant-typography')
    .should('be.visible')
    .and('contain.text', 'Payment Confirmation');

  cy.get('@recipientReceives').then((recipientReceives) => {
    cy.get(':nth-child(4) > .ant-col-8 > .ant-typography')
      .should('be.visible')
      .and('contain.text', recipientReceives);
  });

  // Pay recipient
  cy.get(
    '.ant-row-center.m-t-20 > .ant-col > .ant-space > :nth-child(2) > .ant-btn'
  )
    .should('be.visible')
    .click();

  cy.get('.ant-modal-body > :nth-child(1) > .ant-col')
    .should('be.visible')
    .and('contain.text', ' Payment Booked - ');

  cy.get('@recipientReceives').then((recipientReceives) => {
    cy.get(':nth-child(5) > .ant-col-8 > .ant-typography')
      .should('be.visible')
      .and('contain.text', recipientReceives);
  });
    })
    it('TC-AC-062 - Verify that if Currency= GBP and Country = UNITED KINGDOM & client = UK and check priority and regular both settlement are enabled and make a payment with GBP using Push Funds',function () {
    // ─────────────── Setup & Recipient Creation ───────────────
        signin.Login(userName, password)
        newRecipient.goToPaymentsDashborad()
        newRecipient.gotoRecipientList()
        let email = batchPayments.generateRandomString(5)+ '@yopmail.com'
        newRecipient.addRecipient('UNITED KINGDOM{enter}' ,'GBP{enter}',email)
        newRecipient.addBankDetails('GB73BARC20039538243547','AFFLGB22')
        cy.get('#sortCode').should('be.visible').type('401276')
        cy.get('#accNumber').should('be.visible').type('56974456')
        newRecipient.individualRecipient('UK GBP','UNITED KINGDOM{enter}')
        newRecipient.saveRecipient()
        newRecipient.checkSettelmentEnabledBoth('be.enabled','be.enabled')
      // ───── Intercept Quote API ─────
   
  cy.intercept(
  'POST',
  '**/VolopaApiOauth2WebApp*/exchange/b2b/self/quote/temp'
).as('quoteApi');  

    // ─────────────── Payment Flow ───────────────
    newPayment.proceedflow('{downarrow}{enter}', 'USD');
    const amount = '10';
    newPayment.addrecipientDetail(amount, email);
    newPayment.selectFundingMethod('Push Funds');
      const apiEnv = this.apiEnv;
    

  // ───── Wait for API and Compare Values ─────
  
  cy.wait('@quoteApi', { timeout: 20000 }).then(({ response }) => {
  expect(response).to.exist;
  const receive = response.body.data.receive;
  const recipientReceives = response.body.data.recipient[0].receives;
  cy.wrap(recipientReceives).as('recipientReceives');
  cy.log(`Receive: ${receive}`);
  cy.log(`Recipient Receives: ${recipientReceives}`);

  expect(receive).to.eq(recipientReceives);
});

    /* ── Validate payment‑reason field ───────────────────────── */
    // 1️⃣ Ensure the field starts empty
    cy.get('.ant-select-selector')
      .eq(2)
      .should(($el) => {
        expect(
          $el.text().trim(),
          'reason field should start empty'
        ).to.equal('');
      })
      .click(); // open dropdown

    // 2️⃣ Pick a random option between 1 and 10
    cy.get('.ant-select-dropdown')
      .last()
      .find('.ant-select-item-option')
      .its('length')
      .then((total) => {
        const idx = Math.min(7, Cypress._.random(0, total - 1));
        cy.get('.ant-select-dropdown')
          .last()
          .find('.ant-select-item-option')
          .eq(idx)
          .click();
      });

    /* ── Validate recipient‑received amount ───────────────────── */
    cy.get(':nth-child(3) > :nth-child(2) > .ant-typography')
    .invoke('text')
    .then((uiText) => {
      const trimmedUiText = uiText.trim();
      cy.wrap(trimmedUiText).as('uiReceives');
    });

  // Compare UI vs API value
  cy.get('@recipientReceives').then((recipientReceives) => {
    cy.get('@uiReceives').then((uiReceives) => {
      cy.log(`UI: ${uiReceives}, API: ${recipientReceives}`);
      expect(uiReceives).to.eq(recipientReceives);
    });
  });


    // ─────────────── Confirmation Screens ───────────────
    cy.get('.ant-col > .ant-btn > span').should('be.visible').click();

  cy.get('.ant-modal-body > :nth-child(1) > .ant-col > .ant-typography')
    .should('be.visible')
    .and('contain.text', 'Payment Confirmation');

  cy.get('@recipientReceives').then((recipientReceives) => {
    cy.get(':nth-child(4) > .ant-col-8 > .ant-typography')
      .should('be.visible')
      .and('contain.text', recipientReceives);
  });

  // Pay recipient
  cy.get(
    '.ant-row-center.m-t-20 > .ant-col > .ant-space > :nth-child(2) > .ant-btn'
  )
    .should('be.visible')
    .click();

  cy.get('.ant-modal-body > :nth-child(1) > .ant-col')
    .should('be.visible')
    .and('contain.text', ' Payment Booked - ');

  cy.get('@recipientReceives').then((recipientReceives) => {
    cy.get(':nth-child(5) > .ant-col-8 > .ant-typography')
      .should('be.visible')
      .and('contain.text', recipientReceives);
  });
    })
    it('TC-AC-063 - Verify that if Currency= GBP and Country = UNITED KINGDOM & client = UK and check priority settlement is enabled and make a payment with GBP using Push Funds',function () {
    // ─────────────── Setup & Recipient Creation ───────────────
        signin.Login(userName, password)
        newRecipient.goToPaymentsDashborad()
        newRecipient.gotoRecipientList()
        let email = batchPayments.generateRandomString(5)+ '@yopmail.com'
        newRecipient.addRecipient('UNITED KINGDOM{enter}' ,'GBP{enter}',email)
        newRecipient.addBankDetails('GB73BARC20039538243547','AFFLGB22')
        cy.get('#sortCode').should('be.visible').type('401276')
        newRecipient.individualRecipient('UK GBP Priority','UNITED KINGDOM{enter}')
        newRecipient.saveRecipient()
        newRecipient.checkSettelment('be.disabled','be.enabled')
// ───── Intercept Quote API ─────
  cy.intercept(
  'POST',
  '**/VolopaApiOauth2WebApp*/exchange/b2b/self/quote/temp'
).as('quoteApi');
    // ─────────────── Payment Flow ───────────────
    newPayment.proceedflow('{downarrow}{enter}', 'USD');
    const amount = '10';
    newPayment.addrecipientDetail(amount, email);
    newPayment.selectFundingMethod('Push Funds');
      const apiEnv = this.apiEnv;
    

  // ───── Wait for API and Compare Values ─────
  cy.wait('@quoteApi').then(({ response }) => {
    const receive = response.body.data.receive;
    const recipientReceives = response.body.data.recipient[0].receives;

    cy.wrap(recipientReceives).as('recipientReceives');
    cy.log(`Receive: ${receive}`);
    cy.log(`Recipient Receives: ${recipientReceives}`);

    expect(receive).to.eq(recipientReceives); // Final comparison
  });

    /* ── Validate payment‑reason field ───────────────────────── */
    // 1️⃣ Ensure the field starts empty
    cy.get('.ant-select-selector')
      .eq(2)
      .should(($el) => {
        expect(
          $el.text().trim(),
          'reason field should start empty'
        ).to.equal('');
      })
      .click(); // open dropdown

    // 2️⃣ Pick a random option between 1 and 10
    cy.get('.ant-select-dropdown')
      .last()
      .find('.ant-select-item-option')
      .its('length')
      .then((total) => {
        const idx = Math.min(7, Cypress._.random(0, total - 1));
        cy.get('.ant-select-dropdown')
          .last()
          .find('.ant-select-item-option')
          .eq(idx)
          .click();
      });

    /* ── Validate recipient‑received amount ───────────────────── */
    cy.get(':nth-child(3) > :nth-child(2) > .ant-typography')
    .invoke('text')
    .then((uiText) => {
      const trimmedUiText = uiText.trim();
      cy.wrap(trimmedUiText).as('uiReceives');
    });

  // Compare UI vs API value
  cy.get('@recipientReceives').then((recipientReceives) => {
    cy.get('@uiReceives').then((uiReceives) => {
      cy.log(`UI: ${uiReceives}, API: ${recipientReceives}`);
      expect(uiReceives).to.eq(recipientReceives);
    });
  });


    // ─────────────── Confirmation Screens ───────────────
    cy.get('.ant-col > .ant-btn > span').should('be.visible').click();

  cy.get('.ant-modal-body > :nth-child(1) > .ant-col > .ant-typography')
    .should('be.visible')
    .and('contain.text', 'Payment Confirmation');

  cy.get('@recipientReceives').then((recipientReceives) => {
    cy.get(':nth-child(4) > .ant-col-8 > .ant-typography')
      .should('be.visible')
      .and('contain.text', recipientReceives);
  });

  // Pay recipient
  cy.get(
    '.ant-row-center.m-t-20 > .ant-col > .ant-space > :nth-child(2) > .ant-btn'
  )
    .should('be.visible')
    .click();

  cy.get('.ant-modal-body > :nth-child(1) > .ant-col')
    .should('be.visible')
    .and('contain.text', ' Payment Booked - ');

  cy.get('@recipientReceives').then((recipientReceives) => {
    cy.get(':nth-child(5) > .ant-col-8 > .ant-typography')
      .should('be.visible')
      .and('contain.text', recipientReceives);
  });
    })
    it('TC-AC-064 - Verify that if Currency= CNY and Country = UNITED KINGDOM & client = UK and check priority settlement is enabled and make a payment with GBP using Push Funds',function () {
    // ─────────────── Setup & Recipient Creation ───────────────
        signin.Login(userName, password)
        newRecipient.goToPaymentsDashborad()
        newRecipient.gotoRecipientList()
        let email = batchPayments.generateRandomString(5)+ '@yopmail.com'
        newRecipient.addRecipient('UNITED KINGDOM{enter}' ,'CNY{enter}',email)
        newRecipient.addBankDetails('GB73BARC20039538243547','AFFLGB22')
        newRecipient.individualRecipient('UK CNY','UNITED KINGDOM{enter}')
        newRecipient.saveRecipient()
        newRecipient.checkSettelment('be.disabled','be.enabled')

    // ─────────────── Payment Flow ───────────────
    newPayment.proceedflow('{enter}', 'EUR');
    const amount = '10';
    newPayment.addrecipientDetail(amount, email);
    newPayment.selectFundingMethod('Push Funds');
      const apiEnv = this.apiEnv;
    // ───── Intercept Quote API ─────
  cy.intercept(
  'POST',
  '**/VolopaApiOauth2WebApp*/exchange/b2b/self/quote/temp'
).as('quoteApi');

  // ───── Wait for API and Compare Values ─────
  cy.wait('@quoteApi').then(({ response }) => {
    const receive = response.body.data.receive;
    const recipientReceives = response.body.data.recipient[0].receives;

    cy.wrap(recipientReceives).as('recipientReceives');
    cy.log(`Receive: ${receive}`);
    cy.log(`Recipient Receives: ${recipientReceives}`);

    expect(receive).to.eq(recipientReceives); // Final comparison
  });

    /* ── Validate payment‑reason field ───────────────────────── */
    // 1️⃣ Ensure the field starts empty
    cy.get('.ant-select-selector')
      .eq(2)
      .should(($el) => {
        expect(
          $el.text().trim(),
          'reason field should start empty'
        ).to.equal('');
      })
      .click(); // open dropdown

    // 2️⃣ Pick a random option between 1 and 10
    cy.get('.ant-select-dropdown')
      .last()
      .find('.ant-select-item-option')
      .its('length')
      .then((total) => {
        const idx = Math.min(7, Cypress._.random(0, total - 1));
        cy.get('.ant-select-dropdown')
          .last()
          .find('.ant-select-item-option')
          .eq(idx)
          .click();
      });

    /* ── Validate recipient‑received amount ───────────────────── */
    cy.get(':nth-child(3) > :nth-child(2) > .ant-typography')
    .invoke('text')
    .then((uiText) => {
      const trimmedUiText = uiText.trim();
      cy.wrap(trimmedUiText).as('uiReceives');
    });

  // Compare UI vs API value
  cy.get('@recipientReceives').then((recipientReceives) => {
    cy.get('@uiReceives').then((uiReceives) => {
      cy.log(`UI: ${uiReceives}, API: ${recipientReceives}`);
      expect(uiReceives).to.eq(recipientReceives);
    });
  });


    // ─────────────── Confirmation Screens ───────────────
    cy.get('.ant-col > .ant-btn > span').should('be.visible').click();

  cy.get('.ant-modal-body > :nth-child(1) > .ant-col > .ant-typography')
    .should('be.visible')
    .and('contain.text', 'Payment Confirmation');

  cy.get('@recipientReceives').then((recipientReceives) => {
    cy.get(':nth-child(4) > .ant-col-8 > .ant-typography')
      .should('be.visible')
      .and('contain.text', recipientReceives);
  });

  // Pay recipient
  cy.get(
    '.ant-row-center.m-t-20 > .ant-col > .ant-space > :nth-child(2) > .ant-btn'
  )
    .should('be.visible')
    .click();

  cy.get('.ant-modal-body > :nth-child(1) > .ant-col')
    .should('be.visible')
    .and('contain.text', ' Payment Booked - ');

  cy.get('@recipientReceives').then((recipientReceives) => {
    cy.get(':nth-child(5) > .ant-col-8 > .ant-typography')
      .should('be.visible')
      .and('contain.text', recipientReceives);
  });
    })

  
    it('TC-AC-065 - Verify that if Currency = PKR and Country = UNITED KINGDOM & client = UK and check priority settlement is enabled and make a payment with GBP using Push Funds', function () {
  // ─────────────── Setup & Recipient Creation ───────────────
        signin.Login(userName, password); 
        newRecipient.goToPaymentsDashborad()
        newRecipient.gotoRecipientList()
        let email = batchPayments.generateRandomString(5)+ '@yopmail.com'
        newRecipient.addRecipient('UNITED KINGDOM{enter}' ,'PKR{enter}',email)
        newRecipient.addBankDetails('PK36SCBL0000001123456702','AIINPKKA')
        newRecipient.individualRecipient('UK PKR','UNITED KINGDOM{enter}')
        newRecipient.saveRecipient()
        newRecipient.checkSettelment('be.disabled','be.enabled')

  // ─────────────── Payment Flow ───────────────
  newPayment.proceedflow('{downarrow}{enter}', 'GBP');
  const amount = '10';
  newPayment.addrecipientDetail(amount, email);
  newPayment.selectFundingMethod('Push Funds');
  const apiEnv = this.apiEnv;
  // ───── Intercept Quote API ─────
  cy.intercept(
  'POST',
  '**/VolopaApiOauth2WebApp*/exchange/b2b/self/quote/temp'
).as('quoteApi');

  // ───── Wait for API and Compare Values ─────
  cy.wait('@quoteApi').then(({ response }) => {
    const receive = response.body.data.receive;
    const recipientReceives = response.body.data.recipient[0].receives;

    cy.wrap(recipientReceives).as('recipientReceives');
    cy.log(`Receive: ${receive}`);
    cy.log(`Recipient Receives: ${recipientReceives}`);

     expect(receive.replace(/,/g, '')).to.eq(recipientReceives.replace(/,/g, '')); // Final comparison
  });

  // ── Validate payment‑reason field ─────────────────────────
  cy.get('.ant-select-selector')
    .eq(2)
    .should(($el) => {
      expect($el.text().trim(), 'reason field should start empty').to.equal('');
    })
    .click(); // Open dropdown

  // Pick a random reason option
  cy.get('.ant-select-dropdown')
    .last()
    .find('.ant-select-item-option')
    .its('length')
    .then((total) => {
      const idx = Math.min(7, Cypress._.random(0, total - 1));
      cy.get('.ant-select-dropdown')
        .last()
        .find('.ant-select-item-option')
        .eq(idx)
        .click();
    });

  // ── Validate recipient‑received amount ─────────────────────
  cy.get(':nth-child(3) > :nth-child(2) > .ant-typography')
    .invoke('text')
    .then((uiText) => {
      const trimmedUiText = uiText.trim();
      cy.wrap(trimmedUiText).as('uiReceives');
    });

  // Compare UI vs API value
  cy.get('@recipientReceives').then((recipientReceives) => {
    cy.get('@uiReceives').then((uiReceives) => {
      cy.log(`UI: ${uiReceives}, API: ${recipientReceives}`);
      expect(uiReceives.replace(/,/g, '')).to.eq(recipientReceives.replace(/,/g, ''));
    });
  });

  // ─────────────── Confirmation Screens ───────────────
  cy.get('.ant-col > .ant-btn > span').should('be.visible').click();

  cy.get('.ant-modal-body > :nth-child(1) > .ant-col > .ant-typography')
    .should('be.visible')
    .and('contain.text', 'Payment Confirmation');

  cy.get('@recipientReceives').then((recipientReceives) => {
    cy.get(':nth-child(4) > .ant-col-8 > .ant-typography')
  .should('be.visible')
  .invoke('text')
  .then((text) => {
    expect(text.replace(/,/g, '')).to.contain(recipientReceives.replace(/,/g, ''))
  })
  });

  // Pay recipient
  cy.get(
    '.ant-row-center.m-t-20 > .ant-col > .ant-space > :nth-child(2) > .ant-btn'
  )
    .should('be.visible')
    .click();

  cy.get('.ant-modal-body > :nth-child(1) > .ant-col')
    .should('be.visible')
    .and('contain.text', ' Payment Booked - ');

  cy.get('@recipientReceives').then((recipientReceives) => {
    cy.get(':nth-child(5) > .ant-col-8 > .ant-typography')
      .should('be.visible')
      .invoke('text')
  .then((text) => {
    expect(text.replace(/,/g, '')).to.contain(recipientReceives.replace(/,/g, ''))
  })
  })

    });
    it('TC-AC-066 - Verify that if Currency = PKR and Country = Pakistan & client = UK and check priority settlement is enabled and make a payment with GBP using Push Funds', function () {
  // ─────────────── Setup & Recipient Creation ───────────────
        signin.Login(userName, password); 
        newRecipient.goToPaymentsDashborad()
        newRecipient.gotoRecipientList()
        let email = batchPayments.generateRandomString(5)+ '@yopmail.com'
        newRecipient.addRecipient('Pakistan{enter}' ,'PKR{enter}',email)
        newRecipient.addBankDetails('PK36SCBL0000001123456702','AIINPKKA')
        newRecipient.individualRecipient('Pakistan PKR','Pakistan{enter}')
        newRecipient.saveRecipient()
        newRecipient.checkSettelment('be.disabled','be.enabled')

  // ─────────────── Payment Flow ───────────────
  newPayment.proceedflow('{downarrow}{enter}', 'GBP');
  const amount = '10';
  newPayment.addrecipientDetail(amount, email);
  newPayment.selectFundingMethod('Push Funds');
  const apiEnv = this.apiEnv;
  // ───── Intercept Quote API ─────
  cy.intercept(
  'POST',
  '**/VolopaApiOauth2WebApp*/exchange/b2b/self/quote/temp'
).as('quoteApi');

  // ───── Wait for API and Compare Values ─────
  cy.wait('@quoteApi').then(({ response }) => {
    const receive = response.body.data.receive;
    const recipientReceives = response.body.data.recipient[0].receives;

    cy.wrap(recipientReceives).as('recipientReceives');
    cy.log(`Receive: ${receive}`);
    cy.log(`Recipient Receives: ${recipientReceives}`);

     expect(receive.replace(/,/g, '')).to.eq(recipientReceives.replace(/,/g, '')); // Final comparison
  });

  // ── Validate payment‑reason field ─────────────────────────
  cy.get('.ant-select-selector')
    .eq(2)
    .should(($el) => {
      expect($el.text().trim(), 'reason field should start empty').to.equal('');
    })
    .click(); // Open dropdown

  // Pick a random reason option
  cy.get('.ant-select-dropdown')
    .last()
    .find('.ant-select-item-option')
    .its('length')
    .then((total) => {
      const idx = Math.min(7, Cypress._.random(0, total - 1));
      cy.get('.ant-select-dropdown')
        .last()
        .find('.ant-select-item-option')
        .eq(idx)
        .click();
    });

  // ── Validate recipient‑received amount ─────────────────────
  cy.get(':nth-child(3) > :nth-child(2) > .ant-typography')
    .invoke('text')
    .then((uiText) => {
      const trimmedUiText = uiText.trim();
      cy.wrap(trimmedUiText).as('uiReceives');
    });

  // Compare UI vs API value
  cy.get('@recipientReceives').then((recipientReceives) => {
    cy.get('@uiReceives').then((uiReceives) => {
      cy.log(`UI: ${uiReceives}, API: ${recipientReceives}`);
      expect(uiReceives.replace(/,/g, '')).to.eq(recipientReceives.replace(/,/g, ''));
    });
  });

  // ─────────────── Confirmation Screens ───────────────
  cy.get('.ant-col > .ant-btn > span').should('be.visible').click();

  cy.get('.ant-modal-body > :nth-child(1) > .ant-col > .ant-typography')
    .should('be.visible')
    .and('contain.text', 'Payment Confirmation');

  cy.get('@recipientReceives').then((recipientReceives) => {
    cy.get(':nth-child(4) > .ant-col-8 > .ant-typography')
  .should('be.visible')
  .invoke('text')
  .then((text) => {
    expect(text.replace(/,/g, '')).to.contain(recipientReceives.replace(/,/g, ''))
  })
  });

  // Pay recipient
  cy.get(
    '.ant-row-center.m-t-20 > .ant-col > .ant-space > :nth-child(2) > .ant-btn'
  )
    .should('be.visible')
    .click();

  cy.get('.ant-modal-body > :nth-child(1) > .ant-col')
    .should('be.visible')
    .and('contain.text', ' Payment Booked - ');

  cy.get('@recipientReceives').then((recipientReceives) => {
    cy.get(':nth-child(5) > .ant-col-8 > .ant-typography')
      .should('be.visible')
      .invoke('text')
  .then((text) => {
    expect(text.replace(/,/g, '')).to.contain(recipientReceives.replace(/,/g, ''))
  })
  })

    });
    it('TC-AC-067 - Verify that if Currency = MUR and Country = UNITED KINGDOM & client = UK and check priority settlement is enabled and make a payment with GBP using Push Funds', function () {
  // ─────────────── Setup & Recipient Creation ───────────────
        signin.Login(userName, password); 
        newRecipient.goToPaymentsDashborad()
        newRecipient.gotoRecipientList()
        let email = batchPayments.generateRandomString(5)+ '@yopmail.com'
        newRecipient.addRecipient('UNITED KINGDOM{enter}' ,'MUR{enter}',email)
        newRecipient.addBankDetails('MU43BOMM0101123456789101000MUR','MCBLMUMUXXX')
        newRecipient.individualRecipient('UK MUR','UNITED KINGDOM{enter}')
        newRecipient.saveRecipient()
        newRecipient.checkSettelment('be.disabled','be.enabled')

  // ─────────────── Payment Flow ───────────────
  newPayment.proceedflow('{downarrow}{enter}', 'GBP');
  const amount = '10';
  newPayment.addrecipientDetail(amount, email);
  newPayment.selectFundingMethod('Push Funds');
  const apiEnv = this.apiEnv;
  // ───── Intercept Quote API ─────
  cy.intercept(
  'POST',
  '**/VolopaApiOauth2WebApp*/exchange/b2b/self/quote/temp'
).as('quoteApi');

  // ───── Wait for API and Compare Values ─────
  cy.wait('@quoteApi').then(({ response }) => {
    const receive = response.body.data.receive;
    const recipientReceives = response.body.data.recipient[0].receives;

    cy.wrap(recipientReceives).as('recipientReceives');
    cy.log(`Receive: ${receive}`);
    cy.log(`Recipient Receives: ${recipientReceives}`);

     expect(receive.replace(/,/g, '')).to.eq(recipientReceives.replace(/,/g, '')); // Final comparison
  });

  // ── Validate payment‑reason field ─────────────────────────
  cy.get('.ant-select-selector')
    .eq(2)
    .should(($el) => {
      expect($el.text().trim(), 'reason field should start empty').to.equal('');
    })
    .click(); // Open dropdown

  // Pick a random reason option
  cy.get('.ant-select-dropdown')
    .last()
    .find('.ant-select-item-option')
    .its('length')
    .then((total) => {
      const idx = Math.min(7, Cypress._.random(0, total - 1));
      cy.get('.ant-select-dropdown')
        .last()
        .find('.ant-select-item-option')
        .eq(idx)
        .click();
    });

  // ── Validate recipient‑received amount ─────────────────────
  cy.get(':nth-child(3) > :nth-child(2) > .ant-typography')
    .invoke('text')
    .then((uiText) => {
      const trimmedUiText = uiText.trim();
      cy.wrap(trimmedUiText).as('uiReceives');
    });

  // Compare UI vs API value
  cy.get('@recipientReceives').then((recipientReceives) => {
    cy.get('@uiReceives').then((uiReceives) => {
      cy.log(`UI: ${uiReceives}, API: ${recipientReceives}`);
      expect(uiReceives.replace(/,/g, '')).to.eq(recipientReceives.replace(/,/g, ''));
    });
  });

  // ─────────────── Confirmation Screens ───────────────
  cy.get('.ant-col > .ant-btn > span').should('be.visible').click();

  cy.get('.ant-modal-body > :nth-child(1) > .ant-col > .ant-typography')
    .should('be.visible')
    .and('contain.text', 'Payment Confirmation');

  cy.get('@recipientReceives').then((recipientReceives) => {
    cy.get(':nth-child(4) > .ant-col-8 > .ant-typography')
  .should('be.visible')
  .invoke('text')
  .then((text) => {
    expect(text.replace(/,/g, '')).to.contain(recipientReceives.replace(/,/g, ''))
  })
  });

  // Pay recipient
  cy.get(
    '.ant-row-center.m-t-20 > .ant-col > .ant-space > :nth-child(2) > .ant-btn'
  )
    .should('be.visible')
    .click();

  cy.get('.ant-modal-body > :nth-child(1) > .ant-col')
    .should('be.visible')
    .and('contain.text', ' Payment Booked - ');

  cy.get('@recipientReceives').then((recipientReceives) => {
    cy.get(':nth-child(5) > .ant-col-8 > .ant-typography')
      .should('be.visible')
      .invoke('text')
  .then((text) => {
    expect(text.replace(/,/g, '')).to.contain(recipientReceives.replace(/,/g, ''))
  })
  })

    });
    it('TC-AC-068 - Verify that if Currency = MUR and Country = Mauritius & client = UK and check priority settlement is enabled and make a payment with GBP using Push Funds', function () {
  // ─────────────── Setup & Recipient Creation ───────────────
        signin.Login(userName, password); 
        newRecipient.goToPaymentsDashborad()
        newRecipient.gotoRecipientList()
        let email = batchPayments.generateRandomString(5)+ '@yopmail.com'
        newRecipient.addRecipient('Mauritius{enter}' ,'MUR{enter}',email)
        newRecipient.addBankDetails('MU43BOMM0101123456789101000MUR','MCBLMUMUXXX')
        newRecipient.individualRecipient('Mauritius MUR','Mauritius{enter}')
        newRecipient.saveRecipient()
        newRecipient.checkSettelment('be.disabled','be.enabled')

  // ─────────────── Payment Flow ───────────────
  newPayment.proceedflow('{downarrow}{enter}', 'GBP');
  const amount = '10';
  newPayment.addrecipientDetail(amount, email);
  newPayment.selectFundingMethod('Push Funds');
  const apiEnv = this.apiEnv;
  // ───── Intercept Quote API ─────
  cy.intercept(
  'POST',
  '**/VolopaApiOauth2WebApp*/exchange/b2b/self/quote/temp'
).as('quoteApi');

  // ───── Wait for API and Compare Values ─────
  cy.wait('@quoteApi').then(({ response }) => {
    const receive = response.body.data.receive;
    const recipientReceives = response.body.data.recipient[0].receives;

    cy.wrap(recipientReceives).as('recipientReceives');
    cy.log(`Receive: ${receive}`);
    cy.log(`Recipient Receives: ${recipientReceives}`);

     expect(receive.replace(/,/g, '')).to.eq(recipientReceives.replace(/,/g, '')); // Final comparison
  });

  // ── Validate payment‑reason field ─────────────────────────
  cy.get('.ant-select-selector')
    .eq(2)
    .should(($el) => {
      expect($el.text().trim(), 'reason field should start empty').to.equal('');
    })
    .click(); // Open dropdown

  // Pick a random reason option
  cy.get('.ant-select-dropdown')
    .last()
    .find('.ant-select-item-option')
    .its('length')
    .then((total) => {
      const idx = Math.min(7, Cypress._.random(0, total - 1));
      cy.get('.ant-select-dropdown')
        .last()
        .find('.ant-select-item-option')
        .eq(idx)
        .click();
    });

  // ── Validate recipient‑received amount ─────────────────────
  cy.get(':nth-child(3) > :nth-child(2) > .ant-typography')
    .invoke('text')
    .then((uiText) => {
      const trimmedUiText = uiText.trim();
      cy.wrap(trimmedUiText).as('uiReceives');
    });

  // Compare UI vs API value
  cy.get('@recipientReceives').then((recipientReceives) => {
    cy.get('@uiReceives').then((uiReceives) => {
      cy.log(`UI: ${uiReceives}, API: ${recipientReceives}`);
      expect(uiReceives.replace(/,/g, '')).to.eq(recipientReceives.replace(/,/g, ''));
    });
  });

  // ─────────────── Confirmation Screens ───────────────
  cy.get('.ant-col > .ant-btn > span').should('be.visible').click();

  cy.get('.ant-modal-body > :nth-child(1) > .ant-col > .ant-typography')
    .should('be.visible')
    .and('contain.text', 'Payment Confirmation');

  cy.get('@recipientReceives').then((recipientReceives) => {
    cy.get(':nth-child(4) > .ant-col-8 > .ant-typography')
  .should('be.visible')
  .invoke('text')
  .then((text) => {
    expect(text.replace(/,/g, '')).to.contain(recipientReceives.replace(/,/g, ''))
  })
  });

  // Pay recipient
  cy.get(
    '.ant-row-center.m-t-20 > .ant-col > .ant-space > :nth-child(2) > .ant-btn'
  )
    .should('be.visible')
    .click();

  cy.get('.ant-modal-body > :nth-child(1) > .ant-col')
    .should('be.visible')
    .and('contain.text', ' Payment Booked - ');

  cy.get('@recipientReceives').then((recipientReceives) => {
    cy.get(':nth-child(5) > .ant-col-8 > .ant-typography')
      .should('be.visible')
      .invoke('text')
  .then((text) => {
    expect(text.replace(/,/g, '')).to.contain(recipientReceives.replace(/,/g, ''))
  })
  })

    });
    it('TC-AC-069 - Verify that if Currency = GHS and Country = UNITED KINGDOM & client = UK and check priority settlement is enabled and make a payment with GBP using Push Funds', function () {
  // ─────────────── Setup & Recipient Creation ───────────────
        signin.Login(userName, password); 
        newRecipient.goToPaymentsDashborad()
        newRecipient.gotoRecipientList()
        let email = batchPayments.generateRandomString(5)+ '@yopmail.com'
        newRecipient.addRecipient('UNITED KINGDOM{enter}' ,'GHS{enter}',email)
        newRecipient.addBankDetails('MU43BOMM0101123456789101000MUR','MCBLMUMUXXX')
        newRecipient.individualRecipient('UK GHS','UNITED KINGDOM{enter}')
        newRecipient.saveRecipient()
        newRecipient.checkSettelment('be.disabled','be.enabled')

  // ─────────────── Payment Flow ───────────────
  newPayment.proceedflow('{downarrow}{enter}', 'GBP');
  const amount = '10';
  newPayment.addrecipientDetail(amount, email);
  newPayment.selectFundingMethod('Push Funds');
  const apiEnv = this.apiEnv;
  // ───── Intercept Quote API ─────
  cy.intercept(
  'POST',
  '**/VolopaApiOauth2WebApp*/exchange/b2b/self/quote/temp'
).as('quoteApi');

  // ───── Wait for API and Compare Values ─────
  cy.wait('@quoteApi').then(({ response }) => {
    const receive = response.body.data.receive;
    const recipientReceives = response.body.data.recipient[0].receives;

    cy.wrap(recipientReceives).as('recipientReceives');
    cy.log(`Receive: ${receive}`);
    cy.log(`Recipient Receives: ${recipientReceives}`);

     expect(receive.replace(/,/g, '')).to.eq(recipientReceives.replace(/,/g, '')); // Final comparison
  });

  // ── Validate payment‑reason field ─────────────────────────
  cy.get('.ant-select-selector')
    .eq(2)
    .should(($el) => {
      expect($el.text().trim(), 'reason field should start empty').to.equal('');
    })
    .click(); // Open dropdown

  // Pick a random reason option
  cy.get('.ant-select-dropdown')
    .last()
    .find('.ant-select-item-option')
    .its('length')
    .then((total) => {
      const idx = Math.min(7, Cypress._.random(0, total - 1));
      cy.get('.ant-select-dropdown')
        .last()
        .find('.ant-select-item-option')
        .eq(idx)
        .click();
    });

  // ── Validate recipient‑received amount ─────────────────────
  cy.get(':nth-child(3) > :nth-child(2) > .ant-typography')
    .invoke('text')
    .then((uiText) => {
      const trimmedUiText = uiText.trim();
      cy.wrap(trimmedUiText).as('uiReceives');
    });

  // Compare UI vs API value
  cy.get('@recipientReceives').then((recipientReceives) => {
    cy.get('@uiReceives').then((uiReceives) => {
      cy.log(`UI: ${uiReceives}, API: ${recipientReceives}`);
      expect(uiReceives.replace(/,/g, '')).to.eq(recipientReceives.replace(/,/g, ''));
    });
  });

  // ─────────────── Confirmation Screens ───────────────
  cy.get('.ant-col > .ant-btn > span').should('be.visible').click();

  cy.get('.ant-modal-body > :nth-child(1) > .ant-col > .ant-typography')
    .should('be.visible')
    .and('contain.text', 'Payment Confirmation');

  cy.get('@recipientReceives').then((recipientReceives) => {
    cy.get(':nth-child(4) > .ant-col-8 > .ant-typography')
  .should('be.visible')
  .invoke('text')
  .then((text) => {
    expect(text.replace(/,/g, '')).to.contain(recipientReceives.replace(/,/g, ''))
  })
  });

  // Pay recipient
  cy.get(
    '.ant-row-center.m-t-20 > .ant-col > .ant-space > :nth-child(2) > .ant-btn'
  )
    .should('be.visible')
    .click();

  cy.get('.ant-modal-body > :nth-child(1) > .ant-col')
    .should('be.visible')
    .and('contain.text', ' Payment Booked - ');

  cy.get('@recipientReceives').then((recipientReceives) => {
    cy.get(':nth-child(5) > .ant-col-8 > .ant-typography')
      .should('be.visible')
      .invoke('text')
  .then((text) => {
    expect(text.replace(/,/g, '')).to.contain(recipientReceives.replace(/,/g, ''))
  })
  })

    });
    it('TC-AC-070 - Verify that if Currency = GHS and Country = Ghana & client = UK and check priority settlement is enabled and make a payment with GBP using Push Funds', function () {
  // ─────────────── Setup & Recipient Creation ───────────────
        signin.Login(userName, password); 
        newRecipient.goToPaymentsDashborad()
        newRecipient.gotoRecipientList()
        let email = batchPayments.generateRandomString(5)+ '@yopmail.com'
        newRecipient.addRecipient('Ghana{enter}' ,'GHS{enter}',email)
        newRecipient.addBankDetailsWithAccNo('BARCGHACCSS','0114015331')
        newRecipient.individualRecipient('Ghana GHS','Ghana{enter}')
        newRecipient.saveRecipient()
        newRecipient.checkSettelment('be.disabled','be.enabled')

  // ─────────────── Payment Flow ───────────────
  newPayment.proceedflow('{downarrow}{enter}', 'GBP');
  const amount = '10';
  newPayment.addrecipientDetail(amount, email);
  newPayment.selectFundingMethod('Push Funds');
  const apiEnv = this.apiEnv;
  // ───── Intercept Quote API ─────
  cy.intercept(
  'POST',
  '**/VolopaApiOauth2WebApp*/exchange/b2b/self/quote/temp'
).as('quoteApi');

  // ───── Wait for API and Compare Values ─────
  cy.wait('@quoteApi').then(({ response }) => {
    const receive = response.body.data.receive;
    const recipientReceives = response.body.data.recipient[0].receives;

    cy.wrap(recipientReceives).as('recipientReceives');
    cy.log(`Receive: ${receive}`);
    cy.log(`Recipient Receives: ${recipientReceives}`);

     expect(receive.replace(/,/g, '')).to.eq(recipientReceives.replace(/,/g, '')); // Final comparison
  });

  // ── Validate payment‑reason field ─────────────────────────
  cy.get('.ant-select-selector')
    .eq(2)
    .should(($el) => {
      expect($el.text().trim(), 'reason field should start empty').to.equal('');
    })
    .click(); // Open dropdown

  // Pick a random reason option
  cy.get('.ant-select-dropdown')
    .last()
    .find('.ant-select-item-option')
    .its('length')
    .then((total) => {
      const idx = Math.min(7, Cypress._.random(0, total - 1));
      cy.get('.ant-select-dropdown')
        .last()
        .find('.ant-select-item-option')
        .eq(idx)
        .click();
    });

  // ── Validate recipient‑received amount ─────────────────────
  cy.get(':nth-child(3) > :nth-child(2) > .ant-typography')
    .invoke('text')
    .then((uiText) => {
      const trimmedUiText = uiText.trim();
      cy.wrap(trimmedUiText).as('uiReceives');
    });

  // Compare UI vs API value
  cy.get('@recipientReceives').then((recipientReceives) => {
    cy.get('@uiReceives').then((uiReceives) => {
      cy.log(`UI: ${uiReceives}, API: ${recipientReceives}`);
      expect(uiReceives.replace(/,/g, '')).to.eq(recipientReceives.replace(/,/g, ''));
    });
  });

  // ─────────────── Confirmation Screens ───────────────
  cy.get('.ant-col > .ant-btn > span').should('be.visible').click();

  cy.get('.ant-modal-body > :nth-child(1) > .ant-col > .ant-typography')
    .should('be.visible')
    .and('contain.text', 'Payment Confirmation');

  cy.get('@recipientReceives').then((recipientReceives) => {
    cy.get(':nth-child(4) > .ant-col-8 > .ant-typography')
  .should('be.visible')
  .invoke('text')
  .then((text) => {
    expect(text.replace(/,/g, '')).to.contain(recipientReceives.replace(/,/g, ''))
  })
  });

  // Pay recipient
  cy.get(
    '.ant-row-center.m-t-20 > .ant-col > .ant-space > :nth-child(2) > .ant-btn'
  )
    .should('be.visible')
    .click();

  cy.get('.ant-modal-body > :nth-child(1) > .ant-col')
    .should('be.visible')
    .and('contain.text', ' Payment Booked - ');

  cy.get('@recipientReceives').then((recipientReceives) => {
    cy.get(':nth-child(5) > .ant-col-8 > .ant-typography')
      .should('be.visible')
      .invoke('text')
  .then((text) => {
    expect(text.replace(/,/g, '')).to.contain(recipientReceives.replace(/,/g, ''))
  })
  })

    });


  //to do cover these scenarios
// IN / USD


// BH / USD


// CN / USD


    it('TC-AC-065 - Verify that(business) if Currency= SGD and Country = UNITED KINGDOM & client = UK and check priority settlement is enabled and make a payment with GBP using Push Funds',function () {
    // ─────────────── Setup & Recipient Creation ───────────────
        signin.Login(userName, password)
        newRecipient.goToPaymentsDashborad() 
        newRecipient.gotoRecipientList()
        let email = batchPayments.generateRandomString(5)+ '@yopmail.com'
        newRecipient.addRecipient('UNITED KINGDOM{enter}' ,'SGD{enter}',email)
        newRecipient.addBankDetails('GB73BARC20039538243547','AFFLGB22')
        newRecipient.addBusinessRecipientCorpay('UNITED KINGDOM{enter}','UK SGD')
        newRecipient.saveRecipient()
        newRecipient.checkSettelment('be.disabled','be.enabled')

    // ─────────────── Payment Flow ───────────────
    newPayment.proceedflow('{downarrow}{enter}', 'GBP');
    const amount = '10';
    newPayment.addrecipientDetail(amount, email);
    newPayment.selectFundingMethod('Push Funds');

    /* ── Validate payment‑reason field ───────────────────────── */
    // 1️⃣ Ensure the field starts empty
    cy.get('.ant-select-selector')
      .eq(2)
      .should(($el) => {
        expect(
          $el.text().trim(),
          'reason field should start empty'
        ).to.equal('');
      })
      .click(); // open dropdown

    // 2️⃣ Pick a random option between 1 and 7
    cy.get('.ant-select-dropdown')
      .last()
      .find('.ant-select-item-option')
      .its('length')
      .then((total) => {
        const idx = Math.min(7, Cypress._.random(0, total - 1));
        cy.get('.ant-select-dropdown')
          .last()
          .find('.ant-select-item-option')
          .eq(idx)
          .click();
      });

    /* ── Validate recipient‑received amount ───────────────────── */
    cy.get(':nth-child(3) > :nth-child(2) > .ant-typography')
      .invoke('text')
      .then((text) => {
        cy.wrap(text).as('storedText');
        cy.log(text);
      });

    // ─────────────── Confirmation Screens ───────────────
    cy.get('.ant-col > .ant-btn > span').should('be.visible').click();

    cy.get('.ant-modal-body > :nth-child(1) > .ant-col > .ant-typography')
      .should('be.visible')
      .and('contain.text', 'Payment Confirmation');

    cy.get('@storedText').then((storedText) => {
      cy.get(':nth-child(4) > .ant-col-8 > .ant-typography')
        .should('be.visible')
        .and('contain.text', storedText);
    });

    // Pay recipient
    cy.get(
      '.ant-row-center.m-t-20 > .ant-col > .ant-space > :nth-child(2) > .ant-btn'
    )
      .should('be.visible')
      .click();

    cy.get('.ant-modal-body > :nth-child(1) > .ant-col')
      .should('be.visible')
      .and('contain.text', ' Payment Booked - ');

    cy.get('@storedText').then((storedText) => {
      cy.get(':nth-child(5) > .ant-col-8 > .ant-typography')
        .should('be.visible')
        .and('contain.text', storedText);
    })
    })
    it('TC-AC-066 - Verify that(business) if Currency= SGD and Country = Singapore & client = UK and check priority and regular both settlement are enabled and make a payment with GBP using Push Funds',function () {
    // ─────────────── Setup & Recipient Creation ───────────────
        signin.Login(userName, password)
        newRecipient.goToPaymentsDashborad()
        newRecipient.gotoRecipientList()
        let email = batchPayments.generateRandomString(5)+ '@yopmail.com'
        newRecipient.addRecipient('SINGAPORE{enter}' ,'SGD{enter}',email)
        newRecipient.addBankDetailsWithAccNo('ACLPSGSG','049712')
        newRecipient.singaporeCorpayDeatails('1111','123')
        newRecipient.addBusinessRecipientCorpay('SINGAPORE{enter}','Singapore SGD')
        newRecipient.saveRecipient()
        newRecipient.checkSettelmentEnabledBoth('be.enabled','be.enabled')

    // ─────────────── Payment Flow ───────────────
    newPayment.proceedflow('{downarrow}{enter}', 'GBP');
    const amount = '10';
    newPayment.addrecipientDetail(amount, email);
    newPayment.selectFundingMethod('Push Funds');

    /* ── Validate payment‑reason field ───────────────────────── */
    // 1️⃣ Ensure the field starts empty
    cy.get('.ant-select-selector')
      .eq(2)
      .should(($el) => {
        expect(
          $el.text().trim(),
          'reason field should start empty'
        ).to.equal('');
      })
      .click(); // open dropdown

    // 2️⃣ Pick a random option between 1 and 7
    cy.get('.ant-select-dropdown')
      .last()
      .find('.ant-select-item-option')
      .its('length')
      .then((total) => {
        const idx = Math.min(7, Cypress._.random(0, total - 1));
        cy.get('.ant-select-dropdown')
          .last()
          .find('.ant-select-item-option')
          .eq(idx)
          .click();
      });

    /* ── Validate recipient‑received amount ───────────────────── */
    cy.get(':nth-child(3) > :nth-child(2) > .ant-typography')
      .invoke('text')
      .then((text) => {
        cy.wrap(text).as('storedText');
        cy.log(text);
      });

    // ─────────────── Confirmation Screens ───────────────
    cy.get('.ant-col > .ant-btn > span').should('be.visible').click();

    cy.get('.ant-modal-body > :nth-child(1) > .ant-col > .ant-typography')
      .should('be.visible')
      .and('contain.text', 'Payment Confirmation');

    cy.get('@storedText').then((storedText) => {
      cy.get(':nth-child(4) > .ant-col-8 > .ant-typography')
        .should('be.visible')
        .and('contain.text', storedText);
    });

    // Pay recipient
    cy.get(
      '.ant-row-center.m-t-20 > .ant-col > .ant-space > :nth-child(2) > .ant-btn'
    )
      .should('be.visible')
      .click();

    cy.get('.ant-modal-body > :nth-child(1) > .ant-col')
      .should('be.visible')
      .and('contain.text', ' Payment Booked - ');

    cy.get('@storedText').then((storedText) => {
      cy.get(':nth-child(5) > .ant-col-8 > .ant-typography')
        .should('be.visible')
        .and('contain.text', storedText);
    })
    })
    xit('TC-AC-067 - Verify that(business) if Currency= MXN and Country = UNITED KINGDOM & client = UK and check priority settlement is enabled and make a payment with GBP using Push Funds',function () {
    // ─────────────── Setup & Recipient Creation ───────────────
        signin.Login(userName, password)
        newRecipient.goToPaymentsDashborad()
        newRecipient.gotoRecipientList()
        let email = batchPayments.generateRandomString(5)+ '@yopmail.com'
        newRecipient.addRecipient('UNITED KINGDOM{enter}' ,'MXN{enter}',email)
        newRecipient.addBankDetails('GB73BARC20039538243547','AFFLGB22')
        newRecipient.addBusinessRecipientCorpay('UNITED KINGDOM{enter}','QA Checking MXN')
        newRecipient.saveRecipient()
        newRecipient.checkSettelment('be.disabled','be.enabled')

    // ─────────────── Payment Flow ───────────────
    newPayment.proceedflow('{downarrow}{enter}', 'GBP');
    const amount = '10';
    newPayment.addrecipientDetail(amount, email);
    newPayment.selectFundingMethod('Push Funds');

    /* ── Validate payment‑reason field ───────────────────────── */
    // 1️⃣ Ensure the field starts empty
    cy.get('.ant-select-selector')
      .eq(2)
      .should(($el) => {
        expect(
          $el.text().trim(),
          'reason field should start empty'
        ).to.equal('');
      })
      .click(); // open dropdown

    // 2️⃣ Pick a random option between 1 and 7
    cy.get('.ant-select-dropdown')
      .last()
      .find('.ant-select-item-option')
      .its('length')
      .then((total) => {
        const idx = Math.min(7, Cypress._.random(0, total - 1));
        cy.get('.ant-select-dropdown')
          .last()
          .find('.ant-select-item-option')
          .eq(idx)
          .click();
      });

    /* ── Validate recipient‑received amount ───────────────────── */
    cy.get(':nth-child(3) > :nth-child(2) > .ant-typography')
      .invoke('text')
      .then((text) => {
        cy.wrap(text).as('storedText');
        cy.log(text);
      });

    // ─────────────── Confirmation Screens ───────────────
    cy.get('.ant-col > .ant-btn > span').should('be.visible').click();

    cy.get('.ant-modal-body > :nth-child(1) > .ant-col > .ant-typography')
      .should('be.visible')
      .and('contain.text', 'Payment Confirmation');

    cy.get('@storedText').then((storedText) => {
      cy.get(':nth-child(4) > .ant-col-8 > .ant-typography')
        .should('be.visible')
        .and('contain.text', storedText);
    });

    // Pay recipient
    cy.get(
      '.ant-row-center.m-t-20 > .ant-col > .ant-space > :nth-child(2) > .ant-btn'
    )
      .should('be.visible')
      .click();

    cy.get('.ant-modal-body > :nth-child(1) > .ant-col')
      .should('be.visible')
      .and('contain.text', ' Payment Booked - ');

    cy.get('@storedText').then((storedText) => {
      cy.get(':nth-child(5) > .ant-col-8 > .ant-typography')
        .should('be.visible')
        .and('contain.text', storedText);
    })
    })
    xit('TC-AC-068 - Verify that(business) if Currency= MXN and Country = Mexico Checking & client = UK and check priority settlement is enabled and make a payment with GBP using Push Funds',function () {
    // ─────────────── Setup & Recipient Creation ───────────────
        signin.Login(userName, password)
        newRecipient.goToPaymentsDashborad()
        newRecipient.gotoRecipientList()
        let email = batchPayments.generateRandomString(5)+ '@yopmail.com'
        newRecipient.addRecipient('MEXICO{enter}' ,'MXN{enter}',email)
        newRecipient.addBankDetailsWithClabe('AFIRMXMT','002010077777777771')
        newRecipient.mexicoCorpay('Checking{enter}')
        newRecipient.addBusinessRecipientCorpay('MEXICO{enter}','QA Checking MXN')
        newRecipient.postCodeState()
        newRecipient.saveRecipient()
        newRecipient.checkSettelment('be.disabled','be.enabled')

    // ─────────────── Payment Flow ───────────────
    newPayment.proceedflow('{downarrow}{enter}', 'GBP');
    const amount = '10';
    newPayment.addrecipientDetail(amount, email);
    newPayment.selectFundingMethod('Push Funds');

    /* ── Validate payment‑reason field ───────────────────────── */
    // 1️⃣ Ensure the field starts empty
    cy.get('.ant-select-selector')
      .eq(2)
      .should(($el) => {
        expect(
          $el.text().trim(),
          'reason field should start empty'
        ).to.equal('');
      })
      .click(); // open dropdown

    // 2️⃣ Pick a random option between 1 and 7
    cy.get('.ant-select-dropdown')
      .last()
      .find('.ant-select-item-option')
      .its('length')
      .then((total) => {
        const idx = Math.min(7, Cypress._.random(0, total - 1));
        cy.get('.ant-select-dropdown')
          .last()
          .find('.ant-select-item-option')
          .eq(idx)
          .click();
      });

    /* ── Validate recipient‑received amount ───────────────────── */
    cy.get(':nth-child(3) > :nth-child(2) > .ant-typography')
      .invoke('text')
      .then((text) => {
        cy.wrap(text).as('storedText');
        cy.log(text);
      });

    // ─────────────── Confirmation Screens ───────────────
    cy.get('.ant-col > .ant-btn > span').should('be.visible').click();

    cy.get('.ant-modal-body > :nth-child(1) > .ant-col > .ant-typography')
      .should('be.visible')
      .and('contain.text', 'Payment Confirmation');

    cy.get('@storedText').then((storedText) => {
      cy.get(':nth-child(4) > .ant-col-8 > .ant-typography')
        .should('be.visible')
        .and('contain.text', storedText);
    });

    // Pay recipient
    cy.get(
      '.ant-row-center.m-t-20 > .ant-col > .ant-space > :nth-child(2) > .ant-btn'
    )
      .should('be.visible')
      .click();

    cy.get('.ant-modal-body > :nth-child(1) > .ant-col')
      .should('be.visible')
      .and('contain.text', ' Payment Booked - ');

    cy.get('@storedText').then((storedText) => {
      cy.get(':nth-child(5) > .ant-col-8 > .ant-typography')
        .should('be.visible')
        .and('contain.text', storedText);
    })
    })
    xit('TC-AC-069 - Verify that(business) if Currency= MXN and Country = Mexico Saving & client = UK and check priority settlement is enabled and make a payment with GBP using Push Funds',function () {
    // ─────────────── Setup & Recipient Creation ───────────────
        signin.Login(userName, password)
        newRecipient.goToPaymentsDashborad()
        newRecipient.gotoRecipientList()
        let email = batchPayments.generateRandomString(5)+ '@yopmail.com'
        newRecipient.addRecipient('MEXICO{enter}' ,'MXN{enter}',email)
        newRecipient.addBankDetailsWithClabe('AFIRMXMT','002010077777777771')
        newRecipient.mexicoCorpay('Saving{enter}')
        newRecipient.addBusinessRecipientCorpay('MEXICO{enter}','QA Saving MXN')
        newRecipient.postCodeState()
        newRecipient.saveRecipient()
        newRecipient.checkSettelment('be.disabled','be.enabled')

    // ─────────────── Payment Flow ───────────────
    newPayment.proceedflow('{downarrow}{enter}', 'GBP');
    const amount = '10';
    newPayment.addrecipientDetail(amount, email);
    newPayment.selectFundingMethod('Push Funds');

    /* ── Validate payment‑reason field ───────────────────────── */
    // 1️⃣ Ensure the field starts empty
    cy.get('.ant-select-selector')
      .eq(2)
      .should(($el) => {
        expect(
          $el.text().trim(),
          'reason field should start empty'
        ).to.equal('');
      })
      .click(); // open dropdown

    // 2️⃣ Pick a random option between 1 and 7
    cy.get('.ant-select-dropdown')
      .last()
      .find('.ant-select-item-option')
      .its('length')
      .then((total) => {
        const idx = Math.min(7, Cypress._.random(0, total - 1));
        cy.get('.ant-select-dropdown')
          .last()
          .find('.ant-select-item-option')
          .eq(idx)
          .click();
      });

    /* ── Validate recipient‑received amount ───────────────────── */
    cy.get(':nth-child(3) > :nth-child(2) > .ant-typography')
      .invoke('text')
      .then((text) => {
        cy.wrap(text).as('storedText');
        cy.log(text);
      });

    // ─────────────── Confirmation Screens ───────────────
    cy.get('.ant-col > .ant-btn > span').should('be.visible').click();

    cy.get('.ant-modal-body > :nth-child(1) > .ant-col > .ant-typography')
      .should('be.visible')
      .and('contain.text', 'Payment Confirmation');

    cy.get('@storedText').then((storedText) => {
      cy.get(':nth-child(4) > .ant-col-8 > .ant-typography')
        .should('be.visible')
        .and('contain.text', storedText);
    });

    // Pay recipient
    cy.get(
      '.ant-row-center.m-t-20 > .ant-col > .ant-space > :nth-child(2) > .ant-btn'
    )
      .should('be.visible')
      .click();

    cy.get('.ant-modal-body > :nth-child(1) > .ant-col')
      .should('be.visible')
      .and('contain.text', ' Payment Booked - ');

    cy.get('@storedText').then((storedText) => {
      cy.get(':nth-child(5) > .ant-col-8 > .ant-typography')
        .should('be.visible')
        .and('contain.text', storedText);
    })
    })
    it('TC-AC-070 - Verify that(business) if Currency= TRY and Country = UNITED KINGDOM & client = UK and check priority settlement is enabled and make a payment with GBP using Push Funds',function () {
    // ─────────────── Setup & Recipient Creation ───────────────
        signin.Login(userName, password)
        newRecipient.goToPaymentsDashborad()
        newRecipient.gotoRecipientList()
        let email = batchPayments.generateRandomString(5)+ '@yopmail.com'
        newRecipient.addRecipient('UNITED KINGDOM{enter}' ,'TRY{enter}',email)
        newRecipient.addBankDetails('GB73BARC20039538243547','AFFLGB22')
        newRecipient.addBusinessRecipientCorpay('UNITED KINGDOM{enter}','UK TRY')
        newRecipient.saveRecipient()
        newRecipient.checkSettelment('be.disabled','be.enabled')

    // ─────────────── Payment Flow ───────────────
    newPayment.proceedflow('{downarrow}{enter}', 'GBP');
    const amount = '10';
    newPayment.addrecipientDetail(amount, email);
    newPayment.selectFundingMethod('Push Funds');

    /* ── Validate payment‑reason field ───────────────────────── */
    // 1️⃣ Ensure the field starts empty
    cy.get('.ant-select-selector')
      .eq(2)
      .should(($el) => {
        expect(
          $el.text().trim(),
          'reason field should start empty'
        ).to.equal('');
      })
      .click(); // open dropdown

    // 2️⃣ Pick a random option between 1 and 7
    cy.get('.ant-select-dropdown')
      .last()
      .find('.ant-select-item-option')
      .its('length')
      .then((total) => {
        const idx = Math.min(7, Cypress._.random(0, total - 1));
        cy.get('.ant-select-dropdown')
          .last()
          .find('.ant-select-item-option')
          .eq(idx)
          .click();
      });

    /* ── Validate recipient‑received amount ───────────────────── */
    cy.get(':nth-child(3) > :nth-child(2) > .ant-typography')
      .invoke('text')
      .then((text) => {
        cy.wrap(text).as('storedText');
        cy.log(text);
      });

    // ─────────────── Confirmation Screens ───────────────
    cy.get('.ant-col > .ant-btn > span').should('be.visible').click();

    cy.get('.ant-modal-body > :nth-child(1) > .ant-col > .ant-typography')
      .should('be.visible')
      .and('contain.text', 'Payment Confirmation');

    cy.get('@storedText').then((storedText) => {
      cy.get(':nth-child(4) > .ant-col-8 > .ant-typography')
        .should('be.visible')
        .and('contain.text', storedText);
    });

    // Pay recipient
    cy.get(
      '.ant-row-center.m-t-20 > .ant-col > .ant-space > :nth-child(2) > .ant-btn'
    )
      .should('be.visible')
      .click();

    cy.get('.ant-modal-body > :nth-child(1) > .ant-col')
      .should('be.visible')
      .and('contain.text', ' Payment Booked - ');

    cy.get('@storedText').then((storedText) => {
      cy.get(':nth-child(5) > .ant-col-8 > .ant-typography')
        .should('be.visible')
        .and('contain.text', storedText);
    })
    })
    it('TC-AC-071 - Verify that(business) if Currency= TRY and Country = Turkey & client = UK and check priority settlement is enabled and make a payment with GBP using Push Funds',function () {
    // ─────────────── Setup & Recipient Creation ───────────────
       signin.Login(userName, password)
        newRecipient.goToPaymentsDashborad()
        newRecipient.gotoRecipientList()
        let email = batchPayments.generateRandomString(5)+ '@yopmail.com'
        newRecipient.addRecipient('TURKEY{enter}' ,'TRY{enter}',email)
        newRecipient.addBankDetails('TR690006245145456117494371','CAYTTRIS002')
        newRecipient.addBusinessRecipientCorpay('TURKEY{enter}', 'Turkey TRY')
        newRecipient.saveRecipient()
        //newRecipient.checkAmountLimit('5000001','Maximum limit for TRY is 5,000,000.00')
        newRecipient.checkSettelment('be.disabled','be.enabled')

    // ─────────────── Payment Flow ───────────────
    newPayment.proceedflow('{downarrow}{enter}', 'GBP');
    const amount = '10';
    newPayment.addrecipientDetail(amount, email);
    newPayment.selectFundingMethod('Push Funds');

    /* ── Validate payment‑reason field ───────────────────────── */
    // 1️⃣ Ensure the field starts empty
    cy.get('.ant-select-selector')
      .eq(2)
      .should(($el) => {
        expect(
          $el.text().trim(),
          'reason field should start empty'
        ).to.equal('');
      })
      .click(); // open dropdown

    // 2️⃣ Pick a random option between 1 and 7
    cy.get('.ant-select-dropdown')
      .last()
      .find('.ant-select-item-option')
      .its('length')
      .then((total) => {
        const idx = Math.min(7, Cypress._.random(0, total - 1));
        cy.get('.ant-select-dropdown')
          .last()
          .find('.ant-select-item-option')
          .eq(idx)
          .click();
      });

    /* ── Validate recipient‑received amount ───────────────────── */
    cy.get(':nth-child(3) > :nth-child(2) > .ant-typography')
      .invoke('text')
      .then((text) => {
        cy.wrap(text).as('storedText');
        cy.log(text);
      });

    // ─────────────── Confirmation Screens ───────────────
    cy.get('.ant-col > .ant-btn > span').should('be.visible').click();

    cy.get('.ant-modal-body > :nth-child(1) > .ant-col > .ant-typography')
      .should('be.visible')
      .and('contain.text', 'Payment Confirmation');

    cy.get('@storedText').then((storedText) => {
      cy.get(':nth-child(4) > .ant-col-8 > .ant-typography')
        .should('be.visible')
        .and('contain.text', storedText);
    });

    // Pay recipient
    cy.get(
      '.ant-row-center.m-t-20 > .ant-col > .ant-space > :nth-child(2) > .ant-btn'
    )
      .should('be.visible')
      .click();

    cy.get('.ant-modal-body > :nth-child(1) > .ant-col')
      .should('be.visible')
      .and('contain.text', ' Payment Booked - ');

    cy.get('@storedText').then((storedText) => {
      cy.get(':nth-child(5) > .ant-col-8 > .ant-typography')
        .should('be.visible')
        .and('contain.text', storedText);
    })
    })
    it('TC-AC-072 - Verify that(business) if Currency= KWD and Country = UNITED KINGDOM & client = UK and check priority settlement is enabled and make a payment with GBP using Push Funds',function () {
    // ─────────────── Setup & Recipient Creation ───────────────
        signin.Login(userName, password)
        newRecipient.goToPaymentsDashborad()
        newRecipient.gotoRecipientList()
        let email = batchPayments.generateRandomString(5)+ '@yopmail.com'
        newRecipient.addRecipient('UNITED KINGDOM{enter}' ,'KWD{enter}',email)
        newRecipient.addBankDetails('GB73BARC20039538243547','AFFLGB22')
        newRecipient.addBusinessRecipientCorpay('UNITED KINGDOM{enter}','UK KWD')
        newRecipient.saveRecipient()
        newRecipient.checkSettelment('be.disabled','be.enabled')

    // ─────────────── Payment Flow ───────────────
    newPayment.proceedflow('{downarrow}{enter}', 'GBP');
    const amount = '10';
    newPayment.addrecipientDetail(amount, email);
    newPayment.selectFundingMethod('Push Funds');

    /* ── Validate payment‑reason field ───────────────────────── */
    // 1️⃣ Ensure the field starts empty
    cy.get('.ant-select-selector')
      .eq(2)
      .should(($el) => {
        expect(
          $el.text().trim(),
          'reason field should start empty'
        ).to.equal('');
      })
      .click(); // open dropdown

    // 2️⃣ Pick a random option between 1 and 7
    cy.get('.ant-select-dropdown')
      .last()
      .find('.ant-select-item-option')
      .its('length')
      .then((total) => {
        const idx = Math.min(7, Cypress._.random(0, total - 1));
        cy.get('.ant-select-dropdown')
          .last()
          .find('.ant-select-item-option')
          .eq(idx)
          .click();
      });

    /* ── Validate recipient‑received amount ───────────────────── */
    cy.get(':nth-child(3) > :nth-child(2) > .ant-typography')
      .invoke('text')
      .then((text) => {
        cy.wrap(text).as('storedText');
        cy.log(text);
      });

    // ─────────────── Confirmation Screens ───────────────
    cy.get('.ant-col > .ant-btn > span').should('be.visible').click();

    cy.get('.ant-modal-body > :nth-child(1) > .ant-col > .ant-typography')
      .should('be.visible')
      .and('contain.text', 'Payment Confirmation');

    cy.get('@storedText').then((storedText) => {
      cy.get(':nth-child(4) > .ant-col-8 > .ant-typography')
        .should('be.visible')
        .and('contain.text', storedText);
    });

    // Pay recipient
    cy.get(
      '.ant-row-center.m-t-20 > .ant-col > .ant-space > :nth-child(2) > .ant-btn'
    )
      .should('be.visible')
      .click();

    cy.get('.ant-modal-body > :nth-child(1) > .ant-col')
      .should('be.visible')
      .and('contain.text', ' Payment Booked - ');

    cy.get('@storedText').then((storedText) => {
      cy.get(':nth-child(5) > .ant-col-8 > .ant-typography')
        .should('be.visible')
        .and('contain.text', storedText);
    })
    })
    it('TC-AC-073 - Verify that(business) if Currency= KWD and Country = Kuwait & client = UK and check priority settlement is enabled and make a payment with GBP using Push Funds',function () {
    // ─────────────── Setup & Recipient Creation ───────────────
        signin.Login(userName, password)
        newRecipient.goToPaymentsDashborad()
        newRecipient.gotoRecipientList()
        let email = batchPayments.generateRandomString(5)+ '@yopmail.com'
        newRecipient.addRecipient('KUWAIT{enter}' ,'KWD{enter}',email)
        newRecipient.addBankDetails('KW81CBKU0000000000001234560101','ABKKKWKW')
        newRecipient.addBusinessRecipientCorpay('KUWAIT{enter}','Kuwait KWD')
        newRecipient.saveRecipient()
        newRecipient.checkSettelment('be.disabled','be.enabled')

    // ─────────────── Payment Flow ───────────────
    newPayment.proceedflow('{downarrow}{enter}', 'GBP');
    const amount = '10';
    newPayment.addrecipientDetail(amount, email);
    newPayment.selectFundingMethod('Push Funds');

    /* ── Validate payment‑reason field ───────────────────────── */
    // 1️⃣ Ensure the field starts empty
    cy.get('.ant-select-selector')
      .eq(2)
      .should(($el) => {
        expect(
          $el.text().trim(),
          'reason field should start empty'
        ).to.equal('');
      })
      .click(); // open dropdown

    // 2️⃣ Pick a random option between 1 and 7
    cy.get('.ant-select-dropdown')
      .last()
      .find('.ant-select-item-option')
      .its('length')
      .then((total) => {
        const idx = Math.min(7, Cypress._.random(0, total - 1));
        cy.get('.ant-select-dropdown')
          .last()
          .find('.ant-select-item-option')
          .eq(idx)
          .click();
      });

    /* ── Validate recipient‑received amount ───────────────────── */
    cy.get(':nth-child(3) > :nth-child(2) > .ant-typography')
      .invoke('text')
      .then((text) => {
        cy.wrap(text).as('storedText');
        cy.log(text);
      });

    // ─────────────── Confirmation Screens ───────────────
    cy.get('.ant-col > .ant-btn > span').should('be.visible').click();

    cy.get('.ant-modal-body > :nth-child(1) > .ant-col > .ant-typography')
      .should('be.visible')
      .and('contain.text', 'Payment Confirmation');

    cy.get('@storedText').then((storedText) => {
      cy.get(':nth-child(4) > .ant-col-8 > .ant-typography')
        .should('be.visible')
        .and('contain.text', storedText);
    });

    // Pay recipient
    cy.get(
      '.ant-row-center.m-t-20 > .ant-col > .ant-space > :nth-child(2) > .ant-btn'
    )
      .should('be.visible')
      .click();

    cy.get('.ant-modal-body > :nth-child(1) > .ant-col')
      .should('be.visible')
      .and('contain.text', ' Payment Booked - ');

    cy.get('@storedText').then((storedText) => {
      cy.get(':nth-child(5) > .ant-col-8 > .ant-typography')
        .should('be.visible')
        .and('contain.text', storedText);
    })
    })
    it('TC-AC-074 - Verify that(business) if Currency= OMR and Country = UNITED KINGDOM & client = UK and check priority settlement is enabled and make a payment with GBP using Push Funds',function () {
    // ─────────────── Setup & Recipient Creation ───────────────
         signin.Login(userName, password)
        newRecipient.goToPaymentsDashborad()
        newRecipient.gotoRecipientList()
        let email = batchPayments.generateRandomString(5)+ '@yopmail.com'
        newRecipient.addRecipient('UNITED KINGDOM{enter}' ,'OMR{enter}',email)
        newRecipient.addBankDetails('GB73BARC20039538243547','AFFLGB22')
        newRecipient.addBusinessRecipientCorpay('UNITED KINGDOM{enter}','UK OMR')
        newRecipient.saveRecipient()
        newRecipient.checkSettelment('be.disabled','be.enabled')

    // ─────────────── Payment Flow ───────────────
    newPayment.proceedflow('{downarrow}{enter}', 'GBP');
    const amount = '10';
    newPayment.addrecipientDetail(amount, email);
    newPayment.selectFundingMethod('Push Funds');

    /* ── Validate payment‑reason field ───────────────────────── */
    // 1️⃣ Ensure the field starts empty
    cy.get('.ant-select-selector')
      .eq(2)
      .should(($el) => {
        expect(
          $el.text().trim(),
          'reason field should start empty'
        ).to.equal('');
      })
      .click(); // open dropdown

    // 2️⃣ Pick a random option between 1 and 7
    cy.get('.ant-select-dropdown')
      .last()
      .find('.ant-select-item-option')
      .its('length')
      .then((total) => {
        const idx = Math.min(7, Cypress._.random(0, total - 1));
        cy.get('.ant-select-dropdown')
          .last()
          .find('.ant-select-item-option')
          .eq(idx)
          .click();
      });

    /* ── Validate recipient‑received amount ───────────────────── */
    cy.get(':nth-child(3) > :nth-child(2) > .ant-typography')
      .invoke('text')
      .then((text) => {
        cy.wrap(text).as('storedText');
        cy.log(text);
      });

    // ─────────────── Confirmation Screens ───────────────
    cy.get('.ant-col > .ant-btn > span').should('be.visible').click();

    cy.get('.ant-modal-body > :nth-child(1) > .ant-col > .ant-typography')
      .should('be.visible')
      .and('contain.text', 'Payment Confirmation');

    cy.get('@storedText').then((storedText) => {
      cy.get(':nth-child(4) > .ant-col-8 > .ant-typography')
        .should('be.visible')
        .and('contain.text', storedText);
    });

    // Pay recipient
    cy.get(
      '.ant-row-center.m-t-20 > .ant-col > .ant-space > :nth-child(2) > .ant-btn'
    )
      .should('be.visible')
      .click();

    cy.get('.ant-modal-body > :nth-child(1) > .ant-col')
      .should('be.visible')
      .and('contain.text', ' Payment Booked - ');

    cy.get('@storedText').then((storedText) => {
      cy.get(':nth-child(5) > .ant-col-8 > .ant-typography')
        .should('be.visible')
        .and('contain.text', storedText);
    })
    })
    it('TC-AC-075 - Verify that(business) if Currency= OMR and Country = Oman & client = UK and check priority settlement is enabled and make a payment with GBP using Push Funds',function () {
    // ─────────────── Setup & Recipient Creation ───────────────
         signin.Login(userName, password)
        newRecipient.goToPaymentsDashborad()
        newRecipient.gotoRecipientList()
        let email = batchPayments.generateRandomString(5)+ '@yopmail.com'
        newRecipient.addRecipient('OMAN{enter}' ,'OMR{enter}',email)
        newRecipient.addBankDetails('OM040280000012345678901','BDOFOMRUMIB')
        newRecipient.addBusinessRecipientCorpay('OMAN{enter}','OMAN OMR')
        newRecipient.saveRecipient()
        newRecipient.checkSettelment('be.disabled','be.enabled')

    // ─────────────── Payment Flow ───────────────
    newPayment.proceedflow('{downarrow}{enter}', 'GBP');
    const amount = '10';
    newPayment.addrecipientDetail(amount, email);
    newPayment.selectFundingMethod('Push Funds');

    /* ── Validate payment‑reason field ───────────────────────── */
    // 1️⃣ Ensure the field starts empty
    cy.get('.ant-select-selector')
      .eq(2)
      .should(($el) => {
        expect(
          $el.text().trim(),
          'reason field should start empty'
        ).to.equal('');
      })
      .click(); // open dropdown

    // 2️⃣ Pick a random option between 1 and 7
    cy.get('.ant-select-dropdown')
      .last()
      .find('.ant-select-item-option')
      .its('length')
      .then((total) => {
        const idx = Math.min(7, Cypress._.random(0, total - 1));
        cy.get('.ant-select-dropdown')
          .last()
          .find('.ant-select-item-option')
          .eq(idx)
          .click();
      });

    /* ── Validate recipient‑received amount ───────────────────── */
    cy.get(':nth-child(3) > :nth-child(2) > .ant-typography')
      .invoke('text')
      .then((text) => {
        cy.wrap(text).as('storedText');
        cy.log(text);
      });

    // ─────────────── Confirmation Screens ───────────────
    cy.get('.ant-col > .ant-btn > span').should('be.visible').click();

    cy.get('.ant-modal-body > :nth-child(1) > .ant-col > .ant-typography')
      .should('be.visible')
      .and('contain.text', 'Payment Confirmation');

    cy.get('@storedText').then((storedText) => {
      cy.get(':nth-child(4) > .ant-col-8 > .ant-typography')
        .should('be.visible')
        .and('contain.text', storedText);
    });

    // Pay recipient
    cy.get(
      '.ant-row-center.m-t-20 > .ant-col > .ant-space > :nth-child(2) > .ant-btn'
    )
      .should('be.visible')
      .click();

    cy.get('.ant-modal-body > :nth-child(1) > .ant-col')
      .should('be.visible')
      .and('contain.text', ' Payment Booked - ');

    cy.get('@storedText').then((storedText) => {
      cy.get(':nth-child(5) > .ant-col-8 > .ant-typography')
        .should('be.visible')
        .and('contain.text', storedText);
    })
    })
    it('TC-AC-076 - Verify that(business) if Currency= SAR and Country = UNITED KINGDOM & client = UK and check priority settlement is enabled and make a payment with GBP using Push Funds',function () {
    // ─────────────── Setup & Recipient Creation ───────────────
        signin.Login(userName, password)
        newRecipient.goToPaymentsDashborad()
        newRecipient.gotoRecipientList()
        let email = batchPayments.generateRandomString(5)+ '@yopmail.com'
        newRecipient.addRecipient('UNITED KINGDOM{enter}' ,'SAR{enter}',email)
        newRecipient.addBankDetails('GB73BARC20039538243547','AFFLGB22')
        newRecipient.addBusinessRecipientCorpay('UNITED KINGDOM{enter}','UK SAR')
        newRecipient.saveRecipient()
        newRecipient.checkSettelment('be.disabled','be.enabled')
    // ─────────────── Payment Flow ───────────────
    newPayment.proceedflow('{downarrow}{enter}', 'GBP');
    const amount = '10';
    newPayment.addrecipientDetail(amount, email);
    newPayment.selectFundingMethod('Push Funds');

    /* ── Validate payment‑reason field ───────────────────────── */
    // 1️⃣ Ensure the field starts empty
    cy.get('.ant-select-selector')
      .eq(2)
      .should(($el) => {
        expect(
          $el.text().trim(),
          'reason field should start empty'
        ).to.equal('');
      })
      .click(); // open dropdown

    // 2️⃣ Pick a random option between 1 and 7
    cy.get('.ant-select-dropdown')
      .last()
      .find('.ant-select-item-option')
      .its('length')
      .then((total) => {
        const idx = Math.min(7, Cypress._.random(0, total - 1));
        cy.get('.ant-select-dropdown')
          .last()
          .find('.ant-select-item-option')
          .eq(idx)
          .click();
      });

    /* ── Validate recipient‑received amount ───────────────────── */
    cy.get(':nth-child(3) > :nth-child(2) > .ant-typography')
      .invoke('text')
      .then((text) => {
        cy.wrap(text).as('storedText');
        cy.log(text);
      });

    // ─────────────── Confirmation Screens ───────────────
    cy.get('.ant-col > .ant-btn > span').should('be.visible').click();

    cy.get('.ant-modal-body > :nth-child(1) > .ant-col > .ant-typography')
      .should('be.visible')
      .and('contain.text', 'Payment Confirmation');

    cy.get('@storedText').then((storedText) => {
      cy.get(':nth-child(4) > .ant-col-8 > .ant-typography')
        .should('be.visible')
        .and('contain.text', storedText);
    });

    // Pay recipient
    cy.get(
      '.ant-row-center.m-t-20 > .ant-col > .ant-space > :nth-child(2) > .ant-btn'
    )
      .should('be.visible')
      .click();

    cy.get('.ant-modal-body > :nth-child(1) > .ant-col')
      .should('be.visible')
      .and('contain.text', ' Payment Booked - ');

    cy.get('@storedText').then((storedText) => {
      cy.get(':nth-child(5) > .ant-col-8 > .ant-typography')
        .should('be.visible')
        .and('contain.text', storedText);
    })
    })
    it('TC-AC-077 - Verify that(business) if Currency= SAR and Country = Saudia Arabia & client = UK and check priority settlement is enabled and make a payment with GBP using Push Funds',function () {
    // ─────────────── Setup & Recipient Creation ───────────────
       signin.Login(userName, password)
        newRecipient.goToPaymentsDashborad()
        newRecipient.gotoRecipientList()
        let email = batchPayments.generateRandomString(5)+ '@yopmail.com'
        newRecipient.addRecipient('SAUDI ARABIA{enter}' ,'SAR{enter}',email)
        newRecipient.addBankDetails('SA0380000000608010167519','AIASSARI')
        newRecipient.addBusinessRecipientCorpay('SAUDI ARABIA{enter}','Saudia Arabia SAR')
        newRecipient.saveRecipient()
        newRecipient.checkSettelment('be.disabled','be.enabled')
    // ─────────────── Payment Flow ───────────────
    newPayment.proceedflow('{downarrow}{enter}', 'GBP');
    const amount = '10';
    newPayment.addrecipientDetail(amount, email);
    newPayment.selectFundingMethod('Push Funds');

    /* ── Validate payment‑reason field ───────────────────────── */
    // 1️⃣ Ensure the field starts empty
    cy.get('.ant-select-selector')
      .eq(2)
      .should(($el) => {
        expect(
          $el.text().trim(),
          'reason field should start empty'
        ).to.equal('');
      })
      .click(); // open dropdown

    // 2️⃣ Pick a random option between 1 and 7
    cy.get('.ant-select-dropdown')
      .last()
      .find('.ant-select-item-option')
      .its('length')
      .then((total) => {
        const idx = Math.min(7, Cypress._.random(0, total - 1));
        cy.get('.ant-select-dropdown')
          .last()
          .find('.ant-select-item-option')
          .eq(idx)
          .click();
      });

    /* ── Validate recipient‑received amount ───────────────────── */
    cy.get(':nth-child(3) > :nth-child(2) > .ant-typography')
      .invoke('text')
      .then((text) => {
        cy.wrap(text).as('storedText');
        cy.log(text);
      });

    // ─────────────── Confirmation Screens ───────────────
    cy.get('.ant-col > .ant-btn > span').should('be.visible').click();

    cy.get('.ant-modal-body > :nth-child(1) > .ant-col > .ant-typography')
      .should('be.visible')
      .and('contain.text', 'Payment Confirmation');

    cy.get('@storedText').then((storedText) => {
      cy.get(':nth-child(4) > .ant-col-8 > .ant-typography')
        .should('be.visible')
        .and('contain.text', storedText);
    });

    // Pay recipient
    cy.get(
      '.ant-row-center.m-t-20 > .ant-col > .ant-space > :nth-child(2) > .ant-btn'
    )
      .should('be.visible')
      .click();

    cy.get('.ant-modal-body > :nth-child(1) > .ant-col')
      .should('be.visible')
      .and('contain.text', ' Payment Booked - ');

    cy.get('@storedText').then((storedText) => {
      cy.get(':nth-child(5) > .ant-col-8 > .ant-typography')
        .should('be.visible')
        .and('contain.text', storedText);
    })
    })
    it('TC-AC-078 - Verify that(business) if Currency= QAR and Country = UNITED KINGDOM & client = UK and check priority settlement is enabled and make a payment with GBP using Push Funds',function () {
    // ─────────────── Setup & Recipient Creation ───────────────
        signin.Login(userName, password)
        newRecipient.goToPaymentsDashborad()
        newRecipient.gotoRecipientList()
        let email = batchPayments.generateRandomString(5)+ '@yopmail.com'
        newRecipient.addRecipient('UNITED KINGDOM{enter}' ,'QAR{enter}',email)
        newRecipient.addBankDetails('GB73BARC20039538243547','AFFLGB22')
        newRecipient.addBusinessRecipientCorpay('UNITED KINGDOM{enter}','UK QAR')
        newRecipient.saveRecipient()
        newRecipient.checkSettelment('be.disabled','be.enabled')
    // ─────────────── Payment Flow ───────────────
    newPayment.proceedflow('{downarrow}{enter}', 'GBP');
    const amount = '10';
    newPayment.addrecipientDetail(amount, email);
    newPayment.selectFundingMethod('Push Funds');

    /* ── Validate payment‑reason field ───────────────────────── */
    // 1️⃣ Ensure the field starts empty
    cy.get('.ant-select-selector')
      .eq(2)
      .should(($el) => {
        expect(
          $el.text().trim(),
          'reason field should start empty'
        ).to.equal('');
      })
      .click(); // open dropdown

    // 2️⃣ Pick a random option between 1 and 7
    cy.get('.ant-select-dropdown')
      .last()
      .find('.ant-select-item-option')
      .its('length')
      .then((total) => {
        const idx = Math.min(7, Cypress._.random(0, total - 1));
        cy.get('.ant-select-dropdown')
          .last()
          .find('.ant-select-item-option')
          .eq(idx)
          .click();
      });

    /* ── Validate recipient‑received amount ───────────────────── */
    cy.get(':nth-child(3) > :nth-child(2) > .ant-typography')
      .invoke('text')
      .then((text) => {
        cy.wrap(text).as('storedText');
        cy.log(text);
      });

    // ─────────────── Confirmation Screens ───────────────
    cy.get('.ant-col > .ant-btn > span').should('be.visible').click();

    cy.get('.ant-modal-body > :nth-child(1) > .ant-col > .ant-typography')
      .should('be.visible')
      .and('contain.text', 'Payment Confirmation');

    cy.get('@storedText').then((storedText) => {
      cy.get(':nth-child(4) > .ant-col-8 > .ant-typography')
        .should('be.visible')
        .and('contain.text', storedText);
    });

    // Pay recipient
    cy.get(
      '.ant-row-center.m-t-20 > .ant-col > .ant-space > :nth-child(2) > .ant-btn'
    )
      .should('be.visible')
      .click();

    cy.get('.ant-modal-body > :nth-child(1) > .ant-col')
      .should('be.visible')
      .and('contain.text', ' Payment Booked - ');

    cy.get('@storedText').then((storedText) => {
      cy.get(':nth-child(5) > .ant-col-8 > .ant-typography')
        .should('be.visible')
        .and('contain.text', storedText);
    })
    })
    it('TC-AC-079 - Verify that(business) if Currency= QAR and Country = Qatar & client = UK and check priority settlement is enabled and make a payment with GBP using Push Funds',function () {
    // ─────────────── Setup & Recipient Creation ───────────────
        signin.Login(userName, password)
        newRecipient.goToPaymentsDashborad()
        newRecipient.gotoRecipientList()
        let email = batchPayments.generateRandomString(5)+ '@yopmail.com'
        newRecipient.addRecipient('QATAR{enter}' ,'QAR{enter}',email)
        newRecipient.addBankDetails('QA58DOHB00001234567890ABCDEFG','ALZAQAQA')
        newRecipient.addBusinessRecipientCorpay('QATAR{enter}','Qatar QAR')
        newRecipient.saveRecipient()
        newRecipient.checkSettelment('be.disabled','be.enabled')
    // ─────────────── Payment Flow ───────────────
    newPayment.proceedflow('{downarrow}{enter}', 'GBP');
    const amount = '10';
    newPayment.addrecipientDetail(amount, email);
    newPayment.selectFundingMethod('Push Funds');

    /* ── Validate payment‑reason field ───────────────────────── */
    // 1️⃣ Ensure the field starts empty
    cy.get('.ant-select-selector')
      .eq(2)
      .should(($el) => {
        expect(
          $el.text().trim(),
          'reason field should start empty'
        ).to.equal('');
      })
      .click(); // open dropdown

    // 2️⃣ Pick a random option between 1 and 7
    cy.get('.ant-select-dropdown')
      .last()
      .find('.ant-select-item-option')
      .its('length')
      .then((total) => {
        const idx = Math.min(7, Cypress._.random(0, total - 1));
        cy.get('.ant-select-dropdown')
          .last()
          .find('.ant-select-item-option')
          .eq(idx)
          .click();
      });

    /* ── Validate recipient‑received amount ───────────────────── */
    cy.get(':nth-child(3) > :nth-child(2) > .ant-typography')
      .invoke('text')
      .then((text) => {
        cy.wrap(text).as('storedText');
        cy.log(text);
      });

    // ─────────────── Confirmation Screens ───────────────
    cy.get('.ant-col > .ant-btn > span').should('be.visible').click();

    cy.get('.ant-modal-body > :nth-child(1) > .ant-col > .ant-typography')
      .should('be.visible')
      .and('contain.text', 'Payment Confirmation');

    cy.get('@storedText').then((storedText) => {
      cy.get(':nth-child(4) > .ant-col-8 > .ant-typography')
        .should('be.visible')
        .and('contain.text', storedText);
    });

    // Pay recipient
    cy.get(
      '.ant-row-center.m-t-20 > .ant-col > .ant-space > :nth-child(2) > .ant-btn'
    )
      .should('be.visible')
      .click();

    cy.get('.ant-modal-body > :nth-child(1) > .ant-col')
      .should('be.visible')
      .and('contain.text', ' Payment Booked - ');

    cy.get('@storedText').then((storedText) => {
      cy.get(':nth-child(5) > .ant-col-8 > .ant-typography')
        .should('be.visible')
        .and('contain.text', storedText);
    })
    })
    it('TC-AC-080 - Verify that(business) if Currency= CZK and Country = UNITED KINGDOM & client = UK and check priority settlement is enabled and make a payment with GBP using Push Funds',function () {
    // ─────────────── Setup & Recipient Creation ───────────────
        signin.Login(userName, password)
        newRecipient.goToPaymentsDashborad()
        newRecipient.gotoRecipientList()
        let email = batchPayments.generateRandomString(5)+ '@yopmail.com'
        newRecipient.addRecipient('UNITED KINGDOM{enter}' ,'CZK{enter}',email)
        newRecipient.addBankDetails('GB73BARC20039538243547','AFFLGB22')
        newRecipient.addBusinessRecipientCorpay('UNITED KINGDOM{enter}','UK CZK')
        newRecipient.saveRecipient()
        newRecipient.checkSettelment('be.disabled','be.enabled')
    // ─────────────── Payment Flow ───────────────
    newPayment.proceedflow('{downarrow}{enter}', 'GBP');
    const amount = '10';
    newPayment.addrecipientDetail(amount, email);
    newPayment.selectFundingMethod('Push Funds');

    /* ── Validate payment‑reason field ───────────────────────── */
    // 1️⃣ Ensure the field starts empty
    cy.get('.ant-select-selector')
      .eq(2)
      .should(($el) => {
        expect(
          $el.text().trim(),
          'reason field should start empty'
        ).to.equal('');
      })
      .click(); // open dropdown

    // 2️⃣ Pick a random option between 1 and 7
    cy.get('.ant-select-dropdown')
      .last()
      .find('.ant-select-item-option')
      .its('length')
      .then((total) => {
        const idx = Math.min(7, Cypress._.random(0, total - 1));
        cy.get('.ant-select-dropdown')
          .last()
          .find('.ant-select-item-option')
          .eq(idx)
          .click();
      });

    /* ── Validate recipient‑received amount ───────────────────── */
    cy.get(':nth-child(3) > :nth-child(2) > .ant-typography')
      .invoke('text')
      .then((text) => {
        cy.wrap(text).as('storedText');
        cy.log(text);
      });

    // ─────────────── Confirmation Screens ───────────────
    cy.get('.ant-col > .ant-btn > span').should('be.visible').click();

    cy.get('.ant-modal-body > :nth-child(1) > .ant-col > .ant-typography')
      .should('be.visible')
      .and('contain.text', 'Payment Confirmation');

    cy.get('@storedText').then((storedText) => {
      cy.get(':nth-child(4) > .ant-col-8 > .ant-typography')
        .should('be.visible')
        .and('contain.text', storedText);
    });

    // Pay recipient
    cy.get(
      '.ant-row-center.m-t-20 > .ant-col > .ant-space > :nth-child(2) > .ant-btn'
    )
      .should('be.visible')
      .click();

    cy.get('.ant-modal-body > :nth-child(1) > .ant-col')
      .should('be.visible')
      .and('contain.text', ' Payment Booked - ');

    cy.get('@storedText').then((storedText) => {
      cy.get(':nth-child(5) > .ant-col-8 > .ant-typography')
        .should('be.visible')
        .and('contain.text', storedText);
    })
    })
    it('TC-AC-081 - Verify that(business) if Currency= CZK and Country = Czech Republic & client = UK and check priority settlement is enabled and make a payment with GBP using Push Funds',function () {
    // ─────────────── Setup & Recipient Creation ───────────────
        signin.Login(userName, password)
        newRecipient.goToPaymentsDashborad()
        newRecipient.gotoRecipientList()
        let email = batchPayments.generateRandomString(5)+ '@yopmail.com'
        newRecipient.addRecipient('Czech Republic{enter}' ,'CZK{enter}',email)
        newRecipient.addBankDetails('CZ5508000000001234567899','AKCNCZP2')
        newRecipient.addBusinessRecipientCorpay('Czech Republic{enter}','Czech Republic CZK')
        newRecipient.saveRecipient()
        newRecipient.checkSettelment('be.disabled','be.enabled')
    // ─────────────── Payment Flow ───────────────
    newPayment.proceedflow('{downarrow}{enter}', 'GBP');
    const amount = '10';
    newPayment.addrecipientDetail(amount, email);
    newPayment.selectFundingMethod('Push Funds');

    /* ── Validate payment‑reason field ───────────────────────── */
    // 1️⃣ Ensure the field starts empty
    cy.get('.ant-select-selector')
      .eq(2)
      .should(($el) => {
        expect(
          $el.text().trim(),
          'reason field should start empty'
        ).to.equal('');
      })
      .click(); // open dropdown

    // 2️⃣ Pick a random option between 1 and 7
    cy.get('.ant-select-dropdown')
      .last()
      .find('.ant-select-item-option')
      .its('length')
      .then((total) => {
        const idx = Math.min(7, Cypress._.random(0, total - 1));
        cy.get('.ant-select-dropdown')
          .last()
          .find('.ant-select-item-option')
          .eq(idx)
          .click();
      });

    /* ── Validate recipient‑received amount ───────────────────── */
    cy.get(':nth-child(3) > :nth-child(2) > .ant-typography')
      .invoke('text')
      .then((text) => {
        cy.wrap(text).as('storedText');
        cy.log(text);
      });

    // ─────────────── Confirmation Screens ───────────────
    cy.get('.ant-col > .ant-btn > span').should('be.visible').click();

    cy.get('.ant-modal-body > :nth-child(1) > .ant-col > .ant-typography')
      .should('be.visible')
      .and('contain.text', 'Payment Confirmation');

    cy.get('@storedText').then((storedText) => {
      cy.get(':nth-child(4) > .ant-col-8 > .ant-typography')
        .should('be.visible')
        .and('contain.text', storedText);
    });

    // Pay recipient
    cy.get(
      '.ant-row-center.m-t-20 > .ant-col > .ant-space > :nth-child(2) > .ant-btn'
    )
      .should('be.visible')
      .click();

    cy.get('.ant-modal-body > :nth-child(1) > .ant-col')
      .should('be.visible')
      .and('contain.text', ' Payment Booked - ');

    cy.get('@storedText').then((storedText) => {
      cy.get(':nth-child(5) > .ant-col-8 > .ant-typography')
        .should('be.visible')
        .and('contain.text', storedText);
    })
    })
    it('TC-AC-082 - Verify that(business) if Currency= RON and Country = UNITED KINGDOM & client = UK and check priority settlement is enabled and make a payment with GBP using Push Funds',function () {
    // ─────────────── Setup & Recipient Creation ───────────────
        signin.Login(userName, password)
        newRecipient.goToPaymentsDashborad()
        newRecipient.gotoRecipientList()
        let email = batchPayments.generateRandomString(5)+ '@yopmail.com'
        newRecipient.addRecipient('UNITED KINGDOM{enter}' ,'RON{enter}',email)
        newRecipient.addBankDetails('GB73BARC20039538243547','BACXROBUXXX')
        newRecipient.addBusinessRecipientCorpay('UNITED KINGDOM{enter}','UK RON')
        newRecipient.saveRecipient()
        newRecipient.checkSettelment('be.disabled','be.enabled')
    // ─────────────── Payment Flow ───────────────
    newPayment.proceedflow('{downarrow}{enter}', 'GBP');
    const amount = '10';
    newPayment.addrecipientDetail(amount, email);
    newPayment.selectFundingMethod('Push Funds');

    /* ── Validate payment‑reason field ───────────────────────── */
    // 1️⃣ Ensure the field starts empty
    cy.get('.ant-select-selector')
      .eq(2)
      .should(($el) => {
        expect(
          $el.text().trim(),
          'reason field should start empty'
        ).to.equal('');
      })
      .click(); // open dropdown

    // 2️⃣ Pick a random option between 1 and 7
    cy.get('.ant-select-dropdown')
      .last()
      .find('.ant-select-item-option')
      .its('length')
      .then((total) => {
        const idx = Math.min(7, Cypress._.random(0, total - 1));
        cy.get('.ant-select-dropdown')
          .last()
          .find('.ant-select-item-option')
          .eq(idx)
          .click();
      });

    /* ── Validate recipient‑received amount ───────────────────── */
    cy.get(':nth-child(3) > :nth-child(2) > .ant-typography')
      .invoke('text')
      .then((text) => {
        cy.wrap(text).as('storedText');
        cy.log(text);
      });

    // ─────────────── Confirmation Screens ───────────────
    cy.get('.ant-col > .ant-btn > span').should('be.visible').click();

    cy.get('.ant-modal-body > :nth-child(1) > .ant-col > .ant-typography')
      .should('be.visible')
      .and('contain.text', 'Payment Confirmation');

    cy.get('@storedText').then((storedText) => {
      cy.get(':nth-child(4) > .ant-col-8 > .ant-typography')
        .should('be.visible')
        .and('contain.text', storedText);
    });

    // Pay recipient
    cy.get(
      '.ant-row-center.m-t-20 > .ant-col > .ant-space > :nth-child(2) > .ant-btn'
    )
      .should('be.visible')
      .click();

    cy.get('.ant-modal-body > :nth-child(1) > .ant-col')
      .should('be.visible')
      .and('contain.text', ' Payment Booked - ');

    cy.get('@storedText').then((storedText) => {
      cy.get(':nth-child(5) > .ant-col-8 > .ant-typography')
        .should('be.visible')
        .and('contain.text', storedText);
    })
    })
    it('TC-AC-083 - Verify that(business) if Currency= RON and Country = Romania & client = UK and check priority settlement is enabled and make a payment with GBP using Push Funds',function () {
    // ─────────────── Setup & Recipient Creation ───────────────
        signin.Login(userName, password)
        newRecipient.goToPaymentsDashborad()
        newRecipient.gotoRecipientList()
        let email = batchPayments.generateRandomString(5)+ '@yopmail.com'
        newRecipient.addRecipient('ROMANIA{enter}' ,'RON{enter}',email)
        newRecipient.addBankDetails('RO66BACX0000001234567890','BACXROBUXXX')
        newRecipient.addBusinessRecipientCorpay('ROMANIA{enter}','ROMANIA RON')
        newRecipient.saveRecipient()
        newRecipient.checkSettelment('be.disabled','be.enabled')
    // ─────────────── Payment Flow ───────────────
    newPayment.proceedflow('{downarrow}{enter}', 'GBP');
    const amount = '10';
    newPayment.addrecipientDetail(amount, email);
    newPayment.selectFundingMethod('Push Funds');

    /* ── Validate payment‑reason field ───────────────────────── */
    // 1️⃣ Ensure the field starts empty
    cy.get('.ant-select-selector')
      .eq(2)
      .should(($el) => {
        expect(
          $el.text().trim(),
          'reason field should start empty'
        ).to.equal('');
      })
      .click(); // open dropdown

    // 2️⃣ Pick a random option between 1 and 7
    cy.get('.ant-select-dropdown')
      .last()
      .find('.ant-select-item-option')
      .its('length')
      .then((total) => {
        const idx = Math.min(7, Cypress._.random(0, total - 1));
        cy.get('.ant-select-dropdown')
          .last()
          .find('.ant-select-item-option')
          .eq(idx)
          .click();
      });

    /* ── Validate recipient‑received amount ───────────────────── */
    cy.get(':nth-child(3) > :nth-child(2) > .ant-typography')
      .invoke('text')
      .then((text) => {
        cy.wrap(text).as('storedText');
        cy.log(text);
      });

    // ─────────────── Confirmation Screens ───────────────
    cy.get('.ant-col > .ant-btn > span').should('be.visible').click();

    cy.get('.ant-modal-body > :nth-child(1) > .ant-col > .ant-typography')
      .should('be.visible')
      .and('contain.text', 'Payment Confirmation');

    cy.get('@storedText').then((storedText) => {
      cy.get(':nth-child(4) > .ant-col-8 > .ant-typography')
        .should('be.visible')
        .and('contain.text', storedText);
    });

    // Pay recipient
    cy.get(
      '.ant-row-center.m-t-20 > .ant-col > .ant-space > :nth-child(2) > .ant-btn'
    )
      .should('be.visible')
      .click();

    cy.get('.ant-modal-body > :nth-child(1) > .ant-col')
      .should('be.visible')
      .and('contain.text', ' Payment Booked - ');

    cy.get('@storedText').then((storedText) => {
      cy.get(':nth-child(5) > .ant-col-8 > .ant-typography')
        .should('be.visible')
        .and('contain.text', storedText);
    })
    })
    it('TC-AC-084 - Verify that(business) if Currency= ILS and Country = UNITED KINGDOM & client = UK and check priority settlement is enabled and make a payment with GBP using Push Funds',function () {
    // ─────────────── Setup & Recipient Creation ───────────────
        signin.Login(userName, password)
        newRecipient.goToPaymentsDashborad()
        newRecipient.gotoRecipientList()
        let email = batchPayments.generateRandomString(5)+ '@yopmail.com'
        newRecipient.addRecipient('UNITED KINGDOM{enter}' ,'ILS{enter}',email)
        newRecipient.addBankDetails('GB73BARC20039538243547','AFFLGB22')
        newRecipient.addBusinessRecipientCorpay('UNITED KINGDOM{enter}','UK ILS')
        newRecipient.saveRecipient()
        newRecipient.checkSettelment('be.disabled','be.enabled')
    // ─────────────── Payment Flow ───────────────
    newPayment.proceedflow('{downarrow}{enter}', 'GBP');
    const amount = '10';
    newPayment.addrecipientDetail(amount, email);
    newPayment.selectFundingMethod('Push Funds');

    /* ── Validate payment‑reason field ───────────────────────── */
    // 1️⃣ Ensure the field starts empty
    cy.get('.ant-select-selector')
      .eq(2)
      .should(($el) => {
        expect(
          $el.text().trim(),
          'reason field should start empty'
        ).to.equal('');
      })
      .click(); // open dropdown

    // 2️⃣ Pick a random option between 1 and 7
    cy.get('.ant-select-dropdown')
      .last()
      .find('.ant-select-item-option')
      .its('length')
      .then((total) => {
        const idx = Math.min(7, Cypress._.random(0, total - 1));
        cy.get('.ant-select-dropdown')
          .last()
          .find('.ant-select-item-option')
          .eq(idx)
          .click();
      });

    /* ── Validate recipient‑received amount ───────────────────── */
    cy.get(':nth-child(3) > :nth-child(2) > .ant-typography')
      .invoke('text')
      .then((text) => {
        cy.wrap(text).as('storedText');
        cy.log(text);
      });

    // ─────────────── Confirmation Screens ───────────────
    cy.get('.ant-col > .ant-btn > span').should('be.visible').click();

    cy.get('.ant-modal-body > :nth-child(1) > .ant-col > .ant-typography')
      .should('be.visible')
      .and('contain.text', 'Payment Confirmation');

    cy.get('@storedText').then((storedText) => {
      cy.get(':nth-child(4) > .ant-col-8 > .ant-typography')
        .should('be.visible')
        .and('contain.text', storedText);
    });

    // Pay recipient
    cy.get(
      '.ant-row-center.m-t-20 > .ant-col > .ant-space > :nth-child(2) > .ant-btn'
    )
      .should('be.visible')
      .click();

    cy.get('.ant-modal-body > :nth-child(1) > .ant-col')
      .should('be.visible')
      .and('contain.text', ' Payment Booked - ');

    cy.get('@storedText').then((storedText) => {
      cy.get(':nth-child(5) > .ant-col-8 > .ant-typography')
        .should('be.visible')
        .and('contain.text', storedText);
    })
    })
    it('TC-AC-085 - Verify that(business) if Currency= ILS and Country = Israel & client = UK and check priority settlement is enabled and make a payment with GBP using Push Funds',function () {
    // ─────────────── Setup & Recipient Creation ───────────────
        signin.Login(userName, password)
        newRecipient.goToPaymentsDashborad()
        newRecipient.gotoRecipientList()
        let email = batchPayments.generateRandomString(5)+ '@yopmail.com'
        newRecipient.addRecipient('ISRAEL{enter}' ,'ILS{enter}',email)
        newRecipient.addBankDetails('IL170108000000012612345','ASRIILIC')
        newRecipient.addBusinessRecipientCorpay('ISRAEL{enter}','ISRAEL ILS')
        newRecipient.saveRecipient()
        newRecipient.checkSettelment('be.disabled','be.enabled')
    // ─────────────── Payment Flow ───────────────
    newPayment.proceedflow('{downarrow}{enter}', 'GBP');
    const amount = '10';
    newPayment.addrecipientDetail(amount, email);
    newPayment.selectFundingMethod('Push Funds');

    /* ── Validate payment‑reason field ───────────────────────── */
    // 1️⃣ Ensure the field starts empty
    cy.get('.ant-select-selector')
      .eq(2)
      .should(($el) => {
        expect(
          $el.text().trim(),
          'reason field should start empty'
        ).to.equal('');
      })
      .click(); // open dropdown

    // 2️⃣ Pick a random option between 1 and 7
    cy.get('.ant-select-dropdown')
      .last()
      .find('.ant-select-item-option')
      .its('length')
      .then((total) => {
        const idx = Math.min(7, Cypress._.random(0, total - 1));
        cy.get('.ant-select-dropdown')
          .last()
          .find('.ant-select-item-option')
          .eq(idx)
          .click();
      });

    /* ── Validate recipient‑received amount ───────────────────── */
    cy.get(':nth-child(3) > :nth-child(2) > .ant-typography')
      .invoke('text')
      .then((text) => {
        cy.wrap(text).as('storedText');
        cy.log(text);
      });

    // ─────────────── Confirmation Screens ───────────────
    cy.get('.ant-col > .ant-btn > span').should('be.visible').click();

    cy.get('.ant-modal-body > :nth-child(1) > .ant-col > .ant-typography')
      .should('be.visible')
      .and('contain.text', 'Payment Confirmation');

    cy.get('@storedText').then((storedText) => {
      cy.get(':nth-child(4) > .ant-col-8 > .ant-typography')
        .should('be.visible')
        .and('contain.text', storedText);
    });

    // Pay recipient
    cy.get(
      '.ant-row-center.m-t-20 > .ant-col > .ant-space > :nth-child(2) > .ant-btn'
    )
      .should('be.visible')
      .click();

    cy.get('.ant-modal-body > :nth-child(1) > .ant-col')
      .should('be.visible')
      .and('contain.text', ' Payment Booked - ');

    cy.get('@storedText').then((storedText) => {
      cy.get(':nth-child(5) > .ant-col-8 > .ant-typography')
        .should('be.visible')
        .and('contain.text', storedText);
    })
    })
    it('TC-AC-086 - Verify that(business) if Currency= HUF and Country = UNITED KINGDOM & client = UK and check priority settlement is enabled and make a payment with GBP using Push Funds',function () {
    // ─────────────── Setup & Recipient Creation ───────────────
        signin.Login(userName, password)
        newRecipient.goToPaymentsDashborad()
        newRecipient.gotoRecipientList()
        let email = batchPayments.generateRandomString(5)+ '@yopmail.com'
        newRecipient.addRecipient('UNITED KINGDOM{enter}' ,'HUF{enter}',email)
        newRecipient.addBankDetails('GB73BARC20039538243547','AFFLGB22')
        newRecipient.addBusinessRecipientCorpay('UNITED KINGDOM{enter}','UK HUF')
        newRecipient.saveRecipient()
        newRecipient.checkSettelment('be.disabled','be.enabled')
    // ─────────────── Payment Flow ───────────────
    newPayment.proceedflow('{downarrow}{enter}', 'GBP');
    const amount = '10';
    newPayment.addrecipientDetail(amount, email);
    newPayment.selectFundingMethod('Push Funds');

    /* ── Validate payment‑reason field ───────────────────────── */
    // 1️⃣ Ensure the field starts empty
    cy.get('.ant-select-selector')
      .eq(2)
      .should(($el) => {
        expect(
          $el.text().trim(),
          'reason field should start empty'
        ).to.equal('');
      })
      .click(); // open dropdown

    // 2️⃣ Pick a random option between 1 and 7
    cy.get('.ant-select-dropdown')
      .last()
      .find('.ant-select-item-option')
      .its('length')
      .then((total) => {
        const idx = Math.min(7, Cypress._.random(0, total - 1));
        cy.get('.ant-select-dropdown')
          .last()
          .find('.ant-select-item-option')
          .eq(idx)
          .click();
      });

    /* ── Validate recipient‑received amount ───────────────────── */
    cy.get(':nth-child(3) > :nth-child(2) > .ant-typography')
      .invoke('text')
      .then((text) => {
        cy.wrap(text).as('storedText');
        cy.log(text);
      });

    // ─────────────── Confirmation Screens ───────────────
    cy.get('.ant-col > .ant-btn > span').should('be.visible').click();

    cy.get('.ant-modal-body > :nth-child(1) > .ant-col > .ant-typography')
      .should('be.visible')
      .and('contain.text', 'Payment Confirmation');

    cy.get('@storedText').then((storedText) => {
      cy.get(':nth-child(4) > .ant-col-8 > .ant-typography')
        .should('be.visible')
        .and('contain.text', storedText);
    });

    // Pay recipient
    cy.get(
      '.ant-row-center.m-t-20 > .ant-col > .ant-space > :nth-child(2) > .ant-btn'
    )
      .should('be.visible')
      .click();

    cy.get('.ant-modal-body > :nth-child(1) > .ant-col')
      .should('be.visible')
      .and('contain.text', ' Payment Booked - ');

    cy.get('@storedText').then((storedText) => {
      cy.get(':nth-child(5) > .ant-col-8 > .ant-typography')
        .should('be.visible')
        .and('contain.text', storedText);
    })
    })
    it('TC-AC-087 - Verify that(business) if Currency= HUF and Country = Hungary & client = UK and check priority settlement is enabled and make a payment with GBP using Push Funds',function () {
    // ─────────────── Setup & Recipient Creation ───────────────
        signin.Login(userName, password)
        newRecipient.goToPaymentsDashborad()
        newRecipient.gotoRecipientList()
        let email = batchPayments.generateRandomString(5)+ '@yopmail.com'
        newRecipient.addRecipient('HUNGARY{enter}' ,'HUF{enter}',email)
        newRecipient.addBankDetails('HU42117730161111101800000000','AKKHHUHB')
        newRecipient.addBusinessRecipientCorpay('HUNGARY{enter}','Hungary HUF')
        newRecipient.saveRecipient()
        newRecipient.checkSettelment('be.disabled','be.enabled')
    // ─────────────── Payment Flow ───────────────
    newPayment.proceedflow('{downarrow}{enter}', 'GBP');
    const amount = '10';
    newPayment.addrecipientDetail(amount, email);
    newPayment.selectFundingMethod('Push Funds');

    /* ── Validate payment‑reason field ───────────────────────── */
    // 1️⃣ Ensure the field starts empty
    cy.get('.ant-select-selector')
      .eq(2)
      .should(($el) => {
        expect(
          $el.text().trim(),
          'reason field should start empty'
        ).to.equal('');
      })
      .click(); // open dropdown

    // 2️⃣ Pick a random option between 1 and 7
    cy.get('.ant-select-dropdown')
      .last()
      .find('.ant-select-item-option')
      .its('length')
      .then((total) => {
        const idx = Math.min(7, Cypress._.random(0, total - 1));
        cy.get('.ant-select-dropdown')
          .last()
          .find('.ant-select-item-option')
          .eq(idx)
          .click();
      });

    /* ── Validate recipient‑received amount ───────────────────── */
    cy.get(':nth-child(3) > :nth-child(2) > .ant-typography')
      .invoke('text')
      .then((text) => {
        cy.wrap(text).as('storedText');
        cy.log(text);
      });

    // ─────────────── Confirmation Screens ───────────────
    cy.get('.ant-col > .ant-btn > span').should('be.visible').click();

    cy.get('.ant-modal-body > :nth-child(1) > .ant-col > .ant-typography')
      .should('be.visible')
      .and('contain.text', 'Payment Confirmation');

    cy.get('@storedText').then((storedText) => {
      cy.get(':nth-child(4) > .ant-col-8 > .ant-typography')
        .should('be.visible')
        .and('contain.text', storedText);
    });

    // Pay recipient
    cy.get(
      '.ant-row-center.m-t-20 > .ant-col > .ant-space > :nth-child(2) > .ant-btn'
    )
      .should('be.visible')
      .click();

    cy.get('.ant-modal-body > :nth-child(1) > .ant-col')
      .should('be.visible')
      .and('contain.text', ' Payment Booked - ');

    cy.get('@storedText').then((storedText) => {
      cy.get(':nth-child(5) > .ant-col-8 > .ant-typography')
        .should('be.visible')
        .and('contain.text', storedText);
    })
    })
    it('TC-AC-088 - Verify that(business) if Currency= KES and Country = UNITED KINGDOM & client = UK and check priority settlement is enabled and make a payment with GBP using Push Funds',function () {
    // ─────────────── Setup & Recipient Creation ───────────────
       signin.Login(userName, password)
        newRecipient.goToPaymentsDashborad()
        newRecipient.gotoRecipientList()
        let email = batchPayments.generateRandomString(5)+ '@yopmail.com'
        newRecipient.addRecipient('UNITED KINGDOM{enter}' ,'KES{enter}',email)
        newRecipient.addBankDetails('GB73BARC20039538243547','AFFLGB22')
        newRecipient.addBusinessRecipientCorpay('UNITED KINGDOM{enter}','UK KES')
        newRecipient.saveRecipient()
        newRecipient.checkSettelment('be.disabled','be.enabled')
    // ─────────────── Payment Flow ───────────────
    newPayment.proceedflow('{downarrow}{enter}', 'GBP');
    const amount = '10';
    newPayment.addrecipientDetail(amount, email);
    newPayment.selectFundingMethod('Push Funds');

    /* ── Validate payment‑reason field ───────────────────────── */
    // 1️⃣ Ensure the field starts empty
    cy.get('.ant-select-selector')
      .eq(2)
      .should(($el) => {
        expect(
          $el.text().trim(),
          'reason field should start empty'
        ).to.equal('');
      })
      .click(); // open dropdown

    // 2️⃣ Pick a random option between 1 and 7
    cy.get('.ant-select-dropdown')
      .last()
      .find('.ant-select-item-option')
      .its('length')
      .then((total) => {
        const idx = Math.min(7, Cypress._.random(0, total - 1));
        cy.get('.ant-select-dropdown')
          .last()
          .find('.ant-select-item-option')
          .eq(idx)
          .click();
      });

    /* ── Validate recipient‑received amount ───────────────────── */
    cy.get(':nth-child(3) > :nth-child(2) > .ant-typography')
      .invoke('text')
      .then((text) => {
        cy.wrap(text).as('storedText');
        cy.log(text);
      });

    // ─────────────── Confirmation Screens ───────────────
    cy.get('.ant-col > .ant-btn > span').should('be.visible').click();

    cy.get('.ant-modal-body > :nth-child(1) > .ant-col > .ant-typography')
      .should('be.visible')
      .and('contain.text', 'Payment Confirmation');

    cy.get('@storedText').then((storedText) => {
      cy.get(':nth-child(4) > .ant-col-8 > .ant-typography')
        .should('be.visible')
        .and('contain.text', storedText);
    });

    // Pay recipient
    cy.get(
      '.ant-row-center.m-t-20 > .ant-col > .ant-space > :nth-child(2) > .ant-btn'
    )
      .should('be.visible')
      .click();

    cy.get('.ant-modal-body > :nth-child(1) > .ant-col')
      .should('be.visible')
      .and('contain.text', ' Payment Booked - ');

    cy.get('@storedText').then((storedText) => {
      cy.get(':nth-child(5) > .ant-col-8 > .ant-typography')
        .should('be.visible')
        .and('contain.text', storedText);
    })
    })
    it('TC-AC-089 - Verify that(business) if Currency= KES and Country = Kenya & client = UK and check priority settlement is enabled and make a payment with GBP using Push Funds',function () {
    // ─────────────── Setup & Recipient Creation ───────────────
        signin.Login(userName, password)
        newRecipient.goToPaymentsDashborad()
        newRecipient.gotoRecipientList()
        let email = batchPayments.generateRandomString(5)+ '@yopmail.com'
        newRecipient.addRecipient('KENYA{enter}' ,'KES{enter}',email)
        newRecipient.addBankDetailsWithAccNo('AFRIKENX','049712')
        cy.get('#bankBranch').type('city branch')
        newRecipient.addBusinessRecipientCorpay('KENYA{enter}','Kenya KES')
        newRecipient.saveRecipient()
        newRecipient.checkSettelment('be.disabled','be.enabled')
    // ─────────────── Payment Flow ───────────────
    newPayment.proceedflow('{downarrow}{enter}', 'GBP');
    const amount = '10';
    newPayment.addrecipientDetail(amount, email);
    newPayment.selectFundingMethod('Push Funds');

    /* ── Validate payment‑reason field ───────────────────────── */
    // 1️⃣ Ensure the field starts empty
    cy.get('.ant-select-selector')
      .eq(2)
      .should(($el) => {
        expect(
          $el.text().trim(),
          'reason field should start empty'
        ).to.equal('');
      })
      .click(); // open dropdown

    // 2️⃣ Pick a random option between 1 and 7
    cy.get('.ant-select-dropdown')
      .last()
      .find('.ant-select-item-option')
      .its('length')
      .then((total) => {
        const idx = Math.min(7, Cypress._.random(0, total - 1));
        cy.get('.ant-select-dropdown')
          .last()
          .find('.ant-select-item-option')
          .eq(idx)
          .click();
      });

    /* ── Validate recipient‑received amount ───────────────────── */
    cy.get(':nth-child(3) > :nth-child(2) > .ant-typography')
      .invoke('text')
      .then((text) => {
        cy.wrap(text).as('storedText');
        cy.log(text);
      });

    // ─────────────── Confirmation Screens ───────────────
    cy.get('.ant-col > .ant-btn > span').should('be.visible').click();

    cy.get('.ant-modal-body > :nth-child(1) > .ant-col > .ant-typography')
      .should('be.visible')
      .and('contain.text', 'Payment Confirmation');

    cy.get('@storedText').then((storedText) => {
      cy.get(':nth-child(4) > .ant-col-8 > .ant-typography')
        .should('be.visible')
        .and('contain.text', storedText);
    });

    // Pay recipient
    cy.get(
      '.ant-row-center.m-t-20 > .ant-col > .ant-space > :nth-child(2) > .ant-btn'
    )
      .should('be.visible')
      .click();

    cy.get('.ant-modal-body > :nth-child(1) > .ant-col')
      .should('be.visible')
      .and('contain.text', ' Payment Booked - ');

    cy.get('@storedText').then((storedText) => {
      cy.get(':nth-child(5) > .ant-col-8 > .ant-typography')
        .should('be.visible')
        .and('contain.text', storedText);
    })
    })
    it('TC-AC-090 - Verify that(business) if Currency= UGX and Country = UNITED KINGDOM & client = UK and check priority settlement is enabled and make a payment with GBP using Push Funds',function () {
    // ─────────────── Setup & Recipient Creation ───────────────
       signin.Login(userName, password)
        newRecipient.goToPaymentsDashborad()
        newRecipient.gotoRecipientList()
        let email = batchPayments.generateRandomString(5)+ '@yopmail.com'
        newRecipient.addRecipient('UNITED KINGDOM{enter}' ,'UGX{enter}',email)
        newRecipient.addBankDetails('GB73BARC20039538243547','AFFLGB22')
        newRecipient.addBusinessRecipientCorpay('UNITED KINGDOM{enter}','UK UGX')
        newRecipient.saveRecipient()
        newRecipient.checkSettelment('be.disabled','be.enabled')
    // ─────────────── Payment Flow ───────────────
    newPayment.proceedflow('{downarrow}{enter}', 'GBP');
    const amount = '10';
    newPayment.addrecipientDetail(amount, email);
    newPayment.selectFundingMethod('Push Funds');

    /* ── Validate payment‑reason field ───────────────────────── */
    // 1️⃣ Ensure the field starts empty
    cy.get('.ant-select-selector')
      .eq(2)
      .should(($el) => {
        expect(
          $el.text().trim(),
          'reason field should start empty'
        ).to.equal('');
      })
      .click(); // open dropdown

    // 2️⃣ Pick a random option between 1 and 7
    cy.get('.ant-select-dropdown')
      .last()
      .find('.ant-select-item-option')
      .its('length')
      .then((total) => {
        const idx = Math.min(7, Cypress._.random(0, total - 1));
        cy.get('.ant-select-dropdown')
          .last()
          .find('.ant-select-item-option')
          .eq(idx)
          .click();
      });

    /* ── Validate recipient‑received amount ───────────────────── */
    cy.get(':nth-child(3) > :nth-child(2) > .ant-typography')
      .invoke('text')
      .then((text) => {
        cy.wrap(text).as('storedText');
        cy.log(text);
      });

    // ─────────────── Confirmation Screens ───────────────
    cy.get('.ant-col > .ant-btn > span').should('be.visible').click();

    cy.get('.ant-modal-body > :nth-child(1) > .ant-col > .ant-typography')
      .should('be.visible')
      .and('contain.text', 'Payment Confirmation');

    cy.get('@storedText').then((storedText) => {
      cy.get(':nth-child(4) > .ant-col-8 > .ant-typography')
        .should('be.visible')
        .and('contain.text', storedText);
    });

    // Pay recipient
    cy.get(
      '.ant-row-center.m-t-20 > .ant-col > .ant-space > :nth-child(2) > .ant-btn'
    )
      .should('be.visible')
      .click();

    cy.get('.ant-modal-body > :nth-child(1) > .ant-col')
      .should('be.visible')
      .and('contain.text', ' Payment Booked - ');

    cy.get('@storedText').then((storedText) => {
      cy.get(':nth-child(5) > .ant-col-8 > .ant-typography')
        .should('be.visible')
        .and('contain.text', storedText);
    })
    })
    it('TC-AC-091 - Verify that(business) if Currency= UGX and Country = Uganda & client = UK and check priority settlement is enabled and make a payment with GBP using Push Funds',function () {
    // ─────────────── Setup & Recipient Creation ───────────────
       signin.Login(userName, password)
        newRecipient.goToPaymentsDashborad()
        newRecipient.gotoRecipientList()
        let email = batchPayments.generateRandomString(5)+ '@yopmail.com'
        newRecipient.addRecipient('UGANDA{enter}' ,'UGX{enter}',email)
        newRecipient.addBankDetailsWithAccNo('CCEIUGKA','049712')
        newRecipient.addBusinessRecipientCorpay('UGANDA{enter}','UGANDA UGX')
        newRecipient.saveRecipient()
        newRecipient.checkSettelment('be.disabled','be.enabled')
    // ─────────────── Payment Flow ───────────────
    newPayment.proceedflow('{downarrow}{enter}', 'GBP');
    const amount = '10';
    newPayment.addrecipientDetail(amount, email);
    newPayment.selectFundingMethod('Push Funds');

    /* ── Validate payment‑reason field ───────────────────────── */
    // 1️⃣ Ensure the field starts empty
    cy.get('.ant-select-selector')
      .eq(2)
      .should(($el) => {
        expect(
          $el.text().trim(),
          'reason field should start empty'
        ).to.equal('');
      })
      .click(); // open dropdown

    // 2️⃣ Pick a random option between 1 and 7
    cy.get('.ant-select-dropdown')
      .last()
      .find('.ant-select-item-option')
      .its('length')
      .then((total) => {
        const idx = Math.min(7, Cypress._.random(0, total - 1));
        cy.get('.ant-select-dropdown')
          .last()
          .find('.ant-select-item-option')
          .eq(idx)
          .click();
      });

    /* ── Validate recipient‑received amount ───────────────────── */
    cy.get(':nth-child(3) > :nth-child(2) > .ant-typography')
      .invoke('text')
      .then((text) => {
        cy.wrap(text).as('storedText');
        cy.log(text);
      });

    // ─────────────── Confirmation Screens ───────────────
    cy.get('.ant-col > .ant-btn > span').should('be.visible').click();

    cy.get('.ant-modal-body > :nth-child(1) > .ant-col > .ant-typography')
      .should('be.visible')
      .and('contain.text', 'Payment Confirmation');

    cy.get('@storedText').then((storedText) => {
      cy.get(':nth-child(4) > .ant-col-8 > .ant-typography')
        .should('be.visible')
        .and('contain.text', storedText);
    });

    // Pay recipient
    cy.get(
      '.ant-row-center.m-t-20 > .ant-col > .ant-space > :nth-child(2) > .ant-btn'
    )
      .should('be.visible')
      .click();

    cy.get('.ant-modal-body > :nth-child(1) > .ant-col')
      .should('be.visible')
      .and('contain.text', ' Payment Booked - ');

    cy.get('@storedText').then((storedText) => {
      cy.get(':nth-child(5) > .ant-col-8 > .ant-typography')
        .should('be.visible')
        .and('contain.text', storedText);
    })
    })
    it('TC-AC-092 - Verify that(business) if Currency= BHD and Country = UNITED KINGDOM & client = UK and check priority settlement is enabled and make a payment with GBP using Push Funds',function () {
    // ─────────────── Setup & Recipient Creation ───────────────
       signin.Login(userName, password)
        newRecipient.goToPaymentsDashborad()
        newRecipient.gotoRecipientList()
        let email = batchPayments.generateRandomString(5)+ '@yopmail.com'
        newRecipient.addRecipient('UNITED KINGDOM{enter}' ,'BHD{enter}',email)
        newRecipient.addBankDetails('GB73BARC20039538243547','AFFLGB22')
        newRecipient.addBusinessRecipientCorpay('UNITED KINGDOM{enter}','UK BHD')
        newRecipient.saveRecipient()
        newRecipient.checkSettelment('be.disabled','be.enabled')
    // ─────────────── Payment Flow ───────────────
    newPayment.proceedflow('{downarrow}{enter}', 'GBP');
    const amount = '10';
    newPayment.addrecipientDetail(amount, email);
    newPayment.selectFundingMethod('Push Funds');

    /* ── Validate payment‑reason field ───────────────────────── */
    // 1️⃣ Ensure the field starts empty
    cy.get('.ant-select-selector')
      .eq(2)
      .should(($el) => {
        expect(
          $el.text().trim(),
          'reason field should start empty'
        ).to.equal('');
      })
      .click(); // open dropdown

    // 2️⃣ Pick a random option between 1 and 7
    cy.get('.ant-select-dropdown')
      .last()
      .find('.ant-select-item-option')
      .its('length')
      .then((total) => {
        const idx = Math.min(7, Cypress._.random(0, total - 1));
        cy.get('.ant-select-dropdown')
          .last()
          .find('.ant-select-item-option')
          .eq(idx)
          .click();
      });

    /* ── Validate recipient‑received amount ───────────────────── */
    cy.get(':nth-child(3) > :nth-child(2) > .ant-typography')
      .invoke('text')
      .then((text) => {
        cy.wrap(text).as('storedText');
        cy.log(text);
      });

    // ─────────────── Confirmation Screens ───────────────
    cy.get('.ant-col > .ant-btn > span').should('be.visible').click();

    cy.get('.ant-modal-body > :nth-child(1) > .ant-col > .ant-typography')
      .should('be.visible')
      .and('contain.text', 'Payment Confirmation');

    cy.get('@storedText').then((storedText) => {
      cy.get(':nth-child(4) > .ant-col-8 > .ant-typography')
        .should('be.visible')
        .and('contain.text', storedText);
    });

    // Pay recipient
    cy.get(
      '.ant-row-center.m-t-20 > .ant-col > .ant-space > :nth-child(2) > .ant-btn'
    )
      .should('be.visible')
      .click();

    cy.get('.ant-modal-body > :nth-child(1) > .ant-col')
      .should('be.visible')
      .and('contain.text', ' Payment Booked - ');

    cy.get('@storedText').then((storedText) => {
      cy.get(':nth-child(5) > .ant-col-8 > .ant-typography')
        .should('be.visible')
        .and('contain.text', storedText);
    })
    })
    it('TC-AC-093 - Verify that(business) if Currency= BHD and Country = Bahrain & client = UK and check priority settlement is enabled and make a payment with GBP using Push Funds',function () {
    // ─────────────── Setup & Recipient Creation ───────────────
       signin.Login(userName, password)
        newRecipient.goToPaymentsDashborad()
        newRecipient.gotoRecipientList()
        let email = batchPayments.generateRandomString(5)+ '@yopmail.com'
        newRecipient.addRecipient('BAHRAIN{enter}' ,'BHD{enter}',email)
        newRecipient.addBankDetails('BH67BMAG00001299123456','ABBGBHBM')
        newRecipient.addBusinessRecipientCorpay('BAHRAIN{enter}','BAHRAIN BHD')
        newRecipient.saveRecipient()
        newRecipient.checkSettelment('be.disabled','be.enabled')
    // ─────────────── Payment Flow ───────────────
    newPayment.proceedflow('{downarrow}{enter}', 'GBP');
    const amount = '10';
    newPayment.addrecipientDetail(amount, email);
    newPayment.selectFundingMethod('Push Funds');

    /* ── Validate payment‑reason field ───────────────────────── */
    // 1️⃣ Ensure the field starts empty
    cy.get('.ant-select-selector')
      .eq(2)
      .should(($el) => {
        expect(
          $el.text().trim(),
          'reason field should start empty'
        ).to.equal('');
      })
      .click(); // open dropdown

    // 2️⃣ Pick a random option between 1 and 7
    cy.get('.ant-select-dropdown')
      .last()
      .find('.ant-select-item-option')
      .its('length')
      .then((total) => {
        const idx = Math.min(7, Cypress._.random(0, total - 1));
        cy.get('.ant-select-dropdown')
          .last()
          .find('.ant-select-item-option')
          .eq(idx)
          .click();
      });

    /* ── Validate recipient‑received amount ───────────────────── */
    cy.get(':nth-child(3) > :nth-child(2) > .ant-typography')
      .invoke('text')
      .then((text) => {
        cy.wrap(text).as('storedText');
        cy.log(text);
      });

    // ─────────────── Confirmation Screens ───────────────
    cy.get('.ant-col > .ant-btn > span').should('be.visible').click();

    cy.get('.ant-modal-body > :nth-child(1) > .ant-col > .ant-typography')
      .should('be.visible')
      .and('contain.text', 'Payment Confirmation');

    cy.get('@storedText').then((storedText) => {
      cy.get(':nth-child(4) > .ant-col-8 > .ant-typography')
        .should('be.visible')
        .and('contain.text', storedText);
    });

    // Pay recipient
    cy.get(
      '.ant-row-center.m-t-20 > .ant-col > .ant-space > :nth-child(2) > .ant-btn'
    )
      .should('be.visible')
      .click();

    cy.get('.ant-modal-body > :nth-child(1) > .ant-col')
      .should('be.visible')
      .and('contain.text', ' Payment Booked - ');

    cy.get('@storedText').then((storedText) => {
      cy.get(':nth-child(5) > .ant-col-8 > .ant-typography')
        .should('be.visible')
        .and('contain.text', storedText);
    })
    })
    it('TC-AC-094 - Verify that(business) if Currency= AED and Country = UNITED KINGDOM & client = UK and check priority settlement is enabled and make a payment with GBP using Push Funds',function () {
    // ─────────────── Setup & Recipient Creation ───────────────
       signin.Login(userName, password)
        newRecipient.goToPaymentsDashborad()
        newRecipient.gotoRecipientList()
        let email = batchPayments.generateRandomString(5)+ '@yopmail.com'
        newRecipient.addRecipient('UNITED KINGDOM{enter}' ,'AED{enter}',email)
        newRecipient.addBankDetails('GB73BARC20039538243547','AFFLGB22')
        newRecipient.addBusinessRecipientCorpay('UNITED KINGDOM{enter}','UK AED')
        newRecipient.saveRecipient()
        newRecipient.checkSettelment('be.disabled','be.enabled')
    // ─────────────── Payment Flow ───────────────
    newPayment.proceedflow('{downarrow}{enter}', 'GBP');
    const amount = '10';
    newPayment.addrecipientDetail(amount, email);
    newPayment.selectFundingMethod('Push Funds');

    /* ── Validate payment‑reason field ───────────────────────── */
    // 1️⃣ Ensure the field starts empty
    cy.get('.ant-select-selector')
      .eq(2)
      .should(($el) => {
        expect(
          $el.text().trim(),
          'reason field should start empty'
        ).to.equal('');
      })
      .click(); // open dropdown

    // 2️⃣ Pick a random option between 1 and 7
    cy.get('.ant-select-dropdown')
      .last()
      .find('.ant-select-item-option')
      .its('length')
      .then((total) => {
        const idx = Math.min(7, Cypress._.random(0, total - 1));
        cy.get('.ant-select-dropdown')
          .last()
          .find('.ant-select-item-option')
          .eq(idx)
          .click();
      });

    /* ── Validate recipient‑received amount ───────────────────── */
    cy.get(':nth-child(3) > :nth-child(2) > .ant-typography')
      .invoke('text')
      .then((text) => {
        cy.wrap(text).as('storedText');
        cy.log(text);
      });

    // ─────────────── Confirmation Screens ───────────────
    cy.get('.ant-col > .ant-btn > span').should('be.visible').click();

    cy.get('.ant-modal-body > :nth-child(1) > .ant-col > .ant-typography')
      .should('be.visible')
      .and('contain.text', 'Payment Confirmation');

    cy.get('@storedText').then((storedText) => {
      cy.get(':nth-child(4) > .ant-col-8 > .ant-typography')
        .should('be.visible')
        .and('contain.text', storedText);
    });

    // Pay recipient
    cy.get(
      '.ant-row-center.m-t-20 > .ant-col > .ant-space > :nth-child(2) > .ant-btn'
    )
      .should('be.visible')
      .click();

    cy.get('.ant-modal-body > :nth-child(1) > .ant-col')
      .should('be.visible')
      .and('contain.text', ' Payment Booked - ');

    cy.get('@storedText').then((storedText) => {
      cy.get(':nth-child(5) > .ant-col-8 > .ant-typography')
        .should('be.visible')
        .and('contain.text', storedText);
    })
    })
    it('TC-AC-095 - Verify that(business) if Currency= AED and Country = United Arab Emirates & client = UK and check priority settlement is enabled and make a payment with GBP using Push Funds',function () {
    // ─────────────── Setup & Recipient Creation ───────────────
        signin.Login(userName, password)
        newRecipient.goToPaymentsDashborad()
        newRecipient.gotoRecipientList()
        let email = batchPayments.generateRandomString(5)+ '@yopmail.com'
        newRecipient.addRecipient('UNITED ARAB EMIRATES{enter}' ,'AED{enter}',email)
        newRecipient.addBankDetails('AE070331234567890123456','AARPAEAA')
        newRecipient.addBusinessRecipientCorpay('UNITED ARAB EMIRATES{enter}','United Arab Emirates AED')
        newRecipient.saveRecipient()
        newRecipient.checkSettelment('be.disabled','be.enabled')
    // ─────────────── Payment Flow ───────────────
    newPayment.proceedflow('{downarrow}{enter}', 'GBP');
    const amount = '10';
    newPayment.addrecipientDetail(amount, email);
    newPayment.selectFundingMethod('Push Funds');

    /* ── Validate payment‑reason field ───────────────────────── */
    // 1️⃣ Ensure the field starts empty
    cy.get('.ant-select-selector')
      .eq(2)
      .should(($el) => {
        expect(
          $el.text().trim(),
          'reason field should start empty'
        ).to.equal('');
      })
      .click(); // open dropdown

    // 2️⃣ Pick a random option between 1 and 7
    cy.get('.ant-select-dropdown')
      .last()
      .find('.ant-select-item-option')
      .its('length')
      .then((total) => {
        const idx = Math.min(7, Cypress._.random(0, total - 1));
        cy.get('.ant-select-dropdown')
          .last()
          .find('.ant-select-item-option')
          .eq(idx)
          .click();
      });

    /* ── Validate recipient‑received amount ───────────────────── */
    cy.get(':nth-child(3) > :nth-child(2) > .ant-typography')
      .invoke('text')
      .then((text) => {
        cy.wrap(text).as('storedText');
        cy.log(text);
      });

    // ─────────────── Confirmation Screens ───────────────
    cy.get('.ant-col > .ant-btn > span').should('be.visible').click();

    cy.get('.ant-modal-body > :nth-child(1) > .ant-col > .ant-typography')
      .should('be.visible')
      .and('contain.text', 'Payment Confirmation');

    cy.get('@storedText').then((storedText) => {
      cy.get(':nth-child(4) > .ant-col-8 > .ant-typography')
        .should('be.visible')
        .and('contain.text', storedText);
    });

    // Pay recipient
    cy.get(
      '.ant-row-center.m-t-20 > .ant-col > .ant-space > :nth-child(2) > .ant-btn'
    )
      .should('be.visible')
      .click();

    cy.get('.ant-modal-body > :nth-child(1) > .ant-col')
      .should('be.visible')
      .and('contain.text', ' Payment Booked - ');

    cy.get('@storedText').then((storedText) => {
      cy.get(':nth-child(5) > .ant-col-8 > .ant-typography')
        .should('be.visible')
        .and('contain.text', storedText);
    })
    })
    it('TC-AC-096 - Verify that(business) if Currency= INR and Country = India Current & client = UK and check priority settlement is enabled and make a payment with GBP using Push Funds',function () {
    // ─────────────── Setup & Recipient Creation ───────────────
       signin.Login(userName, password)
        newRecipient.goToPaymentsDashborad()
        newRecipient.gotoRecipientList()
        let email = batchPayments.generateRandomString(5)+ '@yopmail.com'
        newRecipient.addRecipient('INDIA{downarrow}{enter}' ,'INR{enter}',email)
        newRecipient.addIndiaBankDetail()
        newRecipient.indiaAccountType('current{enter}')
        newRecipient.addBusinessRecipientCorpay('INDIA{downarrow}{enter}','India INR Current')
        newRecipient.saveRecipient()
        newRecipient.checkSettelment('be.enabled','be.disabled')
    // ─────────────── Payment Flow ───────────────
    newPayment.proceedflow('{downarrow}{enter}', 'GBP');
    const amount = '10';
    newPayment.addrecipientDetail(amount, email);
    newPayment.selectFundingMethod('Push Funds');

    /* ── Validate payment‑reason field ───────────────────────── */
    // 1️⃣ Ensure the field starts empty
    cy.get('.ant-select-selector')
      .eq(2)
      .should(($el) => {
        expect(
          $el.text().trim(),
          'reason field should start empty'
        ).to.equal('');
      })
      .click(); // open dropdown

    // 2️⃣ Pick a random option between 1 and 7
    cy.get('.ant-select-dropdown')
      .last()
      .find('.ant-select-item-option')
      .its('length')
      .then((total) => {
        const idx = Math.min(7, Cypress._.random(0, total - 1));
        cy.get('.ant-select-dropdown')
          .last()
          .find('.ant-select-item-option')
          .eq(idx)
          .click();
      });

    /* ── Validate recipient‑received amount ───────────────────── */
    cy.get(':nth-child(3) > :nth-child(2) > .ant-typography')
      .invoke('text')
      .then((text) => {
        cy.wrap(text).as('storedText');
        cy.log(text);
      });

    // ─────────────── Confirmation Screens ───────────────
    cy.get('.ant-col > .ant-btn > span').should('be.visible').click();

    cy.get('.ant-modal-body > :nth-child(1) > .ant-col > .ant-typography')
      .should('be.visible')
      .and('contain.text', 'Payment Confirmation');

    cy.get('@storedText').then((storedText) => {
      cy.get(':nth-child(4) > .ant-col-8 > .ant-typography')
        .should('be.visible')
        .and('contain.text', storedText);
    });

    // Pay recipient
    cy.get(
      '.ant-row-center.m-t-20 > .ant-col > .ant-space > :nth-child(2) > .ant-btn'
    )
      .should('be.visible')
      .click();

    cy.get('.ant-modal-body > :nth-child(1) > .ant-col')
      .should('be.visible')
      .and('contain.text', ' Payment Booked - ');

    cy.get('@storedText').then((storedText) => {
      cy.get(':nth-child(5) > .ant-col-8 > .ant-typography')
        .should('be.visible')
        .and('contain.text', storedText);
    })
    })
    it('TC-AC-097 - Verify that(business) if Currency= INR and Country = India Saving & client = UK and check priority settlement is enabled and make a payment with GBP using Push Funds',function () {
    // ─────────────── Setup & Recipient Creation ───────────────
       signin.Login(userName, password)
        newRecipient.goToPaymentsDashborad()
        newRecipient.gotoRecipientList()
        let email = batchPayments.generateRandomString(5)+ '@yopmail.com'
        newRecipient.addRecipient('INDIA{downarrow}{enter}' ,'INR{enter}',email)
        newRecipient.addIndiaBankDetail()
        newRecipient.indiaAccountType('Saving{enter}')
        newRecipient.addBusinessRecipientCorpay('INDIA{downarrow}{enter}','India INR Saving')
        newRecipient.saveRecipient()
        newRecipient.checkSettelment('be.enabled','be.disabled')
    // ─────────────── Payment Flow ───────────────
    newPayment.proceedflow('{downarrow}{enter}', 'GBP');
    const amount = '10';
    newPayment.addrecipientDetail(amount, email);
    newPayment.selectFundingMethod('Push Funds');

    /* ── Validate payment‑reason field ───────────────────────── */
    // 1️⃣ Ensure the field starts empty
    cy.get('.ant-select-selector')
      .eq(2)
      .should(($el) => {
        expect(
          $el.text().trim(),
          'reason field should start empty'
        ).to.equal('');
      })
      .click(); // open dropdown

    // 2️⃣ Pick a random option between 1 and 7
    cy.get('.ant-select-dropdown')
      .last()
      .find('.ant-select-item-option')
      .its('length')
      .then((total) => {
        const idx = Math.min(7, Cypress._.random(0, total - 1));
        cy.get('.ant-select-dropdown')
          .last()
          .find('.ant-select-item-option')
          .eq(idx)
          .click();
      });

    /* ── Validate recipient‑received amount ───────────────────── */
    cy.get(':nth-child(3) > :nth-child(2) > .ant-typography')
      .invoke('text')
      .then((text) => {
        cy.wrap(text).as('storedText');
        cy.log(text);
      });

    // ─────────────── Confirmation Screens ───────────────
    cy.get('.ant-col > .ant-btn > span').should('be.visible').click();

    cy.get('.ant-modal-body > :nth-child(1) > .ant-col > .ant-typography')
      .should('be.visible')
      .and('contain.text', 'Payment Confirmation');

    cy.get('@storedText').then((storedText) => {
      cy.get(':nth-child(4) > .ant-col-8 > .ant-typography')
        .should('be.visible')
        .and('contain.text', storedText);
    });

    // Pay recipient
    cy.get(
      '.ant-row-center.m-t-20 > .ant-col > .ant-space > :nth-child(2) > .ant-btn'
    )
      .should('be.visible')
      .click();

    cy.get('.ant-modal-body > :nth-child(1) > .ant-col')
      .should('be.visible')
      .and('contain.text', ' Payment Booked - ');

    cy.get('@storedText').then((storedText) => {
      cy.get(':nth-child(5) > .ant-col-8 > .ant-typography')
        .should('be.visible')
        .and('contain.text', storedText);
    })
    })
    it('TC-AC-098 - Verify(business) that if Currency= NZD and Country = UNITED KINGDOM & client = UK and check priority settlement is enabled and make a payment with GBP using Push Funds',function () {
    // ─────────────── Setup & Recipient Creation ───────────────
       signin.Login(userName, password)
        newRecipient.goToPaymentsDashborad()
        newRecipient.gotoRecipientList()
        let email = batchPayments.generateRandomString(5)+ '@yopmail.com'
        newRecipient.addRecipient('UNITED KINGDOM{enter}' ,'NZD{enter}',email)
        newRecipient.addBankDetails('GB73BARC20039538243547','AFFLGB22')
        newRecipient.addBusinessRecipientCorpay('UNITED KINGDOM{enter}','UK NZD')
        newRecipient.saveRecipient()
        newRecipient.checkSettelment('be.disabled','be.enabled')
    // ─────────────── Payment Flow ───────────────
    newPayment.proceedflow('{downarrow}{enter}', 'GBP');
    const amount = '10';
    newPayment.addrecipientDetail(amount, email);
    newPayment.selectFundingMethod('Push Funds');

    /* ── Validate payment‑reason field ───────────────────────── */
    // 1️⃣ Ensure the field starts empty
    cy.get('.ant-select-selector')
      .eq(2)
      .should(($el) => {
        expect(
          $el.text().trim(),
          'reason field should start empty'
        ).to.equal('');
      })
      .click(); // open dropdown

    // 2️⃣ Pick a random option between 1 and 7
    cy.get('.ant-select-dropdown')
      .last()
      .find('.ant-select-item-option')
      .its('length')
      .then((total) => {
        const idx = Math.min(7, Cypress._.random(0, total - 1));
        cy.get('.ant-select-dropdown')
          .last()
          .find('.ant-select-item-option')
          .eq(idx)
          .click();
      });

    /* ── Validate recipient‑received amount ───────────────────── */
    cy.get(':nth-child(3) > :nth-child(2) > .ant-typography')
      .invoke('text')
      .then((text) => {
        cy.wrap(text).as('storedText');
        cy.log(text);
      });

    // ─────────────── Confirmation Screens ───────────────
    cy.get('.ant-col > .ant-btn > span').should('be.visible').click();

    cy.get('.ant-modal-body > :nth-child(1) > .ant-col > .ant-typography')
      .should('be.visible')
      .and('contain.text', 'Payment Confirmation');

    cy.get('@storedText').then((storedText) => {
      cy.get(':nth-child(4) > .ant-col-8 > .ant-typography')
        .should('be.visible')
        .and('contain.text', storedText);
    });

    // Pay recipient
    cy.get(
      '.ant-row-center.m-t-20 > .ant-col > .ant-space > :nth-child(2) > .ant-btn'
    )
      .should('be.visible')
      .click();

    cy.get('.ant-modal-body > :nth-child(1) > .ant-col')
      .should('be.visible')
      .and('contain.text', ' Payment Booked - ');

    cy.get('@storedText').then((storedText) => {
      cy.get(':nth-child(5) > .ant-col-8 > .ant-typography')
        .should('be.visible')
        .and('contain.text', storedText);
    })
    })
    xit('TC-AC-099 - Verify(business) that if Currency= NZD and Country = New Zealnad & client = UK and check priority settlement is enabled and make a payment with GBP using Push Funds',function () {
    // ─────────────── Setup & Recipient Creation ───────────────
       signin.Login(userName, password)
        newRecipient.goToPaymentsDashborad()
        newRecipient.gotoRecipientList()
        let email = batchPayments.generateRandomString(5)+ '@yopmail.com'
        newRecipient.addRecipient('New Zealand{enter}' ,'NZD{enter}',email)
        newRecipient.addBankDetailsWithAccNo('BKNZNZ22','049712')
        cy.get('#bsb').should('be.visible').type('302921')
        newRecipient.addBusinessRecipientCorpay('New Zealand{enter}','New Zealand NZD')
        newRecipient.saveRecipient()
        newRecipient.checkSettelment('be.disabled','be.enabled')
    // ─────────────── Payment Flow ───────────────
    newPayment.proceedflow('{downarrow}{enter}', 'GBP');
    const amount = '10';
    newPayment.addrecipientDetail(amount, email);
    newPayment.selectFundingMethod('Push Funds');

    /* ── Validate payment‑reason field ───────────────────────── */
    // 1️⃣ Ensure the field starts empty
    cy.get('.ant-select-selector')
      .eq(2)
      .should(($el) => {
        expect(
          $el.text().trim(),
          'reason field should start empty'
        ).to.equal('');
      })
      .click(); // open dropdown

    // 2️⃣ Pick a random option between 1 and 7
    cy.get('.ant-select-dropdown')
      .last()
      .find('.ant-select-item-option')
      .its('length')
      .then((total) => {
        const idx = Math.min(7, Cypress._.random(0, total - 1));
        cy.get('.ant-select-dropdown')
          .last()
          .find('.ant-select-item-option')
          .eq(idx)
          .click();
      });

    /* ── Validate recipient‑received amount ───────────────────── */
    cy.get(':nth-child(3) > :nth-child(2) > .ant-typography')
      .invoke('text')
      .then((text) => {
        cy.wrap(text).as('storedText');
        cy.log(text);
      });

    // ─────────────── Confirmation Screens ───────────────
    cy.get('.ant-col > .ant-btn > span').should('be.visible').click();

    cy.get('.ant-modal-body > :nth-child(1) > .ant-col > .ant-typography')
      .should('be.visible')
      .and('contain.text', 'Payment Confirmation');

    cy.get('@storedText').then((storedText) => {
      cy.get(':nth-child(4) > .ant-col-8 > .ant-typography')
        .should('be.visible')
        .and('contain.text', storedText);
    });

    // Pay recipient
    cy.get(
      '.ant-row-center.m-t-20 > .ant-col > .ant-space > :nth-child(2) > .ant-btn'
    )
      .should('be.visible')
      .click();

    cy.get('.ant-modal-body > :nth-child(1) > .ant-col')
      .should('be.visible')
      .and('contain.text', ' Payment Booked - ');

    cy.get('@storedText').then((storedText) => {
      cy.get(':nth-child(5) > .ant-col-8 > .ant-typography')
        .should('be.visible')
        .and('contain.text', storedText);
    })
    })
    it('TC-AC-100 - Verify(business) that if Currency= ZAR and Country = UNITED KINGDOM & client = UK and check priority settlement is enabled and make a payment with GBP using Push Funds',function () {
    // ─────────────── Setup & Recipient Creation ───────────────
       signin.Login(userName, password)
        newRecipient.goToPaymentsDashborad()
        newRecipient.gotoRecipientList()
        let email = batchPayments.generateRandomString(5)+ '@yopmail.com'
        newRecipient.addRecipient('UNITED KINGDOM{enter}' ,'ZAR{enter}',email)
        newRecipient.addBankDetails('GB73BARC20039538243547','AFFLGB22')
        newRecipient.addBusinessRecipientCorpay('UNITED KINGDOM{enter}','UK ZAR')
        newRecipient.saveRecipient()
        newRecipient.checkSettelment('be.disabled','be.enabled')
    // ─────────────── Payment Flow ───────────────
    newPayment.proceedflow('{downarrow}{enter}', 'GBP');
    const amount = '10';
    newPayment.addrecipientDetail(amount, email);
    newPayment.selectFundingMethod('Push Funds');

    /* ── Validate payment‑reason field ───────────────────────── */
    // 1️⃣ Ensure the field starts empty
    cy.get('.ant-select-selector')
      .eq(2)
      .should(($el) => {
        expect(
          $el.text().trim(),
          'reason field should start empty'
        ).to.equal('');
      })
      .click(); // open dropdown

    // 2️⃣ Pick a random option between 1 and 7
    cy.get('.ant-select-dropdown')
      .last()
      .find('.ant-select-item-option')
      .its('length')
      .then((total) => {
        const idx = Math.min(7, Cypress._.random(0, total - 1));
        cy.get('.ant-select-dropdown')
          .last()
          .find('.ant-select-item-option')
          .eq(idx)
          .click();
      });

    /* ── Validate recipient‑received amount ───────────────────── */
    cy.get(':nth-child(3) > :nth-child(2) > .ant-typography')
      .invoke('text')
      .then((text) => {
        cy.wrap(text).as('storedText');
        cy.log(text);
      });

    // ─────────────── Confirmation Screens ───────────────
    cy.get('.ant-col > .ant-btn > span').should('be.visible').click();

    cy.get('.ant-modal-body > :nth-child(1) > .ant-col > .ant-typography')
      .should('be.visible')
      .and('contain.text', 'Payment Confirmation');

    cy.get('@storedText').then((storedText) => {
      cy.get(':nth-child(4) > .ant-col-8 > .ant-typography')
        .should('be.visible')
        .and('contain.text', storedText);
    });

    // Pay recipient
    cy.get(
      '.ant-row-center.m-t-20 > .ant-col > .ant-space > :nth-child(2) > .ant-btn'
    )
      .should('be.visible')
      .click();

    cy.get('.ant-modal-body > :nth-child(1) > .ant-col')
      .should('be.visible')
      .and('contain.text', ' Payment Booked - ');

    cy.get('@storedText').then((storedText) => {
      cy.get(':nth-child(5) > .ant-col-8 > .ant-typography')
        .should('be.visible')
        .and('contain.text', storedText);
    })
    })
    it('TC-AC-101 - Verify(business) that if Currency= ZAR and Country = South Africa & client = UK and check priority settlement is enabled and make a payment with GBP using Push Funds',function () {
    // ─────────────── Setup & Recipient Creation ───────────────
       signin.Login(userName, password)
        newRecipient.goToPaymentsDashborad()
        newRecipient.gotoRecipientList()
        let email = batchPayments.generateRandomString(5)+ '@yopmail.com'
        newRecipient.addRecipient('South Africa{enter}' ,'ZAR{enter}',email)
        newRecipient.addBankDetailsWithAccNo('SARBZAJ6XXX','049712')
        cy.get('#branch_code').should('be.visible').type('632005')
        cy.get('#bankBranch').should('be.visible').type('City branch')
        newRecipient.addBusinessRecipientCorpay('South Africa{enter}','South Africa ZAR')
        newRecipient.saveRecipient()
        newRecipient.checkSettelment('be.disabled','be.enabled')
    // ─────────────── Payment Flow ───────────────
    newPayment.proceedflow('{downarrow}{enter}', 'GBP');
    const amount = '10';
    newPayment.addrecipientDetail(amount, email);
    newPayment.selectFundingMethod('Push Funds');

    /* ── Validate payment‑reason field ───────────────────────── */
    // 1️⃣ Ensure the field starts empty
    cy.get('.ant-select-selector')
      .eq(2)
      .should(($el) => {
        expect(
          $el.text().trim(),
          'reason field should start empty'
        ).to.equal('');
      })
      .click(); // open dropdown

    // 2️⃣ Pick a random option between 1 and 7
    cy.get('.ant-select-dropdown')
      .last()
      .find('.ant-select-item-option')
      .its('length')
      .then((total) => {
        const idx = Math.min(7, Cypress._.random(0, total - 1));
        cy.get('.ant-select-dropdown')
          .last()
          .find('.ant-select-item-option')
          .eq(idx)
          .click();
      });

    /* ── Validate recipient‑received amount ───────────────────── */
    cy.get(':nth-child(3) > :nth-child(2) > .ant-typography')
      .invoke('text')
      .then((text) => {
        cy.wrap(text).as('storedText');
        cy.log(text);
      });

    // ─────────────── Confirmation Screens ───────────────
    cy.get('.ant-col > .ant-btn > span').should('be.visible').click();

    cy.get('.ant-modal-body > :nth-child(1) > .ant-col > .ant-typography')
      .should('be.visible')
      .and('contain.text', 'Payment Confirmation');

    cy.get('@storedText').then((storedText) => {
      cy.get(':nth-child(4) > .ant-col-8 > .ant-typography')
        .should('be.visible')
        .and('contain.text', storedText);
    });

    // Pay recipient
    cy.get(
      '.ant-row-center.m-t-20 > .ant-col > .ant-space > :nth-child(2) > .ant-btn'
    )
      .should('be.visible')
      .click();

    cy.get('.ant-modal-body > :nth-child(1) > .ant-col')
      .should('be.visible')
      .and('contain.text', ' Payment Booked - ');

    cy.get('@storedText').then((storedText) => {
      cy.get(':nth-child(5) > .ant-col-8 > .ant-typography')
        .should('be.visible')
        .and('contain.text', storedText);
    })
    })
    it('TC-AC-102 - Verify(business) that if Currency= PLN and Country = UNITED KINGDOM & client = UK and check priority settlement is enabled and make a payment with GBP using Push Funds',function () {
    // ─────────────── Setup & Recipient Creation ───────────────
       signin.Login(userName, password)
        newRecipient.goToPaymentsDashborad()
        newRecipient.gotoRecipientList()
        let email = batchPayments.generateRandomString(5)+ '@yopmail.com'
        newRecipient.addRecipient('UNITED KINGDOM{enter}' ,'PLN{enter}',email)
        newRecipient.addBankDetails('GB73BARC20039538243547','AFFLGB22')
        newRecipient.addBusinessRecipientCorpay('UNITED KINGDOM{enter}','UK PLN')
        newRecipient.saveRecipient()
        newRecipient.checkSettelment('be.disabled','be.enabled')
    // ─────────────── Payment Flow ───────────────
    newPayment.proceedflow('{downarrow}{enter}', 'GBP');
    const amount = '10';
    newPayment.addrecipientDetail(amount, email);
    newPayment.selectFundingMethod('Push Funds');

    /* ── Validate payment‑reason field ───────────────────────── */
    // 1️⃣ Ensure the field starts empty
    cy.get('.ant-select-selector')
      .eq(2)
      .should(($el) => {
        expect(
          $el.text().trim(),
          'reason field should start empty'
        ).to.equal('');
      })
      .click(); // open dropdown

    // 2️⃣ Pick a random option between 1 and 7
    cy.get('.ant-select-dropdown')
      .last()
      .find('.ant-select-item-option')
      .its('length')
      .then((total) => {
        const idx = Math.min(7, Cypress._.random(0, total - 1));
        cy.get('.ant-select-dropdown')
          .last()
          .find('.ant-select-item-option')
          .eq(idx)
          .click();
      });

    /* ── Validate recipient‑received amount ───────────────────── */
    cy.get(':nth-child(3) > :nth-child(2) > .ant-typography')
      .invoke('text')
      .then((text) => {
        cy.wrap(text).as('storedText');
        cy.log(text);
      });

    // ─────────────── Confirmation Screens ───────────────
    cy.get('.ant-col > .ant-btn > span').should('be.visible').click();

    cy.get('.ant-modal-body > :nth-child(1) > .ant-col > .ant-typography')
      .should('be.visible')
      .and('contain.text', 'Payment Confirmation');

    cy.get('@storedText').then((storedText) => {
      cy.get(':nth-child(4) > .ant-col-8 > .ant-typography')
        .should('be.visible')
        .and('contain.text', storedText);
    });

    // Pay recipient
    cy.get(
      '.ant-row-center.m-t-20 > .ant-col > .ant-space > :nth-child(2) > .ant-btn'
    )
      .should('be.visible')
      .click();

    cy.get('.ant-modal-body > :nth-child(1) > .ant-col')
      .should('be.visible')
      .and('contain.text', ' Payment Booked - ');

    cy.get('@storedText').then((storedText) => {
      cy.get(':nth-child(5) > .ant-col-8 > .ant-typography')
        .should('be.visible')
        .and('contain.text', storedText);
    })
    })
    it('TC-AC-103 - Verify(business) that if Currency= PLN and Country = Poland & client = UK and check priority settlement is enabled and make a payment with GBP using Push Funds',function () {
    // ─────────────── Setup & Recipient Creation ───────────────
       signin.Login(userName, password)
        newRecipient.goToPaymentsDashborad()
        newRecipient.gotoRecipientList()
        let email = batchPayments.generateRandomString(5)+ '@yopmail.com'
        newRecipient.addRecipient('poland{enter}' ,'PLN{enter}',email)
        newRecipient.addBankDetails('PL10105000997603123456789123','BPKOPLPWXXX')
        newRecipient.addBusinessRecipientCorpay('Poland{enter}','Poland PLN')
        newRecipient.saveRecipient()
        newRecipient.checkSettelment('be.disabled','be.enabled')
    // ─────────────── Payment Flow ───────────────
    newPayment.proceedflow('{downarrow}{enter}', 'GBP');
    const amount = '10';
    newPayment.addrecipientDetail(amount, email);
    newPayment.selectFundingMethod('Push Funds');

    /* ── Validate payment‑reason field ───────────────────────── */
    // 1️⃣ Ensure the field starts empty
    cy.get('.ant-select-selector')
      .eq(2)
      .should(($el) => {
        expect(
          $el.text().trim(),
          'reason field should start empty'
        ).to.equal('');
      })
      .click(); // open dropdown

    // 2️⃣ Pick a random option between 1 and 7
    cy.get('.ant-select-dropdown')
      .last()
      .find('.ant-select-item-option')
      .its('length')
      .then((total) => {
        const idx = Math.min(7, Cypress._.random(0, total - 1));
        cy.get('.ant-select-dropdown')
          .last()
          .find('.ant-select-item-option')
          .eq(idx)
          .click();
      });

    /* ── Validate recipient‑received amount ───────────────────── */
    cy.get(':nth-child(3) > :nth-child(2) > .ant-typography')
      .invoke('text')
      .then((text) => {
        cy.wrap(text).as('storedText');
        cy.log(text);
      });

    // ─────────────── Confirmation Screens ───────────────
    cy.get('.ant-col > .ant-btn > span').should('be.visible').click();

    cy.get('.ant-modal-body > :nth-child(1) > .ant-col > .ant-typography')
      .should('be.visible')
      .and('contain.text', 'Payment Confirmation');

    cy.get('@storedText').then((storedText) => {
      cy.get(':nth-child(4) > .ant-col-8 > .ant-typography')
        .should('be.visible')
        .and('contain.text', storedText);
    });

    // Pay recipient
    cy.get(
      '.ant-row-center.m-t-20 > .ant-col > .ant-space > :nth-child(2) > .ant-btn'
    )
      .should('be.visible')
      .click();

    cy.get('.ant-modal-body > :nth-child(1) > .ant-col')
      .should('be.visible')
      .and('contain.text', ' Payment Booked - ');

    cy.get('@storedText').then((storedText) => {
      cy.get(':nth-child(5) > .ant-col-8 > .ant-typography')
        .should('be.visible')
        .and('contain.text', storedText);
    })
    })
    it('TC-AC-104 - Verify(business) that if Currency= DKK and Country = UNITED KINGDOM & client = UK and check priority settlement is enabled and make a payment with GBP using Push Funds',function () {
    // ─────────────── Setup & Recipient Creation ───────────────
       signin.Login(userName, password)
        newRecipient.goToPaymentsDashborad()
        newRecipient.gotoRecipientList()
        let email = batchPayments.generateRandomString(5)+ '@yopmail.com'
        newRecipient.addRecipient('UNITED KINGDOM{enter}' ,'DKK{enter}',email)
        newRecipient.addBankDetails('GB73BARC20039538243547','AFFLGB22')
        newRecipient.addBusinessRecipientCorpay('UNITED KINGDOM{enter}','UK DKK')
        newRecipient.saveRecipient()
        newRecipient.checkSettelment('be.disabled','be.enabled')
    // ─────────────── Payment Flow ───────────────
    newPayment.proceedflow('{downarrow}{enter}', 'GBP');
    const amount = '10';
    newPayment.addrecipientDetail(amount, email);
    newPayment.selectFundingMethod('Push Funds');

    /* ── Validate payment‑reason field ───────────────────────── */
    // 1️⃣ Ensure the field starts empty
    cy.get('.ant-select-selector')
      .eq(2)
      .should(($el) => {
        expect(
          $el.text().trim(),
          'reason field should start empty'
        ).to.equal('');
      })
      .click(); // open dropdown

    // 2️⃣ Pick a random option between 1 and 7
    cy.get('.ant-select-dropdown')
      .last()
      .find('.ant-select-item-option')
      .its('length')
      .then((total) => {
        const idx = Math.min(7, Cypress._.random(0, total - 1));
        cy.get('.ant-select-dropdown')
          .last()
          .find('.ant-select-item-option')
          .eq(idx)
          .click();
      });

    /* ── Validate recipient‑received amount ───────────────────── */
    cy.get(':nth-child(3) > :nth-child(2) > .ant-typography')
      .invoke('text')
      .then((text) => {
        cy.wrap(text).as('storedText');
        cy.log(text);
      });

    // ─────────────── Confirmation Screens ───────────────
    cy.get('.ant-col > .ant-btn > span').should('be.visible').click();

    cy.get('.ant-modal-body > :nth-child(1) > .ant-col > .ant-typography')
      .should('be.visible')
      .and('contain.text', 'Payment Confirmation');

    cy.get('@storedText').then((storedText) => {
      cy.get(':nth-child(4) > .ant-col-8 > .ant-typography')
        .should('be.visible')
        .and('contain.text', storedText);
    });

    // Pay recipient
    cy.get(
      '.ant-row-center.m-t-20 > .ant-col > .ant-space > :nth-child(2) > .ant-btn'
    )
      .should('be.visible')
      .click();

    cy.get('.ant-modal-body > :nth-child(1) > .ant-col')
      .should('be.visible')
      .and('contain.text', ' Payment Booked - ');

    cy.get('@storedText').then((storedText) => {
      cy.get(':nth-child(5) > .ant-col-8 > .ant-typography')
        .should('be.visible')
        .and('contain.text', storedText);
    })
    })
    it('TC-AC-105 - Verify(business) that if Currency= DKK and Country = Denmark & client = UK and check priority and regular settlement are enabled and make a payment with GBP using Push Funds',function () {
    // ─────────────── Setup & Recipient Creation ───────────────
       signin.Login(userName, password)
        newRecipient.goToPaymentsDashborad()
        newRecipient.gotoRecipientList()
        let email = batchPayments.generateRandomString(5)+ '@yopmail.com'
        newRecipient.addRecipient('Denmark{enter}' ,'DKK{enter}',email)
        newRecipient.addBankDetails('DK9520000123456789','NDEADKKKXXX')
        cy.get('#accNumber').should('be.visible').type('1234578912')
        cy.get('#bank_code').should('be.visible').type('2000')
        newRecipient.addBusinessRecipientCorpay('Denmark{enter}','Denmark DKK')
        cy.get('#postcode').should('be.visible').type('50505')
        newRecipient.saveRecipient()
        newRecipient.checkSettelmentEnabledBoth('be.enabled','be.enabled')
    // ─────────────── Payment Flow ───────────────
    newPayment.proceedflow('{downarrow}{enter}', 'GBP');
    const amount = '10';
    newPayment.addrecipientDetail(amount, email);
    newPayment.selectFundingMethod('Push Funds');

    /* ── Validate payment‑reason field ───────────────────────── */
    // 1️⃣ Ensure the field starts empty
    cy.get('.ant-select-selector')
      .eq(2)
      .should(($el) => {
        expect(
          $el.text().trim(),
          'reason field should start empty'
        ).to.equal('');
      })
      .click(); // open dropdown

    // 2️⃣ Pick a random option between 1 and 7
    cy.get('.ant-select-dropdown')
      .last()
      .find('.ant-select-item-option')
      .its('length')
      .then((total) => {
        const idx = Math.min(7, Cypress._.random(0, total - 1));
        cy.get('.ant-select-dropdown')
          .last()
          .find('.ant-select-item-option')
          .eq(idx)
          .click();
      });

    /* ── Validate recipient‑received amount ───────────────────── */
    cy.get(':nth-child(3) > :nth-child(2) > .ant-typography')
      .invoke('text')
      .then((text) => {
        cy.wrap(text).as('storedText');
        cy.log(text);
      });

    // ─────────────── Confirmation Screens ───────────────
    cy.get('.ant-col > .ant-btn > span').should('be.visible').click();

    cy.get('.ant-modal-body > :nth-child(1) > .ant-col > .ant-typography')
      .should('be.visible')
      .and('contain.text', 'Payment Confirmation');

    cy.get('@storedText').then((storedText) => {
      cy.get(':nth-child(4) > .ant-col-8 > .ant-typography')
        .should('be.visible')
        .and('contain.text', storedText);
    });

    // Pay recipient
    cy.get(
      '.ant-row-center.m-t-20 > .ant-col > .ant-space > :nth-child(2) > .ant-btn'
    )
      .should('be.visible')
      .click();

    cy.get('.ant-modal-body > :nth-child(1) > .ant-col')
      .should('be.visible')
      .and('contain.text', ' Payment Booked - ');

    cy.get('@storedText').then((storedText) => {
      cy.get(':nth-child(5) > .ant-col-8 > .ant-typography')
        .should('be.visible')
        .and('contain.text', storedText);
    })
    })
    it('TC-AC-106 - Verify(business) that if Currency= SEK and Country = UNITED KINGDOM & client = UK and check priority settlement is enabled and make a payment with GBP using Push Funds',function () {
    // ─────────────── Setup & Recipient Creation ───────────────
       signin.Login(userName, password)
        newRecipient.goToPaymentsDashborad()
        newRecipient.gotoRecipientList()
        let email = batchPayments.generateRandomString(5)+ '@yopmail.com'
        newRecipient.addRecipient('UNITED KINGDOM{enter}' ,'SEK{enter}',email)
        newRecipient.addBankDetails('GB73BARC20039538243547','AFFLGB22')
        newRecipient.addBusinessRecipientCorpay('UNITED KINGDOM{enter}','UK SEK')
        newRecipient.saveRecipient()
        newRecipient.checkSettelment('be.disabled','be.enabled')
    // ─────────────── Payment Flow ───────────────
    newPayment.proceedflow('{downarrow}{enter}', 'GBP');
    const amount = '10';
    newPayment.addrecipientDetail(amount, email);
    newPayment.selectFundingMethod('Push Funds');

    /* ── Validate payment‑reason field ───────────────────────── */
    // 1️⃣ Ensure the field starts empty
    cy.get('.ant-select-selector')
      .eq(2)
      .should(($el) => {
        expect(
          $el.text().trim(),
          'reason field should start empty'
        ).to.equal('');
      })
      .click(); // open dropdown

    // 2️⃣ Pick a random option between 1 and 7
    cy.get('.ant-select-dropdown')
      .last()
      .find('.ant-select-item-option')
      .its('length')
      .then((total) => {
        const idx = Math.min(7, Cypress._.random(0, total - 1));
        cy.get('.ant-select-dropdown')
          .last()
          .find('.ant-select-item-option')
          .eq(idx)
          .click();
      });

    /* ── Validate recipient‑received amount ───────────────────── */
    cy.get(':nth-child(3) > :nth-child(2) > .ant-typography')
      .invoke('text')
      .then((text) => {
        cy.wrap(text).as('storedText');
        cy.log(text);
      });

    // ─────────────── Confirmation Screens ───────────────
    cy.get('.ant-col > .ant-btn > span').should('be.visible').click();

    cy.get('.ant-modal-body > :nth-child(1) > .ant-col > .ant-typography')
      .should('be.visible')
      .and('contain.text', 'Payment Confirmation');

    cy.get('@storedText').then((storedText) => {
      cy.get(':nth-child(4) > .ant-col-8 > .ant-typography')
        .should('be.visible')
        .and('contain.text', storedText);
    });

    // Pay recipient
    cy.get(
      '.ant-row-center.m-t-20 > .ant-col > .ant-space > :nth-child(2) > .ant-btn'
    )
      .should('be.visible')
      .click();

    cy.get('.ant-modal-body > :nth-child(1) > .ant-col')
      .should('be.visible')
      .and('contain.text', ' Payment Booked - ');

    cy.get('@storedText').then((storedText) => {
      cy.get(':nth-child(5) > .ant-col-8 > .ant-typography')
        .should('be.visible')
        .and('contain.text', storedText);
    })
    })
    it('TC-AC-107 - Verify(business) that if Currency= SEK and Country = Sweden & client = UK and check priority settlement is enabled and make a payment with GBP using Push Funds',function () {
    // ─────────────── Setup & Recipient Creation ───────────────
       signin.Login(userName, password)
        newRecipient.goToPaymentsDashborad()
        newRecipient.gotoRecipientList()
        let email = batchPayments.generateRandomString(5)+ '@yopmail.com'
        newRecipient.addRecipient('Sweden{enter}' ,'SEK{enter}',email)
        newRecipient.addBankDetails('SE7280000810340009783242','SWEDSESSXXX')
        newRecipient.addBusinessRecipientCorpay('Sweden{enter}','Sweden SEK')
        cy.get('#postcode').should('be.visible').type('50505')
        newRecipient.saveRecipient()
        newRecipient.checkSettelment('be.disabled','be.enabled')
    // ─────────────── Payment Flow ───────────────
    newPayment.proceedflow('{downarrow}{enter}', 'GBP');
    const amount = '10';
    newPayment.addrecipientDetail(amount, email);
    newPayment.selectFundingMethod('Push Funds');

    /* ── Validate payment‑reason field ───────────────────────── */
    // 1️⃣ Ensure the field starts empty
    cy.get('.ant-select-selector')
      .eq(2)
      .should(($el) => {
        expect(
          $el.text().trim(),
          'reason field should start empty'
        ).to.equal('');
      })
      .click(); // open dropdown

    // 2️⃣ Pick a random option between 1 and 7
    cy.get('.ant-select-dropdown')
      .last()
      .find('.ant-select-item-option')
      .its('length')
      .then((total) => {
        const idx = Math.min(7, Cypress._.random(0, total - 1));
        cy.get('.ant-select-dropdown')
          .last()
          .find('.ant-select-item-option')
          .eq(idx)
          .click();
      });

    /* ── Validate recipient‑received amount ───────────────────── */
    cy.get(':nth-child(3) > :nth-child(2) > .ant-typography')
      .invoke('text')
      .then((text) => {
        cy.wrap(text).as('storedText');
        cy.log(text);
      });

    // ─────────────── Confirmation Screens ───────────────
    cy.get('.ant-col > .ant-btn > span').should('be.visible').click();

    cy.get('.ant-modal-body > :nth-child(1) > .ant-col > .ant-typography')
      .should('be.visible')
      .and('contain.text', 'Payment Confirmation');

    cy.get('@storedText').then((storedText) => {
      cy.get(':nth-child(4) > .ant-col-8 > .ant-typography')
        .should('be.visible')
        .and('contain.text', storedText);
    });

    // Pay recipient
    cy.get(
      '.ant-row-center.m-t-20 > .ant-col > .ant-space > :nth-child(2) > .ant-btn'
    )
      .should('be.visible')
      .click();

    cy.get('.ant-modal-body > :nth-child(1) > .ant-col')
      .should('be.visible')
      .and('contain.text', ' Payment Booked - ');

    cy.get('@storedText').then((storedText) => {
      cy.get(':nth-child(5) > .ant-col-8 > .ant-typography')
        .should('be.visible')
        .and('contain.text', storedText);
    })
    })
    it('TC-AC-108 - Verify(business) that if Currency= NOK and Country = UNITED KINGDOM & client = UK and check priority settlement is enabled and make a payment with GBP using Push Funds',function () {
    // ─────────────── Setup & Recipient Creation ───────────────
       signin.Login(userName, password)
        newRecipient.goToPaymentsDashborad()
        newRecipient.gotoRecipientList()
        let email = batchPayments.generateRandomString(5)+ '@yopmail.com'
        newRecipient.addRecipient('UNITED KINGDOM{enter}' ,'NOK{enter}',email)
        newRecipient.addBankDetails('GB73BARC20039538243547','AFFLGB22')
        newRecipient.addBusinessRecipientCorpay('UNITED KINGDOM{enter}','UK NOR')
        newRecipient.saveRecipient()
        newRecipient.checkSettelment('be.disabled','be.enabled')
    // ─────────────── Payment Flow ───────────────
    newPayment.proceedflow('{downarrow}{enter}', 'GBP');
    const amount = '10';
    newPayment.addrecipientDetail(amount, email);
    newPayment.selectFundingMethod('Push Funds');

    /* ── Validate payment‑reason field ───────────────────────── */
    // 1️⃣ Ensure the field starts empty
    cy.get('.ant-select-selector')
      .eq(2)
      .should(($el) => {
        expect(
          $el.text().trim(),
          'reason field should start empty'
        ).to.equal('');
      })
      .click(); // open dropdown

    // 2️⃣ Pick a random option between 1 and 7
    cy.get('.ant-select-dropdown')
      .last()
      .find('.ant-select-item-option')
      .its('length')
      .then((total) => {
        const idx = Math.min(7, Cypress._.random(0, total - 1));
        cy.get('.ant-select-dropdown')
          .last()
          .find('.ant-select-item-option')
          .eq(idx)
          .click();
      });

    /* ── Validate recipient‑received amount ───────────────────── */
    cy.get(':nth-child(3) > :nth-child(2) > .ant-typography')
      .invoke('text')
      .then((text) => {
        cy.wrap(text).as('storedText');
        cy.log(text);
      });

    // ─────────────── Confirmation Screens ───────────────
    cy.get('.ant-col > .ant-btn > span').should('be.visible').click();

    cy.get('.ant-modal-body > :nth-child(1) > .ant-col > .ant-typography')
      .should('be.visible')
      .and('contain.text', 'Payment Confirmation');

    cy.get('@storedText').then((storedText) => {
      cy.get(':nth-child(4) > .ant-col-8 > .ant-typography')
        .should('be.visible')
        .and('contain.text', storedText);
    });

    // Pay recipient
    cy.get(
      '.ant-row-center.m-t-20 > .ant-col > .ant-space > :nth-child(2) > .ant-btn'
    )
      .should('be.visible')
      .click();

    cy.get('.ant-modal-body > :nth-child(1) > .ant-col')
      .should('be.visible')
      .and('contain.text', ' Payment Booked - ');

    cy.get('@storedText').then((storedText) => {
      cy.get(':nth-child(5) > .ant-col-8 > .ant-typography')
        .should('be.visible')
        .and('contain.text', storedText);
    })
    })
    it('TC-AC-109 - Verify(business) that if Currency= NOK and Country = Norway & client = UK and check priority and regular both settlement are enabled and make a payment with GBP using Push Funds',function () {
    // ─────────────── Setup & Recipient Creation ───────────────
       signin.Login(userName, password)
        newRecipient.goToPaymentsDashborad()
        newRecipient.gotoRecipientList()
        let email = batchPayments.generateRandomString(5)+ '@yopmail.com'
        newRecipient.addRecipient('Norway{enter}' ,'NOK{enter}',email)
        newRecipient.addBankDetails('NO8330001234567','SPTRNO22XXX')
        cy.get('#accNumber').should('be.visible').type('1234572')
        cy.get('#bank_code').should('be.visible').type('2000')
        newRecipient.addBusinessRecipientCorpay('Denmark{enter}','Denmark DKK')
        cy.get('#postcode').should('be.visible').type('50505')
        newRecipient.saveRecipient()
        newRecipient.checkSettelmentEnabledBoth('be.enabled','be.enabled')
    // ─────────────── Payment Flow ───────────────
    newPayment.proceedflow('{downarrow}{enter}', 'GBP');
    const amount = '10';
    newPayment.addrecipientDetail(amount, email);
    newPayment.selectFundingMethod('Push Funds');

    /* ── Validate payment‑reason field ───────────────────────── */
    // 1️⃣ Ensure the field starts empty
    cy.get('.ant-select-selector')
      .eq(2)
      .should(($el) => {
        expect(
          $el.text().trim(),
          'reason field should start empty'
        ).to.equal('');
      })
      .click(); // open dropdown

    // 2️⃣ Pick a random option between 1 and 7
    cy.get('.ant-select-dropdown')
      .last()
      .find('.ant-select-item-option')
      .its('length')
      .then((total) => {
        const idx = Math.min(7, Cypress._.random(0, total - 1));
        cy.get('.ant-select-dropdown')
          .last()
          .find('.ant-select-item-option')
          .eq(idx)
          .click();
      });

    /* ── Validate recipient‑received amount ───────────────────── */
    cy.get(':nth-child(3) > :nth-child(2) > .ant-typography')
      .invoke('text')
      .then((text) => {
        cy.wrap(text).as('storedText');
        cy.log(text);
      });

    // ─────────────── Confirmation Screens ───────────────
    cy.get('.ant-col > .ant-btn > span').should('be.visible').click();

    cy.get('.ant-modal-body > :nth-child(1) > .ant-col > .ant-typography')
      .should('be.visible')
      .and('contain.text', 'Payment Confirmation');

    cy.get('@storedText').then((storedText) => {
      cy.get(':nth-child(4) > .ant-col-8 > .ant-typography')
        .should('be.visible')
        .and('contain.text', storedText);
    });

    // Pay recipient
    cy.get(
      '.ant-row-center.m-t-20 > .ant-col > .ant-space > :nth-child(2) > .ant-btn'
    )
      .should('be.visible')
      .click();

    cy.get('.ant-modal-body > :nth-child(1) > .ant-col')
      .should('be.visible')
      .and('contain.text', ' Payment Booked - ');

    cy.get('@storedText').then((storedText) => {
      cy.get(':nth-child(5) > .ant-col-8 > .ant-typography')
        .should('be.visible')
        .and('contain.text', storedText);
    })
    })
    it('TC-AC-110 - Verify(business) that if Currency= JPY and Country = UNITED KINGDOM & client = UK and check priority settlement is enabled and make a payment with GBP using Push Funds',function () {
    // ─────────────── Setup & Recipient Creation ───────────────
       signin.Login(userName, password)
        newRecipient.goToPaymentsDashborad()
        newRecipient.gotoRecipientList()
        let email = batchPayments.generateRandomString(5)+ '@yopmail.com'
        newRecipient.addRecipient('UNITED KINGDOM{enter}' ,'JPY{enter}',email)
        newRecipient.addBankDetails('GB73BARC20039538243547','AFFLGB22')
        newRecipient.addBusinessRecipientCorpay('UNITED KINGDOM{enter}','UK JPY')
        newRecipient.saveRecipient()
        newRecipient.checkSettelment('be.disabled','be.enabled')
    // ─────────────── Payment Flow ───────────────
    newPayment.proceedflow('{downarrow}{enter}', 'GBP');
    const amount = '10';
    newPayment.addrecipientDetail(amount, email);
    newPayment.selectFundingMethod('Push Funds');

    /* ── Validate payment‑reason field ───────────────────────── */
    // 1️⃣ Ensure the field starts empty
    cy.get('.ant-select-selector')
      .eq(2)
      .should(($el) => {
        expect(
          $el.text().trim(),
          'reason field should start empty'
        ).to.equal('');
      })
      .click(); // open dropdown

    // 2️⃣ Pick a random option between 1 and 7
    cy.get('.ant-select-dropdown')
      .last()
      .find('.ant-select-item-option')
      .its('length')
      .then((total) => {
        const idx = Math.min(7, Cypress._.random(0, total - 1));
        cy.get('.ant-select-dropdown')
          .last()
          .find('.ant-select-item-option')
          .eq(idx)
          .click();
      });

    /* ── Validate recipient‑received amount ───────────────────── */
    cy.get(':nth-child(3) > :nth-child(2) > .ant-typography')
      .invoke('text')
      .then((text) => {
        cy.wrap(text).as('storedText');
        cy.log(text);
      });

    // ─────────────── Confirmation Screens ───────────────
    cy.get('.ant-col > .ant-btn > span').should('be.visible').click();

    cy.get('.ant-modal-body > :nth-child(1) > .ant-col > .ant-typography')
      .should('be.visible')
      .and('contain.text', 'Payment Confirmation');

    cy.get('@storedText').then((storedText) => {
      cy.get(':nth-child(4) > .ant-col-8 > .ant-typography')
        .should('be.visible')
        .and('contain.text', storedText);
    });

    // Pay recipient
    cy.get(
      '.ant-row-center.m-t-20 > .ant-col > .ant-space > :nth-child(2) > .ant-btn'
    )
      .should('be.visible')
      .click();

    cy.get('.ant-modal-body > :nth-child(1) > .ant-col')
      .should('be.visible')
      .and('contain.text', ' Payment Booked - ');

    cy.get('@storedText').then((storedText) => {
      cy.get(':nth-child(5) > .ant-col-8 > .ant-typography')
        .should('be.visible')
        .and('contain.text', storedText);
    })
    })
    it('TC-AC-111 - Verify(business) that if Currency= JPY and Country = Japan & client = UK and check priority settlement is enabled and make a payment with GBP using Push Funds',function () {
    // ─────────────── Setup & Recipient Creation ───────────────
       signin.Login(userName, password)
        newRecipient.goToPaymentsDashborad()
        newRecipient.gotoRecipientList()
        let email = batchPayments.generateRandomString(5)+ '@yopmail.com'
        newRecipient.addRecipient('Japan{enter}' ,'JPY{enter}',email)
        newRecipient.addBankDetailsWithAccNo('BOJPJPJTXXX','049712')
        cy.get('#bankBranch').should('be.visible').type('City branch')
        newRecipient.addBusinessRecipientCorpay('Japan{enter}','Japan JPY')
        newRecipient.saveRecipient()
        newRecipient.checkSettelment('be.disabled','be.enabled')
    // ─────────────── Payment Flow ───────────────
    newPayment.proceedflow('{downarrow}{enter}', 'GBP');
    const amount = '10';
    newPayment.addrecipientDetail(amount, email);
    newPayment.selectFundingMethod('Push Funds');

    /* ── Validate payment‑reason field ───────────────────────── */
    // 1️⃣ Ensure the field starts empty
    cy.get('.ant-select-selector')
      .eq(2)
      .should(($el) => {
        expect(
          $el.text().trim(),
          'reason field should start empty'
        ).to.equal('');
      })
      .click(); // open dropdown

    // 2️⃣ Pick a random option between 1 and 7
    cy.get('.ant-select-dropdown')
      .last()
      .find('.ant-select-item-option')
      .its('length')
      .then((total) => {
        const idx = Math.min(7, Cypress._.random(0, total - 1));
        cy.get('.ant-select-dropdown')
          .last()
          .find('.ant-select-item-option')
          .eq(idx)
          .click();
      });

    /* ── Validate recipient‑received amount ───────────────────── */
    cy.get(':nth-child(3) > :nth-child(2) > .ant-typography')
      .invoke('text')
      .then((text) => {
        cy.wrap(text).as('storedText');
        cy.log(text);
      });

    // ─────────────── Confirmation Screens ───────────────
    cy.get('.ant-col > .ant-btn > span').should('be.visible').click();

    cy.get('.ant-modal-body > :nth-child(1) > .ant-col > .ant-typography')
      .should('be.visible')
      .and('contain.text', 'Payment Confirmation');

    cy.get('@storedText').then((storedText) => {
      cy.get(':nth-child(4) > .ant-col-8 > .ant-typography')
        .should('be.visible')
        .and('contain.text', storedText);
    });

    // Pay recipient
    cy.get(
      '.ant-row-center.m-t-20 > .ant-col > .ant-space > :nth-child(2) > .ant-btn'
    )
      .should('be.visible')
      .click();

    cy.get('.ant-modal-body > :nth-child(1) > .ant-col')
      .should('be.visible')
      .and('contain.text', ' Payment Booked - ');

    cy.get('@storedText').then((storedText) => {
      cy.get(':nth-child(5) > .ant-col-8 > .ant-typography')
        .should('be.visible')
        .and('contain.text', storedText);
    })
    })
    it('TC-AC-112 - Verify(business) that if Currency= CAD and Country = UNITED KINGDOM & client = UK and check priority settlement is enabled and make a payment with GBP using Push Funds',function () {
    // ─────────────── Setup & Recipient Creation ───────────────
       signin.Login(userName, password)
        newRecipient.goToPaymentsDashborad()
        newRecipient.gotoRecipientList()
        let email = batchPayments.generateRandomString(5)+ '@yopmail.com'
        newRecipient.addRecipient('UNITED KINGDOM{enter}' ,'CAD{enter}',email)
        newRecipient.addBankDetails('GB73BARC20039538243547','AFFLGB22')
        newRecipient.addBusinessRecipientCorpay('UNITED KINGDOM{enter}','UK CAD')
        newRecipient.saveRecipient()
        newRecipient.checkSettelment('be.disabled','be.enabled')
    // ─────────────── Payment Flow ───────────────
    newPayment.proceedflow('{downarrow}{enter}', 'GBP');
    const amount = '10';
    newPayment.addrecipientDetail(amount, email);
    newPayment.selectFundingMethod('Push Funds');

    /* ── Validate payment‑reason field ───────────────────────── */
    // 1️⃣ Ensure the field starts empty
    cy.get('.ant-select-selector')
      .eq(2)
      .should(($el) => {
        expect(
          $el.text().trim(),
          'reason field should start empty'
        ).to.equal('');
      })
      .click(); // open dropdown

    // 2️⃣ Pick a random option between 1 and 7
    cy.get('.ant-select-dropdown')
      .last()
      .find('.ant-select-item-option')
      .its('length')
      .then((total) => {
        const idx = Math.min(7, Cypress._.random(0, total - 1));
        cy.get('.ant-select-dropdown')
          .last()
          .find('.ant-select-item-option')
          .eq(idx)
          .click();
      });

    /* ── Validate recipient‑received amount ───────────────────── */
    cy.get(':nth-child(3) > :nth-child(2) > .ant-typography')
      .invoke('text')
      .then((text) => {
        cy.wrap(text).as('storedText');
        cy.log(text);
      });

    // ─────────────── Confirmation Screens ───────────────
    cy.get('.ant-col > .ant-btn > span').should('be.visible').click();

    cy.get('.ant-modal-body > :nth-child(1) > .ant-col > .ant-typography')
      .should('be.visible')
      .and('contain.text', 'Payment Confirmation');

    cy.get('@storedText').then((storedText) => {
      cy.get(':nth-child(4) > .ant-col-8 > .ant-typography')
        .should('be.visible')
        .and('contain.text', storedText);
    });

    // Pay recipient
    cy.get(
      '.ant-row-center.m-t-20 > .ant-col > .ant-space > :nth-child(2) > .ant-btn'
    )
      .should('be.visible')
      .click();

    cy.get('.ant-modal-body > :nth-child(1) > .ant-col')
      .should('be.visible')
      .and('contain.text', ' Payment Booked - ');

    cy.get('@storedText').then((storedText) => {
      cy.get(':nth-child(5) > .ant-col-8 > .ant-typography')
        .should('be.visible')
        .and('contain.text', storedText);
    })
    })
    it('TC-AC-113 - Verify(business) that if Currency= CAD and Country = Canada & client = UK and check priority and regular both settlement are enabled and make a payment with GBP using Push Funds',function () {
    // ─────────────── Setup & Recipient Creation ───────────────
       signin.Login(userName, password)
        newRecipient.goToPaymentsDashborad()
        newRecipient.gotoRecipientList()
        let email = batchPayments.generateRandomString(5)+ '@yopmail.com'
        newRecipient.addRecipient('Canada{enter}' ,'CAD{enter}',email)
        newRecipient.addBankDetailsWithAccNo('ROYCCAT2XXX','0497124')
        cy.get('#bank_code').should('be.visible').type('004')
        cy.get('#branch_code').should('be.visible').type('07171')
        newRecipient.addBusinessRecipientCorpay('Canada{enter}','Canada CAD')
        newRecipient.postCodeStateCanada()
        newRecipient.saveRecipient()
        newRecipient.checkSettelmentEnabledBoth('be.enabled','be.enabled')
    // ─────────────── Payment Flow ───────────────
    newPayment.proceedflow('{downarrow}{enter}', 'GBP');
    const amount = '10';
    newPayment.addrecipientDetail(amount, email);
    newPayment.selectFundingMethod('Push Funds');

    /* ── Validate payment‑reason field ───────────────────────── */
    // 1️⃣ Ensure the field starts empty
    cy.get('.ant-select-selector')
      .eq(2)
      .should(($el) => {
        expect(
          $el.text().trim(),
          'reason field should start empty'
        ).to.equal('');
      })
      .click(); // open dropdown

    // 2️⃣ Pick a random option between 1 and 7
    cy.get('.ant-select-dropdown')
      .last()
      .find('.ant-select-item-option')
      .its('length')
      .then((total) => {
        const idx = Math.min(7, Cypress._.random(0, total - 1));
        cy.get('.ant-select-dropdown')
          .last()
          .find('.ant-select-item-option')
          .eq(idx)
          .click();
      });

    /* ── Validate recipient‑received amount ───────────────────── */
    cy.get(':nth-child(3) > :nth-child(2) > .ant-typography')
      .invoke('text')
      .then((text) => {
        cy.wrap(text).as('storedText');
        cy.log(text);
      });

    // ─────────────── Confirmation Screens ───────────────
    cy.get('.ant-col > .ant-btn > span').should('be.visible').click();

    cy.get('.ant-modal-body > :nth-child(1) > .ant-col > .ant-typography')
      .should('be.visible')
      .and('contain.text', 'Payment Confirmation');

    cy.get('@storedText').then((storedText) => {
      cy.get(':nth-child(4) > .ant-col-8 > .ant-typography')
        .should('be.visible')
        .and('contain.text', storedText);
    });

    // Pay recipient
    cy.get(
      '.ant-row-center.m-t-20 > .ant-col > .ant-space > :nth-child(2) > .ant-btn'
    )
      .should('be.visible')
      .click();

    cy.get('.ant-modal-body > :nth-child(1) > .ant-col')
      .should('be.visible')
      .and('contain.text', ' Payment Booked - ');

    cy.get('@storedText').then((storedText) => {
      cy.get(':nth-child(5) > .ant-col-8 > .ant-typography')
        .should('be.visible')
        .and('contain.text', storedText);
    })
    })
    it('TC-AC-114 - Verify(business) that if Currency= USD and Country = UNITED KINGDOM & client = UK and check priority settlement is enabled and make a payment with GBP using Push Funds',function () {
    // ─────────────── Setup & Recipient Creation ───────────────
       signin.Login(userName, password)
        newRecipient.goToPaymentsDashborad()
        newRecipient.gotoRecipientList()
        let email = batchPayments.generateRandomString(5)+ '@yopmail.com'
        newRecipient.addRecipient('UNITED KINGDOM{enter}' ,'USD{enter}',email)
        newRecipient.addBankDetails('GB73BARC20039538243547','AFFLGB22')
        newRecipient.addBusinessRecipientCorpay('UNITED KINGDOM{enter}','UK USD')
        newRecipient.saveRecipient()
        newRecipient.checkSettelment('be.disabled','be.enabled')
    // ─────────────── Payment Flow ───────────────
    newPayment.proceedflow('{downarrow}{enter}', 'GBP');
    const amount = '10';
    newPayment.addrecipientDetail(amount, email);
    newPayment.selectFundingMethod('Push Funds');

    /* ── Validate payment‑reason field ───────────────────────── */
    // 1️⃣ Ensure the field starts empty
    cy.get('.ant-select-selector')
      .eq(2)
      .should(($el) => {
        expect(
          $el.text().trim(),
          'reason field should start empty'
        ).to.equal('');
      })
      .click(); // open dropdown

    // 2️⃣ Pick a random option between 1 and 7
    cy.get('.ant-select-dropdown')
      .last()
      .find('.ant-select-item-option')
      .its('length')
      .then((total) => {
        const idx = Math.min(7, Cypress._.random(0, total - 1));
        cy.get('.ant-select-dropdown')
          .last()
          .find('.ant-select-item-option')
          .eq(idx)
          .click();
      });

    /* ── Validate recipient‑received amount ───────────────────── */
    cy.get(':nth-child(3) > :nth-child(2) > .ant-typography')
      .invoke('text')
      .then((text) => {
        cy.wrap(text).as('storedText');
        cy.log(text);
      });

    // ─────────────── Confirmation Screens ───────────────
    cy.get('.ant-col > .ant-btn > span').should('be.visible').click();

    cy.get('.ant-modal-body > :nth-child(1) > .ant-col > .ant-typography')
      .should('be.visible')
      .and('contain.text', 'Payment Confirmation');

    cy.get('@storedText').then((storedText) => {
      cy.get(':nth-child(4) > .ant-col-8 > .ant-typography')
        .should('be.visible')
        .and('contain.text', storedText);
    });

    // Pay recipient
    cy.get(
      '.ant-row-center.m-t-20 > .ant-col > .ant-space > :nth-child(2) > .ant-btn'
    )
      .should('be.visible')
      .click();

    cy.get('.ant-modal-body > :nth-child(1) > .ant-col')
      .should('be.visible')
      .and('contain.text', ' Payment Booked - ');

    cy.get('@storedText').then((storedText) => {
      cy.get(':nth-child(5) > .ant-col-8 > .ant-typography')
        .should('be.visible')
        .and('contain.text', storedText);
    })
    })
    xit('TC-AC-115 - Verify(business) that if Currency= USD and Country = UNITED States & client = UK and check priority and regular settlement is enabled and make a payment with GBP using Push Funds',function () {
    // ─────────────── Setup & Recipient Creation ───────────────
       signin.Login(userName, password)
        newRecipient.goToPaymentsDashborad()
        newRecipient.gotoRecipientList()
        let email = batchPayments.generateRandomString(5)+ '@yopmail.com'
        newRecipient.addRecipient('United States{enter}' ,'USD{enter}',email)
        newRecipient.addBankDetailsWithAccNo('USBKUS44','011401533')
        cy.get('#aba').should('be.visible').type('026009593')
        newRecipient.addBusinessRecipientCorpay('United States{enter}','United States USD')
        newRecipient.postCodeStateUS()
        newRecipient.saveRecipient()
        //to do (need to check the settlment it's not currently validating iban)
        newRecipient.checkSettelmentEnabledBoth('be.enabled','be.enabled')
    // ─────────────── Payment Flow ───────────────
    newPayment.proceedflow('{downarrow}{enter}', 'GBP');
    const amount = '10';
    newPayment.addrecipientDetail(amount, email);
    newPayment.selectFundingMethod('Push Funds');

    /* ── Validate payment‑reason field ───────────────────────── */
    // 1️⃣ Ensure the field starts empty
    cy.get('.ant-select-selector')
      .eq(2)
      .should(($el) => {
        expect(
          $el.text().trim(),
          'reason field should start empty'
        ).to.equal('');
      })
      .click(); // open dropdown

    // 2️⃣ Pick a random option between 1 and 7
    cy.get('.ant-select-dropdown')
      .last()
      .find('.ant-select-item-option')
      .its('length')
      .then((total) => {
        const idx = Math.min(7, Cypress._.random(0, total - 1));
        cy.get('.ant-select-dropdown')
          .last()
          .find('.ant-select-item-option')
          .eq(idx)
          .click();
      });

    /* ── Validate recipient‑received amount ───────────────────── */
    cy.get(':nth-child(3) > :nth-child(2) > .ant-typography')
      .invoke('text')
      .then((text) => {
        cy.wrap(text).as('storedText');
        cy.log(text);
      });

    // ─────────────── Confirmation Screens ───────────────
    cy.get('.ant-col > .ant-btn > span').should('be.visible').click();

    cy.get('.ant-modal-body > :nth-child(1) > .ant-col > .ant-typography')
      .should('be.visible')
      .and('contain.text', 'Payment Confirmation');

    cy.get('@storedText').then((storedText) => {
      cy.get(':nth-child(4) > .ant-col-8 > .ant-typography')
        .should('be.visible')
        .and('contain.text', storedText);
    });

    // Pay recipient
    cy.get(
      '.ant-row-center.m-t-20 > .ant-col > .ant-space > :nth-child(2) > .ant-btn'
    )
      .should('be.visible')
      .click();

    cy.get('.ant-modal-body > :nth-child(1) > .ant-col')
      .should('be.visible')
      .and('contain.text', ' Payment Booked - ');

    cy.get('@storedText').then((storedText) => {
      cy.get(':nth-child(5) > .ant-col-8 > .ant-typography')
        .should('be.visible')
        .and('contain.text', storedText);
    })
    })
    it('TC-AC-116 - Verify(business) that if Currency= EUR and Country = UNITED KINGDOM & client = UK and check priority and regular both settlement are enabled and make a payment with GBP using Push Funds',function () {
    // ─────────────── Setup & Recipient Creation ───────────────
       signin.Login(userName, password)
        newRecipient.goToPaymentsDashborad()
        newRecipient.gotoRecipientList()
        let email = batchPayments.generateRandomString(5)+ '@yopmail.com'
        newRecipient.addRecipient('UNITED KINGDOM{enter}' ,'EUR{enter}',email)
        newRecipient.addBankDetails('GB73BARC20039538243547','AFFLGB22')
        newRecipient.addBusinessRecipientCorpay('UNITED KINGDOM{enter}','UK EUR')
        newRecipient.saveRecipient()
        newRecipient.checkSettelmentEnabledBoth('be.enabled','be.enabled')
    // ─────────────── Payment Flow ───────────────
    newPayment.proceedflow('{enter}', 'GBP');
    const amount = '10';
    newPayment.addrecipientDetail(amount, email);
    newPayment.selectFundingMethod('Push Funds');

    /* ── Validate payment‑reason field ───────────────────────── */
    // 1️⃣ Ensure the field starts empty
    cy.get('.ant-select-selector')
      .eq(2)
      .should(($el) => {
        expect(
          $el.text().trim(),
          'reason field should start empty'
        ).to.equal('');
      })
      .click(); // open dropdown

    // 2️⃣ Pick a random option between 1 and 7
    cy.get('.ant-select-dropdown')
      .last()
      .find('.ant-select-item-option')
      .its('length')
      .then((total) => {
        const idx = Math.min(7, Cypress._.random(0, total - 1));
        cy.get('.ant-select-dropdown')
          .last()
          .find('.ant-select-item-option')
          .eq(idx)
          .click();
      });

    /* ── Validate recipient‑received amount ───────────────────── */
    cy.get(':nth-child(3) > :nth-child(2) > .ant-typography')
      .invoke('text')
      .then((text) => {
        cy.wrap(text).as('storedText');
        cy.log(text);
      });

    // ─────────────── Confirmation Screens ───────────────
    cy.get('.ant-col > .ant-btn > span').should('be.visible').click();

    cy.get('.ant-modal-body > :nth-child(1) > .ant-col > .ant-typography')
      .should('be.visible')
      .and('contain.text', 'Payment Confirmation');

    cy.get('@storedText').then((storedText) => {
      cy.get(':nth-child(4) > .ant-col-8 > .ant-typography')
        .should('be.visible')
        .and('contain.text', storedText);
    });

    // Pay recipient
    cy.get(
      '.ant-row-center.m-t-20 > .ant-col > .ant-space > :nth-child(2) > .ant-btn'
    )
      .should('be.visible')
      .click();

    cy.get('.ant-modal-body > :nth-child(1) > .ant-col')
      .should('be.visible')
      .and('contain.text', ' Payment Booked - ');

    cy.get('@storedText').then((storedText) => {
      cy.get(':nth-child(5) > .ant-col-8 > .ant-typography')
        .should('be.visible')
        .and('contain.text', storedText);
    })
    })
    it('TC-AC-117 - Verify(business) that if Currency= EUR and Country = Spain & client = UK and check priority and regular both settlement are enabled and make a payment with GBP using Push Funds',function () {
    // ─────────────── Setup & Recipient Creation ───────────────
       signin.Login(userName, password)
        newRecipient.goToPaymentsDashborad()
        newRecipient.gotoRecipientList()
        let email = batchPayments.generateRandomString(5)+ '@yopmail.com'
        newRecipient.addRecipient('SPain{enter}' ,'EUR{enter}',email)
        newRecipient.addBankDetails('ES7921000813610123456789','CAIXESBBXXX')
        newRecipient.addBusinessRecipientCorpay('Spain{enter}','Spain EUR')
        newRecipient.saveRecipient()
        newRecipient.checkSettelmentEnabledBoth('be.enabled','be.enabled')
    // ─────────────── Payment Flow ───────────────
    newPayment.proceedflow('{enter}', 'GBP');
    const amount = '10';
    newPayment.addrecipientDetail(amount, email);
    newPayment.selectFundingMethod('Push Funds');

    /* ── Validate payment‑reason field ───────────────────────── */
    // 1️⃣ Ensure the field starts empty
    cy.get('.ant-select-selector')
      .eq(2)
      .should(($el) => {
        expect(
          $el.text().trim(),
          'reason field should start empty'
        ).to.equal('');
      })
      .click(); // open dropdown

    // 2️⃣ Pick a random option between 1 and 7
    cy.get('.ant-select-dropdown')
      .last()
      .find('.ant-select-item-option')
      .its('length')
      .then((total) => {
        const idx = Math.min(7, Cypress._.random(0, total - 1));
        cy.get('.ant-select-dropdown')
          .last()
          .find('.ant-select-item-option')
          .eq(idx)
          .click();
      });

    /* ── Validate recipient‑received amount ───────────────────── */
    cy.get(':nth-child(3) > :nth-child(2) > .ant-typography')
      .invoke('text')
      .then((text) => {
        cy.wrap(text).as('storedText');
        cy.log(text);
      });

    // ─────────────── Confirmation Screens ───────────────
    cy.get('.ant-col > .ant-btn > span').should('be.visible').click();

    cy.get('.ant-modal-body > :nth-child(1) > .ant-col > .ant-typography')
      .should('be.visible')
      .and('contain.text', 'Payment Confirmation');

    cy.get('@storedText').then((storedText) => {
      cy.get(':nth-child(4) > .ant-col-8 > .ant-typography')
        .should('be.visible')
        .and('contain.text', storedText);
    });

    // Pay recipient
    cy.get(
      '.ant-row-center.m-t-20 > .ant-col > .ant-space > :nth-child(2) > .ant-btn'
    )
      .should('be.visible')
      .click();

    cy.get('.ant-modal-body > :nth-child(1) > .ant-col')
      .should('be.visible')
      .and('contain.text', ' Payment Booked - ');

    cy.get('@storedText').then((storedText) => {
      cy.get(':nth-child(5) > .ant-col-8 > .ant-typography')
        .should('be.visible')
        .and('contain.text', storedText);
    })
    })
    it('TC-AC-118 - Verify(business) that if Currency= AUD and Country = UNITED KINGDOM & client = UK and check priority settlement is enabled and make a payment with GBP using Push Funds',function () {
    // ─────────────── Setup & Recipient Creation ───────────────
       signin.Login(userName, password)
        newRecipient.goToPaymentsDashborad()
        newRecipient.gotoRecipientList()
        let email = batchPayments.generateRandomString(5)+ '@yopmail.com'
        newRecipient.addRecipient('UNITED KINGDOM{enter}' ,'AUD{enter}',email)
        newRecipient.addBankDetails('GB73BARC20039538243547','AFFLGB22')
        newRecipient.addBusinessRecipientCorpay('UNITED KINGDOM{enter}','UK AUD')
        newRecipient.saveRecipient()
        newRecipient.checkSettelment('be.disabled','be.enabled')
    // ─────────────── Payment Flow ───────────────
    newPayment.proceedflow('{downarrow}{enter}', 'GBP');
    const amount = '10';
    newPayment.addrecipientDetail(amount, email);
    newPayment.selectFundingMethod('Push Funds');

    /* ── Validate payment‑reason field ───────────────────────── */
    // 1️⃣ Ensure the field starts empty
    cy.get('.ant-select-selector')
      .eq(2)
      .should(($el) => {
        expect(
          $el.text().trim(),
          'reason field should start empty'
        ).to.equal('');
      })
      .click(); // open dropdown

    // 2️⃣ Pick a random option between 1 and 7
    cy.get('.ant-select-dropdown')
      .last()
      .find('.ant-select-item-option')
      .its('length')
      .then((total) => {
        const idx = Math.min(7, Cypress._.random(0, total - 1));
        cy.get('.ant-select-dropdown')
          .last()
          .find('.ant-select-item-option')
          .eq(idx)
          .click();
      });

    /* ── Validate recipient‑received amount ───────────────────── */
    cy.get(':nth-child(3) > :nth-child(2) > .ant-typography')
      .invoke('text')
      .then((text) => {
        cy.wrap(text).as('storedText');
        cy.log(text);
      });

    // ─────────────── Confirmation Screens ───────────────
    cy.get('.ant-col > .ant-btn > span').should('be.visible').click();

    cy.get('.ant-modal-body > :nth-child(1) > .ant-col > .ant-typography')
      .should('be.visible')
      .and('contain.text', 'Payment Confirmation');

    cy.get('@storedText').then((storedText) => {
      cy.get(':nth-child(4) > .ant-col-8 > .ant-typography')
        .should('be.visible')
        .and('contain.text', storedText);
    });

    // Pay recipient
    cy.get(
      '.ant-row-center.m-t-20 > .ant-col > .ant-space > :nth-child(2) > .ant-btn'
    )
      .should('be.visible')
      .click();

    cy.get('.ant-modal-body > :nth-child(1) > .ant-col')
      .should('be.visible')
      .and('contain.text', ' Payment Booked - ');

    cy.get('@storedText').then((storedText) => {
      cy.get(':nth-child(5) > .ant-col-8 > .ant-typography')
        .should('be.visible')
        .and('contain.text', storedText);
    })
    })
    it('TC-AC-119 - Verify(business) that if Currency= AUD and Country = Australia & client = UK and check priority and regular both settlement are enabled and make a payment with GBP using Push Funds',function () {
    // ─────────────── Setup & Recipient Creation ───────────────
       signin.Login(userName, password)
        newRecipient.goToPaymentsDashborad()
        newRecipient.gotoRecipientList()
        let email = batchPayments.generateRandomString(5)+ '@yopmail.com'
        newRecipient.addRecipient('Australia{enter}' ,'AUD{enter}',email)
        newRecipient.addBankDetailsWithAccNo('ANZBAU3MXXX','011401533')
        cy.get('#bsb').should('be.visible').type('462541')
        newRecipient.addBusinessRecipientCorpay('Australia{enter}','Australia AUD')
        newRecipient.saveRecipient()
        newRecipient.checkSettelmentEnabledBoth('be.enabled','be.enabled')
    // ─────────────── Payment Flow ───────────────
    newPayment.proceedflow('{downarrow}{enter}', 'GBP');
    const amount = '10';
    newPayment.addrecipientDetail(amount, email);
    newPayment.selectFundingMethod('Push Funds');

    /* ── Validate payment‑reason field ───────────────────────── */
    // 1️⃣ Ensure the field starts empty
    cy.get('.ant-select-selector')
      .eq(2)
      .should(($el) => {
        expect(
          $el.text().trim(),
          'reason field should start empty'
        ).to.equal('');
      })
      .click(); // open dropdown

    // 2️⃣ Pick a random option between 1 and 7
    cy.get('.ant-select-dropdown')
      .last()
      .find('.ant-select-item-option')
      .its('length')
      .then((total) => {
        const idx = Math.min(7, Cypress._.random(0, total - 1));
        cy.get('.ant-select-dropdown')
          .last()
          .find('.ant-select-item-option')
          .eq(idx)
          .click();
      });

    /* ── Validate recipient‑received amount ───────────────────── */
    cy.get(':nth-child(3) > :nth-child(2) > .ant-typography')
      .invoke('text')
      .then((text) => {
        cy.wrap(text).as('storedText');
        cy.log(text);
      });

    // ─────────────── Confirmation Screens ───────────────
    cy.get('.ant-col > .ant-btn > span').should('be.visible').click();

    cy.get('.ant-modal-body > :nth-child(1) > .ant-col > .ant-typography')
      .should('be.visible')
      .and('contain.text', 'Payment Confirmation');

    cy.get('@storedText').then((storedText) => {
      cy.get(':nth-child(4) > .ant-col-8 > .ant-typography')
        .should('be.visible')
        .and('contain.text', storedText);
    });

    // Pay recipient
    cy.get(
      '.ant-row-center.m-t-20 > .ant-col > .ant-space > :nth-child(2) > .ant-btn'
    )
      .should('be.visible')
      .click();

    cy.get('.ant-modal-body > :nth-child(1) > .ant-col')
      .should('be.visible')
      .and('contain.text', ' Payment Booked - ');

    cy.get('@storedText').then((storedText) => {
      cy.get(':nth-child(5) > .ant-col-8 > .ant-typography')
        .should('be.visible')
        .and('contain.text', storedText);
    })
    })
    it('TC-AC-120 - Verify(business) that if Currency= CHF and Country = UNITED KINGDOM & client = UK and check priority settlement is enabled and make a payment with GBP using Push Funds',function () {
    // ─────────────── Setup & Recipient Creation ───────────────
       signin.Login(userName, password)
        newRecipient.goToPaymentsDashborad()
        newRecipient.gotoRecipientList()
        let email = batchPayments.generateRandomString(5)+ '@yopmail.com'
        newRecipient.addRecipient('UNITED KINGDOM{enter}' ,'CHF{enter}',email)
        newRecipient.addBankDetails('GB73BARC20039538243547','AFFLGB22')
        newRecipient.addBusinessRecipientCorpay('UNITED KINGDOM{enter}','UK CHF')
        newRecipient.saveRecipient()
        newRecipient.checkSettelment('be.disabled','be.enabled')
    // ─────────────── Payment Flow ───────────────
    newPayment.proceedflow('{downarrow}{enter}', 'GBP');
    const amount = '10';
    newPayment.addrecipientDetail(amount, email);
    newPayment.selectFundingMethod('Push Funds');

    /* ── Validate payment‑reason field ───────────────────────── */
    // 1️⃣ Ensure the field starts empty
    cy.get('.ant-select-selector')
      .eq(2)
      .should(($el) => {
        expect(
          $el.text().trim(),
          'reason field should start empty'
        ).to.equal('');
      })
      .click(); // open dropdown

    // 2️⃣ Pick a random option between 1 and 7
    cy.get('.ant-select-dropdown')
      .last()
      .find('.ant-select-item-option')
      .its('length')
      .then((total) => {
        const idx = Math.min(7, Cypress._.random(0, total - 1));
        cy.get('.ant-select-dropdown')
          .last()
          .find('.ant-select-item-option')
          .eq(idx)
          .click();
      });

    /* ── Validate recipient‑received amount ───────────────────── */
    cy.get(':nth-child(3) > :nth-child(2) > .ant-typography')
      .invoke('text')
      .then((text) => {
        cy.wrap(text).as('storedText');
        cy.log(text);
      });

    // ─────────────── Confirmation Screens ───────────────
    cy.get('.ant-col > .ant-btn > span').should('be.visible').click();

    cy.get('.ant-modal-body > :nth-child(1) > .ant-col > .ant-typography')
      .should('be.visible')
      .and('contain.text', 'Payment Confirmation');

    cy.get('@storedText').then((storedText) => {
      cy.get(':nth-child(4) > .ant-col-8 > .ant-typography')
        .should('be.visible')
        .and('contain.text', storedText);
    });

    // Pay recipient
    cy.get(
      '.ant-row-center.m-t-20 > .ant-col > .ant-space > :nth-child(2) > .ant-btn'
    )
      .should('be.visible')
      .click();

    cy.get('.ant-modal-body > :nth-child(1) > .ant-col')
      .should('be.visible')
      .and('contain.text', ' Payment Booked - ');

    cy.get('@storedText').then((storedText) => {
      cy.get(':nth-child(5) > .ant-col-8 > .ant-typography')
        .should('be.visible')
        .and('contain.text', storedText);
    })
    })
    it('TC-AC-121 - Verify(business) that if Currency= CHF and Country = Switzerland & client = UK and check priority settlement is enabled and make a payment with GBP using Push Funds',function () {
    // ─────────────── Setup & Recipient Creation ───────────────
       signin.Login(userName, password)
        newRecipient.goToPaymentsDashborad()
        newRecipient.gotoRecipientList()
        let email = batchPayments.generateRandomString(5)+ '@yopmail.com'
        newRecipient.addRecipient('Switzerland{enter}' ,'CHF{enter}',email)
        newRecipient.addBankDetails('CH5604835012345678009','UBSWCHZH80A')
        newRecipient.addBusinessRecipientCorpay('Switzerland{enter}','Switzerland CHF')
        newRecipient.saveRecipient()
        newRecipient.checkSettelment('be.disabled','be.enabled')
    // ─────────────── Payment Flow ───────────────
    newPayment.proceedflow('{downarrow}{enter}', 'GBP');
    const amount = '10';
    newPayment.addrecipientDetail(amount, email);
    newPayment.selectFundingMethod('Push Funds');

    /* ── Validate payment‑reason field ───────────────────────── */
    // 1️⃣ Ensure the field starts empty
    cy.get('.ant-select-selector')
      .eq(2)
      .should(($el) => {
        expect(
          $el.text().trim(),
          'reason field should start empty'
        ).to.equal('');
      })
      .click(); // open dropdown

    // 2️⃣ Pick a random option between 1 and 7
    cy.get('.ant-select-dropdown')
      .last()
      .find('.ant-select-item-option')
      .its('length')
      .then((total) => {
        const idx = Math.min(7, Cypress._.random(0, total - 1));
        cy.get('.ant-select-dropdown')
          .last()
          .find('.ant-select-item-option')
          .eq(idx)
          .click();
      });

    /* ── Validate recipient‑received amount ───────────────────── */
    cy.get(':nth-child(3) > :nth-child(2) > .ant-typography')
      .invoke('text')
      .then((text) => {
        cy.wrap(text).as('storedText');
        cy.log(text);
      });

    // ─────────────── Confirmation Screens ───────────────
    cy.get('.ant-col > .ant-btn > span').should('be.visible').click();

    cy.get('.ant-modal-body > :nth-child(1) > .ant-col > .ant-typography')
      .should('be.visible')
      .and('contain.text', 'Payment Confirmation');

    cy.get('@storedText').then((storedText) => {
      cy.get(':nth-child(4) > .ant-col-8 > .ant-typography')
        .should('be.visible')
        .and('contain.text', storedText);
    });

    // Pay recipient
    cy.get(
      '.ant-row-center.m-t-20 > .ant-col > .ant-space > :nth-child(2) > .ant-btn'
    )
      .should('be.visible')
      .click();

    cy.get('.ant-modal-body > :nth-child(1) > .ant-col')
      .should('be.visible')
      .and('contain.text', ' Payment Booked - ');

    cy.get('@storedText').then((storedText) => {
      cy.get(':nth-child(5) > .ant-col-8 > .ant-typography')
        .should('be.visible')
        .and('contain.text', storedText);
    })
    })
    it('TC-AC-122 - Verify(business) that if Currency= THB and Country = UNITED KINGDOM & client = UK and check priority settlement is enabled and make a payment with GBP using Push Funds',function () {
    // ─────────────── Setup & Recipient Creation ───────────────
       signin.Login(userName, password)
        newRecipient.goToPaymentsDashborad()
        newRecipient.gotoRecipientList()
        let email = batchPayments.generateRandomString(5)+ '@yopmail.com'
        newRecipient.addRecipient('UNITED KINGDOM{enter}' ,'THB{enter}',email)
        newRecipient.addBankDetails('GB73BARC20039538243547','AFFLGB22')
        newRecipient.addBusinessRecipientCorpay('UNITED KINGDOM{enter}','UK THB')
        newRecipient.saveRecipient()
        newRecipient.checkSettelment('be.disabled','be.enabled')
    // ─────────────── Payment Flow ───────────────
    newPayment.proceedflow('{downarrow}{enter}', 'GBP');
    const amount = '10';
    newPayment.addrecipientDetail(amount, email);
    newPayment.selectFundingMethod('Push Funds');

    /* ── Validate payment‑reason field ───────────────────────── */
    // 1️⃣ Ensure the field starts empty
    cy.get('.ant-select-selector')
      .eq(2)
      .should(($el) => {
        expect(
          $el.text().trim(),
          'reason field should start empty'
        ).to.equal('');
      })
      .click(); // open dropdown

    // 2️⃣ Pick a random option between 1 and 7
    cy.get('.ant-select-dropdown')
      .last()
      .find('.ant-select-item-option')
      .its('length')
      .then((total) => {
        const idx = Math.min(7, Cypress._.random(0, total - 1));
        cy.get('.ant-select-dropdown')
          .last()
          .find('.ant-select-item-option')
          .eq(idx)
          .click();
      });

    /* ── Validate recipient‑received amount ───────────────────── */
    cy.get(':nth-child(3) > :nth-child(2) > .ant-typography')
      .invoke('text')
      .then((text) => {
        cy.wrap(text).as('storedText');
        cy.log(text);
      });

    // ─────────────── Confirmation Screens ───────────────
    cy.get('.ant-col > .ant-btn > span').should('be.visible').click();

    cy.get('.ant-modal-body > :nth-child(1) > .ant-col > .ant-typography')
      .should('be.visible')
      .and('contain.text', 'Payment Confirmation');

    cy.get('@storedText').then((storedText) => {
      cy.get(':nth-child(4) > .ant-col-8 > .ant-typography')
        .should('be.visible')
        .and('contain.text', storedText);
    });

    // Pay recipient
    cy.get(
      '.ant-row-center.m-t-20 > .ant-col > .ant-space > :nth-child(2) > .ant-btn'
    )
      .should('be.visible')
      .click();

    cy.get('.ant-modal-body > :nth-child(1) > .ant-col')
      .should('be.visible')
      .and('contain.text', ' Payment Booked - ');

    cy.get('@storedText').then((storedText) => {
      cy.get(':nth-child(5) > .ant-col-8 > .ant-typography')
        .should('be.visible')
        .and('contain.text', storedText);
    })
    })
    it('TC-AC-123 - Verify(business) that if Currency= THB and Country = Thailand & client = UK and check priority settlement is enabled and make a payment with GBP using Push Funds',function () {
    // ─────────────── Setup & Recipient Creation ───────────────
       signin.Login(userName, password)
        newRecipient.goToPaymentsDashborad()
        newRecipient.gotoRecipientList()
        let email = batchPayments.generateRandomString(5)+ '@yopmail.com'
        newRecipient.addRecipient('Thailand{enter}' ,'THB{enter}',email)
        newRecipient.addBankDetailsWithAccNo('BKKBTHBK','0114015331')
        newRecipient.addBusinessRecipientCorpay('Thailand{enter}','Thailand THB')
        newRecipient.saveRecipient()
        newRecipient.checkSettelment('be.disabled','be.enabled')
    // ─────────────── Payment Flow ───────────────
    newPayment.proceedflow('{downarrow}{enter}', 'GBP');
    const amount = '10';
    newPayment.addrecipientDetail(amount, email);
    newPayment.selectFundingMethod('Push Funds');

    /* ── Validate payment‑reason field ───────────────────────── */
    // 1️⃣ Ensure the field starts empty
    cy.get('.ant-select-selector')
      .eq(2)
      .should(($el) => {
        expect(
          $el.text().trim(),
          'reason field should start empty'
        ).to.equal('');
      })
      .click(); // open dropdown

    // 2️⃣ Pick a random option between 1 and 7
    cy.get('.ant-select-dropdown')
      .last()
      .find('.ant-select-item-option')
      .its('length')
      .then((total) => {
        const idx = Math.min(7, Cypress._.random(0, total - 1));
        cy.get('.ant-select-dropdown')
          .last()
          .find('.ant-select-item-option')
          .eq(idx)
          .click();
      });

    /* ── Validate recipient‑received amount ───────────────────── */
    cy.get(':nth-child(3) > :nth-child(2) > .ant-typography')
      .invoke('text')
      .then((text) => {
        cy.wrap(text).as('storedText');
        cy.log(text);
      });

    // ─────────────── Confirmation Screens ───────────────
    cy.get('.ant-col > .ant-btn > span').should('be.visible').click();

    cy.get('.ant-modal-body > :nth-child(1) > .ant-col > .ant-typography')
      .should('be.visible')
      .and('contain.text', 'Payment Confirmation');

    cy.get('@storedText').then((storedText) => {
      cy.get(':nth-child(4) > .ant-col-8 > .ant-typography')
        .should('be.visible')
        .and('contain.text', storedText);
    });

    // Pay recipient
    cy.get(
      '.ant-row-center.m-t-20 > .ant-col > .ant-space > :nth-child(2) > .ant-btn'
    )
      .should('be.visible')
      .click();

    cy.get('.ant-modal-body > :nth-child(1) > .ant-col')
      .should('be.visible')
      .and('contain.text', ' Payment Booked - ');

    cy.get('@storedText').then((storedText) => {
      cy.get(':nth-child(5) > .ant-col-8 > .ant-typography')
        .should('be.visible')
        .and('contain.text', storedText);
    })
    })
    it('TC-AC-124 - Verify(business) that if Currency= HKD and Country = UNITED KINGDOM & client = UK and check priority settlement is enabled and make a payment with GBP using Push Funds',function () {
    // ─────────────── Setup & Recipient Creation ───────────────
       signin.Login(userName, password)
        newRecipient.goToPaymentsDashborad()
        newRecipient.gotoRecipientList()
        let email = batchPayments.generateRandomString(5)+ '@yopmail.com'
        newRecipient.addRecipient('UNITED KINGDOM{enter}' ,'HKD{enter}',email)
        newRecipient.addBankDetails('GB73BARC20039538243547','AFFLGB22')
        newRecipient.addBusinessRecipientCorpay('UNITED KINGDOM{enter}','UK HKD')
        newRecipient.saveRecipient()
        newRecipient.checkSettelment('be.disabled','be.enabled')
    // ─────────────── Payment Flow ───────────────
    newPayment.proceedflow('{downarrow}{enter}', 'GBP');
    const amount = '10';
    newPayment.addrecipientDetail(amount, email);
    newPayment.selectFundingMethod('Push Funds');

    /* ── Validate payment‑reason field ───────────────────────── */
    // 1️⃣ Ensure the field starts empty
    cy.get('.ant-select-selector')
      .eq(2)
      .should(($el) => {
        expect(
          $el.text().trim(),
          'reason field should start empty'
        ).to.equal('');
      })
      .click(); // open dropdown

    // 2️⃣ Pick a random option between 1 and 7
    cy.get('.ant-select-dropdown')
      .last()
      .find('.ant-select-item-option')
      .its('length')
      .then((total) => {
        const idx = Math.min(7, Cypress._.random(0, total - 1));
        cy.get('.ant-select-dropdown')
          .last()
          .find('.ant-select-item-option')
          .eq(idx)
          .click();
      });

    /* ── Validate recipient‑received amount ───────────────────── */
    cy.get(':nth-child(3) > :nth-child(2) > .ant-typography')
      .invoke('text')
      .then((text) => {
        cy.wrap(text).as('storedText');
        cy.log(text);
      });

    // ─────────────── Confirmation Screens ───────────────
    cy.get('.ant-col > .ant-btn > span').should('be.visible').click();

    cy.get('.ant-modal-body > :nth-child(1) > .ant-col > .ant-typography')
      .should('be.visible')
      .and('contain.text', 'Payment Confirmation');

    cy.get('@storedText').then((storedText) => {
      cy.get(':nth-child(4) > .ant-col-8 > .ant-typography')
        .should('be.visible')
        .and('contain.text', storedText);
    });

    // Pay recipient
    cy.get(
      '.ant-row-center.m-t-20 > .ant-col > .ant-space > :nth-child(2) > .ant-btn'
    )
      .should('be.visible')
      .click();

    cy.get('.ant-modal-body > :nth-child(1) > .ant-col')
      .should('be.visible')
      .and('contain.text', ' Payment Booked - ');

    cy.get('@storedText').then((storedText) => {
      cy.get(':nth-child(5) > .ant-col-8 > .ant-typography')
        .should('be.visible')
        .and('contain.text', storedText);
    })
    })
    it('TC-AC-125 - Verify(business) that if Currency= HKD and Country = Hong Kong & client = UK and check priority settlement is enabled and make a payment with GBP using Push Funds',function () {
    // ─────────────── Setup & Recipient Creation ───────────────
       signin.Login(userName, password)
        newRecipient.goToPaymentsDashborad()
        newRecipient.gotoRecipientList()
        let email = batchPayments.generateRandomString(5)+ '@yopmail.com'
        newRecipient.addRecipient('Hong Kong{enter}' ,'HKD{enter}',email)
        newRecipient.addBankDetailsWithAccNo('HSBCHKHHHKH','0114015331')
        newRecipient.addBusinessRecipientCorpay('Hong Kong{enter}','Hong Kong HKD')
        newRecipient.saveRecipient()
        newRecipient.checkSettelment('be.disabled','be.enabled')
    // ─────────────── Payment Flow ───────────────
    newPayment.proceedflow('{downarrow}{enter}', 'GBP');
    const amount = '10';
    newPayment.addrecipientDetail(amount, email);
    newPayment.selectFundingMethod('Push Funds');

    /* ── Validate payment‑reason field ───────────────────────── */
    // 1️⃣ Ensure the field starts empty
    cy.get('.ant-select-selector')
      .eq(2)
      .should(($el) => {
        expect(
          $el.text().trim(),
          'reason field should start empty'
        ).to.equal('');
      })
      .click(); // open dropdown

    // 2️⃣ Pick a random option between 1 and 7
    cy.get('.ant-select-dropdown')
      .last()
      .find('.ant-select-item-option')
      .its('length')
      .then((total) => {
        const idx = Math.min(7, Cypress._.random(0, total - 1));
        cy.get('.ant-select-dropdown')
          .last()
          .find('.ant-select-item-option')
          .eq(idx)
          .click();
      });

    /* ── Validate recipient‑received amount ───────────────────── */
    cy.get(':nth-child(3) > :nth-child(2) > .ant-typography')
      .invoke('text')
      .then((text) => {
        cy.wrap(text).as('storedText');
        cy.log(text);
      });

    // ─────────────── Confirmation Screens ───────────────
    cy.get('.ant-col > .ant-btn > span').should('be.visible').click();

    cy.get('.ant-modal-body > :nth-child(1) > .ant-col > .ant-typography')
      .should('be.visible')
      .and('contain.text', 'Payment Confirmation');

    cy.get('@storedText').then((storedText) => {
      cy.get(':nth-child(4) > .ant-col-8 > .ant-typography')
        .should('be.visible')
        .and('contain.text', storedText);
    });

    // Pay recipient
    cy.get(
      '.ant-row-center.m-t-20 > .ant-col > .ant-space > :nth-child(2) > .ant-btn'
    )
      .should('be.visible')
      .click();

    cy.get('.ant-modal-body > :nth-child(1) > .ant-col')
      .should('be.visible')
      .and('contain.text', ' Payment Booked - ');

    cy.get('@storedText').then((storedText) => {
      cy.get(':nth-child(5) > .ant-col-8 > .ant-typography')
        .should('be.visible')
        .and('contain.text', storedText);
    })
    })
    it('TC-AC-126 - Verify(business) that if Currency= GBP and Country = UNITED KINGDOM & client = UK and check priority and regular both  settlement are enabled and make a payment with EUR using Push Funds',function () {
    // ─────────────── Setup & Recipient Creation ───────────────
       signin.Login(userName, password)
        newRecipient.goToPaymentsDashborad()
        newRecipient.gotoRecipientList()
        let email = batchPayments.generateRandomString(5)+ '@yopmail.com'
        newRecipient.addRecipient('UNITED KINGDOM{enter}' ,'GBP{enter}',email)
        newRecipient.addBankDetails('GB73BARC20039538243547','AFFLGB22')
        cy.get('#sortCode').should('be.visible').type('401276')
        cy.get('#accNumber').should('be.visible').type('56974456')
        newRecipient.addBusinessRecipientCorpay('UNITED KINGDOM{enter}','UK GBP')
        newRecipient.saveRecipient()
        newRecipient.checkSettelmentEnabledBoth('be.enabled','be.enabled')
    // ─────────────── Payment Flow ───────────────
    newPayment.proceedflow('{enter}', 'EUR');
    const amount = '10';
    newPayment.addrecipientDetail(amount, email);
    newPayment.selectFundingMethod('Push Funds');

    /* ── Validate payment‑reason field ───────────────────────── */
    // 1️⃣ Ensure the field starts empty
    cy.get('.ant-select-selector')
      .eq(2)
      .should(($el) => {
        expect(
          $el.text().trim(),
          'reason field should start empty'
        ).to.equal('');
      })
      .click(); // open dropdown

    // 2️⃣ Pick a random option between 1 and 7
    cy.get('.ant-select-dropdown')
      .last()
      .find('.ant-select-item-option')
      .its('length')
      .then((total) => {
        const idx = Math.min(7, Cypress._.random(0, total - 1));
        cy.get('.ant-select-dropdown')
          .last()
          .find('.ant-select-item-option')
          .eq(idx)
          .click();
      });

    /* ── Validate recipient‑received amount ───────────────────── */
    cy.get(':nth-child(3) > :nth-child(2) > .ant-typography')
      .invoke('text')
      .then((text) => {
        cy.wrap(text).as('storedText');
        cy.log(text);
      });

    // ─────────────── Confirmation Screens ───────────────
    cy.get('.ant-col > .ant-btn > span').should('be.visible').click();

    cy.get('.ant-modal-body > :nth-child(1) > .ant-col > .ant-typography')
      .should('be.visible')
      .and('contain.text', 'Payment Confirmation');

    cy.get('@storedText').then((storedText) => {
      cy.get(':nth-child(4) > .ant-col-8 > .ant-typography')
        .should('be.visible')
        .and('contain.text', storedText);
    });

    // Pay recipient
    cy.get(
      '.ant-row-center.m-t-20 > .ant-col > .ant-space > :nth-child(2) > .ant-btn'
    )
      .should('be.visible')
      .click();

    cy.get('.ant-modal-body > :nth-child(1) > .ant-col')
      .should('be.visible')
      .and('contain.text', ' Payment Booked - ');

    cy.get('@storedText').then((storedText) => {
      cy.get(':nth-child(5) > .ant-col-8 > .ant-typography')
        .should('be.visible')
        .and('contain.text', storedText);
    })
    })
    it('TC-AC-127 - Verify(business) that if Currency= GBP and Country = UNITED KINGDOM & client = UK and check priority settlement is enabled and make a payment with EUR using Push Funds',function () {
    // ─────────────── Setup & Recipient Creation ───────────────
       signin.Login(userName, password)
        newRecipient.goToPaymentsDashborad()
        newRecipient.gotoRecipientList()
        let email = batchPayments.generateRandomString(5)+ '@yopmail.com'
        newRecipient.addRecipient('UNITED KINGDOM{enter}' ,'GBP{enter}',email)
        newRecipient.addBankDetails('GB73BARC20039538243547','AFFLGB22')
        cy.get('#sortCode').should('be.visible').type('401276')
        newRecipient.addBusinessRecipientCorpay('UNITED KINGDOM{enter}','UK GBP Priority')
        newRecipient.saveRecipient()
        newRecipient.checkSettelment('be.disabled','be.enabled')
    // ─────────────── Payment Flow ───────────────
    newPayment.proceedflow('{enter}', 'EUR');
    const amount = '10';
    newPayment.addrecipientDetail(amount, email);
    newPayment.selectFundingMethod('Push Funds');

    /* ── Validate payment‑reason field ───────────────────────── */
    // 1️⃣ Ensure the field starts empty
    cy.get('.ant-select-selector')
      .eq(2)
      .should(($el) => {
        expect(
          $el.text().trim(),
          'reason field should start empty'
        ).to.equal('');
      })
      .click(); // open dropdown

    // 2️⃣ Pick a random option between 1 and 7
    cy.get('.ant-select-dropdown')
      .last()
      .find('.ant-select-item-option')
      .its('length')
      .then((total) => {
        const idx = Math.min(7, Cypress._.random(0, total - 1));
        cy.get('.ant-select-dropdown')
          .last()
          .find('.ant-select-item-option')
          .eq(idx)
          .click();
      });

    /* ── Validate recipient‑received amount ───────────────────── */
    cy.get(':nth-child(3) > :nth-child(2) > .ant-typography')
      .invoke('text')
      .then((text) => {
        cy.wrap(text).as('storedText');
        cy.log(text);
      });

    // ─────────────── Confirmation Screens ───────────────
    cy.get('.ant-col > .ant-btn > span').should('be.visible').click();

    cy.get('.ant-modal-body > :nth-child(1) > .ant-col > .ant-typography')
      .should('be.visible')
      .and('contain.text', 'Payment Confirmation');

    cy.get('@storedText').then((storedText) => {
      cy.get(':nth-child(4) > .ant-col-8 > .ant-typography')
        .should('be.visible')
        .and('contain.text', storedText);
    });

    // Pay recipient
    cy.get(
      '.ant-row-center.m-t-20 > .ant-col > .ant-space > :nth-child(2) > .ant-btn'
    )
      .should('be.visible')
      .click();

    cy.get('.ant-modal-body > :nth-child(1) > .ant-col')
      .should('be.visible')
      .and('contain.text', ' Payment Booked - ');

    cy.get('@storedText').then((storedText) => {
      cy.get(':nth-child(5) > .ant-col-8 > .ant-typography')
        .should('be.visible')
        .and('contain.text', storedText);
    })
    })
    it('TC-AC-128 - Verify(business) that if Currency= CNY and Country = China & client = UK and check priority settlement is enabled and make a payment with EUR using Push Funds',function () {
    // ─────────────── Setup & Recipient Creation ───────────────
       signin.Login(userName, password)
    newRecipient.goToPaymentsDashborad()
    newRecipient.gotoRecipientList()
    let email = batchPayments.generateRandomString(5)+ '@yopmail.com'
    newRecipient.addRecipient('China{enter}' ,'CNY{enter}',email)
    newRecipient.addBankDetailsChina('AFFLGB22','55555555','103100000026')
    newRecipient.BusinessCNY('CNY china Business','China{enter}')
    newRecipient.saveRecipient()
    newRecipient.checkSettelment('be.disabled','be.enabled')
    // ─────────────── Payment Flow ───────────────
    newPayment.proceedflow('{enter}', 'EUR');
    const amount = '10';
    newPayment.addrecipientDetail(amount, email);
    newPayment.selectFundingMethod('Push Funds');

    /* ── Validate payment‑reason field ───────────────────────── */
    // 1️⃣ Ensure the field starts empty
    cy.get('.ant-select-selector')
      .eq(2)
      .should(($el) => {
        expect(
          $el.text().trim(),
          'reason field should start empty'
        ).to.equal('');
      })
      .click(); // open dropdown

    // 2️⃣ Pick a random option between 1 and 7
    cy.get('.ant-select-dropdown')
      .last()
      .find('.ant-select-item-option')
      .its('length')
      .then((total) => {
        const idx = Math.min(7, Cypress._.random(0, total - 1));
        cy.get('.ant-select-dropdown')
          .last()
          .find('.ant-select-item-option')
          .eq(idx)
          .click();
      });

    /* ── Validate recipient‑received amount ───────────────────── */
    cy.get(':nth-child(3) > :nth-child(2) > .ant-typography')
      .invoke('text')
      .then((text) => {
        cy.wrap(text).as('storedText');
        cy.log(text);
      });

    // ─────────────── Confirmation Screens ───────────────
    cy.get('.ant-col > .ant-btn > span').should('be.visible').click();

    cy.get('.ant-modal-body > :nth-child(1) > .ant-col > .ant-typography')
      .should('be.visible')
      .and('contain.text', 'Payment Confirmation');

    cy.get('@storedText').then((storedText) => {
      cy.get(':nth-child(4) > .ant-col-8 > .ant-typography')
        .should('be.visible')
        .and('contain.text', storedText);
    });

    // Pay recipient
    cy.get(
      '.ant-row-center.m-t-20 > .ant-col > .ant-space > :nth-child(2) > .ant-btn'
    )
      .should('be.visible')
      .click();

    cy.get('.ant-modal-body > :nth-child(1) > .ant-col')
      .should('be.visible')
      .and('contain.text', ' Payment Booked - ');

    cy.get('@storedText').then((storedText) => {
      cy.get(':nth-child(5) > .ant-col-8 > .ant-typography')
        .should('be.visible')
        .and('contain.text', storedText);
    })
    })

    //Additional cases for countries/currencies required special POP
    it('TC-AC-031 - Verify that if Currency= USD and Country = UNITED ARAB EMIRATES & client = UK and check priority settlement is enabled and make a payment with GBP using Push Funds',function () {
    // ─────────────── Setup & Recipient Creation ───────────────
        signin.Login(userName, password)
        newRecipient.goToPaymentsDashborad()
        newRecipient.gotoRecipientList()
        let email = batchPayments.generateRandomString(5)+ '@yopmail.com'
        newRecipient.addRecipient('UNITED ARAB EMIRATES{enter}' ,'USD{enter}',email)
        newRecipient.addBankDetails('AE070331234567890123456','AARPAEAA')
        newRecipient.individualRecipient('United Arab Emirates USD','UNITED ARAB EMIRATES{enter}')
        newRecipient.saveRecipient()
        newRecipient.checkSettelment('be.disabled','be.enabled')

    // ─────────────── Payment Flow ───────────────
    newPayment.proceedflow('{downarrow}{enter}', 'GBP');
    const amount = '10';
    newPayment.addrecipientDetail(amount, email);
    newPayment.selectFundingMethod('Push Funds');

    /* ── Validate payment‑reason field ───────────────────────── */
    // 1️⃣ Ensure the field starts empty
    cy.get('.ant-select-selector')
      .eq(2)
      .should(($el) => {
        expect(
          $el.text().trim(),
          'reason field should start empty'
        ).to.equal('');
      })
      .click(); // open dropdown

    // 2️⃣ Pick a random option between 1 and 10
    cy.get('.ant-select-dropdown')
      .last()
      .find('.ant-select-item-option')
      .its('length')
      .then((total) => {
        const idx = Math.min(7, Cypress._.random(0, total - 1));
        cy.get('.ant-select-dropdown')
          .last()
          .find('.ant-select-item-option')
          .eq(idx)
          .click();
      });

    /* ── Validate recipient‑received amount ───────────────────── */
    cy.get(':nth-child(3) > :nth-child(2) > .ant-typography')
      .invoke('text')
      .then((text) => {
        cy.wrap(text).as('storedText');
        cy.log(text);
      });

    // ─────────────── Confirmation Screens ───────────────
    cy.get('.ant-col > .ant-btn > span').should('be.visible').click();

    cy.get('.ant-modal-body > :nth-child(1) > .ant-col > .ant-typography')
      .should('be.visible')
      .and('contain.text', 'Payment Confirmation');

    cy.get('@storedText').then((storedText) => {
      cy.get(':nth-child(4) > .ant-col-8 > .ant-typography')
        .should('be.visible')
        .and('contain.text', storedText);
    });

    // Pay recipient
    cy.get(
      '.ant-row-center.m-t-20 > .ant-col > .ant-space > :nth-child(2) > .ant-btn'
    )
      .should('be.visible')
      .click();

    cy.get('.ant-modal-body > :nth-child(1) > .ant-col')
      .should('be.visible')
      .and('contain.text', ' Payment Booked - ');

    cy.get('@storedText').then((storedText) => {
      cy.get(':nth-child(5) > .ant-col-8 > .ant-typography')
        .should('be.visible')
        .and('contain.text', storedText);
    })
    })
    //it is failing requesting the routing code in this case
    it('TC-AC-025 - Verify that if Currency= USD and Country = INDIA & client = UK and check priority settlement is enabled and make a payment with GBP using Push Funds',function () {
    // ─────────────── Setup & Recipient Creation ───────────────
        signin.Login(userName, password)
        newRecipient.goToPaymentsDashborad()
        newRecipient.gotoRecipientList()
        let email = batchPayments.generateRandomString(5)+ '@yopmail.com'
        newRecipient.addRecipient('India{downarrow}{enter}' ,'USD{enter}',email)
        newRecipient.addBankDetailsWithAccNo('AFRIKENX','049712')
        // cy.get('#bankBranch').type('city branch')
        newRecipient.individualRecipient('India USD','india{downarrow}{enter}')
        newRecipient.saveRecipient()
        newRecipient.checkSettelment('be.disabled','be.enabled')

    // ─────────────── Payment Flow ───────────────
    newPayment.proceedflow('{downarrow}{enter}', 'GBP');
    const amount = '10';
    newPayment.addrecipientDetail(amount, email);
    newPayment.selectFundingMethod('Push Funds');

    /* ── Validate payment‑reason field ───────────────────────── */
    // 1️⃣ Ensure the field starts empty
    cy.get('.ant-select-selector')
      .eq(2)
      .should(($el) => {
        expect(
          $el.text().trim(),
          'reason field should start empty'
        ).to.equal('');
      })
      .click(); // open dropdown

    // 2️⃣ Pick a random option between 1 and 10
    cy.get('.ant-select-dropdown')
      .last()
      .find('.ant-select-item-option')
      .its('length')
      .then((total) => {
        const idx = Math.min(7, Cypress._.random(0, total - 1));
        cy.get('.ant-select-dropdown')
          .last()
          .find('.ant-select-item-option')
          .eq(idx)
          .click();
      });

    /* ── Validate recipient‑received amount ───────────────────── */
    cy.get(':nth-child(3) > :nth-child(2) > .ant-typography')
      .invoke('text')
      .then((text) => {
        cy.wrap(text).as('storedText');
        cy.log(text);
      });

    // ─────────────── Confirmation Screens ───────────────
    cy.get('.ant-col > .ant-btn > span').should('be.visible').click();

    cy.get('.ant-modal-body > :nth-child(1) > .ant-col > .ant-typography')
      .should('be.visible')
      .and('contain.text', 'Payment Confirmation');

    cy.get('@storedText').then((storedText) => {
      cy.get(':nth-child(4) > .ant-col-8 > .ant-typography')
        .should('be.visible')
        .and('contain.text', storedText);
    });

    // Pay recipient
    cy.get(
      '.ant-row-center.m-t-20 > .ant-col > .ant-space > :nth-child(2) > .ant-btn'
    )
      .should('be.visible')
      .click();

    cy.get('.ant-modal-body > :nth-child(1) > .ant-col')
      .should('be.visible')
      .and('contain.text', ' Payment Booked - ');

    cy.get('@storedText').then((storedText) => {
      cy.get(':nth-child(5) > .ant-col-8 > .ant-typography')
        .should('be.visible')
        .and('contain.text', storedText);
    })
    })

    it('TC-AC-001 - Verify that if Currency= USD and Country = Bahrain & client = UK and check priority settlement is enabled and make a payment with GBP using Push Funds',function () {
    // ─────────────── Setup & Recipient Creation ───────────────
    signin.Login(userName, password);

    newRecipient.goToPaymentsDashborad();
    newRecipient.gotoRecipientList();

    const email = batchPayments.generateRandomString(5) + '@yopmail.com';
    newRecipient.addRecipient('Bahrain{enter}', 'USD{enter}', email);
    newRecipient.addBankDetails('BH02CITI00001077181611', 'CITIBHBXXXX');
    newRecipient.individualRecipient('Bahrain USD', 'Bahrain{enter}');
    newRecipient.saveRecipient();
    newRecipient.checkSettelment('be.disabled', 'be.enabled');

    // ─────────────── Payment Flow ───────────────
    newPayment.proceedflow('{downarrow}{enter}', 'GBP');
    const amount = '10';
    newPayment.addrecipientDetail(amount, email);
    newPayment.selectFundingMethod('Push Funds');

    /* ── Validate payment‑reason field ───────────────────────── */
    // 1️⃣ Ensure the field starts empty
    cy.get('.ant-select-selector')
      .eq(2)
      .should(($el) => {
        expect(
          $el.text().trim(),
          'reason field should start empty'
        ).to.equal('');
      })
      .click(); // open dropdown

    // 2️⃣ Pick a random option between 1 and 7
    cy.get('.ant-select-dropdown')
      .last()
      .find('.ant-select-item-option')
      .its('length')
      .then((total) => {
        const idx = Math.min(7, Cypress._.random(0, total - 1));
        cy.get('.ant-select-dropdown')
          .last()
          .find('.ant-select-item-option')
          .eq(idx)
          .click();
      });

    /* ── Validate recipient‑received amount ───────────────────── */
    cy.get(':nth-child(3) > :nth-child(2) > .ant-typography')
      .invoke('text')
      .then((text) => {
        cy.wrap(text).as('storedText');
        cy.log(text);
      });

    // ─────────────── Confirmation Screens ───────────────
    cy.get('.ant-col > .ant-btn > span').should('be.visible').click();

    cy.get('.ant-modal-body > :nth-child(1) > .ant-col > .ant-typography')
      .should('be.visible')
      .and('contain.text', 'Payment Confirmation');

    cy.get('@storedText').then((storedText) => {
      cy.get(':nth-child(4) > .ant-col-8 > .ant-typography')
        .should('be.visible')
        .and('contain.text', storedText);
    });

    // Pay recipient
    cy.get(
      '.ant-row-center.m-t-20 > .ant-col > .ant-space > :nth-child(2) > .ant-btn'
    )
      .should('be.visible')
      .click();

    cy.get('.ant-modal-body > :nth-child(1) > .ant-col')
      .should('be.visible')
      .and('contain.text', ' Payment Booked - ');

    cy.get('@storedText').then((storedText) => {
      cy.get(':nth-child(5) > .ant-col-8 > .ant-typography')
        .should('be.visible')
        .and('contain.text', storedText);
    })
    })
    it('TC-AC-025 - Verify that if Currency= USD and Country = China & client = UK and check priority settlement is enabled and make a payment with GBP using Push Funds',function () {
    // ─────────────── Setup & Recipient Creation ───────────────
        signin.Login(userName, password)
        newRecipient.goToPaymentsDashborad()
        newRecipient.gotoRecipientList()
        let email = batchPayments.generateRandomString(5)+ '@yopmail.com'
        newRecipient.addRecipient('China{enter}' ,'USD{enter}',email)
        newRecipient.addBankDetailsWithAccNo('AFFLGB22','049712')
        // cy.get('#bankBranch').type('city branch')
        newRecipient.individualRecipient('China USD','China{enter}')
        newRecipient.saveRecipient()
        newRecipient.checkSettelment('be.disabled','be.enabled')

    // ─────────────── Payment Flow ───────────────
    newPayment.proceedflow('{downarrow}{enter}', 'GBP');
    const amount = '10';
    newPayment.addrecipientDetail(amount, email);
    newPayment.selectFundingMethod('Push Funds');

    /* ── Validate payment‑reason field ───────────────────────── */
    // 1️⃣ Ensure the field starts empty
    cy.get('.ant-select-selector')
      .eq(2)
      .should(($el) => {
        expect(
          $el.text().trim(),
          'reason field should start empty'
        ).to.equal('');
      })
      .click(); // open dropdown

    // 2️⃣ Pick a random option between 1 and 10
    cy.get('.ant-select-dropdown')
      .last()
      .find('.ant-select-item-option')
      .its('length')
      .then((total) => {
        const idx = Math.min(7, Cypress._.random(0, total - 1));
        cy.get('.ant-select-dropdown')
          .last()
          .find('.ant-select-item-option')
          .eq(idx)
          .click();
      });

    /* ── Validate recipient‑received amount ───────────────────── */
    cy.get(':nth-child(3) > :nth-child(2) > .ant-typography')
      .invoke('text')
      .then((text) => {
        cy.wrap(text).as('storedText');
        cy.log(text);
      });

    // ─────────────── Confirmation Screens ───────────────
    cy.get('.ant-col > .ant-btn > span').should('be.visible').click();

    cy.get('.ant-modal-body > :nth-child(1) > .ant-col > .ant-typography')
      .should('be.visible')
      .and('contain.text', 'Payment Confirmation');

    cy.get('@storedText').then((storedText) => {
      cy.get(':nth-child(4) > .ant-col-8 > .ant-typography')
        .should('be.visible')
        .and('contain.text', storedText);
    });

    // Pay recipient
    cy.get(
      '.ant-row-center.m-t-20 > .ant-col > .ant-space > :nth-child(2) > .ant-btn'
    )
      .should('be.visible')
      .click();

    cy.get('.ant-modal-body > :nth-child(1) > .ant-col')
      .should('be.visible')
      .and('contain.text', ' Payment Booked - ');

    cy.get('@storedText').then((storedText) => {
      cy.get(':nth-child(5) > .ant-col-8 > .ant-typography')
        .should('be.visible')
        .and('contain.text', storedText);
    })
    })










})