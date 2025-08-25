import { useEffect, useState } from "react";
import FileItem from "../components/FileItem";
import FolderItem from "../components/FolderItem";
import api from "../api";
import toast, { Toaster } from "react-hot-toast";

export default function Trash(){

    const [items, setItems] = useState([]);

    useEffect(() => {
        const fetchTrash = async () => {
            try{
                const token = localStorage.getItem("token");
                const res = await api.get("")
            }
        }
    });
}