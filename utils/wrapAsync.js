function wrapAsync(fn) {
    return function (req, res, next) {
        fn(req, res, next).catch(next); // Or use: .catch(err => next(err))
    };
}
module.exports=wrapAsync