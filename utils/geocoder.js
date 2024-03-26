const NodeGeocoder = require("node-geocoder");

const options = {
    provider: "mapquest",
    httpAdapter: 'https',
    apiKey: "pi4Udjp0mat1FXVLwMf4JGXa9ZjIR8rN",
    formatter: null
}
console.log({ options })

const geocoder = NodeGeocoder(options)

module.exports = geocoder;