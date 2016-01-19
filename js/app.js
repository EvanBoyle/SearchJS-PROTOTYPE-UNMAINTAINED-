var React = require('react');
var ReactDOM = require('react-dom');
var OptionTemplate = require('./components/OptionTemplate.jsx')
var AzSearch = require('./AzSearch.jsx');

var search = new AzSearch("azsdoofgod","4412747C72BF48B6C761ED7E00D9964D", "wikiversity" );

search.addResultsView("results");
search.addSearchBox("searchBox", "titleSuggester", ["title"], OptionTemplate, "<b>", "</b>");
search.addCheckboxFacet("campusFacet", "campusType", "Campus type", false);
search.addRangeFacet("studentsFacet", "studentsCount", "Students", 0, 100000);
search.addRangeFacet("endowmentFacet", "endowmentAmount", "Endowment", 0, 5000000000);