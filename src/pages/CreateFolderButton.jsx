import { useState } from "react";
import api from "../api";
import toast from "react-hot-toast";

export default function CreateFolderButton({ currentFolderId, onFolderCreated }){

    const [loading, setLoading] = useState(false);

    const handleCreateFolder = async () => {

        try{
            setLoading(true);
            const token = localStorage.getItem("token");

            const res = await api.post("/folders/", 
                {
                    name: "Untitled Folder",
                    parent_folder_id: currentFolderId || null
                },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            const newFolder = { ...res.data.folder, type: "folder" };
            onFolderCreated(newFolder);
            toast.success("Folder Created!");

        }   catch(error){
            console.error(err);
            toast.error("Failed to create folder");
        }   finally{
            setLoading(false);
        }
    };

    return (
        <button
            className="px-3 py-1 bg-green-600 text-white rounded-md disabled:opacity-50"
            onClick={handleCreateFolder}
            disabled={loading}
        >
            {loading ? "Creating..." : "New Folder" }
        </button>
    );
}