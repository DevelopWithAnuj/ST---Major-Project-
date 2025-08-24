module.exports = async function (req, res, next) {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ msg: 'Admin resource: Access Denied' });
    }
    next();
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};
