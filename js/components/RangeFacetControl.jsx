var React = require("react");
var CheckControl = require("./CheckControl.jsx");
var RangeSlider = require("react-slider");
var Numeral = require("numeral");

var RangeFacetControl = React.createClass({
    getInitialState: function() {
        return {
            lowerBound: 0,
            upperBound: 0  
        };
    },
    
    componentWillReceiveProps: function(nextProps) {
        this.setState({
            lowerBound: nextProps.facet.lowerBound,
            upperBound: nextProps.facet.upperBound
        });    
    },
    
    onChange: function(values) {
        // set the display values as the slider moves
        this.setState({
            lowerBound: values[0],
            upperBound: values[1],
        });
    },
    
    onAfterChange: function() {
        // make a callback after sliding is done
        this.props.onRangeChange.bind(null, this.props.facet.key, this.state.lowerBound, this.state.upperBound)();
    },
    
	render: function() {
		var self = this;
        if(this.props.resultsCount < 1) {
            return <div></div>
        }
        var upperBoundLabel = this.state.upperBound === this.props.facet.max ? "<" : "";
        
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
				<RangeSlider defaultValue={[this.props.facet.lowerBound, this.props.facet.upperBound ]} onChange={this.onChange} onAfterChange={this.onAfterChange} min={this.props.facet.min} max={this.props.facet.max} withBars pearling />
                <div className="valueLabels">
                    <span className="minLabel">
                        {Numeral(this.state.lowerBound).format("0.0a")}
                    </span>
                    <span className="rangeCounts"> {this.props.facet.lowerBucketCount + " < "} <b> {this.props.facet.middleBucketCount} </b> {" < " + this.props.facet.upperBucketCount} </span>
                    <span className="maxLabel">
                        {Numeral(this.state.upperBound).format("0.0a") + upperBoundLabel}
                    </span>
                </div>
			</div>
		)
	}
});

module.exports = RangeFacetControl;