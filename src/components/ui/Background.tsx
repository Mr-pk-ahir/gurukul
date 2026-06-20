import React from "react";
import { useTheme } from "../theme/ThemeContext"; // તમારા ફોલ્ડર સ્ટ્રક્ચર મુજબ ThemeContext નો સાચો પાથ

interface BackgroundProps {
  children?: React.ReactNode;
}

export default function Background({ children }: BackgroundProps) {
  // થીમ કમ્પોનન્ટમાંથી સીધું boolean (true/false) મેળવ્યું
  const { theme } = useTheme();
  
  // જો theme ટ્રુ હોય તો લાલ, ફોલ્સ હોય તો વાદળી ગ્રીડ લાઇન કલર સેટ થશે
  const lineColor = theme ? "#fecaca" : "#bfdbfe";

  return (
    <div className="relative flex flex-col items-center justify-center h-screen bg-white overflow-hidden w-full">
      
      {/* Lining Background with Fading/Blur Effect on Edges */}
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(to right, ${lineColor} 1px, transparent 1px),
            linear-gradient(to bottom, ${lineColor} 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px',
          maskImage: 'radial-gradient(circle, black 40%, transparent 80%)',
          WebkitMaskImage: 'radial-gradient(circle, black 40%, transparent 80%)'
        }}
      />

      {/* Main Content Render */}
      <div className="relative z-10 w-full h-full flex flex-col items-center justify-center">
        {children}
      </div>

    </div>
  );
}