// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import jsPDF from "jspdf";
// import html2canvas from "html2canvas";
// import { jwtDecode } from "jwt-decode";
// import { useNavigate } from "react-router-dom";
// import DatePicker from "react-datepicker";
// import "react-datepicker/dist/react-datepicker.css";
// import { 
//   FaSearch, FaCalendarAlt, FaDownload, 
//   FaFileInvoice, FaEdit, FaTrash, FaUser, 
//   FaMoneyBillWave, FaEllipsisV, FaFilePdf,
//   FaTimes, FaCheck, FaInfoCircle, FaRupeeSign,
//   FaHistory, FaFilter, FaPlus, FaSyncAlt
// } from "react-icons/fa";
// import { toast, ToastContainer } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';

// const InvoiceDashboard = () => {
//   const navigate = useNavigate();
//   const [user, setUser] = useState({
//     Id: "N/A",
//     Name: "N/A",
//     Email: "N/A"
//   });

//   const [invoices, setInvoices] = useState([]);
//   const [filteredInvoices, setFilteredInvoices] = useState([]);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [dateFilter, setDateFilter] = useState({
//     startDate: null,
//     endDate: null
//   });
//   const [loading, setLoading] = useState(true);
//   const [showEditModal, setShowEditModal] = useState(false);
//   const [currentInvoice, setCurrentInvoice] = useState(null);
//   const [editForm, setEditForm] = useState({
//     status: "pending",
//     paymentDate: "",
//     notes: ""
//   });
//   const [showHistoryModal, setShowHistoryModal] = useState(false);
//   const [invoiceHistory, setInvoiceHistory] = useState([]);
//   const [statusFilter, setStatusFilter] = useState("all");

//   // Status options for dropdowns
//   const statusOptions = [
//     { value: "pending", label: "Pending", color: "#EF4444" },
//     { value: "partial", label: "Partial", color: "#F59E0B" },
//     { value: "paid", label: "Paid", color: "#10B981" }
//   ];


// // Update all API calls to work without authentication:

// // Fetch invoices
// const fetchData = async () => {
//   try {
//     setLoading(true);
//     const response = await axios.get("https://bluesip-backend.onrender.com/api/invoices");
    
//     // Check if response.data exists and has data property
//     if (response.data && response.data.success && response.data.data) {
//       const sortedInvoices = Array.isArray(response.data.data) 
//         ? response.data.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
//         : [];
      
//       setInvoices(sortedInvoices);
//       setFilteredInvoices(sortedInvoices);
//     } else {
//       toast.error("No invoices found or invalid response format");
//       setInvoices([]);
//       setFilteredInvoices([]);
//     }
//   } catch (error) {
//     console.error("Error fetching data:", error);
//     toast.error("Failed to load invoices");
//     setInvoices([]);
//     setFilteredInvoices([]);
//   } finally {
//     setLoading(false);
//   }
// };
// // Create invoice
// const handleCreateInvoice = async (invoiceData) => {
//   try {
//     const response = await axios.post(
//       "https://bluesip-backend.onrender.com/api/invoices",
//       invoiceData
//     );
//     return response.data.data;
//   } catch (error) {
//     throw error;
//   }
// };

// // Update invoice
// const handleUpdateInvoice = async (invoiceId, updateData) => {
//   try {
//     const response = await axios.put(
//       `https://bluesip-backend.onrender.com/api/invoices/${invoiceId}`,
//       updateData
//     );
//     return response.data.data;
//   } catch (error) {
//     throw error;
//   }
// };

// // Delete invoice
// const handleDeleteInvoice = async (invoiceId) => {
//   try {
//     await axios.delete(`https://bluesip-backend.onrender.com/api/invoices/${invoiceId}`);
//     return true;
//   } catch (error) {
//     throw error;
//   }
// };

// // Get invoice history
// const getInvoiceHistory = async (invoiceId) => {
//   try {
//     const response = await axios.get(
//       `https://bluesip-backend.onrender.com/api/invoices/${invoiceId}/history`
//     );
//     return response.data.data;
//   } catch (error) {
//     throw error;
//   }
// };

// // Get last invoice number
// const getLastInvoiceNumber = async () => {
//   try {
//     const response = await axios.get(
//       "https://bluesip-backend.onrender.com/api/invoices/last/number"
//     );
//     return response.data.data;
//   } catch (error) {
//     throw error;
//   }
// };







//   useEffect(() => {
//     if (showEditModal || showHistoryModal) {
//       document.body.style.overflow = 'hidden';
//     } else {
//       document.body.style.overflow = 'unset';
//     }
//   }, [showEditModal, showHistoryModal]);

//   useEffect(() => {
//     fetchData();
//   }, []);

 

//   const handleSearch = (e) => {
//     const term = e.target.value.toLowerCase();
//     setSearchTerm(term);
//     applyFilters(term, dateFilter.startDate, dateFilter.endDate, statusFilter);
//   };

//   const handleDateFilter = (dates) => {
//     const [start, end] = dates;
//     setDateFilter({ startDate: start, endDate: end });
//     applyFilters(searchTerm, start, end, statusFilter);
//   };

//   const handleStatusFilter = (status) => {
//     setStatusFilter(status);
//     applyFilters(searchTerm, dateFilter.startDate, dateFilter.endDate, status);
//   };

//   const applyFilters = (term, startDate, endDate, status) => {
//     let filtered = [...invoices];
    
//     if (term) {
//       filtered = filtered.filter(inv => 
//         (inv.buyer?.name?.toLowerCase().includes(term) || 
//         inv.invoiceNo.toLowerCase().includes(term))
//       );
//     }
    
//     if (startDate && endDate) {
//       filtered = filtered.filter(inv => {
//         const invDate = new Date(inv.invoiceDate.split('-').reverse().join('-'));
//         return invDate >= startDate && invDate <= endDate;
//       });
//     } else if (startDate) {
//       filtered = filtered.filter(inv => {
//         const invDate = new Date(inv.invoiceDate.split('-').reverse().join('-'));
//         return invDate >= startDate;
//       });
//     }
    
