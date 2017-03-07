// not yet utilized in app.js

var BusyIndicatorService = (function($, self) {
    var busy = [],
        loanSubmitBtn;

    function show(selector) {
        $(selector).css("display", "inline-block");
        busy.push(selector);
        checkIfFormIsBusy();
    }

    function hide(selector) {
        $(selector).css("display", "none");
        busy = busy.filter(function(current) {
            return current !== selector;
        });
        checkIfFormIsBusy();
    }

    function isBusy() {
        return busy.length > 0;
    }

    /**
     * Disables the Submit button if a ServiceCall lookup hasn't completed
     */
    function checkIfFormIsBusy() {
        if (isBusy()) {
            loanSubmitBtn.text('Please Wait').attr('disabled', 'disabled');
        } else {
            loanSubmitBtn.text('Submit').removeAttr('disabled');
        }
    }

    function bindElements() {
        loanSubmitBtn = $('#LoanSubmitButton');
    }

    function init() {
        bindElements();
    }
    //public
    self.show = show;
    self.hide = hide;
    self.isBusy = isBusy;
    self.init = init;
    return self;
}(jQuery, BusyIndicatorService || {}));

BusyIndicatorService.init();