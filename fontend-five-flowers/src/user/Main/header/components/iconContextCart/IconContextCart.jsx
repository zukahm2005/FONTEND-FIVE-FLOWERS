import { Badge } from 'antd';
import React, { useContext, useEffect } from "react";
import { IoCartOutline } from "react-icons/io5";
import { CartContext } from '../cart/cartContext/CartProvider';

const IconContextCart = () => {
  const { distinctProductCount } = useContext(CartContext);

  // Kiểm tra giá trị distinctProductCount mỗi khi thay đổi
  useEffect(() => {
    console.log("distinctProductCount has changed:", distinctProductCount);
  }, [distinctProductCount]);

  return (
    <div style={{ position: 'relative', display: 'inline-block' }}>
      <Badge count={distinctProductCount} offset={[0, 0]} style={{ backgroundColor: '#fa422d' }}>
        <IoCartOutline style={{ fontSize: '29px' }} />
      </Badge>
    </div>
  );
};

export default IconContextCart;
