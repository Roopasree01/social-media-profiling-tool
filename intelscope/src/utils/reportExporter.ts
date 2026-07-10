import { jsPDF } from "jspdf";
import { OSINTProfile } from "../types";

// Export to JSON
export function exportToJSON(profile: OSINTProfile) {
  const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(
    JSON.stringify(profile, null, 2)
  )}`;
  const downloadAnchor = document.createElement("a");
  downloadAnchor.setAttribute("href", jsonString);
  downloadAnchor.setAttribute("download", `intelscope_report_${profile.username}.json`);
  document.body.appendChild(downloadAnchor);
  downloadAnchor.click();
  downloadAnchor.remove();
}

// Export to CSV
export function exportToCSV(profile: OSINTProfile) {
  const headers = ["Metric/Platform", "Key Details", "Secondary Metric / Link"];
  const rows = [
    ["Username", profile.username, ""],
    ["Target Full Name", profile.personalInfo.name || "N/A", ""],
    ["Bio", profile.personalInfo.bio || "N/A", ""],
    ["Location", profile.personalInfo.location || "N/A", ""],
    ["Verified Status", profile.personalInfo.verified ? "Verified" : "Publicly Unverified", ""],
    ["Public Exposure Email", profile.personalInfo.email || "None Exposed", ""],
    ["GitHub Link", profile.platforms.github.exists ? profile.platforms.github.url : "Not Found", profile.platforms.github.metrics],
    ["Reddit Link", profile.platforms.reddit.exists ? profile.platforms.reddit.url : "Not Found", profile.platforms.reddit.metrics],
    ["Stack Overflow Link", profile.platforms.stackoverflow.exists ? profile.platforms.stackoverflow.url : "Not Found", profile.platforms.stackoverflow.metrics],
    ["YouTube Link", profile.platforms.youtube.exists ? profile.platforms.youtube.url : "Not Found", profile.platforms.youtube.metrics],
    ["Medium Link", profile.platforms.medium.exists ? profile.platforms.medium.url : "Not Found", profile.platforms.medium.metrics],
    ["Threat Exposure Score", profile.riskAssessment.riskScore.toString(), profile.riskAssessment.level],
  ];

  const csvContent = [
    headers.join(","),
    ...rows.map((row) => row.map((val) => `"${val.replace(/"/g, '""')}"`).join(",")),
  ].join("\n");

  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const downloadAnchor = document.createElement("a");
  downloadAnchor.setAttribute("href", url);
  downloadAnchor.setAttribute("download", `intelscope_report_${profile.username}.csv`);
  document.body.appendChild(downloadAnchor);
  downloadAnchor.click();
  downloadAnchor.remove();
}

