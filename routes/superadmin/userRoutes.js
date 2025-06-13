const express = require('express');
const {
  getUsers,
  createUser,
  updateUser,
  deleteUser,
} = require('../../controllers/superadmin/userController');
const authenticate = require('../../middleware/authMiddleware');

const router = express.Router();

// All routes are protected for Super Admin only
router.use(authenticate('superadmin'));

router.get('/', getUsers);
router.post('/', createUser);
router.put('/:id', updateUser);
router.delete('/:id', deleteUser);

module.exports = router;
