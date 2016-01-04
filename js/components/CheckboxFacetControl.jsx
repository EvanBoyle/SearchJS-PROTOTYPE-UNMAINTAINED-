var React = require("react");

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
							<label>
								<input type="checkbox" onChange={self.props.onFacetSelection.bind(null, self.props.facets.key, facet.value)} checked={facet.selected}/> {facet.value}({facet.count})
							</label>
						</div>
						)
				})}
			</div>
		)
	}
});

module.exports = CheckboxFacetControl;