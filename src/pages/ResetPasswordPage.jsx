import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { Lock, CheckCircle, AlertCircle, Eye, EyeOff } from 'lucide-react';

export default function ResetPasswordPage() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const [token, setToken] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [verifying, setVerifying] = useState(true);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState('');
    const [tokenValid, setTokenValid] = useState(false);

    useEffect(() => {
        const tokenParam = searchParams.get('token');
        if (!tokenParam) {
            setError('No reset token provided');
            setVerifying(false);
            return;
        }

        setToken(tokenParam);
        verifyToken(tokenParam);
    }, [searchParams]);

    const verifyToken = async (resetToken) => {
        try {
            const response = await fetch('http://127.0.0.1:8001/api/auth/verify-reset-token', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ token: resetToken })
            });

            if (response.ok) {
                setTokenValid(true);
            } else {
                const data = await response.json();
                setError(data.detail || 'Invalid or expired reset token');
            }
        } catch (err) {
            setError('Failed to verify reset token');
        } finally {
            setVerifying(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (newPassword !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        if (newPassword.length < 6) {
            setError('Password must be at least 6 characters long');
            return;
        }

        setLoading(true);

        try {
            const response = await fetch('http://127.0.0.1:8001/api/auth/reset-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ token, new_password: newPassword })
            });

            if (response.ok) {
                setSuccess(true);
                setTimeout(() => navigate('/login'), 3000);
            } else {
                const data = await response.json();
                setError(data.detail || 'Failed to reset password');
            }
        } catch (err) {
            setError('Network error. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{
            height: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#f8f9fa',
            backgroundImage: 'radial-gradient(#ddd 1px, transparent 1px)',
            backgroundSize: '20px 20px'
        }}>
            <div className="card" style={{
                width: '100%',
                maxWidth: '450px',
                padding: '2.5rem',
                boxShadow: '0 15px 35px rgba(0,0,0,0.1)',
                borderRadius: 'var(--radius-md)',
                backgroundColor: 'white'
            }}>
                {verifying ? (
                    <div style={{ textAlign: 'center', padding: '2rem 0' }}>
                        <p style={{ color: 'var(--color-text-secondary)' }}>Verifying reset token...</p>
                    </div>
                ) : !tokenValid ? (
                    <div style={{ textAlign: 'center' }}>
                        <div style={{
                            width: '60px',
                            height: '60px',
                            backgroundColor: 'rgba(220, 53, 69, 0.1)',
                            borderRadius: '50%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            margin: '0 auto 1.5rem',
                            color: '#dc3545'
                        }}>
                            <AlertCircle size={32} />
                        </div>
                        <h2 style={{ fontSize: '22px', fontWeight: 700, color: 'var(--color-text-main)', marginBottom: '0.75rem' }}>
                            Invalid Reset Link
                        </h2>
                        <p style={{ color: 'var(--color-text-secondary)', fontSize: '14px', lineHeight: 1.6, marginBottom: '2rem' }}>
                            {error || 'This password reset link is invalid or has expired. Please request a new one.'}
                        </p>
                        <Link
                            to="/forgot-password"
                            className="btn btn-primary"
                            style={{
                                width: '100%',
                                padding: '0.75rem',
                                fontSize: '15px',
                                justifyContent: 'center',
                                textDecoration: 'none',
                                display: 'flex'
                            }}
                        >
                            Request New Link
                        </Link>
                    </div>
                ) : success ? (
                    <div style={{ textAlign: 'center' }}>
                        <div style={{
                            width: '60px',
                            height: '60px',
                            backgroundColor: 'rgba(40, 167, 69, 0.1)',
                            borderRadius: '50%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            margin: '0 auto 1.5rem',
                            color: '#28a745'
                        }}>
                            <CheckCircle size={32} />
                        </div>
                        <h2 style={{ fontSize: '22px', fontWeight: 700, color: 'var(--color-text-main)', marginBottom: '0.75rem' }}>
                            Password Reset Successful!
                        </h2>
                        <p style={{ color: 'var(--color-text-secondary)', fontSize: '14px', lineHeight: 1.6, marginBottom: '2rem' }}>
                            Your password has been successfully reset. You can now log in with your new password.
                            Redirecting to login page...
                        </p>
                    </div>
                ) : (
                    <>
                        <div style={{ marginBottom: '2rem' }}>
                            <h1 style={{ fontSize: '26px', fontWeight: 700, color: 'var(--color-primary)', marginBottom: '0.5rem' }}>
                                Reset Your Password
                            </h1>
                            <p style={{ color: 'var(--color-text-secondary)', fontSize: '14px' }}>
                                Enter your new password below.
                            </p>
                        </div>

                        {error && (
                            <div style={{
                                backgroundColor: 'rgba(220, 53, 69, 0.1)',
                                color: '#dc3545',
                                padding: '0.75rem',
                                borderRadius: 'var(--radius-sm)',
                                fontSize: '13px',
                                marginBottom: '1.5rem',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.5rem'
                            }}>
                                <AlertCircle size={16} /> {error}
                            </div>
                        )}

                        <form onSubmit={handleSubmit}>
                            <div className="form-group">
                                <label style={{ color: 'var(--color-text-main)', fontWeight: 600 }}>New Password</label>
                                <div style={{ position: 'relative' }}>
                                    <Lock size={16} style={{
                                        position: 'absolute',
                                        left: '12px',
                                        top: '50%',
                                        transform: 'translateY(-50%)',
                                        color: '#adb5bd'
                                    }} />
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
                                        placeholder="Enter new password"
                                        style={{ paddingLeft: '2.5rem', paddingRight: '2.5rem' }}
                                        required
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        style={{
                                            position: 'absolute',
                                            right: '12px',
                                            top: '50%',
                                            transform: 'translateY(-50%)',
                                            background: 'none',
                                            border: 'none',
                                            cursor: 'pointer',
                                            color: '#adb5bd',
                                            padding: 0
                                        }}
                                    >
                                        {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                    </button>
                                </div>
                            </div>

                            <div className="form-group" style={{ marginTop: '1.25rem' }}>
                                <label style={{ color: 'var(--color-text-main)', fontWeight: 600 }}>Confirm Password</label>
                                <div style={{ position: 'relative' }}>
                                    <Lock size={16} style={{
                                        position: 'absolute',
                                        left: '12px',
                                        top: '50%',
                                        transform: 'translateY(-50%)',
                                        color: '#adb5bd'
                                    }} />
                                    <input
                                        type={showConfirmPassword ? "text" : "password"}
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        placeholder="Confirm new password"
                                        style={{ paddingLeft: '2.5rem', paddingRight: '2.5rem' }}
                                        required
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                        style={{
                                            position: 'absolute',
                                            right: '12px',
                                            top: '50%',
                                            transform: 'translateY(-50%)',
                                            background: 'none',
                                            border: 'none',
                                            cursor: 'pointer',
                                            color: '#adb5bd',
                                            padding: 0
                                        }}
                                    >
                                        {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                    </button>
                                </div>
                            </div>

                            <button
                                type="submit"
                                className="btn btn-primary"
                                disabled={loading}
                                style={{
                                    width: '100%',
                                    marginTop: '1.5rem',
                                    padding: '0.75rem',
                                    fontSize: '15px',
                                    justifyContent: 'center'
                                }}
                            >
                                {loading ? 'Resetting...' : 'Reset Password'}
                            </button>
                        </form>
                    </>
                )}
            </div>
        </div>
    );
}
