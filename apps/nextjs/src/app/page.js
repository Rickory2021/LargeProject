import Image from 'next/image';
import React from 'react';
import Link from 'next/link';

import { Content } from './components/content';
import { Nav } from './components/nav';

export default function HomePage() {
  return (
    <div>
      <Nav />
      <Content />
    </div>
  );
}
