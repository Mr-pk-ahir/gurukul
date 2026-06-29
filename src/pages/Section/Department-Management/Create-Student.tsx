import React, { useState } from 'react';
import { useTheme } from '../../../components/theme/ThemeContext';
import DatePicker from '../../../components/common/Calendar';
import { 
  Camera, 
  User, 
  Hash, 
  Lock, 
  Calendar, 
  BookOpen,
  ImagePlus,
  Eye,
  EyeOff
} from 'lucide-react';


const CreateStudent = () => {
  const { theme } = useTheme(); 
  
  // State for form fields
  const [formData, setFormData] = useState({
    suid: '', 
    fullName: '',
    birthdate: new Date().toISOString().split('T')[0],
    joiningDate: new Date().toISOString().split('T')[0],
    username: '',
    password: '',
  });

  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [showPassword, setShowPassword] = useState(false); 
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleDateChange = (fieldName: string, dateStr: string) => {
    setFormData(prev => ({ ...prev, [fieldName]: dateStr }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setProfileImage(imageUrl);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith('image/')) {
      const imageUrl = URL.createObjectURL(file);
      setProfileImage(imageUrl);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    console.log("Student Data Submitted: ", formData);
    setTimeout(() => setLoading(false), 1000); // Mock API call
  };

  const inputWrapperClasses = "relative group transition-all duration-300";
  const inputClasses = `w-full border rounded-xl py-3 pl-11 pr-4 focus:outline-none transition-all duration-500 ease-out transform group-hover:-translate-y-1 focus-within:-translate-y-1 ${
    theme 
      ? "bg-[#1f2937]/80 border-gray-700/60 text-white placeholder-gray-500 group-hover:border-blue-500/50 group-hover:bg-[#1f2937] group-hover:shadow-[0_8px_20px_-5px_rgba(59,130,246,0.15)] focus:border-blue-500 focus:bg-[#1f2937] focus:shadow-[0_8px_25px_-5px_rgba(59,130,246,0.2)] focus:ring-2 focus:ring-blue-500/20"
      : "bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400 group-hover:border-red-400/60 group-hover:bg-white group-hover:shadow-[0_8px_20px_-5px_rgba(239,68,68,0.1)] focus:border-red-500 focus:bg-white focus:shadow-[0_8px_25px_-5px_rgba(239,68,68,0.15)] focus:ring-2 focus:ring-red-500/10" 
  }`;
  
  const iconClasses = `absolute left-3.5 top-1/2 -translate-y-1/2 transition-colors duration-500 z-10 ${
    theme 
      ? "text-gray-500 group-focus-within:text-blue-400 group-hover:text-blue-400" 
      : "text-slate-400 group-focus-within:text-red-500 group-hover:text-red-500"
  }`;

  return (
    // 🎯 Main Premium Card Wrapper (max-w-7xl થી Create User જેવું જ અલાઇનમેન્ટ રહેશે)
    <div className={`group/maincard max-w-7xl mx-auto p-6 sm:p-8 rounded-3xl mt-6 mb-8 border transition-all duration-700 hover:-translate-y-1 relative overflow-hidden font-sans backdrop-blur-xl ${
      theme 
        ? "bg-[#111827]/90 border-gray-800 hover:border-blue-900/50 shadow-[0_8px_30px_rgb(0,0,0,0.5)] hover:shadow-[0_15px_45px_-15px_rgba(59,130,246,0.15)] text-gray-200"
        : "bg-white/90 border-slate-100 hover:border-red-100 shadow-[0_8px_30px_rgb(0,0,0,0.03)] hover:shadow-[0_15px_45px_-15px_rgba(239,68,68,0.1)] text-slate-800" 
    }`}>
      
      {/* Background Glowing Orbs */}
      <div className={`absolute -top-32 -right-32 w-80 h-80 rounded-full blur-[90px] pointer-events-none transition-all duration-1000 group-hover/maincard:scale-110 ${
        theme ? "bg-blue-600/10 group-hover/maincard:bg-blue-600/15" : "bg-red-500/5 group-hover/maincard:bg-red-500/10"
      }`}></div>
      <div className={`absolute -bottom-32 -left-32 w-80 h-80 rounded-full blur-[90px] pointer-events-none transition-all duration-1000 group-hover/maincard:scale-110 ${
        theme ? "bg-purple-600/10 group-hover/maincard:bg-purple-600/15" : "bg-rose-500/5 group-hover/maincard:bg-rose-500/10"
      }`}></div>

      {/* ===== 1. Centered Premium Header ===== */}
      <div className={`mb-10 pb-6 border-b flex flex-col items-center text-center gap-3 relative z-10 transition-colors duration-500 ${
        theme ? "border-gray-800 group-hover/maincard:border-gray-700" : "border-slate-100 group-hover/maincard:border-slate-200"
      }`}>
        <div className={`w-16 h-16 text-white rounded-2xl shadow-lg flex items-center justify-center mb-1 transition-all duration-700 transform group-hover/maincard:scale-110 ${
          theme
            ? "bg-linear-to-tr from-blue-600 via-indigo-500 to-purple-500 shadow-[0_8px_25px_-5px_rgba(59,130,246,0.5)] group-hover/maincard:shadow-[0_12px_35px_-5px_rgba(59,130,246,0.7)]"
            : "bg-linear-to-tr from-red-600 via-rose-500 to-orange-400 shadow-[0_8px_25px_-5px_rgba(239,68,68,0.4)] group-hover/maincard:shadow-[0_12px_35px_-5px_rgba(239,68,68,0.6)]"
        }`}>
          <BookOpen size={30} className="drop-shadow-lg" />
        </div>
        
        <h1 className={`text-3xl sm:text-4xl font-black text-transparent bg-clip-text bg-linear-to-r tracking-tight transition-all duration-500 ${
          theme 
            ? "from-white via-blue-100 to-gray-400 group-hover/maincard:to-blue-300" 
            : "from-slate-900 via-slate-800 to-slate-500 group-hover/maincard:to-red-600"
        }`}>
          Create Student Profile
        </h1>
        <p className={`text-sm sm:text-base font-medium tracking-wide max-w-md transition-colors duration-300 ${
          theme ? "text-gray-400" : "text-slate-500"
        }`}>
          Provide the required details to enroll a new student into the system.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="relative z-10 space-y-10">
        
        {/* ===== 2. Premium Image Upload ===== */}
        <div className="flex flex-col items-center justify-center mb-6">
          <div 
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`relative group w-40 h-40 rounded-4xl border-2 border-dashed flex items-center justify-center overflow-hidden transition-all duration-500 ease-out transform hover:-translate-y-1.5 hover:scale-[1.02] cursor-pointer ${
              isDragging 
                ? theme 
                  ? 'border-blue-500 bg-blue-500/10 scale-105 shadow-[0_0_35px_rgba(59,130,246,0.3)]' 
                  : 'border-red-500 bg-red-500/10 scale-105 shadow-[0_0_35px_rgba(239,68,68,0.2)]'
                : theme 
                  ? 'border-gray-600 bg-[#1f2937]/50 hover:border-blue-400 hover:bg-blue-900/20 shadow-[0_8px_25px_rgba(0,0,0,0.3)] hover:shadow-[0_15px_40px_rgba(59,130,246,0.25)]'
                  : 'border-slate-300 bg-slate-50 hover:border-red-400 hover:bg-red-50 shadow-[0_8px_25px_rgba(0,0,0,0.04)] hover:shadow-[0_15px_40px_rgba(239,68,68,0.15)]' 
            }`}
          >
            {profileImage ? (
              <img src={profileImage} alt="Profile" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
            ) : (
              <div className={`flex flex-col items-center justify-center transition-all duration-500 transform group-hover:scale-105 ${
                theme ? "text-gray-500 group-hover:text-blue-400" : "text-slate-400 group-hover:text-red-500"
              }`}>
                <ImagePlus size={38} className="mb-2 drop-shadow-sm" />
              </div>
            )}

            <div className="absolute inset-0 bg-black/40 backdrop-blur-xs flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500 z-10 pointer-events-none">
              <Camera size={28} className="text-white mb-1.5 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]" />
              <span className="text-white text-xs font-black tracking-widest drop-shadow-md">UPLOAD</span>
            </div>

            <input 
              type="file" 
              accept="image/*"
              onChange={handleImageUpload}
              className="absolute inset-0 opacity-0 z-20 cursor-pointer"
              title="Click or Drag & Drop an image here"
            />
          </div>
          <span className={`text-sm mt-4 font-bold tracking-widest uppercase transition-colors duration-300 ${
            theme ? "text-gray-500" : "text-slate-400"
          }`}>
            {isDragging ? 'Drop it like it\'s hot! ' : 'Profile Photo'}
          </span>
        </div>

        {/* ===== 3. Form Sections (Perfectly Aligned in Grid) ===== */}
        <div className="space-y-8">
          
          {/* --- IDENTITY SECTION --- */}
          <div className="relative">
            <h2 className={`text-sm font-black uppercase tracking-[0.2em] mb-5 flex items-center gap-2.5 transition-colors ${
              theme ? "text-gray-400" : "text-slate-500"
            }`}>
              <span className={`p-1.5 rounded-lg transition-colors duration-300 ${theme ? "bg-blue-500/10 text-blue-400" : "bg-red-500/10 text-red-500"}`}>
                <User size={16} /> 
              </span>
              Identity Details
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex flex-col gap-2">
                <label className={`text-sm font-semibold tracking-wide transition-colors ${theme ? "text-gray-300" : "text-slate-700"}`}>
                  Student ID (SUID) <span className="text-red-500">*</span>
                </label>
                <div className={inputWrapperClasses}>
                  <Hash size={20} className={iconClasses} />
                  <input 
                    type="text" name="suid" value={formData.suid} onChange={handleInputChange} placeholder="Enter SUID" required
                    className={inputClasses}
                  />
                </div>
              </div>
              
              <div className="flex flex-col gap-2">
                <label className={`text-sm font-semibold tracking-wide transition-colors ${theme ? "text-gray-300" : "text-slate-700"}`}>
                  Full Name <span className="text-red-500">*</span>
                </label>
                <div className={inputWrapperClasses}>
                  <User size={20} className={iconClasses} />
                  <input 
                    type="text" name="fullName" value={formData.fullName} onChange={handleInputChange} placeholder="Enter full name" required
                    className={inputClasses}
                  />
                </div>
              </div>
            </div>
          </div>
          {/* --- IMPORTANT DATES --- */}
          <div className="relative z-50"> {/* 👈 અહિયાં z-50 એડ કરવામાં આવ્યું છે જેથી કેલેન્ડર પાછળ ના જાય */}
            <h2 className={`text-sm font-black uppercase tracking-[0.2em] mb-5 flex items-center gap-2.5 transition-colors ${
              theme ? "text-gray-400" : "text-slate-500"
            }`}>
              <span className={`p-1.5 rounded-lg transition-colors duration-300 ${theme ? "bg-blue-500/10 text-blue-400" : "bg-red-500/10 text-red-500"}`}>
                <Calendar size={16} /> 
              </span>
              Important Dates
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 group/dates">
              <div className="transition-all duration-300 hover:-translate-y-1">
                <DatePicker 
                  label="Birthdate (BOD)"
                  selectedValue={formData.birthdate}
                  onChange={(dateStr) => handleDateChange('birthdate', dateStr)}
                  required
                />
              </div>
              <div className="transition-all duration-300 hover:-translate-y-1">
                <DatePicker 
                  label="Joining Date"
                  selectedValue={formData.joiningDate}
                  onChange={(dateStr) => handleDateChange('joiningDate', dateStr)}
                  required
                />
              </div>
            </div>
          </div>
          {/* --- CREDENTIALS SECTION --- */}
          <div className="relative">
            <h2 className={`text-sm font-black uppercase tracking-[0.2em] mb-5 flex items-center gap-2.5 transition-colors ${
              theme ? "text-gray-400" : "text-slate-500"
            }`}>
              <span className={`p-1.5 rounded-lg transition-colors duration-300 ${theme ? "bg-blue-500/10 text-blue-400" : "bg-red-500/10 text-red-500"}`}>
                <Lock size={16} /> 
              </span>
              Account Credentials
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex flex-col gap-2">
                <label className={`text-sm font-semibold tracking-wide transition-colors ${theme ? "text-gray-300" : "text-slate-700"}`}>
                  Username <span className="text-red-500">*</span>
                </label>
                <div className={inputWrapperClasses}>
                  <User size={20} className={iconClasses} />
                  <input 
                    type="text" name="username" value={formData.username} onChange={handleInputChange} placeholder="Ex :  Username-123" required
                    className={inputClasses}
                  />
                </div>
              </div>
              
              <div className="flex flex-col gap-2">
                <label className={`text-sm font-semibold tracking-wide transition-colors ${theme ? "text-gray-300" : "text-slate-700"}`}>
                  Password <span className="text-red-500">*</span>
                </label>
                <div className={inputWrapperClasses}>
                  <Lock size={20} className={iconClasses} />
                  <input 
                    type={showPassword ? "text" : "password"} 
                    name="password" 
                    value={formData.password} 
                    onChange={handleInputChange} 
                    placeholder="••••••••" 
                    required
                    className={`${inputClasses} pr-12`} 
                  />
                  {/* Password Toggle Button */}
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className={`absolute right-3.5 top-1/2 -translate-y-1/2 transition-colors z-20 ${
                      theme ? "text-gray-400 hover:text-blue-400" : "text-slate-400 hover:text-red-500"
                    }`}
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>
            </div>
          </div>



        </div>

        {/* ===== Premium Footer Area ===== */}
        <div className={`mt-10 border-t pt-7 flex flex-col sm:flex-row items-center justify-between gap-5 transition-colors duration-500 ${
          theme ? "border-gray-800" : "border-slate-100"
        }`}>
          <span className={`text-sm font-medium transition-colors ${theme ? "text-gray-500" : "text-slate-400"}`}>
            <span className="text-red-500 mr-1">*</span> 
            Indicates required fields.
          </span>
          
          <button 
            type="submit" 
            disabled={loading}
            className={`group/btn relative overflow-hidden text-white font-bold text-lg py-3 px-8 rounded-xl transition-all duration-300 transform hover:-translate-y-1 hover:scale-[1.02] active:scale-95 active:translate-y-0 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none ${
              theme 
                ? "bg-linear-to-r from-blue-600 via-indigo-600 to-blue-700 shadow-[0_8px_15px_-5px_rgba(79,70,229,0.3)] hover:shadow-[0_15px_30px_-10px_rgba(79,70,229,0.5)] border border-blue-500/50 hover:border-blue-400"
                : "bg-linear-to-r from-red-600 via-rose-600 to-red-700 shadow-[0_8px_15px_-5px_rgba(220,38,38,0.2)] hover:shadow-[0_15px_30px_-10px_rgba(220,38,38,0.4)] border border-red-500/30 hover:border-red-400" 
            }`}
          >
            <span className="absolute inset-0 w-full h-full bg-linear-to-r from-transparent via-white/20 to-transparent translate-x-[-150%] skew-x-[-30deg] group-hover/btn:translate-x-[150%] transition-transform duration-700 ease-out pointer-events-none"></span>
            
            <span className="relative flex items-center justify-center gap-2">
              {loading ? (
                <>
                  <span className="w-5 h-5 rounded-full border-2 border-white/40 border-t-white animate-spin"></span>
                  Processing...
                </>
              ) : (
                'Create Profile'
              )}
            </span>
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateStudent;