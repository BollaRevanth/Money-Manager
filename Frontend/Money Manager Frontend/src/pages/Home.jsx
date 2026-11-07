import {useEffect, useState} from "react"
import {useNavigate} from "react-router-dom"
import {Coins, Wallet, WalletCards} from "lucide-react"
import {toast} from "react-toastify"
import InfoCard from "../components/InfoCard.jsx"
import FinanceOverview from "../components/FinanceOverview.jsx"
import Transactions from "../components/Transactions.jsx"
import axiosConfig from "../util/axiosConfig.jsx"
import {API_ENDPOINTS} from "../util/apiEndpoints.jsx"
import {addThousandsSeparator, getErrorMessage} from "../util/util.js"

const Home = () => {
    const navigate = useNavigate()
    const [dashboardData, setDashboardData] = useState(null)

    useEffect(() => {
        let isMounted = true
        axiosConfig
            .get(API_ENDPOINTS.DASHBOARD_DATA)
            .then(({data}) => {
                if (isMounted) setDashboardData(data)
            })
            .catch((error) => {
                if (isMounted) toast.error(getErrorMessage(error, "Failed to load the dashboard."))
            })
        return () => {
            isMounted = false
        }
    }, [])

    const totalBalance = dashboardData?.totalBalance || 0
    const monthIncome = dashboardData?.monthIncome || 0
    const monthExpense = dashboardData?.monthExpense || 0

    return (
        <div className="my-5 mx-auto">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                <InfoCard
                    icon={<WalletCards />}
                    label="Total Balance"
                    value={addThousandsSeparator(totalBalance)}
                    color="bg-purple-800"
                />
                <InfoCard
                    icon={<Wallet />}
                    label="This Month's Income"
                    value={addThousandsSeparator(monthIncome)}
                    color="bg-green-800"
                />
                <InfoCard
                    icon={<Coins />}
                    label="This Month's Expense"
                    value={addThousandsSeparator(monthExpense)}
                    color="bg-red-800"
                />
            </div>

            <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2">
                <Transactions
                    title="Recent Transactions"
                    transactions={dashboardData?.recentTransactions}
                    onMore={() => navigate("/filter")}
                />
                <FinanceOverview
                    totalBalance={totalBalance}
                    monthIncome={monthIncome}
                    monthExpense={monthExpense}
                />
                <Transactions
                    title="Recent Expenses"
                    type="expense"
                    transactions={dashboardData?.recent5Expenses}
                    onMore={() => navigate("/expense")}
                />
                <Transactions
                    title="Recent Incomes"
                    type="income"
                    transactions={dashboardData?.recent5Incomes}
                    onMore={() => navigate("/income")}
                />
            </div>
        </div>
    )
}

export default Home