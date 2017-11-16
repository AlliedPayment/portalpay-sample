var ThemeService = (function($, self) {
    var linkTag, select, inverse, navbar, isInverse, themePath, inverseDesc,
        themeKey = 'theme',
        navKey = 'nav',
        fallback = 'https://bootswatch.com/3/cosmo/bootstrap.min.css';

    function save() {
        store(themeKey, themePath);
        store(navKey, isInverse);
    }

    function reset() {
        load();
    }

    function setTheme(path) {
        if (!path) return;
        linkTag.attr('href', path);
    }

    function store(key, value) {
        if (localStorage) {
            localStorage.setItem(key, value);
        }
    }

    function load() {
        if (localStorage) {
            themePath = localStorage.getItem(themeKey);
            isInverse = localStorage.getItem(navKey) === 'true';
        }
        themePath = (themePath === "undefined") ? undefined : themePath;
        themePath = (themePath === "null") ? null : themePath;
        themePath = (themePath) ? themePath : fallback;
        $('#ThemeSelector option[value="' + themePath + '"]').prop('selected', true);
        setTheme(themePath);
        inverse[0].checked = isInverse;
        inverseNavBar();
    }

    function theme() {
        themePath = select.val();
        setTheme(themePath);
    }

    function inverseNavBar() {
        isInverse = inverse[0].checked;
        var desc = (isInverse) ? 'NavBar has inverse class applied' : 'NavBar is using default class';
        inverseDesc.text(desc);
        if (isInverse) {
            return navbar.removeClass('navbar-default').addClass('navbar-inverse');
        }
        navbar.removeClass('navbar-inverse').addClass('navbar-default');
    }

    function init() {
        linkTag = $('#theme');
        navbar = $('.navbar');
        inverse = $('#InverseNav');
        inverseDesc = $('#InverseNavDesc');
        select = $('#ThemeSelector');
        select.on('change', theme);
        inverse.on('change', inverseNavBar);
        load();
    }

    self.reset = reset;
    self.save = save;
    self.init = init;
    return self;
}(jQuery, ThemeService || {}));

ThemeService.init();
