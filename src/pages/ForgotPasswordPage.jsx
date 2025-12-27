import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, ArrowLeft, CheckCircle, AlertCircle } from 'lucide-react';

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const response = await fetch('http://127.0.0.1:8001/api/auth/forgot-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email })
            });

            if (response.ok) {
                setSuccess(true);
            } else {
                const data = await response.json();
                setError(data.detail || 'Failed to send reset email');
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
                {!success ? (
                    <>
                        <div style={{ marginBottom: '2rem' }}>
                            <Link to="/login" style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '0.5rem',
                                color: 'var(--color-text-secondary)',
                                textDecoration: 'none',
                                fontSize: '14px',
                                marginBottom: '1rem',
                                transition: 'color 0.2s'
                            }}
                                onMouseEnter={(e) => e.target.style.color = 'var(--color-primary)'}
                                onMouseLeave={(e) => e.target.style.color = 'var(--color-text-secondary)'}
                            >
                                <ArrowLeft size={16} /> Back to Login
                            </Link>
                            <h1 style={{ fontSize: '26px', fontWeight: 700, color: 'var(--color-primary)', marginBottom: '0.5rem' }}>
                                Forgot Password?
                            </h1>
                            <p style={{ color: 'var(--color-text-secondary)', fontSize: '14px' }}>
                                No worries! Enter your email and we'll send you reset instructions.
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
                                <label style={{ color: 'var(--color-text-main)', fontWeight: 600 }}>Email Address</label>
                                <div style={{ position: 'relative' }}>
                                    <Mail size={16} style={{
                                        position: 'absolute',
                                        left: '12px',
                                        top: '50%',
                                        transform: 'translateY(-50%)',
                                        color: '#adb5bd'
                                    }} />
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="Enter your email"
                                        style={{ paddingLeft: '2.5rem' }}
                                        required
                                    />
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
                                {loading ? 'Sending...' : 'Send Reset Link'}
                            </button>
                        </form>
                    </>
                ) : (
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
                            Check Your Email
                        </h2>
                        <p style={{ color: 'var(--color-text-secondary)', fontSize: '14px', lineHeight: 1.6, marginBottom: '2rem' }}>
                            If your email is registered with us, you'll receive password reset instructions shortly.
                            Check your inbox and spam folder.
                        </p>
                        <Link
                            to="/login"
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
                            Back to Login
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
}
