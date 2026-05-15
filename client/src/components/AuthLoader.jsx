export default function AuthLoader() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50">
      {/* Main container */}
      <div className="flex flex-col items-center justify-center space-y-6">
        {/* Animated logo/icon container */}
        <div className="relative w-24 h-24">
          {/* Outer rotating circle */}
          <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-indigo-600 border-r-indigo-600 animate-spin"></div>

          {/* Middle pulsing circle */}
          <div className="absolute inset-2 rounded-full border-2 border-indigo-200 animate-pulse"></div>

          {/* Inner wallet/money icon */}
          <div className="absolute inset-0 flex items-center justify-center">
            <svg
              className="w-12 h-12 text-indigo-600"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h.008v.008h-.008v-.008zm0 2.25h.008v.008h-.008v-.008zm0 2.25h.008v.008h-.008v-.008zm4.5-6.75h.008v.008h-.008v-.008zm0 2.25h.008v.008h-.008v-.008zm0 2.25h.008v.008h-.008v-.008zm4.5-6.75h.008v.008h-.008v-.008zm0 2.25h.008v.008h-.008v-.008zm0 2.25h.008v.008h-.008v-.008zm4.5-6.75h.008v.008h-.008v-.008zm0 2.25h.008v.008h-.008v-.008zm0 2.25h.008v.008h-.008v-.008zM3.75 3h16.5A2.25 2.25 0 0121 5.25v13.5A2.25 2.25 0 0118.75 21H3.75A2.25 2.25 0 011.5 18.75V5.25A2.25 2.25 0 013.75 3z"
              />
            </svg>
          </div>
        </div>

        {/* Loading text */}
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-bold text-gray-900">Verifying Your Account</h2>
          <p className="text-gray-500 text-sm">Just a moment while we authenticate you...</p>
        </div>

        {/* Animated dots */}
        <div className="flex items-center justify-center space-x-2 mt-4">
          <div className="w-2 h-2 bg-indigo-600 rounded-full animate-bounce" style={{ animationDelay: '0s' }}></div>
          <div className="w-2 h-2 bg-indigo-600 rounded-full animate-bounce" style={{ animationDelay: '0.15s' }}></div>
          <div className="w-2 h-2 bg-indigo-600 rounded-full animate-bounce" style={{ animationDelay: '0.3s' }}></div>
        </div>
      </div>
    </div>
  );
}
