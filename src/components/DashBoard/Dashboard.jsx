
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
import Invoices from "./Invoices"
import Register from "../Register/Register";
const InvoiceApp = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState({
    Id: "N/A",
    Name: "N/A",
    Email: "N/A",
    role : "staff"
  });

  const [isAdmin ,setisAdmin]= useState(false);
 const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
 const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  const [invoices, setInvoices] = useState([]);
 
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
        const role = decoded.role;
        if(role == "admin")
        {
          setisAdmin(true);
        }
        const response = await axios.get(`https://bluesip-backend.onrender.com/api/users/${userId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        if (response.data) {
          setUser(response.data);
          
          console.log(response.data);
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

  const downloadPDF = async (invoiceData) => {
    const input = document.getElementById(`invoice-${invoiceData._id || 'preview'}`);
    
    // Create a clone of the element to avoid affecting the original
    const clone = input.cloneNode(true);
    clone.style.position = 'absolute';
    clone.style.left = '-9999px';
    clone.style.width = '800px';
    document.body.appendChild(clone);
    
    try {
      const canvas = await html2canvas(clone, { 
        scale: 2,
        logging: true,
        useCORS: true,
        allowTaint: true
      });
      
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF('p', 'mm', 'a4');
      const imgWidth = 210;
      const pageHeight = 295;
      const imgHeight = canvas.height * imgWidth / canvas.width;
      let heightLeft = imgHeight;
      let position = 0;
      
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
      
      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }
      
      pdf.save(`Radhe-Aquatech-Invoice-${invoiceData.invoiceNo || 'preview'}.pdf`);
    } catch (error) {
      console.error("Error generating PDF:", error);
      alert("Failed to generate PDF");
    } finally {
      document.body.removeChild(clone);
    }
  };

  const [activeTab, setActiveTab] = useState(() => {
    return localStorage.getItem("activeTab") || "create";
  });
  
     useEffect(() => {
    localStorage.setItem("activeTab", activeTab);
  }, [activeTab]);

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
      content = <Register/>;
      break;
    default:
      content = <p>Invalid tab selected</p>;
  }

  return (
    <div className="invoice-app">
      {/* Header */}
      <header className="app-header">
        <div className="header-content">
           <div className="company_logo">
            <img src="White-Logo.png" alt="" />
          </div>
          <div className="logo">
             <h1>RADHE AQUATECH</h1>
          </div>
          <div className="user-profile">
            <div className="avatar">
              <i className="fas fa-user"></i>
            </div>
            <div className="user-info">
              <span className="user-name">{user?.name || "Sanskar Prajapat"}</span>
              <span className="user-email">{user?.email||""}</span>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
       <div className="app-tabs"> 
        <div className="app-tab-logout"> 
        <div>

          <button
          className={`tab-btn ${activeTab === "create" ? "active" : ""}`}
          onClick={() => setActiveTab("create")}
        >
          <i className="fas fa-plus-circle"></i> Create Invoice
        </button>
        <button
          className={`tab-btn ${activeTab === "invoices" ? "active" : ""}`}
          onClick={() => setActiveTab("invoices")}
        >
          <i className="fas fa-history"></i> Invoice History
        </button>
        <button
          className={`tab-btn ${activeTab === "StockManagement" ? "active" : ""}`}
          onClick={() => setActiveTab("StockManagement")}
        >
          <i className="fas fa-cubes"></i> Stock Management
        </button>
        <button
          className={`tab-btn ${activeTab === "Calendar" ? "active" : ""}`}
          onClick={() => setActiveTab("Calendar")}
        >
          <i className="fas fa-calendar"></i> Calendar
        </button> 
         </div>
         <div>
          { isAdmin ?  
            <button
          className={`tab-btn ${activeTab === "Register" ? "active" : ""}`}
          onClick={() => setActiveTab("Register")}
        >
         Users
        </button>:"" }
          <button
            className="tab-btn logout-btn"
            onClick={() => setShowLogoutConfirm(true)}
           
          >
            <i className="fas fa-sign-out-alt" style={{fontSize:"10px", marginRight:"0px"}}></i> Logout
          </button>
        </div>
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

        
      


      <div className="app-container">
         {content}
     </div>



      
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