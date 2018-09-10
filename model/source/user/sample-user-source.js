const UserSource = function () { }

var users = [
    {
        id: 'ABC00001',
        username: 'admin01',
        password: 'adminpwd01',
        can_insert: true,
        can_update: true,
        can_delete: true
    },
    {
        id: 'XYZ00003',
        username: 'member03',
        password: 'mempwd03',
        can_insert: false,
        can_update: false,
        can_delete: false
    }
]

UserSource.prototype.checkUser = (username, password) => {
    return new Promise((resolve, reject) => {
        const user = users.find(item => {
            return item.username === username && item.password === password
        })
        resolve(user)
    })
}

module.exports = UserSource