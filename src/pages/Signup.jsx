import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { registerUser } from "../api/auth";

export default function Signup() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    username: "",
    email: "",
    phone: "",
    password: "",
    avatar: null,
  });

  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const update = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const onSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");

    try {
      const formData = new FormData();
      Object.entries(form).forEach(([key, value]) => {
        formData.append(key, value);
      });

      const res = await registerUser(formData);
      alert(res.message || "Signup successful!");
      navigate("/login");
    } catch (err) {
      setError(err.message || "Signup failed. Try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-semibold mb-6">Create your account</h1>

      <form onSubmit={onSubmit} className="space-y-5">
        <input
          placeholder="Full Name"
          value={form.name}
          onChange={(e) => update("name", e.target.value)}
          required
          className="w-full border border-gray-400 rounded-md px-3 py-2"
        />

        <input
          placeholder="Username"
          value={form.username}
          onChange={(e) => update("username", e.target.value)}
          required
          className="w-full border border-gray-400 rounded-md px-3 py-2"
        />

        <input
          placeholder="Phone Number"
          value={form.phone}
          onChange={(e) => update("phone", e.target.value)}
          required
          className="w-full border border-gray-400 rounded-md px-3 py-2"
        />

        <input
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={(e) => update("email", e.target.value)}
          required
          className="w-full border border-gray-400 rounded-md px-3 py-2"
        />

        <input
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={(e) => update("password", e.target.value)}
          required
          className="w-full border border-gray-400 rounded-md px-3 py-2"
        />

        <input
          type="file"
          accept="image/*"
          onChange={(e) => update("avatar", e.target.files[0])}
          required
          className="w-full border border-gray-400 rounded-md px-3 py-2"
        />

        {error && <p className="text-red-600">{error}</p>}

        <button
          type="submit"
          disabled={submitting}
          className="w-full py-2 rounded-md font-semibold text-white bg-blue-600 hover:bg-blue-700"
        >
          {submitting ? "Signing up…" : "Sign Up"}
        </button>
      </form>

      <p className="text-center mt-4">
        Already have an account?{" "}
        <Link to="/login" className="text-blue-600 underline">
          Log in
        </Link>
      </p>
    </div>
  );
}
