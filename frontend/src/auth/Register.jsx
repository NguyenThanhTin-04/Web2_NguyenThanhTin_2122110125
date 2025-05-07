import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function Register() {
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        address: '',
        gender: '',
        email: '',
        password: '',
        password_confirmation: ''
    });

    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const { name, phone, address, gender, email, password, password_confirmation } = formData;
        if (!name || !phone || !address || !gender || !email || !password || !password_confirmation) {
            toast.error("Please fill in all fields!");
            return;
        }

        if (password !== password_confirmation) {
            toast.error("Passwords do not match!");
            return;
        }

        try {
            const response = await axios.post('http://localhost:8081/api/users/register', formData);
            toast.success("Register successful!");
            localStorage.setItem('token', response.data.token);
            navigate('/login');
        } catch (error) {
            if (error.response && error.response.status === 422) {
                const errors = error.response.data.errors;
                Object.keys(errors).forEach((field) => {
                    toast.error(`${field}: ${errors[field][0]}`);
                });
            } else {
                toast.error("Register failed!");
            }
        }
    };

    return (
        <div className="bg-gray-50 min-h-screen flex items-center justify-center py-6 px-4">
            <div className="max-w-md w-full bg-white p-8 rounded-2xl shadow">
                

                <h2 className="text-slate-900 text-center text-3xl font-semibold mb-6">Create Account</h2>

                <form onSubmit={handleSubmit} className="space-y-5">
                    <Input label="Full Name" name="name" type="text" value={formData.name} onChange={handleChange} />
                    <Input label="Phone" name="phone" type="text" value={formData.phone} onChange={handleChange} />
                    <Input label="Address" name="address" type="text" value={formData.address} onChange={handleChange} />

                    <div>
                        <label className="text-slate-800 text-sm font-medium mb-2 block">Gender</label>
                        <select
                            name="gender"
                            className="w-full px-4 py-3 rounded-md border border-slate-300 bg-white text-black outline-blue-500 text-sm"
                            value={formData.gender}
                            onChange={handleChange}
                        >
                            <option value="">Select your gender</option>
                            <option value="male">Male</option>
                            <option value="female">Female</option>
                            <option value="other">Other</option>
                        </select>
                    </div>

                    <Input label="Email" name="email" type="email" value={formData.email} onChange={handleChange} />
                    <Input label="Password" name="password" type="password" value={formData.password} onChange={handleChange} />
                    <Input label="Confirm Password" name="password_confirmation" type="password" value={formData.password_confirmation} onChange={handleChange} />

                    <div className="flex items-start gap-2 text-sm">
                        <input
                            id="remember-me"
                            name="remember-me"
                            type="checkbox"
                            className="mt-1 h-4 w-4 text-blue-600 border-gray-300 rounded"
                        />
                        <label htmlFor="remember-me" className="text-slate-700">
                            I accept the <a href="#" className="text-blue-600 font-semibold hover:underline">Terms and Conditions</a>
                        </label>
                    </div>

                    <button
                        type="submit"
                        className="w-full py-3 px-4 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 transition rounded-md"
                    >
                        Create an account
                    </button>

                    <p className="text-slate-800 text-sm text-center mt-4">
                        Already have an account?
                        <a href="/login" className="text-blue-600 font-semibold hover:underline ml-1">Login here</a>
                    </p>
                </form>
            </div>
            <ToastContainer />
        </div>
    );
}

const Input = ({ label, name, type, value, onChange }) => (
    <div>
        <label className="text-slate-800 text-sm font-medium mb-2 block">{label}</label>
        <input
            name={name}
            type={type}
            value={value}
            onChange={onChange}
            className="text-slate-800 bg-white border border-slate-300 w-full text-sm px-4 py-3 rounded-md outline-blue-500"
            placeholder={`Enter ${label.toLowerCase()}`}
        />
    </div>
);

export default Register;
