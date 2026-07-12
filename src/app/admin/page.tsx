'use client';

import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { 
  Users, Ticket, Calendar, ShoppingCart, Package, MessageSquare, 
  Settings, LogOut, Edit, Trash2, RefreshCw, Send
} from 'lucide-react';

type TabType = 'overview' | 'chats' | 'customers' | 'tickets' | 'appointments' | 'products' | 'orders';

interface Customer {
  id: string;
  name: string;
  phone: string;
  email: string;
  status: string;
  internetPlan: string;
  monthlyFee: number;
}

interface Thread {
  id: string;
  customer?: Customer;
  lastBotResponse?: string;
  status: string;
  updatedAt: string;
}

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot' | 'agent';
  timestamp: string;
}

interface Ticket {
  id: string;
  customer?: Customer;
  category: string;
  priority: string;
  status: string;
  assignedAgent?: string;
}

interface Appointment {
  id: string;
  customer?: Customer;
  type: string;
  date: string;
  timeSlot: string;
  technician?: string;
  status: string;
}

interface Product {
  id: string;
  sku: string;
  name: string;
  category: string;
  price: number;
  stockQuantity: number;
  availability: string;
}

interface Order {
  id: string;
  customer?: Customer;
  itemsOrdered: string;
  totalAmount: number;
  trackingNumber?: string;
  paymentStatus: string;
  status: string;
}

interface EditableType {
  id: string;
  name?: string;
  phone?: string;
  email?: string;
  status?: string;
  internetPlan?: string;
  monthlyFee?: number;
  priority?: string;
  category?: string;
  assignedAgent?: string;
  type?: string;
  date?: string;
  timeSlot?: string;
  technician?: string;
  sku?: string;
  price?: number;
  stockQuantity?: number;
  availability?: string;
  itemsOrdered?: string;
  totalAmount?: number;
  trackingNumber?: string;
  paymentStatus?: string;
}

