import "../styles/globals.css";
import { ReactNode } from "react";

export const metadata = {
  title: "Ops Protocol Tools",
  description: "Bridge Theory, Co-Parenting Systems, and Tools",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="max-w-5xl mx-auto p-6">
        <nav className="flex gap-4 mb-6 border-b pb-2">
          <a href="/">Home</a>
          <a href="/tools/bridge">Bridge Tracker</a>
          <a href="/tools/phase-map">Phase Map</a>
          <a href="/tools/decision-coach">Decision Coach</a>
          <a href="/tools/assessments">Assessments</a>
          <a href="/tools/simulator">Simulator</a>
          <a href="/tools/feedback">Feedback</a>
        </nav>
        {children}
      </body>
    </html>
  );
}
