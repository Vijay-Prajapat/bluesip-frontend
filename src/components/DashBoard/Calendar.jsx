// import React, { useState, useEffect, useRef } from 'react';
// import { 
//   format, startOfWeek, addDays, startOfMonth, endOfMonth, 
//   endOfWeek, isSameMonth, isSameDay, parseISO, startOfDay, endOfDay,
//   addMonths, subMonths, getHours, setHours, getMinutes, setMinutes
// } from 'date-fns';
// import axios from 'axios';
// import './Dashboard.css';

// const Calendar = () => {
//   const [currentDate, setCurrentDate] = useState(new Date());
//   const [selectedDate, setSelectedDate] = useState(new Date());
//   const [view, setView] = useState('month');
//   const [events, setEvents] = useState([]);
//   const [selectedEvent, setSelectedEvent] = useState(null);
//   const [dayEventsPopup, setDayEventsPopup] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const popupRef = useRef();
//   const dayPopupRef = useRef();

//   // Close popups when clicking outside
//   useEffect(() => {
//     const handleClickOutside = (event) => {
//       if (popupRef.current && !popupRef.current.contains(event.target)) {
//         setSelectedEvent(null);
//       }
//       if (dayPopupRef.current && !dayPopupRef.current.contains(event.target)) {
//         setDayEventsPopup(null);
//       }
//     };
//     document.addEventListener('mousedown', handleClickOutside);
//     return () => {
//       document.removeEventListener('mousedown', handleClickOutside);
//     };
//   }, []);

//   const getDateRange = (view, date) => {
//     switch(view) {
//       case 'month': return { start: startOfMonth(date), end: endOfMonth(date) };
//       case 'week': return { start: startOfWeek(date), end: endOfWeek(date) };
//       case 'day': default: return { start: startOfDay(date), end: endOfDay(date) };
//     }
//   };

//   useEffect(() => {
//     const fetchEvents = async () => {
//       setLoading(true);
//       try {
//         const { start, end } = getDateRange(view, view === 'day' ? selectedDate : currentDate);
//         const response = await axios.get('https://bluesip-backend.onrender.com/invoices/calendar', {
//           params: { 
//             startDate: start.toISOString(), 
//             endDate: end.toISOString(), 
//             viewType: view 
//           }
//         });
//         setEvents(response.data);
//       } catch (error) {
//         console.error('Fetch error:', error);
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchEvents();
//   }, [currentDate, selectedDate, view]);

//   const navigate = {
//     prev: view === 'month' ? () => setCurrentDate(subMonths(currentDate, 1)) :
//            view === 'week' ? () => setCurrentDate(addDays(currentDate, -7)) :
//            () => { setSelectedDate(addDays(selectedDate, -1)); setCurrentDate(addDays(selectedDate, -1)); },
//     next: view === 'month' ? () => setCurrentDate(addMonths(currentDate, 1)) :
//           view === 'week' ? () => setCurrentDate(addDays(currentDate, 7)) :
//           () => { setSelectedDate(addDays(selectedDate, 1)); setCurrentDate(addDays(selectedDate, 1)); },
//     today: () => { setCurrentDate(new Date()); setSelectedDate(new Date()); }
//   };

//   const renderHeader = () => {
//     const period = view === 'month' ? format(currentDate, 'MMMM yyyy') :
//                   view === 'week' ? `${format(startOfWeek(currentDate), 'MMM d')} - ${format(endOfWeek(currentDate), 'MMM d, yyyy')}` :
//                   format(selectedDate, 'EEEE, MMMM d, yyyy');
    
//     return (
//       <div className="calendar-header">
//         <h2 className="calendar-title">{period}</h2>
//         <div className="calendar-nav">
//           <button className="nav-button" onClick={navigate.prev}>←</button>
//           <button className="nav-button" onClick={navigate.today}>Today</button>
//           <button className="nav-button" onClick={navigate.next}>→</button>
//           <div className="view-toggle">
//             {['month', 'week', 'day'].map(v => (
//               <button 
//                 key={v}
//                 className={`view-button ${view === v ? 'active' : ''}`}
//                 onClick={() => setView(v)}
//               >
//                 {v.charAt(0).toUpperCase() + v.slice(1)}
//               </button>
//             ))}
//           </div>
//         </div>
//       </div>
//     );
//   };

//   const renderDayCell = (day, isCurrentMonth = true) => {
//     const dayEvents = events.filter(e => isSameDay(parseISO(e.date), day));
//     const hasEvents = dayEvents.length > 0;
    
