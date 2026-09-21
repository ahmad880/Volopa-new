const el = require('../PageElements/ExpenseApprovalQueue.json').expenseApprovalQueueLocators;

const normalizeText = (value) =>
    (value ?? '')
        .toString()
        .toLowerCase()
        .replace(/[,\s]+/g, '')
        .trim();

/** A finite number parsed out of a formatted string (signs, thousands separators), or null. */
const parseNumeric = (value) => {
    const cleaned = (value ?? '').toString().replace(/[^0-9.-]/g, '');
    const parsed = Number.parseFloat(cleaned);
    return Number.isFinite(parsed) ? parsed : null;
};


const valuesMatch = (queueValue, specificValue) => {
    const queueNumber = parseNumeric(queueValue);
    const specificNumber = parseNumeric(specificValue);

    if (queueNumber !== null && specificNumber !== null) {
        return Math.abs(queueNumber - specificNumber) < 0.01;
    }

    return normalizeText(queueValue) === normalizeText(specificValue);
};


const specificValueAfterLabel = (labelText) =>
    cy.contains('.ant-typography', labelText)
        .parents('.ant-space-item')
        .first()
        .next('.ant-space-item')
        .find('.ant-typography')
        .invoke('text');


const specificSelectValue = (fieldSelector) =>
    cy.get(fieldSelector).closest('.ant-select').find('.ant-select-content').then(($content) => {
        return $content.find('.ant-select-placeholder').length ? '' : $content.text().trim();
    });


const assertSelectMatches = (fieldSelector, fieldLabel, expectedValue) => {
    specificSelectValue(fieldSelector).then((selectLabel) => {
        expect(valuesMatch(selectLabel, expectedValue), `${fieldLabel}: expected "${expectedValue}", got "${selectLabel}"`).to.be.true;
    });
};

export class ExpenseApprovalQueue {
    goToQueue() {
        
        cy.url().should('not.include', '/login');
        cy.location('origin').then((origin) => {
            cy.visit(`${origin}/cards/expense-approvals`);
        });
        cy.get(el.pageContainer).should('be.visible');
    }

    
    assertHasQueueAccess() {
        this.goToQueue();
        this.waitForAutoSelection();
    }

    
    assertNoQueueAccess(expectedRedirectPath) {
        cy.url().should('not.include', '/login');
        cy.location('origin').then((origin) => {
            cy.visit(`${origin}/cards/expense-approvals`);
        });
        cy.url({ timeout: 30000 }).should('include', expectedRedirectPath);
        cy.get(el.pageContainer).should('not.exist');
    }


    waitForAutoSelection() {
        cy.get(el.queueActiveRow, { timeout: 30000 }).should('exist');
        this.waitForDetailPaneLoaded();
    }

    /** Waits for the detail pane's transaction fetch to finish, for whichever row is active. */
    waitForDetailPaneLoaded() {
        cy.get(el.detailPaneSpinner, { timeout: 30000 }).should('not.exist');
        cy.get(el.detailTransactionIdValue, { timeout: 30000 })
            .invoke('text')
            .should((t) => {
                expect(t.trim(), 'detail pane transaction id').to.match(/^\d+$/);
            });
    }

    loadEntireQueue() {
        const step = () => {
            cy.get(el.queueRows).its('length').then((countBefore) => {
                cy.get('body').then(($body) => {
                    const $checkForMoreBtn = $body.find(el.queueCheckForMoreBtn);

                    if ($checkForMoreBtn.length) {
                        cy.wrap($checkForMoreBtn).click();
                    } else {
                        // ensureScrollable: false — once every row is already loaded the
                        // list may be short enough not to overflow at all, and Cypress's
                        // scrollTo() errors on a non-scrollable element by default.
                        cy.get(el.queueScroller).scrollTo('bottom', { ensureScrollable: false });
                    }

                    // Gives the fetch triggered above time to actually start before
                    // checking it's finished — otherwise "spinner not.exist" can pass
                    // trivially before the spinner ever mounts, the same flicker this
                    // suite has hit before on other pages' loading states.
                    cy.wait(800);
                    cy.get(el.queueNextPageSpinner).should('not.exist');

                    cy.get(el.queueRows).its('length').then((countAfter) => {
                        if (countAfter > countBefore) {
                            step();
                        }
                    });
                });
            });
        };

        step();
    }

