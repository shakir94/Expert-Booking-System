const Booking = require('../models/Booking');
const Expert = require('../models/Expert');


const createBooking = async (req, res, next) => {
  try {
    const { expertId, userName, email, phone, date, timeSlot, notes } = req.body;

    
    const expert = await Expert.findOneAndUpdate(
      {
        _id: expertId,
        availableSlots: {
          $elemMatch: { date, time: timeSlot, isBooked: false },
        },
      },
      { $set: { 'availableSlots.$.isBooked': true } },
      { new: true }
    );

    if (!expert) {
      return res.status(409).json({
        success: false,
        message: 'This time slot is already booked or unavailable. Please choose another slot.',
      });
    }

    const booking = new Booking({
      expertId,
      expertName: expert.name,
      userName,
      email,
      phone,
      date,
      timeSlot,
      notes,
    });

    await booking.save();

    
    const io = req.app.get('io');
    if (io) {
      io.to(`expert:${expertId}`).emit('slotBooked', {
        expertId,
        date,
        timeSlot,
        bookingId: booking._id,
      });
    }

    res.status(201).json({
      success: true,
      message: 'Booking created successfully!',
      data: booking,
    });
  } catch (error) {
    next(error);
  }
};


const updateBookingStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const validStatuses = ['Pending', 'Confirmed', 'Completed', 'Cancelled'];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status value' });
    }

    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    );

    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }

   
    if (status === 'Cancelled') {
      await Expert.findOneAndUpdate(
        {
          _id: booking.expertId,
          'availableSlots.date': booking.date,
          'availableSlots.time': booking.timeSlot,
        },
        { $set: { 'availableSlots.$.isBooked': false } }
      );

      const io = req.app.get('io');
      if (io) {
        io.to(`expert:${booking.expertId}`).emit('slotFreed', {
          expertId: booking.expertId,
          date: booking.date,
          timeSlot: booking.timeSlot,
        });
      }
    }

    res.json({ success: true, message: `Booking status updated to ${status}`, data: booking });
  } catch (error) {
    next(error);
  }
};


const getBookingsByEmail = async (req, res, next) => {
  try {
    const { email } = req.query;
    if (!email) {
      return res.status(400).json({ success: false, message: 'Email query parameter is required' });
    }

    const bookings = await Booking.find({ email: email.toLowerCase() }).sort({ createdAt: -1 });

    res.json({ success: true, data: bookings, count: bookings.length });
  } catch (error) {
    next(error);
  }
};

module.exports = { createBooking, updateBookingStatus, getBookingsByEmail };
