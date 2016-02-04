var React = require('react');

var OptionTemplateGenerator = function(htmlTemplate) {
    var OptionTemplate = React.createClass({
        getInitialState: function() {
            return {
                template: htmlTemplate
            };
        },
        render: function() {
            var html = this.state.template.render(this.props.data);
            
            var cssClass = this.props.isSelected ? "selectedOption" : "";
            return <div dangerouslySetInnerHTML={{__html: html}} className={cssClass}></div>
        }
    });
    
    return OptionTemplate;
}

module.exports = OptionTemplateGenerator;