    /**
     * Explicitly selects the first or last row in the queue, rather than relying on the
     * app's own auto-select (which always picks the first row — see
     * ExpenseApprovalQueue/index.jsx's `activeId` effect). Draining the queue first only
     * for 'last': the first row is already on screen immediately, and forcing the whole
     * paginated list to load just to click row one would both slow that path down and
     * stop it matching the queue's actual default-selection behaviour.
     */
    selectQueueItem(position = 'first') {
        if (position === 'last') {
            this.loadEntireQueue();
        }

        cy.get(el.queueRows, { timeout: 30000 })
            .should('have.length.greaterThan', 0)
            .then(($rows) => {
                const $target = position === 'last' ? $rows.last() : $rows.first();
                cy.wrap($target).click();
            });
        this.waitForDetailPaneLoaded();
    }

    
    selectQueueItemsForBulk(count = 2) {
        return cy.get(el.queueRows)
            .should('have.length.greaterThan', count - 1)
            .then(($rows) => {
                const ids = [...$rows]
                    .slice(0, count)
                    .map((row) => Number(row.getAttribute('data-testid').replace('queue-row-', '')));

                ids.forEach((id) => {
                    cy.get(`[data-testid="${el.queueRowCheckboxPrefix}${id}"]`).click();
                });

                return cy.wrap(ids);
            });
    }

    assertRowSelected(id, expectedChecked) {
        cy.get(`[data-testid="${el.queueRowCheckboxPrefix}${id}"]`)
            .should(expectedChecked ? 'be.checked' : 'not.be.checked');
    }

    
    interceptBulkDecision({ succeededIds = [], failedIds = [], approvalStatusId = 2, reason = 'already_decided' } = {}) {
        cy.intercept('POST', '**/expense/approval', {
            statusCode: 200,
            body: {
                data: {
                    success: succeededIds.map((id) => ({
                        expense_approval_id: id,
                        entity_type: 'expense',
                        entity_id: id,
                        approval_status_id: approvalStatusId,
                    })),
                    errors: failedIds.map((id) => ({
                        expense_approval_id: id,
                        entity_type: 'expense',
                        entity_id: id,
                        reason,
                    })),
                },
            },
        }).as('bulkDecision');
    }

    clickApprove() {
        cy.get(el.detailApproveBtn).should('be.visible').and('not.be.disabled').click();
    }

    /**
     * Waits for the stubbed request (interceptBulkDecision) and asserts it
     * actually carries the ids under test — catching a selection bug before
     * it's masked by a stubbed response that would answer for any ids at all.
     */
    waitForBulkDecisionRequest(expectedIds) {
        return cy.wait('@bulkDecision').then((interception) => {
            expect(interception.request.body.expense_approval_ids, 'expense_approval_ids sent').to.have.members(expectedIds);
        });
    }

    
    assertPartialFailureNotification({ succeededCount, failedCount, actionPlural = 'approved', reasonText }) {
        cy.get(el.decisionSummaryFailures, { timeout: 15000 })
            .should('be.visible')
            .closest('.ant-notification-notice')
            .should(($notice) => {
                const text = $notice.text();

                expect(text.toLowerCase(), 'notification text').to.include(actionPlural.toLowerCase());
                expect(text, 'notification text').to.include(String(succeededCount));
                expect(text, 'notification text').to.include(`${failedCount} could not be actioned`);

                if (reasonText) {
                    expect(text, 'notification text').to.include(reasonText);
                }
            });
    }

    
    openReasonModal(triggerLocator) {
        cy.get(triggerLocator).should('be.visible').and('not.be.disabled').click();
        cy.get(el.reasonModal).should('be.visible');
        cy.get(el.reasonModalSelect).should('be.visible');
        cy.get(el.reasonModalNotesInput).should('be.visible');
    }

    openRejectReasonModal() {
        this.openReasonModal(el.detailRejectBtn);
    }

    openRequestMoreInfoReasonModal() {
        this.openReasonModal(el.detailRequestMoreInfoBtn);
    }

    assertConfirmDisabled() {
        cy.get(el.reasonModalConfirmBtn).should('be.disabled');
    }

    assertConfirmEnabled() {
        cy.get(el.reasonModalConfirmBtn).should('not.be.disabled');
    }

    /** Opens the Reason Select's dropdown and waits for its options to render. */
    openReasonDropdown() {
        cy.get(el.reasonModalSelect).click();
        cy.get(el.reasonModalDropdownOption).should('have.length.greaterThan', 0);
    }

