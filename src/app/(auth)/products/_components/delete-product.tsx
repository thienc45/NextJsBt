'use client'

import productApiRequest from '@/apirequest/product'
import { Button } from '@/components/ui/button'
import { useToast } from '@/components/ui/use-toast'
import { handleErrorApi } from '@/lib/utils'
import { useRouter } from 'next/navigation'

import { ProductResType } from '@/app/schemaValidations/product.schema'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@radix-ui/react-alert-dialog'

export default function DeleteProduct({
  product
}: {
  product: ProductResType['data']
}) {
  const { toast } = useToast()
  const router = useRouter()

  const deleteProduct = async () => {
    try {
      const result = await productApiRequest.delete(product.id)
      toast({
        description: result.payload.message
      })
      router.refresh()
    } catch (error) {
      handleErrorApi({ error })
    }
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="destructive">Delete</Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogTitle>Bạn có muốn xóa sản phẩm không?</AlertDialogTitle>
        <AlertDialogDescription>
          Sản phẩm &rdquo;{product.name}&rdquo; sẽ bị xóa vĩnh viễn!
        </AlertDialogDescription>
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 20 }}>
          <AlertDialogCancel asChild>
            <Button variant="ghost">Cancel</Button>
          </AlertDialogCancel>
          <AlertDialogAction asChild>
            <Button variant="destructive" onClick={deleteProduct}>
              Continue
            </Button>
          </AlertDialogAction>
        </div>
      </AlertDialogContent>
    </AlertDialog>
  )
}
