import {LayoutList, Pencil, Trash2} from "lucide-react";

const CategoryList = ({categories,onEditCategory,onDeleteCategory}) => {
    return (
        <div className="card p-4">
            <div className="flex items-center justify-between mb-4">
                <h4 className="text-lg font-semibold">Category Sources</h4>
            </div>

            {/* Category List */}
            {categories.length === 0 ? (
                <p className="text-gray-500">No categories added yet. Add some to get started! </p>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    {categories.map((category) => (
                        <div
                            key={category.id}
                            className="group relative flex items-center gap-4 p-3 rounded-lg hover:bg-gray-200">
                            {/* Icon/Emoji display */}
                            <div className="w-12 h-12 shrink-0 flex items-center justify-center text-xl text-gray-800 bg-gray-100 rounded-full">
                                {category.icon ? (
                                    <span className="text-2xl">
                                        <img className="h-5 w-5" src={category.icon} alt={category.name}/>
                                    </span>
                                ) : (
                                    <LayoutList className="text-primary" size={24} />
                                )}
                            </div>

                            {/* Category name and type */}
                            <div className="min-w-0 flex-1">
                                <p className="text-sm text-gray-700 font-medium truncate">
                                    {category.name}
                                </p>
                                <p className="text-sm text-gray-400 font-medium mt-1 capitalize truncate">
                                    {category.type}
                                </p>
                            </div>

                            {/* Action buttons */}
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => onEditCategory(category)}
                                    aria-label={`Edit ${category.name}`}
                                    className="text-gray-400 hover:text-blue-500 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity cursor-pointer">
                                    <Pencil size={18}/>
                                </button>
                                <button
                                    onClick={() => onDeleteCategory(category)}
                                    aria-label={`Delete ${category.name}`}
                                    className="text-gray-400 hover:text-red-500 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity cursor-pointer">
                                    <Trash2 size={18}/>
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}
export default CategoryList