import { useEffect, useState } from "react";
import { VscError } from "react-icons/vsc";
import CartItem from "../components/cart-item";
import { Link } from "react-router-dom";

const Cart = () => {
  const cartItems = [
    {
      productId: "ajjaj",
      photo:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR6o9u0mE0VmkXjNoyIyc69Hmzui7wTmA_rlw&usqp=CAU",
      name: "Macbook",
      price: 3000,
      stock: 20,
      quantity: 4,
    },
    {
      productId: "hjhjh",
      photo:
        "https://bestcorporategiftsmumbai.com/uploads/products/1601374200_A5557F~1.JPG",
      name: "Notebook",
      price: 78,
      stock: 2,
      quantity: 2,
    },
  ];
  const subtotal = 4000;
  const tax = Math.round(subtotal * 0.18);
  const shippingCharges = 200;
  const total = subtotal + tax + shippingCharges;
  const discount = 400;
  const [couponCode, setCouponCode] = useState<string>();
  const [isValidCouponCode, setIsValidCouponCode] = useState<boolean>(false);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (Math.random() > 0.5) setIsValidCouponCode(true);
      else setIsValidCouponCode(false);
    }, 1000);

    return () => {
      clearTimeout(timeoutId);
      setIsValidCouponCode(false);
    };
  }, [couponCode]);

  return (
    <div className="cart">
      <main>
        {cartItems.length > 0 ? (
          cartItems.map((i, idx) => <CartItem key={idx} cartItem={i} />)
        ) : (
          <h1>No Items added</h1>
        )}
      </main>
      <aside>
        <p>Subtotal : {subtotal} </p>
        <p>Shipping Charges : {shippingCharges} </p>
        <p>Tax : {tax} </p>
        <p>
          Discount : <em className="red">{discount}</em>
        </p>
        <p>
          <b>Total </b>: {total}
        </p>
        <input
          type="text"
          value={couponCode}
          onChange={(e) => setCouponCode(e.target.value)}
          placeholder="Coupon Code"
        />
        {couponCode &&
          (isValidCouponCode ? (
            <span className="green">
              {discount} off using the <code>{couponCode}</code>
            </span>
          ) : (
            <span className="red">
              Invalid Coupon code <VscError />
            </span>
          ))}
        {cartItems.length > 0 && <Link to="/shipping">Checkout</Link>}
      </aside>
    </div>
  );
};

export default Cart;
