const express = require('express');
const router = express.Router();
const { protect } = require('../middlewares/auth');
const {
  createCapsule,
  getAllCapsules,
  getCapsuleById,
  openCapsule,
  updateCapsule,
  deleteCapsule,
  getReceivedCapsules,
  getSentCapsules
} = require('../controllers/capsuleController');

router.get('/', protect, getAllCapsules);
router.get('/received', protect, getReceivedCapsules);
router.get('/sent', protect, getSentCapsules);
router.get('/:id', protect, getCapsuleById);
router.post('/:id/open', protect, openCapsule);
router.post('/', protect, createCapsule);
router.patch('/:id', protect, updateCapsule);
router.delete('/:id', protect, deleteCapsule);

module.exports = router;
