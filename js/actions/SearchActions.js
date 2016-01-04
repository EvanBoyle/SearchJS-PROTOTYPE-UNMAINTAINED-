var AppDispatcher = require('../dispatcher/AppDispatcher');
var Config = require("../config");
var SearchConstants = require('../constants/SearchConstants');
var request = require("superagent");

var urlPrefix = Config.serviceURL +
				"/indexes/" +
				Config.indexName + 
				"/docs";
				
var buildFilter = function(facets) {
	var keys = Object.keys(facets);
    var filters = [];
    keys.forEach(function(key) {
        var filter = facets[key].getFilter();
        if(filter) {
            filters.push(filter);
        }
    });
    
    return filters.length > 0 ? filters.join(" and ") : null;
};

// loadMore is false by default, if set to true, we will append results rather than set new ones
var SearchActions = {
	search: function(term, facets, skip, top, sortBy, scoringProfile, location, loadMore){
		var queryParams = {
			'api-version': '2015-02-28',
			'searchMode': 'any',
			'$count': 'true',
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
		
		queryParams['$filter'] = buildFilter(facets);
        
        // we request the facets without filters and set them here, facets with filters must be done in a separate request
        var filterlessFacets = Object.keys(facets).filter(function(key) {
           return facets[key].getFilter() === null;
        });
        
        var facetClauses = filterlessFacets.map(function(key) {
            return facets[key].getFacetClause();
        });
		var facetClause = facetClauses.length > 0 ? "facet=" + facetClauses.join("&facet=") : null;
        
        // update the facets that have filters applied
        this.getFacets(facets, term);
        
        // get search results and facets with out filters
		request
			.get(urlPrefix)
			.set('api-key', Config.queryKey)
			.query(queryParams)
            // facet clause must be specified seperately because it reuses the query param 'facet=&facet=..'
            .query(facetClause)
			.end(function(err, res) {
				var searchResults = res.body.value;
				AppDispatcher.dispatch({
					actionType: loadMore ? SearchConstants.APPEND : SearchConstants.SET_ALL,
					results: searchResults,
					count: res.body['@odata.count'],
					skip: skip,
					sortBy: sortBy
				});
                if(res.body['@search.facets']) {
                    AppDispatcher.dispatch({
                        actionType: SearchConstants.SET_FACETS,
                        facets: res.body['@search.facets'],
                    });
                }
			});
	},
    
    getFacets: function(facets, term) {
        var filteredFacets = Object.keys(facets).filter(function(key) {
           return facets[key].getFilter() !== null;
        });
        if(filteredFacets.length < 1) {
            return;
        }
        filteredFacets.forEach(function(facet) {
            var queryParams = {
                'api-version': '2015-02-28',
                'searchMode': 'any',
                'search': term,
                '$top' : 0
            };
            var currentFacets = filteredFacets.filter(function(targetFacet) {
                return targetFacet !== facet;
            });
            var filters = currentFacets.map(function(currentFacet) {
                return facets[currentFacet].getFilter();
            });
            
            queryParams['$filter'] = filters.length > 0 ? filters.join(" and ") : null;
            queryParams['facet'] = facet;
            request
                .get(urlPrefix)
                .set('api-key', Config.queryKey)
                .query(queryParams)
                .end(function(err, res) {
                    AppDispatcher.dispatch({
                        actionType: SearchConstants.UPDATE_FACETS,
                        facets: res.body['@search.facets'],
                    });
                });
        });
    },
	
	suggest: function(term, suggester) {
		var queryParams = {
			'api-version': '2015-02-28',
			'fuzzy': 'true',
			'suggesterName': suggester,
			'search': term,
			'$top' : 10,
			'highlightPreTag': '<b>',
			'highlightPostTag': '</b>'
		};
		
		request
			.get(urlPrefix + '/suggest')
			.set('api-key', Config.queryKey)
			.query(queryParams)
			.end(function(err, res) {
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