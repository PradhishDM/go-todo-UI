import { AuthProvider } from "./pages/AuthContext";
import ProtectedRoute from "./pages/ProtectedRoute"
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Todos from "./pages/Todos";  
function App() {


  return (
  <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />

          <Route
            path="/todos"
            element={
              <ProtectedRoute>
                <Todos />
              </ProtectedRoute>
            }
          />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
