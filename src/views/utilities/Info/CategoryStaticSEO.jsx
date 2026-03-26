import React from "react";

/**
 * CategoryStaticSEO
 *
 * Renders SEO content blocks for category and subcategory pages.
 * All data comes from the backend API via the `categoryDataFromAPI` prop.
 *
 * Category API shape (category_info.category_info):
 *   hero: { title, subtitle }
 *   sections: [
 *     { type: "intro",          content }
 *     { type: "grid_section",   title, description, items: [{ title, content }] }
 *     { type: "text_section",   title, content }
 *     { type: "highlight_box",  title, content }
 *   ]
 *
 * Subcategory API shape:
 *   title, subtitle, description
 */
const CategoryStaticSEO = ({
    categorySlug,
    subcategoryName,
    isSubcategory = false,
    subcategorySlug: subSlug,
    categoryDataFromAPI,
}) => {
    const api = categoryDataFromAPI || {};
    const isSubView = isSubcategory || !!api?.subcategory_name;

    // ─── Subcategory View ────────────────────────────────────────────────────────
    if (isSubView) {
        const effectiveSlug = subSlug || api?.subcategory_slug;
        const title =
            api?.title ||
            api?.subcategory_name ||
            subcategoryName ||
            (effectiveSlug
                ? effectiveSlug.replace(/-/g, " ").replace(/\b\w/g, l => l.toUpperCase())
                : "");
        const subtitle = api?.subtitle || api?.sub_category_subtitle || "";
        const description = api?.description || api?.intro_text || api?.content || "";
        // Rich sections — present when the API returns structured content for this subcategory
        const sections = api?.sections || [];

        if (!title && !description && sections.length === 0) return null;

        // Split plain description on double newlines so each paragraph renders separately
        const descParagraphs = description
            ? description.split(/\n\n+/).map(p => p.trim()).filter(Boolean)
            : [];

        return (
            <div className="bg-white py-12 px-4 md:px-16 font-sans text-gray-700 border-t border-gray-100">
                <div className="container mx-auto max-w-full">
                    {/* Title + subtitle */}
                    <div className="text-center mb-10">
                        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 uppercase tracking-tight">
                            {title}
                        </h1>
                        {subtitle && (
                            <p className="text-xl text-[#375421] font-medium mb-6">{subtitle}</p>
                        )}
                    </div>

                    {/* Plain description paragraphs (shown when no rich sections) */}
                    {sections.length === 0 && descParagraphs.length > 0 && (
                        <div className="max-w-5xl mx-auto mb-10 space-y-4 text-center">
                            {descParagraphs.map((para, i) => (
                                <p key={i} className="leading-relaxed text-lg text-gray-600">
                                    {para}
                                </p>
                            ))}
                        </div>
                    )}

                    {/* Rich sections — same renderer as Category view */}
                    {sections.map((section) => {
                        switch (section.type) {
                            case "intro":
                                return (
                                    <div key={section.id} className="mb-10 text-center max-w-5xl mx-auto">
                                        <p className="leading-relaxed text-lg text-gray-600">
                                            {section.content}
                                        </p>
                                    </div>
                                );
                            case "grid_section":
                                return (
                                    <div key={section.id} className="mb-12">
                                        {section.title && (
                                            <h2 className="text-2xl font-bold text-gray-800 mb-3 border-l-4 border-[#375421] pl-4">
                                                {section.title}
                                            </h2>
                                        )}
                                        {section.description && (
                                            <p className="leading-relaxed mb-6 text-gray-600">
                                                {section.description}
                                            </p>
                                        )}
                                        {section.items?.length > 0 && (
                                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                                {section.items.map((item, i) => (
                                                    <div
                                                        key={i}
                                                        className="bg-site-bg p-6 rounded-xl border border-gray-100 hover:shadow-md transition-shadow"
                                                    >
                                                        <h3 className="text-xl font-bold text-[#375421] mb-3">
                                                            {item.title}
                                                        </h3>
                                                        <p className="text-gray-600 leading-relaxed text-sm">
                                                            {item.content}
                                                        </p>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                );
                            case "text_section":
                                return (
                                    <div key={section.id} className="mb-12">
                                        {section.title && (
                                            <h2 className="text-2xl font-bold text-gray-800 mb-3 border-l-4 border-[#375421] pl-4">
                                                {section.title}
                                            </h2>
                                        )}
                                        {section.content && (
                                            <p className="leading-relaxed text-gray-600">{section.content}</p>
                                        )}
                                    </div>
                                );
                            case "highlight_box":
                                return (
                                    <div
                                        key={section.id}
                                        className="bg-green-50 p-8 rounded-2xl border border-green-100 mb-8"
                                    >
                                        {section.title && (
                                            <h2 className="text-2xl font-bold text-gray-900 mb-3">
                                                {section.title}
                                            </h2>
                                        )}
                                        {section.content && (
                                            <p className="leading-relaxed text-gray-800">{section.content}</p>
                                        )}
                                    </div>
                                );
                            default:
                                return null;
                        }
                    })}
                </div>
            </div>
        );
    }

    // ─── Category View ───────────────────────────────────────────────────────────
    const hero = api?.hero || {};
    const sections = api?.sections || [];

    const heroTitle =
        hero.title ||
        api?.category_name ||
        (categorySlug ? categorySlug.replace(/-/g, " ").replace(/\b\w/g, l => l.toUpperCase()) : "");

    const heroSubtitle =
        hero.subtitle ||
        api?.subtitle ||
        "";

    if (!heroTitle && sections.length === 0) return null;

    return (
        <div className="bg-white py-12 px-4 md:px-16 font-sans text-gray-700">
            <div className="container mx-auto max-w-full">

                {/* Hero */}
                {heroTitle && (
                    <div className="text-center mb-12">
                        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 uppercase tracking-tight">
                            {heroTitle}
                        </h1>
                        {heroSubtitle && (
                            <p className="text-xl text-[#375421] font-medium">{heroSubtitle}</p>
                        )}
                    </div>
                )}

                {/* Dynamic Sections */}
                {sections.map((section) => {
                    switch (section.type) {

                        // Plain intro paragraph
                        case "intro":
                            return (
                                <div key={section.id} className="mb-10 text-center max-w-5xl mx-auto">
                                    <p className="leading-relaxed text-lg text-gray-600">
                                        {section.content}
                                    </p>
                                </div>
                            );

                        // Section with heading + description + cards grid
                        case "grid_section":
                            return (
                                <div key={section.id} className="mb-12">
                                    {section.title && (
                                        <h2 className="text-2xl font-bold text-gray-800 mb-3 border-l-4 border-[#375421] pl-4">
                                            {section.title}
                                        </h2>
                                    )}
                                    {section.description && (
                                        <p className="leading-relaxed mb-6 text-gray-600">
                                            {section.description}
                                        </p>
                                    )}
                                    {section.items?.length > 0 && (
                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                            {section.items.map((item, i) => (
                                                <div
                                                    key={i}
                                                    className="bg-site-bg p-6 rounded-xl border border-gray-100 hover:shadow-md transition-shadow"
                                                >
                                                    <h3 className="text-xl font-bold text-[#375421] mb-3">
                                                        {item.title}
                                                    </h3>
                                                    <p className="text-gray-600 leading-relaxed text-sm">
                                                        {item.content}
                                                    </p>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            );

                        // Heading + paragraph
                        case "text_section":
                            return (
                                <div key={section.id} className="mb-12">
                                    {section.title && (
                                        <h2 className="text-2xl font-bold text-gray-800 mb-3 border-l-4 border-[#375421] pl-4">
                                            {section.title}
                                        </h2>
                                    )}
                                    {section.content && (
                                        <p className="leading-relaxed text-gray-600">{section.content}</p>
                                    )}
                                </div>
                            );

                        // Green highlighted box (CTA / tip)
                        case "highlight_box":
                            return (
                                <div
                                    key={section.id}
                                    className="bg-green-50 p-8 rounded-2xl border border-green-100 mb-8"
                                >
                                    {section.title && (
                                        <h2 className="text-2xl font-bold text-gray-900 mb-3">
                                            {section.title}
                                        </h2>
                                    )}
                                    {section.content && (
                                        <p className="leading-relaxed text-gray-800">{section.content}</p>
                                    )}
                                </div>
                            );

                        default:
                            return null;
                    }
                })}
            </div>
        </div>
    );
};

export default CategoryStaticSEO;
