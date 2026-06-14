import React from "react";
import { useQuery } from "@tanstack/react-query";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

import { fetchProducts } from "../Api/productsApi";
import { fetchUsers } from "../api/usersApi";
import { fetchCrypto } from "../api/cryptoApi";
import Sidebar from "../layout/Sidebar"

import "../assets/css/dashboard.css";

/* ─── helpers ─────────────────────────────────────────── */
const initials = (first = "", last = "") =>
  `${first[0] ?? ""}${last[0] ?? ""}`.toUpperCase();

const AVATAR_COLORS = [
  { bg: "#E6F1FB", color: "#185FA5" },
  { bg: "#E1F5EE", color: "#0F6E56" },
  { bg: "#FAEEDA", color: "#854F0B" },
  { bg: "#EEEDFE", color: "#534AB7" },
  { bg: "#FAECE7", color: "#993C1D" },
];

const CRYPTO_COLORS = ["#378ADD", "#1D9E75", "#EF9F27", "#D4537E", "#7F77DD"];

const STAT_ICONS = {
  products: { bg: "#E6F1FB", color: "#185FA5", symbol: "📦" },
  users: { bg: "#E1F5EE", color: "#0F6E56", symbol: "👥" },
  avgPrice: { bg: "#FAEEDA", color: "#854F0B", symbol: "🏷️" },
  crypto: { bg: "#EEEDFE", color: "#534AB7", symbol: "₿" },
};


function StatCard({ label, value, change, changeDir, iconConfig }) {
  return (
    <div className="db-stat-card">
      <div className="db-stat-card__top">
        <span className="db-stat-card__label">{label}</span>
        <div
          className="db-stat-card__icon"
          style={{ background: iconConfig.bg, color: iconConfig.color }}
        >
          {iconConfig.symbol}
        </div>
      </div>
      <div className="db-stat-card__value">{value}</div>
      <div className={`db-stat-card__change db-stat-card__change--${changeDir}`}>
        {changeDir === "up" ? "▲" : "▼"} {change}
      </div>
    </div>
  );
}

