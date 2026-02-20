'use client';

import Script from 'next/script';

const TawkToWidget = () => {
  return (
    <>
      <Script
        id="tawkto-script"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.Tawk_API = window.Tawk_API || {};
            window.Tawk_LoadStart = new Date();
            (function(){
              var s1 = document.createElement("script");
              var s0 = document.getElementsByTagName("script")[0];
              s1.async = true;
              s1.src = 'https://embed.tawk.to/671a6b3a2480f5b4f593433b/1iavj5o5a';
              s1.charset = 'UTF-8';
              s1.setAttribute('crossorigin', '*');
              s0.parentNode.insertBefore(s1, s0);
            })();
          `,
        }}
      />
    </>
  );
};

export default TawkToWidget;
