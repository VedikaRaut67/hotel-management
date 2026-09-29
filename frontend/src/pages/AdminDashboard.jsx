import { useEffect, useState } from "react";

function AdminDashboard() {
  const [requests, setRequests] =
    useState([]);

  const [rooms, setRooms] =
    useState([]);

  const [roomNumber, setRoomNumber] =
    useState("");

  const [message, setMessage] =
    useState("");

  const loadData = async () => {
    try {
      const requestResponse =
        await fetch(
          "http://localhost:5000/api/room-change/all"
        );

      const requestData =
        await requestResponse.json();

      setRequests(requestData);

      const roomResponse =
        await fetch(
          "http://localhost:5000/api/rooms"
        );

      const roomData =
        await roomResponse.json();

      setRooms(roomData);
    } catch (error) {
      setMessage(
        "Unable to connect to backend."
      );
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const addRoom = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(
        "http://localhost:5000/api/rooms",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            roomNumber
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
        "Room added successfully."
      );

      setRoomNumber("");

      loadData();
    } catch (error) {
      setMessage(
        "Unable to add room."
      );
    }
  };

  const processRequest = async (
    requestId,
    action
  ) => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/room-change/${action}/${requestId}`,
        {
          method: "PUT"
        }
      );

      const data =
        await response.json();

      setMessage(data.message);

      loadData();
    } catch (error) {
      setMessage(
        "Unable to process request."
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
        <h1>Admin / Warden Dashboard</h1>

        <button onClick={logout}>
          Logout
        </button>
      </div>

      <div className="content">
        {message && (
          <div className="message">
            {message}
          </div>
        )}

        <div className="card">
          <h2>Add New Room</h2>

          <form onSubmit={addRoom}>
            <input
              type="text"
              placeholder="Room Number"
              value={roomNumber}
              onChange={(e) =>
                setRoomNumber(
                  e.target.value
                )
              }
              required
            />

            <button type="submit">
              Add Room
            </button>
          </form>
        </div>

        <div className="card">
          <h2>Room List</h2>

          {rooms.map((room) => (
            <div
              className="room-item"
              key={room._id}
            >
              <strong>
                Room {room.roomNumber}
              </strong>

              <span>
                {room.students.length}/2
                occupants
              </span>
            </div>
          ))}
        </div>

        <div className="card">
          <h2>
            Room Change Requests
          </h2>

          {requests.length === 0 ? (
            <p>
              No room change requests.
            </p>
          ) : (
            requests.map((request) => (
              <div
                className="request"
                key={request._id}
              >
                <h3>
                  {request.student?.name}
                </h3>

                <p>
                  <strong>Email:</strong>{" "}
                  {request.student?.email}
                </p>

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
                  {request.status}
                </p>

                {request.status ===
                  "Pending" && (
                  <div>
                    <button
                      className="approve"
                      onClick={() =>
                        processRequest(
                          request._id,
                          "approve"
                        )
                      }
                    >
                      Approve
                    </button>

                    <button
                      className="reject"
                      onClick={() =>
                        processRequest(
                          request._id,
                          "reject"
                        )
                      }
                    >
                      Reject
                    </button>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;