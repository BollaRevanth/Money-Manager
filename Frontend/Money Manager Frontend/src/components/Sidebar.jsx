import {useContext, useRef, useState} from "react"
import {useLocation, useNavigate} from "react-router-dom"
import {LoaderCircle, Pencil, User} from "lucide-react"
import {toast} from "react-toastify"
import {AppContext} from "../context/AppContext.jsx"
import {SIDEBAR_DATA} from "../assets/assets.js"
import axiosConfig from "../util/axiosConfig.jsx"
import {API_ENDPOINTS} from "../util/apiEndpoints.jsx"
import uploadProfileImage from "../util/uploadProfileImage.js"
import {getErrorMessage} from "../util/util.js"

const Sidebar = ({mobile = false, onNavigate}) => {
    const {user, setUser} = useContext(AppContext)
    const navigate = useNavigate()
    const {pathname} = useLocation()
    const photoInputRef = useRef(null)
    const [isUpdatingPhoto, setIsUpdatingPhoto] = useState(false)

    const handlePhotoChange = async (event) => {
        const file = event.target.files?.[0]
        event.target.value = ""
        if (!file) return
        if (!file.type.startsWith("image/")) {
            toast.error("Please choose an image file.")
            return
        }
        if (file.size > 5 * 1024 * 1024) {
            toast.error("Image must be smaller than 5 MB.")
            return
        }

        setIsUpdatingPhoto(true)
        try {
            const profileImageUrl = await uploadProfileImage(file)
            const {data} = await axiosConfig.put(API_ENDPOINTS.UPDATE_PROFILE_IMAGE, {profileImageUrl})
            setUser(data)
            toast.success("Profile photo updated.")
        } catch (error) {
            toast.error(getErrorMessage(error, "Could not update your profile photo."))
        } finally {
            setIsUpdatingPhoto(false)
        }
    }

    return (
        <aside
            className={`flex w-64 flex-col bg-white p-4 text-gray-800 ${
                mobile
                    ? "min-h-full"
                    : "sticky top-20 z-20 h-[calc(100vh-5rem)] overflow-y-auto border-r border-gray-200/60"
            }`}
        >
            <div className="mb-6 flex flex-col items-center gap-2 rounded-2xl bg-purple-50 px-4 py-6">
                <div className="relative">
                    <input
                        ref={photoInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handlePhotoChange}
                        className="hidden"
                        aria-label="Choose a new profile photo"
                    />
                    {user?.profileImageUrl ? (
                        <img
                            src={user.profileImageUrl}
                            alt="Profile"
                            className="h-20 w-20 rounded-full object-cover shadow ring-4 ring-white"
                        />
                    ) : (
                        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-white shadow ring-4 ring-purple-100">
                            <User className="h-9 w-9 text-purple-600" />
                        </div>
                    )}
                    <button
                        type="button"
                        onClick={() => photoInputRef.current?.click()}
                        disabled={isUpdatingPhoto}
                        aria-label="Change profile photo"
                        title="Change profile photo"
                        className="absolute -right-1 -top-1 flex h-7 w-7 items-center justify-center rounded-full bg-purple-600 text-white shadow transition-colors hover:bg-purple-700 disabled:cursor-wait disabled:opacity-70"
                    >
                        {isUpdatingPhoto ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <Pencil className="h-3.5 w-3.5" />}
                    </button>
                </div>
                <div className="w-full min-w-0 text-center">
                    <h5 className="truncate font-semibold text-gray-900">{user?.fullName || "Guest"}</h5>
                    <p className="truncate text-xs text-gray-500">{user?.email || ""}</p>
                </div>
            </div>

            <nav className="flex flex-col gap-1.5">
                {SIDEBAR_DATA.map((item) => {
                    const isActive = pathname.startsWith(item.path)
                    return (
                        <button
                            key={item.id}
                            type="button"
                            onClick={() => {
                                navigate(item.path)
                                onNavigate?.()
                            }}
                            aria-current={isActive ? "page" : undefined}
                            className={`flex w-full cursor-pointer items-center gap-3 rounded-xl px-4 py-3 text-[15px] font-medium transition-colors duration-150 ${
                                isActive
                                    ? "bg-purple-600 text-white shadow-sm"
                                    : "text-gray-700 hover:bg-purple-50 hover:text-purple-700"
                            }`}
                        >
                            <item.icon className="h-5 w-5 shrink-0" />
                            <span className="truncate">{item.label}</span>
                        </button>
                    )
                })}
            </nav>

            <p className="mt-auto pt-6 text-center text-xs text-gray-400">Money Manager</p>
        </aside>
    )
}

export default Sidebar
