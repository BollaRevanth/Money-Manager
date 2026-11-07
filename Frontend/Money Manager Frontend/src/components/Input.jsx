import {useId, useState} from "react"
import {Eye, EyeOff} from "lucide-react"

const FIELD_CLASS =
    "w-full bg-transparent outline-none border border-gray-300 rounded-md py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:border-blue-500"

const Input = ({
                   label,
                   value,
                   onChange,
                   placeholder,
                   type = "text",
                   isSelect = false,
                   options = [],
                   ...inputProps
               }) => {
    const [showPassword, setShowPassword] = useState(false)
    const id = useId()

    return (
        <div className="mb-4">
            <label htmlFor={id} className="mb-1 block text-[13px] text-slate-800">
                {label}
            </label>
            <div className="relative">
                {isSelect ? (
                    <select id={id} value={value ?? ""} onChange={onChange} className={FIELD_CLASS} {...inputProps}>
                        {options.map((option) => (
                            <option key={option.value} value={option.value}>
                                {option.label}
                            </option>
                        ))}
                    </select>
                ) : (
                    <input
                        id={id}
                        className={`${FIELD_CLASS} ${type === "password" ? "pr-10" : ""}`}
                        type={type === "password" && showPassword ? "text" : type}
                        placeholder={placeholder}
                        value={value ?? ""}
                        onChange={onChange}
                        {...inputProps}
                    />
                )}
                {type === "password" && (
                    <button
                        type="button"
                        onClick={() => setShowPassword((visible) => !visible)}
                        aria-label={showPassword ? "Hide password" : "Show password"}
                        className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer"
                    >
                        {showPassword ? (
                            <Eye size={20} className="text-primary" />
                        ) : (
                            <EyeOff size={20} className="text-slate-400" />
                        )}
                    </button>
                )}
            </div>
        </div>
    )
}

export default Input