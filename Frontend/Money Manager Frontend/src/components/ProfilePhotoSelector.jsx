import {useEffect, useRef, useState} from "react"
import {Trash, Upload, User} from "lucide-react"
import {toast} from "react-toastify"

const MAX_SIZE_MB = 5

const ProfilePhotoSelector = ({image, setImage}) => {
    const inputRef = useRef(null)
    const [previewUrl, setPreviewUrl] = useState(null)

    useEffect(() => {
        if (!image) {
            setPreviewUrl(null)
            return undefined
        }
        const url = URL.createObjectURL(image)
        setPreviewUrl(url)
        return () => URL.revokeObjectURL(url)
    }, [image])

    const handleImageChange = (event) => {
        const file = event.target.files?.[0]
        if (!file) return
        if (!file.type.startsWith("image/")) {
            toast.error("Please choose an image file.")
        } else if (file.size > MAX_SIZE_MB * 1024 * 1024) {
            toast.error(`Image must be smaller than ${MAX_SIZE_MB} MB.`)
        } else {
            setImage(file)
        }
        event.target.value = "" // lets the same file be picked again later
    }

    return (
        <div className="mb-6 flex justify-center">
            <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                ref={inputRef}
                className="hidden"
            />
            {!image ? (
                <div className="relative flex h-20 w-20 items-center justify-center rounded-full bg-purple-100">
                    <User className="text-purple-500" size={35} />
                    <button
                        type="button"
                        aria-label="Upload profile photo"
                        onClick={() => inputRef.current?.click()}
                        className="absolute -bottom-1 -right-1 flex h-7 w-7 items-center justify-center rounded-full bg-purple-500 text-white"
                    >
                        <Upload size={15} />
                    </button>
                </div>
            ) : (
                <div className="relative">
                    <img src={previewUrl} alt="Profile preview" className="h-20 w-20 rounded-full object-cover" />
                    <button
                        type="button"
                        aria-label="Remove profile photo"
                        onClick={() => setImage(null)}
                        className="absolute -bottom-1 -right-1 flex h-8 w-8 items-center justify-center rounded-full bg-red-800 text-white"
                    >
                        <Trash size={15} />
                    </button>
                </div>
            )}
        </div>
    )
}

export default ProfilePhotoSelector