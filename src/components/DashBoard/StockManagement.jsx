// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import { 
//   FaPlus, FaEdit, FaTrash, FaHistory, FaCalendarAlt, 
//   FaBoxes, FaBoxOpen, FaTags, FaExclamationTriangle,
//   FaChevronLeft, FaChevronRight, FaDollarSign, FaChartBar,
//   FaInfoCircle, FaTimes,FaExclamationCircle
// } from "react-icons/fa";
// import { format, parseISO, startOfWeek, endOfWeek, 
//   startOfMonth, endOfMonth, eachDayOfInterval, isSameDay,
//   isSameWeek, isSameMonth, addDays, subDays, addWeeks,
//   subWeeks, addMonths, subMonths 
// } from 'date-fns';
// import { jwtDecode } from "jwt-decode";
// import { useNavigate } from "react-router-dom";
// import { toast, ToastContainer } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';

// const BottleStockManagement = () => {
//   const navigate = useNavigate();
//   const [stocks, setStocks] = useState([]);
//   const [filteredStocks, setFilteredStocks] = useState([]);
//   const [rawMaterials, setRawMaterials] = useState([]);
//   const [materialPurchases, setMaterialPurchases] = useState([]);
//   const [materialHistory, setMaterialHistory] = useState([]);
//   const [purchaseSummary, setPurchaseSummary] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState('');
//   const [view, setView] = useState('list');
//   const [searchTerm, setSearchTerm] = useState('');
//   const [stockFilter, setStockFilter] = useState('all');
//   const [activeTab, setActiveTab] = useState('bottleStock');
//   const [showHistory, setShowHistory] = useState(false);
//   const [selectedMaterial, setSelectedMaterial] = useState(null);
//   const [calendarView, setCalendarView] = useState('month');
//   const [currentDate, setCurrentDate] = useState(new Date());
//   const [selectedDayPurchases, setSelectedDayPurchases] = useState([]);
//   const [isEditMode, setIsEditMode] = useState(false);
// const [selectedPurchaseId, setSelectedPurchaseId] = useState(null);
//   // Form states
//   const [showAddForm, setShowAddForm] = useState(false);
//   const [showEditForm, setShowEditForm] = useState(false);
//   const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
//   const [showPurchaseForm, setShowPurchaseForm] = useState(false);
//   const [showUpdateMaterialForm, setShowUpdateMaterialForm] = useState(false);
//   const [stockToDelete, setStockToDelete] = useState(null);
//   const [selectedStock, setSelectedStock] = useState(null);
  
//   // Form data
//   const [newStock, setNewStock] = useState({
//     organization: '',
//     size: '500ml',
//     currentStock: 0,
//     minStockLevel: 10,
//     sellingPrice: 0,
//     supplier: '',
//     notes: '',
//     lastRestockDate: '',
//     nextRestockDate: ''
//   });

//   const [newPurchase, setNewPurchase] = useState({
//     materialType: 'PET Bottle',
//     quantity: 0,
//     purchaseDate: format(new Date(), 'yyyy-MM-dd'),
//     cost: 0,
//     supplier: '',
//     companyName: '',
//     notes: ''
//   });

//   const [materialUpdate, setMaterialUpdate] = useState({
//     materialId: '',
//     materialType: '',
//     currentStock: 0,
//     notes: ''
//   });

//   const [user, setUser] = useState({
//     Id: "N/A",
//     Name: "N/A",
//     Email: "N/A"
//   });

//   // Get auth header
//   const getAuthHeader = () => {
//     const token = localStorage.getItem("token");
//     return {
//       headers: { 
//         Authorization: `Bearer ${token}`,
//         'Content-Type': 'application/json'
//       }
//     };
//   };

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
//         } else {
//           localStorage.removeItem("token");
//           navigate("/");
//         }
//       } catch (error) {
//         console.error("Authentication error:", error);
//         localStorage.removeItem("token");
//         navigate("/");
//       }
//     };

//     checkAuth();
//   }, [navigate]);

//   // Fetch data on component mount
//   useEffect(() => {
//     fetchAllData();
//   }, []);

//   // Fetch purchase data when calendar view changes
//   useEffect(() => {
//     if (activeTab === 'purchases') {
//       fetchPurchases();
//     }
//   }, [currentDate, calendarView, activeTab]);

//   // Filter stocks when dependencies change
//   useEffect(() => {
//     filterStocks();
//   }, [stocks, searchTerm, stockFilter]);

//   // API functions
//   const fetchAllData = async () => {
//     try {
//       setLoading(true);
//       const [stocksRes, materialsRes] = await Promise.all([
//         axios.get('https://bluesip-backend.onrender.com/api/bottle-stocks', getAuthHeader()),
//         axios.get('https://bluesip-backend.onrender.com/api/raw-materials', getAuthHeader())
//       ]);
      
//       setStocks(stocksRes.data);
//       setRawMaterials(materialsRes.data);
//     } catch (err) {
//       setError('Failed to fetch data');
//       toast.error('Failed to fetch data');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const fetchPurchases = async () => {
//     try {
//       setLoading(true);
//       let startDate, endDate;

//       switch (calendarView) {
//         case 'day':
//           startDate = currentDate;
//           endDate = currentDate;
//           break;
//         case 'week':
//           startDate = startOfWeek(currentDate);
//           endDate = endOfWeek(currentDate);
//           break;
//         case 'month':
//           startDate = startOfMonth(currentDate);
//           endDate = endOfMonth(currentDate);
//           break;
//         default:
//           startDate = startOfMonth(currentDate);
//           endDate = endOfMonth(currentDate);
//       }

//       const { data } = await axios.get('https://bluesip-backend.onrender.com/api/material-purchases', {
//         ...getAuthHeader(),
//         params: {
//           startDate: format(startDate, 'yyyy-MM-dd'),
//           endDate: format(endDate, 'yyyy-MM-dd'),
//           view: 'summary'
//         }
//       });

//       setMaterialPurchases(data.purchases);
//       setPurchaseSummary(data.summary);
//     } catch (err) {
//       setError('Failed to fetch purchases');
//       toast.error('Failed to fetch purchases');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleAddStock = async () => {
//     try {
//       const payload = {
//         ...newStock,
//         currentStock: Number(newStock.currentStock),
//         minStockLevel: Number(newStock.minStockLevel),
//         sellingPrice: Number(newStock.sellingPrice),
//         lastRestockDate: newStock.lastRestockDate || null,
//         nextRestockDate: newStock.nextRestockDate || null
//       };

//       const { data } = await axios.post(
//         'https://bluesip-backend.onrender.com/api/bottle-stocks/create', 
//         payload,
//         getAuthHeader()
//       );
      
//       setStocks([...stocks, data]);
//       setShowAddForm(false);
//       resetForm();
//       toast.success('Stock added successfully!');
//     } catch (err) {
//       console.error('Error details:', err.response?.data);
//       const errorMsg = err.response?.data?.errors || 'Failed to add stock';
//       setError(errorMsg);
//       toast.error(errorMsg);
//     }
//   };

//   const handleEditStock = async () => {
//     try {
//       const payload = {
//         ...selectedStock,
//         currentStock: Number(selectedStock.currentStock),
//         minStockLevel: Number(selectedStock.minStockLevel),
//         sellingPrice: Number(selectedStock.sellingPrice),
//         lastRestockDate: selectedStock.lastRestockDate || null,
//         nextRestockDate: selectedStock.nextRestockDate || null
//       };

//       await axios.put(
//         `https://bluesip-backend.onrender.com/api/bottle-stocks/${selectedStock._id}`, 
//         payload,
//         getAuthHeader()
//       );
      
//       fetchAllData();
//       setShowEditForm(false);
//       toast.success('Stock updated successfully!');
//     } catch (err) {
//       setError('Failed to update stock');
//       toast.error('Failed to update stock');
//     }
//   };

//   const handleDeleteConfirm = async () => {
//     try {
//       await axios.delete(
//         `https://bluesip-backend.onrender.com/api/bottle-stocks/${stockToDelete}`,
//         getAuthHeader()
//       );
      
//       setStocks(stocks.filter(stock => stock._id !== stockToDelete));
//       setShowDeleteConfirm(false);
//       toast.success('Stock deleted successfully!');
//     } catch (err) {
//       setError('Failed to delete stock');
//       toast.error('Failed to delete stock');
//     }
//   };

//   const handleUpdateMaterial = async () => {
//     try {
//       const response = await axios.put(
//         `https://bluesip-backend.onrender.com/api/raw-materials/${materialUpdate.materialId}`,
//         {
//           currentStock: Number(materialUpdate.currentStock),
//           notes: materialUpdate.notes,
//           lastUpdatedBy: user.Name
//         },
//         getAuthHeader()
//       );

//       toast.success("Material updated successfully!");
//       setShowUpdateMaterialForm(false);
//       fetchAllData();
//     } catch (err) {
//       console.error("Material update failed", err);
//       toast.error(err.response?.data?.message || "Failed to update material");
//     }
//   };

//   const fetchMaterialHistory = async (materialId) => {
//     try {
//       setLoading(true);
//       const { data } = await axios.get(
//         `https://bluesip-backend.onrender.com/api/raw-materials/${materialId}/history`,
//         getAuthHeader()
//       );
      
//       setMaterialHistory(data);
//       setShowHistory(true);
//       setError('');
//     } catch (err) {
//       console.error('Error fetching history:', err);
//       setError(err.response?.data?.error || 'Failed to fetch history');
//       toast.error('Failed to fetch history');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleAddPurchase = async () => {
//     try {
//       const payload = {
//         ...newPurchase,
//         quantity: Number(newPurchase.quantity),
//         cost: Number(newPurchase.cost),
//         purchasedBy: user.Name
//       };

//       await axios.post(
//         'https://bluesip-backend.onrender.com/api/material-purchases', 
//         payload,
//         getAuthHeader()
//       );
      
//       fetchAllData();
//       fetchPurchases();
//       setShowPurchaseForm(false);
//       setNewPurchase({
//         materialType: 'PET Bottle',
//         quantity: 0,
//         purchaseDate: format(new Date(), 'yyyy-MM-dd'),
//         cost: 0,
//         supplier: '',
//         companyName: '',
//         notes: ''
//       });
//       toast.success('Purchase recorded successfully!');
//     } catch (err) {
//       setError('Failed to add purchase');
//       toast.error('Failed to add purchase');
//     }
//   };

