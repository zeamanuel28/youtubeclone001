import axios from 'axios';

export const BASE_URL = 'https://youtube-v31.p.rapidapi.com';

const options = {
  method: 'GET',
  url: 'https://youtube-videos.p.rapidapi.com/mp4',
  params: {
    videoId: 'M0VWroX0gZA'
  },
  headers: {
    'X-RapidAPI-Key': 'c50f26a056mshbfc361b2fda8971p17325ejsn02b596f20bc5',
    'X-RapidAPI-Host': 'youtube-videos.p.rapidapi.com'
  }
};

// Rate limiting function
function limitRate(fn, delay) {
  let lastInvocation = 0;
  let timeoutId = null;

  return function (...args) {
    const now = Date.now();
    const timeElapsed = now - lastInvocation;

    clearTimeout(timeoutId);

    if (timeElapsed >= delay) {
      lastInvocation = now;
      fn.apply(this, args);
    } else {
      timeoutId = setTimeout(() => {
        lastInvocation = now;
        fn.apply(this, args);
      }, delay - timeElapsed);
    }
  };
}

// Create a rate-limited version of the fetchFromAPI function
const rateLimitedFetchFromAPI = limitRate(fetchFromAPI, 1000); // Adjust the delay according to your rate limit requirements

export async function fetchFromAPI(url) {
  const { data } = await axios.get(`${BASE_URL}/${url}`, options);

  return data;
}

try {
  const response = await rateLimitedFetchFromAPI('example-endpoint');
  console.log(response);
} catch (error) {
  console.error(error);
}