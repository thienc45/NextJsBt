// import productApiRequest from '@/apiRequests/product'
import productApiRequest from '@/apirequest/product'
import { baseOpenGraph } from '@/app/shared-metadata'
import envConfig from '@/config'
import { Metadata, ResolvingMetadata } from 'next'
import Image from 'next/image'
import { cache } from 'react'

const getDetail = cache(productApiRequest.getDetail)

type Props = {
  params: { id: string }
  searchParams: { [key: string]: string | string[] | undefined }
}


export async function generateMetadata(
  { params, searchParams }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  try {
    const { payload } = await getDetail(Number(params.id));

    // Kiểm tra nếu payload hoặc data không tồn tại
    if (!payload || !payload.data) {
      throw new Error("Không tìm thấy dữ liệu sản phẩm");
    }

    const product = payload.data;

    const url = envConfig.NEXT_PUBLIC_URL + '/products/' + product.id;

    return {
      title: product.name,
      description: product.description,
      openGraph: {
        ...baseOpenGraph,
        title: product.name,
        description: product.description,
        url,
        images: [
          {
            url: product.image || '', // Đảm bảo rằng product.image tồn tại
          },
        ],
      },
      alternates: {
        canonical: url,
      },
    };
  } catch (error: any) {
    console.error("Lỗi khi tạo metadata:", error);

    // Trả về metadata mặc định nếu xảy ra lỗi
    return {
      title: "Sản phẩm không tồn tại",
      description: "Sản phẩm không thể tìm thấy",
    };
  }
}


export default async function ProductDetail({ params, searchParams }: Props) {
  let product = null
  try {
    const { payload } = await getDetail(Number(params.id))
    product = payload.data
  } catch (error) {
    console.error(error + "999")
  }

  return (
    <div>
      <h2>Product Detail</h2>
      {!product && <div>Không tìm thấy sản phẩm</div>}
      {product && (
        <div>
          <Image
            src={product.image}
            alt={product.name}
            width={180}
            height={180}
            className='w-32 h-32 object-cover'
          />

          <h3>{product.name}</h3>
          <div>{product.price}</div>
        </div>
      )}
    </div>
  )
}
