import {useState} from "react"
import {Download, LoaderCircle, Mail} from "lucide-react"
import moment from "moment"
import TransactionInfoCard from "./TransactionInfoCard.jsx"

const TransactionList = ({title, type, transactions, onDelete, onEdit, onDownload, onEmail}) => {
    const [busy, setBusy] = useState(null) // "email" | "download" | null

    const run = async (action, handler) => {
        setBusy(action)
        try {
            await handler()
        } finally {
            setBusy(null)
        }
    }

    return (
        <div className="card">
            <div className="flex items-center justify-between">
                <h5 className="text-lg">{title}</h5>
                <div className="flex items-center justify-end gap-2">
                    <button
                        type="button"
                        className="card-btn"
                        disabled={busy !== null}
                        onClick={() => run("email", onEmail)}
                    >
                        {busy === "email" ? (
                            <>
                                <LoaderCircle className="h-4 w-4 animate-spin" />
                                Emailing...
                            </>
                        ) : (
                            <>
                                <Mail size={15} />
                                Email
                            </>
                        )}
                    </button>
                    <button
                        type="button"
                        className="card-btn"
                        disabled={busy !== null}
                        onClick={() => run("download", onDownload)}
                    >
                        {busy === "download" ? (
                            <>
                                <LoaderCircle className="h-4 w-4 animate-spin" />
                                Downloading...
                            </>
                        ) : (
                            <>
                                <Download size={15} />
                                Download
                            </>
                        )}
                    </button>
                </div>
            </div>

            {transactions.length === 0 ? (
                <p className="mt-6 text-sm text-gray-500">
                    No {type} recorded this month. Use Filters to see earlier months.
                </p>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2">
                    {transactions.map((item) => (
                        <TransactionInfoCard
                            key={item.id}
                            title={item.name}
                            icon={item.icon}
                            date={moment(item.date).format("Do MMM YYYY")}
                            amount={item.amount}
                            type={type}
                            onDelete={() => onDelete(item.id)}
                            onEdit={() => onEdit(item)}
                        />
                    ))}
                </div>
            )}
        </div>
    )
}

export default TransactionList