//     if (status !== "all") {
//       filtered = filtered.filter(inv => inv.status === status);
//     }
    
//     setFilteredInvoices(filtered);
//   };

//   const resetFilters = () => {
//     setSearchTerm("");
//     setDateFilter({ startDate: null, endDate: null });
//     setStatusFilter("all");
//     setFilteredInvoices([...invoices]);
//     toast.info("Filters reset");
//   };

//   const openEditModal = (invoice) => {
//     setCurrentInvoice(invoice);
//     setEditForm({
//       status: invoice.status || "pending",
//       paymentDate: invoice.paymentDate || "",
//       notes: invoice.notes || ""
//     });
//     setShowEditModal(true);
//   };

//   const openHistoryModal = async (invoiceId) => {
//     try {
//       const token = localStorage.getItem("token");
//       const res = await axios.get(
//         `https://bluesip-backend.onrender.com/invoices/history/${invoiceId}`,
//         {
//           headers: { Authorization: `Bearer ${token}` },
//           timeout: 5000
//         }
//       );
      
//       if (res.data.success) {
//         setInvoiceHistory(res.data.data);
//         setShowHistoryModal(true);
//       } else {
//         throw new Error(res.data.message || "Failed to load history");
//       }
//     } catch (error) {
//       console.error("History Error:", error);
//       toast.error(
//         error.response?.data?.message || 
//         error.message || 
//         "Failed to load invoice history"
//       );
//     }
//   };

//   const handleEditChange = (e) => {
//     const { name, value } = e.target;
//     setEditForm(prev => ({
//       ...prev,
//       [name]: value
//     }));
//   };

 


//   const downloadPDF = async (invoiceData) => {
//     try {
//       const formattedInvoice = {
//         ...invoiceData,
//         items: invoiceData.items.map(item => ({
//           ...item,
//           rate: parseFloat(item.rate) || 0,
//           quantity: parseFloat(item.quantity) || 0,
//           amount: parseFloat(item.amount) || 0
//         })),
//         taxableValue: parseFloat(invoiceData.taxableValue) || 0,
//         grandTotal: parseFloat(invoiceData.grandTotal) || 0
//       };

//       const tempDiv = document.createElement('div');
//       tempDiv.style.width = '210mm';
//       tempDiv.style.padding = '10px';
//       tempDiv.style.background = '#ffffff';
//       tempDiv.style.fontFamily = 'Arial, sans-serif';
//       tempDiv.style.color = '#000000';
      
//       tempDiv.innerHTML = `
//         <!-- Main Border Wrapper -->
//         <div style="border: 1px solid #000; font-family: sans-serif; font-size: 12px; padding: 0; position: relative;">

//           <!-- Status Stamp -->
//           <div style="position: absolute; top: 50px; right: 50px; transform: rotate(-15deg); opacity: 0.5;">
//             <div style="border: 3px solid ${getStatusColor(formattedInvoice.status)}; 
//                         color: ${getStatusColor(formattedInvoice.status)}; 
//                         font-size: 32px; 
//                         font-weight: bold; 
//                         padding: 10px 20px; 
//                         border-radius: 5px;">
//               ${formattedInvoice.status.toUpperCase()}
//             </div>
//           </div>

//           <!-- Title -->
//           <div style="text-align:center; font-weight:bold; font-size:16px; padding: 10px 0; border-bottom: 1px solid #000;">
//             BILL OF SUPPLY
//           </div>

//           <!-- Seller/Buyer + Invoice Details -->
//           <div style="display: flex; width: 100%; box-sizing: border-box;">

//             <!-- Seller + Buyer -->
//             <div style="width: 45%; border-right: 1px solid #000; ">
//               <!-- Seller -->
//               <div style="margin-bottom: 10px; margin-top: 5px; border-bottom: 1px solid #000; padding: 5px 10px;">
//                 <p><strong>${formattedInvoice.sellerName}</strong></p>
//                 <p>${formattedInvoice.sellerAddress}</p>
//                 <p>(Composition Dealer)</p>
//                 <p>GSTIN: ${formattedInvoice.sellerGSTIN}</p>
//                 <p>State: ${formattedInvoice.sellerState}</p>
//               </div>

//               <!-- Buyer -->
//               <div style="padding: 5px 10px;">
//                 <p><strong>Buyer(Bill To)</strong><br>${formattedInvoice.buyer.name}</p>
//                 <p>State: ${formattedInvoice.buyer.state}</p>
//               </div>
//             </div>

//             <!-- Invoice Details -->
//             <div style="width: 55%; box-sizing: border-box;">
//               <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
//                 <tr>
//                   <td style="border: 1px solid #000; border-top:none; border-left:none; padding: 5px;"><strong>Invoice No.</strong>: ${formattedInvoice.invoiceNo}</td>
//                   <td style="border: 1px solid #000; border-top:none; border-left:none;border-right:none;padding: 5px;"><strong>Dated</strong>: ${formatDateForPDF(formattedInvoice.invoiceDate)}</td>
//                 </tr>
//                 <tr>
//                   <td style="border: 1px solid #000; border-top:none; border-left:none; padding: 5px;"><strong>Delivery Note</strong>: ${formattedInvoice.deliveryNote}</td>
//                   <td style="border: 1px solid #000; border-top:none; border-left:none;border-right:none; padding: 5px;"><strong>Mode/Terms of Payment</strong>: ${formattedInvoice.paymentTerms}</td>
//                 </tr>
//                 <tr>
//                   <td style="border: 1px solid #000; border-top:none; border-left:none; padding: 5px;"><strong>Dispatch Doc No</strong>: ${formattedInvoice.dispatchDocNo}</td>
//                   <td style="border: 1px solid #000; border-top:none; border-left:none; border-right:none; padding: 5px;"><strong>Delivery Note Date</strong>: ${formatDateForPDF(formattedInvoice.deliveryNoteDate)}</td>
//                 </tr>
//                 <tr>
//                   <td style="border: 1px solid #000; border-top:none; border-left:none; padding: 5px;"><strong>Dispatched Through</strong>: ${formattedInvoice.dispatchedThrough}</td>
//                   <td style="border: 1px solid #000; border-top:none; border-left:none;border-right:none; padding: 5px;"><strong>Destination</strong>: ${formattedInvoice.destination}</td>
//                 </tr>
//                 <tr>
//                   <td colspan="2" style="padding: 10px;"><strong>Terms of Delivery</strong>: ${formattedInvoice.termsOfDelivery}</td>
//                 </tr>
//               </table>
//             </div>
//           </div>

