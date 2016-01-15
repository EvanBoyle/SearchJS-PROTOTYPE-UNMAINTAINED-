var React = require('react');
var ReactDOM = require('react-dom');
var SearchUI = require('./components/SearchUI.jsx');
var OptionTemplate = require('./components/OptionTemplate.jsx')
var Modal = require('react-modal');
var AzSearch = require('./AzSearch.jsx');

var search = new AzSearch("azsdoofgod","4412747C72BF48B6C761ED7E00D9964D", "wikiversity" );

search.addResultsView("results");
search.addSearchBox("searchBox", "titleSuggester", OptionTemplate);
search.addCheckboxFacet("campusFacet", "campusType", "Campus type", false);