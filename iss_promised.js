const { printPassTimes } = require('./index')

const request = require('request-promise-native');
const fetchMyIP = function() {
  return request('https://api.ipify.org/?format=json');
};
const fetchCoordsByIP = function(body) {
  const data = JSON.parse(body)
  const ip = data.ip
  return request(`https://freegeoip.app/json/${ip}`)
};
const fetchISSFlyOverTimes = function(body) {
  const data = JSON.parse(body)
  let coords = {};
  coords.latitude =  data.latitude;
  coords.longitude = data.longitude;
  return request(`http://api.open-notify.org/iss-pass.json?lat=${coords.latitude}&lon=${coords.longitude}`)
};
const nextISSTimesForMyLocation = function() {
  return fetchMyIP()
    .then(fetchCoordsByIP)
    .then(fetchISSFlyOverTimes)
    .then((data) => {
      const { response } = JSON.parse(data);
      return response;
    });
};

module.exports = { nextISSTimesForMyLocation };