import {useMemo} from "react"
import {Plus} from "lucide-react"
import CustomLineChart from "./CustomLineChart.jsx"
import {prepareLineChartData} from "../util/util.js"

const TransactionOverview = ({title, subtitle, addLabel, onAdd, transactions}) => {
    const chartData = useMemo(() => prepareLineChartData(transactions), [transactions])

    return (
        <div className="card">
            <div className="flex items-center justify-between gap-3">
                <div>
                    <h5 className="text-lg">{title}</h5>
                    <p className="mt-0.5 text-xs text-gray-500">{subtitle}</p>
                </div>
                <button type="button" className="add-btn" onClick={onAdd}>
                    <Plus size={15} className="text-lg" />
                    {addLabel}
                </button>
            </div>
            <div className="mt-10">
                <CustomLineChart data={chartData} />
            </div>
        </div>
    )
}

export default TransactionOverview