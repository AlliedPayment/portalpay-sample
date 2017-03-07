var ValidationService = (function($, bankLookupService, utils, self) {
    var ccNumber, ccExp, ccCVV, loanAmount, loanFor,
        blank, visa, visaelectron, mastercard, maestro, discover, valid;

    /**
     * Hide credit card icons
     */
    function hideAllBrands() {
        blank.css('visibility', 'hidden');
        visa.css('visibility', 'hidden');
        visaelectron.css('visibility', 'hidden');
        mastercard.css('visibility', 'hidden');
        maestro.css('visibility', 'hidden');
        discover.css('visibility', 'hidden');
        valid.css('visibility', 'hidden');
    }

    /**
     * Enforces a minimum Amount (needed due to being a text field to allow currency formatting)
     * @param {*} value 
     * @param {*} el 
     * @param {*} param 
     */
    function minAmount(value, el, param) {
        return utils.parseCurrency(value) >= param;
    }

    /**
     * 
     * @param {*} value 
     * @param {*} element 
     * @param {*} params 
     */
    function expirationDateValidator(value, element, params) {
        return $.payment.validateCardExpiry(ccExp.payment('cardExpiryVal'));
    }

    /**
     * 
     * @param {*} value 
     * @param {*} element 
     * @param {*} params 
     */
    function cardNumberValidator(value, element, params) {

        var cardType = $.payment.cardType(ccNumber.val());
        hideAllBrands();

        switch (cardType) {
            case 'visa':
                visa.css("visibility", "visible");
                break;
            case 'visaelectron':
                visaelectron.css("visibility", "visible");
                break;
            case 'maestro':
                maestro.css("visibility", "visible");
                break;
            case 'mastercard':
                mastercard.css("visibility", "visible");
                break;
            case 'discover':
                discover.css("visibility", "visible");
                break;
            case null:
                valid.css("visibility", "visible");
                break;
            default:
                blank.css("visibility", "visible");
        }
        return $.payment.validateCardNumber(ccNumber.val());
    }

    /**
     * 
     * @param {*} value 
     * @param {*} element 
     * @param {*} params 
     */
    function cvcValidator(value, element, params) {
        var cardType = $.payment.cardType(ccNumber.val());
        return $.payment.validateCardCVC(ccCVV.val(), cardType);
    }

    /**
     * bind generic validators to elements
     */
    function addValidators() {
        $.validator.addMethod('minAmount', minAmount);
    }

    /**
     * bind credit / debit validators to elements
     */
    function addCreditValidators() {
        ccNumber.payment('formatCardNumber');
        ccExp.payment('formatCardExpiry');
        ccCVV.payment('formatCardCVC');
        $.validator.addMethod('expiration_date_validator', expirationDateValidator);
        $.validator.addMethod('card_number_validator', cardNumberValidator);
        $.validator.addMethod('cvc_validator', cvcValidator);
    }

    /**
     * 
     */
    function setValidationRules() {
        $("#LoanAmount").rules("add", {
            minAmount: 0.01
        });
    }

    /**
     * Credit / Debit specific validation rules
     */
    function setCreditValidationRules() {
        ccNumber = $("#cc-number");
        ccExp = $("#cc-exp");
        ccCVV = $("#cc-cvv");
        ccExp.rules("add", {
            expiration_date_validator: {}
        });
        ccNumber.rules("add", {
            card_number_validator: {}
        });
        ccCVV.rules("add", {
            cvc_validator: {}
        });
    }

    /**
     * ACH specific validation rules
     */
    function setAchValidationRules() {
        routingNumber = $("#BankRoutingNumber");
        routingNumber.rules("add", {
            required: true,
            digits: true,
            remote: bankLookupService.lookup
        });
    }


    function addDataMasks() {
        $("input[data-mask]").each(function() {
            $(this).mask($(this).data("mask"));
        });
    }

    function bindElements() {
        blank = $('#blank');
        visa = $('#visa');
        visaelectron = $('#visaelectron');
        mastercard = $('#mastercard');
        maestro = $('#maestro');
        discover = $('#discover');
        valid = $('#valid');
        loanAmount = $("#LoanAmount");
        loanForm = $("#LoanForm");
    }

    function setupAchValidation() {
        setAchValidationRules();
    }

    function setupCreditValidation() {
        setCreditValidationRules();
        addCreditValidators();
    }

    /**
     * module entry point
     */
    function init() {
        bindElements();
        addValidators();
        addDataMasks();
        loanForm.validate();
    }

    self.setupAchValidation = setupAchValidation;
    self.setupCreditValidation = setupCreditValidation;
    self.init = init;
    return self;
}(jQuery, BankLookupService, UtilityService, ValidationService || {}));

$(ValidationService.init);