//   // Calendar navigation
//   const navigateDate = (direction) => {
//     switch (calendarView) {
//       case 'day':
//         setCurrentDate(direction === 'next' ? addDays(currentDate, 1) : subDays(currentDate, 1));
//         break;
//       case 'week':
//         setCurrentDate(direction === 'next' ? addWeeks(currentDate, 1) : subWeeks(currentDate, 1));
//         break;
//       case 'month':
//         setCurrentDate(direction === 'next' ? addMonths(currentDate, 1) : subMonths(currentDate, 1));
//         break;
//       default:
//         setCurrentDate(new Date());
//     }
//   };

//   // Helper functions
//   const filterStocks = () => {
//     let results = stocks;

//     if (searchTerm) {
//       results = results.filter(stock =>
//         stock.organization.toLowerCase().includes(searchTerm.toLowerCase()) ||
//         (stock.batchNumber && stock.batchNumber.toLowerCase().includes(searchTerm.toLowerCase()))
//       );
//     }

//     switch (stockFilter) {
//       case 'low':
//         results = results.filter(stock => 
//           stock.currentStock > 0 && stock.currentStock <= stock.minStockLevel
//         );
//         break;
//       case 'out':
//         results = results.filter(stock => stock.currentStock === 0);
//         break;
//       case 'healthy':
//         results = results.filter(stock => stock.currentStock > stock.minStockLevel);
//         break;
//       default:
//         break;
//     }

//     setFilteredStocks(results);
//   };

//   const getStockStatus = (stock) => {
//     if (stock.currentStock === 0) return 'Out of Stock';
//     if (stock.currentStock <= stock.minStockLevel) return 'Low Stock';
//     return 'In Stock';
//   };

//   const getStatusClass = (status) => {
//     return status.toLowerCase().replace(/\s/g, '-');
//   };

//   const resetForm = () => {
//     setNewStock({
//       organization: '',
//       size: '500ml',
//       currentStock: 0,
//       minStockLevel: 10,
//       sellingPrice: 0,
//       supplier: '',
//       notes: '',
//       lastRestockDate: '',
//       nextRestockDate: ''
//     });
//   };

//   const formatDateForInput = (dateString) => {
//     if (!dateString) return '';
//     return format(parseISO(dateString), 'yyyy-MM-dd');
//   };

//   const getMaterialIcon = (materialType) => {
//     switch(materialType) {
//       case 'PET Bottle': return <FaBoxOpen className="material-icon" />;
//       case 'Cap White': 
//       case 'Cap Black': return <FaBoxes className="material-icon" />;
//       case 'Shrink Roll': return <FaBoxes className="material-icon" />;
//       case 'Company Label': return <FaTags className="material-icon" />;
//       default: return <FaBoxes className="material-icon" />;
//     }
//   };

//   const getLowStockMaterials = () => {
//     return rawMaterials.filter(material => material.currentStock < material.minStockLevel);
//   };

//   const renderCalendarDays = () => {
//     let days = [];
//     let startDate, endDate;

//     switch (calendarView) {
//       case 'day':
//         startDate = currentDate;
//         endDate = currentDate;
//         days = [currentDate];
//         break;
//       case 'week':
//         startDate = startOfWeek(currentDate);
//         endDate = endOfWeek(currentDate);
//         days = eachDayOfInterval({ start: startDate, end: endDate });
//         break;
//       case 'month':
//         startDate = startOfMonth(currentDate);
//         endDate = endOfMonth(currentDate);
//         days = eachDayOfInterval({ start: startDate, end: endDate });
//         break;
//       default:
//         days = [];
//     }

//     return days.map(day => {
//       const dayPurchases = materialPurchases.filter(purchase => 
//         isSameDay(parseISO(purchase.purchaseDate), day)
//       );

//       return (
//         <div 
//           key={day.toString()} 
//           className={`calendar-day ${dayPurchases.length > 0 ? 'has-purchases' : ''}`}
//           onClick={() => dayPurchases.length > 0 && setSelectedDayPurchases(dayPurchases)}
//         >
//           <div className="calendar-day-header">
//             <h4>{format(day, 'EEE, MMM d')}</h4>
//             {dayPurchases.length > 0 && (
//               <span className="day-indicator">
//                 <FaInfoCircle /> {dayPurchases.length} purchase(s)
//               </span>
//             )}
//           </div>
//         </div>
//       );
//     });
//   };

//   const renderSummaryReport = () => {
//     if (!purchaseSummary) return null;

//     return (
//       <div className="summary-report">
//         <h3>
//           <FaChartBar /> Summary for {calendarView === 'day' ? format(currentDate, 'MMMM d, yyyy') : 
//             calendarView === 'week' ? `Week of ${format(startOfWeek(currentDate), 'MMM d')}` : 
//             format(currentDate, 'MMMM yyyy')}
//         </h3>
        
//         <div className="summary-totals">
//           <div className="summary-card">
//             <h4>Total Purchases</h4>
//             <p>{purchaseSummary.totalPurchases}</p>
//           </div>
//           <div className="summary-card">
//             <h4>Total Cost</h4>
//             <p>${purchaseSummary.totalCost.toFixed(2)}</p>
//           </div>
//         </div>

//         <div className="material-breakdown">
//           <h4>Materials Breakdown</h4>
//           <table className="summary-table">
//             <thead>
//               <tr>
//                 <th>Material</th>
//                 <th>Purchases</th>
//                 <th>Quantity</th>
//                 <th>Total Cost</th>
//               </tr>
//             </thead>
//             <tbody>
//               {Object.entries(purchaseSummary.materials).map(([material, data]) => (
//                 <tr key={material}>
//                   <td>{material}</td>
//                   <td>{data.count}</td>
//                   <td>{data.quantity} pcs</td>
//                   <td>${data.cost.toFixed(2)}</td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       </div>
//     );
//   };

//   return (
//     renderSummaryReport
//     {activeTab === 'rawMaterials' && (
//   <div className="raw-materials-container">
//     <div className="section-header">
      
//       <button 
//         className="add-button"
//         onClick={() => setShowPurchaseForm(true)}
//       >
//         <FaPlus/> Add Purchase
//       </button>
//     </div>

//     {/* Low Stock Warning */}
//     {getLowStockMaterials().length > 0 && (
//       <div className="alert-warning">
//         <FaExclamationTriangle /> The following materials are low on stock:
//         <ul>
//           {getLowStockMaterials().map(material => (
//             <li key={material._id}>
//               {material.materialType} - {material.currentStock} {material.unit} (min: {material.minStockLevel})
//             </li>
//           ))}
//         </ul>
//       </div>
//     )}

//     {/* Summary Boxes for Main Materials */}
//     <div className="materials-summary">
//       {['PET Bottle', 'Cap White', 'Cap Black', 'Shrink Roll'].map(type => {
//         const material = rawMaterials.find(m => m.materialType === type) || {
//           _id: type,
//           materialType: type,
//           currentStock: 0,
//           minStockLevel: 500, 
//           unit: 'pieces',    
//           costPerUnit: 0     
//         };
        
//         return (
//           <div 
//             key={material._id} 
//             className="summary-card"
//           >
//             <div className="summary-icon">
//               {getMaterialIcon(material.materialType)}
//             </div>
//             <div className="summary-content">
//               <h3>{material.materialType}</h3>
//               <div className="summary-stock">
//                 <span className="stock-value">{material.currentStock}</span>
//                 <span className="stock-unit">{material.unit}</span>
//               </div>
//               <div className="summary-min">
//                 Min: {material.minStockLevel}
//               </div>
//               {material.currentStock < material.minStockLevel && (
//                 <div className="summary-alert">
//                   <FaExclamationCircle /> Reorder needed
//                 </div>
//               )}
//             </div>
//           </div>
//         );
//       })}
//     </div>

//           {/* Add Purchase Form */}
//           {showPurchaseForm && (
//             <div className="modal-overlay">
//               <div className="modal-content">
//                 <h2>Add Material Purchase</h2>
//                 {error && <p className="error-message">{error}</p>}
                
//                 <div className="form-group">
//                   <label>Material Type</label>
//                   <select
//                     value={newPurchase.materialType}
//                     onChange={(e) => setNewPurchase({...newPurchase, materialType: e.target.value})}
//                     required
//                   >
//                     <option value="PET Bottle">PET Bottle</option>
//                     <option value="Cap White">Cap White</option>
//                     <option value="Cap Black">Cap Black</option>
//                     <option value="Shrink Roll">Shrink Roll</option>
//                     <option value="Company Label">Company Label</option>
//                   </select>
//                 </div>
                
//                 {newPurchase.materialType === 'Company Label' && (
//                   <div className="form-group">
//                     <label>Company Name</label>
//                     <input
//                       type="text"
//                       value={newPurchase.companyName}
//                       onChange={(e) => setNewPurchase({...newPurchase, companyName: e.target.value})}
//                       required
//                     />
//                   </div>
//                 )}
                
//                 <div className="form-row">
//                   <div className="form-group">
//                     <label>Quantity</label>
//                     <input
//                       type="number"
//                       min="1"
//                       value={newPurchase.quantity}
//                       onChange={(e) => setNewPurchase({...newPurchase, quantity: parseInt(e.target.value) || 0})}
//                       required
//                     />
//                   </div>
                  
//                   <div className="form-group">
//                     <label>Cost</label>
//                     <input
//                       type="number"
//                       step="0.01"
//                       min="0"
//                       value={newPurchase.cost}
//                       onChange={(e) => setNewPurchase({...newPurchase, cost: parseFloat(e.target.value) || 0})}
//                       required
//                     />
//                   </div>
//                 </div>
                
//                 <div className="form-group">
//                   <label>Purchase Date</label>
//                   <input
//                     type="date"
//                     value={newPurchase.purchaseDate}
//                     onChange={(e) => setNewPurchase({...newPurchase, purchaseDate: e.target.value})}
//                     required
//                   />
//                 </div>
                
//                 <div className="form-group">
//                   <label>Supplier</label>
//                   <input
//                     type="text"
//                     value={newPurchase.supplier}
//                     onChange={(e) => setNewPurchase({...newPurchase, supplier: e.target.value})}
//                   />
//                 </div>
                
//                 <div className="form-group">
//                   <label>Notes</label>
//                   <textarea
//                     value={newPurchase.notes}
//                     onChange={(e) => setNewPurchase({...newPurchase, notes: e.target.value})}
//                     maxLength="500"
//                   />
//                 </div>
                
