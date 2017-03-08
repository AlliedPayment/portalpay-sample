var PageTypeService = (function($, config, self) {
    var page = '';

    function injectPageClass() {
        var newPage = config.pageType.toLowerCase();
        $('html').removeClass(page)
        $('html').addClass(newPage);
        page = newPage;
    }

    self.injectPageClass = injectPageClass;
    return self;
}(jQuery, Config, PageTypeService || {}));

PageTypeService.injectPageClass();