var SearchResults = require("./SearchResults");
var Pager = require("./Pager");
var React = require("react");
var SearchStore = require("../stores/SearchStore");
var SearchActions = require("../actions/SearchActions");

var SearchUI = React.createClass({
	getInitialState: function() {
		return({
			results: [],
            facets: [],
            skip: 0,
            top: 0,
            count: 0
		});
	},

    componentDidMount: function() {
    	SearchStore.addChangeListener(this._onChange);
        this._onChange();
    },

    componentWillUnmount: function() {
    	SearchStore.removeChangeListener(this._onChange);
    },

    search: function() {
    	SearchActions.search(this.refs.searchText.value, [], 0, this.state.top);
    },
    
    selectFacet: function(facetName) {
        var newFacets = this.state.facets.map(function(facet) {
            var isSelection = facet.value === facetName;
            facet.selected = isSelection ? !facet.selected : facet.selected;
            return facet;
        });
        
        SearchActions.search(this.refs.searchText.value, newFacets, this.state.skip, this.state.top);
    },
    
    page: function(page) {
        SearchActions.search(this.refs.searchText.value, this.state.facets, (page - 1)*this.state.top, this.state.top);
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
            facets: data.facets,
            skip: data.skip,
            top: data.top,
            count: data.count
    	});
    },

    render: function() {
        var self = this;
        
        // params for pager control
        var maxPages = Math.ceil(this.state.count/this.state.top);
		var currentPage = (this.state.skip + this.state.top)/this.state.top;
		var startPage = currentPage - 2 > 0 ? currentPage - 2 : 1;
		var lastPage = currentPage + 2 < maxPages ? currentPage + 2 : maxPages;
        
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
                        <Pager self={self} maxPages={maxPages} currentPage={currentPage} startPage={startPage} lastPage={lastPage} callback={this.page}/>
                    </div>
                </div>
            )
    }
});

module.exports = SearchUI