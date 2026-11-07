import {LoaderCircle} from "lucide-react"

const PageLoader = ({fullScreen = false}) => (
    <div className={`flex items-center justify-center ${fullScreen ? "h-screen" : "h-64"}`}>
        <LoaderCircle className="h-8 w-8 animate-spin text-purple-600" aria-label="Loading" />
    </div>
)

export default PageLoader