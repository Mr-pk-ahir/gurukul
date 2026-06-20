import Logo from "../../assets/gurukul.png"

export default function SidebarHeader() {
    return (
        <div className="flex items-center gap-3 px-4 py-2">
            <img 
                src={Logo} 
                alt="Gurukul Logo" 
                className="w-11 h-11 object-contain drop-shadow-sm" 
            />
            <div>
                <h2 className="font-extrabold text-gray-900 leading-tight text-lg">
                    Gurukul
                </h2>
            </div>
        </div>
    );
}