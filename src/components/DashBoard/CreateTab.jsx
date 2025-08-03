// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import jsPDF from "jspdf";
// import html2canvas from "html2canvas";
// import { jwtDecode } from "jwt-decode";
// import { useNavigate } from "react-router-dom";

// const CreateTab = () => {
//     const navigate = useNavigate();
//   const [user, setUser] = useState({
//     Id: "N/A",
//     Name: "N/A",
//     Email: "N/A"
//   });

//   const [invoice, setInvoice] = useState({
//     agencyName: "RADHE AQUATECH (BlueSip)",
//     agencyAddress: "123 Water Tech Park, Mumbai (MH) 400001",
//     agencyPhone: "+91 9876543210",
//     agencyEmail: "info@radheaquatech.com",
//     agencyGSTIN: "27AABCR1234Q1Z5",
//     agencyLogo: "https://via.placeholder.com/150x50?text=Radhe+Aquatech",
    
//     customer: {
//       name: "",
//       address: "",
//       phone: "",
//       gst: ""
//     },
    
//     invoiceNo: `RA${Math.floor(1000 + Math.random() * 9000)}`,
//     date: new Date().toLocaleDateString('en-GB').split('/').join('-'),
//     dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString('en-GB').split('/').join('-'),
    
//     items: [{
//       sn: 1,
//       qty: 1,
//       description: "BlueSip Water Purifier",
//       hsn: "84212100",
//       rate: 0,
//       sgst: 9,
//       cgst: 9,
//       amount: 0
//     }],
    
//     bankDetails: {
//       bankName: "State Bank of India",
//       accountNo: "123456789012",
//       ifsc: "SBIN0001234",
//       branch: "Mumbai Main Branch"
//     },
    
//     totalAmount: 0,
//     totalSGST: 9,
//     totalCGST: 9,
//     grandTotal: 0
//   });

//   const [invoices, setInvoices] = useState([]);
//   const [activeTab, setActiveTab] = useState("create");

//   useEffect(() => {
//     const checkAuth = async () => {
//       const token = localStorage.getItem("token");
      
//       if (!token) {
//         navigate("/login");
//         return;
//       }

//       try {
//         const decoded = jwtDecode(token);
//         const userId = decoded.id;

//         const response = await axios.get(`https://bluesip-backend.onrender.com/api/users/${userId}`, {
//           headers: { Authorization: `Bearer ${token}` }
//         });

//         if (response.data) {
//           setUser(response.data);
//           console.log(response.data);
//         } else {
//           localStorage.removeItem("token");
//           navigate("/login");
//         }
//       } catch (error) {
//         console.error("Authentication error:", error);
//         localStorage.removeItem("token");
//         navigate("/login");
//       }
//     };

//     checkAuth();
//     fetchInvoices();
//   }, [navigate]);

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setInvoice(prev => ({ ...prev, [name]: value }));
//   };

//   const handleCustomerChange = (e) => {
//     const { name, value } = e.target;
//     setInvoice(prev => ({ 
//       ...prev, 
//       customer: { ...prev.customer, [name]: value } 
//     }));
//   };

//   const isFormComplete = () => {
//   const {
//     agencyName, agencyGSTIN, agencyAddress, agencyPhone, agencyEmail,
//     customer, invoiceNo, date, dueDate, items, bankDetails
//   } = invoice;

//   if (
//     !agencyName || !agencyGSTIN || !agencyAddress || !agencyPhone || !agencyEmail ||
//     !customer.name || !customer.address || !customer.phone || !customer.gst ||
//     !invoiceNo || !date || !dueDate ||
//     !bankDetails.bankName || !bankDetails.accountNo || !bankDetails.ifsc || !bankDetails.branch
//   ) return false;

//   if (items.length === 0) return false;

//   for (let item of items) {
//     if (!item.qty || !item.description || !item.hsn || !item.rate || item.sgst == null || item.cgst == null) {
//       return false;
//     }
//   }

//   return true;
// };


//   const calculateItemAmount = (item) => {
//     const rate = parseFloat(item.rate) || 0;
//     const qty = parseFloat(item.qty) || 0;
//     const sgst = parseFloat(item.sgst) || 0;
//     const cgst = parseFloat(item.cgst) || 0;
    
//     const subtotal = rate * qty;
//     const sgstAmount = subtotal * (sgst / 100);
//     const cgstAmount = subtotal * (cgst / 100);
    
//     return Number((subtotal + sgstAmount + cgstAmount).toFixed(2));
//   };

//   const handleItemChange = (e, index) => {
//     const { name, value } = e.target;
//     const items = [...invoice.items];
//     items[index] = { ...items[index], [name]: value };
    
//     if (['rate', 'qty', 'sgst', 'cgst'].includes(name)) {
//       items[index].amount = calculateItemAmount(items[index]);
//     }
    
//     setInvoice(prev => ({ ...prev, items }));
//     calculateTotals(items);
//   };

//   const calculateTotals = (items) => {
//     const totalAmount = items.reduce((sum, item) => {
//       const rate = parseFloat(item.rate) || 0;
//       const qty = parseFloat(item.qty) || 0;
//       return sum + (rate * qty);
//     }, 0);

//     const totalSGST = items.reduce((sum, item) => {
//       const rate = parseFloat(item.rate) || 0;
//       const qty = parseFloat(item.qty) || 0;
//       const sgst = parseFloat(item.sgst) || 0;
//       return sum + ((rate * qty) * (sgst / 100));
//     }, 0);

//     const totalCGST = items.reduce((sum, item) => {
//       const rate = parseFloat(item.rate) || 0;
//       const qty = parseFloat(item.qty) || 0;
//       const cgst = parseFloat(item.cgst) || 0;
//       return sum + ((rate * qty) * (cgst / 100));
//     }, 0);

//     const grandTotal = totalAmount + totalSGST + totalCGST;
    
//     setInvoice(prev => ({
//       ...prev,
//       totalAmount: Number(totalAmount.toFixed(2)),
//       totalSGST: Number(totalSGST.toFixed(2)),
//       totalCGST: Number(totalCGST.toFixed(2)),
//       grandTotal: Number(grandTotal.toFixed(2))
//     }));
//   };

//   const addItem = () => {
//     setInvoice(prev => ({
//       ...prev,
//       items: [
//         ...prev.items,
//         {
//           sn: prev.items.length + 1,
//           qty: 1,
//           description: "",
//           hsn: "",
//           rate: 0,
//           sgst: 9,
//           cgst: 9,
//           amount: 0
//         }
//       ]
//     }));
//   };

//   const removeItem = (index) => {
//     if (invoice.items.length <= 1) return;
//     const items = invoice.items.filter((_, i) => i !== index);
//     const updatedItems = items.map((item, idx) => ({ ...item, sn: idx + 1 }));
//     setInvoice(prev => ({ ...prev, items: updatedItems }));
//     calculateTotals(updatedItems);
//   };

//   const handleSubmit = async () => {
//     try {
//       calculateTotals(invoice.items);
//       const res = await axios.post("https://bluesip-backend.onrender.com/api/invoice", invoice);
//       alert("Invoice saved successfully!");
//       setInvoices([...invoices, res.data]);
//        setInvoice(prev => ({
//       ...prev,
//       invoiceNo: `RA${Math.floor(1000 + Math.random() * 9000)}`,
//       date: new Date().toLocaleDateString('en-GB').split('/').join('-'),
//       dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString('en-GB').split('/').join('-'),
//       customer: { name: "", address: "", phone: "", gst: "" },
//       items: [{
//         sn: 0,
//         qty: 0,
//         description: "BlueSip Water Purifier",
//         hsn: "84212100",
//         rate: 0,
//         sgst: 9,
//         cgst: 9,
//         amount: 0
//       }],
//       totalAmount: 0,
//       totalSGST: 0,
//       totalCGST: 0,
//       grandTotal: 0
//     }));
    
//     } catch (error) {
//       console.error("Error saving invoice:", error);
//       alert("Failed to save invoice");
//     }
//   };

//   const fetchInvoices = async () => {
//     try {
//       const res = await axios.get("https://bluesip-backend.onrender.com/api/invoices");
//       setInvoices(res.data);
//     } catch (error) {
//       console.error("Error fetching invoices:", error);
//     }
//   };

//   const downloadPDF = async (invoiceData) => {
//     const input = document.getElementById(`invoice-${invoiceData._id || 'preview'}`);
    
//     // Create a clone of the element to avoid affecting the original
//     const clone = input.cloneNode(true);
//     clone.style.position = 'absolute';
//     clone.style.left = '-9999px';
//     clone.style.width = '800px';
//     document.body.appendChild(clone);
    
//     try {
//       const canvas = await html2canvas(clone, { 
//         scale: 2,
//         logging: true,
//         useCORS: true,
//         allowTaint: true
//       });
      
//       const imgData = canvas.toDataURL("image/png");
//       const pdf = new jsPDF('p', 'mm', 'a4');
//       const imgWidth = 210;
//       const pageHeight = 295;
//       const imgHeight = canvas.height * imgWidth / canvas.width;
//       let heightLeft = imgHeight;
//       let position = 0;
      
//       pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
//       heightLeft -= pageHeight;
      
