import { useState } from "react";
import api from "../api";
import toast from "react-hot-toast";
import { Pencil, Trash2, Check } from "lucide-react";

export default function FolderItem({ folder, onRename, onDelete }){

    const [isRenaming, setIsRenaming] = useState(false);
    const [newName, setNewName] = useState(folder.name);

    const handleRename = async () => {
        try{
            const token = localStorage.getItem("token");
            const res = await api.patch(`/folders/${folder.id}`,
                { name: newName.trim() },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            toast.success("Folder renamed!");
            setIsRenaming(false);
            onRename(folder.id, newName.trim());
        }   catch(err){
            console.error(err?.response?.data || err);
            toast.error(err?.response?.data?.error || "Rename failed");
        }
    };

    const handleDelete = async () => {
        try{
            const token = localStorage.getItem("token");
            await api.delete(`/folders/${folder.id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });

            toast.success("Folder deleted!");
            onDelete(folder.id);
        }   catch(err){
            console.error(err?.response?.data || err);
            toast.error(err?.response?.data?.error || "Delete failed");
        }
    };

    return (
        <div className="flex items-center justify-between p-2 border rounded">
            {isRenaming ? (
                <input
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    className="border p-1"
                    autoFocus
                />
            ) : (
                <span>{folder.name}</span>
            )}

            <div className="flex gap-2">
                {isRenaming ? (
                    <button onClick={handleRename} className="hover:text-green-600">
                        <Check size={16} />
                    </button>
                ) : (
                    <button onClick={() => setIsRenaming(true)} className="hover:text-blue-600">
                        <Pencil size={16} />
                    </button>
                )}
                <button onClick={handleDelete} className="hover:text-red-600">
                    <Trash2 size={16} />
                </button>
            </div>
        </div>
    );
}