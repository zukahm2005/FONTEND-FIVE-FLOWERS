import React from "react";
import "./collectionHeader.scss";
import DisplayCollectionHeader from "./displayCollectionHeader/DisplayCollectionHeader";
import SearchCollection from "./searchCollection/SearchCollection";
import SortCollectionHeader from "./sortCollectionHeader/SortCollectionHeader";

const CollectionHeader = ({ onDisplayChange, onSearchTermChange, onSortChange }) => {
  return (
    <div className="collection-header-container">
      <div className="display-container-collect-header">
        <DisplayCollectionHeader onDisplayChange={onDisplayChange} />
      </div>
      <div className="search-container-collect-header">
        <SearchCollection onSearchTermChange={onSearchTermChange} />
      </div>
      <div className="sort-container-collection-header">
        <SortCollectionHeader onSortChange={onSortChange} />
      </div>
    </div>
  );
};

export default CollectionHeader;
