"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabaseClient";
import NavBar from "@/components/NavBar";
import { getSessionId } from "@/lib/sessionID";

interface CartItemRow {
  id: string;
  product_id: string;
  product_variant_id: string;
  quantity: number;
  products: {
    id: string;
    name: string;
    brand: string;
    image_url: string;
  };
  product_variants: {
    id: string;
    volume_ml: number;
    price: number;
    original_price?: number;
    stock_quantity: number;
  };
}

export default function CartPage() {
  const supabase = createClient();
  const [cart, setCart] = useState<CartItemRow[]>([]);
  const [loading, setLoading] = useState(true);

  async function fetchCart() {
    setLoading(true);
    const sessionId = getSessionId();

    const { data, error } = await supabase
      .from("cart_items")
      .select(
        `
        id,
        quantity,
        session_id,
        product_id,
        product_variant_id,
        products ( id, name, brand, image_url ),
        product_variants ( id, volume_ml, price, original_price, stock_quantity )
      `
      )
      .eq("session_id", sessionId);

    if (error) {
      console.error("Error fetching cart:", error);
      setLoading(false);
      return;
    }

    // Map joined arrays to single objects as expected by CartItemRow
    setCart(
      (data || []).map((item) => ({
        ...item,
        products: Array.isArray(item.products) ? item.products[0] : item.products,
        product_variants: Array.isArray(item.product_variants) ? item.product_variants[0] : item.product_variants,
      }))
    );
    setLoading(false);
  }

  useEffect(() => {
    fetchCart();
  }, []);

  async function updateQuantity(itemId: string, quantity: number) {
    setLoading(true);
    const { error } = await supabase
      .from("cart_items")
      .update({ quantity })
      .eq("id", itemId);
    if (error) {
      console.error("Error updating quantity:", error);
      setLoading(false);
      return;
    }

    await fetchCart();
    setLoading(false);
  }

  async function removeItem(itemId: string) {
    setLoading(true);
    const { error } = await supabase.from("cart_items").delete().eq("id", itemId);
    if (error) {
      console.error("Error removing item:", error);
      setLoading(false);
      return;
    }

    await fetchCart();
    setLoading(false);
  }

  const total = cart.reduce((sum, item) => {
    const price = item.product_variants?.price || 0;
    return sum + price * (item.quantity || 1);
  }, 0);

  return (
    <>
      <NavBar />
      <main className="bg-gray-50 min-h-screen">
        <div className="max-w-6xl mx-auto px-6 py-10">
          <h1 className="text-4xl font-bold mb-10 text-gray-900">Your Cart</h1>

          {loading ? (
            <p className="text-lg">Loading...</p>
          ) : cart.length === 0 ? (
            <p className="text-gray-600 text-xl">Your cart is empty.</p>
          ) : (
            <div className="space-y-10">
              {cart.map((item) => {
                const product = item.products;
                const variant = item.product_variants;
                const linePrice =
                  (variant?.price || 0) * (item.quantity || 1);

                return (
                  <div
                    key={item.id}
                    className="grid grid-cols-1 md:grid-cols-12 gap-6 border-b pb-8"
                  >
                    <div className="md:col-span-3 flex justify-center">
                      {product && (
                        <img
                          src={product.image_url}
                          alt={product.name}
                          className="w-36 h-36 object-contain rounded bg-white shadow"
                        />
                      )}
                    </div>

                    <div className="md:col-span-9 flex flex-col justify-between">
                      <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4">
                        <div>
                          <h2 className="text-2xl font-semibold text-gray-900">
                            {product?.name || "Unknown Product"}
                          </h2>
                          <p className="text-lg text-gray-700">
                            {product?.brand}
                          </p>
                          {variant && (
                            <p className="text-gray-500 text-base">
                              {variant.volume_ml} ml
                            </p>
                          )}
                        </div>

                        <div className="flex flex-col items-start md:items-end gap-2">
                          <div className="flex items-center gap-4">
                            <label className="text-lg text-gray-700">
                              Quantity:
                            </label>
                            <select
                              className="border rounded px-3 py-2 text-lg"
                              value={item.quantity}
                              onChange={(e) =>
                                updateQuantity(item.id, parseInt(e.target.value))
                              }
                            >
                              {Array.from({ length: 10 }, (_, i) => i + 1).map((q) => (
                                <option key={q} value={q}>
                                  {q}
                                </option>
                              ))}
                            </select>

                            <button
                              onClick={() => removeItem(item.id)}
                              className="text-lg text-red-600 hover:underline"
                            >
                              Remove
                            </button>
                          </div>

                          {variant && (
                            <div className="text-right">
                              <p className="text-lg text-gray-800">
                                ${variant.price.toFixed(2)} × {item.quantity}
                              </p>
                              <p className="text-2xl font-bold text-gray-900">
                                = ${linePrice.toFixed(2)}
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}

              <div className="flex justify-between items-center mt-10">
                <p className="text-3xl font-bold text-gray-900">
                  Total: ${total.toFixed(2)}
                </p>
                <button className="bg-red-700 text-white px-8 py-4 rounded-lg text-xl font-semibold hover:bg-red-800 transition">
                  Proceed to Checkout
                </button>
              </div>
            </div>
          )}
        </div>
      </main>
    </>
  );
}
