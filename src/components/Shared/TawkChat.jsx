'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import Script from 'next/script';

const TawkChat = () => {
  const pathname = usePathname();

  // Pages where Tawk.to should be hidden
  const hiddenPages = ['/checkout', '/profile', '/successpage', '/order-success', '/thankyou'];

  const shouldHide = hiddenPages.some(page => pathname.startsWith(page));

  useEffect(() => {
    if (typeof window !== 'undefined' && window.Tawk_API) {
      if (shouldHide) {
        try {
          window.Tawk_API.hideWidget();
        } catch (e) {
          console.error("Error hiding Tawk widget", e);
        }
      } else {
        try {
          window.Tawk_API.showWidget();
        } catch (e) {
          // If showWidget fails, it might not be fully loaded yet
        }
      }
    }
  }, [shouldHide, pathname]);

  return (
    <Script id="tawk-to" strategy="lazyOnload">
      {`
        var Tawk_API=Tawk_API||{}, Tawk_LoadStart=new Date();
        
        // Use customStyle API for proper offsets
        Tawk_API.customStyle = {
            visibility : {
                desktop : {
                    position : 'br',
                    xOffset : 0,
                    yOffset : 0
                },
                mobile : {
                    position : 'br',
                    xOffset : 0,
                    yOffset : 80 // Clear the mobile bottom nav
                }
            }
        };

        Tawk_API.onLoad = function(){
            var shiftIframes = function() {
                var isMobile = window.innerWidth <= 768;
                if (!isMobile) return;
                
                var expected = 'translateY(-110px)';
                var iframes = document.querySelectorAll('iframe');
                for (var i = 0; i < iframes.length; i++) {
                    var z = iframes[i].style.zIndex;
                    if (z && parseInt(z) >= 1000000) {
                        if (iframes[i].style.transform !== expected) {
                            iframes[i].style.setProperty('transform', expected, 'important');
                        }
                    }
                }
            };
            
            // Initial shift check
            setTimeout(shiftIframes, 1000);
            
            // Re-apply on window resize
            window.addEventListener('resize', shiftIframes);
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
