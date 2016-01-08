var AppDispatcher = require('../dispatcher/AppDispatcher');
var EventEmitter = require('events').EventEmitter;
var SearchConstants = require('../constants/SearchConstants');
var CheckboxFacets = require('../models/CheckboxFacets');
var RangeFacet = require('../models/RangeFacet');
var assign = require('object-assign');

var CHANGE_EVENT = 'change';

var _results = [];
var _facets = {
	campusType: new CheckboxFacets('campusType', false),
    sportsTeamCount: new CheckboxFacets('sportsTeamCount', true),
    studentsCount: new RangeFacet('studentsCount', 0, 100000),
    endowmentAmount: new RangeFacet('endowmentAmount', 0, 40000000000)
};
var _count = 0;
var _top = 24;
var _skip = 0;
var _options = [
		{
			text: "relevance",
			value: ""
		},
		{
			text: "endowment",
			value: "endowmentAmount"
		},
		{
			text: "sports Teams",
			value: "sportsTeamCount"
		},
		{
			text: "enrollment",
			value: "studentsCount"
		},
		{
			text: "nearby",
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

function set(results, count, skip, sortBy) {
	_results = results;
	_count = count;
	_skip = skip;
	_sortBy = sortBy
}

function setFacets(facets) {
    
    Object.keys(facets).forEach(function(key) {
        if(key.indexOf('@odata.type') < 0) {
            _facets[key].setValues(facets[key]);
        }
    });
}

function updateFacets(facets) {
    Object.keys(facets).forEach(function(key) {
        if(key.indexOf('@odata.type') < 0) {
            _facets[key].updateValues(facets[key]);
        }
    });
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
			set(action.results, action.count, action.skip, action.sortBy);
			SearchStore.emitChange();
			break;
		case SearchConstants.APPEND:
			set(_results.concat(action.results), action.count, action.skip, action.sortBy);
			SearchStore.emitChange();
			break;
        case SearchConstants.SET_FACETS:
            setFacets(action.facets)
            SearchStore.emitChange();
            break;
        case SearchConstants.UPDATE_FACETS:
            updateFacets(action.facets)
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
            break;
	}
});

module.exports = SearchStore;