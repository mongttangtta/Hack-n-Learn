import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import ASCIIText from '@/components/ASCIIText';
import DecryptedText from '@/components/DecryptedText';
import PixelBlast from '@/components/PixelBlast';
import Button from '@/components/Button';
import { Link } from 'react-router-dom';

export default function LandingPage() {
  const [showPrompt, setShowPrompt] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowPrompt(true);
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <div
        style={{ width: '100%', height: '100vh', position: 'relative' }}
        className="bg-black pointer-events-auto"
      >
        <PixelBlast
          pixelSize={6}
          color="#B19EEF"
          patternScale={3}
          patternDensity={1.2}
          pixelSizeJitter={0.5}
          enableRipples
          rippleSpeed={0.4}
          rippleThickness={0.12}
          rippleIntensityScale={1.5}
          speed={0.6}
          edgeFade={0.25}
          transparent
        />

        <div className="absolute inset-0 flex flex-col items-center justify-center w-full h-full pointer-events-none">
          <DecryptedText
            text="Interactive Cybersecurity Learning Platform"
            animateOn="view"
            revealDirection="center"
            className="text-primary-text font-bold text-lg"
            sequential={true}
          />
          <DecryptedText
            text="Master Web Security through Gamified Challenges"
            animateOn="view"
            revealDirection="center"
            className="text-primary-text font-bold text-lg"
            sequential={true}
          />
          <div className="relative w-full h-[400px] pointer-events-auto">
            <ASCIIText
              text="Hack'n'Learn"
              enableWaves={true}
              asciiFontSize={6}
            />
          </div>
          {showPrompt && (
            <>
              <div className="z-10 pointer-events-auto">
                <DecryptedText
                  text="Would you like to try it?"
                  animateOn="view"
                  revealDirection="center"
                  sequential={true}
                  className="text-primary-text font-bold text-lg"
                />
              </div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.5 }}
                className="flex space-x-4 mt-8 z-10 pointer-events-auto"
              >
                <Link to="/about">
                  <Button>서비스 소개</Button>
                </Link>
                <Link to="/learning">
                  <Button>이론 학습</Button>
                </Link>
              </motion.div>
            </>
          )}
        </div>
      </div>
    </>
  );
}
