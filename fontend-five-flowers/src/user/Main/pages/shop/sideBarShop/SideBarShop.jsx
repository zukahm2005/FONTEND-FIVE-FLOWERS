import React from 'react'
import CategoryShop from './categoryShop/CategoryShop'
import "./sideBarShop.scss"
const SideBarShop = () => {
  return (
    <div className='sidebar-shop-container'>
      <div className="sidebar-shop-category">
        <CategoryShop/>
      </div>
      <div className="sidebar-shop-price">
        
      </div>
    </div>
  )
}

export default SideBarShop