// Generate Premium PDF using jsPDF
export function exportToPDF(profile: OSINTProfile) {
  const doc = new jsPDF();
  let y = 20;

  // Header Background bar
  doc.setFillColor(15, 23, 42); // slate-900
  doc.rect(0, 0, 210, 40, "F");

  // Title text
  doc.setTextColor(6, 182, 212); // cyan-400
  doc.setFont("Helvetica", "bold");
  doc.setFontSize(22);
  doc.text("IntelScope OSINT Report", 15, 22);

  doc.setTextColor(255, 255, 255);
  doc.setFont("Helvetica", "normal");
  doc.setFontSize(10);
  doc.text(`Target Digital Audit: @${profile.username}`, 15, 30);
  doc.text(`Date Executed: ${new Date(profile.timestamp).toLocaleString()}`, 15, 35);

  y = 55;

  // SECTION 1: PROFILE OVERVIEW
  doc.setFillColor(37, 99, 235); // blue-600
  doc.rect(15, y, 5, 8, "F");
  doc.setTextColor(15, 23, 42);
  doc.setFontSize(14);
  doc.setFont("Helvetica", "bold");
  doc.text("Executive Footprint Summary", 24, y + 6);
  y += 15;

  doc.setFont("Helvetica", "normal");
  doc.setFontSize(11);
  doc.setTextColor(51, 65, 85); // slate-700

  doc.text(`Full Target Name:  ${profile.personalInfo.name || "Not specified"}`, 15, y); y += 7;
  doc.text(`Report Identifier:  ${profile.id}`, 15, y); y += 7;
  doc.text(`Location Context:   ${profile.personalInfo.location || "Not specified"}`, 15, y); y += 7;
  doc.text(`Contact Exposed:    ${profile.personalInfo.email || "No direct public email exposed"}`, 15, y); y += 7;
  doc.text(`Portfolio Link:     ${profile.personalInfo.website || "Not provided"}`, 15, y); y += 7;
  doc.text(`Public Repo Count:  ${profile.personalInfo.publicRepos || 0}`, 15, y); y += 10;

  doc.setFont("Helvetica", "bold");
  doc.text("Target Biography / Profile Bio:", 15, y); y += 5;
  doc.setFont("Helvetica", "normal");
  const bioLines = doc.splitTextToSize(profile.personalInfo.bio || "No public biography text found.", 180);
  doc.text(bioLines, 15, y);
  y += (bioLines.length * 6) + 10;

  // SECTION 2: DISCOVERED PUBLIC NETWORKS
  doc.setFillColor(37, 99, 235); // blue-600
  doc.rect(15, y, 5, 8, "F");
  doc.setFontSize(14);
  doc.setFont("Helvetica", "bold");
  doc.setTextColor(15, 23, 42);
  doc.text("Ethical Platform Map", 24, y + 6);
  y += 15;

  doc.setFont("Helvetica", "normal");
  doc.setFontSize(10);
  doc.setTextColor(51, 65, 85);

  const platforms = [
    { label: "GitHub Profile", ...profile.platforms.github },
    { label: "Reddit Username", ...profile.platforms.reddit },
    { label: "Stack Overflow", ...profile.platforms.stackoverflow },
    { label: "YouTube Channel", ...profile.platforms.youtube },
    { label: "Medium Blog", ...profile.platforms.medium },
  ];

  platforms.forEach((p) => {
    if (y > 270) {
      doc.addPage();
      y = 25;
    }
    doc.setFont("Helvetica", "bold");
    doc.text(`${p.label}:`, 15, y);
    doc.setFont("Helvetica", "normal");
    if (p.exists) {
      doc.text(`EXISTS - ${p.url}`, 45, y);
      y += 5;
      doc.text(`Details: ${p.headline} (${p.metrics || ""})`, 15, y);
    } else {
      doc.text("No active public footprint found.", 45, y);
    }
    y += 10;
  });

  // SECTION 3: SKILLS & TECHNOLOGY PRESETS
  if (y > 240) {
    doc.addPage();
    y = 25;
  }
  y += 5;
  doc.setFillColor(37, 99, 235); // blue-600
  doc.rect(15, y, 5, 8, "F");
  doc.setFontSize(14);
  doc.setFont("Helvetica", "bold");
  doc.setTextColor(15, 23, 42);
  doc.text("Inferred Technical Skill Matrix", 24, y + 6);
  y += 15;

  doc.setFont("Helvetica", "normal");
  doc.setFontSize(11);
  doc.setTextColor(51, 65, 85);

  const skillText = profile.skills.map((s) => `${s.name} (${s.level}%)`).join(", ");
  const skillLines = doc.splitTextToSize(skillText || "No public programming skills detected.", 180);
  doc.text(skillLines, 15, y);
  y += (skillLines.length * 6) + 15;

  // SECTION 4: EXPOSURE & CYBERSECURITY RISK ASSESSMENT
  if (y > 230) {
    doc.addPage();
    y = 25;
  }
  doc.setFillColor(239, 68, 68); // red-500
  doc.rect(15, y, 5, 8, "F");
  doc.setFontSize(14);
  doc.setFont("Helvetica", "bold");
  doc.setTextColor(15, 23, 42);
  doc.text("Cybersecurity Risk & exposure Profile", 24, y + 6);
  y += 15;

  doc.setFont("Helvetica", "bold");
  doc.setFontSize(12);
  doc.text(`Threat Exposure Index: ${profile.riskAssessment.riskScore}/100 - ${profile.riskAssessment.level} exposure`, 15, y);
  y += 10;

  doc.setFont("Helvetica", "bold");
  doc.setFontSize(11);
  doc.text("Vector Discrepancy Factors:", 15, y);
  y += 7;

  doc.setFont("Helvetica", "normal");
  doc.setFontSize(10);
  profile.riskAssessment.factors.forEach((f) => {
    if (y > 270) {
      doc.addPage();
      y = 25;
    }
    doc.setFont("Helvetica", "bold");
    doc.text(`- ${f.factor} [Risk Level: ${f.risk.toUpperCase()}]:`, 15, y);
    doc.setFont("Helvetica", "normal");
    y += 5;
    const factorDetails = doc.splitTextToSize(f.details, 175);
    doc.text(factorDetails, 18, y);
    y += (factorDetails.length * 5) + 5;
  });

  // SECTION 5: EDUCATION AND RECOMMENDATIONS
  if (y > 250) {
    doc.addPage();
    y = 25;
  }
  y += 5;
  doc.setFillColor(34, 197, 94); // emerald-500
  doc.rect(15, y, 5, 8, "F");
  doc.setFontSize(14);
  doc.setFont("Helvetica", "bold");
  doc.setTextColor(15, 23, 42);
  doc.text("Ethical Hardening Suggestions", 24, y + 6);
  y += 15;

  doc.setFont("Helvetica", "normal");
  doc.setFontSize(10);
  profile.riskAssessment.recommendations.forEach((rec) => {
    if (y > 270) {
      doc.addPage();
      y = 25;
    }
    const recLines = doc.splitTextToSize(`* ${rec}`, 180);
    doc.text(recLines, 15, y);
    y += (recLines.length * 5) + 3;
  });

  y += 10;
  doc.setFont("Helvetica", "bold");
  doc.setFontSize(9);
  doc.setTextColor(100, 116, 139);
  doc.text("Disclaimer: IntelScope is an ethical audit resource. Data generated relies fully on public footprints.", 15, y);

  // Save PDF
  doc.save(`intelscope_report_${profile.username}.pdf`);
}
