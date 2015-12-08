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
	search: function(term, facets, skip, top, sortBy, scoringProfile, location){
		var queryParams = {
			'api-version': '2015-02-28',
			'searchMode': 'any',
			'$count': 'true',
			'facet': 'campusType',
			'search': term,
			'$skip': skip,
			'$top' : top
		};
		
		if(scoringProfile) {
			queryParams['scoringProfile'] = scoringProfile;
		}
		
		if(sortBy) {
			if(sortBy === "location"){
				queryParams['$orderby'] = 'geo.distance(location, geography\'POINT(' + location.longitude + ' ' + location.latitude + ')\')'
			}
			else {
				queryParams['$orderby'] = sortBy + " desc";
			}
		}
		
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
				
				AppDispatcher.dispatch({
					actionType: SearchConstants.SET_ALL,
					results: searchResults,
					facets: searchFacets,
					count: res.body['@odata.count'],
					skip: skip,
					sortBy: sortBy
				});
			});
	},
	
	suggest: function(term, suggester) {
		var queryParams = {
			'api-version': '2015-02-28',
			'fuzzy': 'true',
			'suggesterName': suggester,
			'search': term,
			'$top' : 10
		};
		
		request
			.get(urlPrefix + '/suggest')
			.set('api-key', Config.queryKey)
			.query(queryParams)
			.end(function(err, res) {
				// do some stuff, parse some suggestions.
				var suggestions = res.body.value.map(function(suggestion) {
					return suggestion['@search.text'];
				});
				AppDispatcher.dispatch({
					actionType: SearchConstants.SET_SUGGESTIONS,
					suggestions: suggestions
				});
			});
	},
	
	setView: function(viewType) {
		AppDispatcher.dispatch({
			actionType: SearchConstants.SET_VIEW,
			view: viewType
		});
	},
	
	setLocation: function(latitude, longitude) {
		AppDispatcher.dispatch({
			actionType: SearchConstants.SET_LOCATION,
			latitude: latitude,
			longitude: longitude
		});
	}
}

module.exports = SearchActions;