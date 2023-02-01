import React, {useState, useEffect} from 'react';
import { useMetamask, useAddress , useDisconnect, useContract } from "@thirdweb-dev/react";
import { GetServerSideProps } from 'next';
import { sanityClient, urlFor } from 'sanity';
import { Collection } from 'typings';
import { BigNumber } from 'ethers';
import toast, { Toaster } from 'react-hot-toast';
import Link from 'next/link';

interface Props {
  collection: Collection
}

const NftDropPage = ({collection}: Props) => {
  const [claimed, setClaimed] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [totalSuply, setTotalSuply] = useState<BigNumber>();
  const [priceETH, setPriceETH] = useState<string>();
  const nftDrop = useContract(collection.address, "nft-drop").contract


  const ConnectWithMetamask = useMetamask();
  const Address = useAddress();
  const Disconnect = useDisconnect();

  useEffect( () => {
    if(!nftDrop) return;
    const fetchPrice = async () => {
      const claimCondition = await nftDrop.claimConditions.getAll()
      setPriceETH(claimCondition?.[0]?.currencyMetadata?.displayValue)
    }
    fetchPrice()
  }, [nftDrop] )

  useEffect( () => {
    if(!nftDrop) return;

    const fetchNFTInfoData = async () => {
      const claimed = await nftDrop.getAllClaimed();
      const total = await nftDrop.totalSupply();

      setClaimed(claimed.length)
      setTotalSuply(total)
      setLoading(false)
    }
    fetchNFTInfoData();
  }, [nftDrop] )

  const claimNFT = () => {
    if(!nftDrop || !Address) return;
    const quantity = 1;

    setLoading(true);
    const notification = toast.loading('Claiming NFT...', {
      style: {
        backgroundColor: 'white',
        color: 'green',
        fontWeight: 'bold',
        fontSize: '17px',
        padding: '20px',
      }
    })

    nftDrop.claimTo(Address, quantity).then( async (data) => {
      const receipt = data[0].receipt
      const claimedToken = data[0].id
      const claimedNFT = data[0].data()

      toast('Congrats :)! You have claimed your NFT!')

      console.log(claimedToken)
      console.log(claimedNFT)
      console.log(receipt)
      
    }).catch( error => {
      console.log(error)
    }).finally( () => {
      setLoading(false)
      toast.dismiss(notification)
    });
  }

  return (
    <div className='flex h-screen flex-col lg:grid lg:grid-cols-10'>
      <Toaster position='bottom-center'/>
      {/* left */}
      <div className='bg-[#0d1b2a] lg:col-span-4'>
        <div className='flex flex-col items-center justify-center py-2 lg:min-h-screen'>
          <div className='bg-[#1b263b] p-2 rounded-xl'>
            <img
              className='w-44 rounded-xl object-cover lg:h-96 lg:w-74'
              src={urlFor(collection.previewImage).url()} />
          </div>
          <div className='text-center p-5 space-y-2'>
            <h1 className='text-3xl font-bold text-white'>{collection?.nftCollectionName}</h1>
            <h2 className='text-xl text-gray-300'>{collection?.description}</h2>
          </div>
        </div>
      </div>

      {/* right */}
      <div className='flex flex-1 flex-col p-12 lg:col-span-6'>
      {/* header */}
      <header className='flex items-center justify-between'>
        <Link href={'/'}>
        <h1 className='w-52 cursor-pointer text-xl font-extralight
        sm:w-80'>
          The{' '}
          <span className='font-extrabold underline decoration-[#415a77]'>STAR</span>
          {' '}NFT Market Place
          </h1>
        </Link>
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
        src={urlFor(collection.mainImage).url()}/>
        <h1 className='text-3xl font-bold lg:text-5xl lg:font-extrabold'>
          {collection?.title}
        </h1>

        {
          loading ? 
          (
            <p className='pt-2 text-xl text-[#778da9] animate-bounce'>crafting Nft's...</p>
          ):
          (
            <p className='pt-2 text-xl text-green-500'>{claimed} / {totalSuply?.toString()} NFT's claimed</p>
          )
        }
      </div>
      {/* mint button */}
      <button
      onClick={claimNFT}
      disabled={ loading || claimed === totalSuply?.toNumber() || !Address }
      className='h-16 w-full bg-[#81b29a] text-white rounded-full mt-10 font-bold disabled:bg-gray-400'
      >
        {
          loading ? 
          (
            <>Looking at shelf</>
          ) : claimed === totalSuply?.toNumber()? (
            <>`SOLD OUT :(`</>
          ) : !Address ? (
            <>SingIn to aclaim</>
          ) :
          (
            <span className='font-bold'>Mint NFT ({priceETH} ETH)</span>
          )
        }
        </button>
      </div>
    </div>
  )
}

export default NftDropPage;

export const getServerSideProps: GetServerSideProps = async ({params}) => {
  const query = `*[_type == "collection" && slug.current == $id][0]{
    _id,
    title,
    address,
    description,
    nftCollectionName,
    mainImage {
      asset
    },
    previewImage {
      asset
    },
    slug {
      current
    },
    creator-> {
      _id,
      name,
      address,
      slug {
        current
      },
    },
  }`

  const collection = await sanityClient.fetch(query, {
    id: params?.id
  })

  if(!collection) {
    return {
      notFound: true
    }
  }

  return {
    props: {
      collection
    }
  }
}