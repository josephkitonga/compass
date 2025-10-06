"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  BookOpen,
  Clock,
  Target,
  CheckCircle,
  XCircle,
  ArrowLeft,
  Calculator,
  Beaker,
  Globe,
  History,
  Music,
  Palette,
  Book,
  Heart,
  Zap,
  Brain,
  PartyPopper,
  RefreshCw,
  Home,
  ExternalLink,
} from "lucide-react";
import Link from "next/link";
import type { ApiQuiz } from "@/lib/data-service";
import Confetti from "react-confetti";

interface QuizDetailProps {
  quiz: ApiQuiz;
  subject: string;
  grade: string;
  system: string;
}

export default function QuizDetail({
  quiz,
  subject,
  grade,
  system,
}: QuizDetailProps) {
  const [showConfetti, setShowConfetti] = useState(false);

  const subjectIcons: {
    [key: string]: React.ComponentType<{ className?: string }>;
  } = {
    Mathematics: Calculator,
    Physics: Zap,
    Chemistry: Beaker,
    Biology: Heart,
    Geography: Globe,
    History: History,
    English: Book,
    Literature: BookOpen,
    Kiswahili: Book,
    French: Book,
    German: Book,
    Arabic: Book,
    "Religious Education": Book,
    Music: Music,
    Art: Palette,
    "Computer Studies": Brain,
    "Business Studies": Target,
    Agriculture: Heart,
    "Home Science": Heart,
    "Physical Education": Zap,
    "Life Skills": Heart,
    "Creative Arts": Palette,
    "Environmental Activities": Globe,
    "Hygiene and Nutrition": Heart,
    "Movement Activities": Zap,
    "Language Activities": Book,
    "Mathematical Activities": Calculator,
    "Psychomotor and Creative Activities": Palette,
    "Religious Education Activities": Book,
    "Social Studies": Globe,
    "Science and Technology": Beaker,
    Languages: Book,
    Humanities: Globe,
    "Applied Sciences": Beaker,
    "Technical Subjects": Target,
    "Optional Subjects": Book,
  };

  const subjectColors: { [key: string]: string } = {
    English: "bg-blue-500",
    Kiswahili: "bg-blue-600",
    Mathematics: "bg-yellow-500",
    "Science & Technology": "bg-green-500",
    "Integrated Science": "bg-green-600",
    Biology: "bg-green-700",
    Physics: "bg-purple-500",
    Chemistry: "bg-indigo-500",
    "Social Studies": "bg-orange-500",
    History: "bg-red-500",
    Geography: "bg-teal-500",
    "Creative Arts": "bg-pink-500",
    "Creative Arts & Sports": "bg-pink-600",
    "Religious Education": "bg-purple-600",
    "Computer Science": "bg-gray-600",
    Agriculture: "bg-green-800",
    "Business Studies": "bg-blue-700",
    "Home Science": "bg-rose-500",
    Art: "bg-pink-400",
    Languages: "bg-blue-400",
  };

  const difficultyColors: { [key: string]: string } = {
    Easy: "bg-green-100 text-green-800",
    Medium: "bg-yellow-100 text-yellow-800",
    Hard: "bg-red-100 text-red-800",
    // Year-based colors (fallback for year values)
    "2024": "bg-blue-100 text-blue-800",
    "2023": "bg-purple-100 text-purple-800",
    "2022": "bg-indigo-100 text-indigo-800",
    "2021": "bg-pink-100 text-pink-800",
    "2020": "bg-teal-100 text-teal-800",
  };

  const IconComponent = subjectIcons[subject] || BookOpen;
  const subjectColor = subjectColors[subject] || "bg-gray-500";
  const difficultyColor =
    difficultyColors[quiz.difficulty] || "bg-gray-100 text-gray-800";

  // Handle external quiz redirection
  const handleTakeQuiz = () => {
    if (quiz.quizLink) {
      window.open(quiz.quizLink, "_blank");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-nmg-primary/10 to-nmg-accent/10 py-8 relative">
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <Link
              href="/"
              className="inline-flex items-center text-nmg-primary hover:text-nmg-primary/80 mb-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Home
            </Link>
            <div className="flex items-center gap-4 mb-4">
              <div className={`p-3 rounded-lg ${subjectColor} text-white`}>
                <IconComponent className="h-6 w-6" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  {quiz.title}
                </h1>
                <p className="text-lg text-gray-600">
                  {subject} • {grade} • {system}
                </p>
              </div>
            </div>
          </div>

          {/* Quiz Info Card */}
          <Card className="shadow-xl border-2 border-nmg-primary mb-8">
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-gray-900 mb-4">
                Quiz Information
              </CardTitle>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="flex items-center space-x-3">
                  <Target className="h-5 w-5 text-nmg-primary" />
                  <div>
                    <p className="text-sm text-gray-600">Questions</p>
                    <p className="text-lg font-semibold text-gray-900">
                      {quiz.questions}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Clock className="h-5 w-5 text-nmg-primary" />
                  <div>
                    <p className="text-sm text-gray-600">Duration</p>
                    <p className="text-lg font-semibold text-gray-900">
                      {quiz.duration} min
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <BookOpen className="h-5 w-5 text-nmg-primary" />
                  <div>
                    <p className="text-sm text-gray-600">Type</p>
                    <p className="text-lg font-semibold text-gray-900">
                      {quiz.type}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div>
                    <p className="text-sm text-gray-600">Difficulty</p>
                    <Badge className={difficultyColor}>{quiz.difficulty}</Badge>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <BookOpen className="h-4 w-4 text-blue-600" />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-blue-900 mb-2">
                      Ready to Start?
                    </h3>
                    <p className="text-blue-800 mb-4">
                      This quiz contains {quiz.questions} questions and should
                      take approximately {quiz.duration} minutes to complete.
                      {quiz.quizLink
                        ? " Click the button below to start the quiz on the external platform."
                        : " The quiz will open in a new tab."}
                    </p>
                    {quiz.quizLink && (
                      <Button
                        onClick={handleTakeQuiz}
                        className="bg-khan-green hover:bg-khan-green/90 text-white flex items-center gap-2"
                        size="lg">
                        <ExternalLink className="h-4 w-4" />
                        Take Quiz on Roodito
                      </Button>
                    )}
                  </div>
                </div>
              </div>

              {quiz.date && (
                <div className="text-sm text-gray-500">
                  <p>Created: {new Date(quiz.date).toLocaleDateString()}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Instructions */}
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="text-xl font-bold text-gray-900">
                Instructions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 w-6 h-6 bg-nmg-primary text-white rounded-full flex items-center justify-center text-sm font-bold">
                    1
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">
                      Read Carefully
                    </h4>
                    <p className="text-gray-600">
                      Read each question and all answer choices carefully before
                      selecting your answer.
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 w-6 h-6 bg-nmg-primary text-white rounded-full flex items-center justify-center text-sm font-bold">
                    2
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">
                      Manage Your Time
                    </h4>
                    <p className="text-gray-600">
                      You have {quiz.duration} minutes to complete{" "}
                      {quiz.questions} questions. Pace yourself accordingly.
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 w-6 h-6 bg-nmg-primary text-white rounded-full flex items-center justify-center text-sm font-bold">
                    3
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">
                      Submit Your Answers
                    </h4>
                    <p className="text-gray-600">
                      Review your answers before submitting. Once submitted, you
                      cannot change them.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
