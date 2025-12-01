const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const http = require("http");
const { Server } = require("socket.io");
const Message = require("./models/Message");

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

// Routes
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const tripRoutes = require("./routes/tripRoutes");
const matchRoutes = require("./routes/matchRoutes");
const messageRoutes = require("./routes/messageRoutes");
const weatherRoutes = require("./routes/weatherRoutes");
const notifyRoutes = require("./routes/notifyRoutes");

app.use("/api/users", authRoutes);
app.use("/api/protected", userRoutes);
app.use("/api/trips", tripRoutes);
app.use("/api/matches", matchRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/weather", weatherRoutes);
app.use("/api/notify", notifyRoutes);


// Mongo + Server + Socket.IO
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB Connected");

    const server = http.createServer(app);
    const io = new Server(server, {
      cors: {
        origin: process.env.CLIENT_URL || "http://localhost:3000",
        credentials: true,
      },
    });

    io.on("connection", (socket) => {
      socket.on("join", (roomId) => {
        socket.join(roomId);
      });

      socket.on("message", async ({ roomId, text, sender }) => {
        try {
          const msg = await Message.create({ roomId, text, sender });
          io.to(roomId).emit("message", {
            _id: msg._id,
            roomId: msg.roomId,
            text: msg.text,
            sender: msg.sender,
            createdAt: msg.createdAt,
          });
          try {
            const parts = (roomId || '').split('_').filter(Boolean);
            const otherId = parts.find(p => p !== String(sender));
            if (otherId) {
              const User = require('./models/User');
              const { sendEmail } = require('./utils/mailer');
              const recipient = await User.findById(otherId);
              const senderUser = await User.findById(sender);
              if (recipient?.email) {
                const subject = `New message from ${senderUser?.name || 'TravelBuddy user'}`;
                const textBody = `You have a new message: \"${text}\"`;
                await sendEmail({ to: recipient.email, subject, text: textBody });
              }
            }
          } catch (e) {
            // swallow notification errors
          }
        } catch (err) {
          // optional: emit error event
        }
      });
    });

    const PORT = process.env.PORT || 5000;
    server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((err) => console.log("DB Error: ", err));