//           <!-- Invoice Items Table -->
//           <table style="width: 100%; border-collapse: collapse; border-top: none; font-size: 12px;">
//             <thead>
//               <tr style="border-top: 1px solid #000; border-bottom: 1px solid #000;">
//                 <th style="padding: 8px; border-right: 1px solid #000;">S.No</th>
//                 <th style="padding: 8px; border-right: 1px solid #000;">Description of Goods</th>
//                 <th style="padding: 8px; border-right: 1px solid #000;">HSN</th>
//                 <th style="padding: 8px; border-right: 1px solid #000;">Quantity</th>
//                 <th style="padding: 8px; border-right: 1px solid #000;">Rate</th>
//                 <th style="padding: 8px; border-right: 1px solid #000;">Per</th>
//                 <th style="padding: 8px;">Amount</th>
//               </tr>
//             </thead>
//             <tbody>
//               ${formattedInvoice.items.map(item => `
//                 <tr>
//                   <td style="padding: 5px; text-align: center; border-right:1px solid #000;">${item.srNo}</td>
//                   <td style="padding: 5px; border-right:1px solid #000;">${item.description}</td>
//                   <td style="padding: 5px; text-align: center; border-right:1px solid #000;">${item.hsnCode}</td>
//                   <td style="padding: 5px; text-align: center; border-right:1px solid #000;">${item.quantity} Case</td>
//                   <td style="padding: 5px; text-align: center;border-right:1px solid #000;">${Number(item.rate).toFixed(2)}</td>
//                   <td style="padding: 5px; text-align: center;border-right:1px solid #000;">Case</td>
//                   <td style="padding: 5px; text-align: right;">${Number(item.amount).toFixed(2)}</td>
//                 </tr>
//               `).join('')}

//               <!-- Spacer Row WITH Borders -->
//               <tr style="height: 150px;">
//                 <td style="border-right:1px solid #000;"></td>
//                 <td style="border-right:1px solid #000;"></td>
//                 <td style="border-right:1px solid #000;"></td>
//                 <td style="border-right:1px solid #000;"></td>
//                 <td style="border-right:1px solid #000;"></td>
//                 <td style="border-right:1px solid #000;"></td>
//                 <td style="border-right:1px solid #000;border-right:none;"></td>
//               </tr>

//               <!-- Total Row -->
//               <tr style="font-weight: bold;">
//                 <td style="padding: 8px; border: 1px solid #000;border-left:none;"></td>
//                 <td style="padding: 8px; text-align: right; border: 1px solid #000;border-left:none;">Total</td>
//                 <td style="padding: 8px; border: 1px solid #000;border-left:none;"></td>
//                 <td style="padding: 8px; text-align: center; border: 1px solid #000;border-left:none;">
//                   ${formattedInvoice.items.reduce((sum, item) => sum + item.quantity, 0)} Case
//                 </td>
//                 <td style="padding: 8px; border: 1px solid #000;border-left:none;"></td>
//                 <td style="padding: 8px; border: 1px solid #000;border-left:none;"></td>
//                 <td style="padding: 8px; text-align: right; border: 1px solid #000; border-left:none;border-right:none">₹${formattedInvoice.grandTotal.toFixed(2)}</td>
//               </tr>
//             </tbody>
//           </table>

//           <!-- Bottom Margin After Item Rows -->
//           <div style="margin-bottom: 15px;"></div>

//           <!-- Total and Amount (LEFT side with increased font) -->
//           <div style="display:flex; justify-content:space-between; align-item:center">
//             <div style="padding-left: 15px; font-size: 13px; margin-top:-10px; margin-bottom:5px;">
//               <p><strong>Amount Chargable(in Words):</strong> <br/>${formattedInvoice.amountInWords}</p>
//             </div>
//             <div style="padding-right: 15px; font-size: 13px;">
//               <p>E. & O.E</p>
//             </div>
//           </div>

//           <!-- Declaration + Signature Row -->
//           <div style="display: flex; border-top: 1px solid #000; border-bottom: 1px solid #000; font-size: 12px; height:100px; border-bottom:none;">
//             <!-- Declaration -->
//             <div style="flex: 2; padding: 10px; border-right: 1px solid #000;">
//               <p><strong>Declaration:</strong></p>
//               <p>We declare that this invoice shows the actual price of the goods described and that all particulars are true and correct.</p>
//             </div>

//             <!-- Authorized Signatory -->
//             <div style="flex: 1; padding: 10px; text-align: center;">
//               <p><strong>Authorised Signatory</strong></p>
//               <p>${formattedInvoice.sellerName}</p>
//             </div>
//           </div>
//         </div>

//         <!-- Footer -->
//         <div style="text-align:center; font-size:10px; font-weight:bold; padding: 15px 0;">
//           This is a Computer Generated Invoice.
//         </div>
//       `;

//       document.body.appendChild(tempDiv);
      
//       const canvas = await html2canvas(tempDiv, { 
//         scale: 2,
//         logging: true,
//         useCORS: true,
//         backgroundColor: '#ffffff'
//       });
      
