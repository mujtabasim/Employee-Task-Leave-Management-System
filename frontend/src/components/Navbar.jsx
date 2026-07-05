import "./Navbar.css";
import { Link, useNavigate } from "react-router-dom";
import { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";

function Navbar() {
    const navigate = useNavigate();
    const { logout, user } = useContext(AuthContext);

    const [menuOpen, setMenuOpen] = useState(false);

    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    const closeMenu = () => {
        setMenuOpen(false);
    };

    return (
        <nav className="navbar">

            <div className="navbar-logo">
                Employee System
            </div>

            <div
                className="hamburger"
                onClick={() => setMenuOpen(!menuOpen)}
            >
                ☰
            </div>

            <ul className={`navbar-links ${menuOpen ? "active" : ""}`}>

                <li>
                    <Link to="/dashboard" onClick={closeMenu}>
                        Dashboard
                    </Link>
                </li>

                <li>
                    <Link to="/tasks" onClick={closeMenu}>
                        Tasks
                    </Link>
                </li>

                <li>
                    <Link to="/leave" onClick={closeMenu}>
                        Leave
                    </Link>
                </li>

                {(user.role === "admin" || user.role === "manager") && (
                    <li>
                        <Link to="/users" onClick={closeMenu}>
                            Users
                        </Link>
                    </li>
                )}

                <li>
                    <button
                        className="logout-btn"
                        onClick={handleLogout}
                    >
                        Logout
                    </button>
                </li>

            </ul>

        </nav>
    );
}

export default Navbar;