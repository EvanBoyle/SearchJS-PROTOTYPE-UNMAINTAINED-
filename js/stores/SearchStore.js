var AppDispatcher = require('../dispatcher/AppDispatcher');
var EventEmitter = require('events').EventEmitter;
var SearchConstants = require('../constants/SearchConstants');
var assign = require('object-assign');

var CHANGE_EVENT = 'change';

var _results = [];
var _facets = [];
var _count = 0;
var _top = 9;
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
		},
		{
			text: "Nearby",
			value: "location"
		}
	];
var _sortBy = "";
var _scoringProfile = "titleBoost";
var _view = SearchConstants.GRID_VIEW;
var _location = {
	latitude: 0,
	longitude: 0
};
var _suggestions = [];
var _suggester = 'titleSuggester';

function set(results, facets, count, skip, sortBy) {
	_results = results;
	_facets = facets;
	_count = count;
	_skip = skip;
	_sortBy = sortBy
}

function setSuggestions(suggestions) {
	_suggestions = suggestions;
}

function setView(view) {
	_view = view;
}

function setLocation(latitude, longitude) {
	_location = {
		latitude: latitude,
		longitude: longitude	
	};
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
			scoringProfile: _scoringProfile,
			view: _view,
			location: _location,
			suggestions: _suggestions,
			suggester: _suggester
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
			break;
		case SearchConstants.SET_VIEW:
			setView(action.view);
			SearchStore.emitChange();
			break;
		case SearchConstants.SET_LOCATION:
			setLocation(action.latitude, action.longitude);
			SearchStore.emitChange();
			break;
		case SearchConstants.SET_SUGGESTIONS:
			setSuggestions(action.suggestions);
			SearchStore.emitChange();
	}
});

module.exports = SearchStore;