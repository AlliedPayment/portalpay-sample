var ThemeService = (function($, self) {
    var linkTag, select, inverse, navbar,
    themeKey = 'theme', navKey = 'nav';

    function setTheme(path) {
        linkTag.attr('href', path);
        store(themeKey, path);
    }

    function store(key, value){
        if(localStorage){
            localStorage.setItem(key, value);
        }
    }

    function load(){
        if(localStorage){
            var path = localStorage.getItem(themeKey);
            setTheme(path);
            var isInverse = localStorage.getItem(navKey) === 'true';
            inverse[0].checked = isInverse;
            inverseNavBar();
        }
    }

    function theme() {
        var path = select.val();
        setTheme(path);
    }

    function inverseNavBar() {
        var isChecked = inverse[0].checked;
        store(navKey, isChecked);
        if (isChecked) {
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
        inverse.on('change', inverseNavBar);
        load();
    }

    self.init = init;
    return self;
}(jQuery, ThemeService || {}));

ThemeService.init();