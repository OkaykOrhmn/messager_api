import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

class User {
    async createUser(req) {
        const { name, username, email, password } = req.body;
        const user = await prisma.user.create(
            {
                data: req.body
            }
        )
        return user;
    }

    async userInfo(req, tokenId) {
        var id = tokenId;
        const { username } = req.body;
        console.log(id);

        if (id) {
            id = Number(id);
        }
        const user = await prisma.user.findUnique({
            where: {
                username: username, id: id

            },
        });
        return user;
    }
}

export const userDb = new User();

class Chat {
    async createChat(req) {
        const chat = await prisma.chat.create({
            data: req.body,
        });
        return chat;
    }

    async chatsData(id) {
        const chat = await prisma.chat.findUnique({
            where: {
                id: id
            },
            include: {
                Message: true,
                receiverUser: true,
                senderUser: true
            }
        });
        return chat;
    }

}

export const chatDb = new Chat();

class Message {
    async createMessage(req) {
        const message = await prisma.message.create({
            data: req
        });
        return message;
    }

    async MessageData(req) {
        const { id } = req.params;
        const message = await prisma.message.findUnique({
            where: {
                id: id
            },
        });
        return message;
    }
}

export const messageDb = new Message();
