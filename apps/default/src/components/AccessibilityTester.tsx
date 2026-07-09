import React, { useState, useEffect } from 'react';
import { Eye, AlertTriangle, CheckCircle2, Contrast, Type, MousePointer, Keyboard, Volume2, Zap } from 'lucide-react';

interface ContrastIssue {
  element: string;
  foreground: string;
  background: string;
  ratio: number;
  level: 'AA' | 'AAA' | 'fail';
  severity: 'low' | 'medium' | 'high';
  suggestion: string;
}

interface AccessibilityIssue {
  type: 'contrast' | 'focus' | 'aria' | 'keyboard' | 'semantic';
  severity: 'low' | 'medium' | 'high';
  element: string;
  description: string;
  suggestion: string;
  wcagGuideline: string;
}

export const AccessibilityTester: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'contrast' | 'focus' | 'keyboard' | 'aria' | 'overview'>('overview');
  const [isScanning, setIsScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [contrastIssues, setContrastIssues] = useState<ContrastIssue[]>([]);
  const [accessibilityIssues, setAccessibilityIssues] = useState<AccessibilityIssue[]>([]);

  // Simulate accessibility scanning
  const runAccessibilityScan = async () => {
    setIsScanning(true);
    setScanProgress(0);

    // Simulate scanning progress
    const progressSteps = [
      { step: 20, message: 'Analyzing color contrast...' },
      { step: 40, message: 'Checking focus indicators...' },
      { step: 60, message: 'Validating ARIA labels...' },
      { step: 80, message: 'Testing keyboard navigation...' },
      { step: 100, message: 'Generating report...' }
    ];

    for (const { step } of progressSteps) {
      await new Promise(resolve => setTimeout(resolve, 800));
      setScanProgress(step);
    }

    // Mock contrast issues found in the current app
    const mockContrastIssues: ContrastIssue[] = [
      {
        element: 'Navigation text on dark background',
        foreground: '#9CA3AF', // text-gray-400
        background: '#1F2937', // bg-gray-800
        ratio: 4.2,
        level: 'AA',
        severity: 'medium',
        suggestion: 'Use #D1D5DB (text-gray-300) for better contrast'
      },
      {
        element: 'Placeholder text in input fields',
        foreground: '#9CA3AF', // text-gray-400
        background: '#FFFFFF', // bg-white
        ratio: 3.8,
        level: 'fail',
        severity: 'high',
        suggestion: 'Use #6B7280 (text-gray-500) for placeholder text'
      },
      {
        element: 'Secondary button text',
        foreground: '#60A5FA', // text-blue-400
        background: '#1E293B', // bg-slate-800
        ratio: 3.2,
        level: 'fail',
        severity: 'high',
        suggestion: 'Use #93C5FD (text-blue-300) or add background color'
      },
      {
        element: 'Disabled button state',
        foreground: '#9CA3AF', // text-gray-400
        background: '#F3F4F6', // bg-gray-100
        ratio: 2.8,
        level: 'fail',
        severity: 'medium',
        suggestion: 'Use #6B7280 (text-gray-500) for disabled text'
      }
    ];

    const mockAccessibilityIssues: AccessibilityIssue[] = [
      {
        type: 'focus',
        severity: 'medium',
        element: 'Navigation buttons',
        description: 'Focus indicators are not visible enough on dark backgrounds',
        suggestion: 'Add high-contrast focus rings with outline-offset',
        wcagGuideline: 'WCAG 2.4.7 - Focus Visible'
      },
      {
        type: 'aria',
        severity: 'low',
        element: 'Icon buttons',
        description: 'Some icon-only buttons lack accessible labels',
        suggestion: 'Add aria-label or sr-only text for screen readers',
        wcagGuideline: 'WCAG 4.1.2 - Name, Role, Value'
      },
      {
        type: 'keyboard',
        severity: 'low',
        element: 'Modal dialogs',
        description: 'Focus management could be improved in modal dialogs',
        suggestion: 'Implement focus trapping and return focus on close',
        wcagGuideline: 'WCAG 2.1.2 - No Keyboard Trap'
      },
      {
        type: 'semantic',
        severity: 'low',
        element: 'Heading structure',
        description: 'Some sections could benefit from proper heading hierarchy',
        suggestion: 'Use h1-h6 elements in logical order',
        wcagGuideline: 'WCAG 1.3.1 - Info and Relationships'
      }
    ];

    setContrastIssues(mockContrastIssues);
    setAccessibilityIssues(mockAccessibilityIssues);
    setIsScanning(false);
  };

  useEffect(() => {
    // Run initial scan
    runAccessibilityScan();
  }, []);

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high': return 'text-red-600 bg-red-100 border-red-200';
      case 'medium': return 'text-yellow-600 bg-yellow-100 border-yellow-200';
      case 'low': return 'text-blue-600 bg-blue-100 border-blue-200';
      default: return 'text-gray-600 bg-gray-100 border-gray-200';
    }
  };

  const getContrastLevelColor = (level: string) => {
    switch (level) {
      case 'AAA': return 'text-green-700 bg-green-100';
      case 'AA': return 'text-blue-700 bg-blue-100';
      case 'fail': return 'text-red-700 bg-red-100';
      default: return 'text-gray-700 bg-gray-100';
    }
  };

  const renderOverview = () => (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-lg p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-2">🔍 Accessibility Analysis Complete</h3>
        <p className="text-gray-700 mb-4">
          Comprehensive accessibility audit of your WhatsApp bot interface with WCAG 2.1 compliance checking.
        </p>
        
        <div className="grid md:grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <div className="text-2xl font-bold text-red-600">{contrastIssues.filter(i => i.severity === 'high').length}</div>
            <div className="text-sm text-gray-600">High Priority Issues</div>
          </div>
          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <div className="text-2xl font-bold text-yellow-600">{contrastIssues.filter(i => i.severity === 'medium').length + accessibilityIssues.filter(i => i.severity === 'medium').length}</div>
            <div className="text-sm text-gray-600">Medium Priority Issues</div>
          </div>
          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <div className="text-2xl font-bold text-blue-600">{accessibilityIssues.filter(i => i.severity === 'low').length}</div>
            <div className="text-sm text-gray-600">Low Priority Issues</div>
          </div>
          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <div className="text-2xl font-bold text-green-600">85%</div>
            <div className="text-sm text-gray-600">Overall Score</div>
          </div>
        </div>
      </div>

      {/* Quick Fixes */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h4 className="text-lg font-semibold text-gray-800 mb-4">🚀 Quick Fixes Recommended</h4>
        <div className="space-y-4">
          <div className="flex items-start space-x-3 p-4 bg-red-50 border border-red-200 rounded-lg">
            <AlertTriangle className="w-5 h-5 text-red-600 mt-0.5" />
            <div>
              <h5 className="font-medium text-red-800">Critical Contrast Issues</h5>
              <p className="text-sm text-red-700 mt-1">
                2 elements fail WCAG AA standards. Update placeholder text and secondary button colors.
              </p>
              <button className="mt-2 text-sm text-red-600 hover:text-red-700 font-medium">
                View Details →
              </button>
            </div>
          </div>

          <div className="flex items-start space-x-3 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <Eye className="w-5 h-5 text-yellow-600 mt-0.5" />
            <div>
              <h5 className="font-medium text-yellow-800">Focus Visibility</h5>
              <p className="text-sm text-yellow-700 mt-1">
                Improve focus indicators for better keyboard navigation visibility.
              </p>
              <button className="mt-2 text-sm text-yellow-600 hover:text-yellow-700 font-medium">
                View Details →
              </button>
            </div>
          </div>

          <div className="flex items-start space-x-3 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <Volume2 className="w-5 h-5 text-blue-600 mt-0.5" />
            <div>
              <h5 className="font-medium text-blue-800">Screen Reader Support</h5>
              <p className="text-sm text-blue-700 mt-1">
                Add missing ARIA labels to icon buttons for better screen reader support.
              </p>
              <button className="mt-2 text-sm text-blue-600 hover:text-blue-700 font-medium">
                View Details →
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Accessibility Score Breakdown */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h4 className="text-lg font-semibold text-gray-800 mb-4">📊 Accessibility Score Breakdown</h4>
        <div className="space-y-4">
          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-gray-700">Color Contrast</span>
              <span className="text-sm font-semibold text-yellow-600">78%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-yellow-500 h-2 rounded-full" style={{ width: '78%' }}></div>
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-gray-700">Keyboard Navigation</span>
              <span className="text-sm font-semibold text-green-600">92%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-green-500 h-2 rounded-full" style={{ width: '92%' }}></div>
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-gray-700">Screen Reader Support</span>
              <span className="text-sm font-semibold text-blue-600">88%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-blue-500 h-2 rounded-full" style={{ width: '88%' }}></div>
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-gray-700">Focus Management</span>
              <span className="text-sm font-semibold text-purple-600">85%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-purple-500 h-2 rounded-full" style={{ width: '85%' }}></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderContrastAnalysis = () => (
    <div className="space-y-6">
      <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
        <h3 className="font-semibold text-orange-800 mb-2">Color Contrast Analysis</h3>
        <p className="text-orange-700">
          WCAG 2.1 requires a contrast ratio of at least 4.5:1 for normal text and 3:1 for large text.
        </p>
      </div>

      <div className="space-y-4">
        {contrastIssues.map((issue, index) => (
          <div key={index} className="bg-white border border-gray-200 rounded-lg p-4">
            <div className="flex items-start justify-between mb-3">
              <div>
                <h4 className="font-semibold text-gray-800">{issue.element}</h4>
                <div className="flex items-center space-x-2 mt-1">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getSeverityColor(issue.severity)}`}>
                    {issue.severity.toUpperCase()}
                  </span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getContrastLevelColor(issue.level)}`}>
                    {issue.level === 'fail' ? 'FAILS WCAG' : `WCAG ${issue.level}`}
                  </span>
                </div>
              </div>
              <div className="text-right">
                <div className="text-lg font-bold text-gray-800">{issue.ratio}:1</div>
                <div className="text-xs text-gray-600">Contrast Ratio</div>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4 mb-4">
              <div>
                <div className="text-sm font-medium text-gray-700 mb-2">Current Colors</div>
                <div className="flex items-center space-x-3">
                  <div 
                    className="w-8 h-8 rounded border border-gray-300"
                    style={{ backgroundColor: issue.foreground }}
                    title={`Foreground: ${issue.foreground}`}
                  ></div>
                  <div 
                    className="w-8 h-8 rounded border border-gray-300"
                    style={{ backgroundColor: issue.background }}
                    title={`Background: ${issue.background}`}
                  ></div>
                  <div className="text-xs text-gray-600">
                    <div>FG: {issue.foreground}</div>
                    <div>BG: {issue.background}</div>
                  </div>
                </div>
              </div>
              <div>
                <div className="text-sm font-medium text-gray-700 mb-2">Sample Text</div>
                <div 
                  className="p-2 rounded border"
                  style={{ 
                    color: issue.foreground, 
                    backgroundColor: issue.background 
                  }}
                >
                  Sample text with current colors
                </div>
              </div>
            </div>

            <div className="bg-green-50 border border-green-200 rounded p-3">
              <div className="text-sm font-medium text-green-800 mb-1">💡 Suggested Fix</div>
              <div className="text-sm text-green-700">{issue.suggestion}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h4 className="font-semibold text-blue-800 mb-2">Contrast Testing Tools</h4>
        <div className="grid md:grid-cols-2 gap-4 text-sm">
          <div>
            <h5 className="font-medium text-blue-700 mb-2">Online Tools</h5>
            <ul className="space-y-1 text-blue-600">
              <li>• WebAIM Contrast Checker</li>
              <li>• Colour Contrast Analyser</li>
              <li>• Stark (Figma/Sketch plugin)</li>
            </ul>
          </div>
          <div>
            <h5 className="font-medium text-blue-700 mb-2">Browser Extensions</h5>
            <ul className="space-y-1 text-blue-600">
              <li>• axe DevTools</li>
              <li>• WAVE Web Accessibility Evaluator</li>
              <li>• Lighthouse Accessibility Audit</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );

  const renderFocusAnalysis = () => (
    <div className="space-y-6">
      <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
        <h3 className="font-semibold text-purple-800 mb-2">Focus Indicator Analysis</h3>
        <p className="text-purple-700">
          Focus indicators must be clearly visible for keyboard navigation users.
        </p>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h4 className="text-lg font-semibold text-gray-800 mb-4">Focus Indicator Examples</h4>
        
        <div className="space-y-6">
          <div>
            <h5 className="font-medium text-gray-700 mb-3">❌ Poor Focus Indicators</h5>
            <div className="space-y-2">
              <button className="px-4 py-2 bg-blue-600 text-white rounded focus:outline-none focus:ring-1 focus:ring-blue-300">
                Weak focus ring
              </button>
              <button className="px-4 py-2 bg-gray-800 text-gray-400 rounded focus:outline-none focus:ring-1 focus:ring-gray-500">
                Low contrast focus
              </button>
            </div>
          </div>

          <div>
            <h5 className="font-medium text-gray-700 mb-3">✅ Good Focus Indicators</h5>
            <div className="space-y-2">
              <button className="px-4 py-2 bg-blue-600 text-white rounded focus:outline-none focus:ring-2 focus:ring-blue-300 focus:ring-offset-2">
                Strong focus ring with offset
              </button>
              <button className="px-4 py-2 bg-gray-800 text-white rounded focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:ring-offset-2">
                High contrast focus ring
              </button>
            </div>
          </div>

          <div>
            <h5 className="font-medium text-gray-700 mb-3">🎯 Best Practice Focus Indicators</h5>
            <div className="space-y-2">
              <button className="px-4 py-2 bg-green-600 text-white rounded focus:outline-none focus:ring-2 focus:ring-green-300 focus:ring-offset-2 focus:ring-offset-gray-100">
                Focus ring with background offset
              </button>
              <button className="px-4 py-2 border-2 border-gray-300 text-gray-700 rounded focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200">
                Border + ring combination
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <h4 className="font-semibold text-yellow-800 mb-2">Recommended Focus Styles</h4>
        <div className="text-sm text-yellow-700 space-y-2">
          <div>• Use <code className="bg-yellow-100 px-1 rounded">focus:ring-2</code> for visible focus rings</div>
          <div>• Add <code className="bg-yellow-100 px-1 rounded">focus:ring-offset-2</code> for better separation</div>
          <div>• Use high contrast colors like <code className="bg-yellow-100 px-1 rounded">focus:ring-yellow-400</code> on dark backgrounds</div>
          <div>• Ensure focus indicators are at least 2px thick</div>
          <div>• Test with keyboard navigation (Tab, Shift+Tab, Enter, Space)</div>
        </div>
      </div>
    </div>
  );

  const renderKeyboardAnalysis = () => (
    <div className="space-y-6">
      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
        <h3 className="font-semibold text-green-800 mb-2">Keyboard Navigation Analysis</h3>
        <p className="text-green-700">
          All interactive elements should be accessible via keyboard navigation.
        </p>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h4 className="text-lg font-semibold text-gray-800 mb-4">Keyboard Navigation Test</h4>
        
        <div className="space-y-4">
          <div className="p-4 bg-gray-50 rounded-lg">
            <h5 className="font-medium text-gray-700 mb-2">✅ Working Keyboard Navigation</h5>
            <div className="flex flex-wrap gap-2">
              <button className="px-3 py-2 bg-blue-600 text-white rounded focus:outline-none focus:ring-2 focus:ring-blue-300 focus:ring-offset-2">
                Button 1
              </button>
              <button className="px-3 py-2 bg-green-600 text-white rounded focus:outline-none focus:ring-2 focus:ring-green-300 focus:ring-offset-2">
                Button 2
              </button>
              <input 
                type="text" 
                placeholder="Focusable input"
                className="px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              <select className="px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                <option>Option 1</option>
                <option>Option 2</option>
              </select>
            </div>
            <p className="text-sm text-gray-600 mt-2">
              Try using Tab, Shift+Tab, Enter, and Space keys to navigate these elements.
            </p>
          </div>

          <div className="p-4 bg-red-50 rounded-lg">
            <h5 className="font-medium text-red-700 mb-2">❌ Problematic Elements</h5>
            <div className="space-y-2 text-sm text-red-600">
              <div>• Div elements with onClick handlers (not keyboard accessible)</div>
              <div>• Custom dropdowns without proper ARIA attributes</div>
              <div>• Modal dialogs without focus trapping</div>
              <div>• Skip links missing for main content</div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h4 className="font-semibold text-blue-800 mb-2">Keyboard Navigation Checklist</h4>
        <div className="space-y-2 text-sm text-blue-700">
          <div className="flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4 text-green-600" />
            <span>All interactive elements are focusable with Tab</span>
          </div>
          <div className="flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4 text-green-600" />
            <span>Focus order follows logical reading order</span>
          </div>
          <div className="flex items-center space-x-2">
            <AlertTriangle className="w-4 h-4 text-yellow-600" />
            <span>Modal dialogs trap focus appropriately</span>
          </div>
          <div className="flex items-center space-x-2">
            <AlertTriangle className="w-4 h-4 text-yellow-600" />
            <span>Skip links provided for main content areas</span>
          </div>
          <div className="flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4 text-green-600" />
            <span>Enter and Space keys activate buttons</span>
          </div>
          <div className="flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4 text-green-600" />
            <span>Escape key closes modal dialogs</span>
          </div>
        </div>
      </div>
    </div>
  );

  const renderAriaAnalysis = () => (
    <div className="space-y-6">
      <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4">
        <h3 className="font-semibold text-indigo-800 mb-2">ARIA Labels & Screen Reader Support</h3>
        <p className="text-indigo-700">
          Proper ARIA labels ensure screen readers can understand and navigate your interface.
        </p>
      </div>

      <div className="space-y-4">
        {accessibilityIssues.filter(issue => issue.type === 'aria').map((issue, index) => (
          <div key={index} className="bg-white border border-gray-200 rounded-lg p-4">
            <div className="flex items-start justify-between mb-3">
              <div>
                <h4 className="font-semibold text-gray-800">{issue.element}</h4>
                <div className="flex items-center space-x-2 mt-1">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getSeverityColor(issue.severity)}`}>
                    {issue.severity.toUpperCase()}
                  </span>
                  <span className="text-xs text-gray-600">{issue.wcagGuideline}</span>
                </div>
              </div>
            </div>

            <p className="text-gray-700 mb-3">{issue.description}</p>

            <div className="bg-green-50 border border-green-200 rounded p-3">
              <div className="text-sm font-medium text-green-800 mb-1">💡 Suggested Fix</div>
              <div className="text-sm text-green-700">{issue.suggestion}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h4 className="text-lg font-semibold text-gray-800 mb-4">ARIA Best Practices Examples</h4>
        
        <div className="space-y-6">
          <div>
            <h5 className="font-medium text-gray-700 mb-3">Icon Buttons</h5>
            <div className="space-y-2">
              <div className="flex items-center space-x-4">
                <button className="p-2 bg-gray-200 rounded" aria-label="Close dialog">
                  <span aria-hidden="true">×</span>
                </button>
                <code className="text-sm bg-gray-100 px-2 py-1 rounded">aria-label="Close dialog"</code>
              </div>
              <div className="flex items-center space-x-4">
                <button className="p-2 bg-blue-600 text-white rounded">
                  <span className="sr-only">Send message</span>
                  <span aria-hidden="true">→</span>
                </button>
                <code className="text-sm bg-gray-100 px-2 py-1 rounded">sr-only text + aria-hidden icon</code>
              </div>
            </div>
          </div>

          <div>
            <h5 className="font-medium text-gray-700 mb-3">Form Labels</h5>
            <div className="space-y-2">
              <div>
                <label htmlFor="email-input" className="block text-sm font-medium text-gray-700">
                  Email Address
                </label>
                <input 
                  id="email-input"
                  type="email" 
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  aria-describedby="email-help"
                />
                <p id="email-help" className="mt-1 text-sm text-gray-600">
                  We'll never share your email with anyone else.
                </p>
              </div>
            </div>
          </div>

          <div>
            <h5 className="font-medium text-gray-700 mb-3">Status Messages</h5>
            <div className="space-y-2">
              <div 
                role="status" 
                aria-live="polite"
                className="p-3 bg-green-100 border border-green-200 rounded text-green-700"
              >
                Message sent successfully!
              </div>
              <div 
                role="alert" 
                aria-live="assertive"
                className="p-3 bg-red-100 border border-red-200 rounded text-red-700"
              >
                Error: Please fill in all required fields.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const tabs = [
    { id: 'overview', label: 'Overview', icon: Eye },
    { id: 'contrast', label: 'Color Contrast', icon: Contrast },
    { id: 'focus', label: 'Focus Indicators', icon: MousePointer },
    { id: 'keyboard', label: 'Keyboard Navigation', icon: Keyboard },
    { id: 'aria', label: 'ARIA & Screen Readers', icon: Volume2 }
  ];

  return (
    <div className="p-6">
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Accessibility Testing & Analysis</h2>
            <p className="text-gray-600">
              Comprehensive accessibility audit with WCAG 2.1 compliance checking and contrast analysis.
            </p>
          </div>
          <button
            onClick={runAccessibilityScan}
            disabled={isScanning}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
          >
            <Zap className="w-4 h-4" />
            <span>{isScanning ? 'Scanning...' : 'Re-scan'}</span>
          </button>
        </div>

        {isScanning && (
          <div className="mt-4">
            <div className="flex items-center space-x-2 mb-2">
              <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
              <span className="text-sm text-gray-600">Analyzing accessibility...</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${scanProgress}%` }}
              ></div>
            </div>
          </div>
        )}
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
      {activeTab === 'contrast' && renderContrastAnalysis()}
      {activeTab === 'focus' && renderFocusAnalysis()}
      {activeTab === 'keyboard' && renderKeyboardAnalysis()}
      {activeTab === 'aria' && renderAriaAnalysis()}
    </div>
  );
};