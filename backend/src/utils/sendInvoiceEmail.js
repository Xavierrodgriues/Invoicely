const nodemailer = require("nodemailer");
const PDFDocument = require("pdfkit");
const { PassThrough } = require("stream");

// Function to generate PDF buffer
const generateInvoicePDF = (invoice) => {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument();
    const stream = new PassThrough();
    const chunks = [];

    doc.pipe(stream);

    // Invoice Header
    doc.fontSize(20).text("Invoice", { align: "center" });
    doc.moveDown();

    // Invoice Info
    doc.fontSize(12).text(`Invoice Number: ${invoice.invoiceNumber}`);
    doc.text(`Issue Date: ${new Date(invoice.issueDate).toLocaleDateString()}`);
    doc.text(`Due Date: ${new Date(invoice.dueDate).toLocaleDateString()}`);
    doc.moveDown();

    // Client Info
    doc.text(`Bill To: ${invoice.clientName}`);
    doc.text(`Email: ${invoice.clientEmail}`);
    doc.moveDown();

    // Services Table
    doc.text("Services:", { underline: true });
    invoice.services.forEach((s, i) => {
      doc.text(`${i + 1}. ${s.description} - ₹${s.amount}`);
    });
    doc.moveDown();

    // Total
    doc.fontSize(14).text(`Total Amount: ₹${invoice.totalAmount}`, { align: "right" });
    doc.moveDown();

    // Status
    doc.text(`Status: ${invoice.status}`);

    doc.end();

    stream.on("data", (chunk) => chunks.push(chunk));
    stream.on("end", () => resolve(Buffer.concat(chunks)));
    stream.on("error", reject);
  });
};

// Function to send email
module.exports.sendInvoiceEmail = async (invoice) => {
  try {
    const pdfBuffer = await generateInvoicePDF(invoice);

    // Configure Gmail transporter
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER, // your Gmail
        pass: process.env.EMAIL_PASS, // app password, not your real Gmail password
      },
    });

    await transporter.sendMail({
      from: `"Freelance Invoice" <${process.env.EMAIL_USER}>`,
      to: invoice.clientEmail,
      subject: `Invoice ${invoice.invoiceNumber}`,
      text: `Hello ${invoice.clientName},\n\nPlease find attached your invoice.\n\nThanks,\n${invoice.freelancerName}`,
      attachments: [
        {
          filename: `${invoice.invoiceNumber}.pdf`,
          content: pdfBuffer,
        },
      ],
    });

    console.log("Invoice email sent to", invoice.clientEmail);
  } catch (err) {
    console.error("Email sending failed:", err.message);
  }
};