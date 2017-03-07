var FiLogoService = (function($, config, self) {

    function init() {
        var html = '<img id="logo" src="' + config.urlFiLogo + '" />';
        var container = $('.jumbotron');
        container.append(html);
    }

    self.init = init;
    return self;
}(jQuery, Config, FiLogoService || {}));

FiLogoService.init();