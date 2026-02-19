import { ArrowRight, TrendingUp, PieChart, Zap, Shield, BarChart3 } from 'lucide-react';
import { BiZTEQLogo } from '../components/BiZTEQLogo';

interface BiZTEQLandingProps {
  onGetStarted: () => void;
  onPreview: () => void;
}

export function BiZTEQLanding({ onGetStarted, onPreview }: BiZTEQLandingProps) {
  return (
    <div className="dashboard-body min-h-screen bg-white overflow-hidden">
      <nav className="sticky top-0 z-50 bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <BiZTEQLogo size={36} showText={true} />
          <div className="flex gap-4">
            <button
              onClick={onPreview}
              className="px-6 py-2 text-blue-600 font-semibold hover:text-blue-700 transition-colors"
            >
              Preview
            </button>
            <button
              onClick={onGetStarted}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all font-semibold"
            >
              Get Started
            </button>
          </div>
        </div>
      </nav>

      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-indigo-50 pointer-events-none" />

        <section className="relative container mx-auto px-4 py-24 md:py-32">
          <div className="max-w-3xl">
            <p className="text-blue-600 font-semibold text-sm tracking-wider uppercase mb-4">
              Business Intelligence Platform
            </p>
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
              Complex Business Management
              <span className="text-blue-600"> Simplified</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl leading-relaxed">
              BiZTEQ empowers founders and business leaders to gain complete control over their financial metrics, transactions, and strategic roadmap. Make data-driven decisions with confidence.
            </p>
            <div className="flex gap-4">
              <button
                onClick={onGetStarted}
                className="inline-flex items-center gap-2 px-8 py-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all font-semibold text-lg shadow-lg hover:shadow-xl"
              >
                Start Free
                <ArrowRight size={20} />
              </button>
              <button
                onClick={onPreview}
                className="inline-flex items-center gap-2 px-8 py-4 border-2 border-gray-300 text-gray-900 rounded-lg hover:border-gray-400 hover:bg-gray-50 transition-all font-semibold text-lg"
              >
                View Demo
              </button>
            </div>
          </div>
        </section>

        <section className="relative container mx-auto px-4 py-20">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl">
            <FeatureCard
              icon={<PieChart size={28} className="text-blue-600" />}
              title="Business Metrics"
              description="Track total assets, revenue, expenses, and profitability at a glance"
            />
            <FeatureCard
              icon={<TrendingUp size={28} className="text-green-600" />}
              title="Growth Tracking"
              description="Visualize month-over-month growth and identify trends instantly"
            />
            <FeatureCard
              icon={<BarChart3 size={28} className="text-orange-600" />}
              title="Strategic Roadmap"
              description="Plan and monitor your business milestones and objectives"
            />
            <FeatureCard
              icon={<Zap size={28} className="text-amber-600" />}
              title="Smart Analytics"
              description="Get actionable insights from your business data automatically"
            />
            <FeatureCard
              icon={<Shield size={28} className="text-teal-600" />}
              title="Secure & Reliable"
              description="Enterprise-grade security with real-time data synchronization"
            />
            <FeatureCard
              icon={<Zap size={28} className="text-indigo-600" />}
              title="Real-time Updates"
              description="See changes instantly across all your business metrics"
            />
          </div>
        </section>

        <section className="relative container mx-auto px-4 py-20">
          <div className="max-w-5xl mx-auto">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-4xl font-bold text-gray-900 mb-6 leading-tight">
                  For Businesses That Demand More
                </h2>
                <ul className="space-y-4 mb-8">
                  <BenefitItem text="Real-time financial dashboards" />
                  <BenefitItem text="Transaction and asset management" />
                  <BenefitItem text="Strategic roadmap planning" />
                  <BenefitItem text="Advanced analytics & forecasting" />
                  <BenefitItem text="Secure data storage & backups" />
                  <BenefitItem text="Intuitive, fast interface" />
                </ul>
                <button
                  onClick={onGetStarted}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all font-semibold shadow-md hover:shadow-lg"
                >
                  Get Started Now
                  <ArrowRight size={18} />
                </button>
              </div>

              <div className="relative">
                <div className="bg-gradient-to-br from-blue-100 to-indigo-100 rounded-2xl p-8 shadow-xl">
                  <div className="space-y-4">
                    <div className="bg-white rounded-lg p-4 shadow-sm">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-semibold text-gray-700">Total Assets</span>
                        <span className="text-2xl font-bold text-blue-600">$847,500</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-blue-600 h-2 rounded-full" style={{ width: '73%' }} />
                      </div>
                    </div>
                    <div className="bg-white rounded-lg p-4 shadow-sm">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-semibold text-gray-700">Monthly Revenue</span>
                        <span className="text-2xl font-bold text-green-600">$45,200</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-green-600 h-2 rounded-full" style={{ width: '68%' }} />
                      </div>
                    </div>
                    <div className="bg-white rounded-lg p-4 shadow-sm">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-semibold text-gray-700">Net Profit Margin</span>
                        <span className="text-2xl font-bold text-teal-600">32.8%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-teal-600 h-2 rounded-full" style={{ width: '82%' }} />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="relative container mx-auto px-4 py-20 bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl mx-4 text-white">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-4">Ready to Master Your Business?</h2>
            <p className="text-blue-100 text-lg mb-8">
              Join businesses that have transformed their financial tracking and strategic planning.
            </p>
            <button
              onClick={onGetStarted}
              className="inline-flex items-center gap-2 px-8 py-4 bg-white text-blue-600 rounded-lg hover:bg-blue-50 transition-all font-semibold shadow-lg hover:shadow-xl"
            >
              Start Your Free Trial
              <ArrowRight size={20} />
            </button>
          </div>
        </section>

        <footer className="border-t border-gray-200 bg-white py-12 mt-12">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-center gap-3 text-gray-600 mb-4">
              <BiZTEQLogo size={24} showText={false} />
              <span className="font-semibold">BiZTEQ</span>
              <span className="mx-2 text-gray-400">•</span>
              <span className="text-sm">Complex Business Management Simplified</span>
            </div>
            <p className="text-center text-sm text-gray-500">
              Trusted by businesses worldwide to simplify complex financial management
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
}

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

function FeatureCard({ icon, title, description }: FeatureCardProps) {
  return (
    <div className="p-6 rounded-xl border border-gray-200 bg-white hover:shadow-lg hover:border-gray-300 transition-all group">
      <div className="mb-4 group-hover:scale-110 transition-transform">{icon}</div>
      <h3 className="text-lg font-bold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600 text-sm leading-relaxed">{description}</p>
    </div>
  );
}

interface BenefitItemProps {
  text: string;
}

function BenefitItem({ text }: BenefitItemProps) {
  return (
    <li className="flex items-start gap-3">
      <div className="flex-shrink-0 mt-1">
        <div className="flex items-center justify-center h-5 w-5 rounded-full bg-blue-600">
          <svg className="h-3 w-3 text-white" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
        </div>
      </div>
      <span className="text-gray-700 font-medium">{text}</span>
    </li>
  );
}
