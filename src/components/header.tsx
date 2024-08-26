import React from 'react'
import { ModeToggle } from './ui/mode-toggle'
import Link from 'next/link'
import ButtonLogout from './ui/button-logout'
import { cookies } from 'next/headers';
import accountApiRequest from '@/apirequest/account';
import { AccountResType } from '../app/schemaValidations/account.schema';

export default  function Header( {user} : { user: AccountResType['data'] | null}) {


  return (
    <div>
      <ul className='flex mr-11'>
        <li>  <Link href="/products">Sản phẩm</Link></li>
        {user ? (
          <>
            <li>
              <Link href={'/me'}>
                Xin chào <strong>{user.name}</strong>
              </Link>
            </li>
            <li>
              <ButtonLogout />
            </li>
          </>
        ) : (
          <>
            <li>
              <Link href='/login'>Đăng nhập</Link>
            </li>
            <li>
              <Link href='/register'>Đăng ký</Link>
            </li>
          </>
        )}
      </ul>
      <ModeToggle />
    </div>
  )
}
