const HebrewDateDisplay = ({ hebrewDate }) => {
  return (
    <div className="border-t border-indigo-200 pt-6 mt-4">
      <div className="bg-white rounded-xl shadow-md p-6 transform transition-all">
        <h2 className="text-xl font-bold mb-3 text-indigo-700">
          התאריך העברי:
        </h2>
        <p className="text-3xl text-indigo-900 font-bold mb-2">{hebrewDate}</p>
        <div className="mt-4 pt-3 text-center border-t border-indigo-100">
          <p className="text-xs text-indigo-400 font-medium">
            Created by David-Chen Benshabbat
          </p>
        </div>
      </div>
    </div>
  );
};

export default HebrewDateDisplay;
