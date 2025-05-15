'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import useSound from 'use-sound';

type SaberColor = 'blue' | 'red' | 'green' | 'purple' | 'yellow';

export default function LightsaberV2() {
  const [isOn, setIsOn] = useState(false);
  const [playOn] = useSound('/sounds/lightsaber-on.mp3');
  const [playOff] = useSound('/sounds/lightsaber-off.mp3');
  const [playSwing] = useSound('/sounds/lightsaber-swing.mp3');
  const [hasPermission, setHasPermission] = useState(false);
  const [currentColor, setCurrentColor] = useState<SaberColor>('blue');

  const colorConfig = {
    blue: {
      shadow: '#0000FF',
      bg: 'rgba(0, 0, 255, 0.05)',
      titleColor: 'rgba(200,200,255,0.5)',
    },
    red: {
      shadow: '#FF0000',
      bg: 'rgba(255, 0, 0, 0.05)',
      titleColor: 'rgba(255,200,200,0.5)',
    },
    green: {
      shadow: '#00FF00',
      bg: 'rgba(0, 255, 0, 0.05)',
      titleColor: 'rgba(200,255,200,0.5)',
    },
    purple: {
      shadow: '#800080',
      bg: 'rgba(255, 0, 255, 0.05)',
      titleColor: 'rgba(255,200,255,0.5)',
    },
    yellow: {
      shadow: '#FFFF00',
      bg: 'rgba(255, 255, 0, 0.05)',
      titleColor: 'rgba(255,255,0,0.5)',
    },
  };

  const requestMotionPermission = async () => {
    if (
      typeof DeviceMotionEvent !== 'undefined' &&
      // @ts-ignore
      typeof DeviceMotionEvent.requestPermission === 'function'
    ) {
      try {
        // @ts-ignore
        const permissionState = await DeviceMotionEvent.requestPermission();
        setHasPermission(permissionState === 'granted');
      } catch (error) {
        console.error('Error requesting motion permission:', error);
      }
    } else {
      setHasPermission(true);
    }
  };

  useEffect(() => {
    let lastSwing = 0;
    const SWING_COOLDOWN = 500;

    const handleMotion = (event: DeviceMotionEvent) => {
      const now = Date.now();
      if (!isOn || now - lastSwing < SWING_COOLDOWN) return;

      const acceleration = event.acceleration;
      if (acceleration) {
        const totalAcceleration = Math.sqrt(
          (acceleration.x || 0) ** 2 +
            (acceleration.y || 0) ** 2 +
            (acceleration.z || 0) ** 2
        );

        if (totalAcceleration > 15) {
          playSwing();
          lastSwing = now;
        }
      }
    };

    if (hasPermission) {
      window.addEventListener('devicemotion', handleMotion);
    }

    return () => {
      window.removeEventListener('devicemotion', handleMotion);
    };
  }, [isOn, playSwing, hasPermission]);

  const handleClick = () => {
    if (!hasPermission) {
      requestMotionPermission();
    }

    if (isOn) {
      playOff();
    } else {
      playOn();
    }
    setIsOn(!isOn);
  };

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center">
      <div
        className="fixed top-0 left-0 right-0 bottom-0 bg-black"
        style={{
          backgroundImage: `radial-gradient(circle at center, transparent 0%, #000 100%)`,
          backgroundColor:
            currentColor === 'blue'
              ? '#222233'
              : currentColor === 'red'
              ? '#332222'
              : currentColor === 'green'
              ? '#223322'
              : currentColor === 'purple'
              ? '#332233'
              : '#333222',
        }}
      />

      <h1
        className="relative text-4xl mb-4 transition-all duration-800"
        style={{
          color: colorConfig[currentColor].titleColor,
          textShadow: `0 0 5px ${colorConfig[currentColor].shadow}, 0 0 5px ${colorConfig[currentColor].shadow}, 0 0 5px ${colorConfig[currentColor].shadow}`,
        }}
      >
        Light Saber
      </h1>

      <div className="fixed top-4 right-[5%] bg-[#333] p-4 text-[#BBB] w-[175px] text-sm">
        <p className="font-bold mb-2">Select your light saber&apos;s color</p>
        <ul className="flex gap-2 mb-4">
          {(Object.keys(colorConfig) as SaberColor[]).map((color) => (
            <li key={color}>
              <button
                onClick={() => setCurrentColor(color)}
                className="w-6 h-6 border"
                style={{
                  backgroundColor:
                    color === 'blue'
                      ? 'darkblue'
                      : color === 'red'
                      ? 'darkred'
                      : color === 'green'
                      ? 'darkgreen'
                      : color === 'purple'
                      ? '#590563'
                      : 'darkgoldenrod',
                  borderColor: colorConfig[color].shadow,
                }}
              />
            </li>
          ))}
        </ul>
      </div>

      <div
        id="lightsaber"
        className="relative w-[50px] mx-auto p-5 text-center"
      >
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{
            height: isOn ? 520 : 0,
            opacity: isOn ? 1 : 0,
          }}
          transition={{ duration: 0.3 }}
          className="relative w-[14px] mx-auto rounded-t-lg bg-white z-10"
          style={{
            boxShadow: isOn
              ? `0 0 5px #fff, 0 0 8px #fff, 0 0 12px #fff, 0 0 15px ${colorConfig[currentColor].shadow}, 0 0 25px ${colorConfig[currentColor].shadow}`
              : 'none',
          }}
        />

        <div id="generator" className="relative w-[45px] h-[170px] -mt-[3px]">
          <div id="guard" className="w-full">
            <div className="w-full h-[3px] bg-gradient-to-r from-[rgba(0,0,0,0.7)] via-[rgba(0,0,0,0.2)] to-[rgba(0,0,0,0.7)] rounded-b" />
            <div className="w-[82%] h-[6px] mx-auto bg-gradient-to-r from-[rgba(0,0,0,0.7)] via-[rgba(0,0,0,0.2)] to-[rgba(0,0,0,0.7)] rounded-b" />
            <div className="w-[76%] h-[9px] mx-auto bg-gradient-to-r from-[rgba(0,0,0,0.7)] via-[rgba(0,0,0,0.2)] to-[rgba(0,0,0,0.7)] rounded-b" />
            <div className="w-[65%] h-[6px] mx-auto bg-gradient-to-r from-[rgba(0,0,0,0.7)] via-[rgba(0,0,0,0.2)] to-[rgba(0,0,0,0.7)] rounded-b" />
            <div className="w-[40%] h-[10px] mx-auto bg-gradient-to-r from-[rgba(0,0,0,0.7)] via-[rgba(0,0,0,0.2)] to-[rgba(0,0,0,0.7)] rounded-b" />
          </div>

          <div id="handlestart" className="w-full">
            <div className="w-[90%] h-[6px] mx-auto bg-gradient-to-r from-[rgba(0,0,0,0.7)] via-[rgba(0,0,0,0.2)] to-[rgba(0,0,0,0.7)] rounded-t" />
            <div className="w-[75%] h-[4px] mx-auto bg-gradient-to-r from-[rgba(0,0,0,0.7)] via-[rgba(0,0,0,0.2)] to-[rgba(0,0,0,0.7)]" />
          </div>

          <div id="handle" className="w-[77%] mx-auto">
            <div className="w-[50%] h-[7px] bg-gradient-to-r from-black via-[#333] to-black" />
            <div className="w-[75%] h-[6px] bg-gradient-to-r from-black via-[#333] to-black rounded-t-md" />
            <div className="w-full h-[4px] bg-gradient-to-r from-black via-[#333] to-black" />
            <div className="w-full h-[35px] bg-gradient-to-r from-black via-[#333] to-black shadow-inner" />
            <div className="w-full h-[30px] bg-gradient-to-r from-black via-[#333] to-black shadow-inner" />
            <div className="absolute top-[121px] left-1/2 h-[28px] w-[24px] -ml-[12px] bg-[#4b3222] shadow-inner z-[5]" />
          </div>

          <div className="wings relative w-full h-[30px]">
            <div className="wing1 absolute -bottom-full right-[-6px] w-[12px] h-[16px] bg-[#4B3222] shadow-inner before:content-[''] before:absolute before:top-[-15px] before:left-0 before:h-[10px] before:w-0 before:border-l-[12px] before:border-l-[#312116] before:border-r-[5px] before:border-r-transparent before:border-t-[5px] before:border-t-transparent" />
            <div className="wing2 absolute -bottom-full right-1/2 mr-[-2px] w-[4px] h-[16px] bg-[#4B3222] shadow-inner before:content-[''] before:absolute before:top-[-14px] before:left-0 before:h-[14px] before:w-[4px] before:bg-[#312116]" />
            <div className="wing3 absolute -bottom-full left-[-6px] w-[12px] h-[16px] bg-[#4B3222] shadow-inner before:content-[''] before:absolute before:top-[-15px] before:right-0 before:h-[10px] before:w-0 before:border-r-[12px] before:border-r-[#312116] before:border-l-0" />
          </div>

          <button
            onClick={handleClick}
            className="absolute top-1/3 right-0 w-6 h-12 bg-red-600 rounded-lg transform translate-x-1/2 cursor-pointer"
          />
        </div>
      </div>
    </div>
  );
}
