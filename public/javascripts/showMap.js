mapboxgl.accessToken = mapToken;
const map = new mapboxgl.Map({
    container: 'map', // container ID
    style: 'mapbox://styles/mapbox/light-v10', // style URL
    center: campground.geometry.coordinates, // starting position [lng, lat]
    zoom: 9 // starting zoom
});

// Add zoom and rotation controls to the map.
map.addControl(new mapboxgl.NavigationControl());

// create the popup
const popup = new mapboxgl.Popup({ offset: 25 }).setHTML(
    `<h4>${campground.title}</h4><p>${campground.location}</p>`
);

// create the marker
new mapboxgl.Marker()
    .setLngLat(campground.geometry.coordinates)
    .setPopup(popup) // sets a popup on this marker
    .addTo(map);