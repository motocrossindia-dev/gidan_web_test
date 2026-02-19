'use client';

import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Breadcrumbs, Typography } from '@mui/material';
import { NavigateNext, Home } from '@mui/icons-material';

/**
 * Breadcrumb Component
 * 
 * Displays navigation breadcrumbs matching URL structure
 * Supports 3-segment product URLs: /{category}/{subcategory}/{product}/
 * 
 * @param {Object} props
 * @param {Array} props.items - Array of breadcrumb items: [{ label, path }]
 * @param {string} props.currentPage - Current page name (not linked)
 */
export default function Breadcrumb({ items = [], currentPage }) {
    const location = useLocation();

    return (
        <div className="py-3 px-4 bg-gray-50 border-b border-gray-200">
            <div className="container mx-auto">
                <Breadcrumbs
                    separator={<NavigateNext fontSize="small" className="text-gray-400" />}
                    aria-label="breadcrumb"
                    className="text-sm"
                >
                    {/* Home Link */}
                    <Link
                        to="/"
                        className="flex items-center gap-1 text-gray-600 hover:text-bio-green transition-colors"
                    >
                        <Home fontSize="small" />
                        <span>Home</span>
                    </Link>

                    {/* Dynamic Breadcrumb Items */}
                    {items.map((item, index) => (
                        <Link
                            key={index}
                            to={item.path}
                            className="text-gray-600 hover:text-bio-green transition-colors capitalize"
                        >
                            {item.label}
                        </Link>
                    ))}

                    {/* Current Page (not linked) */}
                    {currentPage && (
                        <Typography
                            color="text.primary"
                            className="text-gray-900 font-medium capitalize"
                        >
                            {currentPage}
                        </Typography>
                    )}
                </Breadcrumbs>
            </div>
        </div>
    );
}
