const User = require('../models/User');

// CREATE
const createUser = async (req, res) => {
  try {
    const user = await User.create(req.body);
    res.status(201).json({ success: true, data: user });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

// READ ALL
const getUsers = async (req, res) => {
  try {
    const { page = 1, limit = 10, role } = req.query;
    const filter = {};
    if (role) filter.role = role;
    const skip = (page - 1) * limit;

    const [users, total] = await Promise.all([
      User.find(filter)
        .select('-password')
        .skip(skip)
        .limit(parseInt(limit))
        .lean(),
      User.countDocuments(filter)
    ]);

    res.json({
      success: true,
      data: users,
      pagination: { page, limit, total }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// READ ONE
const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password').lean();
    if (!user) {
      return res.status(404).json({ success: false, error: 'Usuario no encontrado' });
    }
    res.json({ success: true, data: user });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// UPDATE
const updateUser = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({ success: false, error: 'Usuario no encontrado' });
    }
    res.json({ success: true, data: user });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

// DELETE
const deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).json({ success: false, error: 'Usuario no encontrado' });
    }
    res.json({ success: true, message: 'Usuario eliminado' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

module.exports = {
  createUser,
  getUsers,
  getUserById,
  updateUser,
  deleteUser
};