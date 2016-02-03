var React = require('react');
var OptionTemplateGenerator = require('./OptionTemplateGenerator.jsx');
var SearchStore = require('../stores/SearchStore');
var SearchActions = require('../actions/SearchActions');
var Typeahead = require('react-typeahead-component');
var Handlebars = require('handlebars');


var SearchBox = React.createClass({
	getInitialState: function() {
        return {
            input: "",
            suggestions: [],  
        };
    },
    componentDidMount: function() {
        SearchStore.addChangeListener(this.onChange);
        this.onChange();
    },
    onChange: function() {
        var data = SearchStore.getDataForSuggestions();
        this.setState({
            input: data.input,
            suggestions: data.suggestions
        });
    },
    handleKeyDown: function(evt) {
        if (evt.keyCode == 13 ) {
            return this.search();
        }
        else {
            var input = evt.target.value
            this.setInput(input)
            SearchActions.suggest(input, this.props.suggester, this.props.searchFields, this.props.preTag, this.props.postTag);
        }
    },
    handleOptionChange: function(evt, option) {
        var input = option.searchText ? option.searchText : option;
        this.setInput(input);
    },
    handleOptionClick: function(evt, option) {
        this.setInput(option.searchText);
        this.search();
    },
    setInput: function(input) {
        // remove highlight tags for the stored input
        SearchActions.setInput(input.replace(this.props.preTag,"").replace(this.props.postTag, ""));
    },
    search: function() {
        SearchActions.clearFacetSelections();
        SearchActions.termSearch();
    },
	render: function(){
		var optionTemplate = OptionTemplateGenerator(Handlebars.compile(this.props.suggestionTemplate));
		return (
			<span>
                <Typeahead
                    inputValue={this.state.input}
                    options={this.state.suggestions}
                    onChange={this.handleKeyDown}
                    optionTemplate={optionTemplate}
                    onDropdownClose={this.search}
                    onOptionChange={this.handleOptionChange}
                    onOptionClick={this.handleOptionClick}
                    placeholder="Start your search here..."
                />
                <button className="searchButton" type="button" onClick={this.search}><img src={"../../img/searchButton.png"}/></button>
            </span>
			)
	}
});

module.exports = SearchBox;