//     return (
//       <div 
//         key={day}
//         className={`day-cell ${!isCurrentMonth ? 'outside-month' : ''}`}
//         onClick={() => {
//           setSelectedDate(day);
//           setDayEventsPopup(dayEvents);
//         }}
//       >
//         <div className={`day-number ${isSameDay(day, new Date()) ? 'today' : ''}`}>
//           {format(day, 'd')}
//         </div>
//         {hasEvents && (
//           <div className="events-badge">
//             {dayEvents.length} order{dayEvents.length > 1 ? 's' : ''}
//           </div>
//         )}
//       </div>
//     );
//   };

//   const renderMonthView = () => {
//     const monthStart = startOfMonth(currentDate);
//     const monthEnd = endOfMonth(monthStart);
//     const startDate = startOfWeek(monthStart);
//     const endDate = endOfWeek(monthEnd);
    
//     const rows = [];
//     let days = [];
//     let day = startDate;
    
//     while (day <= endDate) {
//       for (let i = 0; i < 7; i++) {
//         days.push(renderDayCell(day, isSameMonth(day, monthStart)));
//         day = addDays(day, 1);
//       }
//       rows.push(<div key={day} className="week-row">{days}</div>);
//       days = [];
//     }
//     return <div className="month-grid">{rows}</div>;
//   };

//   const renderWeekView = () => {
//     const weekStart = startOfWeek(currentDate);
//     const days = [];
    
//     for (let i = 0; i < 7; i++) {
//       const day = addDays(weekStart, i);
//       days.push(renderDayCell(day));
//     }
//     return <div className="week-grid">{days}</div>;
//   };

//   const renderTimeSlots = () => {
//     const slots = [];
//     for (let hour = 0; hour < 24; hour++) {
//       const time = setHours(setMinutes(selectedDate, 0), hour);
//       const formattedTime = format(time, 'h a');
      
//       // Get events for this hour
//       const hourEvents = events.filter(event => {
//         const eventDate = parseISO(event.date);
//         return isSameDay(eventDate, selectedDate) && getHours(eventDate) === hour;
//       });

//       slots.push(
//         <div key={hour} className="time-slot">
//           <div className="time-label">{formattedTime}</div>
//           <div className="time-events">
//             {hourEvents.map(event => (
//               <div 
//                 key={event.id}
//                 className="event-card"
//                 onClick={() => setSelectedEvent(event)}
//               >
//                 <div className="event-summary">
//                   <div className="customer-name">{event.customer}</div>
//                   <div className="event-amount">₹{event.grandTotal}</div>
//                 </div>
//                 <div className="event-meta">
//                   <span className={`event-status ${event.paymentStatus.toLowerCase()}`}>
//                     {event.paymentStatus}
//                   </span>
//                   <span className="event-time">
//                     {format(parseISO(event.date), 'h:mm a')}
//                   </span>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>
//       );
//     }
//     return slots;
//   };

//   const renderDayView = () => {
//     return (
//       <div className="day-view-container">
//         <div className="day-header">
//           {format(selectedDate, 'EEEE, MMMM d, yyyy')}
//           {isSameDay(selectedDate, new Date()) && <span className="today-badge">Today</span>}
//         </div>
//         <div className="time-slots-container">
//           {renderTimeSlots()}
//         </div>
//       </div>
//     );
//   };

//   return (
//     <div className="calendar-container">
//       {renderHeader()}
      
//       {view !== 'day' && (
//         <div className="weekday-header">
//           {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
//             <div key={day} className="weekday">{day}</div>
//           ))}
//         </div>
//       )}
      
//       {loading ? (
//         <div className="loading-indicator">Loading...</div>
//       ) : view === 'month' ? renderMonthView() : 
//         view === 'week' ? renderWeekView() : renderDayView()}
      
//       {selectedEvent && (
//         <div className="popup-overlay">
//           <div className="popup-container" ref={popupRef}>
//             <div className="popup-header">
//               <h3>Order Details</h3>
//               <button className="close-button" onClick={() => setSelectedEvent(null)}>×</button>
//             </div>
            
//             <div className="popup-content">
//               <div className="detail-row">
//                 <div className="detail-label">Customer:</div>
//                 <div className="detail-value">{selectedEvent.customer}</div>
//               </div>
              
//               <div className="detail-row">
//                 <div className="detail-label">Date:</div>
//                 <div className="detail-value">{format(parseISO(selectedEvent.date), 'PPpp')}</div>
//               </div>
              
//               <div className="detail-row">
//                 <div className="detail-label">Total:</div>
//                 <div className="detail-value">₹{selectedEvent.grandTotal}</div>
//               </div>
              
