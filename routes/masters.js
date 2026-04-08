const express = require('express');
const router = express.Router();

// Temporary - crash oldini olish uchun
router.get('/', (req, res) => {
  res.json({ message: 'Masters API - keyinroq' });
});

module.exports = router;
