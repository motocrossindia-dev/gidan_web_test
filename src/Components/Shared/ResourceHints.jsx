import { Helmet } from 'react-helmet-async';

/**
 * Resource Hints Component
 * Optimizes resource loading with preconnect, dns-prefetch, and preload
 */
const ResourceHints = () => {
  const apiDomain = process.env.REACT_APP_API_URL;

  return (
    <Helmet>
      {/* DNS Prefetch - Resolve DNS early */}
      <link rel="dns-prefetch" href={apiDomain} />
      
      {/* Preconnect - Establish early connection */}
      <link rel="preconnect" href={apiDomain} />
      <link rel="preconnect" href={apiDomain} crossOrigin="anonymous" />
      
      {/* Preconnect to common CDNs */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      
      {/* Note: Montserrat font is loaded via @fontsource/montserrat npm package */}
      
      {/* Resource hints for better performance */}
      <meta httpEquiv="x-dns-prefetch-control" content="on" />
    </Helmet>
  );
};

export default ResourceHints;
