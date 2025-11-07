import { useEffect, useState } from "react";
import client from "../api/client";

export default function useProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;

    async function fetchProducts() {
      try {
        const response = await client.get("/products");
        if (!isMounted) {
          return;
        }
        setProducts(response.data.data);
        setLoading(false);
      } catch (err) {
        if (!isMounted) {
          return;
        }
        setError(err.response?.data?.error || "Unable to load products");
        setLoading(false);
      }
    }

    fetchProducts();

    return () => {
      isMounted = false;
    };
  }, []);

  return { products, loading, error };
}
