require('dotenv').config();
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const connectDB = require('./src/config/db');
const expertRoutes = require('./src/routes/expertRoutes');
const bookingRoutes = require('./src/routes/bookingRoutes');
const errorHandler = require('./src/middleware/errorHandler');
const { initSocket } = require('./src/socket/socketHandler');

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    methods: ['GET', 'POST', 'PATCH'],
  },
});


app.set('io', io);


connectDB();


app.use(cors({ origin: process.env.CLIENT_URL || 'http://localhost:5173' }));
app.use(express.json());


app.use('/api/experts', expertRoutes);
app.use('/api/bookings', bookingRoutes);


app.get('/api/health', (req, res) => res.json({ status: 'OK', timestamp: new Date() }));


app.use(errorHandler);


initSocket(io);

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Socket.io initialized`);
});
