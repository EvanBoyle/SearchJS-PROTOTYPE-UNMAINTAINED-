var React = require("react");
var CheckControl = require("./CheckControl.jsx");
var RangeSlider = require("react-slider");
var Numeral = require("numeral");
var SearchStore = require("../stores/SearchStore");
var SearchActions = require("../actions/SearchActions");
var DefaultCssClasses = require('../utils/DefaultCssClasses');
var Constants = require('../constants/SearchConstants');
var assign = require('object-assign');

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
        var cssClasses = assign(DefaultCssClasses[Constants.SEARCHFACETS], this.props.cssClasses);
        
		var self = this;
        if(this.state.resultsCount < 1) {
            return <div></div>
        }
        var upperBoundLabel = this.props.upperBound === this.state.facet.max ? "<" : "";
        var collapsedClass = this.state.collapsed ? cssClasses.searchFacets__facetHeaderIconCollapsed : cssClasses.searchFacets__facetHeaderIconOpen;
        var collapseID = "collapse" + this.props.facetId;
        var collapseHref = "#" + collapseID;
		return (
            <div className={cssClasses.searchFacets__rangeFacet}>
                <div className={cssClasses.searchFacets__facetHeaderContainer}>
                    <h4 className={cssClasses.searchFacets__facetHeader}>
                        <a data-toggle="collapse" href={collapseHref} className={cssClasses.searchFacets__facetHeaderLink} onClick={this.toggleCollapse}>
                                <span className={collapsedClass} aria-hidden="true"></span>  {this.props.displayName}
                        </a>
                    </h4>
                </div>
                <div id={collapseID} className={cssClasses.searchFacets__facetControlContainer}>
                    <ul className={cssClasses.searchFacets__facetControlList}>
                        <li className={cssClasses.searchFacets__facetControl}>
                            <RangeSlider value={[this.state.facet.lowerBound, this.state.facet.upperBound ]} onChange={this.onValuesChange} onAfterChange={this.onAfterChange} min={this.state.facet.min} max={this.state.facet.max} withBars pearling />
                        </li>
                        <li className={cssClasses.searchFacets__facetControlRangeLabel}>
                            <span className={cssClasses.searchFacets__facetControlRangeLabelMin}>
                                {Numeral(this.state.lowerBound).format("0.0a")}
                            </span>
                            <span className={cssClasses.searchFacets__facetControlRangeLabelRange}>  <b> {"<" + this.state.facet.middleBucketCount + "<"} </b> </span>
                            <span className={cssClasses.searchFacets__facetControlRangeLabelMax}>
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