    /** The Reason dropdown's currently rendered option labels, trimmed, in payload order. */
    getReasonOptionLabels() {
        return cy.get(el.reasonModalDropdownOption).then(($options) => (
            [...$options].map((option) => option.textContent.trim())
        ));
    }

    
    selectNonOtherReason() {
        this.openReasonDropdown();
        cy.get(el.reasonModalDropdownOption).then(($options) => {
            const target = [...$options].find(
                (option) => option.textContent.trim().toLowerCase() !== 'other',
            ) ?? $options[0];
            cy.wrap(target).click();
        });
    }

    
    selectOtherReason() {
        this.openReasonDropdown();
        cy.get(el.reasonModalDropdownOption)
            .contains(/^other$/i)
            .click();
    }

    typeReasonNotes(text) {
        cy.get(el.reasonModalNotesInput).clear().type(text);
    }

    
    cancelReasonModal() {
        cy.get(el.reasonModalCancelBtn).click();
        cy.get(el.reasonModal).should('not.exist');
    }


    captureQueueSnapshot() {
        const snapshot = {};

        cy.get(el.detailTabTransaction).click();
        cy.get(el.detailTransactionIdValue).invoke('text').then((t) => { snapshot.transactionId = t.trim(); });
        cy.get(el.detailCardholderValue).invoke('text').then((t) => { snapshot.cardholderName = t; });
        cy.get(el.detailCardNumberValue).invoke('text').then((t) => { snapshot.cardNumber = t; });
        cy.get(el.detailTransactionDateValue).invoke('text').then((t) => { snapshot.transactionDate = t; });
        cy.get(el.detailTransactionStatusValue).invoke('text').then((t) => { snapshot.transactionStatus = t; });
        cy.get(el.detailMerchantNameValue).invoke('text').then((t) => { snapshot.merchantName = t; });
        cy.get(el.detailMerchantDescriptionValue).invoke('text').then((t) => { snapshot.merchantDescription = t; });
        cy.get(el.detailMerchantLocationValue).invoke('text').then((t) => { snapshot.merchantLocation = t; });
        cy.get(el.detailCurrencyValue).invoke('text').then((t) => { snapshot.currency = t; });
        cy.get(el.detailAmountValue).invoke('text').then((t) => { snapshot.amount = t; });

        cy.get(el.detailTabExpense).click();
        
        cy.wait(1000);
        cy.get(el.detailNotesValue).invoke('text').then((t) => { snapshot.notes = t; });
        cy.get(el.detailCategoryValue).invoke('text').then((t) => { snapshot.category = t; });
        cy.get(el.detailCustomField1Value).invoke('text').then((t) => { snapshot.customField1 = t; });
        cy.get(el.detailCustomField2Value).invoke('text').then((t) => { snapshot.customField2 = t; });
        cy.get(el.detailTrackingCode1Value).invoke('text').then((t) => { snapshot.trackingCode1 = t; });
        cy.get(el.detailTrackingCode2Value).invoke('text').then((t) => { snapshot.trackingCode2 = t; });
        cy.get(el.detailProjectIdValue).invoke('text').then((t) => { snapshot.projectId = t; });
        cy.get(el.detailVatValue).invoke('text').then((t) => { snapshot.vat = t; });

        
        snapshot.additionalFields = [];
        cy.get('body').then(($body) => {
            const testIds = [...$body.find(`[data-testid^="${el.detailAdditionalFieldPrefix}"]`)]
                .map((node) => node.getAttribute('data-testid'));

            testIds.forEach((testId) => {
                const fieldId = testId
                    .replace(el.detailAdditionalFieldPrefix, '')
                    .replace(el.detailAdditionalFieldSuffix, '');
                cy.get(`[data-testid='${testId}']`).invoke('text').then((t) => {
                    snapshot.additionalFields.push({ fieldId, value: t });
                });
            });
        });

        cy.get(el.attachmentViewerCounter).invoke('text').then((t) => {
            const match = t.match(/of\s+(\d+)/i);
            snapshot.attachmentCount = match ? Number(match[1]) : 0;
        });

        return cy.wrap(null).then(() => snapshot);
    }


