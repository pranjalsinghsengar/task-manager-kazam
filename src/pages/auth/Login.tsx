import React, { useState } from "react";
import axios from "axios";
import AuthLayout from "../../layouts/AuthLayout";
import { API_URL } from "../../config/config";
import { useNavigate } from "react-router-dom";

interface FormData {
  email: string;
  password: string;
}

const Login: React.FC = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState<FormData>({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const InputHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await axios.post(`${API_URL}/user/login`, form, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (response.data.success) {
        localStorage.setItem("tsk-token",response.data.token)
        localStorage.setItem("tsk-user",response.data.user)
        window.location.reload();
      }
    } catch (error) {
      setError("Login failed. Please check your credentials.");
      console.error("Login error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout>
      <h2 className='text-3xl font-semibold text-gray-900 mb-4'>
        Welcome Back
      </h2>
      <p className='text-gray-500 mb-6'>Log in to your account.</p>
      {error && <p className='text-red-500 mb-4'>{error}</p>}
      <form onSubmit={handleSubmit} className='w-8/12'>
        <div className='mb-4'>
          <label className='block text-gray-700 font-medium mb-2'>Email</label>
          <input
            type='email'
            name='email'
            value={form.email}
            onChange={InputHandler}
            className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-green-500'
            placeholder='hi@fillianta.com'
            required
          />
        </div>
        <div className='mb-4'>
          <label className='block text-gray-700 font-medium mb-2'>
            Password
          </label>
          <input
            type='password'
            name='password'
            value={form.password}
            onChange={InputHandler}
            className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-green-500'
            placeholder='Enter your password'
            required
          />
          <a href='#' className='text-green-600 text-sm float-right mt-1'>
            Forgot?
          </a>
        </div>
        <button
          type='submit'
          className='w-full bg-green-700 text-white py-2 rounded-lg font-semibold hover:bg-green-800 transition'
          disabled={loading}
        >
          {loading ? "Logging in..." : "Log in"}
        </button>
        <p className='text-gray-600 text-sm  mt-4 flex items-center justify-center gap-2 text-center'>
          Don't have an account?{" "}
          <p
            className='text-green-600 cursor-pointer font-medium'
            onClick={() => navigate("/register")}
          >Sign up</p>
          
        </p>
      </form>
    </AuthLayout>
  );
};

export default Login;
