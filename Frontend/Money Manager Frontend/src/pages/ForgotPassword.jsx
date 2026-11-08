import {useState} from "react"
import {Link} from "react-router-dom"
import {LoaderCircle} from "lucide-react"
import {assets} from "../assets/assets.js"
import Input from "../components/Input.jsx"
import {validateEmail} from "../util/validation.js"
import axiosConfig from "../util/axiosConfig.jsx"
import {API_ENDPOINTS} from "../util/apiEndpoints.jsx"
import {getErrorMessage} from "../util/util.js"

const ForgotPassword = () => {
    const [email, setEmail] = useState("")
    const [error, setError] = useState(null)
    const [sent, setSent] = useState(false)
    const [isLoading, setIsLoading] = useState(false)

    const handleSubmit = async (event) => {
        event.preventDefault()
        if (!validateEmail(email)) {
            setError("Please enter a valid email address.")
            return
        }
        setError(null)
        setIsLoading(true)
        try {
            await axiosConfig.post(API_ENDPOINTS.FORGOT_PASSWORD, {email: email.trim()})
            setSent(true)
        } catch (err) {
            setError(getErrorMessage(err, "Unable to send the reset link. Please try again."))
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="relative flex h-screen w-full items-center justify-center overflow-hidden">
            <img src={assets.login_bg} alt="" className="absolute inset-0 h-full w-full object-cover blur-sm" />
            <div className="relative z-10 w-full max-w-lg px-6">
                <div className="max-h-[90vh] overflow-y-auto rounded-lg bg-white/95 p-8 shadow-2xl backdrop-blur-sm">
                    <h3 className="mb-2 text-center text-2xl font-semibold text-black">Forgot Password</h3>

                    {sent ? (
                        <div className="space-y-4 text-center">
                            <p className="rounded bg-green-50 p-3 text-sm text-green-800" role="status">
                                If an account exists for <b>{email.trim()}</b>, a reset link is on its way. It expires in 30 minutes.
                                Check your spam folder too.
                            </p>
                            <Link to="/login" className="font-medium text-primary underline hover:text-primary-dark">
                                Back to login
                            </Link>
                        </div>
                    ) : (
                        <>
                            <p className="mb-8 text-center text-sm text-slate-700">
                                Enter your email and we'll send you a link to reset your password.
                            </p>
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <Input
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    label="Email Address"
                                    placeholder="user@gmail.com"
                                    type="email"
                                    autoComplete="email"
                                />
                                {error && (
                                    <p className="rounded bg-red-50 p-2 text-center text-sm text-red-800" role="alert">{error}</p>
                                )}
                                <button
                                    disabled={isLoading}
                                    className={`btn-primary flex w-full items-center justify-center gap-2 py-2 text-lg font-medium ${isLoading ? "cursor-not-allowed opacity-60" : ""}`}
                                    type="submit"
                                >
                                    {isLoading ? (
                                        <>
                                            <LoaderCircle className="h-5 w-5 animate-spin" />
                                            Sending...
                                        </>
                                    ) : (
                                        "SEND RESET LINK"
                                    )}
                                </button>
                                {isLoading && (
                                    <p className="text-center text-xs text-slate-500">
                                        If the server was idle, this can take up to 2 minutes.
                                    </p>
                                )}
                                <p className="mt-4 text-center text-sm text-slate-800">
                                    Remembered it?{" "}
                                    <Link to="/login" className="font-medium text-primary underline hover:text-primary-dark">
                                        Login
                                    </Link>
                                </p>
                            </form>
                        </>
                    )}
                </div>
            </div>
        </div>
    )
}

export default ForgotPassword