export default function AdminPortal() {
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const [loading, setLoading] = useState(true);
  
  // Data lists
  const [threads, setThreads] = useState<Thread[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);

  // Selected items for detail views / editing
  const [activeThread, setActiveThread] = useState<Thread | null>(null);
  const [threadMessages, setThreadMessages] = useState<Message[]>([]);
  const [agentReply, setAgentReply] = useState('');
  const [editingItem, setEditingItem] = useState<EditableType | null>(null);
  const [editingModel, setEditingModel] = useState<TabType | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Fetch all data
  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [threadsRes, custRes, tickRes, appRes, prodRes, ordRes] = await Promise.all([
        fetch('/api/threads'),
        fetch('/api/admin?model=customers'),
        fetch('/api/admin?model=tickets'),
        fetch('/api/admin?model=appointments'),
        fetch('/api/admin?model=products'),
        fetch('/api/admin?model=orders')
      ]);

      const [threadsData, custData, tickData, appData, prodData, ordData] = await Promise.all([
        threadsRes.json(),
        custRes.json(),
        tickRes.json(),
        appRes.json(),
        prodRes.json(),
        ordRes.json()
      ]);

      setThreads(threadsData);
      setCustomers(custData);
      setTickets(tickData);
      setAppointments(appData);
      setProducts(prodData);
      setOrders(ordData);
    } catch (err) {
      console.error('Error fetching admin data:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let active = true;
    const load = async () => {
      if (active) {
        await fetchData();
      }
    };
    load();
    return () => {
      active = false;
    };
  }, [fetchData]);

  // Poll for message updates in active thread every 3 seconds
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (activeThread) {
      timer = setInterval(async () => {
        try {
          const res = await fetch(`/api/threads/${activeThread.id}/messages`);
          const msgData = await res.json();
          setThreadMessages(msgData);
        } catch (err) {
          console.error(err);
        }
      }, 3000);
    }
    return () => clearInterval(timer);
  }, [activeThread]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [threadMessages]);

  const handleSelectThread = async (thread: Thread) => {
    setActiveThread(thread);
    try {
      const res = await fetch(`/api/threads/${thread.id}/messages`);
      const data = await res.json();
      setThreadMessages(data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSendAgentReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!agentReply.trim() || !activeThread) return;

    try {
      const res = await fetch(`/api/threads/${activeThread.id}/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: agentReply, sender: 'agent' }),
      });
      if (res.ok) {
        const newMsg = await res.json();
        setThreadMessages(prev => [...prev, newMsg]);
        setAgentReply('');
        // Refresh thread metadata list
        const listRes = await fetch('/api/threads');
        const listData = await listRes.json();
        setThreads(listData);
        const updatedThread = listData.find((t: Thread) => t.id === activeThread.id);
        if (updatedThread) setActiveThread(updatedThread);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingModel || !editingItem) return;

    try {
      const res = await fetch(`/api/admin?model=${editingModel}&id=${editingItem.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingItem),
      });
      if (res.ok) {
        setEditingItem(null);
        setEditingModel(null);
        fetchData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteItem = async (model: TabType, id: string) => {
    if (!confirm('Are you sure you want to delete this record?')) return;
    try {
      const res = await fetch(`/api/admin?model=${model}&id=${id}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        fetchData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Stats for Overview tab
  const stats = useMemo(() => {
    return {
      activeChats: threads.filter(t => t.status === 'active' || t.status === 'waiting').length,
      openTickets: tickets.filter(t => t.status === 'open' || t.status === 'in-progress').length,
      appointmentsScheduled: appointments.filter(a => a.status === 'scheduled').length,
      inventoryCount: products.length,
      ordersPending: orders.filter(o => o.status === 'pending' || o.status === 'confirmed').length,
    };
  }, [threads, tickets, appointments, products, orders]);

  return (
    <div className="flex h-screen bg-[#f0f2f5] text-gray-800 font-sans overflow-hidden">
      
      {/* Sidebar */}
      <aside className="w-64 bg-[#075e54] text-white flex flex-col flex-shrink-0">
        <div className="p-5 border-b border-white/10 flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center font-bold text-white text-xl">
            B
          </div>
          <div>
            <h1 className="font-bold text-lg leading-none">Bioniq Core</h1>
            <span className="text-xs text-white/60">Enterprise Console</span>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {[
            { id: 'overview', label: 'Dashboard', icon: Settings },
            { id: 'chats', label: 'Support Chats', icon: MessageSquare, badge: stats.activeChats },
            { id: 'customers', label: 'Customers', icon: Users },
            { id: 'tickets', label: 'Support Tickets', icon: Ticket, badge: stats.openTickets },
            { id: 'appointments', label: 'Appointments', icon: Calendar },
            { id: 'products', label: 'Product Inventory', icon: Package },
            { id: 'orders', label: 'Hardware Orders', icon: ShoppingCart },
          ].map((item) => {
            const Icon = item.icon;
            const active = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => { setActiveTab(item.id as TabType); setEditingItem(null); }}
                className={`w-full flex items-center justify-between px-4 py-2.5 rounded-lg text-sm font-medium transition duration-150 ${
                  active 
                    ? 'bg-white/10 text-white shadow-inner' 
                    : 'text-white/80 hover:bg-white/5 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </div>
                {item.badge !== undefined && item.badge > 0 && (
                  <span className="bg-red-500 text-white text-xxs px-2 py-0.5 rounded-full font-bold">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        <div className="p-4 border-t border-white/10">
          <button 
            onClick={() => window.location.href = '/chat'}
            className="w-full flex items-center gap-3 px-4 py-2 text-sm font-medium text-white/80 hover:bg-white/5 hover:text-white rounded-lg transition"
          >
            <LogOut className="w-4 h-4" />
            <span>Customer View</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden bg-white">
        
        {/* Top Header */}
        <header className="h-16 border-b border-gray-200 flex items-center justify-between px-8 flex-shrink-0 bg-white shadow-sm">
          <div className="flex items-center gap-4">
            <h2 className="text-xl font-bold text-gray-800 capitalize">
              {activeTab === 'overview' ? 'Dashboard Overview' : activeTab}
            </h2>
            <button 
              onClick={fetchData}
              className="p-2 hover:bg-gray-100 rounded-full transition text-gray-500 hover:text-[#075e54]"
              title="Refresh Data"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </button>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm font-medium text-gray-600">Logged in as Agent</span>
            <div className="w-8 h-8 rounded-full bg-[#075e54] text-white flex items-center justify-center font-bold text-sm shadow">
              A
            </div>
          </div>
        </header>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-8 bg-[#f8f9fa]">
          
          {/* TAB 1: OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="space-y-8">
              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
                {[
                  { label: 'Active Chat Sessions', val: stats.activeChats, icon: MessageSquare, color: 'bg-emerald-500' },
                  { label: 'Open Support Tickets', val: stats.openTickets, icon: Ticket, color: 'bg-amber-500' },
                  { label: 'Technician Bookings', val: stats.appointmentsScheduled, icon: Calendar, color: 'bg-blue-500' },
                  { label: 'Pending Router Orders', val: stats.ordersPending, icon: ShoppingCart, color: 'bg-violet-500' },
                  { label: 'Catalog Products', val: stats.inventoryCount, icon: Package, color: 'bg-gray-500' }
                ].map((stat, i) => {
                  const Icon = stat.icon;
                  return (
                    <div key={i} className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between">
                      <div>
                        <span className="text-xs text-gray-500 font-bold block mb-1">{stat.label}</span>
                        <span className="text-2xl font-extrabold text-gray-900">{stat.val}</span>
                      </div>
                      <div className={`p-3 rounded-lg text-white ${stat.color} shadow-lg`}>
                        <Icon className="w-5 h-5" />
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Quick Actions Panel */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 lg:col-span-2">
                  <h3 className="text-base font-bold text-gray-800 mb-4">Core Relational Models</h3>
                  <p className="text-sm text-gray-500 leading-relaxed mb-6">
                    This admin portal communicates directly with a local SQLite database that replaces the previous Taskade workspace sheets. Support tickets and technician bookings generated by the customer support bot on the WhatsApp UI populate here in real-time.
                  </p>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    <button onClick={() => setActiveTab('chats')} className="p-4 bg-emerald-50 hover:bg-emerald-100 border border-emerald-100 rounded-lg text-left text-emerald-800 transition">
                      <MessageSquare className="w-5 h-5 mb-2" />
                      <span className="font-semibold block text-sm">Active Chat Queue</span>
                      <span className="text-xs text-emerald-600/80">Manage customer queries</span>
                    </button>
                    <button onClick={() => setActiveTab('tickets')} className="p-4 bg-amber-50 hover:bg-amber-100 border border-amber-100 rounded-lg text-left text-amber-800 transition">
                      <Ticket className="w-5 h-5 mb-2" />
                      <span className="font-semibold block text-sm">Support Tickets</span>
                      <span className="text-xs text-amber-600/80">Track connection issues</span>
                    </button>
                    <button onClick={() => setActiveTab('appointments')} className="p-4 bg-blue-50 hover:bg-blue-100 border border-blue-100 rounded-lg text-left text-blue-800 transition">
                      <Calendar className="w-5 h-5 mb-2" />
                      <span className="font-semibold block text-sm">Fiber Setup Appointments</span>
                      <span className="text-xs text-blue-600/80">Manage tech assignments</span>
                    </button>
                  </div>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col justify-between">
                  <div>
                    <h3 className="text-base font-bold text-gray-800 mb-2">Secure Support Gateway</h3>
                    <p className="text-xs text-gray-500 leading-relaxed mb-4">
                      End-users chat with a simulated WhatsApp agent which performs real database reads/writes using OpenAI/Ollama tool calling or rule-based seeding fallbacks.
                    </p>
                  </div>
                  <button 
                    onClick={() => window.open('/chat', '_blank')}
                    className="w-full text-center bg-[#075e54] hover:bg-[#054c43] text-white py-2.5 rounded-lg text-sm font-semibold transition"
                  >
                    Open Customer Chat
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: SUPPORT CHATS (LIVESTREAM CONSOLE) */}
          {activeTab === 'chats' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 h-[calc(100vh-12rem)] min-h-[400px]">
              
              {/* Active Threads List */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-y-auto">
                <div className="p-4 border-b border-gray-100 bg-gray-50">
                  <h3 className="font-bold text-gray-700 text-sm">Active Conversations</h3>
                </div>
                <div className="divide-y divide-gray-100">
                  {threads.length === 0 ? (
                    <div className="p-8 text-center text-gray-400 text-sm">No active support sessions</div>
                  ) : (
                    threads.map((thread) => {
                      const active = activeThread?.id === thread.id;
                      return (
                        <button
                          key={thread.id}
                          onClick={() => handleSelectThread(thread)}
                          className={`w-full text-left p-4 hover:bg-gray-50 transition flex flex-col gap-1.5 ${
                            active ? 'bg-emerald-50/50 border-r-4 border-[#075e54]' : ''
                          }`}
                        >
                          <div className="flex justify-between items-center w-full">
                            <span className="font-bold text-gray-900 text-sm">{thread.customer?.name}</span>
                            <span className="text-[10px] text-gray-400 font-medium">
                              {new Date(thread.updatedAt).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                            </span>
                          </div>
                          <div className="flex justify-between items-center w-full text-xs text-gray-500">
                            <span className="truncate max-w-[150px]">{thread.lastBotResponse || 'No messages yet'}</span>
                            <span className={`px-2 py-0.5 rounded text-[9px] font-bold ${
                              thread.status === 'escalated' ? 'bg-purple-100 text-purple-700' :
                              thread.status === 'waiting' ? 'bg-amber-100 text-amber-700' :
                              'bg-emerald-100 text-emerald-700'
                            }`}>
                              {thread.status}
                            </span>
                          </div>
                        </button>
                      );
                    })
                  )}
                </div>
              </div>

              {/* Chat View Panel */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 lg:col-span-2 flex flex-col overflow-hidden">
                {activeThread ? (
                  <>
                    {/* Header */}
                    <div className="p-4 border-b border-gray-100 bg-gray-50 flex items-center justify-between flex-shrink-0">
                      <div>
                        <h4 className="font-bold text-gray-800 text-sm">{activeThread.customer?.name}</h4>
                        <span className="text-xs text-gray-400 font-medium">Phone: {activeThread.customer?.phone}</span>
                      </div>
                      <div className="flex gap-2">
                        <select 
                          value={activeThread.status}
                          onChange={() => {}}
                          className="text-xs border border-gray-200 rounded px-2 py-1 focus:outline-none"
                          disabled
                        >
                          <option value="active">Active</option>
                          <option value="waiting">Waiting</option>
                          <option value="escalated">Escalated</option>
                          <option value="resolved">Resolved</option>
                        </select>
                      </div>
                    </div>

                    {/* Messages Body */}
                    <div className="flex-1 p-6 overflow-y-auto bg-gray-50 space-y-4">
                      {threadMessages.map((msg) => {
                        const isAgent = msg.sender === 'agent';
                        const isUser = msg.sender === 'user';
                        return (
                          <div 
                            key={msg.id} 
                            className={`flex ${isUser ? 'justify-start' : 'justify-end'}`}
                          >
                            <div className={`rounded-lg px-4 py-2.5 max-w-[70%] shadow-sm ${
                              isUser 
                                ? 'bg-white text-gray-800 border border-gray-200' 
                                : isAgent
                                ? 'bg-[#e7f2f8] text-gray-900 border border-[#d1e5f0]'
                                : 'bg-[#d9fdd3] text-gray-900'
                            }`}>
                              <span className="text-[10px] block font-bold text-[#075e54]/80 mb-0.5 select-none">
                                {isUser ? 'Customer' : isAgent ? 'Agent' : 'Support Bot'}
                              </span>
                              <p className="text-sm whitespace-pre-line leading-relaxed">{msg.text}</p>
                              <span className="text-[9px] text-gray-400 text-right block mt-1">
                                {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                              </span>
                            </div>
                          </div>
                        );
                      })}
                      <div ref={messagesEndRef} />
                    </div>

                    {/* Footer input */}
                    <form onSubmit={handleSendAgentReply} className="p-4 border-t border-gray-100 flex gap-2 bg-white flex-shrink-0">
                      <input
                        type="text"
                        value={agentReply}
                        onChange={(e) => setAgentReply(e.target.value)}
                        placeholder="Type message to takeover and reply as Support Representative..."
                        className="flex-1 px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#075e54] text-sm text-black"
                      />
                      <button
                        type="submit"
                        className="bg-[#075e54] hover:bg-[#054c43] text-white px-4 py-2 rounded-lg transition active:scale-95 flex items-center justify-center"
                      >
                        <Send className="w-4 h-4" />
                      </button>
                    </form>
                  </>
                ) : (
                  <div className="flex-1 flex flex-col items-center justify-center text-gray-400 p-8">
                    <MessageSquare className="w-12 h-12 mb-3 stroke-1" />
                    <p className="text-sm">Select a support session from the sidebar queue to monitor or takeover manually.</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 3: CUSTOMERS */}
          {activeTab === 'customers' && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200 text-xs font-bold text-gray-500 uppercase tracking-wider">
                    <th className="p-4">Name</th>
                    <th className="p-4">Phone</th>
                    <th className="p-4">Email</th>
                    <th className="p-4">Internet Plan</th>
                    <th className="p-4">Monthly Fee</th>
                    <th className="p-4">Status</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-sm">
                  {customers.map((c) => (
                    <tr key={c.id} className="hover:bg-gray-50/50">
                      <td className="p-4 font-bold text-gray-900">{c.name}</td>
                      <td className="p-4 text-gray-500">{c.phone}</td>
                      <td className="p-4 text-gray-500">{c.email}</td>
                      <td className="p-4 text-gray-700">{c.internetPlan}</td>
                      <td className="p-4 font-semibold text-gray-900">R{c.monthlyFee}</td>
                      <td className="p-4">
                        <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                          c.status === 'active' ? 'bg-emerald-100 text-emerald-700' :
                          c.status === 'suspended' ? 'bg-red-100 text-red-700' :
                          'bg-amber-100 text-amber-700'
                        }`}>
                          {c.status}
                        </span>
                      </td>
                      <td className="p-4 text-right flex justify-end gap-2">
                        <button 
                          onClick={() => { setEditingItem(c); setEditingModel('customers'); }}
                          className="p-1 hover:bg-gray-100 rounded text-gray-500 hover:text-blue-600 transition"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => handleDeleteItem('customers', c.id)}
                          className="p-1 hover:bg-gray-100 rounded text-gray-500 hover:text-red-600 transition"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* TAB 4: SUPPORT TICKETS */}
          {activeTab === 'tickets' && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200 text-xs font-bold text-gray-500 uppercase tracking-wider">
                    <th className="p-4">ID</th>
                    <th className="p-4">Customer</th>
                    <th className="p-4">Category</th>
                    <th className="p-4">Priority</th>
                    <th className="p-4">Status</th>
                    <th className="p-4">Assigned Agent</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-sm">
                  {tickets.map((t) => (
                    <tr key={t.id} className="hover:bg-gray-50/50">
                      <td className="p-4 font-bold text-[#075e54]">{t.id}</td>
                      <td className="p-4 font-medium text-gray-900">{t.customer?.name}</td>
                      <td className="p-4 text-gray-500 capitalize">{t.category}</td>
                      <td className="p-4">
                        <span className={`px-2 py-0.5 rounded text-xs font-bold ${
                          t.priority === 'critical' ? 'bg-red-100 text-red-700' :
                          t.priority === 'high' ? 'bg-orange-100 text-orange-700' :
                          t.priority === 'medium' ? 'bg-amber-100 text-amber-700' :
                          'bg-blue-100 text-blue-700'
                        }`}>
                          {t.priority}
                        </span>
                      </td>
                      <td className="p-4">
                        <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                          t.status === 'resolved' ? 'bg-emerald-100 text-emerald-700' :
                          t.status === 'in-progress' ? 'bg-amber-100 text-amber-700' :
                          t.status === 'open' ? 'bg-blue-100 text-blue-700' :
                          'bg-gray-100 text-gray-700'
                        }`}>
                          {t.status}
                        </span>
                      </td>
                      <td className="p-4 text-gray-500">{t.assignedAgent || 'Unassigned'}</td>
                      <td className="p-4 text-right flex justify-end gap-2">
                        <button 
                          onClick={() => { setEditingItem(t); setEditingModel('tickets'); }}
                          className="p-1 hover:bg-gray-100 rounded text-gray-500 hover:text-blue-600 transition"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => handleDeleteItem('tickets', t.id)}
                          className="p-1 hover:bg-gray-100 rounded text-gray-500 hover:text-red-600 transition"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* TAB 5: APPOINTMENTS */}
          {activeTab === 'appointments' && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200 text-xs font-bold text-gray-500 uppercase tracking-wider">
                    <th className="p-4">Customer</th>
                    <th className="p-4">Installation Type</th>
                    <th className="p-4">Date</th>
                    <th className="p-4">Time Slot</th>
                    <th className="p-4">Technician</th>
                    <th className="p-4">Status</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-sm">
                  {appointments.map((a) => (
                    <tr key={a.id} className="hover:bg-gray-50/50">
                      <td className="p-4 font-bold text-gray-900">{a.customer?.name}</td>
                      <td className="p-4 text-gray-500 capitalize">{a.type.replace('-', ' ')}</td>
                      <td className="p-4 text-gray-500">{new Date(a.date).toLocaleDateString()}</td>
                      <td className="p-4 text-gray-700">{a.timeSlot}</td>
                      <td className="p-4 font-medium text-gray-800">{a.technician || 'Unassigned'}</td>
                      <td className="p-4">
                        <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                          a.status === 'completed' ? 'bg-emerald-100 text-emerald-700' :
                          a.status === 'scheduled' ? 'bg-blue-100 text-blue-700' :
                          'bg-amber-100 text-amber-700'
                        }`}>
                          {a.status}
                        </span>
                      </td>
                      <td className="p-4 text-right flex justify-end gap-2">
                        <button 
                          onClick={() => { setEditingItem(a); setEditingModel('appointments'); }}
                          className="p-1 hover:bg-gray-100 rounded text-gray-500 hover:text-blue-600 transition"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => handleDeleteItem('appointments', a.id)}
                          className="p-1 hover:bg-gray-100 rounded text-gray-500 hover:text-red-600 transition"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* TAB 6: PRODUCTS */}
          {activeTab === 'products' && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200 text-xs font-bold text-gray-500 uppercase tracking-wider">
                    <th className="p-4">SKU</th>
                    <th className="p-4">Product Name</th>
                    <th className="p-4">Category</th>
                    <th className="p-4">Price</th>
                    <th className="p-4">Stock</th>
                    <th className="p-4">Availability</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-sm">
                  {products.map((p) => (
                    <tr key={p.id} className="hover:bg-gray-50/50">
                      <td className="p-4 font-bold text-gray-500">{p.sku}</td>
                      <td className="p-4 font-bold text-gray-900">{p.name}</td>
                      <td className="p-4 text-gray-500">{p.category}</td>
                      <td className="p-4 font-semibold text-gray-900">R{p.price}</td>
                      <td className="p-4 text-gray-700">{p.stockQuantity}</td>
                      <td className="p-4">
                        <span className={`px-2 py-0.5 rounded text-xs font-bold ${
                          p.availability === 'in-stock' ? 'bg-emerald-100 text-emerald-700' :
                          'bg-red-100 text-red-700'
                        }`}>
                          {p.availability}
                        </span>
                      </td>
                      <td className="p-4 text-right flex justify-end gap-2">
                        <button 
                          onClick={() => { setEditingItem(p); setEditingModel('products'); }}
                          className="p-1 hover:bg-gray-100 rounded text-gray-500 hover:text-blue-600 transition"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => handleDeleteItem('products', p.id)}
                          className="p-1 hover:bg-gray-100 rounded text-gray-500 hover:text-red-600 transition"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* TAB 7: ORDERS */}
          {activeTab === 'orders' && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200 text-xs font-bold text-gray-500 uppercase tracking-wider">
                    <th className="p-4">Order ID</th>
                    <th className="p-4">Customer</th>
                    <th className="p-4">Items Ordered</th>
                    <th className="p-4">Total Amount</th>
                    <th className="p-4">Tracking</th>
                    <th className="p-4">Payment</th>
                    <th className="p-4">Status</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-sm">
                  {orders.map((o) => (
                    <tr key={o.id} className="hover:bg-gray-50/50">
                      <td className="p-4 font-bold text-[#075e54]">{o.id}</td>
                      <td className="p-4 font-medium text-gray-900">{o.customer?.name}</td>
                      <td className="p-4 text-gray-700">{o.itemsOrdered}</td>
                      <td className="p-4 font-semibold text-gray-900">R{o.totalAmount}</td>
                      <td className="p-4 text-xs font-mono text-gray-500">{o.trackingNumber || 'Pending'}</td>
                      <td className="p-4">
                        <span className={`px-2 py-0.5 rounded text-xs font-bold ${
                          o.paymentStatus === 'paid' ? 'bg-emerald-100 text-emerald-700' :
                          'bg-red-100 text-red-700'
                        }`}>
                          {o.paymentStatus}
                        </span>
                      </td>
                      <td className="p-4">
                        <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                          o.status === 'delivered' ? 'bg-emerald-100 text-emerald-700' :
                          o.status === 'shipped' ? 'bg-blue-100 text-blue-700' :
                          o.status === 'confirmed' ? 'bg-amber-100 text-amber-700' :
                          'bg-gray-100 text-gray-700'
                        }`}>
                          {o.status}
                        </span>
                      </td>
                      <td className="p-4 text-right flex justify-end gap-2">
                        <button 
                          onClick={() => { setEditingItem(o); setEditingModel('orders'); }}
                          className="p-1 hover:bg-gray-100 rounded text-gray-500 hover:text-blue-600 transition"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => handleDeleteItem('orders', o.id)}
                          className="p-1 hover:bg-gray-100 rounded text-gray-500 hover:text-red-600 transition"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

        </div>
      </main>

      {/* Edit Modal (Glassmorphism design style) */}
      {editingItem && editingModel && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full border border-gray-100 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 bg-gray-50 flex items-center justify-between">
              <h3 className="font-bold text-gray-800 text-sm capitalize">Edit {editingModel.slice(0, -1)}</h3>
              <button onClick={() => setEditingItem(null)} className="text-gray-400 hover:text-gray-600 font-bold text-lg leading-none">&times;</button>
            </div>
            <form onSubmit={handleSaveEdit} className="p-6 space-y-4">
              
              {/* CUSTOMERS EDIT FORM */}
              {editingModel === 'customers' && (
                <>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 mb-1">Customer Status</label>
                    <select
                      value={editingItem.status}
                      onChange={(e) => setEditingItem({ ...editingItem, status: e.target.value })}
                      className="w-full border border-gray-300 rounded px-3 py-2 text-sm text-black focus:outline-none focus:ring-1 focus:ring-[#075e54]"
                    >
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                      <option value="suspended">Suspended</option>
                      <option value="pending">Pending Setup</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 mb-1">Internet Plan</label>
                    <input
                      type="text"
                      value={editingItem.internetPlan}
                      onChange={(e) => setEditingItem({ ...editingItem, internetPlan: e.target.value })}
                      className="w-full border border-gray-300 rounded px-3 py-2 text-sm text-black focus:outline-none focus:ring-1 focus:ring-[#075e54]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 mb-1">Monthly Fee (ZAR)</label>
                    <input
                      type="number"
                      value={editingItem.monthlyFee}
                      onChange={(e) => setEditingItem({ ...editingItem, monthlyFee: parseFloat(e.target.value) })}
                      className="w-full border border-gray-300 rounded px-3 py-2 text-sm text-black focus:outline-none focus:ring-1 focus:ring-[#075e54]"
                    />
                  </div>
                </>
              )}

              {/* TICKETS EDIT FORM */}
              {editingModel === 'tickets' && (
                <>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 mb-1">Ticket Status</label>
                    <select
                      value={editingItem.status}
                      onChange={(e) => setEditingItem({ ...editingItem, status: e.target.value })}
                      className="w-full border border-gray-300 rounded px-3 py-2 text-sm text-black focus:outline-none focus:ring-1 focus:ring-[#075e54]"
                    >
                      <option value="open">Open</option>
                      <option value="in-progress">In Progress</option>
                      <option value="waiting">Waiting</option>
                      <option value="resolved">Resolved</option>
                      <option value="closed">Closed</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 mb-1">Priority</label>
                    <select
                      value={editingItem.priority}
                      onChange={(e) => setEditingItem({ ...editingItem, priority: e.target.value })}
                      className="w-full border border-gray-300 rounded px-3 py-2 text-sm text-black focus:outline-none focus:ring-1 focus:ring-[#075e54]"
                    >
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                      <option value="critical">Critical</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 mb-1">Assigned Agent</label>
                    <input
                      type="text"
                      value={editingItem.assignedAgent || ''}
                      onChange={(e) => setEditingItem({ ...editingItem, assignedAgent: e.target.value })}
                      className="w-full border border-gray-300 rounded px-3 py-2 text-sm text-black focus:outline-none focus:ring-1 focus:ring-[#075e54]"
                    />
                  </div>
                </>
              )}

              {/* APPOINTMENTS EDIT FORM */}
              {editingModel === 'appointments' && (
                <>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 mb-1">Appointment Status</label>
                    <select
                      value={editingItem.status}
                      onChange={(e) => setEditingItem({ ...editingItem, status: e.target.value })}
                      className="w-full border border-gray-300 rounded px-3 py-2 text-sm text-black focus:outline-none focus:ring-1 focus:ring-[#075e54]"
                    >
                      <option value="scheduled">Scheduled</option>
                      <option value="in-progress">In Progress</option>
                      <option value="completed">Completed</option>
                      <option value="cancelled">Cancelled</option>
                      <option value="delayed">Delayed</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 mb-1">Technician</label>
                    <input
                      type="text"
                      value={editingItem.technician || ''}
                      onChange={(e) => setEditingItem({ ...editingItem, technician: e.target.value })}
                      className="w-full border border-gray-300 rounded px-3 py-2 text-sm text-black focus:outline-none focus:ring-1 focus:ring-[#075e54]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 mb-1">Time Slot</label>
                    <input
                      type="text"
                      value={editingItem.timeSlot || ''}
                      onChange={(e) => setEditingItem({ ...editingItem, timeSlot: e.target.value })}
                      className="w-full border border-gray-300 rounded px-3 py-2 text-sm text-black focus:outline-none focus:ring-1 focus:ring-[#075e54]"
                    />
                  </div>
                </>
              )}

              {/* PRODUCTS EDIT FORM */}
              {editingModel === 'products' && (
                <>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 mb-1">Product Price (ZAR)</label>
                    <input
                      type="number"
                      value={editingItem.price}
                      onChange={(e) => setEditingItem({ ...editingItem, price: parseFloat(e.target.value) })}
                      className="w-full border border-gray-300 rounded px-3 py-2 text-sm text-black focus:outline-none focus:ring-1 focus:ring-[#075e54]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 mb-1">Stock Quantity</label>
                    <input
                      type="number"
                      value={editingItem.stockQuantity}
                      onChange={(e) => setEditingItem({ ...editingItem, stockQuantity: parseInt(e.target.value) })}
                      className="w-full border border-gray-300 rounded px-3 py-2 text-sm text-black focus:outline-none focus:ring-1 focus:ring-[#075e54]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 mb-1">Availability</label>
                    <select
                      value={editingItem.availability}
                      onChange={(e) => setEditingItem({ ...editingItem, availability: e.target.value })}
                      className="w-full border border-gray-300 rounded px-3 py-2 text-sm text-black focus:outline-none focus:ring-1 focus:ring-[#075e54]"
                    >
                      <option value="in-stock">In Stock</option>
                      <option value="out-of-stock">Out of Stock</option>
                    </select>
                  </div>
                </>
              )}

              {/* ORDERS EDIT FORM */}
              {editingModel === 'orders' && (
                <>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 mb-1">Order Status</label>
                    <select
                      value={editingItem.status}
                      onChange={(e) => setEditingItem({ ...editingItem, status: e.target.value })}
                      className="w-full border border-gray-300 rounded px-3 py-2 text-sm text-black focus:outline-none focus:ring-1 focus:ring-[#075e54]"
                    >
                      <option value="pending">Pending</option>
                      <option value="confirmed">Confirmed</option>
                      <option value="shipped">Shipped</option>
                      <option value="delivered">Delivered</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 mb-1">Tracking Number</label>
                    <input
                      type="text"
                      value={editingItem.trackingNumber || ''}
                      onChange={(e) => setEditingItem({ ...editingItem, trackingNumber: e.target.value })}
                      className="w-full border border-gray-300 rounded px-3 py-2 text-sm text-black focus:outline-none focus:ring-1 focus:ring-[#075e54]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 mb-1">Payment Status</label>
                    <select
                      value={editingItem.paymentStatus}
                      onChange={(e) => setEditingItem({ ...editingItem, paymentStatus: e.target.value })}
                      className="w-full border border-gray-300 rounded px-3 py-2 text-sm text-black focus:outline-none focus:ring-1 focus:ring-[#075e54]"
                    >
                      <option value="unpaid">Unpaid</option>
                      <option value="paid">Paid</option>
                      <option value="refunded">Refunded</option>
                    </select>
                  </div>
                </>
              )}

              <div className="flex gap-3 justify-end pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setEditingItem(null)}
                  className="px-4 py-2 border border-gray-200 hover:bg-gray-50 rounded text-sm transition text-gray-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#075e54] hover:bg-[#054c43] text-white rounded text-sm transition"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
