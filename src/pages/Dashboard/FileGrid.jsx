import FileItem from '../FileItem';
import FolderItem from '../FolderItem';

export default function FileGrid({ items, setItems, path, setPath }){

    return (
        <>
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
        </>
    );
}