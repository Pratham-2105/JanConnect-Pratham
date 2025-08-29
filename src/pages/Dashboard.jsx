import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
try {
  if (!storedUser || storedUser === "undefined" || storedUser === "null") {
    localStorage.removeItem("user");
    navigate("/login");
  } else {
    setUser(JSON.parse(storedUser));
  }
} catch (error) {
  console.error("Invalid JSON in localStorage:", error);
  localStorage.removeItem("user");
  navigate("/login");
}

  }, [navigate]);

  if (!user) return <p>Loading...</p>;

  return (
    <div className="max-w-xl mx-auto px-4 py-10 text-center">
      <h1 className="text-3xl p-10 font-bold mb-4">Welcome, {user.name} 🎉</h1>
      <p className="text-gray-700 text-lg">Email: {user.email}</p>
      <button
        onClick={() => {
          localStorage.removeItem("user");
          navigate("/login");
        }}
        className="mt-6 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md"
      >
        Logout
      </button>
    </div>
  );
}
