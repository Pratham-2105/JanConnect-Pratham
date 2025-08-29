import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Signup() {
  const navigate = useNavigate();

  const municipalities = Array.from({ length: 60 }, (_, i) => `Municipality ${i + 1}`);

  const [form, setForm] = useState({
    name: "",
    contactNumber: "",
    email: "",
    password: "",
    district: "",
    city: "",
    state: "",
    municipality: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const update = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      // TODO: call POST /user/signup
      console.log("signup payload:", form);
      navigate("/login");
    } catch {
      setError("Signup failed. Try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-semibold mb-6">Create your account</h1>

      <form onSubmit={onSubmit} className="space-y-5">
        <div>
          <label className="block mb-1">Full name</label>
          <input
            placeholder="Your name"
            value={form.name}
            onChange={(e) => update("name", e.target.value)}
            required
            className="w-full border border-gray-400 rounded-md px-3 py-2 outline-none
                       focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div>
          <label className="block mb-1">Contact number</label>
          <input
            inputMode="numeric"
            pattern="[0-9]{10}"
            placeholder="10-digit phone"
            value={form.contactNumber}
            onChange={(e) => update("contactNumber", e.target.value)}
            required
            className="w-full border border-gray-400 rounded-md px-3 py-2 outline-none
                       focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
          <p className="text-xs text-gray-500 mt-1">Numbers only, 10 digits.</p>
        </div>

        <div>
          <label className="block mb-1">Email</label>
          <input
            type="email"
            placeholder="name@example.com"
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
            placeholder="Min 6 characters"
            minLength={6}
            value={form.password}
            onChange={(e) => update("password", e.target.value)}
            required
            className="w-full border border-gray-400 rounded-md px-3 py-2 outline-none
                       focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div>
          <label className="block mb-1">District</label>
          <input
            placeholder="Your district"
            value={form.district}
            onChange={(e) => update("district", e.target.value)}
            required
            className="w-full border border-gray-400 rounded-md px-3 py-2 outline-none
                       focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div>
          <label className="block mb-1">City</label>
          <input
            placeholder="Your city"
            value={form.city}
            onChange={(e) => update("city", e.target.value)}
            required
            className="w-full border border-gray-400 rounded-md px-3 py-2 outline-none
                       focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div>
          <label className="block mb-1">State</label>
          <input
            placeholder="Your state"
            value={form.state}
            onChange={(e) => update("state", e.target.value)}
            required
            className="w-full border border-gray-400 rounded-md px-3 py-2 outline-none
                       focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div>
          <label className="block mb-1">Municipality</label>
          <div className="max-h-48 overflow-y-auto rounded-md">
            <select
              value={form.municipality}
              onChange={(e) => update("municipality", e.target.value)}
              required
              className="w-full border border-gray-400 rounded-md px-3 py-2 outline-none
                         focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="" disabled>
                Select municipality
              </option>
              {municipalities.map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </select>
          </div>
        </div>

        {error && <p className="text-red-600">{error}</p>}

        <button
          type="submit"
          disabled={submitting}
          className="w-full py-2 rounded-md font-semibold text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-60"
        >
          {submitting ? "Creating account…" : "Sign up"}
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
