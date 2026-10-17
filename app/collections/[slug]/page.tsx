import React from 'react';
import { getAllCollectionSlugs, getCollectionBySlug } from '@/lib/products';
import CollectionClient from '@/components/CollectionClient';

export async function generateStaticParams() {
  const slugs = getAllCollectionSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const col = getCollectionBySlug(params.slug);
  const name = col ? col.name : params.slug.toUpperCase().replace(/-/g, ' ');
  return {
    title: `${name} — BONEZ Collection`,
    description: col?.description || `Explore ${name} by BONEZ. Where Glam Meets Grunge.`,
  };
}

export default function CollectionSlugPage({ params }: { params: { slug: string } }) {
  return <CollectionClient collectionSlug={params.slug} />;
}
