// backend/routes/master/userRoutes.js
const express = require('express');
const authenticate = require('../../middleware/authMiddleware');
const {
  getAllUsers,
  getUserProjects,
  updateUser,
  deleteUser,
} = require('../../controllers/master/userController');

const router = express.Router();

// All routes protected for Master only
router.use(authenticate('master'));

router.get('/', getAllUsers);
router.get('/:id/projects', getUserProjects);
router.put('/:id', updateUser);
router.delete('/:id', deleteUser);

module.exports = router;
