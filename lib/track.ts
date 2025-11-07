export type AnalyticsPayload = {
  type: string;
  metadata?: Record<string, any>;
};

export async function trackEvent(payload: AnalyticsPayload) {
  try {
    const res = await fetch("/api/analytics", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      console.error("trackEvent failed", await res.text());
    }
  } catch (err) {
    console.error("trackEvent error", err);
  }
}