//       while (heightLeft >= 0) {
//         position = heightLeft - imgHeight;
//         pdf.addPage();
//         pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
//         heightLeft -= pageHeight;
//       }
      
//       pdf.save(`Radhe-Aquatech-Invoice-${invoiceData.invoiceNo || 'preview'}.pdf`);
//     } catch (error) {
//       console.error("Error generating PDF:", error);
//       alert("Failed to generate PDF");
//     } finally {
//       document.body.removeChild(clone);
//     }
//   };

//     return(
//         <>
//            <div>

//           <div className="form-section">
//               <div className="form-card">
//                 <h2 className="section-title">
//                   <i className="fas fa-file-alt"></i> Create New Invoice
//                 </h2>
                
//                 {/* Company Information */}
//                 <div className="form-group">
//                   <h3 className="group-title">
//                     <i className="fas fa-building"></i> Company Information
//                   </h3>
//                   <div className="form-row">
//                     <div className="form-col">
//                       <label>Company Name</label>
//                       <input 
//                         type="text" 
//                         name="agencyName" 
//                         value={invoice.agencyName} 
//                         onChange={handleChange}
//                       />
//                     </div>
//                     <div className="form-col">
//                       <label>GSTIN</label>
//                       <input 
//                         type="text" 
//                         name="agencyGSTIN" 
//                         value={invoice.agencyGSTIN} 
//                         onChange={handleChange}
//                       />
//                     </div>
//                   </div>
//                   <div className="form-row">
//                     <div className="form-col full-width">
//                       <label>Address</label>
//                       <textarea 
//                         name="agencyAddress" 
//                         value={invoice.agencyAddress} 
//                         onChange={handleChange}
//                         rows="2"
//                       ></textarea>
//                     </div>
//                   </div>
//                   <div className="form-row">
//                     <div className="form-col">
//                       <label>Phone</label>
//                       <input 
//                         type="text" 
//                         name="agencyPhone" 
//                         value={invoice.agencyPhone} 
//                         onChange={handleChange}
//                       />
//                     </div>
//                     <div className="form-col">
//                       <label>Email</label>
//                       <input 
//                         type="email" 
//                         name="agencyEmail" 
//                         value={invoice.agencyEmail} 
//                         onChange={handleChange}
//                       />
//                     </div>
//                   </div>
//                 </div>

//                 {/* Customer Information */}
//                 <div className="form-group">
//                   <h3 className="group-title">
//                     <i className="fas fa-user-tie"></i> Customer Details
//                   </h3>
//                   <div className="form-row">
//                     <div className="form-col">
//                       <label>Customer Name</label>
//                       <input 
//                         type="text" 
//                         name="name" 
//                         value={invoice.customer.name} 
//                         onChange={handleCustomerChange}
//                       />
//                     </div>
//                     <div className="form-col">
//                       <label>GST</label>
//                       <input 
//                         type="text" 
//                         name="gst" 
//                         value={invoice.customer.gst} 
//                         onChange={handleCustomerChange}
//                       />
//                     </div>
//                   </div>
//                   <div className="form-row">
//                     <div className="form-col full-width">
//                       <label>Address</label>
//                       <textarea 
//                         name="address" 
//                         value={invoice.customer.address} 
//                         onChange={handleCustomerChange}
//                         rows="2"
//                       ></textarea>
//                     </div>
//                   </div>
//                   <div className="form-row">
//                     <div className="form-col">
//                       <label>Phone</label>
//                       <input 
//                         type="text" 
//                         name="phone" 
//                         value={invoice.customer.phone} 
//                         onChange={handleCustomerChange}
//                       />
//                     </div>
//                   </div>
//                 </div>

//                 {/* Invoice Details */}
//                 <div className="form-group">
//                   <h3 className="group-title">
//                     <i className="fas fa-info-circle"></i> Invoice Details
//                   </h3>
//                   <div className="form-row">
//                     <div className="form-col">
//                       <label>Invoice No</label>
//                       <input 
//                         type="text" 
//                         name="invoiceNo" 
//                         value={invoice.invoiceNo} 
//                         onChange={handleChange}
//                       />
//                     </div>
//                     <div className="form-col">
//                       <label>Date</label>
//                       <input 
//                         type="text" 
//                         name="date" 
//                         value={invoice.date} 
//                         onChange={handleChange}
//                       />
//                     </div>
//                     <div className="form-col">
//                       <label>Due Date</label>
//                       <input 
//                         type="text" 
//                         name="dueDate" 
//                         value={invoice.dueDate} 
//                         onChange={handleChange}
//                       />
//                     </div>
//                   </div>
//                 </div>

//                 {/* Items Table */}
//                 <div className="form-group">
//                   <div className="group-header">
//                     <h3 className="group-title">
//                       <i className="fas fa-boxes"></i> Products/Services
//                     </h3>
//                     <button className="add-item-btn" onClick={addItem}>
//                       <i className="fas fa-plus-circle"></i> Add Item
//                     </button>
//                   </div>
                  
//                   <div className="table-container">
//                     <table className="items-table">
//                       <thead>
//                         <tr>
//                           <th>Sr.No.</th>
//                           <th>Qty</th>
//                           <th>Description</th>
//                           <th>HSN Code</th>
//                           <th>Rate (₹)</th>
//                           <th>SGST %</th>
//                           <th>CGST %</th>
//                           <th>Amount (₹)</th>
//                           <th>Action</th>
//                         </tr>
//                       </thead>
//                       <tbody>
//                         {invoice.items.map((item, index) => (
//                           <tr key={index}>
//                             <td>{item.sn}</td>
//                             <td>
//                               <input 
//                                 type="number" 
//                                 name="qty" 
//                                 value={item.qty} 
//                                 onChange={(e) => handleItemChange(e, index)}
//                               />
//                             </td>
//                             <td>
//                               <input 
//                                 type="text" 
//                                 name="description" 
//                                 value={item.description} 
//                                 onChange={(e) => handleItemChange(e, index)}
//                               />
//                             </td>
//                             <td>
//                               <input 
//                                 type="text" 
//                                 name="hsn" 
//                                 value={item.hsn} 
//                                 onChange={(e) => handleItemChange(e, index)}
//                               />
//                             </td>
//                             <td>
//                               <input 
//                                 type="number" 
//                                 name="rate" 
//                                 value={item.rate} 
//                                 onChange={(e) => handleItemChange(e, index)}
//                               />
//                             </td>
//                             <td>
//                               <input 
//                                 type="number" 
//                                 name="sgst" 
//                                 value={item.sgst} 
//                                 onChange={(e) => handleItemChange(e, index)}
//                               />
//                             </td>
//                             <td>
//                               <input 
//                                 type="number" 
//                                 name="cgst" 
//                                 value={item.cgst} 
//                                 onChange={(e) => handleItemChange(e, index)}
//                               />
//                             </td>
//                             <td className="amount-cell">₹{item.amount.toLocaleString()}</td>
//                             <td>
//                               <button 
//                                 className="remove-btn"
//                                 onClick={() => removeItem(index)}
//                               >
//                                 <i className="fas fa-minus-circle"></i>
//                               </button>
//                             </td>
//                           </tr>
//                         ))}
//                       </tbody>
//                     </table>
//                   </div>
//                 </div>

//                 {/* Bank Details */}
//                 <div className="form-group">
//                   <h3 className="group-title">
//                     <i className="fas fa-university"></i> Bank Details
//                   </h3>
//                   <div className="form-row">
//                     <div className="form-col">
//                       <label>Bank Name</label>
//                       <input 
//                         type="text" 
//                         name="bankName" 
//                         value={invoice.bankDetails.bankName} 
//                         onChange={(e) => setInvoice(prev => ({
//                           ...prev,
//                           bankDetails: { ...prev.bankDetails, bankName: e.target.value }
//                         }))}
//                       />
//                     </div>
//                     <div className="form-col">
//                       <label>Account No</label>
//                       <input 
//                         type="text" 
//                         name="accountNo" 
//                         value={invoice.bankDetails.accountNo} 
//                         onChange={(e) => setInvoice(prev => ({
//                           ...prev,
//                           bankDetails: { ...prev.bankDetails, accountNo: e.target.value }
//                         }))}
//                       />
//                     </div>
//                   </div>
//                   <div className="form-row">
//                     <div className="form-col">
//                       <label>IFSC Code</label>
//                       <input 
//                         type="text" 
//                         name="ifsc" 
//                         value={invoice.bankDetails.ifsc} 
//                         onChange={(e) => setInvoice(prev => ({
//                           ...prev,
//                           bankDetails: { ...prev.bankDetails, ifsc: e.target.value }
//                         }))}
//                       />
//                     </div>
//                     <div className="form-col">
//                       <label>Branch</label>
//                       <input 
//                         type="text" 
//                         name="branch" 
//                         value={invoice.bankDetails.branch} 
//                         onChange={(e) => setInvoice(prev => ({
//                           ...prev,
//                           bankDetails: { ...prev.bankDetails, branch: e.target.value }
//                         }))}
//                       />
//                     </div>
//                   </div>
//                 </div>

