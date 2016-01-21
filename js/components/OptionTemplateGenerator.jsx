var React = require('react');
var Handlebars = require('handlebars');

var OptionTemplateGenerator = function(handlebarsTemplate) {
    var OptionTemplate = React.createClass({
        getInitialState: function() {
            return {
                template: handlebarsTemplate
            };
        },
        render: function() {
            var html = this.state.template(this.props.data);
            
            var cssClass = this.props.isSelected ? "selectedOption" : "";
            return <div dangerouslySetInnerHTML={{__html: html}} className={cssClass}></div>
        }
    });
    
    return OptionTemplate;
}

module.exports = OptionTemplateGenerator;