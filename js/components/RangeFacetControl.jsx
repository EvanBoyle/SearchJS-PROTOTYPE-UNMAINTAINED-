var React = require("react");
var CheckControl = require("./CheckControl.jsx");
var RangeSlider = require("react-slider");
var Numeral = require("numeral");

var RangeFacetControl = React.createClass({
    onChange: function() {
        // set the display values as the slider moves
    },
    onAfterChange: function() {
        // make a callback after sliding is done
    },
	render: function() {
		var self = this;
        if(!this.props.facet) {
            return <div></div>
        }
        
		return (
			<div className="rangeFacet">
                <div className="facetLabel">
                    {this.props.displayName}
                </div>
                <div className="minMaxLabels">
                    <span className="minLabel">
                        {Numeral(this.props.facet.min).format("0.0a")}
                    </span>
                    <span className="maxLabel">
                        {Numeral(this.props.facet.max).format("0.0a") + "+"}
                    </span>
                </div>
				<RangeSlider defaultValue={[this.props.facet.lowerBound, this.props.facet.upperBound ]} withBars pearling />
			</div>
		)
	}
});

module.exports = RangeFacetControl;