import React from "react";

export default function Reports() {
  return (
    <div className="p-8">
      <h2 className="text-2xl font-bold mb-6">Reports</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {["Current Stock", "Consumption", "Receipt", "Combined"].map((report) => (
          <div key={report} className="bg-white p-6 rounded shadow">
            <h3 className="font-semibold mb-2">{report} Report</h3>
            <p className="text-gray-600">Generate and download {report.toLowerCase()} report in CSV or PDF format.</p>
            <button className="mt-4 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
              Generate
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
