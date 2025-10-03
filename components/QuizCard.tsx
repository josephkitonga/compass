"use client";

import React from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  BookOpen,
  Clock,
  Target,
  ArrowRight,
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
} from "lucide-react";
import type { ApiQuiz } from "@/lib/data-service";
import { useAuth } from "@/hooks/use-auth";

interface QuizCardProps {
  quiz: ApiQuiz;
  subject: string;
  grade: string;
  system: string;
}

export default function QuizCard({
  quiz,
  subject,
  grade,
  system,
}: QuizCardProps) {
  const { isAuthenticated } = useAuth();

  // Debug: Check if token exists in localStorage on component mount
  React.useEffect(() => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("roodito_token");
      console.log(
        "QuizCard mounted - roodito_token:",
        token ? `${token.substring(0, 20)}...` : "null"
      );
      console.log("QuizCard mounted - quiz.quizLink:", quiz.quizLink);
      console.log("QuizCard mounted - quiz.questions:", quiz.questions);
      console.log("QuizCard mounted - quiz data:", quiz);
    }
  }, []);

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
  };

  const IconComponent = subjectIcons[subject] || BookOpen;
  const subjectColor = subjectColors[subject] || "bg-gray-500";
  const difficultyColor =
    difficultyColors[quiz.difficulty] || "bg-gray-100 text-gray-800";

  // Get quiz URL with authentication token
  const getQuizUrl = () => {
    if (quiz.quizLink) {
      // For Roodito quizzes, extract token from localStorage and append to URL
      // Format: https://roodito.com/do-quiz/{quiz_id}/{token}

      // Get token from localStorage
      const getToken = () => {
        if (typeof window !== "undefined") {
          // Try roodito_token first
          let token = localStorage.getItem("roodito_token");
          console.log(
            "QuizCard: Retrieved roodito_token:",
            token ? `${token.substring(0, 20)}...` : "null"
          );

          // Fallback to auth_token if roodito_token is not available
          if (!token) {
            token = localStorage.getItem("auth_token");
            console.log(
              "QuizCard: Fallback to auth_token:",
              token ? `${token.substring(0, 20)}...` : "null"
            );
          }

          return token;
        }
        return null;
      };

      const token = getToken();

      if (token) {
        // Extract quiz ID from the URL
        const quizIdMatch = quiz.quizLink.match(/\/do-quiz\/([^/?]+)/);
        const quizId = quizIdMatch ? quizIdMatch[1] : null;

        console.log("QuizCard: Extracted quiz ID:", quizId);

        if (quizId) {
          const finalUrl = `https://roodito.com/do-quiz/${quizId}/${token}`;
          console.log("QuizCard: Generated URL:", finalUrl);
          return finalUrl;
        }
      } else {
        console.warn("QuizCard: No roodito_token found in localStorage");
      }

      console.log("QuizCard: Returning original quiz link:", quiz.quizLink);
      return quiz.quizLink;
    } else {
      // Internal quiz with token
      const token =
        typeof window !== "undefined"
          ? localStorage.getItem("auth_token")
          : null;
      const baseUrl = `/quiz/${quiz.id}`;
      const finalUrl = token ? `${baseUrl}?token=${token}` : baseUrl;
      return finalUrl;
    }
  };

  // Handle quiz redirection
  const handleQuizClick = () => {
    if (quiz.quizLink) {
      // Get the URL with session ID appended to path
      const quizUrl = getQuizUrl();

      // Open external quiz link in new tab
      window.open(quizUrl, "_blank");
    } else {
      // Internal quiz
      const token =
        typeof window !== "undefined"
          ? localStorage.getItem("auth_token")
          : null;
      const baseUrl = `/quiz/${quiz.id}`;
      const finalUrl = token ? `${baseUrl}?token=${token}` : baseUrl;
      window.location.href = finalUrl;
    }
  };

  return (
    <Card className="hover:shadow-lg transition-shadow duration-200 border-l-4 border-l-nmg-primary">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3">
            <div className={`p-2 rounded-lg ${subjectColor} text-white`}>
              <IconComponent className="h-4 w-4" />
            </div>
            <div>
              <CardTitle className="text-lg font-semibold text-gray-900">
                {quiz.title}
              </CardTitle>
              <p className="text-sm text-gray-600">{subject}</p>
            </div>
          </div>
          <Badge variant="secondary" className={difficultyColor}>
            {quiz.difficulty}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-4 text-sm text-gray-600">
            <div className="flex items-center space-x-1">
              <Target className="h-4 w-4" />
              <span>
                {quiz.questions || 0}{" "}
                {quiz.questions === 1 ? "Question" : "Questions"}
              </span>
            </div>
            <div className="flex items-center space-x-1">
              <Clock className="h-4 w-4" />
              <span>{quiz.duration} min</span>
            </div>
          </div>
          <Badge variant="outline" className="text-xs">
            {quiz.type}
          </Badge>
        </div>

        <div className="flex items-center justify-between">
          <div className="text-xs text-gray-500">
            {grade} • {system}
          </div>
          <Button
            size="sm"
            className="bg-khan-green hover:bg-khan-green/90 text-white"
            onClick={handleQuizClick}>
            {quiz.quizLink ? "Take Quiz" : "Revise"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
