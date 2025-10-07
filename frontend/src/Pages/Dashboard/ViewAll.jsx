import { useEffect, useState } from "react";
import Navbar from "../../Component/Navbar/Navbar";

const ViewAll = () => {
  const [invoices, setInvoices] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Get user from localStorage
  const user = JSON.parse(localStorage.getItem("user")); 
  // assuming you saved it like: localStorage.setItem("user", JSON.stringify(userData))

  const fetchInvoices = async (pageNum = 1) => {
    try {
      const res = await fetch(
        `http://localhost:3000/api/admin/invoice/view-all?page=${pageNum}&limit=5`,
        {
          method: "GET",
          credentials: "include", // sends JWT cookie
          headers: { "Content-Type": "application/json" },
        }
      );

      const data = await res.json();

      if (res.ok) {
        setInvoices(data.invoices);
        setPage(data.page);
        setTotalPages(data.totalPages);
      } else {
        console.error(data.message);
      }
    } catch (error) {
      console.error("Error fetching invoices:", error);
    }
  };

  useEffect(() => {
    fetchInvoices(page);
  }, [page]);

  return (
    <div className="p-6">
      <Navbar />
      <h2 className="text-xl font-bold mb-4">
        {user?.role === "Admin" ? "All Invoices" : "My Invoices"}
      </h2>

      {invoices.length === 0 ? (
        <p>No invoices found.</p>
      ) : (
        <ul className="space-y-2">
          {invoices.map((invoice) => (
            <li
              key={invoice._id}
              className="p-4 border rounded-lg shadow-sm bg-white"
            >
              <p><strong>ID:</strong> {invoice._id}</p>
              <p><strong>Status:</strong> {invoice.status}</p>
              <p><strong>Issued:</strong> {new Date(invoice.issueDate).toLocaleDateString()}</p>
              <p><strong>Due:</strong> {new Date(invoice.dueDate).toLocaleDateString()}</p>

              {/* Optional: Show who created it (for Admins only) */}
              {user?.role === "Admin" && (
                <p><strong>Client:</strong> {invoice.clientId}</p>
              )}
            </li>
          ))}
        </ul>
      )}

      {/* Pagination */}
      <div className="flex items-center gap-4 mt-6">
        <button
          className="px-4 py-2 border rounded disabled:opacity-50"
          disabled={page === 1}
          onClick={() => fetchInvoices(page - 1)}
        >
          Prev
        </button>
        <span>
          Page {page} of {totalPages}
        </span>
        <button
          className="px-4 py-2 border rounded disabled:opacity-50"
          disabled={page === totalPages}
          onClick={() => fetchInvoices(page + 1)}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default ViewAll;