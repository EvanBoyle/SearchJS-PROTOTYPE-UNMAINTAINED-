var SearchActions = require("actions/SearchActions");
var SearchResults = require("components/SearchResults");
var ReactDOM = require("react-dom");

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

module.exports = AzSearch;