export const hasDifference = (obj1, obj2) => {
    const keys = new Set([...Object.keys(obj1), ...Object.keys(obj2)]);
    const diff = {};

    keys.forEach(key => {
        const val1 = obj1[key];
        const val2 = obj2[key];

        if (JSON.stringify(val1) !== JSON.stringify(val2)) {
            diff[key] = [val1, val2];
        }
    });

    return Object.keys(diff).length > 0;
};