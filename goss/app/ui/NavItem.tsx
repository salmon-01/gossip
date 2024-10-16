import Link from 'next/link';
import { ReactNode } from 'react';

interface NavItemProps {
  href: string;
  icon?: React.ComponentType<any>;
  isActive: boolean;
  label: string;
  children?: ReactNode;
}

function NavItem({
  href,
  icon: Icon,
  isActive,
  label,
  children,
}: NavItemProps) {
  return (
    <Link href={href} aria-label={label} className="w-1/4 md:w-full">
      <div
        className={`relative flex h-16 transform items-center justify-center transition-transform hover:scale-110 md:justify-start md:rounded-xl md:px-14 ${
          isActive
            ? 'bg-gray-300 text-gray-800 dark:bg-darkModeThirdBackground dark:text-white'
            : 'bg-white dark:bg-darkModeSecondaryBackground'
        }`}
      >
        <div className="relative flex items-center justify-center">
          {Icon && (
            <Icon
              className={`${
                isActive ? 'text-[#464548]' : 'text-[#464548]'
              } dark:text-white`}
              size={32}
              style={{ strokeWidth: isActive ? 2.5 : 1 }}
            />
          )}

          {children && children}
        </div>
      </div>
    </Link>
  );
}

export default NavItem;
