var React = require('react');


var OptionTemplate = React.createClass({
	
	render: function() {
		var cssClass = this.props.isSelected ? "selectedOption" : "";
		return <div className={cssClass}>{this.props.data}</div>
	}
});

module.exports = OptionTemplate;