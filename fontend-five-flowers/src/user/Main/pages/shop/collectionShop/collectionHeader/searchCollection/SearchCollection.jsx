import { motion } from "framer-motion";
import React, { useState } from "react";
import { MdOutlineSearch } from "react-icons/md";
import "./searchCollection.scss";

const SearchCollection = ({ onSearchTermChange }) => {
  const [isFocused, setIsFocused] = useState(false);

  const handleSearchChange = (event) => {
    onSearchTermChange(event.target.value);
  };

  return (
    <div className="search-container">
      <div className="input-search">
        <motion.input
          type="text"
          placeholder="Search something..."
          initial={{ borderColor: "rgb(227, 227, 227)" }}
          animate={{ borderColor: isFocused ? "#fa422a" : "rgb(227, 227, 227)" }}
          transition={{ duration: 0.3 }}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          onChange={handleSearchChange}
        />
        <div className="icon-search">
          <p>
            <MdOutlineSearch />
          </p>
        </div>
      </div>
    </div>
  );
};

export default SearchCollection;
