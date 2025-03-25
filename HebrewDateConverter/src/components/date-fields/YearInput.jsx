export const YearInput = ({ value, onChange }) => {
  return (
    <div className="w-full sm:w-1/3 relative">
      <label className="block text-indigo-600 text-sm font-medium mb-1">
        שנה
      </label>
      <input
        type="number"
        className="w-full px-4 py-3 rounded-xl border-2 border-indigo-200 focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 transition-all bg-white shadow-md"
        value={value}
        onChange={onChange}
        min="1800"
        max="2300"
        placeholder="הקלד שנה"
        aria-label="שנה"
      />
    </div>
  );
};