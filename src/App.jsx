import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import "./App.css";
import Header from "./components/Header/Header";
import Footer from "./components/Footer/Footer";
import authService from "./appwrite/auth";
import { login, logout } from "./store/authSlice";
import { Outlet } from "react-router-dom";

function App() {
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();

  useEffect(() => {
    authService
      .getCurrentUser()
      .then((userData) => {
        if (userData) {
          useDispatch(login({ userData }));
        } else {
          useDispatch(logout());
        }
      })
      .catch(() => console.log("Unable to fetch current user"))
      .finally(() => setLoading(false));
  }, []);

  return !loading ? (
    <div className="min-h-screen flex flex-wrap content-between bg-gray-400">
      <div className="w-fullblock">
        <Header />
        <main>TODO{<Outlet />}</main>
        <Footer />
      </div>
    </div>
  ) : (
    <></>
  );
}

export default App;
