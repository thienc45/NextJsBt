// import productApiRequest from '@/apiRequests/product'
import productApiRequest from '@/apirequest/product'
import { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import ProductAddButton from './_components/product-add-button'
import ProductEditButton from './_components/product-edit-button'
import { cookies } from 'next/headers'
// import ProductEditButton from '@/app/products/_components/product-edit-button'
// import ProductAddButton from '@/app/products/_components/product-add-button'

export const metadata: Metadata = {
  title: 'Danh sách sản phẩm',
  description: 'Danh sách sản phẩm của Productic, được tạo bởi Được dev'
}

export default async function ProductListPage() {

  const cookieStore = cookies();
  const sessionToken = cookieStore.get('sessionToken')?.value;
  const isAuthenticated = Boolean(sessionToken)

  const { payload } = await productApiRequest.getList()
  const productList = payload.data
  return (
    <div className='space-y-3 flex  '>
      <h1>Product List</h1>

      {isAuthenticated && <ProductAddButton />}


      <div className=' flex mr-20  '>
        {productList.map((product) => (
          <div key={product.id} className=''>
            <Link href={`/products/${product.id}`}>
              <Image
                src={product.image}
                alt={product.name}
                width={180}
                height={180}
                className='w-32 h-32 object-cover'
              />
            </Link>

            <h3>{product.name}</h3>
            <div>{product.price}</div>

            {isAuthenticated && <ProductEditButton product={product} />}

          </div>
        ))}
      </div>
    </div>
  )
}
