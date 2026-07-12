import Link from 'next/link';
import { MessageSquare, Settings, Shield, Cpu } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen bg-[#f8f9fa] flex flex-col justify-between font-sans">
      
      {/* Navbar */}
      <header className="bg-white border-b border-gray-100 shadow-sm py-4 px-8 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-[#075e54] flex items-center justify-center font-bold text-white text-lg shadow-sm">
            B
          </div>
          <span className="font-bold text-lg text-gray-800 tracking-tight">Bioniq Core</span>
        </div>
        <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full">
          <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
          Gateway Active
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 flex flex-col items-center justify-center p-6 sm:p-12 max-w-4xl mx-auto w-full">
        
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight mb-4 sm:text-5xl">
            Secure Support Gateway
          </h1>
          <p className="text-lg text-gray-500 max-w-xl mx-auto leading-relaxed">
            Re-engineered customer care platform for Bioniq internet solutions. Fully independent, standalone system architecture.
          </p>
        </div>

        {/* Portal Options Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full">
          
          {/* Card 1: Customer Chat */}
          <Link href="/chat" className="group">
            <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-8 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 h-full flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-[#075e54] flex items-center justify-center mb-6 group-hover:bg-[#075e54] group-hover:text-white transition-colors duration-300 shadow-sm">
                  <MessageSquare className="w-6 h-6" />
                </div>
                <h2 className="text-xl font-bold text-gray-800 mb-2">Customer Chat Portal</h2>
                <p className="text-sm text-gray-500 leading-relaxed mb-6">
                  Access the simulated WhatsApp support line. Connect with our AI customer support assistant to query packages, log tickets, or track orders.
                </p>
              </div>
              <span className="text-sm font-semibold text-[#075e54] group-hover:underline flex items-center gap-1">
                Enter Chat Client &rarr;
              </span>
            </div>
          </Link>

          {/* Card 2: Agent Console */}
          <Link href="/admin" className="group">
            <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-8 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 h-full flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-[#075e54] flex items-center justify-center mb-6 group-hover:bg-[#075e54] group-hover:text-white transition-colors duration-300 shadow-sm">
                  <Settings className="w-6 h-6" />
                </div>
                <h2 className="text-xl font-bold text-gray-800 mb-2">Agent Control Console</h2>
                <p className="text-sm text-gray-500 leading-relaxed mb-6">
                  Manage active support conversations, support tickets, installation bookings, router hardware orders, and customer subscription records.
                </p>
              </div>
              <span className="text-sm font-semibold text-[#075e54] group-hover:underline flex items-center gap-1">
                Launch Control Panel &rarr;
              </span>
            </div>
          </Link>

        </div>

        {/* Feature Highlights */}
        <div className="grid grid-cols-2 gap-6 mt-16 max-w-md mx-auto w-full text-center">
          <div className="flex flex-col items-center">
            <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 mb-2">
              <Shield className="w-4 h-4" />
            </div>
            <span className="text-xs font-bold text-gray-700">Relational Database</span>
            <span className="text-[10px] text-gray-400">PostgreSQL / SQLite</span>
          </div>
          <div className="flex flex-col items-center">
            <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 mb-2">
              <Cpu className="w-4 h-4" />
            </div>
            <span className="text-xs font-bold text-gray-700">AI Tool Calling</span>
            <span className="text-[10px] text-gray-400">OpenAI / Ollama Orchestrated</span>
          </div>
        </div>

      </main>

      {/* Footer */}
      <footer className="py-6 border-t border-gray-100 bg-white text-center text-xs text-gray-400">
        &copy; {new Date().getFullYear()} Bioniq. All Rights Reserved. Standalone Deployment.
      </footer>

    </div>
  );
}
