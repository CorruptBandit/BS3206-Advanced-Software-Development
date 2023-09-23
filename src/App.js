import { useEffect, useState } from "react";
import "./App.css";

function App() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    if (window.location.pathname === "/db") {
      fetch(`/api/users`)
        .then((res) => res.json())
        .then((data) => setUsers(data));
    }
  }, []);

  return (
    <div className="App">
      <h1>Go to /db for users</h1>
      {users.map((user) => (
        <p key={user.id}>{user.name}</p>
      ))}
    </div>
  );
}

export default App;
