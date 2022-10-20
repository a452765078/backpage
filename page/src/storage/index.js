import config from '../config/index'

function getAllStorage() {
    let storageData = localStorage.getItem(config.storageName) ? localStorage.getItem(config.storageName) : '{}'
    storageData = storageData == 'undefined' ? {} : JSON.parse(storageData)
    return storageData
}

function setAllStorage(data) {
    localStorage.setItem(config.storageName, JSON.stringify(data))
}

function setItem(name, val) {
    let storageData = getAllStorage()
    storageData.set(name, val)
    setAllStorage(storageData)
}
function getItem(name) {
    let storageData = getAllStorage()
    let result = storageData[name] === 'undefined' ? '' : storageData[name]
    return storageData[name]
}

export default {
    setItem,
    getItem,
    setAllStorage,
    getAllStorage
}