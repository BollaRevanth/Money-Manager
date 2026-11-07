import {Coins, Pencil, Trash2, TrendingDown, TrendingUp, Wallet} from "lucide-react"
import {addThousandsSeparator} from "../util/util.js"

const TransactionInfoCard = ({icon, title, date, amount, type, hideDeleteBtn, onDelete, onEdit}) => {
    const isIncome = type === "income"
    const FallbackIcon = isIncome ? Wallet : Coins

    return (
        <div className="group relative mt-2 flex items-center gap-4 rounded-lg p-3 hover:bg-gray-100/60">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-gray-100 text-xl text-gray-800">
                {icon ? (
                    <img src={icon} alt={title} className="h-6 w-6" />
                ) : (
                    <FallbackIcon className="text-purple-700" />
                )}
            </div>
            <div className="flex min-w-0 flex-1 items-center justify-between gap-2">
                <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-gray-700">{title}</p>
                    <p className="mt-1 text-xs text-gray-400">{date}</p>
                </div>
                <div className="flex shrink-0 items-center gap-2">
                    {onEdit && (
                        <button
                            type="button"
                            onClick={onEdit}
                            aria-label={`Edit ${title}`}
                            className="cursor-pointer text-gray-400 transition-opacity hover:text-blue-500 lg:opacity-0 lg:group-hover:opacity-100"
                        >
                            <Pencil size={18} />
                        </button>
                    )}
                    {!hideDeleteBtn && (
                        <button
                            type="button"
                            onClick={onDelete}
                            aria-label={`Delete ${title}`}
                            className="cursor-pointer text-gray-400 transition-opacity hover:text-red-800 lg:opacity-0 lg:group-hover:opacity-100"
                        >
                            <Trash2 size={18} />
                        </button>
                    )}
                    <div
                        className={`flex items-center gap-2 rounded-md px-3 py-1.5 ${
                            isIncome ? "bg-green-50 text-green-800" : "bg-red-50 text-red-800"
                        }`}
                    >
                        <h6 className="text-xs font-medium">
                            {isIncome ? "+" : "-"} ₹{addThousandsSeparator(amount)}
                        </h6>
                        {isIncome ? <TrendingUp size={15} /> : <TrendingDown size={15} />}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default TransactionInfoCard