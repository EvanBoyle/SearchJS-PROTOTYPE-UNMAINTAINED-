var SearchActions = require("./actions/SearchActions");
var SearchResults = require("./components/SearchResults.jsx");
var SearchBox = require("./components/SearchBox.jsx");
var CheckboxFacet = require("./components/CheckboxFacetControl.jsx");
var RangeFacet = require("./components/RangeFacetControl.jsx");
var ReactDOM = require("react-dom");
var React = require("react");

/**
 * @function AzSearch
 * @param {string} serviceName The Azure Search service name https://example.search.windows.net: "example"
 * @param {string} queryKey query key for your service, can be found under settings/keys in the portal
 * @param {string} index Name of the index search requests will be made on
 */
function AzSearch(serviceName, queryKey, index) {
    SearchActions.setUp(serviceName, queryKey, index);
    
}

AzSearch.prototype.addResultsView = function(elementSelector) {
    ReactDOM.render(<SearchResults/>, document.getElementById(elementSelector));
}

AzSearch.prototype.addSearchBox = function(elementSelector, suggester, optionTemplate) {
    ReactDOM.render(<SearchBox suggester={suggester} OptionTemplate={optionTemplate}/>, document.getElementById(elementSelector));
}

AzSearch.prototype.addCheckboxFacet = function(elementSelector, fieldName, displayName, isNumeric) {
    SearchActions.registerCheckboxFacet(fieldName, isNumeric);
    ReactDOM.render(<CheckboxFacet field={fieldName} displayName={displayName} />, document.getElementById(elementSelector));
},

AzSearch.prototype.addRangeFacet = function(elementSelector, fieldName, displayName, min, max) {
    SearchActions.registerRangeFacet(fieldName, min, max);
    ReactDOM.render(<RangeFacet field={fieldName} displayName={displayName} />, document.getElementById(elementSelector));
}

module.exports = AzSearch;