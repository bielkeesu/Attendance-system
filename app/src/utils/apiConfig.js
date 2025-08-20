// const API_BASE_URL =
let API_BASE_URL;

export async function getApiUrl() {
  if (!API_BASE_URL) {
    const res = await fetch('/config.json');
    const config = await res.json();
    API_BASE_URL = config.API_BASE_URL;
  }
  return API_BASE_URL;
}
