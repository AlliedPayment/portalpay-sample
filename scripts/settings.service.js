var SettingsService = (function($, config, themeService, pageTypeService, self) {
    var confirmCancelButton, settingsToggle, settingsScreen,
        loanSubmitScreen, loanConfirmScreen, jumbotron,
        pageTypeSetting, domainSetting, bankNameSetting,
        routingNumberSetting, privateKeySetting, publicKeySetting,
        cache = { submit: null, confirm: null };

    function setCogIcon() {
        var icon = $('.glyphicon-remove');
        icon.removeClass('glyphicon-remove');
        icon.addClass('glyphicon-cog');
    }

    function setCloseIcon() {
        var icon = $('.glyphicon-cog');
        icon.removeClass('glyphicon-cog');
        icon.addClass('glyphicon-remove');
    }

    function showSettings() {
        setCloseIcon();
        jumbotron.hide();
        cache.submit = loanSubmitScreen.css('display');
        cache.confirm = loanConfirmScreen.css('display');
        loanSubmitScreen.hide();
        loanConfirmScreen.hide();
        settingsScreen.show();
    }

    function hideSettings() {
        setCogIcon();
        jumbotron.show();
        settingsScreen.hide();
        loanSubmitScreen.css('display', cache.submit);
        loanConfirmScreen.css('display', cache.confirm);
    }

    function toggleSettings() {
        return (settingsScreen.css('display') === 'block') ? close() : showSettings();
    }

    function save() {
        config.pageType = pageTypeSetting.val();
        pageTypeService.injectPageClass();
        themeService.save();
        hideSettings();
    }

    function close() {
        pageTypeSetting.val(config.pageType);
        themeService.reset();
        hideSettings();
    }

    function reset() {
        if (localStorage) localStorage.clear();
        pageTypeSetting.val(config.pageType);
        themeService.reset();
        hideSettings();
    }

    function load() {

    }

    function bindElements() {
        settingsScreen = $('#SettingsScreen');
        loanSubmitScreen = $('#LoanSubmitScreen');
        loanConfirmScreen = $('#LoanConfirmScreen');
        settingsToggle = $('#settingsToggle');
        jumbotron = $('.jumbotron');
        saveBtn = $('#SaveSettingsButton');
        resetBtn = $('#ResetSettingsButton');
        pageTypeSetting = $('#PageTypeSelector');
    }

    function bindEvents() {
        settingsToggle.on('click', toggleSettings);
        saveBtn.on('click', save);
        resetBtn.on('click', reset);
    }

    function init() {
        bindElements();
        bindEvents();
        load();
    }

    self.init = init;
    return self;
}(jQuery, Config, ThemeService, PageTypeService, SettingsService || {}));

SettingsService.init();