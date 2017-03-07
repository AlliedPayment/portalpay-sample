var App = (function($, CryptoJS, config, addressService, busyService, cookieService,
    popupService, creditService, feeService, termsService, utils, validationService, self) {
    //psuedo CONST please don't modify
    var CREDIT = 'Credit/Debit',
        ACH = 'ACH';

    // local vars
    var textarea, loanForm, popupTitle, title, popupWindow,
        confirmSubmitBtn, confirmBusyIndicator, confirmCancelBtn, loanConfirmScreen,
        confirmBankNameRow, confirmBankRoutingNumberRow, confirmBankAccountTypeRow,
        confirmCardNumberRow, paymentTypeSelect, payWithCardSection, payWithBankAccountSection,
        confirmSubmitButton, loanCancelButton, jumbotron, payerZipCode;

    /**
     * Capitalize the first character of the input string
     * @param {string} input 
     */
    function capitaliseFirstLetter(input) {
        return input.charAt(0).toUpperCase() + input.slice(1);
    }

    /**
     * Shows confirmation if form is valid otherwise displays invalid in the submit button's text
     */
    function loanSubmitCommand() {
        var delay = 3000 // 3 seconds
        if (loanForm.valid()) {
            return ShowConfirmation();
        }
        loanSubmitBtn.val('Invalid');
        window.setTimeout(function() {
            loanSubmitBtn.val('Submit');
        }, delay);
    }

    /**
     * Executes when the loan form is reset
     */
    function onFormReset() {
        console.log('form reset');
        termsService.resetCheckbox();
    }

    /**
     * Cancels current trasaction and resets the form to it's default state
     */
    function reset() {
        // Reset the form back to original state
        var rawForm = loanForm[0];
        if (rawForm) rawForm.reset();
        backToForm();
    }

    /**
     * Executes after a payment has been successfully submitted.
     * Displays popup and resets form back to default state.
     * 
     * @param {object} results 
     * @param {*} status 
     */
    function onSuccess(results, status) {
        // Reset and return to the form in case they want to submit another payment.
        reset();

        var c = results.ConfirmationNumber;
        var d = results.ExpectedDeliveryDate;
        var acct = results.PayToBankAccount;
        var amnt = results.Amount.toFixed(2).toString();

        var message = 'Your loan payment has been made!<br/><br/>';
        if (c.length > 0) {
            message += 'Confirmation Number: ' + c + '<br/>';
        }
        if (d.length > 0) {
            message += 'Expected Delivery Date: ' + d + '<br/>';
        }
        if (acct.length > 0) {
            message += 'Loan Number: ' + acct + '<br/>';
        }
        if (amnt.length > 0) {
            message += 'Amount: $' + amnt + '<br/>';
        }

        popupTitle.text('Loan Transaction Successful!');
        popupContent.empty().html(message);

        if (results) {
            popupPrintBtn.show();
            popupPrintBtn.off('click').on('click', function() {
                var content = popupContent.html();
                var newWin = window.open('');
                newWin.document.open();
                newWin.document.write('<!DOCTYPE html>');
                newWin.document.write('<html>');
                newWin.document.write(content);
                newWin.document.write('</html>');
                newWin.document.close();
                newWin.print();
                newWin.close();
            });
        } else {
            popupPrintBtn.hide();
        }

        popupWindow.modal('show');
    }

    /**
     * Executes after the submit button on the confirmation view is clicked.
     * Verifies user hasn't made a duplicate payment.
     * Uses ajax request to make loan payment request to the api
     */
    function createPayment() {
        var isJetPay = false;
        var loanData = getLoanData();
        var auth = getAuthSignature(urlLoanSubmission);
        var loan = JSON.stringify($.extend({}, loanData, auth));
        SessionService.setUserId(loanData.ReceiptEmail);

        //grab cookie that tracks account/amount. stop the user if it detects it already being in the cookie
        var alreadyPaidCookie = cookieService.readCookie(cookieService.getCookieName(loanData.PayToAccount.AccountNumber,
            loanData.Amount));

        if (alreadyPaidCookie) {
            popupService.displayDuplicatePaymentErrorPopup();
            return;
        }

        // Toggle Buttons States (Disable Cancel + switch Submit Button to Busy state)
        confirmSubmitBtn.css('visibility', 'hidden');
        confirmBusyIndicator.css('visibility', 'visible');
        confirmCancelBtn.attr('disabled', 'disabled');
        confirmSubmitBtn.attr('disabled', 'disabled');

        $.ajax({
            type: 'POST',
            crossDomain: true,
            url: urlLoanSubmission,
            data: loan,
            contentType: 'application/json; charset=utf-8',
            dataType: 'json',
            complete: function() {
                if (!isJetPay) {
                    confirmBusyIndicator.css('visibility', 'hidden');
                    confirmSubmitBtn.css('visibility', 'visible');
                    confirmCancelBtn.removeAttr('disabled');
                    confirmSubmitBtn.removeAttr('disabled');
                }
            },
            success: function(response, status) {
                var s = (status || '').toLowerCase();
                var type = loanData.PaymentType.toLowerCase();
                isJetPay = type === 'CreditOrDebit';

                var expMonth = ('0' + $('.cc-exp').payment('cardExpiryVal').month).slice(-2);
                var expYear = ('' + $('.cc-exp').payment('cardExpiryVal').year).slice(-2);

                var cardInfo = {
                    type: type,
                    cardNumber: $('#cc-number').val(),
                    expMonth: expMonth,
                    expYear: expYear,
                    cvv: $('#cc-cvv').val(),
                    nameOnCard: $('#cc-nameOnCard').val()
                };
                if (s == 'success') {
                    //the payment to allied is successful so set a cookie to remember it
                    cookieService.createCookie(cookieService.getCookieName(loanData.PayToAccount.AccountNumber, loanData.Amount),
                        '1');

                    //console.log('Sending to JetPay...');
                    //return;

                    $.when(creditService.post(type, response, loanData, cardInfo))
                        .then(function(data) {
                                confirmBusyIndicator.css('visibility', 'hidden');
                                confirmSubmitBtn.css('visibility', 'visible');
                                confirmCancelBtn.removeAttr('disabled');
                                confirmSubmitBtn.removeAttr('disabled');
                                onSuccess(data, status)
                            },
                            function(data) {
                                confirmBusyIndicator.css('visibility', 'hidden');
                                confirmSubmitBtn.css('visibility', 'visible');
                                confirmCancelBtn.removeAttr('disabled');
                                confirmSubmitBtn.removeAttr('disabled');

                                cookieService.eraseCookie(cookieService.getCookieName(loanData.PayToAccount.AccountNumber,
                                    loanData.Amount));

                                if (data) {
                                    popupService.displayCardDeclinedErrorPopup(data);
                                } else {
                                    popupService.displayGenericErrorPopup();
                                }
                            }
                        );
                } else {
                    popupService.displayGenericErrorPopup();
                }
            },
            error: function(xhr, ajaxOptions, thrownError) {
                console.log(thrownError);
                popupService.displayGenericErrorPopup();
                confirmSubmitBtn.removeAttr('disabled');
            }
        });
    }


    /**
     * Returns user back to main form from confirmation screen leaving all the data in place for editing. 
     */
    function backToForm() {
        title.text('Loan Payment');
        jumbotron.show();
        termsService.resetCheckbox();
        loanConfirmScreen.hide();
        loanSubmitScreen.show();
    }

    /**
     * Display the confirmation view
     */
    function ShowConfirmation() {
        jumbotron.hide();
        // Clear out any old values that might be put there previously
        $('#LoanConfirmScreen input:not([type=button])').val('');

        // Summarize the User's data on the Confirmation screen
        var loan = getLoanData();

        if (loan.PaymentType == 'CreditOrDebit') {
            confirmBankNameRow.css('display', 'none');
            confirmBankRoutingNumberRow.css('display', 'none');
            confirmBankAccountNumberRow.css('display', 'none');
            confirmBankAccountTypeRow.css('display', 'none');
            confirmCardNumberRow.css('display', '');
            $('#ConfirmCardNumber').val(capitaliseFirstLetter(loan.CardType + ' ending in *' + loan.CreditCardNumber.substr(loan.CreditCardNumber.length - 4)));
        } else {
            confirmBankNameRow.css('display', '');
            confirmBankRoutingNumberRow.css('display', '');
            confirmBankAccountNumberRow.css('display', '');
            confirmBankAccountTypeRow.css('display', '');
            confirmCardNumberRow.css('display', 'none');
            $('#ConfirmBankName').val(loan.PayFromAccount.Name);
            $('#ConfirmBankRoutingNumber').val(loan.PayFromAccount.RoutingNumber);
            $('#ConfirmBankAccountNumber').val(loan.PayFromAccount.AccountNumber);
            $('#ConfirmBankAccountType').val(loan.PayFromAccount.AccountType);
        }

        $('#ConfirmLoanNumber').val(loan.PayToAccount.AccountNumber);
        $('#ConfirmFeeType').val(loan.FeeType);
        $('#ConfirmLoanAmount').val('$' + loan.Amount.toFixed(2));
        $('#ConfirmLoanFee').val('$' + loan.Fee.toFixed(2));
        $('#ConfirmLoanTotal').val('$' + loan.Total.toFixed(2));

        $('#ConfirmEmployee').val(loan.CreateBy);
        $('#ConfirmBranch').val(loan.Branch);
        $('#ConfirmMemo').val(loan.Memo);

        // Switch Screens
        loanSubmitScreen.hide();
        loanConfirmScreen.show();
        title.text('Payment Confirmation');
    }


    /**
     * Gathers the values from the form into a structure required by the Services
     */
    function getLoanData() {
        var amount = utils.parseCurrency($('#LoanAmount').val());
        var totalFee = gatherFees(amount);
        var total = amount + totalFee;
        return {
            Amount: amount,
            ACHPattern: 'LOAN',
            Domain: config.bankDomain,
            PayFromAccount: {
                Name: $('#BankName').val(),
                RoutingNumber: $('#BankRoutingNumber').val(),
                AccountNumber: $('#BankAccountNumber').val(),
                AccountType: $('#BankAccountType').val(),
            },
            PayToAccount: {
                Name: config.bankName,
                RoutingNumber: config.bankRTN,
                AccountNumber: $('#LoanNumber').val(),
            },
            PayFrom: $('#PayerName').val(),
            PhoneNumber: $('#PayerPhoneNumber').val(),
            ReceiptEmail: $('#PayerReceiptEmail').val(),
            CreateBy: $('#EmployeeName').val(),
            Branch: $('#BranchName').val(),
            Memo: $('#MemoMessage').val(),
            Fee: totalFee,
            Total: total,
            PaymentType: $('#feeTypeSelector').val(),
            CreditCardNumber: $('#cc-number').val(),
            ExpirationDate: $('#cc-exp').val(),
            CVV: $('#cc-cvv').val(),
            NameOnCard: $('#cc-nameOnCard').val(),
            PaymentType: $('#paymentTypeSelector').val(),
            CardType: $.payment.cardType($('.cc-number').val()),
            PortalPaySource: config.pageType
        };
    }

    /**
     * Determines the fee type based on the input string
     * @param {string} selected 
     * returns 'Credit/Debit' or 'ACH'
     */
    function getPaymentType() {
        var selected = paymentTypeSelect.val();

        return (selected === 'CreditOrDebit') ? CREDIT : ACH;
    }

    /**
     * Returns the fee total calculated from the given amount
     * @param {number} amount 
     */
    function gatherFees(amount) {
        var type = getPaymentType();
        if (config.pageType === 'External') {
            return sumFeesForExternal(type, amount);
        }
        return sumFees(type, amount);
    }

    /**
     * Calculates the total fee amount based on the fee input elements
     * NOTE: Internal and Collection pages allow editing of fees. 
     * @param {string} type 
     * @param {number} amount 
     */
    function sumFees(type, amount) {
        var flatFee = 0,
            rate = 0;
        $('.loan-fee.flat').each(function() {
            flatFee += (this.name === type) ? utils.parseCurrency($(this).val()) : 0;
        });
        $('.loan-fee.rate').each(function() {
            rate += (this.name === type) ? utils.parsePercent($(this).val()) : 0;
        });
        var rateFee = rate / 100 * amount;
        return flatFee + rateFee;
    }

    /**
     * Calculates the total fee amount based on the bankFees array
     * External page doesn't allow editing values. Therefore the fees can be calculated from the bankFees array.
     * @param {string} type 
     * @param {number} amount 
     */
    function sumFeesForExternal(type, amount) {
        var matched, values, total;

        matched = bankFees.filter(function(fee) {
            return fee.Name === type;
        });

        values = matched.map(function(fee) {
            if (fee.Type === 'Flat') return fee.Value;
            return fee.Value * amount;
        });

        total = values.reduce(function(total, value) {
            return total + value;
        });

        return total;
    }

    /**
     * Executes when payment type select box is changed.
     * Updates the memo field to display the selected type 
     */
    function setInstructions() {
        // fee type auto fill with instructions
        var ddl = $('#feeTypeSelector')[0];
        var selectedOption = ddl.options[ddl.selectedIndex];
        var mailValue = selectedOption.getAttribute('fee-type');
        var textBox = $('#MemoMessage');
        if (mailValue == '1') {
            textBox.val('');
        } else if (mailValue == '2') {
            textBox.val('Escrow Instructions');
        } else if (mailValue == '3') {
            textBox.val('Principal Instructions');
        }
    }

    /**
     * Resizes the textarea when the content is greater than the elements bounds
     */
    function autosize() {
        var el = this;
        setTimeout(function() {
            // Height increase on text area
            el.style.cssText = 'height:auto; padding:3px 6px';
            el.style.cssText = 'height:' + el.scrollHeight + 'px';
        }, 0);
    }

    /**
     * Toggles which payment type elements are shown / hidden based on the value of the paymentTypeSelect 
     */
    function togglePaymentType() {
        var type = getPaymentType();
        return (type === ACH) ? showBankSection() : showCardSection();
    }

    function showCardSection() {
        payWithBankAccountSection.slideUp();
        setTimeout(function() {
            payWithCardSection.slideDown()
            validationService.setupCreditValidation();
        }, 300);
    }


    function showBankSection() {
        payWithCardSection.slideUp();
        setTimeout(function() {
            payWithBankAccountSection.slideDown();
            validationService.setupAchValidation();
        }, 300);
    }


    /**
     * Initalize local variables to element bindngs
     */
    function bindElements() {
        textarea = document.querySelector('textarea');
        loanForm = $('#LoanForm');
        loanAmount = $('#LoanAmount');
        loanSubmitBtn = $('#LoanSubmitButton');
        popupTitle = $('#PopupTitle');
        popupContent = $('#PopupContent');
        popupPrintBtn = $('#PopupPrintButton');
        popupWindow = $('#PopupWindow');
        confirmSubmitBtn = $('#ConfirmSubmitButton');
        confirmBusyIndicator = $('#ConfirmSubmitBusyIndicator');
        confirmCancelBtn = $('#ConfirmCancelButton');
        loanConfirmScreen = $('#LoanConfirmScreen');
        loanSubmitScreen = $('#LoanSubmitScreen');
        loanCancelBtn = $('#LoanCancelButton');
        confirmBankNameRow = $('#ConfirmBankNameRow');
        confirmBankRoutingNumberRow = $('#ConfirmBankRoutingNumberRow');
        confirmBankAccountNumberRow = $('#ConfirmBankAccountNumberRow');
        confirmBankAccountTypeRow = $('#ConfirmBankAccountTypeRow');
        confirmCardNumberRow = $('#ConfirmCardNumberRow');
        title = $('.navbar-brand');
        paymentTypeSelect = $('#paymentTypeSelector');
        payWithCardSection = $('#PayWithCard');
        payWithBankAccountSection = $('#PayWithBankAccount');
        jumbotron = $('.jumbotron');
        payerZipCode = $('#PayerZipCode');
    }

    /**
     * Bind event listeners
     */
    function bindEvents() {
        textarea.addEventListener('keydown', autosize);
        loanForm.on('reset', onFormReset);
        paymentTypeSelect.on('change', togglePaymentType)
        loanSubmitBtn.on('click', loanSubmitCommand);
        confirmSubmitBtn.on('click', createPayment);
        confirmCancelBtn.on('click', backToForm);
        loanCancelBtn.on('click', reset);
        loanAmount.on('blur', function() {
            utils.formatCurrency(loanAmount);
        });
        loanAmount.on('focus', function() {
            loanAmount.select();
        });
        payerZipCode.on('blur', function() {
            addressService.lookup(payerZipCode.val());
        });
    }

    /**
     * Application entry point
     */
    function init() {
        bindElements();
        bindEvents();
        termsService.getTerms();
        feeService.getFees();
        togglePaymentType();
        validationService.init();
    }

    self.init = init;
    self.ShowConfirmation = ShowConfirmation;
    return self;
}(jQuery, CryptoJS, Config, AddressService, BusyIndicatorService, CookieService,
    PopupService, CreditCardService, FeeService, TermsService, UtilityService, ValidationService, App || {}));

App.init();