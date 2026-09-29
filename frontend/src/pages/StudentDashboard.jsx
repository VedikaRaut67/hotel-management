import { useEffect, useState } from "react";

function StudentDashboard() {
  const user = JSON.parse(
    localStorage.getItem("user")
  );

  const [room, setRoom] = useState(null);
  const [rooms, setRooms] = useState([]);
  const [requests, setRequests] = useState([]);

  const [selectedRoom, setSelectedRoom] =
    useState("");

  const [reason, setReason] =
    useState("");

  const [message, setMessage] =
    useState("");

  const loadData = async () => {
    try {
      const roomResponse = await fetch(
        `http://localhost:5000/api/rooms/student/${user.id}`
      );

      const roomData =
        await roomResponse.json();

      setRoom(roomData);

      const roomsResponse =
        await fetch(
          "http://localhost:5000/api/rooms"
        );

      const roomsData =
        await roomsResponse.json();

      setRooms(roomsData);

      const requestResponse =
        await fetch(
          `http://localhost:5000/api/room-change/student/${user.id}`
        );

      const requestData =
        await requestResponse.json();

      setRequests(requestData);
    } catch (error) {
      setMessage(
        "Unable to connect to backend."
      );
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const submitRequest = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(
        "http://localhost:5000/api/room-change/request",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            studentId: user.id,
            requestedRoomId: selectedRoom,
            reason
          })
        }
      );

      const data =
        await response.json();

      if (!response.ok) {
        setMessage(data.message);
        return;
      }

      setMessage(
        "Room change request submitted successfully."
      );

      setReason("");
      setSelectedRoom("");

      loadData();
    } catch (error) {
      setMessage(
        "Unable to submit request."
      );
    }
  };

  const logout = () => {
    localStorage.removeItem("user");
    window.location.href = "/";
  };

  return (
    <div className="dashboard">
      <div className="topbar">
        <h1>Student Dashboard</h1>

        <button onClick={logout}>
          Logout
        </button>
      </div>

      <div className="content">
        <h2>
          Welcome, {user?.name}
        </h2>

        {message && (
          <div className="message">
            {message}
          </div>
        )}

        <div className="card">
          <h2>Current Room</h2>

          {room ? (
            <>
              <p>
                <strong>Room:</strong>{" "}
                {room.roomNumber}
              </p>

              <p>
                <strong>Occupancy:</strong>{" "}
                {room.students.length} / 2
              </p>

              <h3>Room Members</h3>

              {room.students.map(
                (student) => (
                  <p key={student._id}>
                    {student.name}
                  </p>
                )
              )}
            </>
          ) : (
            <p>
              You are not currently assigned
              to a room.
            </p>
          )}
        </div>

        {room && (
          <div className="card">
            <h2>
              Request Room Change
            </h2>

            <form
              onSubmit={submitRequest}
            >
              <label>
                Select New Room
              </label>

              <select
                value={selectedRoom}
                onChange={(e) =>
                  setSelectedRoom(
                    e.target.value
                  )
                }
                required
              >
                <option value="">
                  Select a room
                </option>

                {rooms
                  .filter(
                    (r) =>
                      r._id !== room._id &&
                      r.students.length < 2
                  )
                  .map((r) => (
                    <option
                      key={r._id}
                      value={r._id}
                    >
                      Room {r.roomNumber} -
                      {" "}
                      {r.students.length}/2
                    </option>
                  ))}
              </select>

              <label>
                Reason
              </label>

              <textarea
                placeholder="Enter reason for room change"
                value={reason}
                onChange={(e) =>
                  setReason(e.target.value)
                }
                required
              />

              <button type="submit">
                Submit Request
              </button>
            </form>
          </div>
        )}

        <div className="card">
          <h2>
            Room Change Request History
          </h2>

          {requests.length === 0 ? (
            <p>
              No room change requests yet.
            </p>
          ) : (
            requests.map((request) => (
              <div
                className="request"
                key={request._id}
              >
                <p>
                  <strong>
                    Current Room:
                  </strong>{" "}
                  {request.currentRoom?.roomNumber}
                </p>

                <p>
                  <strong>
                    Requested Room:
                  </strong>{" "}
                  {request.requestedRoom?.roomNumber}
                </p>

                <p>
                  <strong>Reason:</strong>{" "}
                  {request.reason}
                </p>

                <p>
                  <strong>Status:</strong>{" "}
                  <span
                    className={`status ${request.status.toLowerCase()}`}
                  >
                    {request.status}
                  </span>
                </p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default StudentDashboard;