import localforage from 'localforage';

let initialized = false;

export const initializeLocalForage = () => {
    if (!initialized) {
        localforage.config({
            name: 'orderli',
            storeName: 'orderliStore'
        });
        initialized = true;
    }
};
