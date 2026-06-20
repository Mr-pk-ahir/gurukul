import { useNavigate } from "react-router-dom";
import Background from "../../components/ui/Background";

export default function Unauthorized() {
  const navigate = useNavigate();

  return (
    <Background>
      <div className="text-center p-8 max-w-md bg-white border border-red-200 rounded-2xl shadow-xl flex flex-col items-center">
        {/* લાલ કલરનું વોર્નિંગ આઇકોન (SVG) */}
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
          <svg className="w-10 h-10 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>

        <h1 className="text-2xl font-black text-red-600 mb-2">ઍક્સેસ નામંજૂર (403)</h1>
        <p className="text-gray-600 mb-6">
          તમારી પાસે આ પેજ જોવાની પરવાનગી નથી. કૃપા કરીને પહેલા લોગીન કરો.
        </p>

        {/* લોગીન પેજ પર જવા માટેનું બટન */}
        <button
          onClick={() => navigate("/login")}
          className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-2.5 px-4 rounded-xl transition duration-200 shadow-md shadow-red-200"
        >
          લોગીન પેજ પર જાઓ
        </button>
      </div>
    </Background>
  );
}