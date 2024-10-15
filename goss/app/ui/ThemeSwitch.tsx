'use client';

import { FiSun, FiMoon } from 'react-icons/fi';
import { RiMoonClearFill } from 'react-icons/ri';
import { IoMdSunny } from 'react-icons/io';
import { FaSun } from 'react-icons/fa';
import { CiLight } from 'react-icons/ci';
import { MdLightMode } from 'react-icons/md';
import { IoSunny } from 'react-icons/io5';
import { useState, useEffect } from 'react';
import { useTheme } from 'next-themes';
import Image from 'next/image';

export default function ThemeSwitch() {
  const [mounted, setMounted] = useState(false);
  const { setTheme, resolvedTheme } = useTheme();

  useEffect(() => setMounted(true), []);

  if (!mounted)
    return (
      <Image
        src="data:image/svg+xml;base64,PHN2ZyBzdHJva2U9IiNGRkZGRkYiIGZpbGw9IiNGRkZGRkYiIHN0cm9rZS13aWR0aD0iMCIgdmlld0JveD0iMCAwIDI0IDI0IiBoZWlnaHQ9IjIwMHB4IiB3aWR0aD0iMjAwcHgiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjIwIiBoZWlnaHQ9IjIwIiB4PSIyIiB5PSIyIiBmaWxsPSJub25lIiBzdHJva2Utd2lkdGg9IjIiIHJ4PSIyIj48L3JlY3Q+PC9zdmc+Cg=="
        width={36}
        height={36}
        sizes="36x36"
        alt="Loading Light/Dark Toggle"
        priority={false}
        title="Loading Light/Dark Toggle"
        data-testid="loading-image"
      />
    );

  if (resolvedTheme === 'dark') {
    return (
      <>
        <div className="flex items-center space-x-2">
          <p className="text-base text-white">Switch theme</p>
          <button
            className="flex items-center justify-center rounded-full bg-gray-700 p-2 shadow-md transition duration-300 ease-in-out hover:bg-gray-600 focus:outline-none"
            data-testid="sun-icon"
            type="button"
            aria-label="Switch to light theme"
            onClick={() => setTheme('light')}
          >
            <IoSunny className="h-5 w-5 text-yellow-100" />
          </button>
        </div>
      </>
    );
  }

  if (resolvedTheme === 'light') {
    return (
      <>
        <div className="flex items-center space-x-2">
          <p className="text-base text-black">Switch theme</p>
          <button
            className="flex items-center justify-center rounded-full bg-gray-300 p-2 shadow-md transition duration-300 ease-in-out hover:bg-gray-400 focus:outline-none"
            data-testid="moon-icon"
            type="button"
            aria-label="Switch to dark theme"
            onClick={() => setTheme('dark')}
          >
            <RiMoonClearFill className="h-5 w-5 text-slate-800" />
          </button>
        </div>
      </>
    );
  }
}
