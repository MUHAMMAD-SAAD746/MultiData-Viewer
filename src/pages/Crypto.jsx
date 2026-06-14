import { useQuery } from "@tanstack/react-query";
import { fetchCrypto } from "../api/cryptoApi";
import CryptoCard from "../components/CryptoCard";
import "../assets/css/Crypto.css";

const Crypto = () => {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["crypto"],
    queryFn: fetchCrypto,
  });

  const totalMarketCap = data?.reduce((sum, coin) => sum + (coin.market_cap || 0), 0);
  const gainers = data?.filter((c) => c.price_change_percentage_24h > 0).length || 0;
  const losers = data?.filter((c) => c.price_change_percentage_24h < 0).length || 0;

  return (
    <div className="crypto-page">
      {/* Header */}
      <header className="crypto-header">
        <div className="crypto-header-inner">
          <div className="crypto-title-group">
            <span className="crypto-eyebrow">Live Market</span>
            <h1 className="crypto-title">Crypto Market</h1>
          </div>

          {!isLoading && data && (
            <div className="crypto-summary-bar">
              <div className="summary-stat">
                <span className="summary-label">Market Cap</span>
                <span className="summary-value">
                  ${(totalMarketCap / 1e12).toFixed(2)}T
                </span>
              </div>
              <div className="summary-divider" />
              <div className="summary-stat">
                <span className="summary-label">Gainers</span>
                <span className="summary-value positive">▲ {gainers}</span>
              </div>
              <div className="summary-divider" />
              <div className="summary-stat">
                <span className="summary-label">Losers</span>
                <span className="summary-value negative">▼ {losers}</span>
              </div>
              <div className="summary-divider" />
              <div className="summary-stat">
                <span className="summary-label">Coins</span>
                <span className="summary-value">{data.length}</span>
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Body */}
      <main className="crypto-main">
        {isLoading && (
          <div className="crypto-loading">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="skeleton-card">
                <div className="skeleton-line short" />
                <div className="skeleton-line long" />
                <div className="skeleton-line medium" />
              </div>
            ))}
          </div>
        )}

        {isError && (
          <div className="crypto-error">
            <span className="error-icon">⚠</span>
            <p>Failed to load market data. Check your connection and try again.</p>
          </div>
        )}

        {!isLoading && data && (
          <div className="crypto-grid">
            {data.map((coin) => (
              <CryptoCard key={coin.id} coin={coin} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default Crypto;
