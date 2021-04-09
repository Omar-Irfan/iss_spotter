const request = require('request');
const fetchMyIP = function(callBack) {
  request('https://api.ipify.org/?format=json', (error, response, body) => {
    if (error) {
      return callBack(error, null);
    }
    if (response.statusCode !== 200) {
      const msg = `Status Code ${response.statusCode} when fetching IP. Response: ${body}`;
      callBack(Error(msg), null);
      return;
    }
    const data = JSON.parse(body);
    const ip = data.ip;
    callBack(null, ip);
  });
};

const fetchCoordsByIP = function(ip, callBack) {
  request('https://freegeoip.app/json/', (error, response, body) => {
    if (error) {
      return callBack(error, null);
    }
    if (response.statusCode !== 200) {
      const msg = `Status Code ${response.statusCode} when fetching coordinates for IP. Response: ${body}`;
      callBack(Error(msg), null);
      return;
    }
    const data = JSON.parse(body);
    let coord = {};
    coord.latitude =  data.latitude;
    coord.longitude = data.longitude;
    callBack(null, coord);
  });

};

const fetchISSFlyOverTimes = function(coords, callBack) {
  let url = `http://api.open-notify.org/iss-pass.json?lat=${coords.latitude}&lon=${coords.longitude}`;
  request(url, (error, response, body) => {
    if (error) {
      return callBack(error, null);
    }
    if (response.statusCode !== 200) {
      const msg = `Status Code ${response.statusCode} when fetching fly over time for coordinates. Response: ${body}`;
      callBack(Error(msg), null);
      return;
    }
    const flyOverTimes = JSON.parse(body).response;
    callBack(null, flyOverTimes);
  });
};
 
const nextISSTimesForMyLocation = function(callBack) {
  fetchMyIP((error, ip) => {
    if (error) {
      return callBack(error, null);
    }
    fetchCoordsByIP(ip, (error, coords) => {
      if (error) {
        return callBack(error, null);
      }
      fetchISSFlyOverTimes(coords,(error, flyOverTimes) => {
        if (error) {
          return callBack(error, null);
        }
        callBack(null, flyOverTimes);
      });

  
    });

  });
};
module.exports = { nextISSTimesForMyLocation };