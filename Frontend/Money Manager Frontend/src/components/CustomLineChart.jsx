import {Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis} from "recharts"
import {addThousandsSeparator} from "../util/util.js"

const CustomTooltip = ({active, payload, label}) => {
    if (!active || !payload?.length) return null
    const {totalAmount, items} = payload[0].payload

    const byCategory = items.reduce((acc, {categoryName, amount}) => {
        const key = categoryName ?? "Other"
        acc[key] = (acc[key] ?? 0) + Number(amount)
        return acc
    }, {})

    return (
        <div className="chart-tooltip">
            <p className="chart-tooltip-date">{label}</p>
            <p className="chart-tooltip-total">Total: ₹{addThousandsSeparator(totalAmount)}</p>
            <div className="chart-tooltip-details">
                {Object.entries(byCategory).map(([name, total]) => (
                    <div key={name} className="chart-tooltip-detail">
                        <span>{name}</span>
                        <span>₹{addThousandsSeparator(total)}</span>
                    </div>
                ))}
            </div>
        </div>
    )
}

const CustomLineChart = ({data}) => {
    if (!data.length) {
        return <div className="chart-empty">No transactions to chart yet.</div>
    }

    return (
        <div className="bg-white">
            <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={data}>
                    <defs>
                        <linearGradient id="amountGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#875cf5" stopOpacity={0.4} />
                            <stop offset="95%" stopColor="#875cf5" stopOpacity={0} />
                        </linearGradient>
                    </defs>
                    <CartesianGrid stroke="none" />
                    <XAxis dataKey="month" tick={{fontSize: 12, fill: "#555"}} stroke="none" />
                    <YAxis
                        tick={{fontSize: 12, fill: "#555"}}
                        stroke="none"
                        tickFormatter={(value) => addThousandsSeparator(value)}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Area
                        type="monotone"
                        dataKey="totalAmount"
                        stroke="#875cf5"
                        fill="url(#amountGradient)"
                        strokeWidth={3}
                        dot={{r: 3, fill: "#ab8df8"}}
                    />
                </AreaChart>
            </ResponsiveContainer>
        </div>
    )
}

export default CustomLineChart