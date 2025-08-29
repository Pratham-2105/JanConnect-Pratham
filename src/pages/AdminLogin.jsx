import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

export default function AdminLogin() {
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
      // TODO: call POST /admin/login
      console.log("admin login payload:", form);
      navigate("/admin/dashboard");
    } catch {
      setError("Admin login failed. Try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-semibold mb-6">Admin Login</h1>

      <form onSubmit={onSubmit} className="space-y-5">
        <div>
          <label className="block mb-1">Admin Email</label>
          <input
            type="email"
            placeholder="admin@example.com"
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
            placeholder="Enter admin password"
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
          className="w-full py-2 rounded-md font-semibold text-white bg-red-600 hover:bg-red-700 disabled:opacity-60"
        >
          {submitting ? "Logging in…" : "Login as Admin"}
        </button>
      </form>

      <p className="text-center mt-4">
        Not an admin?{" "}
        <Link to="/login" className="text-blue-600 underline">
          Go to User Login
        </Link>
      </p>
    </div>
  );
}
