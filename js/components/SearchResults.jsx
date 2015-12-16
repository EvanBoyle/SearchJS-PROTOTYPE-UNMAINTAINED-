var React = require('react');
var ReactDOM = require('react-dom');
var SearchResult = require('./SearchResult.jsx');
var Infinite = require('react-infinite');


var SearchResults = React.createClass({
	componentDidUpdate: function() {
  		if (this.props.results.length <= this.props.top) {
    		var node = ReactDOM.findDOMNode(this);
    		node.scrollTop = 0;
  		}
},
	render: function(){
		if(this.props.results.length === 0){
			return <div></div>
		}
		
		// todo: don't hard code the numbers below
		// elementHeight is divided by 9 because we display 3 rows of 3 results
		
		return (
				<Infinite containerHeight={793} elementHeight={793/9} onInfiniteLoad={this.props.loader} isInfiniteLoading={false} infiniteLoadBeginEdgeOffset={600}>
					{this.props.results.map(function(result, index){
							return <SearchResult result={result} key={index} index={index + 1}/>
					})}
				</Infinite>
			)
	}
});

module.exports = SearchResults;