const User = require('../models/User');
const { sendEmail } = require('../utils/mailer');

exports.sendGeneric = async (req, res, next) => {
  try {
    const { to, subject, text, html } = req.body || {};
    if (!to || !subject || (!text && !html)) return res.status(400).json({ message: 'invalid payload' });
    const r = await sendEmail({ to, subject, text, html });
    res.json({ ok: true, id: r.messageId });
  } catch (err) { next(err); }
};

exports.notifyMessage = async (req, res, next) => {
  try {
    const { roomId, senderId } = req.body || {};
    if (!roomId || !senderId) return res.status(400).json({ message: 'roomId and senderId required' });
    const parts = roomId.split('_').filter(Boolean);
    const otherId = parts.find(p => p !== senderId);
    if (!otherId) return res.status(400).json({ message: 'could not resolve recipient' });
    const recipient = await User.findById(otherId);
    const sender = await User.findById(senderId);
    if (!recipient || !recipient.email) return res.status(404).json({ message: 'recipient not found' });
    const subject = `New message from ${sender?.name || 'TravelBuddy user'}`;
    const text = `You have a new message in room ${roomId}.`;
    const r = await sendEmail({ to: recipient.email, subject, text });
    res.json({ ok: true, id: r.messageId });
  } catch (err) { next(err); }
};

exports.notifyMatch = async (req, res, next) => {
  try {
    const { currentUserId, matchedUserId } = req.body || {};
    if (!currentUserId || !matchedUserId) return res.status(400).json({ message: 'ids required' });
    const current = await User.findById(currentUserId);
    const matched = await User.findById(matchedUserId);
    if (!current?.email || !matched?.email) return res.status(404).json({ message: 'emails not found' });
    const r1 = await sendEmail({ to: current.email, subject: 'New match found', text: `You matched with ${matched.name || matched.email}` });
    const r2 = await sendEmail({ to: matched.email, subject: 'You were matched', text: `You matched with ${current.name || current.email}` });
    res.json({ ok: true, ids: [r1.messageId, r2.messageId] });
  } catch (err) { next(err); }
};

