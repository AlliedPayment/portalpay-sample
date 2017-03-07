var AuthService = (function(CryptoJS, config, self) {
    /**
     * Generates a signature based on the give url and the current timestamp
     * @param {string} url 
     */
    function authenticate(url) {
        url = (url && url.length > 0) ? url : '';
        var timestamp = new Date().toISOString();
        var message = url + '\r\n';
        if (timestamp) {
            message += timestamp + '\r\n';
        }
        var signature = CryptoJS.HmacSHA1(message, config.privateKey);
        var encodedSignature = CryptoJS.enc.Base64.stringify();

        return {
            Timestamp: timestamp,
            Signature: encodedSignature,
            PublicKey: config.publicKey
        };
    }

    self.authenticate = authenticate;
    return self;
}(CryptoJS, Config, AuthService || {}));