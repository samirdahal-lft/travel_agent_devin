/**
 * Landing page for unauthenticated users.
 */

import Link from 'next/link';
import { Plane, MapPin, DollarSign, Lightbulb } from 'lucide-react';

const features = [
  {
    icon: MapPin,
    title: 'Day-by-Day Itineraries',
    description:
      'Get detailed daily plans with specific activities, timing, and travel routes.',
  },
  {
    icon: DollarSign,
    title: 'Cost Estimates',
    description:
      'Receive comprehensive budget breakdowns including flights, hotels, food, and activities.',
  },
  {
    icon: Lightbulb,
    title: 'Local Tips',
    description:
      'Discover local customs, must-try food, safety tips, and money-saving advice.',
  },
];

export default function HomePage() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 px-4 py-24 text-white sm:px-6 lg:px-8">
        <div className="relative mx-auto max-w-4xl text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm backdrop-blur-sm">
            <Plane className="h-4 w-4" />
            AI-Powered Travel Planning
          </div>
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
            Plan Your Dream Trip
            <br />
            <span className="text-blue-200">in Seconds</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-blue-100">
            Tell us where you want to go, your budget, and preferences. Our AI
            will create a comprehensive travel plan with day-by-day itineraries,
            cost estimates, and local tips.
          </p>
          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              href="/signup"
              className="inline-flex items-center rounded-lg bg-white px-8 py-3.5 text-base font-semibold text-blue-700 shadow-lg transition-all hover:bg-blue-50 hover:shadow-xl"
            >
              Get Started Free
            </Link>
            <Link
              href="/login"
              className="inline-flex items-center rounded-lg border-2 border-white/30 px-8 py-3.5 text-base font-semibold text-white transition-all hover:border-white/60 hover:bg-white/10"
            >
              Log In
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900">
              Everything You Need for the Perfect Trip
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-gray-600">
              Our AI analyzes real-time data to create personalized travel plans
              tailored to your preferences and budget.
            </p>
          </div>
          <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="rounded-xl border border-gray-200 bg-white p-8 shadow-sm transition-shadow hover:shadow-md"
              >
                <div className="mb-4 inline-flex rounded-lg bg-blue-100 p-3">
                  <feature.icon className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">
                  {feature.title}
                </h3>
                <p className="mt-2 text-sm text-gray-600">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-200 bg-white px-4 py-8 text-center text-sm text-gray-500">
        <p>
          &copy; {new Date().getFullYear()} TravelAgent AI. Built with Next.js,
          FastAPI, and Google Gemini.
        </p>
      </footer>
    </div>
  );
}
