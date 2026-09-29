import { useState } from "react";
import { Link } from "react-router-dom";

function Register() {
  const [role, setRole] = useState("student");

  const handleRegister = (e) => {
    e.preventDefault();
    alert("Registration successful!");
  };

  return (
    <div className="page">
      <div className="card">
        <h1>Create Account</h1>

        <form onSubmit={handleRegister}>
          <label>Name</label>
          <input type="text" placeholder="Enter name" required />

          <label>Email</label>
          <input type="email" placeholder="Enter email" required />

          <label>Password</label>
          <input type="password" placeholder="Enter password" required />

          <label>Register As</label>
          <select value={role} onChange={(e) => setRole(e.target.value)}>
            <option value="student">Student</option>
            <option value="admin">Admin / Warden</option>
          </select>

          <button type="submit">Register</button>
        </form>

        <p>
          Already registered? <Link to="/">Login</Link>
        </p>
      </div>
    </div>
  );
}

export default Register;