//       const imgData = canvas.toDataURL('image/png', 1.0);
//       const pdf = new jsPDF({
//         orientation: 'portrait',
//         unit: 'mm',
//         format: 'a4'
//       });
      
//       const imgWidth = 210;
//       const pageHeight = 297;
//       const imgHeight = (canvas.height * imgWidth) / canvas.width;
      
//       pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
      
//       document.body.removeChild(tempDiv);
      
//       pdf.save(`Invoice-${formattedInvoice.invoiceNo}.pdf`);
//       toast.success("Invoice downloaded successfully!");
//     } catch (error) {
//       console.error("Error generating PDF:", error);
//       toast.error("Failed to generate PDF");
//     }
//   };

//   const formatDateForPDF = (dateString) => {
//     if (!dateString) return "N/A";
//     const [day, month, year] = dateString.split('-');
//     return `${day}/${month}/${year}`;
//   };

//   const formatDate = (dateString) => {
//     if (!dateString) return "N/A";
//     const [day, month, year] = dateString.split('-');
//     return new Date(`${year}-${month}-${day}`).toLocaleDateString('en-US', {
//       year: 'numeric',
//       month: 'short',
//       day: 'numeric'
//     });
//   };

//   const formatDateTime = (dateString) => {
//     if (!dateString) return "N/A";
//     const date = new Date(dateString);
//     return date.toLocaleString('en-US', {
//       year: 'numeric',
//       month: 'short',
//       day: 'numeric',
//       hour: '2-digit',
//       minute: '2-digit'
//     });
//   };

//   const getStatusColor = (status) => {
//     const foundStatus = statusOptions.find(opt => opt.value === status);
//     return foundStatus ? foundStatus.color : '#6B7280';
//   };

//   const getStatusLabel = (status) => {
//     const foundStatus = statusOptions.find(opt => opt.value === status);
//     return foundStatus ? foundStatus.label : 'N/A';
//   };

//   const getStatusCount = (status) => {
//     return invoices.filter(inv => inv.status === status).length;
//   };

//   const createNewInvoice = () => {
//     navigate("/invoices/new");
//   };

//   return (
//     <div className="invoice-dashboard">
//       <ToastContainer position="top-right" autoClose={3000} />

//       {/* Header Section */}
//       <div className="dashboard-header">
//         <div className="header-left">
//           <h1 className="dashboard-title">Invoice Management</h1>
//           <p className="dashboard-subtitle">Track and manage all your invoices</p>
//         </div>
//         <div className="header-actions">
//           <button 
//             className="btn btn-primary"
//             onClick={createNewInvoice}
//           >
//             <FaPlus /> New Invoice
//           </button>
//           <button 
//             className="btn btn-secondary"
//             onClick={fetchData}
//             disabled={loading}
//           >
//             <FaSyncAlt /> Refresh
//           </button>
//         </div>
//       </div>

//       {/* Filters Section */}
//       <div className="filters-container">
//         <div className="search-box">
//           <FaSearch className="search-icon" />
//           <input
//             type="text"
//             placeholder="Search by customer name or invoice number..."
//             value={searchTerm}
//             onChange={handleSearch}
//             className="search-input"
//           />
//         </div>

//         <div className="filter-group">
//           <label>Date Range</label>
//           <div className="date-filter">
//             <FaCalendarAlt className="calendar-icon" />
//             <DatePicker
//               selectsRange={true}
//               startDate={dateFilter.startDate}
//               endDate={dateFilter.endDate}
//               onChange={handleDateFilter}
//               placeholderText="Select date range"
//               dateFormat="dd/MM/yyyy"
//               isClearable={true}
//               className="date-picker-input"
//             />
//           </div>
//         </div>

//         <div className="filter-group">
//           <label>Status</label>
//           <div className="status-filter">
//             <select
//               value={statusFilter}
//               onChange={(e) => handleStatusFilter(e.target.value)}
//               className="status-select"
//             >
//               <option value="all">All Statuses</option>
//               {statusOptions.map(option => (
//                 <option key={option.value} value={option.value}>
//                   {option.label}
//                 </option>
//               ))}
//             </select>
//             <div className="select-arrow"></div>
//           </div>
//         </div>

//         <button 
//           className="btn btn-text" 
//           onClick={resetFilters}
//           disabled={loading}
//         >
//           Reset Filters
//         </button>
//       </div>

//       {/* Stats Cards */}
//       <div className="stats-container">
//         <div className="stat-card total">
//           <div className="stat-value">{invoices.length}</div>
//           <div className="stat-label">Total Invoices</div>
//         </div>
//         {statusOptions.map(option => (
//           <div 
//             key={option.value} 
//             className="stat-card" 
//             style={{ borderTopColor: option.color }}
//           >
//             <div className="stat-value">{getStatusCount(option.value)}</div>
//             <div className="stat-label">{option.label}</div>
//           </div>
//         ))}
//       </div>

