"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabaseClient";

export default function AdminDashboard() {
  const router = useRouter();
  const supabase = createClient();
  const [loading, setLoading] = useState(true);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [form, setForm] = useState({
    name: "",
    brand: "",
    category: "",
    description: "",
    image_url: "",
    alcohol_percentage: "",
    volume_ml: "",
    price: "",
    original_price: "",
    stock_quantity: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("");

  // Check session on mount
  useEffect(() => {
    const checkSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        router.replace("/admin/login");
      } else {
        setUserEmail(session.user.email ?? null);
        setLoading(false);
      }
    };
    checkSession();
  }, [supabase, router]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/admin/login");
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setMessage("");

    try {
      // Insert product
      const { data: productData, error: productError } = await supabase
        .from("products")
        .insert([
          {
            name: form.name,
            brand: form.brand,
            category: form.category,
            description: form.description,
            image_url: form.image_url,
            alcohol_percentage: parseFloat(form.alcohol_percentage),
          },
        ])
        .select()
        .single();

      if (productError) throw productError;

      // Insert variant
      const { error: variantError } = await supabase
        .from("product_variants")
        .insert([
          {
            product_id: productData.id,
            volume_ml: parseInt(form.volume_ml),
            price: parseFloat(form.price),
            original_price: form.original_price
              ? parseFloat(form.original_price)
              : null,
            stock_quantity: parseInt(form.stock_quantity),
          },
        ]);

      if (variantError) throw variantError;

      setMessage("✅ Product added successfully!");
      setForm({
        name: "",
        brand: "",
        category: "",
        description: "",
        image_url: "",
        alcohol_percentage: "",
        volume_ml: "",
        price: "",
        original_price: "",
        stock_quantity: "",
      });
    } catch (err: any) {
      setMessage("❌ Error adding product: " + err.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600 text-lg font-medium">
          Loading dashboard...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow p-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <button
            onClick={handleLogout}
            className="px-5 py-2 bg-black text-white rounded hover:bg-gray-800 transition font-medium"
          >
            Logout
          </button>
        </div>

        <p className="text-gray-700 mb-8 text-lg">
          Welcome {userEmail ? `(${userEmail})` : ""}!
        </p>

        <h2 className="text-2xl font-semibold mb-6 text-gray-900">
          Add Product
        </h2>

        {message && (
          <p className="mb-6 p-3 rounded bg-gray-100 text-gray-800 font-medium">
            {message}
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-4">
            <input
              name="name"
              placeholder="Product Name"
              value={form.name}
              onChange={handleChange}
              className="w-full p-3 border rounded text-gray-800 focus:outline-none focus:ring-2 focus:ring-black"
              required
            />
            <input
              name="brand"
              placeholder="Brand"
              value={form.brand}
              onChange={handleChange}
              className="w-full p-3 border rounded text-gray-800 focus:outline-none focus:ring-2 focus:ring-black"
            />
            <input
              name="category"
              placeholder="Category (liquor, beer, wine)"
              value={form.category}
              onChange={handleChange}
              className="w-full p-3 border rounded text-gray-800 focus:outline-none focus:ring-2 focus:ring-black"
              required
            />
            <textarea
              name="description"
              placeholder="Description"
              value={form.description}
              onChange={handleChange}
              className="w-full p-3 border rounded text-gray-800 focus:outline-none focus:ring-2 focus:ring-black min-h-[80px]"
            />
            <input
              name="image_url"
              placeholder="Image URL"
              value={form.image_url}
              onChange={handleChange}
              className="w-full p-3 border rounded text-gray-800 focus:outline-none focus:ring-2 focus:ring-black"
            />
            <input
              name="alcohol_percentage"
              type="number"
              step="0.01"
              placeholder="Alcohol Percentage"
              value={form.alcohol_percentage}
              onChange={handleChange}
              className="w-full p-3 border rounded text-gray-800 focus:outline-none focus:ring-2 focus:ring-black"
            />
          </div>

          <hr className="my-6" />
          <h3 className="text-xl font-medium">Variant Details</h3>

          <div className="space-y-4">
            <input
              name="volume_ml"
              type="number"
              placeholder="Volume (ml)"
              value={form.volume_ml}
              onChange={handleChange}
              className="w-full p-3 border rounded text-gray-800 focus:outline-none focus:ring-2 focus:ring-black"
              required
            />
            <input
              name="price"
              type="number"
              step="0.01"
              placeholder="Price"
              value={form.price}
              onChange={handleChange}
              className="w-full p-3 border rounded text-gray-800 focus:outline-none focus:ring-2 focus:ring-black"
              required
            />
            <input
              name="original_price"
              type="number"
              step="0.01"
              placeholder="Original Price (optional)"
              value={form.original_price}
              onChange={handleChange}
              className="w-full p-3 border rounded text-gray-800 focus:outline-none focus:ring-2 focus:ring-black"
            />
            <input
              name="stock_quantity"
              type="number"
              placeholder="Stock Quantity"
              value={form.stock_quantity}
              onChange={handleChange}
              className="w-full p-3 border rounded text-gray-800 focus:outline-none focus:ring-2 focus:ring-black"
              required
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className={`w-full bg-black text-white p-3 rounded font-medium hover:bg-gray-800 transition ${
              submitting ? "opacity-70 cursor-not-allowed" : ""
            }`}
          >
            {submitting ? "Adding..." : "Add Product"}
          </button>
        </form>
      </div>
    </div>
  );
}
