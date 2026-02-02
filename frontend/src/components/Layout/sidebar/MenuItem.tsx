import { Link, useLocation } from 'react-router-dom';

interface MenuItemProps {
  icon: string;
  label: string;
  to: string;
  isSpecial?: boolean;
}

export const MenuItem = ({ icon, label, to, isSpecial }: MenuItemProps) => {
  const location = useLocation();
  const isActive = location.pathname === to;

  return (
    <Link
      to={to}
      className={`
        flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 group
        ${isActive 
          ? 'bg-gray-100 text-black font-black shadow-sm'  
          : 'text-gray-500 hover:bg-gray-50 hover:text-black font-medium'
        }
        ${isSpecial ? 'mt-2 border border-dashed border-gray-300 hover:border-black' : ''}
      `}
    >
      <i 
        className={`
          ${icon} text-lg transition-colors
          ${isActive ? 'text-black font-bold' : 'text-gray-400 group-hover:text-black'}
        `} 
      />
      <span className="text-sm tracking-wide">{label}</span>
      {isActive && !isSpecial && (
        <div className="ml-auto w-1.5 h-1.5 rounded-full bg-black" />
      )}
    </Link>
  );
};