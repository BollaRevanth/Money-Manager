import {useContext, useEffect, useRef, useState} from "react"
import {createPortal} from "react-dom"
import {useLocation, useNavigate} from "react-router-dom"
import {LogOut, Menu, User, X} from "lucide-react"
import {AppContext} from "../context/AppContext.jsx"
import {assets} from "../assets/assets.js"
import Sidebar from "./Sidebar.jsx"

const Navbar = () => {
    const [openSideBar, setOpenSideBar] = useState(false)
    const [showDropdown, setShowDropdown] = useState(false)
    const dropdownRef = useRef(null)
    const {user, clearUserDetails} = useContext(AppContext)
    const navigate = useNavigate()
    const location = useLocation()

    useEffect(() => {
        setOpenSideBar(false)
    }, [location.pathname])

    useEffect(() => {
        if (!openSideBar) return undefined
        const closeOnEscape = (event) => {
            if (event.key === "Escape") setOpenSideBar(false)
        }
        window.addEventListener("keydown", closeOnEscape)
        return () => window.removeEventListener("keydown", closeOnEscape)
    }, [openSideBar])

    useEffect(() => {
        if (!showDropdown) return undefined
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setShowDropdown(false)
            }
        }
        const handleEscape = (event) => {
            if (event.key === "Escape") setShowDropdown(false)
        }
        document.addEventListener("mousedown", handleClickOutside)
        document.addEventListener("keydown", handleEscape)
        return () => {
            document.removeEventListener("mousedown", handleClickOutside)
            document.removeEventListener("keydown", handleEscape)
        }
    }, [showDropdown])

    const handleLogout = () => {
        localStorage.removeItem("token")
        clearUserDetails()
        setShowDropdown(false)
        navigate("/home", {replace: true})
    }

    return (
        <>
            <header className="sticky top-0 z-30 flex h-20 items-center justify-between gap-5 border-b border-gray-200/50 bg-white px-4 sm:px-7">
                <div className="flex items-center gap-5">
                    <button
                        type="button"
                        onClick={() => setOpenSideBar((isOpen) => !isOpen)}
                        aria-label={openSideBar ? "Close navigation menu" : "Open navigation menu"}
                        aria-expanded={openSideBar}
                        className="block rounded p-1 text-black transition-colors hover:bg-gray-100 lg:hidden"
                    >
                        {openSideBar ? <X /> : <Menu />}
                    </button>
                    <button
                        type="button"
                        onClick={() => navigate("/dashboard")}
                        aria-label="Go to dashboard"
                        className="flex items-center gap-2 rounded focus-visible:outline-2 focus-visible:outline-purple-600"
                    >
                        <img src={assets.logo} alt="" className="h-12 w-12" />
                        <span className="truncate text-lg font-medium text-black">Money Manager</span>
                    </button>
                </div>

                <div className="relative" ref={dropdownRef}>
                    <button
                        type="button"
                        onClick={() => setShowDropdown((open) => !open)}
                        aria-label="Open profile menu"
                        aria-expanded={showDropdown}
                        className={`flex h-10 w-10 items-center justify-center overflow-hidden rounded-full bg-gray-100 transition-colors duration-200 hover:bg-gray-200 focus:outline-none ${showDropdown ? "ring-2 ring-purple-800 ring-offset-2" : ""}`}
                    >
                        {user?.profileImageUrl ? (
                            <img src={user.profileImageUrl} alt="" className="h-full w-full object-cover" />
                        ) : (
                            <User className="text-purple-500" />
                        )}
                    </button>

                    {showDropdown && (
                        <div className="absolute right-0 z-50 mt-2 w-56 rounded-lg border border-gray-200 bg-white py-1 shadow-lg">
                            <div className="border-b border-gray-100 px-4 py-3">
                                <p className="truncate text-sm font-medium text-gray-800">{user?.fullName}</p>
                                <p className="truncate text-xs text-gray-500">{user?.email}</p>
                            </div>
                            <div className="py-1">
                                <button
                                    type="button"
                                    onClick={handleLogout}
                                    className="group flex w-full items-center gap-3 px-4 py-2 text-sm text-gray-700 transition-colors duration-150 hover:bg-red-50 hover:text-red-600"
                                >
                                    <LogOut className="h-4 w-4 text-gray-500 group-hover:text-red-600" />
                                    <span>Logout</span>
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </header>

            {/* Rendered outside the sticky header so fixed positioning uses the viewport. */}
            {openSideBar &&
                createPortal(
                    <div className="fixed inset-x-0 bottom-0 top-20 z-50 lg:hidden">
                        <button
                            type="button"
                            aria-label="Close navigation menu"
                            onClick={() => setOpenSideBar(false)}
                            className="absolute inset-0 h-full w-full cursor-default bg-black/30"
                        />
                        <div className="relative h-full w-64 overflow-y-auto bg-white shadow-xl">
                            <Sidebar mobile onNavigate={() => setOpenSideBar(false)} />
                        </div>
                    </div>,
                    document.body,
                )}
        </>
    )
}

export default Navbar
