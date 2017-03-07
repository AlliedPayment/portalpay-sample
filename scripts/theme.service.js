var ThemeService = (function($, self) {
    var linkTag, select, inverse, navbar;

    function setTheme(path) {
        linkTag.attr('href', path);
    }


    function theme() {
        var path = select.val();
        setTheme(path);
    }

    function inverseNavBar() {
        if (inverse[0].checked) {
            return navbar.removeClass('navbar-default').addClass('navbar-inverse');
        }
        navbar.removeClass('navbar-inverse').addClass('navbar-default');
    }

    function init() {
        linkTag = $('#theme');
        navbar = $('.navbar');
        inverse = $('#InverseNav');
        select = $('#ThemeSelector');
        select.on('change', theme);
        inverse.on('change', inverseNavBar)
    }

    self.init = init;
    return self;
}(jQuery, ThemeService || {}));

ThemeService.init();