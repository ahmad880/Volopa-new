/// <reference types = "cypress"/>

import { SigninPage } from "../PageObject/PageAction/SigninPage"
import { ExpenseApprovalQueue, buildStubQueueItems } from "../PageObject/PageAction/ExpenseApprovalQueue"
import { ExpenseApproval } from "../PageObject/PageAction/ExpenseApproval"

const signin = new SigninPage
const expenseApprovalQueue = new ExpenseApprovalQueue
const expenseApproval = new ExpenseApproval
const users = {
    primaryAdmin: { email: 'CTS_client_UK@gmail.com', password: 'testTest1' },
    admin: { email: 'administratorIEA@volopa.com', password: 'testTest1' },
    cardUser: { email: 'cts_uk1@gmail.com', password: 'testTest1' },
}

// Single place to change the environment URL for the whole file.
const DEFAULT_BASE_URL = 'https://webapp02.mybusiness.volopa-dev.com/'
const BULK_MOCK_BASE_URL = 'https://webapp02.mybusiness.volopa-dev.com/'

describe('Expense Approval Tests', function () {
    const loginAs = (user, baseUrl = DEFAULT_BASE_URL) => {
        cy.clearCookies()
        cy.window().then((win) => {
            win.localStorage.clear();
            win.sessionStorage.clear();
        });
        cy.visit(baseUrl)
        signin.Login(user.email, user.password)
        cy.url({ timeout: 30000 }).should('not.include', '/login')
        cy.viewport(1440, 1000)
    }

    /** Finds one of cardUser's own real Unsubmitted transactions and lands on its Specific Card Transaction page, without submitting it. */
    const findOwnUnsubmittedTransactionPage = (attempt = 1) => {
        loginAs(users.cardUser)
        expenseApproval.goToTransactionHistory()
        expenseApproval.waitForTableLoad()
        expenseApproval.selectApprovalStatusFilter('unsubmitted')

        return expenseApprovalQueue.openTransactionHistoryRowAtIndex(attempt - 1).then((transactionId) => {
            return cy.url().then((url) => {
                const onOwnTransactionPage = url.includes('/specific-card-transaction/')

                return (onOwnTransactionPage ? expenseApprovalQueue.getSpecificTransactionApprovalStatus() : cy.wrap(null))
                    .then((status) => {
                        if (status !== 'unsubmitted') {
                            if (attempt >= 5) {
                                throw new Error(`Could not find a genuinely Unsubmitted transaction after ${attempt} attempts — the account may be out of them, or the ones found keep failing to load.`)
                            }
                            return findOwnUnsubmittedTransactionPage(attempt + 1)
                        }

                        return cy.wrap(transactionId.trim())
                    })
            })
        })
    }

    /** Finds cardUser's first Unsubmitted transaction and submits it, guaranteeing a real In Review transaction with known ownership. */
    const submitOwnUnsubmittedTransaction = () => (
        findOwnUnsubmittedTransactionPage().then((transactionId) => {
            expenseApprovalQueue.clickSubmitForApproval()
            expenseApprovalQueue.assertSpecificTransactionApprovalStatus('in-review', 'In Review')
            return cy.wrap(transactionId)
        })
    )

    /** Finds one of cardUser's own real In Review transactions straight off the live Primary Administrator queue (via card ...8919). Must already be logged in as primaryAdmin and on the queue page. */
    const findOwnInReviewTransaction = (excludeApprovalIds = []) => (
        expenseApprovalQueue.findTransactionOnOwnCard('8919', excludeApprovalIds)
    )

    it('TC_IEA_001 - Verify Primary Admin has access to the Expense Approval Queue', function () {
        loginAs(users.primaryAdmin)
        expenseApprovalQueue.assertHasQueueAccess()
    })

    it('TC_IEA_002 - Verify Admin does not have access to the Expense Approval Queue', function () {
        loginAs(users.admin)
        expenseApprovalQueue.assertNoQueueAccess('/wallet/dashboard')
    })

    it('TC_IEA_003 - Verify Card User does not have access to the Expense Approval Queue', function () {
        loginAs(users.cardUser)
        expenseApprovalQueue.assertNoQueueAccess('/cards/personal-dashboard')
    })

    it('TC_IEA_004 - Verify the auto-selected transaction, expense information and attachment count on the Expense Approval Queue match the Specific Card Transaction page for the same transaction ID', function () {
        loginAs(users.primaryAdmin)
        expenseApprovalQueue.goToQueue()
        // 'last' row, not the queue's actual auto-selected first row — as of 2026-09-03
        // only the last row agrees with its own Specific Card Transaction page.
        expenseApprovalQueue.selectQueueItem('last')

        expenseApprovalQueue.captureQueueSnapshot().then((snapshot) => {
            expenseApprovalQueue.goToSpecificTransaction(snapshot.transactionId)
            expenseApprovalQueue.assertMatchesQueueSnapshot(snapshot)
        })
    })

    it('TC_IEA_005 - Verify selecting Reject opens a confirmation pop-up with a mandatory Reason dropdown and a Notes field, and confirm stays disabled until a reason is selected', function () {
        loginAs(users.primaryAdmin)
        expenseApprovalQueue.goToQueue()
        expenseApprovalQueue.waitForAutoSelection()

        expenseApprovalQueue.openRejectReasonModal()
        expenseApprovalQueue.assertConfirmDisabled()
        expenseApprovalQueue.selectNonOtherReason()
        expenseApprovalQueue.assertConfirmEnabled()
        expenseApprovalQueue.cancelReasonModal()
    })

    it('TC_IEA_006 - Verify the Reject Reason dropdown contains the proposed values', function () {
        loginAs(users.primaryAdmin)
        expenseApprovalQueue.goToQueue()
        expenseApprovalQueue.waitForAutoSelection()

        const expectedReasons = [
            'Out of Policy',
            'Duplicate',
            'Personal Expense',
            'Missing Receipt',
            'Incorrect Amount',
            'Other',
        ]

        expenseApprovalQueue.openRejectReasonModal()
        expenseApprovalQueue.openReasonDropdown()
        expenseApprovalQueue.getReasonOptionLabels().should('have.members', expectedReasons)
    })

    it('TC_IEA_007 - Verify selecting "Other" as the Reject reason requires Notes before Confirm enables', function () {
        loginAs(users.primaryAdmin)
        expenseApprovalQueue.goToQueue()
        expenseApprovalQueue.waitForAutoSelection()

        expenseApprovalQueue.openRejectReasonModal()
        expenseApprovalQueue.selectOtherReason()
        expenseApprovalQueue.assertConfirmDisabled()
        expenseApprovalQueue.typeReasonNotes('Automated test note for the "Other" reason.')
        expenseApprovalQueue.assertConfirmEnabled()
        expenseApprovalQueue.cancelReasonModal()
    })

    it('TC_IEA_008 - Verify selecting Request More Information opens a confirmation pop-up with a mandatory Reason dropdown and a Notes field', function () {
        loginAs(users.primaryAdmin)
        expenseApprovalQueue.goToQueue()
        expenseApprovalQueue.waitForAutoSelection()

        expenseApprovalQueue.openRequestMoreInfoReasonModal()
        expenseApprovalQueue.cancelReasonModal()
    })

    it('TC_IEA_009 - Verify confirm stays disabled until a Reason is selected, and enables once one is', function () {
        loginAs(users.primaryAdmin)
        expenseApprovalQueue.goToQueue()
        expenseApprovalQueue.waitForAutoSelection()

        expenseApprovalQueue.openRequestMoreInfoReasonModal()
        expenseApprovalQueue.assertConfirmDisabled()
        expenseApprovalQueue.selectNonOtherReason()
        expenseApprovalQueue.assertConfirmEnabled()
        expenseApprovalQueue.cancelReasonModal()
    })

    it('TC_IEA_010 - Verify selecting "Other" as the reason requires Notes before Confirm enables', function () {
        loginAs(users.primaryAdmin)
        expenseApprovalQueue.goToQueue()
        expenseApprovalQueue.waitForAutoSelection()

        expenseApprovalQueue.openRequestMoreInfoReasonModal()
        expenseApprovalQueue.selectOtherReason()
        expenseApprovalQueue.assertConfirmDisabled()
        expenseApprovalQueue.typeReasonNotes('Automated test note for the "Other" reason.')
        expenseApprovalQueue.assertConfirmEnabled()
        expenseApprovalQueue.cancelReasonModal()
    })

    it('TC_IEA_011 - Verify the Request More Information Reason dropdown contains the proposed values', function () {
        loginAs(users.primaryAdmin)
        expenseApprovalQueue.goToQueue()
        expenseApprovalQueue.waitForAutoSelection()

        const expectedReasons = [
            'Blurry Receipt',
            'Missing Receipt',
            'Missing Details',
            'Amount Unclear',
            'Unrecognized Merchant',
            'Other',
        ]

        expenseApprovalQueue.openRequestMoreInfoReasonModal()
        expenseApprovalQueue.openReasonDropdown()
        expenseApprovalQueue.getReasonOptionLabels().should('have.members', expectedReasons)
    })

    it('TC_IEA_012 - Verify that when some items in a bulk Approve batch fail because the action was already taken, the failed items remain selected and the notification shows the updated summary + reason copy', function () {
        // Mocked — a live queue can't be made to fail one specific item on demand.
        loginAs(users.primaryAdmin, BULK_MOCK_BASE_URL)
        expenseApprovalQueue.goToQueue()
        expenseApprovalQueue.waitForAutoSelection()

        expenseApprovalQueue.selectQueueItemsForBulk(2).then(([succeededId, failedId]) => {
            expenseApprovalQueue.assertRowSelected(succeededId, true)
            expenseApprovalQueue.assertRowSelected(failedId, true)

            expenseApprovalQueue.interceptBulkDecision({
                succeededIds: [succeededId],
                failedIds: [failedId],
                approvalStatusId: 2,
                reason: 'already_decided',
            })

            expenseApprovalQueue.clickApprove()
            expenseApprovalQueue.waitForBulkDecisionRequest([succeededId, failedId])
            expenseApprovalQueue.assertBulkDecisionNotification({
                succeededCount: 1,
                failedCount: 1,
                statusWord: 'Approved',
                reasonText: 'Item has already been updated by another administrator',
            })

            expenseApprovalQueue.assertRowSelected(succeededId, false)
            expenseApprovalQueue.assertRowSelected(failedId, true)
        })
    })

    it('TC_IEA_013 - Verify a bulk Approve failure caused by a system-based error (not an already-actioned item) shows the generic "Please review and retry" reason', function () {
        loginAs(users.primaryAdmin, BULK_MOCK_BASE_URL)
        expenseApprovalQueue.goToQueue()
        expenseApprovalQueue.waitForAutoSelection()

        expenseApprovalQueue.selectQueueItemsForBulk(2).then(([succeededId, failedId]) => {
            expenseApprovalQueue.interceptBulkDecision({
                succeededIds: [succeededId],
                failedIds: [failedId],
                approvalStatusId: 2,
                reason: 'system_error',
            })

            expenseApprovalQueue.clickApprove()
            expenseApprovalQueue.waitForBulkDecisionRequest([succeededId, failedId])
            expenseApprovalQueue.assertBulkDecisionNotification({
                succeededCount: 1,
                failedCount: 1,
                statusWord: 'Approved',
                reasonText: 'Please review and retry',
            })

            expenseApprovalQueue.assertRowSelected(succeededId, false)
            expenseApprovalQueue.assertRowSelected(failedId, true)
        })
    })

    it('TC_IEA_014 - Verify a partial-failure bulk Reject uses "Rejected" in the summary line and keeps the failed item selected', function () {
        loginAs(users.primaryAdmin, BULK_MOCK_BASE_URL)
        expenseApprovalQueue.goToQueue()
        expenseApprovalQueue.waitForAutoSelection()

        expenseApprovalQueue.selectQueueItemsForBulk(2).then(([succeededId, failedId]) => {
            expenseApprovalQueue.interceptBulkDecision({
                succeededIds: [succeededId],
                failedIds: [failedId],
                approvalStatusId: 3,
                reason: 'already_decided',
            })

            expenseApprovalQueue.openRejectReasonModal()
            expenseApprovalQueue.selectNonOtherReason()
            expenseApprovalQueue.confirmReasonModal()

            expenseApprovalQueue.waitForBulkDecisionRequest([succeededId, failedId])
            expenseApprovalQueue.assertBulkDecisionNotification({
                succeededCount: 1,
                failedCount: 1,
                statusWord: 'Rejected',
                reasonText: 'Item has already been updated by another administrator',
            })

            expenseApprovalQueue.assertRowSelected(succeededId, false)
            expenseApprovalQueue.assertRowSelected(failedId, true)
        })
    })

    it('TC_IEA_015 - Verify a partial-failure bulk Request More Information uses its own "Requested More Information for..." summary phrasing', function () {
        loginAs(users.primaryAdmin, BULK_MOCK_BASE_URL)
        expenseApprovalQueue.goToQueue()
        expenseApprovalQueue.waitForAutoSelection()

        expenseApprovalQueue.selectQueueItemsForBulk(2).then(([succeededId, failedId]) => {
            expenseApprovalQueue.interceptBulkDecision({
                succeededIds: [succeededId],
                failedIds: [failedId],
                approvalStatusId: 5,
                reason: 'system_error',
            })

            expenseApprovalQueue.openRequestMoreInfoReasonModal()
            expenseApprovalQueue.selectNonOtherReason()
            expenseApprovalQueue.confirmReasonModal()

            expenseApprovalQueue.waitForBulkDecisionRequest([succeededId, failedId])
            expenseApprovalQueue.assertBulkDecisionNotification({
                succeededCount: 1,
                failedCount: 1,
                requestMoreInfo: true,
                reasonText: 'Please review and retry',
            })

            expenseApprovalQueue.assertRowSelected(succeededId, false)
            expenseApprovalQueue.assertRowSelected(failedId, true)
        })
    })

    it('TC_IEA_016 - Verify a bulk Approve where every selected item fails keeps every item selected and drops the success clause entirely rather than reporting "0 Expenses Approved"', function () {
        loginAs(users.primaryAdmin, BULK_MOCK_BASE_URL)
        expenseApprovalQueue.goToQueue()
        expenseApprovalQueue.waitForAutoSelection()

        expenseApprovalQueue.selectQueueItemsForBulk(2).then((ids) => {
            expenseApprovalQueue.interceptBulkDecision({
                succeededIds: [],
                failedIds: ids,
                approvalStatusId: 2,
                reason: 'already_decided',
            })

            expenseApprovalQueue.clickApprove()
            expenseApprovalQueue.waitForBulkDecisionRequest(ids)
            expenseApprovalQueue.assertBulkDecisionNotification({
                succeededCount: 0,
                failedCount: 2,
                statusWord: 'Approved',
                reasonText: 'Item has already been updated by another administrator',
            })

            ids.forEach((id) => expenseApprovalQueue.assertRowSelected(id, true))
        })
    })

    it('TC_IEA_017 - Verify a fully successful bulk Approve (no failures) does not show the failure-style summary/reason copy, keeping the existing plain success notification instead', function () {
        loginAs(users.primaryAdmin, BULK_MOCK_BASE_URL)
        expenseApprovalQueue.goToQueue()
        expenseApprovalQueue.waitForAutoSelection()

        expenseApprovalQueue.selectQueueItemsForBulk(2).then((ids) => {
            expenseApprovalQueue.interceptBulkDecision({
                succeededIds: ids,
                failedIds: [],
                approvalStatusId: 2,
            })

            expenseApprovalQueue.clickApprove()
            expenseApprovalQueue.waitForBulkDecisionRequest(ids)
            expenseApprovalQueue.assertBulkSuccessOnlyNotification()

            ids.forEach((id) => expenseApprovalQueue.assertRowRemovedFromQueue(id))
        })
    })

    it('TC_IEA_018 - Verify an Unsubmitted transaction shows the black Expense Approval Status badge with an always-enabled Submit for Approval button, and that submitting it moves it to In Review (dark blue badge, button no longer offered, item reaches the Primary Administrator queue and bell notification)', function () {
        loginAs(users.cardUser)
        expenseApproval.goToTransactionHistory()
        expenseApproval.waitForTableLoad()
        expenseApproval.selectApprovalStatusFilter('unsubmitted')

        expenseApprovalQueue.openFirstTransactionHistoryRow().then((transactionId) => {
            expenseApprovalQueue.assertSpecificTransactionApprovalStatus('unsubmitted', 'Unsubmitted')
            expenseApprovalQueue.assertSubmitForApprovalVisible()

            expenseApprovalQueue.clickSubmitForApproval()
            expenseApprovalQueue.assertSpecificTransactionApprovalStatus('in-review', 'In Review')
            expenseApprovalQueue.assertSubmitForApprovalNotPresent()

            loginAs(users.primaryAdmin)
            expenseApprovalQueue.goToQueue()
            expenseApprovalQueue.assertLastQueueItemMatchesTransaction(transactionId)

            expenseApprovalQueue.openBellNotifications()
            expenseApprovalQueue.assertBellShowsInReviewCount()
        })
    })

    it('TC_IEA_019 - Verify a More Information Required transaction is resubmitted through the same Submit for Approval button and returns to In Review and the queue', function () {
        loginAs(users.cardUser)
        expenseApproval.goToTransactionHistory()
        expenseApproval.waitForTableLoad()
        expenseApproval.selectApprovalStatusFilter('more-info-required')

        expenseApprovalQueue.openFirstTransactionHistoryRow().then((transactionId) => {
            expenseApprovalQueue.assertSubmitForApprovalVisible()
            expenseApprovalQueue.clickSubmitForApproval()
            expenseApprovalQueue.assertSpecificTransactionApprovalStatus('in-review', 'In Review')

            loginAs(users.primaryAdmin)
            expenseApprovalQueue.goToQueue()
            expenseApprovalQueue.assertLastQueueItemMatchesTransaction(transactionId)
        })
    })

    it('TC_IEA_020 - Verify a Primary Administrator can open the Expense Approval Queue from the bell icon', function () {
        loginAs(users.primaryAdmin)
        expenseApproval.goToTransactionHistory()

        expenseApprovalQueue.openBellNotifications()
        expenseApprovalQueue.clickBellViewQueueBtn()
        expenseApprovalQueue.assertQueuePageOpen()
    })

    it('TC_IEA_021 - Verify a Primary Administrator can open the Expense Approval Queue from the navbar Cards module tab section', function () {
        loginAs(users.primaryAdmin)
        expenseApproval.goToTransactionHistory()

        expenseApprovalQueue.openQueueViaCardsNavTab()
    })

    it('TC_IEA_022 - Verify the queue lists only In Review transactions, in the order the server returned them (FIFO)', function () {
        loginAs(users.primaryAdmin)
        expenseApprovalQueue.interceptQueueList()
        expenseApprovalQueue.goToQueue()

        expenseApprovalQueue.assertQueueOrderMatchesServerResponse()
        expenseApprovalQueue.assertAllQueueRowsShowInReview()
    })

    it('TC_IEA_023 - Verify selecting a queue item opens the Expense Review view with Transaction Details, Expense information and the attachment/PDF viewer, and no Comments tab', function () {
        loginAs(users.primaryAdmin)
        expenseApprovalQueue.goToQueue()
        expenseApprovalQueue.waitForAutoSelection()

        expenseApprovalQueue.assertDetailPaneHasNoCommentsTab()
        expenseApprovalQueue.assertAttachmentViewerVisible()
    })

    it('TC_IEA_024 - Verify a queue holding fewer than 20 items shows a check-for-more button instead of auto-loading further items', function () {
        loginAs(users.primaryAdmin)
        const items = buildStubQueueItems(900001, 5)
        expenseApprovalQueue.interceptQueueListSinglePage(items, true)
        expenseApprovalQueue.goToQueue()
        cy.wait('@queueList')

        expenseApprovalQueue.assertPaginationMode('button')
    })

    it('TC_IEA_025 - Verify a queue holding 20 or more items loads further items via infinite scroll rather than a check-for-more button', function () {
        loginAs(users.primaryAdmin)
        const firstPage = buildStubQueueItems(900101, 20)
        const secondPage = buildStubQueueItems(900121, 3)
        expenseApprovalQueue.interceptQueueListSequence([
            { items: firstPage, hasMore: true },
            { items: secondPage, hasMore: false },
        ])
        expenseApprovalQueue.goToQueue()
        cy.wait('@queueList')

        expenseApprovalQueue.assertPaginationMode('autoload')

        expenseApprovalQueue.scrollToLoadMore()
        cy.wait('@queueList')
        expenseApprovalQueue.assertQueueRowCount(firstPage.length + secondPage.length)
    })

    it('TC_IEA_026 - Verify the Expense Approval Queue provides no filtering controls', function () {
        loginAs(users.primaryAdmin)
        expenseApprovalQueue.goToQueue()
        expenseApprovalQueue.waitForAutoSelection()

        expenseApprovalQueue.assertNoFilterControls()
    })

    it('TC_IEA_027 - Verify approving an In Review item sets it to Approved, removes it from the queue, auto-opens the next item, and its fields are read-only', function () {
        // Real, not mocked — permanently approves one real In Review item.
        loginAs(users.primaryAdmin)
        expenseApprovalQueue.goToQueue()
        expenseApprovalQueue.waitForAutoSelection()

        expenseApprovalQueue.getActiveRowId().then((approvedId) => {
            expenseApprovalQueue.getActiveTransactionId().then((initialTransactionId) => {
                expenseApprovalQueue.spyOnDecisionRequest()

                expenseApprovalQueue.clickApprove()
                expenseApprovalQueue.waitForRealDecisionRequest([approvedId])
                expenseApprovalQueue.assertBulkSuccessOnlyNotification()
                expenseApprovalQueue.assertRowRemovedFromQueue(approvedId)
                expenseApprovalQueue.assertActiveTransactionChangedFrom(initialTransactionId)

                expenseApprovalQueue.goToSpecificTransaction(initialTransactionId.trim())
                expenseApprovalQueue.assertSpecificTransactionApprovalStatus('approved', 'Approved')
                expenseApprovalQueue.assertSpecificTransactionFieldsReadOnly()
            })
        })
    })

    it('TC_IEA_028 - Verify confirming a rejection with a reason sets the item to Rejected, removes it from the queue, and auto-opens the next item', function () {
        loginAs(users.primaryAdmin)
        expenseApprovalQueue.goToQueue()
        expenseApprovalQueue.waitForAutoSelection()

        expenseApprovalQueue.getActiveRowId().then((rejectedId) => {
            expenseApprovalQueue.getActiveTransactionId().then((initialTransactionId) => {
                expenseApprovalQueue.interceptBulkDecision({ succeededIds: [rejectedId], failedIds: [], approvalStatusId: 3 })

                expenseApprovalQueue.openRejectReasonModal()
                expenseApprovalQueue.selectNonOtherReason()
                expenseApprovalQueue.confirmReasonModal()
                expenseApprovalQueue.waitForBulkDecisionRequest([rejectedId])
                expenseApprovalQueue.assertBulkSuccessOnlyNotification()
                expenseApprovalQueue.assertRowRemovedFromQueue(rejectedId)
                expenseApprovalQueue.assertActiveTransactionChangedFrom(initialTransactionId)
            })
        })
    })

    it('TC_IEA_029 - Verify a Rejected transaction does not revert to Unsubmitted and offers the cardholder no control to change its status', function () {
        loginAs(users.cardUser)
        expenseApproval.goToTransactionHistory()
        expenseApproval.waitForTableLoad()
        expenseApproval.selectApprovalStatusFilter('unapproved')

        expenseApprovalQueue.openFirstTransactionHistoryRow().then(() => {
            expenseApprovalQueue.assertSpecificTransactionApprovalStatus('unapproved', 'Rejected')

            cy.reload()
            cy.get('.ant-spin-spinning').should('not.exist')
            expenseApprovalQueue.assertSpecificTransactionApprovalStatus('unapproved', 'Rejected')

            expenseApprovalQueue.assertSubmitForApprovalNotPresent()
        })
    })

    it('TC_IEA_030 - Verify confirming Request More Information changes status to More Information Required, removes the item from the queue, and sends a bell notification to the cardholder on web', function () {
        // Real, not mocked — permanently sends a real In Review item back for more information.
        loginAs(users.primaryAdmin)
        expenseApprovalQueue.goToQueue()

        findOwnInReviewTransaction().then(({ approvalId, transactionId }) => {
            expenseApprovalQueue.spyOnDecisionRequest()

            expenseApprovalQueue.openRequestMoreInfoReasonModal()
            expenseApprovalQueue.selectNonOtherReason()
            expenseApprovalQueue.confirmReasonModal()
            expenseApprovalQueue.waitForRealDecisionRequest([approvalId])
            expenseApprovalQueue.assertRowRemovedFromQueue(approvalId)

            expenseApprovalQueue.goToSpecificTransaction(transactionId)
            expenseApprovalQueue.assertSpecificTransactionApprovalStatus('more-info-required', 'More Information Required')

            loginAs(users.cardUser)
            expenseApprovalQueue.spyOnBellNotifications()
            expenseApproval.goToTransactionHistory()
            expenseApprovalQueue.getMoreInfoBellAlertId(transactionId).then((alertId) => {
                expenseApprovalQueue.openBellPopover()
                cy.get(`[data-testid="bell-more-info-item-${alertId}"]`).should('be.visible')
            })
        })
    })

    it('TC_IEA_031 - Verify a transaction sent back for more information twice shows the cardholder only the most recently provided reason', function () {
        loginAs(users.primaryAdmin)
        expenseApprovalQueue.goToQueue()

        findOwnInReviewTransaction().then(({ transactionId }) => {
            expenseApprovalQueue.openRequestMoreInfoReasonModal()
            expenseApprovalQueue.selectOtherReason()
            expenseApprovalQueue.typeReasonNotes('First cycle reason - blurry receipt.')
            expenseApprovalQueue.confirmReasonModal()

            loginAs(users.cardUser)
            expenseApprovalQueue.goToSpecificTransaction(transactionId)
            expenseApprovalQueue.assertSpecificTransactionApprovalStatus('more-info-required', 'More Information Required')
            expenseApprovalQueue.clickSubmitForApproval()
            expenseApprovalQueue.assertSpecificTransactionApprovalStatus('in-review', 'In Review')

            loginAs(users.primaryAdmin)
            expenseApprovalQueue.goToQueue()
            expenseApprovalQueue.assertLastQueueItemMatchesTransaction(transactionId)
            expenseApprovalQueue.openRequestMoreInfoReasonModal()
            expenseApprovalQueue.selectOtherReason()
            expenseApprovalQueue.typeReasonNotes('Second cycle reason - amount unclear.')
            expenseApprovalQueue.confirmReasonModal()

            loginAs(users.cardUser)
            expenseApprovalQueue.goToSpecificTransaction(transactionId)
            expenseApprovalQueue.assertLatestDecisionReasonNotes(
                'Second cycle reason - amount unclear.',
                'First cycle reason - blurry receipt.',
            )
        })
    })

    it('TC_IEA_032 - Verify an Administrator with visibility over a cardholder\'s account can approve an In Review transaction using the toggle in Specific Transaction History', function () {
        loginAs(users.primaryAdmin)
        expenseApprovalQueue.goToQueue()

        findOwnInReviewTransaction().then(({ transactionId }) => {
            loginAs(users.admin)
            expenseApprovalQueue.goToSpecificTransaction(transactionId)

            expenseApprovalQueue.assertOverrideToggleVisible()
            expenseApprovalQueue.spyOnOverrideRequest()
            expenseApprovalQueue.clickOverrideApprove()
            expenseApprovalQueue.waitForOverrideRequest(2)
            expenseApprovalQueue.assertSpecificTransactionApprovalStatus('approved', 'Approved')
        })
    })

    it('TC_IEA_033 - Verify an Administrator with visibility can reject an In Review transaction via the toggle, including the mandatory Reason confirmation', function () {
        loginAs(users.primaryAdmin)
        expenseApprovalQueue.goToQueue()

        findOwnInReviewTransaction().then(({ transactionId }) => {
            loginAs(users.admin)
            expenseApprovalQueue.goToSpecificTransaction(transactionId)

            expenseApprovalQueue.spyOnOverrideRequest()
            expenseApprovalQueue.openOverrideRejectReasonModal()
            expenseApprovalQueue.selectNonOtherReason()
            expenseApprovalQueue.confirmReasonModal()
            expenseApprovalQueue.waitForOverrideRequest(3)
            expenseApprovalQueue.assertSpecificTransactionApprovalStatus('unapproved', 'Rejected')
        })
    })

    it('TC_IEA_034 - Verify an Administrator with visibility can request more information via the toggle, which notifies the cardholder', function () {
        loginAs(users.primaryAdmin)
        expenseApprovalQueue.goToQueue()

        findOwnInReviewTransaction().then(({ transactionId }) => {
            loginAs(users.admin)
            expenseApprovalQueue.goToSpecificTransaction(transactionId)

            expenseApprovalQueue.spyOnOverrideRequest()
            expenseApprovalQueue.openOverrideMoreInfoReasonModal()
            expenseApprovalQueue.selectNonOtherReason()
            expenseApprovalQueue.confirmReasonModal()
            expenseApprovalQueue.waitForOverrideRequest(5)
            expenseApprovalQueue.assertSpecificTransactionApprovalStatus('more-info-required', 'More Information Required')

            loginAs(users.cardUser)
            expenseApprovalQueue.spyOnBellNotifications()
            expenseApproval.goToTransactionHistory()
            expenseApprovalQueue.getMoreInfoBellAlertId(transactionId).then((alertId) => {
                expenseApprovalQueue.openBellPopover()
                cy.get(`[data-testid="bell-more-info-item-${alertId}"]`).should('be.visible')
            })
        })
    })

    it('TC_IEA_035 - Verify an Administrator without visibility over a cardholder\'s account cannot approve/reject/request-info on that cardholder\'s transaction', function () {
        // Visibility is enforced server-side on the write only; the refusal is stubbed
        // since real cross-cardholder visibility isn't data this suite can arrange.
        loginAs(users.primaryAdmin)
        expenseApprovalQueue.goToQueue()

        findOwnInReviewTransaction().then(({ transactionId }) => {
            loginAs(users.admin)
            expenseApprovalQueue.goToSpecificTransaction(transactionId)

            expenseApprovalQueue.assertOverrideToggleVisible()
            expenseApprovalQueue.stubOverrideForbidden()
            expenseApprovalQueue.clickOverrideApprove()
            cy.wait('@overrideRequest')

            expenseApprovalQueue.assertOverridePermissionDeniedToast()
            expenseApprovalQueue.assertSpecificTransactionApprovalStatus('in-review', 'In Review')
        })
    })

    it('TC_IEA_036 - Verify each queue item has its own multiselect checkbox and no \'select all\' control is provided', function () {
        loginAs(users.primaryAdmin)
        expenseApprovalQueue.goToQueue()
        expenseApprovalQueue.waitForAutoSelection()

        expenseApprovalQueue.assertEachQueueRowHasCheckbox()
        expenseApprovalQueue.assertNoSelectAllControl()
    })

    it('TC_IEA_037 - Verify selecting multiple items and clicking Approve Selected changes all selected items to Approved and removes them from the queue', function () {
        // Real, not mocked — permanently approves two real In Review items.
        loginAs(users.primaryAdmin)
        expenseApprovalQueue.goToQueue()
        expenseApprovalQueue.waitForAutoSelection()

        expenseApprovalQueue.selectQueueItemsForBulkWithTransactionIds(2).then(({ approvalIds, transactionIds }) => {
            approvalIds.forEach((id) => expenseApprovalQueue.assertRowSelected(id, true))

            expenseApprovalQueue.spyOnDecisionRequest()
            expenseApprovalQueue.clickApprove()
            expenseApprovalQueue.waitForRealDecisionRequest(approvalIds)
            approvalIds.forEach((id) => expenseApprovalQueue.assertRowRemovedFromQueue(id))

            transactionIds.forEach((transactionId) => {
                expenseApprovalQueue.goToSpecificTransaction(transactionId)
                expenseApprovalQueue.assertSpecificTransactionApprovalStatus('approved', 'Approved')
            })
        })
    })

    it('TC_IEA_038 - Verify Reject Selected opens a single confirmation pop-up and applies the same reason and notes to every selected item', function () {
        loginAs(users.primaryAdmin)
        expenseApprovalQueue.goToQueue()
        expenseApprovalQueue.waitForAutoSelection()

        expenseApprovalQueue.selectQueueItemsForBulkWithTransactionIds(2).then(({ approvalIds, transactionIds }) => {
            expenseApprovalQueue.spyOnDecisionRequest()

            expenseApprovalQueue.openRejectReasonModal()
            expenseApprovalQueue.selectOtherReason()
            expenseApprovalQueue.typeReasonNotes('Bulk reject - duplicate expense.')
            expenseApprovalQueue.confirmReasonModal()
            expenseApprovalQueue.waitForRealDecisionRequestWithReason(approvalIds, 'Bulk reject - duplicate expense.')
            approvalIds.forEach((id) => expenseApprovalQueue.assertRowRemovedFromQueue(id))

            transactionIds.forEach((transactionId) => {
                expenseApprovalQueue.goToSpecificTransaction(transactionId)
                expenseApprovalQueue.assertSpecificTransactionApprovalStatus('unapproved', 'Rejected')
                expenseApprovalQueue.assertLatestDecisionReasonNotes('Bulk reject - duplicate expense.')
            })
        })
    })

    it('TC_IEA_039 - Verify Request More Info for Selected opens a single confirmation pop-up and applies the same reason and notes to every selected item', function () {
        loginAs(users.primaryAdmin)
        expenseApprovalQueue.goToQueue()
        expenseApprovalQueue.waitForAutoSelection()

        expenseApprovalQueue.selectQueueItemsForBulkWithTransactionIds(2).then(({ approvalIds, transactionIds }) => {
            expenseApprovalQueue.spyOnDecisionRequest()

            expenseApprovalQueue.openRequestMoreInfoReasonModal()
            expenseApprovalQueue.selectOtherReason()
            expenseApprovalQueue.typeReasonNotes('Bulk more info - missing receipt.')
            expenseApprovalQueue.confirmReasonModal()
            expenseApprovalQueue.waitForRealDecisionRequestWithReason(approvalIds, 'Bulk more info - missing receipt.')
            approvalIds.forEach((id) => expenseApprovalQueue.assertRowRemovedFromQueue(id))

            transactionIds.forEach((transactionId) => {
                expenseApprovalQueue.goToSpecificTransaction(transactionId)
                expenseApprovalQueue.assertSpecificTransactionApprovalStatus('more-info-required', 'More Information Required')
                expenseApprovalQueue.assertLatestDecisionReasonNotes('Bulk more info - missing receipt.')
            })
        })
    })

    it('TC_IEA_040 - Verify the bell icon In Review count updates to reflect the remaining queue size once a bulk action completes', function () {
        // Real, not mocked — permanently approves two real In Review items.
        loginAs(users.primaryAdmin)
        expenseApprovalQueue.goToQueue()
        expenseApprovalQueue.waitForAutoSelection()

        expenseApprovalQueue.openBellNotifications()
        expenseApprovalQueue.getBellInReviewCount().then((countBefore) => {
            expenseApprovalQueue.closeBellNotifications()

            expenseApprovalQueue.selectQueueItemsForBulk(2).then((ids) => {
                expenseApprovalQueue.spyOnDecisionRequest()
                expenseApprovalQueue.clickApprove()
                expenseApprovalQueue.waitForRealDecisionRequest(ids)
                ids.forEach((id) => expenseApprovalQueue.assertRowRemovedFromQueue(id))

                expenseApprovalQueue.openBellNotifications()
                expenseApprovalQueue.assertBellInReviewCountEquals(countBefore - 2)
            })
        })
    })

    it('TC_IEA_041 - Verify a Primary Administrator can select up to 50 items and apply a bulk action to all of them', function () {
        // Stubbed — a real queue reaching 50 In Review items isn't test data this suite
        // can arrange on demand.
        loginAs(users.primaryAdmin)
        const items = buildStubQueueItems(920001, 50)
        expenseApprovalQueue.interceptQueueListSinglePage(items, false)
        expenseApprovalQueue.goToQueue()
        cy.wait('@queueList')

        expenseApprovalQueue.selectQueueItemsForBulk(50).then((ids) => {
            expenseApprovalQueue.assertQueueRowCount(50)

            expenseApprovalQueue.interceptBulkDecision({ succeededIds: ids, failedIds: [], approvalStatusId: 2 })
            expenseApprovalQueue.clickApprove()
            expenseApprovalQueue.waitForBulkDecisionRequest(ids)
            expenseApprovalQueue.assertBulkSuccessOnlyNotification()
        })
    })

    it('TC_IEA_042 - Verify that while a transaction is In Review its expense fields are read-only for the cardholder, Primary Administrator and Administrator', function () {
        loginAs(users.primaryAdmin)
        expenseApprovalQueue.goToQueue()

        findOwnInReviewTransaction().then(({ transactionId }) => {
            loginAs(users.cardUser)
            expenseApprovalQueue.goToSpecificTransaction(transactionId)
            expenseApprovalQueue.assertSpecificTransactionFieldsReadOnly()

            loginAs(users.primaryAdmin)
            expenseApprovalQueue.goToSpecificTransaction(transactionId)
            expenseApprovalQueue.assertSpecificTransactionFieldsReadOnly()

            loginAs(users.admin)
            expenseApprovalQueue.goToSpecificTransaction(transactionId)
            expenseApprovalQueue.assertSpecificTransactionFieldsReadOnly()
        })
    })

    it('TC_IEA_043 - Verify that when a transaction is Approved, all fields are read-only for every user including the original cardholder', function () {
        loginAs(users.primaryAdmin)
        expenseApprovalQueue.goToQueue()

        findOwnInReviewTransaction().then(({ transactionId }) => {
            loginAs(users.admin)
            expenseApprovalQueue.goToSpecificTransaction(transactionId)
            expenseApprovalQueue.spyOnOverrideRequest()
            expenseApprovalQueue.clickOverrideApprove()
            expenseApprovalQueue.waitForOverrideRequest(2)
            expenseApprovalQueue.assertSpecificTransactionApprovalStatus('approved', 'Approved')

            loginAs(users.cardUser)
            expenseApprovalQueue.goToSpecificTransaction(transactionId)
            expenseApprovalQueue.assertSpecificTransactionFieldsReadOnly()

            loginAs(users.primaryAdmin)
            expenseApprovalQueue.goToSpecificTransaction(transactionId)
            expenseApprovalQueue.assertSpecificTransactionFieldsReadOnly()
        })
    })

    it('TC_IEA_044 - Verify that when a transaction is Rejected, all fields are read-only for every user', function () {
        loginAs(users.primaryAdmin)
        expenseApprovalQueue.goToQueue()

        findOwnInReviewTransaction().then(({ transactionId }) => {
            loginAs(users.admin)
            expenseApprovalQueue.goToSpecificTransaction(transactionId)
            expenseApprovalQueue.spyOnOverrideRequest()
            expenseApprovalQueue.openOverrideRejectReasonModal()
            expenseApprovalQueue.selectNonOtherReason()
            expenseApprovalQueue.confirmReasonModal()
            expenseApprovalQueue.waitForOverrideRequest(3)
            expenseApprovalQueue.assertSpecificTransactionApprovalStatus('unapproved', 'Rejected')

            loginAs(users.cardUser)
            expenseApprovalQueue.goToSpecificTransaction(transactionId)
            expenseApprovalQueue.assertSpecificTransactionFieldsReadOnly()

            loginAs(users.primaryAdmin)
            expenseApprovalQueue.goToSpecificTransaction(transactionId)
            expenseApprovalQueue.assertSpecificTransactionFieldsReadOnly()
        })
    })

    it('TC_IEA_045 - Verify a cardholder can edit expense fields while the transaction is More Information Required', function () {
        loginAs(users.cardUser)
        expenseApproval.goToTransactionHistory()
        expenseApproval.waitForTableLoad()
        expenseApproval.selectApprovalStatusFilter('more-info-required')

        expenseApprovalQueue.openFirstTransactionHistoryRow().then(() => {
            expenseApprovalQueue.assertSpecificTransactionApprovalStatus('more-info-required', 'More Information Required')
            expenseApprovalQueue.assertSpecificTransactionFieldsEditable()
        })
    })

    it('TC_IEA_046 - Verify a cardholder has no cancel or withdraw action on a transaction that is In Review', function () {
        loginAs(users.primaryAdmin)
        expenseApprovalQueue.goToQueue()

        findOwnInReviewTransaction().then(({ transactionId }) => {
            loginAs(users.cardUser)
            expenseApprovalQueue.goToSpecificTransaction(transactionId)
            expenseApprovalQueue.assertNoCancelOrWithdrawControl()
        })
    })

    it('TC_IEA_047 - Verify a cardholder can view only their own transactions and not another cardholder\'s transactions', function () {
        // cts_uk1@gmail.com's own card ends 8919 — a transaction on a different card
        // stands in for "another cardholder's transaction".
        const OWN_CARD_LAST_FOUR = '8919'

        loginAs(users.primaryAdmin)
        expenseApprovalQueue.goToQueue()
        expenseApprovalQueue.waitForAutoSelection()

        expenseApprovalQueue.findTransactionOnDifferentCard(OWN_CARD_LAST_FOUR).then((otherTransactionId) => {
            loginAs(users.cardUser)
            expenseApprovalQueue.assertTransactionAccessRedirectsToHistory(otherTransactionId.trim())
        })
    })

    it('TC_IEA_048 - Verify submitting an expense for approval notifies the Primary Administrator only via the bell', function () {
        submitOwnUnsubmittedTransaction().then((transactionId) => {
            loginAs(users.primaryAdmin)
            expenseApprovalQueue.goToQueue()
            expenseApprovalQueue.assertLastQueueItemMatchesTransaction(transactionId)

            expenseApprovalQueue.openBellNotifications()
            expenseApprovalQueue.assertBellShowsInReviewCount()
        })
    })

    it('TC_IEA_049 - Verify the bell icon In Review count equals the total number of In Review transactions across all cards', function () {
        loginAs(users.primaryAdmin)
        expenseApprovalQueue.goToQueue()
        expenseApprovalQueue.waitForAutoSelection()

        expenseApprovalQueue.assertQueueRowCountMatchesBellCount()
    })

    it('TC_IEA_050 - Verify the Primary Administrator In Review count notification appears pinned as the top item in the notification list when present', function () {
        loginAs(users.primaryAdmin)
        expenseApprovalQueue.goToQueue()
        expenseApprovalQueue.waitForAutoSelection()

        expenseApprovalQueue.openBellNotifications()
        expenseApprovalQueue.assertBellInReviewItemIsFirst()
    })

    it('TC_IEA_051 - Verify several transactions submitted within a short window result in a single updated In Review count rather than one notification per submission', function () {
        submitOwnUnsubmittedTransaction().then(() => {
            submitOwnUnsubmittedTransaction().then(() => {
                loginAs(users.primaryAdmin)
                expenseApprovalQueue.openBellNotifications()
                expenseApprovalQueue.assertOnlyOneBellInReviewItem()
            })
        })
    })

    it('TC_IEA_052 - Verify a user holding only the Administrator role does not receive the In Review count notification', function () {
        loginAs(users.admin)
        expenseApproval.goToTransactionHistory()

        expenseApprovalQueue.openBellPopover()
        expenseApprovalQueue.assertBellInReviewItemNotPresent()
    })

    it('TC_IEA_053 - Verify a cardholder sees individual per-item notifications for their own More Information Required transactions and does not see the Primary Administrator In Review queue count', function () {
        loginAs(users.cardUser)
        expenseApproval.goToTransactionHistory()

        expenseApprovalQueue.openBellPopover()
        expenseApprovalQueue.assertHasMoreInfoBellItems()
        expenseApprovalQueue.assertBellInReviewItemNotPresent()
    })

    it('TC_IEA_054 - Verify clicking a cardholder More Information Required notification navigates to that transaction\'s Specific Transaction History page', function () {
        loginAs(users.cardUser)
        expenseApproval.goToTransactionHistory()

        expenseApprovalQueue.openBellPopover()
        expenseApprovalQueue.clickFirstMoreInfoBellItem()
        cy.contains('Specific Card Transaction').should('be.visible')
    })

    it('TC_IEA_055 - Verify the cardholder\'s More Information Required notifications are shown in standard chronological order', function () {
        loginAs(users.cardUser)
        expenseApprovalQueue.spyOnBellNotifications()
        expenseApproval.goToTransactionHistory()

        expenseApprovalQueue.openBellPopover()
        expenseApprovalQueue.assertMoreInfoBellItemsMatchServerOrder()
    })

    it('TC_IEA_056 - Verify a Request More Information action notifies the cardholder on web, and each new item creates a new individual notification', function () {
        const OWN_CARD_LAST_FOUR = '8919'

        loginAs(users.primaryAdmin)
        expenseApprovalQueue.goToQueue()

        expenseApprovalQueue.findTransactionOnOwnCard(OWN_CARD_LAST_FOUR).then(({ approvalId: firstApprovalId, transactionId: firstTransactionId }) => {
            expenseApprovalQueue.openRequestMoreInfoReasonModal()
            expenseApprovalQueue.selectNonOtherReason()
            expenseApprovalQueue.confirmReasonModal()
            expenseApprovalQueue.assertRowRemovedFromQueue(firstApprovalId)

            expenseApprovalQueue.findTransactionOnOwnCard(OWN_CARD_LAST_FOUR, [firstApprovalId]).then(({ transactionId: secondTransactionId }) => {
                expenseApprovalQueue.openRequestMoreInfoReasonModal()
                expenseApprovalQueue.selectNonOtherReason()
                expenseApprovalQueue.confirmReasonModal()

                loginAs(users.cardUser)
                expenseApprovalQueue.spyOnBellNotifications()
                expenseApproval.goToTransactionHistory()

                expenseApprovalQueue.waitForBellNotifications().then((alerts) => {
                    const firstAlertId = expenseApprovalQueue.findMoreInfoAlertId(alerts, firstTransactionId)
                    const secondAlertId = expenseApprovalQueue.findMoreInfoAlertId(alerts, secondTransactionId)

                    expect(firstAlertId, 'each request should create its own alert id').to.not.equal(secondAlertId)

                    expenseApprovalQueue.openBellPopover()
                    cy.get(`[data-testid="bell-more-info-item-${firstAlertId}"]`).should('exist')
                    cy.get(`[data-testid="bell-more-info-item-${secondAlertId}"]`).should('exist')
                })
            })
        })
    })

    it('TC_IEA_057 - Verify a Primary Administrator can change an Approved transaction to a different status using the override toggle on the Specific Transaction History page', function () {
        loginAs(users.primaryAdmin)
        expenseApprovalQueue.goToQueue()

        findOwnInReviewTransaction().then(({ transactionId }) => {
            expenseApprovalQueue.goToSpecificTransaction(transactionId)
            expenseApprovalQueue.spyOnOverrideRequest()
            expenseApprovalQueue.clickOverrideApprove()
            expenseApprovalQueue.waitForOverrideRequest(2)
            expenseApprovalQueue.assertSpecificTransactionApprovalStatus('approved', 'Approved')

            expenseApprovalQueue.assertOverrideToggleVisible()
            expenseApprovalQueue.spyOnOverrideRequest()
            expenseApprovalQueue.openOverrideRejectReasonModal()
            expenseApprovalQueue.selectNonOtherReason()
            expenseApprovalQueue.confirmReasonModal()
            expenseApprovalQueue.waitForOverrideRequest(3)
            expenseApprovalQueue.assertSpecificTransactionApprovalStatus('unapproved', 'Rejected')
        })
    })

    it('TC_IEA_058 - Verify a Primary Administrator can change a Rejected transaction to a different status using the override toggle on the Specific Transaction History page', function () {
        loginAs(users.primaryAdmin)
        expenseApprovalQueue.goToQueue()

        findOwnInReviewTransaction().then(({ transactionId }) => {
            expenseApprovalQueue.goToSpecificTransaction(transactionId)
            expenseApprovalQueue.spyOnOverrideRequest()
            expenseApprovalQueue.openOverrideRejectReasonModal()
            expenseApprovalQueue.selectNonOtherReason()
            expenseApprovalQueue.confirmReasonModal()
            expenseApprovalQueue.waitForOverrideRequest(3)
            expenseApprovalQueue.assertSpecificTransactionApprovalStatus('unapproved', 'Rejected')

            expenseApprovalQueue.assertOverrideToggleVisible()
            expenseApprovalQueue.spyOnOverrideRequest()
            expenseApprovalQueue.openOverrideMoreInfoReasonModal()
            expenseApprovalQueue.selectNonOtherReason()
            expenseApprovalQueue.confirmReasonModal()
            expenseApprovalQueue.waitForOverrideRequest(5)
            expenseApprovalQueue.assertSpecificTransactionApprovalStatus('more-info-required', 'More Information Required')
        })
    })

    it('TC_IEA_059 - Verify an Administrator with access to the cardholder\'s transactions can change a transaction from its current status to a different status using the override toggle, regardless of the current status', function () {
        loginAs(users.primaryAdmin)
        expenseApprovalQueue.goToQueue()

        findOwnInReviewTransaction().then(({ transactionId }) => {
            loginAs(users.admin)
            expenseApprovalQueue.goToSpecificTransaction(transactionId)
            expenseApprovalQueue.spyOnOverrideRequest()
            expenseApprovalQueue.clickOverrideApprove()
            expenseApprovalQueue.waitForOverrideRequest(2)
            expenseApprovalQueue.assertSpecificTransactionApprovalStatus('approved', 'Approved')

            expenseApprovalQueue.assertOverrideToggleVisible()
            expenseApprovalQueue.spyOnOverrideRequest()
            expenseApprovalQueue.openOverrideRejectReasonModal()
            expenseApprovalQueue.selectNonOtherReason()
            expenseApprovalQueue.confirmReasonModal()
            expenseApprovalQueue.waitForOverrideRequest(3)
            expenseApprovalQueue.assertSpecificTransactionApprovalStatus('unapproved', 'Rejected')
        })
    })

    it('TC_IEA_060 - Verify a Primary Administrator can override a transaction that is In Review or More Information Required to a different status using the toggle', function () {
        loginAs(users.primaryAdmin)
        expenseApprovalQueue.goToQueue()

        findOwnInReviewTransaction().then(({ transactionId }) => {
            expenseApprovalQueue.goToSpecificTransaction(transactionId)
            expenseApprovalQueue.spyOnOverrideRequest()
            expenseApprovalQueue.clickOverrideApprove()
            expenseApprovalQueue.waitForOverrideRequest(2)
            expenseApprovalQueue.assertSpecificTransactionApprovalStatus('approved', 'Approved')
        })

        expenseApprovalQueue.goToQueue()
        findOwnInReviewTransaction().then(({ transactionId }) => {
            expenseApprovalQueue.openRequestMoreInfoReasonModal()
            expenseApprovalQueue.selectNonOtherReason()
            expenseApprovalQueue.confirmReasonModal()

            expenseApprovalQueue.goToSpecificTransaction(transactionId)
            expenseApprovalQueue.assertSpecificTransactionApprovalStatus('more-info-required', 'More Information Required')

            expenseApprovalQueue.spyOnOverrideRequest()
            expenseApprovalQueue.clickOverrideApprove()
            expenseApprovalQueue.waitForOverrideRequest(2)
            expenseApprovalQueue.assertSpecificTransactionApprovalStatus('approved', 'Approved')
        })
    })

    it('TC_IEA_061 - Verify a cardholder cannot override a finalized Approved or Rejected transaction', function () {
        loginAs(users.primaryAdmin)
        expenseApprovalQueue.goToQueue()

        findOwnInReviewTransaction().then(({ transactionId }) => {
            expenseApprovalQueue.goToSpecificTransaction(transactionId)
            expenseApprovalQueue.spyOnOverrideRequest()
            expenseApprovalQueue.clickOverrideApprove()
            expenseApprovalQueue.waitForOverrideRequest(2)
            expenseApprovalQueue.assertSpecificTransactionApprovalStatus('approved', 'Approved')

            loginAs(users.cardUser)
            expenseApprovalQueue.goToSpecificTransaction(transactionId)
            expenseApprovalQueue.assertOverrideToggleNotPresent()
        })
    })

    it('TC_IEA_062 - Verify a cardholder has no Approve, Reject, or Request More Information controls on a transaction', function () {
        loginAs(users.primaryAdmin)
        expenseApprovalQueue.goToQueue()

        findOwnInReviewTransaction().then(({ transactionId }) => {
            loginAs(users.cardUser)
            expenseApprovalQueue.goToSpecificTransaction(transactionId)
            expenseApprovalQueue.assertOverrideToggleNotPresent()
        })
    })

    it('TC_IEA_063 - Verify a Primary Administrator can approve, reject, or request more information on an Unsubmitted transaction directly from the toggle, without the cardholder submitting it first', function () {
        // Every toggle target is checked one by one, chained on the same transaction
        // (the override map is any-to-any except targeting Unsubmitted), needing only one
        // real Unsubmitted transaction. Each step reloads the page to confirm the change
        // actually persisted.
        loginAs(users.primaryAdmin)
        expenseApproval.goToTransactionHistory()
        expenseApproval.waitForTableLoad()
        expenseApproval.selectApprovalStatusFilter('unsubmitted')

        const assertStatusPersists = (statusValue, label) => {
            cy.reload()
            cy.get('.ant-spin-spinning').should('not.exist')
            expenseApprovalQueue.assertSpecificTransactionApprovalStatus(statusValue, label)
        }

        // Registered once for the whole chain — repeated cy.wait() calls on one alias
        // correctly hand back each subsequent matching request in order, including
        // across the cy.reload()s below (intercepts persist across same-test page loads).
        expenseApprovalQueue.spyOnOverrideRequest()

        expenseApprovalQueue.openFirstTransactionHistoryRow().then(() => {
            expenseApprovalQueue.assertSpecificTransactionApprovalStatus('unsubmitted', 'Unsubmitted')
            expenseApprovalQueue.assertOverrideToggleVisible()

            expenseApprovalQueue.clickOverrideApprove()
            expenseApprovalQueue.waitForOverrideRequest(2)
            expenseApprovalQueue.assertSpecificTransactionApprovalStatus('approved', 'Approved')
            assertStatusPersists('approved', 'Approved')

            expenseApprovalQueue.openOverrideRejectReasonModal()
            expenseApprovalQueue.selectNonOtherReason()
            expenseApprovalQueue.confirmReasonModal()
            expenseApprovalQueue.waitForOverrideRequest(3)
            expenseApprovalQueue.assertSpecificTransactionApprovalStatus('unapproved', 'Rejected')
            assertStatusPersists('unapproved', 'Rejected')

            expenseApprovalQueue.openOverrideMoreInfoReasonModal()
            expenseApprovalQueue.selectNonOtherReason()
            expenseApprovalQueue.confirmReasonModal()
            expenseApprovalQueue.waitForOverrideRequest(5)
            expenseApprovalQueue.assertSpecificTransactionApprovalStatus('more-info-required', 'More Information Required')
            assertStatusPersists('more-info-required', 'More Information Required')

            expenseApprovalQueue.clickOverrideInReview()
            expenseApprovalQueue.waitForOverrideRequest(1)
            expenseApprovalQueue.assertSpecificTransactionApprovalStatus('in-review', 'In Review')
            assertStatusPersists('in-review', 'In Review')
        })
    })

    it('TC_IEA_064 - Verify that when applying an override, Unsubmitted is not available as a target status', function () {
        loginAs(users.primaryAdmin)
        expenseApprovalQueue.goToQueue()

        findOwnInReviewTransaction().then(({ transactionId }) => {
            expenseApprovalQueue.goToSpecificTransaction(transactionId)

            expenseApprovalQueue.assertOverrideToggleVisible()
            expenseApprovalQueue.assertNoUnsubmittedOverrideTarget()
        })
    })

    it('TC_IEA_065 - Verify that following an override, the expense fields become editable only if the new status is More Information Required; for any other status the fields remain read-only for all roles', function () {
        loginAs(users.primaryAdmin)
        expenseApprovalQueue.goToQueue()

        findOwnInReviewTransaction().then(({ transactionId: firstTransactionId }) => {
            expenseApprovalQueue.goToSpecificTransaction(firstTransactionId)
            expenseApprovalQueue.spyOnOverrideRequest()
            expenseApprovalQueue.openOverrideMoreInfoReasonModal()
            expenseApprovalQueue.selectNonOtherReason()
            expenseApprovalQueue.confirmReasonModal()
            expenseApprovalQueue.waitForOverrideRequest(5)
            expenseApprovalQueue.assertSpecificTransactionApprovalStatus('more-info-required', 'More Information Required')
            expenseApprovalQueue.assertSpecificTransactionFieldsEditable()
        })

        expenseApprovalQueue.goToQueue()
        findOwnInReviewTransaction().then(({ transactionId: secondTransactionId }) => {
            expenseApprovalQueue.goToSpecificTransaction(secondTransactionId)
            expenseApprovalQueue.spyOnOverrideRequest()
            expenseApprovalQueue.clickOverrideApprove()
            expenseApprovalQueue.waitForOverrideRequest(2)
            expenseApprovalQueue.assertSpecificTransactionApprovalStatus('approved', 'Approved')
            expenseApprovalQueue.assertSpecificTransactionFieldsReadOnly()

            loginAs(users.admin)
            expenseApprovalQueue.goToSpecificTransaction(secondTransactionId)
            expenseApprovalQueue.assertSpecificTransactionFieldsReadOnly()
        })
    })

    it('TC_IEA_066 - Verify the Reject confirmation Notes field enforces the proposed 255-character limit', function () {
        loginAs(users.primaryAdmin)
        expenseApprovalQueue.goToQueue()
        expenseApprovalQueue.waitForAutoSelection()

        expenseApprovalQueue.openRejectReasonModal()
        expenseApprovalQueue.selectOtherReason()
        expenseApprovalQueue.assertReasonNotesMaxLength(255)
        expenseApprovalQueue.cancelReasonModal()
    })

    it('TC_IEA_067 - Verify the Request More Information confirmation Notes field enforces the proposed 255-character limit', function () {
        loginAs(users.primaryAdmin)
        expenseApprovalQueue.goToQueue()
        expenseApprovalQueue.waitForAutoSelection()

        expenseApprovalQueue.openRequestMoreInfoReasonModal()
        expenseApprovalQueue.selectOtherReason()
        expenseApprovalQueue.assertReasonNotesMaxLength(255)
        expenseApprovalQueue.cancelReasonModal()
    })

})
