"use client"

import { Button } from "@/components/ui/button"
import { ArrowRight, BookOpen, Users, Target } from "lucide-react"

export default function Hero() {
  return (
    <section className="bg-gradient-to-br from-nmg-primary via-nmg-accent to-khan-green text-white">
      <div className="w-full px-4 sm:px-6 lg:px-8 py-16 md:py-24">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Left Column - Content */}
          <div className="space-y-8">
            <div className="space-y-4">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
                Kwa Kila Mwanafunzi,{" "}
                <span className="text-[#14BF96]">Kila Darasa</span>
              </h1>
              <p className="text-xl md:text-2xl text-gray-100 leading-relaxed">
                Curated quizzes to help students prepare and revise confidently across all grades and subjects.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                size="lg" 
                className="bg-nmg-primary hover:bg-nmg-primary/90 text-white text-lg px-8 py-6 h-auto transition-all duration-200 hover:scale-105 shadow-lg hover:shadow-xl"
                onClick={() => {
                  document.getElementById('cbc')?.scrollIntoView({ behavior: 'smooth' })
                }}
              >
                Start Revising
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
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