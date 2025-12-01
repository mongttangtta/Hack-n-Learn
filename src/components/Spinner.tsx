import React from 'react';
import { HashLoader, ScaleLoader, BeatLoader } from 'react-spinners'; // Import ScaleLoader

interface SpinnerProps {
  fullScreen?: boolean;
  size?: number;
  color?: string;
  variant?: 'hash' | 'scale' | 'beat'; // Change 'clip' to 'scale'
  className?: string;
}

const Spinner: React.FC<SpinnerProps> = ({
  fullScreen = false,
  size,
  color = '#00bfff',
  variant = 'hash',
  className = '',
}) => {
  const Loader = variant === 'hash' ? HashLoader : variant === 'beat' ? BeatLoader : ScaleLoader; // Update Loader assignment
  
  let defaultSize = 50;
  let defaultWidth = 4; // Default width for ScaleLoader
  let defaultRadius = 2; // Default radius for ScaleLoader

  if (variant === 'scale') {
    defaultSize = 15; // height for ScaleLoader
    defaultWidth = 2;
    defaultRadius = 1;
  }
  if (variant === 'beat') defaultSize = 10;

  // Render Loader based on variant, passing specific props for ScaleLoader
  const renderLoader = () => {
    if (variant === 'scale') {
      return <ScaleLoader 
                color={color} 
                height={size || defaultSize} 
                width={defaultWidth} 
                radius={defaultRadius} 
             />;
    }
    return <Loader color={color} size={size || defaultSize} />;
  }

  if (fullScreen) {
    return (
      <div className={`fixed inset-0 flex items-center justify-center bg-main/80 z-50 ${className}`}>
        {renderLoader()}
      </div>
    );
  }

  return (
    <div className={`flex items-center justify-center p-4 ${className}`}>
      {renderLoader()}
    </div>
  );
};

export default Spinner;