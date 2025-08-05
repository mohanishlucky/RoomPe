
mapboxgl.accessToken = mapToken;
const map = new mapboxgl.Map({
    // ✅ This creates a new Mapbox map instance and stores it in the variable map.
    container: 'map', // container ID
    // Tells Mapbox which HTML element to render the map inside.
    center: listing.geometry.coordinates, // starting position [lng, lat]. Note that lat must be set between -90 and 90
    zoom: 12,
    // starting zoom
     style: 'mapbox://styles/mapbox/dark-v11'
});

// A Mapbox map appears in the #map div

// It is centered on the coordinates of the listing

// You see a zoomed-in view (level 12) of that area


// const marker1 = new mapboxgl.Marker({color:"red"})
//         .setLngLat(coordinates1)
//         .addTo(map);

// 1. Create the custom marker element
// Custom marker
const el = document.createElement('div');
el.className = 'custom-marker';
el.innerHTML = '<i class="fa-solid fa-house"></i>';

new mapboxgl.Marker(el)
    .setLngLat(listing.geometry.coordinates)
    .setPopup(new mapboxgl.Popup({ offset: 25 })
        .setHTML(`<h4>${listing.location}</h4>
        <p>Exact Location will be provided ater booking</p>`))
    .addTo(map);

//multiple markers can be used





//   ✅ This sets the Mapbox access token, which is required to use Mapbox's APIs and map tiles.

// mapToken was passed from the server using EJS:

// js
// Copy
// Edit
// const mapToken = "<%= mapToken %>";
// Without this, the map won’t load.

