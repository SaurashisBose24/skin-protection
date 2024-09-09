//  {} ! # $ % ^ & * () + | : " <> ? _ +
import { useEffect } from 'react';
import React from "react";
import suncalc from 'suncalc'
const ShadowMap = () => {
  
  useEffect(() => {
    const platform = new window.H.service.Platform({
      apikey: 'Hx3WrHaU-v4sFQ8AdKUmTj-dvNCw4owF62owZqrrXlQ',
    });
    const defaultLayers = platform.createDefaultLayers({lg:'eng',tileSize:512,ppi:320});
    const map = new window.H.Map(
      document.getElementById('mapContainer'),
      defaultLayers.vector.normal.map, 
      {
        zoom: 30,
        center: { lat: 25.1972, lng: 55.2744 }, 
        pixelRatio: window.devicePixelRatio || 1,
        engineType: H.map.render.RenderEngine.EngineType.PANORAMIC//3d mode
      }
    );
    const behavior=new window.H.mapevents.Behavior(
      new window.H.mapevents.MapEvents(map)
    );
    //const ui = window.H.ui.UI.createDefault(map, defaultLayers);
    const mapViewPort=map.getViewModel().getLookAtData();
    map.getViewModel().setLookAtData({
      tilt: 45, 
      heading: 0, 
      position: mapViewPort.position, 
      zoom: 16, 
    });
//  {} ! # $ % ^ & * () + | : " <> ? _ +
    const marker=new window.H.map.Marker({lat: 25.1972, lng: 55.274400});
    map.addObject(marker);
    const obj=calculateShadow(52.52,13.405,new Date());
    const coord=obj.coordinates;
    const lineString=new H.geo.LineString();
    lineString.pushPoint({lat: 25.1972,lng:55.273580});
    lineString.pushPoint({lat: 25.1972,lng:55.274895});
    lineString.pushPoint({lat: 25.2100,lng:55.274895});
    lineString.pushPoint({lat: 25.2100,lng:55.273580});
    const shadow=new H.map.Polygon(lineString,{
      style:{
        fillColor: 'rgba(0,0,0,0.2)',
        strokeColor: 'rgba(,0,0,0.2)',
        lineWidth: 3
      }
    })
    map.addObject(shadow);
    map.addEventListener('tap',function(evt){
      const coord=map.screenToGeo(evt.currentPointer.viewportX,evt.currentPointer.viewportY);
      const buildingInfoSer=platform.getBuildingInfoService();
      buildingInfoSer.requestBuildingInfo({
        lat: coord.lat,
        lng: coord.lng,
      }).then((buildingInfo)=> {
        if(buildingInfo && buildingInfo.building){
          console.log(buildingInfo.building.height);
        }
        else
          console.log('No buildings');
        })
    })
    
  }, []);

  return (
    <div
      id="mapContainer"
      style={{ width: '100%', height: '500px', background: 'grey' }}
    />
  );
};

export default ShadowMap;