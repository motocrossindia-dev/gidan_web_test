import React from 'react';

const ShopBySection = () => {
  const categories = [
    { title: "Bonsai Trees", image: "https://via.placeholder.com/150" },
    { title: "Indoor Plants", image: "https://via.placeholder.com/150" },
    { title: "Desk Plants", image: "https://via.placeholder.com/150" },
    { title: "Plant Accessories", image: "https://via.placeholder.com/150" },
  ];

  return (
    <div className="my-8">
      <h2 className="text-xl font-bold mb-4">Shop By</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {categories.map((category, index) => (
          <div key={index} className="text-center">
            <img name=" "   
              src={category.image}
              loading="lazy"
              alt={category.title}
              className="w-full h-32 object-cover mb-2"
            />
            <p className="text-sm font-medium">{category.title}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ShopBySection;
