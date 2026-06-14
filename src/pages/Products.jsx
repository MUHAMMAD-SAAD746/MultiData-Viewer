import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchProducts } from "../api/productsApi";
import ProductCard from "../components/ProductCard";
import "../assets/css/products.css";

/* ── helpers ─────────────────────────────────────────── */
const SORT_OPTIONS = [
  { value: "default",    label: "Default"       },
  { value: "price-asc",  label: "Price: Low → High" },
  { value: "price-desc", label: "Price: High → Low" },
  { value: "name-asc",   label: "Name: A → Z"   },
];

/* ── skeleton card ───────────────────────────────────── */
function SkeletonCard() {
  return (
    <div className="prd-skeleton" aria-hidden="true">
      <div className="prd-skeleton__img" />
      <div className="prd-skeleton__body">
        <div className="prd-skeleton__line prd-skeleton__line--short" />
        <div className="prd-skeleton__line" />
        <div className="prd-skeleton__line prd-skeleton__line--med" />
        <div className="prd-skeleton__footer">
          <div className="prd-skeleton__price" />
          <div className="prd-skeleton__btn" />
        </div>
      </div>
    </div>
  );
}

/* ── empty state ─────────────────────────────────────── */
function EmptyState({ query }) {
  return (
    <div className="prd-empty">
      <div className="prd-empty__icon">🔍</div>
      <p className="prd-empty__title">No products found</p>
      <p className="prd-empty__sub">
        No results for <strong>"{query}"</strong>. Try a different search or
        clear the filter.
      </p>
    </div>
  );
}

/* ── main page ───────────────────────────────────────── */
const Products = () => {
  const [search, setSearch]       = useState("");
  const [activeCategory, setCategory] = useState("All");
  const [sort, setSort]           = useState("default");
  const [view, setView]           = useState("grid"); // "grid" | "list"

  const { data = [], isLoading, isError, error } = useQuery({
    queryKey: ["products"],
    queryFn: fetchProducts,
  });

  /* derive category list */
  const categories = useMemo(() => {
    const cats = [...new Set(data.map((p) => p.category))];
    return ["All", ...cats];
  }, [data]);

  /* filter + sort */
  const filtered = useMemo(() => {
    let result = [...data];

    if (activeCategory !== "All")
      result = result.filter((p) => p.category === activeCategory);

    if (search.trim())
      result = result.filter((p) =>
        p.title.toLowerCase().includes(search.toLowerCase())
      );

    if (sort === "price-asc")  result.sort((a, b) => a.price - b.price);
    if (sort === "price-desc") result.sort((a, b) => b.price - a.price);
    if (sort === "name-asc")   result.sort((a, b) => a.title.localeCompare(b.title));

    return result;
  }, [data, activeCategory, search, sort]);

  const showEmpty = !isLoading && !isError && filtered.length === 0;

  return (
    <div className="prd-page">

      {/* ── page header ─────────────────────────────── */}
      <div className="prd-header">
        <div>
          <h1 className="prd-header__title">Products</h1>
          {!isLoading && (
            <p className="prd-header__sub">
              {filtered.length} of {data.length} items
            </p>
          )}
        </div>

        {/* search + sort */}
        <div className="prd-header__controls">
          <div className="prd-search">
            <span className="prd-search__icon">🔍</span>
            <input
              className="prd-search__input"
              type="search"
              placeholder="Search products…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              aria-label="Search products"
            />
            {search && (
              <button
                className="prd-search__clear"
                onClick={() => setSearch("")}
                aria-label="Clear search"
              >
                ✕
              </button>
            )}
          </div>

          <select
            className="prd-select"
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            aria-label="Sort products"
          >
            {SORT_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>

          {/* view toggle */}
          <div className="prd-view-toggle" role="group" aria-label="View mode">
            <button
              className={`prd-view-toggle__btn${view === "grid" ? " active" : ""}`}
              onClick={() => setView("grid")}
              aria-pressed={view === "grid"}
              title="Grid view"
            >
              ⊞
            </button>
            <button
              className={`prd-view-toggle__btn${view === "list" ? " active" : ""}`}
              onClick={() => setView("list")}
              aria-pressed={view === "list"}
              title="List view"
            >
              ☰
            </button>
          </div>
        </div>
      </div>

      {/* ── category pills ──────────────────────────── */}
      {!isLoading && !isError && (
        <div className="prd-categories" role="list" aria-label="Filter by category">
          {categories.map((cat) => (
            <button
              key={cat}
              role="listitem"
              className={`prd-cat-pill${activeCategory === cat ? " active" : ""}`}
              onClick={() => setCategory(cat)}
            >
              {cat}
              {cat !== "All" && (
                <span className="prd-cat-pill__count">
                  {data.filter((p) => p.category === cat).length}
                </span>
              )}
            </button>
          ))}
        </div>
      )}

      {/* ── error ───────────────────────────────────── */}
      {isError && (
        <div className="prd-error" role="alert">
          <span className="prd-error__icon">⚠️</span>
          <span>{error?.message ?? "Failed to load products."}</span>
        </div>
      )}

      {/* ── skeleton loading ─────────────────────────── */}
      {isLoading && (
        <div className="prd-grid">
          {Array.from({ length: 6 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      )}

      {/* ── empty state ──────────────────────────────── */}
      {showEmpty && <EmptyState query={search || activeCategory} />}

      {/* ── product grid / list ──────────────────────── */}
      {!isLoading && !isError && filtered.length > 0 && (
        <div className={view === "grid" ? "prd-grid" : "prd-list"}>
          {filtered.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              listView={view === "list"}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Products;
