import React, { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import { useDispatch } from "react-redux";
import Navbar from "./components/Navbar/Navbar";
import Sidebar from "./components/Sidebar";
import { Bounce, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { healthCheck } from "./hooks/healthCheck";
import { getCurrentUser } from "./hooks/getCurrentUser";
import { icons } from "./assets/Icons.jsx";

function App() {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let intervalId;

    const initializeApp = async () => {
      try {
        await healthCheck();
        await getCurrentUser(dispatch);
        setLoading(false);
        // Set up periodic health check
        intervalId = setInterval(() => {
          healthCheck();
        }, 5 * 60 * 1000);
      } catch (error) {
        console.error("Error during initialization:", error);
        setLoading(false); // Allow app to render even if health check fails
      }
    };

    initializeApp();

    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [dispatch]);

  if (loading) {
    return (
      <div className="h-screen w-full bg-[#121212] text-white flex flex-col justify-center items-center">
        <span className="animate-spin">{icons.loading}</span>
        <h1 className="text-3xl font-semibold mt-4">Loading, please wait...</h1>
        <h2 className="text-xl mt-2">
          If this takes too long, try refreshing the page
        </h2>
      </div>
    );
  }

  return (
    <div className="h-screen w-screen bg-black text-white flex flex-col">
      <Navbar />
      <div className="flex flex-grow overflow-hidden">
        {/* Sidebar */}
        <Sidebar />

        {/* Main Content */}
        <main className="flex-grow overflow-y-auto h-full scrollbar-hide">
          <Outlet />
        </main>
      </div>

      {/* Toast Notifications */}
      <ToastContainer
        position="top-right"
        autoClose={2000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
        transition={Bounce}
      />
    </div>
  );
}

export default App;
