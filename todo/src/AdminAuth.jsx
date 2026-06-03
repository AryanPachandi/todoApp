import { useEffect, useState } from "react";

const API = "https://todoapp-2qrt.onrender.com";

export default function AdminAuth({ onLogin }) {
  const [isRegistered, setIsRegistered] = useState(false);

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [message, setMessage] = useState("");

  useEffect(() => {
    checkAdmin();
  }, []);

  const checkAdmin = async () => {
    try {
      const res = await fetch(`${API}/admin-status`, {
        credentials: "include",
      });

      const data = await res.json();

      setIsRegistered(data.registered);
    } catch (err) {
      console.log(err);
    }
  };

  const registerAdmin = async (e) => {
    e.preventDefault();

    const res = await fetch(`${API}/admin-register`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username,
        password,
      }),
    });

    const data = await res.json();

    if (data.success) {
      setMessage("Admin Registered Successfully");
      setIsRegistered(true);
      setUsername("");
      setPassword("");
    } else {
      setMessage(data.message);
    }
  };

  const loginAdmin = async (e) => {
    e.preventDefault();

    const res = await fetch(`${API}/admin-login`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username,
        password,
      }),
    });

    const data = await res.json();

    if (data.success) {
      onLogin();
    } else {
      setMessage(data.message);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <form
        onSubmit={isRegistered ? loginAdmin : registerAdmin}
        style={{
          width: "350px",
          padding: "30px",
          border: "1px solid #ccc",
          borderRadius: "10px",
        }}
      >
        <h2>
          {isRegistered ? "Admin Login" : "Admin Register"}
        </h2>

        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          style={{
            width: "100%",
            padding: "10px",
            marginBottom: "10px",
          }}
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{
            width: "100%",
            padding: "10px",
            marginBottom: "10px",
          }}
        />

        <button
          type="submit"
          style={{
            width: "100%",
            padding: "10px",
          }}
        >
          {isRegistered ? "Login" : "Register"}
        </button>

        {message && (
          <p style={{ marginTop: "10px" }}>
            {message}
          </p>
        )}
      </form>
    </div>
  );
}