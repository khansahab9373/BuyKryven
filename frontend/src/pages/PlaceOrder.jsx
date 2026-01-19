import React, { useContext, useState } from "react";
import Title from "../components/Title";
import CartTotal from "../components/CartTotal";
import { assets } from "../assets/assets";
import { ShopContext } from "../context/ShopContext";
import { toast } from "react-toastify";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const PlaceOrder = () => {
  const navigate = useNavigate();
  const {
    backendUrl,
    token,
    cartItems,
    setCartItems,
    getCartAmount,
    delivery_fee,
    products,
  } = useContext(ShopContext);

  const [method, setMethod] = useState("cod");

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    street: "",
    city: "",
    state: "",
    zipcode: "",
    country: "",
    phone: "",
  });

  const onChangeHandler = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const onSubmitHandler = async (e) => {
    e.preventDefault();

    try {
      if (!products || products.length === 0) {
        toast.error("Products not loaded yet");
        return;
      }

      // 🛒 Build order items safely
      const orderItems = [];

      Object.keys(cartItems).forEach((itemId) => {
        Object.keys(cartItems[itemId]).forEach((size) => {
          const qty = cartItems[itemId][size];
          if (qty > 0) {
            const product = products.find((p) => p._id === itemId);
            if (!product) return;

            orderItems.push({
              ...product,
              size,
              quantity: qty,
            });
          }
        });
      });

      if (orderItems.length === 0) {
        toast.error("Cart is empty");
        return;
      }

      const orderData = {
        address: formData,
        items: orderItems,
        amount: getCartAmount() + delivery_fee, // backend should re-calculate
      };

      const API = backendUrl.replace(/\/$/, "");

      switch (method) {
        case "cod": {
          const res = await axios.post(
            `${API}/api/order/place`,
            orderData,
            { headers: { token } }
          );

          if (res.data.success) {
            setCartItems({});
            toast.success("Order placed successfully");
            navigate("/orders");
          } else {
            toast.error(res.data.message || "Order failed");
          }
          break;
        }

        case "stripe":
        case "razorpay":
          toast.info("Online payment coming soon");
          break;

        default:
          toast.error("Invalid payment method");
      }
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Order failed");
    }
  };

  return (
    <form
      onSubmit={onSubmitHandler}
      className="flex flex-col sm:flex-row justify-between gap-4 pt-5 sm:pt-14 min-h-[80vh] border-t"
    >
      {/* LEFT */}
      <div className="flex flex-col gap-4 w-full sm:max-w-[480px]">
        <div className="text-xl sm:text-2xl my-3">
          <Title text1="DELIVERY" text2="INFORMATION" />
        </div>

        <div className="flex gap-3">
          <input
            required
            name="firstName"
            value={formData.firstName}
            onChange={onChangeHandler}
            className="border rounded py-1.5 px-3.5 w-full"
            placeholder="First name"
          />
          <input
            required
            name="lastName"
            value={formData.lastName}
            onChange={onChangeHandler}
            className="border rounded py-1.5 px-3.5 w-full"
            placeholder="Last name"
          />
        </div>

        <input
          required
          type="email"
          name="email"
          value={formData.email}
          onChange={onChangeHandler}
          className="border rounded py-1.5 px-3.5 w-full"
          placeholder="Email address"
        />

        <input
          required
          name="street"
          value={formData.street}
          onChange={onChangeHandler}
          className="border rounded py-1.5 px-3.5 w-full"
          placeholder="Street"
        />

        <div className="flex gap-3">
          <input
            required
            name="city"
            value={formData.city}
            onChange={onChangeHandler}
            className="border rounded py-1.5 px-3.5 w-full"
            placeholder="City"
          />
          <input
            required
            name="state"
            value={formData.state}
            onChange={onChangeHandler}
            className="border rounded py-1.5 px-3.5 w-full"
            placeholder="State"
          />
        </div>

        <div className="flex gap-3">
          <input
            required
            type="text"
            name="zipcode"
            value={formData.zipcode}
            onChange={onChangeHandler}
            className="border rounded py-1.5 px-3.5 w-full"
            placeholder="Zipcode"
          />
          <input
            required
            name="country"
            value={formData.country}
            onChange={onChangeHandler}
            className="border rounded py-1.5 px-3.5 w-full"
            placeholder="Country"
          />
        </div>

        <input
          required
          type="text"
          name="phone"
          value={formData.phone}
          onChange={onChangeHandler}
          className="border rounded py-1.5 px-3.5 w-full"
          placeholder="Phone"
        />
      </div>

      {/* RIGHT */}
      <div className="mt-8">
        <div className="mt-8 min-w-80">
          <CartTotal />
        </div>

        <div className="mt-12">
          <Title text1="PAYMENT" text2="METHOD" />

          <div className="flex gap-3 flex-col lg:flex-row">
            <div
              onClick={() => setMethod("stripe")}
              className="flex items-center gap-3 border p-2 px-3 cursor-pointer"
            >
              <p className={`min-w-3.5 h-3.5 border rounded-full ${method === "stripe" ? "bg-green-400" : ""}`} />
              <img className="h-5 mx-4" src={assets.stripe_logo} alt="Stripe" />
            </div>

            <div
              onClick={() => setMethod("razorpay")}
              className="flex items-center gap-3 border p-2 px-3 cursor-pointer"
            >
              <p className={`min-w-3.5 h-3.5 border rounded-full ${method === "razorpay" ? "bg-green-400" : ""}`} />
              <img className="h-5 mx-4" src={assets.razorpay_logo} alt="Razorpay" />
            </div>

            <div
              onClick={() => setMethod("cod")}
              className="flex items-center gap-3 border p-2 px-3 cursor-pointer"
            >
              <p className={`min-w-3.5 h-3.5 border rounded-full ${method === "cod" ? "bg-green-400" : ""}`} />
              <p className="text-gray-500 text-sm font-medium mx-4">
                CASH ON DELIVERY
              </p>
            </div>
          </div>

          <div className="w-full text-end mt-8">
            <button type="submit" className="bg-black text-white px-16 py-3 text-sm">
              PLACE ORDER
            </button>
          </div>
        </div>
      </div>
    </form>
  );
};

export default PlaceOrder;
