"use client";

import React, { useState, useEffect } from "react";

export default function AgeCalculator() {
  const [dob, setDob] = useState("");
  const [asOfDate, setAsOfDate] = useState("");
  const [ageData, setAgeData] = useState(null);

  useEffect(() => {
    const today = new Date();
    // Offset for local timezone correctly
    const tzOffset = today.getTimezoneOffset() * 60000; 
    const localISOTime = new Date(today.getTime() - tzOffset).toISOString().split('T')[0];
    setAsOfDate(localISOTime);
  }, []);

  const handleCalculate = () => {
    if (!dob || !asOfDate) {
      alert("Please select both dates.");
      return;
    }

    const d1 = new Date(dob);
    const d2 = new Date(asOfDate);

    if (d1 > d2) {
      alert("Date of birth cannot be after the 'Calculate As Of' date.");
      return;
    }

    let years = d2.getFullYear() - d1.getFullYear();
    let months = d2.getMonth() - d1.getMonth();
    let days = d2.getDate() - d1.getDate();

    if (days < 0) {
      months -= 1;
      const prevMonth = new Date(d2.getFullYear(), d2.getMonth(), 0);
      days += prevMonth.getDate();
    }

    if (months < 0) {
      years -= 1;
      months += 12;
    }

    // Calculating total days correctly
    // Ignore timezone offsets by using UTC
    const utc1 = Date.UTC(d1.getFullYear(), d1.getMonth(), d1.getDate());
    const utc2 = Date.UTC(d2.getFullYear(), d2.getMonth(), d2.getDate());
    const diffTime = Math.abs(utc2 - utc1);
    const totalDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    const totalWeeks = Math.floor(totalDays / 7);
    const totalMonths = years * 12 + months;
    const ageFloat = years + months / 12 + days / 365.25;

    setAgeData({
      years,
      months,
      days,
      totalDays,
      totalWeeks,
      totalMonths,
      ageFloat,
    });
  };

  const exams = [
    { name: "SSC CGL", min: 18, max: 32, limitString: "18 - 32" },
    { name: "SSC CHSL", min: 18, max: 27, limitString: "18 - 27" },
    { name: "SSC MTS", min: 18, max: 25, limitString: "18 - 25" },
    { name: "UPSC CSE", min: 21, max: 32, limitString: "21 - 32" },
    { name: "IBPS PO", min: 20, max: 30, limitString: "20 - 30" },
    { name: "IBPS Clerk", min: 20, max: 28, limitString: "20 - 28" },
    { name: "RRB NTPC", min: 18, max: 33, limitString: "18 - 33" },
    { name: "RRB Group D", min: 18, max: 33, limitString: "18 - 33" },
    { name: "NEET UG", min: 17, max: Infinity, limitString: "17 - No limit" },
    { name: "JEE Main", min: 0, max: Infinity, limitString: "No limit - No limit" },
    { name: "GATE", min: 0, max: Infinity, limitString: "No limit - No limit" },
    { name: "CTET", min: 18, max: Infinity, limitString: "18 - No limit" },
    { name: "NDA", min: 16.5, max: 19.5, limitString: "16.5 - 19.5" },
    { name: "CDS", min: 20, max: 25, limitString: "20 - 25" },
    { name: "Indian Army GD", min: 17.5, max: 21, limitString: "17.5 - 21" },
  ];

  return (
    <div className="w-full max-w-4xl mx-auto p-4 font-sans text-gray-800 dark:text-gray-200">
      <link
        rel="stylesheet"
        href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css"
      />

      <div className="bg-white dark:bg-[#09090b] border border-gray-200 dark:border-gray-800 rounded-3xl p-6 md:p-8 shadow-sm">
        <h2 className="text-3xl font-bold mb-6 text-center text-gray-900 dark:text-white">
          <i className="fa-solid fa-calculator text-indigo-500 mr-3"></i>
          Age Calculator
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div>
            <label className="block text-sm font-semibold mb-2 text-gray-700 dark:text-gray-300">
              Date of Birth
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <i className="fa-regular fa-calendar text-gray-400"></i>
              </div>
              <input
                type="date"
                value={dob}
                onChange={(e) => setDob(e.target.value)}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-xl focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-10 p-3 dark:bg-[#18181b] dark:border-gray-700 dark:placeholder-gray-400 dark:text-white"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-semibold mb-2 text-gray-700 dark:text-gray-300">
              Calculate As Of
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <i className="fa-solid fa-calendar-day text-gray-400"></i>
              </div>
              <input
                type="date"
                value={asOfDate}
                onChange={(e) => setAsOfDate(e.target.value)}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-xl focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-10 p-3 dark:bg-[#18181b] dark:border-gray-700 dark:placeholder-gray-400 dark:text-white"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-center mb-10">
          <button
            onClick={handleCalculate}
            className="bg-indigo-600 hover:bg-indigo-700 transition-colors text-white font-bold rounded-xl px-8 py-3.5 shadow-md flex items-center gap-2"
          >
            <i className="fa-solid fa-gears"></i> Calculate Age
          </button>
        </div>

        {ageData && (
          <div className="animate-fade-in-up">
            <div className="bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-100 dark:border-indigo-800/30 rounded-2xl p-6 text-center mb-8">
              <h3 className="text-lg font-medium text-indigo-800 dark:text-indigo-300 mb-4">
                Your Age is
              </h3>
              <div className="flex flex-wrap justify-center items-end gap-2 md:gap-4">
                <div className="flex flex-col items-center">
                  <span className="text-5xl md:text-6xl font-extrabold text-indigo-600 dark:text-indigo-400 leading-none">
                    {ageData.years}
                  </span>
                  <span className="text-sm md:text-base font-semibold mt-1 text-gray-600 dark:text-gray-400">
                    Years
                  </span>
                </div>
                <div className="text-3xl md:text-4xl text-gray-400 dark:text-gray-600 font-light mb-5">
                  ,
                </div>
                <div className="flex flex-col items-center">
                  <span className="text-4xl md:text-5xl font-bold text-gray-800 dark:text-gray-200 leading-none">
                    {ageData.months}
                  </span>
                  <span className="text-sm md:text-base font-semibold mt-1 text-gray-600 dark:text-gray-400">
                    Months
                  </span>
                </div>
                <div className="text-3xl md:text-4xl text-gray-400 dark:text-gray-600 font-light mb-5">
                  ,
                </div>
                <div className="flex flex-col items-center">
                  <span className="text-4xl md:text-5xl font-bold text-gray-800 dark:text-gray-200 leading-none">
                    {ageData.days}
                  </span>
                  <span className="text-sm md:text-base font-semibold mt-1 text-gray-600 dark:text-gray-400">
                    Days
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4 mt-8 pt-6 border-t border-indigo-100 dark:border-indigo-800/30">
                <div className="flex flex-col">
                  <span className="text-2xl font-bold text-gray-800 dark:text-gray-200">
                    {ageData.totalMonths}
                  </span>
                  <span className="text-xs text-gray-500 uppercase tracking-wide">
                    Total Months
                  </span>
                </div>
                <div className="flex flex-col">
                  <span className="text-2xl font-bold text-gray-800 dark:text-gray-200">
                    {ageData.totalWeeks.toLocaleString()}
                  </span>
                  <span className="text-xs text-gray-500 uppercase tracking-wide">
                    Total Weeks
                  </span>
                </div>
                <div className="flex flex-col">
                  <span className="text-2xl font-bold text-gray-800 dark:text-gray-200">
                    {ageData.totalDays.toLocaleString()}
                  </span>
                  <span className="text-xs text-gray-500 uppercase tracking-wide">
                    Total Days
                  </span>
                </div>
              </div>
            </div>

            <div className="mb-4">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                <i className="fa-solid fa-building-columns text-gray-400 mr-2"></i>
                Government Exam Age Eligibility
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                Based on your calculated age as of the selected date. Note that
                some exams calculate age as of a specific cutoff date in the
                year.
              </p>
            </div>

            <div className="overflow-x-auto rounded-xl border border-gray-200 dark:border-gray-800">
              <table className="w-full text-sm text-left">
                <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-[#18181b] dark:text-gray-300">
                  <tr>
                    <th scope="col" className="px-6 py-4">
                      Exam Name
                    </th>
                    <th scope="col" className="px-6 py-4">
                      Age Limit
                    </th>
                    <th scope="col" className="px-6 py-4 text-center">
                      Your Eligibility
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {exams.map((exam, index) => {
                    const isEligible =
                      ageData.ageFloat >= exam.min &&
                      ageData.ageFloat <= exam.max;
                    return (
                      <tr
                        key={index}
                        className="bg-white border-b dark:bg-[#09090b] dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-[#18181b]"
                      >
                        <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">
                          {exam.name}
                        </td>
                        <td className="px-6 py-4 text-gray-600 dark:text-gray-400 whitespace-nowrap">
                          {exam.limitString}
                        </td>
                        <td className="px-6 py-4 text-center">
                          {isEligible ? (
                            <span className="bg-green-100 text-green-800 text-xs font-semibold px-2.5 py-1 rounded dark:bg-green-900/30 dark:text-green-400 border border-green-200 dark:border-green-800/30">
                              <i className="fa-solid fa-check-circle mr-1"></i>
                              Eligible
                            </span>
                          ) : (
                            <span className="bg-red-100 text-red-800 text-xs font-semibold px-2.5 py-1 rounded dark:bg-red-900/30 dark:text-red-400 border border-red-200 dark:border-red-800/30">
                              <i className="fa-solid fa-xmark-circle mr-1"></i>
                              Not Eligible
                            </span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <div className="mt-6 p-4 bg-yellow-50 dark:bg-yellow-900/10 border border-yellow-200 dark:border-yellow-800/30 rounded-xl flex gap-3 text-sm text-yellow-800 dark:text-yellow-200">
              <i className="fa-solid fa-circle-info mt-0.5"></i>
              <p>
                <strong>Note:</strong> Age relaxation of 3-5 years is typically
                available for OBC/SC/ST categories as per government norms. 
                Please refer to the official exam notification for exact cutoff dates and 
                category-wise relaxation rules.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
