// converter
function getShortCoordinateObject(longCoordinateObject) {
    return { lat: longCoordinateObject.latitude, lng: longCoordinateObject.longitude };
}

export default {
    getShortCoordinateObject
}
