import React from 'react';

const Map = props => {
    return (
        <section aria-labelledby="map-aria-description"
                 role="application"
                 aria-hidden="true">
            <div id="map" />
            <label id="map-aria-description">Google Maps</label>
        </section>
    );
};

export default Map;
