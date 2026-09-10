"use client";

import React, { useState, useEffect, useRef } from "react";
import jsPDF from "jspdf";
import { auth } from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { useProStatus } from "@/hooks/useProStatus";
import SecurityBadge from "@/components/SecurityBadge";
import Link from "next/link";

export default function BiodataMaker() {
  const [template, setTemplate] = useState("job"); // 'job' or 'marriage'
  const [photo, setPhoto] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);

  // Personal Info
  const [fullName, setFullName] = useState("Ramesh Kumar");
  const [fatherName, setFatherName] = useState("Shri Ram Avtar");
  const [motherName, setMotherName] = useState("Smt. Kanti Devi");
  const [dob, setDob] = useState("15/08/1998");
  const [gender, setGender] = useState("Male");
  const [category, setCategory] = useState("General / UR");
  const [maritalStatus, setMaritalStatus] = useState("Unmarried");
  const [languages, setLanguages] = useState("Hindi, English");
  const [phone, setPhone] = useState("9876543210");
  const [email, setEmail] = useState("ramesh.kumar@example.com");
  const [address, setAddress] = useState("House No. 124, Sector 15, New Delhi - 110001");

  // Job specific
  const [objective, setObjective] = useState(
    "To secure a challenging role where I can contribute my skills and work diligently towards organizational growth while developing my career."
  );
  const [skills, setSkills] = useState("MS Office, Computer Operations, Typing (English 35 WPM / Hindi 30 WPM), Basic Accounting");
  const [experience, setExperience] = useState("Fresher (Dedicated, fast learner with strong communication and clerical skills)");

  // Marriage specific
  const [height, setHeight] = useState("5 ft 8 in");
  const [caste, setCaste] = useState("Brahmin");
  const [rashi, setRashi] = useState("Mesh (Aries)");
  const [gotra, setGotra] = useState("Kashyap");
  const [familyDetails, setFamilyDetails] = useState("Father: Govt. Employee (Railways), Mother: Homemaker, 1 Younger Brother (Studying B.Tech)");

  // Educational Qualifications
  const [educations, setEducations] = useState([
    { exam: "10th (High School)", board: "CBSE / State Board", year: "2016", percentage: "82%" },
    { exam: "12th (Intermediate)", board: "CBSE / State Board", year: "2018", percentage: "78%" },
    { exam: "Graduation (B.A / B.Com)", board: "Delhi University", year: "2021", percentage: "72%" },
  ]);

  const [isGenerating, setIsGenerating] = useState(false);
  const [premiumAlert, setPremiumAlert] = useState({ show: false, message: "" });
  const [user, setUser] = useState(null);
  const { isPro } = useProStatus(user);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert("Image size should be less than 5MB");
        return;
      }
      const reader = new FileReader();
      reader.onload = (event) => {
        setPhoto(event.target.result);
        setPhotoPreview(event.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleEducationChange = (index, field, value) => {
    const updated = [...educations];
    updated[index][field] = value;
    setEducations(updated);
  };

  const addEducationRow = () => {
    if (educations.length >= 5 && !isPro) {
      setPremiumAlert({
        show: true,
        message: "Free users can add up to 5 education entries. Upgrade to Pro for unlimited rows and custom templates!"
      });
      return;
    }
    setEducations([...educations, { exam: "", board: "", year: "", percentage: "" }]);
  };

  const removeEducationRow = (index) => {
    if (educations.length > 1) {
      setEducations(educations.filter((_, i) => i !== index));
    }
  };

  // Direct print using window.print
  const handleDirectPrint = () => {
    window.print();
  };

  // Generate Clean Light-Colored 1-Page A4 PDF
  const generatePDF = () => {
    if (!fullName) {
      alert("Please enter Candidate Full Name");
      return;
    }

    setIsGenerating(true);

    try {
      const doc = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });

      const pageWidth = 210;
      const margin = 12;
      const contentWidth = pageWidth - 2 * margin; // 186mm
      let y = 14;

      // Outer border - Double clean hairline frame in soft slate gray
      doc.setDrawColor(203, 213, 225); // #CBD5E1
      doc.setLineWidth(0.7);
      doc.rect(margin - 2, 9, contentWidth + 4, 279);
      doc.setLineWidth(0.25);
      doc.rect(margin - 1, 10, contentWidth + 2, 277);

      // 1. Header Banner - Clean LIGHT tint background (ink-friendly!)
      if (template === "job") {
        doc.setFillColor(241, 245, 249); // slate-100 (light ice-gray)
        doc.setDrawColor(203, 213, 225); // slate-300 border
      } else {
        doc.setFillColor(255, 247, 237); // warm orange/cream light tint
        doc.setDrawColor(254, 215, 170); // orange-200 border
      }
      doc.roundedRect(margin + 12, y, contentWidth - 24, 11, 2, 2, "FD");

      doc.setFont("helvetica", "bold");
      doc.setFontSize(12.5);
      // Dark legible title text
      if (template === "job") {
        doc.setTextColor(30, 58, 138); // dark navy #1E3A8A
        doc.text("CURRICULUM VITAE / BIO-DATA", pageWidth / 2, y + 7.5, { align: "center" });
      } else {
        doc.setTextColor(154, 52, 18); // dark warm amber/maroon #9A3412
        doc.text("MATRIMONIAL BIO-DATA (विवाह बायोडाटा)", pageWidth / 2, y + 7.5, { align: "center" });
      }

      y += 16;

      // 2. Candidate Header & Photo Block
      const photoWidth = 28;
      const photoHeight = 35;
      const photoX = pageWidth - margin - photoWidth - 2;
      const textWidth = photo ? contentWidth - photoWidth - 8 : contentWidth;

      // Candidate Name
      doc.setFontSize(14);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(15, 23, 42); // slate-900
      doc.text(fullName.toUpperCase(), margin + 2, y);

      y += 5.5;
      doc.setFontSize(8.5);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(71, 85, 105); // slate-600

      if (phone || email) {
        const contactLine = [
          phone ? `Phone: ${phone}` : "",
          email ? `Email: ${email}` : "",
        ].filter(Boolean).join("  |  ");
        doc.text(contactLine, margin + 2, y);
        y += 4.5;
      }

      if (address) {
        const splitAddress = doc.splitTextToSize(`Address: ${address}`, textWidth);
        doc.text(splitAddress, margin + 2, y);
        y += splitAddress.length * 4.2;
      }

      // Render Photo on the top right
      if (photo) {
        try {
          doc.addImage(photo, "JPEG", photoX, 26, photoWidth, photoHeight);
          doc.setDrawColor(203, 213, 225);
          doc.setLineWidth(0.3);
          doc.rect(photoX, 26, photoWidth, photoHeight);
        } catch (e) {
          console.error("Photo rendering error:", e);
        }
      }

      // Ensure y clears the photo bottom if photo was included
      y = Math.max(y + 2, photo ? 64 : y + 3);

      // Subtle Divider Line
      doc.setDrawColor(226, 232, 240); // slate-200
      doc.setLineWidth(0.35);
      doc.line(margin + 2, y, pageWidth - margin - 2, y);
      y += 5;

      // Reusable Section Header Function with light clean fill (no colored accent bar)
      const drawSectionHeader = (titleText) => {
        doc.setFillColor(248, 250, 252); // soft slate-50
        doc.setDrawColor(226, 232, 240); // slate-200 border
        doc.rect(margin + 2, y, contentWidth - 4, 6, "FD");

        doc.setFont("helvetica", "bold");
        doc.setFontSize(8.5);
        doc.setTextColor(30, 41, 59); // slate-800
        doc.text(titleText, margin + 5, y + 4.2);
        y += 8.5;
      };

      // 3. Career Objective (Job only)
      if (template === "job" && objective) {
        drawSectionHeader("CAREER OBJECTIVE");
        doc.setFontSize(8);
        doc.setFont("helvetica", "normal");
        doc.setTextColor(51, 65, 85);
        const splitObj = doc.splitTextToSize(objective, contentWidth - 6);
        doc.text(splitObj, margin + 3, y);
        y += splitObj.length * 3.8 + 4;
      }

      // 4. Personal Details (Compact 2-Column Grid to guarantee 1-page fit)
      drawSectionHeader("PERSONAL DETAILS");

      const col1Fields = [
        ["Father's Name", fatherName || "N/A"],
        ["Mother's Name", motherName || "N/A"],
        ["Date of Birth", dob || "N/A"],
        ["Gender", gender],
      ];

      const col2Fields = [
        ["Category", category],
        ["Marital Status", maritalStatus],
        ["Languages", languages || "N/A"],
      ];

      if (template === "marriage") {
        col2Fields.push(["Height", height || "N/A"]);
        if (caste) col1Fields.push(["Caste", caste]);
        if (gotra) col2Fields.push(["Gotra", gotra]);
        if (rashi) col1Fields.push(["Rashi", rashi]);
      }

      const maxRows = Math.max(col1Fields.length, col2Fields.length);
      const col1StartX = margin + 3;
      const col2StartX = margin + 96;

      doc.setFontSize(8);

      for (let i = 0; i < maxRows; i++) {
        const rowY = y + i * 4.8;

        // Column 1
        if (col1Fields[i]) {
          const [lbl, val] = col1Fields[i];
          doc.setFont("helvetica", "bold");
          doc.setTextColor(71, 85, 105);
          doc.text(lbl, col1StartX, rowY);
          doc.text(":", col1StartX + 27, rowY);
          doc.setFont("helvetica", "normal");
          doc.setTextColor(15, 23, 42);
          doc.text(String(val).slice(0, 32), col1StartX + 30, rowY);
        }

        // Column 2
        if (col2Fields[i]) {
          const [lbl, val] = col2Fields[i];
          doc.setFont("helvetica", "bold");
          doc.setTextColor(71, 85, 105);
          doc.text(lbl, col2StartX, rowY);
          doc.text(":", col2StartX + 25, rowY);
          doc.setFont("helvetica", "normal");
          doc.setTextColor(15, 23, 42);
          doc.text(String(val).slice(0, 32), col2StartX + 28, rowY);
        }
      }

      y += maxRows * 4.8 + 4;

      // 5. Educational Qualifications Table
      drawSectionHeader("ACADEMIC QUALIFICATIONS");

      const tableX = margin + 2;
      const tableWidth = contentWidth - 4; // 182mm
      const colWidths = [48, 76, 28, 30]; // Sum = 182mm
      const headerRowH = 6;
      const dataRowH = 5.6;

      // Table Header Fill (Light neutral slate tint)
      doc.setFillColor(241, 245, 249);
      doc.rect(tableX, y, tableWidth, headerRowH, "F");
      doc.setDrawColor(203, 213, 225);
      doc.setLineWidth(0.3);
      doc.rect(tableX, y, tableWidth, headerRowH);

      doc.setFont("helvetica", "bold");
      doc.setFontSize(8);
      doc.setTextColor(30, 41, 59);
      doc.text("Examination / Degree", tableX + 3, y + 4.2);
      doc.text("Board / University", tableX + colWidths[0] + 3, y + 4.2);
      doc.text("Year", tableX + colWidths[0] + colWidths[1] + 3, y + 4.2);
      doc.text("Percentage", tableX + colWidths[0] + colWidths[1] + colWidths[2] + 3, y + 4.2);

      y += headerRowH;

      // Table Data Rows
      doc.setFont("helvetica", "normal");
      doc.setFontSize(7.8);
      doc.setTextColor(51, 65, 85);

      const activeEd = educations.filter((e) => e.exam || e.board);
      activeEd.forEach((ed, idx) => {
        doc.setFillColor(idx % 2 === 0 ? 255 : 248, idx % 2 === 0 ? 255 : 250, idx % 2 === 0 ? 255 : 252);
        doc.rect(tableX, y, tableWidth, dataRowH, "FD");

        // Column lines
        doc.line(tableX + colWidths[0], y, tableX + colWidths[0], y + dataRowH);
        doc.line(tableX + colWidths[0] + colWidths[1], y, tableX + colWidths[0] + colWidths[1], y + dataRowH);
        doc.line(tableX + colWidths[0] + colWidths[1] + colWidths[2], y, tableX + colWidths[0] + colWidths[1] + colWidths[2], y + dataRowH);

        doc.text(String(ed.exam || "-").slice(0, 24), tableX + 3, y + 3.9);
        doc.text(String(ed.board || "-").slice(0, 40), tableX + colWidths[0] + 3, y + 3.9);
        doc.text(String(ed.year || "-").slice(0, 8), tableX + colWidths[0] + colWidths[1] + 3, y + 3.9);
        doc.text(String(ed.percentage || "-").slice(0, 10), tableX + colWidths[0] + colWidths[1] + colWidths[2] + 3, y + 3.9);

        y += dataRowH;
      });

      y += 4;

      // 6. Skills & Work Experience (Job) OR Family Background (Marriage)
      if (template === "job") {
        if (skills) {
          drawSectionHeader("TECHNICAL & PROFESSIONAL SKILLS");
          doc.setFontSize(8);
          doc.setFont("helvetica", "normal");
          doc.setTextColor(51, 65, 85);
          const splitSkills = doc.splitTextToSize(skills, contentWidth - 6);
          doc.text(splitSkills, margin + 3, y);
          y += splitSkills.length * 3.8 + 4;
        }

        if (experience) {
          drawSectionHeader("WORK EXPERIENCE / TRAINING");
          doc.setFontSize(8);
          doc.setFont("helvetica", "normal");
          doc.setTextColor(51, 65, 85);
          const splitExp = doc.splitTextToSize(experience, contentWidth - 6);
          doc.text(splitExp, margin + 3, y);
          y += splitExp.length * 3.8 + 4;
        }
      } else {
        if (familyDetails) {
          drawSectionHeader("FAMILY BACKGROUND & DETAILS");
          doc.setFontSize(8);
          doc.setFont("helvetica", "normal");
          doc.setTextColor(51, 65, 85);
          const splitFam = doc.splitTextToSize(familyDetails, contentWidth - 6);
          doc.text(splitFam, margin + 3, y);
          y += splitFam.length * 3.8 + 4;
        }
      }

      // 7. Declaration & Signatures (Fixed bottom anchor on the same page!)
      const declY = 260;
      doc.setDrawColor(226, 232, 240);
      doc.setLineWidth(0.3);
      doc.line(margin + 2, declY, pageWidth - margin - 2, declY);

      doc.setFontSize(7.5);
      doc.setFont("helvetica", "italic");
      doc.setTextColor(100, 116, 139);
      doc.text(
        "Declaration: I hereby declare that all the information furnished above is true and complete to the best of my knowledge.",
        margin + 2,
        declY + 4
      );

      const signY = declY + 16;
      doc.setFont("helvetica", "bold");
      doc.setFontSize(8);
      doc.setTextColor(30, 41, 59);
      doc.text(`Date: ${new Date().toLocaleDateString("en-IN")}`, margin + 2, signY);
      doc.text(`Place: __________________`, margin + 35, signY);

      doc.text(`Signature: ______________________`, pageWidth - margin - 52, signY);

      // Save PDF
      const sanitizedName = fullName.trim().replace(/[^a-zA-Z0-9]/g, "_");
      doc.save(`${sanitizedName || "Candidate"}_BioData.pdf`);
    } catch (err) {
      console.error("PDF generation error:", err);
      alert("Error generating PDF. Please check your inputs.");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="w-full space-y-8">
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" />

      {/* Main Container */}
      <div className="bg-white dark:bg-[#09090b] border border-gray-200 dark:border-gray-800 rounded-3xl p-6 sm:p-10 shadow-sm max-w-6xl mx-auto">
        
        {/* Header Title */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 mb-3">
            <i className="fa-solid fa-file-lines text-2xl"></i>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white mb-2">
            Sarkari Bio-Data &amp; Resume Maker
          </h2>
          <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 max-w-xl mx-auto">
            Clean, light-colored 1-page A4 format designed for official government interviews, private jobs, and matrimonial profiles.
          </p>
        </div>

        {/* Template Selector Tabs */}
        <div className="flex justify-center mb-8">
          <div className="p-1.5 bg-gray-100 dark:bg-gray-800/60 rounded-2xl inline-flex gap-2">
            <button
              onClick={() => setTemplate("job")}
              className={`px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all flex items-center gap-2 ${
                template === "job"
                  ? "bg-blue-600 text-white shadow-sm"
                  : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
              }`}
            >
              <i className="fa-solid fa-briefcase"></i>
              Sarkari Job / General Bio-Data
            </button>
            <button
              onClick={() => setTemplate("marriage")}
              className={`px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all flex items-center gap-2 ${
                template === "marriage"
                  ? "bg-amber-600 text-white shadow-sm"
                  : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
              }`}
            >
              <i className="fa-solid fa-ring"></i>
              Matrimonial / विवाह बायोडाटा
            </button>
          </div>
        </div>

        {/* 2-Column Responsive Layout: Controls on Left, Live Sheet Preview on Right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* LEFT: FORM CONTROLS (7 Columns) */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Section 1: Personal Details & Photo */}
            <div className="border border-gray-200 dark:border-gray-800 rounded-2xl p-5 bg-gray-50/50 dark:bg-[#111116] space-y-4">
              <div className="flex items-center justify-between border-b border-gray-200 dark:border-gray-800 pb-3">
                <h3 className="text-sm font-bold text-gray-900 dark:text-white flex items-center gap-2">
                  <i className="fa-solid fa-user text-blue-500"></i>
                  1. Candidate Details &amp; Photo
                </h3>
                <span className="text-[11px] text-gray-400 font-medium">Light &amp; Print Friendly</span>
              </div>

              <div className="flex flex-col sm:flex-row gap-5 items-start">
                {/* Photo Upload Box */}
                <div className="w-full sm:w-32 shrink-0 flex flex-col items-center">
                  {photoPreview ? (
                    <div className="relative group">
                      <img
                        src={photoPreview}
                        alt="Preview"
                        className="w-28 h-36 object-cover rounded-xl border border-gray-300 dark:border-gray-700 shadow-xs"
                      />
                      <button
                        onClick={() => {
                          setPhoto(null);
                          setPhotoPreview(null);
                        }}
                        className="absolute -top-2 -right-2 bg-red-600 text-white h-6 w-6 rounded-full text-xs flex items-center justify-center shadow-md hover:bg-red-700"
                        title="Remove Photo"
                      >
                        <i className="fa-solid fa-xmark"></i>
                      </button>
                    </div>
                  ) : (
                    <label className="w-28 h-36 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-xl flex flex-col items-center justify-center p-2 text-center cursor-pointer hover:border-blue-500 bg-white dark:bg-[#09090b] transition">
                      <i className="fa-solid fa-camera text-gray-400 text-xl mb-1"></i>
                      <span className="text-[10px] font-bold text-gray-600 dark:text-gray-300">Upload Photo</span>
                      <span className="text-[9px] text-gray-400">(Optional)</span>
                      <input type="file" accept="image/*" onChange={handlePhotoUpload} className="hidden" />
                    </label>
                  )}
                </div>

                {/* Primary Personal Inputs */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 flex-1 w-full">
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">Candidate Full Name *</label>
                    <input
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="e.g. Ramesh Kumar"
                      className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#09090b] text-sm text-gray-900 dark:text-white font-semibold outline-none focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">Father&apos;s Name</label>
                    <input
                      type="text"
                      value={fatherName}
                      onChange={(e) => setFatherName(e.target.value)}
                      placeholder="Father's Name"
                      className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#09090b] text-xs text-gray-900 dark:text-white outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">Mother&apos;s Name</label>
                    <input
                      type="text"
                      value={motherName}
                      onChange={(e) => setMotherName(e.target.value)}
                      placeholder="Mother's Name"
                      className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#09090b] text-xs text-gray-900 dark:text-white outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">Date of Birth</label>
                    <input
                      type="text"
                      value={dob}
                      onChange={(e) => setDob(e.target.value)}
                      placeholder="DD/MM/YYYY"
                      className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#09090b] text-xs text-gray-900 dark:text-white outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">Gender</label>
                    <select
                      value={gender}
                      onChange={(e) => setGender(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#09090b] text-xs text-gray-900 dark:text-white outline-none"
                    >
                      <option>Male</option>
                      <option>Female</option>
                      <option>Other</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Second row of details */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                <div>
                  <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">Category / Quota</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#09090b] text-xs text-gray-900 dark:text-white outline-none"
                  >
                    <option>General / UR</option>
                    <option>OBC</option>
                    <option>SC</option>
                    <option>ST</option>
                    <option>EWS</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">Marital Status</label>
                  <select
                    value={maritalStatus}
                    onChange={(e) => setMaritalStatus(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#09090b] text-xs text-gray-900 dark:text-white outline-none"
                  >
                    <option>Unmarried</option>
                    <option>Married</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">Languages Known</label>
                  <input
                    type="text"
                    value={languages}
                    onChange={(e) => setLanguages(e.target.value)}
                    placeholder="Hindi, English"
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#09090b] text-xs text-gray-900 dark:text-white outline-none"
                  />
                </div>
              </div>

              {/* Matrimonial extra fields */}
              {template === "marriage" && (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 border-t border-gray-200 dark:border-gray-800">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">Height</label>
                    <input
                      type="text"
                      value={height}
                      onChange={(e) => setHeight(e.target.value)}
                      placeholder="e.g. 5 ft 8 in"
                      className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#09090b] text-xs text-gray-900 dark:text-white outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">Caste / Community</label>
                    <input
                      type="text"
                      value={caste}
                      onChange={(e) => setCaste(e.target.value)}
                      placeholder="e.g. Brahmin"
                      className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#09090b] text-xs text-gray-900 dark:text-white outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">Rashi / Nakshatra</label>
                    <input
                      type="text"
                      value={rashi}
                      onChange={(e) => setRashi(e.target.value)}
                      placeholder="e.g. Mesh"
                      className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#09090b] text-xs text-gray-900 dark:text-white outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">Gotra</label>
                    <input
                      type="text"
                      value={gotra}
                      onChange={(e) => setGotra(e.target.value)}
                      placeholder="e.g. Kashyap"
                      className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#09090b] text-xs text-gray-900 dark:text-white outline-none"
                    />
                  </div>
                </div>
              )}

              {/* Contact Information */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                <div>
                  <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">Phone Number</label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="Mobile Number"
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#09090b] text-xs text-gray-900 dark:text-white outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">Email ID</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="email@example.com"
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#09090b] text-xs text-gray-900 dark:text-white outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">Address / City</label>
                  <input
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="City, State - PIN"
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#09090b] text-xs text-gray-900 dark:text-white outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Section 2: Educational Qualifications */}
            <div className="border border-gray-200 dark:border-gray-800 rounded-2xl p-5 bg-gray-50/50 dark:bg-[#111116] space-y-3">
              <div className="flex justify-between items-center border-b border-gray-200 dark:border-gray-800 pb-3">
                <h3 className="text-sm font-bold text-gray-900 dark:text-white flex items-center gap-2">
                  <i className="fa-solid fa-graduation-cap text-indigo-500"></i>
                  2. Academic Qualifications
                </h3>
                <button
                  type="button"
                  onClick={addEducationRow}
                  className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
                >
                  <i className="fa-solid fa-plus"></i> Add Row
                </button>
              </div>

              <div className="space-y-2">
                {educations.map((item, index) => (
                  <div key={index} className="grid grid-cols-12 gap-2 items-center">
                    <div className="col-span-4">
                      <input
                        type="text"
                        value={item.exam}
                        onChange={(e) => handleEducationChange(index, "exam", e.target.value)}
                        placeholder="Exam / Degree"
                        className="w-full px-2.5 py-1.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#09090b] text-xs text-gray-900 dark:text-white outline-none"
                      />
                    </div>
                    <div className="col-span-4">
                      <input
                        type="text"
                        value={item.board}
                        onChange={(e) => handleEducationChange(index, "board", e.target.value)}
                        placeholder="Board / College"
                        className="w-full px-2.5 py-1.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#09090b] text-xs text-gray-900 dark:text-white outline-none"
                      />
                    </div>
                    <div className="col-span-2">
                      <input
                        type="text"
                        value={item.year}
                        onChange={(e) => handleEducationChange(index, "year", e.target.value)}
                        placeholder="Year"
                        className="w-full px-2.5 py-1.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#09090b] text-xs text-gray-900 dark:text-white outline-none"
                      />
                    </div>
                    <div className="col-span-1">
                      <input
                        type="text"
                        value={item.percentage}
                        onChange={(e) => handleEducationChange(index, "percentage", e.target.value)}
                        placeholder="%"
                        className="w-full px-2 py-1.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#09090b] text-xs text-gray-900 dark:text-white outline-none"
                      />
                    </div>
                    <div className="col-span-1 flex justify-center">
                      {educations.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeEducationRow(index)}
                          className="text-gray-400 hover:text-red-500 p-1"
                        >
                          <i className="fa-solid fa-trash-can text-xs"></i>
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Section 3: Extra Details */}
            <div className="border border-gray-200 dark:border-gray-800 rounded-2xl p-5 bg-gray-50/50 dark:bg-[#111116] space-y-3">
              {template === "job" ? (
                <>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">Career Objective</label>
                    <textarea
                      rows={2}
                      value={objective}
                      onChange={(e) => setObjective(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#09090b] text-xs text-gray-900 dark:text-white outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">Skills &amp; Strengths</label>
                    <input
                      type="text"
                      value={skills}
                      onChange={(e) => setSkills(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#09090b] text-xs text-gray-900 dark:text-white outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">Work Experience</label>
                    <input
                      type="text"
                      value={experience}
                      onChange={(e) => setExperience(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#09090b] text-xs text-gray-900 dark:text-white outline-none"
                    />
                  </div>
                </>
              ) : (
                <div>
                  <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">Family Details &amp; Background</label>
                  <textarea
                    rows={3}
                    value={familyDetails}
                    onChange={(e) => setFamilyDetails(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#09090b] text-xs text-gray-900 dark:text-white outline-none"
                  />
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button
                onClick={generatePDF}
                disabled={isGenerating}
                className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold py-3.5 px-6 rounded-xl shadow-md transition disabled:opacity-60"
              >
                {isGenerating ? (
                  <>
                    <i className="fa-solid fa-spinner fa-spin"></i>
                    <span>Generating PDF...</span>
                  </>
                ) : (
                  <>
                    <i className="fa-solid fa-file-pdf text-lg"></i>
                    <span>Download 1-Page Bio-Data PDF</span>
                  </>
                )}
              </button>

              <button
                onClick={handleDirectPrint}
                className="px-5 py-3.5 rounded-xl border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 font-bold text-xs hover:bg-gray-100 dark:hover:bg-gray-800 transition flex items-center justify-center gap-2"
              >
                <i className="fa-solid fa-print"></i>
                <span>Print Directly</span>
              </button>
            </div>

            <div className="pt-2">
              <SecurityBadge />
            </div>

          </div>

          {/* RIGHT: LIVE A4 SHEET PREVIEW (5 Columns) */}
          <div className="lg:col-span-5 sticky top-20">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-gray-500 uppercase tracking-wider flex items-center gap-1.5">
                <i className="fa-solid fa-eye text-blue-500"></i>
                Live A4 Sheet Preview (100% Light Colors)
              </span>
              <span className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded">
                1-Page Verified
              </span>
            </div>

            {/* The Live A4 Paper Mockup with Light Colors */}
            <div 
              id="printable-biodata"
              className="w-full bg-white text-gray-900 border-2 border-gray-200 shadow-xl rounded-2xl p-5 text-[10px] leading-relaxed transition-all select-none overflow-hidden"
              style={{ minHeight: "600px" }}
            >
              {/* Outer Decorative Double Border */}
              <div className="border border-slate-300 p-4 rounded-xl min-h-full flex flex-col justify-between">
                
                <div>
                  {/* Light Header Banner */}
                  <div className={`text-center py-2 px-3 rounded-lg border mb-3 ${
                    template === "job"
                      ? "bg-slate-100 border-slate-300 text-blue-900"
                      : "bg-orange-50 border-orange-200 text-amber-900"
                  }`}>
                    <h4 className="font-extrabold text-[11px] tracking-wide">
                      {template === "job" ? "CURRICULUM VITAE / BIO-DATA" : "MATRIMONIAL BIO-DATA"}
                    </h4>
                  </div>

                  {/* Header Row: Candidate Info & Photo */}
                  <div className="flex items-start justify-between gap-3 pb-3 border-b border-slate-200 mb-3">
                    <div className="space-y-0.5 flex-1 min-w-0">
                      <h3 className="font-black text-xs text-slate-900 truncate uppercase">
                        {fullName || "CANDIDATE FULL NAME"}
                      </h3>
                      <p className="text-[9px] text-slate-600 truncate">
                        {phone && `Mob: ${phone}`} {email && ` | Email: ${email}`}
                      </p>
                      {address && (
                        <p className="text-[8.5px] text-slate-500 line-clamp-2">
                          Address: {address}
                        </p>
                      )}
                    </div>

                    {photoPreview ? (
                      <img
                        src={photoPreview}
                        alt="Photo"
                        className="w-12 h-16 object-cover rounded border border-slate-300 shrink-0"
                      />
                    ) : (
                      <div className="w-12 h-16 border border-dashed border-slate-300 rounded flex flex-col items-center justify-center text-[7px] text-slate-400 shrink-0">
                        <span>Photo</span>
                      </div>
                    )}
                  </div>

                  {/* Objective (Job) */}
                  {template === "job" && objective && (
                    <div className="mb-2.5">
                      <div className="bg-slate-100 border border-slate-200 px-2 py-0.5 rounded text-[8.5px] font-bold text-slate-800 mb-1">
                        CAREER OBJECTIVE
                      </div>
                      <p className="text-[8px] text-slate-600 pl-1 line-clamp-2">
                        {objective}
                      </p>
                    </div>
                  )}

                  {/* Personal Details Table */}
                  <div className="mb-2.5">
                    <div className="bg-slate-100 border border-slate-200 px-2 py-0.5 rounded text-[8.5px] font-bold text-slate-800 mb-1.5">
                      PERSONAL DETAILS
                    </div>
                    <div className="grid grid-cols-2 gap-x-3 gap-y-1 text-[8px] pl-1">
                      <div><span className="font-bold text-slate-600">Father:</span> {fatherName || "N/A"}</div>
                      <div><span className="font-bold text-slate-600">Mother:</span> {motherName || "N/A"}</div>
                      <div><span className="font-bold text-slate-600">DOB:</span> {dob || "N/A"}</div>
                      <div><span className="font-bold text-slate-600">Gender:</span> {gender}</div>
                      <div><span className="font-bold text-slate-600">Category:</span> {category}</div>
                      <div><span className="font-bold text-slate-600">Status:</span> {maritalStatus}</div>
                      <div className="col-span-2"><span className="font-bold text-slate-600">Languages:</span> {languages || "N/A"}</div>
                      {template === "marriage" && (
                        <>
                          <div><span className="font-bold text-slate-600">Height:</span> {height}</div>
                          <div><span className="font-bold text-slate-600">Caste:</span> {caste || "N/A"}</div>
                          {gotra && <div><span className="font-bold text-slate-600">Gotra:</span> {gotra}</div>}
                          {rashi && <div><span className="font-bold text-slate-600">Rashi:</span> {rashi}</div>}
                        </>
                      )}
                    </div>
                  </div>

                  {/* Academic Qualifications Table */}
                  <div className="mb-2.5">
                    <div className="bg-slate-100 border border-slate-200 px-2 py-0.5 rounded text-[8.5px] font-bold text-slate-800 mb-1.5">
                      ACADEMIC QUALIFICATIONS
                    </div>
                    <table className="w-full border-collapse border border-slate-200 text-[7.5px]">
                      <thead>
                        <tr className="bg-slate-100 text-slate-700 font-bold">
                          <th className="border border-slate-200 p-1 text-left">Exam</th>
                          <th className="border border-slate-200 p-1 text-left">Board/Univ</th>
                          <th className="border border-slate-200 p-1 text-center">Year</th>
                          <th className="border border-slate-200 p-1 text-center">%</th>
                        </tr>
                      </thead>
                      <tbody>
                        {educations.filter(e => e.exam).map((e, idx) => (
                          <tr key={idx} className={idx % 2 === 0 ? "bg-white" : "bg-slate-50"}>
                            <td className="border border-slate-200 p-1">{e.exam}</td>
                            <td className="border border-slate-200 p-1 truncate max-w-[80px]">{e.board}</td>
                            <td className="border border-slate-200 p-1 text-center">{e.year}</td>
                            <td className="border border-slate-200 p-1 text-center font-bold">{e.percentage}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Skills / Experience (Job) OR Family (Marriage) */}
                  {template === "job" ? (
                    <div className="space-y-1.5 mb-2">
                      {skills && (
                        <div>
                          <span className="font-bold text-[8px] text-slate-800">Skills: </span>
                          <span className="text-[7.5px] text-slate-600">{skills}</span>
                        </div>
                      )}
                      {experience && (
                        <div>
                          <span className="font-bold text-[8px] text-slate-800">Experience: </span>
                          <span className="text-[7.5px] text-slate-600">{experience}</span>
                        </div>
                      )}
                    </div>
                  ) : (
                    familyDetails && (
                      <div className="mb-2">
                        <div className="bg-slate-100 border border-slate-200 px-2 py-0.5 rounded text-[8.5px] font-bold text-slate-800 mb-1">
                          FAMILY DETAILS
                        </div>
                        <p className="text-[7.5px] text-slate-600 pl-1">{familyDetails}</p>
                      </div>
                    )
                  )}

                </div>

                {/* Footer Declaration & Signature */}
                <div className="pt-2 border-t border-slate-200 text-[7px] text-slate-500 mt-2">
                  <p className="italic mb-2">
                    Declaration: All the information provided above is true to the best of my knowledge.
                  </p>
                  <div className="flex justify-between items-center text-[7.5px] font-bold text-slate-700">
                    <span>Date: {new Date().toLocaleDateString("en-IN")}</span>
                    <span>Place: _________________</span>
                    <span>Signature: ______________</span>
                  </div>
                </div>

              </div>
            </div>
          </div>

        </div>

      </div>

      {/* Pro Upgrade Modal */}
      {premiumAlert.show && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm transition-opacity">
          <div className="bg-white dark:bg-[#09090b] w-full max-w-md rounded-3xl shadow-2xl border border-gray-100 dark:border-gray-800 p-8 relative animate-in fade-in zoom-in duration-300 text-left">
            <button 
              className="absolute top-6 right-6 text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition"
              onClick={() => setPremiumAlert({ show: false, message: "" })}
            >
              <i className="fa-solid fa-xmark text-lg"></i>
            </button>

            <div className="h-12 w-12 rounded-2xl bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 flex items-center justify-center text-xl mb-6">
              <i className="fa-solid fa-crown"></i>
            </div>

            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">DesiPDF Pro Feature</h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed mb-6">
              {premiumAlert.message}
            </p>

            <div className="flex flex-col gap-3">
              <Link
                href="/pricing"
                className="w-full py-3 px-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold rounded-xl text-center shadow-lg transition-all"
              >
                Get Unlimited Pro Pass (₹49)
              </Link>
              <button
                onClick={() => setPremiumAlert({ show: false, message: "" })}
                className="w-full py-2.5 text-sm text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 font-semibold text-center"
              >
                Maybe Later
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
