var React = require('react');


var OptionTemplate = React.createClass({
	
	render: function() {
		var cssClass = this.props.isSelected ? "selectedOption" : "";
		return <div dangerouslySetInnerHTML={{__html: this.props.data}} className={cssClass}></div>
	}
});

module.exports = OptionTemplate;