//                 {/* Totals */}
//                 <div className="form-group">
//                   <h3 className="group-title">
//                     <i className="fas fa-calculator"></i> Invoice Summary
//                   </h3>
//                   <div className="form-row">
//                     <div className="form-col">
//                       <label>Sub Total (₹)</label>
//                       <input 
//                         type="text" 
//                         name="totalAmount" 
//                         value={invoice.totalAmount.toLocaleString()} 
//                         readOnly
//                       />
//                     </div>
//                     <div className="form-col">
//                       <label>SGST (₹)</label>
//                       <input 
//                         type="text" 
//                         name="totalSGST" 
//                         value={invoice.totalSGST.toLocaleString()} 
//                         readOnly
//                       />
//                     </div>
//                     <div className="form-col">
//                       <label>CGST (₹)</label>
//                       <input 
//                         type="text" 
//                         name="totalCGST" 
//                         value={invoice.totalCGST.toLocaleString()} 
//                         readOnly
//                       />
//                     </div>
//                   </div>
//                   <div className="form-row">
//                     <div className="form-col full-width">
//                       <label>Grand Total (₹)</label>
//                       <input 
//                         type="text" 
//                         name="grandTotal" 
//                         value={invoice.grandTotal.toLocaleString()} 
//                         readOnly
//                         className="grand-total"
//                       />
//                     </div>
//                   </div>
//                 </div>

//                 {/* Action Buttons */}
//      <div className="action-buttons">
//   <div className="tooltip-wrapper">
//     <button
//       className="save-btn"
//       onClick={handleSubmit}
//       disabled={!isFormComplete()}
//     >
//       <i className="fas fa-save"></i> Save Invoice
//     </button>
//     {!isFormComplete() && (
//       <p className="error-message">Fill All The Data !</p>
//     )}
//   </div>

//   <div className="tooltip-wrapper">
//     <button
//       className="download-btn"
//       onClick={() => downloadPDF(invoice)}
//       disabled={!isFormComplete()}
//     >
//       <i className="fas fa-download"></i> Download PDF
//     </button>
//     {!isFormComplete() && (
//       <p className="error-message">Fill All The Data !</p>
//     )}
//   </div>
// </div>




//               </div>
//             </div>

//             {/* Invoice Preview */}
//             <div className="preview-section">
//               <div className="preview-card">
//                 <h2 className="section-title">
//                   <i className="fas fa-eye"></i> Invoice Preview
//                 </h2>
//                 <div id="invoice-preview" className="invoice-preview">
//                   {/* Company Header */}
                  
                 
//                   <div className="invoice-header">
//                     <h2 className="company-name">{invoice.agencyName}</h2>
//                     <p className="company-tagline">Premium Water Solutions | BlueSip Brand</p>
//                     <p className="company-address">{invoice.agencyAddress}</p>
//                     <p className="company-contact">
//                       Phone: {invoice.agencyPhone} | Email: {invoice.agencyEmail} | GSTIN: {invoice.agencyGSTIN}
//                     </p>
//                     <div className="divider"></div>
//                   </div>
                  
//                   {/* Customer Info */}
//                   <div className="customer-info">
//                     <div className="billed-to">
//                       <h3>Billed To:</h3>
//                       <p>{invoice.customer.name}</p>
//                       <p>{invoice.customer.address}</p>
//                       <p>Phone: {invoice.customer.phone} {invoice.customer.gst && `| GST: ${invoice.customer.gst}`}</p>
//                     </div>
//                     <div className="invoice-details">
//                       <h3>Invoice Details:</h3>
//                       <p>Invoice No: {invoice.invoiceNo}</p>
//                       <p>Date: {invoice.date}</p>
//                       <p>Due Date: {invoice.dueDate}</p>
//                     </div>
//                   </div>

//                   {/* Items Table */}
//                   <div className="invoice-table-container">
//                     <table className="invoice-table">
//                       <thead>
//                         <tr>
//                           <th>Sr.No.</th>
//                           <th>Description</th>
//                           <th>HSN</th>
//                           <th>Qty</th>
//                           <th>Rate (₹)</th>
//                           <th>SGST %</th>
//                           <th>CGST %</th>
//                           <th>Amount (₹)</th>
//                         </tr>
//                       </thead>
//                       <tbody>
//                         {invoice.items.map((item, index) => (
//                           <tr key={index}>
//                             <td>{item.sn}</td>
//                             <td>{item.description}</td>
//                             <td>{item.hsn}</td>
//                             <td>{item.qty}</td>
//                             <td>₹{item.rate.toLocaleString()}</td>
//                             <td>{item.sgst}%</td>
//                             <td>{item.cgst}%</td>
//                             <td>₹{item.amount.toLocaleString()}</td>
//                           </tr>
//                         ))}
//                       </tbody>
//                     </table>
//                   </div>
                  
//                   {/* Totals */}
//                   <div className="invoice-totals">
//                     <table>
//                       <tbody>
//                         <tr>
//                           <td><strong>Sub Total:</strong></td>
//                           <td>₹{invoice.totalAmount.toLocaleString()}</td>
//                         </tr>
//                         <tr>
//                           <td><strong>SGST:</strong></td>
//                           <td>₹{invoice.totalSGST.toLocaleString()}</td>
//                         </tr>
//                         <tr>
//                           <td><strong>CGST:</strong></td>
//                           <td>₹{invoice.totalCGST.toLocaleString()}</td>
//                         </tr>
//                         <tr className="grand-total-row">
//                           <td><strong>Grand Total:</strong></td>
//                           <td>₹{invoice.grandTotal.toLocaleString()}</td>
//                         </tr>
//                       </tbody>
//                     </table>
//                   </div>
                  
//                   {/* Amount in Words */}
//                   <div className="amount-in-words">
//                     <p><strong>Amount in Words:</strong> {numberToWords(invoice.grandTotal)} Only</p>
//                   </div>
                  
//                   {/* Terms & Bank Details */}
//                   <div className="terms-bank">
//                     <div className="terms">
//                       <h3>Terms & Conditions:</h3>
//                       <ol>
//                         <li>Goods once sold will not be taken back or exchanged.</li>
//                         <li>Payment due within 30 days from invoice date.</li>
//                         <li>Interest @18% p.a. will be charged on overdue payments.</li>
//                       </ol>
//                     </div>
//                     <div className="bank-details">
//                       <h3>Bank Details:</h3>
//                       <p>{invoice.bankDetails.bankName}</p>
//                       <p>A/C No: {invoice.bankDetails.accountNo}</p>
//                       <p>IFSC: {invoice.bankDetails.ifsc}</p>
//                       <p>Branch: {invoice.bankDetails.branch}</p>
//                     </div>
//                   </div>
                  
//                   {/* Signature */}
//                   <div className="signature-section">
//                     <div className="customer-signature">
//                       <p><strong>Customer Signature</strong></p>
//                       <div className="signature-line"></div>
//                     </div>
//                     <div className="company-signature">
//                       <p><strong>For {invoice.agencyName}</strong></p>
//                       <div className="signature-line"></div>
//                       <p className="signatory">Authorized Signatory</p>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </>
//     )
// }

// // Number to words function
// function numberToWords(num) {
//   const single = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine'];
//   const double = ['Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];
//   const tens = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];
//   const formatTenth = (digit, prev) => {
//     return 0 === digit ? '' : ' ' + (1 === digit ? double[prev] : tens[digit]);
//   };
//   const formatOther = (digit, next, denom) => {
//     return (0 !== digit && 1 !== next ? ' ' + single[digit] : '') + (0 !== next || digit > 0 ? ' ' + denom : '');
//   };

//   let str = '';
//   let rupees = parseFloat(num) || 0;
//   rupees = Math.round(rupees * 100) / 100;
  
//   if (rupees === 0) return 'Zero Rupees';
  
//   const strRupees = rupees.toString().split('.');
//   let whole = parseInt(strRupees[0], 10);
  
//   // Handle whole number part
//   if (whole > 0) {
//     let digits = whole % 100;
//     if (digits > 0) {
//       const units = digits % 10;
//       digits = Math.floor(digits / 10);
//       const tensPlace = formatTenth(digits, units);
//       const onesPlace = digits > 1 && units > 0 ? ' ' + single[units] : units > 0 ? single[units] : '';
//       str = tensPlace + onesPlace;
//     }
    
//     whole = Math.floor(whole / 100);
//     if (whole > 0) {
//       str = single[whole] + ' Hundred' + (str ? ' and ' + str : '');
//     }
//   }
  
//   return str + ' Rupees' + (strRupees[1] ? ' and ' + single[parseInt(strRupees[1])] + ' Paise' : '');
// }

// export default CreateTab;

import React, { useState, useEffect } from "react";
import axios from "axios";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from 'react-toastify';

