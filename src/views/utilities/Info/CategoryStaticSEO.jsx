import React from "react";

const CategoryStaticSEO = ({ categorySlug, subcategoryName, isSubcategory, subcategorySlug: subSlug }) => {
    // subSlug is now passed as a prop from server component

    const subcategoryData = [
        {
            "slug": "indoor-plant",
            "title": "Indoor Plant",
            "subtitle": "Buy Plants Online in India from Gidan.store",
            "description": "Indoor plants are perfect for homes and offices as they enhance interior décor and promote a healthier environment. These plants thrive in low to moderate light and require minimal care. Popular indoor plants include Money Plant, Snake Plant, Peace Lily, Areca Palm, and ZZ Plant. Indoor plants are ideal for living rooms, bedrooms, and workspaces."
        },
        {
            "slug": "outdoor-plant",
            "title": "Outdoor Plant",
            "subtitle": "Buy Plants Online in India from Gidan.store",
            "description": "Outdoor plants are suitable for gardens, balconies, terraces, and open spaces. They add freshness, natural beauty, and greenery to your surroundings. At Gidan.store, you can explore a wide range of outdoor plants including decorative plants, shrubs, and garden greens that grow well in Indian weather conditions and are easy to maintain."
        },
        {
            "slug": "flowering-plants",
            "title": "Flowering Plants",
            "subtitle": "Buy Plants Online in India from Gidan.store",
            "description": "Flowering plants bring color, fragrance, and vibrancy to any space. Whether planted in gardens, balconies, or pots, flowering plants create a lively and cheerful environment. Our collection includes seasonal and perennial flowering plants that bloom beautifully with proper care and sunlight."
        },
        {
            "slug": "vegetable-seeds",
            "title": "Vegetable Seeds",
            "subtitle": "Buy Seeds Online in India from Gidan.store",
            "description": "Vegetable seeds are perfect for growing fresh, healthy, and chemical-free vegetables at home. Whether you have a small balcony or a backyard garden, our vegetable seeds are suitable for various growing spaces. Common options include seeds for leafy greens, root vegetables, and seasonal vegetables that are easy to grow and maintain."
        },
        {
            "slug": "flower-seeds",
            "title": "Flower Seeds",
            "subtitle": "Buy Seeds Online in India from Gidan.store",
            "description": "Flower seeds add beauty, color, and freshness to your garden or home. From seasonal blooms to long-lasting flowering plants, our flower seeds are ideal for gardens, balconies, and pots. With proper care and sunlight, these seeds grow into vibrant flowers that enhance the overall appearance of your space."
        },
        {
            "slug": "rotomolded-pots",
            "title": "Rotomolded Pots",
            "subtitle": "Buy Plant Pots Online in India from Gidan.store",
            "description": "Rotomolded pots are known for their premium finish, durability, and weather resistance. These pots are lightweight yet strong, making them ideal for both indoor and outdoor use. With their modern designs and long-lasting quality, rotomolded pots are perfect for enhancing gardens, balconies, and living spaces."
        },
        {
            "slug": "plastic-pots",
            "title": "Plastic Pots",
            "subtitle": "Buy Plant Pots Online in India from Gidan.store",
            "description": "Plastic pots are affordable, lightweight, and easy to maintain. They are suitable for everyday gardening needs and are available in various sizes, shapes, and colors. Plastic pots are ideal for beginners and are perfect for both indoor and outdoor plants."
        },
        {
            "slug": "hanging-pots",
            "title": "Hanging Pots",
            "subtitle": "Buy Plant Pots Online in India from Gidan.store",
            "description": "Hanging pots are a great way to save space while adding greenery to your home. Ideal for balconies, windows, and indoor corners, hanging pots are perfect for trailing and decorative plants. They help create a fresh and stylish look without occupying floor space."
        },
        {
            "slug": "table-top-pots",
            "title": "Table Top Pots",
            "subtitle": "Buy Plant Pots Online in India from Gidan.store",
            "description": "Table top pots are compact and decorative, making them ideal for desks, shelves, coffee tables, and workspaces. These pots are perfect for small indoor plants and succulents, adding a touch of greenery to your interiors."
        },
        {
            "slug": "eco-planters",
            "title": "Eco Planters",
            "subtitle": "Buy Plant Pots Online in India from Gidan.store",
            "description": "Eco planters are made from sustainable and environmentally friendly materials. They are designed for eco-conscious gardeners who want to reduce their environmental impact while maintaining style and functionality. Eco planters are perfect for homes that value sustainability and natural living."
        },
        {
            "slug": "garden-essenials",
            "title": "Garden Essentials",
            "subtitle": "Buy Plant Care Products Online in India from Gidan.store",
            "description": "Garden essentials include the basic tools and products required for everyday plant maintenance. These products help with watering, pruning, feeding, and protecting plants. Whether you are a beginner or an experienced gardener, our garden essentials make plant care simple, efficient, and enjoyable."
        },
        {
            "slug": "growing-media",
            "title": "Growing Media",
            "subtitle": "Buy Plant Care Products Online in India from Gidan.store",
            "description": "Growing media play a crucial role in plant health by providing proper aeration, drainage, and nutrients. At Gidan.store, you can find high-quality growing media suitable for different plants and purposes. These are ideal for seed starting, potting, and improving soil structure for better root development."
        }
    ];
    const seoData = [
        {
            "category": "plants",
            "page_title": "PLANTS",
            "subtitle": "Buy Plants Online in India from Gidan.store",
            "intro_text": "Welcome to Gidan.store, your one-stop online destination for buying healthy and premium quality plants in India. Whether you want to beautify your home, create a refreshing garden, or add natural charm to your surroundings, our wide range of plants makes it easy to bring greenery into your life. From indoor plants to outdoor and flowering plants, we offer carefully nurtured varieties suitable for Indian homes and climates.",
            "section_1": {
                "title": "Choosing Plants Based on Your Space and Lifestyle",
                "description": "Selecting the right plants depends on factors such as available space, sunlight, maintenance level, and purpose. At Gidan.store, we help you choose plants that suit your indoor spaces, balconies, terraces, and gardens. Our collection is ideal for both beginners and experienced plant lovers."
            },
            "feature_cards": [
                {
                    "title": "Indoor Plants",
                    "description": "Indoor plants are perfect for homes and offices as they enhance interior décor and promote a healthier environment. These plants thrive in low to moderate light and require minimal care. Popular indoor plants include Money Plant, Snake Plant, Peace Lily, Areca Palm, and ZZ Plant. Indoor plants are ideal for living rooms, bedrooms, and workspaces."
                },
                {
                    "title": "Outdoor Plants",
                    "description": "Outdoor plants are suitable for gardens, balconies, terraces, and open spaces. They add freshness, natural beauty, and greenery to your surroundings. At Gidan.store, you can explore a wide range of outdoor plants including decorative plants, shrubs, and garden greens that grow well in Indian weather conditions and are easy to maintain."
                },
                {
                    "title": "Flowering Plants",
                    "description": "Flowering plants bring color, fragrance, and vibrancy to any space. Whether planted in gardens, balconies, or pots, flowering plants create a lively and cheerful environment. Our collection includes seasonal and perennial flowering plants that bloom beautifully with proper care and sunlight."
                }
            ],
            "section_2": {
                "title": "Compare and Choose the Best Plants Online",
                "description": "With a wide variety of plants available, choosing the right one can be simple when you know your requirements. At Gidan.store, each plant comes with basic care information to help you make the right decision and ensure healthy growth."
            },
            "cta_box": {
                "title": "Identify Your Plant Care Preference",
                "description": "Before purchasing, consider how much time you can dedicate to plant care. If you prefer low-maintenance options, indoor plants are a great choice. If you enjoy gardening and outdoor maintenance, outdoor and flowering plants can be a rewarding experience."
            }
        },
        {
            "category": "seeds",
            "page_title": "SEEDS",
            "subtitle": "Buy Seeds Online in India from Gidan.store",
            "intro_text": "Welcome to Gidan.store, your reliable online destination for high-quality seeds that help you grow healthy and vibrant plants at home. Whether you are starting a kitchen garden, growing fresh vegetables, or adding colorful flowers to your garden, our carefully selected seeds ensure better germination and strong plant growth. From vegetable seeds to flower seeds, Gidan.store makes gardening easy and rewarding.",
            "section_1": {
                "title": "Choosing the Right Seeds for Your Garden",
                "description": "Selecting the right seeds is the first step toward successful gardening. Factors such as climate, soil type, sunlight, and growing space play an important role. At Gidan.store, we offer seeds that are suitable for Indian weather conditions and ideal for home gardens, balconies, and terraces."
            },
            "feature_cards": [
                {
                    "title": "Vegetable Seeds",
                    "description": "Vegetable seeds are perfect for growing fresh, healthy, and chemical-free vegetables at home. Whether you have a small balcony or a backyard garden, our vegetable seeds are suitable for various growing spaces. Common options include seeds for leafy greens, root vegetables, and seasonal vegetables that are easy to grow and maintain."
                },
                {
                    "title": "Flower Seeds",
                    "description": "Flower seeds add beauty, color, and freshness to your garden or home. From seasonal blooms to long-lasting flowering plants, our flower seeds are ideal for gardens, balconies, and pots. With proper care and sunlight, these seeds grow into vibrant flowers that enhance the overall appearance of your space."
                }
            ],
            "section_2": {
                "title": "Compare and Choose the Best Seeds Online",
                "description": "With a wide range of seeds available, choosing the right one becomes simple when you know your gardening goals. At Gidan.store, each seed product comes with essential growing information to help you achieve better results."
            },
            "cta_box": {
                "title": "Identify Your Growing Preference",
                "description": "Before buying seeds, consider whether you want to grow vegetables for daily use or flowers for decoration. Also think about the space, time, and care you can provide. Choosing the right seeds ensures a successful and enjoyable gardening experience."
            }
        },
        {
            "category": "pots",
            "page_title": "POTS",
            "subtitle": "Buy Plant Pots Online in India from Gidan.store",
            "intro_text": "Welcome to Gidan.store, your trusted online store for high-quality plant pots designed to enhance the beauty and health of your plants. Whether you are decorating your home, balcony, garden, or office, our wide range of plant pots combines durability, functionality, and modern design. From lightweight plastic pots to premium rotomolded planters and eco-friendly options, Gidan.store offers pots suitable for every plant and space.",
            "section_1": {
                "title": "Choosing the Right Pots for Your Plants",
                "description": "Selecting the right pot is essential for healthy plant growth. Factors such as size, drainage, material, and placement play an important role. At Gidan.store, we help you choose pots that match your plant type, indoor or outdoor usage, and décor preferences."
            },
            "feature_cards": [
                {
                    "title": "Rotomolded Pots",
                    "description": "Rotomolded pots are known for their premium finish, durability, and weather resistance. These pots are lightweight yet strong, making them ideal for both indoor and outdoor use. With their modern designs and long-lasting quality, rotomolded pots are perfect for enhancing gardens, balconies, and living spaces."
                },
                {
                    "title": "Plastic Pots",
                    "description": "Plastic pots are affordable, lightweight, and easy to maintain. They are suitable for everyday gardening needs and are available in various sizes, shapes, and colors. Plastic pots are ideal for beginners and are perfect for both indoor and outdoor plants."
                },
                {
                    "title": "Hanging Pots",
                    "description": "Hanging pots are a great way to save space while adding greenery to your home. Ideal for balconies, windows, and indoor corners, hanging pots are perfect for trailing and decorative plants."
                },
                {
                    "title": "Table Top Pots",
                    "description": "Table top pots are compact and decorative, making them ideal for desks, shelves, coffee tables, and workspaces. These pots are perfect for small indoor plants and succulents, adding a touch of greenery to your interiors."
                },
                {
                    "title": "Eco Planters",
                    "description": "Eco planters are made from sustainable and environmentally friendly materials. They are designed for eco-conscious gardeners who want to reduce their environmental impact while maintaining style and functionality."
                }
            ],
            "section_2": {
                "title": "Compare and Choose the Best Pots Online",
                "description": "With a wide range of pots available, choosing the right one becomes easy when you consider your plant size, placement, and décor needs. Gidan.store provides clear product details to help you select the most suitable pot for your plants."
            },
            "cta_box": {
                "title": "Identify Your Usage and Style Preference",
                "description": "Before purchasing, think about where you plan to place the pot and the type of plant you are growing. Indoor décor, outdoor durability, or eco-friendly choices—Gidan.store has options for every requirement."
            }
        },
        {
            "category": "plant-care",
            "page_title": "PLANT CARE",
            "subtitle": "Buy Plant Care Products Online in India from Gidan.store",
            "intro_text": "Welcome to Gidan.store, your trusted online store for essential plant care products that help your plants grow healthy and strong. Proper plant care is key to maintaining vibrant greenery, whether you are growing plants indoors, outdoors, or in a garden.",
            "section_1": {
                "title": "Choosing the Right Plant Care Products",
                "description": "Using the right plant care products ensures better growth, stronger roots, and long-lasting plants. Factors such as plant type, soil quality, watering needs, and environment play an important role."
            },
            "feature_cards": [
                {
                    "title": "Garden Essentials",
                    "description": "Garden essentials include the basic tools and products required for everyday plant maintenance. These products help with watering, pruning, feeding, and protecting plants."
                },
                {
                    "title": "Growing Media",
                    "description": "Growing media play a crucial role in plant health by providing proper aeration, drainage, and nutrients. At Gidan.store, you can find high-quality growing media suitable for different plants and purposes."
                }
            ],
            "section_2": {
                "title": "Compare and Choose the Best Plant Care Products Online",
                "description": "With a wide range of plant care products available, choosing the right ones becomes easier when you understand your plant requirements. Gidan.store provides clear product information to help you select the most effective solutions for your plants."
            },
            "cta_box": {
                "title": "Identify Your Plant Care Needs",
                "description": "Before purchasing, consider the type of plants you have and the level of care they require. Regular maintenance, soil improvement, or growth support—Gidan.store has plant care products to meet every need."
            }
        }
    ];

    const currentData = seoData.find(d => d.category === categorySlug?.toLowerCase());

    // If it's a subcategory page, show a simplified SEO block and RETURN
    if (isSubcategory) {
        // Try to find specific subcategory data by slug or matching title
        const subData = subcategoryData.find(s =>
            (subSlug && s.slug === subSlug.toLowerCase()) ||
            (subcategoryName && s.title.toLowerCase() === subcategoryName.toLowerCase())
        );

        if (subData) {
            return (
                <div className="bg-white py-12 px-4 md:px-16 font-sans text-gray-700 border-t border-gray-100">
                    <div className="container mx-auto max-w-full">
                        <div className="text-center mb-8">
                            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 uppercase tracking-tight">
                                {subData.title}
                            </h1>
                            <p className="text-xl text-green-600 font-medium mb-6">
                                {subData.subtitle}
                            </p>
                            <p className="leading-relaxed text-lg max-w-5xl mx-auto text-gray-600">
                                {subData.description}
                            </p>
                        </div>
                    </div>
                </div>
            );
        }

        // Fallback if specific data not found but it is a subcategory
        const displaySubName = subcategoryName ||
            (subSlug ? subSlug.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()) : '') ||
            (categorySlug ? categorySlug.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()) : '');

        return (
            <div className="bg-white py-12 px-4 md:px-16 font-sans text-gray-700 border-t border-gray-100">
                <div className="container mx-auto max-w-full">
                    <div className="text-center mb-8">
                        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 uppercase tracking-tight">
                            {displaySubName}
                        </h1>
                        <p className="text-xl text-green-600 font-medium">
                            Buy {displaySubName} Online in India from Gidan.store
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    if (!currentData) return null;

    return (
        <div className="bg-white py-12 px-4 md:px-16 font-sans text-gray-700">
            <div className="container mx-auto max-w-full">
                {/* Hero Section */}
                <div className="text-center mb-12">
                    <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">{currentData.page_title}</h1>
                    <p className="text-xl text-green-600 font-medium">{currentData.subtitle}</p>
                </div>

                {/* Intro Text */}
                <div className="mb-10 text-center max-w-5xl mx-auto">
                    <p className="leading-relaxed text-lg">{currentData.intro_text}</p>
                </div>

                {/* Section 1 */}
                <div className="mb-12">
                    <h2 className="text-2xl font-bold text-gray-800 mb-3 border-l-4 border-green-500 pl-4">{currentData.section_1.title}</h2>
                    <p className="leading-relaxed">{currentData.section_1.description}</p>
                </div>

                {/* Feature Cards Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                    {currentData.feature_cards.map((card, index) => (
                        <div key={index} className="bg-gray-50 p-6 rounded-xl border border-gray-100 hover:shadow-md transition-shadow">
                            <h3 className="text-xl font-bold text-green-700 mb-3">{card.title}</h3>
                            <p className="text-gray-600 leading-relaxed text-sm">{card.description}</p>
                        </div>
                    ))}
                </div>

                {/* Section 2 */}
                <div className="mb-12">
                    <h2 className="text-2xl font-bold text-gray-800 mb-3 border-l-4 border-green-500 pl-4">{currentData.section_2.title}</h2>
                    <p className="leading-relaxed">{currentData.section_2.description}</p>
                </div>

                {/* CTA Box */}
                <div className="bg-green-50 p-8 rounded-2xl border border-green-100">
                    <h2 className="text-2xl font-bold text-gray-900 mb-3">{currentData.cta_box.title}</h2>
                    <p className="leading-relaxed text-gray-800">{currentData.cta_box.description}</p>
                </div>
            </div>
        </div>
    );
};

export default CategoryStaticSEO;
