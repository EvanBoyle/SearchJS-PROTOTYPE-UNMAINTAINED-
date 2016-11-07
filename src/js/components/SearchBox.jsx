var React = require('react');
var OptionTemplateGenerator = require('./OptionTemplateGenerator.jsx');
var SearchStore = require('../stores/SearchStore');
var SearchActions = require('../actions/SearchActions');
var Augosuggest = require('react-autosuggest');
var DefaultCssClasses = require('../utils/DefaultCssClasses');
var Constants = require('../constants/SearchConstants');
var assign = require('object-assign');

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
        if (evt.key === "Enter" ) {
            return this.search();
        }
    },
    onSuggestionsFetchRequested: function(value) {
        var input = value.value;
        this.setInput(input)
        SearchActions.suggest(input, this.props.suggester, this.props.searchFields, this.props.preTag, this.props.postTag);
    },
    onSuggestionsClearRequested: function() {
        this.setState({
            suggestions: []
        });   
    },
    onSuggestionSelected: function(event, parameters) {
        this.search();
    },
    getSuggestionValue: function(suggestion) {
        return suggestion.searchText.replace(this.props.preTag,"").replace(this.props.postTag, "");
    },
    renderSuggestion: function(suggestion) {
        var html = this.props.suggestionTemplate.render(suggestion);
        return <div dangerouslySetInnerHTML={{__html: html}} ></div>
    },
    onInputChange: function(event, newValue) {
        if(newValue.method === "up" || newValue.method === "down"){
            return;
        }
        input = newValue.newValue;
        // remove highlight tags for the stored input
        this.setInput(input);
        if(newValue.method === "click" || newValue.method === "enter") {
            this.search();
        }
    },
    setInput: function(input) {
        SearchActions.setInput(input.replace(this.props.preTag,"").replace(this.props.postTag, ""));
    },
    search: function() {
        SearchActions.clearFacetSelections();
        SearchActions.termSearch();
    },
    renderInputComponent: function(inputProps) {
        var cssClasses = assign(DefaultCssClasses[Constants.SEARCHBOX], this.props.cssClasses);
        
        return (
                <div className={cssClasses.searchBox__inputContainer}>
                    <input {...inputProps} type="text"></input>
                    <span className={cssClasses.searchBox__buttonContainer}>
                        <button className={cssClasses.searchBox__button} type="button" onClick={this.search}><span className={cssClasses.searchBox__buttonIcon}></span>&nbsp;</button>
                    </span>
                </div>

        );  
    },
	render: function(){
        var inputProps = {
            placeholder: 'Search...',
            value: this.state.input,
            onChange: this.onInputChange,
            type: 'search',
            onKeyPress: this.handleKeyDown
        };
        
        var cssClasses = assign(DefaultCssClasses[Constants.SEARCHBOX], this.props.cssClasses);
        
        var theme = {
            container:            cssClasses.searchBox__container,
            containerOpen:        cssClasses.searchBox__containerOpen,
            input:                cssClasses.searchBox__input,
            suggestionsContainer: cssClasses.searchBox__suggestionsContainer,
            suggestionsList:      cssClasses.searchBox__suggestionsList,
            suggestion:           cssClasses.searchBox__suggestion,
            suggestionFocused:    cssClasses.searchBox__suggestionFocused,
            sectionContainer:     cssClasses.searchBox__sectionContainer,
            sectionTitle:         cssClasses.searchBox__sectionTitle            
        };
		return (
                <Augosuggest
                    suggestions={this.state.suggestions}
                    onSuggestionsFetchRequested={this.onSuggestionsFetchRequested}
                    onSuggestionsClearRequested={this.onSuggestionsClearRequested}
                    onSuggestionSelected={this.onSuggestionSelected}
                    getSuggestionValue={this.getSuggestionValue}
                    renderSuggestion={this.renderSuggestion}
                    inputProps={inputProps}
                    theme={theme}
                    renderInputComponent={this.renderInputComponent}
                />
			)
	}
});

module.exports = SearchBox;