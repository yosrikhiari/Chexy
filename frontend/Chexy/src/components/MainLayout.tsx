import React, { useState } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import FriendsSidebar from "./FriendsSidebar";

const NAV = [
  { to: "/game-select", label: "Play" },
  { to: "/leaderboard", label: "Leaderboard" },
  { to: "/profile", label: "Profile" },
];

const MainLayout: React.FC = () => {
  const [isFriendsSidebarCollapsed, setIsFriendsSidebarCollapsed] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const toggleFriendsSidebar = () => setIsFriendsSidebarCollapsed((v) => !v);

  // The board page owns the whole viewport.
  const isGamePage = location.pathname.includes("/game/");

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {!isGamePage && (
        <header className="border-b border-border flex-shrink-0">
          <div className="container mx-auto px-4 h-14 flex items-center justify-between">
            <button
              type="button"
              onClick={() => navigate("/game-select")}
              className="flex items-center gap-2.5 text-foreground"
              aria-label="Chexy home"
            >
              <span className="font-display text-2xl leading-none text-primary" aria-hidden="true">♞</span>
              <span className="font-display text-lg tracking-tight">Chexy</span>
            </button>

            <nav className="hidden md:flex items-center gap-1" aria-label="Main">
              {NAV.map((item) => {
                const active = location.pathname === item.to;
                return (
                  <button
                    key={item.to}
                    type="button"
                    onClick={() => navigate(item.to)}
                    aria-current={active ? "page" : undefined}
                    className={`px-3 py-1.5 rounded-md text-sm transition-colors ${
                      active ? "text-foreground bg-secondary" : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {item.label}
                  </button>
                );
              })}
            </nav>

            <button
              type="button"
              className="md:hidden px-3 py-1.5 rounded-md text-sm text-muted-foreground hover:text-foreground"
              onClick={toggleFriendsSidebar}
              aria-label="Toggle friends"
            >
              Friends
            </button>
          </div>
        </header>
      )}

      <main className={`flex-1 transition-all duration-300 ${isFriendsSidebarCollapsed ? "mr-12" : "mr-80"}`}>
        <Outlet />
      </main>

      <FriendsSidebar isCollapsed={isFriendsSidebarCollapsed} onToggleCollapse={toggleFriendsSidebar} />
    </div>
  );
};

export default MainLayout;
