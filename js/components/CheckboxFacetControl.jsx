var React = require("react");
var CheckControl = require("./CheckControl.jsx");

var CheckboxFacetControl = React.createClass({
	render: function() {
		var self = this;
        if(!this.props.facets || this.props.facets.values.length < 1) {
            return <div></div>
        }
        
		return (
			<div className="checkboxFacet">
                <div className="facetLabel">
                    {this.props.displayName}
                </div>
				{this.props.facets.values.map(function(facet, index){
					return (
						<div key={index + 1} className="checkbox">
                            <CheckControl onFacetSelection={self.props.onFacetSelection.bind(null, self.props.facets.key, facet.value)} selected={facet.selected} value={facet.value} count={facet.count} />
						</div>
						)
				})}
			</div>
		)
	}
});

module.exports = CheckboxFacetControl;