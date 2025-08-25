import { useEffect, useState, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from './Sidebar';
import Toolbar from './Toolbar';
import DragDropArea from './DragDropArea';
import FileGrid from './FileGrid';
import api from '../../api';
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

    const handleLogout = async () => {
        
        try{

            const token = localStorage.getItem("token");
            await api.post("/auth/logout", {}, {
                headers: { Authorization: `Bearer ${token}` }
            });

            localStorage.removeItem("token");
            toast.success("Logged out successfully!");
            navigate("/login");

        } catch(error){
            console.error(error);
            toast.error("Logout failed!");
        }
    };

    return (
        <div className="flex h-screen relative">
            <Toaster position="top-right" />

            <Sidebar onLogout={handleLogout} />

            <div className="flex-1 flex flex-col">
                <Toolbar
                    path={path}
                    onNavigate={handleNavigate}
                    fileInputRef={fileInputRef}
                    onDrop={onDrop}
                    setItems={setItems}
                />

                <div className="p-4 grid grid-cols-4 gap-4">
                    <DragDropArea
                        isDragActive={isDragActive}
                        setIsDragActive={setIsDragActive}
                        onDrop={onDrop}
                        uploading={uploading}
                        progress={progress}
                    />

                    <FileGrid
                        items={items}
                        setItems={setItems}
                        path={path}
                        setPath={setPath}
                    />
                </div>
            </div>
        </div>
    );
}