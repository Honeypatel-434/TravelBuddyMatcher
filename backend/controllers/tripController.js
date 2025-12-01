const Trip = require('../models/Trip');

exports.createTrip = async (req, res, next) => {
  try {
    const trip = new Trip({ ...req.body, user: req.user.id });
    await trip.save();
    res.json(trip);
  } catch (err) { next(err); }
};

exports.getTrips = async (req, res, next) => {
  try {
    const trips = await Trip.find().populate('user','name email');
    res.json(trips);
  } catch (err) { next(err); }
};

exports.updateTrip = async (req, res, next) => {
  try {
    const updated = await Trip.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (err) { next(err); }
};

exports.deleteTrip = async (req, res, next) => {
  try {
    await Trip.findByIdAndDelete(req.params.id);
    res.json({ message: 'Deleted' });
  } catch (err) { next(err); }
};
