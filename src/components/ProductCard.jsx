import { useState } from "react";
import "../assets/css/products.css";

/* star rating display */
function StarRating({ rate = 0, count = 0 }) {
  const full = Math.floor(rate);
  const half = rate - full >= 0.5;
  const empty = 5 - full - (half ? 1 : 0);

  return (
    <div className="prd-card__stars" aria-label={`Rating: ${rate} out of 5`}>
      {"★".repeat(full)}
      {half ? "½" : ""}
      {"☆".repeat(empty)}
      <span className="prd-card__rating-count">({count})</span>
    </div>
  );
}

/* category → accent color map */
const CAT_COLORS = {
  "men's clothing": { bg: "#E6F1FB", color: "#185FA5" },
  "women's clothing": { bg: "#FBEAF0", color: "#72243E" },
  "electronics": { bg: "#FAEEDA", color: "#854F0B" },
  "jewelery": { bg: "#EEEDFE", color: "#534AB7" },
};
const DEFAULT_CAT = { bg: "#F1EFE8", color: "#5F5E5A" };

const ProductCard = ({ product, listView = false }) => {
  const [wished, setWished] = useState(false);
  const [added, setAdded] = useState(false);

  const catStyle = CAT_COLORS[product.category] ?? DEFAULT_CAT;

  const handleAdd = () => {
    setAdded(true);
    setTimeout(() => setAdded(false), 1800);
  };

  console.log(product.thumbnail);

  if (listView) {
    return (
      <div className="prd-list-card">
        <div className="prd-list-card__img-wrap">
          <img
            src={product.thumbnail}
            alt={product.title}
            className="prd-list-card__img"
            loading="lazy"
          />
        </div>
        <div className="prd-list-card__body">
          <span
            className="prd-card__cat"
            style={{ background: catStyle.bg, color: catStyle.color }}
          >
            {product.category}
          </span>
          <h2 className="prd-list-card__title">{product.title}</h2>
          <p className="prd-list-card__desc">
            {product.description.slice(0, 120)}…
          </p>
          <StarRating rate={product.rating?.rate} count={product.rating?.count} />
        </div>
        <div className="prd-list-card__actions">
          <span className="prd-card__price">${product.price.toFixed(2)}</span>
          <button
            className={`prd-card__add-btn${added ? " added" : ""}`}
            onClick={handleAdd}
            aria-label={`Add ${product.title} to cart`}
          >
            {added ? "✓ Added" : "+ Add to cart"}
          </button>
          <button
            className={`prd-card__wish-btn${wished ? " active" : ""}`}
            onClick={() => setWished((w) => !w)}
            aria-label={wished ? "Remove from wishlist" : "Add to wishlist"}
            aria-pressed={wished}
          >
            {wished ? "♥" : "♡"}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="prd-card">
      {/* wishlist */}
      <button
        className={`prd-card__wish-btn${wished ? " active" : ""}`}
        onClick={() => setWished((w) => !w)}
        aria-label={wished ? "Remove from wishlist" : "Add to wishlist"}
        aria-pressed={wished}
      >
        {wished ? "♥" : "♡"}
      </button>

      {/* image */}
      <div className="prd-card__img-wrap">
        <img
          src={product.thumbnail}
          alt={product.title}
          className="prd-card__img"
          loading="lazy"
        />
      </div>

      {/* body */}
      <div className="prd-card__body">
        <span
          className="prd-card__cat"
          style={{ background: catStyle.bg, color: catStyle.color }}
        >
          {product.category}
        </span>

        <h2 className="prd-card__title">{product.title}</h2>

        <StarRating rate={product.rating?.rate} count={product.rating?.count} />

        <div className="prd-card__footer">
          <span className="prd-card__price">${product.price.toFixed(2)}</span>
          <button
            className={`prd-card__add-btn${added ? " added" : ""}`}
            onClick={handleAdd}
            aria-label={`Add ${product.title} to cart`}
          >
            {added ? "✓" : "+ Cart"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
