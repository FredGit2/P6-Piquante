const jwt = require('jsonwebtoken'); // on importe jsonwebtoken

module.exports = (req, res, next) => {
    try {
        const token = req.headers.authorization.split(' ')[1]; // on extrait le token
        const decodedToken = jwt.verify(token, 'RANDOM_TOKEN_SECRET'); // on decode le token
        const userId = decodedToken.userId; // on extrait l'userId du toker
        req.auth = {
            userId: userId
        };
        next();
    } catch (error) {
        res.status(401).json({ error });
    }
};