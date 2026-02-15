"use client";

import { motion, useReducedMotion } from "framer-motion";
import useSWR from "swr";
import Image from "next/image";
import { useState } from "react";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

interface Stats {
  farmers: number;
  yieldIncrease: number;
  accuracy: number;
  waterSaved: number;
}

function AnimatedCounter({ value, suffix = "" }: { value: number; suffix?: string }) {
  return (
    <motion.span
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
    >
      {value}{suffix}
    </motion.span>
  );
}

export function Hero() {
  const { data: stats } = useSWR<Stats>("/api/stats", fetcher, {
    fallbackData: {
      farmers: 50000,
      yieldIncrease: 35,
      accuracy: 92,
      waterSaved: 40,
    },
  });
  
  const prefersReducedMotion = useReducedMotion();
  const [imageError, setImageError] = useState(false);

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">
      {/* Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-green-50 via-white to-blue-50" />
      
      {/* Animated Background Elements */}
      <motion.div
        className="absolute top-20 left-10 w-72 h-72 bg-green-200/30 rounded-full blur-3xl"
        animate={prefersReducedMotion ? {} : {
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      <motion.div
        className="absolute bottom-20 right-10 w-96 h-96 bg-blue-200/30 rounded-full blur-3xl"
        animate={prefersReducedMotion ? {} : {
          scale: [1.2, 1, 1.2],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 w-full">
        {/* 60/40 Split Layout for Desktop */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:gap-8">
          {/* Left Column - Text Content (60% width on desktop) */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="lg:w-[60%] space-y-8 lg:pl-4"
          >
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center px-4 py-2 bg-green-100 text-green-800 rounded-full text-sm font-medium"
            >
              <span className="w-2 h-2 bg-green-500 rounded-full mr-2" />
              AI-Powered Agriculture
            </motion.div>

            {/* Title - Repositioned */}
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900 text-balance leading-tight lg:text-left">
              AI-Powered Crop Intelligence
              <span className="block text-green-600">for Every Indian Farmer</span>
            </h1>

            {/* Paragraph */}
            <p className="text-xl text-gray-600 max-w-lg lg:text-left">
              Empowering farmers with cutting-edge AI technology to maximize yields, 
              optimize resources, and build sustainable agricultural practices for the future.
            </p>

            {/* Buttons */}
            <div className="flex flex-wrap gap-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 bg-green-600 text-white rounded-xl font-semibold text-lg shadow-lg hover:bg-green-700 transition-colors"
              >
                Get Started
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 bg-white text-gray-700 border-2 border-gray-200 rounded-xl font-semibold text-lg hover:border-green-600 hover:text-green-600 transition-colors"
              >
                Learn More
              </motion.button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-8">
              <div className="text-center lg:text-left">
                <div className="text-3xl font-bold text-green-600">
                  <AnimatedCounter value={stats?.farmers || 50000} suffix="+" />
                </div>
                <div className="text-sm text-gray-600">Active Farmers</div>
              </div>
              <div className="text-center lg:text-left">
                <div className="text-3xl font-bold text-green-600">
                  <AnimatedCounter value={stats?.yieldIncrease || 35} suffix="%" />
                </div>
                <div className="text-sm text-gray-600">Yield Increase</div>
              </div>
              <div className="text-center lg:text-left">
                <div className="text-3xl font-bold text-green-600">
                  <AnimatedCounter value={stats?.accuracy || 92} suffix="%" />
                </div>
                <div className="text-sm text-gray-600">AI Accuracy</div>
              </div>
              <div className="text-center lg:text-left">
                <div className="text-3xl font-bold text-green-600">
                  <AnimatedCounter value={stats?.waterSaved || 40} suffix="%" />
                </div>
                <div className="text-sm text-gray-600">Water Saved</div>
              </div>
            </div>
          </motion.div>

          {/* Right Column - Image (40% width on desktop) */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="lg:w-[40%] mt-12 lg:mt-0 hidden lg:block"
          >
            <motion.div 
              className="relative w-full aspect-[4/3]"
              animate={prefersReducedMotion ? {} : {
                y: [0, -10, 0],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              {!imageError ? (
                <Image
                  src="/images/Gemini_Generated_Image_gsvvv0gsvvv0gsvv.png"
                  alt="AI-powered farming technology visualization showing smart agricultural solutions"
                  fill
                  className="object-contain rounded-2xl shadow-2xl"
                  priority
                  sizes="40vw"
                  onError={() => setImageError(true)}
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-green-100 to-blue-100 rounded-2xl flex items-center justify-center">
                  <span className="text-gray-500 text-lg">Smart Farming</span>
                </div>
              )}
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
