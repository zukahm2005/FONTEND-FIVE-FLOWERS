import { Badge } from 'antd';
import React, { useContext } from "react";
import { IoCartOutline } from "react-icons/io5";
import { CartContext } from '../cart/cartContext/CartProvider';

const IconContextCart = () => {
  const { distinctProductCount } = useContext(CartContext);

  return (
    <div style={{ position: 'relative', display: 'inline-block' }}>
      <Badge count={distinctProductCount} offset={[0, 0]} style={{ backgroundColor: '#fa422d' }}>
        <IoCartOutline style={{ fontSize: '29px' }} />
      </Badge>
    </div>
  );
};

export default IconContextCart;
