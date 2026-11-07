import {useState} from "react"
import {LoaderCircle} from "lucide-react"
import EmojiPickerPopup from "./EmojiPickerPopup.jsx"
import Input from "./Input.jsx"
import {todayISO} from "../util/util.js"

const toFormState = (data) => ({
    id: data?.id,
    name: data?.name ?? "",
    amount: data?.amount ?? "",
    date: data?.date ?? todayISO(),
    icon: data?.icon ?? "",
    categoryId: data?.categoryId ?? "",
})

const TransactionForm = ({
                             categories,
                             onSubmit,
                             initialData = null,
                             entityLabel,
                             sourceLabel,
                             namePlaceholder,
                         }) => {
    const [form, setForm] = useState(() => toFormState(initialData))
    const [saving, setSaving] = useState(false)
    const isEditing = initialData !== null

    const categoryOptions = [
        {value: "", label: "Select a category"},
        ...categories.map((category) => ({value: category.id, label: category.name})),
    ]

    const handleChange = (key, value) => setForm((current) => ({...current, [key]: value}))

    const handleSubmit = async (event) => {
        event.preventDefault()
        setSaving(true)
        try {
            await onSubmit(form)
        } finally {
            setSaving(false)
        }
    }

    return (
        <form onSubmit={handleSubmit}>
            <EmojiPickerPopup icon={form.icon} onSelect={(icon) => handleChange("icon", icon)} />
            <Input
                value={form.name}
                onChange={(e) => handleChange("name", e.target.value)}
                label={sourceLabel}
                placeholder={namePlaceholder}
                type="text"
                maxLength={100}
            />
            <Input
                label="Category"
                value={form.categoryId}
                onChange={(e) => handleChange("categoryId", e.target.value)}
                isSelect
                options={categoryOptions}
            />
            {categories.length === 0 && (
                <p className="-mt-2 mb-4 text-sm text-amber-700">
                    You have no {entityLabel.toLowerCase()} categories yet. Add one on the Category page first.
                </p>
            )}
            <Input
                value={form.amount}
                onChange={(e) => handleChange("amount", e.target.value)}
                label="Amount"
                placeholder="e.g., 500.00"
                type="number"
                min="0"
                step="0.01"
            />
            <Input
                value={form.date}
                onChange={(e) => handleChange("date", e.target.value)}
                label="Date"
                type="date"
                max={todayISO()}
            />
            <div className="mt-6 flex justify-end">
                <button type="submit" disabled={saving} className="add-btn add-btn-fill">
                    {saving ? (
                        <>
                            <LoaderCircle className="h-4 w-4 animate-spin" />
                            {isEditing ? "Updating..." : "Adding..."}
                        </>
                    ) : (
                        `${isEditing ? "Update" : "Add"} ${entityLabel}`
                    )}
                </button>
            </div>
        </form>
    )
}

export default TransactionForm