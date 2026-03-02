import Link from "next/link";
import { ArrowRight, Brain, DollarSign, Users, TrendingUp, Shield, Zap } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-gray-800">
      {/* Header */}
      <header className="container mx-auto px-4 py-6">
        <nav className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Brain className="h-8 w-8 text-blue-600" />
            <span className="text-2xl font-bold text-gray-900 dark:text-white">Budget AI</span>
          </div>
          <div className="flex items-center space-x-6">
            <Link href="/login" className="text-gray-600 hover:text-gray-900 dark:text-gray-300">Login</Link>
            <Link href="/signup" className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition">
              Get Started
            </Link>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <h1 className="text-5xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6">
          Family Budgeting,<br />
          <span className="text-blue-600">Powered by AI</span>
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
          Like YNAB, but smarter. AI categorization, proactive alerts, and family collaboration
          that actually works.
        </p>
        <div className="flex justify-center gap-4">
          <Link href="/signup" className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition flex items-center">
            Start Free Trial <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
          <Link href="/demo" className="border border-gray-300 px-8 py-3 rounded-lg hover:bg-gray-50 dark:border-gray-600 dark:hover:bg-gray-800 transition">
            See Demo
          </Link>
        </div>
        <p className="text-sm text-gray-500 mt-4">No credit card required • Cancel anytime</p>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-20">
        <h2 className="text-3xl font-bold text-center mb-12 text-gray-900 dark:text-white">
          Why Budget AI?
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          {/* Feature 1 */}
          <div className="p-6 border border-gray-200 dark:border-gray-700 rounded-lg hover:shadow-lg transition">
            <Brain className="h-12 w-12 text-blue-600 mb-4" />
            <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">AI-Powered Intelligence</h3>
            <p className="text-gray-600 dark:text-gray-300">
              95%+ accurate transaction categorization. Learns your habits. Predicts overspending before it happens.
            </p>
          </div>

          {/* Feature 2 */}
          <div className="p-6 border border-gray-200 dark:border-gray-700 rounded-lg hover:shadow-lg transition">
            <Users className="h-12 w-12 text-blue-600 mb-4" />
            <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">Built for Families</h3>
            <p className="text-gray-600 dark:text-gray-300">
              Multiple users, shared budgets, neutral AI mediator for money talks. No more spreadsheet chaos.
            </p>
          </div>

          {/* Feature 3 */}
          <div className="p-6 border border-gray-200 dark:border-gray-700 rounded-lg hover:shadow-lg transition">
            <TrendingUp className="h-12 w-12 text-blue-600 mb-4" />
            <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">Predictive Forecasting</h3>
            <p className="text-gray-600 dark:text-gray-300">
              See 30-90 days ahead. Know exactly when you'll hit goals. Plan for irregular income.
            </p>
          </div>

          {/* Feature 4 */}
          <div className="p-6 border border-gray-200 dark:border-gray-700 rounded-lg hover:shadow-lg transition">
            <DollarSign className="h-12 w-12 text-blue-600 mb-4" />
            <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">Zero-Based Budgeting</h3>
            <p className="text-gray-600 dark:text-gray-300">
              Every dollar has a job. Multiple methodologies supported. Real-time budget tracking.
            </p>
          </div>

          {/* Feature 5 */}
          <div className="p-6 border border-gray-200 dark:border-gray-700 rounded-lg hover:shadow-lg transition">
            <Shield className="h-12 w-12 text-blue-600 mb-4" />
            <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">Bank-Level Security</h3>
            <p className="text-gray-600 dark:text-gray-300">
              256-bit encryption. SOC 2 compliant. Your data is yours. We never sell or share it.
            </p>
          </div>

          {/* Feature 6 */}
          <div className="p-6 border border-gray-200 dark:border-gray-700 rounded-lg hover:shadow-lg transition">
            <Zap className="h-12 w-12 text-blue-600 mb-4" />
            <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">Context-Aware Coaching</h3>
            <p className="text-gray-600 dark:text-gray-300">
              AI coach that knows when and where you overspend. Personalized insights, not generic tips.
            </p>
          </div>
        </div>
      </section>

      {/* Comparison Section */}
      <section className="bg-gray-50 dark:bg-gray-900 py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-900 dark:text-white">
            Budget AI vs YNAB
          </h2>
          <div className="max-w-3xl mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-100 dark:bg-gray-700">
                <tr>
                  <th className="px-6 py-4 text-left">Feature</th>
                  <th className="px-6 py-4 text-center">Budget AI</th>
                  <th className="px-6 py-4 text-center">YNAB</th>
                </tr>
              </thead>
              <tbody className="divide-y dark:divide-gray-700">
                <tr>
                  <td className="px-6 py-4">AI Categorization</td>
                  <td className="px-6 py-4 text-center text-green-600">✓ 95%+ accuracy</td>
                  <td className="px-6 py-4 text-center text-gray-400">Basic rules</td>
                </tr>
                <tr>
                  <td className="px-6 py-4">Proactive Alerts</td>
                  <td className="px-6 py-4 text-center text-green-600">✓ Before overspending</td>
                  <td className="px-6 py-4 text-center text-gray-400">After the fact</td>
                </tr>
                <tr>
                  <td className="px-6 py-4">PDF Reports</td>
                  <td className="px-6 py-4 text-center text-green-600">✓ Full export</td>
                  <td className="px-6 py-4 text-center text-red-600">✗ No export</td>
                </tr>
                <tr>
                  <td className="px-6 py-4">Family Collaboration</td>
                  <td className="px-6 py-4 text-center text-green-600">✓ Built-in mediator</td>
                  <td className="px-6 py-4 text-center text-gray-400">Basic sharing</td>
                </tr>
                <tr>
                  <td className="px-6 py-4">Learning Curve</td>
                  <td className="px-6 py-4 text-center text-green-600">5 minutes</td>
                  <td className="px-6 py-4 text-center text-gray-400">2-4 weeks</td>
                </tr>
                <tr>
                  <td className="px-6 py-4">Price</td>
                  <td className="px-6 py-4 text-center text-green-600">$8.99/month</td>
                  <td className="px-6 py-4 text-center text-gray-400">$109/year</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <h2 className="text-4xl font-bold mb-4 text-gray-900 dark:text-white">Ready to take control?</h2>
        <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
          Join thousands of families using AI to build better money habits.
        </p>
        <Link href="/signup" className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition inline-flex items-center">
          Start Your Free Trial <ArrowRight className="ml-2 h-5 w-5" />
        </Link>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-200 dark:border-gray-700 py-8">
        <div className="container mx-auto px-4 text-center text-gray-600 dark:text-gray-400">
          <p>&copy; 2026 Budget AI. Built with ❤️ and Claude AI.</p>
        </div>
      </footer>
    </div>
  );
}
