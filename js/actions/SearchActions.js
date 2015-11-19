var AppDispatcher = require('../dispatcher/AppDispatcher');
var Config = require("../config");
var SearchConstants = require('../constants/SearchConstants');
var request = require("superagent");

var urlPrefix = Config.serviceURL +
				"/indexes/" +
				Config.indexName + 
				"/docs";

var SearchActions = {
	search: function(term){
		request
			.get(urlPrefix)
			.set('api-key', Config.queryKey)
			.query({'api-version': '2015-02-28'})
			.query({'searchMode': 'all'})
			.query({'$count': 'true'})
			.query({'facet': 'campusType'})
			.query({'search': encodeURIComponent(term)})
			.end(function(err, res) {
				var searchResults = res.body.value;
				AppDispatcher.dispatch({
					actionType: SearchConstants.SET_RESULTS,
					results: searchResults
				});
			});
	}
}

module.exports = SearchActions;