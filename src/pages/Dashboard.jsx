import { useEffect, useState, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Breadcrumbs from './Breadcrumbs';
import FileItem from './FileItem';
import FolderItem from './FolderItem';
import CreateFolderButton from "./CreateFolderButton";
import api from '../api';
import toast, { Toaster } from "react-hot-toast";

export default function Dashboard(){

    const [items, setItems] = useState([]);
    const [path, setPath] = useState(["My Drive"]);
    const [uploading, setUploading] = useState(false);
    const [progress, setProgress] = useState(0);
    const [isDragActive, setIsDragActive] = useState(false);

    const navigate = useNavigate();
    const fileInputRef = useRef(null);

    useEffect(() => {
        const fetchData = async () => {
            try{
                const token = localStorage.getItem("token");

                if( !token ){
                    navigate("/login");
                    console.log("Token no");
                    return;
                }

                const res = await api.get("/folders", {
                    headers: { Authorization: `Bearer ${token}`}
                });

                const folders = (res.data.folders || []).map(f => ({ ...f, type: "folder" }));
                const files = (res.data.files || []).map(f => ({ ...f, type: "file" }));


                setItems([...folders, ...files]);
            }   catch(error){
                console.log(error);
            }
        };
        fetchData();
    }, [navigate]);

    const handleNavigate = (index) => {

        setPath(path.slice(0, index + 1));

    }

    const onDrop = useCallback((acceptedFiles) => {
        const file = acceptedFiles[0];
        if( !file ) return;

        uploadFile(file);
        setIsDragActive(false);
    }, []);

    const uploadFile = async (file) => {
        try{
            setUploading(true);
            setProgress(0);

            const token = localStorage.getItem("token");
            const formData = new FormData();
            formData.append("file", file);

            const res = await api.post("/files/upload", formData, {
                headers: { Authorization: `Bearer ${token}`},
                onUploadProgress: (e) => 
                    setProgress(Math.round((e.loaded * 100) / e.total))
            });

            toast.success("File uploaded successfully!");

            const uploadedFile = {
                id: res.data.file.id,
                name: res.data.file.name,
                type: "file",
                path: res.data.file.path
            };
            setItems((prev) => [uploadedFile, ...prev]);

        }   catch(error){
            console.error(err);
            toast.error("Upload failed");
        }   finally{
            setUploading(false);
            setProgress(0);
        }
    };

    return (
        <div className="flex h-screen relative">
            <Toaster position="top-right" />
            <div className="w-64 bg-gray-100 border-r p-4">
                <h2 className="text-lg font-bold">Perplexity Drive</h2>
            </div>

            <div className="flex-1 flex flex-col">
                <div className="flex items-center justify-between p-4 border-b">
                    <Breadcrumbs path={path} onNavigate={handleNavigate} />
                    <div className="space-x-2">
                        <button 
                            className="px-3 py-1 bg-blue-600 text-white rounded-md"
                            onClick={() => fileInputRef.current?.click()}
                        >
                            Upload
                        </button>

                        <CreateFolderButton
                            currentFolderId={path.length > 1 ? path[path.length - 1] : null}
                            onFolderCreated={(newFolder) => setItems((prev) => [newFolder, ...prev])}
                        />

                        <input 
                            type="file" 
                            ref={fileInputRef}
                            className="hidden"
                            onChange={(e) => onDrop(Array.from(e.target.files))}
                        />
                    </div>
                </div>

                <div 
                    className="p-4 grid grid-cols-4 gap-4"
                >

                    <div className={`col-span-4 border-2 border-dashed rounded-md p-6 text-center transition
                        ${isDragActive ? "border-blue-500 bg-blue-50" : "border-gray-300 bg-gray-100"}`}
                        onDragOver={(e) => {
                        e.preventDefault();
                        setIsDragActive(true);
                        }}
                        onDragLeave={() => setIsDragActive(false)}
                        onDrop={(e) => {
                            e.preventDefault();
                            const files = Array.from(e.dataTransfer.files);
                            onDrop(files);
                        }}
                    >
                        <p className="text-gray-600">
                            {isDragActive
                                ? "Drop files here..."
                                : "Drag & drop files here"
                            }
                        </p>
                        {uploading && 
                            <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                                <div 
                                    className="bg-blue-600 h-2 rounded-full"
                                    style={{width: `${progress}%`}}
                                >
                                </div>
                            </div>
                        }
                    </div>

                    {items && items.map(item => (
                        item.type === "folder" ? (
                            <FolderItem
                                key={item.id}
                                folder={item}
                                onRename={(id, newName) => {
                                    setItems(prev =>
                                        prev.map(f => 
                                            f.id === id ? {...f, name: newName} : f
                                        )
                                    );
                                }}
                                onDelete={(id) => {
                                    setItems(prev => prev.filter(f => f.id !== id ));
                                }}
                            />
                        ) : (
                            <FileItem 
                                key={item.id} 
                                file={item} 
                                onOpenFolder={(folderId) => setPath([...path, folderId])}
                                onRename={(id, newName) => {
                                    setItems(prev => 
                                        prev.map(f=> f.id === id ? { ...f, name: newName } : f)
                                    );
                                }}
                                onDelete={(id) => {
                                    setItems(prev => prev.filter(f => f.id !== id ));
                                }}
                            />
                        )
                    ))}
                </div>
            </div>
        </div>
    );
}