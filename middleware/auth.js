import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config()

class Authentication {
    async create(id, username) {
        if (!process.env.JWT_SECRET_KEY) {
            throw new Error("JWT_SECRET_KEY environment variable is not set");
        }
        const token = jwt.sign(
            { id: id, username: username },
            process.env.JWT_SECRET_KEY,
            {
                // expiresIn: "1d",
            }
        );
        return token;
    }

    async auth(req, res, next) {
        try {
            const token = req.header('Authorization')?.replace('Bearer ', '');

            if (!token) {
                res.status(401).json({ message: "Token Please!" });
                return;
            }
            if (!process.env.JWT_SECRET_KEY) {
                res.status(500).json({ message: "JWT_SECRET_KEY environment variable is not set" });
                return;
            }

            const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
            req.token = decoded;

            next();
        } catch (err) {
            if (err.name === 'TokenExpiredError') {
                return res.status(401).send({ status: 401, message: 'نشست منقضی شده است' });

            }
            if (err.name === 'JsonWebTokenError') {
                return res.status(400).json({ message: 'Token is Wrong!!' });

            }
            return res.status(500).send({ message: 'Somthing Wrong!!', error: err.message });
        }
    }

}

export const authentication = new Authentication();