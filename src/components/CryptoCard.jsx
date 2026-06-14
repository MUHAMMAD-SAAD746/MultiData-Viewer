import { useEffect, useRef } from "react";
import "../assets/css/CryptoCard.css";

const fmt = (n, opts = {}) =>
  new Intl.NumberFormat("en-US", opts).format(n);

const CryptoCard = ({ coin }) => {
  const priceRef = useRef(null);
  const isPositive = coin.price_change_percentage_24h >= 0;

  /* One-shot flash on mount to signal live data */
  useEffect(() => {
    const el = priceRef.current;
    if (!el) return;
    el.classList.add("price-flash");
    const t = setTimeout(() => el.classList.remove("price-flash"), 800);
    return () => clearTimeout(t);
  }, []);

  return (
    <article className="crypto-card">
      {/* Top row: identity */}
      <div className="card-top">
        <div className="coin-identity">
          {coin.image && (
            <img
              src={coin.image}
              alt={coin.name}
              className="coin-image"
              width={36}
              height={36}
            />
          )}
          <div>
            <p className="coin-name">{coin.name}</p>
            <p className="coin-symbol">{coin.symbol?.toUpperCase()}</p>
          </div>
        </div>

        <span className={`change-badge ${isPositive ? "pos" : "neg"}`}>
          {isPositive ? "▲" : "▼"}{" "}
          {Math.abs(coin.price_change_percentage_24h ?? 0).toFixed(2)}%
        </span>
      </div>

      {/* Price */}
      <div className="card-price-row">
        <p ref={priceRef} className="coin-price">
          {fmt(coin.current_price, {
            style: "currency",
            currency: "USD",
            maximumFractionDigits: coin.current_price < 1 ? 6 : 2,
          })}
        </p>
      </div>

      {/* Stats row */}
      <div className="card-stats">
        <div className="stat">
          <span className="stat-label">Market Cap</span>
          <span className="stat-value">
            ${fmt(coin.market_cap, { notation: "compact", maximumFractionDigits: 2 })}
          </span>
        </div>
        <div className="stat">
          <span className="stat-label">24h Volume</span>
          <span className="stat-value">
            ${fmt(coin.total_volume, { notation: "compact", maximumFractionDigits: 2 })}
          </span>
        </div>
        <div className="stat">
          <span className="stat-label">Rank</span>
          <span className="stat-value rank">#{coin.market_cap_rank}</span>
        </div>
      </div>

      {/* 24h range bar */}
      {coin.low_24h != null && coin.high_24h != null && (
        <div className="range-section">
          <div className="range-labels">
            <span className="stat-label">
              L {fmt(coin.low_24h, { style: "currency", currency: "USD", maximumFractionDigits: 2 })}
            </span>
            <span className="stat-label">24h range</span>
            <span className="stat-label">
              H {fmt(coin.high_24h, { style: "currency", currency: "USD", maximumFractionDigits: 2 })}
            </span>
          </div>
          <div className="range-bar-track">
            <div
              className="range-bar-fill"
              style={{
                left: "0%",
                width: `${Math.min(
                  100,
                  ((coin.current_price - coin.low_24h) /
                    (coin.high_24h - coin.low_24h)) *
                    100
                )}%`,
              }}
            />
            <div
              className="range-bar-dot"
              style={{
                left: `${Math.min(
                  100,
                  ((coin.current_price - coin.low_24h) /
                    (coin.high_24h - coin.low_24h)) *
                    100
                )}%`,
              }}
            />
          </div>
        </div>
      )}
    </article>
  );
};

export default CryptoCard;
