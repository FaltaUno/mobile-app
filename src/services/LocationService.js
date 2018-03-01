

import GoogleMapsService from 'services/GoogleMapsService'

class LocationService {
  
  locationFromAddress(place) { return GoogleMapsService.geocodeFromAddress(place) }

  linkFromLocation(locationDest, locationSrc = { lat: null, lng: null }) {
    return GoogleMapsService.link(
      { latitude: locationDest.lat, longitude: locationDest.lng },
      { latitude: locationSrc.lat, longitude: locationSrc.lng },
    )
  }

  /** This method will calculate the distance in KM between two players.
   * @param currPlayer is the player who is using the app.
   * @param otherPlayer can be any user.
   */
  calculatePlayerDistance(currPlayer, otherPlayer) {
    const R = 6371;

    const cuLat = currPlayer.position.coords.latitude;
    const cuLong = currPlayer.position.coords.longitude;
    const opLat = otherPlayer.position.coords.latitude;
    const opLong = otherPlayer.position.coords.longitude;

    let dLat = this.deg2rad(opLat - cuLat);
    let dLon = this.deg2rad(opLong - cuLong);
    let a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.deg2rad(cuLat)) * Math.cos(this.deg2rad(opLat)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);

    let c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    let d = R * c;
    return d;
  }

  deg2rad(deg) { return deg * (Math.PI / 180) }
}

export default new LocationService();
