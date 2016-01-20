var React = require('react');
var Handlebars = require('handlebars');


var OptionTemplate = React.createClass({
	
	render: function() {
        var template = Handlebars.compile("{{{searchText}}}");
        var html = template(this.props.data);
        
		var cssClass = this.props.isSelected ? "selectedOption" : "";
		return <div dangerouslySetInnerHTML={{__html: html}} className={cssClass}></div>
	}
});

module.exports = OptionTemplate;