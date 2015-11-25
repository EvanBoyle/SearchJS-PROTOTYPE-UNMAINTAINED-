var AppDispatcher = require('../dispatcher/AppDispatcher');
var EventEmitter = require('events').EventEmitter;
var SearchConstants = require('../constants/SearchConstants');
var assign = require('object-assign');

var CHANGE_EVENT = 'change';

var _results = [];
var _facets = [];
var _count = 0;
var _top = 12;
var _skip = 0;
var _options = [
		{
			text: "Relevance",
			value: ""
		},
		{
			text: "Endowment",
			value: "endowmentAmount"
		},
		{
			text: "Sports Teams",
			value: "sportsTeamCount"
		},
		{
			text: "Enrollment",
			value: "studentsCount"
		}
	];
var _sortBy = "";
var _scoringProfile = "titleBoost";

function set(results, facets, count, skip, sortBy) {
	_results = results;
	_facets = facets;
	_count = count;
	_skip = skip;
	_sortBy = sortBy
}

var SearchStore = assign({}, EventEmitter.prototype, {

	getAll: function() {
		return {
			results: _results,
			facets: _facets,
			count: _count,
			top: _top,
			skip: _skip,
			options: _options,
			sortBy: _sortBy,
			scoringProfile: _scoringProfile
		};
	},

	emitChange: function() {
		this.emit(CHANGE_EVENT)
	},

	addChangeListener: function(callback) {
		this.on(CHANGE_EVENT, callback);
	},

	removeChangeListener: function(callback) {
		this.removeListener(CHANGE_EVENT, callback);
	}
});

AppDispatcher.register(function(action) {
	switch(action.actionType) {
		case SearchConstants.SET_ALL:
			set(action.results, action.facets, action.count, action.skip, action.sortBy);
			SearchStore.emitChange();
	}
});

module.exports = SearchStore;