import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { login } from "../services/authService";

function Login() {

    const navigate = useNavigate();
    const { setUser } = useAuth();

    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });

    const handleChange = (e) => {

        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });

    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.email || !formData.password) {
            alert("Please fill in all fields");
            return;
        }

        try {
            const data = await login(formData);

            if (!data.status) {
                alert(data.message);
                return;
            }

            setUser(data.user);

            if (data.user.role === "doctor") {
                navigate("/doctor/dashboard");
            } else {
                navigate("/patient/dashboard");
            }

        } catch (err) {
            console.error(err);
            alert(err.response?.data?.message || "Login Failed");
        }
    };

    return (
        <form onSubmit={handleSubmit}>

            <input
                type="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
            />

            <br /><br />

            <input
                type="password"
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
            />

            <br /><br />

            <button type="submit">
                Login
            </button>

        </form>
    );
}

export default Login;