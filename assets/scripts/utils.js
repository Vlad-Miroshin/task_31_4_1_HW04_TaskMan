export function create_UUID() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = Math.random() * 16 | 0,
            v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

export function getFromStorage(key) {
    return JSON.parse(localStorage.getItem(key) || "[]");
};
  
export function addToStorage(obj, key) {
    const storageData = getFromStorage(key);
    storageData.push(obj);
    localStorage.setItem(key, JSON.stringify(storageData));
};

  