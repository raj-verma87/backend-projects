const Bill = require('../models/Bill');
const BillItem = require('../models/BillItem');
const Product = require('../models/Product');
const { generateUPIQRCode } = require('../utils/qrCode');

// Helper function to calculate GST
const calculateGST = (amount, gstPercentage) => (amount * gstPercentage) / 100;

// Create a new bill
const createBill = async (req, res) => {
  try {
    const { items, customerDetails, paymentMode, gst, makingCharges, otherCharges } = req.body;
    let totalAmount = 0;

    const bill = await Bill.create({
      totalAmount,
      gst,
      makingCharges,
      otherCharges,
      customerDetails: JSON.stringify(customerDetails),
      paymentMode,
    });

    await Promise.all(
      items.map(async ({ productId, quantity }) => {
        const product = await Product.findByPk(productId);
        if (!product) throw new Error(`Product with ID ${productId} not found`);
        const price = product.price * quantity;
        totalAmount += price;
        return BillItem.create({
          billId: bill.id,
          productId,
          quantity,
          price:product.price,
          productName:product.name
        });
      })
    );
    await bill.update({ totalAmount });

    const detailedBill = await Bill.findByPk(bill.id, {
      include: {
        model: BillItem,
        include: Product,
      },
    });

    res.status(201).json(detailedBill);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


// Get all bills
const getAllBills = async (req, res) => {
  try {
    const bills = await Bill.findAll({
      include: {
        model: BillItem,
        include: Product, // Include product details in the response
      },
      order: [['createdAt', 'DESC']], // Sort bills by the most recent first
    });
   // console.log("bill history111...",bills[0]);
    // Map over bills to format customerDetails and totals
    const formattedBills = bills.map((bill) => ({
      id: bill.id,
      date: bill.date,
      customerDetails: bill.customerDetails ? JSON.parse(bill.customerDetails) : {},
      totalAmount: bill.totalAmount,
      gst: bill.gst,
      makingCharges: bill.makingCharges,
      otherCharges: bill.otherCharges,
      billItems: bill.BillItems.map((item) => ({
        id: item.id,
        productId: item.productId,
        quantity: item.quantity,
        price: item.price,
        productName: item.productName,
      })),
      paymentMode: bill.paymentMode ?  bill.paymentMode : "offline",
    }));
    res.status(200).json(formattedBills);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get a bill by its ID
const getBillById = async (req, res) => {
  try {
    const { id } = req.params;  // Get bill ID from the request parameters

    // Fetch the bill by its ID with related BillItems and Products
    const bill = await Bill.findByPk(id, {
      include: {
        model: BillItem,
        include: Product, // Include product details in the response
      },
    });

    // If the bill is not found, return a 404 response
    if (!bill) {
      return res.status(404).json({ error: 'Bill not found' });
    }

    // Format the response
    const formattedBill = {
      id: bill.id,
      date: bill.date,
      customerDetails: bill.customerDetails ? JSON.parse(bill.customerDetails) : {},
      totalAmount: bill.totalAmount,
      gst: bill.gst,
      makingCharges: bill.makingCharges,
      otherCharges: bill.otherCharges,
      billItems: bill.BillItems.map((item) => ({
        id: item.id,
        productId: item.productId,
        quantity: item.quantity,
        price: item.price,
        productName: item.productName,
      })),
      paymentMode: bill.paymentMode  ?  bill.paymentMode : "offline",
    };

    // Send the formatted bill as a response
    res.status(200).json(formattedBill);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Create a new bill with UPI payment integration
const createBillWithPayment = async (req, res) => {
  try {
    const {
      items,
      upiId,
      gstPercentage = 18,
      makingCharges = 0,
      otherCharges = 0,
      customerDetails,
    } = req.body;

    let subtotal = 0;

    const bill = await Bill.create({
      gst: 0,
      makingCharges,
      otherCharges,
      totalAmount: 0,
      customerDetails: JSON.stringify(customerDetails),
      paymentMode: 'UPI',
    });

    const billItems = await Promise.all(
      items.map(async ({ productId, quantity }) => {
        const product = await Product.findByPk(productId);
        if (!product) throw new Error(`Product with ID ${productId} not found`);

        const price = product.price * quantity;
        subtotal += price;

        return BillItem.create({
          billId: bill.id,
          productId,
          quantity,
          price,
        });
      })
    );

    // Calculate GST
    const gst = calculateGST(subtotal, gstPercentage);

    // Calculate the total amount
    const totalAmount = subtotal + gst + makingCharges + otherCharges;

    // Update the bill with calculated amounts
    await bill.update({ gst, makingCharges, otherCharges, totalAmount });

    // Generate UPI QR Code
    const qrCode = await generateUPIQRCode(upiId, totalAmount);

    // Fetch the detailed bill with related items
    const detailedBill = await Bill.findByPk(bill.id, {
      include: {
        model: BillItem,
        include: Product, // Include product details in the response
      },
    });

    // Format the response
    const formattedBill = {
      id: detailedBill.id,
      date: detailedBill.date,
      customerDetails: detailedBill.customerDetails
        ? JSON.parse(detailedBill.customerDetails)
        : {},
      totalAmount: detailedBill.totalAmount,
      gst: detailedBill.gst,
      makingCharges: detailedBill.makingCharges,
      otherCharges: detailedBill.otherCharges,
      billItems: detailedBill.BillItems.map((item) => ({
        id: item.id,
        productId: item.productId,
        quantity: item.quantity,
        price: item.price,
        productName: item.Product.name,
      })),
      paymentMode: detailedBill.paymentMode,
      qrCode,
    };

    res.status(201).json(formattedBill);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


module.exports = { createBill, getAllBills, createBillWithPayment, getBillById };
