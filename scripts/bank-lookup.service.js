var BankLookupService = (function($, config, busyService, self) {
    var routingNumber, bankName;

    function lookup() {
        routingNumber = $("#BankRoutingNumber").val().replace(/\D/g, '');
        return {
            type: "GET",
            crossDomain: true,
            url: config.urlRoutingLookup,
            processData: false,
            data: "rtn=" + routingNumber,
            contentType: "application/json; charset=utf-8",
            dataType: "text",
            beforeSend: function() {
                busyService.show('#RoutingBusyIndicator');
            },
            complete: function() {
                busyService.hide('#RoutingBusyIndicator');
            },
            dataFilter: function(response) {
                var result = JSON.parse(response);
                if (result && result["$values"].length == 1 && routingNumber.length >= 9) {
                    bankName.val($.trim(result["$values"][0]["CustomerName"]));
                    return true;
                }

                if (routingNumber.length < 9) {
                    bankName.val("");
                } else {
                    bankName.val("N/A");
                }

                return false;
            }
        };
    }

    function bindElements() {
        bankName = $("#BankName");
    }

    function init() {
        bindElements();
    }

    self.lookup = lookup;
    self.init = init;
    return self;
}(jQuery, Config, BusyIndicatorService, BankLookupService || {}));


BankLookupService.init();