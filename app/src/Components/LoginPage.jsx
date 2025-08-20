import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../ui/Header";
import Button from "../ui/Button";
import API_BASE_URL from "../utils/apiConfig";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const navigate = useNavigate();

  async function handleLogin(e) {
    e.preventDefault();
    setError("");

    try {
      const res = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Login failed");
        return;
      }

      localStorage.setItem("adminToken", data.token);
      localStorage.setItem("adminInfo", JSON.stringify(data.admin));
      // navigate("/admin/dashboard");
      setIsAuthenticated(true)
    } catch (err) {
      setError("Something went wrong.");
      console.error(err);
    }
  }

  useEffect(function(){
    if(isAuthenticated) navigate("/admin/dashboard", {replace: true})
  }, [isAuthenticated, navigate])

  return (
    <div className="min-h-screen bg-slate-100">
      <Header/>
      <div className=" flex items-center justify-center my-32">
      <form onSubmit={handleLogin} className="bg-white py-6 px-10 rounded shadow-lg space-y-6 w-96">
        <h2 className="text-xl font-bold text-center">Admin Login</h2>
        {error && <p className="text-red-600">{error}</p>}
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-3 py-2 border rounded focus:outline-1 focus:outline-gray-400"
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full px-3 py-2 border rounded focus:outline-1 focus:outline-gray-400"
          required
          />
        <Button type="submit" className="w-full bg-slate-700  tracking-widest text-2xl font-medium text-white py-2 rounded shadow-lg">Login</Button>
      </form>
          </div>
    </div>
  );
}
