import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import "./Register.css";

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState({ 
    name: "", 
    email: "", 
    password: "",
    role: "staff" 
  });
  const [editForm, setEditForm] = useState({
    id: "",
    name: "",
    email: "",
    role: "staff"
  });
  const [passwordForm, setPasswordForm] = useState({
    id: "",
    newPassword: "",
    confirmPassword: ""
  });
  const [errors, setErrors] = useState({});
  const [editErrors, setEditErrors] = useState({});
  const [passwordErrors, setPasswordErrors] = useState({});
  const [isFormValid, setIsFormValid] = useState(false);
  const [isEditFormValid, setIsEditFormValid] = useState(false);
  const [isPasswordFormValid, setIsPasswordFormValid] = useState(false);
  const [showAdminConfirm, setShowAdminConfirm] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const navigate = useNavigate();
 
 const [tempRole, setTempRole] = useState("staff"); 

  // Check if user is admin and fetch all users
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    const checkAdminAndFetchUsers = async () => {
      try {
        const decoded = jwtDecode(token);
        if (decoded.role !== "admin") {
          navigate("/unauthorized");
          return;
        }
        setIsAdmin(true);
        
        // Fetch all users
        const response = await axios.get("https://bluesip-backend.onrender.com/api/users", {
          headers: { Authorization: `Bearer ${token}` }
        });
        setUsers(response.data);
      } catch (error) {
        console.error("Error:", error);
        alert(error.response?.data?.message || "Error fetching users");
      } finally {
        setLoading(false);
      }
    };

    checkAdminAndFetchUsers();
  }, [navigate]);

  // Validate add user form
  useEffect(() => {
    const newErrors = {};
    if (!form.name.trim()) newErrors.name = "Name is required";
    if (!form.email.trim()) newErrors.email = "Email is required";
    else if (!/^\S+@\S+\.\S+$/.test(form.email)) newErrors.email = "Invalid email format";
    if (!form.password) newErrors.password = "Password is required";
    else if (form.password.length < 6) newErrors.password = "Password must be at least 6 characters";
    
    setErrors(newErrors);
    setIsFormValid(Object.keys(newErrors).length === 0);
  }, [form]);

  // Validate edit user form
  useEffect(() => {
    const newErrors = {};
    if (!editForm.name.trim()) newErrors.name = "Name is required";
    if (!editForm.email.trim()) newErrors.email = "Email is required";
    else if (!/^\S+@\S+\.\S+$/.test(editForm.email)) newErrors.email = "Invalid email format";
    
    setEditErrors(newErrors);
    setIsEditFormValid(Object.keys(newErrors).length === 0);
  }, [editForm]);

  // Validate password form
  useEffect(() => {
    const newErrors = {};
    if (!passwordForm.newPassword) newErrors.newPassword = "Password is required";
    else if (passwordForm.newPassword.length < 6) newErrors.newPassword = "Password must be at least 6 characters";
    if (passwordForm.newPassword !== passwordForm.confirmPassword) newErrors.confirmPassword = "Passwords don't match";
    
    setPasswordErrors(newErrors);
    setIsPasswordFormValid(Object.keys(newErrors).length === 0);
  }, [passwordForm]);

  const handleAddUser = async () => {
    if (!isFormValid) return;
    
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post("https://bluesip-backend.onrender.com/api/register", form, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setUsers([...users, response.data.user]);
      setShowAddModal(false);
      setForm({ name: "", email: "", password: "", role: "staff" });
      alert("User added successfully!");
    } catch (error) {
      console.error("Registration error:", error.response?.data);
      alert(error.response?.data?.message || "Registration failed");
    }
  };

  const handleEditUser = async () => {
    if (!isEditFormValid) return;
    
    try {
      const token = localStorage.getItem("token");
      const response = await axios.put(
        `https://bluesip-backend.onrender.com/users/${editForm.id}`,
        { name: editForm.name, email: editForm.email, role: editForm.role },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      setUsers(users.map(user => 
        user._id === editForm.id ? response.data.user : user
      ));
      setShowEditModal(false);
      alert("User updated successfully!");
    } catch (error) {
      console.error("Update error:", error.response?.data);
      alert(error.response?.data?.message || "Update failed");
    }
  };

  const handleChangePassword = async () => {
    if (!isPasswordFormValid) return;
    
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `https://bluesip-backend.onrender.com/users/${passwordForm.id}/api/password`,
        { newPassword: passwordForm.newPassword },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      setShowPasswordModal(false);
      setPasswordForm({ id: "", newPassword: "", confirmPassword: "" });
      alert("Password changed successfully!");
    } catch (error) {
      console.error("Password change error:", error.response?.data);
      alert(error.response?.data?.message || "Password change failed");
    }
  };

  const handleRoleChange = (e) => {
    const selectedRole = e.target.value;
    if (selectedRole === "admin") {
      setTempRole("admin");
      setShowAdminConfirm(true);
    } else {
      setForm({ ...form, role: selectedRole });
    }
  };

  const confirmAdminRole = () => {
    setForm({ ...form, role: "admin" });
    setShowAdminConfirm(false);
  };

  const cancelAdminRole = () => {
    setForm({ ...form, role: "staff" });
    setShowAdminConfirm(false);
  };

  const openEditModal = (user) => {
    setEditForm({
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role
    });
    setShowEditModal(true);
  };

  const openPasswordModal = (userId) => {
    setPasswordForm({
      id: userId,
      newPassword: "",
      confirmPassword: ""
    });
    setShowPasswordModal(true);
  };

  const deleteUser = async (userId) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`https://bluesip-backend.onrender.com/api/users/${userId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setUsers(users.filter(user => user._id !== userId));
      alert("User deleted successfully!");
    } catch (error) {
      console.error("Delete error:", error.response?.data);
      alert(error.response?.data?.message || "Delete failed");
    }
  };

if (loading) {
  return (
    <div className="spinner-container">
      <div className="loading-spinner"></div>
    </div>
  );
}

  if (!isAdmin) {
    return null;
  }

  return (
    <div className="user-management-container">
      <div className="user-management-header">
        <h2>User Management</h2>
        <button 
          className="add-user-btn"
          onClick={() => setShowAddModal(true)}
        >
          Add New User
        </button>
      </div>

      {/* Users Table */}
      <div className="users-table-container">
        <table className="users-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr key={user._id}>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td className={`role-${user.role}`}>{user.role}</td>
                <td className="actions">
                  <button 
                    className="edit-btn"
                    onClick={() => openEditModal(user)}
                  >
                    Edit
                  </button>
                  <button 
                    className="password-btn"
                    onClick={() => openPasswordModal(user._id)}
                  >
                    Change Password
                  </button>
                  {user.role !== "admin" && (
                    <button 
                      className="delete-btn"
                      onClick={() => deleteUser(user._id)}
                    >
                      Delete
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add User Modal */}
      {showAddModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>Add New User</h3>
              <button 
                className="close-btn"
                onClick={() => {
                  setShowAddModal(false);
                  setForm({ name: "", email: "", password: "", role: "staff" });
                }}
              >
                &times;
              </button>
            </div>
            
            <div className="form-group">
              <label>Name*</label>
              <input 
                placeholder="Enter full name" 
                value={form.name}
                onChange={e => setForm({ ...form, name: e.target.value })}
                className={errors.name ? "error" : ""}
              />
              {errors.name && <span className="error-message">{errors.name}</span>}
            </div>
            
            <div className="form-group">
              <label>Email*</label>
              <input 
                type="email" 
                placeholder="Enter email" 
                value={form.email}
                onChange={e => setForm({ ...form, email: e.target.value })}
                className={errors.email ? "error" : ""}
              />
              {errors.email && <span className="error-message">{errors.email}</span>}
            </div>
            
            <div className="form-group">
              <label>Password*</label>
              <input 
                type="password" 
                placeholder="Enter password (min 6 characters)" 
                value={form.password}
                onChange={e => setForm({ ...form, password: e.target.value })}
                className={errors.password ? "error" : ""}
              />
              {errors.password && <span className="error-message">{errors.password}</span>}
            </div>
            
            <div className="form-group">
              <label>Role*</label>
              <select
                value={form.role}
                onChange={handleRoleChange}
              >
                <option value="staff">Staff</option>
                <option value="staffhead">Staff Head</option>
                <option value="admin">Admin</option>
              </select>
            </div>
            
            <div className="modal-footer">
              <button 
                onClick={handleAddUser}
                disabled={!isFormValid}
                className={`submit-btn ${!isFormValid ? "disabled" : ""}`}
              >
                Add User
              </button>
              <button 
                className="cancel-btn"
                onClick={() => {
                  setShowAddModal(false);
                  setForm({ name: "", email: "", password: "", role: "staff" });
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit User Modal */}
      {showEditModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>Edit User</h3>
              <button 
                className="close-btn"
                onClick={() => setShowEditModal(false)}
              >
                &times;
              </button>
            </div>
            
            <div className="form-group">
              <label>Name*</label>
              <input 
                placeholder="Enter full name" 
                value={editForm.name}
                onChange={e => setEditForm({ ...editForm, name: e.target.value })}
                className={editErrors.name ? "error" : ""}
              />
              {editErrors.name && <span className="error-message">{editErrors.name}</span>}
            </div>
            
            <div className="form-group">
              <label>Email*</label>
              <input 
                type="email" 
                placeholder="Enter email" 
                value={editForm.email}
                onChange={e => setEditForm({ ...editForm, email: e.target.value })}
                className={editErrors.email ? "error" : ""}
              />
              {editErrors.email && <span className="error-message">{editErrors.email}</span>}
            </div>
            
            <div className="form-group">
              <label>Role*</label>
              <select
                value={editForm.role}
                onChange={e => setEditForm({ ...editForm, role: e.target.value })}
              >
                <option value="staff">Staff</option>
                <option value="staffhead">Staff Head</option>
                <option value="admin">Admin</option>
              </select>
            </div>
            
            <div className="modal-footer">
              <button 
                onClick={handleEditUser}
                disabled={!isEditFormValid}
                className={`submit-btn ${!isEditFormValid ? "disabled" : ""}`}
              >
                Save Changes
              </button>
              <button 
                className="cancel-btn"
                onClick={() => setShowEditModal(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Change Password Modal */}
      {showPasswordModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>Change Password</h3>
              <button 
                className="close-btn"
                onClick={() => setShowPasswordModal(false)}
              >
                &times;
              </button>
            </div>
            
            <div className="form-group">
              <label>New Password*</label>
              <input 
                type="password" 
                placeholder="Enter new password" 
                value={passwordForm.newPassword}
                onChange={e => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                className={passwordErrors.newPassword ? "error" : ""}
              />
              {passwordErrors.newPassword && (
                <span className="error-message">{passwordErrors.newPassword}</span>
              )}
            </div>
            
            <div className="form-group">
              <label>Confirm Password*</label>
              <input 
                type="password" 
                placeholder="Confirm new password" 
                value={passwordForm.confirmPassword}
                onChange={e => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                className={passwordErrors.confirmPassword ? "error" : ""}
              />
              {passwordErrors.confirmPassword && (
                <span className="error-message">{passwordErrors.confirmPassword}</span>
              )}
            </div>
            
            <div className="modal-footer">
              <button 
                onClick={handleChangePassword}
                disabled={!isPasswordFormValid}
                className={`submit-btn ${!isPasswordFormValid ? "disabled" : ""}`}
              >
                Change Password
              </button>
              <button 
                className="cancel-btn"
                onClick={() => setShowPasswordModal(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Admin Confirmation Popup */}
      {showAdminConfirm && (
        <div className="admin-confirm-modal">
          <div className="confirm-content">
            <h3>Confirm Admin Role</h3>
            <p>Are you sure you want to assign Admin privileges to this user?</p>
            <p className="warning-text">Admins have full system access!</p>
            <div className="button-group">
              <button onClick={confirmAdminRole} className="confirm-btn">
                Confirm
              </button>
              <button onClick={cancelAdminRole} className="cancel-btn">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagement;