const express = require('express');
const connectDB = require('./config/db');
const app = express();
const app2 = express();

const cors = require('cors');
const server = require("http").Server(app2);
const { v4: uuidv4 } = require("uuid");
app2.set("view engine", "ejs");
const io = require("socket.io")(server, {
  cors: {
    origin: '*'
  }
});
const { ExpressPeerServer } = require("peer");
const peerServer = ExpressPeerServer(server, {
  debug: true,
});
//connect database
connectDB();

//enable cors for all routes
app.use(cors());

app.get('/', (req, res) => {
  res.send({ status: 'API is running' });
});

app2.use("/peerjs", peerServer);
app2.use(express.static("public"));

app2.get("/", (req, res) => {
  res.redirect(`/${uuidv4()}`);
});

app2.get("/:room", (req, res) => {
  res.render("room", { roomId: req.params.room });
});

io.on("connection", (socket) => {
  socket.on("join-room", (roomId, userId, userName) => {
    socket.join(roomId);
    socket.to(roomId).broadcast.emit("user-connected", userId);
    socket.on("message", (message) => {
      io.to(roomId).emit("createMessage", message, userName);
    });
  });
});
//Init middleware for bodyparser
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

//@define routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/users', require('./routes/users'));
app.use('/api/admins', require('./routes/admins'));
app.use('/api/user-profile', require('./routes/user-profile'));
app.use('/api/article', require('./routes/Article'));
app.use('/api/therapist', require('./routes/therapistAuthRoutes'));
app.use('/api/therapistProfile', require('./routes/therapistProfileRoutes'));
app.use('/api/appointments', require('./routes/appointments'));
app.use('/api/images', require('./routes/images'));
app.use('/api/reviews', require('./routes/reviews'));
app.use('/api/session', require('./routes/video'));
app.use('/api/conversations', require('./routes/conversation'));
app.use('/api/messages', require('./routes/message'));
app.use('/api/posts', require('./routes/posts'));
//serve static assets in production
// if (process.env.NODE_ENV === 'production') {
//   //set static folder
//   app.use(express.static('client/build'));
//   app.get('*', (req, res) => {
//     res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
//   });
// }

const PORT = process.env.PORT || 5000;
const PORT2 = process.env.PORT2 || 3030;


app.listen(PORT, () => {
  console.log(`Server started on port:${PORT}`);
});
server.listen(process.env.PORT2 || 3030);