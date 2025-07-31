import React, { useEffect, useState } from 'react';
import axios from 'axios';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { jwtDecode } from "jwt-decode";
import { useNavigate } from 'react-router-dom';
import { ClipLoader } from 'react-spinners';


const BASE_URL = 'https://bluesip-backend.onrender.com';

const Invoice = () => {
  const [invoices, setInvoices] = useState([]);
  const [editInvoice, setEditInvoice] = useState(null);
  const [editNotes, setEditNotes] = useState('');
  const [lastDownloadedInvoiceNo, setLastDownloadedInvoiceNo] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [dateFilter, setDateFilter] = useState('');
  const [openMenuId, setOpenMenuId] = useState(null);
  const [historyData, setHistoryData] = useState([]);
  const [showHistoryPopup, setShowHistoryPopup] = useState(false);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  // Authentication and initial data loading
  useEffect(() => {
    const checkAuthAndFetchData = async () => {
      const token = localStorage.getItem("token");
      
      if (!token) {
        navigate("/login");
        return;
      }

      try {
        const decoded = jwtDecode(token);
        const response = await axios.get(`${BASE_URL}/api/users/${decoded.id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        if (response.data) {
          setUser(response.data);
          await fetchInvoices(token);
        } else {
          localStorage.removeItem("token");
          navigate("/login");
        }
      } catch (error) {
        console.error("Authentication error:", error);
        localStorage.removeItem("token");
        navigate("/login");
      }
    };

    checkAuthAndFetchData();
  }, [navigate]);

  // const fetchInvoices = async (token) => {
  //   setLoading(true);
  //   try {
  //     const res = await axios.get(`${BASE_URL}/api/invoices`, {
  //       headers: { Authorization: `Bearer ${token}` }
  //     });
  //     setInvoices(res.data);
  //   } catch (error) {
  //     console.error("Error fetching invoices:", error);
  //     toast.error("Failed to fetch invoices");
  //   } finally {
  //     setLoading(false);
  //   }
  // };

const fetchInvoices = async (token) => {
  setLoading(true);
  try {
    const res = await axios.get(`${BASE_URL}/api/invoices`, {
      headers: { Authorization: `Bearer ${token}` }
    });

    const sortedInvoices = res.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    setInvoices(sortedInvoices);
  } catch (error) {
    console.error("Error fetching invoices:", error);
    toast.error("Failed to fetch invoices");
  } finally {
    setLoading(false);
  }
};

  
  // Invoice History Functions
  const handleHistory = async (invoiceNo) => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(`${BASE_URL}/api/invoice-history/${invoiceNo}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setHistoryData(res.data);
      setShowHistoryPopup(true);
      setOpenMenuId(null);
    } catch (error) {
      console.error("Error fetching history:", error);
      toast.error("Failed to fetch invoice history");
    }
  };

  // Invoice CRUD Operations
  const deleteInvoice = async (id) => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`${BASE_URL}/api/invoices/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setInvoices(prev => prev.filter(inv => inv._id !== id));
      toast.success("Invoice deleted successfully!");
    } catch (error) {
      console.error("Error deleting invoice:", error);
      if (error.response?.status === 401) {
        localStorage.removeItem("token");
        navigate("/login");
      } else {
        toast.error("Failed to delete invoice");
      }
    }
  };

  const handleEditClick = (invoice) => {
    setEditInvoice(invoice);
    setEditNotes(invoice.notes || '');
  };

  const handleSaveEdit = async () => {
    if (!editInvoice) return;

    try {
      const token = localStorage.getItem("token");
      const updates = {
        invoiceStatus: editInvoice.invoiceStatus,
        paymentDate: editInvoice.invoiceStatus === 'paid' ? new Date() : null,
        notes: editNotes,
        updatedBy: user._id // Track who made the update
      };

      const res = await axios.put(
        `${BASE_URL}/api/invoices/${editInvoice._id}`,
        updates,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setInvoices(prev => prev.map(inv => (inv._id === editInvoice._id ? res.data : inv)));
      setEditInvoice(null);
      toast.success("Invoice updated successfully!");
    } catch (error) {
      console.error("Error updating invoice:", error);
      if (error.response?.status === 401) {
        localStorage.removeItem("token");
        navigate("/login");
      } else {
        toast.error("Failed to update invoice");
      }
    }
  };

  // PDF Generation
  const downloadPDF = async (invoiceData) => {
  try {
    if (lastDownloadedInvoiceNo === invoiceData.invoiceNo) {
      toast.warning("This invoice has already been downloaded!");
      return;
    }

    // Update last downloaded invoice number
    setLastDownloadedInvoiceNo(invoiceData.invoiceNo);

    const formattedInvoice = {
      ...invoiceData,
      items: invoiceData.items.map(item => ({
        ...item,
        rate: parseFloat(item.rate) || 0,
        quantity: parseFloat(item.quantity) || 0,
        amount: parseFloat(item.amount) || 0
      })),
      taxableValue: parseFloat(invoiceData.taxableValue) || 0,
      grandTotal: parseFloat(invoiceData.grandTotal) || 0,
      // Ensure buyer object exists with default values
      buyer: {
        name: invoiceData.buyer?.name || 'N/A',
        state: invoiceData.buyer?.state || 'N/A',
        ...invoiceData.buyer
      }
    };
  
    const tempDiv = document.createElement('div');
    tempDiv.style.width = '210mm';
    tempDiv.style.padding = '10px';
    tempDiv.style.background = '#ffffff';
    tempDiv.style.fontFamily = 'Arial, sans-serif';
    tempDiv.style.color = '#000000';
    
    tempDiv.innerHTML = `
      <!-- Main Border Wrapper -->
      <div style="border: 1px solid #000; font-family: sans-serif; font-size: 12px; padding: 0;">

        <!-- Title -->
        <div style="display:flex;justify-content:space-between;align-item:center;padding: 10px ; border-bottom: 1px solid #000;">
          <div style ="font-weight:bold; font-size:16px;">
          <p>Status: ${formattedInvoice.invoiceStatus?.toUpperCase() || 'N/A'}</p>
          </div>
          <div style ="font-weight:bold; font-size:16px;" >
             BILL OF SUPPLY
          </div>
        </div>
        

        <!-- Seller/Buyer + Invoice Details -->
        <div style="display: flex; width: 100%; box-sizing: border-box;">

          <!-- Seller + Buyer -->
          <div style="width: 45%; border-right: 1px solid #000; ">
            <!-- Seller -->
            <div style="margin-bottom: 10px; margin-top: 5px; border-bottom: 1px solid #000; padding: 5px 10px;">
              <p><strong>${formattedInvoice.sellerName || 'N/A'}</strong></p>
              <p>${formattedInvoice.sellerAddress || 'N/A'}</p>
              <p>(Composition Dealer)</p>
              <p>GSTIN: ${formattedInvoice.sellerGSTIN || 'N/A'}</p>
              <p>State: ${formattedInvoice.sellerState || 'N/A'}</p>
            </div>

            <!-- Buyer -->
            <div style="padding: 5px 10px;">
              <p><strong>Buyer(Bill To)</strong><br>${formattedInvoice.buyer.name}</p>
              <p>State: ${formattedInvoice.buyer.state}</p>
            </div>
          </div>

          <!-- Invoice Details -->
          <div style="width: 55%; box-sizing: border-box;">
            <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
              <tr>
                <td style="border: 1px solid #000; border-top:none; border-left:none; padding: 5px;"><strong>Invoice No.</strong>: ${formattedInvoice.invoiceNo || 'N/A'}</td>
                <td style="border: 1px solid #000; border-top:none; border-left:none;border-right:none;padding: 5px;"><strong>Dated</strong>: ${(new Date())}</td>
              </tr>
              <tr>
                <td style="border: 1px solid #000; border-top:none; border-left:none; padding: 5px;"><strong>Delivery Note</strong>: ${formattedInvoice.deliveryNote || 'N/A'}</td>
                <td style="border: 1px solid #000; border-top:none; border-left:none;border-right:none; padding: 5px;"><strong>Mode/Terms of Payment</strong>: ${formattedInvoice.paymentTerms || 'N/A'}</td>
              </tr>
              <tr>
                <td style="border: 1px solid #000; border-top:none; border-left:none; padding: 5px;"><strong>Dispatch Doc No</strong>: ${formattedInvoice.dispatchDocNo || 'N/A'}</td>
                <td style="border: 1px solid #000; border-top:none; border-left:none; border-right:none; padding: 5px;"><strong>Delivery Note Date</strong>: ${(formattedInvoice.deliveryNoteDate || 'N/A')}</td>
              </tr>
              <tr>
                <td style="border: 1px solid #000; border-top:none; border-left:none; padding: 5px;"><strong>Dispatched Through</strong>: ${formattedInvoice.dispatchedThrough || 'N/A'}</td>
                <td style="border: 1px solid #000; border-top:none; border-left:none;border-right:none; padding: 5px;"><strong>Destination</strong>: ${formattedInvoice.destination || 'N/A'}</td>
              </tr>
              <tr>
                <td colspan="2" style="padding: 10px;"><strong>Terms of Delivery</strong>: ${formattedInvoice.termsOfDelivery || 'N/A'}</td>
              </tr>
            </table>
          </div>
        </div>

        <!-- Invoice Items Table -->
        <table style="width: 100%; border-collapse: collapse; border-top: none; font-size: 12px;">
          <thead>
            <tr style="border-top: 1px solid #000; border-bottom: 1px solid #000;">
              <th style="padding: 8px; border-right: 1px solid #000;">S.No</th>
              <th style="padding: 8px; border-right: 1px solid #000;">Description of Goods</th>
              <th style="padding: 8px; border-right: 1px solid #000;">HSN</th>
              <th style="padding: 8px; border-right: 1px solid #000;">Quantity</th>
              <th style="padding: 8px; border-right: 1px solid #000;">Rate</th>
              <th style="padding: 8px; border-right: 1px solid #000;">Per</th>
              <th style="padding: 8px;">Amount</th>
            </tr>
          </thead>
          <tbody>
            ${formattedInvoice.items.map(item => `
              <tr>
                <td style="padding: 5px; text-align: center; border-right:1px solid #000;">${item.srNo || ''}</td>
                <td style="padding: 5px; border-right:1px solid #000;">${item.description || ''}</td>
                <td style="padding: 5px; text-align: center; border-right:1px solid #000;">${item.hsnCode || ''}</td>
                <td style="padding: 5px; text-align: center; border-right:1px solid #000;">${item.quantity || 0} Case</td>
                <td style="padding: 5px; text-align: center;border-right:1px solid #000;">${Number(item.rate || 0).toFixed(2)}</td>
                <td style="padding: 5px; text-align: center;border-right:1px solid #000;">Case</td>
                <td style="padding: 5px; text-align: right;">${Number(item.amount || 0).toFixed(2)}</td>
              </tr>
            `).join('')}

            <!-- Spacer Row WITH Borders -->
            <tr style="height: 150px;">
              <td style="border-right:1px solid #000;"></td>
              <td style="border-right:1px solid #000;"></td>
              <td style="border-right:1px solid #000;"></td>
              <td style="border-right:1px solid #000;"></td>
              <td style="border-right:1px solid #000;"></td>
              <td style="border-right:1px solid #000;"></td>
              <td style="border-right:1px solid #000;border-right:none;"></td>
            </tr>

            <!-- Total Row -->
            <tr style="font-weight: bold;">
              <td style="padding: 8px; border: 1px solid #000;border-left:none;"></td>
              <td style="padding: 8px; text-align: right; border: 1px solid #000;border-left:none;">Total</td>
              <td style="padding: 8px; border: 1px solid #000;border-left:none;"></td>
              <td style="padding: 8px; text-align: center; border: 1px solid #000;border-left:none;">
                ${formattedInvoice.items.reduce((sum, item) => sum + (item.quantity || 0), 0)} Case
              </td>
              <td style="padding: 8px; border: 1px solid #000;border-left:none;"></td>
              <td style="padding: 8px; border: 1px solid #000;border-left:none;"></td>
              <td style="padding: 8px; text-align: right; border: 1px solid #000; border-left:none;border-right:none">₹${(formattedInvoice.grandTotal || 0).toFixed(2)}</td>
            </tr>
          </tbody>
        </table>

        <!-- Bottom Margin After Item Rows -->
        <div style="margin-bottom: 15px;"></div>

        <!-- Total and Amount (LEFT side with increased font) -->
        <div style="display:flex; justify-content:space-between; align-item:center">
          <div style="padding-left: 15px; font-size: 13px; margin-top:-10px; margin-bottom:5px;">
            <p><strong>Amount Chargable(in Words):</strong> <br/>${formattedInvoice.amountInWords || ''}</p>
          </div>
          <div style="padding-right: 15px; font-size: 13px;">
            <p>E. & O.E</p>
          </div>
        </div>

        <!-- Declaration + Signature Row -->
        <div style="display: flex; border-top: 1px solid #000; border-bottom: 1px solid #000; font-size: 12px; height:100px; border-bottom:none;">
          <!-- Declaration -->
          <div style="flex: 2; padding: 10px; border-right: 1px solid #000;">
            <p><strong>Declaration:</strong></p>
            <p>We declare that this invoice shows the actual price of the goods described and that all particulars are true and correct.</p>
          </div>

          <!-- Authorized Signatory -->
          <div style="flex: 1; padding: 10px; text-align: center;">
            <p><strong>Authorised Signatory</strong></p>
            <p>${formattedInvoice.sellerName || 'N/A'}</p>
          </div>
        </div>
      </div>

      <!-- Footer -->
      <div style="text-align:center; font-size:10px; font-weight:bold; padding: 15px 0;">
        This is a Computer Generated Invoice.
      </div>
    `;

    document.body.appendChild(tempDiv);
    
    const canvas = await html2canvas(tempDiv, { 
      scale: 2,
      logging: true,
      useCORS: true,
      backgroundColor: '#ffffff'
    });
    
    const imgData = canvas.toDataURL('image/png', 1.0);
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });
    
    const imgWidth = 210;
    const pageHeight = 297;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    
    pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
    
    document.body.removeChild(tempDiv);
    
    pdf.save(`Invoice-${formattedInvoice.invoiceNo || 'unknown'}.pdf`);
    toast.success("Invoice downloaded and saved successfully!");
  } catch (error) {
    console.error("Error generating PDF:", error);
    toast.error("Failed to generate PDF");
  }
};

  // Filtering and Utility Functions
  const filteredInvoices = invoices.filter(inv => {
    const matchesSearch = inv.invoiceNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inv.buyer?.name?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter ? inv.invoiceStatus === statusFilter : true;
    const matchesDate = dateFilter ? new Date(inv.createdAt).toDateString() === new Date(dateFilter).toDateString() : true;
    return matchesSearch && matchesStatus && matchesDate;
  });

  const formatHistoryDate = (dateString) => {
    return new Date(dateString).toLocaleString();
  };

  // Render
  return (
    <div className="invoice-containerBox">
      <h2>All Invoices</h2>

      {/* Filter Controls */}
      <div className="filter-controls">
        <input
          type="text"
          placeholder="Search invoices..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <select 
          value={statusFilter} 
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="">All Statuses</option>
          <option value="pending">Pending</option>
          <option value="partial">Partial</option>
          <option value="paid">Paid</option>
        </select>
        <input
          type="date"
          value={dateFilter}
          onChange={(e) => setDateFilter(e.target.value)}
        />
      </div>
  {loading && (
       <div className="spinner-container">
      <div className="loading-spinner"></div>
    </div>
      )}

    
    {/* Invoice Grid */}
      {!loading && (
      <div className="invoice-grid">
        {filteredInvoices.map(inv => (
          <div className="invoice-card" key={inv._id}>
            <div className="card-header">
              <strong>{inv.invoiceNo}</strong>
              <span className={`status-badge ${inv.invoiceStatus}`}>
                {inv.invoiceStatus.toUpperCase()}
              </span>
              <div className="card-menu">
                <button onClick={() => setOpenMenuId(openMenuId === inv._id ? null : inv._id)}>
                  ⋮
                </button>
                {openMenuId === inv._id && (
                  <div className="menu-dropdown">
                    <button onClick={() => handleEditClick(inv)}>Edit</button>
                  
                  { inv.invoiceStatus=='paid' ? <button onClick={() => downloadPDF(inv)}>Download</button>:""}
                    <button onClick={() => handleHistory(inv.invoiceNo)}>View History</button>
                    <button className="delete-btn" onClick={() => deleteInvoice(inv._id)}>
                      Delete
                    </button>
                  </div>
                )}
              </div>
            </div>
            <div className="card-body">
              <p><b>Buyer:</b> {inv.buyer?.name || 'N/A'}</p>
              <p><b>Amount:</b> ₹{inv.grandTotal?.toFixed(2) || '0.00'}</p>
              <p><b>Date:</b> {new Date(inv.createdAt).toLocaleDateString()}</p>
            </div>
          </div>
        ))}
      </div>)}
      

      {/* Edit Invoice Popup */}
      {editInvoice && (
        <div className="popup-overlay">
          <div className="popup">
            <h3>Edit Invoice: {editInvoice.invoiceNo}</h3>
            <div className="form-group">
              <label>Status:</label>
              <select
                value={editInvoice.invoiceStatus}
                onChange={(e) => setEditInvoice({ ...editInvoice, invoiceStatus: e.target.value })}
              >
                <option value="pending">Pending</option>
                <option value="partial">Partial</option>
                <option value="paid">Paid</option>
              </select>
            </div>
            <div className="form-group">
              <label>Notes:</label>
              <textarea
                value={editNotes}
                onChange={(e) => setEditNotes(e.target.value)}
                rows="4"
              />
            </div>
            <div className="popup-btns">
              <button className="save-btn" onClick={handleSaveEdit}>Save Changes</button>
              <button className="cancel-btn" onClick={() => setEditInvoice(null)}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* History Popup */}
      {showHistoryPopup && (
        <div className="popup-overlay">
          <div className="popup history-popup">
            <div className="popup-header">
              <h3>Invoice History - {historyData[0]?.invoiceNo}</h3>
              <button onClick={() => setShowHistoryPopup(false)}>×</button>
            </div>
            
            {historyData.length > 0 ? (
              <div className="history-table-container">
                <table className="history-table">
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>Action</th>
                      <th>User</th>
                      <th>Changes</th>
                      <th>Notes</th>
                    </tr>
                  </thead>
                  <tbody>
                    {historyData.map((history, index) => (
                      <tr key={index}>
                        <td>{formatHistoryDate(history.timestamp)}</td>
                        <td className="capitalize">{history.action.replace('_', ' ')}</td>
                        <td>
                          <div className="user-info">
                            <div>{history.user?.name || 'System'}</div>
                            {history.user?.email && (
                              <div className="user-email">{history.user.email}</div>
                            )}
                          </div>
                        </td>
                        <td>
                          {history.changes && Object.entries(history.changes).map(([field, change]) => (
                            <div key={field} className="change-item">
                              <span className="change-field">{field}:</span>
                              <span className="change-from">{change.from || 'N/A'}</span>
                              <span>→</span>
                              <span className="change-to">{change.to || 'N/A'}</span>
                            </div>
                          ))}
                        </td>
                        <td>{history.notes || 'N/A'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="no-history">No history available for this invoice</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Invoice;