var SearchActions = require("./actions/SearchActions");
var SearchResults = require("./components/SearchResults.jsx");
var SearchBox = require("./components/SearchBox.jsx");
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
    console.info("rendering results on id: " + elementSelector)
    ReactDOM.render(<SearchResults/>, document.getElementById(elementSelector));
}

AzSearch.prototype.addSearchBox = function(elementSelector, suggester, optionTemplate) {
    console.info("rendering typeahead on id: " + elementSelector)
    ReactDOM.render(<SearchBox suggester={suggester} OptionTemplate={optionTemplate}/>, document.getElementById(elementSelector));
}

module.exports = AzSearch;