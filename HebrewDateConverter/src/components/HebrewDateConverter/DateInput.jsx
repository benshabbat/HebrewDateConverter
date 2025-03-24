const DateInput = ({ value, onChange, error }) => {
  return (
    <div className="mb-4">
      <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="gregorian-date">
        הזן תאריך לועזי:
      </label>
      <input
        id="gregorian-date"
        type="date"
        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        value={value}
        onChange={onChange}
        aria-describedby="date-error"
      />
      {error && (
        <p id="date-error" className="text-red-500 text-sm mt-1">{error}</p>
      )}
    </div>
  );
};

export default DateInput;