SearchResults = require("./SearchResults");
React = require("react");
SearchStore = require("../stores/SearchStore");
SearchActions = require("../actions/SearchActions");

var SearchUI = React.createClass({
	getInitialState: function() {
		return({
			results: []
		});
	},

    componentDidMount: function() {
    	SearchStore.addChangeListener(this._onChange);
    },

    componentWillUnmount: function() {
    	SearchStore.removeChangeListener(this._onChange);
    },

    search: function() {
    	SearchActions.search(this.refs.searchText.value);
    },

    _onChange: function() {
    	var searchResults = SearchStore.getAll();
    	this.setState({
    		results: searchResults
    	});
    },

    render: function() {
    	return (
                <div className="container">
                    <div className="row form-group">
                        <label for="searchBox" className="col-md-1 control-label">Wikiversity</label>
                        <div className="col-md-7">
                            <div className="input-group">
                                <input id="searchBox" type="text" className="form-control" ref="searchText" onKeyDown={this.handleKeyDown}/>  
                                <span className="input-group-btn">
                                    <button className="btn btn-default" type="button" onClick={this.search}>Search</button>
                                </span>
                            </div>
                        </div>        
                    </div>
                    <div className="row">
                        <div className="col-md-10">
                            <SearchResults results={this.state.results}/>
                        </div>
                    </div>
                </div>
            )
    }
});

module.exports = SearchUI