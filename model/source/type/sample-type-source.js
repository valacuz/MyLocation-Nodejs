const uuidv4 = require('uuid/v4')
const TypeSource = function () { }

var types = []

TypeSource.prototype.getTypes = () => {
    return new Promise((resolve, reject) => {
        resolve(types)
    })
}

TypeSource.prototype.getTypeById = (id) => {
    return new Promise((resolve, reject) => {
        const type = types.find(item => item.type_id === id)
        resolve(type)
    })
}

TypeSource.prototype.addType = (type) => {
    return new Promise((resolve, reject) => {
        type.type_id = uuidv4() // Insert or replace type_id with random UUID
        types.push(type)
        resolve(type)
    })
}

TypeSource.prototype.updateType = (type) => {
    return new Promise((resolve, reject) => {
        var index = types.findIndex((item) => item.type_id == type.type_id)
        if (index >= 0) {
            types[index] = type
            resolve()
        } else {
            reject(Error('Place type with given id was not found.'))
        }
    })
}

TypeSource.prototype.deleteType = (id) => {
    return new Promise((resolve, reject) => {
        // We cannot delete item from array directly,
        // so we use filter items which is `type_id` is not matched to given id
        // (the matched will not included to new array)
        var index = types.findIndex(item => item.type_id == id)
        if (index >= 0) {
            types = types.filter(item => item.type_id !== id)
            resolve()
        } else {
            // Cannot delete item because we cannot find item with is `type_id` is matched to given id
            reject(Error('Place type with given id was not found.'))
        }
    })
}

TypeSource.prototype.clearAll = () => {
    return new Promise((resolve, reject) => {
        types = []
        resolve()
    })
}

module.exports = TypeSource