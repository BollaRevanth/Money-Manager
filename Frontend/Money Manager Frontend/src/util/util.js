import moment from "moment"

const numberFormatter = new Intl.NumberFormat("en-IN", {maximumFractionDigits: 2})

// 1234567.5 -> "12,34,567.5" (Indian grouping, handles negatives)
export const addThousandsSeparator = (num) => {
    if (num == null || num === "" || isNaN(num)) return ""
    return numberFormatter.format(Number(num))
}

// Local calendar date as YYYY-MM-DD (toISOString() would give the UTC date)
export const todayISO = () => moment().format("YYYY-MM-DD")

export const prepareLineChartData = (data = []) => {
    const groupedByDate = data.reduce((acc, item) => {
        const entry = acc[item.date] ?? (acc[item.date] = {date: item.date, totalAmount: 0, items: []})
        entry.totalAmount += Number(item.amount) || 0
        entry.items.push(item)
        return acc
    }, {})

    return Object.values(groupedByDate)
        .sort((a, b) => a.date.localeCompare(b.date))
        .map((point) => ({
            ...point,
            totalAmount: Math.round(point.totalAmount * 100) / 100,
            month: moment(point.date).format("Do MMM"),
        }))
}

// Works with the backend's {error, message} bodies and with network failures.
export const getErrorMessage = (error, fallback = "Something went wrong. Please try again.") => {
    const data = error?.response?.data
    if (data) {
        if (typeof data === "string" && data.trim() && data.length < 200) return data
        if (data.message || data.error) return data.message || data.error
    }
    if (error?.code === "ERR_NETWORK") return "Cannot reach the server. Please check your connection and try again."
    if (error?.code === "ECONNABORTED") return "The server took too long to respond. Please try again."
    return error?.response ? fallback : error?.message || fallback
}

export const downloadBlob = (blob, filename) => {
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.download = filename
    document.body.appendChild(link)
    link.click()
    link.remove()
    window.URL.revokeObjectURL(url)
}