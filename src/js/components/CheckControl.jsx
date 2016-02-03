var React = require("react");

var CheckControl = React.createClass({
    getInitialState: function() {
        return {hover: false};
    },
    
    toggleHover: function() {
        this.setState({hover: !this.state.hover});  
    },
    
	render: function() {
        checkStyle = {color: "#8AC224"};
        var normalElement = <span className="checkElement">&nbsp;&nbsp;</span>;
        var checkedElement = <span className="checkElement" style={checkStyle}>&#x2713;</span>;
        var hoverChecked = <span className="checkElement">-</span>;
        var hoverUnchecked = <span className="checkElement">+</span>;

        var statusElement;
        var cssClass = "";
        if(this.props.selected) {
            statusElement= this.state.hover ? hoverChecked : checkedElement;
            cssClass = this.state.hover ? "checked-hover" : "checked";
        }
        else {
            statusElement = this.state.hover ? hoverUnchecked : normalElement;
            cssClass = this.state.hover ? "unchecked-hover" : "unchecked";
        }
        
		return (
            <label className={cssClass} onMouseEnter={this.toggleHover} onMouseLeave={this.toggleHover}>
                {statusElement}
                <input type="checkbox" onChange={this.props.onFacetSelection} checked={this.props.selected}/> {this.props.value}({this.props.count})
            </label>
		)
	}
});

module.exports = CheckControl;