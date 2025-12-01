const Trip = require('../models/Trip');

exports.getMatches = async (req, res, next) => {
  try {
    // example: receive { destination, startDate, endDate, interests }
    const { destination, startDate, endDate, interests } = req.query;

    // basic filter: same destination + date overlap
    const filter = {
      destination,
      startDate: { $lte: new Date(endDate) },
      endDate: { $gte: new Date(startDate) },
    };

    const all = await Trip.find(filter).populate('user','name email');

    // optional: score by shared interests
    let result = all;
    if (interests) {
      const interestList = interests.split(',').map(s => s.trim().toLowerCase()).filter(Boolean);
      result = all.map(t => {
        const shared = (t.interests || []).map(i => i.toLowerCase()).filter(i => interestList.includes(i));
        return { trip: t, score: shared.length };
      }).sort((a,b) => b.score - a.score).map(x => x.trip);
    }

    res.json(result);
  } catch (err) { next(err); }
};
