const mongoose = require("mongoose");

const invoiceSchema = new mongoose.Schema({
  invoiceNumber: { type: String, required: true, unique: true },
  issueDate: { type: Date, default: Date.now },
  dueDate: { type: Date, required: true },

  freelancerName: { type: String, required: true },

  clientId: {type: mongoose.Schema.Types.ObjectId, ref: "users", required: true},
  clientName: { type: String, required: true },
  clientEmail: {type: String, required: true},

  services: [
    {
      description: { type: String, required: true },
      amount: { type: Number, required: true }
    }
  ],

  totalAmount: { type: Number, required: true },
  status: { type: String, enum: ["Pending", "Paid", "Overdue"], default: "Pending" },
  createdBy: {type: mongoose.Schema.Types.ObjectId, ref: "users", required: true}

}, { timestamps: true });

const invoiceModel = mongoose.model("Invoice", invoiceSchema);

module.exports = invoiceModel;