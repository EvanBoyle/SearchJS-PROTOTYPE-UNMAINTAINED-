var React = require("react");

var CheckControl = React.createClass({
    getInitialState: function() {
        return {hover: false};
    },
    
    toggleHover: function() {
        this.setState({hover: !this.state.hover});  
    },
    
	render: function() {
        
        if(this.props.selected) {
            cssClass = this.state.hover ? "checked-hover" : "checked";
        }
        else {
            cssClass = this.state.hover ? "unchecked-hover" : "unchecked";
        }
        
		return (
            <label className={cssClass} onMouseEnter={this.toggleHover} onMouseLeave={this.toggleHover}>
                <input type="checkbox" onChange={this.props.onFacetSelection} checked={this.props.selected}/> {this.props.value}({this.props.count})
            </label>
		)
	}
});

module.exports = CheckControl;