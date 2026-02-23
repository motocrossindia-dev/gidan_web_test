declare module 'react-helmet-async' {
  import { FC, ReactNode } from 'react';

  export const Helmet: FC<{ children?: ReactNode }>;
  export const HelmetProvider: FC<{ children?: ReactNode }>;
}
