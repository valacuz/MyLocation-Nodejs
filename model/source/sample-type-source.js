var types = [
    { type_id: 1, type_name: "Education" },
    { type_id: 2, type_name: "Department store" },
    { type_id: 3, type_name: "Restaurant" },
    { type_id: 4, type_name: "Relaxation" }
]

const TypeSource = function () { }

TypeSource.prototype.getTypes = () => {
    return new Promise((resolve, reject) => {
        resolve(types)
    })
}

TypeSource.prototype.getTypeById = (id) => {
    return new Promise((resolve, reject) => {
        try {
            const type = types.find(item => item.type_id === id)
            resolve(type)
        } catch (err) {
            reject(err)
        }
    })
}

TypeSource.prototype.addType = (name) => {
    return new Promise((resolve, reject) => {
        // Generate latest id for new row
        var defaultId = types.length > 0 ? types[0].type_id + 1 : 1
        var latestId = types.reduce((max, item) => item.type_id > max ? item.type_id : max, defaultId)
        // Create object and add to array
        var newType = { 'type_id': latestId + 1, 'type_name': name }
        types.push(newType)
        resolve(newType)
    })
}

// TODO: Ensure this method works!
TypeSource.prototype.addTypes = (names) => {
    return new Promise((resolve, reject) => {
        for (var i = 0; i < names.length; i++) {
            var defaultId = types.length > 0 ? types[0].type_id + 1 : 1
            var latestId = types.reduce((max, item) => item.type_id > max ? item.type_id : max, defaultId)
            var newType = { type_id: latestId + 1, type_name: names[i] }
            types.push(newType)
        }
        resolve()
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

TypeSource.prototype.clear = () => {
    return new Promise((resolve, reject) => {
        types = []
        resolve()
    })
}

module.exports = TypeSource