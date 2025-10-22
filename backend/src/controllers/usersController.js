const usersService = require('../services/usersService');

exports.createUserProfile = async (req, res) => {
  try {
    const uid = req.user.uid;
    const { name, role, department, year } = req.body;
    // allow role selection but set approved=false by default
    await usersService.createUser({ uid, email: req.user.email, name, role, department, year });
    res.status(201).json({ ok: true, pendingApproval: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.getUserProfile = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await usersService.getUserById(id);
    if (!user) return res.status(404).json({ error: 'Not found' });
    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.listPending = async (req, res) => {
  try {
    const pending = await usersService.listPendingUsers();
    res.json(pending);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.approve = async (req, res) => {
  try {
    const { id } = req.params;
    await usersService.approveUser(id);
    res.json({ ok: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
};
