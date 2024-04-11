'use client';
import * as React from 'react';
import Link from 'next/link';

import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuIndicator,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  NavigationMenuViewport
} from '@/components/ui/navigation-menu';
import { cn } from '@/lib/utils';
import { navigationMenuTriggerStyle } from '@/components/ui/navigation-menu';
import { GiKnifeFork } from 'react-icons/gi';

export function Nav() {
  return (
    <div className="flex flex-1 flex-row justify-center">
      <nav className="bg-blue-600 p-4 w-full">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex-shrink-0">
            <Link href="./" className="text-white text-xl font-bold">
              <GiKnifeFork size="28" />
              Slicer
            </Link>
          </div>
          <NavigationMenu>
            <NavigationMenuList className="pl-16">
              <NavigationMenuItem className="pr-4">
                <NavigationMenuTrigger>Getting started</NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid gap-3 p-4 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]">
                    <ListItem title="Sign up">
                      Easily create an account and get started
                    </ListItem>
                    <ListItem title="Sign in">
                      Sign in with your username and password to access your
                      account
                    </ListItem>
                    <ListItem title="Mobile">Download our mobile app</ListItem>
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>
              <NavigationMenuItem className="pr-4">
                <NavigationMenuTrigger>Pricing</NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid gap-3 p-4 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]">
                    <ListItem title="Basic">
                      100% free to use. Includes most features
                    </ListItem>
                    <ListItem title="Pro">
                      Currently there is no paid tier but we are working on it
                    </ListItem>
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <Link
                  href="https://github.com/POOSDSpring2024/LargeProject"
                  legacyBehavior
                  passHref
                >
                  <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                    Github
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
          <div className="hidden md:block .justify-center ">
            <Link href="/sign-in" className="px-5">
              <button className=" text-white font-bold hover:bg-blue-700 px-3 py-2 rounded-md">
                Log In
              </button>
            </Link>

            <Link href="/sign-up">
              <button className="font-bold text-blue-600 bg-white hover:bg-blue-700 hover:text-white px-3 py-2 rounded-md">
                Get Started
              </button>
            </Link>
          </div>
        </div>
      </nav>
    </div>
  );
}

const ListItem = React.forwardRef(
  ({ className, title, children, ...props }, ref) => {
    return (
      <li>
        <NavigationMenuLink asChild>
          <a
            ref={ref}
            className={cn(
              'block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground',
              className
            )}
            {...props}
          >
            <div className="text-sm font-medium leading-none">{title}</div>
            <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
              {children}
            </p>
          </a>
        </NavigationMenuLink>
      </li>
    );
  }
);

ListItem.displayName = 'ListItem';
