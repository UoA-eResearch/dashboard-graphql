// TO DO: replace with dynamodb implementation, set TTL etc

let cache = {};

export async function getFromCache(key) {
  console.log('getting from cache...');
  return cache[key];
}

export async function saveToCache(key, data) {
  if (cache[key] !== undefined) {
    const current = cache[key];
    cache[key] = Object.assign(current, data); // merge any existing data
  } else {
    cache[key] = data;
  }
  console.log('saved item to cache...');
};
