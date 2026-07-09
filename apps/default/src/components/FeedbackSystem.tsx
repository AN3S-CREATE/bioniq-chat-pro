import React, { useState } from 'react';
import { Star, Send, X, CheckCircle2, MessageSquare, Lightbulb, Bug, Heart, ThumbsUp, ThumbsDown } from 'lucide-react';

interface FeedbackData {
  overallRating: number;
  usabilityRating: number;
  accuracyRating: number;
  speedRating: number;
  designRating: number;
  category: string;
  feedback: string;
  improvements: string;
  mostLiked: string;
  leastLiked: string;
  wouldRecommend: boolean | null;
  testerInfo: {
    role: string;
    experience: string;
    name: string;
    email: string;
  };
}

interface FeedbackSystemProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (feedback: FeedbackData) => void;
}

export const FeedbackSystem: React.FC<FeedbackSystemProps> = ({ isOpen, onClose, onSubmit }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [feedback, setFeedback] = useState<FeedbackData>({
    overallRating: 0,
    usabilityRating: 0,
    accuracyRating: 0,
    speedRating: 0,
    designRating: 0,
    category: '',
    feedback: '',
    improvements: '',
    mostLiked: '',
    leastLiked: '',
    wouldRecommend: null,
    testerInfo: {
      role: '',
      experience: '',
      name: '',
      email: ''
    }
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleRatingChange = (field: keyof FeedbackData, rating: number) => {
    setFeedback(prev => ({ ...prev, [field]: rating }));
  };

  const handleInputChange = (field: string, value: string) => {
    if (field.startsWith('testerInfo.')) {
      const infoField = field.split('.')[1];
      setFeedback(prev => ({
        ...prev,
        testerInfo: { ...prev.testerInfo, [infoField]: value }
      }));
    } else {
      setFeedback(prev => ({ ...prev, [field]: value }));
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsSubmitting(false);
    setIsSubmitted(true);
    onSubmit(feedback);
    
    // Auto close after success
    setTimeout(() => {
      onClose();
      setIsSubmitted(false);
      setCurrentStep(1);
      setFeedback({
        overallRating: 0,
        usabilityRating: 0,
        accuracyRating: 0,
        speedRating: 0,
        designRating: 0,
        category: '',
        feedback: '',
        improvements: '',
        mostLiked: '',
        leastLiked: '',
        wouldRecommend: null,
        testerInfo: {
          role: '',
          experience: '',
          name: '',
          email: ''
        }
      });
    }, 3000);
  };

  const renderStarRating = (rating: number, onChange: (rating: number) => void, label: string) => (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">{label}</label>
      <div className="flex space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            onClick={() => onChange(star)}
            className={`w-8 h-8 transition-colors ${
              rating >= star ? 'text-yellow-400' : 'text-gray-300 hover:text-yellow-300'
            }`}
          >
            <Star className="w-full h-full fill-current" />
          </button>
        ))}
      </div>
    </div>
  );

  const renderStep1 = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-xl font-bold text-gray-800 mb-2">Rate Your Experience</h3>
        <p className="text-gray-600">Help us improve the Bioniq WhatsApp Bot prototype</p>
      </div>

      <div className="space-y-4">
        {renderStarRating(feedback.overallRating, (rating) => handleRatingChange('overallRating', rating), 'Overall Experience')}
        {renderStarRating(feedback.usabilityRating, (rating) => handleRatingChange('usabilityRating', rating), 'Ease of Use')}
        {renderStarRating(feedback.accuracyRating, (rating) => handleRatingChange('accuracyRating', rating), 'Response Accuracy')}
        {renderStarRating(feedback.speedRating, (rating) => handleRatingChange('speedRating', rating), 'Response Speed')}
        {renderStarRating(feedback.designRating, (rating) => handleRatingChange('designRating', rating), 'Visual Design')}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Feedback Category</label>
        <select
          value={feedback.category}
          onChange={(e) => handleInputChange('category', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Select a category</option>
          <option value="usability">Usability & User Experience</option>
          <option value="functionality">Bot Functionality</option>
          <option value="design">Visual Design & Interface</option>
          <option value="content">Content & Messaging</option>
          <option value="performance">Performance & Speed</option>
          <option value="features">Missing Features</option>
          <option value="bugs">Bugs & Issues</option>
          <option value="general">General Feedback</option>
        </select>
      </div>

      <div className="flex justify-end">
        <button
          onClick={() => setCurrentStep(2)}
          disabled={feedback.overallRating === 0}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          Next Step
        </button>
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-xl font-bold text-gray-800 mb-2">Detailed Feedback</h3>
        <p className="text-gray-600">Share your thoughts and suggestions</p>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <MessageSquare className="w-4 h-4 inline mr-1" />
            Overall Feedback
          </label>
          <textarea
            value={feedback.feedback}
            onChange={(e) => handleInputChange('feedback', e.target.value)}
            placeholder="Share your overall experience with the WhatsApp bot prototype..."
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows={4}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <Heart className="w-4 h-4 inline mr-1" />
            What did you like most?
          </label>
          <textarea
            value={feedback.mostLiked}
            onChange={(e) => handleInputChange('mostLiked', e.target.value)}
            placeholder="What features or aspects impressed you the most?"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows={3}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <Bug className="w-4 h-4 inline mr-1" />
            What needs improvement?
          </label>
          <textarea
            value={feedback.leastLiked}
            onChange={(e) => handleInputChange('leastLiked', e.target.value)}
            placeholder="What aspects were confusing, frustrating, or could be better?"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows={3}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <Lightbulb className="w-4 h-4 inline mr-1" />
            Suggestions for Improvement
          </label>
          <textarea
            value={feedback.improvements}
            onChange={(e) => handleInputChange('improvements', e.target.value)}
            placeholder="Any specific suggestions or features you'd like to see added?"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows={3}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Would you recommend this WhatsApp bot to other Bioniq customers?
          </label>
          <div className="flex space-x-4">
            <button
              onClick={() => handleInputChange('wouldRecommend', 'true')}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg border transition-colors ${
                feedback.wouldRecommend === true
                  ? 'border-green-500 bg-green-50 text-green-700'
                  : 'border-gray-300 hover:border-green-300'
              }`}
            >
              <ThumbsUp className="w-4 h-4" />
              <span>Yes, definitely</span>
            </button>
            <button
              onClick={() => handleInputChange('wouldRecommend', 'false')}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg border transition-colors ${
                feedback.wouldRecommend === false
                  ? 'border-red-500 bg-red-50 text-red-700'
                  : 'border-gray-300 hover:border-red-300'
              }`}
            >
              <ThumbsDown className="w-4 h-4" />
              <span>No, needs work</span>
            </button>
          </div>
        </div>
      </div>

      <div className="flex justify-between">
        <button
          onClick={() => setCurrentStep(1)}
          className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
        >
          Previous
        </button>
        <button
          onClick={() => setCurrentStep(3)}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Next Step
        </button>
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-xl font-bold text-gray-800 mb-2">About You</h3>
        <p className="text-gray-600">Help us understand your perspective (optional)</p>
      </div>

      <div className="space-y-4">
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
            <input
              type="text"
              value={feedback.testerInfo.name}
              onChange={(e) => handleInputChange('testerInfo.name', e.target.value)}
              placeholder="Your name (optional)"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
            <input
              type="email"
              value={feedback.testerInfo.email}
              onChange={(e) => handleInputChange('testerInfo.email', e.target.value)}
              placeholder="your.email@example.com (optional)"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Your Role</label>
          <select
            value={feedback.testerInfo.role}
            onChange={(e) => handleInputChange('testerInfo.role', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select your role</option>
            <option value="customer">Bioniq Customer</option>
            <option value="potential-customer">Potential Customer</option>
            <option value="business-owner">Business Owner</option>
            <option value="developer">Developer/Technical</option>
            <option value="designer">Designer/UX</option>
            <option value="manager">Manager/Executive</option>
            <option value="support-agent">Customer Support Agent</option>
            <option value="other">Other</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Experience with WhatsApp Business Bots</label>
          <select
            value={feedback.testerInfo.experience}
            onChange={(e) => handleInputChange('testerInfo.experience', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select your experience level</option>
            <option value="never">Never used WhatsApp bots before</option>
            <option value="beginner">Beginner - used a few times</option>
            <option value="intermediate">Intermediate - regular user</option>
            <option value="advanced">Advanced - frequent user</option>
            <option value="expert">Expert - work with WhatsApp bots professionally</option>
          </select>
        </div>
      </div>

      <div className="flex justify-between">
        <button
          onClick={() => setCurrentStep(2)}
          className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
        >
          Previous
        </button>
        <button
          onClick={handleSubmit}
          disabled={isSubmitting}
          className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 transition-colors flex items-center space-x-2"
        >
          {isSubmitting ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              <span>Submitting...</span>
            </>
          ) : (
            <>
              <Send className="w-4 h-4" />
              <span>Submit Feedback</span>
            </>
          )}
        </button>
      </div>
    </div>
  );

  const renderSuccess = () => (
    <div className="text-center space-y-6">
      <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
        <CheckCircle2 className="w-8 h-8 text-green-600" />
      </div>
      <div>
        <h3 className="text-xl font-bold text-gray-800 mb-2">Thank You!</h3>
        <p className="text-gray-600">
          Your feedback has been submitted successfully. We appreciate your time and insights 
          in helping us improve the Bioniq WhatsApp Bot experience.
        </p>
      </div>
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <p className="text-sm text-blue-700">
          <strong>What happens next?</strong><br />
          Our team will review your feedback and use it to enhance the bot's functionality, 
          user experience, and overall performance. Thank you for being part of our improvement process!
        </p>
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-800">Feedback & Testing</h2>
              <p className="text-gray-600">Bioniq WhatsApp Bot Prototype</p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>

          {/* Progress Indicator */}
          {!isSubmitted && (
            <div className="mb-6">
              <div className="flex items-center space-x-2 mb-2">
                {[1, 2, 3].map((step) => (
                  <div
                    key={step}
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                      currentStep >= step
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-200 text-gray-600'
                    }`}
                  >
                    {step}
                  </div>
                ))}
              </div>
              <div className="text-sm text-gray-600">
                Step {currentStep} of 3: {
                  currentStep === 1 ? 'Ratings' :
                  currentStep === 2 ? 'Detailed Feedback' : 'About You'
                }
              </div>
            </div>
          )}

          {/* Content */}
          {isSubmitted ? renderSuccess() :
           currentStep === 1 ? renderStep1() :
           currentStep === 2 ? renderStep2() :
           renderStep3()}
        </div>
      </div>
    </div>
  );
};