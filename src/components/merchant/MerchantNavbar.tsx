'use client';

import { Menu } from 'lucide-react';
import { useState } from 'react';
import MerchantSidebar from './MerchantSidebar';

export default function MerchantNavbar() {

  const [open, setOpen] = useState(false);

  return (
    <>
      <header className="md:hidden flex items-center justify-between bg-white border-b p-4">

        <h1 className="font-bold text-primary-600">
          AmieRoute
        </h1>

        <button onClick={() => setOpen(true)}>
          <Menu className="h-6 w-6"/>
        </button>

      </header>


      {open && (
        <div className="fixed inset-0 z-50 md:hidden">

          {/* Overlay */}
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setOpen(false)}
          />


          {/* Sidebar */}
          <div className="relative w-64 h-full bg-white">

            <MerchantSidebar />

          </div>

        </div>
      )}

    </>
  );
}