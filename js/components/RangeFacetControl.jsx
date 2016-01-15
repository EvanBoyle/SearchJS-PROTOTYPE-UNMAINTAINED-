var React = require("react");
var CheckControl = require("./CheckControl.jsx");
var RangeSlider = require("react-slider");
var Numeral = require("numeral");
var SearchStore = require("../stores/SearchStore");
var SearchActions = require("../actions/SearchActions");

var RangeFacetControl = React.createClass({
    getInitialState: function() {
        return {
            lowerBound: 0,
            upperBound: 0,
            collapsed: false,
            facet: null,
            resultsCount: 0,
        };
    },
    
    componentDidMount: function() {
        SearchStore.addChangeListener(this.onChange);
        this.onChange();
    },
    
    onChange: function() {
        var facet = SearchStore.getFacet(this.props.field);
        var count = SearchStore.getResultsCount();
        this.setState({
            facet: facet,
            resultsCount: count,
            lowerBound: facet.lowerBound,
            upperBound: facet.upperBound
        });
    },
    
    toggleCollapse: function() {
        this.setState({collapsed: !this.state.collapsed});
    },
    
    onValuesChange: function(values) {
        // set the display values as the slider moves
        this.setState({
            lowerBound: values[0],
            upperBound: values[1],
        });
    },
    
    onAfterChange: function() {
        SearchActions.setFacetRange(this.state.facet.key, this.state.lowerBound, this.state.upperBound);
        SearchActions.termSearch();
    },
    
	render: function() {
		var self = this;
        if(this.state.resultsCount < 1) {
            return <div></div>
        }
        var upperBoundLabel = this.props.upperBound === this.state.facet.max ? "<" : "";
        var chevron = this.state.collapsed ? "<" : ">";
        var collapsedClass = this.state.collapsed ? "collapsed" : "collapsedContainer";
        
		return (
			<div className="rangeFacet">
                <div className="facetLabel" onClick={this.toggleCollapse}>
                    {this.props.displayName} {chevron}
                </div>
                <div className={collapsedClass}>
                    <div className="minMaxLabels">
                        <span className="minLabel">
                            {Numeral(this.state.facet.min).format("0.0a")}
                        </span>
                        <span className="maxLabel">
                            {Numeral(this.state.facet.max).format("0.0a") + "+"}
                        </span>
                    </div>
                    <RangeSlider defaultValue={[this.state.facet.lowerBound, this.state.facet.upperBound ]} onChange={this.onValuesChange} onAfterChange={this.onAfterChange} min={this.state.facet.min} max={this.state.facet.max} withBars pearling />
                    <div className="valueLabels">
                        <span className="minLabel">
                            {Numeral(this.state.lowerBound).format("0.0a")}
                        </span>
                        <span className="rangeCounts"> {this.state.facet.lowerBucketCount + " < "} <b> {this.state.facet.middleBucketCount} </b> {" < " + this.state.facet.upperBucketCount} </span>
                        <span className="maxLabel">
                            {Numeral(this.state.upperBound).format("0.0a") + upperBoundLabel}
                        </span>
                    </div>
                </div>
			</div>
		)
	}
});

module.exports = RangeFacetControl;