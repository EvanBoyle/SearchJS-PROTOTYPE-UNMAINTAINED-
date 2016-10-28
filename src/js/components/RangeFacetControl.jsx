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
        var collapsedClass = this.state.collapsed ? "indicator glyphicon glyphicon glyphicon-triangle-right" : "indicator glyphicon glyphicon glyphicon-triangle-bottom";
        var collapseID = "collapse" + this.props.facetId;
        var collapseHref = "#" + collapseID;
		return (
            <div className="rangeFacet panel-body">
                <div className="facetLabel panel-heading">
                    <h4 className="panel-title">
                        <a data-toggle="collapse" href={collapseHref} className="colapseHeader" onClick={this.toggleCollapse}>
                                <span className={collapsedClass} aria-hidden="true"></span>  {this.props.displayName}
                        </a>
                    </h4>
                </div>
                <div id={collapseID} className="panel-collapse collapse in" >
                    <ul className="list-group">
                        <li className="list-group-item">
                            <RangeSlider value={[this.state.facet.lowerBound, this.state.facet.upperBound ]} onChange={this.onValuesChange} onAfterChange={this.onAfterChange} min={this.state.facet.min} max={this.state.facet.max} withBars pearling />
                        </li>
                        <li className="list-group-item center-block text-center">
                            <span className="minLabel">
                                {Numeral(this.state.lowerBound).format("0.0a")}
                            </span>
                            <span className="rangeCounts">  <b> {"<" + this.state.facet.middleBucketCount + "<"} </b> </span>
                            <span className="maxLabel">
                                {Numeral(this.state.upperBound).format("0.0a") + upperBoundLabel}
                            </span>
                        </li>
                    </ul>
                </div>
            </div>
		)
	}
});

module.exports = RangeFacetControl;