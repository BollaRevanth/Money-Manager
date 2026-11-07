import {ArrowRight} from "lucide-react"
import moment from "moment"
import TransactionInfoCard from "./TransactionInfoCard.jsx"

const Transactions = ({transactions = [], onMore, type, title}) => (
    <div className="card">
        <div className="flex items-center justify-between">
            <h5 className="text-lg">{title}</h5>
            <button type="button" className="card-btn" onClick={onMore}>
                More <ArrowRight className="text-base" size={15} />
            </button>
        </div>
        <div className="mt-6">
            {transactions.length === 0 ? (
                <p className="text-sm text-gray-500">No transactions yet.</p>
            ) : (
                transactions.slice(0, 5).map((item) => {
                    const itemType = item.type ?? type
                    return (
                        <TransactionInfoCard
                            key={`${itemType}-${item.id}`}
                            title={item.name}
                            icon={item.icon}
                            date={moment(item.date).format("Do MMM YYYY")}
                            amount={item.amount}
                            type={itemType}
                            hideDeleteBtn
                        />
                    )
                })
            )}
        </div>
    </div>
)

export default Transactions