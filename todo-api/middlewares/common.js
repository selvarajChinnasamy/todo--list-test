const validateAuth = function (req, res, next) {
    if (req.type == 'OPTIONS' || req.path == '/api/user/login') {
        return next();
    }
    const authHeader = req.headers.authorization;
    if (authHeader) {
        const token = authHeader.split(' ')[1];
        global.jwt.verify(token, process.env.JWT_PASSWORD, (err, user) => {
            if (err) {
                return res.sendStatus(403);
            }
            req.user = user;
            next();
        });
    } else {
        return res.sendStatus(401);
    }
};

const middlewares = {
    enableCors(req, res, next) {
        res.header('Access-Control-Allow-Origin', '*');
        res.header('Access-Control-Allow-Headers', 'Origin, Authorization, X-Requested-With, Content-Type, Accept');
        res.header('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, OPTIONS');
        next();
    },
    setDefaultHeaders(req, res, next) {
        res.setHeader('Content-Type', 'application/json');
        next();
    },
    authenticate(req, res, next) {
        return validateAuth(req, res, next);
    },
    errorHandler(err, req, res, next) {
        const errorMessage = { success: false, message: err.message ? err.message : 'Something went wrong!' };
        if (err) {
            res.status(err.status || 500).json(errorMessage);
        }
        return next();
    },
}

module.exports = middlewares;