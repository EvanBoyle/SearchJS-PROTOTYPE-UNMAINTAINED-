var React = require('react');
var ReactDOM = require('react-dom');
var AzSearch = require('./AzSearch.jsx');

var search = new AzSearch("azsdoofgod","4412747C72BF48B6C761ED7E00D9964D", "wikiversity" );

var resultTemplate = 
    '<img src="{{image_url}}"/>' +
    '<div class="imgTitle">{{title}}></div>';

search.addResultsView("results", resultTemplate);
search.addSearchBox("searchBox", "titleSuggester", ["title"], "{{{searchText}}}", "<b>", "</b>");
search.addCheckboxFacet("campusFacet", "campusType", "Campus type", false);
search.addRangeFacet("studentsFacet", "studentsCount", "Students", 0, 100000);
search.addRangeFacet("endowmentFacet", "endowmentAmount", "Endowment", 0, 5000000000);