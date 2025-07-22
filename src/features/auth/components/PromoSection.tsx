import React from 'react';

const PromoSection: React.FC = () => {
  return (
    <div className="relative bg-blue-600 h-full flex flex-col items-center justify-center p-12 text-white overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 left-10 w-16 h-16 border-2 border-white/20 rounded-lg transform rotate-12"></div>
        <div className="absolute top-32 right-20 w-12 h-12 border-2 border-white/20 rounded-lg transform -rotate-45"></div>
        <div className="absolute bottom-20 left-16 w-20 h-20 border-2 border-white/20 rounded-lg transform rotate-45"></div>
        <div className="absolute bottom-32 right-12 w-8 h-8 border-2 border-white/20 rounded-lg transform rotate-12"></div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 text-center max-w-lg">
        {/* Dashboard Mockup */}
        <div className="mb-8 relative">
          {/* Main Dashboard Card */}
          <div className="bg-white/95 backdrop-blur-sm rounded-xl shadow-2xl p-6 mx-auto max-w-sm transform rotate-3 hover:rotate-1 transition-transform duration-300">
            <div className="space-y-4">
              {/* Header */}
              <div className="flex items-center justify-between">
                <h3 className="text-gray-900 font-semibold">Speaking Progress</h3>
                <div className="text-green-500 text-sm font-medium">Band 7.5</div>
              </div>
              
              {/* Score */}
              <div>
                <div className="text-2xl font-bold text-gray-900">92%</div>
                <div className="text-gray-500 text-sm">Fluency Score</div>
              </div>
              
              {/* Progress Chart */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-600">Pronunciation</span>
                  <div className="flex-1 mx-2 bg-gray-200 rounded-full h-2">
                    <div className="bg-blue-400 h-2 rounded-full" style={{width: '85%'}}></div>
                  </div>
                  <span className="text-xs text-gray-600 w-8 text-right">85%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-600">Fluency</span>
                  <div className="flex-1 mx-2 bg-gray-200 rounded-full h-2">
                    <div className="bg-green-400 h-2 rounded-full" style={{width: '90%'}}></div>
                  </div>
                  <span className="text-xs text-gray-600 w-8 text-right">90%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-600">Vocabulary</span>
                  <div className="flex-1 mx-2 bg-gray-200 rounded-full h-2">
                    <div className="bg-purple-400 h-2 rounded-full" style={{width: '80%'}}></div>
                  </div>
                  <span className="text-xs text-gray-600 w-8 text-right">80%</span>
                </div>
              </div>
              
              {/* Speaking Skills */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="w-6 h-6 bg-green-400 rounded-full flex items-center justify-center">
                      <span className="text-white text-xs">🎯</span>
                    </div>
                    <span className="text-gray-700 text-sm">Fluency</span>
                  </div>
                  <span className="text-gray-900 font-medium">92%</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="w-6 h-6 bg-blue-400 rounded-full flex items-center justify-center">
                      <span className="text-white text-xs">📢</span>
                    </div>
                    <span className="text-gray-700 text-sm">Pronunciation</span>
                  </div>
                  <span className="text-gray-900 font-medium">88%</span>
                </div>
              </div>
            </div>
          </div>

          {/* Floating Score Card */}
          <div className="absolute -bottom-4 -right-4 bg-white rounded-lg shadow-lg p-3 transform -rotate-6 hover:rotate-0 transition-transform duration-300">
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-green-400 rounded-full"></div>
              <div>
                <div className="text-xs text-gray-500">Goal</div>
                <div className="text-sm font-bold text-gray-900">Band 8.0</div>
                <div className="text-xs text-green-500">15 days</div>
              </div>
            </div>
          </div>
        </div>

        {/* Text Content */}
        <div className="space-y-4">
          <h1 className="text-3xl md:text-4xl font-bold leading-tight">
            Speak like a native.
          </h1>
          <p className="text-blue-100 text-lg">
            Master fluency with AI-powered coaching!
          </p>
        </div>

        {/* Stats or Features */}
        <div className="mt-8 grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-2xl font-bold">10k+</div>
            <div className="text-blue-200 text-sm">Speakers</div>
          </div>
          <div>
            <div className="text-2xl font-bold">+20%</div>
            <div className="text-blue-200 text-sm">Avg Growth</div>
          </div>
          <div>
            <div className="text-2xl font-bold">24/7</div>
            <div className="text-blue-200 text-sm">AI Coach</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PromoSection;