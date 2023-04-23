import React, { useState, useRef, useEffect, useMemo, useCallback } from 'react';

import '../mapquest/mapquest.js';

import { getAllJobs, getAllRigs } from '../axios-services/index.js';

const MapView = ({token}) => {

  const [jobList, setJobList] = useState([]);
  const [rigList, setRigList] = useState([]);

  // pull the jobList
  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const jobs = await getAllJobs(token);
        setJobList(jobs);
      } catch (error) {
        console.error(error);
      }
    }
    fetchJobs();
  },[]);

  // pull the rigList so we can get the colors and ID for display on jobs
  useEffect(() => {
    const fetchRigs = async () => {
      try {
        const allRigs = await getAllRigs(token);
        setRigList(allRigs);
      } catch (error) {
        console.error(error);
      }
    }
    fetchRigs();
  }, []);

  // messy hack to force the page to re-load and get the map actually working
  // this is required because the mapquest API depends on window.onload being called
  // I haven't figured out a way around the window.onload, but I'm sure there is one
  useEffect(() => {
    const reloadCount = sessionStorage.getItem('reloadCount');
    if(reloadCount < 2) {
      sessionStorage.setItem('reloadCount', String(reloadCount + 1));
      window.location.reload();
    } else {
      sessionStorage.removeItem('reloadCount');
    }
  },[])

  const mapInitialize = () => {
    // everything related to the map needs to be inside this onload function
    window.onload = function() {
      // my mapquest api key
      L.mapquest.key = 'AoG5ccarCeCc9nGAZ4H4f8Bs61rR2DLt';

      // initializes the map itself
      const map = L.mapquest.map('map', {
        center: [32.77822, -96.79512],
        layers: L.mapquest.tileLayer('map'),
        zoom: 10
      });

      // adds the basic map controls
      map.addControl(L.mapquest.control());


      // this callback is required for the geocode to return the result to be manipulated, otherwise it just loads them on the map
      // this happens before all of the .then statements, may be good to dig down a few layers of the objects and arrays here
      const geocodingCallback = (error, result) => {
        console.log('exact lat/lng Result in callback', result.results[0].locations[0].latLng);
        return result;
      }
      
      // api call to the geocoding, can send an array of comma-separated addresses to find the lat/lng
      // then can use the lat/lng to create markers for the map
      const geocoder = L.mapquest.geocoding();
      geocoder.geocode(['2430 Merrell Rd #103, Dallas, TX 75229'], geocodingCallback).then((response) => {
        if (response.info.statuscode != 0) {
          throw Error(`geocode failed, statuscode: ${response.info.statuscode}`);
        }
        console.log('full geocode response', response);
        return response;
      }).then((response) => {

        // extract the desired part of the geocode result - latLng - for placing the marker
        const latlong = response.results[0].locations[0].latLng;
        console.log('latlong in first .then', latlong);
        return latlong;

      }).then((latlong) => {
        console.log('latlong in second .then', latlong);

        // custom icon?
        var markerSize = {'sm': [28, 35], 'md': [35, 44], 'lg': [42, 53]};
        var markerAnchor = {'sm': [14, 35], 'md': [17, 44], 'lg': [21, 53]};
        var markerPopupAnchor = {'sm': [1, -35], 'md': [1, -44], 'lg': [2, -53]};

        var smallMarker = L.icon({
          iconUrl: 'https://www.clipartmax.com/png/small/224-2245749_simple-house-icon-home-icon-vector-png.png',
          iconSize: markerSize.lg,
          iconAnchor: markerAnchor.lg,
          popupAnchor: markerPopupAnchor.lg
        });

        // adding a map marker and a pop-up attached to it at [37.7749, -122.4194]
        // can style the individual map marker, will make one style for each rig and apply dynamically
        const marker = L.marker(latlong, {
          icon: L.mapquest.icons.flag({
            primaryColor: '#22407F',
            secondaryColor: '#3B5998',
            shadow: true,
            size: 'md',
            symbol: 'BASE'
          })
        }).addTo(map);
        marker.bindPopup("<b>StrataBore Office</b><br>I am a popup. This is the main office location");

        const customMarker = L.marker([32.900868, -97.044091], {
          icon: smallMarker
        }).addTo(map);
          customMarker.bindPopup("<b>Custom Marker</b><br>I am a popup. This is a custom made marker");


        }).catch((error) => {
          console.error(error);
        });     
      
    }
  }
  mapInitialize();




  console.log('joblist', jobList);

  return (
    <div>
      <div id="map" className='strata-mapper-box' ></div>
    </div>
  )

}

export default MapView;