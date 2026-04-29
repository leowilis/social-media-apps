'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Eye, EyeOff } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from '@/components/ui/input-group';

import { loginSchema, type LoginFormData } from '@/lib/validations/auth';
import { useAuth } from '../hooks/useAuth';

import Logo from '@/public/assets/logo/Logo.svg';
import Gradient from '@/public/assets/gradient/Gradient.svg';

// Field Error

/**
 * Inline validation error shown below each field.
 * Returns null when there is no message — renders nothing.
 */
function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return (
    <p role='alert' className='text-xs text-red-400 font-medium mt-0.5'>
      {message}
    </p>
  );
}

// Page component

export default function LoginPage() {
  const { login, isLoggingIn, loginError } = useAuth();
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  });

  return (
    <div className='relative min-h-screen overflow-hidden bg-black text-white'>
      <Image
        src={Gradient}
        alt=''
        aria-hidden
        className='absolute bottom-0 pointer-events-none w-full'
      />

      <div className='relative z-10 grid min-h-screen place-items-center px-6 py-8'>
        <Card className='grid w-full gap-4 md:gap-6 rounded-3xl border border-neutral-900 box-border bg-black/20 px-4 py-8 text-white shadow-[0_0_0_1px_rgba(255,255,255,0.03)_inset] backdrop-blur-[2px] md:w-111.5 md:px-6 md:py-10'>
          {/* Header */}
          <div className='grid gap-4 md:gap-6'>
            <div className='flex items-center gap-3 justify-center'>
              <Image
                src={Logo}
                alt='Sociality logo'
                width={30}
                height={30}
                priority
              />
              <span className='text-2xl leading-none font-bold'>Sociality</span>
            </div>
            <h1 className='text-xl md:display-xs font-bold text-center'>
              Welcome Back!
            </h1>
          </div>

          {/* Form */}
          <form
            className='grid gap-5'
            onSubmit={handleSubmit(login)} // ← no wrapper needed
            noValidate
          >
            {/* Server error — specific API message, not generic */}
            {loginError && (
              <p role='alert' className='text-sm text-red-400 text-center'>
                {loginError}
              </p>
            )}

            {/* Email */}
            <div className='grid gap-0.5'>
              <Label className='text-sm font-bold' htmlFor='email'>
                Email
              </Label>
              <div className='flex h-12 items-center rounded-xl border border-neutral-900 box-border bg-neutral-950 px-5'>
                <Input
                  id='email'
                  type='email'
                  autoComplete='email'
                  placeholder='Enter your email'
                  {...register('email')}
                  className='text-md h-full w-full border-0 bg-transparent p-0 text-base-pure-white shadow-none placeholder:text-neutral-600 placeholder:font-semibold focus-visible:border-transparent focus-visible:ring-0'
                />
              </div>
              <FieldError message={errors.email?.message} />
            </div>

            {/* Password */}
            <div className='grid gap-0.5'>
              <Label className='text-sm font-bold' htmlFor='password'>
                Password
              </Label>
              <InputGroup className='flex h-12 items-center rounded-xl border border-neutral-900 box-border bg-neutral-950 px-5'>
                <InputGroupInput
                  id='password'
                  type={showPassword ? 'text' : 'password'}
                  autoComplete='current-password'
                  placeholder='Enter your password'
                  {...register('password')}
                  className='text-md h-full w-full p-0 text-white placeholder:text-neutral-600 placeholder:font-semibold focus-visible:border-transparent focus-visible:ring-0'
                />
                <InputGroupAddon align='inline-end' className='pr-0'>
                  <InputGroupButton
                    type='button'
                    variant='ghost'
                    size='icon-sm'
                    aria-label={
                      showPassword ? 'Hide password' : 'Show password'
                    }
                    onClick={() => setShowPassword((v) => !v)}
                    className='inline-flex h-10 w-10 items-center justify-center rounded-full text-neutral-500 transition-colors hover:bg-transparent hover:text-neutral-300'
                  >
                    {showPassword ? (
                      <EyeOff className='h-6 w-6' strokeWidth={2.2} />
                    ) : (
                      <Eye className='h-6 w-6' strokeWidth={2.2} />
                    )}
                  </InputGroupButton>
                </InputGroupAddon>
              </InputGroup>
              <FieldError message={errors.password?.message} />
            </div>

            {/* Submit */}
            <Button
              type='submit'
              disabled={isLoggingIn}
              variant='ghost'
              className='text-md flex h-11 md:h-12 items-center justify-center rounded-full bg-primary-300 font-bold text-base-pure-white hover:bg-primary-200 hover:text-base-pure-white transition-transform duration-200 hover:scale-[1.01] active:scale-[0.99] disabled:opacity-60'
            >
              {isLoggingIn ? (
                <span className='flex items-center gap-2'>
                  <span className='size-4 rounded-full border-2 border-white border-t-transparent animate-spin' />
                  Loading...
                </span>
              ) : (
                'Login'
              )}
            </Button>
          </form>

          {/* Footer */}
          <p className='text-sm md:text-md flex items-center justify-center gap-2 leading-none font-bold text-white'>
            <span>Don&apos;t have an account?</span>
            <Link
              href='/register'
              className='text-primary-200 hover:text-gray-400'
            >
              Register
            </Link>
          </p>
        </Card>
      </div>
    </div>
  );
}
