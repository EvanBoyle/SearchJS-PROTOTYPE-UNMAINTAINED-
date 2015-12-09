var SearchResults = require("./SearchResults.jsx");
var Pager = require("./Pager.jsx");
var Sorter = require("./Sorter.jsx");
var Map = require("./Map.jsx");
var OptionTemplate = require('./OptionTemplate.jsx');
var React = require("react");
var Typeahead = require('react-typeahead-component');
var SearchStore = require("../stores/SearchStore");
var SearchActions = require("../actions/SearchActions");
var SearchConstants = require("../constants/SearchConstants");

var SearchUI = React.createClass({
	getInitialState: function() {
		return({
			results: [],
            facets: [],
            skip: 0,
            top: 0,
            count: 0,
            options: [],
            sortBy: "",
            scoringProfile: "",
            view: SearchConstants.GRID_VIEW,
            location: {
                longitude: 0,
                latitude: 0
            },
            suggestions: [],
            suggester: "",
            input: "" //this one isn't in the store
		});
	},
    
    setInput: function(input) {
        this.setState({input: input});  
    },

    componentDidMount: function() {
        navigator.geolocation.getCurrentPosition(function(location) {
            SearchActions.setLocation(location.coords.latitude, location.coords.longitude)
        }); 
    	SearchStore.addChangeListener(this._onChange);
        this._onChange();
    },

    componentWillUnmount: function() {
    	SearchStore.removeChangeListener(this._onChange);
    },

    search: function() {
    	SearchActions.search(this.state.input, [], 0, this.state.top, this.state.sortBy, this.state.scoringProfile, this.state.location);
    },
    
    selectFacet: function(facetName) {
        var newFacets = this.state.facets.map(function(facet) {
            var isSelection = facet.value === facetName;
            facet.selected = isSelection ? !facet.selected : facet.selected;
            return facet;
        });
        
        SearchActions.search(this.state.input, newFacets, 0, this.state.top, this.state.sortBy, this.state.scoringProfile, this.state.location);
    },
    
    page: function(page) {
        SearchActions.search(this.state.input, this.state.facets, (page - 1)*this.state.top, this.state.top, this.state.sortBy, this.state.scoringProfile, this.state.location);
    },
    
    handleKeyDown: function(evt) {
        
        if (evt.keyCode == 13 ) {
            return this.search();
        }
        else {
            var input = evt.target.value
            this.setInput(input);
            SearchActions.suggest(input, this.state.suggester);
        }
    },
    
    getPagerData: function() {
        var maxPages = Math.ceil(this.state.count/this.state.top);
		var currentPage = (this.state.skip + this.state.top)/this.state.top;
        var startPage = currentPage - 2 > 0 ? currentPage - 2 : 1;
        return {
            maxPages: maxPages,
            currentPage: currentPage,
            startPage: startPage,
            lastPage: startPage + 4 < maxPages ? startPage + 4 : maxPages
        };
    },
    
    sort: function(event) {
        // search maintaining facets, reset to first page, event.target.value is the sort order
        SearchActions.search(this.state.input, this.state.facets, 0, this.state.top, event.target.value, this.state.scoringProfile, this.state.location);
    },
    
    setGridView: function() {
        SearchActions.setView(SearchConstants.GRID_VIEW);
    },
    
    setMapView: function() {
        SearchActions.setView(SearchConstants.MAP_VIEW);
    },

    _onChange: function() {
        var data = SearchStore.getAll();

    	this.setState({
    		results: data.results,
            facets: data.facets,
            skip: data.skip,
            top: data.top,
            count: data.count,
            options: data.options,
            sortBy: data.sortBy,
            scoringProfile: data.scoringProfile,
            view: data.view,
            location: data.location,
            suggestions: data.suggestions,
            suggester: data.suggester
    	});
    },

    render: function() {
        var self = this;
        
        var mapElement = this.state.results.length > 0 ? <Map results={this.state.results}/> : <div></div>;
        var resultsView = this.state.view === SearchConstants.GRID_VIEW ? <SearchResults results={this.state.results}/> : mapElement;
        
        // params for pager control
        var pagerData = this.getPagerData();
        var pagerLabel = this.state.count > 0 ? (this.state.skip + 1)+"-"+(this.state.skip+this.state.top) + " of " + this.state.count + " results" : "";
        
        var gridButtonStyle = this.state.view === SearchConstants.GRID_VIEW ? "btn btn-default active" : "btn btn-default";
        var mapButtonStyle = this.state.view === SearchConstants.MAP_VIEW ? "btn btn-default active" : "btn btn-default";
        
    	return (
                <div className="mainContainer">
                
                    <div className="greenBanner">
                    </div>
                    
                    <div className="searchContainer">
                    
                        <div className="searchNav">
                            <Typeahead
                                    inputValue={this.state.input}
                                    options={this.state.suggestions}
                                    onChange={this.handleKeyDown}
                                    optionTemplate={OptionTemplate}
                                    onDropdownClose={this.search}
                                />
                                <button type="button" onClick={this.search}>Search</button>
                        </div>
                        
                        <div className="searchPane">
                        
                            <div className="searchControls">
                                <Sorter ref="sortBy" value={this.state.sortBy} options={this.state.options} onSelectionChange={this.sort}/>
                                <div className="btn-group" role="group" >
                                    <button type="button" className={gridButtonStyle} onClick={this.setGridView}>
                                        <span className="glyphicon glyphicon-th-large" aria-hidden="true"></span>
                                    </button>
                                    <button type="button" className={mapButtonStyle} onClick={this.setMapView}>
                                        <span className="glyphicon glyphicon-map-marker" aria-hidden="true"></span>
                                    </button>
                                </div>
                            </div>
                            
                            <div className="facets">
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
                            
                            <div className="resultsPane">
                                {resultsView}
                                
                            </div>
                            <div className="navFooter">
                                <Pager self={self} maxPages={pagerData.maxPages} currentPage={pagerData.currentPage} startPage={pagerData.startPage} lastPage={pagerData.lastPage} callback={this.page}/>
                                {pagerLabel}
                            </div>
                            
                        </div>
                        
                    </div>
                    
                </div>
            )
    }
});

module.exports = SearchUI