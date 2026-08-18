// import { motion } from "motion/react";

// export const UploadCard = ({ title, description, section, multiple = false, limit = 10, icon: Icon }: any) => {
//     const currentImages = images[section as ImageSection] || [];
//     const isSingleUploadComplete = !multiple && currentImages.length > 0;
//     const isUploading = uploadingSection === section;

//     return (
//         <motion.div
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             className={`p-6 rounded-3xl border shadow-sm transition-all duration-300 flex flex-col ${theme ? "bg-slate-900/60 border-slate-800 shadow-black/20" : "bg-white border-gray-100 shadow-gray-200/50 hover:shadow-xl"
//                 }`}
//         >
//             <div className="flex rounded-2xl items-start gap-4 mb-6">
//                 <div className={`p-3.5 rounded-2xl shrink-0 ${theme ? "bg-slate-800 text-indigo-400" : "bg-indigo-50 text-indigo-600"}`}>
//                     <Icon size={26} strokeWidth={1.5} />
//                 </div>
//                 <div className="flex-1">
//                     <div className="flex justify-between items-center w-full">
//                         <h3 className={`text-lg font-bold ${theme ? "text-white" : "text-slate-800"}`}>{title}</h3>
//                         <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${theme ? "bg-slate-800 text-slate-300" : "bg-gray-100 text-gray-600"}`}>
//                             {currentImages.length} / {limit}
//                         </span>
//                     </div>
//                     <p className={`text-sm mt-1 leading-snug ${theme ? "text-slate-400" : "text-gray-500"}`}>{description}</p>
//                 </div>
//             </div>

//             <div className="relative group flex-1 flex flex-col justify-center min-h-40">
//                 {isUploading ? (
//                     <div className={`w-full flex flex-col items-center justify-center p-8 rounded-2xl border-2 border-dashed min-h-40 ${theme ? "border-slate-700 bg-slate-800/30" : "border-gray-300 bg-gray-50"}`}>
//                         <Loader2 size={32} className="animate-spin mb-3 text-indigo-500" />
//                         <p className={`font-medium text-center ${theme ? "text-slate-300" : "text-slate-700"}`}>Uploading...</p>
//                     </div>
//                 ) : isSingleUploadComplete ? (
//                     <div className="relative w-full rounded-2xl overflow-hidden border border-gray-200 dark:border-slate-700 shadow-sm aspect-video">
//                         <img src={currentImages[0].url} alt="Preview" className="w-full h-full object-cover" />
//                         <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 transition-opacity duration-300 flex items-center justify-center backdrop-blur-sm">
//                             <button onClick={() => removeImage(section, currentImages[0].id)} className="p-3 bg-red-500 text-white rounded-full hover:bg-red-600 transform hover:scale-110 transition-all shadow-lg">
//                                 <X size={20} strokeWidth={3} />
//                             </button>
//                         </div>
//                     </div>
//                 ) : (
//                     <>
//                         <input type="file" multiple={multiple} accept="image/*" onChange={(e) => handleImageUpload(e, section)} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" disabled={currentImages.length >= limit} />
//                         <div className={`w-full flex flex-col items-center justify-center p-8 rounded-2xl border-2 border-dashed transition-all duration-300 min-h-40 ${theme ? "border-slate-700 bg-slate-800/30 group-hover:border-indigo-500 group-hover:bg-slate-800/50" : "border-gray-300 bg-gray-50 group-hover:border-indigo-400 group-hover:bg-indigo-50/30"}`}>
//                             <UploadCloud size={40} className={`mb-3 transition-colors ${theme ? "text-slate-500 group-hover:text-indigo-400" : "text-gray-400 group-hover:text-indigo-500"}`} />
//                             <p className={`font-medium text-center ${theme ? "text-slate-300" : "text-slate-700"}`}>Click to upload (Max 60MB)</p>
//                         </div>
//                     </>
//                 )}
//             </div>

//             {multiple && currentImages.length > 0 && (
//                 <div className="grid gap-3 mt-6 grid-cols-2 sm:grid-cols-3">
//                     {currentImages.map((img) => (
//                         <div key={img.id} className="relative group rounded-xl overflow-hidden aspect-video border border-gray-200 dark:border-slate-700 shadow-sm">
//                             <img src={img.url} alt="Preview" className="w-full h-full object-cover" />
//                             <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center backdrop-blur-sm z-20">
//                                 <button onClick={() => removeImage(section, img.id)} className="p-1.5 bg-red-500 text-white rounded-full hover:bg-red-600 transform hover:scale-110 transition-all shadow-lg">
//                                     <X size={16} strokeWidth={3} />
//                                 </button>
//                             </div>
//                         </div>
//                     ))}
//                 </div>
//             )}
//         </motion.div>
//     );
// };