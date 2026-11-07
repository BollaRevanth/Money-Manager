import {API_ENDPOINTS, CLOUDINARY_UPLOAD_PRESET} from "./apiEndpoints.jsx"

const uploadProfileImage = async (image) => {
    const formData = new FormData()
    formData.append("file", image)
    formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET)

    const response = await fetch(API_ENDPOINTS.UPLOAD_IMAGE, {method: "POST", body: formData})
    const data = await response.json().catch(() => ({}))
    if (!response.ok) {
        throw new Error(`Image upload failed: ${data?.error?.message || response.statusText}`)
    }
    return data.secure_url
}

export default uploadProfileImage