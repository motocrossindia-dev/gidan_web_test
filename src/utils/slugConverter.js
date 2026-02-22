'use client';

// slugConverter.js
import slugify from 'slugify';

const convertToSlug = (text) => {
    if (!text) return ""; // Safety check if text is empty or null

    return slugify(text, {
        replacement: '-',    // replace spaces with '-'
        remove: /[*+~.()'"!:@]/g, // regex to remove specific unwanted characters
        lower: true,         // result in lower case
        strict: false,       // strip special characters except replacement, set to true for stricter removal
        locale: 'vi',       // language code of your locale (optional, helps with accents)
        trim: true           // trim leading and trailing replacement chars
    });
};

export default convertToSlug;