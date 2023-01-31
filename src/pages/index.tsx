import { GetServerSideProps } from 'next';
import { sanityClient, urlFor } from '../../sanity'
import Head from 'next/head'
import { Collection } from 'typings';
import Link from 'next/link';

interface Props {
  collections: Collection[]
}

export default function Home({ collections }: Props) {
  return (
    <div className='max-w-7xl mx-auto flex flex-col min-h-screen
    py-20 px-10 2xl:px-0'>
      <Head>
        <title>STARDROP - Nicolas Sousa</title>
        <meta name="description" content="web3 NFT Drop created with nextJs :)" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <h1 className='mb-10 text-4xl font-extralight'>
          The{' '}
          <span className='font-extrabold underline decoration-[#415a77]'>STAREACT</span>
          {' '}NFT Market Place
      </h1>

      <main className='bg-slate-100 p-10 shadow-xl shadow-[#415a77]'>
        <div className='grid space-x-3 md:grid-cols-2 lg:grid-cols-3  2xl:grid-cols-4'>
          {collections.map(collection => (
            <Link href={`/nft/${collection.slug.current}`}>
            <div className='flex flex-col items-center cursor-pointer transition-all duration-200
            hover:scale-105'>
              <img 
              className='h-96 w-60 rounded-2xl object-cover'
              src={urlFor(collection.mainImage).url()} alt=''/>

              <div className='p-5'>
                <h2 className='text-3xl'>{collection.title}</h2>
                <p className='mt-2 text-sm text-gray-400'>{collection.description}</p>
              </div>
            </div>
            </Link>
          ))}
        </div>
      </main>
    </div>
  )
}

export const getServerSideProps: GetServerSideProps = async () => {
  const query = `*[_type == "collection"]{
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
      }
    }
  }`
  const collections = await sanityClient.fetch(query)

  return {
    props: {
      collections
    }
  }
};
