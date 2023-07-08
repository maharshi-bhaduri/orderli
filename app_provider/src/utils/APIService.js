import axios from "axios";
import Cookies from "js-cookie";

export async function getService(api, params, headers) {
    const mainHeaders = {
        "Content-Type": "application/json",
        Authorization: Cookies.get('token'),
        uid: Cookies.get('uid')
    }
    return axios.get(
        api,// import.meta.env.VITE_APP_GET_PROVIDERS,
        {
            headers: {
                ...mainHeaders,
                ...headers
            },
            params: params
        }
    )
        .then((response) => {
            // Handle the API response
            return response;
        })
        .catch((error) => {
            // Handle error
            throw new Error(error);
        });
}

export async function postService(api, data, headers) {
    const mainHeaders = {
        "Content-Type": "application/json",
        Authorization: Cookies.get('token'),
        uid: Cookies.get('uid')
    };

    return axios.post(api, JSON.stringify(data), {
        headers: {
            ...mainHeaders,
            ...headers
        }
    })
        .then((response) => {
            // Handle the API response
            return response.data;
        })
        .catch((error) => {
            // Handle error
            throw new Error(error);
        });
}