import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  Input,
  Button
} from "@heroui/react";
import { useNavbarSearch } from "../Hooks/useNavbarSearch";
import Card from "./Card";

export const AcmeLogo = () => <></>;

export const SearchIcon = ({
  size = 24,
  strokeWidth = 1.5,
  width,
  height,
  ...props
}) => (
  <svg
    aria-hidden="true"
    fill="none"
    focusable="false"
    height={height || size}
    role="presentation"
    viewBox="0 0 24 24"
    width={width || size}
    {...props}
  >
    <path
      d="M11.5 21C16.7467 21 21 16.7467 21 11.5C21 6.25329 16.7467 2 11.5 2C6.25329 2 2 6.25329 2 11.5C2 16.7467 6.25329 21 11.5 21Z"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={strokeWidth}
    />
    <path
      d="M22 22L20 20"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={strokeWidth}
    />
  </svg>
);

const navLinkClass = ({ isActive }) =>
  `px-2 py-1 transition-colors ${
    isActive ? "text-secondary font-semibold" : "text-foreground"
  }`;

export default function NavbarComponent() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { query, setQuery, results, loading, error } = useNavbarSearch();
  const navigate = useNavigate();

  const goToSearchPage = () => {
    if (!query.trim()) return;
    navigate(`/search?query=${encodeURIComponent(query)}`);
    setMobileOpen(false); // Close drawer on search
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      goToSearchPage();
    }
  };

  return (
    <>
      <Navbar isBordered className="relative">
        <NavbarContent justify="start" className="relative">
          {/* Mobile toggle button on top-left */}
          <div className="sm:hidden absolute left-2 top-2 z-50">
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="p-2 rounded hover:bg-gray-200"
              aria-label="Toggle menu"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                {mobileOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>

          <NavbarBrand className="ml-8 sm:ml-0 flex items-center gap-2">
            <AcmeLogo />
            <p className="hidden sm:block font-bold text-2xl text-[#051f20]">
              Popcornflix
            </p>
          </NavbarBrand>

          {/* Desktop links */}
          <NavbarContent className="hidden sm:flex gap-3">
            <NavbarItem>
              <NavLink to="/home" className={navLinkClass}>
                Home
              </NavLink>
            </NavbarItem>
            <NavbarItem>
              <NavLink to="/" end className={navLinkClass}>
                Browse Movies
              </NavLink>
            </NavbarItem>
            <NavbarItem>
              <NavLink to="/new" className={navLinkClass}>
                New Movies
              </NavLink>
            </NavbarItem>
            <NavbarItem>
              <NavLink to="/top" className={navLinkClass}>
                Top 100
              </NavLink>
            </NavbarItem>
          </NavbarContent>
        </NavbarContent>

        {/* Mobile Drawer */}
        <div
          className={`fixed top-0 left-0 h-full w-64 bg-white/50 shadow-lg z-40 transform transition-transform duration-300 sm:hidden ${
            mobileOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <div className="p-4 flex flex-col gap-4">
            {/* Search inside drawer */}
            <Input
              classNames={{
                base: "w-full h-10",
                mainWrapper: "h-full",
                input: "text-small",
                inputWrapper:
                  "h-full font-normal text-default-500 bg-default-400/20"
              }}
              placeholder="Type to search..."
              size="sm"
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              startContent={
                <button
                  onClick={goToSearchPage}
                  className="cursor-pointer focus:outline-none"
                >
                  <SearchIcon size={18} />
                </button>
              }
            />

            {/* Navigation links */}
            <NavLink
              to="/home"
              className={navLinkClass}
              onClick={() => setMobileOpen(false)}
            >
              Home
            </NavLink>
            <NavLink
              to="/"
              end
              className={navLinkClass}
              onClick={() => setMobileOpen(false)}
            >
              Browse Movies
            </NavLink>
            <NavLink
              to="/new"
              className={navLinkClass}
              onClick={() => setMobileOpen(false)}
            >
              New Movies
            </NavLink>
            <NavLink
              to="/top"
              className={navLinkClass}
              onClick={() => setMobileOpen(false)}
            >
              Top 100
            </NavLink>

            {/* Sign buttons inside drawer */}
            <div className="flex gap-2 mt-2">
              <Button color="primary" variant="flat" onClick={() => setMobileOpen(false)}>
                Sign Up
              </Button>
              <Button color="primary" variant="flat" onClick={() => setMobileOpen(false)}>
                Sign In
              </Button>
            </div>
          </div>
        </div>

        {/* Desktop Search & Sign */}
        <NavbarContent justify="end" className="items-center gap-2 relative">
          <Input
            classNames={{
              base: "max-w-full sm:max-w-[25rem] h-10",
              mainWrapper: "h-full",
              input: "text-small",
              inputWrapper:
                "h-full font-normal text-default-500 bg-default-400/20 dark:bg-default-500/20"
            }}
            placeholder="Type to search..."
            size="sm"
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            startContent={
              <button
                onClick={goToSearchPage}
                className="cursor-pointer focus:outline-none"
              >
                <SearchIcon size={18} />
              </button>
            }
          />

          <div className="hidden sm:flex gap-2">
            <Button color="primary" variant="flat">
              Sign Up
            </Button>
            <Button color="primary" variant="flat">
              Sign In
            </Button>
          </div>

          {/* Search Results Dropdown */}
          {(results.length > 0 || loading || error) && (
            <div className="absolute top-14 right-0 text-gray-300 shadow-lg rounded max-w-4xl w-full z-50 p-4 bg-white dark:bg-gray-800">
              {loading && (
                <p className="text-center">
                  <Button isLoading color="secondary">Loading</Button>
                </p>
              )}
              {error && <p className="text-red-500 text-center">{error}</p>}
              {!loading && !error && results.length === 0 && (
                <p className="text-center text-gray-400">No movies found.</p>
              )}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-1 gap-4">
                {results.map((movie) => (
                  <Card key={movie.id} movie={movie} />
                ))}
              </div>
            </div>
          )}
        </NavbarContent>
      </Navbar>
    </>
  );
}
