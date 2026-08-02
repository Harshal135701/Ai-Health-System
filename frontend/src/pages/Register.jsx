import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { register } from "../services/authService"

function Register() {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
        phoneNo: "",
        role: "patient",
    });

    const handleChange = (e) => {
        setFormData((prev) => ({
            ...prev,
            [e.target.name]: e.target.value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await register({
                name: formData.name,
                email: formData.email,
                password: formData.password,
                phoneNo: formData.phoneNo,
                role: formData.role,
            });

            alert(response.message);
            navigate("/login");
            
        } catch (error) {
            console.log(error.response?.data);
        }
    };

    return (
        <div>
            <h1>Register</h1>

            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    name="name"
                    placeholder="Enter Name"
                    value={formData.name}
                    onChange={handleChange}
                />

                <input
                    type="email"
                    name="email"
                    placeholder="Enter Email"
                    value={formData.email}
                    onChange={handleChange}
                />

                <input
                    type="password"
                    name="password"
                    placeholder="Enter Password"
                    value={formData.password}
                    onChange={handleChange}
                />

                <input
                    type="password"
                    name="confirmPassword"
                    placeholder="Confirm Password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                />

                <input
                    type="tel"
                    name="phoneNo"
                    placeholder="Phone Number"
                    value={formData.phoneNo}
                    onChange={handleChange}
                />

                <select
                    name="role"
                    value={formData.role}
                    onChange={handleChange}
                >
                    <option value="patient">Register as Patient</option>
                    <option value="doctor">Register as Doctor</option>
                </select>

                <button type="submit">
                    Register
                </button>
            </form>
        </div>
    );
}

export default Register;