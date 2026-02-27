import { User } from '../models/index.js';

export async function getOrCreateUser(req, res, next) {
  try {
    const username = String(req.body.username ?? req.query.username ?? '').trim();
    if (!username) {
      return res.status(400).json({ error: 'username required' });
    }
    const [user] = await User.findOrCreate({
      where: { username },
      defaults: { username },
    });
    res.json({ user: user.get({ plain: true }) });
  } catch (err) {
    next(err);
  }
}
