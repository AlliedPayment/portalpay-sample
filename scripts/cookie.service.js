var CookieService = (function (self) {
    function createCookie(name, value, hours) {
        if (hours === undefined || hours === null || hours < 0) {
            hours = 1;
        }
        var date = new Date();
        date.setTime(date.getTime() + (hours * 60 * 60 * 1000));
        var expires = "; expires=" + date.toGMTString();
        document.cookie = name + "=" + value + expires + "; path=/";
    }

    function readCookie(name) {
        var nameEQ = name + "=";
        var ca = document.cookie.split(';');
        for (var i = 0; i < ca.length; i++) {
            var c = ca[i];
            while (c.charAt(0) == ' ') c = c.substring(1, c.length);
            if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
        }
        return null;
    }

    function eraseCookie(name) {
        createCookie(name, "", -1);
    }

    function getCookieName(account, amount) {
        return "jetpay-" + account + "-" + amount;
    }

    self.createCookie = createCookie;
    self.readCookie = readCookie;
    self.getCookieName = getCookieName;
    self.eraseCookie = eraseCookie;
    return self;
}(CookieService || {}));