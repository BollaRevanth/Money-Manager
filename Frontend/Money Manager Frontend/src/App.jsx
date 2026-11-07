import {lazy, Suspense} from "react"
import {BrowserRouter, Navigate, Route, Routes} from "react-router-dom"
import {ToastContainer} from "react-toastify"
import ProtectedLayout from "./components/ProtectedLayout.jsx"
import PageLoader from "./components/PageLoader.jsx"
import Login from "./pages/Login.jsx"
import Signup from "./pages/Signup.jsx"
import LandingPage from "./pages/LandingPage.jsx"
import AboutUs from "./pages/AboutUs";
import ContactUs from "./pages/ContactUs";
import EmailVerification from "./pages/EmailVerification.jsx";

const Home = lazy(() => import("./pages/Home.jsx"))
const Income = lazy(() => import("./pages/Income.jsx"))
const Expense = lazy(() => import("./pages/Expense.jsx"))
const Category = lazy(() => import("./pages/Category.jsx"))
const Filter = lazy(() => import("./pages/Filter.jsx"))

const App = () => (
    <>
        <ToastContainer position="top-right" autoClose={3500} />
        <BrowserRouter>
            <Suspense fallback={<PageLoader fullScreen />}>
                <Routes>
                    <Route path="/" element={<Navigate to="/home" replace />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/signup" element={<Signup />} />
                    <Route path="/verify-email" element={<EmailVerification />} />

                    <Route path="/home" element={<LandingPage />} />
                    <Route path="/about-us" element={<AboutUs />} />
                    <Route path="/contact-us" element={<ContactUs />} />

                    <Route element={<ProtectedLayout />}>
                        <Route path="/dashboard" element={<Home />} />
                        <Route path="/income" element={<Income />} />
                        <Route path="/expense" element={<Expense />} />
                        <Route path="/category" element={<Category />} />
                        <Route path="/filter" element={<Filter />} />
                    </Route>

                    <Route path="*" element={<Navigate to="/home" replace />} />
                </Routes>
            </Suspense>
        </BrowserRouter>
    </>
)

export default App
