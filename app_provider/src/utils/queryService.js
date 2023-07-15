import { useQuery } from "react-query";
import { getService } from "./APIService";

export const getMenu = (providerHandle) => useQuery(['menu', providerHandle], () =>
    getService(import.meta.env.VITE_APP_GET_PROVIDER_MENU, { providerHandle })
        .then((response) => response.data),
    {
        staleTime: 1000 * 60 * 5
    }
);

export const getProfile = (providerHandle) => useQuery(['provider', providerHandle],
    () =>
        getService(
            import.meta.env.VITE_APP_GET_PROVIDER_DETAILS,
            {
                providerHandle
            }
        )
            .then((response) => {
                return response.data[0]
            }),
    {
        staleTime: 1000 * 60 * 5
    }
);