function ProductBarChart({ products }) {
  const categoryMap = {};
  products.forEach((p) => {
    const cat = p.category ?? "Other";
    if (!categoryMap[cat]) categoryMap[cat] = { prices: [] };
    categoryMap[cat].prices.push(p.price);
  });

  const data = Object.entries(categoryMap).map(([cat, { prices }]) => ({
    category: cat.length > 14 ? cat.slice(0, 13) + "…" : cat,
    avg: Math.round(prices.reduce((a, b) => a + b, 0) / prices.length),
  }));

  const BAR_COLORS = ["#378ADD", "#1D9E75", "#EF9F27", "#D4537E"];

  return (
    <ResponsiveContainer width="100%" height={190}>
      <BarChart data={data} margin={{ top: 4, right: 4, left: -8, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(136,135,128,.15)" vertical={false} />
        <XAxis dataKey="category" tick={{ fontSize: 11, fill: "#888780" }} axisLine={false} tickLine={false} />
        <YAxis tick={{ fontSize: 10, fill: "#888780" }} axisLine={false} tickLine={false} tickFormatter={(v) => `$${v}`} />
        <Tooltip
          formatter={(v) => [`$${v.toLocaleString()}`, "Avg price"]}
          contentStyle={{ fontSize: 12, borderRadius: 8, border: "0.5px solid rgba(0,0,0,.1)" }}
        />
        <Bar dataKey="avg" radius={[4, 4, 0, 0]} maxBarSize={48}>
          {data.map((_, i) => (
            <Cell key={i} fill={BAR_COLORS[i % BAR_COLORS.length]} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}

function CryptoPieChart({ crypto }) {
  const top5 = crypto.slice(0, 5);
  const data = top5.map((c) => ({
    name: c.symbol.toUpperCase(),
    value: 5 - top5.indexOf(c) + 1,
  }));

  return (
    <ResponsiveContainer width="100%" height={190}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          innerRadius={52}
          outerRadius={78}
          paddingAngle={3}
          dataKey="value"
        >
          {data.map((_, i) => (
            <Cell key={i} fill={CRYPTO_COLORS[i % CRYPTO_COLORS.length]} />
          ))}
        </Pie>
        <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8 }} />
        <Legend
          iconType="square"
          iconSize={8}
          formatter={(val) => <span style={{ fontSize: 11, color: "#888780" }}>{val}</span>}
        />
      </PieChart>
    </ResponsiveContainer>
  );
}

function ProductsTable({ products }) {
  return (
    <div className="db-card">
      <div className="db-card__header">
        <span className="db-card__title">Recent products</span>
        <span className="db-tag">Top 5</span>
      </div>
      <div className="db-list">
        {products.slice(0, 5).map((p) => (
          <div key={p.id} className="db-list__row">
            <div>
              <div className="db-list__primary">{p.title}</div>
              <div className="db-list__secondary">{p.category}</div>
            </div>
            <div className="db-list__value">${p.price.toFixed(2)}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function UsersTable({ users }) {
  return (
    <div className="db-card">
      <div className="db-card__header">
        <span className="db-card__title">Recent users</span>
        <span className="db-tag">Top 5</span>
      </div>
      <div className="db-list">
        {users.slice(0, 5).map((u, i) => {
          const ac = AVATAR_COLORS[i % AVATAR_COLORS.length];
          return (
            <div key={u.login.uuid} className="db-list__row db-list__row--user">
              <div
                className="db-avatar"
                style={{ background: ac.bg, color: ac.color }}
              >
                {initials(u.name.first, u.name.last)}
              </div>
              <div>
                <div className="db-list__primary">
                  {u.name.first} {u.name.last}
                </div>
                <div className="db-list__secondary">{u.email}</div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function CryptoTable({ crypto }) {
  const changes = ["+2.4%", "+1.1%", "-0.8%", "+3.2%", "-1.5%"];
  return (
    <div className="db-card">
      <div className="db-card__header">
        <span className="db-card__title">Top cryptocurrencies</span>
        <span className="db-tag db-tag--info">Live rankings</span>
      </div>
      <div className="db-crypto-table-wrap">
        <table className="db-crypto-table">
          <thead>
            <tr>
              <th>Coin</th>
              <th>Symbol</th>
              <th>Price</th>
              <th>Rank</th>
              <th>24h</th>
            </tr>
          </thead>
          <tbody>
            {crypto.slice(0, 5).map((coin, i) => {
              const change = changes[i];
              const isUp = change.startsWith("+");
              return (
                <tr key={coin.id}>
                  <td>
                    <div className="db-coin-cell">
                      <img src={coin.image} alt={coin.name} className="db-coin-img" />
                      {coin.name}
                    </div>
                  </td>
                  <td className="db-crypto-table__muted">{coin.symbol.toUpperCase()}</td>
                  <td>${coin.current_price.toLocaleString()}</td>
                  <td className="db-crypto-table__rank">#{coin.market_cap_rank}</td>
                  <td>
                    <span className={`db-pill db-pill--${isUp ? "up" : "dn"}`}>{change}</span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* ─── main page ────────────────────────────────────────── */
function DashboardContent({ products, users, crypto }) {
  const avgPrice = products.length
    ? `$${Math.round(products.reduce((a, p) => a + p.price, 0) / products.length)}`
    : "$—";

  return (
    <div className="db-content">
      {/* Stats */}
      <div className="db-stats-grid">
        <StatCard label="Total products" value={products.length} change="+12% from last month" changeDir="up" iconConfig={STAT_ICONS.products} />
        <StatCard label="Active users" value={users.length.toLocaleString()} change="+8% from last week" changeDir="up" iconConfig={STAT_ICONS.users} />
        <StatCard label="Avg. price" value={avgPrice} change="-3% this week" changeDir="dn" iconConfig={STAT_ICONS.avgPrice} />
        <StatCard label="Crypto tracked" value={crypto.length} change="Market up today" changeDir="up" iconConfig={STAT_ICONS.crypto} />
      </div>

      {/* Charts */}
      <div className="db-charts-row">
        <div className="db-card">
          <div className="db-card__header">
            <span className="db-card__title">Product price distribution</span>
            <span className="db-tag">By category</span>
          </div>
          <ProductBarChart products={products} />
        </div>
        <div className="db-card">
          <div className="db-card__header">
            <span className="db-card__title">Crypto market overview</span>
            <span className="db-tag db-tag--info">Top 5 by cap</span>
          </div>
          <CryptoPieChart crypto={crypto} />
        </div>
      </div>

      {/* Tables */}
      <div className="db-tables-row">
        <ProductsTable products={products} />
        <UsersTable users={users} />
      </div>

      <CryptoTable crypto={crypto} />
    </div>
  );
}

/* ─── root ─────────────────────────────────────────────── */
const Home = () => {
  const [activePage, setActivePage] = React.useState("overview");

  const {
    data: products = [],
    isLoading: productsLoading,
    isError: productsError,
  } = useQuery({ queryKey: ["products"], queryFn: fetchProducts });

  const {
    data: users = [],
    isLoading: usersLoading,
    isError: usersError,
  } = useQuery({ queryKey: ["users"], queryFn: fetchUsers });

  const {
    data: crypto = [],
    isLoading: cryptoLoading,
    isError: cryptoError,
  } = useQuery({ queryKey: ["crypto"], queryFn: fetchCrypto });

  const isLoading = productsLoading || usersLoading || cryptoLoading;
  const isError = productsError || usersError || cryptoError;

  return (
    <div className="db-main">

      {isLoading && (
        <div className="db-state-center">
          <div className="db-spinner" />
        </div>
      )}

      {isError && !isLoading && (
        <div className="db-state-center db-state-center--error">
          Failed to load dashboard data.
        </div>
      )}

      {!isLoading && !isError && (
        <DashboardContent products={products} users={users} crypto={crypto} />
      )}
    </div>
  );
};

export default Home;
