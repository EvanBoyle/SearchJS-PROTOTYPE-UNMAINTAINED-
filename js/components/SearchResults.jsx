var React = require('react');
var ReactDOM = require('react-dom');
var SearchResult = require('./SearchResult.jsx');
var SearchActions = require('../actions/SearchActions');
var SearchStore = require('../stores/SearchStore');
var Infinite = require('react-infinite');
var Handlebars = require('handlebars');


var SearchResults = React.createClass({
    getInitialState: function() {
        return {
            top: 0,
            results: []
        }
    },
    componentDidMount: function() {
        SearchStore.addChangeListener(this.onChange);  
        this.onChange();
    },
    onChange: function() {
        var data = SearchStore.getDataForResultsView();
        this.setState({
            results: data.results,
            top: data.top
        });       
    },
	componentDidUpdate: function() {
  		if (this.state.results.length <= this.state.top) {
    		var node = ReactDOM.findDOMNode(this);
    		node.scrollTop = 0;
  		}
    },
    loadMore: function() {
        SearchActions.loadMore();
    },
	render: function(){
		if(this.state.results.length === 0){
			return <div></div>
		}
		
		// todo: don't hard code the numbers below
		// elementHeight is divided by 9 because we display 3 rows of 3 results
      
        // maybe limit infinite scroll to one row only, fixed element heights?
        // fixed width/height elements, then measure width and height of container do computations to determine values below
        var width =  document.getElementById("results").offsetWidth;
        var height =  document.getElementById("results").offsetHeight;
		console.info("width " + width);
        console.info("height " + height);
        // can use this with the following: window.addEventListener("resize", this.updateDimensions); inside of componentDidMount to trigger these calculations        
        var element = ReactDOM.findDOMNode(this);
        
        var resultTemplate = Handlebars.compile(this.props.resultTemplate);
        
		return (
				<Infinite containerHeight={793} elementHeight={793/9} onInfiniteLoad={this.loadMore} isInfiniteLoading={false} infiniteLoadBeginEdgeOffset={600}>
					{this.state.results.map(function(result, index){
							return <SearchResult result={result} key={index} index={index + 1} resultTemplate={resultTemplate}/>
					})}
				</Infinite>
			)
	}
});

module.exports = SearchResults;