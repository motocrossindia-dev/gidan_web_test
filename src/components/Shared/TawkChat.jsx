'use client';

import React, { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import Script from 'next/script';

const TawkChat = () => {
  const pathname = usePathname();

  // Pages where Tawk.to should be hidden
  const hiddenPages = ['/payment', '/successpage', '/order-success', '/thankyou'];
  const shouldHide = hiddenPages.some(page => pathname.startsWith(page));

  useEffect(() => {
    if (typeof window !== 'undefined' && window.Tawk_API) {
      if (shouldHide) {
        try {
          if (typeof window.Tawk_API.hideWidget === 'function') {
            window.Tawk_API.hideWidget();
          }
        } catch (e) {
          console.error("Error hiding Tawk widget", e);
        }
      } else {
        try {
          if (typeof window.Tawk_API.showWidget === 'function') {
            window.Tawk_API.showWidget();
          }
        } catch (e) {
          // Script not loaded yet
        }
      }
    }
  }, [shouldHide, pathname]);

  return (
    <Script id="tawk-to" strategy="lazyOnload">
      {`
                var Tawk_API=Tawk_API||{}, Tawk_LoadStart=new Date();
                Tawk_API.customStyle = {
                    visibility : {
                        desktop : {
                            position : 'br',
                            xOffset : 40,
                            yOffset : 40
                        },
                        mobile : {
                            position : 'br',
                            xOffset : 25,
                            yOffset : 70
                        }
                    }
                };

                (function(){
                    var s1=document.createElement("script"),s0=document.getElementsByTagName("script")[0];
                    s1.async=true;
                    s1.src='https://embed.tawk.to/699cc6abfaf0a71c36d94cbd/1ji66g3s9';
                    s1.charset='UTF-8';
                    s1.setAttribute('crossorigin','*');
                    s0.parentNode.insertBefore(s1,s0);
                })();
            `}
    </Script>
  );
};

export default TawkChat;
