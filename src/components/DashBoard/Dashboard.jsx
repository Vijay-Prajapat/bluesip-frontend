
// import React, { useState, useEffect } from "react";
// import { BsFileEarmarkMinus, BsArrowBarRight,  BsPersonSquare  } from "react-icons/bs";
// import axios from "axios";
// import jsPDF from "jspdf";
// import html2canvas from "html2canvas";
// import { jwtDecode } from "jwt-decode";
// import { useNavigate } from "react-router-dom";
// import "./Dashboard.css";
// import StockManagement from "./StockManagement";
// import CreateTab from "./CreateTab";
// import Calendar from "./Calendar";
// import Invoices from "./Invoices"
// import Register from "../Register/Register";
// import Welcome from "./Welcome";
// const InvoiceApp = () => {
//   const navigate = useNavigate();
//   const [user, setUser] = useState({
//     Id: "N/A",
//     Name: "N/A",
//     Email: "N/A",
//     role : "staff"
//   });
//  const [showSplash, setShowSplash] = useState(true);
//   const [isAdmin ,setisAdmin]= useState(false);
//  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
//  const handleLogout = () => {
//     localStorage.removeItem("token");
//     navigate("/");
//   };

//   const [invoices, setInvoices] = useState([]);
 
//   useEffect(() => {
//     const checkAuth = async () => {
//       const token = localStorage.getItem("token");
      
//       if (!token) {
//         navigate("/");
//         return;
//       }

//       try {
//         const decoded = jwtDecode(token);
//         const userId = decoded.id;
//         const role = decoded.role;
//         if(role == "admin")
//         {
//           setisAdmin(true);
//         }
//         const response = await axios.get(`https://bluesip-backend.onrender.com/api/users/${userId}`, {
//           headers: { Authorization: `Bearer ${token}` }
//         });

//         if (response.data) {
//           setUser(response.data);
          
//           console.log(response.data);
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
//     fetchInvoices();
//   }, [navigate]);

  
//     useEffect(() => {
//     const timer = setTimeout(() => {
//       setShowSplash(false);
//     }, 10000); // 4 seconds
//     return () => clearTimeout(timer);
//   }, []);


  
  

 
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

//   const [activeTab, setActiveTab] = useState(() => {
//     return localStorage.getItem("activeTab") || "create";
//   });
  
//      useEffect(() => {
//     localStorage.setItem("activeTab", activeTab);
//   }, [activeTab]);

//   let content;
//   switch (activeTab) {
//     case "create":
//       content = <CreateTab />;
//       break;
//     case "invoices":
//       content = <Invoices />;
//       break;
//     case "StockManagement":
//       content = <StockManagement />;
//       break;
//     case "Calendar":
//       content = <Calendar />;
//       break;
//     case "Register":
//       content = <Register/>;
//       break;
//     default:
//       content = <p>Invalid tab selected</p>;
//   }


//  return showSplash ? (
//     <Welcome />
//   ) : (
//     <div className="invoice-app">
//       {/* Header */}
//       <header className="app-header">
//         <div className="header-content">
//           <div className="company_logo">
//             <img src="White-Logo.png" alt="" />
//           </div>
//           <div className="logo">
//             <h1>RADHE AQUATECH</h1>
//           </div>
//           <div className="user-profile">
//             <div className="avatar">
//               <i className="fas fa-user"></i>
//             </div>
//             <div className="user-info-header">
//               <span className="user-name-header">{user?.name || "N/A"}</span>
//               <span className="user-email-header">{user?.email || "N/A"}</span>
//             </div>
//           </div>
//         </div>
//       </header>

//       {/* Navigation Tabs */}
//       <div className="app-tabs">
//         <div className="app-tab-logout">
//           <div>
//             <button
//               className={`tab-btn ${activeTab === "create" ? "active" : ""}`}
//               onClick={() => setActiveTab("create")}
//             >
//               <BsFileEarmarkMinus className="sidebar-icon" />
//               Create Invoice
//             </button>
//             <button
//               className={`tab-btn ${activeTab === "invoices" ? "active" : ""}`}
//               onClick={() => setActiveTab("invoices")}
//             >
//               <i className="fas fa-history"></i> Invoice History
//             </button>
//             <button
//               className={`tab-btn ${
//                 activeTab === "StockManagement" ? "active" : ""
//               }`}
//               onClick={() => setActiveTab("StockManagement")}
//             >
//               <i className="fas fa-cubes"></i> Stock Management
//             </button>
//             <button
//               className={`tab-btn ${activeTab === "Calendar" ? "active" : ""}`}
//               onClick={() => setActiveTab("Calendar")}
//             >
//               <i className="fas fa-calendar"></i> Calendar
//             </button>
//           </div>
//           <div>
//             {isAdmin ? (
//               <button
//                 className={`tab-btn ${
//                   activeTab === "Register" ? "active" : ""
//                 }`}
//                 onClick={() => setActiveTab("Register")}
//               >
//                 Users
//               </button>
//             ) : (
//               ""
//             )}
//             <button
//               className="tab-btn logout-btn"
//               onClick={() => setShowLogoutConfirm(true)}
//             >
//               <i
//                 className="fas fa-sign-out-alt"
//                 style={{ fontSize: "10px", marginRight: "-5px" }}
//               ></i>{" "}
//               Logout
//             </button>
//           </div>
//         </div>
//       </div>

