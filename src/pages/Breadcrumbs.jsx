export default function Breadcrumbs({ path, onNavigate }){

    return (
        <div className="flex items-center space-x-2 text-sm text-gray-600">
            {path.map((crumb, i) => (
                <span
                    key={i}
                    onClick={() => onNavigate(i)}
                    className="cursor-pointer hover:underline"
                >
                    {crumb}
                </span>
            ))}
        </div>
    );
}