const CreateTab = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState({
    Id: "N/A",
    Name: "N/A",
    Email: "N/A"
  });

  const [invoice, setInvoice] = useState({
    sellerName: "RADHE AQUATECH",
    sellerAddress: "INDORE (M.P.)",
    sellerGSTIN: "23ABLFR5012K1Z7",
    sellerState: "Madhya Pradesh, Code : 452001",

    buyer: {
      name: "",
      address: "",
      state: "",
      buyerGSTIN:"",
    },

    invoiceNo: "",
    invoiceDate: new Date().toLocaleDateString('en-GB').split('/').join('-'),
    deliveryNote: "DN456",
    deliveryNoteDate: new Date().toLocaleDateString('en-GB').split('/').join('-'),
    dispatchDocNo: "DOC789",
    dispatchedThrough: "Courier XYZ",
    destination: "Indore",
    termsOfDelivery: "On Time",
    paymentTerms: "Prepaid",

    items: [{
      srNo: 1,
      description: " Water 1L",
      bottleType: "1L",
      hsnCode: "2201",
      quantity: 10,
      rate: 140.00,
      amount: 1400.00
    }],

    taxableValue: 200.00,
    grandTotal: 200.00,
    amountInWords: "Indian Rupees Two Hundred Only"
  });

  const bottleTypes = ["200ml", "500ml", "1L"];
  const [invoices, setInvoices] = useState([]);
  const [lastInvoiceNo, setLastInvoiceNo] = useState(0);
  const [lastDownloadedInvoiceNo, setLastDownloadedInvoiceNo] = useState(null);
 const [showConfirmModal, setShowConfirmModal] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/");
        return;
      }

      try {
        const decoded = jwtDecode(token);
        const userId = decoded.id;

        const response = await axios.get(`https://bluesip-backend.onrender.com/api/users/${userId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        if (response.data) {
          setUser(response.data);
        } else {
          localStorage.removeItem("token");
          navigate("/");
        }
      } catch (error) {
        console.error("Authentication error:", error);
        localStorage.removeItem("token");
        navigate("/");
      }
    };

    checkAuth();
    fetchLastInvoiceNo();
  }, [navigate]);

  const fetchLastInvoiceNo = async () => {
    try {
      const res = await axios.get("https://bluesip-backend.onrender.com/api/invoices/last");
      const lastNo = res.data ? parseInt(res.data.invoiceNo.replace('BL', '')) || 0 : 0;
      setLastInvoiceNo(lastNo);
      generateNewInvoiceNo(lastNo);
    } catch (error) {
      console.error("Error fetching last invoice:", error);
      generateNewInvoiceNo(0);
    }
  };

  const generateNewInvoiceNo = (lastNo) => {
    const newNo = lastNo + 1;
    const paddedNo = newNo.toString().padStart(4, '0');
    setInvoice(prev => ({
      ...prev,
      invoiceNo: `BL${paddedNo}`
    }));
    setLastInvoiceNo(newNo);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setInvoice(prev => ({ ...prev, [name]: value }));
  };

  // const handleBuyerChange = (e) => {
  //   const { name, value } = e.target;
  //   setInvoice(prev => {
  //     const updatedBuyer = { ...prev.buyer, [name]: value };
      
  //     // Update all item descriptions when buyer name changes
  //     const updatedItems = prev.items.map(item => ({
  //       ...item,
  //       description: `${value} Water ${item.bottleType}`
  //     }));
      
  //     return { 
  //       ...prev, 
  //       buyer: updatedBuyer,
  //       items: updatedItems
  //     };
  //   });
  // };


  const handleBuyerChange = (e) => {
  const { name, value } = e.target;
  setInvoice(prev => {
    const updatedBuyer = { ...prev.buyer, [name]: value };
    
    // Only update descriptions if the buyer name changed
    let updatedItems = prev.items;
    if (name === 'name') {
      updatedItems = prev.items.map(item => ({
        ...item,
        description: `${value} Water ${item.bottleType}`
      }));
    }
    
    return { 
      ...prev, 
      buyer: updatedBuyer,
      items: updatedItems
    };
  });
};


  const calculateItemAmount = (item) => {
    const rate = typeof item.rate === 'number' ? item.rate : parseFloat(item.rate) || 0;
    const quantity = typeof item.quantity === 'number' ? item.quantity : parseFloat(item.quantity) || 0;
    return parseFloat((rate * quantity).toFixed(2));
  };

  const handleItemChange = (e, index) => {
    const { name, value } = e.target;
    const items = [...invoice.items];
    
    const parsedValue = ['rate', 'quantity', 'amount'].includes(name) 
      ? parseFloat(value) || 0
      : value;
        
    items[index] = { ...items[index], [name]: parsedValue };
    
    if (name === 'bottleType') {
      // Update description when bottle type changes
      items[index].description = `${invoice.buyer.name} Water ${value}`;
    }
    
    if (['rate', 'quantity'].includes(name)) {
      items[index].amount = calculateItemAmount(items[index]);
    }
    
    setInvoice(prev => ({ ...prev, items }));
    calculateTotals(items);
  };

  const calculateTotals = (items) => {
    const taxableValue = items.reduce((sum, item) => {
      const amount = typeof item.amount === 'number' ? item.amount : parseFloat(item.amount) || 0;
      return sum + amount;
    }, 0);
    
    const grandTotal = parseFloat(taxableValue.toFixed(2));
    const amountInWords = numberToWords(grandTotal);

    setInvoice(prev => ({
      ...prev,
      taxableValue,
      grandTotal,
      amountInWords
    }));
  };

  const addItem = () => {
    const newItem = {
      srNo: invoice.items.length + 1,
      description: `${invoice.buyer.name} Water 1L`,
      bottleType: "1L",
      hsnCode: "2201",
      quantity: 1,
      rate: 0,
      amount: 0
    };
    
    setInvoice(prev => ({
      ...prev,
      items: [...prev.items, newItem]
    }));
    
    calculateTotals([...invoice.items, newItem]);
  };

  const removeItem = (index) => {
    if (invoice.items.length <= 1) return;
    const items = invoice.items.filter((_, i) => i !== index);
    const updatedItems = items.map((item, idx) => ({ ...item, srNo: idx + 1 }));
    setInvoice(prev => ({ ...prev, items: updatedItems }));
    calculateTotals(updatedItems);
  };

  const saveInvoiceToDB = async (invoiceData) => {
    try {
      const res = await axios.post("https://bluesip-backend.onrender.com/api/invoice", invoiceData);
      toast.success("Invoice saved successfully!");
      setInvoices([...invoices, res.data]);
      return res.data;
    } catch (error) {
      console.error("Error saving invoice:", error);
      toast.error("Failed to save invoice");
      throw error;
    }
  };

  const isBuyerInfoComplete = () => {
    return invoice.buyer.name && invoice.buyer.state && invoice.buyer.address;
  };

  const downloadPDF = async (invoiceData) => {
    try {
      // Check if this invoice has already been downloaded
      if (lastDownloadedInvoiceNo === invoiceData.invoiceNo) {
        toast.warning("This invoice has already been downloaded!");
        return;
      }

      // First save the invoice to database
      const savedInvoice = await saveInvoiceToDB(invoiceData);
      
      // Update last downloaded invoice number
      setLastDownloadedInvoiceNo(savedInvoice.invoiceNo);
      
      // Generate new invoice number for next time
      const newNo = parseInt(savedInvoice.invoiceNo.replace('BL', '')) + 1;
      setLastInvoiceNo(newNo);
      generateNewInvoiceNo(newNo);

      // Ensure all numeric values are properly formatted
      const formattedInvoice = {
        ...savedInvoice,
        items: savedInvoice.items.map(item => ({
          ...item,
          rate: parseFloat(item.rate) || 0,
          quantity: parseFloat(item.quantity) || 0,
          amount: parseFloat(item.amount) || 0
        })),
        taxableValue: parseFloat(savedInvoice.taxableValue) || 0,
        grandTotal: parseFloat(savedInvoice.grandTotal) || 0
      }; 
      const maxRows = 3;
const currentRows = formattedInvoice.items.length;
const emptyRowsNeeded = maxRows - currentRows;

const itemRows = formattedInvoice.items.map(item => `
  <tr>
    <td style="padding: 5px; text-align: center; border-right:1px solid #000;border-bottom:none !important;">${item.srNo}</td>
    <td style="padding: 5px; border-right:1px solid #000;border-bottom:none !important;">${item.description}</td>
    <td style="padding: 5px; text-align: center; border-right:1px solid #000;border-bottom:none !important;">${item.hsnCode}</td>
    <td style="padding: 5px; text-align: center; border-right:1px solid #000;border-bottom:none !important;">${item.quantity} Case</td>
    <td style="padding: 5px; text-align: center;border-right:1px solid #000;border-bottom:none !important;">${Number(item.rate).toFixed(2)}</td>
    <td style="padding: 5px; text-align: center;border-right:1px solid #000;border-bottom:none !important;">Case</td>
    <td style="padding: 5px; text-align: right;border-bottom:none !important;">${Number(item.amount).toFixed(2)}</td>
  </tr>
`).join('');

const emptyRows = Array.from({ length: emptyRowsNeeded }, () => `
  <tr style="height: 30px;">
    <td style="border-right:1px solid #000; border-bottom:none !important;"></td>
    <td style="border-right:1px solid #000; border-bottom:none !important;"></td>
    <td style="border-right:1px solid #000; border-bottom:none !important;"></td>
    <td style="border-right:1px solid #000; border-bottom:none !important;"></td>
    <td style="border-right:1px solid #000;border-bottom:none !important;"></td>
    <td style="border-right:1px solid #000; border-bottom:none !important;"></td>
    <td style="border-bottom:none !important;"></td>
  </tr>
`).join('');


      const tempDiv = document.createElement('div');
      tempDiv.style.width = '210mm';
     tempDiv.style.fontSize = '10px';
     tempDiv.style.padding = '5px';
      tempDiv.style.background = '#ffffff';
      tempDiv.style.fontFamily = 'Arial, sans-serif';
      tempDiv.style.color = '#000000';
      
      tempDiv.innerHTML = `
        <!-- Main Border Wrapper -->
        <div style="border: 1px solid #000; font-family: sans-serif; font-size: 10px; padding: 0;">

          <!-- Title -->
          <div style="text-align:center; font-weight:bold; font-size:12px; padding: 7px 0; border-bottom: 1px solid #000;">
            BILL OF SUPPLY
          </div>

          <!-- Seller/Buyer + Invoice Details -->
          <div style="display: flex; width: 100%; box-sizing: border-box;">

            <!-- Seller + Buyer -->
            <div style="width: 45%; border-right: 1px solid #000; ">
              <!-- Seller -->
              <div style="margin-bottom: 10px; margin-top: 5px; border-bottom: 1px solid #000; padding: 5px 10px;">
                <p><strong>${formattedInvoice.sellerName}</strong></p>
                <p>${formattedInvoice.sellerAddress}</p>
                <p>(Composition Dealer)</p>
                <p>GSTIN: ${formattedInvoice.sellerGSTIN}</p>
                <p>State: ${formattedInvoice.sellerState}</p>
              </div>

              <!-- Buyer -->
              <div style="padding: 2px 10px; ">
                <p><strong>Buyer(Bill To)</strong><br>${formattedInvoice.buyer.name}</p> 
                <p>GSTIN: ${formattedInvoice.buyer.buyerGSTIN}</p>
                <p>State: ${formattedInvoice.buyer.state}</p>
              </div>
            </div>

            <!-- Invoice Details -->
            <div style="width: 55%; box-sizing: border-box;">
              <table style="width: 100%; border-collapse: collapse; font-size: 11px;">
                <tr>
                  <td style="border: 1px solid #000; border-top:none; border-left:none; padding: 5px;"><strong>Invoice No.</strong>: ${formattedInvoice.invoiceNo}</td>
                  <td style="border: 1px solid #000; border-top:none; border-left:none;border-right:none;padding: 5px;"><strong>Dated</strong>: ${formatDateForPDF(formattedInvoice.invoiceDate)}</td>
                </tr>
                <tr>
                  <td style="border: 1px solid #000; border-top:none; border-left:none; padding: 5px;"><strong>Delivery Note</strong>: ${formattedInvoice.deliveryNote}</td>
                  <td style="border: 1px solid #000; border-top:none; border-left:none;border-right:none; padding: 5px;"><strong>Mode/Terms of Payment</strong>: ${formattedInvoice.paymentTerms}</td>
                </tr>
                <tr>
                  <td style="border: 1px solid #000; border-top:none; border-left:none; padding: 5px;"><strong>Dispatch Doc No</strong>: ${formattedInvoice.dispatchDocNo}</td>
                  <td style="border: 1px solid #000; border-top:none; border-left:none; border-right:none; padding: 5px;"><strong>Delivery Note Date</strong>: ${formatDateForPDF(formattedInvoice.deliveryNoteDate)}</td>
                </tr>
                <tr>
                  <td style="border: 1px solid #000; border-top:none; border-left:none; padding: 5px;"><strong>Dispatched Through</strong>: ${formattedInvoice.dispatchedThrough}</td>
                  <td style="border: 1px solid #000; border-top:none; border-left:none;border-right:none; padding: 5px;"><strong>Destination</strong>: ${formattedInvoice.destination}</td>
                </tr>
                <tr>
                  <td colspan="2" style="padding: 10px; border:none !important; "><strong>Terms of Delivery</strong>: ${formattedInvoice.termsOfDelivery}</td>
                </tr>
              </table>
            </div>
          </div>

          <!-- Invoice Items Table -->
          <table style="width: 100%; border-collapse: collapse; border-top:1px solid #000; font-size: 11px;">
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
              

                ${itemRows}
                ${emptyRows}

              <!-- Total Row -->
              <tr style="font-weight: bold;">
                <td style="padding: 8px; border: 1px solid #000;border-left:none;"></td>
                <td style="padding: 8px; text-align: right; border: 1px solid #000;border-left:none;">Total</td>
                <td style="padding: 8px; border: 1px solid #000;border-left:none;"></td>
                <td style="padding: 8px; text-align: center; border: 1px solid #000;border-left:none;">
                  ${formattedInvoice.items.reduce((sum, item) => sum + item.quantity, 0)} Case
                </td>
                <td style="padding: 8px; border: 1px solid #000;border-left:none;"></td>
                <td style="padding: 8px; border: 1px solid #000;border-left:none;"></td>
                <td style="padding: 8px; text-align: right; border: 1px solid #000; border-left:none;border-right:none">₹${formattedInvoice.grandTotal.toFixed(2)}</td>
              </tr>
            </tbody>
          </table>

          <!-- Bottom Margin After Item Rows -->
          <div style="margin-bottom: 15px;"></div>

          <!-- Total and Amount (LEFT side with increased font) -->
          <div style="display:flex; justify-content:space-between; align-item:center">
            <div style="padding-left: 15px; font-size: 12px; margin-top:-10px; margin-bottom:5px;">
              <p><strong>Amount Chargable(in Words):</strong> <br/>${formattedInvoice.amountInWords}</p>
            </div>
            <div style="padding-right: 15px; font-size: 12px;">
              <p>E. & O.E</p>
            </div>
          </div>

          <!-- Declaration + Signature Row -->
          <div style="display: flex; border-top: 1px solid #000; border-bottom: 1px solid #000; font-size: 11px; height:100px; border-bottom:none;">
            <!-- Declaration -->
            <div style="flex: 2; padding: 10px; border-right: 1px solid #000;">
              <p><strong>Declaration:</strong></p>
              <p>We declare that this invoice shows the actual price of the goods described and that all particulars are true and correct.</p>
            </div>

            <!-- Authorized Signatory -->
            <div style="flex: 1; padding: 10px; text-align: center;">
              <p><strong>Authorised Signatory</strong></p>
              <p>${formattedInvoice.sellerName}</p>
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
        scale: 1.2,
        logging: true,
        useCORS: true,
        backgroundColor: '#ffffff'
      });
      
      const imgData = canvas.toDataURL('image/png', 1.0);
      const pdf = new jsPDF({
        orientation: 'landscape',
        unit: 'mm',
        format: 'a5'
      });
      
      const imgWidth = 210;
      const pageHeight = 148;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      
      pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
      
      document.body.removeChild(tempDiv);
      
      pdf.save(`Invoice-${formattedInvoice.invoiceNo}.pdf`);
      toast.success("Invoice downloaded and saved successfully!");
    } catch (error) {
      console.error("Error generating PDF:", error);
      toast.error("Failed to generate PDF");
    }
  };