    goToSpecificTransaction(transactionId) {
       
        expect(String(transactionId ?? '').trim(), 'transaction id captured from the queue').to.match(/^\d+$/);

        cy.location('origin').then((origin) => {
            cy.visit(`${origin}/cards/transaction-history/specific-card-transaction/${transactionId}`);
        });
        cy.contains('Specific Card Transaction').should('be.visible');

       
        cy.get('.ant-spin-spinning').should('not.exist');
        cy.wait(1500);
    }

    
    assertMatchesQueueSnapshot(snapshot) {
        specificValueAfterLabel('Transaction ID').should(($t) => {
            expect(normalizeText($t)).to.equal(normalizeText(snapshot.transactionId));
        });
        specificValueAfterLabel('Transaction Date').should(($t) => {
            expect(valuesMatch($t, snapshot.transactionDate)).to.be.true;
        });
        specificValueAfterLabel('Transaction Status').should(($t) => {
            expect(valuesMatch($t, snapshot.transactionStatus)).to.be.true;
        });
        specificValueAfterLabel('Merchant Name').should(($t) => {
            expect(valuesMatch($t, snapshot.merchantName)).to.be.true;
        });
        specificValueAfterLabel('Merchant Description').should(($t) => {
            expect(valuesMatch($t, snapshot.merchantDescription)).to.be.true;
        });
        specificValueAfterLabel('Merchant Location').should(($t) => {
            expect(valuesMatch($t, snapshot.merchantLocation)).to.be.true;
        });

        // Card holder name breaks the label/value Space pattern (CardDetails renders it
        // as two sibling Rows, the value in a plain <span>), so it gets its own path.
        cy.contains('.ant-typography', 'Card Holder Name')
            .parents('[class*="ant-row"]').first()
            .next('[class*="ant-row"]')
            .find('span').first().invoke('text').should(($t) => {
                expect(valuesMatch($t, snapshot.cardholderName)).to.be.true;
            });
        specificValueAfterLabel('Card Number').should(($t) => {
            expect(valuesMatch($t, snapshot.cardNumber)).to.be.true;
        });

        // Currency and amount are disabled <Input>s with no label association in the
        // DOM — positional lookup off the "Amount" heading's row is the only handle.
        cy.contains('.ant-typography', 'Amount')
            .parents('[class*="ant-row"]').first()
            .next('[class*="ant-row"]')
            .find('input').then(($inputs) => {
                expect(normalizeText($inputs.eq(0).val())).to.equal(normalizeText(snapshot.currency));
                expect($inputs.eq(1).val().trim()).to.equal(snapshot.amount.trim());
            });

        cy.get(el.specificNotesField).invoke('val').should(($v) => {
            expect(valuesMatch($v, snapshot.notes)).to.be.true;
        });

        
        cy.get('body').then(($body) => {
            specificSelectValue(el.specificCategoryField).then((selectLabel) => {
                const otherValue = $body.find(el.specificCategoryNameField).length
                    ? Cypress.$(el.specificCategoryNameField).val()
                    : '';
                const matchesSelect = valuesMatch(selectLabel, snapshot.category);
                const matchesOther = !!otherValue && valuesMatch(otherValue, snapshot.category);
                expect(
                    matchesSelect || matchesOther,
                    `category "${snapshot.category}" should match the select label ("${selectLabel}") or the custom category name ("${otherValue}")`,
                ).to.be.true;
            });
        });

        cy.get('body').then(($body) => {
            if ($body.find(el.specificField1).length) {
                cy.get(el.specificField1).invoke('val').should(($v) => {
                    expect(valuesMatch($v, snapshot.customField1)).to.be.true;
                });
            } else {
                expect(normalizeText(snapshot.customField1), 'custom field 1 has no input on SpecificCardTransaction, so the queue value should be blank').to.equal('');
            }

            if ($body.find(el.specificField2).length) {
                cy.get(el.specificField2).invoke('val').should(($v) => {
                    expect(valuesMatch($v, snapshot.customField2)).to.be.true;
                });
            } else {
                expect(normalizeText(snapshot.customField2), 'custom field 2 has no input on SpecificCardTransaction, so the queue value should be blank').to.equal('');
            }
        });

        assertSelectMatches(el.specificTrackingCode1, 'Tracking code I', snapshot.trackingCode1);
        assertSelectMatches(el.specificTrackingCode2, 'Tracking code II', snapshot.trackingCode2);
        assertSelectMatches(el.specificProjectId, 'Project ID', snapshot.projectId);

        cy.get(el.specificVat).invoke('val').should(($v) => {
            expect(valuesMatch($v, snapshot.vat)).to.be.true;
        });

        snapshot.additionalFields.forEach(({ fieldId, value }) => {
            cy.get(`${el.specificAdditionalFieldPrefix}${fieldId}`).invoke('val').should(($v) => {
                expect(valuesMatch($v, value)).to.be.true;
            });
        });

    
        cy.get('.transaction-upload-component').then(($upload) => {
            expect($upload.find('.ant-upload-list-item-container').length).to.equal(snapshot.attachmentCount);
        });
    }
}
