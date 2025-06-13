const express = require('express');
const router = express.Router();
const {
  getByProject,
  upsert,
  remove,
} = require('./../../controllers/user/projectInputController');

router.get('/:projectId', getByProject);
router.post('/', upsert);
router.put('/:projectId', upsert);
router.delete('/:projectId', remove);

module.exports = router;
