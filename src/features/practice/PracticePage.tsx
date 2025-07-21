import React from 'react';

const PracticePage: React.FC = () => {
  return (
    <div className="h-full flex flex-col">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-black mb-2">Practice</h1>
        <p className="text-gray-600">Practice your IELTS skills</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Practice sections will go here */}
        <div className="bg-white border border-gray-100 rounded-xl p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-black mb-4">Reading Practice</h3>
          <p className="text-gray-600 mb-4">Improve your reading comprehension skills</p>
          <button className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors">
            Start Reading
          </button>
        </div>
        
        <div className="bg-white border border-gray-100 rounded-xl p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-black mb-4">Writing Practice</h3>
          <p className="text-gray-600 mb-4">Practice essays and writing tasks</p>
          <button className="w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors">
            Start Writing
          </button>
        </div>
        
        <div className="bg-white border border-gray-100 rounded-xl p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-black mb-4">Listening Practice</h3>
          <p className="text-gray-600 mb-4">Enhance your listening skills</p>
          <button className="w-full bg-purple-600 text-white py-2 px-4 rounded-lg hover:bg-purple-700 transition-colors">
            Start Listening
          </button>
        </div>
        
        <div className="bg-white border border-gray-100 rounded-xl p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-black mb-4">Speaking Practice</h3>
          <p className="text-gray-600 mb-4">Practice speaking exercises</p>
          <button className="w-full bg-orange-600 text-white py-2 px-4 rounded-lg hover:bg-orange-700 transition-colors">
            Start Speaking
          </button>
        </div>
      </div>
    </div>
  );
};

export default PracticePage;