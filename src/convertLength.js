// Taken from @turfjs helpers/convertLength

const earthRadius = 6371008.8
const factors = {
    centimeters: earthRadius * 100,
    centimetres: earthRadius * 100,
    degrees: earthRadius / 111325,
    feet: earthRadius * 3.28084,
    inches: earthRadius * 39.370,
    kilometers: earthRadius / 1000,
    kilometres: earthRadius / 1000,
    meters: earthRadius,
    metres: earthRadius,
    miles: earthRadius / 1609.344,
    millimeters: earthRadius * 1000,
    millimetres: earthRadius * 1000,
    nauticalmiles: earthRadius / 1852,
    radians: 1,
    yards: earthRadius / 1.0936
}

export default function convertLength(length, originalUnit, finalUnit) {
    return radiansToLength(lengthToRadians(length, originalUnit), finalUnit);
}

function radiansToLength(radians, units) {
    return radians * factors[units]
}

function lengthToRadians(distance, units) {
    return distance / factors[units]
}
