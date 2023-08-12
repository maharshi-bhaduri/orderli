import axios from "axios";
export async function getService(api, params, headers) {
  const mainHeaders = {
    "Content-Type": "application/json",
  };
  return axios
    .get(
      api, // import.meta.env.VITE_APP_GET_PROVIDERS,
      {
        headers: {
          ...mainHeaders,
          ...headers,
        },
        params: params,
      }
    )
    .then((response) => {
      // Handle the API response
      return response; // adjust here once api is configured`  `
    })
    .catch((error) => {
      // Handle error
      return error.response.status;
    });
}

export async function postService(api, data, headers) {
  const mainHeaders = {
    "Content-Type": "application/json",
  };

  return axios
    .post(api, JSON.stringify(data), {
      headers: {
        ...mainHeaders,
        ...headers,
      },
    })
    .then((response) => {
      // Handle the API response
      return response.data;
    })
    .catch((error) => {
      // Handle error
      return error;
    });
}
