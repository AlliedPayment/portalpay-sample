var PageTypeService = (function($, config, self) {

    function injectPageClass() {
        var page = config.pageType.toLowerCase();
        $('html').addClass(page);
    }

    self.injectPageClass = injectPageClass;
    return self;
}(jQuery, Config, PageTypeService || {}));

PageTypeService.injectPageClass();