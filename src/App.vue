<template>
  <div id="app">
    <!--======  map component  ==========-->
    <l-map
        :zoom="7"
        :center="center"
        style="height: 100vh"
        @click="mapClick"
    >
      <l-tile-layer
          :url="mapLink"
          atribution="some text here"
      >
      </l-tile-layer>
      <!--      checking v-if coordinate is unevenly undefined-->
      <l-marker
          v-if="coord != undefined"
          ref="marker"
          :lat-lng="getCoord()"
      >
        <!--  binding data to an attribute using the v-bind,
         the transmitted data from the object (coord) with its elements      -->
        <l-icon :icon-url="coord.icon" :icon-size="coord.iconSize"></l-icon>
        <l-popup :content="coord.content"></l-popup>
      </l-marker>
    </l-map>
  </div>
</template>

<script>

// import function which provides a latitude and longitude object
import {latLng} from 'leaflet';

// imported map components
import {LMap, LTileLayer, LMarker, LPopup, LIcon} from 'vue2-leaflet';

export default {
  name: 'App',
  components: {
    // connected map components
    LMap,
    LTileLayer,
    LMarker,
    LPopup,
    // LTooltip,
    LIcon
  },
  // function data return object with variables
  data() {
    return {
      // variables, link to API
      weatherLink: 'https://api.open-meteo.com/v1/forecast?',
      // variables, link to leaflet map API
      mapLink: 'http://{s}.tile.osm.org/{z}/{x}/{y}.png',
      // array of pictures
      images: [],
      // array of day variables
      daily: [
        'temperature_2m_max\n',
        'temperature_2m_min',
        'apparent_temperature_max\n',
        'apparent_temperature_min',
        'precipitation_sum',
        'precipitation_hours',
        'weathercode',
        'sunrise\n',
        'sunset',
        'windspeed_10m_max\n',
        'windgusts_10m_max',
        'winddirection_10m_dominant',
        'shortwave_radiation_sum'

      ],
      // array of clock variables
      hourly: [
        'temperature_2m',
        'relativehumidity_2m',
        'dewpoint_2m',
        'apparent_temperature',
        'pressure_msl',
        'cloudcover',
        'cloudcover_low',
        'cloudcover_mid',
        'cloudcover_high',
        'windspeed_10m\n',
        'windspeed_80m\n',
        'windspeed_120m\n',
        'windspeed_180m',
        'winddirection_10m\n',
        'winddirection_80m\n',
        'winddirection_120m\n',
        'winddirection_180m',
        'windgusts_10m',
        'shortwave_radiation',
        'direct_radiation\n',
        'direct_normal_irradiance',
        'diffuse_radiation',
        'vapor_pressure_deficit',
        'evapotranspiration',
        'precipitation',
        'weathercode',
        'snow_depth',
        'freezinglevel_height',
        'soil_temperature_0cm\n',
        'soil_temperature_6cm\n',
        'soil_temperature_18cm\n',
        'soil_temperature_54cm',
        'soil_moisture_0_1cm\n',
        'soil_moisture_1_3cm\n',
        'soil_moisture_3_9cm\n',
        'soil_moisture_9_27cm\n',
        'soil_moisture_27_81cm'
      ],
      // response API object
      response: undefined,
      // object coordinate
      coord: undefined,
      // Initial coordinates. Align the map to the center after clicking ====== variables
      center: latLng(56.8796, 24.6032),
      // network settings object
      settings: {
        // hour settings with empty array variables
        hourly: [],
        // day settings with empty array variables
        daily: [],
        // to show the current weather on the map variables
        current: true,
        // temperature display in Celsius variables
        temperature: 'celsius',
        // wind speed km per hour variables
        wind: 'kmh',
        // pressure in millimeters variables
        precipitation: 'mm',
        // temporary format variables
        timeformat: 'iso8601',
        // time zone variables
        timezone: 'UTC',
        // last day variables
        past: 0

      }
    }
  },
  // lifecycle hook
  mounted() {

  },
  methods: {
    // coordinate comes with (item.latlng)
    requestToApi(coord) {
      // bring the coordinate to the object and forward
      this.coord = {

        // some elements
        id: 1,
        lat: coord.lat,
        long: coord.lng,
        icon: require('leaflet/dist/images/marker-icon-2x.png'),
        iconSize: [25, 41],
        content: ''
      }
      //get data over json network
      fetch(this.constructWeatherLink())
          .then(response => response.json())
          .then((json) => {
            //equate our json to the response
            this.response = json
            // create a variable in which we write the content
            let content = ''
            // if not equal to undefined then passes the test
            if (json.current_weather != undefined) {
             // and writes the received data to a variable
              content += `
                <h2><b>Current Status</b></h2>
               <b>Time:</b> ${json.current_weather.time.replace('T', '')} ${this.settings.timezone}
               <br><b>Temperature:</b> ${json.current_weather.temperature} ${this.settings.temperature}
               <br><b>Wind Direction:</b> ${json.current_weather.winddirection}
               <br><b>Wind Speed:</b> ${json.current_weather.windspeed} ${this.settings.wind}`
            }
            // we assign content in order to overwrite the contents of the popup
            this.coord.content = content
          })
    },
    // function map click, an object (item) is passed to the click, it has a latitude and longitude in itself
    mapClick(item) {
      // a request comes from api object (item)
      this.requestToApi(item.latlng)

      // set the coordinate point to the center with the current coordinates getCoord()
      this.center = this.getCoord()
      // after the click I make a delay, I turn to the popup and call it
      setTimeout(() => {
        this.$refs.marker.mapObject.openPopup()
      }, 100)
    },
    //a function that returns an object imported from leaflet (latLng)
    // with the current latitude and longitude  this.coord
    getCoord() {
      return latLng(this.coord.lat, this.coord.long)
    },
    // create an API call function
    constructWeatherLink() {
      // create variables
      let url = 'https://api.open-meteo.com/v1/forecast?'
      // we take the link and equate the current coordinates to it
      url = url + `latitude=${this.coord.lat}&longitude=${this.coord.long}`
      // specify links default settings
      if (this.settings.temperature != undefined) {
        url += `&temperature_unit=${this.settings.temperature}`
      }
      if (this.settings.wind != undefined) {
        url += `&windspeed_unit=${this.settings.wind}`
      }
      if (this.settings.precipitation != undefined) {
        url += `&precipitation_unit=${this.settings.precipitation}`
      }
      if (this.settings.timeformat != undefined) {
        url += `&timeformat=${this.settings.timeformat}`
      }
      if (this.settings.timezone != undefined) {
        url += `&timezone=${this.settings.timezone}`
      }
      if (this.settings.past != undefined) {
        url += `&past_days=${this.settings.past}`
      }
      if (this.settings.current != undefined) {
        url += `&current_weather=${this.settings.current}`
      }
      // equate the WeatherLink variable to the url of this "constructWeatherLink()" function and get the input in JSON
      this.weatherLink = url
      // and return this value
      return this.weatherLink
    }
  },
}
</script>

<style>

* {
  margin: 0;
  padding: 0;
}

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;

  color: #2c3e50;

  width: 100vw;
  min-width: 100vh;
}

.vue2leaflet-map {

}

</style>
