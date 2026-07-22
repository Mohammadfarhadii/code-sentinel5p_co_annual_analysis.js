/***************************************************************
 * Sentinel-5P CO Annual Mapping using Google Earth Engine
 *
 * Author: Mohammad Farhadi
 *
 * Dataset:
 * Sentinel-5P TROPOMI OFFL Level-3 CO
 *
 * Description:
 * This script calculates annual and multi-year mean
 * Carbon Monoxide (CO) concentrations using Sentinel-5P
 * observations from 2019 to 2025.
 *
 * Outputs:
 * - Annual CO concentration maps
 * - Long-term mean CO concentration map
 * - GeoTIFF exports
 ***************************************************************/


//==============================================================
// Study area visualization
//==============================================================

Map.centerObject(table, 5);


//==============================================================
// Analysis period
//==============================================================

var startYear = 2019;
var endYear = 2025;


//==============================================================
// Visualization parameters
//==============================================================

var co_viz = {
  min: 0.02,
  max: 0.2,
  palette: [
    'blue',
    'cyan',
    'green',
    'yellow',
    'orange',
    'red'
  ]
};


//==============================================================
// 1. Annual CO concentration (2019-2025)
//==============================================================

for (var year = startYear; year <= endYear; year++) {


  // Define annual period

  var startDate = ee.Date.fromYMD(year, 1, 1);

  var endDate = ee.Date.fromYMD(year, 12, 31);



  // Load Sentinel-5P CO dataset

  var collection = ee.ImageCollection(
      'COPERNICUS/S5P/OFFL/L3_CO'
    )
    .select('CO_column_number_density')
    .filterBounds(table)
    .filterDate(startDate, endDate);



  // Calculate annual mean

  var meanCO = collection
      .mean()
      .clip(table);



  // Display result

  Map.addLayer(
    meanCO,
    co_viz,
    'Mean CO ' + year
  );



  // Print result

  print(
    'Mean CO ' + year,
    meanCO
  );



  // Export annual CO map

  Export.image.toDrive({

    image: meanCO,

    description:
      'S5P_CO_Mean_' + year,

    folder:
      'S5P_CO_Annual',

    fileNamePrefix:
      'S5P_CO_' + year,

    region:
      table.geometry().bounds(),

    scale: 1000,

    crs:
      'EPSG:4326',

    maxPixels:
      1e13

  });

}



//==============================================================
// 2. Multi-year average CO concentration (2019-2025)
//==============================================================


var startAll =
    ee.Date.fromYMD(2019, 1, 1);


var endAll =
    ee.Date.fromYMD(2025, 12, 31);



var collectionAll =
    ee.ImageCollection(
      'COPERNICUS/S5P/OFFL/L3_CO'
    )
    .select('CO_column_number_density')
    .filterBounds(table)
    .filterDate(startAll, endAll);



// Long-term mean

var meanCO_All =
    collectionAll
    .mean()
    .clip(table);



// Display

Map.addLayer(
  meanCO_All,
  co_viz,
  'Mean CO 2019-2025'
);



// Print

print(
  'Mean CO 2019-2025',
  meanCO_All
);



// Export long-term mean

Export.image.toDrive({

  image:
    meanCO_All,

  description:
    'S5P_CO_Mean_2019_2025',

  folder:
    'S5P_CO_Annual',

  fileNamePrefix:
    'S5P_CO_2019_2025',

  region:
    table.geometry().bounds(),

  scale:
    1000,

  crs:
    'EPSG:4326',

  maxPixels:
    1e13

});


//==============================================================
// End of Script
//==============================================================
