import React, { useState, useEffect } from "react";
import { Select, SelectItem, Form, Input } from "@heroui/react";
import {
  qualityData,
  genreData,
  ratingData,
  yearData,
  languageData,
  orderByData,
} from "../Hooks/FilterData";

const makeLabel = (str) =>
  str.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());

export default function CustomSelect({ selected, onChange }) {
  const [localQuery, setLocalQuery] = useState(selected.search || "");

  // Keep local query synced with parent
  useEffect(() => {
    setLocalQuery(selected.search || "");
  }, [selected.search]);

  const buildOptions = (arr) =>
    arr.map((v) => ({ value: v, label: makeLabel(v) }));

  // Debounce search input while typing
  useEffect(() => {
    const handler = setTimeout(() => {
      onChange("search", localQuery.trim());
    }, 500);

    return () => clearTimeout(handler);
  }, [localQuery, onChange]);

  return (
    <section className="bg-white text-black py-4">
      <div className="w-full max-w-6xl mx-auto px-4 sm:px-6">
        <Form className="mb-6 flex gap-4 flex-col sm:flex-row items-stretch sm:items-end">
          <Input
            isRequired={false}
            label="Search Term"
            labelPlacement="outside"
            name="query"
            placeholder="Search movies..."
            className="flex-1"
            value={localQuery}
            onChange={(e) => setLocalQuery(e.target.value)}
          />
        </Form>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-6 mb-6">
          <Select
            label="Quality"
            className="w-full"
            value={selected.quality}
            onValueChange={(val) => onChange("quality", val)}
          >
            {buildOptions(qualityData).map((item) => (
              <SelectItem key={item.value} value={item.value}>
                {item.label}
              </SelectItem>
            ))}
          </Select>

          <Select
            label="Genre"
            className="w-full"
            value={selected.genre}
            onValueChange={(val) => onChange("genre", val)}
          >
            {buildOptions(genreData).map((item) => (
              <SelectItem key={item.value} value={item.value}>
                {item.label}
              </SelectItem>
            ))}
          </Select>

          <Select
            label="Rating"
            className="w-full"
            value={selected.rating}
            onValueChange={(val) => onChange("rating", val)}
          >
            {buildOptions(ratingData).map((item) => (
              <SelectItem key={item.value} value={item.value}>
                {item.label}
              </SelectItem>
            ))}
          </Select>

          <Select
            label="Year"
            className="w-full"
            value={selected.year}
            onValueChange={(val) => onChange("year", val)}
          >
            {buildOptions(yearData).map((item) => (
              <SelectItem key={item.value} value={item.value}>
                {item.label}
              </SelectItem>
            ))}
          </Select>

          <Select
            label="Language"
            className="w-full"
            value={selected.language}
            onValueChange={(val) => onChange("language", val)}
          >
            {buildOptions(languageData).map((item) => (
              <SelectItem key={item.value} value={item.value}>
                {item.label}
              </SelectItem>
            ))}
          </Select>

          <Select
            label="Order By"
            className="w-full"
            value={selected.orderBy}
            onValueChange={(val) => onChange("orderBy", val)}
          >
            {buildOptions(orderByData).map((item) => (
              <SelectItem key={item.value} value={item.value}>
                {item.label}
              </SelectItem>
            ))}
          </Select>
        </div>
      </div>
    </section>
  );
}
