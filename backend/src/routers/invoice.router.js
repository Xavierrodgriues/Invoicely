const express = require("express");
const { createInvoice, updateInvoice, deleteInvoice, getSingleInvoice, getAllInvoice } = require("../controllers/invoice.controller");
const { authMiddleware, authorizeRoles } = require("../middleware/auth.middleware");
const router = express.Router();


router.post("/create",authMiddleware, authorizeRoles("Admin"), createInvoice);
router.patch("/update/:id",authMiddleware, authorizeRoles("Admin"), updateInvoice);
router.delete("/delete/:id",authMiddleware, authorizeRoles("Admin"), deleteInvoice);
router.get("/view/:id",authMiddleware, getSingleInvoice);
router.get("/view-all",authMiddleware, getAllInvoice);

module.exports = router;