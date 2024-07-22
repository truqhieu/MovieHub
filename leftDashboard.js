import React from 'react';
import { Link } from 'react-router-dom';
import "../Admin/LeftDashboard.css";

function LeftDashboard() {
  return (
    <div className="leftDashboard text-warning">
      <h3>Admin Dashboard</h3>
      <hr />
      <div>
        <h5><Link to="/admin/accounts">Account Management</Link></h5>
      </div>
      <div>
        <h5><Link to="/admin/movies">Movie Management</Link></h5> 
      </div>
    </div>
  );
}

export default LeftDashboard;
