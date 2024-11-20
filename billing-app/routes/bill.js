const express = require('express');
const { createBill, getAllBills } = require('../controllers/billController');
const router = express.Router();

// Create a bill
router.post('/', createBill);

// Get all bills
router.get('/', getAllBills);

module.exports = router;
