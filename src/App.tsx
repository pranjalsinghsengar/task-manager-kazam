import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import TaskList from "./pages/task/TaskList";
import { useEffect, useState } from "react";
import Validate from "./config/validate";

const App = () => {
  const [authorized, setAuthorized] = useState(false);
  const token = localStorage.getItem("tsk-token");

  useEffect(() => {
    if (token) {
      const validateToken = async () => {
        await Validate(token);
        setAuthorized(true);
      };
      validateToken();
    }
  }, [token]);
  return (
    <Router>
      {!authorized ? (
        <Routes>
          <Route path='/' element={<Login />} />
          <Route path='/register' element={<Register />} />
        </Routes>
      ) : (
        <Routes>
          <Route path='/' element={<TaskList />} />
        </Routes>
      )}
    </Router>
  );
};

export default App;
