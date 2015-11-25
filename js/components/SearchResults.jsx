var React = require('react');
var SearchResult = require('./SearchResult');

var SearchResults = React.createClass({
	render: function(){
		if(this.props.results.length === 0){
			return <div></div>
		}
		return (
				<div >
						{this.props.results.map(function(result, index){
								return <SearchResult result={result} key={index} index={index + 1}/>
							})}

				</div>
			)
	}
});

module.exports = SearchResults;