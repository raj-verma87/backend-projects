const Bill = require('../models/Bill');
const BillItem = require('../models/BillItem');
const Product = require('../models/Product');
const { generateUPIQRCode } = require('../utils/qrCode');

// Create a new bill
const createBill = async (req, res) => {
  try {
    const { items } = req.body; // items: [{ productId, quantity }]
    let totalAmount = 0;

    const bill = await Bill.create({ totalAmount });

    const billItems = await Promise.all(
      items.map(async ({ productId, quantity }) => {
        const product = await Product.findByPk(productId);
        if (!product) throw new Error(`Product with ID ${productId} not found`);
        const price = product.price * quantity;
        totalAmount += price;

        return BillItem.create({
          billId: bill.id,
          productId,
          quantity,
          price
        });
      })
    );
    // Include the billItems and product details in the response
    const detailedBill = await Bill.findByPk(bill.id, {
      include: {
        model: BillItem,
        include: Product,
      },
    });
    await bill.update({ totalAmount });

    res.status(201).json(detailedBill);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get all bills
const getAllBills = async (req, res) => {
  try {
    const bills = await Bill.findAll({
      include: { model: BillItem, include: Product }
    });
    res.status(200).json(bills);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const createBillWithPayment = async (req, res) => {
  try {
    const { items, upiId } = req.body;
    let totalAmount = 0;

    const bill = await Bill.create({ totalAmount });

    const billItems = await Promise.all(
      items.map(async ({ productId, quantity }) => {
        const product = await Product.findByPk(productId);
        if (!product) throw new Error(`Product with ID ${productId} not found`);
        const price = product.price * quantity;
        totalAmount += price;

        return BillItem.create({
          billId: bill.id,
          productId,
          quantity,
          price
        });
      })
    );

    await bill.update({ totalAmount });

    // Generate UPI QR Code
    const qrCode = await generateUPIQRCode(upiId, totalAmount);

    res.status(201).json({ bill, items: billItems, qrCode });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


module.exports = { createBill, getAllBills ,createBillWithPayment};
