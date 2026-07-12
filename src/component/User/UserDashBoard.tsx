"use client"

import Slider from './Slider'
import CategorySlider from './CategorySlider';
import ProductCardPage from './ProductCardPage';
import ShopPage from '@/app/shop/page';

function UserDashBoard() {
  return (
    <div className='w-full min-h-screen flex-col items-center justify-center bg-gradient-to-br from-gray-900 via-black to-gray-900 font-sans'>
      <Slider/>
      <CategorySlider/>
      <ProductCardPage/>
      <ShopPage/>
    </div>
  )
}

export default UserDashBoard
