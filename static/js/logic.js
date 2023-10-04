// Replace 'YOUR_JSON_URL_HERE' with the URL of the earthquake JSON data
let earthquakeDataUrl = 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson';

// Create the map centered around the  CA United States
let map = L.map('map').setView([36.778259, 119.417931], 3);

// Add the base layer (OpenStreetMap) to the map
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);

// Set the size and color of earthquake markers based on magnitude and depth
function getMarkerStyle(magnitude, depth) {
    return {
        radius: magnitude * 3, // Adjust the scale factor as needed
        fillColor: getColor(depth),
        color: 'green',
        weight: 1,
        opacity: 1,
        fillOpacity: 0.7,
    };
}

// Set the color based on earthquake depth
function getColor(depth) {
    // Customize the color scale based on your preference
    return depth > 300 ? 'red' :
        depth > 200 ? 'orangered' :
            depth > 100 ? 'orange' :
                depth > 50 ? 'yellow' :
                    depth > 10 ? 'green' :
                        'lightgreen';
}

// Create a popup with earthquake information
function createPopup(feature, layer) {
    layer.bindPopup(`
    Magnitude: ${feature.properties.mag}<br>
    Depth: ${feature.geometry.coordinates[2]} km<br>
    Location: ${feature.properties.place}
  `);
}

// Fetch the earthquake data and add it to the map
fetch(earthquakeDataUrl)
    .then(response => response.json())
    .then(data => {
        L.geoJSON(data, {
            pointToLayer: (feature, latlng) => {
                return L.circleMarker(latlng, getMarkerStyle(feature.properties.mag, feature.geometry.coordinates[2]));
            },
            onEachFeature: createPopup,
        }).addTo(map);
    });

// Create a legend for the earthquake depth
let legend = L.control({ position: 'bottomright' });
legend.onAdd = function (map) {
    let div = L.DomUtil.create('div', 'info legend');
    let depths = [0, 10, 50, 100, 200, 300];
    for (let i = 0; i < depths.length; i++) {
        div.innerHTML +=
            '<i style="background:' + getColor(depths[i] + 1) + '"></i> ' +
            depths[i] + (depths[i + 1] ? '&ndash;' + depths[i + 1] + ' km<br>' : '+ km');
    }
    return div;
};
legend.addTo(map);