"use client";

export const dynamic = "force-dynamic";

export default function GlobalError({
  reset
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body>
        <main
          style={{
            minHeight: "100vh",
            display: "grid",
            placeItems: "center",
            padding: 24,
            background: "#f7faf8",
            color: "#111812",
            fontFamily: "Arial, Helvetica, sans-serif"
          }}
        >
          <section style={{ maxWidth: 520 }}>
            <p style={{ margin: 0, color: "#087443", fontWeight: 700 }}>ITShop Equipment Leasing</p>
            <h1 style={{ margin: "12px 0", fontSize: 32, lineHeight: 1.15 }}>Something went wrong</h1>
            <p style={{ margin: "0 0 20px", color: "#647067", lineHeight: 1.6 }}>
              The page could not be loaded. Try again, or return to the homepage.
            </p>
            <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
              <button
                type="button"
                onClick={reset}
                style={{
                  minHeight: 40,
                  border: 0,
                  borderRadius: 8,
                  padding: "0 16px",
                  background: "#087443",
                  color: "#ffffff",
                  fontWeight: 700,
                  cursor: "pointer"
                }}
              >
                Try again
              </button>
              <button
                type="button"
                onClick={() => {
                  window.location.href = "/";
                }}
                style={{
                  minHeight: 40,
                  display: "inline-flex",
                  alignItems: "center",
                  border: "1px solid #d9e2dc",
                  borderRadius: 8,
                  padding: "0 16px",
                  background: "#ffffff",
                  color: "#111812",
                  fontWeight: 700
                }}
              >
                Go home
              </button>
            </div>
          </section>
        </main>
      </body>
    </html>
  );
}
