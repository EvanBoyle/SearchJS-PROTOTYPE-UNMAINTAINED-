var Constants = require("../constants/SearchConstants");

var DefaultCssClasses = {};

DefaultCssClasses[Constants.SEARCHBOX] = {
    searchBox__container:            'searchBox__container',
    searchBox__containerOpen:        'searchBox__container--open',
    searchBox__input:                'searchBox__input',
    searchBox__suggestionsContainer: 'searchBox__suggestions-container',
    searchBox__suggestionsList:      'searchBox__suggestions-list',
    searchBox__suggestion:           'searchBox__suggestion',
    searchBox__suggestionFocused:    'searchBox__suggestion--focused',
    searchBox__sectionContainer:     'searchBox__section-container',
    searchBox__sectionTitle:         'searchBox__section-title',  
    searchBox__inputContainer:       'searchBox__input-container',
    searchBox__buttonContainer:      'searchBox__button-container',
    searchBox__button:               'searchBox__button',
    searchBox__buttonIcon:           'searchBox__button-icon'
};

DefaultCssClasses[Constants.SEARCHRESULTS] = {
    searchResults__result: 'searchResults__result',
    searchResults__modalContainer: "searchResults__modal-container",
    searchResults__modalContent: "searchResults__modal-content",
    searchResults__modalHeader: "searchResults__modal-header",
    searchResults__modalButton: "searchResults__modal-button",
    searchResults__modalButtonLabel: "searchResults__modal-button-label"
};

module.exports = DefaultCssClasses;