//       {/* Logout Confirmation Popup */}
//       {showLogoutConfirm && (
//         <div className="logout-confirm-modal">
//           <div className="confirm-content">
//             <h3>Confirm Logout</h3>
//             <p>Are you sure you want to logout?</p>
//             <div className="button-group">
//               <button onClick={handleLogout} className="confirm-btn">
//                 Yes, Logout
//               </button>
//               <button
//                 onClick={() => setShowLogoutConfirm(false)}
//                 className="cancel-btn"
//               >
//                 Cancel
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       <div className="app-container">{content}</div>
//     </div>
//   );
// };


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

// export default InvoiceApp;






import React, { useState, useEffect } from "react";
import axios from "axios";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";
import "./Dashboard.css";
import StockManagement from "./StockManagement";
import CreateTab from "./CreateTab";
import Calendar from "./Calendar";
import Invoices from "./Invoices";
import Register from "../Register/Register";
import Welcome from "./Welcome";
import { BsFileEarmarkMinus, BsArrowBarRight,  BsPersonSquare  } from "react-icons/bs";
import { MdOutlineHistory } from "react-icons/md";
import { FaRegCircleUser } from "react-icons/fa6";
import { BsPersonStanding } from "react-icons/bs";
import { IoLogOutOutline } from "react-icons/io5";
import { BiSolidUserCircle } from "react-icons/bi";
const InvoiceApp = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState({
    Id: "N/A",
    Name: "N/A",
    Email: "N/A",
    role: "staff"
  });
  
 const [showSplash, setShowSplash] = useState(true);
     useEffect(() => {
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 7000); // 4 seconds
    return () => clearTimeout(timer);
  }, []);


  const [isAdmin, setisAdmin] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  
  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  const [invoices, setInvoices] = useState([]);
  const [activeTab, setActiveTab] = useState(() => {
    return localStorage.getItem("activeTab") || "create";
  });

  useEffect(() => {
    localStorage.setItem("activeTab", activeTab);
  }, [activeTab]);

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
        const role = decoded.role;
        if (role == "admin") {
          setisAdmin(true);
        }
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
        navigate("/login");
      }
    };

    checkAuth();
    fetchInvoices();
  }, [navigate]);

  const fetchInvoices = async () => {
    try {
      const res = await axios.get("https://bluesip-backend.onrender.com/api/invoices");
      setInvoices(res.data);
    } catch (error) {
      console.error("Error fetching invoices:", error);
    }
  };

  let content;
  switch (activeTab) {
    case "create":
      content = <CreateTab />;
      break;
    case "invoices":
      content = <Invoices />;
      break;
    case "StockManagement":
      content = <StockManagement />;
      break;
    case "Calendar":
      content = <Calendar />;
      break;
    case "Register":
      content = <Register />;
      break;
    default:
      content = <p>Invalid tab selected</p>;
  }

  return showSplash ? (
    <Welcome />
  ): (
    <div className="invoice-app">
      {/* Sidebar */}
      <div className="sidebar">
  <div className="sidebar-header">
    <div className="company-logo">
      <img src="White-Logo.png" alt="Company Logo" />
    </div>
 
  </div>
  
  <div className="sidebar-menu">
    <button
      className={`sidebar-btn ${activeTab === "create" ? "active" : ""}`}
      onClick={() => setActiveTab("create")}
    >
     <BsFileEarmarkMinus className="sidebar-icon"/>
      <span>Create Invoice</span>
    </button>
    <button
      className={`sidebar-btn ${activeTab === "invoices" ? "active" : ""}`}
      onClick={() => setActiveTab("invoices")}
    >
      <MdOutlineHistory className="sidebar-icon"/>
      <span>Invoice History</span>
    </button>
    <button
      className={`sidebar-btn ${activeTab === "StockManagement" ? "active" : ""}`}
      onClick={() => setActiveTab("StockManagement")}
    >
      <svg className="sidebar-icon" viewBox="0 0 24 24">
        <path d="M18 6h-2c0-2.21-1.79-4-4-4S8 3.79 8 6H6c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zm-6-2c1.1 0 2 .9 2 2h-4c0-1.1.9-2 2-2zm6 16H6V8h2v2c0 .55.45 1 1 1s1-.45 1-1V8h4v2c0 .55.45 1 1 1s1-.45 1-1V8h2v12z"/>
      </svg>
      <span>Stock Management</span>
    </button>
    <button
      className={`sidebar-btn ${activeTab === "Calendar" ? "active" : ""}`}
      onClick={() => setActiveTab("Calendar")}
    >
      <svg className="sidebar-icon" viewBox="0 0 24 24">
        <path d="M19 4h-1V2h-2v2H8V2H6v2H5c-1.11 0-1.99.9-1.99 2L3 20c0 1.1.89 2 2.01 2H19c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V10h14v10zm0-12H5V6h14v2z"/>
      </svg>
      <span>Calendar</span>
    </button>
    {isAdmin && (
      <button
        className={`sidebar-btn ${activeTab === "Register" ? "active" : ""}`}
        onClick={() => setActiveTab("Register")}
      >
        <svg className="sidebar-icon" viewBox="0 0 24 24">
          <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z"/>
        </svg>
        <span>Users</span>
      </button>
    )}
  </div>
  
  <div className="sidebar-footer">
    <div className="user-profile-sidebar">
      
< BiSolidUserCircle  className="sidebar-icon"  style ={{marginTop:"5px", cursor:"pointer"}}/>
      <div className="user-info">
        <span className="user-name" >{user?.name || "N/A"}</span>
      </div>
      
    <div  
      onClick={() => setShowLogoutConfirm(true)}
      style ={{marginLeft:"10px", marginTop:"10px", cursor:"pointer"}}
    >
    <IoLogOutOutline  className="sidebar-icon" />
   </div>  
    </div>
    <p style={{fontSize:"12px", textAlign:"center", color:"gray"}}>{user?.email || "N/A"}</p>
  </div>
</div>

      {/* Main Content */}
      <div className="main-content">
        {/* Top Bar with User Info */}
        <div className="top-bar">
          <div>
               <h2>RADHE AQUATECH</h2>
          </div>
          <div className="user-profile-top">
            <span className="user-name-top">{user?.name || "N/A"}</span>
            <div className="avatar-top">
              <i className="fas fa-user"></i>
            </div>
          </div>
        </div>
        
        {/* Page Content */}
        <div className="content-container">
          {content}
        </div>
      </div>

      {/* Logout Confirmation Popup */}
      {showLogoutConfirm && (
        <div className="logout-confirm-modal">
          <div className="confirm-content">
            <h3>Confirm Logout</h3>
            <p>Are you sure you want to logout?</p>
            <div className="button-group">
              <button 
                onClick={handleLogout}
                className="confirm-btn"
              >
                Yes, Logout
              </button>
              <button 
                onClick={() => setShowLogoutConfirm(false)}
                className="cancel-btn"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

        
      



// Number to words function
function numberToWords(num) {
  const single = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine'];
  const double = ['Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];
  const tens = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];
  const formatTenth = (digit, prev) => {
    return 0 === digit ? '' : ' ' + (1 === digit ? double[prev] : tens[digit]);
  };
  const formatOther = (digit, next, denom) => {
    return (0 !== digit && 1 !== next ? ' ' + single[digit] : '') + (0 !== next || digit > 0 ? ' ' + denom : '');
  };

  let str = '';
  let rupees = parseFloat(num) || 0;
  rupees = Math.round(rupees * 100) / 100;
  
  if (rupees === 0) return 'Zero Rupees';
  
  const strRupees = rupees.toString().split('.');
  let whole = parseInt(strRupees[0], 10);
  
  // Handle whole number part
  if (whole > 0) {
    let digits = whole % 100;
    if (digits > 0) {
      const units = digits % 10;
      digits = Math.floor(digits / 10);
      const tensPlace = formatTenth(digits, units);
      const onesPlace = digits > 1 && units > 0 ? ' ' + single[units] : units > 0 ? single[units] : '';
      str = tensPlace + onesPlace;
    }
    
    whole = Math.floor(whole / 100);
    if (whole > 0) {
      str = single[whole] + ' Hundred' + (str ? ' and ' + str : '');
    }
  }
  
  return str + ' Rupees' + (strRupees[1] ? ' and ' + single[parseInt(strRupees[1])] + ' Paise' : '');
}

export default InvoiceApp;