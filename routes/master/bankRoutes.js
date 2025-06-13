const express = require('express');
const authenticate = require('../../middleware/authMiddleware');
const multer = require('multer');
const upload = multer();
const {
  getBanks,
  createBank,
  updateBank,
  deleteBank,
  bulkUploadBanks,
} = require('../../controllers/master/bankController');

const router = express.Router();

router.get('/', authenticate(), getBanks);
router.post('/', authenticate('master'), createBank);
router.put('/:id', authenticate('master'), updateBank);
router.delete('/:id', authenticate('master'), deleteBank);
router.post(
  '/bulk',
  authenticate('master'),
  upload.single('file'),
  bulkUploadBanks
);

module.exports = router;
