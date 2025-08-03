'use client'

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, BookOpen, Target, Users, Star, ArrowRight } from "lucide-react"
import Link from "next/link"

export default function LandingPage() {
  const [isHovered, setIsHovered] = useState(false)

  const features = [
    {
      icon: <BookOpen className="w-6 h-6" />,
      title: "Curriculum Aligned",
      description: "All quizzes designed according to official Kenyan curriculum standards"
    },
    {
      icon: <Target className="w-6 h-6" />,
      title: "Practice Focused",
      description: "Interactive quizzes to help students practice and improve their skills"
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: "Comprehensive Coverage",
      description: "Covering all major subjects across both CBC and 8-4-4 systems"
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="w-full px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-2">
              <img src="/Nation logo.svg" alt="NMG Logo" className="h-8 w-auto" />
              <span className="text-xl font-bold text-gray-900">Revision Portal</span>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/auth">
                <Button variant="ghost" className="text-gray-700 hover:text-gray-900">
                  Sign In
                </Button>
              </Link>
              <Link href="/auth">
                <Button className="bg-[#002F6C] hover:bg-[#002F6C]/90">
                  Get Started
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-20 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="w-full">
          <div className="text-center mb-12">
                      <Badge variant="secondary" className="mb-6 bg-[#14BF96]/10 text-[#14BF96] border-[#14BF96]/20">
            <Star className="w-4 h-4 mr-2" />
            Trusted by Kenyan Students
          </Badge>
            
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
              Master Your
              <span className="text-[#002F6C]"> Revision</span>
              <br />
              <span className="text-[#14BF96]">Confidently</span>
            </h1>
            
            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
              Comprehensive revision materials for CBC and 8-4-4 education systems. 
              Practice with curriculum-aligned quizzes designed specifically for Kenyan students.
            </p>
            
                      <div className="flex justify-center items-center mb-12">
            <Link href="/auth">
              <Button 
                size="lg" 
                className="bg-[#002F6C] hover:bg-[#002F6C]/90 text-lg px-8 py-3"
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
              >
                Start Learning Now
                <ArrowRight className={`ml-2 w-5 h-5 transition-transform ${isHovered ? 'translate-x-1' : ''}`} />
              </Button>
            </Link>
          </div>

                      <div className="flex justify-center items-center space-x-8 text-sm text-gray-500">
            <div className="flex items-center">
              <CheckCircle className="w-4 h-4 mr-2 text-green-500" />
              Curriculum Aligned
            </div>
            <div className="flex items-center">
              <CheckCircle className="w-4 h-4 mr-2 text-green-500" />
              CBC & 8-4-4 Systems
            </div>
            <div className="flex items-center">
              <CheckCircle className="w-4 h-4 mr-2 text-green-500" />
              All Subjects Covered
            </div>
          </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="w-full">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Why Choose Roodito?
            </h2>
            <p className="text-lg text-gray-600">
              Designed specifically for Kenyan students, our platform provides everything you need for effective revision
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-shadow">
                <CardHeader className="text-center">
                  <div className="w-12 h-12 bg-[#002F6C] rounded-lg flex items-center justify-center mx-auto mb-4">
                    <div className="text-white">
                      {feature.icon}
                    </div>
                  </div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-center text-gray-600">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Education Systems Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="w-full">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Supporting Both Education Systems
            </h2>
            <p className="text-lg text-gray-600">
              Whether you're in CBC or 8-4-4, we've got you covered with comprehensive revision materials
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8">
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="text-2xl text-[#002F6C]">CBC System</CardTitle>
                <CardDescription className="text-lg">
                  Competency Based Curriculum
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                    <span>Upper Primary (Grades 4-6)</span>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                    <span>Junior Secondary (Grades 7-9)</span>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                    <span>Senior Secondary (Grades 10-12)</span>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="text-2xl text-[#14BF96]">8-4-4 System</CardTitle>
                <CardDescription className="text-lg">
                  Traditional Education System
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                    <span>Form 2</span>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                    <span>Form 3</span>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                    <span>Form 4</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-[#002F6C]">
        <div className="w-full text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to Start Your Revision Journey?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Join thousands of students who are already improving their grades with Roodito
          </p>
          <Link href="/auth">
            <Button size="lg" className="bg-white text-[#002F6C] hover:bg-gray-100 text-lg px-8 py-3">
              Get Started Now
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="w-full">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <img src="/Nation logo.svg" alt="NMG Logo" className="h-6 w-auto" />
                <span className="font-bold">Revision Portal</span>
              </div>
              <p className="text-gray-400">
                Empowering Kenyan students with comprehensive revision materials for academic excellence.
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Education Systems</h3>
              <ul className="space-y-2 text-gray-400">
                <li>CBC System</li>
                <li>8-4-4 System</li>
                <li>All Subjects</li>
                <li>All Grades</li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Resources</h3>
              <ul className="space-y-2 text-gray-400">
                <li>Practice Quizzes</li>
                <li>Revision Materials</li>
                <li>Study Guides</li>
                <li>Progress Tracking</li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Support</h3>
              <ul className="space-y-2 text-gray-400">
                <li>Help Center</li>
                <li>Contact Us</li>
                <li>Privacy Policy</li>
                <li>Terms of Service</li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2025 Nation Media Group • Roodito. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
