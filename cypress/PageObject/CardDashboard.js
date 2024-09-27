export class CardDashboard {
    vlidateMainPageHeading() {
        cy.get('.ant-col-xs-21 > .fs-18px').should('contain.text', 'Cards Dashboard')
    }
    validateCardtotalBalance() {
        cy.wait(5000)
        cy.get('[class="ant-typography  bold fs-28px"]').eq(0).then((value1) => {
            let Total = value1.text().trim()
            Total = Total.replace(/,/g, '').replace("€", "").replace(/&nbsp;/g, '');
            cy.log(Total)
            let wbalance, cbalance
            cy.wait(2000)
            cy.get('div[class="ant-col"] [class="ant-typography  bold fs-28px"]').eq(1).then((ele) => {
                wbalance = ele.text().trim()
                wbalance = wbalance.replace(/,/g, '').replace("€", "");
                cy.log(wbalance)
                cy.wait(2000)
                cy.get('div[class="ant-col"] [class="ant-typography  bold fs-28px pointer').then((ele1) => {
                    cy.log(ele1)
                    cbalance = ele1.text().trim()
                    cbalance = cbalance.replace(/,/g, '').replace("€", "");
                    cy.log(cbalance)
                    const value = (parseFloat(wbalance) + parseFloat(cbalance)).toFixed(2);
                    cy.log('Total value:', value);
                    cy.log(Total)
                    cy.wrap(parseFloat(value)).should('eq', parseFloat(Total));
                })
            })
        })
    }
    validateAllContentOnDashbordPage() {
        cy.get('.ant-typography.light-green.medium.fs-28px').should('contain.text', 'Total Company Balance')
        cy.get("span[class='ant-typography dark-green medium fs-28px']").should('contain.text', 'Wallet Balance')
        cy.get('.ant-typography.dark-green.medium.fs-28px.pointer').should('contain.text', 'Cards Balance')
        cy.get('.slick-slide.slick-active.slick-current div div div .ant-card.ant-card-bordered.ant-card-hoverable.b-g.center-align-text.hover-no-border')
            .should('contain.text', 'Convert Balances')
        cy.get('[class="ant-typography muli semi-bold fs-18px"]').eq(1).should('contain.text', 'Fund Card')
        cy.get('[class="ant-typography muli semi-bold fs-18px"]').eq(2).should('contain.text', 'Withdraw')
        cy.get('[class="ant-typography dark-green medium fs-25px"]').should('contain.text', 'Recent Activity - ')
        cy.get('[class="ant-typography fs-25px medium dark-green"]').eq(0).should('contain.text', 'Frequently Used Cards')
        cy.get('[class="ant-typography fs-25px medium dark-green"]').eq(1).should('contain.text', 'Card Transaction History')
    }
    goToCardsPage() {
        cy.get('.m-t-10 > .ant-row > .ant-col > .ant-btn').click()
        cy.get('.ant-col-24 > .ant-tabs > .ant-tabs-nav > .ant-tabs-nav-wrap > .ant-tabs-nav-list > :nth-child(2)').click()
    }
    goToSpecificCardPage() {
        cy.get('[data-row-key="2270"] > :nth-child(1) > .ant-card > .ant-card-body').click()
    }
    validateContentOnSpecificCardPage() {
        cy.get('.ant-typography.medium.dark-green.fs-28px').should('contain.text', 'Manage Specific Card')
        cy.get('.ant-row-top > :nth-child(1)').should('contain.text', 'Freeze').click()
        cy.get('.ant-typography.muli.semi-bold.fs-18px.dark-green').should('contain.text', 'CARD FREEZE')
        cy.get("div[class='ant-modal-body'] div:nth-child(1) button:nth-child(1)").click()
        cy.get('.ant-row-top > :nth-child(2)').should('contain.text', 'Report').click()
        cy.get('.ant-typography.muli.semi-bold.fs-18px.dark-green').should('contain.text', 'CARD LOST/STOLEN')
        cy.get("div[class='ant-modal-body'] div:nth-child(1) button:nth-child(1)").click()
        cy.get('.ant-row-top > :nth-child(3)').should('contain.text', 'Cancel').click()
        cy.get('.ant-typography.muli.semi-bold.fs-18px.dark-green').should('contain.text', 'CANCEL CARD')
        cy.get("div[class='ant-modal-body'] div:nth-child(1) button:nth-child(1)").click()
        cy.get('.ant-row-top > :nth-child(4)').should('contain.text', 'Fund')
        cy.get('.ant-row-top > :nth-child(5)').should('contain.text', 'Withdraw')
        cy.get('.ant-row-top > :nth-child(6)').should('contain.text', 'Convert')
        cy.get('[class="ant-row"] [class="ant-typography fs-25px medium dark-green"]').should('contain.text', 'Card Auto Fund')
        cy.get('[class="ant-typography fs-25px medium dark-green"]').should('contain.text', 'Authorised Payment Types')
        cy.get('[class="ant-typography fs-25px medium dark-green"]').should('contain.text', 'Transaction Limits')
        cy.get('[class="ant-typography fs-25px medium dark-green"]').should('contain.text', 'Card Balance')
    }
    convertBalanceFromCard() {
        cy.get('.slick-current > :nth-child(1) > [tabindex="-1"] > .m-t-10 > .ant-card > .ant-card-body').should('be.visible').click()
        cy.get('[class="ant-table-row ant-table-row-level-0 row-border medium fs-18px "] > td:nth-child(4) span.medium')
            .contains('2025').parents('.ant-table-row').find('.ant-table-cell .ant-btn-primary')
            .should('be.visible').and('contain.text', 'Confirm').click() //Confirm
    }
    validatecurrencyConversion(convertedTo, convertedFrom, amount) {
        cy.get('.ant-form > :nth-child(1)').should('be.visible').should('contain.text', 'Convert To')
        cy.get(':nth-child(2) > [style="padding-left: 4px; padding-right: 4px; flex: 0 0 90px;"] > .ant-form-item > .ant-row > .ant-col > .ant-form-item-control-input > .ant-form-item-control-input-content > .ant-select > .ant-select-selector')
            .should('be.visible').click().type(convertedTo)
        cy.get('.ant-form > :nth-child(3)').should('be.visible').should('contain.text', 'Convert From')
        cy.get(':nth-child(4) > [style="padding-left: 4px; padding-right: 4px; flex: 0 0 90px;"] > .ant-form-item > .ant-row > .ant-col > .ant-form-item-control-input > .ant-form-item-control-input-content > .ant-select > .ant-select-selector')
            .should('be.visible').click().type(convertedFrom)
        cy.get('#convertFromValue').should('be.visible').type(amount)
        cy.wait(1000)
        cy.get('#convertToValue').should('be.visible').invoke('val').then((value) => {
            const convertedToValue = value
            cy.log(convertedToValue)
            cy.wrap(convertedToValue).as('convertedToValue')
        })
        cy.get('.right-align-text > .ant-btn').should('be.visible').click()
        cy.get('.ant-modal-body > :nth-child(1) > .ant-col > .ant-typography').should('be.visible').should('contain.text', 'Conversion Complete')
        cy.get('.ant-row-space-around > .ant-col > .ant-space > .ant-space-item > .ant-btn').should('be.visible').click()
        cy.get('.ant-tabs-nav-list > :nth-child(1)').should('be.visible').click()
        cy.get('.slick-active > :nth-child(1) > [tabindex="-1"] > .ant-collapse > .ant-collapse-item > .ant-collapse-header > .ant-collapse-header-text > .ant-row > [style="padding-left: 8px; padding-right: 8px;"]').should('be.visible').click()
        cy.get(':nth-child(2) > .ant-col > .ant-space-vertical > :nth-child(2) > .ant-space > :nth-child(2) > .ant-typography').should('be.visible').invoke('text')
            .then((value) => {
                const convertedToValue1 = value.replace(/[^0-9.]/g, '')
                cy.log(convertedToValue1)
                cy.get('@convertedToValue').then(convertedToValue => {
                    expect(convertedToValue1).to.eq(convertedToValue)
                })
            })
        cy.get('.ant-row-space-between > :nth-child(1) > .ant-space-vertical > :nth-child(2) > .ant-space > :nth-child(2) > .ant-typography').should('be.visible').invoke('text')
            .then((value) => {
                const convertedFromValue = value.replace(/[^0-9.]/g, '')
                cy.log(convertedFromValue)
                expect(amount).to.eq(convertedFromValue)
            })
    }
    insuficientcurrencyConversion(convertedTo, amount) {
        cy.get(':nth-child(2) > :nth-child(1) > :nth-child(2) > .ant-col > .ant-table-wrapper > .ant-spin-nested-loading > :nth-child(1) > .ant-spin > .ant-spin-dot').should('not.exist')
        cy.get(':nth-child(2) > :nth-child(1) > .m-t-10 > .ant-col > .ant-btn').should('be.visible').click()
        cy.get('table').eq(1).then(table => {
            cy.wrap(table)
                .find('.ant-table-tbody tr td:nth-child(2) div.ant-space-item')
                .filter((index, element) => element.innerText.trim() === '0.00')
                .eq(0)
                .parents('.ant-table-tbody tr')
                .find('td:nth-child(1) .ant-space-item:nth-child(2)')
                .invoke('text')
                .then(text => {
                    const extractedText = text.trim(); // Store the text in the variable
                    cy.log(extractedText) // Log the text

                    cy.get('.ant-form > :nth-child(1)').should('be.visible').should('contain.text', 'Convert To')
                    cy.get(':nth-child(2) > [style="padding-left: 4px; padding-right: 4px; flex: 0 0 90px;"] > .ant-form-item > .ant-row > .ant-col > .ant-form-item-control-input > .ant-form-item-control-input-content > .ant-select > .ant-select-selector')
                        .should('be.visible').click().type(convertedTo)
                    cy.get('.ant-form > :nth-child(3)').should('be.visible').should('contain.text', 'Convert From')
                    cy.get(':nth-child(4) > [style="padding-left: 4px; padding-right: 4px; flex: 0 0 90px;"] > .ant-form-item > .ant-row > .ant-col > .ant-form-item-control-input > .ant-form-item-control-input-content > .ant-select > .ant-select-selector')
                        .should('be.visible').click().type(extractedText).wait(1000).type('{enter}')
                });
        });
        cy.get('#convertFromValue').should('be.visible').type(amount)
        cy.wait(1000)
        cy.get('#convertToValue').should('be.visible').invoke('val').then((value) => {
            const convertedToValue = value
            cy.log(convertedToValue)
            cy.wrap(convertedToValue).as('convertedToValue')
        })
        cy.get('.right-align-text > .ant-btn').should('be.visible').click()
        cy.get('.ant-modal-body > :nth-child(1) > .ant-col > .ant-typography').should('be.visible').should('contain.text', 'Insufficient funds, please check your balance.')
    }
    validateFXRate(convertedTo, convertedFrom, amount){
        cy.get('.ant-form > :nth-child(1)').should('be.visible').should('contain.text', 'Convert To')
        cy.get(':nth-child(2) > [style="padding-left: 4px; padding-right: 4px; flex: 0 0 90px;"] > .ant-form-item > .ant-row > .ant-col > .ant-form-item-control-input > .ant-form-item-control-input-content > .ant-select > .ant-select-selector')
            .should('be.visible').click().type(convertedTo)
        cy.get('.ant-form > :nth-child(3)').should('be.visible').should('contain.text', 'Convert From')
        cy.get(':nth-child(4) > [style="padding-left: 4px; padding-right: 4px; flex: 0 0 90px;"] > .ant-form-item > .ant-row > .ant-col > .ant-form-item-control-input > .ant-form-item-control-input-content > .ant-select > .ant-select-selector')
            .should('be.visible').click().type(convertedFrom)
        cy.get('#convertFromValue').should('be.visible').type(amount)
        cy.get('.ant-space-horizontal > :nth-child(2) > .ant-space > [style=""] > .ant-typography').should('be.visible').should('contain.text','FX Rate')
    }
    selectCurrencies(convertedTo, convertedFrom)
    {
        cy.get('.ant-form > :nth-child(1)').should('be.visible').should('contain.text', 'Convert To')
        cy.get(':nth-child(2) > [style="padding-left: 4px; padding-right: 4px; flex: 0 0 90px;"] > .ant-form-item > .ant-row > .ant-col > .ant-form-item-control-input > .ant-form-item-control-input-content > .ant-select > .ant-select-selector')
            .should('be.visible').click().type(convertedTo)
        cy.get('.ant-form > :nth-child(3)').should('be.visible').should('contain.text', 'Convert From')
        cy.get(':nth-child(4) > [style="padding-left: 4px; padding-right: 4px; flex: 0 0 90px;"] > .ant-form-item > .ant-row > .ant-col > .ant-form-item-control-input > .ant-form-item-control-input-content > .ant-select > .ant-select-selector')
            .should('be.visible').click().type(convertedFrom)
    }
    validateFxRate()
    {
        cy.wait(1000)
        cy.get('.ant-progress-text').should('be.visible')
        cy.get('.ant-progress-text').should('contain.text','30s')
    }
    validateConvertButton(amount)
    {
        cy.get('#convertFromValue').should('be.visible').type(amount)
        cy.wait(1000)
        cy.get('#convertToValue').should('be.visible').invoke('val').then((value) => {
            const convertedToValue = value
            cy.log(convertedToValue)
            cy.wrap(convertedToValue).as('convertedToValue')
        })
        cy.get('.right-align-text > .ant-btn').should('be.enabled').click()
        cy.get('.ant-typography-success').should('contain.text','Conversion Complete')
        cy.get('.m-t-10 > [style="flex: 1 1 auto;"] > [style="margin-left: -4px; margin-right: -4px; row-gap: 8px;"] > .ant-col-18 > .ant-input').invoke('val').then((value) => {
            const popupConvertedToValue = value
            cy.log(popupConvertedToValue)
            cy.wrap(popupConvertedToValue).as('popUpConvertedToValue')
            cy.get('@convertedToValue').then(convertedToValue => {
                expect(popupConvertedToValue).to.eq(convertedToValue)
            })
        })
    }
    verifyCardViewAllCurrecies()
    {
        cy.get(':nth-child(1) > :nth-child(1) > .m-t-10 > .ant-col > .ant-btn > span').click()  
    }
    verifyCompanyPaymentAllCurrecies()
    {
        cy.scrollTo('bottom')
        cy.get(':nth-child(2) > :nth-child(1) > .m-t-10 > .ant-col > .ant-btn > span').click()
    }
    fundTheCard()
    {
        cy.get('[data-index="1"] > :nth-child(1) > [tabindex="-1"] > .m-t-10 > .ant-card > .ant-card-body > .ant-space > [style=""] > .ant-image > .ant-image-img').should('be.visible').click()
        cy.get('[class="ant-table-row ant-table-row-level-0 row-border medium fs-18px "] > td:nth-child(4) span.medium')
        .contains('2025').parents('.ant-table-row').find('.ant-table-cell .ant-btn-primary')
        .should('be.visible').and('contain.text', 'Confirm').click() //Confirm
    }
    selectFundCardCurrencies(currency,amount)
    {
        cy.wait(1000)
        //cy.get('#currency').should('be.visible').click().type(currency)
        cy.get('.ant-select-selector').should('be.visible').click().type(currency)
        cy.get('#amount').should('be.visible').click().type(amount)
        cy.get('#description').should('be.visible').click().type('Fund card')
        cy.get(':nth-child(2) > .ant-btn > span').should('contain.text','Confirm').should('be.visible').click()
        cy.get('.ant-col > .ant-space > :nth-child(2) > .ant-btn > span').should('be.visible').click()
        cy.get('.ant-modal-body > .ant-card > .ant-card-body > :nth-child(1) > .ant-col > .ant-typography').should('contain.text','Funding Complete')
        cy.get('.ant-modal-body > .ant-card > .ant-card-body > :nth-child(2) > .ant-col > .ant-typography').should('contain.text','Your card has now been funded')
    }
    insufficientFundCard(currency,amount) 
    {
        
        cy.get(':nth-child(2) > :nth-child(1) > :nth-child(2) > .ant-col > .ant-table-wrapper > .ant-spin-nested-loading > :nth-child(1) > .ant-spin > .ant-spin-dot').should('not.exist')
        cy.get(':nth-child(2) > :nth-child(1) > .m-t-10 > .ant-col > .ant-btn').should('be.visible').click()
        cy.get('table').eq(1).then(table => {
            cy.wrap(table)
                .find('.ant-table-tbody tr td:nth-child(2) div.ant-space-item')
                .filter((index, element) => element.innerText.trim() === '0.00')
                .eq(0)
                .parents('.ant-table-tbody tr')
                .find('td:nth-child(1) .ant-space-item:nth-child(2)')
                .invoke('text')
                .then(text => {
                    const extractedText = text.trim(); 
                    cy.log(extractedText) 
                    cy.get('#currency').invoke('removeAttr','unselectable').click()
                    cy.get('#currency').invoke('removeAttr','readonly').click()
                    cy.get('.ant-select-selector').should('be.visible').click().type(extractedText).wait(1000).type(currency)
                    
                    
                    cy.get('#amount').should('be.visible').click().type(amount)
                    cy.get('#description').should('be.visible').click().type('Fund card')
                   
                    cy.get(':nth-child(2) > .ant-btn > span').should('contain.text','Confirm').should('be.visible').click()
                    cy.get('.ant-col > .ant-space > :nth-child(2) > .ant-btn > span').should('be.visible').click()
                    cy.get('.ant-notification-notice-message').should('be.visible').should('contain.text','Insufficient funds')
                    cy.get('.ant-notification-notice-description').should('be.visible').should('contain.text','Amount exceeds your wallet balance in this currency')
                
                });
        });
    }
    ResetFundCardValues(currency,amount)
    {
        cy.wait(1000)
        //cy.get('#currency').should('be.visible').click().type(currency)
        cy.get('.ant-select-selector').should('be.visible').click().type(currency)
        cy.get('#amount').should('be.visible').click().type(amount)
        cy.get('#description').should('be.visible').click().type('Fund card')
        // cy.get('.ant-space > :nth-child(1) > .ant-btn > span').should('contain.text','Reset').click()
        cy.get('#amount').should('contain.text','')
        cy.get('#description').should('contain.text','')
        cy.get('#currency').should('contain.value','')

    }
    selectWithdrawCard()
    {

        cy.get('[data-index="2"] > :nth-child(1) > [tabindex="-1"] > .m-t-10 > .ant-card > .ant-card-body > .ant-space > :nth-child(2) > .ant-typography').should('be.visible').should('contain.text','Withdraw').click()
        cy.get('[class="ant-table-row ant-table-row-level-0 row-border medium fs-18px "] > td:nth-child(4) span.medium')
        .contains('2025').parents('.ant-table-row').find('.ant-table-cell .ant-btn-primary')
        .should('be.visible').and('contain.text', 'Confirm').click()
    }
    withdrawFundFromCard(currency,amount)
    {
        cy.wait(1000)
        cy.get('.ant-select-selector').should('be.visible').click().type(currency)
        cy.get('.ant-input-number-input').should('be.visible').click().type(amount)
        cy.get('.ant-input').should('be.visible').click().type('Withdraw fund')
        cy.get(':nth-child(2) > .ant-btn > span').should('be.visible').should('contain.text','Confirm').click()
        cy.get('.ant-col > .ant-space > :nth-child(2) > .ant-btn > span').should('contain.text','Confirm').click()
        cy.get('.ant-modal-body > .ant-card > .ant-card-body > :nth-child(1) > .ant-col > .ant-typography').should('be.visible').should('contain.text','Withdrawal Complete')
        cy.get('.ant-modal-body > .ant-card > .ant-card-body > :nth-child(2) > .ant-col > .ant-typography').should('be.visible').should('contain.text','Funds have now been withdrawn to the Company Wallet')
    }
    insufficientWithdrawFund(currency,amount) 
    {
        cy.get(':nth-child(2) > :nth-child(1) > :nth-child(2) > .ant-col > .ant-table-wrapper > .ant-spin-nested-loading > :nth-child(1) > .ant-spin > .ant-spin-dot').should('not.exist')
        cy.get(':nth-child(2) > :nth-child(1) > .m-t-10 > .ant-col > .ant-btn').should('be.visible').click()
        cy.get('table').eq(1).then(table => {
            cy.wrap(table)
                .find('.ant-table-tbody tr td:nth-child(2) div.ant-space-item')
                .filter((index, element) => element.innerText.trim() === '0.00')
                .eq(0)
                .parents('.ant-table-tbody tr')
                .find('td:nth-child(1) .ant-space-item:nth-child(2)')
                .invoke('text')
                .then(text => {
                    const extractedText = text.trim(); 
                    cy.log(extractedText) 
                    cy.get('.ant-select-selection-search-input').invoke('removeAttr','unselectable')
                    cy.get('.ant-select-selection-search-input').invoke('removeAttr','readonly')
                    cy.get('.ant-select-selector').should('be.visible').click().type(extractedText).wait(1000).type(currency)
                    
                    
                    cy.get('.ant-input-number-input').should('be.visible').click().type(amount)
                    cy.get('.ant-input').should('be.visible').click().type('Withdraw card')
                   
                    cy.get(':nth-child(2) > .ant-btn > span').should('contain.text','Confirm').should('be.visible').click()
                    cy.get('.ant-col > .ant-space > :nth-child(2) > .ant-btn > span').should('be.visible').click()
                    cy.get('.ant-notification-notice-message').should('be.visible').should('contain.text','Insufficient funds')
                    cy.get('.ant-notification-notice-description').should('be.visible').should('contain.text','Amount exceeds your card balance in this currency')
                
                });
        });
    }

}