import React, { useState } from 'react';
import { Wrench, CheckSquare, Play, Calendar, AlertTriangle, Clock, User, MapPin, Phone } from 'lucide-react';

interface InstallationStep {
  id: string;
  title: string;
  description: string;
  duration: string;
  difficulty: 'easy' | 'medium' | 'hard';
  tools: string[];
  videoUrl?: string;
  completed?: boolean;
}

interface TechnicianSlot {
  id: string;
  date: string;
  time: string;
  technician: string;
  available: boolean;
  specialization: string[];
}

export const InstallationModule: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'guides' | 'troubleshooting' | 'checklist' | 'scheduling'>('guides');
  const [selectedGuide, setSelectedGuide] = useState<string>('fiber-installation');
  const [checklistItems, setChecklistItems] = useState<Record<string, boolean>>({});
  const [selectedSlot, setSelectedSlot] = useState<string>('');

  const installationGuides = {
    'fiber-installation': {
      title: 'Fiber Optic Installation',
      steps: [
        {
          id: 'step-1',
          title: 'Site Survey and Planning',
          description: 'Assess the installation site and plan the fiber route from the distribution point to your premises.',
          duration: '30 minutes',
          difficulty: 'easy' as const,
          tools: ['Measuring tape', 'Notepad', 'Camera'],
          videoUrl: 'https://example.com/fiber-survey'
        },
        {
          id: 'step-2',
          title: 'Prepare Installation Points',
          description: 'Mark and prepare entry points, drill holes if necessary, and set up cable management.',
          duration: '45 minutes',
          difficulty: 'medium' as const,
          tools: ['Drill', 'Masonry bits', 'Cable clips', 'Level'],
          videoUrl: 'https://example.com/fiber-prep'
        },
        {
          id: 'step-3',
          title: 'Run Fiber Cable',
          description: 'Carefully run the fiber optic cable from the distribution point to the ONT location.',
          duration: '60 minutes',
          difficulty: 'medium' as const,
          tools: ['Fiber cable', 'Cable pulling system', 'Protection sleeves'],
          videoUrl: 'https://example.com/fiber-cable'
        },
        {
          id: 'step-4',
          title: 'Install ONT Device',
          description: 'Mount and connect the Optical Network Terminal (ONT) device.',
          duration: '20 minutes',
          difficulty: 'easy' as const,
          tools: ['ONT device', 'Power adapter', 'Ethernet cable'],
          videoUrl: 'https://example.com/ont-install'
        },
        {
          id: 'step-5',
          title: 'Configure and Test',
          description: 'Configure the connection settings and perform speed and connectivity tests.',
          duration: '30 minutes',
          difficulty: 'easy' as const,
          tools: ['Laptop/smartphone', 'Speed test app'],
          videoUrl: 'https://example.com/fiber-test'
        }
      ]
    },
    'router-setup': {
      title: 'WiFi Router Configuration',
      steps: [
        {
          id: 'router-1',
          title: 'Unbox and Position Router',
          description: 'Unpack your router and position it in a central, elevated location away from interference.',
          duration: '10 minutes',
          difficulty: 'easy' as const,
          tools: ['Router', 'Power adapter', 'Ethernet cables']
        },
        {
          id: 'router-2',
          title: 'Connect to Internet',
          description: 'Connect the router to your ONT or modem using an ethernet cable.',
          duration: '5 minutes',
          difficulty: 'easy' as const,
          tools: ['Ethernet cable']
        },
        {
          id: 'router-3',
          title: 'Access Router Settings',
          description: 'Connect to the router\'s web interface to configure settings.',
          duration: '15 minutes',
          difficulty: 'medium' as const,
          tools: ['Computer or smartphone', 'Web browser']
        },
        {
          id: 'router-4',
          title: 'Configure WiFi Settings',
          description: 'Set up your WiFi network name (SSID) and password.',
          duration: '10 minutes',
          difficulty: 'easy' as const,
          tools: ['Router admin interface']
        }
      ]
    }
  };

  const troubleshootingIssues = [
    {
      id: 'slow-speed',
      problem: 'Internet speed is slower than expected',
      symptoms: ['Speed test shows low results', 'Buffering during streaming', 'Slow downloads'],
      solutions: [
        'Restart your router and ONT device',
        'Check for interference from other devices',
        'Test wired connection directly to router',
        'Update router firmware',
        'Contact support if issue persists'
      ],
      difficulty: 'easy'
    },
    {
      id: 'no-connection',
      problem: 'No internet connection',
      symptoms: ['No WiFi networks visible', 'Cannot connect to internet', 'Red lights on ONT'],
      solutions: [
        'Check all cable connections',
        'Verify power to ONT and router',
        'Check for service outages in your area',
        'Reset network settings on device',
        'Contact technical support'
      ],
      difficulty: 'medium'
    },
    {
      id: 'weak-signal',
      problem: 'Weak WiFi signal in some areas',
      symptoms: ['Slow speeds in certain rooms', 'Frequent disconnections', 'Low signal bars'],
      solutions: [
        'Reposition router to central location',
        'Remove physical obstructions',
        'Consider WiFi extender or mesh system',
        'Change WiFi channel in router settings',
        'Upgrade to higher-gain antennas'
      ],
      difficulty: 'medium'
    }
  ];

  const preInstallationChecklist = [
    { id: 'power-outlet', item: 'Power outlet available near installation point', category: 'Power' },
    { id: 'ethernet-cables', item: 'Ethernet cables (Cat 6 recommended)', category: 'Cables' },
    { id: 'drill-bits', item: 'Power drill with masonry bits', category: 'Tools' },
    { id: 'cable-clips', item: 'Cable clips and management accessories', category: 'Hardware' },
    { id: 'clear-path', item: 'Clear path from entry point to router location', category: 'Access' },
    { id: 'wifi-devices', item: 'List of devices to connect to WiFi', category: 'Devices' },
    { id: 'old-equipment', item: 'Old internet equipment ready for removal', category: 'Cleanup' },
    { id: 'contact-info', item: 'Emergency contact information available', category: 'Support' }
  ];

  const technicianSlots: TechnicianSlot[] = [
    {
      id: 'slot-1',
      date: '2024-12-10',
      time: '09:00 - 12:00',
      technician: 'Alex Mthembu',
      available: true,
      specialization: ['Fiber Installation', 'Network Setup']
    },
    {
      id: 'slot-2',
      date: '2024-12-10',
      time: '13:00 - 16:00',
      technician: 'Chris van der Merwe',
      available: true,
      specialization: ['WiFi Optimization', 'Troubleshooting']
    },
    {
      id: 'slot-3',
      date: '2024-12-11',
      time: '08:00 - 11:00',
      technician: 'Sarah Ndlovu',
      available: false,
      specialization: ['Business Installations', 'Advanced Config']
    },
    {
      id: 'slot-4',
      date: '2024-12-11',
      time: '14:00 - 17:00',
      technician: 'Mike Johnson',
      available: true,
      specialization: ['Fiber Repair', 'Signal Optimization']
    }
  ];

  const toggleChecklistItem = (itemId: string) => {
    setChecklistItems(prev => ({
      ...prev,
      [itemId]: !prev[itemId]
    }));
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'text-green-600 bg-green-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'hard': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const renderGuides = () => (
    <div className="space-y-6">
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 className="font-semibold text-blue-800 mb-2">Interactive Installation Guides</h3>
        <p className="text-blue-700">
          Step-by-step installation instructions with video tutorials and tool requirements.
        </p>
      </div>

      <div className="grid md:grid-cols-4 gap-4">
        <div className="space-y-2">
          <h4 className="font-semibold text-gray-800">Installation Types</h4>
          {Object.entries(installationGuides).map(([key, guide]) => (
            <button
              key={key}
              onClick={() => setSelectedGuide(key)}
              className={`w-full text-left p-3 rounded-lg border transition-colors ${
                selectedGuide === key
                  ? 'border-blue-500 bg-blue-50 text-blue-700'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              {guide.title}
            </button>
          ))}
        </div>

        <div className="md:col-span-3">
          {selectedGuide && (
            <div className="space-y-4">
              <h4 className="text-xl font-semibold text-gray-800">
                {installationGuides[selectedGuide as keyof typeof installationGuides].title}
              </h4>
              
              {installationGuides[selectedGuide as keyof typeof installationGuides].steps.map((step, index) => (
                <div key={step.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-start space-x-4">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-blue-600 font-semibold text-sm">{index + 1}</span>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h5 className="font-semibold text-gray-800">{step.title}</h5>
                        <div className="flex items-center space-x-2">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(step.difficulty)}`}>
                            {step.difficulty}
                          </span>
                          <span className="text-sm text-gray-600 flex items-center">
                            <Clock className="w-3 h-3 mr-1" />
                            {step.duration}
                          </span>
                        </div>
                      </div>
                      
                      <p className="text-gray-600 mb-3">{step.description}</p>
                      
                      <div className="mb-3">
                        <h6 className="font-medium text-gray-800 mb-1">Required Tools:</h6>
                        <div className="flex flex-wrap gap-2">
                          {step.tools.map((tool, toolIndex) => (
                            <span key={toolIndex} className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-sm">
                              {tool}
                            </span>
                          ))}
                        </div>
                      </div>
                      
                      {step.videoUrl && (
                        <button className="flex items-center space-x-2 text-blue-600 hover:text-blue-700 transition-colors">
                          <Play className="w-4 h-4" />
                          <span className="text-sm">Watch Video Tutorial</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );

  const renderTroubleshooting = () => (
    <div className="space-y-6">
      <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
        <h3 className="font-semibold text-orange-800 mb-2">Automated Troubleshooting</h3>
        <p className="text-orange-700">
          Diagnose and resolve common installation problems with step-by-step solutions.
        </p>
      </div>

      <div className="space-y-4">
        {troubleshootingIssues.map((issue) => (
          <div key={issue.id} className="border border-gray-200 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <AlertTriangle className="w-6 h-6 text-orange-600 flex-shrink-0 mt-1" />
              <div className="flex-1">
                <h4 className="font-semibold text-gray-800 mb-2">{issue.problem}</h4>
                
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <h5 className="font-medium text-gray-700 mb-2">Symptoms:</h5>
                    <ul className="space-y-1">
                      {issue.symptoms.map((symptom, index) => (
                        <li key={index} className="text-sm text-gray-600 flex items-center space-x-2">
                          <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
                          <span>{symptom}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div>
                    <h5 className="font-medium text-gray-700 mb-2">Solutions:</h5>
                    <ol className="space-y-1">
                      {issue.solutions.map((solution, index) => (
                        <li key={index} className="text-sm text-gray-600 flex items-start space-x-2">
                          <span className="text-blue-600 font-medium">{index + 1}.</span>
                          <span>{solution}</span>
                        </li>
                      ))}
                    </ol>
                  </div>
                </div>
                
                <div className="mt-3 flex items-center space-x-4">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(issue.difficulty)}`}>
                    {issue.difficulty} fix
                  </span>
                  <button className="text-blue-600 hover:text-blue-700 text-sm transition-colors">
                    Get detailed help →
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-gray-50 rounded-lg p-4">
        <h4 className="font-semibold text-gray-800 mb-3">Still Need Help?</h4>
        <div className="grid md:grid-cols-3 gap-4">
          <button className="p-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            Chat with Support Bot
          </button>
          <button className="p-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
            Schedule Technician Visit
          </button>
          <button className="p-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
            Call Technical Support
          </button>
        </div>
      </div>
    </div>
  );

  const renderChecklist = () => (
    <div className="space-y-6">
      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
        <h3 className="font-semibold text-green-800 mb-2">Pre-Installation Checklist</h3>
        <p className="text-green-700">
          Ensure you have all necessary tools and components before starting the installation.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-4">
          {preInstallationChecklist.map((item) => (
            <div key={item.id} className="flex items-start space-x-3 p-3 border border-gray-200 rounded-lg">
              <button
                onClick={() => toggleChecklistItem(item.id)}
                className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
                  checklistItems[item.id]
                    ? 'bg-green-600 border-green-600'
                    : 'border-gray-300 hover:border-green-400'
                }`}
              >
                {checklistItems[item.id] && (
                  <CheckSquare className="w-3 h-3 text-white" />
                )}
              </button>
              <div className="flex-1">
                <p className={`text-sm ${checklistItems[item.id] ? 'line-through text-gray-500' : 'text-gray-800'}`}>
                  {item.item}
                </p>
                <span className="text-xs text-gray-500">{item.category}</span>
              </div>
            </div>
          ))}
        </div>

        <div className="space-y-4">
          <div className="bg-blue-50 rounded-lg p-4">
            <h4 className="font-semibold text-blue-800 mb-2">Checklist Progress</h4>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Completed Items</span>
                <span>{Object.values(checklistItems).filter(Boolean).length} / {preInstallationChecklist.length}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ 
                    width: `${(Object.values(checklistItems).filter(Boolean).length / preInstallationChecklist.length) * 100}%` 
                  }}
                ></div>
              </div>
            </div>
          </div>

          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <h4 className="font-semibold text-yellow-800 mb-2">Important Notes</h4>
            <ul className="space-y-1 text-sm text-yellow-700">
              <li>• Ensure power is available at installation point</li>
              <li>• Clear access path for technician</li>
              <li>• Have contact information ready</li>
              <li>• Remove old equipment if upgrading</li>
            </ul>
          </div>

          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="font-semibold text-gray-800 mb-2">Need Equipment?</h4>
            <p className="text-sm text-gray-600 mb-3">
              Don't have all the required tools? We can provide them or recommend where to purchase.
            </p>
            <button className="w-full bg-gray-600 text-white py-2 px-4 rounded-lg hover:bg-gray-700 transition-colors">
              Order Installation Kit
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const renderScheduling = () => (
    <div className="space-y-6">
      <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
        <h3 className="font-semibold text-purple-800 mb-2">Technician Scheduling</h3>
        <p className="text-purple-700">
          Schedule an appointment with a qualified technician when troubleshooting doesn't resolve the issue.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <h4 className="font-semibold text-gray-800">Available Time Slots</h4>
          {technicianSlots.map((slot) => (
            <div
              key={slot.id}
              className={`border rounded-lg p-4 transition-colors ${
                !slot.available
                  ? 'border-gray-200 bg-gray-50 opacity-50'
                  : selectedSlot === slot.id
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-blue-300 cursor-pointer'
              }`}
              onClick={() => slot.available && setSelectedSlot(slot.id)}
            >
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center space-x-2 mb-1">
                    <Calendar className="w-4 h-4 text-gray-600" />
                    <span className="font-medium">{slot.date}</span>
                  </div>
                  <div className="flex items-center space-x-2 mb-2">
                    <Clock className="w-4 h-4 text-gray-600" />
                    <span className="text-sm text-gray-600">{slot.time}</span>
                  </div>
                  <div className="flex items-center space-x-2 mb-2">
                    <User className="w-4 h-4 text-gray-600" />
                    <span className="text-sm font-medium">{slot.technician}</span>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {slot.specialization.map((spec, index) => (
                      <span key={index} className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs">
                        {spec}
                      </span>
                    ))}
                  </div>
                </div>
                <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                  slot.available ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                  {slot.available ? 'Available' : 'Booked'}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="space-y-4">
          <h4 className="font-semibold text-gray-800">Appointment Details</h4>
          
          {selectedSlot ? (
            <div className="border border-gray-200 rounded-lg p-4">
              <h5 className="font-semibold text-gray-800 mb-3">Confirm Appointment</h5>
              
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Service Type
                  </label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option>Fiber Installation</option>
                    <option>WiFi Setup & Optimization</option>
                    <option>Troubleshooting & Repair</option>
                    <option>Equipment Upgrade</option>
                    <option>Network Configuration</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Contact Number
                  </label>
                  <input
                    type="tel"
                    placeholder="+27 XX XXX XXXX"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Installation Address
                  </label>
                  <textarea
                    placeholder="Full address including any special access instructions..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows={3}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Special Requirements
                  </label>
                  <textarea
                    placeholder="Any specific requirements or issues to address..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows={2}
                  />
                </div>
                
                <button className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors">
                  Confirm Appointment
                </button>
              </div>
            </div>
          ) : (
            <div className="border border-gray-200 rounded-lg p-4 text-center">
              <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-2" />
              <p className="text-gray-600">Select an available time slot to schedule your appointment</p>
            </div>
          )}

          <div className="bg-gray-50 rounded-lg p-4">
            <h5 className="font-semibold text-gray-800 mb-2">What to Expect</h5>
            <ul className="space-y-1 text-sm text-gray-600">
              <li>• Technician will arrive within the scheduled window</li>
              <li>• Complete installation typically takes 2-4 hours</li>
              <li>• All equipment and materials provided</li>
              <li>• Testing and configuration included</li>
              <li>• 30-day warranty on installation work</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="bg-blue-50 rounded-lg p-4">
        <h4 className="font-semibold text-blue-800 mb-2">Emergency Support</h4>
        <p className="text-blue-700 mb-3">
          For urgent technical issues affecting your internet service, contact our emergency support line.
        </p>
        <div className="flex items-center space-x-4">
          <button className="flex items-center space-x-2 bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition-colors">
            <Phone className="w-4 h-4" />
            <span>Emergency Support</span>
          </button>
          <span className="text-sm text-blue-700">Available 24/7 for critical issues</span>
        </div>
      </div>
    </div>
  );

  const tabs = [
    { id: 'guides', label: 'Installation Guides', icon: Wrench },
    { id: 'troubleshooting', label: 'Troubleshooting', icon: AlertTriangle },
    { id: 'checklist', label: 'Pre-Install Checklist', icon: CheckSquare },
    { id: 'scheduling', label: 'Schedule Technician', icon: Calendar }
  ];

  return (
    <div className="p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Guided Installation & Support</h2>
        <p className="text-gray-600">
          Comprehensive installation guidance with interactive tutorials, troubleshooting, and technician scheduling.
        </p>
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="flex space-x-8">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center space-x-2 py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Tab Content */}
      {activeTab === 'guides' && renderGuides()}
      {activeTab === 'troubleshooting' && renderTroubleshooting()}
      {activeTab === 'checklist' && renderChecklist()}
      {activeTab === 'scheduling' && renderScheduling()}
    </div>
  );
};