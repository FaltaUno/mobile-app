import Config from 'config'
import Lang from 'lang'

const geocoderUrl = Config.geocoder.url;

const isValidLatLong = (num, range) => {
    let isNumber = typeof num === 'number'
    let maxRange = num <= range
    let minRange = num >= -1 * range
    return isNumber && maxRange && minRange
}

const isValidCoordinates = coords =>
  isValidLatLong(coords.latitude, 90) && isValidLatLong(coords.longitude, 180)

const getParameterString = (params) => {
    console.log("received params", params)
    return params
        .map(({ key, value }) => {
            const encodedKey = encodeURIComponent(key)
            const encodedValue = encodeURIComponent(value)

            return `${encodedKey}=${encodedValue}`
        })
        .join('&')
}

/**
 * From
 * https://developers.google.com/maps/documentation/javascript/geocoding
 * https://github.com/googlemaps/google-maps-services-js/tree/master/spec/e2e
 * https://github.com/googlemaps/google-maps-services-js
 */
// this service translates from places to coordinates and viceversa
export default class GoogleMapsService {
    
    /**
     * Address looks like
     * La+mano+de+dios+adrogue+futbol+buenos+aires+argentina
     * @param {*} inputAddress 
     */
    geocodeFromAddress(inputAddress){
        return this.geocode({
            address: inputAddress + "futbol" // to improve search
        });
    }

    /**
     * components looks like
     * components: {
            route: 'Macquarie St',
            locality: 'Sydney',
            postal_code: '2000',
            country: 'Australia'
          }
     * @param {*} inputComponents 
     */
    geocodeFromComponents(inputComponents){
        return this.geocode({
            components: inputComponents
        });
    }

    /**
     * 
     * @param {*Object to be geocoded} search 
     */
    geocode(search){
        console.log("geocoding ", search);
        let payload = JSON.stringify(search)
        console.log("PAYLOADDD", payload)
        return fetch(`${geocoderUrl}`, {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: payload,
        }).then((response) => {
            console.log("response geocode ", response)
            return response.json();
        });
    }

    /**
     * @param 
     * {
     *  "latitude": 1234,
     *  "longitude": 1234
     * } destination must be an object that contains latitude and longitude
     * @param {*} source must be an object that contains latitude and longitude
     */
    link( destination, source){
        let params = []
        console.log("destination is ", destination)
        console.log("source is ", source)
        if (destination && isValidCoordinates(destination)) {
            params.push({
                key: 'daddr',
                value: `${destination.latitude},${destination.longitude}`
            })
        }

        if (source && isValidCoordinates(source)) {
            params.push({
              key: 'saddr',
              value: `${source.latitude},${source.longitude}`
            })
        }

        return `http://maps.google.com/maps?${getParameterString(params)}`;
    }
}