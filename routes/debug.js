// backend/routes/debug.js
const express = require('express');
const Project = require('../models/Project');
const authenticate = require('../middleware/authMiddleware');
const router = express.Router();

router.get('/project', authenticate('user'), async (req, res) => {
  const proj = await Project.findOne({ user: req.user.id });
  return res.json(proj);
});

module.exports = router;
