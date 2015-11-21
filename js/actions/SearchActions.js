var AppDispatcher = require('../dispatcher/AppDispatcher');
var Config = require("../config");
var SearchConstants = require('../constants/SearchConstants');
var request = require("superagent");

var urlPrefix = Config.serviceURL +
				"/indexes/" +
				Config.indexName + 
				"/docs";
				
var buildFilter = function(facets) {
	var filter = "";
	var prefix = " campusType eq "
	
	var filteredElements = facets.filter(function(facet){
            return facet.selected;
        });
		
	if(filteredElements.length === 0){
		return "";
	}
	 
	for(var i = 0; i<filteredElements.length; i++){
		var result = "";
		if(i > 0){
			result += " or ";
		}
		result += prefix + "'" + filteredElements[i].value + "'";
		filter += result;
	}
	return filter;
};

var SearchActions = {
	search: function(term, facets, skip, top){
		var queryParams = {
			'api-version': '2015-02-28',
			'searchMode': 'all',
			'$count': 'true',
			'facet': 'campusType',
			'search': encodeURIComponent(term),
			'$skip': skip,
			'$top' : top
		};
		
		if(facets && facets.length > 0){
			var filter = buildFilter(facets);
			if(filter) {
				queryParams['$filter'] = filter;
			}
		}
		
		request
			.get(urlPrefix)
			.set('api-key', Config.queryKey)
			.query(queryParams)
			.end(function(err, res) {
				var searchResults = res.body.value;
				var searchFacets = facets && facets.length > 0 ? 
					facets : 
					res.body['@search.facets'].campusType.map(function(facet, index) {
            			facet.selected = false;
           	 			return facet;
        			});
				
				console.info(searchFacets);
				AppDispatcher.dispatch({
					actionType: SearchConstants.SET_ALL,
					results: searchResults,
					facets: searchFacets,
					count: res.body['@odata.count'],
					skip: skip,
				});
			});
	},
}

module.exports = SearchActions;