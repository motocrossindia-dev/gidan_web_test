import React from 'react';

/**
 * Premium Section Header
 */
export const SectionHeader = ({ subtitle, title, italicTitle, titleSuffix, description }) => (
  <div className="mb-12 lg:mb-20 max-w-[800px]">
    {subtitle && (
      <span className="block text-[11px] lg:text-[12px] font-bold tracking-[0.25em] text-[#2d5a1b] uppercase mb-4 animate-fade-in">
        {subtitle}
      </span>
    )}
    <h2 className="text-4xl lg:text-[64px] font-serif font-bold text-[#1a1f14] leading-[1.05] tracking-tight mb-8">
      {title} {italicTitle && <span className="italic font-normal text-[#2d5a1b]">{italicTitle}</span>} {titleSuffix}
    </h2>
    {description && (
      <p className="text-[17px] text-[#4a4a4a] leading-relaxed italic opacity-80 max-w-[600px]">
        {description}
      </p>
    )}
  </div>
);

const CommonSections = { SectionHeader };
export default CommonSections;
