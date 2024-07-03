import React from 'react';
import './bigSaleHome.scss';

const BigSaleHome = () => {
  return (
    <div className="dt-sc-section-wrapper" style={{ backgroundImage: 'url(https://bikex-club.myshopify.com/cdn/shop/files/img-4.jpg?v=1614291618)'}}>
      <div className="container"> 
        <div className="row">
          <div className="dt-sc-deal-banner-section">
            <div className="dt-sc-deal-banner-content text-start">
              <h4 className="dt-sc-main-title">Big <span>Sale</span></h4>
              <h6 className="dt-sc-sub-title">NEW BIKE BY MANUFACTURES BIKO</h6>
              <a href="/collections/hybrid-bikes" className="dt-sc-btn">BUY NOW</a>
            </div> 
          </div>           
        </div>
      </div>
    </div>
  );
}

export default BigSaleHome;
