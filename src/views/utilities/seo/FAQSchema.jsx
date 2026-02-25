import React from 'react';

const FAQSchema = () => {
    const schema = {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": [
            {
                "@type": "Question",
                "name": "How are the plants packaged for shipping?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "We use eco-friendly, sturdy packaging designed to keep your plant safe and secure during transit. Each plant is carefully wrapped and supported to prevent movement or damage."
                }
            },
            {
                "@type": "Question",
                "name": "Will my plant look exactly like the picture?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "While we do our best to match the product image, each plant is unique. Variations in size, shape, and color are natural. Rest assured, you’ll receive a healthy plant of the same species."
                }
            },
            {
                "@type": "Question",
                "name": "What if my plant arrives damaged?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "If your plant arrives damaged, please contact us within 24 hours with photos of the package and plant. We’ll evaluate the issue and offer a replacement or refund as appropriate."
                }
            },
            {
                "@type": "Question",
                "name": "How do I care for my plant once it arrives?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Each plant comes with a basic care guide. You’ll also find detailed care instructions on our website under the product page. If you need help, feel free to reach out to our support team."
                }
            },
            {
                "@type": "Question",
                "name": "Do you ship all over India?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Yes, we ship to most pin codes across India. However, delivery might not be possible in remote locations due to courier limitations. If you're unsure, contact us to confirm service availability."
                }
            },
            {
                "@type": "Question",
                "name": "Can I cancel or modify my order?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Orders can be canceled or modified only before they are shipped. Please contact us immediately if you need to make changes. Once dispatched, modifications aren’t possible."
                }
            },
            {
                "@type": "Question",
                "name": "What types of plants do you sell?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "We offer a wide variety of indoor plants, outdoor plants, succulents, flowering plants, and air-purifying plants. Each product listing includes details about ideal conditions and maintenance."
                }
            },
            {
                "@type": "Question",
                "name": "Can I gift plants to someone?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Absolutely! During checkout, you can mark your order as a gift and include a personalized message. We’ll ensure your gift is packed beautifully and delivered on time."
                }
            }
        ]
    };

    return (
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
    );
};

export default FAQSchema;
