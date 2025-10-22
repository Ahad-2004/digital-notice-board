const noticesService = require('../services/noticesService');

exports.listNotices = async (req, res) => {
  try {
    const { department, year } = req.query;
    const notices = await noticesService.listActiveNotices({ department, year });
    res.json(notices);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.createNotice = async (req, res) => {
  try {
    const notice = req.body;
    notice.createdBy = req.user ? req.user.email || req.user.uid : notice.createdBy;
    const created = await noticesService.createNotice(notice);
    res.status(201).json(created);
  } catch (err) {
    console.error(err);
    res.status(err.status || 500).json({ error: err.message || 'Internal server error' });
  }
};

exports.updateNotice = async (req, res) => {
  try {
    const { id } = req.params;
    const data = req.body;
    const updated = await noticesService.updateNotice(id, data);
    res.json(updated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.deleteNotice = async (req, res) => {
  try {
    const { id } = req.params;
    await noticesService.deleteNotice(id);
    res.status(204).end();
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
};
