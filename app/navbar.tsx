'use client';

import { Fragment } from 'react';
import { usePathname } from 'next/navigation';
import { Disclosure, Menu, Transition } from '@headlessui/react';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import { signIn, signOut } from 'next-auth/react';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { User } from 'next-auth';

const navigation = [{ name: 'Your lists', href: '/' }];

export default function Navbar({ user }: { user: User }) {
  const pathname = usePathname();

  return (
    <Disclosure as="nav" className="bg-white shadow-sm">
      {({ open }) => (
        <>
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex h-16 justify-between">
              <div className="flex">
                <div className="flex flex-shrink-0 items-center">
                  <Link href={'/'} prefetch={true}>
                    <svg
                      width="32"
                      height="32"
                      viewBox="0 0 32 32"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <circle cx="16" cy="16" r="16" fill="#454545" />
                      <path
                        d="M10.876 22.5676C10.432 22.231 10.3245 21.8909 10.5537 21.5471L11.3809 20.301C11.653 19.8928 12.0505 19.8713 12.5732 20.2366C12.9743 20.5159 13.4971 20.8059 14.1416 21.1067C14.7933 21.4003 15.4772 21.5471 16.1934 21.5471C16.6947 21.5471 17.1781 21.4898 17.6436 21.3752C18.109 21.2607 18.4635 21.0387 18.707 20.7092C18.9505 20.3798 19.0723 19.9895 19.0723 19.5383C19.0723 19.2161 19.0186 18.9332 18.9111 18.6897C18.8037 18.4462 18.6283 18.2457 18.3848 18.0881C18.1413 17.9306 17.8906 17.7981 17.6328 17.6907C17.1816 17.5045 16.6123 17.3219 15.9248 17.1428C15.2445 16.9566 14.5713 16.7346 13.9053 16.4768C13.3109 16.2476 12.7666 15.9325 12.2725 15.5315C11.7783 15.1305 11.3952 14.6793 11.123 14.178C10.8509 13.6767 10.7148 13.0071 10.7148 12.1692C10.7148 11.1737 11.0371 10.3215 11.6816 9.61255C12.3262 8.90356 13.0674 8.44881 13.9053 8.24829C14.7432 8.04777 15.5882 7.94751 16.4404 7.94751C17.2855 7.94751 18.1556 8.07642 19.0508 8.33423C19.9531 8.59204 20.6335 8.91431 21.0918 9.30103C21.543 9.68058 21.654 10.0243 21.4248 10.3323L20.5547 11.5032C20.2611 11.9042 19.8672 11.9364 19.373 11.5999C19.0579 11.385 18.6247 11.1451 18.0732 10.8801C17.529 10.6152 16.9596 10.4827 16.3652 10.4827C15.9427 10.4827 15.5524 10.5185 15.1943 10.5901C14.8434 10.6617 14.5319 10.8336 14.2598 11.1057C13.9876 11.3778 13.8516 11.7144 13.8516 12.1155C13.8516 12.5022 13.9518 12.8173 14.1523 13.0608C14.3529 13.2971 14.5749 13.4762 14.8184 13.5979C15.0618 13.7125 15.3089 13.8092 15.5596 13.8879C16.333 14.1386 17.0241 14.3606 17.6328 14.554C18.2415 14.7402 18.8037 14.9478 19.3193 15.177C20.0355 15.4993 20.5833 15.8215 20.9629 16.1438C21.3424 16.4661 21.654 16.9065 21.8975 17.4651C22.1481 18.0237 22.2734 18.6897 22.2734 19.4631C22.2734 20.609 21.9082 21.5579 21.1777 22.3098C20.4473 23.0546 19.6344 23.5344 18.7393 23.7493C17.8512 23.9713 16.9847 24.0823 16.1396 24.0823C14.8936 24.0823 13.8802 23.9605 13.0996 23.717C12.319 23.4807 11.5778 23.0976 10.876 22.5676Z"
                        fill="white"
                      />
                    </svg>
                  </Link>
                </div>

                <div className="hidden sm:-my-px sm:ml-6 sm:flex sm:space-x-8">
                  {user &&
                    navigation.map((item) => (
                      <Link
                        prefetch={true}
                        key={item.name}
                        href={item.href}
                        className={cn(
                          pathname === item.href
                            ? 'border-slate-500 text-gray-900'
                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300',
                          'inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium'
                        )}
                        aria-current={
                          pathname === item.href ? 'page' : undefined
                        }
                      >
                        {item.name}
                      </Link>
                    ))}
                </div>
              </div>
              <div className="hidden sm:ml-6 sm:flex sm:items-center">
                {user && (
                  <Menu as="div" className="relative ml-3">
                    <div>
                      <Menu.Button className="flex rounded-full bg-white text-sm focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2">
                        <span className="sr-only">Open user menu</span>
                        <Image
                          className="h-8 w-8 rounded-full"
                          src={user?.image || 'https://avatar.vercel.sh/leerob'}
                          height={32}
                          width={32}
                          alt={`${user?.name || 'placeholder'} avatar`}
                        />
                      </Menu.Button>
                    </div>
                    <Transition
                      as={Fragment}
                      enter="transition ease-out duration-200"
                      enterFrom="transform opacity-0 scale-95"
                      enterTo="transform opacity-100 scale-100"
                      leave="transition ease-in duration-75"
                      leaveFrom="transform opacity-100 scale-100"
                      leaveTo="transform opacity-0 scale-95"
                    >
                      <Menu.Items className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                        {user ? (
                          <Menu.Item>
                            {({ active }) => (
                              <button
                                className={cn(
                                  active ? 'bg-gray-100' : '',
                                  'flex w-full px-4 py-2 text-sm text-gray-700'
                                )}
                                onClick={() => signOut()}
                              >
                                Sign out
                              </button>
                            )}
                          </Menu.Item>
                        ) : (
                          <Menu.Item>
                            {({ active }) => (
                              <button
                                className={cn(
                                  active ? 'bg-gray-100' : '',
                                  'flex w-full px-4 py-2 text-sm text-gray-700'
                                )}
                                onClick={() => signIn('google')}
                              >
                                Sign in
                              </button>
                            )}
                          </Menu.Item>
                        )}
                      </Menu.Items>
                    </Transition>
                  </Menu>
                )}
              </div>
              <div className="-mr-2 flex items-center sm:hidden">
                {user && (
                  <Disclosure.Button className="inline-flex items-center justify-center rounded-md bg-white p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2">
                    <span className="sr-only">Open main menu</span>
                    {open ? (
                      <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
                    ) : (
                      <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
                    )}
                  </Disclosure.Button>
                )}
              </div>
            </div>
          </div>

          <Disclosure.Panel className="sm:hidden">
            <div className="space-y-1 pt-2 pb-3">
              {user &&
                navigation.map((item) => (
                  <Disclosure.Button
                    key={item.name}
                    as="a"
                    href={item.href}
                    className={cn(
                      pathname === item.href
                        ? 'bg-slate-50 border-slate-500 text-slate-700'
                        : 'border-transparent text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800',
                      'block pl-3 pr-4 py-2 border-l-4 text-base font-medium'
                    )}
                    aria-current={pathname === item.href ? 'page' : undefined}
                  >
                    {item.name}
                  </Disclosure.Button>
                ))}
            </div>
            <div className="border-t border-gray-200 pt-4 pb-3">
              {user ? (
                <>
                  <div className="flex items-center px-4">
                    <div className="flex-shrink-0">
                      <Image
                        className="h-8 w-8 rounded-full"
                        src={user.image}
                        height={32}
                        width={32}
                        alt={`${user.name} avatar`}
                      />
                    </div>
                    <div className="ml-3">
                      <div className="text-base font-medium text-gray-800">
                        {user.name}
                      </div>
                      <div className="text-sm font-medium text-gray-500">
                        {user.email}
                      </div>
                    </div>
                  </div>
                  <div className="mt-3 space-y-1">
                    <button
                      onClick={() => signOut()}
                      className="block px-4 py-2 text-base font-medium text-gray-500 hover:bg-gray-100 hover:text-gray-800"
                    >
                      Sign out
                    </button>
                  </div>
                </>
              ) : (
                <div className="mt-3 space-y-1">
                  <button
                    onClick={() => signIn('google')}
                    className="flex w-full px-4 py-2 text-base font-medium text-gray-500 hover:bg-gray-100 hover:text-gray-800"
                  >
                    Sign in
                  </button>
                </div>
              )}
            </div>
          </Disclosure.Panel>
        </>
      )}
    </Disclosure>
  );
}
