var Config = (function($, self) {
    // convience vars
    var INTERNAL = 'INTERNAL',
        EXTERNAL = 'EXTERNAL',
        COLLECTION = 'COLLECTION';

    var apiRoot = 'https://api.demo.alliedpayment.com';
    var fiId = '073374eb-39f0-42b6-be07-c69a1f2b9cfc';


    // App config
    self.bankDomain = 'allied';
    self.bankName = 'Allied Payment';
    self.bankRTN = '';
    self.publicKey = '';
    self.privateKey = '';
    self.pageType = EXTERNAL;
    
    // Shared application data
    self.bankTerms = null;
    self.bankFees = null;
    
    // Routes
    self.urlAddressLookup = apiRoot + '/address';
    self.urlJetPayLogger = apiRoot + '/jetpay/log';
    self.urlLoanFees = apiRoot + '/loans/fees';
    self.urlLoanSubmission = apiRoot + '/jetpay/loans';
    self.urlRoutingLookup = apiRoot + '/federalbanks';
    self.urlTermsAndConditions = apiRoot + '/loans/terms';
    self.urlFiLogo = apiRoot + '/pictures/' + fiId + '/FILogo.jpg'

    //export module
    return self;
}(jQuery, Config || {}));
