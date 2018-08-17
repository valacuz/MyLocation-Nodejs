const local = require('./local-config')

module.exports = {
    // Server configuration here
    listenPort: process.env.PORT || local.listenPort,
    mongoDbUrl: process.env.MONGO_URL || local.mongoDbUrl,
    mongoDbUser: process.env.MONGO_USER || local.mongoDbUser,
    mongoDbPwd: process.env.MONGO_PWD || local.mongoDbPwd
}