import { useState } from "react";
import axios from "axios";
import Navbar from "../../Component/Navbar/Navbar";
import { toast } from "react-toastify";

const Invoice = () => {
  const [formData, setFormData] = useState({
    issueDate: "",
    dueDate: "",
    freelancerName: "",
    clientEmail: "",
    status: "Pending",
    services: [{ description: "", amount: "" }],
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleServiceChange = (index, e) => {
    const newServices = [...formData.services];
    newServices[index][e.target.name] = e.target.value;
    setFormData({ ...formData, services: newServices });
  };

  const addService = () => {
    setFormData({
      ...formData,
      services: [...formData.services, { description: "", amount: "" }],
    });
  };

  const removeService = (index) => {
    const newServices = [...formData.services];
    newServices.splice(index, 1);
    setFormData({ ...formData, services: newServices });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        "http://localhost:3000/api/admin/invoice/create",
        formData,
        { withCredentials: true }
      );
      toast.success("Invoice created successfully!");
      console.log(res.data);

      setFormData({
        issueDate: "",
        dueDate: "",
        freelancerName: "",
        clientEmail: "",
        status: "Pending",
        services: [{ description: "", amount: "" }],
      });
    } catch (err) {
      toast.error(err.response?.data?.message || "Error creating invoice");
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <Navbar />
      <h2 className="text-2xl font-semibold mt-4 mb-6">Create Invoice</h2>

      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-lg rounded-xl p-6 space-y-4"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Freelancer Name</label>
            <input
              type="text"
              name="freelancerName"
              value={formData.freelancerName}
              onChange={handleChange}
              className="w-full border rounded-lg px-3 py-2"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Client Email</label>
            <input
              type="email"
              name="clientEmail"
              value={formData.clientEmail}
              onChange={handleChange}
              className="w-full border rounded-lg px-3 py-2"
              placeholder="Enter client email"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Issue Date</label>
            <input
              type="date"
              name="issueDate"
              value={formData.issueDate}
              onChange={handleChange}
              className="w-full border rounded-lg px-3 py-2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Due Date</label>
            <input
              type="date"
              name="dueDate"
              value={formData.dueDate}
              onChange={handleChange}
              className="w-full border rounded-lg px-3 py-2"
              required
            />
          </div>
        </div>

        {/* Services Section */}
        <div>
          <label className="block text-sm font-medium mb-2">Services</label>
          {formData.services.map((service, index) => (
            <div key={index} className="flex gap-2 mb-2">
              <input
                type="text"
                name="description"
                placeholder="Description"
                value={service.description}
                onChange={(e) => handleServiceChange(index, e)}
                className="flex-1 border rounded-lg px-3 py-2"
                required
              />
              <input
                type="number"
                name="amount"
                placeholder="Amount"
                value={service.amount}
                onChange={(e) => handleServiceChange(index, e)}
                className="w-32 border rounded-lg px-3 py-2"
                required
              />
              {index > 0 && (
                <button
                  type="button"
                  onClick={() => removeService(index)}
                  className="px-3 py-1 bg-red-500 text-white rounded-lg"
                >
                  ✕
                </button>
              )}
            </div>
          ))}
          <button
            type="button"
            onClick={addService}
            className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-lg"
          >
            + Add Service
          </button>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Status</label>
          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="w-full border rounded-lg px-3 py-2"
          >
            <option value="Pending">Pending</option>
            <option value="Paid">Paid</option>
            <option value="Overdue">Overdue</option>
          </select>
        </div>

        <button
          type="submit"
          className="w-full bg-green-600 text-white py-2 rounded-lg font-semibold hover:bg-green-700"
        >
          Create Invoice
        </button>
      </form>
    </div>
  );
};

export default Invoice;