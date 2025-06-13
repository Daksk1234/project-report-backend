const express = require('express');
const {
  getAllSuperAdmins,
  createSuperAdmin,
  updateSuperAdmin,
  deleteSuperAdmin,
} = require('../../controllers/master/superAdminController');
const router = express.Router();

router.get('/', getAllSuperAdmins);
router.post('/', createSuperAdmin);
router.put('/:id', updateSuperAdmin);
router.delete('/:id', deleteSuperAdmin);

module.exports = router;
