import "../styles/globals.css";
import type { ReactNode } from "react";

export const metadata = {
  title: "Ops Protocol Tools",
  description: "Bridge Theory, Co-Parenting Systems, and Tools.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-white text-gray-900">
        <nav className="p-4 border-b">
          <a href="/" className="font-semibold mr-4">Home</a>
          <a href="/tools/bridge" className="mr-4">Bridge Tracker</a>
          <a href="/tools/phase-map" className="mr-4">Phase Map</a>
          <a href="/tools/decision-coach" className="mr-4">Decision Coach</a>
          <a href="/tools/assessments" className="mr-4">Assessments</a>
          <a href="/tools/simulator" className="mr-4">Simulator</a>
          <a href="/tools/feedback" className="mr-4">Feedback</a>
        </nav>
        <main className="p-6">{children}</main>
      </body>
    </html>
  );
}
