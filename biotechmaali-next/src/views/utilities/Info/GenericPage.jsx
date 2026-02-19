'use client';

import React from "react";

const GenericPage = ({ data }) => {
    console.log(data,'================fafa');
    // Helper to render specific section types dynamically
    const renderSection = (section) => {
        switch (section.type) {
            case "intro":
                return (
                    <div key={section.id} className={section.containerClass}>
                        <p>{section.content}</p>
                    </div>
                );

            case "text_section":
                return (
                    <div key={section.id} className={section.containerClass}>
                        <h2 className={section.titleClass}>{section.title}</h2>
                        <p className="leading-relaxed">{section.content}</p>
                    </div>
                );

            case "highlight_box":
                return (
                    <div key={section.id} className={section.containerClass}>
                        <h2 className={section.titleClass}>{section.title}</h2>
                        <p className="leading-relaxed">{section.content}</p>
                    </div>
                );

            case "grid_section":
                const { gridConfig, items, title, description, titleClass } = section;
                return (
                    <div key={section.id} className={section.containerClass}>
                        <h2 className={titleClass}>{title}</h2>
                        <p className="leading-relaxed mb-4">{description}</p>

                        {/* Dynamic Grid based on JSON config */}
                        <div className={gridConfig.cols}>
                            {items.map((item, index) => (
                                <div key={index} className={gridConfig.cardClass}>
                                    <h3 className={gridConfig.titleClass}>{item.title}</h3>
                                    <p className={gridConfig.textClass}>{item.content}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                );

            default:
                return null;
        }
    };

    return (
        <div className="bg-white py-12 px-4 md:px-16 font-sans text-gray-700">
            {/*
         Dynamic Container Max Width:
         Defaults to max-w-4xl if not specified in JSON (used for Pots page).
      */}
            <div className={`container mx-auto max-w-full`}>
            {/*<div className={`container mx-auto ${data.containerMaxWidth || "max-w-4xl"}`}>*/}

                {/* Dynamic Hero Section */}
                <div className={data.hero.containerClass}>
                    <h1 className={data.hero.titleClass}>
                        {data.hero.title}
                    </h1>
                    <p className={data.hero.subtitleClass}>
                        {data.hero.subtitle}
                    </p>
                </div>

                {/* Render all sections dynamically */}
                {data.sections.map(section => renderSection(section))}

            </div>
        </div>
    );
};

export default GenericPage;