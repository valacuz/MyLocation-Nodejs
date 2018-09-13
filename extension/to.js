// Awesome utility function for async/await error handler
// see: https://blog.grossman.io/how-to-write-async-await-without-try-catch-blocks-in-javascript/
exports.to = function (promise) {
    return promise
        .then(data => [null, data])
        .catch(err => [err])
}