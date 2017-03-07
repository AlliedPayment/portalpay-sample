// UUID docs https://github.com/LiosK/UUID.js
var SessionService = (function (UUID, self) {
    var sessionId = '',
        userId = window.location.hostname + ' anonymous user';

    function init() {
        newSession();
    }

    function getUserId() {
        return userId;
    }

    function setUserId(value) {
        userId = (value != undefined && value != null && value.length > 0) ? value: userId;
    }

    function newSession() {
        sessionId = UUID.genV4();
    }

    function getSessionId() {
        return sessionId;
    }

    //reveal public api
    self.init = init;
    self.getUserId = getUserId;
    self.setUserId = setUserId;
    self.getSessionId = getSessionId;
    return self;
} (UUID, SessionService || {}));


SessionService.init();