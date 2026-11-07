import CustomPieChart from "./CustomPieChart.jsx"
import {addThousandsSeparator} from "../util/util.js"

const COLORS = ["#016630", "#a0090e"] // income green, expense red

const FinanceOverview = ({totalBalance, monthIncome, monthExpense}) => {
    const data = [
        {name: "Income (this month)", amount: monthIncome},
        {name: "Expense (this month)", amount: monthExpense},
    ]
    const hasData = monthIncome > 0 || monthExpense > 0
    const balanceText = `${totalBalance < 0 ? "-" : ""}₹${addThousandsSeparator(Math.abs(totalBalance))}`

    return (
        <div className="card">
            <div className="flex items-center justify-between">
                <h5 className="text-lg">Financial Overview</h5>
            </div>
            {hasData ? (
                <CustomPieChart
                    data={data}
                    label="Total Balance"
                    totalAmount={balanceText}
                    colors={COLORS}
                    showTextAnchor
                />
            ) : (
                <div className="chart-empty">No income or expense recorded this month yet.</div>
            )}
        </div>
    )
}

export default FinanceOverview