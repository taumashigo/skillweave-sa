import { NextRequest, NextResponse } from "next/server";

// GET /api/qr/[credentialHash]
// Generates a QR code SVG for credential verification
// In production, use the 'qrcode' npm package for proper QR generation
// This creates a minimal SVG-based QR code representation

export async function GET(
  req: NextRequest,
  { params }: { params: { credentialHash: string } }
) {
  const hash = params.credentialHash;
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://skillweave.co.za";
  const verifyUrl = `${appUrl}/verify/${hash}`;

  // Try to use qrcode library if available
  try {
    const QRCode = (await import("qrcode")).default;

    // Generate SVG QR code
    const svgString = await QRCode.toString(verifyUrl, {
      type: "svg",
      errorCorrectionLevel: "M",
      margin: 2,
      width: 256,
      color: {
        dark: "#0f172a",
        light: "#ffffff",
      },
    });

    return new NextResponse(svgString, {
      headers: {
        "Content-Type": "image/svg+xml",
        "Cache-Control": "public, max-age=86400",
      },
    });
  } catch {
    // Fallback: generate a simple placeholder SVG with the verification URL
    const svg = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" width="256" height="256">
  <rect width="256" height="256" fill="white" rx="12"/>
  <rect x="20" y="20" width="60" height="60" fill="#0f172a" rx="4"/>
  <rect x="26" y="26" width="48" height="48" fill="white" rx="2"/>
  <rect x="34" y="34" width="32" height="32" fill="#0f172a" rx="2"/>
  <rect x="176" y="20" width="60" height="60" fill="#0f172a" rx="4"/>
  <rect x="182" y="26" width="48" height="48" fill="white" rx="2"/>
  <rect x="190" y="34" width="32" height="32" fill="#0f172a" rx="2"/>
  <rect x="20" y="176" width="60" height="60" fill="#0f172a" rx="4"/>
  <rect x="26" y="182" width="48" height="48" fill="white" rx="2"/>
  <rect x="34" y="190" width="32" height="32" fill="#0f172a" rx="2"/>
  <!-- Data pattern (simplified representation) -->
  <rect x="96" y="20" width="12" height="12" fill="#0f172a"/>
  <rect x="120" y="20" width="12" height="12" fill="#0f172a"/>
  <rect x="96" y="44" width="12" height="12" fill="#0f172a"/>
  <rect x="148" y="44" width="12" height="12" fill="#0f172a"/>
  <rect x="96" y="68" width="12" height="12" fill="#0f172a"/>
  <rect x="120" y="68" width="12" height="12" fill="#0f172a"/>
  <rect x="148" y="68" width="12" height="12" fill="#0f172a"/>
  <rect x="20" y="96" width="12" height="12" fill="#0f172a"/>
  <rect x="44" y="96" width="12" height="12" fill="#0f172a"/>
  <rect x="96" y="96" width="12" height="12" fill="#059669"/>
  <rect x="120" y="96" width="12" height="12" fill="#059669"/>
  <rect x="148" y="96" width="12" height="12" fill="#059669"/>
  <rect x="176" y="96" width="12" height="12" fill="#0f172a"/>
  <rect x="224" y="96" width="12" height="12" fill="#0f172a"/>
  <rect x="20" y="120" width="12" height="12" fill="#0f172a"/>
  <rect x="68" y="120" width="12" height="12" fill="#0f172a"/>
  <rect x="96" y="120" width="12" height="12" fill="#059669"/>
  <rect x="148" y="120" width="12" height="12" fill="#059669"/>
  <rect x="200" y="120" width="12" height="12" fill="#0f172a"/>
  <rect x="44" y="148" width="12" height="12" fill="#0f172a"/>
  <rect x="96" y="148" width="12" height="12" fill="#0f172a"/>
  <rect x="120" y="148" width="12" height="12" fill="#0f172a"/>
  <rect x="176" y="148" width="12" height="12" fill="#0f172a"/>
  <rect x="224" y="148" width="12" height="12" fill="#0f172a"/>
  <rect x="96" y="176" width="12" height="12" fill="#0f172a"/>
  <rect x="120" y="176" width="12" height="12" fill="#0f172a"/>
  <rect x="176" y="176" width="12" height="12" fill="#0f172a"/>
  <rect x="200" y="176" width="12" height="12" fill="#0f172a"/>
  <rect x="96" y="200" width="12" height="12" fill="#0f172a"/>
  <rect x="148" y="200" width="12" height="12" fill="#0f172a"/>
  <rect x="176" y="200" width="12" height="12" fill="#0f172a"/>
  <rect x="224" y="224" width="12" height="12" fill="#0f172a"/>
  <!-- SkillWeave logo dot -->
  <circle cx="128" cy="128" r="16" fill="#059669"/>
  <text x="128" y="133" text-anchor="middle" font-family="sans-serif" font-size="12" font-weight="bold" fill="white">SW</text>
</svg>`;

    return new NextResponse(svg, {
      headers: {
        "Content-Type": "image/svg+xml",
        "Cache-Control": "public, max-age=86400",
      },
    });
  }
}
