var React = require('react');
var ReactDOM = require('react-dom');
var config = require('../config');

var Map = React.createClass({
	componentDidMount: function() {

			var map = new Microsoft.Maps.Map(ReactDOM.findDOMNode(this), {credentials: config.bingAPIKey, width: 750, height: 750});
			this.setState({map: map});
			this.setMapView(map, this.props.results);

	},
	
	componentWillReceiveProps: function(nextProps) {
		this.setMapView(this.state.map, nextProps.results);
	},
	
	setMapView: function(map, results) {
		
		map.entities.clear();
		var locs = [];
		
		var infoBox = new Microsoft.Maps.Infobox(new Microsoft.Maps.Location(0, 0), { width: 150, height: 75, visible: false});
		map.entities.push(infoBox);
		
		results.forEach(function(result) {
			if(result.location) {
				var location = new Microsoft.Maps.Location(result.location.coordinates[1], result.location.coordinates[0]);
				var pushpin = new Microsoft.Maps.Pushpin(location, null);
				pushpin.Title = result.title;
				var createInfoBox = function(event){
					infoBox.setLocation(location);
					infoBox.setOptions({title: result.title, visible: true});
				};
				Microsoft.Maps.Events.addHandler(pushpin, 'click', createInfoBox)
				map.entities.push(pushpin);
				locs.push(location);
			}
		});		
		var geoLocationProvider = new Microsoft.Maps.GeoLocationProvider(map);  
		geoLocationProvider.getCurrentPosition({ showAccuracyCirle: true, updateMapView: false }); 
		var viewBox = Microsoft.Maps.LocationRect.fromLocations(locs);
		map.setView({bounds: viewBox});
	},
	
	render: function() {
		this.props.results;
		var style = {
			width: "750px",
			height: "750px",
			'margin-top': "3%",
			'margin-left': "auto",
			'margin-right': "auto"
			
		};

		return <div style={style} ref="map"></div>
	}
});

module.exports = Map;