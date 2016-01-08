var React = require("react");
var CheckControl = require("./CheckControl.jsx");

var CheckboxFacetControl = React.createClass({
    getInitialState: function() {
        return {collapsed: false};
    },
    
    toggleCollapse: function() {
        this.setState({collapsed: !this.state.collapsed});
    },
    
	render: function() {
		var self = this;
        if(!this.props.facets || this.props.facets.values.length < 1) {
            return <div></div>
        }
        var chevron = this.state.collapsed ? "<" : ">";
        var collapsedClass = this.state.collapsed ? "collapsed" : "collapsedContainer";
		return (
			<div className="checkboxFacet">
                <div className="facetLabel" onClick={this.toggleCollapse}>
                    {this.props.displayName} {chevron}
                </div>
                <div className={collapsedClass}>
                    {this.props.facets.values.map(function(facet, index){
                        return (
                            <div key={index + 1} className="checkbox">
                                <CheckControl onFacetSelection={self.props.onFacetSelection.bind(null, self.props.facets.key, facet.value)} selected={facet.selected} value={facet.value} count={facet.count} />
                            </div>
                            )
                    })}
                </div>
				
			</div>
		)
	}
});

module.exports = CheckboxFacetControl;