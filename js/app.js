var React = require('react');
var ReactDOM = require('react-dom');
var AzSearch = require('./AzSearch.jsx');

var search = new AzSearch({
    serviceName: "azsdoofgod",
    index: "wikiversity",
    queryKey: "4412747C72BF48B6C761ED7E00D9964D"
});

var resultTemplate = 
    '<img src="{{image_url}}"/>' +
    '<div class="imgTitle">{{title}}</div>';

search.addResultsView({
    htmlId: "results",
    resultTemplate: resultTemplate
});

search.addSearchBox({
    htmlId:"searchBox",
    suggesterName: "titleSuggester",
    searchFields: ["title"],
    hitHighlightPreTag: "<b>",
    hitHighlightPostTag: "</b>",
    suggestionTemplate: "{{{searchText}}}"
});
search.addCheckboxFacet({
    htmlId: "campusFacet",
    fieldName: "campusType",
    displayName: "Campus type",
    isNumeric: false
});
search.addRangeFacet({
    htmlId: "studentsFacet",
    fieldName: "studentsCount",
    displayName: "Students",
    min: 0,
    max: 100000
});
search.addRangeFacet({
    htmlId: "endowmentFacet",
    fieldName: "endowmentAmount",
    displayName: "Endowment",
    min: 0,
    max: 5000000000
});