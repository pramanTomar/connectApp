import jwt from 'jsonwebtoken';

export const verifyToken = (req, res, next) => {
    try {
        let token = req.header("Autherization");

        if(!token) return res.status(403).send("Access Denied");

        if(token.startsWith("UserToken ")){
            token = token.slice(10, token.length).trimLeft();
        }

        const verified = jwt.verify(token, process.env.JWT_SECRET);

        req.user = verified;

        next();

    } catch (error) {
        res.status(500).json({error: error})
    }
}