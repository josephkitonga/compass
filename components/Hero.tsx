"use client"

import { Button } from "@/components/ui/button"
import { ArrowRight, BookOpen, Users, Target } from "lucide-react"
import { useEffect, useState } from "react"
import Link from 'next/link';

export default function Hero() {
  const english = "For Every Student, ";
  const englishAccent = "Every Classroom .";
  const swahili = "Kwa Kila Mwanafunzi, ";
  const swahiliAccent = "Kila Darasa .";

  const swahiliWords = (swahili + swahiliAccent).trim().split(/\s+/);

  const [showSwahili, setShowSwahili] = useState(false);
  const [swahiliProgress, setSwahiliProgress] = useState(0);

  // Alternate every 10 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setShowSwahili((prev) => !prev);
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  // Reset swahili animation progress each time it appears
  useEffect(() => {
    if (showSwahili) {
      setSwahiliProgress(0);
    }
  }, [showSwahili]);

  useEffect(() => {
    if (showSwahili && swahiliProgress < swahiliWords.length) {
      const wordTimer = setTimeout(() => {
        setSwahiliProgress((p) => p + 1);
      }, 300);
      return () => clearTimeout(wordTimer);
    }
  }, [showSwahili, swahiliProgress, swahiliWords.length]);

  // Helper to animate words and alternate colors
  const renderAnimatedWords = (words: string[], progress: number) => (
    <>
      {words.map((word, i) => (
        <span
          key={"word-" + i}
          className={`inline-block transition-all duration-300 mx-1 ${progress > i ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2'} ${i % 2 === 1 ? 'text-nmg-primary' : ''}`}
          aria-hidden={progress <= i}
        >
          {word}{i < words.length - 1 ? ' ' : ''}
        </span>
      ))}
    </>
  );

  const englishWords = (english + englishAccent).trim().split(/\s+/);

  // Track progress for both languages
  const [progress, setProgress] = useState(0);

  // Animate word-by-word for both languages
  useEffect(() => {
    setProgress(0);
  }, [showSwahili]);

  useEffect(() => {
    const words = showSwahili ? swahiliWords : englishWords;
    if (progress < words.length) {
      const wordTimer = setTimeout(() => {
        setProgress((p) => p + 1);
      }, 300);
      return () => clearTimeout(wordTimer);
    }
  }, [showSwahili, progress, swahiliWords.length, englishWords.length]);

  return (
    <section className="bg-compass-primary text-white">
      <div className="w-full px-4 sm:px-6 lg:px-8 py-16 md:py-24">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Left Column - Content */}
          <div className="space-y-8">
            <div className="space-y-1">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight min-h-[3.0em] relative">
                {/* English headline, word-by-word animation */}
                <span
                  className={`absolute left-0 top-0 w-full transition-opacity duration-700 ${showSwahili ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
                  aria-hidden={showSwahili}
                >
                  {renderAnimatedWords(englishWords, !showSwahili ? progress : 0)}
                </span>
                {/* Swahili headline, word-by-word animation, alternating colors */}
                <span
                  className={`absolute left-0 top-0 w-full transition-opacity duration-700 ${showSwahili ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
                  aria-hidden={!showSwahili}
                >
                  {renderAnimatedWords(swahiliWords, showSwahili ? progress : 0)}
                </span>
                {/* For accessibility, show the Swahili version in the DOM always */}
                <span className="sr-only">Kwa Kila Mwanafunzi, Kila Darasa</span>
              </h1>
              <p className="text-xl md:text-2xl text-gray-100 leading-relaxed">
                Curated quizzes to help students prepare and revise confidently across all grades and subjects.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="#cbc" scroll={true}>
              <Button 
                size="lg" 
                className="bg-nmg-primary hover:bg-nmg-primary/90 text-white text-lg px-8 py-6 h-auto transition-all duration-200 hover:scale-105 shadow-lg hover:shadow-xl flex items-center justify-center"
              >
                <span>Start Revising</span>
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              </Link>
              <Button 
                variant="outline" 
                size="lg" 
                className="border-white text-black hover:bg-white hover:text-nmg-primary text-lg px-8 py-6 h-auto transition-all duration-200 hover:scale-105 shadow-lg hover:shadow-xl"
                onClick={() => {
                  document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })
                }}
              >
                Learn More
              </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-6 pt-8">
              <div className="text-center group">
                <div className="flex items-center justify-center mb-2">
                  <BookOpen className="h-6 w-6 text-[#14BF96] group-hover:scale-110 transition-transform duration-300" />
                </div>
                <div className="text-2xl font-bold animate-pulse">500+</div>
                <div className="text-sm text-gray-200">Quizzes</div>
              </div>
              <div className="text-center group">
                <div className="flex items-center justify-center mb-2">
                  <Users className="h-6 w-6 text-[#14BF96] group-hover:scale-110 transition-transform duration-300" />
                </div>
                <div className="text-2xl font-bold animate-pulse">2</div>
                <div className="text-sm text-gray-200">Education Systems</div>
              </div>
              <div className="text-center group">
                <div className="flex items-center justify-center mb-2">
                  <Target className="h-6 w-6 text-[#14BF96] group-hover:scale-110 transition-transform duration-300" />
                </div>
                <div className="text-2xl font-bold animate-pulse">15+</div>
                <div className="text-sm text-gray-200">Subjects</div>
              </div>
            </div>
          </div>

          {/* Right Column - Image */}
          <div className="relative flex items-center justify-center">
            <img
              src="/students.png"
              alt="Kenyan students in school uniform"
              className="rounded-2xl shadow-2xl w-full h-auto object-cover aspect-[4/3]"
              style={{ maxWidth: 480 }}
            />
          </div>
        </div>
      </div>
    </section>
  )
} 