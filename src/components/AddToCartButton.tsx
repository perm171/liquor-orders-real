"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabaseClient";
import { getSessionId } from "@/lib/sessionID";

interface AddToCartButtonProps {
  productId: string;
  variants: {
    id: string;
    volume_ml: number;
    price: number;
    original_price?: number;
    stock_quantity: number;
  }[];
}

export default function AddToCartButton({
  productId,
  variants,
}: AddToCartButtonProps) {
  const supabase = createClient();
  const [selectedVariantId, setSelectedVariantId] = useState(
    variants.length > 0 ? variants[0].id : ""
  );
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(false);

  const selectedVariant = variants.find((v) => v.id === selectedVariantId);

  const addToCart = async () => {
    if (!selectedVariantId) return;
    setLoading(true);

    const { error } = await supabase.from("cart_items").insert([
      {
        product_id: productId,
        product_variant_id: selectedVariantId,
        size: selectedVariant?.volume_ml
          ? `${selectedVariant.volume_ml}ml`
          : "",
        quantity,
        session_id: getSessionId(),
      },
    ]);

    if (error) {
      console.error("Error adding to cart:", error);
    } else {
      window.location.href = "/cart";
    }
    setLoading(false);
  };

  return (
    <div className="space-y-4 mt-6">
      {/* Variant selector */}
      <div>
        <h3 className="font-semibold text-lg mb-2">Size</h3>
        <div className="flex gap-2">
          {variants.map((variant) => (
            <button
              key={variant.id}
              onClick={() => setSelectedVariantId(variant.id)}
              className={`px-4 py-2 rounded border ${
                selectedVariantId === variant.id
                  ? "bg-red-700 text-white"
                  : "bg-gray-100 text-gray-800"
              }`}
            >
              {variant.volume_ml >= 1000
                ? `${variant.volume_ml / 1000} L`
                : `${variant.volume_ml} ML`}
            </button>
          ))}
        </div>
      </div>

      {/* Price */}
      {selectedVariant && (
        <div>
          {selectedVariant.original_price && (
            <p className="line-through text-gray-500">
              Retail Price: ${selectedVariant.original_price.toFixed(2)}
            </p>
          )}
          <p className="text-xl font-bold text-red-700">
            Your Price: ${selectedVariant.price.toFixed(2)}
          </p>
        </div>
      )}

      {/* Quantity and Add button */}
      <div>
        <label className="block mb-1 font-semibold">Quantity</label>
        <select
          className="border px-3 py-2 rounded mr-4"
          value={quantity}
          onChange={(e) => setQuantity(parseInt(e.target.value))}
        >
          {Array.from({ length: 10 }, (_, i) => i + 1).map((q) => (
            <option key={q} value={q}>
              {q}
            </option>
          ))}
        </select>

        <button
          onClick={addToCart}
          disabled={loading}
          className="bg-red-700 text-white px-6 py-2 rounded hover:bg-red-800"
        >
          {loading ? "Adding..." : "Add to Cart"}
        </button>
      </div>
    </div>
  );
}
