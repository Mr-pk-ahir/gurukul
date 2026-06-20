
export default function Dashboard() {
    const data = localStorage.getItem("user");
    return (
        <div className="w-full h-full rounded-2xl p-3 transition-colors duration-300 bg-gray-900 text-gray-50 border-gray-800">
            <div className="w-full flex justify-between p-1 items-center bg-amber-200">
                <h2 className="text-2xl font-bold mb-4">{data ? JSON.parse(data).username : "Guest"}</h2>
                <div className="px-3 py-1 rounded-lg bg-gray-800 text-gray-300 text-sm font-medium">
                    
                </div>
            </div>
        </div>
    )
}
