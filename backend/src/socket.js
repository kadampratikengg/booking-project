const socketio = require('socket.io');
const Ride = require('./models/Ride');
let io;

function initSocket(server) {
  io = socketio(server, { cors: { origin: '*' } });

  // rideRequestQueue map to store active windows: rideId -> timeoutId and lock
  const rideWindows = new Map();

  io.on('connection', (socket) => {
    console.log('socket connected', socket.id);

    // clients should join rooms: customer-<id> or driver-<id>
    socket.on('join', ({ type, id }) => {
      if (!type || !id) return;
      const room = `${type}-${id}`;
      socket.join(room);
      console.log('joined', room);
    });

    // driver acceptance via socket - lower-latency path
    socket.on('driver-try-accept', async ({ rideId, driverId }) => {
      try {
        // If ride already assigned, tell driver
        const ride = await Ride.findById(rideId);
        if (!ride) {
          socket.emit('accept-result', { ok: false, message: 'Ride not found' });
          return;
        }
        if (ride.status !== 'requested') {
          socket.emit('accept-result', { ok: false, message: 'Already assigned' });
          return;
        }

        // Acquire lock atomically by updating DB
        const assigned = await Ride.findOneAndUpdate(
          { _id: rideId, status: 'requested' },
          { status: 'assigned', driver: driverId, acceptedAt: new Date() },
          { new: true }
        );

        if (!assigned) {
          socket.emit('accept-result', { ok: false, message: 'Someone else got it' });
          return;
        }

        // Successful assignment: notify customer and drivers
        io.to(`customer-${assigned.customer}`).emit('ride-assigned', { rideId, driverId });
        io.emit('ride-accepted', { rideId, driverId });
        socket.emit('accept-result', { ok: true, assigned });

      } catch (err) {
        console.error('driver-try-accept error', err);
        socket.emit('accept-result', { ok: false, message: 'Server error' });
      }
    });

    socket.on('disconnect', () => {
      console.log('socket disconnect', socket.id);
    });
  });

  module.exports.io = io;
}

module.exports = { initSocket, io };
