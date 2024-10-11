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
    <Link href={href} aria-label={label} className="w-1/4">
      <div
        className={`flex h-16 transform items-center justify-center transition-transform hover:scale-110 ${
          isActive ? 'bg-purple-100' : 'bg-white'
        }`}
      >
        {children ||
          (Icon && (
            <Icon
              color={isActive ? '#9333ea' : '#7b53bb'}
              size={32}
              style={{ strokeWidth: isActive ? 2.5 : 1 }}
            />
          ))}
      </div>
    </Link>
  );
}

export default NavItem;
