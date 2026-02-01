import React from "react";
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
  const { query, setQuery, results, loading, error } = useNavbarSearch();
  const navigate = useNavigate();

  const goToSearchPage = () => {
    if (!query.trim()) return;
    navigate(`/search?query=${encodeURIComponent(query)}`);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      goToSearchPage();
    }
  };

  return (
    <Navbar isBordered>
      <NavbarContent justify="start">
        <NavbarBrand className="mr-4">
          <AcmeLogo />
          <p className="hidden sm:block font-bold text-2xl text-[#051f20]">
            Popcornflix
          </p>
        </NavbarBrand>

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

        <div className="flex gap-2">
          <Button color="primary" variant="flat">
            Sign Up
          </Button>
          <Button color="primary" variant="flat">
            Sign In
          </Button>
        </div>

        {(results.length > 0 || loading || error) && (
          <div className="absolute top-14 right-0 text-gray-300 shadow-lg rounded max-w-4xl w-full z-50 p-4">
            {loading && (
              <p className="text-center">
                <Button
                  isLoading
                  color="secondary"
                  spinner={
                    <svg
                      className="animate-spin h-5 w-5 text-current"
                      fill="none"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        fill="currentColor"
                      />
                    </svg>
                  }
                >
                  Loading
                </Button>
              </p>
            )}
            {error && (
              <p className="text-red-500 text-center">{error}</p>
            )}
            {!loading && !error && results.length === 0 && (
              <p className="text-center text-gray-400">
                No movies found.
              </p>
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
  );
}
