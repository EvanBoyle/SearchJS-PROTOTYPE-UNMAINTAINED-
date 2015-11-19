var AppDispatcher = require('../dispatcher/AppDispatcher');
var EventEmitter = require('events').EventEmitter;
var SearchConstants = require('../constants/SearchConstants');
var assign = require('object-assign');

var CHANGE_EVENT = 'change';

var _results = [];

function set(results) {
	_results = results;
	// foobar buzz
}

var SearchStore = assign({}, EventEmitter.prototype, {

	getAll: function() {
		return _results;
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
	var text;
	switch(action.actionType) {
		case SearchConstants.SET_RESULTS:
			set(action.results);
			SearchStore.emitChange();
	}
});

module.exports = SearchStore;