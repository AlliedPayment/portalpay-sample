var AddressService = (function($, config, busyService, self) {
    // Test ZipCode => 46825, 85062-8626
    // Gets the City and State for a given ZipCode
    function lookup(zipcode) {
        var zipCode = $.trim(zipcode).replace(/\D/g, '');
        if (zipCode.length != 5 && zipCode.length != 9) {
            return;
        }

        $.ajax({
            type: "GET",
            crossDomain: true,
            url: config.urlAddressLookup,
            data: {
                zip: zipCode
            },
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            beforeSend: function() {
                busyService.show('#ZipCodeBusyIndicator');
            },
            complete: function() {
                busyService.hide('#ZipCodeBusyIndicator');
            },
            success: function(results) {
                if (results) {
                    $("#PayerCity").val(results["City"]);
                    $("#PayerState").val(results["State"]);
                }
            },
            error: function(xhr, ajaxOptions, thrownError) {
                console.log(thrownError);
            }
        });
    }

    self.lookup = lookup;
    return self;
}(jQuery, Config, BusyIndicatorService, AddressService || {}));