//       {/* Main Content */}
//       <div className="invoices-section">
//         {loading ? (
//           <div className="loading-indicator">
//             <div className="spinner"></div>
//             <p>Loading invoices...</p>
//           </div>
//         ) : filteredInvoices.length === 0 ? (
//           <div className="empty-state">
//             <FaFileInvoice className="empty-icon" />
//             <h3>No invoices found</h3>
//             <p>Try adjusting your search or filters</p>
//             <button 
//               className="btn btn-primary" 
//               onClick={resetFilters}
//               disabled={loading}
//             >
//               Reset Filters
//             </button>
//           </div>
//         ) : (
//           <div className="invoices-table-container">
//             <table className="invoices-table">
//               <thead>
//                 <tr>
//                   <th>Invoice #</th>
//                   <th>Customer</th>
//                   <th>Date</th>
//                   <th>Amount</th>
//                   <th>Status</th>
//                   <th>Actions</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {filteredInvoices.map((inv) => (
//                   <tr key={inv._id}>
//                     <td className="invoice-number">#{inv.invoiceNo}</td>
//                     <td className="customer-name">
//                       <FaUser className="icon" />
//                       {inv.buyer?.name || "N/A"}
//                     </td>
//                     <td className="invoice-date">{formatDate(inv.invoiceDate)}</td>
//                     <td className="invoice-amount">
//                       <FaRupeeSign className="icon" />
//                       {inv.grandTotal?.toLocaleString('en-IN') || "0"}
//                     </td>
//                     <td className="invoice-status">
//                       <span 
//                         className="status-badge" 
//                         style={{ backgroundColor: getStatusColor(inv.status) }}
//                       >
//                         {getStatusLabel(inv.status)}
//                       </span>
//                     </td>
//                     <td className="invoice-actions">
//                       <div className="actions-container">
//                         <button 
//                           className="action-btn"
//                           onClick={() => downloadPDF(inv)}
//                           title="Download PDF"
//                         >
//                           <FaDownload />
//                         </button>
//                         <button 
//                           className="action-btn"
//                           onClick={() => openEditModal(inv)}
//                           title="Edit Invoice"
//                         >
//                           <FaEdit />
//                         </button>
//                         <button 
//                           className="action-btn"
//                           onClick={() => openHistoryModal(inv._id)}
//                           title="View History"
//                         >
//                           <FaHistory />
//                         </button>
//                         <button 
//                           className="action-btn delete-btn"
//                           onClick={() => handleDeleteInvoice(inv._id)}
//                           title="Delete Invoice"
//                         >
//                           <FaTrash />
//                         </button>
//                       </div>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         )}
//       </div>

//       {/* Edit Modal */}
//       {showEditModal && (
//         <div className="modal-overlay">
//           <div className="edit-modal">
//             <div className="modal-header">
//               <h2>
//                 <FaEdit className="modal-icon" />
//                 Edit Invoice #{currentInvoice.invoiceNo}
//               </h2>
//               <button 
//                 className="close-btn" 
//                 onClick={() => setShowEditModal(false)}
//                 aria-label="Close modal"
//               >
//                 <FaTimes />
//               </button>
//             </div>
            
//             <div className="modal-body">
//               <div className="invoice-summary">
//                 <div className="summary-item">
//                   <span className="summary-label"><FaUser /> Customer:</span>
//                   <span className="summary-value">{currentInvoice.buyer?.name || "N/A"}</span>
//                 </div>
//                 <div className="summary-item">
//                   <span className="summary-label"><FaFileInvoice /> Invoice Date:</span>
//                   <span className="summary-value">{formatDate(currentInvoice.invoiceDate)}</span>
//                 </div>
//                 <div className="summary-item">
//                   <span className="summary-label"><FaRupeeSign /> Total Amount:</span>
//                   <span className="summary-value highlight">
//                     ₹{currentInvoice.grandTotal?.toLocaleString('en-IN') || "0"}
//                   </span>
//                 </div>
//               </div>

//               <div className="form-section">
//                 <div className="form-group">
//                   <label htmlFor="status">
//                     <FaMoneyBillWave className="input-icon" />
//                     Payment Status
//                     <span className="required">*</span>
//                   </label>
//                   <div className="select-wrapper">
//                     <select
//                       id="status"
//                       name="status"
//                       value={editForm.status}
//                       onChange={handleEditChange}
//                       className="status-select"
//                       required
//                     >
//                       {statusOptions.map(option => (
//                         <option key={option.value} value={option.value}>
//                           {option.label}
//                         </option>
//                       ))}
//                     </select>
//                     <div className="select-arrow"></div>
//                   </div>
//                 </div>

//                 <div className="form-group">
//                   <label htmlFor="paymentDate">
//                     <FaCalendarAlt className="input-icon" />
//                     Payment Date
//                   </label>
//                   <div className="date-input-wrapper">
//                     <input
//                       type="date"
//                       id="paymentDate"
//                       name="paymentDate"
//                       value={editForm.paymentDate}
//                       onChange={handleEditChange}
//                       className="date-input"
//                     />
//                   </div>
//                 </div>

//                 <div className="form-group">
//                   <label htmlFor="notes">
//                     <FaInfoCircle className="input-icon" />
//                     Notes
//                     <span className="optional">(optional)</span>
//                   </label>
//                   <textarea
//                     id="notes"
//                     name="notes"
//                     value={editForm.notes}
//                     onChange={handleEditChange}
//                     rows="4"
//                     placeholder="Add any additional notes about this payment..."
//                     className="notes-textarea"
//                   />
//                 </div>

//                 {editForm.status === 'partial' && (
//                   <div className="info-message">
//                     <FaInfoCircle className="info-icon" />
//                     <span>For partial payments, please add details in the notes section including the amount received.</span>
//                   </div>
//                 )}
//               </div>
//             </div>
            
//             <div className="modal-footer">
//               <button 
//                 className="btn btn-secondary" 
//                 onClick={() => setShowEditModal(false)}
//               >
//                 <FaTimes /> Cancel
//               </button>
//               <button 
//                 className="btn btn-primary" 
//                 onClick={handleUpdateInvoice}
//                 disabled={!editForm.status || loading}
//               >
//                 {loading ? 'Saving...' : (
//                   <>
//                     <FaCheck /> Save Changes
//                   </>
//                 )}
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* History Modal */}
//       {showHistoryModal && (
//         <div className="modal-overlay">
//           <div className="history-modal">
//             <div className="modal-header">
//               <h2>
//                 <FaHistory className="modal-icon" />
//                 Invoice History
//               </h2>
//               <button 
//                 className="close-btn" 
//                 onClick={() => setShowHistoryModal(false)}
//                 aria-label="Close modal"
//               >
//                 <FaTimes />
//               </button>
//             </div>
            
