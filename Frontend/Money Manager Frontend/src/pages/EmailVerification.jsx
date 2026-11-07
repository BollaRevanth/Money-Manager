import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { CheckCircle2, XCircle, MailQuestion } from 'lucide-react';
import { assets } from '../assets/assets';

const EmailVerification = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const [status, setStatus] = useState(() => searchParams.get('status'));
    const [message, setMessage] = useState('');

    useEffect(() => {
        const statusParam = searchParams.get('status');
        const messageParam = searchParams.get('message');

        setStatus(statusParam);
        if (statusParam === 'success') {
            setMessage('Your account has been successfully verified.');
            // Give the user a moment to see the confirmation before continuing.
            const redirectTimer = window.setTimeout(() => {
                navigate('/login', { replace: true });
            }, 4000);
            return () => window.clearTimeout(redirectTimer);
        } else if (statusParam === 'error') {
            setMessage(messageParam || 'Something went wrong during verification.');
        } else if (statusParam === 'pending') {
            setMessage('We sent an activation link to your email. Open that link to verify your account, then return here to log in.');
        }
    }, [searchParams, navigate]);

    const getStatusContent = () => {
        switch (status) {
            case 'success':
                return {
                    icon: <CheckCircle2 className="h-16 w-16 text-green-500" />,
                    title: 'Verification Successful!',
                    bgColor: 'bg-green-50',
                    textColor: 'text-green-800',
                };
            case 'error':
                return {
                    icon: <XCircle className="h-16 w-16 text-red-500" />,
                    title: 'Verification Failed',
                    bgColor: 'bg-red-50',
                    textColor: 'text-red-800',
                };
            case 'pending':
                return {
                    icon: <MailQuestion className="h-16 w-16 text-purple-600" />,
                    title: 'Check your email',
                    bgColor: 'bg-purple-50',
                    textColor: 'text-purple-800',
                };
            default:
                return {
                    icon: <MailQuestion className="h-16 w-16 text-yellow-500 animate-pulse" />,
                    title: 'Verification link incomplete',
                    bgColor: 'bg-yellow-50',
                    textColor: 'text-yellow-800',
                    message: 'Open the full verification link from your email. If you already verified your email, continue to login.'
                };
        }
    };

    const { icon, title, bgColor, textColor, message: defaultMessage } = getStatusContent();

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-6">
            <div className="flex items-center gap-2 mb-8">
                <img src={assets.logo} alt="Money Manager Logo" className="h-10 w-10" />
                <span className="text-xl font-semibold text-gray-800">Money Manager</span>
            </div>

            <div className={`w-full max-w-md p-8 text-center rounded-2xl shadow-lg ${bgColor}`}>
                <div className="flex justify-center mb-6">
                    {icon}
                </div>
                <h1 className={`text-3xl font-bold ${textColor}`}>{title}</h1>
                <p className="mt-4 text-gray-600">
                    {message || defaultMessage}
                </p>

                <div className="mt-8">
                    <button
                        onClick={() => navigate('/login', { replace: true })}
                        className="px-8 py-3 bg-purple-700 text-white font-semibold rounded-lg shadow-lg hover:bg-purple-800 transform hover:scale-105 transition-all duration-300"
                    >
                        {status === 'success' ? 'Continue to Login' : 'Go to Login'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default EmailVerification;
