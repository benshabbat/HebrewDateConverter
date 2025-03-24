
const HebrewDateDisplay = ({ hebrewDate }) => {
  return (
    <div className="border-t pt-4">
      <h2 className="text-xl font-semibold mb-2">התאריך העברי:</h2>
      <p className="text-2xl text-blue-800 font-bold">{hebrewDate}</p>
      <p className="text-sm text-gray-500 mt-4">
        המרה באמצעות ממשק DateTimeFormat המובנה בדפדפנים מודרניים עם תיקונים לאדר א'/ב' ולתצוגת גימטריה נכונה.
      </p>
    </div>
  );
};

export default HebrewDateDisplay;