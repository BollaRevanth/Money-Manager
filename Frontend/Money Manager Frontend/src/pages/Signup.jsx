import {useState} from "react"
import {Link, useNavigate} from "react-router-dom"
import {LoaderCircle} from "lucide-react"
import {toast} from "react-toastify"
import {assets} from "../assets/assets.js"
import Input from "../components/Input.jsx"
import ProfilePhotoSelector from "../components/ProfilePhotoSelector.jsx"
import {MAX_PASSWORD_LENGTH, MIN_PASSWORD_LENGTH, validateEmail} from "../util/validation.js"
import axiosConfig from "../util/axiosConfig.jsx"
import {API_ENDPOINTS} from "../util/apiEndpoints.jsx"
import uploadProfileImage from "../util/uploadProfileImage.js"
import {getErrorMessage} from "../util/util.js"

const Signup = () => {
  const [fullName, setFullName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [profilePhoto, setProfilePhoto] = useState(null)
  const navigate = useNavigate()

  const handleSubmit = async (event) => {
    event.preventDefault()

    if (!fullName.trim()) {
      setError("Please enter your full name.")
      return
    }
    if (!validateEmail(email)) {
      setError("Please enter a valid email address.")
      return
    }
    if (password.length < MIN_PASSWORD_LENGTH) {
      setError(`Password must be at least ${MIN_PASSWORD_LENGTH} characters.`)
      return
    }
    if (password.length > MAX_PASSWORD_LENGTH) {
      setError(`Password must be ${MAX_PASSWORD_LENGTH} characters or fewer.`)
      return
    }
    setError(null)
    setIsLoading(true)

    try {
      const profileImageUrl = profilePhoto ? (await uploadProfileImage(profilePhoto)) || "" : ""
      await axiosConfig.post(API_ENDPOINTS.REGISTER, {
        fullName: fullName.trim(),
        email: email.trim(),
        password,
        profileImageUrl,
      })
      toast.success("Account created successfully !", {autoClose: 8000})
      navigate("/verify-email?status=pending", {replace: true})
    } catch (err) {
      setError(getErrorMessage(err, "Unable to create the account. Please try again."))
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
            <h3 className="mb-2 text-center text-2xl font-semibold text-black">Create an Account</h3>
            <p className="mb-8 text-center text-sm text-slate-700">
              Start tracking your spending by joining us.
            </p>
            <form onSubmit={handleSubmit} className="space-y-4">
              <ProfilePhotoSelector image={profilePhoto} setImage={setProfilePhoto} />
              <div className="grid grid-cols-1 gap-x-6 md:grid-cols-2">
                <Input
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    label="Full Name"
                    placeholder="Enter Full Name"
                    type="text"
                    autoComplete="name"
                    maxLength={100}
                />
                <Input
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    label="Email Address"
                    placeholder="user@gmail.com"
                    type="email"
                    autoComplete="email"
                />
                <div className="col-span-1 md:col-span-2">
                  <Input
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      label={`Password (min ${MIN_PASSWORD_LENGTH} characters)`}
                      placeholder="**********"
                      type="password"
                      autoComplete="new-password"
                  />
                </div>
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
                      Signing Up...
                    </>
                ) : (
                    "SIGN UP"
                )}
              </button>
              <p className="mt-4 text-center text-sm text-slate-800">
                Already have an account?{" "}
                <Link
                    to="/login"
                    className="font-medium text-primary underline transition-colors hover:text-primary-dark"
                >
                  Login
                </Link>
              </p>
            </form>
          </div>
        </div>
      </div>
  )
}

export default Signup
