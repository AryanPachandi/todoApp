import { useState } from "react";
import AdminAuth from "./AdminAuth";
import App from "./App";

export default function Root() {
  const [loggedIn, setLoggedIn] = useState(false);

  if (!loggedIn) {
    return (
      <AdminAuth
        onLogin={() => setLoggedIn(true)}
      />
    );
  }

  return <App />;
}