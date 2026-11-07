import {Image, X} from "lucide-react";
import {useState} from "react";
import EmojiPicker from "emoji-picker-react";

const EmojiPickerPopup = ({icon, onSelect}) =>{
    const[isOpen, setIsOpen] = useState(false);
    const handleEmojiClick = (emoji) => {
        onSelect(emoji?.imageUrl || "");
        setIsOpen(false);
    }

    return (
        <div className="relative flex flex-col md:flex-row items-start gap-5 mb-6">
            <div
                onClick={() => setIsOpen(true)}
                className="flex items-center gap-4 cursor-pointer">
                <div className="relative w-12 h-12 flex items-center justify-center text-2xl bg-purple-50 text-purple-500 rounded-lg">
                    {icon ? (
                        <img src={icon} alt="Icon" className="h-12 w-12" />
                    ) : (
                        <Image/>
                    )}
                    {icon && (
                        <button
                            type="button"
                            aria-label="Remove selected emoji"
                            title="Remove emoji"
                            onClick={(event) => {
                                event.stopPropagation();
                                onSelect("");
                            }}
                            className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full border-2 border-white bg-red-500 text-white shadow-sm transition-colors hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-300"
                        >
                            <X size={12} strokeWidth={3} />
                        </button>
                    )}
                </div>
                <p>{icon ? "Change icon" : "Pick icon"}</p>
            </div>

                {isOpen && (
                    <>
                        <button
                            type="button"
                            aria-label="Close emoji picker"
                            onClick={() => setIsOpen(false)}
                            className="fixed inset-0 z-40 cursor-default bg-black/10"
                        />
                        <div className="fixed left-1/2 top-1/2 z-50 flex max-h-[min(80vh,560px)] w-[min(92vw,420px)] -translate-x-1/2 -translate-y-1/2 flex-col overflow-hidden rounded-xl border border-gray-200 bg-white shadow-2xl">
                            <div className="flex shrink-0 items-center justify-between border-b border-gray-100 px-4 py-3">
                                <p className="font-medium text-gray-800">Choose an icon</p>
                                <button
                                    type="button"
                                    aria-label="Close emoji picker"
                                    onClick={() => setIsOpen(false)}
                                    className="flex h-8 w-8 items-center justify-center rounded-full text-gray-500 hover:bg-gray-100 hover:text-gray-800 focus:outline-none focus:ring-2 focus:ring-purple-400"
                                >
                                    <X size={18} />
                                </button>
                            </div>
                            <div className="min-h-0 overflow-y-auto">
                                <EmojiPicker
                                    open={isOpen}
                                    onEmojiClick={handleEmojiClick}
                                    width="100%"
                                    height="min(480px, 65vh)"
                                />
                            </div>
                        </div>
                    </>
                )}
        </div>
    )
}
export default EmojiPickerPopup;
