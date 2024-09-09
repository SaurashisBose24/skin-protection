//  {} ! # $ % ^ & * () + | : " <> ? _ +
import React, { useEffect } from 'react';

const HereMap3D = () => {
  useEffect(() => {
    // Initialize platform
    const platform = new window.H.service.Platform({
      apikey: 'Hx3WrHaU-v4sFQ8AdKUmTj-dvNCw4owF62owZqrrXlQ',
    });

    // Obtain the default map types from the platform object:
    const defaultLayers = platform.createDefaultLayers();

    // Create a map instance:
    const map = new window.H.Map(
      document.getElementById('mapContainer'),
      defaultLayers.vector.normal.map, // Use a vector map for 3D
      {
        zoom: 16,
        center: { lat: 52.52, lng: 13.405 }, // Berlin coordinates as an example
        pixelRatio: window.devicePixelRatio || 1,
      }
    );

    // Enable the map events (e.g., pan and zoom)
    const behavior = new window.H.mapevents.Behavior(
      new window.H.mapevents.MapEvents(map)
    );

    // Add the UI controls to the map (e.g., zoom controls)
    //const ui = window.H.ui.UI.createDefault(map, defaultLayers);

    // Enable 3D view by setting the tilt and heading
    const mapViewPort = map.getViewModel().getLookAtData();
    map.getViewModel().setLookAtData({
      tilt: 0, // Sets the map view tilt (3D perspective)
      heading: 50, // Rotate the map
      position: mapViewPort.position, // Keep the original position
      zoom: 16, // Set a higher zoom level for 3D
    });
    const marker=new window.H.map.Marker({lat: 52.52, lng: 13.405});
    map.addObject(marker);

    // Cleanup the map when component is unmounted
    return () => {
      map.dispose();
    };
  }, []);

  return (
    <div
      id="mapContainer"
      style={{ width: '100%', height: '500px', background: 'grey' }}
    />
  );
};

export default HereMap3D;