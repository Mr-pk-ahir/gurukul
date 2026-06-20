import { useTheme } from "../theme/ThemeContext";

export const SkeletonPage = () => {
  const { theme } = useTheme(); // સીધું boolean (true/false) મેળવ્યું

  return (
    <div className="w-full h-screen bg-white p-4">
      {/* title skeleton */}
      <div className={`h-10 w-3/5 mb-2 rounded animate-pulse mt-4 ${
        theme ? "bg-red-50/50" : "bg-blue-50/50"
      }`} />
      
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {[...Array(3)].map((_, i) => (
          <div 
            key={i} 
            className={`rounded-xl p-4 animate-pulse border ${
              theme ? "bg-red-50/50 border-red-200" : "bg-blue-50/50 border-blue-200"
            }`}
          >
            <div className="h-8 w-4/5 mb-2 rounded bg-slate-200" />
            <div className="h-5 w-3/5 rounded bg-slate-200/70" />
          </div>
        ))}
      </div>
    </div>
  );
};

export const SkeletonForm = () => {
  const { theme } = useTheme();

  return (
    <div className="w-full min-h-screen bg-white p-4">
      <div className={`h-10 w-4/5 mb-3 rounded animate-pulse ${
        theme ? "bg-red-50/50" : "bg-blue-50/50"
      }`} />
      
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <div key={i}>
            <div className="h-5 w-1/5 mb-1 rounded bg-slate-200" />
            <div className="h-12 w-full rounded bg-slate-200/60" />
          </div>
        ))}
        
        {/* Button skeleton */}
        <div className={`h-10 w-32 mt-2 rounded opacity-30 animate-pulse ${
          theme ? "bg-red-600" : "bg-blue-600"
        }`} />
      </div>
    </div>
  );
};

export const SkeletonDashboard = () => {
  const { theme } = useTheme();

  return (
    <div className="w-full min-h-screen bg-white p-4">
      <div className="h-9 w-36 mb-4 rounded bg-slate-200 animate-pulse" />
      
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-4">
        {[...Array(4)].map((_, i) => (
          <div 
            key={i} 
            className={`rounded-xl p-4 animate-pulse border ${
              theme ? "bg-red-50/50 border-red-200" : "bg-blue-50/50 border-blue-200"
            }`}
          >
            <div className="h-6 w-16 mb-2 rounded bg-slate-200" />
            <div className="h-8 w-10 rounded bg-slate-200/60" />
          </div>
        ))}
      </div>
    </div>
  );
};

const Skeletons = {
  Page: SkeletonPage,
  Form: SkeletonForm,
  Dashboard: SkeletonDashboard,
};

export default Skeletons;