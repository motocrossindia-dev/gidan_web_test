/**
 * Static fallback category SEO content.
 * Used when the backend API does not return category_info for a category.
 * Key = category slug (matches URL, e.g. /plants → "plants").
 */
const staticCategoryData = {
    plants: {
        hero: {
            title: "PLANTS",
            subtitle: "Buy Plants Online in India from Gidan.store",
            containerClass: "text-center mb-12",
            titleClass: "text-3xl md:text-4xl font-bold text-gray-800 mb-2",
            subtitleClass: "text-xl md:text-2xl text-[#375421] font-medium"
        },
        sections: [
            {
                id: 1,
                type: "intro",
                content: "Welcome to Gidan.store, your one-stop online destination for buying healthy and premium quality plants in India. Whether you want to beautify your home, create a refreshing garden, or add natural charm to your surroundings, our wide range of plants makes it easy to bring greenery into your life. From indoor plants to outdoor and flowering plants, we offer carefully nurtured varieties suitable for Indian homes and climates.",
                containerClass: "mb-10 leading-relaxed text-lg"
            },
            {
                id: 2,
                type: "grid_section",
                title: "Choosing Plants Based on Your Space and Lifestyle",
                description: "Selecting the right plants depends on factors such as available space, sunlight, maintenance level, and purpose. At Gidan.store, we help you choose plants that suit your indoor spaces, balconies, terraces, and gardens. Our collection is ideal for both beginners and experienced plant lovers.",
                containerClass: "mb-10",
                titleClass: "text-2xl font-bold text-gray-800 mb-4 border-l-4 border-[#375421] pl-3",
                gridConfig: {
                    cols: "grid grid-cols-1 md:grid-cols-3 gap-6 mt-6",
                    cardClass: "bg-site-bg p-6 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow",
                    titleClass: "text-xl font-bold text-gray-800 mb-2 text-[#375421]",
                    textClass: "text-sm leading-relaxed"
                },
                items: [
                    {
                        title: "Indoor Plants",
                        content: "Indoor plants are perfect for homes and offices as they enhance interior décor and promote a healthier environment. These plants thrive in low to moderate light and require minimal care. Popular indoor plants include Money Plant, Snake Plant, Peace Lily, Areca Palm, and ZZ Plant."
                    },
                    {
                        title: "Outdoor Plants",
                        content: "Outdoor plants are suitable for gardens, balconies, terraces, and open spaces. They add freshness, natural beauty, and greenery to your surroundings. At Gidan.store, you can explore a wide range of outdoor plants including decorative plants, shrubs, and garden greens."
                    },
                    {
                        title: "Flowering Plants",
                        content: "Flowering plants bring color, fragrance, and vibrancy to any space. Whether planted in gardens, balconies, or pots, flowering plants create a lively and cheerful environment. Our collection includes seasonal and perennial flowering plants."
                    }
                ]
            },
            {
                id: 3,
                type: "text_section",
                title: "Compare and Choose the Best Plants Online",
                content: "With a wide variety of plants available, choosing the right one can be simple when you know your requirements. At Gidan.store, each plant comes with basic care information to help you make the right decision and ensure healthy growth.",
                containerClass: "mb-10",
                titleClass: "text-2xl font-bold text-gray-800 mb-4 border-l-4 border-[#375421] pl-3"
            },
            {
                id: 4,
                type: "highlight_box",
                title: "Identify Your Plant Care Preference",
                content: "Before purchasing, consider how much time you can dedicate to plant care. If you prefer low-maintenance options, indoor plants are a great choice. If you enjoy gardening and outdoor maintenance, outdoor and flowering plants can be a rewarding experience.",
                containerClass: "bg-green-50 p-6 rounded-lg border border-green-100",
                titleClass: "text-2xl font-bold text-gray-800 mb-4"
            }
        ]
    }
};

export default staticCategoryData;
