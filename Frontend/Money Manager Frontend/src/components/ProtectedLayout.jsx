import {Suspense} from "react"
import {Navigate, Outlet} from "react-router-dom"
import {useUser} from "../hooks/useUser.jsx"
import Navbar from "./Navbar.jsx"
import Sidebar from "./Sidebar.jsx"
import PageLoader from "./PageLoader.jsx"

const ProtectedLayout = () => {
    const {user} = useUser()

    if (!localStorage.getItem("token")) return <Navigate to="/home" replace />
    if (!user) return <PageLoader fullScreen />

    return (
        <div>
            <Navbar />
            <div className="flex">
                <div className="hidden lg:block">
                    <Sidebar />
                </div>
                <main className="min-w-0 grow mx-5">
                    <Suspense fallback={<PageLoader />}>
                        <Outlet />
                    </Suspense>
                </main>
            </div>
        </div>
    )
}

export default ProtectedLayout
