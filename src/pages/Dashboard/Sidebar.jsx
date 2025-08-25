export default function Sidebar({ onLogout }){

    return (
        <div className="w-64 bg-gray-100 border-r p-4">
                <div>
                    <h2 className="text-lg font-bold">Perplexity Drive</h2>
                </div>

                <div className="mt-4">
                    <button
                        onClick={onLogout}
                        className="w-full px-3 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
                    >
                        Logout
                    </button>
                </div>
            </div>
    );
}