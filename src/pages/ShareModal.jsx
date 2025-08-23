import { Dialog } from "@headlessui/react";
import { Copy } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import api from "../api.js";

export default function ShareModal({ isOpen, onClose, file }){
    
    const [email, setEmail] = useState("");
    const [link, setLink] = useState("");
    const [permission, setPermission] = useState("viewer");

    const copyLink = () => {

        if( !link ) return;
        navigator.clipboard.writeText(link);
        toast.success("Link copied!");
    };

    const sendInvite = async() => {
        
        try{

            const token = localStorage.getItem("token");

            const res = await api.post(
                `/shared/${file.id}/share`,
                {
                    shared_with: email,
                    permission: permission
                },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            setLink(res.data.shareableLink);
            toast.success(`File shared with ${email} as ${permission}`);
            setEmail("");

        }   catch(err){
            console.error(err);
            toast.error("Failed to share file");
        }   
    };

    return (
        <Dialog open={isOpen} onClose={onClose} className="relative z-50">
            <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
            <div className="fixed inset-0 flex items-center justify-center">
                <div className="bg-white rounded-xl shadow-lg p-6 w-96">
                    <h2 className="text-lg font-semibold mb-4">Share "{file.name}"</h2>

                    <div className="mb-4">
                        <label className="block text-sm mb-1">Invite by Email / User ID</label>
                        <input 
                            type="text"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full border rounded-md px-3 py-2"
                            placeholder="Enter email or user id"
                        />

                        <select 
                            value={permission}
                            onChange={(e) => setPermission(e.target.value)}
                            className="mt-2 w-full border rounded-md px-3 py-2"
                        >
                            <option value="viewer">Viewer (read-only)</option>
                            <option value="editor">Editor (can edit)</option>
                        </select>

                        <button
                            onClick={sendInvite}
                            className="mt-2 px-3 py-1 bg-blue-600 text-white rounded-md"
                        >
                            Send Invite
                        </button>
                    </div>

                    {link && (
                        <div className="border-t pt-3">
                            <label className="block text-sm mb-1">Shareable Link</label>
                            <div className="flex items-center gap-2">
                                <input 
                                    type="text" 
                                    readOnly
                                    value={link}
                                    className="flex-1 border rounded-md px-2 py-1 text-sm"
                                />
                                <button
                                    onClick={copyLink}
                                    className="px-2 py-1 border rounded-md hover:bg-gray-100"
                                >
                                    <Copy size={16} />
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </Dialog>
    );
};