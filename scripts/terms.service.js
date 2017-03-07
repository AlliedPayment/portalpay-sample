var TermsService = (function($, config, self) {
    var confirmSubmitBtn;

    function get() {
        confirmSubmitBtn = $('#ConfirmSubmitButton')
        $.ajax({
            type: "GET",
            crossDomain: true,
            url: config.urlTermsAndConditions,
            data: {
                domain: config.bankDomain
            },
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function(results) {
                if (results) {
                    console.log(results);
                    if (results.terms) {
                        config.bankTerms = results.terms.Data;
                        $("#TermsOfService").text(config.bankTerms);
                        $("#TermsOfServiceContainer").show();
                        $('.terms-and-conditions').show();
                        confirmSubmitBtn.attr('disabled', 'disabled');
                    }
                }
            },
            error: function(xhr, ajaxOptions, thrownError) {
                console.log(thrownError);
            }
        });
    }

    function changed() {
        var isChecked = document.getElementById('isTermsAccepted').checked;
        if (isChecked) {
            confirmSubmitBtn.removeAttr('disabled');
            return;
        }
        confirmSubmitBtn.attr('disabled', 'disabled');
    }

    function resetCheckbox() {
        var checkbox = document.getElementById('isTermsAccepted');
        if (!checkbox) return;
        checkbox.checked = false;
    }

    self.getTerms = get;
    self.termsCheckedChanged = changed;
    self.resetCheckbox = resetCheckbox;
    return self;
}(jQuery, Config, TermsService || {}));