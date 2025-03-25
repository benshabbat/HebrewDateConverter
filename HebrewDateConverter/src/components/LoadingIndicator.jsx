
export const LoadingIndicator = ({ message = 'מחשב תאריך עברי...' }) => {
    return (
      <div className="flex flex-col items-center justify-center py-6 sm:py-8 bg-white bg-opacity-75 rounded-xl shadow-md">
        <div className="w-10 h-10 sm:w-12 sm:h-12 border-3 sm:border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
        <p className="mt-3 sm:mt-4 text-sm sm:text-base text-indigo-600 font-medium">{message}</p>
      </div>
    );
  };