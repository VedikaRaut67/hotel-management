function StudentDashboard() {
  return (
    <div className="dashboard">
      <h1>Student Dashboard</h1>

      <div className="dashboard-grid">

        <div className="section">
          <h2>My Room</h2>

          <p><strong>Room Number:</strong> 101</p>
          <p><strong>Capacity:</strong> 2 Students</p>
          <p><strong>Roommate:</strong> Rahul</p>
        </div>

        <div className="section">
          <h2>Submit Complaint</h2>

          <textarea
            placeholder="Describe your room problem..."
            rows="5"
          ></textarea>

          <button>Submit Complaint</button>
        </div>

      </div>
    </div>
  );
}

export default StudentDashboard;