import {useCallback, useEffect, useState} from "react"
import {Plus} from "lucide-react"
import {toast} from "react-toastify"
import CategoryList from "../components/CategoryList.jsx"
import Modal from "../components/Modal.jsx"
import AddCategoryForm from "../components/AddCategoryForm.jsx"
import DeleteAlert from "../components/DeleteAlert.jsx"
import axiosConfig from "../util/axiosConfig.jsx"
import {API_ENDPOINTS} from "../util/apiEndpoints.jsx"
import {getErrorMessage} from "../util/util.js"

const CLOSED_FORM = {open: false, category: null}

const Category = () => {
    const [categories, setCategories] = useState([])
    const [formModal, setFormModal] = useState(CLOSED_FORM)
    const [categoryToDelete, setCategoryToDelete] = useState(null)

    const fetchCategories = useCallback(async () => {
        try {
            const {data} = await axiosConfig.get(API_ENDPOINTS.GET_ALL_CATEGORIES)
            setCategories(data)
        } catch (error) {
            toast.error(getErrorMessage(error, "Failed to load categories"))
        }
    }, [])

    useEffect(() => {
        fetchCategories()
    }, [fetchCategories])

    const handleSave = async (form) => {
        const name = form.name.trim()
        if (!name) {
            toast.error("Category name is required")
            return
        }

        const editingId = formModal.category?.id
        const isDuplicate = categories.some(
            (c) => c.id !== editingId && c.name.toLowerCase() === name.toLowerCase(),
        )
        if (isDuplicate) {
            toast.error("Category name already exists")
            return
        }

        const payload = {name, type: form.type, icon: form.icon}
        try {
            if (editingId) {
                await axiosConfig.put(API_ENDPOINTS.UPDATE_CATEGORY(editingId), payload)
                toast.success("Category updated successfully")
            } else {
                await axiosConfig.post(API_ENDPOINTS.ADD_CATEGORY, payload)
                toast.success("Category added successfully")
            }
            setFormModal(CLOSED_FORM)
            await fetchCategories()
        } catch (error) {
            toast.error(getErrorMessage(error, "Failed to save category"))
        }
    }

    const confirmDelete = async () => {
        try {
            await axiosConfig.delete(API_ENDPOINTS.DELETE_CATEGORY(categoryToDelete.id))
            toast.success("Category deleted successfully")
            await fetchCategories()
        } catch (error) {
            toast.error(getErrorMessage(error, "Failed to delete category"))
        } finally {
            setCategoryToDelete(null)
        }
    }

    const isEditing = formModal.category !== null

    return (
        <div className="my-5 mx-auto">
            <div className="mb-5 flex items-center justify-between">
                <h2 className="text-2xl font-semibold">All Categories</h2>
                <button
                    type="button"
                    onClick={() => setFormModal({open: true, category: null})}
                    className="add-btn flex items-center gap-1"
                >
                    <Plus size={17} />
                    Add Category
                </button>
            </div>

            <CategoryList
                categories={categories}
                onEditCategory={(category) => setFormModal({open: true, category})}
                onDeleteCategory={setCategoryToDelete}
            />

            <Modal
                title={isEditing ? "Update Category" : "Add Category"}
                isOpen={formModal.open}
                onClose={() => setFormModal(CLOSED_FORM)}
            >
                <AddCategoryForm
                    onAddCategory={handleSave}
                    initialCategoryData={formModal.category}
                    isEditing={isEditing}
                />
            </Modal>

            <Modal
                title="Delete Category"
                isOpen={categoryToDelete !== null}
                onClose={() => setCategoryToDelete(null)}
            >
                <DeleteAlert
                    content={`Are you sure you want to delete "${categoryToDelete?.name ?? ""}"? This can't be undone.`}
                    onDelete={confirmDelete}
                />
            </Modal>
        </div>
    )
}

export default Category