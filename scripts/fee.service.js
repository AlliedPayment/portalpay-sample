var FeeService = (function($, config, busyService, self) {
    var busyIndicator;

    function getFees() {
        $.ajax({
            type: "GET",
            crossDomain: true,
            url: config.urlLoanFees,
            data: {
                domain: config.bankDomain,
                page: config.pageType
            },
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            beforeSend: function() {
                busyIndicator.show('#FeeBusyIndicator');
            },
            complete: function() {
                busyIndicator.hide('#FeeBusyIndicator');
            },
            success: function(results) {
                console.log(results);
                if (results && results.$values) {
                    config.bankFees = results.$values;
                    config.bankFees.map(injectFee);
                    $("#paymentTypeSelector").trigger('change');
                }
            },
            error: function(xhr, ajaxOptions, thrownError) {
                console.log(thrownError);
            }
        });
    }


    function rateTemplate(fee) {
        return '<div class="row internal-only">' +
            '<div class="col-xs-5">' +
            '<label for="' + fee.Name + '">' + fee.Name + ' Fee</label>' +
            '</div>' +
            '<div class="col-xs-7">' +
            '<input tabindex="6" type="text" class="loan-fee rate" name="' + fee.Name + '" title="Non-Negative Amount" maxlength="6" pattern="[0-9]+(\.[0-9]{0,4})?%?" value="' + fee.FormattedValue + '" onblur="App.formatPercentage($(this))" onfocus="$(this).select()" />' +
            '</div>' +
            '</div>';
    }

    function flatTemplate(fee) {
        return '<div class="row internal-only">' +
            '<div class="col-xs-5">' +
            '<label for="' + fee.Name + '">' + fee.Name + ' Fee</label>' +
            '</div>' +
            '<div class="col-xs-7">' +
            '<input tabindex="6" type="text" class="loan-fee flat" name="' + fee.Name + '" title="Non-Negative Amount" pattern="\\$?[0-9]{1,3}(?:,?[0-9]{3})*(?:\.[0-9]{0,2})?" value="' + fee.FormattedValue + '" onblur="App.formatCurrency($(this))" onfocus="$(this).select()" />' +
            '</div>' +
            '</div>';
    }

    getFeeTemplate = function(fee) {
        return (fee.Type === 'Flat') ? flatTemplate(fee) : rateTemplate(fee);
    };

    function injectFee(fee) {
        var template = getFeeTemplate(fee);
        busyIndicator.after(template);
    }

    function init() {
        busyIndicator = $("#FeeBusyIndicator");

    }

    //public
    self.getFees = getFees;
    self.init = init;
    return self;
}(jQuery, Config, BusyIndicatorService, FeeService || {}));

FeeService.init();