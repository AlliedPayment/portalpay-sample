var CreditCardService = (function($, crypto, config, self) {
    var _deferred,
        _payment,
        _url = config.urlJetPayLogger,
        _iframeId = "jetpay-redirect-iframe",
        _formId = "jetpay-form";

    function onLoad() {
        var url;
        try {

            url = document.getElementById(_iframeId).contentWindow.location.href;
        } catch (error) {
            console.log(error);
            log("An error occurred detecting the response from JetPay. The response could be good or bad. Please defer to the log of the callback result to /jetpay/creditauth for more information.");
            return _deferred.reject();
        }
        if (url === "about:blank") return;
        var isGood = url.indexOf("good") > -1;
        if (!isGood) {
            log("The credit card was not authorized. Payment should be cancelled.");
            return _deferred.reject("Your card payment was declined. Please contact your card provider for more information.");
        }
        log("The credit card payment was authorized. Please defer to the log of the callback result to /jetpay/creditauth for more information.");
        return _deferred.resolve(_payment);
    }

    function createAndSubmitForm(path, data) {
        var form, iframe, hiddenField;
        //create iframe
        iframe = document.getElementById(_iframeId);
        iframe.onload = onLoad;

        form = document.getElementById(_formId);
        if (form != null) {
            $("#" + _formId).remove();
        }
        //create form
        form = document.createElement("form");
        form.setAttribute("name", _formId);
        form.setAttribute("id", _formId);
        form.setAttribute("method", "post");
        form.setAttribute("action", path);
        form.setAttribute("target", _iframeId);
        //copy submit fn so it's not overridden
        form._submit = form.submit;

        //create hidden fields & append to form
        for (var key in data) {
            if (data.hasOwnProperty(key)) {
                hiddenField = document.createElement("input");
                hiddenField.setAttribute("type", "hidden");
                hiddenField.setAttribute("name", key);
                hiddenField.setAttribute("value", data[key]);
                form.appendChild(hiddenField);
            }
        }
        //inject into DOM and submit
        document.body.appendChild(form);
        log("Sending request to jetpay...waiting credit authorization");
        form._submit();
    }

    function post(type, res, loan, card) {
        var params, url, token, message, hash, amt;

        _deferred = $.Deferred();
        if (type !== "creditordebit")
            return _deferred.resolve(res.Payment); //not a jetpay payment

        params = res.CreditCardAuthParms;
        _payment = res.Payment;
        url = res.CreditCardAuthUrl;
        token = res.Token;
        message = params.jp_tid + params.amount + token + params.order_number;
        hash = crypto.SHA512(message).toString();

        params.jp_request_hash = hash;
        params.name = card.nameOnCard;
        params.cardNum = card.cardNumber.replace(/\s/g, "");
        params.expMo = card.expMonth;
        params.expYr = card.expYear;
        params.cvv = card.cvv;
        params.customerEmail = loan.ReceiptEmail;
        createAndSubmitForm(url, params);
        return _deferred.promise();
    }

    function log(message) {
        var isValid = isLogValid(_url, _payment.Id, message);
        if (!isValid) {
            console.log({
                error: "Log input is invalid",
                url: _url,
                id: _payment.Id,
                message: message
            });
            return;
        }
        var json = JSON.stringify({
            PaymentId: _payment.Id,
            Message: message
        });
        $.ajax({
            type: "POST",
            crossDomain: true,
            url: _url,
            data: json,
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function(response, status) {
                console.log("logged: " + message)
            },
            error: function(xhr, ajaxOptions, thrownError) {
                console.log({
                    xhr: xhr,
                    ajaxOptions: ajaxOptions,
                    thrownError: thrownError
                });
            }
        });
    }

    function isLogValid(id, message) {
        return id !== null && id !== undefined && id.length > 0 && message !== null && message !== undefined && message.length > 0;
    }
    //public
    self.post = post;
    return self;
}(jQuery, CryptoJS, Config, CreditCardService || {}));