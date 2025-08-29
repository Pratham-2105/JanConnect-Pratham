import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Login() {

  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const update = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const onSubmit = async (e) => {
  e.preventDefault();
  setError("");
  setSubmitting(true);

  try {
    const res = await fetch("http://localhost:8000/api/v1/user/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(form),
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.message || "Login failed");
    }

    // Save user details in localStorage
    localStorage.setItem("user", JSON.stringify(data.data.user)); 
localStorage.setItem("accessToken", data.data.accessToken);   


    // Navigate to dashboard
    navigate("/dashboard");
  } catch (err) {
    setError(err.message);
  } finally {
    setSubmitting(false);
  }
};


  return (
    <div className="max-w-xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-semibold mb-6">Login</h1>

      <form onSubmit={onSubmit} className="space-y-5">
        <div>
          <label className="block mb-1">Email</label>
          <input
            type="email"
            placeholder="Enter your email"
            value={form.email}
            onChange={(e) => update("email", e.target.value)}
            required
            className="w-full border border-gray-400 rounded-md px-3 py-2 outline-none
                       focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div>
          <label className="block mb-1">Password</label>
          <input
            type="password"
            placeholder="Enter your password"
            value={form.password}
            onChange={(e) => update("password", e.target.value)}
            required
            className="w-full border border-gray-400 rounded-md px-3 py-2 outline-none
                       focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        {error && <p className="text-red-600">{error}</p>}

        <button
          type="submit"
          disabled={submitting}
          className="w-full py-2 rounded-md font-semibold text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-60"
        >
          {submitting ? "Logging in…" : "Login"}
        </button>
      </form>

      <div className="text-center mt-5">
        <p className="mb-2">Are you an admin?</p>
        <Link
          to="/admin/login"
          className="inline-block px-3 py-1 rounded-md font-medium text-white bg-blue-600 hover:bg-blue-700 text-sm"
        >
          Click here
        </Link>
      </div>

      <p className="text-center mt-4">
        New here?{" "}
        <Link to="/signup" className="text-blue-600 underline">
          Create an account
        </Link>
      </p>
    </div>
  );
}
