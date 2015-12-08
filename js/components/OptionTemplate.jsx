var React = require('react');


var OptionTemplate = React.createClass({
	render: function() {
		return <div>{this.props.data}</div>
	}
});

module.exports = OptionTemplate;