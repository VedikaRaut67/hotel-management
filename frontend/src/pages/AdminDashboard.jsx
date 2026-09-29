function AdminDashboard() {
  return (
    <div className="dashboard">
      <h1>Admin Dashboard</h1>

      <div className="dashboard-grid">

        <div className="section">
          <h2>Add Hostel Room</h2>

          <input type="text" placeholder="Room Number" />
          <button>Add Room</button>
        </div>

        <div className="section">
          <h2>Allocate Student</h2>

          <input type="email" placeholder="Student Email" />
          <input type="text" placeholder="Room Number" />
          <button>Allocate Student</button>
        </div>

        <div className="section complaints">
          <h2>Complaints</h2>

          <div className="complaint">
            <p><strong>Student:</strong> Rahul</p>
            <p><strong>Room:</strong> 101</p>
            <p><strong>Complaint:</strong> Fan is not working</p>
            <p><strong>Status:</strong> Pending</p>

            <button>Mark Resolved</button>
          </div>
        </div>

      </div>
    </div>
  );
}

export default AdminDashboard;