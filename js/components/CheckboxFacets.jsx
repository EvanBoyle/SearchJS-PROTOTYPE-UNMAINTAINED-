var React = require("react");

var CheckboxFacets = React.createClass({
	render: function() {
		var self = this;
		return (
			<div>
				{this.props.facets.map(function(facet, index){
					return (
						<div key={index + 1} className="checkbox">
							<label>
								<input type="checkbox" onChange={self.props.onFacetSelection.bind(null, facet.value)} checked={facet.selected}/> {facet.value}({facet.count})
							</label>
						</div>
						)
				})}
			</div>
		)
	}
});

module.exports = CheckboxFacets;