import React, { useState } from 'react'
import { GoogleMap, Marker, Autocomplete, useJsApiLoader } from '@react-google-maps/api'

const center = {
    lat: -25.828814,
    lng: 25.608582,
}

//eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBjcGR3YnV4aWVjaWpseXN3ZmR0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc4NDY2MTYsImV4cCI6MjA3MzQyMjYxNn0.mcdFV8_T1plfW7h45Jsarf1oI87J9qgwbNu1SSSomx8

// Keep libraries as a stable reference to avoid reloading LoadScript
const GOOGLE_MAP_LIBRARIES = ['places']

function MapComponent() {

    const [map, setMap] = useState(null);

    const [autocomplete, setAutocomplete] = useState(null);
    const [markerPosition, setMarkerPosition] = useState(null);
    const [mapCenter, setMapCenter] = useState(center);

    const { isLoaded } = useJsApiLoader({
        id: 'google-map-script',
        googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
        libraries: GOOGLE_MAP_LIBRARIES
    })

    const onLoad = React.useCallback(function callback(map) {
        setMap(map);
    }, []);
    
    const onUnmount = React.useCallback(function callback(map) {
        setMap(null);
    }, []);


    const onPlaceChanged = () => {
        if (!autocomplete) return;
        const place = autocomplete.getPlace();
        if (!place || !place.geometry || !place.geometry.location) return;
    
        const location = place.geometry.location;
        const position = { lat: location.lat(), lng: location.lng() };
    
        setMarkerPosition(position);
        setMapCenter(position);  // update center state
    };

    return isLoaded ? (
        <GoogleMap
        mapContainerStyle={{width: '100%', height: '100%'}}
        center={mapCenter}
        zoom={17}
        onLoad={onLoad}
        onUnmount={onUnmount}
        options={{
            zoomControl: false,
            streetViewControl: false,
            mapTypeControl: false,
            fullscreenControl: false,
            gestureHandling: 'greedy',
        }}
        >
        <div style={{position:'absolute', top: 12, left: 12, zIndex: 1}}>
            <Autocomplete
                onLoad={setAutocomplete}
                onPlaceChanged={onPlaceChanged}
            >
                <input
                    type="text"
                    placeholder="Search places..."
                    style={{
                        boxSizing: 'border-box',
                        border: '1px solid transparent',
                        width: '320px',
                        height: '40px',
                        padding: '0 12px',
                        borderRadius: '4px',
                        boxShadow: '0 2px 6px rgba(0,0,0,0.3)',
                        fontSize: '16px',
                        outline: 'none'
                    }}
                />
            </Autocomplete>
        </div>
        {markerPosition && (
            <Marker position={markerPosition} />
        )}
        </GoogleMap>
    ) : (<></>)
}

export default MapComponent;
