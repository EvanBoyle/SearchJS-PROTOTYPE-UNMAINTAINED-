var SearchResults = require("./SearchResults.jsx");
var Sorter = require("./Sorter.jsx");
var Map = require("./Map.jsx");
var OptionTemplate = require('./OptionTemplate.jsx');
var React = require("react");
var Typeahead = require('react-typeahead-component');
var SearchStore = require("../stores/SearchStore");
var SearchActions = require("../actions/SearchActions");
var SearchConstants = require("../constants/SearchConstants");
var InfiniteScroll = require('react-infinite-scroll')(React);

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
        // must strip out HTML tags used to style suggestion highlights
        // in this case <b> </b>
        this.setState({input: input.replace("<b>","").replace("</b>", "")});  
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
    
    handleOptionChange: function(evt, option){
        this.setInput(option);
    },
    
    handleOptionClick: function(event, option) {
        this.setInput(option);
        this.search();
    },
    
    sort: function(event) {
        // search maintaining facets, reset to first page, event.target.value is the sort order
        SearchActions.search(this.state.input, this.state.facets, 0, this.state.top, event.target.value, this.state.scoringProfile, this.state.location);
    },
    
    setView: function(event) {
        SearchActions.setView(event.target.value);
    },
    
    loadMore: function(event) {
        if(this.state.results.length >= this.state.count) {
            return;
        }
        SearchActions.search(this.state.input, this.state.facets, this.state.skip + this.state.top, this.state.top, this.state.sortBy, this.state.scoringProfile, this.state.location, true);
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
        var resultsView = this.state.view === SearchConstants.GRID_VIEW ? <SearchResults loader={this.loadMore} results={this.state.results}/> : mapElement;
        
        var pagerLabel = (this.state.skip+this.state.top) + " of " + this.state.count + " results";
        
    	return (
                <div className="mainContainer">
                
                    <div className="greenBanner">
                    </div>
                    
                    <div className="searchContainer">
                    
                        <div className="searchNav">
                            <div className="controlContainer">
                                <span className="title">
                                    <img className="logo" src={"../../img/wikiversityLogo.png"}/> <b>FIND</b> SCHOOLS
                                </span>
                                <Typeahead
                                    inputValue={this.state.input}
                                    options={this.state.suggestions}
                                    onChange={this.handleKeyDown}
                                    optionTemplate={OptionTemplate}
                                    onDropdownClose={this.search}
                                    onOptionChange={this.handleOptionChange}
                                    onOptionClick={this.handleOptionClick}
                                    placeholder="Start your search here..."
                                />
                                <button className="searchButton" type="button" onClick={this.search}><img src={"../../img/searchButton.png"}/></button>
                            </div>
                            
                        </div>
                        
                        <div className="searchPane">
                        
                            <div className="searchControls">
                                <span className="refineLabel">Refine your search:</span>
                                <span className="sortContainer">
                                    <Sorter ref="sortBy" value={this.state.sortBy} options={this.state.options} onSelectionChange={this.sort}/>
                                    <span className="dropdownLabel">Sort by:</span>
                                </span>

                                <span className="viewControlContainer">
                                    <select className="dropdown" value={this.state.view} onChange={this.setView}>
                                        <option value={SearchConstants.GRID_VIEW}>grid</option>
                                        <option value={SearchConstants.MAP_VIEW}>map</option>
                                    </select>
                                    <span className="dropdownLabel">View as:</span>
                                </span>
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
                                {pagerLabel}
                            </div>
                            
                        </div>
                        
                    </div>
                    
                </div>
            )
    }
});

module.exports = SearchUI