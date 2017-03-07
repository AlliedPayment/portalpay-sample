var PopupService = (function($, self) {

    /**
     * Modal displayed to the user if a credit card transaction is declined.
     * @param {string} error 
     */
    function displayCardDeclinedErrorPopup(error) {
        popupTitle.text('Error');
        popupContent.empty().html('<div style="font-size:.85em">' + error + '</div>');
        popupPrintBtn.hide();
        popupWindow.modal('show');
    }

    /**
     * Default error modal
     */
    function displayGenericErrorPopup() {
        popupTitle.text('Error');
        popupContent.empty().html(
            '<div style="font-size:.85em">We were unable to create a payment at this time.<br/><br/>Please contact our Customer Service Department for assistance:<ul><li>Phone: <a href="tel:2603997400">(260) 399-7400</a></li><li>Email: <a href="mailto:support@alliedpayment.com?Subject=PortalPay" target="_top">support@alliedpayment.com</a></li></ul></div>'
        );
        popupPrintBtn.hide();
        popupWindow.modal('show');
    }

    /**
     * Error modal displayed when a duplicate payment has been detected
     */
    function displayDuplicatePaymentErrorPopup() {
        popupTitle.text('Duplicate payment stopped!');
        popupContent.empty().html(
            '<div style="font-size:.85em">We\'ve detected that your payment has already been sent for the amount and account provided.<br/><br/>If you are still experiencing issues or believe you are receiving this screen in error please contact our Customer Service Department for assistance:<ul><li>Phone: <a href="tel:2603997400">(260) 399-7400</a></li><li>Email: <a href="mailto:support@alliedpayment.com?Subject=PortalPay" target="_top">support@alliedpayment.com</a></li></ul></div>'
        );
        popupPrintBtn.hide();
        popupWindow.modal('show');
    }

    self.displayCardDeclinedErrorPopup = displayCardDeclinedErrorPopup;
    self.displayGenericErrorPopup = displayGenericErrorPopup;
    self.displayDuplicatePaymentErrorPopup = displayDuplicatePaymentErrorPopup;
    return self;
}(jQuery, PopupService || {}))