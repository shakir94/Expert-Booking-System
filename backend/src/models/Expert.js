const mongoose = require('mongoose');

const slotSchema = new mongoose.Schema({
  date: { type: String, required: true },
  time: { type: String, required: true },
  isBooked: { type: Boolean, default: false },
});

const expertSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    category: {
      type: String,
      required: true,
      enum: ['Technology', 'Finance', 'Healthcare', 'Business', 'Legal', 'Marketing'],
    },
    specialization: { type: String, required: true },
    experience: { type: Number, required: true, min: 0 },
    rating: { type: Number, required: true, min: 0, max: 5 },
    bio: { type: String, required: true },
    avatar: { type: String, default: '' },
    hourlyRate: { type: Number, required: true },
    availableSlots: [slotSchema],
  },
  { timestamps: true }
);


expertSchema.index({ name: 'text', specialization: 'text' });

module.exports = mongoose.model('Expert', expertSchema);
