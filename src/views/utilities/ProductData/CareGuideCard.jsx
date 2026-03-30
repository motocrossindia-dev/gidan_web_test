'use client';

import React from 'react';
import { motion } from 'framer-motion';

const CareGuideCard = ({ icon, label, title, description, delay = 0 }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay }}
      className="care-card"
    >
      <div className="care-card-icon">{icon}</div>
      <div className="care-card-label">{label}</div>
      <div className="care-card-title">{title}</div>
      <p className="care-card-desc">{description}</p>
    </motion.div>
  );
};

export default CareGuideCard;
