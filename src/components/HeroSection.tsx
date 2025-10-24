import React from 'react';

interface HeroSectionProps {
  imageUrl: string;
  title: React.ReactNode;
  subtitle?: React.ReactNode;
}

const HeroSection: React.FC<HeroSectionProps> = ({
  imageUrl,
  title,
  subtitle,
}) => {
  return (
    <section
      className="w-full max-w-[1920px] h-[420px] bg-cover bg-center bg-no-repeat flex items-center justify-start mb-20"
      style={{
        backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url(${imageUrl})`,
      }}
    >
      <div className="container mx-auto px-20 py-16 text-left">
        <div className="flex items-center mb-4">
          <div className="h-9 w-1.5 bg-accent-primary1 mr-4"></div>
          <h1 className="font-bold">{title}</h1>
        </div>
        <p className="text-body1 text-secondary-text">{subtitle}</p>
      </div>
    </section>
  );
};

export default HeroSection;
