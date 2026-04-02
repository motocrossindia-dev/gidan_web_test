'use client';

import { usePathname } from "next/navigation";
import Link from "next/link";
import React from 'react';
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
    const pathname = usePathname();

    return (
        <div className="py-1.5 px-4 bg-site-bg border-b border-gray-200">
            <div className="container mx-auto">
                <Breadcrumbs
                    separator={<NavigateNext fontSize="small" className="text-gray-400" />}
                    aria-label="breadcrumb"
                    className="text-sm"
                >
                    {/* Home Link */}
                    <Link
                        href="/"
                        className="flex items-center gap-1 text-gray-600 hover:text-bio-green transition-colors"
                    >
                        <Home fontSize="small" />
                        <span>Home</span>
                    </Link>

                    {/* Dynamic Breadcrumb Items */}
                    {items.map((item, index) => (
                        item.path ? (
                            <Link
                                key={index}
                                href={item.path}
                                className="text-gray-600 hover:text-bio-green transition-colors capitalize"
                            >
                                {item.label}
                            </Link>
                        ) : (
                            <Typography
                                key={index}
                                color="text.secondary"
                                className="text-gray-600 text-[14px] capitalize"
                            >
                                {item.label}
                            </Typography>
                        )
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
