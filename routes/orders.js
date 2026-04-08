const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  res.json({ message: 'Orders API - keyinroq' });
});

module.exports = router;
