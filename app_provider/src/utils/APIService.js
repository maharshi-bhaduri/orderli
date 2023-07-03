import axios from "axios";
import Cookies from "js-cookie";

export async function getService(api, headers, params) {
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