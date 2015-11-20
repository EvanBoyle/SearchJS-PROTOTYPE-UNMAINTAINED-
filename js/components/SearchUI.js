var SearchResults = require("./SearchResults");
var React = require("react");
var SearchStore = require("../stores/SearchStore");
var SearchActions = require("../actions/SearchActions");

var SearchUI = React.createClass({
	getInitialState: function() {
		return({
			results: [],
            facets: []
		});
	},

    componentDidMount: function() {
    	SearchStore.addChangeListener(this._onChange);
    },

    componentWillUnmount: function() {
    	SearchStore.removeChangeListener(this._onChange);
    },

    search: function() {
    	SearchActions.search(this.refs.searchText.value, []);
    },
    
    selectFacet: function(facetName) {
        var newFacets = this.state.facets.map(function(facet) {
            var isSelection = facet.value === facetName;
            facet.selected = isSelection ? !facet.selected : facet.selected;
            return facet;
        });
        
        SearchActions.search(this.refs.searchText.value, newFacets);
    },
    
    handleKeyDown: function(evt) {
        if (evt.keyCode == 13 ) {
            return this.search();
        }
    },

    _onChange: function() {
        var data = SearchStore.getAll();

    	this.setState({
    		results: data.results,
            facets: data.facets
    	});
    },

    render: function() {
        var self = this;
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
                        <div  className="col-md-2">
                            {this.state.facets.map(function(facet, index){
                                return (
                                    <div key={index + 1} className="checkbox">
                                        <label>
                                            <input type="checkbox" onChange={self.selectFacet.bind(self, facet.value)} checked={facet.selected}/> {facet.value}({facet.count})
                                        </label>
                                    </div>
                                    )
                            })}
                        </div>
                        <div className="col-md-10">
                            <SearchResults results={this.state.results}/>
                        </div>
                    </div>
                </div>
            )
    }
});

module.exports = SearchUI