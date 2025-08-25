import { useState } from "react";
import ShareModal from "./ShareModal";
import { Share2, Download, Trash2, Folder, File, Pencil, Check, X } from "lucide-react";
import api from "../api";
import toast from "react-hot-toast";

export default function FileItem({ file, onOpenFolder, onRename, onDelete, isTrashView }){

    const [isShareOpen, setIsShareOpen] = useState(false);
    const [isRenaming, setIsRenaming] = useState(false);
    const [newName, setNewName] = useState(file.name);

    const isFolder = file.type === "folder";

    const handleSoftDelete = async () => {

        try{
            
            const token = localStorage.getItem("token");
            await api.patch(
                "/files/delete",
                { fileId: file.id },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            toast.success("File moved to trash!");
            onDelete(file.id);
        }   catch(err){
            console.error(err?.response?.data || err);
            toast.error(err?.response?.data?.error || "Delete failed");
        }
    };

    const handleHardDelete = async () => {

        try{

            const token = localStorage.getItem("token");
            await api.delete(
                "/files/hard-delete",
                { fileId: file.id },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            toast.success("File permanently deleted!");
            onDelete(file.id);
        }   catch(err){
            console.error(err?.response?.data || err);
            toast.error(err?.response?.data?.error || "Hard delete failed");
        }
    };

    const handleRename = async () => {

        if( !newName.trim() || newName === file.name ){
            setIsRenaming(false);
            return;
        }

        try{
            const token = localStorage.getItem("token");
            const res = await api.patch(
                "/files/rename",
                { fileId: file.id, newName: newName.trim() },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            toast.success("File renamed!");
            setIsRenaming(false);
            onRename(file.id, res.data.file.name);
        }   catch(err){
            console.error(err?.response?.data || err);
            toast.error(err?.response?.data?.error || "Rename failed");
        }
    };

    return (
        <div className="border rounded-lg p-3 flex justify-between items-center hover:bg-gray-50">
            <div 
                className={`flex items-center gap-2 cursor-${isFolder ? "pointer" : "default"}`}
                onClick={() => isFolder && onOpenFolder(file.id)}
            >
                {isFolder ? <Folder size={18} /> : <File size={18} />}
                {isRenaming ? (
                    <input
                        value={newName}
                        onChange={(e) => setNewName(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && handleRename()}
                        className="border p-1 rounded"
                        autoFocus
                    />
                ) : (
                    <span className="font-medium">{file.name}</span>
                )}
            </div>

            <div className="flex gap-2">
                {isRenaming ? (
                    <>
                        <button 
                            onClick={handleRename}
                            className="p-1 hover:text-green-600"
                        >
                            <Check size={18} />
                        </button>
                        <button
                            onClick={() => {
                                setIsRenaming(false);
                                setNewName(file.name);
                            }}
                            className="p-1 hover:text-red-600"
                        >
                            <X size={18} />
                        </button>
                    </>
                ) : (
                    <>
                        {!isTrashView ? (
                            <>
                                <button
                                    onClick={() => setIsRenaming(true)}
                                    className="p-1 hover:text-blue-600"
                                >
                                    <Pencil size={18} />
                                </button>
                                {!isFolder && (
                                    <button 
                                        onClick={() => setIsShareOpen(true)}
                                        className="p-1 hover:text-blue-600"
                                    >
                                        <Share2 size={18} />
                                    </button>
                                )}
                                <button
                                    onClick={handleSoftDelete}
                                    className="p-1 hover:text-red-600"
                                >
                                    <Trash2 size={18} />
                                </button>
                            </>
                        ) : (
                            <>
                                <button
                                    onClick={handleHardDelete}
                                    className="p-1 hover:text-red-600"
                                >
                                    <Trash2 size={18} />
                                </button>
                            </>
                        )}
                    </>
                )}
            </div>

            {isShareOpen && (
                <ShareModal 
                    isOpen={isShareOpen}
                    onClose={() => setIsShareOpen(false)}
                    file={file}
                />
            )}
        </div>
    );
}