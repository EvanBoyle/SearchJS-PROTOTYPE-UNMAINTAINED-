var React = require("react");
var DefaultCssClasses = require('../utils/DefaultCssClasses');
var Constants = require('../constants/SearchConstants');
var assign = require('object-assign');

var CheckControl = React.createClass({
    getInitialState: function() {
        return {hover: false};
    },
    
    toggleHover: function() {
        this.setState({hover: !this.state.hover});  
    },
    
	render: function() {
        var cssClasses = assign(DefaultCssClasses[Constants.SEARCHFACETS], this.props.cssClasses);
        var cssClass = "";
        
        if(this.props.selected) {
            cssClass = this.state.hover ? cssClasses.searchFacets__facetControlCheckboxCheckedHover : cssClasses.searchFacets__facetControlCheckboxChecked;
        }
        else {
            cssClass = this.state.hover ? cssClasses.searchFacets__facetControlCheckboxUncheckedHover : cssClasses.searchFacets__facetControlCheckboxUnchecked;
        }
        
		return (
            <label className={cssClass} onMouseEnter={this.toggleHover} onMouseLeave={this.toggleHover}>
                <input type="checkbox" className={cssClasses.searchFacets__facetControlCheckbox} onChange={this.props.onFacetSelection} checked={this.props.selected}/> {this.props.value}({this.props.count})
            </label>
		)
	}
});

module.exports = CheckControl;