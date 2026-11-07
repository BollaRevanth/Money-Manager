import {useContext, useEffect} from "react"
import {useNavigate} from "react-router-dom"
import {toast} from "react-toastify"
import {AppContext} from "../context/AppContext.jsx"
import axiosConfig from "../util/axiosConfig.jsx"
import {API_ENDPOINTS} from "../util/apiEndpoints.jsx"
import {getErrorMessage} from "../util/util.js"

export const useUser = () => {
    const {user, setUser, clearUserDetails} = useContext(AppContext)
    const navigate = useNavigate()

    useEffect(() => {
        if (user || !localStorage.getItem("token")) return undefined

        let isMounted = true
        axiosConfig
            .get(API_ENDPOINTS.GET_USER_INFO)
            .then(({data}) => {
                if (isMounted && data) setUser(data)
            })
            .catch((error) => {
                if (!isMounted) return
                if (error.response?.status === 401) {
                    localStorage.removeItem("token")
                } else {
                    toast.error(getErrorMessage(error, "Could not load your profile."))
                }
                clearUserDetails()
                navigate("/home", {replace: true})
            })

        return () => {
            isMounted = false
        }
    }, [user, setUser, clearUserDetails, navigate])

    return {user}
}
