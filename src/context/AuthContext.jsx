import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const savedUser = localStorage.getItem('gearguard_user');
        if (savedUser) {
            try {
                setUser(JSON.parse(savedUser));
            } catch (error) {
                console.error("Error parsing user from local storage:", error);
                localStorage.removeItem('gearguard_user');
            }
        }
        setLoading(false);
    }, []);

    const login = async (username, password) => {
        const formData = new FormData();
        formData.append('username', username);
        formData.append('password', password);

        const response = await fetch('http://127.0.0.1:8001/api/auth/login', {
            method: 'POST',
            body: formData
        });

        if (response.ok) {
            const data = await response.json();
            const userData = {
                username: data.username,
                role: data.role,
                token: data.access_token
            };
            setUser(userData);
            localStorage.setItem('gearguard_user', JSON.stringify(userData));
            return true;
        } else {
            const error = await response.json();
            throw new Error(error.detail || 'Login failed');
        }
    };

    const signup = async (username, email, password) => {
        const response = await fetch('http://127.0.0.1:8001/api/auth/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                username,
                email,
                hashed_password: password,
                role: 'technician'
            })
        });

        if (response.ok) {
            return true;
        } else {
            const error = await response.json();
            throw new Error(error.detail || 'Signup failed');
        }
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('gearguard_user');
    };

    const requestPasswordReset = async (email) => {
        const response = await fetch('http://127.0.0.1:8001/api/auth/forgot-password', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email })
        });

        if (response.ok) {
            return true;
        } else {
            const error = await response.json();
            throw new Error(error.detail || 'Failed to request password reset');
        }
    };

    const resetPassword = async (token, newPassword) => {
        const response = await fetch('http://127.0.0.1:8001/api/auth/reset-password', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ token, new_password: newPassword })
        });

        if (response.ok) {
            return true;
        } else {
            const error = await response.json();
            throw new Error(error.detail || 'Failed to reset password');
        }
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, signup, logout, requestPasswordReset, resetPassword }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) throw new Error('useAuth must be used within an AuthProvider');
    return context;
}
