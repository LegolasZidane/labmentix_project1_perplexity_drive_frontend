export default function DragDropArea({ isDragActive, setIsDragActive, onDrop, uploading, progress }){

    return(

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
    );

}