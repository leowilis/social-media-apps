'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Eye, EyeOff } from 'lucide-react';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from '@/components/ui/input-group';
import { Label } from '@/components/ui/label';

import { registerSchema, type RegisterFormData } from '@/lib/api/auth';
import { useAuth } from '@/hooks/auth/useAuth';

import Logo from '@/public/assets/logo/Logo.svg';
import Gradient from '@/public/assets/gradient/Gradient.svg';

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return <p className='text-xs text-red-400 font-medium mt-0.5'>{message}</p>;
}

/**
 * Register page.
 *
 * Uses React Hook Form + Zod for validation.
 * Auth logic (token persistence, redirect) is handled inside `useAuth`.
 */
export default function RegisterPage() {
  const { register: registerUser, isRegistering, registerError } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: '',
      username: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
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
        <Card className='grid w-full gap-5 md:gap-6 rounded-3xl border border-neutral-900/20 box-border bg-neutral-950 px-4 py-8 text-white md:w-111.5 md:px-6 md:py-10'>
          {/* Header */}
          <div className='grid gap-5 md:gap-6'>
            <div className='flex items-center gap-3 justify-center'>
              <Image
                src={Logo}
                alt='Sociality'
                width={30}
                height={30}
                priority
              />
              <span className='text-3xl leading-none font-bold'>Sociality</span>
            </div>
            <h1 className='text-2xl md:display-xs font-bold text-center'>
              Register
            </h1>
          </div>

          {/* Server error */}
          {registerError && (
            <p className='text-sm text-red-400 text-center font-semibold'>
              {registerError}
            </p>
          )}

          {/* Form */}
          <form
            className='grid gap-6'
            onSubmit={handleSubmit((values) => registerUser(values))}
            noValidate
          >
            {/* Name */}
            <div className='grid gap-0.5'>
              <Label className='text-sm font-bold' htmlFor='name'>
                Name
              </Label>
              <div className='flex h-12 items-center rounded-xl border border-neutral-900 box-border bg-neutral-950 px-5'>
                <Input
                  id='name'
                  type='text'
                  autoComplete='name'
                  placeholder='Enter your name'
                  {...register('name')}
                  className='text-md h-full w-full border-0 bg-transparent p-0 text-base-pure-white shadow-none placeholder:text-neutral-600 placeholder:font-semibold focus-visible:border-transparent focus-visible:ring-0'
                />
              </div>
              <FieldError message={errors.name?.message} />
            </div>

            {/* Username */}
            <div className='grid gap-0.5'>
              <Label className='text-sm font-bold' htmlFor='username'>
                Username
              </Label>
              <div className='flex h-12 items-center rounded-xl border border-neutral-900 box-border bg-neutral-950 px-5'>
                <Input
                  id='username'
                  type='text'
                  autoComplete='username'
                  placeholder='Enter your username'
                  {...register('username')}
                  className='text-md h-full w-full border-0 bg-transparent p-0 text-base-pure-white shadow-none placeholder:text-neutral-600 placeholder:font-semibold focus-visible:border-transparent focus-visible:ring-0'
                />
              </div>
              <FieldError message={errors.username?.message} />
            </div>

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
                  autoComplete='new-password'
                  placeholder='Enter your password'
                  {...register('password')}
                  className='text-md h-full w-full p-0 text-white placeholder:text-neutral-600 placeholder:font-semibold focus-visible:border-transparent focus-visible:ring-0'
                />
                <InputGroupAddon align='inline-end' className='pr-0'>
                  <InputGroupButton
                    type='button'
                    variant='ghost'
                    size='icon-sm'
                    className='inline-flex h-10 w-10 items-center justify-center rounded-full text-neutral-500 transition-colors hover:bg-transparent hover:text-neutral-300'
                    aria-label={
                      showPassword ? 'Hide password' : 'Show password'
                    }
                    onClick={() => setShowPassword((v) => !v)}
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

            {/* Confirm Password */}
            <div className='grid gap-0.5'>
              <Label className='text-sm font-bold' htmlFor='confirmPassword'>
                Confirm Password
              </Label>
              <InputGroup className='flex h-12 items-center rounded-xl border border-neutral-900 box-border bg-neutral-950 px-5'>
                <InputGroupInput
                  id='confirmPassword'
                  type={showConfirmPassword ? 'text' : 'password'}
                  autoComplete='new-password'
                  placeholder='Re-enter your password'
                  {...register('confirmPassword')}
                  className='text-md h-full w-full p-0 text-white placeholder:text-neutral-600 placeholder:font-semibold focus-visible:border-transparent focus-visible:ring-0'
                />
                <InputGroupAddon align='inline-end' className='pr-0'>
                  <InputGroupButton
                    type='button'
                    variant='ghost'
                    size='icon-sm'
                    className='inline-flex h-10 w-10 items-center justify-center rounded-full text-neutral-500 transition-colors hover:bg-transparent hover:text-neutral-300'
                    aria-label={
                      showConfirmPassword ? 'Hide password' : 'Show password'
                    }
                    onClick={() => setShowConfirmPassword((v) => !v)}
                  >
                    {showConfirmPassword ? (
                      <EyeOff className='h-6 w-6' strokeWidth={2.2} />
                    ) : (
                      <Eye className='h-6 w-6' strokeWidth={2.2} />
                    )}
                  </InputGroupButton>
                </InputGroupAddon>
              </InputGroup>
              <FieldError message={errors.confirmPassword?.message} />
            </div>

            <Button
              type='submit'
              disabled={isRegistering}
              variant='ghost'
              className='text-md flex h-11 md:h-12 items-center justify-center rounded-full bg-primary-300 font-bold text-base-pure-white hover:bg-primary-200 hover:text-base-pure-white transition-transform duration-200 hover:scale-[1.01] active:scale-[0.99] disabled:opacity-60'
            >
              {isRegistering ? 'Loading...' : 'Submit'}
            </Button>
          </form>

          {/* Footer */}
          <p className='text-sm md:text-md flex items-center justify-center gap-2 leading-none font-bold text-white'>
            <span>Already have an account?</span>
            <Link
              href='/login'
              className='text-primary-200 hover:text-gray-400'
            >
              Log in
            </Link>
          </p>
        </Card>
      </div>
    </div>
  );
}
