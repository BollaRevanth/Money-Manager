import {Link} from "react-router-dom"
import {ArrowUpRight} from "lucide-react"
import {assets} from "../assets/assets.js"

const Footer = () => {
    const currentYear = new Date().getFullYear()

    return (
        <footer className="relative overflow-hidden border-t border-violet-200/70 bg-gradient-to-br from-violet-50 via-white to-fuchsia-50">
            <div className="pointer-events-none absolute -right-20 -top-28 h-56 w-56 rounded-full bg-violet-200/35 blur-3xl" />
            <div className="relative mx-auto max-w-7xl px-4 py-6 sm:px-8 sm:py-7">
                <div className="flex flex-col items-center gap-4 text-center sm:flex-row sm:items-center sm:justify-between sm:gap-6 sm:text-left">
                    <Link to="/home" className="group flex min-w-0 items-center gap-3 rounded-lg text-left focus-visible:outline-2 focus-visible:outline-violet-600">
                        <img src={assets.logo} alt="" className="h-10 w-10 shrink-0 rounded-xl object-contain" />
                        <span className="min-w-0">
                            <span className="block text-base font-semibold tracking-tight text-slate-900">Money Manager</span>
                            <span className="block text-xs text-slate-500">A clearer view of your money.</span>
                        </span>
                    </Link>

                    <nav aria-label="Footer" className="flex w-full flex-wrap items-center justify-center gap-1 text-sm font-medium sm:w-auto sm:justify-end sm:gap-2">
                        <Link to="/about-us" className="rounded-lg px-3 py-2.5 text-slate-600 transition hover:bg-white hover:text-violet-700 focus-visible:outline-2 focus-visible:outline-violet-600">About us</Link>
                        <Link to="/contact-us" className="group inline-flex items-center gap-1 rounded-lg px-3 py-2.5 text-slate-600 transition hover:bg-white hover:text-violet-700 focus-visible:outline-2 focus-visible:outline-violet-600">
                            Contact us<ArrowUpRight aria-hidden="true" className="h-3.5 w-3.5 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                        </Link>
                    </nav>
                </div>

                <div className="mt-4 border-t border-violet-200/70 pt-3 text-center text-xs leading-relaxed text-slate-500 sm:mt-5 sm:pt-4 sm:text-left">
                    <p>© {currentYear} Money Manager. All rights reserved.</p>
                </div>
            </div>
        </footer>
    )
}

export default Footer
