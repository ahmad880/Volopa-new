const el = require('../PageElements/ExpenseApprovalQueue.json').expenseApprovalQueueLocators;

/**
 * Solid-variant ExpenseStatusBadge renders white text on a status-coloured
 * background (App/Components/ExpenseStatusBadge/tones.js `onFill` is white for
 * every status but More Information Required), so the "colour label" these
 * cases describe is the badge's background-color, not its text colour. Values
 * come from `approvalStatusColors` in tailwind.config.mjs.
 */
const APPROVAL_STATUS_BADGE_COLOR = {
    'unsubmitted':        'rgb(24, 24, 24)',
    'in-review':          'rgb(13, 0, 199)',
    'approved':           'rgb(16, 133, 72)',
    'unapproved':         'rgb(151, 27, 47)',  // Rejected
    'more-info-required': 'rgb(242, 182, 110)',
};

/** The cardholder bell's More Information Required alert format id (Constants/Common/index.js `NOTIFICATIONS.moreInformationRequired`). */
const MORE_INFO_PLATFORM_FORMAT_ID = 60;

/** Minimal stub queue rows — every QueueListItem field is optional-chained, so `expense_approval_id` alone is enough to render. */
export const buildStubQueueItems = (startId, count) =>
    Array.from({ length: count }, (_, i) => ({ expense_approval_id: startId + i }));

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
                // Re-queries by testid rather than clicking the captured $target directly —
                // see openTransactionHistoryRowAtIndex()'s note on why a re-render between
                // this .then() and the click actually firing can detach a pinned reference.
                // .first() in case that id renders more than once (observed on Transaction
                // History; the same testid should always point at the same transaction
                // regardless of which duplicate DOM node it is).
                cy.get(`[data-testid="${$target.attr('data-testid')}"]`).first().click();
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

    /**
     * Like selectQueueItemsForBulk(), but also opens each row in turn first to
     * read its transaction id off the detail pane, and returns both id sets.
     * Queue rows only carry expense_approval_id, and a decision evicts every
     * row it touches immediately on success — this is the only point at which
     * each selected item's own transaction id (needed to reopen its Specific
     * Card Transaction page afterwards and check every one, not just a sample)
     * is still available to look up.
     */
    selectQueueItemsForBulkWithTransactionIds(count = 2) {
        return cy.get(el.queueRows)
            .should('have.length.greaterThan', count - 1)
            .then(($rows) => {
                const approvalIds = [...$rows]
                    .slice(0, count)
                    .map((row) => Number(row.getAttribute('data-testid').replace('queue-row-', '')));

                const transactionIds = [];

                const visitAndSelect = (index) => {
                    if (index >= approvalIds.length) {
                        return cy.wrap({ approvalIds, transactionIds });
                    }

                    const id = approvalIds[index];

                    return cy.get(`[data-testid="queue-row-${id}"]`).click().then(() => {
                        this.waitForDetailPaneLoaded();

                        return this.getActiveTransactionId().then((transactionId) => {
                            transactionIds.push(transactionId.trim());

                            return cy.get(`[data-testid="${el.queueRowCheckboxPrefix}${id}"]`)
                                .click()
                                .then(() => visitAndSelect(index + 1));
                        });
                    });
                };

                return visitAndSelect(0);
            });
    }

    /**
     * A succeeded id is evicted client-side the moment the decision applies
     * (applyResult's queryClient.setQueryData filter), so its row — checkbox
     * included — leaves the DOM entirely. That's different from a failed id,
     * which stays mounted and merely unchecked. Only reach for this when the
     * queue list itself was never mocked (so there is no refetch to bring the
     * row back) and every targeted id succeeded, e.g. a fully-successful bulk
     * decision with no failures to trigger applyResult's invalidateQueries.
     */
    assertRowRemovedFromQueue(id) {
        cy.get(`[data-testid="${el.queueRowCheckboxPrefix}${id}"]`, { timeout: 15000 }).should('not.exist');
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
     * Spies on (without stubbing) the real decision POST — for the cases that
     * need the actual backend outcome rather than a mocked one, e.g. to confirm
     * a decision's real, persisted effect on the Specific Card Transaction page
     * afterwards.
     */
    spyOnDecisionRequest() {
        cy.intercept('POST', '**/expense/approval').as('decisionRequest');
    }

    /** Waits for the real decision request (spyOnDecisionRequest()) and asserts its ids and a 200 response. */
    waitForRealDecisionRequest(expectedIds) {
        return cy.wait('@decisionRequest').then((interception) => {
            expect(interception.request.body.expense_approval_ids, 'expense_approval_ids sent').to.have.members(expectedIds);
            expect(interception.response?.statusCode, 'decision response status').to.equal(200);
        });
    }

    /**
     * Like waitForRealDecisionRequest(), plus asserts the request carries exactly
     * one reason_id/notes pair for the whole batch (useExpenseApprovalMutation.js's
     * documented "a bulk request carries one reason_id/notes pair for every id") —
     * the client-side guarantee that a bulk Reject/Request More Information
     * applies the same reason to every selected item, rather than one each.
     */
    waitForRealDecisionRequestWithReason(expectedIds, expectedNotes) {
        return cy.wait('@decisionRequest').then((interception) => {
            expect(interception.request.body.expense_approval_ids, 'expense_approval_ids sent').to.have.members(expectedIds);
            expect(interception.request.body.reason_id, 'a single reason_id applied to the whole batch').to.exist;
            expect(interception.request.body.notes, 'notes applied to the whole batch').to.equal(expectedNotes);
            expect(interception.response?.statusCode, 'decision response status').to.equal(200);
        });
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


    /**
     * The first line of the bulk-decision result copy, per current requirements:
     * "<successes> Expense(s) <StatusWord>, <failures> Expense(s) failed to update."
     * — or, for Request More Information, its own "Requested More Information for
     * ..." phrasing instead of a status word.
     *
     * When nothing succeeded, the success half (and its leading comma) is dropped
     * entirely rather than printed as "0 Expense(s) <StatusWord>" — symmetric with
     * how a fully successful decision never mentions failures at all.
     */
    buildBulkDecisionFirstLine({ succeededCount, failedCount, statusWord, requestMoreInfo = false }) {
        const countedNoun = (count) => `${count} Expense${count === 1 ? '' : 's'}`;

        if (succeededCount === 0) {
            return `${countedNoun(failedCount)} failed to update.`;
        }

        return requestMoreInfo
            ? `Requested More Information for ${countedNoun(succeededCount)}, ${countedNoun(failedCount)} failed to update.`
            : `${countedNoun(succeededCount)} ${statusWord}, ${countedNoun(failedCount)} failed to update.`;
    }

    /**
     * Asserts a bulk decision's result notification against the current copy
     * requirements: the summary first line built by buildBulkDecisionFirstLine(),
     * plus a reason line — only ever shown when at least one item failed, which is
     * every case this assertion is used for.
     */
    assertBulkDecisionNotification({ succeededCount, failedCount, statusWord, requestMoreInfo = false, reasonText }) {
        const firstLine = this.buildBulkDecisionFirstLine({ succeededCount, failedCount, statusWord, requestMoreInfo });

        cy.get(el.decisionSummaryFailures, { timeout: 15000 })
            .should('be.visible')
            .closest('.ant-notification-notice')
            .should(($notice) => {
                const text = $notice.text().replace(/\s+/g, ' ');

                expect(text, 'notification first line').to.include(firstLine);
                expect(text, 'notification reason line').to.include(reasonText);
            });
    }

    /**
     * When nothing in the batch fails, the new failure-style summary/reason copy
     * does not apply at all — the pre-existing plain success notification is what's
     * shown instead, and the failures block never mounts.
     */
    assertBulkSuccessOnlyNotification() {
        cy.get(el.decisionSummaryFailures).should('not.exist');
        cy.get('.ant-notification-notice-success', { timeout: 15000 }).should('be.visible');
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

    confirmReasonModal() {
        cy.get(el.reasonModalConfirmBtn).should('be.visible').and('not.be.disabled').click();
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


    /**
     * Opens the first row of an already-filtered Transaction History table and
     * returns its transaction id (parsed off the row's own `txn-list-row-{id}`
     * testid, the same id the row's onRow handler navigates with).
     */
    openFirstTransactionHistoryRow() {
        return this.openTransactionHistoryRowAtIndex(0);
    }

    /**
     * Opens the row at `index` (0-based) of an already-filtered Transaction
     * History table and returns its transaction id — like
     * openFirstTransactionHistoryRow(), but lets a caller step past a row that
     * turned out stale/broken rather than always re-trying row #0.
     *
     * Clicks by re-querying the selector rather than reusing the `$row`
     * captured while reading its id: the table can re-render between that
     * `.then()` and the click actually firing (observed as Cypress's own
     * "the page updated while this command was executing" failure), which
     * detaches the captured jQuery/DOM reference `cy.wrap($row).click()` would
     * otherwise pin to. `cy.get(selector).click()` re-runs the whole query on
     * each retry instead, so a re-render mid-click just gets picked up fresh.
     *
     * Also waits a moment after the spinner clears: a failed/foreign
     * transaction fetch redirects back to Transaction History only once its
     * query settles (SpecificCardTransaction/index.jsx's own effect), and the
     * spinner disappearing doesn't guarantee that redirect — if one is coming —
     * has fired yet (the same settling goToSpecificTransaction() already waits
     * out after its own spinner check).
     */
    openTransactionHistoryRowAtIndex(index) {
        return cy.get(el.txnListRows, { timeout: 30000 })
            .should('have.length.greaterThan', index)
            .eq(index)
            .invoke('attr', 'data-testid')
            .then((testId) => {
                const id = testId.replace('txn-list-row-', '');
                // .first(): this table has been observed rendering the same transaction id
                // more than once (cause unconfirmed — possibly overlapping page-load/filter
                // requests merging without de-duping). Any duplicate points at the same
                // transaction, so which DOM node gets clicked doesn't matter.
                cy.get(`[data-testid="${testId}"]`).first().click();
                cy.contains('Specific Card Transaction').should('be.visible');
                cy.get('.ant-spin-spinning').should('not.exist');
                cy.wait(1000);
                // Fails fast and clearly here, rather than leaving a caller's later
                // badge-lookup to time out confusingly: the "Specific Card Transaction"
                // heading is static page layout and renders even when the row turned out
                // stale and the transaction fetch failed — the failure only shows up
                // afterwards as a silent redirect back to Transaction History (no error
                // state — confirmed in source), which never gets a status badge at all.
                cy.url().should('include', '/specific-card-transaction/');
                return cy.wrap(id);
            });
    }

    /**
     * Loads the whole queue and returns the transaction id of the first item
     * whose card does NOT end in `ownCardLastFour` — a real stand-in for
     * "another cardholder's transaction" when the only way to tell one apart
     * from the known cardUser's own is by card number (this suite has no
     * second cardholder credential, and picking an arbitrary queue item by
     * position — e.g. the oldest FIFO one — is not reliable here: the known
     * cardUser can be one of very few active cardholders in this dev
     * environment, so an "arbitrary" item can easily turn out to be their own
     * too).
     */
    findTransactionOnDifferentCard(ownCardLastFour) {
        this.loadEntireQueue();

        const tryRow = (index) => cy.get(el.queueRows).then(($rows) => {
            if (index >= $rows.length) {
                throw new Error(`No queue item found on a card other than ...${ownCardLastFour}`);
            }

            const rowTestId = $rows.eq(index).attr('data-testid');

            return cy.get(`[data-testid="${rowTestId}"]`).first().click().then(() => {
                this.waitForDetailPaneLoaded();

                return cy.get(el.detailCardNumberValue).invoke('text').then((cardNumberText) => {
                    if (!cardNumberText.trim().endsWith(ownCardLastFour)) {
                        return this.getActiveTransactionId();
                    }

                    return tryRow(index + 1);
                });
            });
        });

        return tryRow(0);
    }

    /**
     * The counterpart to findTransactionOnDifferentCard() — loads the whole
     * queue and returns `{approvalId, transactionId}` for the first item whose
     * card DOES end in `ownCardLastFour`, skipping any id already in
     * `excludeApprovalIds`. Used to find a known cardholder's own real
     * already-In-Review transactions directly off the live queue, rather than
     * freshly submitting new ones.
     */
    findTransactionOnOwnCard(ownCardLastFour, excludeApprovalIds = []) {
        this.loadEntireQueue();

        const tryRow = (index) => cy.get(el.queueRows).then(($rows) => {
            if (index >= $rows.length) {
                throw new Error(`No queue item found on card ...${ownCardLastFour}`);
            }

            const rowTestId = $rows.eq(index).attr('data-testid');
            const approvalId = Number(rowTestId.replace('queue-row-', ''));

            if (excludeApprovalIds.includes(approvalId)) {
                return tryRow(index + 1);
            }

            return cy.get(`[data-testid="${rowTestId}"]`).first().click().then(() => {
                this.waitForDetailPaneLoaded();

                return cy.get(el.detailCardNumberValue).invoke('text').then((cardNumberText) => {
                    if (cardNumberText.trim().endsWith(ownCardLastFour)) {
                        return this.getActiveTransactionId().then((transactionId) => (
                            cy.wrap({ approvalId, transactionId: transactionId.trim() })
                        ));
                    }

                    return tryRow(index + 1);
                });
            });
        });

        return tryRow(0);
    }

    /**
     * Visits a Specific Card Transaction URL directly and confirms the app
     * redirects away rather than showing it. SpecificCardTransaction/index.jsx
     * has no distinct "access denied" state — a failed/foreign fetch resolves
     * with no transaction id, and the page's own effect responds to that by
     * silently `navigate(URLS.TransactionHistory)`ing; the same path also
     * covers "doesn't exist" and a transient error, so this only proves "not
     * shown", which is as far as the app itself distinguishes.
     */
    assertTransactionAccessRedirectsToHistory(transactionId) {
        cy.location('origin').then((origin) => {
            cy.visit(`${origin}/cards/transaction-history/specific-card-transaction/${transactionId}`);
        });
        cy.url({ timeout: 30000 }).should('include', '/cards/transaction-history');
        cy.url().should('not.include', '/specific-card-transaction');
    }

    /**
     * Waits for whichever Expense Approval Status badge is going to render on
     * the Specific Card Transaction page (SpecificCardTransaction/index.jsx
     * shows `txn-detail-approval-status-badge` for a cardholder,
     * `txn-detail-approval-override-badge` for an admin/override view) and
     * returns that locator. A plain `cy.get('body').then(...)` snapshots the
     * DOM exactly once and never retries — if neither badge has mounted yet
     * (e.g. right after a navigation or cy.reload()), it locks onto the wrong
     * branch and then polls that wrong locator until it times out. Gating on a
     * retry-able `.should()` first means the decision itself waits for real
     * data. Shared by assertSpecificTransactionApprovalStatus() and
     * getSpecificTransactionApprovalStatus().
     */
    resolveSpecificApprovalBadgeLocator() {
        return cy.get('body', { timeout: 30000 }).should(($body) => {
            expect(
                $body.find(el.specificApprovalStatusBadge).length || $body.find(el.specificApprovalOverrideBadge).length,
                'the cardholder or admin/override approval status badge should be present',
            ).to.be.greaterThan(0);
        }).then(($body) => (
            $body.find(el.specificApprovalStatusBadge).length ? el.specificApprovalStatusBadge : el.specificApprovalOverrideBadge
        ));
    }

    /**
     * Asserts the Expense Approval Status badge on the Specific Card Transaction
     * page shows the given status value, its label, and its status colour (see
     * APPROVAL_STATUS_BADGE_COLOR).
     */
    assertSpecificTransactionApprovalStatus(statusValue, label) {
        this.resolveSpecificApprovalBadgeLocator().then((locator) => {
            cy.get(locator)
                .should('be.visible')
                .and('have.attr', 'data-status', statusValue)
                .and('have.css', 'background-color', APPROVAL_STATUS_BADGE_COLOR[statusValue])
                .and('contain.text', label);
        });
    }

    /**
     * The Specific Card Transaction page's current approval status value
     * (`data-status`), without asserting what it should be — for callers that
     * need to make a decision based on the real current status (e.g. retrying
     * against a fresh row when a filtered list turned out to be stale) rather
     * than failing the test outright.
     */
    getSpecificTransactionApprovalStatus() {
        return this.resolveSpecificApprovalBadgeLocator().then((locator) => (
            cy.get(locator).invoke('attr', 'data-status')
        ));
    }

    assertSubmitForApprovalVisible() {
        cy.get(el.specificSubmitBtn).should('be.visible').and('not.be.disabled');
    }

    assertSubmitForApprovalNotPresent() {
        cy.get(el.specificSubmitBtn).should('not.exist');
    }

    clickSubmitForApproval() {
        cy.get(el.specificSubmitBtn).should('be.visible').and('not.be.disabled').click();
    }

    /**
     * Confirms there is no standalone Cancel/Withdraw action for the cardholder
     * on this page — exact-text matches only, so this doesn't false-positive on
     * a modal's own Cancel button (no modal is open when this is called).
     */
    assertNoCancelOrWithdrawControl() {
        cy.contains('button', /^cancel$/i).should('not.exist');
        cy.contains(/withdraw/i).should('not.exist');
    }

    /**
     * The Administrator/Primary Admin override toggle on the Specific Card
     * Transaction page (App/Components/ExpenseApprovalStatus) — a distinct
     * control from the cardholder's Submit for Approval button, and from the
     * queue's own decision buttons. Approve/In Review never open the reason
     * modal; only Reject and Request More Information do (same shared
     * ReasonModal/testids as the queue — see openReasonModal()).
     */
    clickOverrideApprove() {
        cy.get(el.expenseApprovalStatusApproveBtn).should('be.visible').and('not.be.disabled').click();
    }

    /** Overrides back to In Review — never opens the reason modal, same as Approve. */
    clickOverrideInReview() {
        cy.get(el.expenseApprovalStatusInReviewBtn).should('be.visible').and('not.be.disabled').click();
    }

    openOverrideRejectReasonModal() {
        this.openReasonModal(el.expenseApprovalStatusRejectBtn);
    }

    openOverrideMoreInfoReasonModal() {
        this.openReasonModal(el.expenseApprovalStatusMoreInfoBtn);
    }

    /** Spies on (without stubbing) the real override POST — expense/approval/override, distinct from the queue's bulk expense/approval. */
    spyOnOverrideRequest() {
        cy.intercept('POST', '**/expense/approval/override').as('overrideRequest');
    }

    waitForOverrideRequest(expectedApprovalStatusId) {
        return cy.wait('@overrideRequest').then((interception) => {
            expect(interception.request.body.approval_status_id, 'override approval_status_id sent').to.equal(expectedApprovalStatusId);
            expect(interception.response?.statusCode, 'override response status').to.equal(200);
        });
    }

    /**
     * Stubs the override endpoint with a 403 — visibility is enforced purely
     * server-side (useExpenseApprovalOverrideMutation.js: the write is
     * account-scoped even though reading the transaction is client-scoped, so
     * the toggle renders identically regardless of scope and only the write can
     * be refused). Real cross-cardholder visibility isn't data this suite can
     * set up on demand, so the refusal is stubbed to exercise the client's
     * actual handling of it.
     */
    stubOverrideForbidden() {
        cy.intercept('POST', '**/expense/approval/override', {
            statusCode: 403,
            body: { error: { message: 'You do not have permission to change the status of this transaction.' } },
        }).as('overrideRequest');
    }

    assertOverridePermissionDeniedToast() {
        cy.contains(/you do not have permission/i, { timeout: 15000 }).should('be.visible');
    }

    /**
     * The cardholder-facing latest decision reason (App/Components/
     * ExpenseDecisionReason) — only rendered for Rejected/More Information
     * Required, and always the single latest reason the server resolves, never
     * an accumulating history. `expectedText` should appear in the Notes value;
     * `unexpectedNotes`, if given, must not (used to prove an earlier cycle's
     * reason was replaced, not appended to).
     */
    assertLatestDecisionReasonNotes(expectedText, unexpectedNotes) {
        cy.get(el.specificDecisionCommentValue, { timeout: 30000 })
            .should('be.visible')
            .invoke('val')
            .should(($val) => {
                expect($val, 'latest decision reason notes').to.contain(expectedText);
                if (unexpectedNotes) {
                    expect($val, 'an earlier cycle\'s notes should not still be showing').to.not.contain(unexpectedNotes);
                }
            });
    }

    /**
     * Asserts one Specific Card Transaction expense field is locked — an antd
     * Select is disabled via its `.ant-select-disabled` wrapper class rather
     * than the `disabled` HTML attribute landing on the field's own selector, so
     * each kind is checked the way it actually renders disabled. Skips fields
     * this transaction doesn't have (custom fields 1/2 are conditional — see
     * assertMatchesQueueSnapshot's own handling of the same two).
     */
    assertSpecificFieldReadOnly(fieldSelector) {
        cy.get('body').then(($body) => {
            if (!$body.find(fieldSelector).length) {
                return;
            }

            cy.get(fieldSelector).then(($field) => {
                const $select = $field.closest('.ant-select');

                if ($select.length) {
                    cy.wrap($select).should('have.class', 'ant-select-disabled');
                } else {
                    cy.wrap($field).should('be.disabled');
                }
            });
        });
    }

    /**
     * The editable counterpart to assertSpecificFieldReadOnly() — for
     * Unsubmitted/More Information Required, where `isReadOnly` is false
     * (SpecificCardTransaction/index.jsx's isFieldWriteLocked()) and every
     * field gets disabled={false} instead.
     */
    assertSpecificFieldEditable(fieldSelector) {
        cy.get('body').then(($body) => {
            if (!$body.find(fieldSelector).length) {
                return;
            }

            cy.get(fieldSelector).then(($field) => {
                const $select = $field.closest('.ant-select');

                if ($select.length) {
                    cy.wrap($select).should('not.have.class', 'ant-select-disabled');
                } else {
                    cy.wrap($field).should('not.be.disabled');
                }
            });
        });
    }

    /** Every expense field on the Specific Card Transaction page — shared by the read-only and editable assertions below. */
    specificTransactionFields() {
        return [
            el.specificNotesField,
            el.specificCategoryField,
            el.specificField1,
            el.specificField2,
            el.specificTrackingCode1,
            el.specificTrackingCode2,
            el.specificProjectId,
            el.specificVat,
        ];
    }

    /**
     * Asserts every expense field on the Specific Card Transaction page is
     * locked. `isReadOnly` (SpecificCardTransaction/index.jsx) is derived from
     * approval status alone — In Review, Approved and Rejected lock every
     * field, identically for every role (cardholder, Primary Administrator,
     * Administrator); there is no role-based softening of the lock.
     */
    assertSpecificTransactionFieldsReadOnly() {
        this.specificTransactionFields().forEach((selector) => this.assertSpecificFieldReadOnly(selector));
    }

    /** Asserts every expense field on the Specific Card Transaction page is editable — Unsubmitted and More Information Required only. */
    assertSpecificTransactionFieldsEditable() {
        this.specificTransactionFields().forEach((selector) => this.assertSpecificFieldEditable(selector));
    }


    /**
     * Opens the navbar bell notifications popover. The trigger button itself has
     * no data-testid (App/Components/NavBar/index.jsx) — it is the only nav
     * button wrapped in an antd Badge, which is used here as the most specific
     * available hook.
     */
    openBellNotifications() {
        cy.get(el.navBarBellTrigger).first().click();
        cy.get(el.bellInReviewItem, { timeout: 15000 }).should('be.visible');
    }

    /** Opens the bell popover without assuming the Primary-Admin-only In Review item — for a cardholder session. */
    openBellPopover() {
        cy.get(el.navBarBellTrigger).first().click();
    }

    /** Spies on (without stubbing) the real bell feed — GET platform/alert — for getMoreInfoBellAlertId(). */
    spyOnBellNotifications() {
        cy.intercept('GET', '**/platform/alert*').as('bellNotifications');
    }

    /** Waits for the spied bell feed (spyOnBellNotifications()) and returns its raw platform/alert rows. */
    waitForBellNotifications() {
        return cy.wait('@bellNotifications').then((interception) => interception.response?.body?.data ?? []);
    }

    /**
     * Finds the More Information Required alert id for a transaction within an
     * already-fetched alerts array (waitForBellNotifications()). MoreInfoBellItem
     * keys its own testid on the alert's own id, not the transaction id, since
     * several alerts can share one transaction_id — so the id has to be looked
     * up from the actual feed content rather than assumed.
     */
    findMoreInfoAlertId(alerts, transactionId) {
        const match = alerts.find((alert) => String(alert?.alert_json_object?.transaction_id?.data) === String(transactionId));
        expect(match, `a More Information Required bell alert for transaction ${transactionId}`).to.exist;
        return match.id;
    }

    /** Waits for the spied bell feed and returns the id of the More Information Required alert for the given transaction. */
    getMoreInfoBellAlertId(transactionId) {
        return this.waitForBellNotifications().then((alerts) => this.findMoreInfoAlertId(alerts, transactionId));
    }

    /** Confirms at least one More Information Required bell item is present for the cardholder. */
    assertHasMoreInfoBellItems() {
        cy.get('[data-testid^="bell-more-info-item-"]').should('have.length.greaterThan', 0);
    }

    /** Clicks the first More Information Required bell item's View button. */
    clickFirstMoreInfoBellItem() {
        cy.get('[data-testid^="bell-more-info-view-btn-"]').first().click();
    }

    /**
     * Confirms the More Information Required bell items render in the same
     * order the server's platform/alert feed returned them in — the same
     * "client doesn't reorder what it was given" check TC_EAQ_LIST_001 makes
     * for the queue, applied here to the bell.
     */
    assertMoreInfoBellItemsMatchServerOrder() {
        return this.waitForBellNotifications().then((alerts) => {
            const moreInfoIds = alerts
                .filter((alert) => Number(alert?.platform_alert_format_id) === MORE_INFO_PLATFORM_FORMAT_ID)
                .map((alert) => String(alert.id));

            cy.get('[data-testid^="bell-more-info-item-"]').then(($items) => {
                const domIds = [...$items].map((item) => item.getAttribute('data-testid').replace('bell-more-info-item-', ''));
                expect(domIds, "More Information Required bell items should render in the server feed's own order").to.deep.equal(moreInfoIds);
            });
        });
    }

    /** Confirms the Administrator/Primary Admin override toggle is present on the Specific Card Transaction page. */
    assertOverrideToggleVisible() {
        cy.get(el.expenseApprovalStatusToggle).should('be.visible');
    }

    /** Confirms no override toggle (and so no Approve/Reject/Request More Information control) is present — EXPENSE_APPROVAL_OVERRIDE_ROLES excludes the cardholder role entirely. */
    assertOverrideToggleNotPresent() {
        cy.get(el.expenseApprovalStatusToggle).should('not.exist');
    }

    /**
     * Confirms the override toggle offers no way to target Unsubmitted.
     * ExpenseApprovalStatus/index.jsx renders exactly four fixed segments — In
     * Review, Approve, More Info, Reject — and OVERRIDE_TARGETS_BY_SOURCE never
     * lists Unsubmitted as anyone's target, so there is no fifth segment for it
     * regardless of the transaction's current status.
     */
    assertNoUnsubmittedOverrideTarget() {
        cy.get(el.expenseApprovalStatusToggle).find('[data-testid*="unsubmitted"]').should('not.exist');
        cy.get(el.expenseApprovalStatusToggle).contains(/unsubmitted/i).should('not.exist');
    }

    /**
     * Types text longer than `limit` characters into the open Reason modal's
     * Notes field and confirms it stops accepting input at exactly `limit` —
     * ReasonModal/index.jsx's Notes textarea carries a native `maxLength`
     * (APPROVAL_NOTES_MAX_LENGTH), so the browser itself truncates typed input
     * rather than the app validating it after the fact.
     */
    assertReasonNotesMaxLength(limit) {
        const overLong = 'x'.repeat(limit + 20);
        cy.get(el.reasonModalNotesInput).clear().type(overLong, { delay: 0 }).invoke('val').should((value) => {
            expect(value.length, 'notes field should stop accepting input at the proposed limit').to.equal(limit);
        });
    }

    clickBellViewQueueBtn() {
        cy.get(el.bellInReviewBtn).should('be.visible').click();
    }

    assertBellShowsInReviewCount() {
        cy.get(el.bellInReviewCount).should('be.visible').invoke('text').should('match', /[1-9]\d*/);
    }

    /** The bell's currently displayed In Review count, as a number. */
    getBellInReviewCount() {
        return cy.get(el.bellInReviewCount).invoke('text').then((t) => {
            const match = t.match(/\d+/);
            return match ? Number(match[0]) : 0;
        });
    }

    /**
     * Every queue decision (single or bulk) and the override mutation all
     * invalidate the same ['_expense_approval_counts'] query key that drives
     * this number (useQueueDecision.jsx, useExpenseSubmitMutation.js), so it
     * refetches on its own with no polling interval to wait out — a plain
     * retry-able assertion is enough.
     */
    assertBellInReviewCountEquals(expected) {
        cy.get(el.bellInReviewCount, { timeout: 15000 }).invoke('text').should((t) => {
            const match = t.match(/\d+/);
            expect(match ? Number(match[0]) : 0, 'bell In Review count').to.equal(expected);
        });
    }

    /** Closes the bell popover via Escape, so it can be reopened later in the same test to read a refreshed count. */
    closeBellNotifications() {
        cy.get('body').type('{esc}');
    }

    /**
     * The pinned In Review item is a single number (ApprovalQueueBellItem, keyed
     * on `count` alone, not one row per submission), so this confirms exactly
     * one such card renders regardless of how many transactions are In Review.
     */
    assertOnlyOneBellInReviewItem() {
        cy.get(el.bellInReviewItem).should('have.length', 1);
    }

    /** Confirms the pinned In Review item is absent — canSeeInReviewCount gates it to Primary Administrator alone. */
    assertBellInReviewItemNotPresent() {
        cy.get(el.bellInReviewItem).should('not.exist');
    }

    /**
     * The pinned item is written first, unconditionally, in NotificationsOverlay's
     * JSX — before the platform/alert feed's own .map() — so it can never have a
     * preceding sibling in its own container regardless of what else is in the
     * feed. prevAll() being empty is exactly "rendered as the first item".
     */
    assertBellInReviewItemIsFirst() {
        cy.get(el.bellInReviewItem, { timeout: 15000 }).should('be.visible').prevAll().should('have.length', 0);
    }

    /** Loads every page of the queue, then confirms the bell's In Review count equals the total row count. */
    assertQueueRowCountMatchesBellCount() {
        this.loadEntireQueue();
        cy.get(el.queueRows).its('length').then((queueCount) => {
            this.openBellNotifications();
            this.assertBellInReviewCountEquals(queueCount);
        });
    }

    assertQueuePageOpen() {
        cy.url().should('include', '/cards/expense-approvals');
        cy.get(el.pageContainer).should('be.visible');
    }

    assertAttachmentViewerVisible() {
        cy.get(el.attachmentViewerCounter).should('be.visible');
    }

    /**
     * Clicks the 'Expense Approvals' entry in the Cards module's navbar tab
     * list. That tab carries no data-testid (it is missing from NavBar's
     * TAB_TEST_IDS map), so it is matched by its visible label — the same
     * pattern accountingConfiguration's 'Transactions' tab already uses.
     * Requires a Cards-module page to already be open so the tab bar renders.
     */
    openQueueViaCardsNavTab() {
        cy.contains('.ant-tabs-tab', 'Expense Approvals').click();
        this.assertQueuePageOpen();
    }

    /**
     * Confirms the queue's Expense Review pane shows exactly the Transaction
     * Details and Expense information tabs, with no Comments tab.
     */
    assertDetailPaneHasNoCommentsTab() {
        cy.get(el.detailTabsList).find('[role="tab"]').should('have.length', 2);
        cy.get(el.detailTabTransaction).should('be.visible').and('contain.text', 'Transaction details');
        cy.get(el.detailTabExpense).should('be.visible').and('contain.text', 'Expense information');
        cy.get(el.detailPaneContainer).should('not.contain.text', 'Comments');
    }

    /**
     * Every row QueuePane renders carries a status badge hardcoded to In Review
     * (QueueListItem/index.jsx — the queue endpoint serves in-review rows only,
     * per API v3 §6.6), so this confirms that contract is reflected in the DOM
     * rather than re-deriving it from each row's own data.
     */
    assertAllQueueRowsShowInReview() {
        cy.get(el.queueRows).each(($row) => {
            const id = $row.attr('data-testid').replace('queue-row-', '');
            cy.get(`[data-testid="queue-row-status-${id}"]`).should('have.attr', 'data-status', 'in-review');
        });
    }

    /** Every queue row carries its own selection checkbox — the only selection control QueueListItem renders. */
    assertEachQueueRowHasCheckbox() {
        cy.get(el.queueRows).each(($row) => {
            const id = $row.attr('data-testid').replace('queue-row-', '');
            cy.get(`[data-testid="${el.queueRowCheckboxPrefix}${id}"]`).should('exist');
        });
    }

    /**
     * QueuePane renders no select-all control at all (per-row checkboxes are
     * the only selection UI) — checks for the couple of forms one could take
     * (a testid, a labelled control, or an antd Table-style header checkbox)
     * rather than one specific guess.
     */
    assertNoSelectAllControl() {
        cy.get(el.queuePane).find('[data-testid*="select-all"], [data-testid*="selectall"]').should('not.exist');
        cy.get(el.queuePane).contains(/select all/i).should('not.exist');
        cy.get(el.queuePane).find('.ant-table-selection-column, thead .ant-checkbox-wrapper').should('not.exist');
    }

    /** Spies on (without stubbing) the queue's first-page fetch, for assertQueueOrderMatchesServerResponse(). */
    interceptQueueList() {
        cy.intercept('GET', '**/expense/approval/queue*').as('queueList');
    }

    /**
     * Confirms the rows currently rendered are in the same order the server
     * returned them in. Ordering itself (`latest_submit_time ASC, id ASC` —
     * useExpenseApprovalQueueQuery.js) is server-side and has no on-screen
     * timestamp to re-check independently; this only guards against the client
     * silently reordering what it was given.
     */
    assertQueueOrderMatchesServerResponse() {
        return cy.wait('@queueList').then((interception) => {
            const serverIds = (interception.response.body?.data?.items ?? [])
                .map((item) => String(item.expense_approval_id));

            cy.get(el.queueRows).then(($rows) => {
                const domIds = [...$rows]
                    .map((row) => row.getAttribute('data-testid').replace('queue-row-', ''))
                    .slice(0, serverIds.length);
                expect(domIds, 'queue row order should match the server response order').to.deep.equal(serverIds);
            });
        });
    }

    /**
     * Stubs the queue's first GET with a single fixed page — every field on a
     * QueueListItem is optional-chained (App/Pages/Cards/ExpenseApprovals/
     * components/QueueListItem/index.jsx), so a bare `{expense_approval_id}` per
     * item renders without crashing. `hasMore` controls `next_cursor`, which is
     * what QueuePane's `hasNextPage` (and so the check-for-more button) is
     * actually driven by.
     */
    interceptQueueListSinglePage(items, hasMore) {
        cy.intercept('GET', '**/expense/approval/queue*', {
            statusCode: 200,
            body: {
                data: {
                    items,
                    next_cursor: hasMore
                        ? { latest_submit_time: '2026-01-01T00:00:00Z', expense_approval_id: items[items.length - 1]?.expense_approval_id ?? 1 }
                        : null,
                    bulk_selection_limit: 50,
                },
            },
        }).as('queueList');
    }

    /**
     * Stubs successive queue GETs with the given `{items, hasMore}` pages in
     * order — the Nth request gets the Nth page, and every request past the
     * list's end repeats the last page. Used to force auto-load (QueuePane's
     * `autoload = items.length >= 20`) and then let it terminate cleanly.
     */
    interceptQueueListSequence(pages) {
        let callCount = 0;

        cy.intercept('GET', '**/expense/approval/queue*', (req) => {
            const page = pages[Math.min(callCount, pages.length - 1)];
            callCount += 1;

            req.reply({
                statusCode: 200,
                body: {
                    data: {
                        items: page.items,
                        next_cursor: page.hasMore
                            ? { latest_submit_time: '2026-01-01T00:00:00Z', expense_approval_id: page.items[page.items.length - 1]?.expense_approval_id ?? 1 }
                            : null,
                        bulk_selection_limit: 50,
                    },
                },
            });
        }).as('queueList');
    }

    /**
     * Asserts which of the two loading affordances QueuePane is showing —
     * `'button'` (queue-check-for-more-btn, items.length < 20) or `'autoload'`
     * (queue-autoload-sentinel, items.length >= 20). The two are mutually
     * exclusive by construction (`hasNextPage && !autoload` gates the button).
     */
    assertPaginationMode(mode) {
        if (mode === 'button') {
            cy.get(el.queueCheckForMoreBtn).should('be.visible');
            cy.get(el.queueAutoloadSentinel).should('not.exist');
        } else {
            cy.get(el.queueAutoloadSentinel).should('exist');
            cy.get(el.queueCheckForMoreBtn).should('not.exist');
        }
    }

    /** Scrolls the auto-load sentinel into view, the same way a real scroll would trigger its IntersectionObserver. */
    scrollToLoadMore() {
        cy.get(el.queueAutoloadSentinel).scrollIntoView();
    }

    /** The currently active/auto-selected queue row's id, parsed off its own testid. */
    getActiveRowId() {
        return cy.get(el.queueActiveRow)
            .invoke('attr', 'data-testid')
            .then((testId) => Number(testId.replace('queue-row-', '')));
    }

    /** The detail pane's currently displayed transaction id, as text. */
    getActiveTransactionId() {
        return cy.get(el.detailTransactionIdValue).invoke('text');
    }

    assertQueueRowCount(count) {
        cy.get(el.queueRows).should('have.length', count);
    }

    /** Waits for the detail pane to move on to a different transaction than `previousTransactionId`. */
    assertActiveTransactionChangedFrom(previousTransactionId) {
        cy.get(el.detailTransactionIdValue, { timeout: 15000 })
            .invoke('text')
            .should((t) => {
                expect(t.trim()).to.not.equal(String(previousTransactionId).trim());
            });
    }

    /**
     * The queue's Expense Review fields (notes, category, tracking codes, ...)
     * are plain read-only text in every row regardless of approval status —
     * ExpenseDetailPane's `DetailField` is a styled `Typography.Text`, never an
     * antd form control, in this view (App/Pages/Cards/ExpenseApprovals/
     * components/ExpenseDetailPane/index.jsx). So this confirms the active
     * row's fields are non-editable rather than re-checking a status-driven
     * `disabled` transition that does not exist in the implementation.
     */
    assertDetailFieldsAreReadOnly() {
        [el.detailNotesValue, el.detailCategoryValue, el.detailTrackingCode1Value].forEach((locator) => {
            cy.get(locator).should(($field) => {
                expect(['INPUT', 'TEXTAREA', 'SELECT'], `${locator} should not be a form control`)
                    .to.not.include($field.prop('tagName'));
            });
        });
    }

    /**
     * The queue is filter/sort/pagination-free by design — confirms no such
     * control is present in the list pane. Scoped to the queue pane rather than
     * the whole page: the detail pane's own read-only expense fields (category,
     * tracking codes) legitimately render as antd Selects and would otherwise
     * false-positive here.
     */
    assertNoFilterControls() {
        cy.get(el.queuePane).find('[data-testid*="filter"]').should('not.exist');
        cy.get(el.queuePane).find('.ant-select, .ant-picker, .ant-input-search, input[type="search"]').should('not.exist');
    }

    /** Selects the last (most-recently-submitted) queue row and asserts its detail pane is for the given transaction id. */
    assertLastQueueItemMatchesTransaction(transactionId) {
        this.selectQueueItem('last');
        cy.get(el.detailTransactionIdValue, { timeout: 30000 })
            .invoke('text')
            .should((t) => {
                expect(t.trim()).to.equal(String(transactionId));
            });
    }
}
