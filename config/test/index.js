const env = require('env2')('./config/test/local-test-config.env')

module.exports = {
    // Testing configuration
    adminTestToken: process.env.ADMIN_TEST_TOKEN,
    memberTestToken: process.env.MEMBER_TEST_TOKEN,
    invalidTestToken: process.env.INVALID_TEST_TOKEN
}