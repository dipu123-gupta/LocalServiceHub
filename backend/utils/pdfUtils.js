import pdfkit from "pdfkit";
import fs from "fs";

const PDFDocument = pdfkit.default || pdfkit;

/**
 * Generate a professional PDF invoice for a booking.
 * @param {Object} booking populated booking object
 * @param {Object} res express response object to stream to
 */
const generateInvoice = (booking, res) => {
  const doc = new PDFDocument({ margin: 50 });

  // Stream directly to the response
  doc.pipe(res);

  // --- Header ---
  doc
    .fillColor("#444444")
    .fontSize(20)
    .text("HomeServiceHub", 50, 50)
    .fontSize(10)
    .text("Service At Your Doorstep", 50, 75)
    .text("123 Business Road, Suite 456", 50, 90)
    .text("New Delhi, India, 110001", 50, 105)
    .moveDown();

  // --- Invoice Info ---
  doc
    .fillColor("#444444")
    .fontSize(20)
    .text("INVOICE", 50, 160);

  generateHr(doc, 185);

  const customerInformationTop = 200;

  doc
    .fontSize(10)
    .text("Invoice Number:", 50, customerInformationTop)
    .font("Helvetica-Bold")
    .text(booking.invoiceId || `#${booking._id.toString().slice(-8).toUpperCase()}`, 150, customerInformationTop)
    .font("Helvetica")
    .text("Invoice Date:", 50, customerInformationTop + 15)
    .text(new Date().toLocaleDateString(), 150, customerInformationTop + 15)
    .text("Balance Due:", 50, customerInformationTop + 30)
    .text(`INR ${booking.totalAmount.toFixed(2)}`, 150, customerInformationTop + 30)

    .font("Helvetica-Bold")
    .text(booking.user.name, 300, customerInformationTop)
    .font("Helvetica")
    .text(booking.user.email, 300, customerInformationTop + 15)
    .text(booking.address.city || "Address Not Provided", 300, customerInformationTop + 30)
    .moveDown();

  generateHr(doc, 252);

  // --- Items Table ---
  let i;
  const invoiceTableTop = 330;

  doc.font("Helvetica-Bold");
  generateTableRow(
    doc,
    invoiceTableTop,
    "Item",
    "Description",
    "Quantity",
    "Line Total"
  );
  generateHr(doc, invoiceTableTop + 20);
  doc.font("Helvetica");

  generateTableRow(
    doc,
    invoiceTableTop + 30,
    booking.service.title,
    `Service ID: ${booking.service._id.toString().slice(-8)}`,
    "1",
    `INR ${booking.totalAmount.toFixed(2)}`
  );

  generateHr(doc, invoiceTableTop + 56);

  // --- Totals ---
  const subtotalPosition = invoiceTableTop + 70;
  generateTableRow(
    doc,
    subtotalPosition,
    "",
    "",
    "Subtotal",
    `INR ${booking.totalAmount.toFixed(2)}`
  );

  const paidToDatePosition = subtotalPosition + 20;
  generateTableRow(
    doc,
    paidToDatePosition,
    "",
    "",
    "Paid to Date",
    `INR ${booking.paymentStatus === "completed" ? booking.totalAmount.toFixed(2) : "0.00"}`
  );

  const duePosition = paidToDatePosition + 25;
  doc.font("Helvetica-Bold");
  generateTableRow(
    doc,
    duePosition,
    "",
    "",
    "Balance Due",
    `INR ${booking.paymentStatus === "completed" ? "0.00" : booking.totalAmount.toFixed(2)}`
  );
  doc.font("Helvetica");

  // --- Footer ---
  doc
    .fontSize(10)
    .text(
      "Payment is due within 15 days. Thank you for your business.",
      50,
      700,
      { align: "center", width: 500 }
    );

  doc.end();
};

function generateHr(doc, y) {
  doc
    .strokeColor("#aaaaaa")
    .lineWidth(1)
    .moveTo(50, y)
    .lineTo(550, y)
    .stroke();
}

function generateTableRow(doc, y, item, description, quantity, lineTotal) {
  doc
    .fontSize(10)
    .text(item, 50, y)
    .text(description, 150, y)
    .text(quantity, 280, y, { width: 90, align: "right" })
    .text(lineTotal, 370, y, { width: 90, align: "right" });
}

export default generateInvoice;
