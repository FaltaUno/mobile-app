import GoogleMapsService from 'services/GoogleMapsService'
import { Location, Permissions } from 'expo';

class LocationService {
  
  locationFromAddress(place) {
    return GoogleMapsService.geocodeFromAddress(place).then(res => res, () => null)
  }
  
  reverseGeocode(latitude, longitude) {
    return Location.reverseGeocodeAsync({latitude, longitude}).then(res => res, () => null)
  }

  linkFromLocation(locationDest, locationSrc = { lat: null, lng: null }) {
    return GoogleMapsService.link(
      { latitude: locationDest.lat, longitude: locationDest.lng },
      { latitude: locationSrc.lat, longitude: locationSrc.lng },
    )
  }

  makeLink(location){
    return GoogleMapsService.link(location);
  }

  ///////// Determining position mehods /////////

  /** This method is in charge to get the current position of the user 
   * 1 - it will check if the permission is granted
   * 2 - if it's not it will ask the user if they want to allow it
   * 3 - Get the position
  */
  async getLocationAsync() {
    let { locationServicesEnabled } = await Location.getProviderStatusAsync()
    if (!locationServicesEnabled) {
      return { locationServicesEnabled: false, locationPermission: false, position: {}, location: {} };
    }

    let { status } = await Permissions.askAsync(Permissions.LOCATION);
    if (status !== 'granted') {
      return { locationServicesEnabled: true, locationPermission: false, position: {}, location: {} };
    }

    // Important: enableHighAccuracy is needed to work fine in Android
    let position = await Location.getCurrentPositionAsync({ enableHighAccuracy: true });
    let locationCheck = await Location.reverseGeocodeAsync(position.coords);
    let location = locationCheck[0]

    return { locationServicesEnabled: true, locationPermission: true, position, location }
  }

  ///////// Calculate Distance methods /////////

    /**
   * Calculates the distance of two pair of latitude and longitude numbers, expressed in kilometers
   * @param { Number } fromLat from point latitude
   * @param { Number } fromLong to point longitude
   * @param { Number } toLat from point latitude 
   * @param { Number } toLong to point longitude
   */
  calculateDistance(fromLat, fromLong, toLat, toLong) {
    const R = 6371;

    const dLat = this.deg2rad(toLat - fromLat);
    const dLon = this.deg2rad(toLong - fromLong);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.deg2rad(fromLat)) * Math.cos(this.deg2rad(fromLat)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const d = R * c;
    return d;
  }

  deg2rad(deg) { return deg * (Math.PI / 180) }

  /** Returns the distance in KM between two players.
   * @param { User } currPlayer is the player who is using the app.
   * @param { User } otherPlayer can be any user.
   * @return { Number } kilometers between them
   */
  calculatePlayerDistance(currPlayer, otherPlayer) {
    const cuLat = currPlayer.position.coords.latitude;
    const cuLong = currPlayer.position.coords.longitude;
    const opLat = otherPlayer.position.coords.latitude;
    const opLong = otherPlayer.position.coords.longitude;
    return calculateDistance(cuLat, cuLong, opLat, opLong)
  }

  /**
   * Returns the distance between a player and a match location.
   * @param { User } user 
   * @param { Match } match
   * @return { Number } kilometers between them 
   */
  calculateMatchDistance(user, match) {
    const uLat = user.position.coords.latitude
    const uLong = user.position.coords.longitude
    const mLat = match.location.lat
    const mLong = match.location.lng
    return this.calculateDistance(uLat, uLong, mLat, mLong)
  }

  

}

export default new LocationService();
