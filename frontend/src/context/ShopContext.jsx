import { createContext, useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

export const ShopContext = createContext();

const ShopContextProvider = (props) => {
  const currency = "$";
  const delivery_fee = 10;
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  const [search, setSearch] = useState("");
  const [showSearch, setShowSearch] = useState(false);

  // ❗ cart must be OBJECT, not array
  const [cartItems, setCartItems] = useState({});
  const [products, setProducts] = useState([]);
  const [token, setToken] = useState("");

  const navigate = useNavigate();

  /* ================= ADD TO CART ================= */
  const addToCart = async (itemId, size) => {
    if (!size) {
      toast.error("Select Product Size");
      return;
    }

    setCartItems((prev) => {
      const cartData = { ...prev };

      cartData[itemId] = cartData[itemId] || {};
      cartData[itemId][size] = (cartData[itemId][size] || 0) + 1;

      return cartData;
    });

    if (token) {
      try {
        await axios.post(
          `${backendUrl}/api/cart/add`,
          { itemId, size },
          { headers: { token } }
        );
      } catch (error) {
        console.error(error);
        toast.error(error.message);
      }
    }
  };

  /* ================= CART COUNT ================= */
  const getCartCount = () => {
    let totalCount = 0;

    for (const itemId in cartItems) {
      for (const size in cartItems[itemId]) {
        totalCount += cartItems[itemId][size];
      }
    }
    return totalCount;
  };

  /* ================= UPDATE QUANTITY ================= */
  const updateQuantity = async (itemId, size, quantity) => {
    setCartItems((prev) => {
      const cartData = { ...prev };

      if (!cartData[itemId]) return cartData;

      if (quantity <= 0) {
        delete cartData[itemId][size];
        if (Object.keys(cartData[itemId]).length === 0) {
          delete cartData[itemId];
        }
      } else {
        cartData[itemId][size] = quantity;
      }

      return cartData;
    });

    if (token) {
      try {
        await axios.post(
          `${backendUrl}/api/cart/update`,
          { itemId, size, quantity },
          { headers: { token } }
        );
      } catch (error) {
        console.error(error);
        toast.error(error.message);
      }
    }
  };

  /* ================= CART AMOUNT ================= */
  const getCartAmount = () => {
    let totalAmount = 0;

    for (const itemId in cartItems) {
      const product = products.find((p) => p._id === itemId);
      if (!product) continue;

      for (const size in cartItems[itemId]) {
        totalAmount += product.price * cartItems[itemId][size];
      }
    }
    return totalAmount;
  };

  /* ================= PRODUCTS ================= */
  const getProductsData = async () => {
    try {
      const res = await axios.get(`${backendUrl}/api/product/list`);
      if (res.data.success) {
        setProducts(res.data.products);
      }
    } catch (error) {
      console.error(error);
      toast.error(error.message);
    }
  };

  /* ================= USER CART ================= */
  const getUserCart = async (userToken) => {
    try {
      const res = await axios.post(
        `${backendUrl}/api/cart/get`,
        {},
        { headers: { token: userToken } }
      );
      if (res.data.success) {
        setCartItems(res.data.cartData || {});
      }
    } catch (error) {
      console.error(error);
      toast.error(error.message);
    }
  };

  /* ================= EFFECTS ================= */
  useEffect(() => {
    getProductsData();
  }, []);

  useEffect(() => {
    const localToken = localStorage.getItem("token");
    if (localToken) {
      setToken(localToken);
      getUserCart(localToken);
    }
  }, []);

  /* ================= CONTEXT VALUE ================= */
  const value = {
    products,
    currency,
    delivery_fee,
    search,
    setSearch,
    showSearch,
    setShowSearch,
    cartItems,
    setCartItems,
    addToCart,
    getCartCount,
    updateQuantity,
    getCartAmount,
    navigate,
    backendUrl,
    token,
    setToken,
    setProducts,
  };

  return (
    <ShopContext.Provider value={value}>
      {props.children}
    </ShopContext.Provider>
  );
};

export default ShopContextProvider;
