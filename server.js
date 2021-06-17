const express = require("express");
const connectDB = require("./config/db");
const cors = require("cors");

const app = express();
//connect database
connectDB();

//enable cors for all routes
app.use(cors());

app.get("/", (req, res) => {
  res.send({ status: "API is running" });
});
//Init middleware for bodyparser
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

//@define routes
app.use("/api/auth", require("./routes/auth"));
app.use("/api/users", require("./routes/users"));
app.use("/api/admins", require("./routes/admins"));
app.use("/api/user-profile", require("./routes/user-profile"));
app.use("/api/article", require("./routes/Article"));
app.use("/api/therapist", require("./routes/therapistAuthRoutes"));
app.use("/api/therapistProfile", require("./routes/therapistProfileRoutes"));
app.use("/api/appointments", require("./routes/appointments"));
app.use("/api/images", require("./routes/images"));
app.use("/api/reviews", require("./routes/reviews"));
app.use("/api/session", require("./routes/video"));
app.use("/api/conversations", require("./routes/conversation"));
app.use("/api/messages", require("./routes/message"));

//serve static assets in production
// if (process.env.NODE_ENV === 'production') {
//   //set static folder
//   app.use(express.static('client/build'));
//   app.get('*', (req, res) => {
//     res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
//   });
// }

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server started on port:${PORT}`);
});
