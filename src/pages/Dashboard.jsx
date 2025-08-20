import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import Breadcrumbs from './Breadcrumbs';
import api from '../api';
import toast, { Toaster } from "react-hot-toast";

export default function Dashboard(){

    const [items, setItems] = useState([]);
    const [path, setPath] = useState(["My Drive"]);
    const [uploading, setUploading] = useState(false);
    const [progress, setProgress] = useState(0);
    const [preview, setPreview] = useState(null);

    const navigate = useNavigate();

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
                setItems([...(res.data.folders || []), ...(res.data.files || [])]);
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

        if( 
            file.type.startsWith("image/") || 
            file.type === "application/pdf" ||
            file.type.startsWith("text/")
        ) {
            setPreview(URL.createObjectURL(file));
        }

        uploadFile(file);
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
            setPreview(null);
        }
    };

    return (
        <div className="flex h-screen relative">
            <Toaster />
            <div className="w-64 bg-gray-100 border-r p-4">
                <h2 className="text-lg font-bold">Perplexity Drive</h2>
            </div>

            <div className="flex-1 flex flex-col">
                <div className="flex items-center justify-between p-4 border-b">
                    <Breadcrumbs path={path} onNavigate={handleNavigate} />
                    <div className="space-x-2">
                        <button className="px-3 py-1 bg-blue-600 text-white rounded-md">
                            Upload
                        </button>
                    </div>
                </div>

                <div 
                    className="p-4 grid grid-cols-4 gap-4"
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={(e) => {
                        e.preventDefault();
                        const files = Array.from(e.dataTransfer.files);
                        onDrop(files);
                    }}
                >

                    {preview && (
                        <div className="col-span-4 border-2 border-dashed border-blue-400 p-4 rounded-md text-center">
                            {preview.endsWith(".pdf") ? (
                                    <embed src={preview} type="application/pdf" width="100%" height="150px" />
                                ) : preview.startsWith("blob:") && preview.includes("image") ? (
                                    <img src={preview} alt="preview" className="mx-auto max-h-40" />
                                ) : (
                                    <p className="text-sm text-gray-600">Preview not supported for this file</p>
                            )}
                            {uploading && <p className="mt-2">Uploading... {progress}%</p>}
                        </div>
                    )}

                    {items && items.map(item => (
                        <div key={item.id} className="border rounded-lg p-4 hover:shadow cursor-pointer">
                            <p className="font-medium">
                                {item.type === "folder" ? "📁" : "📄"} {item.name}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}