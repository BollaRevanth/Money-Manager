import {useContext, useState} from "react"
import {Link, useNavigate} from "react-router-dom"
import {LoaderCircle} from "lucide-react"
import {toast} from "react-toastify"
import {assets} from "../assets/assets.js"
import Input from "../components/Input.jsx"
import {AppContext} from "../context/AppContext.jsx"
import {validateEmail} from "../util/validation.js"
import axiosConfig from "../util/axiosConfig.jsx"
import {API_ENDPOINTS} from "../util/apiEndpoints.jsx"
import {getErrorMessage} from "../util/util.js"

const Login = () => {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const {setUser} = useContext(AppContext)
  const navigate = useNavigate()

  const handleSubmit = async (event) => {
    event.preventDefault()

    if (!validateEmail(email)) {
      setError("Please enter a valid email address.")
      return
    }
    if (!password.trim()) {
      setError("Please enter your password.")
      return
    }
    setError(null)
    setIsLoading(true)

    try {
      const {data} = await axiosConfig.post(API_ENDPOINTS.LOGIN, {email: email.trim(), password})
      if (data.token) {
        localStorage.setItem("token", data.token)
        setUser(data.user)
        toast.success("Logged in successfully.")
        navigate("/dashboard", {replace: true})
      }
    } catch (err) {
      setError(getErrorMessage(err, "Unable to log in. Please try again."))
    } finally {
      setIsLoading(false)
    }
  }

  return (
      <div className="relative flex h-screen w-full items-center justify-center overflow-hidden">
        <img
            src={assets.login_bg}
            alt=""
            className="absolute inset-0 h-full w-full object-cover blur-sm"
        />
        <div className="relative z-10 w-full max-w-lg px-6">
          <div className="max-h-[90vh] overflow-y-auto rounded-lg bg-white/95 p-8 shadow-2xl backdrop-blur-sm">
            <h3 className="mb-2 text-center text-2xl font-semibold text-black">Welcome Back</h3>
            <p className="mb-8 text-center text-sm text-slate-700">Please enter your details to login.</p>
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  label="Email Address"
                  placeholder="user@gmail.com"
                  type="email"
                  autoComplete="email"
              />
              <Input
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  label="Password"
                  placeholder="**********"
                  type="password"
                  autoComplete="current-password"
              />
              <div className="text-right">
                <Link
                    to="/forgot-password"
                    className="text-sm font-medium text-primary underline transition-colors hover:text-primary-dark"
                >
                  Forgot password?
                </Link>
              </div>
              {error && (
                  <p className="rounded bg-red-50 p-2 text-center text-sm text-red-800" role="alert">
                    {error}
                  </p>
              )}
              <button
                  disabled={isLoading}
                  className={`btn-primary flex w-full items-center justify-center gap-2 py-2 text-lg font-medium ${isLoading ? "cursor-not-allowed opacity-60" : ""}`}
                  type="submit"
              >
                {isLoading ? (
                    <>
                      <LoaderCircle className="h-5 w-5 animate-spin" />
                      Logging in...
                    </>
                ) : (
                    "LOGIN"
                )}
              </button>
              <p className="mt-4 text-center text-sm text-slate-800">
                Don't have an account?{" "}
                <Link
                    to="/signup"
                    className="font-medium text-primary underline transition-colors hover:text-primary-dark"
                >
                  Sign Up
                </Link>
              </p>
            </form>
          </div>
        </div>
      </div>
  )
}

export default Login
