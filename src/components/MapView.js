import React, { useState, useRef, useEffect, useMemo, useCallback } from 'react';

import JobForm from './JobForm.js';
import MapFilters from './MapFilters';

import '../mapquest/mapquest.js';
//import a custom icon image
import homeIcon from '../mapquest/transparent-home.png';
import { statusFilter, clientFilter, rigFilter, dateFilter } from './mapFilterHelpers.js';

import { getAllJobs, getAllRigs, getAssignedAndUnassignedJobs } from '../axios-services/index.js';

const MapView = ({token}) => {

  const [filterState, setFilterState] = useState({
    jobStatus: 'pending',
    client: 'all',
    startDate: '',
    endDate: '',
    rigsToShow: [],
  });
  const [jobList, setJobList] = useState([]);
  const [rigList, setRigList] = useState([]);
  const [locationList, setLocationList] = useState([]);
  const [mapObject, setMapObject] = useState({});
  const [formType, setFormType] = useState('');
  const [currentSelected, setCurrentSelected] = useState({});

  // pull the jobList and use it to set the location list
  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const allJobs = await getAssignedAndUnassignedJobs(token);

        // use the filterState and helper functions to array.filter this joblist
        const filteredJobs = allJobs.filter((job) => {
          return statusFilter(job, filterState) && clientFilter(job, filterState) && rigFilter(job, filterState, rigList) && dateFilter(job, filterState);
        })
        setJobList(filteredJobs);
        const filteredLocations = filteredJobs.map((job)=>{
          return job.location;
        });
        setLocationList(filteredLocations);
      } catch (error) {
        console.error(error);
      }
    }
    fetchJobs();
  },[filterState]);


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

  // >>>>>>>>>>>NEW JUN 10<<<<<<<<<<<<
  // it looks like recent changes to force the map to wait on certain state has fixed the need for this, so I'm commenting it out for now
  // messy hack to force the page to re-load and get the map actually working with no errors on page
  // this is required because the mapquest API depends on window.onload being called
  // to get around this, I was able to put all the onload functionality inside another useEffect that has dependencies, but that gives me errors when navigating from the Admin tab only for some reason so I'm opting to keep it in for now
  // useEffect(() => {
  //   const reloadCount = sessionStorage.getItem('reloadCount');
  //   if(reloadCount < 1) {
  //     sessionStorage.setItem('reloadCount', String(reloadCount + 1));
  //     window.location.reload();
  //   } else {
  //     sessionStorage.removeItem('reloadCount');
  //   }
  // },[])

  // loads the map and creates the markers
  useEffect(()=> {
    // api key
    L.mapquest.key = 'SboTAEZ9t8caAhRqQ3GSGWNmmcCz1Ag8';
      
    // a quick check if a map already exists, and removing it first before creating the new one
    // needed this because the useEffect re-render was causing conflicts with the map already existing
    let map;
    if(Object.keys(mapObject).length != 0) {
      mapObject.remove();
    }
    // initializes the map object itself
    map = L.mapquest.map('map', {
      center: [32.77822, -96.79512],
      layers: L.mapquest.tileLayer('map'),
      zoom: 10
    });
    setMapObject(map);
    
    // adds the basic map controls
    map.addControl(L.mapquest.control());

    if (locationList.length > 0 && rigList.length > 0) {

      // this callback is required for the geocode to return the result to be manipulated, otherwise it just loads them on the map
      const geocodingCallback = (error, response) => {
        return response.results;
      }

      // api call for geocoding, send an array of comma-separated addresses to find the lat/lng
      L.mapquest.geocoding().geocode([...locationList], geocodingCallback)
        // add map markers based on the geocode results
        .then((results) => {
          // can only add markers if there is a map to add them to
          if (Object.keys(mapObject).length != 0) {

            // adding a map marker and a pop-up attached to it at for each location in the results
            // can change type and style the individual map marker, will make one style for each rig and apply dynamically
            results.forEach((item, index)=> {
              const itemJob = jobList[index];
              const itemRig = rigList[itemJob.rigId - 1];
              let itemColor = '';
              if(!itemRig) {
                itemColor = colourNameToHex('gray');
              } else {
                itemColor = colourNameToHex(itemRig.boardColor);
              }
              const latlong = item.locations[0].latLng;
              const marker = L.marker(latlong, {
                icon: L.mapquest.icons.marker({
                  primaryColor: itemColor,
                  secondaryColor: '#FFFFFF',
                  shadow: true,
                  size: 'sm',
                  symbol: itemJob.rigId
                })
              }).addTo(map);
              // marker.on('click', (e) => {
              //   console.log('marker up was clicked', e);
              // })

              // creating fancier HTMLelement for inside the pop-up
              // can add event listeners here for an edit button
              // put the jobNumber as the id on the edit button, for finding the correct job to set in state when the button is clicked
              const popUpContent = document.createElement("div");
              popUpContent.className = 'popper';

              const popUpHeader = document.createElement("div");
              popUpHeader.className = 'popper-header';
              popUpHeader.innerText = itemJob.jobNumber;
              popUpContent.appendChild(popUpHeader);

              const popUpButton = document.createElement("button");
              popUpButton.id = itemJob.jobNumber;
              popUpButton.innerText = 'Edit';
              popUpButton.addEventListener('click', markerEditButton);
              popUpHeader.appendChild(popUpButton);

              const popUpInfo1 = document.createElement("div");
              popUpInfo1.className = 'popper-info';
              popUpInfo1.innerText = `Holes: ${itemJob.numHoles}`
              const popUpInfo2 = document.createElement("div");
              popUpInfo2.className = 'popper-info';
              popUpInfo2.innerText = `Ft: ${itemJob.numFeet}`
              const popUpInfo3 = document.createElement("div");
              popUpInfo3.className = 'popper-info';
              popUpInfo3.innerText = `Date: ${itemJob.jobDate}`
              popUpContent.appendChild(popUpInfo1);
              popUpContent.appendChild(popUpInfo2);
              popUpContent.appendChild(popUpInfo3);

              const popUp = L.popup({className: 'popUp-window'}).setContent(popUpContent);
              marker.bindPopup(popUp)              
            })

            // ['2430 Merrell Rd #103, Dallas, TX 75229']
            // [32.88762, -96.89600]
            // custom icon example for office location
            // homeIcon is stored in /mapquest, and imported at the top of the page
            const smallMarker = L.icon({
              iconUrl: homeIcon,
              iconSize: [36, 36],
              iconAnchor: [18, 36],
              popupAnchor: [1, -36]
            });
            const customMarker = L.marker([32.88762, -96.89600], {
              icon: smallMarker
            }).addTo(map);
            customMarker.bindPopup("<b>StrataBore Office</b>");
          } 
        })
        .catch((error) => {
          console.error(error);
        });      
    }
  },[rigList, locationList])
  // the rigList and locationList are dependencies because we need that info for creating the markers

  // gross helper function for converting color names to hex codes for the map markers
  // may adapt this list to create a colorpicker for the rigform
  const colourNameToHex = (colour) => {
    let colours = {"aliceblue":"#f0f8ff","antiquewhite":"#faebd7","aqua":"#00ffff","aquamarine":"#7fffd4","azure":"#f0ffff","beige":"#f5f5dc","bisque":"#ffe4c4","black":"#000000","blanchedalmond":"#ffebcd","blue":"#0000ff","blueviolet":"#8a2be2","brown":"#a52a2a","burlywood":"#deb887","cadetblue":"#5f9ea0","chartreuse":"#7fff00","chocolate":"#d2691e","coral":"#ff7f50","cornflowerblue":"#6495ed","cornsilk":"#fff8dc","crimson":"#dc143c","cyan":"#00ffff","darkblue":"#00008b","darkcyan":"#008b8b","darkgoldenrod":"#b8860b","darkgray":"#a9a9a9","darkgreen":"#006400","darkkhaki":"#bdb76b","darkmagenta":"#8b008b","darkolivegreen":"#556b2f","darkorange":"#ff8c00","darkorchid":"#9932cc","darkred":"#8b0000","darksalmon":"#e9967a","darkseagreen":"#8fbc8f","darkslateblue":"#483d8b","darkslategray":"#2f4f4f","darkturquoise":"#00ced1","darkviolet":"#9400d3","deeppink":"#ff1493","deepskyblue":"#00bfff","dimgray":"#696969","dodgerblue":"#1e90ff","firebrick":"#b22222","floralwhite":"#fffaf0","forestgreen":"#228b22","fuchsia":"#ff00ff","gainsboro":"#dcdcdc","ghostwhite":"#f8f8ff","gold":"#ffd700","goldenrod":"#daa520","gray":"#808080","green":"#008000","greenyellow":"#adff2f","honeydew":"#f0fff0","hotpink":"#ff69b4","indianred ":"#cd5c5c","indigo":"#4b0082","ivory":"#fffff0","khaki":"#f0e68c","lavender":"#e6e6fa","lavenderblush":"#fff0f5","lawngreen":"#7cfc00","lemonchiffon":"#fffacd","lightblue":"#add8e6","lightcoral":"#f08080","lightcyan":"#e0ffff","lightgoldenrodyellow":"#fafad2","lightgrey":"#d3d3d3","lightgreen":"#90ee90","lightpink":"#ffb6c1","lightsalmon":"#ffa07a","lightseagreen":"#20b2aa",
    "lightskyblue":"#87cefa","lightslategray":"#778899","lightsteelblue":"#b0c4de","lightyellow":"#ffffe0","lime":"#00ff00","limegreen":"#32cd32","linen":"#faf0e6","magenta":"#ff00ff","maroon":"#800000","mediumaquamarine":"#66cdaa","mediumblue":"#0000cd","mediumorchid":"#ba55d3","mediumpurple":"#9370d8","mediumseagreen":"#3cb371","mediumslateblue":"#7b68ee","mediumspringgreen":"#00fa9a","mediumturquoise":"#48d1cc","mediumvioletred":"#c71585","midnightblue":"#191970","mintcream":"#f5fffa","mistyrose":"#ffe4e1","moccasin":"#ffe4b5","navajowhite":"#ffdead","navy":"#000080","oldlace":"#fdf5e6","olive":"#808000","olivedrab":"#6b8e23","orange":"#ffa500","orangered":"#ff4500","orchid":"#da70d6","palegoldenrod":"#eee8aa","palegreen":"#98fb98","paleturquoise":"#afeeee","palevioletred":"#d87093","papayawhip":"#ffefd5","peachpuff":"#ffdab9","peru":"#cd853f","pink":"#ffc0cb","plum":"#dda0dd","powderblue":"#b0e0e6","purple":"#800080","rebeccapurple":"#663399","red":"#ff0000","rosybrown":"#bc8f8f","royalblue":"#4169e1","saddlebrown":"#8b4513","salmon":"#fa8072","sandybrown":"#f4a460","seagreen":"#2e8b57","seashell":"#fff5ee","sienna":"#a0522d","silver":"#c0c0c0","skyblue":"#87ceeb","slateblue":"#6a5acd","slategray":"#708090","snow":"#fffafa","springgreen":"#00ff7f","steelblue":"#4682b4","tan":"#d2b48c","teal":"#008080","thistle":"#d8bfd8","tomato":"#ff6347","turquoise":"#40e0d0","violet":"#ee82ee","wheat":"#f5deb3","white":"#ffffff","whitesmoke":"#f5f5f5","yellow":"#ffff00","yellowgreen":"#9acd32"};

    if (typeof colours[colour.toLowerCase()] != 'undefined')
        return colours[colour.toLowerCase()];

    return false;
  }

  // button handlers here

  const filterViewer = (e) => {
    if (formType != 'filter') {
      setFormType('filter');
      setCurrentSelected({});
    } else {
      setFormType('')
    }
  }

  const cancelEdit = (e) => {
    setFormType('');
    setCurrentSelected({});
  }

  const markerEditButton = (e) => {
    console.log('pop-up button clicked, editing', e.target.id)
    const currentJob = jobList.find((job) => job.jobNumber === e.target.id);
    console.log('current job', currentJob);
    setFormType('edit-job');
    setCurrentSelected(currentJob);
  }

