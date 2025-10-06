"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Trophy,
  TrendingUp,
  Clock,
  Target,
  Star,
  Award,
  Calendar,
  BookOpen,
  Users,
  BarChart3,
} from "lucide-react";

// Imported data service for our mock data
import {
  getAchievementsData,
  type AchievementsData,
  type LeaderboardPlayer,
} from "@/lib/data-service";

export default function AchievementsSection() {
  const [activeTab, setActiveTab] = useState<
    "overview" | "scores" | "leaderboard" | "progress"
  >("overview");
  const [error, setError] = useState<string | null>(null);
  const [achievementsData, setAchievementsData] =
    useState<AchievementsData | null>(null);

  // Load achievements data on component mount
  useEffect(() => {
    try {
      const data = getAchievementsData();
      setAchievementsData(data);
    } catch (err) {
      setError("Failed to load achievements data");
    }
  }, []);

  // Handle potential data errors
  if (error || !achievementsData) {
    return (
      <section className="py-16 bg-white">
        <div className="w-full px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="text-red-500 text-6xl mb-4">⚠️</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Error Loading Achievements
            </h2>
            <p className="text-gray-600">
              {error || "Failed to load achievements data"}
            </p>
          </div>
        </div>
      </section>
    );
  }

  const tabs = [
    { id: "overview", label: "Overview", icon: BarChart3 },
    { id: "scores", label: "Past Scores", icon: BookOpen },
    { id: "leaderboard", label: "Leaderboard", icon: Trophy },
    { id: "progress", label: "Progress", icon: TrendingUp },
  ];

  const getScoreColor = (score: number) => {
    if (score >= 90) return "text-green-600";
    if (score >= 80) return "text-blue-600";
    if (score >= 70) return "text-yellow-600";
    return "text-red-600";
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Easy":
        return "bg-green-100 text-green-800";
      case "Medium":
        return "bg-yellow-100 text-yellow-800";
      case "Hard":
        return "bg-red-100 text-red-800";
      // Year-based colors (fallback for year values)
      case "2024":
        return "bg-blue-100 text-blue-800";
      case "2023":
        return "bg-purple-100 text-purple-800";
      case "2022":
        return "bg-indigo-100 text-indigo-800";
      case "2021":
        return "bg-pink-100 text-pink-800";
      case "2020":
        return "bg-teal-100 text-teal-800";
      // Full year text colors
      case "2025 Compass Prediction":
        return "bg-emerald-100 text-emerald-800";
      case "2024 Compass Prediction":
        return "bg-blue-100 text-blue-800";
      case "2023 Compass Prediction":
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <section className="py-16 bg-white">
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Your Achievements
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Track your progress, view past scores, and compete on leaderboards
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <Button
                key={tab.id}
                variant={activeTab === tab.id ? "default" : "outline"}
                onClick={() =>
                  setActiveTab(
                    tab.id as "overview" | "scores" | "leaderboard" | "progress"
                  )
                }
                className={`flex items-center gap-2 transition-all duration-200 ${
                  activeTab === tab.id
                    ? "bg-nmg-primary hover:bg-nmg-primary/90"
                    : "hover:bg-nmg-primary/10"
                }`}>
                <Icon className="h-4 w-4" />
                {tab.label}
              </Button>
            );
          })}
        </div>

        {/* Tab Content */}
        <div className="max-w-7xl mx-auto">
          {activeTab === "overview" && (
            <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
              {/* User Stats Card */}
              <Card className="bg-gradient-to-br from-nmg-primary to-nmg-accent text-white">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    Your Stats
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold">
                        {achievementsData.userStats?.totalQuizzesTaken || 0}
                      </div>
                      <div className="text-sm opacity-80">Quizzes Taken</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold">
                        {achievementsData.userStats?.averageScore || 0}%
                      </div>
                      <div className="text-sm opacity-80">Avg Score</div>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold">
                        {achievementsData.userStats?.streakDays || 0}
                      </div>
                      <div className="text-sm opacity-80">Day Streak</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold">
                        #{achievementsData.userStats?.rank || 0}
                      </div>
                      <div className="text-sm opacity-80">Rank</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Recent Achievements */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Award className="h-5 w-5 text-nmg-primary" />
                    Recent Achievements
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {(achievementsData.achievements || [])
                      .slice(0, 3)
                      .map((achievement) => (
                        <div
                          key={achievement.id}
                          className="flex items-center gap-3">
                          <div className="text-2xl">{achievement.icon}</div>
                          <div className="flex-1">
                            <div className="font-medium text-sm">
                              {achievement.title}
                            </div>
                            <div className="text-xs text-gray-500">
                              {achievement.description}
                            </div>
                          </div>
                          {achievement.unlocked ? (
                            <Badge
                              variant="secondary"
                              className="bg-green-100 text-green-800">
                              Unlocked
                            </Badge>
                          ) : (
                            <div className="text-xs text-gray-400">
                              {achievement.progress}%
                            </div>
                          )}
                        </div>
                      ))}
                  </div>
                </CardContent>
              </Card>

              {/* Weekly Activity */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-nmg-primary" />
                    Weekly Activity
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {(achievementsData.progress?.weeklyActivity || []).map(
                      (
                        day: { day: string; quizzes: number; time: number },
                        index: number
                      ) => (
                        <div
                          key={index}
                          className="flex items-center justify-between">
                          <span className="text-sm font-medium">{day.day}</span>
                          <div className="flex items-center gap-4">
                            <span className="text-xs text-gray-500">
                              {day.quizzes} quizzes
                            </span>
                            <span className="text-xs text-gray-500">
                              {day.time}m
                            </span>
                          </div>
                        </div>
                      )
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {activeTab === "scores" && (
            <div className="space-y-6">
              <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {(achievementsData.pastScores || []).map((score) => (
                  <Card
                    key={score.id}
                    className="hover:shadow-lg transition-shadow duration-200">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <CardTitle className="text-lg">
                            {score.title}
                          </CardTitle>
                          <div className="flex items-center gap-2 mt-2">
                            <Badge variant="outline" className="text-xs">
                              {score.subject}
                            </Badge>
                            <Badge variant="outline" className="text-xs">
                              {score.grade}
                            </Badge>
                          </div>
                        </div>
                        <div
                          className={`text-2xl font-bold ${getScoreColor(score.score)}`}>
                          {score.score}%
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex justify-between text-sm">
                          <span>
                            Questions: {score.correctAnswers}/
                            {score.totalQuestions}
                          </span>
                          <span className="text-gray-500">
                            {score.timeTaken}
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <Badge
                            className={getDifficultyColor(score.difficulty)}>
                            {score.difficulty}
                          </Badge>
                          <span className="text-xs text-gray-500">
                            {score.date}
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {activeTab === "leaderboard" && (
            <div className="space-y-8">
              {/* Overall Leaderboard */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Trophy className="h-5 w-5 text-yellow-500" />
                    Overall Leaderboard
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {(achievementsData.leaderboards?.overall || []).map(
                      (player) => (
                        <div
                          key={player.rank}
                          className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                          <div className="flex items-center justify-center w-8 h-8 rounded-full bg-nmg-primary text-white font-bold text-sm">
                            {player.rank}
                          </div>
                          <div className="flex items-center gap-3 flex-1">
                            <span className="text-2xl">{player.avatar}</span>
                            <div>
                              <div className="font-semibold text-gray-900">
                                {player.name}
                              </div>
                              <div className="text-sm text-gray-500">
                                {player.school}
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="font-bold text-gray-900">
                              {player.totalScore}
                            </div>
                            <div className="text-sm text-gray-500">
                              {player.averageScore}% avg
                            </div>
                          </div>
                        </div>
                      )
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Subject Leaderboards */}
              <div className="grid sm:grid-cols-1 md:grid-cols-2 gap-6">
                {Object.entries(
                  achievementsData.leaderboards?.bySubject || {}
                ).map(([subject, players]) => (
                  <Card key={subject}>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <BookOpen className="h-5 w-5 text-nmg-primary" />
                        {subject} Top Performers
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {(players as LeaderboardPlayer[])
                          .slice(0, 3)
                          .map((player) => (
                            <div
                              key={player.rank}
                              className="flex items-center gap-3">
                              <div className="flex items-center justify-center w-6 h-6 rounded-full bg-nmg-primary text-white font-bold text-xs">
                                {player.rank}
                              </div>
                              <span className="text-lg">{player.avatar}</span>
                              <div className="flex-1">
                                <div className="font-medium text-sm">
                                  {player.name}
                                </div>
                                <div className="text-xs text-gray-500">
                                  {player.school}
                                </div>
                              </div>
                              <div className="text-right">
                                <div className="font-bold text-sm">
                                  {player.averageScore}%
                                </div>
                              </div>
                            </div>
                          ))}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {activeTab === "progress" && (
            <div className="space-y-8">
              {/* Progress Overview */}
              <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                        <TrendingUp className="h-6 w-6 text-green-600" />
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-gray-900">
                          {achievementsData.userStats?.averageScore || 0}%
                        </div>
                        <div className="text-sm text-gray-500">
                          Average Score
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                        <Target className="h-6 w-6 text-blue-600" />
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-gray-900">
                          {achievementsData.userStats?.totalQuizzesTaken || 0}
                        </div>
                        <div className="text-sm text-gray-500">
                          Quizzes Completed
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
                        <Clock className="h-6 w-6 text-yellow-600" />
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-gray-900">
                          {achievementsData.userStats?.streakDays || 0}
                        </div>
                        <div className="text-sm text-gray-500">Day Streak</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                        <Star className="h-6 w-6 text-purple-600" />
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-gray-900">
                          #{achievementsData.userStats?.rank || 0}
                        </div>
                        <div className="text-sm text-gray-500">Global Rank</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Weekly Progress Chart */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5 text-nmg-primary" />
                    Weekly Progress
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {(achievementsData.progress?.weeklyActivity || []).map(
                      (
                        day: { day: string; quizzes: number; time: number },
                        index: number
                      ) => (
                        <div key={index} className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="font-medium">{day.day}</span>
                            <span className="text-gray-500">
                              {day.quizzes} quizzes • {day.time}m
                            </span>
                          </div>
                          <Progress
                            value={(day.quizzes / 10) * 100}
                            className="h-2"
                          />
                        </div>
                      )
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
