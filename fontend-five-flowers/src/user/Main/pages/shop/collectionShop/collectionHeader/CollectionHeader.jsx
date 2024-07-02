import React from 'react';
import "./collectionHeader.scss";
import DisplayCollectionHeader from './displayCollectionHeader/DisplayCollectionHeader';

const CollectionHeader = ({ onDisplayChange }) => {
  return (
    <div className='collection-header-container'>
      <div className="display-container-collect-header">
        <DisplayCollectionHeader onDisplayChange={onDisplayChange} />
      </div>
    </div>
  );
};

export default CollectionHeader;