// console checks for filter work
  // console.log('filter state', filterState);
  // console.log('form type', formType);
  // console.log('jobList', jobList);
  // console.log('location list', locationList);

   return (
    <div className='mapview-page'>
      <div className='mapview-button-list'>
        { formType=='edit-job' ? <button id='cancel-edit' onClick={cancelEdit}>Cancel Edit</button> : null }
        <button id='show-tool' onClick={filterViewer}>Filters</button>
      </div>
      <div className='strata-mapper-container'>
        <div id="map" className='strata-mapper'></div>
        { !formType ? null : (
            <div className='strata-mapper-tool'>
              {
                formType==='edit-job' ? (
                  <JobForm
                    token={token}
                    formType={formType}
                    setFormType={setFormType}
                    jobList={jobList}
                    setJobList={setJobList}
                    currentSelected={currentSelected}
                    setCurrentSelected={setCurrentSelected}
                    locationList={locationList}
                    setLocationList={setLocationList}
                    filterState={filterState}
                    rigList={rigList}
                  />
                ) : null
              }
              {
                formType==='filter' ? ( 
                  <MapFilters
                    filterState={filterState}
                    setFilterState={setFilterState}
                    jobList={jobList}
                    setJobList={setJobList}
                    rigList={rigList}
                    setFormType={setFormType}
                  />
                ) : null
              }
            </div>
        )}
      </div>
    </div>
  )

}

export default MapView;