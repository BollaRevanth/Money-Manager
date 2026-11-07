import {useState} from "react"
import {LoaderCircle} from "lucide-react"
import Input from "./Input.jsx"
import EmojiPickerPopup from "./EmojiPickerPopup.jsx"

const EMPTY_CATEGORY = {name: "", type: "income", icon: ""}

const CATEGORY_TYPES = [
    {value: "income", label: "Income"},
    {value: "expense", label: "Expense"},
]

const AddCategoryForm = ({onAddCategory, initialCategoryData = null, isEditing = false}) => {
    const [category, setCategory] = useState(() =>
        isEditing && initialCategoryData ? initialCategoryData : EMPTY_CATEGORY,
    )
    const [loading, setLoading] = useState(false)

    const handleChange = (key, value) => setCategory((current) => ({...current, [key]: value}))

    const handleSubmit = async (event) => {
        event.preventDefault()
        setLoading(true)
        try {
            await onAddCategory(category)
        } finally {
            setLoading(false)
        }
    }

    return (
        <form className="p-4" onSubmit={handleSubmit}>
            <EmojiPickerPopup icon={category.icon} onSelect={(icon) => handleChange("icon", icon)} />
            <Input
                value={category.name}
                onChange={(e) => handleChange("name", e.target.value)}
                label="Category Name"
                placeholder="e.g., Freelance, Salary, Groceries"
                type="text"
                maxLength={100}
            />
            <Input
                label="Category Type"
                value={category.type}
                onChange={(e) => handleChange("type", e.target.value)}
                isSelect
                options={CATEGORY_TYPES}
            />
            <div className="mt-6 flex justify-end">
                <button type="submit" disabled={loading} className="add-btn add-btn-fill">
                    {loading ? (
                        <>
                            <LoaderCircle className="h-4 w-4 animate-spin" />
                            {isEditing ? "Updating..." : "Adding..."}
                        </>
                    ) : isEditing ? (
                        "Update Category"
                    ) : (
                        "Add Category"
                    )}
                </button>
            </div>
        </form>
    )
}

export default AddCategoryForm