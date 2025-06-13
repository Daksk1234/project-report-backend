// backend/routes/user/projectRoutes.js
const express = require('express');
const authenticate = require('../../middleware/authMiddleware');
const {
  getProjects,
  getProjectById,
  createProject,
  updateProject,
  createOrder,
  payProject,
} = require('../../controllers/user/projectController');

const router = express.Router();
router.use(authenticate('user'));

router.get('/', getProjects);
router.get('/:id', getProjectById);
router.post('/', createProject);
router.put('/:id', updateProject);
router.post('/:id/order', createOrder);
router.post('/:id/pay', payProject);

module.exports = router;