//                 <div className="modal-actions">
//                   <button 
//                     className="cancel-button" 
//                     onClick={() => {
//                       setShowPurchaseForm(false);
//                       setError('');
//                     }}
//                   >
//                     Cancel
//                   </button>
//                   <button 
//                     className="confirm-button" 
//                     onClick={handleAddPurchase}
//                   >
//                     Record Purchase
//                   </button>
//                 </div>
//               </div>
//             </div>
//           )}

//           {/* Material History Modal */}
//           {showHistory && selectedMaterial && (
//             <div className="modal-overlay">
//               <div className="modal-content">
//                 <div className="modal-header">
//                   <h2>
//                     {selectedMaterial.materialType} 
//                     {selectedMaterial.materialType === 'Company Label' && ` - ${selectedMaterial.companyName}`}
//                   </h2>
//                   <button 
//                     className="close-button"
//                     onClick={() => setShowHistory(false)}
//                   >
//                     <FaTimes />
//                   </button>
//                 </div>
//                 <h3>Stock History</h3>
                
//                 <div className="history-table-container">
//                   <table className="history-table">
//                     <thead>
//                       <tr>
//                         <th>Date</th>
//                         <th>Changed By</th>
//                         <th>Previous</th>
//                         <th>New</th>
//                         <th>Difference</th>
//                         <th>Notes</th>
//                       </tr>
//                     </thead>
//                     <tbody>
//                       {materialHistory.map((record, index) => (
//                         <tr key={index}>
//                           <td>{format(parseISO(record.changeDate), 'MM/dd/yyyy HH:mm')}</td>
//                           <td>{record.changedBy?.name || 'System'}</td>
//                           <td>{record.previousValue}</td>
//                           <td>{record.newValue}</td>
//                           <td className={record.newValue > record.previousValue ? 'positive' : 'negative'}>
//                             {record.newValue - record.previousValue}
//                           </td>
//                           <td>{record.notes || '-'}</td>
//                         </tr>
//                       ))}
//                     </tbody>
//                   </table>
//                 </div>
//               </div>
//             </div>
//           )}
//         </div>
//       )}

//       {/* Purchase Calendar */}
//       {activeTab === 'purchases' && (
//         <div className="purchase-calendar-container">
//           <div className="calendar-header">
//             <h2>Purchase Calendar</h2>
            
//             <div className="calendar-controls">
//               <div className="view-selector">
//                 <button
//                   className={calendarView === 'day' ? 'active' : ''}
//                   onClick={() => setCalendarView('day')}
//                 >
//                   Day
//                 </button>
//                 <button
//                   className={calendarView === 'week' ? 'active' : ''}
//                   onClick={() => setCalendarView('week')}
//                 >
//                   Week
//                 </button>
//                 <button
//                   className={calendarView === 'month' ? 'active' : ''}
//                   onClick={() => setCalendarView('month')}
//                 >
//                   Month
//                 </button>
//               </div>
              
//               <div className="date-navigation">
//                 <button 
//                   className="nav-button"
//                   onClick={() => navigateDate('prev')}
//                 >
//                   <FaChevronLeft />
//                 </button>
                
//                 <h3>
//                   {calendarView === 'day' ? format(currentDate, 'MMMM d, yyyy') : 
//                    calendarView === 'week' ? `Week of ${format(startOfWeek(currentDate), 'MMM d')}` : 
//                    format(currentDate, 'MMMM yyyy')}
//                 </h3>
                
//                 <button 
//                   className="nav-button"
//                   onClick={() => navigateDate('next')}
//                 >
//                   <FaChevronRight />
//                 </button>
//               </div>
              
//               <button 
//                 className="add-button"
//                 onClick={() => setShowPurchaseForm(true)}
//               >
//                 <FaPlus/> Add Purchase
//               </button>
//             </div>
//           </div>
          
//           {/* Summary Report */}
//           {renderSummaryReport()}
          
//           {/* Calendar View */}
//           <div className={`calendar-view ${calendarView}`}>
//             {renderCalendarDays()}
//           </div>
//         </div>
//       )}

//       {/* Company Labels Management */}
//       {activeTab === 'labels' && (
//         <div className="labels-container">
//           <h2>Company Labels Inventory</h2>
          
//           <div className="labels-table-container">
//             <table className="labels-table">
//               <thead>
//                 <tr>
//                   <th>Company Name</th>
//                   <th>Current Stock</th>
//                   <th>Min Level</th>
//                   <th>Cost per Label</th>
//                   <th>Last Updated</th>
//                   <th>Actions</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {rawMaterials
//                   .filter(m => m.materialType === 'Company Label')
//                   .map(material => (
//                     <tr key={material._id}>
//                       <td>{material.companyName}</td>
//                       <td className={material.currentStock < material.minStockLevel ? 'low-stock' : ''}>
//                         {material.currentStock} labels
//                       </td>
//                       <td>{material.minStockLevel} labels</td>
//                       <td>${material.costPerUnit?.toFixed(2) || '0.00'}</td>
//                       <td>
//                         {material.updatedAt 
//                           ? format(parseISO(material.updatedAt), 'MM/dd/yyyy HH:mm')
//                           : 'N/A'}
//                       </td>
//                       <td className="actions-cell">
//                         <button 
//                           className="edit-button"
//                           onClick={() => {
//                             setMaterialUpdate({
//                               materialId: material._id,
//                               materialType: material.materialType,
//                               currentStock: material.currentStock,
//                               notes: ''
//                             });
//                             setShowUpdateMaterialForm(true);
//                           }}
//                         >
//                           <FaEdit/> Update
//                         </button>
//                         <button 
//                           className="history-button"
//                           onClick={() => {
//                             setSelectedMaterial(material);
//                             fetchMaterialHistory(material._id);
//                           }}
//                         >
//                           <FaHistory/> History
//                         </button>
//                       </td>
//                     </tr>
//                   ))}
//               </tbody>
//             </table>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default BottleStockManagement;

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  FaPlus, FaEdit, FaTrash, FaHistory, FaCalendarAlt, 
  FaBoxes, FaBoxOpen, FaTags, FaExclamationTriangle,
  FaChevronLeft, FaChevronRight, FaDollarSign, FaChartBar,
  FaInfoCircle, FaTimes, FaExclamationCircle, FaUserEdit
} from "react-icons/fa";
import { format, parseISO, startOfWeek, endOfWeek, 
  startOfMonth, endOfMonth, eachDayOfInterval, isSameDay,
  isSameWeek, isSameMonth, addDays, subDays, addWeeks,  startOfDay, endOfDay,
  subWeeks, addMonths, subMonths 
} from 'date-fns';
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const BottleStockManagement = () => {
  const navigate = useNavigate();
  const [stocks, setStocks] = useState([]);
  const [filteredStocks, setFilteredStocks] = useState([]);
  const [rawMaterials, setRawMaterials] = useState([]);
  const [materialPurchases, setMaterialPurchases] = useState([]);
  const [materialHistory, setMaterialHistory] = useState([]);
  const [recentUpdates, setRecentUpdates] = useState([]);
  const [purchaseSummary, setPurchaseSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [view, setView] = useState('list');
  const [searchTerm, setSearchTerm] = useState('');
  const [stockFilter, setStockFilter] = useState('all');
  const [activeTab, setActiveTab] = useState('bottleStock');
  const [showHistory, setShowHistory] = useState(false);
  const [selectedMaterial, setSelectedMaterial] = useState(null);
  const [calendarView, setCalendarView] = useState('month');
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDayPurchases, setSelectedDayPurchases] = useState([]);
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedPurchaseId, setSelectedPurchaseId] = useState(null); 
  const [showAddMaterialForm, setShowAddMaterialForm] = useState(false);
const [purchaseForm, setPurchaseForm] = useState({
  materialType: '',
  quantity: '',
  companyName: '',
  cost: '',
  supplier: '',
  notes: ''
});

//company label *****************/

// Add these to your component state
// Add these with your other state declarations
const [labels, setLabels] = useState([]);
const [filteredLabels, setFilteredLabels] = useState([]);
const [selectedLabel, setSelectedLabel] = useState(null);
const [labelHistory, setLabelHistory] = useState([]);
const [selectedLabelHistory, setSelectedLabelHistory] = useState(null);
const [showLabelHistory, setShowLabelHistory] = useState(false);
const [labelToDelete, setLabelToDelete] = useState(null);
const [newLabel, setNewLabel] = useState({
  labelName: '',
  stock: 0
});
const [detailFilter, setDetailFilter] = useState('all');
// Add this with your other state declarations
const [labelFilter, setLabelFilter] = useState('all');


// Add this useEffect for label filtering
useEffect(() => {
  if (activeTab === 'labels') {
    fetchLabels();
  }
}, [activeTab, searchTerm, labelFilter]); // Add labelFilter to dependencies





const handleEditLabel = async () => {
  try {
    await axios.put(
      `https://bluesip-backend.onrender.com/api/company-labels/${selectedLabel._id}`,
      {
        ...selectedLabel,
        lastUpdatedBy: user.Name
      },
      getAuthHeader()
    );
    
    fetchLabels();
    setShowEditForm(false);
    toast.success('Label updated successfully!');
  } catch (err) {
    setError('Failed to update label');
    toast.error('Failed to update label');
  }
};

const handleDeleteLabel = async () => {
  try {
    await axios.delete(
      `https://bluesip-backend.onrender.com/api/company-labels/${labelToDelete}`,
      getAuthHeader()
    );
    
    setLabels(labels.filter(label => label._id !== labelToDelete));
    setShowDeleteConfirm(false);
    toast.success('Label deleted successfully!');
  } catch (err) {
    setError('Failed to delete label');
    toast.error('Failed to delete label');
  }
};



useEffect(() => {
  if (activeTab === 'labels') {
    fetchLabels();
  }
}, [activeTab]);

  
const fetchLabels = async () => {
  try {
    setLoading(true);
    const { data } = await axios.get('https://bluesip-backend.onrender.com/api/company-labels', {
      ...getAuthHeader(),
      params: {
        search: searchTerm,
        stockFilter: labelFilter !== 'all' ? labelFilter : undefined
      }
    });
    setLabels(data);
    setFilteredLabels(data);
  } catch (err) {
    setError('Failed to fetch labels');
    toast.error('Failed to fetch labels');
  } finally {
    setLoading(false);
  }
};

