"use client"

import { useRef, useEffect, useState } from "react"
import Header from "@/components/Header"
import Hero from "@/components/Hero"
import AccordionSection from "@/components/AccordionSection"
import Footer from "@/components/Footer"
import AchievementsSection from "@/components/AchievementsSection"
import ScrollToTop from "@/components/ScrollToTop"
import { Button } from "@/components/ui/button"

// Imported data service for our API data
import { getQuizData, type ApiQuizData, fetchQuizPagesInBatch } from "@/lib/data-service"

export default function HomePage() {
  const [allQuizzes, setAllQuizzes] = useState<any[]>([])
  const [groupedData, setGroupedData] = useState<ApiQuizData | null>(null)
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const [hasMore, setHasMore] = useState(true)
  const sentinelRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    const loadInitial = async () => {
      setLoading(true)
      const quizzes = await fetchQuizPagesInBatch(1, 5, 20)
      setAllQuizzes(quizzes)
      setGroupedData(require("@/lib/api-service").groupQuizzesBySystem(quizzes))
      setPage(5)
      setHasMore(quizzes.length > 0)
      setLoading(false)
    }
    loadInitial()
  }, [])

  const handleLoadMore = async () => {
    if (loadingMore || !hasMore) return
    setLoadingMore(true)
    const nextStart = page + 1
    const nextEnd = page + 5
    const quizzes = await fetchQuizPagesInBatch(nextStart, nextEnd, 20)
    if (quizzes.length === 0) {
      setHasMore(false)
      setLoadingMore(false)
      return
    }
    setAllQuizzes(prev => [...prev, ...quizzes])
    setGroupedData(require("@/lib/api-service").groupQuizzesBySystem([...allQuizzes, ...quizzes]))
    setPage(nextEnd)
    setLoadingMore(false)
  }

  // Infinite scroll effect for both CBC and 8-4-4
  useEffect(() => {
    if (loadingMore || !hasMore) return
    const observer = new window.IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting && !loadingMore && hasMore) {
          handleLoadMore()
        }
      },
      { threshold: 1 }
    )
    if (sentinelRef.current) observer.observe(sentinelRef.current)
    return () => {
      if (sentinelRef.current) observer.unobserve(sentinelRef.current)
    }
  }, [loadingMore, hasMore, groupedData])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-nmg-primary mx-auto mb-4"></div>
            <p className="text-gray-600">Loading revision materials...</p>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  if (!groupedData) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="text-red-500 text-6xl mb-4">⚠️</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">No Data Available</h2>
            <p className="text-gray-600 mb-4">No quiz data is currently available.</p>
            <button
              onClick={() => window.location.reload()} 
              className="bg-nmg-primary text-white px-6 py-2 rounded-lg hover:bg-nmg-primary/90"
            >
              Refresh
            </button>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <Hero />
      {/* Main Content - Revision Structure */}
      <section className="py-16 bg-white">
        <div className="w-full px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Choose Your Education System
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Explore comprehensive revision materials for both CBC and 8-4-4 education systems
            </p>
          </div>
          <div className="space-y-8 max-w-6xl mx-auto">
            {/* CBC System */}
            <div id="cbc">
              <AccordionSection
                title="CBC (Competency Based Curriculum)"
                description="2-6-3-3-3 System: Upper Primary, Junior Secondary, Senior Secondary"
                system="CBC"
                data={(() => {
                  if (!groupedData.CBC) return {};
                  const order = [
                    'Upper Primary',
                    ...Object.keys(groupedData.CBC).filter(l => l !== 'Upper Primary')
                  ];
                  const ordered: typeof groupedData.CBC = {};
                  order.forEach(level => {
                    if (groupedData.CBC[level]) ordered[level] = groupedData.CBC[level];
                  });
                  return ordered;
                })()}
              />
            </div>
            {/* 8-4-4 System */}
            <div id="844">
              <AccordionSection
                title="8-4-4"
                description="Forms 2, 3, and 4"
                system="844"
                data={groupedData["844"]}
              />
            </div>
          </div>
          {/* Infinite scroll sentinel for both CBC and 8-4-4 */}
          <div ref={sentinelRef} />
          {loadingMore && (
            <div className="flex justify-center py-4">
              <span className="animate-spin rounded-full h-8 w-8 border-b-2 border-nmg-primary inline-block"></span>
            </div>
          )}
        </div>
      </section>
      {/* Features Section */}
      <section id="features" className="py-16 bg-gray-50">
        <div className="w-full px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Why Choose Our Revision Portal?
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Comprehensive, curriculum-aligned materials designed for Kenyan students
            </p>
          </div>
          <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 max-w-7xl mx-auto">
            <div className="text-center p-6 bg-white rounded-lg shadow-sm">
              <div className="w-16 h-16 bg-[#002F6C] rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white font-bold text-xl">✓</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Curriculum Aligned</h3>
              <p className="text-gray-600">
                All quizzes are designed according to the official Kenyan curriculum standards
              </p>
            </div>
            <div className="text-center p-6 bg-white rounded-lg shadow-sm">
              <div className="w-16 h-16 bg-[#14BF96] rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white font-bold text-xl">📚</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Comprehensive Coverage</h3>
              <p className="text-gray-600">
                Covering all major subjects across both CBC and 8-4-4 systems
              </p>
            </div>
            <div className="text-center p-6 bg-white rounded-lg shadow-sm">
              <div className="w-16 h-16 bg-yellow-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white font-bold text-xl">🎯</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Practice Focused</h3>
              <p className="text-gray-600">
                Interactive quizzes to help students practice and improve their skills
              </p>
            </div>
          </div>
        </div>
      </section>
      {/* <AchievementsSection /> */}
      <Footer />
      <ScrollToTop />
    </div>
  )
}
