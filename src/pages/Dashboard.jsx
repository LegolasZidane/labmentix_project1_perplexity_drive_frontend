import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Breadcrumbs from './Breadcrumbs';
import api from '../api';

export default function Dashboard(){

    const [items, setItems] = useState([]);
    const [path, setPath] = useState(["My Drive"]);
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

    return (
        <div className="flex h-screen">

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

                <div className="p-4 grid grid-cols-4 gap-4">
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