const handleAddLabel = async () => {
  try {
    const { data } = await axios.post(
      'https://bluesip-backend.onrender.com/api/company-labels',
      {
        ...newLabel,
        lastUpdatedBy: user.Name
      },
      getAuthHeader()
    );
    
    // Update both labels and filteredLabels states
    const updatedLabels = [...labels, data];
    setLabels(updatedLabels);
    setFilteredLabels(updatedLabels); // This ensures the UI updates
    
    setShowAddForm(false);
    setNewLabel({ labelName: '', stock: 0, minStockLevel: 100 });
    toast.success('Label added successfully!');
    
    // Optional: Re-fetch the latest data from server
    // fetchLabels(); 
  } catch (err) {
    console.error('Add label error:', err.response?.data);
    setError(err.response?.data?.error || 'Failed to add label');
    toast.error(err.response?.data?.message || 'Failed to add label');
  }
};

const fetchLabelHistory = async (labelId) => {
  try {
  
    const { data } = await axios.get(
      `https://bluesip-backend.onrender.com/api/company-labels/${labelId}/history`,
      getAuthHeader()
    );
    
    setLabelHistory(data);
    setShowLabelHistory(true);
  } catch (err) {
    setError('Failed to fetch label history');
    toast.error('Failed to fetch label history');
  } finally {
    setLoading(false);
  }
};
// Add these helper functions to your component
const getLabelStatus = (label) => {
  if (label.stock === 0) return 'Out of Stock';
  if (label.stock < label.minStockLevel) return 'Low Stock';
  return 'In Stock';
};



