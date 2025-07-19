import { useEffect } from 'react';

const TawkToWidget = () => {
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://embed.tawk.to/671a6b3a2480f5b4f593433b/1iavj5o5a';
    script.async = true;
    script.charset = 'UTF-8';
    script.setAttribute('crossorigin', '*');
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return null; // It's just a script injection, no UI
};

export default TawkToWidget;
