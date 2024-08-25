//  {} ! # $ % ^ & * () + | : " <> ? _ +
import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';
const Map = () => {
    const [place, setPlace] = useState('');
    const [coordinates,setCoordinates] = useState(null);
    const [suggestions, setsuggestions] = useState([])
    const mapRef=useRef(null);
    const platformRef=useRef(null);
    const mapObjectRef=useRef(null);
  useEffect(() => {
    if (!mapRef.current) {
        platformRef.current = new window.H.service.Platform({
            apikey: 'process.env.here_key'
          });
    }
    const defaultLayers = platformRef.current.createDefaultLayers();
    mapRef.current= new window.H.Map(
      document.getElementById('mapContainer'),
      defaultLayers.vector.normal.map,
      {
        center: {lat: 22.5, lng: 82.5 } ,
        zoom: 10,
        pixelRatio: window.devicePixelRatio || 1
      }
    );
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCoordinates({lat: position.coords.latitude,lng: position.coords.longitude});
          mapRef.current.setCenter({lat: position.coords.latitude, lng: position.coords.longitude});
          console.log(`Current location: ${position.coords.latitude}, lng: ${position.coords.longitude}`);
          if(mapObjectRef.current)
            mapRef.current.removeObject(mapObjectRef.current);
          mapObjectRef.current=new window.H.map.Marker({lat: position.coords.latitude, lng: position.coords.longitude});
          mapRef.current.addObject(mapObjectRef.current); 
        })
    }
    window.addEventListener('resize', () => mapRef.current.getViewPort().resize());
    const behavior = new window.H.mapevents.Behavior(new window.H.mapevents.MapEvents(mapRef.current));
    //const ui = window.H.ui.UI.createDefault(map, defaultLayers);
    mapRef.current.addEventListener('tap', function (evt) {
        const coord = mapRef.current.screenToGeo(evt.currentPointer.viewportX, evt.currentPointer.viewportY);
        setCoordinates({ lat: coord.lat, lng: coord.lng });
        if(mapObjectRef.current)
            mapRef.current.removeObject(mapObjectRef.current);
        mapObjectRef.current=new window.H.map.Marker({lat: coord.lat, lng: coord.lng});
        mapRef.current.addObject(mapObjectRef.current);
        console.log(`Clicked at lat: ${coord.lat}, lng: ${coord.lng}`);
      });
  }, []);
  const searchPlace = () => {
    fetch(`https://geocode.search.hereapi.com/v1/geocode?q=${place}&apiKey=Hx3WrHaU-v4sFQ8AdKUmTj-dvNCw4owF62owZqrrXlQ`)
      .then(response => response.json())
      .then(data => {
        if (data.items.length > 0) {
          const location = data.items[0].position;
          setCoordinates({ lat: location.lat, lng: location.lng });
          mapRef.current.setCenter({lat: location.lat, lng: location.lng});
          if(mapObjectRef.current)
                mapRef.current.removeObject(mapObjectRef.current);
          const marker=new window.H.map.Marker({lat: location.lat, lng: location.lng});
          mapRef.current.addObject(marker);
          console.log(`Searched: ${location.lat}, lng: ${location.lng}`);
        } else {
          alert('No results found!');
        }
      })
      .catch(err => console.error('Error fetching geocoding data:', err));
  };
  const handleInputChange = async (e) => {
    const userInput = e.target.value;
    setPlace(e.target.value);
    console.log(place)
    if (userInput.length > 2) {
      try {
        const response = await axios.get(`https://autocomplete.search.hereapi.com/v1/autocomplete?q=${userInput}&apiKey=Hx3WrHaU-v4sFQ8AdKUmTj-dvNCw4owF62owZqrrXlQ`);
        
        
        console.log(response.data.items);
        setsuggestions(response.data.items);
        console.log(suggestions);
      } catch (error) {
        console.error('Error fetching autocomplete suggestions:', error);
      }
    } else {
      setsuggestions([]);
    }
  };
//  {} ! # $ % ^ & * () + | : " <> ? _ +
//<ul>{suggestions.map((suggestions,ind)=>{<li key={ind} onClick={searchPlace}>{suggestions[ind].address.label}</li>})}
//</ul>
  return (
    <>
    <div>
    <input type="text" value={place} placeholder='Enter place' className='b-gray-50 my' onChange={e=>{handleInputChange(e)}}/>
    <ul>
      {suggestions.map((ele,ind)=>(<li key={ind} onClick={searchPlace}>{ele.address.label}</li>))}
    </ul>
      
    <button className='m:10' onClick={searchPlace}>click me</button>
    </div>
    
    <div id="mapContainer" style={{ height: '500px', width: '100%' }} />
    </>
  )
};

export default Map;