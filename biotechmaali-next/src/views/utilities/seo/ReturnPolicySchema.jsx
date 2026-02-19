export default function ReturnPolicySchema() {
    const schema = {
        "@context": "https://schema.org",
        "@graph": [
            {
                "@type": "WebPage",
                "@id": "https://gidan.store/return-policy/#webpage",
                "url": "https://gidan.store/return-policy/",
                "name": "Gidan Return & Replacement Policy"
            },
            {
                "@type": "MerchantReturnPolicy",
                "@id": "https://gidan.store/#returnpolicy",
                "name": "Gidan Return & Replacement Policy",
                "merchantReturnLink": "https://gidan.store/return-policy/",
                "applicableCountry": {
                    "@type": "Country",
                    "name": "IN"
                },
                "returnPolicyCategory": "https://schema.org/MerchantReturnFiniteReturnWindow",
                "merchantReturnDays": 1,
                "returnMethod": "https://schema.org/ReturnByMail",
                "returnFees": "https://schema.org/FreeReturn",
                "refundType": "https://schema.org/FullRefund",
                "inStoreReturnsOffered": false,
                "restockingFee": "https://schema.org/NoRestockingFee"
            }
        ]
    };

    return (
        <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
    );
}
