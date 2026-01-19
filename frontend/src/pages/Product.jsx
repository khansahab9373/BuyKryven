import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { ShopContext } from "../context/ShopContext";
import { assets } from "../assets/assets";
import RelatedProducts from "../components/RelatedProducts";
import { toast } from "react-toastify";

const Product = () => {
  const { productId } = useParams();
  const { products, currency, addToCart } = useContext(ShopContext);

  const [productData, setProductData] = useState(null);
  const [image, setImage] = useState("");
  const [size, setSize] = useState("");

  // Fetch product
  useEffect(() => {
    if (products && products.length > 0) {
      const product = products.find((item) => item._id === productId);
      if (product) {
        setProductData(product);
        setImage(product.images?.[0] || "");
        if (product.sizes?.length > 0) {
          setSize(product.sizes[0]); // auto-select first size
        }
      }
    }
  }, [productId, products]);

  // Add to cart handler
  const handleAddToCart = () => {
    if (!size) {
      toast.error("Please select a size");
      return;
    }
    addToCart(productData._id, size);
    toast.success("Added to cart");
  };

  if (!productData) return <div className="opacity-0"></div>;

  return (
    <div className="border-t-2 pt-10 transition-opacity duration-500 opacity-100">
      {/* Product Section */}
      <div className="flex flex-col sm:flex-row gap-12">
        {/* Images */}
        <div className="flex-1 flex flex-col sm:flex-row gap-3">
          {/* Thumbnails */}
          <div className="flex sm:flex-col gap-2 sm:w-[20%] w-full overflow-x-auto">
            {productData.images?.map((item, index) => (
              <img
                key={index}
                src={item}
                alt={`thumb-${index}`}
                onClick={() => setImage(item)}
                className={`w-24 h-24 object-cover cursor-pointer border ${
                  image === item ? "border-orange-500" : "border-gray-200"
                }`}
              />
            ))}
          </div>

          {/* Main image */}
          <div className="w-full sm:w-[80%]">
            <img
              src={image}
              alt="product"
              className="w-full h-auto border border-gray-200"
            />
          </div>
        </div>

        {/* Product Details */}
        <div className="flex-1">
          <h1 className="font-medium text-2xl mt-2">{productData.name}</h1>

          <div className="flex items-center gap-1 mt-2">
            <img src={assets.star_icon} className="w-3.5" />
            <img src={assets.star_icon} className="w-3.5" />
            <img src={assets.star_icon} className="w-3.5" />
            <img src={assets.star_icon} className="w-3.5" />
            <img src={assets.star_dull_icon} className="w-3.5" />
            <p className="pl-2">122</p>
          </div>

          <p className="mt-5 text-3xl font-medium">
            {currency}
            {productData.price}
          </p>

          <p className="mt-5 text-gray-500">{productData.description}</p>

          {/* Sizes */}
          {productData.sizes?.length > 0 && (
            <div className="flex flex-col gap-4 my-8">
              <p>Select Size</p>
              <div className="flex gap-2">
                {productData.sizes.map((item, index) => (
                  <button
                    key={index}
                    onClick={() => setSize(item)}
                    className={`py-2 px-4 border ${
                      size === item
                        ? "border-orange-500 bg-orange-50"
                        : "bg-gray-100"
                    }`}
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>
          )}

          <button
            onClick={handleAddToCart}
            className="bg-black text-white px-8 py-3 text-sm active:bg-gray-700"
          >
            ADD TO CART
          </button>

          <hr className="mt-8 sm:w-4/5" />

          <div className="text-sm text-gray-500 mt-5 flex flex-col gap-1">
            <p>100% Original product.</p>
            <p>Cash on delivery is available.</p>
            <p>Easy return & exchange within 7 days.</p>
          </div>
        </div>
      </div>

      {/* Description */}
      <div className="mt-20">
        <div className="flex">
          <b className="border px-5 py-3 text-sm">Description</b>
          <p className="border px-5 py-3 text-sm">Reviews (122)</p>
        </div>

        <div className="flex flex-col gap-4 border px-6 py-6 text-sm text-gray-500">
          <p>
            This product is crafted with premium quality materials to ensure
            durability, comfort, and modern style for everyday use.
          </p>
          <p>
            Designed for versatility, it fits perfectly into both casual and
            semi-formal wardrobes.
          </p>
        </div>
      </div>

      {/* Related Products */}
      <RelatedProducts
        category={productData.category}
        subCategory={productData.subCategory}
      />
    </div>
  );
};

export default Product;
