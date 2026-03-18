import { NextRequest, NextResponse } from "next/server";

// GET /api/certificates/[id]
// Generates a PDF certificate for a credential
// In production, use a proper PDF library (puppeteer, jspdf, @react-pdf/renderer)
// This generates an HTML-based certificate that can be printed to PDF

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const credentialId = params.id;

  // In production, fetch from database
  // For now, use mock data
  const credential = {
    id: credentialId,
    title: "Python Programming Certificate",
    description: "Completed the Introduction to Programming with Python module with distinction.",
    recipient: "Thabo Mokoena",
    issuer: "WeThinkCode_ via SkillWeave SA",
    issued_at: "2024-07-15",
    credential_hash: `SW-${credentialId.slice(0, 12)}`,
    type: "certificate",
    credits: 20,
    nqf_level: "5",
    score: "87%",
  };

  // Generate HTML certificate
  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>${credential.title} - ${credential.recipient}</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;600;700&display=swap');
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: 'Plus Jakarta Sans', sans-serif; background: white; }
    .certificate {
      width: 297mm; height: 210mm; padding: 20mm;
      position: relative; overflow: hidden;
      border: 3px solid #059669;
    }
    .border-inner {
      border: 1px solid #d1fae5;
      padding: 15mm;
      height: 100%;
      position: relative;
    }
    .corner { position: absolute; width: 40px; height: 40px; border: 2px solid #059669; }
    .corner-tl { top: 5mm; left: 5mm; border-right: none; border-bottom: none; }
    .corner-tr { top: 5mm; right: 5mm; border-left: none; border-bottom: none; }
    .corner-bl { bottom: 5mm; left: 5mm; border-right: none; border-top: none; }
    .corner-br { bottom: 5mm; right: 5mm; border-left: none; border-top: none; }
    .header { text-align: center; margin-bottom: 8mm; }
    .logo { font-size: 14px; font-weight: 700; color: #059669; letter-spacing: 3px; text-transform: uppercase; }
    .type { font-size: 11px; color: #64748b; margin-top: 4px; text-transform: uppercase; letter-spacing: 2px; }
    .title-section { text-align: center; margin: 10mm 0; }
    .presented-to { font-size: 11px; color: #94a3b8; text-transform: uppercase; letter-spacing: 2px; }
    .recipient { font-size: 32px; font-weight: 700; color: #0f172a; margin: 6mm 0; }
    .cert-title { font-size: 18px; font-weight: 600; color: #059669; margin-bottom: 4mm; }
    .description { font-size: 12px; color: #64748b; max-width: 160mm; margin: 0 auto; line-height: 1.6; }
    .details { display: flex; justify-content: center; gap: 20mm; margin: 10mm 0; }
    .detail { text-align: center; }
    .detail-label { font-size: 9px; color: #94a3b8; text-transform: uppercase; letter-spacing: 1px; }
    .detail-value { font-size: 14px; font-weight: 600; color: #0f172a; margin-top: 2px; }
    .footer { text-align: center; position: absolute; bottom: 0; left: 0; right: 0; }
    .hash { font-size: 9px; color: #94a3b8; font-family: monospace; }
    .verify { font-size: 9px; color: #059669; margin-top: 2px; }
    .signatures { display: flex; justify-content: space-around; margin-top: 8mm; }
    .sig { text-align: center; }
    .sig-line { width: 50mm; border-bottom: 1px solid #cbd5e1; margin-bottom: 2mm; }
    .sig-name { font-size: 10px; color: #64748b; }
    @media print {
      body { -webkit-print-color-adjust: exact; }
      .certificate { border: 3px solid #059669 !important; }
    }
  </style>
</head>
<body>
  <div class="certificate">
    <div class="corner corner-tl"></div>
    <div class="corner corner-tr"></div>
    <div class="corner corner-bl"></div>
    <div class="corner corner-br"></div>
    <div class="border-inner">
      <div class="header">
        <div class="logo">SkillWeave SA</div>
        <div class="type">Certificate of Completion</div>
      </div>

      <div class="title-section">
        <div class="presented-to">This is to certify that</div>
        <div class="recipient">${credential.recipient}</div>
        <div class="cert-title">${credential.title}</div>
        <div class="description">${credential.description}</div>
      </div>

      <div class="details">
        <div class="detail">
          <div class="detail-label">Credits</div>
          <div class="detail-value">${credential.credits}</div>
        </div>
        <div class="detail">
          <div class="detail-label">NQF Level</div>
          <div class="detail-value">${credential.nqf_level}</div>
        </div>
        <div class="detail">
          <div class="detail-label">Score</div>
          <div class="detail-value">${credential.score}</div>
        </div>
        <div class="detail">
          <div class="detail-label">Date Issued</div>
          <div class="detail-value">${new Date(credential.issued_at).toLocaleDateString("en-ZA", { year: "numeric", month: "long", day: "numeric" })}</div>
        </div>
      </div>

      <div class="signatures">
        <div class="sig">
          <div class="sig-line"></div>
          <div class="sig-name">${credential.issuer}</div>
        </div>
        <div class="sig">
          <div class="sig-line"></div>
          <div class="sig-name">SkillWeave SA Platform</div>
        </div>
      </div>

      <div class="footer">
        <div class="hash">Credential ID: ${credential.credential_hash}</div>
        <div class="verify">Verify at skillweave.co.za/verify/${credentialId}</div>
      </div>
    </div>
  </div>
</body>
</html>`;

  return new NextResponse(html, {
    headers: {
      "Content-Type": "text/html",
      "Content-Disposition": `inline; filename="${credential.title.replace(/\s+/g, "-")}.html"`,
    },
  });
}
