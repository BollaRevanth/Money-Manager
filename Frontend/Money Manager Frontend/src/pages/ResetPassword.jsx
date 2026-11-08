import {useState} from "react"
import {Link, useNavigate, useSearchParams} from "react-router-dom"
import {LoaderCircle} from "lucide-react"
import {toast} from "react-toastify"
import {assets} from "../assets/assets.js"
import Input from "../components/Input.jsx"
import {MAX_PASSWORD_LENGTH, MIN_PASSWORD_LENGTH} from "../util/validation.js"
import axiosConfig from "../util/axiosConfig.jsx"
import {API_ENDPOINTS} from "../util/apiEndpoints.jsx"
import {getErrorMessage} from "../util/util.js"

const ResetPassword = () => {
    const [searchParams] = useSearchParams()
    const token = searchParams.get("token")
    const navigate = useNavigate()

    const [password, setPassword] = useState("")
    const [confirm, setConfirm] = useState("")
    const [error, setError] = useState(null)
    const [isLoading, setIsLoading] = useState(false)

    const handleSubmit = async (event) => {
        event.preventDefault()
        if (password.length < MIN_PASSWORD_LENGTH) {
            setError(`Password must be at least ${MIN_PASSWORD_LENGTH} characters.`)
            return
        }
        if (password.length > MAX_PASSWORD_LENGTH) {
            setError(`Password must be ${MAX_PASSWORD_LENGTH} characters or fewer.`)
            return
        }
        if (password !== confirm) {
            setError("Passwords do not match.")
            return
        }
        setError(null)
        setIsLoading(true)
        try {
            await axiosConfig.post(API_ENDPOINTS.RESET_PASSWORD, {token, password})
            toast.success("Password updated. Please log in with your new password.")
            navigate("/login", {replace: true})
        } catch (err) {
            setError(getErrorMessage(err, "Unable to reset the password. Please try again."))
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="relative flex h-screen w-full items-center justify-center overflow-hidden">
            <img src={assets.login_bg} alt="" className="absolute inset-0 h-full w-full object-cover blur-sm" />
            <div className="relative z-10 w-full max-w-lg px-6">
                <div className="max-h-[90vh] overflow-y-auto rounded-lg bg-white/95 p-8 shadow-2xl backdrop-blur-sm">
                    <h3 className="mb-2 text-center text-2xl font-semibold text-black">Set a New Password</h3>

                    {!token ? (
                        <div className="space-y-4 text-center">
                            <p className="rounded bg-red-50 p-3 text-sm text-red-800" role="alert">
                                This reset link is incomplete. Please request a new one.
                            </p>
                            <Link to="/forgot-password" className="font-medium text-primary underline hover:text-primary-dark">
                                Request a new link
                            </Link>
                        </div>
                    ) : (
                        <>
                            <p className="mb-8 text-center text-sm text-slate-700">Choose a new password for your account.</p>
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <Input
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    label={`New Password (min ${MIN_PASSWORD_LENGTH} characters)`}
                                    placeholder="**********"
                                    type="password"
                                    autoComplete="new-password"
                                />
                                <Input
                                    value={confirm}
                                    onChange={(e) => setConfirm(e.target.value)}
                                    label="Confirm Password"
                                    placeholder="**********"
                                    type="password"
                                    autoComplete="new-password"
                                />
                                {error && (
                                    <div className="rounded bg-red-50 p-2 text-center text-sm text-red-800" role="alert">
                                        <p>{error}</p>
                                        {error.toLowerCase().includes("expired") && (
                                            <Link to="/forgot-password" className="font-medium underline">
                                                Request a new link
                                            </Link>
                                        )}
                                    </div>
                                )}
                                <button
                                    disabled={isLoading}
                                    className={`btn-primary flex w-full items-center justify-center gap-2 py-2 text-lg font-medium ${isLoading ? "cursor-not-allowed opacity-60" : ""}`}
                                    type="submit"
                                >
                                    {isLoading ? (
                                        <>
                                            <LoaderCircle className="h-5 w-5 animate-spin" />
                                            Updating...
                                        </>
                                    ) : (
                                        "UPDATE PASSWORD"
                                    )}
                                </button>
                            </form>
                        </>
                    )}
                </div>
            </div>
        </div>
    )
}

export default ResetPassword