//             <div className="modal-body">
//               {invoiceHistory.length === 0 ? (
//                 <div className="empty-history">
//                   <p>No history available for this invoice</p>
//                 </div>
//               ) : (
//                 <div className="history-timeline">
//                   {invoiceHistory.map((history, index) => (
//                     <div key={index} className="history-item">
//                       <div className="history-timestamp">
//                         {formatDateTime(history.timestamp)}
//                       </div>
//                       <div className="history-content">
//                         <div className="history-action">
//                           <strong>{history.action}</strong>
//                         </div>
//                         {history.changes && (
//                           <div className="history-changes">
//                             {Object.entries(history.changes).map(([field, values]) => (
//                               <div key={field} className="change-item">
//                                 <span className="change-field">{field}:</span>
//                                 <span className="change-from">"{values.from}"</span>
//                                 <span className="change-arrow">→</span>
//                                 <span className="change-to">"{values.to}"</span>
//                               </div>
//                             ))}
//                           </div>
//                         )}
//                         {history.notes && (
//                           <div className="history-notes">
//                             <strong>Notes:</strong> {history.notes}
//                           </div>
//                         )}
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               )}
//             </div>
            
//             <div className="modal-footer">
//               <button 
//                 className="btn btn-primary" 
//                 onClick={() => setShowHistoryModal(false)}
//               >
//                 <FaCheck /> Close
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Styles */}
//       <style jsx>{`
//         :root {
//           --primary: #4F46E5;
//           --primary-hover: #4338CA;
//           --secondary: #F3F4F6;
//           --secondary-hover: #E5E7EB;
//           --success: #10B981;
//           --danger: #EF4444;
//           --warning: #F59E0B;
//           --info: #3B82F6;
//           --light: #F9FAFB;
//           --dark: #111827;
//           --gray: #6B7280;
//           --gray-light: #9CA3AF;
//           --border: #E5E7EB;
//           --shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
//           --shadow-md: 0 4px 6px rgba(0, 0, 0, 0.1);
//           --radius: 6px;
//           --radius-lg: 8px;
//           --transition: all 0.2s ease;
//         }

//         * {
//           box-sizing: border-box;
//           margin: 0;
//           padding: 0;
//         }

//         body {
//           font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
//           color: var(--dark);
//           background-color: #F9FAFB;
//           line-height: 1.5;
//         }

//         .invoice-dashboard {
//           max-width: 1200px;
//           margin: 0 auto;
//           padding: 20px;
//         }

//         .dashboard-header {
//           display: flex;
//           justify-content: space-between;
//           align-items: center;
//           margin-bottom: 24px;
//           flex-wrap: wrap;
//           gap: 16px;
//         }

//         .header-left {
//           flex: 1;
//           min-width: 300px;
//         }

//         .dashboard-title {
//           font-size: 24px;
//           font-weight: 600;
//           color: var(--dark);
//           margin-bottom: 4px;
//         }

//         .dashboard-subtitle {
//           font-size: 14px;
//           color: var(--gray);
//         }

//         .header-actions {
//           display: flex;
//           gap: 12px;
//           flex-wrap: wrap;
//         }

//         .filters-container {
//           display: grid;
//           grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
//           gap: 16px;
//           background-color: white;
//           padding: 20px;
//           border-radius: var(--radius);
//           box-shadow: var(--shadow);
//           margin-bottom: 20px;
//         }

//         .filter-group {
//           display: flex;
//           flex-direction: column;
//           gap: 8px;
//         }

//         .filter-group label {
//           font-size: 14px;
//           font-weight: 500;
//           color: var(--gray);
//         }

//         .search-box {
//           position: relative;
//           display: flex;
//           align-items: center;
//         }

//         .search-icon {
//           position: absolute;
//           left: 12px;
//           color: var(--gray-light);
//         }

//         .search-input {
//           width: 100%;
//           padding: 10px 15px 10px 40px;
//           border: 1px solid var(--border);
//           border-radius: var(--radius);
//           font-size: 14px;
//           transition: var(--transition);
//         }

//         .search-input:focus {
//           outline: none;
//           border-color: var(--primary);
//           box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.1);
//         }

//         .date-filter {
//           position: relative;
//           display: flex;
//           align-items: center;
//         }

//         .calendar-icon {
//           position: absolute;
//           left: 12px;
//           color: var(--gray-light);
//         }

//         .date-picker-input {
//           width: 100%;
//           padding: 10px 15px 10px 40px;
//           border: 1px solid var(--border);
//           border-radius: var(--radius);
//           font-size: 14px;
//         }

//         .status-filter {
//           position: relative;
//         }

//         .status-select {
//           width: 100%;
//           padding: 10px 15px;
//           border: 1px solid var(--border);
//           border-radius: var(--radius);
//           font-size: 14px;
//           appearance: none;
//           background-color: white;
//         }

//         .select-arrow {
//           position: absolute;
//           right: 12px;
//           top: 50%;
//           transform: translateY(-50%);
//           pointer-events: none;
//           color: var(--gray-light);
//         }

//         .btn {
//           display: inline-flex;
//           align-items: center;
//           justify-content: center;
//           gap: 8px;
//           padding: 10px 16px;
//           border-radius: var(--radius);
//           font-weight: 500;
//           font-size: 14px;
//           cursor: pointer;
//           transition: var(--transition);
//           border: 1px solid transparent;
//           white-space: nowrap;
//         }

//         .btn-primary {
//           background-color: var(--primary);
//           color: white;
//         }

//         .btn-primary:hover {
//           background-color: var(--primary-hover);
//         }

//         .btn-primary:disabled {
//           background-color: var(--gray-light);
//           cursor: not-allowed;
//         }

//         .btn-secondary {
//           background-color: var(--secondary);
//           color: var(--dark);
//           border-color: var(--border);
//         }

//         .btn-secondary:hover {
//           background-color: var(--secondary-hover);
//         }

