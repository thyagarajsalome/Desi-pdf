"use client";

import React, { useState, useEffect } from "react";
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
  const [fullName, setFullName] = useState("");
  const [fatherName, setFatherName] = useState("");
  const [motherName, setMotherName] = useState("");
  const [dob, setDob] = useState("");
  const [gender, setGender] = useState("Male");
  const [category, setCategory] = useState("General / UR");
  const [maritalStatus, setMaritalStatus] = useState("Unmarried");
  const [languages, setLanguages] = useState("Hindi, English");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");

  // Job specific
  const [objective, setObjective] = useState(
    "To obtain a challenging and responsible position where I can contribute my skills and knowledge for the growth of the organization."
  );
  const [skills, setSkills] = useState("MS Office, Internet Browsing, Typing Speed 35 WPM, Basic Accounting");
  const [experience, setExperience] = useState("Fresher (Ready to learn and adapt quickly)");

  // Marriage specific
  const [height, setHeight] = useState("5 ft 7 in");
  const [caste, setCaste] = useState("");
  const [rashi, setRashi] = useState("");
  const [gotra, setGotra] = useState("");
  const [familyDetails, setFamilyDetails] = useState("Father: Govt Employee, Mother: Homemaker, 1 Younger Brother");

  // Educational Qualifications
  const [educations, setEducations] = useState([
    { exam: "10th (Matric)", board: "State Board", year: "2018", percentage: "78%" },
    { exam: "12th (Inter)", board: "State Board", year: "2020", percentage: "75%" },
    { exam: "Graduation (BA/B.Sc/B.Com)", board: "University", year: "2023", percentage: "68%" },
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
        message: "Free users can add up to 5 education entries. Upgrade to Pro for unlimited rows and custom tables!"
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

      const pageWidth = doc.internal.pageSize.getWidth(); // 210mm
      const margin = 15;
      let y = 18;

      // Header Banner
      doc.setFillColor(template === "job" ? 37 : 190, template === "job" ? 99 : 24, template === "job" ? 235 : 93); // Blue or Deep Rose
      doc.rect(margin, y, pageWidth - 2 * margin, 20, "F");

      doc.setFont("helvetica", "bold");
      doc.setFontSize(16);
      doc.setTextColor(255, 255, 255);
      const title = template === "job" ? "CURRICULUM VITAE / BIO-DATA" : "MATRIMONIAL BIO-DATA";
      doc.text(title, pageWidth / 2, y + 13, { align: "center" });

      y += 26;

      // Candidate Name & Contact Details
      doc.setFontSize(16);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(20, 20, 20);
      doc.text(fullName.toUpperCase(), margin, y);

      y += 5;
      doc.setFontSize(9);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(80, 80, 80);
      if (phone) doc.text(`Mobile: ${phone}`, margin, y);
      if (email) doc.text(`Email: ${email}`, margin + (phone ? 55 : 0), y);

      y += 4;
      if (address) {
        doc.text(`Address: ${address}`, margin, y);
        y += 4;
      }

      // Add Photo if uploaded (Top Right)
      if (photo) {
        try {
          doc.addImage(photo, "JPEG", pageWidth - margin - 30, 42, 30, 36);
          doc.setDrawColor(180, 180, 180);
          doc.setLineWidth(0.3);
          doc.rect(pageWidth - margin - 30, 42, 30, 36);
        } catch (e) {
          console.error("Photo add error:", e);
        }
      }

      y += 6;
      doc.setDrawColor(200, 200, 200);
      doc.setLineWidth(0.4);
      doc.line(margin, y, pageWidth - margin, y);

      y += 8;

      // Objective Section (Job only)
      if (template === "job" && objective) {
        doc.setFontSize(11);
        doc.setFont("helvetica", "bold");
        doc.setTextColor(37, 99, 235);
        doc.text("CAREER OBJECTIVE", margin, y);

        y += 5;
        doc.setFontSize(9);
        doc.setFont("helvetica", "normal");
        doc.setTextColor(50, 50, 50);
        const splitObjective = doc.splitTextToSize(objective, pageWidth - 2 * margin);
        doc.text(splitObjective, margin, y);

        y += splitObjective.length * 4.5 + 4;
      }

      // Personal Details Section
      doc.setFontSize(11);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(template === "job" ? 37 : 190, template === "job" ? 99 : 24, template === "job" ? 235 : 93);
      doc.text("PERSONAL DETAILS", margin, y);

      y += 6;
      doc.setFontSize(9);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(40, 40, 40);

      const personalFields = [
        ["Father's Name", fatherName || "N/A"],
        ["Mother's Name", motherName || "N/A"],
        ["Date of Birth", dob || "N/A"],
        ["Gender", gender],
        ["Category", category],
        ["Marital Status", maritalStatus],
        ["Languages Known", languages || "N/A"],
      ];

      if (template === "marriage") {
        personalFields.push(["Height", height || "N/A"]);
        if (caste) personalFields.push(["Caste / Subcaste", caste]);
        if (rashi) personalFields.push(["Rashi / Nakshatra", rashi]);
        if (gotra) personalFields.push(["Gotra", gotra]);
      }

      const col1Width = 42;
      const col2Width = 100;

      personalFields.forEach(([label, val]) => {
        if (y > 275) {
          doc.addPage();
          y = 20;
        }
        doc.setFont("helvetica", "bold");
        doc.text(label, margin, y);
        doc.text(":", margin + col1Width - 5, y);
        doc.setFont("helvetica", "normal");
        doc.text(String(val), margin + col1Width, y);
        y += 5.5;
      });

      y += 4;

      // Educational Qualifications Table
      if (y > 240) {
        doc.addPage();
        y = 20;
      }

      doc.setFontSize(11);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(template === "job" ? 37 : 190, template === "job" ? 99 : 24, template === "job" ? 235 : 93);
      doc.text("ACADEMIC QUALIFICATIONS", margin, y);

      // Draw Qualifications Table Header
      y += 2;
      const tableX = margin;
      const colWidths = [45, 75, 30, 30]; // Total 180mm
      const rowHeight = 7;

      doc.setFillColor(template === "job" ? 37 : 190, template === "job" ? 99 : 24, template === "job" ? 235 : 93);
      doc.rect(tableX, y, 180, rowHeight, "F");

      doc.setFont("helvetica", "bold");
      doc.setFontSize(8.5);
      doc.setTextColor(255, 255, 255);
      doc.text("Examination / Degree", tableX + 3, y + 4.8);
      doc.text("Board / University", tableX + colWidths[0] + 3, y + 4.8);
      doc.text("Year", tableX + colWidths[0] + colWidths[1] + 3, y + 4.8);
      doc.text("Marks / %", tableX + colWidths[0] + colWidths[1] + colWidths[2] + 3, y + 4.8);

      y += rowHeight;

      // Table Rows
      doc.setFont("helvetica", "normal");
      doc.setFontSize(8.5);
      doc.setTextColor(40, 40, 40);

      const activeEd = educations.filter((e) => e.exam || e.board);
      activeEd.forEach((ed, idx) => {
        doc.setDrawColor(220, 220, 220);
        doc.setFillColor(idx % 2 === 0 ? 255 : 248, idx % 2 === 0 ? 255 : 249, idx % 2 === 0 ? 255 : 252);
        doc.rect(tableX, y, 180, rowHeight, "FD");

        doc.text(String(ed.exam || "-"), tableX + 3, y + 4.8);
        doc.text(String(ed.board || "-"), tableX + colWidths[0] + 3, y + 4.8);
        doc.text(String(ed.year || "-"), tableX + colWidths[0] + colWidths[1] + 3, y + 4.8);
        doc.text(String(ed.percentage || "-"), tableX + colWidths[0] + colWidths[1] + colWidths[2] + 3, y + 4.8);

        y += rowHeight;
      });

      y += 8;

      // Work Experience / Skills or Family Details
      if (template === "job") {
        if (y > 250) {
          doc.addPage();
          y = 20;
        }

        if (skills) {
          doc.setFontSize(11);
          doc.setFont("helvetica", "bold");
          doc.setTextColor(37, 99, 235);
          doc.text("SKILLS & STRENGTHS", margin, y);
          y += 5;
          doc.setFontSize(9);
          doc.setFont("helvetica", "normal");
          doc.setTextColor(50, 50, 50);
          const splitSkills = doc.splitTextToSize(skills, pageWidth - 2 * margin);
          doc.text(splitSkills, margin, y);
          y += splitSkills.length * 4.5 + 4;
        }

        if (experience) {
          doc.setFontSize(11);
          doc.setFont("helvetica", "bold");
          doc.setTextColor(37, 99, 235);
          doc.text("WORK EXPERIENCE", margin, y);
          y += 5;
          doc.setFontSize(9);
          doc.setFont("helvetica", "normal");
          doc.setTextColor(50, 50, 50);
          const splitExp = doc.splitTextToSize(experience, pageWidth - 2 * margin);
          doc.text(splitExp, margin, y);
          y += splitExp.length * 4.5 + 4;
        }
      } else {
        // Marriage Family Details
        if (familyDetails) {
          doc.setFontSize(11);
          doc.setFont("helvetica", "bold");
          doc.setTextColor(190, 24, 93);
          doc.text("FAMILY DETAILS", margin, y);
          y += 5;
          doc.setFontSize(9);
          doc.setFont("helvetica", "normal");
          doc.setTextColor(50, 50, 50);
          const splitFamily = doc.splitTextToSize(familyDetails, pageWidth - 2 * margin);
          doc.text(splitFamily, margin, y);
          y += splitFamily.length * 4.5 + 4;
        }
      }

      // Declaration at the bottom
      if (y > 255) {
        doc.addPage();
        y = 20;
      }

      doc.setFontSize(11);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(template === "job" ? 37 : 99, template === "job" ? 99 : 24, template === "job" ? 235 : 93);
      doc.text("DECLARATION", margin, y);
      y += 5;

      doc.setFontSize(8);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(80, 80, 80);
      doc.text(
        "I hereby declare that all the information provided above is true and correct to the best of my knowledge.",
        margin,
        y
      );

      y += 14;
      doc.text(`Date: ${new Date().toLocaleDateString("en-IN")}`, margin, y);
      doc.text(`Place: __________________`, margin + 40, y);
      doc.text(`Signature: ____________________`, pageWidth - margin - 50, y);

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
    <div className="w-full">
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" />

      {/* Main Container Card */}
      <div className="bg-white dark:bg-[#09090b] border border-gray-200 dark:border-gray-800 rounded-3xl p-6 sm:p-10 shadow-sm max-w-5xl mx-auto">
        
        {/* Header Title */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 mb-4">
            <i className="fa-solid fa-file-lines text-2xl"></i>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white mb-2">
            Sarkari Bio-Data &amp; Resume PDF Maker
          </h2>
          <p className="text-sm sm:text-base text-gray-500 dark:text-gray-400 max-w-2xl mx-auto">
            Create an official, print-ready 1-page Indian job bio-data or matrimonial profile in 2 minutes. Free &amp; 100% private.
          </p>
        </div>

        {/* Template Selector Tabs */}
        <div className="flex justify-center mb-8">
          <div className="p-1.5 bg-gray-100 dark:bg-gray-800/60 rounded-2xl inline-flex gap-2">
            <button
              onClick={() => setTemplate("job")}
              className={`px-5 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2 ${
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
              className={`px-5 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2 ${
                template === "marriage"
                  ? "bg-rose-600 text-white shadow-sm"
                  : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
              }`}
            >
              <i className="fa-solid fa-ring"></i>
              Matrimonial / Marriage Bio-Data
            </button>
          </div>
        </div>

        {/* Form Inputs Grid */}
        <div className="space-y-8">
          
          {/* Section 1: Personal Details & Photo */}
          <div className="border border-gray-100 dark:border-gray-800 rounded-2xl p-6 bg-gray-50/50 dark:bg-[#111116]">
            <h3 className="text-base font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <i className="fa-solid fa-user text-blue-500"></i>
              1. Personal Information &amp; Photo
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {/* Photo Uploader */}
              <div className="sm:col-span-1 flex flex-col items-center justify-center p-4 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-xl bg-white dark:bg-[#09090b]">
                {photoPreview ? (
                  <div className="relative group">
                    <img
                      src={photoPreview}
                      alt="Candidate Preview"
                      className="w-28 h-36 object-cover rounded-lg border border-gray-200 dark:border-gray-700"
                    />
                    <button
                      onClick={() => {
                        setPhoto(null);
                        setPhotoPreview(null);
                      }}
                      className="absolute top-1 right-1 bg-red-600 text-white p-1 rounded-full text-xs hover:bg-red-700"
                      title="Remove Photo"
                    >
                      <i className="fa-solid fa-xmark"></i>
                    </button>
                  </div>
                ) : (
                  <label className="flex flex-col items-center justify-center cursor-pointer p-2 w-full h-full text-center">
                    <i className="fa-solid fa-camera text-3xl text-gray-400 mb-2"></i>
                    <span className="text-xs font-semibold text-blue-600 dark:text-blue-400">Upload Passport Photo</span>
                    <span className="text-[10px] text-gray-400 mt-1">JPG / PNG (Optional)</span>
                    <input type="file" accept="image/*" onChange={handlePhotoUpload} className="hidden" />
                  </label>
                )}
              </div>

              {/* Name and Parents */}
              <div className="sm:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">Full Name *</label>
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g. Rahul Sharma"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#09090b] text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">Father's Name</label>
                  <input
                    type="text"
                    value={fatherName}
                    onChange={(e) => setFatherName(e.target.value)}
                    placeholder="Father's Name"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#09090b] text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">Mother's Name</label>
                  <input
                    type="text"
                    value={motherName}
                    onChange={(e) => setMotherName(e.target.value)}
                    placeholder="Mother's Name"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#09090b] text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">Date of Birth</label>
                  <input
                    type="date"
                    value={dob}
                    onChange={(e) => setDob(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#09090b] text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Demographics row */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">Gender</label>
                <select
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#09090b] text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                >
                  <option>Male</option>
                  <option>Female</option>
                  <option>Other</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#09090b] text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
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
                  className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#09090b] text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                >
                  <option>Unmarried</option>
                  <option>Married</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">Languages</label>
                <input
                  type="text"
                  value={languages}
                  onChange={(e) => setLanguages(e.target.value)}
                  placeholder="e.g. Hindi, English"
                  className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#09090b] text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
            </div>

            {/* Matrimonial specific fields */}
            {template === "marriage" && (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-4 pt-4 border-t border-gray-200 dark:border-gray-800">
                <div>
                  <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">Height</label>
                  <input
                    type="text"
                    value={height}
                    onChange={(e) => setHeight(e.target.value)}
                    placeholder="e.g. 5 ft 8 in"
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#09090b] text-sm text-gray-900 dark:text-white outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">Caste / Community</label>
                  <input
                    type="text"
                    value={caste}
                    onChange={(e) => setCaste(e.target.value)}
                    placeholder="e.g. Brahmin / Gupta"
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#09090b] text-sm text-gray-900 dark:text-white outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">Rashi / Nakshatra</label>
                  <input
                    type="text"
                    value={rashi}
                    onChange={(e) => setRashi(e.target.value)}
                    placeholder="e.g. Mesh / Rohini"
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#09090b] text-sm text-gray-900 dark:text-white outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">Gotra</label>
                  <input
                    type="text"
                    value={gotra}
                    onChange={(e) => setGotra(e.target.value)}
                    placeholder="e.g. Kashyap"
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#09090b] text-sm text-gray-900 dark:text-white outline-none"
                  />
                </div>
              </div>
            )}

            {/* Contact Row */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">Mobile Number</label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+91 9876543210"
                  className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#09090b] text-sm text-gray-900 dark:text-white outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">Email Address</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@gmail.com"
                  className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#09090b] text-sm text-gray-900 dark:text-white outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">Full Address / City</label>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Vill/City, Dist, State - PIN"
                  className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#09090b] text-sm text-gray-900 dark:text-white outline-none"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Educational Qualifications */}
          <div className="border border-gray-100 dark:border-gray-800 rounded-2xl p-6 bg-gray-50/50 dark:bg-[#111116]">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-base font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <i className="fa-solid fa-graduation-cap text-indigo-500"></i>
                2. Educational Qualifications
              </h3>
              <button
                type="button"
                onClick={addEducationRow}
                className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
              >
                <i className="fa-solid fa-plus"></i> Add Degree / Course
              </button>
            </div>

            <div className="space-y-3">
              {educations.map((item, index) => (
                <div key={index} className="grid grid-cols-12 gap-2 sm:gap-3 items-center">
                  <div className="col-span-4 sm:col-span-3">
                    <input
                      type="text"
                      value={item.exam}
                      onChange={(e) => handleEducationChange(index, "exam", e.target.value)}
                      placeholder="Exam / Degree"
                      className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#09090b] text-xs sm:text-sm text-gray-900 dark:text-white outline-none"
                    />
                  </div>
                  <div className="col-span-4 sm:col-span-4">
                    <input
                      type="text"
                      value={item.board}
                      onChange={(e) => handleEducationChange(index, "board", e.target.value)}
                      placeholder="Board / College"
                      className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#09090b] text-xs sm:text-sm text-gray-900 dark:text-white outline-none"
                    />
                  </div>
                  <div className="col-span-2 sm:col-span-2">
                    <input
                      type="text"
                      value={item.year}
                      onChange={(e) => handleEducationChange(index, "year", e.target.value)}
                      placeholder="Year"
                      className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#09090b] text-xs sm:text-sm text-gray-900 dark:text-white outline-none"
                    />
                  </div>
                  <div className="col-span-2 sm:col-span-2">
                    <input
                      type="text"
                      value={item.percentage}
                      onChange={(e) => handleEducationChange(index, "percentage", e.target.value)}
                      placeholder="Marks %"
                      className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#09090b] text-xs sm:text-sm text-gray-900 dark:text-white outline-none"
                    />
                  </div>
                  <div className="col-span-12 sm:col-span-1 flex justify-end">
                    {educations.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeEducationRow(index)}
                        className="text-gray-400 hover:text-red-500 p-1"
                        title="Delete Row"
                      >
                        <i className="fa-solid fa-trash text-xs"></i>
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Section 3: Extra Info (Objective / Skills or Family) */}
          <div className="border border-gray-100 dark:border-gray-800 rounded-2xl p-6 bg-gray-50/50 dark:bg-[#111116]">
            {template === "job" ? (
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">Career Objective</label>
                  <textarea
                    rows={2}
                    value={objective}
                    onChange={(e) => setObjective(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#09090b] text-sm text-gray-900 dark:text-white outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">Key Skills &amp; Strengths</label>
                  <input
                    type="text"
                    value={skills}
                    onChange={(e) => setSkills(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#09090b] text-sm text-gray-900 dark:text-white outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">Work Experience</label>
                  <input
                    type="text"
                    value={experience}
                    onChange={(e) => setExperience(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#09090b] text-sm text-gray-900 dark:text-white outline-none"
                  />
                </div>
              </div>
            ) : (
              <div>
                <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">Family Background &amp; Siblings</label>
                <textarea
                  rows={3}
                  value={familyDetails}
                  onChange={(e) => setFamilyDetails(e.target.value)}
                  placeholder="Father's occupation, Mother's occupation, Number of brothers & sisters..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#09090b] text-sm text-gray-900 dark:text-white outline-none"
                />
              </div>
            )}
          </div>

          {/* Action Download Button */}
          <div className="flex flex-col items-center gap-4 pt-4">
            <button
              onClick={generatePDF}
              disabled={isGenerating}
              className={`w-full sm:w-auto min-w-[280px] flex items-center justify-center gap-3 text-white px-8 py-4 rounded-2xl font-bold text-lg shadow-lg hover:shadow-xl transition-all ${
                template === "job" ? "bg-blue-600 hover:bg-blue-700" : "bg-rose-600 hover:bg-rose-700"
              } disabled:opacity-70`}
            >
              {isGenerating ? (
                <>
                  <i className="fa-solid fa-spinner fa-spin"></i> Generating Bio-Data PDF...
                </>
              ) : (
                <>
                  <i className="fa-solid fa-file-arrow-down text-xl"></i> Download 1-Page Bio-Data PDF
                </>
              )}
            </button>

            <SecurityBadge />
          </div>

        </div>
      </div>

      {/* Premium Alert Modal */}
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
