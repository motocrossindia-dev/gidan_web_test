'use client';

import Script from 'next/script';

const TawkToWidget = () => {
  return (
    <>
      {/* Pre-declare Tawk_API so the widget picks up any pre-configured callbacks */}
      <Script
        id="tawkto-api-init"
        strategy="beforeInteractive"
        dangerouslySetInnerHTML={{
          __html: `window.Tawk_API = window.Tawk_API || {}; window.Tawk_LoadStart = new Date();`,
        }}
      />
      {/* Load Tawk.to embed script directly — no wrapper loader, no crossorigin */}
      <Script
        id="tawkto-script"
        strategy="afterInteractive"
        src="https://embed.tawk.to/671a6b3a2480f5b4f593433b/1iavj5o5a"
      />
    </>
  );
};

export default TawkToWidget;
