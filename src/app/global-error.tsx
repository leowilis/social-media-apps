'use client';

export default function GlobalError() {
  return (
    <html>
      <body className='flex min-h-screen items-center justify-center bg-black text-white'>
        <div className='text-center'>
          <h1 className='text-3xl font-bold'>Unexpected Error</h1>

          <button
            className='mt-5 rounded-full bg-violet-600 px-6 py-3'
            onClick={() => window.location.reload()}
          >
            Reload
          </button>
        </div>
      </body>
    </html>
  );
}
