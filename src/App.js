import React, { useRef, useEffect } from 'react';
import WebMap from '@arcgis/core/WebMap.js';
import MapView from "@arcgis/core/views/MapView.js";
//import FeatureLayer from "@arcgis/core/layers/FeatureLayer.js";
import FeatureTable from '@arcgis/core/widgets/FeatureTable';
import * as reactiveUtils from "@arcgis/core/core/reactiveUtils.js";
import TableContainer from "./components/table-container/table-container-component";
import ShowHideTable from "./components/show-hide-table/show-hide-table-component";

import './index.css';


const App = () => {
  const viewDiv = useRef(null);
 
  useEffect(() => {
    let selectedFeature, id;
    const webmap = new WebMap({
      portalItem: {
        id: '209aa768f537468cb5f76f35baa7e013',
      },
    });

     
    const view  = new MapView({
      map: webmap,
      container: viewDiv.current,
      zoom: 3,
      center: [-98, 38.5],
      popup: {
        dockEnabled: true,
        dockOptions: {
          buttonEnabled: false,
          breakpoint: false,
        },
      },
    });

    view.when(() => {
      const featureLayer = webmap.findLayerById("OverlaySchools_2862");
      featureLayer.title = "US Private school enrollment";
      featureLayer.outFields = ["*"];

      // Get references to div elements for toggling table visibility
      const appContainer = document.getElementById("appContainer");
      const tableContainer = document.getElementById("tableContainer");
      const tableDiv = document.getElementById("tableDiv");

      // Create FeatureTable
      const featureTable = new FeatureTable({
        view: view, // make sure to pass in view in order for selection to work
        layer: featureLayer,
        tableTemplate: {
          // autocasts to TableTemplate
          columnTemplates: [
            // takes an array of GroupColumnTemplate and FieldColumnTemplate
            {
              // autocasts to FieldColumnTemplate
              type: "field",
              fieldName: "state_name",
              label: "State",
              direction: "asc"
            },
            {
              type: "field",
              fieldName: "PercentagePrivate",
              label: "Private school percentage"
            },
            {
              type: "field",
              fieldName: "PercentagePublic",
              label: "Public school percentage"
            }
          ]
        },
        container: tableDiv
      });

      // Add toggle visibility slider
      view.ui.add(document.getElementById("mainDiv"), "top-right");

      // Get reference to div elements
      const checkboxEle = document.getElementById("checkboxId");
      const labelText = document.getElementById("labelText");

      // Listen for when toggle is changed, call toggleFeatureTable function
      checkboxEle.onchange = () => {
        toggleFeatureTable();
      };

      function toggleFeatureTable() {
        // Check if the table is displayed, if so, toggle off. If not, display.
        if (!checkboxEle.checked) {
          appContainer.removeChild(tableContainer);
          labelText.innerHTML = "Show Feature Table";
        } else {
          appContainer.appendChild(tableContainer);
          labelText.innerHTML = "Hide Feature Table";
        }
      }

      // Watch for the popup's visible property. Once it is true, clear the current table selection and select the corresponding table row from the popup
      reactiveUtils.watch(
        () => view.popup.viewModel.active,
        () => {
          selectedFeature = view.popup.selectedFeature;
          if (selectedFeature !== null && view.popup.visible !== false) {
            featureTable.highlightIds.removeAll();
            featureTable.highlightIds.add(
              view.popup.selectedFeature.attributes.OBJECTID
            );
            id = selectedFeature.getObjectId();
          }
        }
      );
    });
   },[]
 
  );


  return (
    <div>
    <div id="appContainer">
    <div id="viewDiv" ref={viewDiv} style={{ width:'100vw', height:"50vh"}}></div> 
      <TableContainer/>
      <ShowHideTable/> 
    </div>
    </div>
  );




}
export default App;
