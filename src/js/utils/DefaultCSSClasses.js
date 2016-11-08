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

DefaultCssClasses[Constants.SEARCHFACETS] = {
    searchFacets__rangeFacet: 'searchResults__rangeFacet',
    searchFacets__checkboxFacet: 'searchResults__checkboxFacet',
    searchFacets__facetHeaderContainer: 'searchResults__facetHeader-container',
    searchFacets__facetHeader: 'searchResults__facetHeader',
    searchFacets__facetHeaderLink: 'searchResults__facetHeader-link',
    searchFacets__facetHeaderIconCollapsed: 'searchResults__facetHeader-icon--collapsed',
    searchFacets__facetHeaderIconOpen: 'searchResults__facetHeader-icon--open',
    searchFacets__facetControlContainer: 'searchResults__facetControl-container',
    searchFacets__facetControlList: 'searchResults__facetControl-list',
    searchFacets__facetControl: 'searchResults__facetControl',
    searchFacets__facetControlCheckboxWrapper: 'searchResults__facetControl-checkbox-wrapper',
    searchFacets__facetControlCheckboxChecked: 'searchResults__facetControl-checkbox--checked',
    searchFacets__facetControlCheckboxCheckedHover: 'searchResults__facetControl-checkbox--checkedHover',
    searchFacets__facetControlCheckboxUnchecked: 'searchResults__facetControl-checkbox--unchecked',
    searchFacets__facetControlCheckboxUncheckedHover: 'searchResults__facetControl-checkbox--uncheckedHover',
    searchFacets__facetControlCheckbox: 'searchResults__facetControl-checkbox',
    searchFacets__facetControlRangeLabel: 'searchResults__facetControl-rangeLabel',
    searchFacets__facetControlRangeLabelMin: 'searchResults__facetControl-rangeLabelMin',
    searchFacets__facetControlRangeLabelMax: 'searchResults__facetControl-rangeLabelMax',
    searchFacets__facetControlRangeLabelRange: 'searchResults__facetControl-rangeLabelRange'
};

module.exports = DefaultCssClasses;