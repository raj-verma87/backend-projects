import React from 'react';

const ShowCurrentBill = ({ bill }) => {
  if (!bill) {
    return <div style={{ margin: '20px' }}>No bills found</div>; // Show a loading message if the bill is undefined
  }

  const {
    billItems,
    totalAmount,
    gst,
    makingCharges,
    otherCharges,
    discount,
    paymentMode,
    date,
  } = bill;

  const calculateGrandTotal = () => {
    // Grand total = Total Amount + GST + Making Charges + Other Charges - Discount
    return Math.round(totalAmount + gst + makingCharges + otherCharges - discount);
  };

  return (
    <div style={{ padding: '20px', border: '1px solid black', width: '60%', margin: '10px auto' }}>
      {/* Header Section */}
      <header style={{ textAlign: 'center', marginBottom: '10px', flex: '0 0 5%' }}>
        <h3>Bill Receipt</h3>
        <p> Digital India New Delhi +91-1234567890</p>
        <p>Date & Time: {new Date(date).toLocaleString()}</p>
      </header>

      {/* Product List */}
      <section style={{ marginBottom: '20px', flex: '1' }}>
        <h3>Products</h3>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th style={{ border: '1px solid black', padding: '5px' }}>Product</th>
              <th style={{ border: '1px solid black', padding: '5px' }}>Quantity</th>
              <th style={{ border: '1px solid black', padding: '5px' }}>Price</th>
              <th style={{ border: '1px solid black', padding: '5px' }}>Subtotal</th>
            </tr>
          </thead>
          <tbody>
            {billItems.map((item) => (
              <tr key={item.id}>
                <td style={{ border: '1px solid black', padding: '5px' }}>{item.productName}</td>
                <td style={{ border: '1px solid black', padding: '5px' }}>{item.quantity}</td>
                <td style={{ border: '1px solid black', padding: '5px' }}>₹{item.price}</td>
                <td style={{ border: '1px solid black', padding: '5px' }}>
                  ₹{item.price * item.quantity}
                </td>
              </tr>
            ))}
            {/* Total Row */}
            <tr style={{ fontWeight: 'bold' }}>
              <td colSpan="3" style={{ border: '1px solid black', padding: '5px', textAlign: 'right' }}>
                Total Amount
              </td>
              <td style={{ border: '1px solid black', padding: '5px' }}>
                ₹{totalAmount}
              </td>
            </tr>
            <tr style={{ fontWeight: 'bold' }}>
              <td colSpan="3" style={{ border: '1px solid black', padding: '5px', textAlign: 'right' }}>
                GST
              </td>
              <td style={{ border: '1px solid black', padding: '5px' }}>
                ₹{gst}
              </td>
            </tr>
            <tr style={{ fontWeight: 'bold' }}>
              <td colSpan="3" style={{ border: '1px solid black', padding: '5px', textAlign: 'right' }}>
                Making Charges
              </td>
              <td style={{ border: '1px solid black', padding: '5px' }}>
                ₹{makingCharges}
              </td>
            </tr>
            <tr style={{ fontWeight: 'bold' }}>
              <td colSpan="3" style={{ border: '1px solid black', padding: '5px', textAlign: 'right' }}>
                Other Charges
              </td>
              <td style={{ border: '1px solid black', padding: '5px' }}>
                ₹{otherCharges}
              </td>
            </tr>
            {/* Discount Row */}
            <tr style={{ fontWeight: 'bold' }}>
              <td colSpan="3" style={{ border: '1px solid black', padding: '5px', textAlign: 'right' }}>
                Discount
              </td>
              <td style={{ border: '1px solid black', padding: '5px' }}>
                ₹{discount}
              </td>
            </tr>
            {/* Grand Total Row */}
            <tr style={{ fontWeight: 'bold' }}>
              <td colSpan="3" style={{ border: '1px solid black', padding: '5px', textAlign: 'right' }}>
                Grand Total
              </td>
              <td style={{ border: '1px solid black', padding: '5px' }}>
                ₹{calculateGrandTotal()}
              </td>
            </tr>
          </tbody>
        </table>
      </section>

      {/* Payment Mode */}
      <section style={{ marginBottom: '20px' }}>
        <h3>Payment Mode: {paymentMode}</h3>
      </section>

      {/* Footer Section */}
      <footer style={{ textAlign: 'center', marginTop: '30px' }}>
        <p>Thank you for shopping with us!</p>
        <p>Signature: ___________________</p>
      </footer>
    </div>
  );
};

export default ShowCurrentBill;