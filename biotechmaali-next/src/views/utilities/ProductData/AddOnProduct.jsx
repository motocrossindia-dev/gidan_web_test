'use client';

import React from "react";
import AddOnData from "../../utilities/ProductData/AddOnData";

const AddOnProduct = ({ addOnData }) => {
  return (
    <div className="flex justify-center w-full rounded-md mt-4">
      <div className="w-full">
        <h2 className="md:text-2xl text-xl mb-4 text-center md:font-bold font-semibold">Plant Parents Also Picked</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 justify-items-center font-sans">
          {addOnData.map((product, index) => (
            <AddOnData
              key={index}
              name={product.name}
              price={Math.round(product.selling_price)}
              oldPrice={Math.round(product.mrp)}
              imageUrl={product.image}
              rating={product.rating}
              isNewArrival={product.isNewArrival}
              product={product}
              inCart = {product.is_cart}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default AddOnProduct;
