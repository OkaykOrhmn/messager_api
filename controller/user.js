import { userDb } from "../database/db.js";
import { authentication } from "../middleware/auth.js";


class User {
    async registerUser(req, res) {
        try {
            const { password } = req.body;
            const user = await userDb.userInfo(req);

            if (!user) {
                const newUser = await userDb.createUser(req);
                const token = await authentication.create(newUser.id, newUser.username);

                return res.status(200).json({ message: 'Register Successfull.', user: newUser, token: token });

            }
            if (user.password !== password) {
                return res.status(400).json({ message: 'password is Wrong!' });
            }
            const token = await authentication.create(user.id, user.username);
            return res.status(200).json({ message: 'Login Successfull.', user: user, token: token });



        } catch (error) {

            return res.status(500).json({ message: 'Somthing Wrong!!', error: error.message });

        }
    }

    async getUser(req, res) {
        try {
            const { password } = req.body;
            const user = await userDb.userInfo(req);
            if (!user) {
                return res.status(400).json({ message: 'username is Wrong!' });

            }
            if (user.password !== password) {
                return res.status(400).json({ message: 'password is Wrong!' });
            }
            return res.status(200).json({ user: user });



        } catch (error) {
            console.log(error.message);


            return res.status(500).json({ message: 'Somthing Wrong!!', error: error.message });

        }
    }
}

export const userController = new User();