//         .btn-secondary:disabled {
//           opacity: 0.7;
//           cursor: not-allowed;
//         }

//         .btn-text {
//           background: none;
//           border: none;
//           color: var(--primary);
//           padding: 0;
//         }

//         .btn-text:hover {
//           text-decoration: underline;
//         }

//         .btn-text:disabled {
//           color: var(--gray-light);
//           cursor: not-allowed;
//         }

//         .stats-container {
//           display: grid;
//           grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
//           gap: 16px;
//           margin-bottom: 24px;
//         }

//         .stat-card {
//           background-color: white;
//           border-radius: var(--radius);
//           padding: 20px;
//           box-shadow: var(--shadow);
//           transition: var(--transition);
//           border-top: 4px solid var(--gray);
//         }

//         .stat-card:hover {
//           transform: translateY(-2px);
//           box-shadow: var(--shadow-md);
//         }

//         .stat-card.total {
//           border-top-color: var(--primary);
//         }

//         .stat-value {
//           font-size: 28px;
//           font-weight: 700;
//           margin-bottom: 4px;
//         }

//         .stat-label {
//           font-size: 14px;
//           color: var(--gray);
//         }

//         .invoices-section {
//           background-color: white;
//           border-radius: var(--radius);
//           box-shadow: var(--shadow);
//           overflow: hidden;
//         }

//         .loading-indicator {
//           display: flex;
//           flex-direction: column;
//           align-items: center;
//           justify-content: center;
//           padding: 60px;
//         }

//         .spinner {
//           width: 40px;
//           height: 40px;
//           border: 4px solid rgba(0, 0, 0, 0.1);
//           border-left-color: var(--primary);
//           border-radius: 50%;
//           animation: spin 1s linear infinite;
//           margin-bottom: 15px;
//         }

//         @keyframes spin {
//           to { transform: rotate(360deg); }
//         }

//         .empty-state {
//           display: flex;
//           flex-direction: column;
//           align-items: center;
//           justify-content: center;
//           padding: 60px;
//           text-align: center;
//         }

//         .empty-icon {
//           font-size: 48px;
//           color: var(--gray-light);
//           margin-bottom: 16px;
//         }

//         .empty-state h3 {
//           font-size: 18px;
//           margin-bottom: 8px;
//           color: var(--dark);
//         }

//         .empty-state p {
//           color: var(--gray);
//           margin-bottom: 16px;
//         }

//         .invoices-table-container {
//           overflow-x: auto;
//           -webkit-overflow-scrolling: touch;
//         }

//         .invoices-table {
//           width: 100%;
//           border-collapse: collapse;
//           font-size: 14px;
//           min-width: 800px;
//         }

//         .invoices-table th {
//           text-align: left;
//           padding: 12px 16px;
//           background-color: #F9FAFB;
//           color: var(--gray);
//           font-weight: 500;
//           border-bottom: 1px solid var(--border);
//         }

//         .invoices-table td {
//           padding: 12px 16px;
//           border-bottom: 1px solid var(--border);
//           vertical-align: middle;
//         }

//         .invoices-table tr:last-child td {
//           border-bottom: none;
//         }

//         .invoices-table tr:hover {
//           background-color: #F9FAFB;
//         }

//         .invoice-number {
//           font-weight: 500;
//           color: var(--primary);
//         }

//         .customer-name {
//           display: flex;
//           align-items: center;
//           gap: 8px;
//         }

//         .customer-name .icon {
//           color: var(--gray-light);
//         }

//         .invoice-date {
//           color: var(--gray);
//         }

//         .invoice-amount {
//           display: flex;
//           align-items: center;
//           gap: 4px;
//           font-weight: 500;
//         }

//         .invoice-amount .icon {
//           color: var(--gray-light);
//           font-size: 12px;
//         }

//         .status-badge {
//           display: inline-block;
//           padding: 4px 10px;
//           border-radius: 12px;
//           font-size: 12px;
//           font-weight: 500;
//           color: white;
//         }

//         .invoice-actions {
//           text-align: right;
//         }

//         .actions-container {
//           display: flex;
//           align-items: center;
//           justify-content: flex-end;
//           gap: 8px;
//         }

//         .action-btn {
//           background: none;
//           border: none;
//           color: var(--gray-light);
//           cursor: pointer;
//           padding: 6px;
//           border-radius: 4px;
//           transition: var(--transition);
//           font-size: 14px;
//         }

//         .action-btn:hover {
//           background-color: var(--secondary);
//           color: var(--primary);
//         }

//         .action-btn.delete-btn {
//           color: var(--danger);
//         }

//         .action-btn.delete-btn:hover {
//           background-color: #FEF2F2;
//         }

//         .modal-overlay {
//           position: fixed;
//           top: 0;
//           left: 0;
//           right: 0;
//           bottom: 0;
//           background-color: rgba(0, 0, 0, 0.5);
//           display: flex;
//           justify-content: center;
//           align-items: center;
//           z-index: 1000;
//           padding: 20px;
//         }

//         .edit-modal, .history-modal {
//           background-color: white;
//           border-radius: var(--radius-lg);
//           width: 100%;
//           max-width: 600px;
//           max-height: 90vh;
//           overflow-y: auto;
//           box-shadow: 0 5px 20px rgba(0, 0, 0, 0.2);
//           animation: fadeIn 0.3s;
//         }

//         @keyframes fadeIn {
//           from { opacity: 0; transform: translateY(-20px); }
//           to { opacity: 1; transform: translateY(0); }
//         }

//         .modal-header {
//           display: flex;
//           justify-content: space-between;
//           align-items: center;
//           padding: 20px;
//           border-bottom: 1px solid var(--border);
//         }

//         .modal-header h2 {
//           display: flex;
//           align-items: center;
//           gap: 10px;
//           margin: 0;
//           font-size: 20px;
//           color: var(--dark);
//         }

//         .modal-icon {
//           color: var(--primary);
//         }

