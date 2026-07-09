import React, { useState } from 'react';
import { Shield, Lock, Smartphone, Key, CheckCircle2, AlertTriangle, Eye, EyeOff, Clock } from 'lucide-react';

interface SecurityFeature {
  id: string;
  title: string;
  description: string;
  status: 'active' | 'inactive' | 'pending';
  icon: React.ComponentType<any>;
}

export const SecurityModule: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'overview' | '2fa' | 'data-protection' | 'access-control'>('overview');
  const [showPassword, setShowPassword] = useState(false);
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [verificationCode, setVerificationCode] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);

  const securityFeatures: SecurityFeature[] = [
    {
      id: '2fa',
      title: 'Two-Factor Authentication',
      description: 'Add an extra layer of security to your account',
      status: twoFactorEnabled ? 'active' : 'inactive',
      icon: Smartphone
    },
    {
      id: 'encryption',
      title: 'End-to-End Encryption',
      description: 'All communications are encrypted using AES-256',
      status: 'active',
      icon: Lock
    },
    {
      id: 'access-control',
      title: 'Access Control',
      description: 'Manage user permissions and access levels',
      status: 'active',
      icon: Key
    },
    {
      id: 'data-protection',
      title: 'Data Protection (POPIA/GDPR)',
      description: 'Compliant with data protection regulations',
      status: 'active',
      icon: Shield
    }
  ];

  const handleTwoFactorSetup = () => {
    setIsVerifying(true);
    // Simulate 2FA setup process
    setTimeout(() => {
      setTwoFactorEnabled(true);
      setIsVerifying(false);
      setVerificationCode('');
    }, 2000);
  };

  const renderOverview = () => (
    <div className="space-y-6">
      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
        <div className="flex items-center space-x-2">
          <CheckCircle2 className="w-5 h-5 text-green-600" />
          <h3 className="font-semibold text-green-800">Security Status: Excellent</h3>
        </div>
        <p className="text-green-700 mt-1">All security measures are active and functioning properly.</p>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        {securityFeatures.map((feature) => {
          const Icon = feature.icon;
          return (
            <div key={feature.id} className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <div className={`p-2 rounded-lg ${
                  feature.status === 'active' ? 'bg-green-100' : 
                  feature.status === 'pending' ? 'bg-yellow-100' : 'bg-gray-100'
                }`}>
                  <Icon className={`w-5 h-5 ${
                    feature.status === 'active' ? 'text-green-600' : 
                    feature.status === 'pending' ? 'text-yellow-600' : 'text-gray-600'
                  }`} />
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-800">{feature.title}</h4>
                  <p className="text-sm text-gray-600 mt-1">{feature.description}</p>
                  <div className="flex items-center mt-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      feature.status === 'active' ? 'bg-green-100 text-green-800' : 
                      feature.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 'bg-gray-100 text-gray-800'
                    }`}>
                      {feature.status.charAt(0).toUpperCase() + feature.status.slice(1)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );

  const render2FA = () => (
    <div className="space-y-6">
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 className="font-semibold text-blue-800 mb-2">Two-Factor Authentication</h3>
        <p className="text-blue-700">
          Secure your account with an additional verification step. When enabled, you'll need both your password 
          and a verification code from your phone to access sensitive information.
        </p>
      </div>

      {!twoFactorEnabled ? (
        <div className="border border-gray-200 rounded-lg p-6">
          <div className="text-center">
            <Smartphone className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Enable Two-Factor Authentication</h3>
            <p className="text-gray-600 mb-6">
              Add an extra layer of security to protect your account and sensitive customer data.
            </p>
            
            <div className="max-w-md mx-auto space-y-4">
              <div className="text-left">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Enter your phone number
                </label>
                <input
                  type="tel"
                  placeholder="+27 XX XXX XXXX"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              {verificationCode && (
                <div className="text-left">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Verification Code
                  </label>
                  <input
                    type="text"
                    value={verificationCode}
                    onChange={(e) => setVerificationCode(e.target.value)}
                    placeholder="Enter 6-digit code"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              )}
              
              <button
                onClick={handleTwoFactorSetup}
                disabled={isVerifying}
                className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
              >
                {isVerifying ? (
                  <div className="flex items-center justify-center space-x-2">
                    <Clock className="w-4 h-4 animate-spin" />
                    <span>Setting up...</span>
                  </div>
                ) : (
                  'Enable 2FA'
                )}
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="border border-green-200 bg-green-50 rounded-lg p-6">
          <div className="text-center">
            <CheckCircle2 className="w-12 h-12 text-green-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-green-800 mb-2">2FA Enabled Successfully</h3>
            <p className="text-green-700 mb-4">
              Your account is now protected with two-factor authentication.
            </p>
            <button
              onClick={() => setTwoFactorEnabled(false)}
              className="bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition-colors"
            >
              Disable 2FA
            </button>
          </div>
        </div>
      )}
    </div>
  );

  const renderDataProtection = () => (
    <div className="space-y-6">
      <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
        <h3 className="font-semibold text-purple-800 mb-2">Data Protection Compliance</h3>
        <p className="text-purple-700">
          Bioniq is fully compliant with POPIA (Protection of Personal Information Act) and GDPR regulations.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <h4 className="font-semibold text-gray-800">Data Handling Protocols</h4>
          <div className="space-y-3">
            <div className="flex items-start space-x-3">
              <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5" />
              <div>
                <p className="font-medium text-gray-800">Encrypted Storage</p>
                <p className="text-sm text-gray-600">All customer data encrypted at rest using AES-256</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5" />
              <div>
                <p className="font-medium text-gray-800">Secure Transmission</p>
                <p className="text-sm text-gray-600">TLS 1.3 encryption for all data in transit</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5" />
              <div>
                <p className="font-medium text-gray-800">Access Logging</p>
                <p className="text-sm text-gray-600">All data access is logged and monitored</p>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h4 className="font-semibold text-gray-800">Customer Rights</h4>
          <div className="space-y-3">
            <div className="flex items-start space-x-3">
              <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5" />
              <div>
                <p className="font-medium text-gray-800">Right to Access</p>
                <p className="text-sm text-gray-600">Request copies of your personal data</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5" />
              <div>
                <p className="font-medium text-gray-800">Right to Rectification</p>
                <p className="text-sm text-gray-600">Correct inaccurate personal data</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5" />
              <div>
                <p className="font-medium text-gray-800">Right to Erasure</p>
                <p className="text-sm text-gray-600">Request deletion of your personal data</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderAccessControl = () => (
    <div className="space-y-6">
      <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
        <h3 className="font-semibold text-orange-800 mb-2">Access Control Framework</h3>
        <p className="text-orange-700">
          Manage user permissions and control access to sensitive backend information.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        <div className="border border-gray-200 rounded-lg p-4">
          <h4 className="font-semibold text-gray-800 mb-3">Customer Level</h4>
          <ul className="space-y-2 text-sm">
            <li className="flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4 text-green-600" />
              <span>Account information</span>
            </li>
            <li className="flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4 text-green-600" />
              <span>Service status</span>
            </li>
            <li className="flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4 text-green-600" />
              <span>Billing history</span>
            </li>
            <li className="flex items-center space-x-2">
              <AlertTriangle className="w-4 h-4 text-red-600" />
              <span>Technical diagnostics</span>
            </li>
          </ul>
        </div>

        <div className="border border-gray-200 rounded-lg p-4">
          <h4 className="font-semibold text-gray-800 mb-3">Agent Level</h4>
          <ul className="space-y-2 text-sm">
            <li className="flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4 text-green-600" />
              <span>Customer profiles</span>
            </li>
            <li className="flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4 text-green-600" />
              <span>Service management</span>
            </li>
            <li className="flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4 text-green-600" />
              <span>Technical support tools</span>
            </li>
            <li className="flex items-center space-x-2">
              <AlertTriangle className="w-4 h-4 text-red-600" />
              <span>System administration</span>
            </li>
          </ul>
        </div>

        <div className="border border-gray-200 rounded-lg p-4">
          <h4 className="font-semibold text-gray-800 mb-3">Admin Level</h4>
          <ul className="space-y-2 text-sm">
            <li className="flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4 text-green-600" />
              <span>Full system access</span>
            </li>
            <li className="flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4 text-green-600" />
              <span>User management</span>
            </li>
            <li className="flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4 text-green-600" />
              <span>Security settings</span>
            </li>
            <li className="flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4 text-green-600" />
              <span>Audit logs</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="bg-gray-50 rounded-lg p-4">
        <h4 className="font-semibold text-gray-800 mb-3">Session Management</h4>
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-600 mb-2">Active Sessions</p>
            <div className="space-y-2">
              <div className="flex justify-between items-center text-sm">
                <span>WhatsApp Bot (Current)</span>
                <span className="text-green-600">Active</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span>Mobile App</span>
                <span className="text-gray-500">2 hours ago</span>
              </div>
            </div>
          </div>
          <div>
            <p className="text-sm text-gray-600 mb-2">Security Settings</p>
            <div className="space-y-2">
              <div className="flex justify-between items-center text-sm">
                <span>Session timeout</span>
                <span>30 minutes</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span>Failed login attempts</span>
                <span>5 max</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const tabs = [
    { id: 'overview', label: 'Security Overview', icon: Shield },
    { id: '2fa', label: 'Two-Factor Auth', icon: Smartphone },
    { id: 'data-protection', label: 'Data Protection', icon: Lock },
    { id: 'access-control', label: 'Access Control', icon: Key }
  ];

  return (
    <div className="p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Security & Authentication</h2>
        <p className="text-gray-600">
          Comprehensive security features including 2FA, data protection compliance, and access control.
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
      {activeTab === 'overview' && renderOverview()}
      {activeTab === '2fa' && render2FA()}
      {activeTab === 'data-protection' && renderDataProtection()}
      {activeTab === 'access-control' && renderAccessControl()}
    </div>
  );
};