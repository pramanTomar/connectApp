import express from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import multer from 'multer';
import helmet from 'helmet';
import morgan from 'morgan';
import path, { dirname } from 'path';
import { fileURLToPath } from 'url';
import authRoutes from './routes/auth.js';
import userRoutes from './routes/users.js';
import postRoutes from './routes/posts.js';
import { register } from './controllers/auth.js';
import { createPost, updatePost } from './controllers/posts.js';
import { verifyToken } from './middleware/auth.js';
import chatRoutes from './routes/chat.js';
import messageRoutes from './routes/message.js';
import { createRequire } from 'module';

/* Configurations */

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config();
const app = express();
app.use(express.json());
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({policy: "cross-origin"}));
app.use(morgan("common"));
app.use(bodyParser.json({ limit: "30mb", extended: true}));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));
app.use(cors());
app.use("/assets", express.static(path.join(__dirname, "public/assets")));
mongoose.set('strictQuery', true);

// FILE STORAGE (when someone upload a image then we are setting the storate path for that image using multer(all of these configurations are ))
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "public/assets");
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    }
});

const upload = multer({ storage });

// ROUTES for Uploading a Picture
app.post('/auth/register', upload.single("picture"), register);
app.post('/posts', verifyToken, upload.single("picture"), createPost);
app.patch('/posts/:id/update', verifyToken, upload.single("picture"), updatePost);

// Other Routes
app.use('/auth', authRoutes);
app.use('/users', userRoutes);
app.use('/posts',  postRoutes);

// Messenger Routes
app.use('/chat', chatRoutes);
app.use('/messages', messageRoutes);

// MONGOOSE CONNECT 
const PORT = process.env.PORT || 3001;

mongoose.connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
}).catch((e) => {
    console.log(e);
});

const server = app.listen(PORT);

// Socket.io stuff

const require = createRequire(import.meta.url);
const io = require('socket.io')(server,{
    cors: {
        origin: process.env.BASE_URL
    }
})

let activeUsers = [];

io.on("connection", (socket) => {
    // add new user
    // we use .on if we want to get data from other side (react maybe) 
    socket.on("new-user-add", (newUserId) => { // this newUserId is provided from react (Id of user who want to establish connection)
        // if user is not added previously 
        if(!activeUsers.some((user) => user.userId === newUserId)){
            activeUsers.push({
                userId: newUserId,
                socketId: socket.id
            })
        }
        // we user .emit if we want to send data to other side basically client side
        io.emit('get-users', activeUsers);
    });

    // Send Message
    socket.on('send-message', (message) => {
        const friendId = message.friendId;
        const friend = activeUsers.find((user) => user.userId === friendId);
        if(friend){
            io.to(friend.socketId).emit('receive-message', message);
        }
    });

    // handle disconnection
    socket.on("disconnect", () => {
        activeUsers = activeUsers.filter((user) => user.socketId !== socket.id);
        io.emit('get-users', activeUsers);
    });
});