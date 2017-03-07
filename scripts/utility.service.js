var UtilityService = (function() {
    /**
     * Parse number as currency
     * @param {number} value 
     */
    function parseCurrency(value) {
        var a = value.toString();
        if (a.length == 0) {
            return 0;
        }

        a = a.split('$').join(''); // Remove all '$' before parsing
        a = a.split(',').join(''); // Remove all ',' (Thousand's separator) before parsing
        return 1 * parseFloat(a).toFixed(2);
    }

    /**
     * Parse number as percent
     * @param {number} value 
     */
    function parsePercent(value) {
        var a = value.toString();
        if (a.length == 0) {
            return 0;
        }
        a = a.split('%').join(''); // Remove all '%' before parsing 
        return 1 * parseFloat(a).toFixed(0);
    }

    /**
     * Format the input string as currency
     * @param {string} input 
     */
    function formatCurrency(input) {
        var formatted = parseCurrency(input.val()).toFixed(2).toString();
        if (formatted != 'NaN') {
            input.val('$' + formatted);
        }
    }

    /**
     * Format the input string as a percentage
     * @param {string} input 
     */
    function formatPercentage(input) {
        var formatted = parsePercent(input.val()).toString();
        if (formatted != 'NaN') {
            input.val(formatted + '%');
        }
    }

    self.parseCurrency = parseCurrency;
    self.parsePercent = parsePercent;
    self.formatCurrency = formatCurrency;
    self.formatPercentage = formatPercentage;
    return self;
}(jQuery, UtilityService || {}));