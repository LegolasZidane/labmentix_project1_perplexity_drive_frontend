import Breadcrumbs from '../Breadcrumbs';
import CreateFolderButton from '../CreateFolderButton';

export default function Toolbar({ path, onNavigate, fileInputRef, onDrop, setItems }){

    return (
        <div className="flex items-center justify-between p-4 border-b">
            <Breadcrumbs path={path} onNavigate={onNavigate} />
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
    );
}