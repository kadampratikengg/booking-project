const PDFDocument = require("pdfkit");
const fs = require("fs");
const path = require("path");
const { v4: uuidv4 } = require("uuid");

const generateInvoicePDF = async (data) => {
  const fileName = `invoice-${uuidv4()}.pdf`;
  const filePath = path.join(__dirname, "../../invoices", fileName);

  const doc = new PDFDocument();
  doc.pipe(fs.createWriteStream(filePath));

  doc.fontSize(22).text("Ride Invoice", { align: "center" });
  doc.moveDown();

  doc.fontSize(14).text(`Invoice ID: ${uuidv4()}`);
  doc.text(`Customer: ${data.customerName}`);
  doc.text(`Driver: ${data.driverName}`);
  doc.text(`Pickup: ${data.pickup}`);
  doc.text(`Drop: ${data.drop}`);
  doc.text(`Distance: ${data.distance} km`);
  doc.text(`Fare: ₹${data.fare}`);
  doc.text(`Platform Fee: ₹${data.platformFee}`);
  doc.text(`Total: ₹${data.total}`);

  doc.end();

  return fileName;
};

module.exports = generateInvoicePDF;
