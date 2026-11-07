import {useEffect} from "react"
import {X} from "lucide-react"

const Modal = ({isOpen, onClose, children, title}) => {
    useEffect(() => {
        if (!isOpen) return undefined
        const onKeyDown = (event) => {
            if (event.key === "Escape") onClose()
        }
        window.addEventListener("keydown", onKeyDown)
        return () => window.removeEventListener("keydown", onKeyDown)
    }, [isOpen, onClose])

    if (!isOpen) return null

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
            role="dialog"
            aria-modal="true"
            aria-label={title}
            onMouseDown={(event) => {
                if (event.target === event.currentTarget) onClose()
            }}
        >
            <div className="w-full max-w-2xl p-4">
                <div className="flex max-h-[90vh] flex-col rounded-xl border border-gray-100 bg-white shadow-2xl">
                    <div className="flex shrink-0 items-center justify-between rounded-t-xl border-b border-gray-100 p-5 md:p-6">
                        <h3 className="text-xl font-semibold text-gray-800">{title}</h3>
                        <button
                            onClick={onClose}
                            type="button"
                            aria-label="Close"
                            className="inline-flex h-9 w-9 cursor-pointer items-center justify-center rounded-lg bg-gray-50 text-gray-500 transition-colors duration-200 hover:bg-gray-200 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                        >
                            <X className="h-4 w-4" size={15} />
                        </button>
                    </div>
                    <div className="overflow-y-auto p-5 text-gray-700 md:p-6">{children}</div>
                </div>
            </div>
        </div>
    )
}

export default Modal