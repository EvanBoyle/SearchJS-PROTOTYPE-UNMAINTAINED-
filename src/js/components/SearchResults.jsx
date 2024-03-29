var React = require('react');
var ReactDOM = require('react-dom');
var SearchResult = require('./SearchResult.jsx');
var SearchActions = require('../actions/SearchActions');
var SearchStore = require('../stores/SearchStore');
var Infinite = require('react-infinite');
var DefaultCssClasses = require('../utils/DefaultCssClasses');
var Constants = require('../constants/SearchConstants');
var assign = require('object-assign');

var SearchResults = React.createClass({
    getInitialState: function() {
        return {
            top: 0,
            count: 0,
            results: [],
            containerHeight: 500,
            elementHeight: 100,
            firstRender: true
        }
    },
    componentDidMount: function() {
        // todo add a handler to call calculate height on resize
        SearchStore.addChangeListener(this.onChange);  
        this.onChange();
    },
    onChange: function() {
        var data = SearchStore.getDataForResultsView();
        this.setState({
            results: data.results,
            top: data.top,
            count: data.count
        });       
    },
	componentDidUpdate: function() {
        var node = ReactDOM.findDOMNode(this);
        // scroll to top if this is a new results set
  		if (this.state.results.length <= this.state.top) {
    		var node = ReactDOM.findDOMNode(this);
    		node.scrollTop = 0;
  		}
        
        // only compute height updates if we have results
        // only comput on resize or the first time we render results
        if(this.state.results.length === 0 || !this.state.firstRender) {
            return;
        }
    },
    calculateHeightsForInfiniteScroll: function() {
        var node = ReactDOM.findDOMNode(this);
        var container = node.parentElement
        var containerHeight = container.offsetHeight;
        var containerWidth  = container.offsetWidth;
        
        var cssClasses = assign(DefaultCssClasses[Constants.SEARCHBOX], this.props.cssClasses);
        var cssClass = cssClasses.searchResults__result;
        var resultElements = node.getElementsByClassName(cssClass);
        var elementWidth = resultElements.length > 0 ? resultElements[resultElements.length - 1].offsetWidth : 100;
        var elementHeight = resultElements.length > 0 ? resultElements[resultElements.length - 1].offsetHeight : 100;
        
        //add .01 when computing due to rounding in dom size computation
        var rows = Math.floor((containerHeight / elementHeight)+.01);
        var cols = Math.floor((containerWidth / elementWidth)+.01);
        
        // element height for scrolling purposes must take number of elements per row into account
        var height = elementHeight / cols;
        
        return({
            containerHeight: containerHeight,
            elementHeight: height
        })
    },
    loadMore: function() {
        if(this.state.results.length >= this.state.count) {
            return;
        }
        SearchActions.loadMore();
    },
	render: function(){
		if(this.state.results.length === 0){
			return <div></div>
		}
		
        var resultTemplate = this.props.resultTemplate;
        var modalTemplate = this.props.modalTemplate;
        var modalTitleTemplate = this.props.modalTitleTemplate;
        var rootElementId = this.props.rootElementId;
        var cssClasses = this.props.cssClasses;
        var resultProcessor = this.props.resultProcessor;

        // calling this here raises a warning for touching the DOM
        // calling inside of componentDidUpdate results in a loop/stackoverflow
        // TODO figure out how to get rid of this warning, or call the method in a different location
        // TODO also do this calculation when we resize
        var heights = this.calculateHeightsForInfiniteScroll();
        
        var results = this.state.results;
        if (typeof(resultProcessor) !== "undefined") {
            results = resultProcessor(results);
        }

		return (
				<Infinite 
                    useWindowAsScrollContainer
                    elementHeight={heights.elementHeight} 
                    onInfiniteLoad={this.loadMore} 
                    isInfiniteLoading={false} 
                    infiniteLoadBeginEdgeOffset={600}>
                        {results.map(function(result, index){
                                return <SearchResult result={result} key={index} index={index + 1} resultTemplate={resultTemplate} modalTemplate={modalTemplate} modalTitleTemplate={modalTitleTemplate} rootElementId={rootElementId} cssClasses={cssClasses}/>
                        })}
				</Infinite>
			)
	}
});

module.exports = SearchResults;