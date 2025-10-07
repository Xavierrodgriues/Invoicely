const mongoose = require("mongoose");
const Invoice = require("../models/invoice.model");
const User = require("../models/users.model");
const { sendInvoiceEmail } = require("../utils/sendInvoiceEmail");

const createInvoice = async (req, res) => {
  try {
    const { issueDate, dueDate, freelancerName, clientEmail, services, status } = req.body;

    const client = await User.findOne({ email: clientEmail.toLowerCase() });
    if (!client) return res.status(404).json({ message: "Client not found" });

    const lastInvoice = await Invoice.findOne().sort({ createdAt: -1 });
    let invoiceNumber;
    if (!lastInvoice) {
      invoiceNumber = "INV-0001";
    } else {
      const lastNum = parseInt(lastInvoice.invoiceNumber.split("-")[1]);
      invoiceNumber = "INV-" + String(lastNum + 1).padStart(4, "0");
    }

    if (!freelancerName || !services || services.length === 0) {
      return res.status(400).json({ message: "Missing required fields or services" });
    }

    const totalAmount = services.reduce((sum, item) => Number(sum) + Number(item.amount), 0);

    const newInvoice = new Invoice({
      invoiceNumber,
      issueDate: issueDate || new Date(),
      dueDate,
      freelancerName,
      clientId: client._id,
      clientName: client.username,
      clientEmail: client.email,
      services,
      totalAmount,
      status: status || "Pending",
      createdBy: req.user.id,
    });

    await newInvoice.save();

    // 🔹 Send PDF via email
    await sendInvoiceEmail(newInvoice);

    res.status(201).json({
      message: "Invoice created successfully & sent via email",
      invoice: newInvoice,
    });
  } catch (error) {
    res.status(500).json({ message: error.message, error: error.message });
  }
};

const updateInvoice = async (req, res) => {
  try {
    const { id } = req.params; // invoice ID

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid invoice ID" });
    }
    
    const { dueDate, clientName, services, status } = req.body;
    // Find the invoice
    const invoice = await Invoice.findOne({_id: id, clientId: req.user.id});
    if (!invoice) {
      return res.status(404).json({ message: "Invoice not found" });
    }

    // Update fields if provided
    if (clientName) invoice.clientName = clientName;
    if (dueDate) invoice.dueDate = dueDate;
    if (status) invoice.status = status;
    if (services && services.length > 0) {
      invoice.services = services;
      // Recalculate totalAmount
      invoice.totalAmount = services.reduce(
        (sum, item) => sum + item.amount,
        0
      );
    }

    await invoice.save();

    res.status(200).json({
      message: "Invoice updated successfully",
      invoice,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const deleteInvoice = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid invoice ID" });
    }

    const invoice = await Invoice.findOneAndDelete({_id: id, createdBy: req.user.id});

    if (!invoice) {
      return res.status(400).json({ message: "Invoice not found" });
    }

    res.status(200).json({ message: "Invoice deleted successfully" }, invoice);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

const getSingleInvoice = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid invoice ID" });
    }

    const filter = req.user.role === "Admin"
      ? { _id: id, createdBy: req.user.id }  // Admin sees only their invoices
      : { _id: id, clientId: req.user.id }; // Client sees only their invoices

    const invoice = await Invoice.findOne(filter);

    if (!invoice) {
      return res.status(404).json({ message: "Invoice not found" });
    }

    res.status(200).json({ message: "Invoice fetched", invoice });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

const getAllInvoice = async (req, res) => {
    try {
        // Parse query params
        let { page = 1, limit = 10 } = req.query;

        // Convert to numbers
        page = parseInt(page);
        limit = parseInt(limit);

        // Validate page and limit
        if (isNaN(page) || page < 1) page = 1;
        if (isNaN(limit) || limit < 1 || limit > 100) limit = 10; // max 100 per page

        // Filter based on role
        const filter = req.user.role === "Admin"
            ? { createdBy: req.user.id }      // Admin sees only their invoices
            : { clientId: req.user.id }; // Client sees only their invoices

        const totalInvoices = await Invoice.countDocuments(filter);
        const totalPages = Math.ceil(totalInvoices / limit);

        const invoices = await Invoice.find(filter)
            .sort({ createdAt: -1 })        // latest first
            .skip((page - 1) * limit)
            .limit(limit);

        res.status(200).json({
            page,
            limit,
            totalInvoices,
            totalPages,
            invoices
        });
    } catch (err) {
        res.status(500).json({ message: "Server error", error: err.message });
    }
};

module.exports = {
  createInvoice,
  updateInvoice,
  deleteInvoice,
  getSingleInvoice,
  getAllInvoice
};
