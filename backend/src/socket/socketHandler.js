const initSocket = (io) => {
  io.on('connection', (socket) => {
    console.log(`🔌 Client connected: ${socket.id}`);

    
    socket.on('joinExpertRoom', (expertId) => {
      socket.join(`expert:${expertId}`);
      console.log(`Socket ${socket.id} joined room expert:${expertId}`);
    });

    socket.on('leaveExpertRoom', (expertId) => {
      socket.leave(`expert:${expertId}`);
    });

    socket.on('disconnect', () => {
      console.log(`Client disconnected: ${socket.id}`);
    });
  });
};

module.exports = { initSocket };