const printInvoice = async (invoiceData) => {
  try {
    // First save the invoice to database
    const savedInvoice = await saveInvoiceToDB(invoiceData);
    
    // Update last downloaded invoice number
    setLastDownloadedInvoiceNo(savedInvoice.invoiceNo);
    
    // Generate new invoice number for next time
    const newNo = parseInt(savedInvoice.invoiceNo.replace('BL', '')) + 1;
    setLastInvoiceNo(newNo);
    generateNewInvoiceNo(newNo);

    // Format the invoice data
    const formattedInvoice = {
      ...savedInvoice,
      items: savedInvoice.items.map(item => ({
        ...item,
        rate: parseFloat(item.rate) || 0,
        quantity: parseFloat(item.quantity) || 0,
        amount: parseFloat(item.amount) || 0
      })),
      taxableValue: parseFloat(savedInvoice.taxableValue) || 0,
      grandTotal: parseFloat(savedInvoice.grandTotal) || 0
    };

    // Create a hidden iframe
    const iframe = document.createElement('iframe');
    iframe.style.position = 'fixed';
    iframe.style.right = '0';
    iframe.style.bottom = '0';
    iframe.style.width = '0';
    iframe.style.height = '0';
    iframe.style.border = '0';
    iframe.style.visibility = 'hidden';
    document.body.appendChild(iframe);

    // Create the complete invoice HTML
    const invoiceHTML = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Invoice ${formattedInvoice.invoiceNo}</title>
        <style>
          @page {
            size: 148mm 210mm;
            margin: 5mm;
          }
          body {
            margin: 0;
            padding: 0;
            font-family: Arial, sans-serif;
            width: 148mm;
            background: #ffffff;
          }
          /* Main Border Wrapper */
          .border-wrapper {
            border: 1px solid #000;
            font-family: sans-serif;
            font-size: 12px;
            padding: 0;
          }
          table {
            width: 100%;
            border-collapse: collapse;
          }
          th, td {
            padding: 5px;
            text-align: left;
          }
        </style>
      </head>
      <body>
        <div style="width: 148mm; padding: 10px; background: #ffffff;">
          <!-- Main Border Wrapper -->
          <div class="border-wrapper">
            <!-- Title -->
            <div style="text-align:center; font-weight:bold; font-size:16px; padding: 10px 0; border-bottom: 1px solid #000;">
              BILL OF SUPPLY
            </div>

            <!-- Seller/Buyer + Invoice Details -->
            <div style="display: flex; width: 100%; box-sizing: border-box;">

              <!-- Seller + Buyer -->
              <div style="width: 45%; border-right: 1px solid #000; ">
                <!-- Seller -->
                <div style="margin-bottom: 10px; margin-top: 5px; border-bottom: 1px solid #000; padding: 5px 10px;">
                  <p><strong>${formattedInvoice.sellerName}</strong></p>
                  <p>${formattedInvoice.sellerAddress}</p>
                  <p>(Composition Dealer)</p>
                  <p>GSTIN: ${formattedInvoice.sellerGSTIN}</p>
                  <p>State: ${formattedInvoice.sellerState}</p>
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
                    <td style="border: 1px solid #000; border-top:none; border-left:none; padding: 5px;"><strong>Invoice No.</strong>: ${formattedInvoice.invoiceNo}</td>
                    <td style="border: 1px solid #000; border-top:none; border-left:none;border-right:none;padding: 5px;"><strong>Dated</strong>: ${formatDateForPDF(formattedInvoice.invoiceDate)}</td>
                  </tr>
                  <tr>
                    <td style="border: 1px solid #000; border-top:none; border-left:none; padding: 5px;"><strong>Delivery Note</strong>: ${formattedInvoice.deliveryNote}</td>
                    <td style="border: 1px solid #000; border-top:none; border-left:none;border-right:none; padding: 5px;"><strong>Mode/Terms of Payment</strong>: ${formattedInvoice.paymentTerms}</td>
                  </tr>
                  <tr>
                    <td style="border: 1px solid #000; border-top:none; border-left:none; padding: 5px;"><strong>Dispatch Doc No</strong>: ${formattedInvoice.dispatchDocNo}</td>
                    <td style="border: 1px solid #000; border-top:none; border-left:none; border-right:none; padding: 5px;"><strong>Delivery Note Date</strong>: ${formatDateForPDF(formattedInvoice.deliveryNoteDate)}</td>
                  </tr>
                  <tr>
                    <td style="border: 1px solid #000; border-top:none; border-left:none; padding: 5px;"><strong>Dispatched Through</strong>: ${formattedInvoice.dispatchedThrough}</td>
                    <td style="border: 1px solid #000; border-top:none; border-left:none;border-right:none; padding: 5px;"><strong>Destination</strong>: ${formattedInvoice.destination}</td>
                  </tr>
                  <tr>
                    <td colspan="2" style="padding: 10px;"><strong>Terms of Delivery</strong>: ${formattedInvoice.termsOfDelivery}</td>
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
                    <td style="padding: 5px; text-align: center; border-right:1px solid #000;">${item.srNo}</td>
                    <td style="padding: 5px; border-right:1px solid #000;">${item.description}</td>
                    <td style="padding: 5px; text-align: center; border-right:1px solid #000;">${item.hsnCode}</td>
                    <td style="padding: 5px; text-align: center; border-right:1px solid #000;">${item.quantity} Case</td>
                    <td style="padding: 5px; text-align: center;border-right:1px solid #000;">${Number(item.rate).toFixed(2)}</td>
                    <td style="padding: 5px; text-align: center;border-right:1px solid #000;">Case</td>
                    <td style="padding: 5px; text-align: right;">${Number(item.amount).toFixed(2)}</td>
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
                    ${formattedInvoice.items.reduce((sum, item) => sum + item.quantity, 0)} Case
                  </td>
                  <td style="padding: 8px; border: 1px solid #000;border-left:none;"></td>
                  <td style="padding: 8px; border: 1px solid #000;border-left:none;"></td>
                  <td style="padding: 8px; text-align: right; border: 1px solid #000; border-left:none;border-right:none">₹${formattedInvoice.grandTotal.toFixed(2)}</td>
                </tr>
              </tbody>
            </table>

            <!-- Bottom Margin After Item Rows -->
            <div style="margin-bottom: 15px;"></div>

            <!-- Total and Amount (LEFT side with increased font) -->
            <div style="display:flex; justify-content:space-between; align-item:center">
              <div style="padding-left: 15px; font-size: 13px; margin-top:-10px; margin-bottom:5px;">
                <p><strong>Amount Chargable(in Words):</strong> <br/>${formattedInvoice.amountInWords}</p>
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
                <p>${formattedInvoice.sellerName}</p>
              </div>
            </div>
          </div>

          <!-- Footer -->
          <div style="text-align:center; font-size:10px; font-weight:bold; padding: 15px 0;">
            This is a Computer Generated Invoice.
          </div>
        </div>
      </body>
      </html>
    `;

    // Write the HTML to the iframe
    iframe.contentDocument.open();
    iframe.contentDocument.write(invoiceHTML);
    iframe.contentDocument.close();

    // Wait for content to load then print
    iframe.onload = function() {
      setTimeout(() => {
        try {
          iframe.contentWindow.focus();
          iframe.contentWindow.print();
        } catch (e) {
          console.error("Print error:", e);
          toast.error("Failed to automatically print. Please use the browser's print dialog.");
        }
        
        // Remove the iframe after printing
        setTimeout(() => {
          document.body.removeChild(iframe);
        }, 1000);
      }, 500);
    };

  } catch (error) {
    console.error("Error printing invoice:", error);
    toast.error("Failed to print invoice");
  }
};

  const formatDateForPDF = (dateString) => {
    if (!dateString) return "";
    const [day, month, year] = dateString.split('-');
    return `${day}/${month}/${year}`;
  };

  const resetForm = () => {
    const newNo = lastInvoiceNo + 1;
    generateNewInvoiceNo(newNo);
    
    setInvoice(prev => ({
      ...prev,
      sellerName: "RADHE AQUATECH",
      sellerAddress: "INDORE (M.P.)",
      sellerGSTIN: "23ABFPS0516K1Z7",
      sellerState: "Madhya Pradesh, Code : 452001",

      buyer: {
        name: "APNA SWEETS",
        address: "",
        state: "Madhya Pradesh"
      },

      invoiceDate: new Date().toLocaleDateString('en-GB').split('/').join('-'),
      deliveryNote: "DN456",
      deliveryNoteDate: new Date().toLocaleDateString('en-GB').split('/').join('-'),
      dispatchDocNo: "DOC789",
      dispatchedThrough: "Courier XYZ",
      destination: "Indore",
      termsOfDelivery: "On Time",
      paymentTerms: "Prepaid",

      items: [{
        srNo: 1,
        description: " Water 1L",
        bottleType: "1L",
        hsnCode: "2201",
        quantity: 10,
        rate: 20.00,
        amount: 200.00
      }],

      taxableValue: 200.00,
      grandTotal: 200.00,
      amountInWords: "Indian Rupees Two Hundred Only"
    }));
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const [day, month, year] = dateString.split('-');
    return `${day}/${month}/${year}`;
  };

  function numberToWords(num) {
    const single = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine'];
    const double = ['Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];
    const tens = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];
    const format = { crore: 10000000, lakh: 100000, thousand: 1000, hundred: 100 };
    
    function convertLessThanOneThousand(n) {
      if (n === 0) return '';
      if (n < 10) return single[n];
      if (n < 20) return double[n - 10];
      if (n < 100) return tens[Math.floor(n / 10)] + (n % 10 !== 0 ? ' ' + single[n % 10] : '');
      return single[Math.floor(n / 100)] + ' Hundred' + (n % 100 !== 0 ? ' and ' + convertLessThanOneThousand(n % 100) : '');
    }

    function convert(n) {
      if (n === 0) return 'Zero Rupees';
      let result = '';
      
      for (const [unit, value] of Object.entries(format)) {
        if (n >= value) {
          const count = Math.floor(n / value);
          result += convertLessThanOneThousand(count) + ' ' + unit + ' ';
          n %= value;
        }
      }
      
      if (n > 0) {
        if (result !== '') result += 'and ';
        result += convertLessThanOneThousand(n);
      }
      
      return result.trim();
    }

    const rupees = Math.floor(num);
    const paise = Math.round((num - rupees) * 100);
    
    let result = convert(rupees) + ' Rupees';
    if (paise > 0) {
      result += ' and ' + convertLessThanOneThousand(paise) + ' Paise';
    }
    
    return result + ' Only';
  }

  return (
    <>
      <ToastContainer />
      <div className="invoice-containerr">
        <div className="form-section">
          <div className="form-card">
            <h2 className="section-title">
              <i className="fas fa-file-alt"></i> Create New Invoice
            </h2>
            
            {/* Seller Information */}
            <div className="form-group">
              <h3 className="group-title">
                <i className="fas fa-building"></i> Seller Information
              </h3>
              <div className="form-row">
                <div className="form-col">
                  <label>Seller Name</label>
                  <input 
                    type="text" 
                    name="sellerName" 
                    value={invoice.sellerName} 
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="form-col">
                  <label>GSTIN</label>
                  <input 
                    type="text" 
                    name="sellerGSTIN" 
                    value={invoice.sellerGSTIN} 
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
              <div className="form-row">
                <div className="form-col full-width">
                  <label>Address</label>
                  <textarea 
                    name="sellerAddress" 
                    value={invoice.sellerAddress} 
                    onChange={handleChange}
                    rows="2"
                    required
                  ></textarea>
                </div>
              </div>
              <div className="form-row">
                <div className="form-col">
                  <label>State</label>
                  <input 
                    type="text" 
                    name="sellerState" 
                    value={invoice.sellerState} 
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
            </div>

            {/* Buyer Information */}
            <div className="form-group">
              <h3 className="group-title">
                <i className="fas fa-user-tie"></i> Buyer Details
              </h3>
              <div className="form-row">
                <div className="form-col">
                  <label>Buyer Name</label>
                  <input 
                    type="text" 
                    name="name" 
                    value={invoice.buyer.name} 
                    onChange={handleBuyerChange}
                    placeholder="Enter Buyer's Name"
                    required
                  />
                </div>
              </div>
                <div className="form-row">
                <div className="form-col">
                  <label>Buyer GSTIN</label>
                  <input 
                    type="text" 
                    name="buyerGSTIN" 
                    value={invoice.buyer.buyerGSTIN} 
                    onChange={handleBuyerChange}
                    placeholder="Enter Buyer's GSTIN"
                    
                  />
                </div>
              </div>
              <div className="form-row">
                <div className="form-col full-width">
                  <label>Address</label>
                  <textarea 
                    name="address" 
                    value={invoice.buyer.address} 
                    onChange={handleBuyerChange}
                    rows="2"
                    placeholder="Enter Buyer's Address"
                  ></textarea>
                </div>
              </div>
              <div className="form-row">
                <div className="form-col">
                  <label>State</label>
                  <input 
                    type="text" 
                    name="state" 
                    value={invoice.buyer.state} 
                    onChange={handleBuyerChange}
                    placeholder="Enter State"
                  />
                </div>
              </div>
            </div>

            {/* Invoice Details */}
            <div className="form-group">
              <h3 className="group-title">
                <i className="fas fa-info-circle"></i> Invoice Details
              </h3>
              <div className="form-row">
                <div className="form-col">
                  <label>Invoice No</label>
                  <input 
                    type="text" 
                    name="invoiceNo" 
                    value={invoice.invoiceNo} 
                    readOnly
                  />
                </div>
                <div className="form-col">
                  <label>Date</label>
                  <input 
                    type="text" 
                    name="invoiceDate" 
                    value={invoice.invoiceDate} 
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div className="form-row">
                <div className="form-col">
                  <label>Delivery Note</label>
                  <input 
                    type="text" 
                    name="deliveryNote" 
                    value={invoice.deliveryNote} 
                    onChange={handleChange}
                  />
                </div>
                <div className="form-col">
                  <label>Delivery Note Date</label>
                  <input 
                    type="text" 
                    name="deliveryNoteDate" 
                    value={invoice.deliveryNoteDate} 
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div className="form-row">
                <div className="form-col">
                  <label>Dispatch Doc No</label>
                  <input 
                    type="text" 
                    name="dispatchDocNo" 
                    value={invoice.dispatchDocNo} 
                    onChange={handleChange}
                  />
                </div>
                <div className="form-col">
                  <label>Dispatched Through</label>
                  <input 
                    type="text" 
                    name="dispatchedThrough" 
                    value={invoice.dispatchedThrough} 
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div className="form-row">
                <div className="form-col">
                  <label>Destination</label>
                  <input 
                    type="text" 
                    name="destination" 
                    value={invoice.destination} 
                    onChange={handleChange}
                  />
                </div>
                <div className="form-col">
                  <label>Payment Terms</label>
                  <input 
                    type="text" 
                    name="paymentTerms" 
                    value={invoice.paymentTerms} 
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div className="form-row">
                <div className="form-col full-width">
                  <label>Terms of Delivery</label>
                  <input 
                    type="text" 
                    name="termsOfDelivery" 
                    value={invoice.termsOfDelivery} 
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>

            {/* Items Table */}
            <div className="form-group">
              <div className="group-header">
                <h3 className="group-title">
                  <i className="fas fa-boxes"></i> Products
                </h3>
             <button 
                    className="Button" 
                    onClick={addItem} 
                    disabled={invoice.items.length >=3}
                    
                  >
              <i className="fas fa-plus"></i> Add Item
            </button>

              </div>
              
              <div className="table-container">
                <table className="items-table">
                  <thead>
                    <tr>
                      <th>Sr.No.</th>
                      <th>Description</th>
                      <th>Bottle Type</th>
                      <th>HSN Code</th>
                      <th>Qty</th>
                      <th>Rate (₹)</th>
                      <th>Amount (₹)</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {invoice.items.map((item, index) => (
                      <tr key={index}>
                        <td>{item.srNo}</td>
                        <td>
                          <input 
                            type="text" 
                            name="description" 
                            value={item.description} 
                            onChange={(e) => handleItemChange(e, index)}
                            required 
                            className="Description"
                          />
                        </td>
                        <td>
                          <select
                            name="bottleType"
                            value={item.bottleType}
                            onChange={(e) => handleItemChange(e, index)}
                            className="bottle-type"
                            style={{width:"100px"}}
                          >
                            {bottleTypes.map(type => (
                              <option key={type} value={type}>{type}</option>
                            ))}
                          </select>
                        </td>
                        <td>
                          <input 
                            type="text" 
                            name="hsnCode" 
                            value={item.hsnCode} 
                            onChange={(e) => handleItemChange(e, index)}
                            required
                          />
                        </td>
                        <td>
                          <input 
                            type="number" 
                            name="quantity" 
                            value={item.quantity} 
                            onChange={(e) => handleItemChange(e, index)}
                            min="1"
                            required
                          />
                        </td>
                        <td>
                          <input 
                            type="number" 
                            name="rate" 
                            value={item.rate} 
                            onChange={(e) => handleItemChange(e, index)}
                            min="0"
                            step="1"
                            required
                          />
                        </td>
                        <td>{item.amount.toFixed(2)}</td>
                        <td>
                          {invoice.items.length > 1 && (
                            <button 
                              className="remove-btn"
                              onClick={() => removeItem(index)}
                            >
                              <i className="fas fa-trash"></i>
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Amount Calculation */}
            <div className="form-group">
              <h3 className="group-title">
                <i className="fas fa-calculator"></i> Amount Calculation
              </h3>
              <div className="form-row">
                <div className="form-col full-width">
                  <label>Total Amount (₹)</label>
                  <input 
                    type="text" 
                    value={invoice.grandTotal.toFixed(2)} 
                    readOnly
                    className="grand-total"
                  />
                </div>
              </div>
              <div className="form-row">
                <div className="form-col full-width">
                  <label>Amount in Words</label>
                  <textarea 
                    value={invoice.amountInWords} 
                    readOnly
                    rows="2"
                  ></textarea>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="action-buttons">
            
               <div className="tooltip-container">
            <button
              className={`Button ${!isBuyerInfoComplete() ? 'disabled' : ''}`}
              onClick={() => setShowConfirmModal(true)}
              disabled={!isBuyerInfoComplete()}
            >
              <i className="fas fa-download"></i> Download PDF
            </button>
            {!isBuyerInfoComplete() && (
              <span className="tooltip-text">Please fill all buyer information</span>
            )}
          </div>

               <button 
          onClick={()=>printInvoice(invoice)} 
       className={`Button ${!isBuyerInfoComplete() ? 'disabled' : ''}`}
    >
      <i className="fas fa-print"></i> Print Invoice
    </button>

              <button className="Button" onClick={resetForm}>
                <i className="fas fa-file-alt"></i> New Invoice
              </button>
            </div>
          </div>
        </div>


{showConfirmModal && (
  <div className="modal-overlay">
    <div className=" Warning-modal-content">
      <h2>Confirm Download</h2>
      <p>Are you sure you want to download this invoice?</p>
      <div className="modal-actions">
        <button
          onClick={() => {
            downloadPDF(invoice)
            setShowConfirmModal(false);
            
          }}
          className="confirm-button delete-confirm"
          style={{marginRight:"10px"}}
        >
          Yes, Download
        </button>
        <button className="cancel-button" onClick={() => setShowConfirmModal(false)}>Cancel</button>
      </div>
    </div>
  </div>
)}

        {/* Preview Invoice Section */}
        <div className="preview-section">
          <div className="preview-card">
            <h2 className="section-title">
              <i className="fas fa-eye"></i> Invoice Preview
            </h2>
            <div  style={{ 
              border: '1px solid #000', 
              fontFamily: 'sans-serif', 
              fontSize: '12px', 
              padding: '0',
              width: '210mm',
              margin: '0 auto',
              background: '#fff'
            }}>
              {/* Title */}
              <div style={{
                textAlign: 'center', 
                fontWeight: 'bold', 
                fontSize: '16px', 
                padding: '10px 0', 
                borderBottom: '1px solid #000'
              }}>
                BILL OF SUPPLY
              </div>

              {/* Seller/Buyer + Invoice Details */}
              <div style={{ 
                display: 'flex', 
                width: '100%', 
                boxSizing: 'border-box'
              }}>
                {/* Seller + Buyer */}
                <div style={{ 
                  width: '45%', 
                  borderRight: '1px solid #000'
                }}>
                  {/* Seller */}
                  <div style={{ 
                    marginBottom: '10px', 
                    marginTop: '5px', 
                    borderBottom: '1px solid #000', 
                    padding: '5px 10px'
                  }}>
                    <p><strong>{invoice.sellerName}</strong></p>
                    <p>{invoice.sellerAddress}</p>
                    <p>(Composition Dealer)</p>
                    <p>GSTIN: {invoice.sellerGSTIN}</p>
                    <p>State: {invoice.sellerState}</p>
                  </div>

                  {/* Buyer */}
                  <div style={{ padding: '5px 10px' }}>
                    <p><strong>Buyer(Bill To)</strong><br/>{invoice.buyer.name}</p> 
                    <p>GSTIN: {invoice.buyer.buyerGSTIN}</p>
                    <p>State: {invoice.buyer.state}</p>
                  </div>
                </div>

                {/* Invoice Details */}
                <div style={{ 
                  width: '55%', 
                  boxSizing: 'border-box'
                }}>
                  <table style={{ 
                    width: '100%', 
                    borderCollapse: 'collapse', 
                    fontSize: '14px'
                  }}>
                    <tr>
                      <td style={{ 
                        border: '1px solid #000', 
                        borderTop: 'none', 
                        borderLeft: 'none', 
                        padding: '5px'
                      }}>
                        <strong>Invoice No.</strong>: {invoice.invoiceNo}
                      </td>
                      <td style={{ 
                        border: '1px solid #000', 
                        borderTop: 'none', 
                        borderLeft: 'none',
                        borderRight: 'none',
                        padding: '5px'
                      }}>
                        <strong>Dated</strong>: {formatDate(invoice.invoiceDate)}
                      </td>
                    </tr>
                    <tr>
                      <td style={{ 
                        border: '1px solid #000', 
                        borderTop: 'none', 
                        borderLeft: 'none', 
                        padding: '5px'
                      }}>
                        <strong>Delivery Note</strong>: {invoice.deliveryNote}
                      </td>
                      <td style={{ 
                        border: '1px solid #000', 
                        borderTop: 'none', 
                        borderLeft: 'none',
                        borderRight: 'none',
                        padding: '5px'
                      }}>
                        <strong>Mode/Terms of Payment</strong>: {invoice.paymentTerms}
                      </td>
                    </tr>
                    <tr>
                      <td style={{ 
                        border: '1px solid #000', 
                        borderTop: 'none', 
                        borderLeft: 'none', 
                        padding: '5px'
                      }}>
                        <strong>Dispatch Doc No</strong>: {invoice.dispatchDocNo}
                      </td>
                      <td style={{ 
                        border: '1px solid #000', 
                        borderTop: 'none', 
                        borderLeft: 'none',
                        borderRight: 'none',
                        padding: '5px'
                      }}>
                        <strong>Delivery Note Date</strong>: {formatDate(invoice.deliveryNoteDate)}
                      </td>
                    </tr>
                    <tr>
                      <td style={{ 
                        border: '1px solid #000', 
                        borderTop: 'none', 
                        borderLeft: 'none', 
                        padding: '5px'
                      }}>
                        <strong>Dispatched Through</strong>: {invoice.dispatchedThrough}
                      </td>
                      <td style={{ 
                        border: '1px solid #000', 
                        borderTop: 'none', 
                        borderLeft: 'none',
                        borderRight: 'none',
                        padding: '5px'
                      }}>
                        <strong>Destination</strong>: {invoice.destination}
                      </td>
                    </tr>
                    <tr>
                      <td colSpan="2" style={{ padding: '10px' }}>
                        <strong>Terms of Delivery</strong>: {invoice.termsOfDelivery}
                      </td>
                    </tr>
                  </table>
                </div>
              </div>








              {/* Invoice Items Table */}
              <table style={{ 
                width: '100%', 
                borderCollapse: 'collapse', 
                borderTop: 'none', 
                fontSize: '12px'
              }}>
                <thead>
                  <tr style={{ 
                    borderTop: '1px solid #000', 
                    borderBottom: '1px solid #000'
                  }}>
                    <th style={{ 
                      padding: '8px', 
                      borderRight: '1px solid #000'
                    }}>S.No</th>
                    <th style={{ 
                      padding: '8px', 
                      borderRight: '1px solid #000'
                    }}>Description of Goods</th>
                    <th style={{ 
                      padding: '8px', 
                      borderRight: '1px solid #000'
                    }}>HSN</th>
                    <th style={{ 
                      padding: '8px', 
                      borderRight: '1px solid #000'
                    }}>Quantity</th>
                    <th style={{ 
                      padding: '8px', 
                      borderRight: '1px solid #000'
                    }}>Rate</th>
                    <th style={{ 
                      padding: '8px', 
                      borderRight: '1px solid #000'
                    }}>Per</th>
                    <th style={{ padding: '8px' }}>Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {invoice.items.map((item, index) => (
                    <tr key={index}>
                      <td style={{ 
                        padding: '5px', 
                        textAlign: 'center', 
                        borderRight: '1px solid #000'
                      }}>{item.srNo}</td>
                      <td style={{ 
                        padding: '5px', 
                        borderRight: '1px solid #000'
                      }}>{item.description}</td>
                      <td style={{ 
                        padding: '5px', 
                        textAlign: 'center', 
                        borderRight: '1px solid #000'
                      }}>{item.hsnCode}</td>
                      <td style={{ 
                        padding: '5px', 
                        textAlign: 'center', 
                        borderRight: '1px solid #000'
                      }}>{item.quantity} Case</td>
                      <td style={{ 
                        padding: '5px', 
                        textAlign: 'center',
                        borderRight: '1px solid #000'
                      }}>{item.rate.toFixed(2)}</td>
                      <td style={{ 
                        padding: '5px', 
                        textAlign: 'center',
                        borderRight: '1px solid #000'
                      }}>Case</td>
                      <td style={{ 
                        padding: '5px', 
                        textAlign: 'right'
                      }}>{item.amount.toFixed(2)}</td>
                    </tr>
                  ))}

                  {/* Spacer Row WITH Borders */}
                  <tr style={{ height: '150px' }}>
                    <td style={{ borderRight: '1px solid #000' }}></td>
                    <td style={{ borderRight: '1px solid #000' }}></td>
                    <td style={{ borderRight: '1px solid #000' }}></td>
                    <td style={{ borderRight: '1px solid #000' }}></td>
                    <td style={{ borderRight: '1px solid #000' }}></td>
                    <td style={{ borderRight: '1px solid #000' }}></td>
                    <td style={{ borderRight: '1px solid #000', borderRight: 'none' }}></td>
                  </tr>

                  {/* Total Row */}
                  <tr style={{ fontWeight: 'bold' }}>
                    <td style={{ 
                      padding: '8px', 
                      border: '1px solid #000',
                      borderLeft: 'none'
                    }}></td>
                    <td style={{ 
                      padding: '8px', 
                      textAlign: 'right', 
                      border: '1px solid #000',
                      borderLeft: 'none'
                    }}>Total</td>
                    <td style={{ 
                      padding: '8px', 
                      border: '1px solid #000',
                      borderLeft: 'none'
                    }}></td>
                    <td style={{ 
                      padding: '8px', 
                      textAlign: 'center', 
                      border: '1px solid #000',
                      borderLeft: 'none'
                    }}>
                      {invoice.items.reduce((sum, item) => sum + item.quantity, 0)} Case
                    </td>
                    <td style={{ 
                      padding: '8px', 
                      border: '1px solid #000',
                      borderLeft: 'none'
                    }}></td>
                    <td style={{ 
                      padding: '8px', 
                      border: '1px solid #000',
                      borderLeft: 'none'
                    }}></td>
                    <td style={{ 
                      padding: '8px', 
                      textAlign: 'right', 
                      border: '1px solid #000', 
                      borderLeft: 'none',
                      borderRight: 'none'
                    }}>₹{invoice.grandTotal.toFixed(2)}</td>
                  </tr>
                </tbody>
              </table>

              {/* Bottom Margin After Item Rows */}
              <div style={{ marginBottom: '15px' }}></div>

              {/* Total and Amount (LEFT side with increased font) */}
              <div style={{
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center'
              }}>
                <div style={{ 
                  paddingLeft: '15px', 
                  fontSize: '13px', 
                  marginTop: '-10px', 
                  marginBottom: '5px'
                }}>
                  <p><strong>Amount Chargable(in Words):</strong> <br/>{invoice.amountInWords}</p>
                </div>
                <div style={{ 
                  paddingRight: '15px', 
                  fontSize: '13px'
                }}>
                  <p>E. & O.E</p>
                </div>
              </div>

              {/* Declaration + Signature Row */}
              <div style={{ 
                display: 'flex', 
                borderTop: '1px solid #000', 
                borderBottom: '1px solid #000', 
                fontSize: '12px', 
                height: '100px', 
                borderBottom: 'none'
              }}>
                {/* Declaration */}
                <div style={{ 
                  flex: 2, 
                  padding: '10px', 
                  borderRight: '1px solid #000'
                }}>
                  <p><strong>Declaration:</strong></p>
                  <p>We declare that this invoice shows the actual price of the goods described and that all particulars are true and correct.</p>
                </div>

                {/* Authorized Signatory */}
                <div style={{ 
                  flex: 1, 
                  padding: '10px', 
                  textAlign: 'center'
                }}>
                  <p><strong>Authorised Signatory</strong></p>
                  <p>{invoice.sellerName}</p>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div style={{ 
              textAlign: 'center', 
              fontSize: '10px', 
              fontWeight: 'bold', 
              padding: '15px 0'
            }}>
              This is a Computer Generated Invoice.
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CreateTab;