import React, { useState } from "react";
import axios, { AxiosError } from "axios";
import AuthLayout from "../../layouts/AuthLayout";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

interface FormData {
  username: string;
  email: string;
  password: string;
}

const Register: React.FC = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState<FormData>({
    username: "",
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
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
      const response = await axios.post(
        "http://localhost:5000/user/register",
        form,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      console.log("Registration successful:", response.data);
      if (response.data.success) {
        toast("Registration successful!");
        navigate("/");
      }
    } catch (err: AxiosError | unknown) {
      const error = err as AxiosError;
      console.error(
        "Registration failed:",
        error.response?.data || error.message
      );
      //   setError(error.response?.data?.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout>
      <h2 className='text-3xl font-semibold text-gray-900 mb-4'>Get Started</h2>
      <p className='text-gray-500 mb-6'>
        Let's create your account.
      </p>
      {error && <p className='text-red-600 mb-4'>{error}</p>}
      <form onSubmit={handleSubmit} className='w-10/12 md:w-8/12'>
        <div className='mb-4'>
          <label className='block text-gray-700 font-medium mb-2'>
            Username
          </label>
          <input
            type='text'
            name='username'
            value={form.username}
            onChange={InputHandler}
            className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-purple-500'
            placeholder='Enter your username'
            required
          />
        </div>
        <div className='mb-4'>
          <label className='block text-gray-700 font-medium mb-2'>Email</label>
          <input
            type='email'
            name='email'
            value={form.email}
            onChange={InputHandler}
            className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-purple-500'
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
            className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-purple-500'
            placeholder='Enter your password'
            required
          />
        </div>
        <button
          type='submit'
          className='w-full bg-gradient-to-r from-indigo-600 to-purple-600 cursor-pointer text-white py-2 rounded-lg font-semibold hover:bg-purple-800 transition'
          disabled={loading}
        >
          {loading ? "Signing up..." : "Sign Up"}
        </button>
        <p className='text-gray-600 text-sm text-center mt-4 flex items-center justify-center gap-2'>
          Already have an account?{" "}
          <p className=" text-purple-600 cursor-pointer font-medium" onClick={()=> navigate("/")}>
            Log in
          </p>
        </p>
      </form>
    </AuthLayout>
  );
};

export default Register;
