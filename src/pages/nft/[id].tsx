import React from 'react';
import { useMetamask, useAddress , useDisconnect } from "@thirdweb-dev/react";

const NftDropPage = () => {
  const ConnectWithMetamask = useMetamask();
  const Address = useAddress();
  const Disconnect = useDisconnect();

  return (
    <div className='flex h-screen flex-col lg:grid lg:grid-cols-10'>
      {/* left */}
      <div className='bg-[#0d1b2a] lg:col-span-4'>
        <div className='flex flex-col items-center justify-center py-2 lg:min-h-screen'>
          <div className='bg-[#1b263b] p-2 rounded-xl'>
            <img
              className='w-44 rounded-xl object-cover lg:h-96 lg:w-74'
              src='https://i.pinimg.com/564x/53/03/a7/5303a77535aec49639383b0d1bf74ff1.jpg' />
          </div>
          <div className='text-center p-5 space-y-2'>
            <h1 className='text-3xl font-bold text-white'>STAR react</h1>
            <h2 className='text-xl text-gray-300'>A collection of STAR react</h2>
          </div>
        </div>
      </div>

      {/* right */}
      <div className='flex flex-1 flex-col p-12 lg:col-span-6'>
      {/* header */}
      <header className='flex items-center justify-between'>
        <h1 className='w-52 cursor-pointer text-xl font-extralight
        sm:w-80'>
          The{' '}
          <span className='font-extrabold underline decoration-[#415a77]'>STAREACT</span>
          {' '}NFT Market Place
          </h1>
        <button 
        onClick={() => (Address ? Disconnect() : ConnectWithMetamask())}
        className='rounded-full bg-[#1b263b] px-4 text-white py-2 text-xs
        font-bold lg:px-5 lg:py-3 lg:text-base'>{ Address ? 'Sing Out' : 'Sing In' }</button>
      </header>

      <hr  className='my-2 border'/>
      {Address && (
        <p
        className='text-sm text-center text-[#778da9]'
        >You're logged in with wallet {Address.substring(0, 5)}...{Address.substring(Address.length - 5)}</p>
      )}
      {/* content */}
      <div className='mt-10 flex flex-1 flex-col items-center space-y-6 text-center
      lg:space-y-0 lg:justify-center'>
        <img 
        className='w-80 object-cover pb-10 lg:h-40'
        src='https://nftevening.com/wp-content/uploads/2022/05/punkscape-6144.png.webp'/>
        <h1 className='text-3xl font-bold lg:text-5xl lg:font-extrabold'>
          The STAR pixel collection | NFT DROP
        </h1>

        <p className='pt-2 text-xl text-green-500'>14 / 20 NFT's claimed</p>
      </div>
      {/* mint button */}
      <button className='h-16 w-full bg-[#778da9] text-white rounded-full mt-10 font-bold'
      >Mint NFT (0.001 ETH)</button>
      </div>
    </div>
  )
}

export default NftDropPage;