//         .close-btn {
//           background: none;
//           border: none;
//           color: var(--gray-light);
//           cursor: pointer;
//           font-size: 18px;
//           transition: var(--transition);
//         }

//         .close-btn:hover {
//           color: var(--dark);
//         }

//         .modal-body {
//           padding: 20px;
//         }

//         .invoice-summary {
//           background-color: #F9FAFB;
//           border-radius: var(--radius);
//           padding: 16px;
//           margin-bottom: 20px;
//         }

//         .summary-item {
//           display: flex;
//           margin-bottom: 12px;
//         }

//         .summary-item:last-child {
//           margin-bottom: 0;
//         }

//         .summary-label {
//           font-weight: 500;
//           color: var(--gray);
//           min-width: 120px;
//           display: flex;
//           align-items: center;
//           gap: 8px;
//         }

//         .summary-value {
//           color: var(--dark);
//         }

//         .highlight {
//           font-weight: 600;
//           color: var(--success);
//         }

//         .form-section {
//           margin-top: 20px;
//         }

//         .form-group {
//           margin-bottom: 20px;
//         }

//         .form-group label {
//           display: block;
//           margin-bottom: 8px;
//           font-weight: 500;
//           color: var(--dark);
//           display: flex;
//           align-items: center;
//           gap: 8px;
//         }

//         .required {
//           color: var(--danger);
//           margin-left: 4px;
//         }

//         .optional {
//           color: var(--gray-light);
//           margin-left: 4px;
//           font-weight: normal;
//         }

//         .select-wrapper {
//           position: relative;
//         }

//         .status-select {
//           width: 100%;
//           padding: 10px 15px;
//           border: 1px solid var(--border);
//           border-radius: var(--radius);
//           appearance: none;
//           background-color: white;
//           font-size: 14px;
//         }

//         .date-input-wrapper {
//           position: relative;
//         }

//         .date-input {
//           width: 100%;
//           padding: 10px 15px;
//           border: 1px solid var(--border);
//           border-radius: var(--radius);
//           font-size: 14px;
//         }

//         .notes-textarea {
//           width: 100%;
//           padding: 10px 15px;
//           border: 1px solid var(--border);
//           border-radius: var(--radius);
//           font-size: 14px;
//           resize: vertical;
//           min-height: 100px;
//         }

//         .info-message {
//           display: flex;
//           align-items: flex-start;
//           gap: 8px;
//           padding: 12px 16px;
//           background-color: #EFF6FF;
//           border-radius: var(--radius);
//           color: #1E40AF;
//           font-size: 14px;
//           margin-top: 15px;
//         }

//         .info-icon {
//           color: #3B82F6;
//           margin-top: 2px;
//         }

//         .modal-footer {
//           display: flex;
//           justify-content: flex-end;
//           gap: 12px;
//           padding: 16px 20px;
//           border-top: 1px solid var(--border);
//         }

//         .history-modal {
//           max-width: 700px;
//         }

//         .empty-history {
//           text-align: center;
//           padding: 40px;
//           color: var(--gray);
//         }

//         .history-timeline {
//           position: relative;
//           padding-left: 30px;
//         }

//         .history-timeline::before {
//           content: '';
//           position: absolute;
//           left: 10px;
//           top: 0;
//           bottom: 0;
//           width: 2px;
//           background-color: var(--border);
//         }

//         .history-item {
//           position: relative;
//           padding-bottom: 20px;
//           margin-bottom: 20px;
//         }

//         .history-item:last-child {
//           margin-bottom: 0;
//           padding-bottom: 0;
//         }

//         .history-item::before {
//           content: '';
//           position: absolute;
//           left: -30px;
//           top: 5px;
//           width: 12px;
//           height: 12px;
//           border-radius: 50%;
//           background-color: var(--primary);
//           border: 2px solid white;
//         }

//         .history-timestamp {
//           font-size: 13px;
//           color: var(--gray);
//           margin-bottom: 8px;
//         }

//         .history-content {
//           background-color: #F9FAFB;
//           border-radius: var(--radius);
//           padding: 16px;
//         }

//         .history-action {
//           font-size: 15px;
//           margin-bottom: 10px;
//           color: var(--dark);
//         }

//         .history-changes {
//           margin-bottom: 10px;
//         }

//         .change-item {
//           display: flex;
//           gap: 8px;
//           margin-bottom: 5px;
//           font-size: 14px;
//           flex-wrap: wrap;
//         }

//         .change-field {
//           font-weight: 500;
//           color: var(--gray);
//         }

//         .change-from, .change-to {
//           font-family: monospace;
//           background-color: #F3F4F6;
//           padding: 2px 4px;
//           border-radius: 4px;
//         }

//         .change-arrow {
//           color: var(--gray-light);
//         }

//         .history-notes {
//           padding-top: 10px;
//           border-top: 1px dashed var(--border);
//           font-size: 14px;
//           color: var(--dark);
//         }

//         @media (max-width: 768px) {
//           .dashboard-header {
//             flex-direction: column;
//             align-items: flex-start;
//             gap: 16px;
//           }

//           .header-actions {
//             width: 100%;
//             justify-content: flex-start;
//           }

//           .filters-container {
//             grid-template-columns: 1fr;
//           }

//           .stats-container {
//             grid-template-columns: 1fr 1fr;
//           }
//         }

//         @media (max-width: 480px) {
//           .stats-container {
//             grid-template-columns: 1fr;
//           }

//           .modal-footer {
//             flex-direction: column;
//           }

//           .btn {
//             width: 100%;
//           }
//         }
//       `}</style>
//     </div>
//   );
// };

// export default InvoiceDashboard;

// Invoice.jsx

// Invoice.jsx




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

  const fetchInvoices = async (token) => {
    setLoading(true);
    try {
      const res = await axios.get(`${BASE_URL}/api/invoices`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setInvoices(res.data);
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