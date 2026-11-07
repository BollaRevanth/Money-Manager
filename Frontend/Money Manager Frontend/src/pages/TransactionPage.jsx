import {useCallback, useEffect, useState} from "react"
import moment from "moment"
import {toast} from "react-toastify"
import axiosConfig from "../util/axiosConfig.jsx"
import {API_ENDPOINTS} from "../util/apiEndpoints.jsx"
import {TRANSACTION_CONFIG} from "../util/transactionConfig.js"
import {downloadBlob, getErrorMessage, todayISO} from "../util/util.js"
import Modal from "../components/Modal.jsx"
import DeleteAlert from "../components/DeleteAlert.jsx"
import TransactionOverview from "../components/TransactionOverview.jsx"
import TransactionList from "../components/TransactionList.jsx"
import TransactionForm from "../components/TransactionForm.jsx"

const validateTransaction = ({name, amount, date, categoryId}) => {
    if (!name.trim()) return "Please enter a name"
    if (!amount || isNaN(amount) || Number(amount) <= 0) return "Amount must be a positive number"
    if (!date) return "Please enter a date"
    if (date > todayISO()) return "Date cannot be in the future"
    if (!categoryId) return "Please select a category"
    return null
}

const toPayload = ({name, amount, date, icon, categoryId}) => ({
    name: name.trim(),
    amount: Number(amount),
    date,
    icon,
    categoryId: Number(categoryId),
})

const notifySaved = (message, date) => {
    toast.success(message)
    if (!moment(date).isSame(moment(), "month")) {
        toast.info("This entry is dated outside the current month, so it only appears under Filters.")
    }
}

const TransactionPage = ({type}) => {
    const config = TRANSACTION_CONFIG[type]
    const {endpoints} = config

    const [transactions, setTransactions] = useState([])
    const [categories, setCategories] = useState([])
    const [showAddModal, setShowAddModal] = useState(false)
    const [itemToEdit, setItemToEdit] = useState(null)
    const [idToDelete, setIdToDelete] = useState(null)

    const fetchTransactions = useCallback(async () => {
        try {
            const {data} = await axiosConfig.get(endpoints.list)
            setTransactions(data)
        } catch (error) {
            toast.error(getErrorMessage(error, `Failed to fetch ${type} details`))
        }
    }, [endpoints, type])

    useEffect(() => {
        fetchTransactions()
        axiosConfig
            .get(API_ENDPOINTS.CATEGORY_BY_TYPE(type))
            .then(({data}) => setCategories(data))
            .catch((error) => toast.error(getErrorMessage(error, `Failed to fetch ${type} categories`)))
    }, [fetchTransactions, type])

    const handleAdd = async (form) => {
        const problem = validateTransaction(form)
        if (problem) {
            toast.error(problem)
            return
        }
        try {
            await axiosConfig.post(endpoints.add, toPayload(form))
            setShowAddModal(false)
            await fetchTransactions()
            notifySaved(`${config.label} added successfully`, form.date)
        } catch (error) {
            toast.error(getErrorMessage(error, `Failed to add ${type}`))
        }
    }

    const handleUpdate = async (form) => {
        const problem = validateTransaction(form)
        if (problem) {
            toast.error(problem)
            return
        }
        try {
            await axiosConfig.put(endpoints.update(form.id), toPayload(form))
            setItemToEdit(null)
            await fetchTransactions()
            notifySaved(`${config.label} updated successfully`, form.date)
        } catch (error) {
            toast.error(getErrorMessage(error, `Failed to update ${type}`))
        }
    }

    const handleDelete = async () => {
        try {
            await axiosConfig.delete(endpoints.remove(idToDelete))
            await fetchTransactions()
            toast.success(`${config.label} deleted successfully`)
        } catch (error) {
            toast.error(getErrorMessage(error, `Failed to delete ${type}`))
        } finally {
            setIdToDelete(null)
        }
    }

    const handleDownload = async () => {
        try {
            const response = await axiosConfig.get(endpoints.download, {responseType: "blob"})
            downloadBlob(response.data, config.downloadName)
            toast.success(`${config.label} details downloaded successfully`)
        } catch (error) {
            toast.error(getErrorMessage(error, `Failed to download ${type} details`))
        }
    }

    const handleEmail = async () => {
        try {
            await axiosConfig.get(endpoints.email)
            toast.success(`${config.label} details sent to your email`)
        } catch (error) {
            toast.error(getErrorMessage(error, `Failed to email ${type} details`))
        }
    }

    const formProps = {
        categories,
        entityLabel: config.label,
        sourceLabel: config.sourceLabel,
        namePlaceholder: config.namePlaceholder,
    }

    return (
        <div className="my-5 mx-auto">
            <div className="grid grid-cols-1 gap-6">
                <TransactionOverview
                    title={config.overviewTitle}
                    subtitle={config.overviewSubtitle}
                    addLabel={`Add ${config.label}`}
                    onAdd={() => setShowAddModal(true)}
                    transactions={transactions}
                />
                <TransactionList
                    title={config.listTitle}
                    type={type}
                    transactions={transactions}
                    onDelete={setIdToDelete}
                    onEdit={setItemToEdit}
                    onDownload={handleDownload}
                    onEmail={handleEmail}
                />
            </div>

            <Modal isOpen={showAddModal} onClose={() => setShowAddModal(false)} title={`Add ${config.label}`}>
                <TransactionForm {...formProps} onSubmit={handleAdd} />
            </Modal>

            <Modal isOpen={itemToEdit !== null} onClose={() => setItemToEdit(null)} title={`Update ${config.label}`}>
                <TransactionForm {...formProps} onSubmit={handleUpdate} initialData={itemToEdit} />
            </Modal>

            <Modal isOpen={idToDelete !== null} onClose={() => setIdToDelete(null)} title={`Delete ${config.label}`}>
                <DeleteAlert
                    content={`Are you sure you want to delete this ${type} entry?`}
                    onDelete={handleDelete}
                />
            </Modal>
        </div>
    )
}

export default TransactionPage