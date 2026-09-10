"use client";

import React, { useState, useRef, useEffect } from "react";
import { jsPDF } from "jspdf";
import { auth } from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { useProStatus } from "@/hooks/useProStatus";

export default function RailwayFormMaker() {
  const [user, setUser] = useState(null);
  const { isPro } = useProStatus(user);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  const [formType, setFormType] = useState("reservation"); // "reservation" or "cancellation"

  const [journey, setJourney] = useState({
    trainNo: "12951",
    trainName: "MUMBAI RAJDHANI",
    journeyDate: new Date(Date.now() + 86400000 * 3).toISOString().split("T")[0],
    travelClass: "3A",
    numBerths: "2",
    fromStation: "NEW DELHI (NDLS)",
    toStation: "MUMBAI CENTRAL (MMCT)",
    boardingStation: "NEW DELHI (NDLS)",
    reservationUpto: "MUMBAI CENTRAL (MMCT)",
    mobileNo: "9876543210",
    pnrNo: "", // for cancellation
  });

  const [passengers, setPassengers] = useState([
    { name: "RAMESH KUMAR", gender: "M", age: "42", berth: "LB", senior: false, meal: "V" },
    { name: "SUNITA SHARMA", gender: "F", age: "39", berth: "MB", senior: false, meal: "V" },
  ]);

  const [applicant, setApplicant] = useState({
    name: "RAMESH KUMAR",
    address: "H.No 124, Sector 15, New Delhi",
    aadhaar: "XXXX-XXXX-1234",
    telephone: "9876543210",
    date: new Date().toISOString().split("T")[0],
  });

  const [hasReturnJourney, setHasReturnJourney] = useState(false);
  const [returnJourney, setReturnJourney] = useState({
    trainNo: "12952",
    trainName: "NEW DELHI RAJDHANI",
    journeyDate: new Date(Date.now() + 86400000 * 7).toISOString().split("T")[0],
    travelClass: "3A",
    fromStation: "MUMBAI CENTRAL (MMCT)",
    toStation: "NEW DELHI (NDLS)",
  });

  const [isGenerating, setIsGenerating] = useState(false);

  const addPassenger = () => {
    if (passengers.length >= 6) {
      alert("Indian Railways allows a maximum of 6 passengers per reservation form.");
      return;
    }
    setPassengers(prev => [
      ...prev,
      { name: "", gender: "M", age: "", berth: "NONE", senior: false, meal: "V" }
    ]);
  };

  const removePassenger = (index) => {
    if (passengers.length <= 1) {
      alert("At least one passenger is required.");
      return;
    }
    setPassengers(prev => prev.filter((_, i) => i !== index));
  };

  const updatePassenger = (index, field, value) => {
    setPassengers(prev => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  };

  // Generate Official Indian Railways A4 PDF
  const generatePdf = () => {
    setIsGenerating(true);

    try {
      const doc = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });

      const pageWidth = 210;
      const margin = 12;
      const contentWidth = pageWidth - margin * 2; // 186mm
      let y = 14;

      // Outer border
      doc.setDrawColor(20, 50, 120);
      doc.setLineWidth(0.8);
      doc.rect(margin - 2, 8, contentWidth + 4, 280);

      // Inner thin border
      doc.setLineWidth(0.2);
      doc.rect(margin - 1, 9, contentWidth + 2, 278);

      // Header: Indian Railways
      doc.setFont("helvetica", "bold");
      doc.setFontSize(14);
      doc.setTextColor(20, 50, 120);
      doc.text("भारतीय रेल / INDIAN RAILWAYS", pageWidth / 2, y, { align: "center" });

      y += 6;
      doc.setFontSize(11);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(0, 0, 0);
      const titleText = formType === "reservation"
        ? "आरक्षण मांग पत्र / REQUISITION FOR RESERVATION"
        : "रद्दीकरण मांग पत्र / REQUISITION FOR CANCELLATION";
      doc.text(titleText, pageWidth / 2, y, { align: "center" });

      y += 4;
      doc.setFontSize(7.5);
      doc.setFont("helvetica", "italic");
      doc.setTextColor(90, 90, 90);
      doc.text("(केवल एक फॉर्म पर अधिकतम 6 यात्रियों के लिए / Max 6 passengers per requisition slip)", pageWidth / 2, y, { align: "center" });

      y += 5;
      doc.setDrawColor(20, 50, 120);
      doc.setLineWidth(0.5);
      doc.line(margin, y, margin + contentWidth, y);

      // Section 1: Journey Details Table
      y += 5;
      doc.setFontSize(8.5);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(0, 0, 0);

      // Row 1
      doc.text(`गाड़ी सं. / Train No:`, margin, y);
      doc.setFont("helvetica", "normal");
      doc.text(`${journey.trainNo}`, margin + 30, y);

      doc.setFont("helvetica", "bold");
      doc.text(`गाड़ी का नाम / Train Name:`, margin + 65, y);
      doc.setFont("helvetica", "normal");
      doc.text(`${journey.trainName}`, margin + 105, y);

      y += 5.5;
      // Row 2
      doc.setFont("helvetica", "bold");
      doc.text(`यात्रा तिथि / Date:`, margin, y);
      doc.setFont("helvetica", "normal");
      doc.text(`${journey.journeyDate}`, margin + 30, y);

      doc.setFont("helvetica", "bold");
      doc.text(`श्रेणी / Class:`, margin + 65, y);
      doc.setFont("helvetica", "normal");
      doc.text(`${journey.travelClass}`, margin + 85, y);

      doc.setFont("helvetica", "bold");
      doc.text(`सीट/बर्थ सं. / No. of Berths:`, margin + 115, y);
      doc.setFont("helvetica", "normal");
      doc.text(`${passengers.length}`, margin + 165, y);

      y += 5.5;
      // Row 3
      doc.setFont("helvetica", "bold");
      doc.text(`से / From Station:`, margin, y);
      doc.setFont("helvetica", "normal");
      doc.text(`${journey.fromStation}`, margin + 30, y);

      doc.setFont("helvetica", "bold");
      doc.text(`तक / To Station:`, margin + 95, y);
      doc.setFont("helvetica", "normal");
      doc.text(`${journey.toStation}`, margin + 125, y);

      y += 5.5;
      // Row 4
      doc.setFont("helvetica", "bold");
      doc.text(`बोर्डिंग स्टेशन / Boarding:`, margin, y);
      doc.setFont("helvetica", "normal");
      doc.text(`${journey.boardingStation}`, margin + 35, y);

      doc.setFont("helvetica", "bold");
      doc.text(`आरक्षण तक / Res Upto:`, margin + 95, y);
      doc.setFont("helvetica", "normal");
      doc.text(`${journey.reservationUpto}`, margin + 130, y);

      if (formType === "cancellation" && journey.pnrNo) {
        y += 5.5;
        doc.setFont("helvetica", "bold");
        doc.setTextColor(180, 20, 20);
        doc.text(`पी.एन.आर सं. / PNR Number: ${journey.pnrNo}`, margin, y);
        doc.setTextColor(0, 0, 0);
      }

      y += 6;
      doc.line(margin, y, margin + contentWidth, y);

      // Section 2: Passengers Table
      y += 5;
      doc.setFont("helvetica", "bold");
      doc.setFontSize(9);
      doc.text("यात्रियों का विवरण / PARTICULARS OF PASSENGERS:", margin, y);

      y += 3;
      // Table Header Box
      const rowHeight = 7;
      doc.setFillColor(240, 244, 255);
      doc.rect(margin, y, contentWidth, rowHeight, "F");
      doc.setDrawColor(150, 150, 150);
      doc.setLineWidth(0.2);
      doc.rect(margin, y, contentWidth, rowHeight);

      doc.setFontSize(7.5);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(20, 50, 120);

      const colX = {
        sno: margin + 2,
        name: margin + 12,
        gender: margin + 85,
        age: margin + 102,
        berth: margin + 118,
        senior: margin + 148,
        meal: margin + 170,
      };

      doc.text("क्र. / S.No", colX.sno, y + 4.8);
      doc.text("यात्री का नाम / Passenger Name (In Block Letters)", colX.name, y + 4.8);
      doc.text("लिंग / Sex", colX.gender, y + 4.8);
      doc.text("आयु / Age", colX.age, y + 4.8);
      doc.text("बर्थ पसंद / Berth", colX.berth, y + 4.8);
      doc.text("रियायत / Concession", colX.senior, y + 4.8);
      doc.text("खान-पान / Meal", colX.meal, y + 4.8);

      y += rowHeight;

      // Table Rows (up to 6)
      doc.setFont("helvetica", "normal");
      doc.setFontSize(8);
      doc.setTextColor(0, 0, 0);

      for (let i = 0; i < 6; i++) {
        const p = passengers[i];
        doc.rect(margin, y, contentWidth, rowHeight);

        // Column vertical lines
        doc.line(margin + 10, y, margin + 10, y + rowHeight);
        doc.line(margin + 82, y, margin + 82, y + rowHeight);
        doc.line(margin + 98, y, margin + 98, y + rowHeight);
        doc.line(margin + 114, y, margin + 114, y + rowHeight);
        doc.line(margin + 144, y, margin + 144, y + rowHeight);
        doc.line(margin + 168, y, margin + 168, y + rowHeight);

        doc.text(`${i + 1}`, colX.sno + 2, y + 4.8);

        if (p) {
          doc.setFont("helvetica", "bold");
          doc.text((p.name || "").toUpperCase().slice(0, 32), colX.name, y + 4.8);
          doc.setFont("helvetica", "normal");
          doc.text(p.gender || "-", colX.gender + 3, y + 4.8);
          doc.text(String(p.age || "-"), colX.age + 2, y + 4.8);
          
          const berthLabels = { LB: "Lower", MB: "Middle", UB: "Upper", SL: "Side Low", SU: "Side Up", WS: "Window", NONE: "No Choice" };
          doc.text(berthLabels[p.berth] || p.berth || "-", colX.berth, y + 4.8);

          doc.text(p.senior ? "Sr. Citizen" : "None", colX.senior, y + 4.8);
          doc.text(p.meal === "V" ? "Veg" : p.meal === "N" ? "Non-Veg" : "-", colX.meal + 1, y + 4.8);
        }

        y += rowHeight;
      }

      // Section 3: Return Journey Details (Optional)
      y += 4;
      doc.setFont("helvetica", "bold");
      doc.setFontSize(8.5);
      doc.setTextColor(20, 50, 120);
      doc.text("वापसी यात्रा का विवरण / DETAILS OF RETURN JOURNEY:", margin, y);

      y += 3.5;
      doc.setFillColor(248, 249, 250);
      doc.rect(margin, y, contentWidth, 14, "F");
      doc.rect(margin, y, contentWidth, 14);

      doc.setFontSize(7.5);
      doc.setTextColor(0, 0, 0);

      if (hasReturnJourney) {
        doc.setFont("helvetica", "bold");
        doc.text(`गाड़ी सं. / Train: ${returnJourney.trainNo} - ${returnJourney.trainName}`, margin + 3, y + 4.5);
        doc.text(`तिथि / Date: ${returnJourney.journeyDate}`, margin + 115, y + 4.5);
        doc.text(`श्रेणी / Class: ${returnJourney.travelClass}`, margin + 155, y + 4.5);

        doc.text(`कहाँ से / From: ${returnJourney.fromStation}`, margin + 3, y + 10.5);
        doc.text(`कहाँ तक / To: ${returnJourney.toStation}`, margin + 100, y + 10.5);
      } else {
        doc.setFont("helvetica", "italic");
        doc.setTextColor(120, 120, 120);
        doc.text("लागू नहीं / Not Applicable (One-way Journey)", margin + 50, y + 8);
      }

      y += 18;

      // Section 4: Applicant Details
      doc.setFont("helvetica", "bold");
      doc.setFontSize(8.5);
      doc.setTextColor(0, 0, 0);
      doc.text("आवेदक का नाम एवं पता / NAME & ADDRESS OF APPLICANT:", margin, y);

      y += 4;
      doc.rect(margin, y, contentWidth, 38);

      doc.setFontSize(8);
      doc.setFont("helvetica", "bold");
      doc.text("आवेदक का नाम / Name of Applicant:", margin + 3, y + 6);
      doc.setFont("helvetica", "normal");
      doc.text((applicant.name || "").toUpperCase(), margin + 55, y + 6);

      doc.setFont("helvetica", "bold");
      doc.text("पूरा पता / Full Address:", margin + 3, y + 12);
      doc.setFont("helvetica", "normal");
      doc.text(applicant.address || "", margin + 40, y + 12);

      doc.setFont("helvetica", "bold");
      doc.text("आधार सं. / Aadhaar (Optional):", margin + 3, y + 18);
      doc.setFont("helvetica", "normal");
      doc.text(applicant.aadhaar || "N/A", margin + 50, y + 18);

      doc.setFont("helvetica", "bold");
      doc.text("मोबाइल सं. / Mobile Number:", margin + 105, y + 18);
      doc.setFont("helvetica", "normal");
      doc.text(journey.mobileNo || applicant.telephone || "", margin + 148, y + 18);

      doc.setFont("helvetica", "bold");
      doc.text(`दिनांक / Date: ${applicant.date || new Date().toISOString().split("T")[0]}`, margin + 3, y + 32);

      doc.text("हस्ताक्षर / Signature of Applicant:", margin + 105, y + 32);
      doc.line(margin + 155, y + 32, margin + contentWidth - 5, y + 32);

      y += 44;

      // Section 5: Official Use Only Box (PRS Counter Clerk)
      doc.setFillColor(245, 245, 245);
      doc.rect(margin, y, contentWidth, 24, "F");
      doc.rect(margin, y, contentWidth, 24);

      doc.setFontSize(7.5);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(90, 90, 90);
      doc.text("केवल कार्यालयीन उपयोग के लिए / FOR OFFICIAL USE ONLY (PRS COUNTER)", margin + 4, y + 5);

      doc.setFont("helvetica", "normal");
      doc.text("पी.एन.आर सं. / PNR No: ____________________", margin + 4, y + 12);
      doc.text("टिकट सं. / Ticket No: ____________________", margin + 80, y + 12);
      doc.text("कुल किराया / Total Fare: ₹ ____________", margin + 140, y + 12);

      doc.text("क्लर्क के हस्ताक्षर / Booking Clerk Sign: ________________", margin + 4, y + 19);
      doc.text("काउंटर सं. / Counter No: ______", margin + 100, y + 19);
      doc.text("समय / Time: ________", margin + 145, y + 19);

      y += 28;

      // Footer note
      doc.setFontSize(6.5);
      doc.setFont("helvetica", "italic");
      doc.setTextColor(100, 100, 100);
      doc.text("नोट: कृपया फॉर्म साफ अक्षरों में भरें। तत्काल और वरिष्ठ नागरिक रियायत के लिए पहचान पत्र अनिवार्य है।", pageWidth / 2, y, { align: "center" });
      doc.text("Generated securely on DesiPDF • 100% Client-Side • Verified Indian Railways PRS Format", pageWidth / 2, y + 3.5, { align: "center" });

      doc.save(`Indian_Railways_${formType === "reservation" ? "Reservation" : "Cancellation"}_Slip_${journey.trainNo}.pdf`);
    } catch (err) {
      console.error(err);
      alert("Failed to generate PDF. Please check form entries.");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto font-sans space-y-8">
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" />

      {/* Main Container */}
      <div className="bg-white dark:bg-[#09090b] border border-gray-200 dark:border-gray-800 rounded-3xl p-6 sm:p-10 shadow-sm">
        
        {/* Header Badge */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-100 dark:border-gray-800 pb-6 mb-8">
          <div className="flex items-center gap-3">
            <div className="h-14 w-14 rounded-2xl bg-blue-600 text-white flex items-center justify-center text-2xl shadow-md shadow-blue-500/20">
              <i className="fa-solid fa-train"></i>
            </div>
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider mb-0.5">
                <span>भारतीय रेल • Official PRS Requisition Slip</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white">
                Railway Reservation &amp; Cancellation Form
              </h2>
            </div>
          </div>

          {/* Form Type Selector */}
          <div className="flex bg-gray-100 dark:bg-gray-800 p-1.5 rounded-2xl border border-gray-200 dark:border-gray-700">
            <button
              onClick={() => setFormType("reservation")}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                formType === "reservation"
                  ? "bg-blue-600 text-white shadow-sm"
                  : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
              }`}
            >
              <i className="fa-solid fa-ticket mr-1.5"></i>
              आरक्षण / Reservation
            </button>
            <button
              onClick={() => setFormType("cancellation")}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                formType === "cancellation"
                  ? "bg-red-600 text-white shadow-sm"
                  : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
              }`}
            >
              <i className="fa-solid fa-ban mr-1.5"></i>
              रद्दीकरण / Cancellation
            </button>
          </div>
        </div>

        {/* Form Body */}
        <div className="space-y-8">
          
          {/* SECTION 1: TRAIN & JOURNEY */}
          <div>
            <div className="flex items-center gap-2 mb-4 text-blue-600 dark:text-blue-400 font-bold text-sm uppercase tracking-wider">
              <i className="fa-solid fa-map-location-dot"></i>
              <span>1. Train &amp; Travel Details / यात्रा विवरण</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                  Train No. (गाड़ी सं.) *
                </label>
                <input
                  type="text"
                  value={journey.trainNo}
                  onChange={(e) => setJourney({ ...journey, trainNo: e.target.value })}
                  placeholder="e.g. 12951"
                  className="w-full bg-gray-50 dark:bg-[#121217] border border-gray-200 dark:border-gray-800 rounded-xl py-2.5 px-3 text-sm font-semibold text-gray-900 dark:text-white outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                  Train Name (गाड़ी का नाम)
                </label>
                <input
                  type="text"
                  value={journey.trainName}
                  onChange={(e) => setJourney({ ...journey, trainName: e.target.value })}
                  placeholder="e.g. Rajdhani Express"
                  className="w-full bg-gray-50 dark:bg-[#121217] border border-gray-200 dark:border-gray-800 rounded-xl py-2.5 px-3 text-sm font-semibold text-gray-900 dark:text-white outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                  Date of Journey (यात्रा तिथि) *
                </label>
                <input
                  type="date"
                  value={journey.journeyDate}
                  onChange={(e) => setJourney({ ...journey, journeyDate: e.target.value })}
                  className="w-full bg-gray-50 dark:bg-[#121217] border border-gray-200 dark:border-gray-800 rounded-xl py-2.5 px-3 text-sm font-semibold text-gray-900 dark:text-white outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                  Class (श्रेणी)
                </label>
                <select
                  value={journey.travelClass}
                  onChange={(e) => setJourney({ ...journey, travelClass: e.target.value })}
                  className="w-full bg-gray-50 dark:bg-[#121217] border border-gray-200 dark:border-gray-800 rounded-xl py-2.5 px-3 text-sm font-semibold text-gray-900 dark:text-white outline-none focus:border-blue-500"
                >
                  <option value="SL">Sleeper (SL)</option>
                  <option value="3A">AC 3 Tier (3A)</option>
                  <option value="3E">AC 3 Economy (3E)</option>
                  <option value="2A">AC 2 Tier (2A)</option>
                  <option value="1A">First AC (1A)</option>
                  <option value="CC">AC Chair Car (CC)</option>
                  <option value="EC">Exec. Chair Car (EC)</option>
                  <option value="2S">Second Sitting (2S)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                  From Station (कहाँ से) *
                </label>
                <input
                  type="text"
                  value={journey.fromStation}
                  onChange={(e) => setJourney({ ...journey, fromStation: e.target.value })}
                  placeholder="e.g. New Delhi (NDLS)"
                  className="w-full bg-gray-50 dark:bg-[#121217] border border-gray-200 dark:border-gray-800 rounded-xl py-2.5 px-3 text-sm font-semibold text-gray-900 dark:text-white outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                  To Station (कहाँ तक) *
                </label>
                <input
                  type="text"
                  value={journey.toStation}
                  onChange={(e) => setJourney({ ...journey, toStation: e.target.value })}
                  placeholder="e.g. Mumbai Central (MMCT)"
                  className="w-full bg-gray-50 dark:bg-[#121217] border border-gray-200 dark:border-gray-800 rounded-xl py-2.5 px-3 text-sm font-semibold text-gray-900 dark:text-white outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                  Boarding Station (बोर्डिंग स्टेशन)
                </label>
                <input
                  type="text"
                  value={journey.boardingStation}
                  onChange={(e) => setJourney({ ...journey, boardingStation: e.target.value })}
                  placeholder="e.g. New Delhi (NDLS)"
                  className="w-full bg-gray-50 dark:bg-[#121217] border border-gray-200 dark:border-gray-800 rounded-xl py-2.5 px-3 text-sm font-semibold text-gray-900 dark:text-white outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                  Mobile Number (मोबाइल सं.) *
                </label>
                <input
                  type="tel"
                  maxLength="10"
                  value={journey.mobileNo}
                  onChange={(e) => setJourney({ ...journey, mobileNo: e.target.value })}
                  placeholder="10-digit mobile"
                  className="w-full bg-gray-50 dark:bg-[#121217] border border-gray-200 dark:border-gray-800 rounded-xl py-2.5 px-3 text-sm font-semibold text-gray-900 dark:text-white outline-none focus:border-blue-500"
                />
              </div>

              {formType === "cancellation" && (
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-red-600 dark:text-red-400 mb-1">
                    PNR Number (रद्दीकरण के लिए पी.एन.आर सं.) *
                  </label>
                  <input
                    type="text"
                    maxLength="10"
                    value={journey.pnrNo}
                    onChange={(e) => setJourney({ ...journey, pnrNo: e.target.value })}
                    placeholder="10-digit PNR Number"
                    className="w-full bg-red-50/50 dark:bg-red-950/20 border border-red-200 dark:border-red-900 rounded-xl py-2.5 px-3 text-sm font-semibold text-gray-900 dark:text-white outline-none focus:border-red-500"
                  />
                </div>
              )}
            </div>
          </div>

          {/* SECTION 2: PASSENGERS TABLE */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400 font-bold text-sm uppercase tracking-wider">
                <i className="fa-solid fa-users"></i>
                <span>2. Passengers / यात्रियों का विवरण ({passengers.length}/6)</span>
              </div>
              <button
                onClick={addPassenger}
                disabled={passengers.length >= 6}
                className="px-3.5 py-1.5 rounded-xl bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800 text-xs font-bold hover:bg-blue-100 transition disabled:opacity-50"
              >
                <i className="fa-solid fa-plus mr-1"></i> Add Passenger
              </button>
            </div>

            <div className="space-y-3">
              {passengers.map((p, idx) => (
                <div
                  key={idx}
                  className="bg-gray-50 dark:bg-[#121217] border border-gray-200 dark:border-gray-800 rounded-2xl p-4 flex flex-col lg:flex-row gap-3 items-start lg:items-center justify-between"
                >
                  <span className="h-6 w-6 rounded-full bg-blue-600 text-white text-xs font-bold flex items-center justify-center shrink-0">
                    {idx + 1}
                  </span>

                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 flex-1 w-full">
                    <div className="col-span-2 sm:col-span-2">
                      <input
                        type="text"
                        value={p.name}
                        onChange={(e) => updatePassenger(idx, "name", e.target.value)}
                        placeholder="Full Name (BLOCK LETTERS)"
                        className="w-full bg-white dark:bg-black border border-gray-200 dark:border-gray-700 rounded-xl py-2 px-3 text-xs font-semibold text-gray-900 dark:text-white outline-none uppercase"
                      />
                    </div>

                    <div>
                      <select
                        value={p.gender}
                        onChange={(e) => updatePassenger(idx, "gender", e.target.value)}
                        className="w-full bg-white dark:bg-black border border-gray-200 dark:border-gray-700 rounded-xl py-2 px-2 text-xs font-semibold text-gray-900 dark:text-white outline-none"
                      >
                        <option value="M">Male</option>
                        <option value="F">Female</option>
                        <option value="T">Transgender</option>
                      </select>
                    </div>

                    <div>
                      <input
                        type="number"
                        min="1"
                        max="120"
                        value={p.age}
                        onChange={(e) => updatePassenger(idx, "age", e.target.value)}
                        placeholder="Age"
                        className="w-full bg-white dark:bg-black border border-gray-200 dark:border-gray-700 rounded-xl py-2 px-2 text-xs font-semibold text-gray-900 dark:text-white outline-none"
                      />
                    </div>

                    <div>
                      <select
                        value={p.berth}
                        onChange={(e) => updatePassenger(idx, "berth", e.target.value)}
                        className="w-full bg-white dark:bg-black border border-gray-200 dark:border-gray-700 rounded-xl py-2 px-2 text-xs font-semibold text-gray-900 dark:text-white outline-none"
                      >
                        <option value="NONE">No Choice</option>
                        <option value="LB">Lower (LB)</option>
                        <option value="MB">Middle (MB)</option>
                        <option value="UB">Upper (UB)</option>
                        <option value="SL">Side Lower (SL)</option>
                        <option value="SU">Side Upper (SU)</option>
                        <option value="WS">Window Seat</option>
                      </select>
                    </div>

                    <div>
                      <select
                        value={p.meal}
                        onChange={(e) => updatePassenger(idx, "meal", e.target.value)}
                        className="w-full bg-white dark:bg-black border border-gray-200 dark:border-gray-700 rounded-xl py-2 px-2 text-xs font-semibold text-gray-900 dark:text-white outline-none"
                      >
                        <option value="V">Veg Meal</option>
                        <option value="N">Non-Veg</option>
                        <option value="NONE">No Food</option>
                      </select>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 self-end lg:self-center shrink-0">
                    <label className="flex items-center gap-1.5 text-xs text-gray-600 dark:text-gray-400 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={p.senior}
                        onChange={(e) => updatePassenger(idx, "senior", e.target.checked)}
                        className="rounded accent-blue-600"
                      />
                      <span>Sr. Citizen</span>
                    </label>
                    <button
                      onClick={() => removePassenger(idx)}
                      className="text-gray-400 hover:text-red-500 transition p-1"
                      title="Remove Passenger"
                    >
                      <i className="fa-solid fa-trash-can text-xs"></i>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* SECTION 3: APPLICANT DETAILS */}
          <div>
            <div className="flex items-center gap-2 mb-4 text-blue-600 dark:text-blue-400 font-bold text-sm uppercase tracking-wider">
              <i className="fa-solid fa-id-card"></i>
              <span>3. Applicant Details / आवेदक का विवरण</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                  Applicant Name (आवेदक का नाम) *
                </label>
                <input
                  type="text"
                  value={applicant.name}
                  onChange={(e) => setApplicant({ ...applicant, name: e.target.value })}
                  placeholder="Name of person booking at counter"
                  className="w-full bg-gray-50 dark:bg-[#121217] border border-gray-200 dark:border-gray-800 rounded-xl py-2.5 px-3 text-sm font-semibold text-gray-900 dark:text-white outline-none uppercase"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                  Full Residential Address (पूरा पता) *
                </label>
                <input
                  type="text"
                  value={applicant.address}
                  onChange={(e) => setApplicant({ ...applicant, address: e.target.value })}
                  placeholder="House No, Street, City, Pincode"
                  className="w-full bg-gray-50 dark:bg-[#121217] border border-gray-200 dark:border-gray-800 rounded-xl py-2.5 px-3 text-sm font-semibold text-gray-900 dark:text-white outline-none"
                />
              </div>
            </div>
          </div>

          {/* RETURN JOURNEY TOGGLE */}
          <div className="bg-gray-50 dark:bg-[#121217] p-4 rounded-2xl border border-gray-200/80 dark:border-gray-800">
            <label className="flex items-center gap-2.5 cursor-pointer">
              <input
                type="checkbox"
                checked={hasReturnJourney}
                onChange={(e) => setHasReturnJourney(e.target.checked)}
                className="h-4 w-4 rounded accent-blue-600"
              />
              <span className="text-sm font-bold text-gray-900 dark:text-gray-200">
                Add Return Journey Details (वापसी यात्रा का विवरण)
              </span>
            </label>

            {hasReturnJourney && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mt-4 pt-3 border-t border-gray-200 dark:border-gray-800">
                <div>
                  <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                    Return Train No.
                  </label>
                  <input
                    type="text"
                    value={returnJourney.trainNo}
                    onChange={(e) => setReturnJourney({ ...returnJourney, trainNo: e.target.value })}
                    className="w-full bg-white dark:bg-black border border-gray-200 dark:border-gray-700 rounded-xl py-2 px-3 text-xs font-semibold text-gray-900 dark:text-white outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                    Return Date
                  </label>
                  <input
                    type="date"
                    value={returnJourney.journeyDate}
                    onChange={(e) => setReturnJourney({ ...returnJourney, journeyDate: e.target.value })}
                    className="w-full bg-white dark:bg-black border border-gray-200 dark:border-gray-700 rounded-xl py-2 px-3 text-xs font-semibold text-gray-900 dark:text-white outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                    From
                  </label>
                  <input
                    type="text"
                    value={returnJourney.fromStation}
                    onChange={(e) => setReturnJourney({ ...returnJourney, fromStation: e.target.value })}
                    className="w-full bg-white dark:bg-black border border-gray-200 dark:border-gray-700 rounded-xl py-2 px-3 text-xs font-semibold text-gray-900 dark:text-white outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                    To
                  </label>
                  <input
                    type="text"
                    value={returnJourney.toStation}
                    onChange={(e) => setReturnJourney({ ...returnJourney, toStation: e.target.value })}
                    className="w-full bg-white dark:bg-black border border-gray-200 dark:border-gray-700 rounded-xl py-2 px-3 text-xs font-semibold text-gray-900 dark:text-white outline-none"
                  />
                </div>
              </div>
            )}
          </div>

          {/* ACTION BUTTON */}
          <div className="pt-4 border-t border-gray-100 dark:border-gray-800 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-xs text-gray-500 dark:text-gray-400">
              <i className="fa-solid fa-circle-check text-emerald-500 mr-1.5"></i>
              Official Indian Railways Layout • Standard A4 Printable Slip • Accepted at all PRS Counters
            </div>

            <button
              onClick={generatePdf}
              disabled={isGenerating || !journey.trainNo || !applicant.name}
              className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold text-base transition flex items-center justify-center gap-2 shadow-lg shadow-blue-500/20 disabled:opacity-60"
            >
              {isGenerating ? (
                <>
                  <i className="fa-solid fa-spinner fa-spin"></i>
                  <span>Generating Official Form...</span>
                </>
              ) : (
                <>
                  <i className="fa-solid fa-file-pdf text-lg"></i>
                  <span>Download Printable Official Form (PDF)</span>
                </>
              )}
            </button>
          </div>

        </div>
      </div>

      {/* Official Guidelines Section */}
      <div className="bg-white dark:bg-[#09090b] border border-gray-200 dark:border-gray-800 rounded-3xl p-6 sm:p-8 space-y-4">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
          <i className="fa-solid fa-circle-info text-blue-500"></i>
          Official PRS Counter Rules &amp; Instructions
        </h3>
        <ul className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 space-y-2.5 list-disc pl-5">
          <li><strong>Max 6 Passengers:</strong> Only one reservation requisition form is permitted for a maximum of 6 passengers traveling together on the same train and date.</li>
          <li><strong>Tatkal Booking:</strong> For Tatkal reservations, only 4 passengers are permitted per form. Carry valid original Government ID (Aadhaar, Voter ID, Driving License).</li>
          <li><strong>Senior Citizen Concession:</strong> Ensure Senior Citizen box is checked and carry age proof (Male 60+ / Female 58+) during travel.</li>
          <li><strong>Print &amp; Submit:</strong> Print this generated A4 PDF and present it at any Railway station reservation counter across India. No handwritten scratch work or confusion required.</li>
        </ul>
      </div>
    </div>
  );
}
