import React from "react";

interface ProgressBarProps {
  progress: number;
  className?: string;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ progress, className }) => {
  return (
    <div className={`w-full h-0.5 ${className} overflow-hidden`}>
      <div
        className="h-full bg-primary transition-all duration-300 ease-in-out shadow-[0_0_15px_rgba(var(--primary),0.8)]"
        style={{
          width: "30%",
          animation: "slideRight 1s linear infinite",
        }}
        role="progressbar"
        aria-valuenow={progress}
        aria-valuemin={0}
        aria-valuemax={100}
      />
    </div>
  );
};

export default ProgressBar;
