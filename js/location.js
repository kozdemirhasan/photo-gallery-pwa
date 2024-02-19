import { Loader } from "@googlemaps/js-api-loader"

// const apiOptions = {
//   apiKey: "AIzaSyCnoYsIteIM_QbyXAZ1gScqb1FHUGSMZXk",
//   version: "weekly"
// }
// const loader = new Loader(apiOptions);

// loader
//   .then(() => {
//     console.log('Maps JS API Loaded');
//     const map = displayMap();
//   })
//   .catch(error => {
//     console.error('Error loading Google Maps API:', error);
//   });




// function displayMap() {
//   const mapOptions = {
//     center: { lat: -33.860664, lng: 151.208138 },
//     zoom: 14
//   };
//   const mapDiv = document.getElementById('map');
//   const map = new google.maps.Map(mapDiv, mapOptions);
//   return map;
// }





let map;
// initMap is now async
async function initMap() {
    // Request libraries when needed, not in the script tag.
    const { Map } = await google.maps.importLibrary("maps");
    // Short namespaces can be used.
    map = new Map(document.getElementById("map"), {
        center: { lat: -34.397, lng: 150.644 },
        zoom: 8,
    });
}

initMap();


const loader = new Loader({
    apiKey: "AIzaSyCnoYsIteIM_QbyXAZ1gScqb1FHUGSMZXk",
    version: "weekly"
  });
  
  loader.load().then(async () => {
    const { Map } = await google.maps.importLibrary("maps");
  
    map = new Map(document.getElementById("map"), {
      center: { lat: -34.397, lng: 150.644 },
      zoom: 8,
    });
  });
