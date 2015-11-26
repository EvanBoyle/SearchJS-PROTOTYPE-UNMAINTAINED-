var React = require('react');
var ReactDOM = require('react-dom');
var config = require('../config');

var Map = React.createClass({
	componentDidMount: function() {

			var map = new Microsoft.Maps.Map(ReactDOM.findDOMNode(this), {credentials: config.bingAPIKey, width: 400, height: 400})

	},
	
	render: function() {
		this.props.results;
		var style = {
			width: "400px",
			height: "400px"
		};

		return <div style={style} ref="map"></div>
	}
});

module.exports = Map;