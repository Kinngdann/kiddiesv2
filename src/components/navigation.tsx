import Image from 'next/image';
import Link from 'next/link';

export default function Navigation() {
  const navItems = [
    {name: 'Home', url: '/'},
    {name: 'About', url: 'about'},
    {name: 'Contest', url: 'contest'},
    {name: 'Past Winners', url: 'past-winners'},
    {name: 'Register', url: 'register'},
  ];

  return (
    <nav className="hidden fixed z-10 w-full py-6 px-24 lg:flex justify-between items-center">
      <Image
        className="dark:invert"
        src="/logo.svg"
        alt="Next.js logo"
        width={100}
        height={20}
        priority
      />
      <ul className="flex gap-6">
        {navItems.map((item) => (
          <li key={item.url}>
            <Link
              href={item.url}
              className="text-lg font-bold text-gray-600 hover:text-orange-300 hover:transition-all">
              {item.name}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