const filterLabels = (searchTerm, filter) => {
  let results = [...labels];

  // Apply search filter
  if (searchTerm) {
    const searchLower = searchTerm.toLowerCase();
    results = results.filter(label =>
      label.labelName.toLowerCase().includes(searchLower)
    );
  }

  // Apply stock level filter
  switch(filter) {
    case 'healthy':
      results = results.filter(label => label.stock >= label.minStockLevel);
      break;
    case 'low':
      results = results.filter(label => label.stock > 0 && label.stock < label.minStockLevel);
      break;
    case 'out':
      results = results.filter(label => label.stock === 0);
      break;
    default:
      // No additional filtering for 'all'
      break;
  }

  setFilteredLabels(results);
};


  // Form states
  const [showAddForm, setShowAddForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showPurchaseForm, setShowPurchaseForm] = useState(false);
  const [showUpdateMaterialForm, setShowUpdateMaterialForm] = useState(false);
  const [stockToDelete, setStockToDelete] = useState(null);
  const [selectedStock, setSelectedStock] = useState(null);
  
  // Form data
  const [newStock, setNewStock] = useState({
    organization: '',
    size: '500ml',
    currentStock: 0,
    minStockLevel: 10,
    sellingPrice: 0,
    supplier: '',
    notes: '',
    lastRestockDate: '',
    nextRestockDate: ''
  });

  const [newPurchase, setNewPurchase] = useState({
    materialType: 'PET Bottle',
    quantity: 0,
    purchaseDate: format(new Date(), 'yyyy-MM-dd'),
    cost: 0,
    supplier: '',
    companyName: '',
    notes: ''
  });

  const [materialUpdate, setMaterialUpdate] = useState({
    materialId: '',
    materialType: '',
    currentStock: 0,
    minStockLevel: 0,
    costPerUnit: 0,
    notes: '',
    companyName: ''
  });

  const [user, setUser] = useState({
    Id: "N/A",
    Name: "N/A",
    Email: "N/A"
  });

  // Get auth header
  const getAuthHeader = () => {
    const token = localStorage.getItem("token");
    return {
      headers: { 
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    };
  };

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
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
  }, [navigate]);

  // Fetch data on component mount
  useEffect(() => {
    fetchAllData();
    fetchRecentUpdates();
  }, []);

  // Fetch purchase data when calendar view changes
  useEffect(() => {
    if (activeTab === 'purchases') {
      fetchPurchases();
    }
  }, [currentDate, calendarView, activeTab]);

  // Filter stocks when dependencies change
  useEffect(() => {
    filterStocks();
  }, [stocks, searchTerm, stockFilter]);

  // API functions
  const fetchAllData = async () => {
    try {
      setLoading(true);
      const [stocksRes, materialsRes] = await Promise.all([
        axios.get('https://bluesip-backend.onrender.com/api/bottle-stocks', getAuthHeader()),
        axios.get('https://bluesip-backend.onrender.com/api/raw-materials', getAuthHeader())
      ]);
      
      setStocks(stocksRes.data);
      setRawMaterials(materialsRes.data);
    } catch (err) {
      setError('Failed to fetch data');
      toast.error('Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

  const fetchRecentUpdates = async () => {
    try {
      const { data } = await axios.get(
        'https://bluesip-backend.onrender.com/api/material-history/recent',
        getAuthHeader()
      );
      setRecentUpdates(data);
    } catch (err) {
      console.error('Failed to fetch recent updates:', err);
    }
  };

  const fetchPurchases = async () => {
    try {
      setLoading(true);
   let startDate, endDate;
    const today = new Date();  // current date from today
    const current = currentDate || today; // in case currentDate is not set

    if (calendarView === 'day') {
      startDate = startOfDay(current);
      endDate = endOfDay(current);
    } else if (calendarView === 'week') {
      startDate = startOfWeek(current, { weekStartsOn: 1 }); // Monday
      endDate = endOfWeek(current, { weekStartsOn: 1 }); // Sunday
    } else if (calendarView === 'month') {
      startDate = startOfMonth(current);
      endDate = endOfMonth(current);
    } else {
      startDate = startOfMonth(current);
      endDate = endOfMonth(current);
    }



console.log("Fetching from:", format(startDate, 'yyyy-MM-dd'), "to", format(endDate, 'yyyy-MM-dd'));

      // switch (calendarView) {
      //   case 'day':
      //     startDate = currentDate;
      //     endDate = currentDate;
      //     break;
      //   case 'week':
      //     startDate = startOfWeek(currentDate);
      //     endDate = endOfWeek(currentDate);
      //     break;
      //   case 'month':
      //     startDate = startOfMonth(currentDate);
      //     endDate = endOfMonth(currentDate);
      //     break;
      //   default:
      //     startDate = startOfMonth(currentDate);
      //     endDate = endOfMonth(currentDate);
      // }

      const { data } = await axios.get('https://bluesip-backend.onrender.com/api/material-purchases', {
        ...getAuthHeader(),
       params: {
  startDate: startDate.toISOString(),
  endDate: endDate.toISOString(),
  view: 'summary'
}

      });

      setMaterialPurchases(data.purchases); 
      console.log("Data :",data.purchases);
      setPurchaseSummary(data.summary);
    } catch (err) {
      setError('Failed to fetch purchases');
      toast.error('Failed to fetch purchases');
    } finally {
      setLoading(false);
    }
  };

  const handleAddStock = async () => {
    try {
      const payload = {
        ...newStock,
        currentStock: Number(newStock.currentStock),
        minStockLevel: Number(newStock.minStockLevel),
        sellingPrice: Number(newStock.sellingPrice),
        lastRestockDate: newStock.lastRestockDate || null,
        nextRestockDate: newStock.nextRestockDate || null
      };

      const { data } = await axios.post(
        'https://bluesip-backend.onrender.com/api/bottle-stocks/create', 
        payload,
        getAuthHeader()
      );
      
      setStocks([...stocks, data]);
      setShowAddForm(false);
      resetForm();
      toast.success('Stock added successfully!');
    } catch (err) {
      console.error('Error details:', err.response?.data);
      const errorMsg = err.response?.data?.errors || 'Failed to add stock';
      setError(errorMsg);
      toast.error(errorMsg);
    }
  };

  const handleEditStock = async () => {
    try {
      const payload = {
        ...selectedStock,
        currentStock: Number(selectedStock.currentStock),
        minStockLevel: Number(selectedStock.minStockLevel),
        sellingPrice: Number(selectedStock.sellingPrice),
        lastRestockDate: selectedStock.lastRestockDate || null,
        nextRestockDate: selectedStock.nextRestockDate || null
      };

      await axios.put(
        `https://bluesip-backend.onrender.com/api/bottle-stocks/${selectedStock._id}`, 
        payload,
        getAuthHeader()
      );
      
      fetchAllData();
      setShowEditForm(false);
      toast.success('Stock updated successfully!');
    } catch (err) {
      setError('Failed to update stock');
      toast.error('Failed to update stock');
    }
  };

  const handleDeleteConfirm = async () => {
    try {
      await axios.delete(
        `https://bluesip-backend.onrender.com/api/bottle-stocks/${stockToDelete}`,
        getAuthHeader()
      );
      
      setStocks(stocks.filter(stock => stock._id !== stockToDelete));
      setShowDeleteConfirm(false);
      toast.success('Stock deleted successfully!');
    } catch (err) {
      setError('Failed to delete stock');
      toast.error('Failed to delete stock');
    }
  };

  const handleUpdateMaterial = async () => {
    try {
      const material = rawMaterials.find(m => m._id === materialUpdate.materialId);
      if (!material) {
        throw new Error('Material not found');
      }

      const response = await axios.put(
        `https://bluesip-backend.onrender.com/api/raw-materials/${materialUpdate.materialId}`,
        {
          currentStock: Number(materialUpdate.currentStock),
          minStockLevel: Number(materialUpdate.minStockLevel),
          costPerUnit: Number(materialUpdate.costPerUnit),
          notes: materialUpdate.notes,
          lastUpdatedBy: user.Name
        },
        getAuthHeader()
      );

      toast.success("Material updated successfully!");
      setShowUpdateMaterialForm(false);
      fetchAllData();
      fetchRecentUpdates();
    } catch (err) {
      console.error("Material update failed", err);
      toast.error(err.response?.data?.message || "Failed to update material");
    }
  };

  
  const fetchMaterialHistory = async (materialId) => {
    try {
      setLoading(true);
      const { data } = await axios.get(
        `https://bluesip-backend.onrender.com/api/raw-materials/${materialId}/history`,
        getAuthHeader()
      );
      
      setMaterialHistory(data);
      setShowHistory(true);
      setError('');
    } catch (err) {
      console.error('Error fetching history:', err);
      setError(err.response?.data?.error || 'Failed to fetch history');
      toast.error('Failed to fetch history');
    } finally {
      setLoading(false);
    }
  };

 const handleAddMaterialPurchase = async () => {
  try {
    const response = await axios.post(
      'https://bluesip-backend.onrender.com/api/material-purchases',
      {
        materialType: purchaseForm.materialType,
        quantity: Number(purchaseForm.quantity),
        companyName: purchaseForm.companyName,
        cost: Number(purchaseForm.cost),
        supplier: purchaseForm.supplier,
        notes: purchaseForm.notes,
        date: new Date().toISOString(), // Optional: if your backend expects date
        lastUpdatedBy: user.Name // Make sure `user` is defined
      },
      getAuthHeader()
    );

    toast.success("Purchase added successfully!");
    setShowAddMaterialForm(false);
    setPurchaseForm({
      materialType: '',
      quantity: '',
      companyName: '',
      cost: '',
      supplier: '',
      notes: ''
    });
    fetchAllData(); // reload data
    fetchRecentUpdates(); // refresh history if needed
  } catch (err) {
    console.error("Error adding purchase:", err);
    toast.error(err.response?.data?.message || "Failed to add purchase");
  }
};

  // Calendar navigation
  const navigateDate = (direction) => {
    switch (calendarView) {
      case 'day':
        setCurrentDate(direction === 'next' ? addDays(currentDate, 1) : subDays(currentDate, 1));
        break;
      case 'week':
        setCurrentDate(direction === 'next' ? addWeeks(currentDate, 1) : subWeeks(currentDate, 1));
        break;
      case 'month':
        setCurrentDate(direction === 'next' ? addMonths(currentDate, 1) : subMonths(currentDate, 1));
        break;
      default:
        setCurrentDate(new Date());
    }
  };

  // Helper functions
 const filterStocks = () => {
  let results = stocks;

  // Search filter
  if (searchTerm) {
    const searchLower = searchTerm.toLowerCase();
    results = results.filter(stock => {
      const orgMatch = stock.organization.toLowerCase().includes(searchLower);
      const batchMatch = stock.batchNumber 
        ? stock.batchNumber.toString().toLowerCase().includes(searchLower)
        : false;
      return orgMatch || batchMatch;
    });
  }

  // Status filter
  switch (stockFilter) {
    case 'low':
      results = results.filter(stock => 
        stock.currentStock > 0 && stock.currentStock <= stock.minStockLevel
      );
      break;
    case 'out':
      results = results.filter(stock => stock.currentStock === 0);
      break;
    case 'healthy':
      results = results.filter(stock => stock.currentStock > stock.minStockLevel);
      break;
    default:
      // No additional filtering for 'all'
      break;
  }

  setFilteredStocks(results);
};

  const getStockStatus = (stock) => {
    if (stock.currentStock === 0) return 'Out of Stock';
    if (stock.currentStock <= stock.minStockLevel) return 'Low Stock';
    return 'In Stock';
  };

  const getStatusClass = (status) => {
    return status.toLowerCase().replace(/\s/g, '-');
  };

  const resetForm = () => {
    setNewStock({
      organization: '',
      size: '500ml',
      currentStock: 0,
      minStockLevel: 10,
      sellingPrice: 0,
      supplier: '',
      notes: '',
      lastRestockDate: '',
      nextRestockDate: ''
    });
  };

  const formatDateForInput = (dateString) => {
    if (!dateString) return '';
    return format(parseISO(dateString), 'yyyy-MM-dd');
  };

  const getMaterialIcon = (materialType) => {
    switch(materialType) {
      case 'PET Bottle': return <FaBoxOpen className="material-icon" />;
      case 'Cap White': 
      case 'Cap Black': return <FaBoxes className="material-icon" />;
      case 'Shrink Roll': return <FaBoxes className="material-icon" />;
      case 'Company Label': return <FaTags className="material-icon" />;
      default: return <FaBoxes className="material-icon" />;
    }
  };

  const getLowStockMaterials = () => {
    return rawMaterials.filter(material => material.currentStock < material.minStockLevel);
  };

  const handleMaterialSelect = (materialId) => {
    const material = rawMaterials.find(m => m._id === materialId);
    if (material) {
      setMaterialUpdate({
        materialId: material._id,
        materialType: material.materialType,
        currentStock: material.currentStock,
        minStockLevel: material.minStockLevel,
        costPerUnit: material.costPerUnit || 0,
        notes: '',
        companyName: material.companyName || ''
      });
    }
  };

  const renderRecentUpdates = () => {
    return (
      <div className="recent-updates-section">
        <h3><FaHistory /> Recent Material Updates</h3>
        <div className="updates-container">
          {recentUpdates.length > 0 ? (
            <table className="updates-table">
              <thead>
                <tr>
                  <th>Material</th>
                  <th>Updated By</th>
                  <th>Date</th>
                  <th>Previous</th>
                  <th>New</th>
                  <th>Difference</th>
                </tr>
              </thead>
              <tbody>
                {recentUpdates.map((update, index) => (
                  <tr key={index}>
                    <td>
                      {update.materialType}
                      {update.companyName && ` (${update.companyName})`}
                    </td>
                    <td>{update.changedBy}</td>
                    <td>{format(parseISO(update.changeDate), 'MM/dd/yyyy HH:mm')}</td>
                    <td>{update.previousValue}</td>
                    <td>{update.newValue}</td>
                    <td className={update.newValue > update.previousValue ? 'positive' : 'negative'}>
                      {update.newValue - update.previousValue}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p>No recent updates found</p>
          )}
        </div>
      </div>
    );
  };


  const renderCalendarDays = () => {
    let days = [];
    let startDate, endDate;

    switch (calendarView) {
      case 'day':
        startDate = currentDate;
        endDate = currentDate;
        days = [currentDate];
        
        break;
      case 'week':
        startDate = startOfWeek(currentDate);
        endDate = endOfWeek(currentDate);
        days = eachDayOfInterval({ start: startDate, end: endDate });
        break;
      case 'month':
        startDate = startOfMonth(currentDate);
        endDate = endOfMonth(currentDate);
        days = eachDayOfInterval({ start: startDate, end: endDate });
        break;
      default:
        days = [];
    }

    return days.map(day => {
      const dayPurchases = materialPurchases.filter(purchase => 
        isSameDay(parseISO(purchase.purchaseDate), day)
      );

      return (
        <div 
          key={day.toString()} 
          className={`calendar-day ${dayPurchases.length > 0 ? 'has-purchases' : ''}`}
          onClick={() => dayPurchases.length > 0 && setSelectedDayPurchases(dayPurchases)}
        >
          <div className="calendar-day-header">
            <h4>{format(day, 'EEE, MMM d')}</h4>
          <div className='calendar-puchase-info'>
             {dayPurchases.length > 0 && (
              <span className="day-indicator">
                <FaInfoCircle className='info-icon' /> {dayPurchases.length} purchase(s)
              </span>
            )}
          </div>
           
          </div>
        </div>
      );
    });
  };

 const renderSummaryReport = () => {
       if (!purchaseSummary) return null;

    return (
      <div className="summary-report">
        <h3>
          <FaChartBar /> Summary for {calendarView === 'day' ? format(currentDate, 'MMMM d, yyyy') : 
            calendarView === 'week' ? `Week of ${format(startOfWeek(currentDate), 'MMM d')}` : 
            format(currentDate, 'MMMM yyyy')}
        </h3>
        
        <div className="summary-totals">
          <div className="summary-card">
            <h4>Total Purchases</h4>
            <p>{purchaseSummary.totalPurchases}</p>
          </div>
          <div className="summary-card">
            <h4>Total Cost</h4>
            <p>${purchaseSummary.totalCost.toFixed(2)}</p>
          </div>
        </div>

        <div className="material-breakdown">
          <h4>Materials Breakdown</h4>
          <table className="summary-table">
            <thead>
              <tr>
                <th>Material</th>
                <th>Purchases</th>
                <th>Quantity</th>
                <th>Total Cost</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(purchaseSummary.materials).map(([material, data]) => (
                <tr key={material}>
                  <td>{material}</td>
                  <td>{data.count}</td>
                  <td>{data.quantity} pcs</td>
                  <td>${data.cost.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  };


  return (
    <div className="stock-management-container">
      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="modal-overlay">
          <div className="Warning-modal-content">
            <h2>Confirm Deletion</h2>
            <p>Are you sure you want to delete this stock item?</p>
            <div className="modal-actions">
              <button 
                className="cancel-button"
                onClick={() => setShowDeleteConfirm(false)}
              >
                Cancel
              </button>
              <button 
                className="confirm-button delete-confirm"
                onClick={handleDeleteConfirm}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Day Purchases Modal */}
      {selectedDayPurchases.length > 0 && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h2>Purchases on {format(parseISO(selectedDayPurchases[0].purchaseDate), 'MMMM d, yyyy')}</h2>
              <button 
                className="close-button"
                onClick={() => setSelectedDayPurchases([])}
              >
                <FaTimes />
              </button>
            </div>
            
            <div className="purchase-list-container">
              <table className="purchase-details-table">
                <thead>
                  <tr>
                    <th>Material</th>
                    <th>Quantity</th>
                    <th>Cost</th>
                    <th>Supplier</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedDayPurchases.map(purchase => (
                    <tr key={purchase._id}>
                      <td>{purchase.materialType}</td>
                      <td>{purchase.quantity}</td>
                      <td>${purchase.cost.toFixed(2)}</td>
                      <td>{purchase.supplier || 'N/A'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Update Material Modal */}
      {showUpdateMaterialForm && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>Update Material Stock</h2>
            {error && <p className="error-message">{error}</p>}
            
            <div className="form-group">
              <label>Select Material</label>
              <select
                value={materialUpdate.materialId}
                onChange={(e) => handleMaterialSelect(e.target.value)}
                required
              >
                <option value="">Select a material</option>
                {rawMaterials.map(material => (
                  <option key={material._id} value={material._id}>
                    {material.materialType}
                    {material.companyName && ` (${material.companyName})`}
                  </option>
                ))}
              </select>
            </div>
            
            {materialUpdate.materialId && (
              <>
                <div className="form-row">
                  <div className="form-group">
                    <label>Current Stock</label>
                    <input
                      type="number"
                      min="0"
                      value={materialUpdate.currentStock}
                      onChange={(e) => setMaterialUpdate({...materialUpdate, currentStock: e.target.value})}
                      required
                    />
                  </div>
                  
                  <div className="form-group">
                    <label>Min Stock Level</label>
                    <input
                      type="number"
                      min="0"
                      value={materialUpdate.minStockLevel}
                      onChange={(e) => setMaterialUpdate({...materialUpdate, minStockLevel: e.target.value})}
                      required
                    />
                  </div>
                </div>
                
                <div className="form-group">
                  <label>Cost Per Unit</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={materialUpdate.costPerUnit}
                    onChange={(e) => setMaterialUpdate({...materialUpdate, costPerUnit: e.target.value})}
                    required
                  />
                </div>
                
                {materialUpdate.materialType === 'Company Label' && (
                  <div className="form-group">
                    <label>Company Name</label>
                    <input
                      type="text"
                      value={materialUpdate.companyName}
                      onChange={(e) => setMaterialUpdate({...materialUpdate, companyName: e.target.value})}
                      required
                    />
                  </div>
                )}
                
                <div className="form-group">
                  <label>Notes</label>
                  <textarea
                    value={materialUpdate.notes}
                    onChange={(e) => setMaterialUpdate({...materialUpdate, notes: e.target.value})}
                    maxLength="500"
                  />
                </div>
              </>
            )}
            
            <div className="modal-actions">
              <button 
                className="cancel-button" 
                onClick={() => setShowUpdateMaterialForm(false)}
              >
                Cancel
              </button>
              <button 
                className="confirm-button" 
                onClick={handleUpdateMaterial}
                disabled={!materialUpdate.materialId}
              >
                Update
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Navigation Tabs */}
      <div className="main-tabs">
        <button 
          className={activeTab === 'bottleStock' ? 'active' : ''}
          onClick={() => setActiveTab('bottleStock')}
        >
          Bottle Stock
        </button>
        <button 
          className={activeTab === 'rawMaterials' ? 'active' : ''}
          onClick={() => setActiveTab('rawMaterials')}
        >
          Raw Materials
        </button>
        <button 
          className={activeTab === 'purchases' ? 'active' : ''}
          onClick={() => setActiveTab('purchases')}
        >
          Purchase Calendar
        </button>
        <button 
          className={activeTab === 'labels' ? 'active' : ''}
          onClick={() => setActiveTab('labels')}
        >
          Company Labels
        </button>
      </div>

      {/* Bottle Stock Management - keep this section the same as before */}

      {/* Bottle Stock Management */}
      {activeTab === 'bottleStock' && (
        <>
          {/* View Tabs */}
          <div className="view-tabs">
            <button 
              className={view === 'list' ? 'active' : ''}
              onClick={() => setView('list')}
            >
              Stock List
            </button>
            <button 
              className={view === 'details' ? 'active' : ''}
              onClick={() => setView('details')}
            >
              Stock Details
            </button>
          </div>

          {view === 'list' && (
            <>
              {/* Controls Section */}
              <div className="stock-controls">
                <button 
                  className="Button"
                  onClick={() => setShowAddForm(true)}
                >
                  <FaPlus/> Add Stock
                </button>
                
                <div className="search-filter">
                  <input
                    type="text"
                    placeholder="Search by organization or batch..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                  
                  <select
                    value={stockFilter}
                    onChange={(e) => setStockFilter(e.target.value)}
                  >
                    <option value="all">All Stock</option>
                    <option value="healthy">Healthy Stock</option>
                    <option value="low">Low Stock</option>
                    <option value="out">Out of Stock</option>
                  </select>
                </div>
              </div>

              {/* Add Stock Form */}
              {showAddForm && (
                <div className="modal-overlay">
                  <div className="modal-content">
                    <h2>Add New Bottle Stock</h2>
                    {error && <p className="error-message">{error}</p>}
                    
                    <div className="form-group">
                      <label>Organization</label>
                      <input
                        type="text"
                        value={newStock.organization}
                        onChange={(e) => setNewStock({...newStock, organization: e.target.value})}
                        required
                      />
                    </div>
                    
                    <div className="form-group">
                      <label>Size</label>
                      <select
                        value={newStock.size}
                        onChange={(e) => setNewStock({...newStock, size: e.target.value})}
                        required
                      >
                        <option value="500ml">500ml</option>
                        <option value="1L">1 Liter</option>
                      </select>
                    </div>
                    
                    <div className="form-row">
                      <div className="form-group">
                        <label>Current Stock</label>
                        <input
                          type="number"
                          min="0"
                          value={newStock.currentStock}
                          onChange={(e) => setNewStock({...newStock, currentStock: parseInt(e.target.value) || 0})}
                          required
                        />
                      </div>
                      
                      <div className="form-group">
                        <label>Min Stock Level</label>
                        <input
                          type="number"
                          min="1"
                          value={newStock.minStockLevel}
                          onChange={(e) => setNewStock({...newStock, minStockLevel: parseInt(e.target.value) || 10})}
                          required
                        />
                      </div>
                    </div>
                    
                  
                    
                    <div className="form-group">
                      <label>Last Restock Date</label>
                      <input
                        type="date"
                        value={newStock.lastRestockDate}
                        onChange={(e) => setNewStock({...newStock, lastRestockDate: e.target.value})}
                      />
                    </div>
                    
                    <div className="form-group">
                      <label>Next Restock Date</label>
                      <input
                        type="date"
                        value={newStock.nextRestockDate}
                        onChange={(e) => setNewStock({...newStock, nextRestockDate: e.target.value})}
                      />
                    </div>
                    
                  
                    
                    <div className="form-group">
                      <label>Notes</label>
                      <textarea
                        value={newStock.notes}
                        onChange={(e) => setNewStock({...newStock, notes: e.target.value})}
                        maxLength="500"
                      />
                    </div>
                    
                    <div className="modal-actions">
                      <button 
                        className="cancel-button" 
                        onClick={() => {
                          setShowAddForm(false);
                          setError('');
                        }}
                      >
                        Cancel
                      </button>
                      <button 
                        className="confirm-button" 
                        onClick={handleAddStock}
                      >
                        Add Stock
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Loading/Error States */}
              {loading ? (
               <div className="spinner-container">
      <div className="loading-spinner"></div>
    </div>
              ) : error ? (
                <p className="error-message">{error}</p>
              ) : (
                <div className="stock-table-container">
                  <table className="stock-table">
                    <thead>
                      <tr>
                        <th>Batch No.</th>
                        <th>Organization</th>
                        <th>Size</th>
                        <th>Current Stock</th>
                        <th>Last Restock</th>
                        <th>Next Restock</th>
                        <th>Status</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredStocks.map((stock) => {
                        const status = getStockStatus(stock);
                        const statusClass = getStatusClass(status);
                        
                        return (
                          <tr key={stock._id}>
                            <td>{stock.batchNumber || 'N/A'}</td>
                            <td>{stock.organization}</td>
                            <td>{stock.size}</td>
                            <td>{stock.currentStock}</td>
                            <td>
                              {stock.lastRestockDate 
                                ? format(parseISO(stock.lastRestockDate), 'MM/dd/yyyy')
                                : 'N/A'}
                            </td>
                            <td>
                              {stock.nextRestockDate 
                                ? format(parseISO(stock.nextRestockDate), 'MM/dd/yyyy')
                                : 'N/A'}
                            </td>
                            <td>
                              <div className={`status-cell ${statusClass}`}>
                                  {status}  
                              </div>
                              
                              </td>
                         
                            <td className="actions-cell">
                              <button 
                                className="edit-button"
                                onClick={() => {
                                  setSelectedStock({
                                    ...stock,
                                    lastRestockDate: formatDateForInput(stock.lastRestockDate),
                                    nextRestockDate: formatDateForInput(stock.nextRestockDate)
                                  });
                                  setShowEditForm(true);
                                  setError('');
                                }}
                              >
                               <FaEdit style={{ color: "#000000ff", fontSize: "12px", strokeWidth: 0.1 }} />
                              </button>
                              <button 
                                className="delete-button"
                                onClick={() => {
                                  setStockToDelete(stock._id);
                                  setShowDeleteConfirm(true);
                                }}
                              >
                              <FaTrash style={{ color: "#c53b3bff", fontSize: "12px", strokeWidth: 0.1 }} />
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </>
          )}

          {/* Stock Details View */}
          {view === 'details' && (
            <div className="stock-details-container">
              <h2>Stock Details</h2>
              
              <div className="stock-metrics">
                <div className="metric-card">
                  <h3>Total Items</h3>
                  <p>{stocks.length}</p>
                </div>
                
                <div className="metric-card">
                  <h3>In Stock</h3>
                  <p>
                    {stocks.filter(s => s.currentStock > s.minStockLevel).length}
                  </p>
                </div>
                
                <div className="metric-card">
                  <h3>Low Stock</h3>
                  <p>
                    {stocks.filter(s => 
                      s.currentStock > 0 && s.currentStock <= s.minStockLevel
                    ).length}
                  </p>
                </div>
                
                <div className="metric-card">
                  <h3>Out of Stock</h3>
                  <p>
                    {stocks.filter(s => s.currentStock === 0).length}
                  </p>
                </div>
              </div>
              
              <div className="detailed-stock-table">
                <table>
                  <thead>
                    <tr>
                      <th>Batch No.</th>
                      <th>Organization</th>
                      <th>Size</th>
                      <th>Current</th>
                      <th>Min Level</th>
                      <th>Last Restock</th>
                      <th>Next Restock</th>
                    
                    </tr>
                  </thead>
                  <tbody>
                    {stocks.map((stock) => (
                      <tr key={stock._id}>
                        <td>{stock.batchNumber || 'N/A'}</td>
                        <td>{stock.organization}</td>
                        <td>{stock.size}</td>
                        <td>{stock.currentStock}</td>
                        <td>{stock.minStockLevel}</td>
                        <td>
                          {stock.lastRestockDate 
                            ? format(parseISO(stock.lastRestockDate), 'MM/dd/yyyy')
                            : 'N/A'}
                        </td>
                        <td>
                          {stock.nextRestockDate 
                            ? format(parseISO(stock.nextRestockDate), 'MM/dd/yyyy')
                            : 'N/A'}
                        </td>
                    
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Edit Stock Form */}
          {showEditForm && selectedStock && (
            <div className="modal-overlay">
              <div className="modal-content">
                <div className = "Model-heading"> 
                  <h2>Edit Stock</h2>
                </div>
                
                {error && <p className="error-message">{error}</p>}
                
                <div className="form-group">
                  <label>Organization</label>
                  <input
                    type="text"
                    value={selectedStock.organization}
                    onChange={(e) => setSelectedStock({...selectedStock, organization: e.target.value})}
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label>Size</label>
                  <select
                    value={selectedStock.size}
                    onChange={(e) => setSelectedStock({...selectedStock, size: e.target.value})}
                    required
                  >
                    <option value="500ml">500ml</option>
                    <option value="1L">1 Liter</option>
                  </select>
                </div>
                
                <div className="form-row">
                  <div className="form-group">
                    <label>Current Stock</label>
                    <input
                      type="number"
                      min="0"
                      value={selectedStock.currentStock}
                      onChange={(e) => setSelectedStock({...selectedStock, currentStock: parseInt(e.target.value) || 0})}
                      required
                    />
                  </div>
                  
                  <div className="form-group">
                    <label>Min Stock Level</label>
                    <input
                      type="number"
                      min="1"
                      value={selectedStock.minStockLevel}
                      onChange={(e) => setSelectedStock({...selectedStock, minStockLevel: parseInt(e.target.value) || 10})}
                      required
                    />
                  </div>
                </div>
                
             
                
                <div className="form-group">
                  <label>Last Restock Date</label>
                  <input
                    type="date"
                    value={selectedStock.lastRestockDate}
                    onChange={(e) => setSelectedStock({...selectedStock, lastRestockDate: e.target.value})}
                  />
                </div>
                
                <div className="form-group">
                  <label>Next Restock Date</label>
                  <input
                    type="date"
                    value={selectedStock.nextRestockDate}
                    onChange={(e) => setSelectedStock({...selectedStock, nextRestockDate: e.target.value})}
                  />
                </div>
                
              
                
                <div className="form-group">
                  <label>Notes</label>
                  <textarea
                    value={selectedStock.notes}
                    onChange={(e) => setSelectedStock({...selectedStock, notes: e.target.value})}
                    maxLength="500"
                  />
                </div>
                
                <div className="modal-actions">
                  <button 
                    className="cancel-button" 
                    onClick={() => {
                      setShowEditForm(false);
                      setError('');
                    }}
                  >
                    Cancel
                  </button>
                  <button 
                    className="confirm-button" 
                    onClick={handleEditStock}
                  >
                    Save Changes
                  </button>
                </div>
              </div>
            </div>
          )}
        </>
      )}


{showAddMaterialForm && (
  <div className="modal-overlay">
    <div className="modal-content">
      <h2>Add Material Purchase</h2>
      {error && <p className="error-message">{error}</p>}

      {/* Material Type */}
      <div className="form-group">
        <label>Material Type</label>
        <select
          value={purchaseForm.materialType}
          onChange={(e) =>
            setPurchaseForm({ ...purchaseForm, materialType: e.target.value })
          }
          required
        >
          <option value="">Select Type</option>
          <option value="PET Bottle">PET Bottle</option>
          <option value="Cap White">Cap White</option>
          <option value="Cap Black">Cap Black</option>
          <option value="Shrink Roll">Shrink Roll</option>
      
        </select>
      </div>

      {/* Company Name (only if Company Label) */}
      {purchaseForm.materialType === "Company Label" && (
        <div className="form-group">
          <label>Company Name</label>
          <input
            type="text"
            value={purchaseForm.companyName}
            onChange={(e) =>
              setPurchaseForm({ ...purchaseForm, companyName: e.target.value })
            }
            required
          />
        </div>
      )}

      {/* Quantity */}
      <div className="form-group">
        <label>Quantity</label>
        <input
          type="number"
          min="1"
          value={purchaseForm.quantity}
          onChange={(e) =>
            setPurchaseForm({
              ...purchaseForm,
              quantity: parseInt(e.target.value),
            })
          }
          required
        />
      </div>

      {/* Cost */}
      <div className="form-group">
        <label>Cost</label>
        <input
          type="number"
          min="0"
          step="0.01"
          value={purchaseForm.cost}
          onChange={(e) =>
            setPurchaseForm({
              ...purchaseForm,
              cost: parseFloat(e.target.value),
            })
          }
          required
        />
      </div>

      {/* Supplier (optional) */}
      <div className="form-group">
        <label>Supplier (optional)</label>
        <input
          type="text"
          value={purchaseForm.supplier}
          onChange={(e) =>
            setPurchaseForm({
              ...purchaseForm,
              supplier: e.target.value,
            })
          }
        />
      </div>

      {/* Notes */}
      <div className="form-group">
        <label>Notes</label>
        <textarea
          value={purchaseForm.notes}
          onChange={(e) =>
            setPurchaseForm({ ...purchaseForm, notes: e.target.value })
          }
          maxLength="500"
        />
      </div>

      {/* Modal Actions */}
      <div className="modal-actions">
        <button
          className="cancel-button"
          onClick={() => setShowAddMaterialForm(false)}
        >
          Cancel
        </button>
        <button className="confirm-button" onClick={handleAddMaterialPurchase}>
          Add
        </button>
      </div>
    </div>
  </div>
)}


















      {/* Raw Materials Management */}
      {activeTab === 'rawMaterials' && (
        <div className="raw-materials-container">
          <div className="Buttons">
           
             
             <button  className="Button" onClick={() => setShowAddMaterialForm(true)}>
                    <FaPlus /> Add Purchase
            </button>

            <button 
              className="Button"
              
              onClick={() => {
                setShowUpdateMaterialForm(true);
                setMaterialUpdate({
                  materialId: '',
                  materialType: '',
                  currentStock: 0,
                  minStockLevel: 0,
                  costPerUnit: 0,
                  notes: '',
                  companyName: ''
                });
              }}
            >
              <FaPlus/> Update 
            </button>
           

          </div>

          {/* Low Stock Warning */}
          {getLowStockMaterials().length > 0 && (
            <div className="alert-warning">
              <FaExclamationTriangle /> The following materials are low on stock:
              <ul>
                {getLowStockMaterials().map(material => (
                  <li key={material._id}>
                    {material.materialType} - {material.currentStock} {material.unit} (min: {material.minStockLevel})
                  </li>
                ))}
              </ul>
            </div>
          )}

        

          {/* Summary Boxes for Main Materials */}
          <div className="materials-summary">
            {['PET Bottle', 'Cap White', 'Cap Black', 'Shrink Roll'].map(type => {
              const material = rawMaterials.find(m => m.materialType === type) || {
                _id: type,
                materialType: type,
                currentStock: 0,
                minStockLevel: 500, 
                unit: 'pieces',    
                costPerUnit: 0     
              };
              
              return (
                <div 
                  key={material._id} 
                  className="summary-card"
                  onClick={() => {
                    setSelectedMaterial(material);
                    fetchMaterialHistory(material._id);
                  }}
                >
                 
                  <div className="summary-content">
                    <div className='row-material-box-header'> 
                          <div style={{display:"flex", justifyContent:"center", alignItems:"center"}}>
                            <div className="summary-icon">
                                {getMaterialIcon(material.materialType)}
                             </div>
                            <h3>{material.materialType}</h3>
                          </div>
                            <div className="summary-history">
                              <FaHistory /> History
                            </div>
                    </div>
                    <div className="summary-stock">
                      <span className="stock-value">{material.currentStock}</span>
                      <span className="stock-unit">{material.unit}</span>
                    </div>
                    <div className="summary-min">
                      Min: {material.minStockLevel}
                    </div>
                    {material.currentStock < material.minStockLevel && (
                      <div className="summary-alert">
                        <FaExclamationCircle /> Reorder needed
                      </div>
                    )}
                  </div>
                
                </div>
              );
            })}
          </div>
            {/* Recent Updates Section */}
          {renderRecentUpdates()}

          {/* Add Purchase Form - keep this the same as before */}

          {/* Material History Modal */}
          {showHistory && selectedMaterial && (
            <div className="modal-overlay">
              <div className="modal-content">
                <div className="history-header">
                  <h2>
                    {selectedMaterial.materialType} 
                    {selectedMaterial.materialType === 'Company Label' && ` - ${selectedMaterial.companyName}`}
                  </h2>
                   <button 
                    className="close-button"
                    onClick={() => setShowHistory(false)}
                  >
                    <FaTimes />
                  </button>
                </div>

               
                    <div className='sub-heading'>Stock History</div>
                
              
                
                <div className="history-table-container">
                  <table className="history-table">
                    <thead>
                      <tr>
                        <th>Date</th>
                        <th>Changed By</th>
                        <th>Previous</th>
                        <th>New</th>
                        <th>Difference</th>
                        <th>Notes</th>
                      </tr>
                    </thead>
                    <tbody>
                      {materialHistory.map((record, index) => (
                        <tr key={index}>
                          <td>{format(parseISO(record.changeDate), 'MM/dd/yyyy HH:mm')}</td>
                          <td>{record.changedBy}</td>
                          <td>{record.previousValue}</td>
                          <td>{record.newValue}</td>
                          <td className={record.newValue > record.previousValue ? 'positive' : 'negative'}>
                            {record.newValue - record.previousValue}
                          </td>
                          <td>{record.notes || '-'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Keep the rest of your existing code for other tabs */}
           {/* Purchase Calendar */}
       {activeTab === 'purchases' && (
        <div className="purchase-calendar-container">
          <div className="calendar-header">
          
            
            <div className="calendar-controls">
              <div className="view-selector">
                <button 
                  className={calendarView === 'day' ? 'active' : ''} 
                  onClick={() => setCalendarView('day')} 
                >  
                  Day 
                </button> 
                <button
                  className={calendarView === 'week' ? 'active' : ''}
                  onClick={() => setCalendarView('week')}
                >
                  Week
                </button>
                <button
                  className={calendarView === 'month' ? 'active' : ''}
                  onClick={() => setCalendarView('month')}
                >
                  Month
                </button>
              </div>
              
              <div className="date-navigation">
                <button 
                  className="nav-button"
                  onClick={() => navigateDate('prev')}
                >
                  <FaChevronLeft />
                </button>
                
                <h3>
                  {calendarView === 'day' ? format(currentDate, 'MMMM d, yyyy') : 
                   calendarView === 'week' ? `Week of ${format(startOfWeek(currentDate), 'MMM d')}` : 
                   format(currentDate, 'MMMM yyyy')}
                </h3>
                
                <button 
                  className="nav-button"
                  onClick={() => navigateDate('next')}
                >
                  <FaChevronRight/>
                </button>
              </div>
              
             
            </div>
          </div>
          
          {/* Summary Report */}
          {renderSummaryReport()}
          
          {/* Calendar View */}
          
          <div className={`calendar-view ${calendarView}`}>
            {renderCalendarDays()}
          </div>
        </div>
      )}

  {activeTab === 'labels' && (
  <div className="labels-container">
    {/* View Tabs */}
    <div className="view-tabs">
      <button 
        className={view === 'list' ? 'active' : ''}
        onClick={() => setView('list')}
      >
        Labels List
      </button>
      <button 
        className={view === 'details' ? 'active' : ''}
        onClick={() => setView('details')}
      >
        Labels Details
      </button>
    </div>

    {view === 'list' && (
      <>
        {/* Controls Section */}
        <div className="stock-controls">
          <button 
            className="Button"
            onClick={() => setShowAddForm(true)}
          >
            <FaPlus/> Add Label
          </button>
          
          <div className="search-filter">
            <input
              type="text"
              placeholder="Search by label name..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                filterLabels(e.target.value, labelFilter);
              }}
            />
            
            <select
              value={labelFilter}
              onChange={(e) => {
                setLabelFilter(e.target.value);
                filterLabels(searchTerm, e.target.value);
              }}
            >
              <option value="all">All Labels</option>
              <option value="healthy">Healthy Stock</option>
              <option value="low">Low Stock</option>
              <option value="out">Out of Stock</option>
            </select>
          </div>
        </div>

        {/* Add Label Form */}
        {showAddForm && (
          <div className="modal-overlay">
            <div className="modal-content">
              <h2>Add New Company Label</h2>
              {error && <p className="error-message">{error}</p>}
              
              <div className="form-group">
                <label>Label Name</label>
                <input
                  type="text"
                  value={newLabel.labelName}
                  onChange={(e) => setNewLabel({...newLabel, labelName: e.target.value})}
                  required
                />
              </div>
              
              <div className="form-group">
                <label>Initial Stock</label>
                <input
                  type="number"
                  min="0"
                  value={newLabel.stock}
                  onChange={(e) => setNewLabel({...newLabel, stock: parseInt(e.target.value) || 0})}
                  required
                />
              </div>
              
              <div className="form-group">
                <label>Min Stock Level</label>
                <input
                  type="number"
                  min="0"
                  value={newLabel.minStockLevel}
                  onChange={(e) => setNewLabel({...newLabel, minStockLevel: parseInt(e.target.value) || 100})}
                  required
                />
              </div>
              
              <div className="modal-actions">
                <button 
                  className="cancel-button" 
                  onClick={() => {
                    setShowAddForm(false);
                    setError('');
                  }}
                >
                  Cancel
                </button>
                <button 
                  className="confirm-button" 
                  onClick={handleAddLabel}
                >
                  Add Label
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Loading/Error States */}
        {loading ? (
          <div className="loading-indicator">Loading...</div>
        ) : error ? (
          <p className="error-message">{error}</p>
        ) : (
          <div className="stock-table-container">
            <table className="stock-table">
              <thead>
                <tr>
                  <th>Label Name</th>
                  <th>Current Stock</th>
                  <th>Updated By</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredLabels.map((label) => {
                  const status = getLabelStatus(label);
                  
                  const statusClass = getStatusClass(status);
                  
                  return (
                    <tr key={label._id}>
                      <td>{label.labelName}</td>
                      <td >
                        {label.stock}
                      </td>
                      <td>{label.lastUpdatedBy || 'N/A'}</td>
                      <td>
                        <span  className={`status-cell ${statusClass}`}>
                          {status}
                        </span>
                      </td>
                      <td className="actions-cell">
                        <button 
                          className="action-button"
                          onClick={() => {
                            setSelectedLabel({
                              ...label,
                              stock: label.stock.toString(),
                              minStockLevel: label.minStockLevel.toString()
                            });
                            setShowEditForm(true);
                            setError('');
                          }}
                        >
                          <FaEdit />
                        </button>
                        <button 
                          className="action-button"
                          onClick={() => {
                            setSelectedLabelHistory(label);
                            fetchLabelHistory(label._id);
                          }}
                        >
                          <FaHistory />
                        </button>
                        <button 
                          className="action-button"
                          onClick={() => {
                            setLabelToDelete(label._id);
                            setShowDeleteConfirm(true);
                          }}
                        >
                          <FaTrash />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </>
    )}

    {/* Labels Details View */}
    {view === 'details' && (
  <div className="stock-details-container">
    <h2>Labels Details</h2>
    
    <div className="stock-metrics">
      <div 
        className={`metric-card company-label-detail-all ${detailFilter === 'all' ? 'active' : ''}`}
        onClick={() => setDetailFilter('all')}
      >
        <h3>Total Labels</h3>
        <p>{labels.length}</p>
      </div>
      
      <div 
        className={`metric-card company-label-detail-healthy ${detailFilter === 'healthy' ? 'active' : ''}`}
        onClick={() => setDetailFilter('healthy')}
      >
        <h3>Healthy Stock</h3>
        <p>
          {labels.filter(l => l.stock >= l.minStockLevel).length}
        </p>
      </div>
      
      <div 
        className={`metric-card company-label-detail-low ${detailFilter === 'low' ? 'active' : ''}`}
        onClick={() => setDetailFilter('low')}
      >
        <h3>Low Stock</h3>
        <p>
          {labels.filter(l => l.stock > 0 && l.stock < l.minStockLevel).length}
        </p>
      </div>
      
      <div 
        className={`metric-card company-label-detail-out ${detailFilter === 'out' ? 'active' : ''}`}
        onClick={() => setDetailFilter('out')}
      >
        <h3>Out of Stock</h3>
        <p>
          {labels.filter(l => l.stock === 0).length}
        </p>
      </div>
    </div>
    
    <div className="detailed-stock-table">
      <table>
        <thead>
          <tr>
            <th>Label Name</th>
            <th>Current Stock</th>
            <th>Min Stock</th>
            <th>Status</th>
            <th>Updated By</th>
          </tr>
        </thead>
        <tbody>
          {labels
            .filter(label => {
              switch(detailFilter) {
                case 'healthy':
                  return label.stock >= label.minStockLevel;
                case 'low':
                  return label.stock > 0 && label.stock < label.minStockLevel;
                case 'out':
                  return label.stock === 0;
                default:
                  return true; // 'all' filter
              }
            })
            .map((label) => {
              const status = getLabelStatus(label);
              const statusClass = getStatusClass(status);
              
              return (
                <tr key={label._id}>
                  <td>{label.labelName}</td>
                  <td>
                    {label.stock}
                  </td>
                  <td>{label.minStockLevel}</td>
                  <td>
                    <span className={`status-cell company-label-detail-status ${statusClass}`}>
                      {status}
                    </span>
                  </td>
                  <td className="company-label-detail-updatedby">
                    {label.lastUpdatedBy || 'N/A'}
                  </td>
                </tr>
              );
            })}
        </tbody>
      </table>
    </div>
  </div>
)}

    {/* Edit Label Form */}
    {showEditForm && selectedLabel && (
      <div className="modal-overlay">
        <div className="modal-content">
          <div className="Model-heading"> 
            <h2>Edit Label</h2>
          </div>
          
          {error && <p className="error-message">{error}</p>}
          
          <div className="form-group">
            <label>Label Name</label>
            <input
              type="text"
              value={selectedLabel.labelName}
              onChange={(e) => setSelectedLabel({...selectedLabel, labelName: e.target.value})}
              required
            />
          </div>
          
          <div className="form-row">
            <div className="form-group">
              <label>Current Stock</label>
              <input
                type="number"
                min="0"
                value={selectedLabel.stock}
                onChange={(e) => setSelectedLabel({...selectedLabel, stock: e.target.value})}
                required
              />
            </div>
            
            <div className="form-group">
              <label>Min Stock Level</label>
              <input
                type="number"
                min="0"
                value={selectedLabel.minStockLevel}
                onChange={(e) => setSelectedLabel({...selectedLabel, minStockLevel: e.target.value})}
                required
              />
            </div>
          </div>
          
          <div className="modal-actions">
            <button 
              className="cancel-button" 
              onClick={() => {
                setShowEditForm(false);
                setError('');
              }}
            >
              Cancel
            </button>
            <button 
              className="confirm-button" 
              onClick={handleEditLabel}
            >
              Save Changes
            </button>
          </div>
        </div>
      </div>
    )}

    {/* Label History Modal */}
    {showLabelHistory && (
      <div className="modal-overlay">
        <div className="modal-content">
          <div className="history-header">
            <h2>{selectedLabelHistory?.labelName} - History</h2>
            <button 
              className="close-button"
              onClick={() => setShowLabelHistory(false)}
            >
              <FaTimes />
            </button>
          </div>
          
          {loading ? (
            <div className="loading-indicator">Loading history...</div>
          ) : (
            <div className="history-table-container">
              <table className="history-table">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Action</th>
                    <th>User</th>
                    <th>Stock Change</th>
                    <th>Previous</th>
                    <th>New</th>
                  </tr>
                </thead>
                <tbody>
                  {labelHistory.map((record, index) => {
                    const stockChange = record.newStock - record.previousStock;
                    return (
                      <tr key={index}>
                        <td>{format(parseISO(record.timestamp), 'MM/dd/yyyy HH:mm')}</td>
                        <td>{record.action}</td>
                        <td>{record.userName}</td>
                        <td className={stockChange > 0 ? 'positive' : 'negative'}>
                          {stockChange > 0 ? `+${stockChange}` : stockChange}
                        </td>
                        <td>{record.previousStock}</td>
                        <td className={stockChange > 0 ? 'positive' : 'negative'}>
                          { stockChange > 0 ? "+" + record.newStock:"-" + record.newStock }
                          
                          </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    )}

    {/* Delete Confirmation Modal */}
    {showDeleteConfirm && (
      <div className="modal-overlay">
        <div className="Warning-modal-content">
          <h2>Confirm Deletion</h2>
          <p>Are you sure you want to delete this label?</p>
          <div className="modal-actions">
            <button 
              className="cancel-button"
              onClick={() => setShowDeleteConfirm(false)}
            >
              Cancel
            </button>
            <button 
              className="confirm-button delete-confirm"
              onClick={handleDeleteLabel}
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    )}
  </div>
)}

    </div>
  );
};

export default BottleStockManagement;