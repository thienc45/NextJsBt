import { ModeToggle } from '@/components/ui/mode-toggle'
import React from 'react'
import RegisterForm from './register-from';

export default function RegisterPage() {
    return (
        <div>

            <h1 className='text-xl font-semibold text-center'>Đăng ký</h1>
            <div className='flex justify-center'>
                <RegisterForm />
            </div>
            Register page
        </div>
    )
}
