require('env2')('./config/local-config.env')

module.exports = {
  // Server configuration here
  listenPort: process.env.PORT,
  mongoDbUrl: process.env.MONGO_URL,
  mongoDbUser: process.env.MONGO_USER,
  mongoDbPwd: process.env.MONGO_PWD,
  jwtSecret: process.env.JWT_SECRET
}
