import React, { useState, useEffect } from "react";
import axios from "axios";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const AddressAutoComplete = ({ form, setForm }) => {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [activeIndex, setActiveIndex] = useState(-1);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      const q = query.trim();
      if (q.length >= 3) {
        axios
          .get("https://nominatim.openstreetmap.org/search", {
            params: {
              q,
              format: "json",
              addressdetails: 1,
              dedupe: 1,
              limit: 5,
              countrycodes: "au", // 可选：只搜澳大利亚地址
            },
            headers: {
              "Accept-Language": "en",
            },
          })
          .then((res) => setSuggestions(res.data))
          .catch(console.error);
      }
    }, 300);
    return () => clearTimeout(timeoutId);
  }, [query]);

  const handleSelect = (item) => {
    setQuery(item.display_name);
    setSuggestions([]);
    setForm({
      ...form,
      address: item.display_name,
      lat: parseFloat(item.lat),
      lng: parseFloat(item.lon),
    });
  };

  return (
    <div className="relative">
      <Label>Address</Label>
      <Input
        placeholder="Search address"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onFocus={() => {
          if (form.address) setQuery(form.address);
        }}
      />

      {suggestions.length > 0 && (
        <ul className="absolute z-10 mt-1 w-full bg-muted border border-border rounded shadow text-foreground max-h-48 overflow-y-auto">
          {suggestions.map((s, index) => (
            <li
              key={`${s.place_id}-${index}`}
              onClick={() => handleSelect(s)}
              onMouseEnter={() => setActiveIndex(index)}
              className="px-3 py-2 cursor-pointer"
              style={{
                backgroundColor: activeIndex === index ? "#334155" : "#1e293b",
                color: "white",
              }}
            >
              {s.display_name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default AddressAutoComplete;
