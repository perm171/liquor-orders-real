import { createClient } from "@/lib/supabaseClient";
import { notFound } from "next/navigation";
import NavBar from "@/components/NavBar";
import AddToCart from "@/components/AddToCartButton";

interface ProductPageProps {
  params: Promise<{ id: string }>;
}

// Star Rating Component
function StarRating({ rating, reviewsCount }: { rating: number; reviewsCount: number }) {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating - fullStars >= 0.5;

  return (
    <div className="flex items-center gap-2 mt-2">
      <div className="flex">
        {Array.from({ length: fullStars }).map((_, i) => (
          <span key={i} className="text-yellow-500 text-xl">★</span>
        ))}
        {hasHalfStar && <span className="text-yellow-500 text-xl">☆</span>}
        {Array.from({ length: 5 - fullStars - (hasHalfStar ? 1 : 0) }).map((_, i) => (
          <span key={`empty-${i}`} className="text-gray-300 text-xl">★</span>
        ))}
      </div>
      <span className="text-gray-600 text-sm">
        {rating.toFixed(1)} ({reviewsCount})
      </span>
    </div>
  );
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { id } = await params; // Await params before using

  const supabase = createClient();

  // Fetch main product
  const { data: product, error } = await supabase
    .from("products")
    .select(
      "id, name, brand, description, price, original_price, image_url, volume_ml, rating, reviews_count, stock_quantity, category, alcohol_percentage"
    )
    .eq("id", id.toString())
    .single();

  if (error || !product) {
    console.error(error);
    return notFound();
  }

  // Fetch product variants
  const { data: variants } = await supabase
    .from("product_variants")
    .select("id, volume_ml, price, original_price, stock_quantity")
    .eq("product_id", id);

  const hasDiscount =
    product.original_price && product.original_price > product.price;

  return (
    <>
      <NavBar />
      <main className="bg-gray-50 min-h-screen">
        <div className="max-w-6xl mx-auto px-6 py-12 grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* LEFT COLUMN - IMAGE */}
          <div className="flex justify-center items-start">
            <img
              src={product.image_url}
              alt={product.name}
              className="max-h-[550px] object-contain rounded-lg shadow-md"
            />
          </div>

          {/* RIGHT COLUMN - INFO */}
          <div className="space-y-8">
            {/* Title and Brand */}
            <div>
              <h1 className="text-4xl font-extrabold text-gray-900">
                {product.name}
              </h1>
              {product.brand && (
                <p className="text-lg text-gray-600 mt-1">by {product.brand}</p>
              )}

              {/* Star Rating */}
              {product.rating !== null && product.reviews_count !== null && (
                <StarRating
                  rating={product.rating}
                  reviewsCount={product.reviews_count}
                />
              )}
            </div>

            {/* Pricing */}
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                {hasDiscount && (
                  <span className="text-gray-400 line-through text-xl">
                    ${product.original_price?.toFixed(2)}
                  </span>
                )}
                <span className="text-red-700 text-3xl font-bold">
                  ${product.price.toFixed(2)}
                </span>
              </div>
              <p className="text-gray-600 text-lg">
                {product.description || "No description available."}
              </p>
              <p className="text-sm text-gray-500">
                Size: {product.volume_ml} ml • In Stock: {product.stock_quantity}
              </p>
            </div>

            {/* Add to Cart with Variants */}
            <div className="border-t pt-6">
              <AddToCart productId={product.id} variants={variants || []} />
            </div>

            {/* Extra Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 pt-8 border-t">
              {/* Description */}
              <div>
                <h2 className="text-2xl font-semibold mb-4 text-gray-800">
                  Product Description
                </h2>
                <p className="text-gray-700 leading-relaxed">
                  {product.description || product.name}
                </p>
              </div>

              {/* Product Details */}
              <div>
                <h2 className="text-2xl font-semibold mb-4 text-gray-800">
                  Product Details
                </h2>
                <table className="w-full text-base text-gray-700 border border-gray-200">
                  <tbody>
                    {product.category && (
                      <tr className="even:bg-gray-100">
                        <td className="py-3 px-3 font-medium w-32">Type</td>
                        <td className="py-3 px-3 capitalize">
                          {product.category}
                        </td>
                      </tr>
                    )}
                    {product.alcohol_percentage && (
                      <>
                        <tr className="even:bg-gray-100">
                          <td className="py-3 px-3 font-medium">Proof</td>
                          <td className="py-3 px-3">
                            {(product.alcohol_percentage * 2).toFixed(0)}
                          </td>
                        </tr>
                        <tr className="even:bg-gray-100">
                          <td className="py-3 px-3 font-medium">Alcohol %</td>
                          <td className="py-3 px-3">
                            {product.alcohol_percentage.toFixed(2)}%
                          </td>
                        </tr>
                      </>
                    )}
                    {product.brand && (
                      <tr className="even:bg-gray-100">
                        <td className="py-3 px-3 font-medium">Brand</td>
                        <td className="py-3 px-3">{product.brand}</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
