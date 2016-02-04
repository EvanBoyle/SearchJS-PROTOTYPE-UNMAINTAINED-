var SearchActions = require("./actions/SearchActions");
var SearchResults = require("./components/SearchResults.jsx");
var SearchBox = require("./components/SearchBox.jsx");
var CheckboxFacet = require("./components/CheckboxFacetControl.jsx");
var RangeFacet = require("./components/RangeFacetControl.jsx");
var Constants = require("./constants/SearchConstants");
var DefaultTemplates = require("./utils/DefaultTemplates");
var Hogan = require("hogan.js");
var ReactDOM = require("react-dom");
var React = require("react");

/**
 * @function AzSearch
 * @param {string} serviceName The Azure Search service name https://example.search.windows.net: "example"
 * @param {string} queryKey query key for your service, can be found under settings/keys in the portal
 * @param {string} index Name of the index search requests will be made on
 */
function AzSearch(config) {
    SearchActions.setUp(config.serviceName, config.queryKey, config.index);
}

AzSearch.prototype.addResultsView = function(config) {
    // if null is passed we render json.strinify(of result instead)
    var compiled = config.resultTemplate ? Hogan.compile(config.resultTemplate) : null;
    ReactDOM.render(<SearchResults resultTemplate={compiled}/>, document.getElementById(config.htmlId));
}

AzSearch.prototype.addSearchBox = function(config) {
    var template = config.suggestionTemplate ? config.suggestionTemplate : DefaultTemplates[Constants.SEARCHBOX];
    var compiled = Hogan.compile(template);
    ReactDOM.render(<SearchBox suggester={config.suggesterName} suggestionTemplate={compiled} preTag={config.hitHighlightPreTag} postTag={config.hitHighlightPostTag} searchFields={config.searchFields}/>, 
    document.getElementById(config.htmlId));
}

AzSearch.prototype.addCheckboxFacet = function(config) {
    SearchActions.registerCheckboxFacet(config.fieldName, config.isNumeric);
    ReactDOM.render(<CheckboxFacet field={config.fieldName} displayName={config.displayName} />, document.getElementById(config.htmlId));
},

AzSearch.prototype.addRangeFacet = function(config) {
    SearchActions.registerRangeFacet(config.fieldName, config.min, config.max);
    ReactDOM.render(<RangeFacet field={config.fieldName} displayName={config.displayName} />, document.getElementById(config.htmlId));
}
window.AzSearch = AzSearch;
module.exports = AzSearch;