//               <div className="detail-row">
//                 <div className="detail-label">Status:</div>
//                 <div className="detail-value">
//                   <span className={`status-badge ${selectedEvent.paymentStatus.toLowerCase()}`}>
//                     {selectedEvent.paymentStatus}
//                   </span>
//                 </div>
//               </div>
              
//               <h4 className="items-title">Items Ordered:</h4>
//               <ul className="items-list">
//                 {selectedEvent.items.map((item, i) => (
//                   <li key={i} className="item">
//                     <div className="item-name">{item.description}</div>
//                     <div className="item-details">
//                       {item.qty} × ₹{item.rate} = ₹{item.amount}
//                     </div>
//                   </li>
//                 ))}
//               </ul>
//             </div>
//           </div>
//         </div>
//       )}

//       {dayEventsPopup && (
//         <div className="popup-overlay">
//           <div className="day-events-popup" ref={dayPopupRef}>
//             <div className="popup-header">
//               <h3>Orders on {format(selectedDate, 'MMMM d, yyyy')}</h3>
//               <button className="close-button" onClick={() => setDayEventsPopup(null)}>×</button>
//             </div>
            
//             <div className="popup-content">
//               {dayEventsPopup.length === 0 ? (
//                 <div className="empty-state">No orders this day</div>
//               ) : (
//                 <div className="events-list">
//                   {dayEventsPopup.map(event => (
//                     <div 
//                       key={event.id}
//                       className="event-card"
//                       onClick={() => {
//                         setSelectedEvent(event);
//                         setDayEventsPopup(null);
//                       }}
//                     >
//                       <div className="event-summary">
//                         <div className="customer-name">{event.customer}</div>
//                         <div className="event-amount">₹{event.grandTotal}</div>
//                       </div>
//                       <div className="event-meta">
//                         <span className={`event-status ${event.paymentStatus.toLowerCase()}`}>
//                           {event.paymentStatus}
//                         </span>
//                         <span className="event-time">
//                           {format(parseISO(event.date), 'h:mm a')}
//                         </span>
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               )}
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default Calendar;


import React, { useState, useEffect } from 'react';
import { 
  format, startOfWeek, endOfWeek, startOfMonth, endOfMonth, 
  isSameDay, parseISO, eachDayOfInterval, addDays, subDays,
  addWeeks, subWeeks, addMonths, subMonths, startOfDay, endOfDay
} from 'date-fns';
import axios from 'axios';
import { FaChevronLeft, FaChevronRight, FaChartBar, FaInfoCircle } from 'react-icons/fa';
import './Dashboard.css';

const InvoiceCalendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [calendarView, setCalendarView] = useState('month');
  const [invoices, setInvoices] = useState([]);
  const [invoiceSummary, setInvoiceSummary] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedDayInvoices, setSelectedDayInvoices] = useState(null);

  const fetchInvoices = async () => {
  try {
    setLoading(true);
    let startDate, endDate;
    const today = new Date();
    const current = currentDate || today;

    if (calendarView === 'day') {
      startDate = startOfDay(current);
      endDate = endOfDay(current);
    } else if (calendarView === 'week') {
      startDate = startOfWeek(current, { weekStartsOn: 1 });
      endDate = endOfWeek(current, { weekStartsOn: 1 });
    } else if (calendarView === 'month') {
      startDate = startOfMonth(current);
      endDate = endOfMonth(current);
    } else {
      startDate = startOfMonth(current);
      endDate = endOfMonth(current);
    }

    // Convert to DD-MM-YYYY format for API request
    const startDateFormatted = format(startDate, 'dd-MM-yyyy');
    const endDateFormatted = format(endDate, 'dd-MM-yyyy');

    const { data } = await axios.get('https://bluesip-backend.onrender.com/calendar', {
      params: {
        startDate: startDateFormatted,
        endDate: endDateFormatted,
        view: 'summary'
      }
    });

    setInvoices(data.invoices);
    setInvoiceSummary(data.summary);
  } catch (err) {
    setError('Failed to fetch invoices');
    console.error('Error fetching invoices:', err);
  } finally {
    setLoading(false);
  }
};

  useEffect(() => {
    fetchInvoices();
  }, [currentDate, calendarView]);

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

  // Update the renderCalendarDays function to handle your date format
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
      startDate = startOfWeek(currentDate, { weekStartsOn: 1 });
      endDate = endOfWeek(currentDate, { weekStartsOn: 1 });
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
    // Convert day to DD-MM-YYYY format for comparison
    const dayFormatted = format(day, 'dd-MM-yyyy');
    
    const dayInvoices = invoices.filter(invoice => {
      // Compare with invoiceDate in DD-MM-YYYY format
      return invoice.invoiceDate === dayFormatted;
    });

    return (
      <div 
        key={day.toString()} 
       className={`calendar-day ${dayInvoices.length > 0 ? 'has-purchases' : ''}`}
        onClick={() => dayInvoices.length > 0 && setSelectedDayInvoices(dayInvoices)}
      >
        <div className="calendar-day-header">
          <h4>{format(day, 'EEE, MMM d')}</h4>
          <div className='calendar-puchase-info'>
            {dayInvoices.length > 0 && (
              <span className="day-indicator">
                <FaInfoCircle className='info-icon' /> {dayInvoices.length} invoice(s)
              </span>
            )}
          </div>
        </div>
      </div>
    );
  });
};

  const renderSummaryReport = () => {
    if (!invoiceSummary) return null;

    return (
      <div className="summary-report">
        <h3>
          <FaChartBar /> Summary for {calendarView === 'day' ? format(currentDate, 'MMMM d, yyyy') : 
            calendarView === 'week' ? `Week of ${format(startOfWeek(currentDate), 'MMM d')}` : 
            format(currentDate, 'MMMM yyyy')}
        </h3>
        
        <div className="summary-totals">
          <div className="summary-card">
            <h4>Total Invoices</h4>
            <p>{invoiceSummary.totalInvoices}</p>
          </div>
          <div className="summary-card">
            <h4>Total Amount</h4>
            <p>₹{invoiceSummary.totalAmount.toFixed(2)}</p>
          </div>
          <div className="summary-card">
            <h4>Paid</h4>
            <p>₹{invoiceSummary.paidAmount.toFixed(2)}</p>
          </div>
          <div className="summary-card">
            <h4>Pending</h4>
            <p>₹{invoiceSummary.pendingAmount.toFixed(2)}</p>
          </div>
        </div>

        <div className="status-breakdown">
          <h4>Status Breakdown</h4>
          <table className="summary-table">
            <thead>
              <tr>
                <th>Status</th>
                <th>Count</th>
                <th>Amount</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(invoiceSummary.statusCounts).map(([status, data]) => (
                <tr key={status}>
                  <td>{status}</td>
                  <td>{data.count}</td>
                  <td>₹{data.amount.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

 
const renderInvoiceDetailsModal = () => {
  if (!selectedDayInvoices || selectedDayInvoices.length === 0) return null;

  // Parse DD-MM-YYYY date manually with error handling
  const parseCustomDate = (dateStr) => {
    try {
      const [day, month, year] = dateStr.split('-');
      return new Date(`${year}-${month}-${day}`);
    } catch (e) {
      console.error("Error parsing date:", dateStr);
      return new Date(); // Fallback to current date
    }
  };

  // Safely get first invoice date
  const firstInvoiceDate = selectedDayInvoices[0]?.invoiceDate;
  if (!firstInvoiceDate) return null;

  let formattedDate;
  try {
    formattedDate = format(parseCustomDate(firstInvoiceDate), 'MMMM d, yyyy');
  } catch (e) {
    console.error("Error formatting date:", firstInvoiceDate);
    formattedDate = "Unknown date";
  }

  return (
    <div className="popup-overlay" >
      <div className="popup-container">
        <div className="popup-header">
          <h3>Invoices for {formattedDate}</h3>
          <button onClick={() => setSelectedDayInvoices(null)}>×</button>
        </div>
        <div className="popup-content">
          <table className="invoice-details-table">
            <thead>
              <tr>
                <th>Invoice No</th>
                <th>Customer</th>
                <th>Amount</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {selectedDayInvoices.map(invoice => {
                // Safely access all properties with fallbacks
                const invoiceNo = invoice?.invoiceNo || "N/A";
                const customerName = invoice?.buyer?.name || "Unknown customer";
                const amount = invoice?.grandTotal ? `₹${invoice.grandTotal.toFixed(2)}` : "₹0.00";
                const status = invoice?.invoiceStatus?.toLowerCase() || "unknown";
                
                return (
                  <tr key={invoice._id || Math.random()}>
                    <td>{invoiceNo}</td>
                    <td>{customerName}</td>
                    <td>{amount}</td>
                    <td className={`status-${status}`}>
                      {status.toUpperCase()}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

  return (
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
      
      {renderSummaryReport()}
      
      <div className={`calendar-view ${calendarView}`}>
        {renderCalendarDays()}
      </div>

      {renderInvoiceDetailsModal()}
      <br/>
    </div>
  );
};

export default InvoiceCalendar;


