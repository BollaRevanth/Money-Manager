import {useMemo, useState} from "react"
import {RotateCcw, Search} from "lucide-react"
import moment from "moment"
import {toast} from "react-toastify"
import TransactionInfoCard from "../components/TransactionInfoCard.jsx"
import axiosConfig from "../util/axiosConfig.jsx"
import {API_ENDPOINTS} from "../util/apiEndpoints.jsx"
import {addThousandsSeparator, getErrorMessage} from "../util/util.js"

const EMPTY_FILTERS = {
    type: "income",
    startDate: "",
    endDate: "",
    keyword: "",
    sortField: "date",
    sortOrder: "asc",
}

const FIELD = "w-full border rounded px-3 py-2"
const LABEL = "block text-sm font-medium mb-1"

const Filter = () => {
    const [filters, setFilters] = useState(EMPTY_FILTERS)
    const [results, setResults] = useState({type: "income", items: []})
    const [hasSearched, setHasSearched] = useState(false)
    const [loading, setLoading] = useState(false)

    const update = (key) => (event) => setFilters((current) => ({...current, [key]: event.target.value}))

    const total = useMemo(
        () => results.items.reduce((sum, item) => sum + Number(item.amount), 0),
        [results],
    )

    const handleSearch = async (event) => {
        event.preventDefault()
        if (filters.startDate && filters.endDate && filters.startDate > filters.endDate) {
            toast.error("Start date cannot be after the end date")
            return
        }
        setLoading(true)
        try {
            const {data} = await axiosConfig.post(API_ENDPOINTS.APPLY_FILTERS, {
                ...filters,
                startDate: filters.startDate || null,
                endDate: filters.endDate || null,
            })
            setResults({type: filters.type, items: data})
            setHasSearched(true)
        } catch (error) {
            toast.error(getErrorMessage(error, "Failed to fetch transactions. Please try again"))
        } finally {
            setLoading(false)
        }
    }

    const handleReset = () => {
        setFilters(EMPTY_FILTERS)
        setResults({type: "income", items: []})
        setHasSearched(false)
    }

    return (
        <div className="my-5 mx-auto">
            <div className="mb-4 flex items-center justify-between">
                <h2 className="text-2xl font-semibold">Filter Transactions</h2>
            </div>

            <div className="card mb-4 p-4">
                <div className="mb-4 flex items-center justify-between">
                    <h5 className="text-lg font-semibold">Select the filters</h5>
                    <button type="button" onClick={handleReset} className="card-btn">
                        <RotateCcw size={15} />
                        Reset
                    </button>
                </div>
                <form onSubmit={handleSearch} className="grid grid-cols-1 gap-4 sm:grid-cols-3 md:grid-cols-6">
                    <div>
                        <label htmlFor="type" className={LABEL}>Type</label>
                        <select id="type" value={filters.type} onChange={update("type")} className={FIELD}>
                            <option value="income">Income</option>
                            <option value="expense">Expense</option>
                        </select>
                    </div>
                    <div>
                        <label htmlFor="startdate" className={LABEL}>Start Date</label>
                        <input id="startdate" type="date" value={filters.startDate} onChange={update("startDate")} className={FIELD} />
                    </div>
                    <div>
                        <label htmlFor="enddate" className={LABEL}>End Date</label>
                        <input id="enddate" type="date" value={filters.endDate} onChange={update("endDate")} className={FIELD} />
                    </div>
                    <div>
                        <label htmlFor="sortfield" className={LABEL}>Sort By</label>
                        <select id="sortfield" value={filters.sortField} onChange={update("sortField")} className={FIELD}>
                            <option value="date">Date</option>
                            <option value="amount">Amount</option>
                            <option value="name">Name</option>
                        </select>
                    </div>
                    <div>
                        <label htmlFor="sortorder" className={LABEL}>Sort Order</label>
                        <select id="sortorder" value={filters.sortOrder} onChange={update("sortOrder")} className={FIELD}>
                            <option value="asc">Ascending</option>
                            <option value="desc">Descending</option>
                        </select>
                    </div>
                    <div className="flex items-end sm:col-span-2 md:col-span-1">
                        <div className="w-full">
                            <label htmlFor="keyword" className={LABEL}>Search</label>
                            <input
                                id="keyword"
                                type="text"
                                placeholder="Search..."
                                value={filters.keyword}
                                onChange={update("keyword")}
                                className={FIELD}
                            />
                        </div>
                        <button
                            type="submit"
                            aria-label="Apply filters"
                            disabled={loading}
                            className="mb-1 ml-2 flex cursor-pointer items-center justify-center rounded bg-purple-800 p-2 text-white hover:bg-purple-900 disabled:opacity-60"
                        >
                            <Search size={20} />
                        </button>
                    </div>
                </form>
            </div>

            <div className="card p-4">
                <div className="mb-4 flex items-center justify-between">
                    <h5 className="text-lg font-semibold">Transactions</h5>
                    {results.items.length > 0 && (
                        <p className="text-sm text-gray-500">
                            {results.items.length} found · Total ₹{addThousandsSeparator(total)}
                        </p>
                    )}
                </div>

                {loading && <p className="text-gray-500">Loading transactions...</p>}
                {!loading && !hasSearched && (
                    <p className="text-gray-500">Select the filters and click search to see transactions.</p>
                )}
                {!loading && hasSearched && results.items.length === 0 && (
                    <p className="text-gray-500">No transactions found for these filters.</p>
                )}

                {!loading &&
                    results.items.map((item) => (
                        <TransactionInfoCard
                            key={item.id}
                            title={item.name}
                            icon={item.icon}
                            date={moment(item.date).format("Do MMM YYYY")}
                            amount={item.amount}
                            type={results.type}
                            hideDeleteBtn
                        />
                    ))}
            </div>
        </div>
    )
}

export default Filter