var AppDispatcher = require('../dispatcher/AppDispatcher');
var EventEmitter = require('events').EventEmitter;
var SearchConstants = require('../constants/SearchConstants');
var CheckboxFacets = require('../models/CheckboxFacets');
var RangeFacet = require('../models/RangeFacet');
var assign = require('object-assign');

var CHANGE_EVENT = 'change';

var _serviceName = "";
var _index = "";
var _queryKey = "";
var _results = [];
var _facets = {};
var _input = "";
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
var _scoringProfile = null;
var _select = null;
var _searchFields = null;
var _view = SearchConstants.GRID_VIEW;
var _location = {
	latitude: 0,
	longitude: 0
};
var _suggestions = [];
var _suggester = 'titleSuggester';
var _keyField = '';
var _loggingURL = '';

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

function setInput(input) {
    _input = input;
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

function addFacet(facet) {
    _facets[facet.key] = facet;
}

function selectFacet(field, value) {
    _facets[field].values.forEach(function(facet, index) {
        var isSelection = facet.value === value;
        _facets[field].values[index].selected = isSelection ? !facet.selected : facet.selected;
    });
}

function setFacetRange(field, lowerBound, upperBound) {
    _facets[field].lowerBound = lowerBound;
    _facets[field].upperBound = upperBound;
}

function clearFacets() {
    Object.keys(_facets).forEach(function(key) {
        _facets[key].clearSelections();
    });
}

function setSearchParameters(parameters) {
    _scoringProfile = parameters.scoringProfile;
    _select = parameters.select
    _searchFields = parameters.searchFields
}

function setup(serviceName, queryKey, index, keyField, loggingURL) {
    _serviceName = serviceName;
    _queryKey = queryKey;
    _index = index;
    _keyField = keyField;
    _loggingURL = loggingURL;
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
    
    getDataForSearchQuery: function() {
        return {
            input: _input,
            facets: _facets,
            skip: _skip,
            top: _top,
            sortBy: _sortBy,
            scoringProfile: _scoringProfile,
            select: _select,
            searchFields: _searchFields,
            location: _location,  
        };
    },
    
    getDataForResultsView: function() {
        return {
            results: _results,
            top: _top,
            count: _count
        };
    },
    
    getDataForSuggestions: function() {
        return {
            input: _input,
            suggestions: _suggestions
        };    
    },
    
    getFacet: function(field) {
        return _facets[field];
    },
    
    getResultsCount: function() {
        return _count;
    },
    
    getConfig: function() {
        return {
            serviceName: _serviceName,
            queryKey: _queryKey,
            index: _index  
        };
    },

    getKeyField: function() {
        return _keyField;
    },

    getLoggingURL: function() {
        return _loggingURL;
    },
    
	emitChange: function() {
		this.emit(CHANGE_EVENT);
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
        case SearchConstants.SET_INPUT: 
            setInput(action.input);
            SearchStore.emitChange();
            break;
        case SearchConstants.ADD_FACET:
            addFacet(action.facet);
            SearchStore.emitChange();
            break;
        case SearchConstants.SELECT_FACET:
            selectFacet(action.field, action.value);
            SearchStore.emitChange();
            break;
        case SearchConstants.CLEAR_FACETS:
            clearFacets();
            SearchStore.emitChange();
            break;
        case SearchConstants.SET_FACET_RANGE:
            setFacetRange(action.field, action.lowerBound, action.upperBound);
            SearchStore.emitChange();
            break;
        case SearchConstants.SETUP:
            setup(action.serviceName, action.queryKey, action.index, action.keyField, action.loggingURL);
            SearchStore.emitChange();
            break;
        case SearchConstants.SET_SEARCH_PARAMETERS:
            setSearchParameters(action.parameters);
	}
});

module.exports = SearchStore;