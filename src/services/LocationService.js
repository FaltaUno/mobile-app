

import GoogleMapsService from 'services/GoogleMapsService'

class LocationService {
  locationFromAddress(place) {
    return GoogleMapsService.geocodeFromAddress(place).then(res => res, () => null)
  }
  linkFromLocation(locationDest, locationSrc = { lat: null, lng: null }) {
    return GoogleMapsService.link(
      { latitude: locationDest.lat, longitude: locationDest.lng },
      { latitude: locationSrc.lat, longitude: locationSrc.lng },
    )
  }
}

export default new LocationService();
