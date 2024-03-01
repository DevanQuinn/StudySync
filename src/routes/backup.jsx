// Authorization token that must have been created previously. See : https://developer.spotify.com/documentation/web-api/concepts/authorization
const token = 'BQCP5G-RYCmG0yn5aU2rJrq5KnjhooRcQ1FEpWd6staI6f1Tv46_Fc6_WQmxFzrOdOrtlPnQTHeGfMIpGyS2-cgBdU0TXVn5QzG6w7Fwsox1CotuQ2IeuMPAbjMZS_zXm2u_GA1v7xH8-etZE21QmWbYPpES7Yjp-uPiG0Od4kDj-MzMR2_qEHZ0DfoXAqlKmmcfJRJyHq65a0SKj6mUKCf1vbha9hszcpno_8PpNCkxrApiQK2L_FmLJicHuP6E9N-IX7VfacWh0zPlq3yQ';
async function fetchWebApi(endpoint, method, body) {
  const res = await fetch(`https://api.spotify.com/${endpoint}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    method,
    body:JSON.stringify(body)
  });
  return await res.json();
}

async function getTopTracks(){
  // Endpoint reference : https://developer.spotify.com/documentation/web-api/reference/get-users-top-artists-and-tracks
  return (await fetchWebApi(
    'v1/me/top/tracks?time_range=long_term&limit=5', 'GET'
  )).items;
}

const topTracks = await getTopTracks();
console.log(
  topTracks?.map(
    ({name, artists}) =>
      `${name} by ${artists.map(artist => artist.name).join(', ')}`
  )
);