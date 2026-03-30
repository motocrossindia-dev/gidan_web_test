import React from 'react';
import Section from './UnifiedSection';

/**
 * Orchestrator for rendering all homepage sections.
 * This component now uses the truly universal Section system for total visual consistency.
 */
const DynamicSection = ({ section }) => {
  if (!section || !section.is_active) return null;

  return <Section data={section} />;
};

export default DynamicSection;
