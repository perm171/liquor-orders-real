import ProductCard from "@/components/ProductCard";
import { createClient } from "@/lib/supabaseClient";
import NavBar from "@/components/NavBar";

export default async function HomePage() {
  const supabase = createClient();

  // Fetch products
  const { data: products, error: productsError } = await supabase
    .from("products")
    .select(
      "id, name, price, original_price, image_url, volume_ml, rating, category"
    )
    .order("category", { ascending: true });

  if (productsError) {
    console.error(productsError);
    return <div>Error loading products.</div>;
  }

  // Fetch categories (banner images)
  const { data: categoriesData, error: categoriesError } = await supabase
    .from("categories")
    .select("name, banner_url");

  if (categoriesError) {
    console.error(categoriesError);
  }

  // Map category -> banner_url
  const bannerImages: Record<string, string> = {};
  categoriesData?.forEach((c) => {
    if (c.banner_url) {
      bannerImages[c.name.toLowerCase()] = c.banner_url;
    }
  });

  // Group products by category
  const grouped: Record<string, typeof products> = {};
  products?.forEach((p) => {
    if (!grouped[p.category]) grouped[p.category] = [];
    grouped[p.category].push(p);
  });

  return (
    <>
      <NavBar />
      <main className="bg-gradient-to-b from-gray-50 to-gray-100 min-h-screen">
        <div className="max-w-7xl mx-auto px-6 py-12 space-y-16">
          {Object.entries(grouped).map(([category, items]) => {
            const categoryKey = category.toLowerCase().trim();
            const bannerUrl = bannerImages[categoryKey];

            return (
              <section key={category} id={category} className="scroll-mt-20">
                {/* Banner */}
                {bannerUrl && (
                  <div className="relative h-48 md:h-64 mb-8 rounded-xl overflow-hidden">
                    <img
                      src={bannerUrl}
                      alt={`${category} banner`}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                      <h2
                        className="text-4xl font-extrabold text-white capitalize"
                        style={{
                          fontFamily: "'Playfair Display', serif",
                        }}
                      >
                        {category}
                      </h2>
                    </div>
                  </div>
                )}

                {/* Product grid */}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8">
                  {items.map((p) => (
                    <div
                      key={p.id}
                      className="transition-transform transform hover:-translate-y-1 hover:shadow-2xl rounded-xl bg-white shadow-lg"
                    >
                      <ProductCard
                        id={p.id}
                        name={p.name}
                        price={Number(p.price)}
                        original_price={
                          p.original_price ? Number(p.original_price) : null
                        }
                        image_url={p.image_url}
                        volume_ml={p.volume_ml}
                        rating={p.rating}
                      />
                    </div>
                  ))}
                </div>
              </section>
            );
          })}
        </div>
      </main>
    </>
  );
}
