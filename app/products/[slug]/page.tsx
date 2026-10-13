import React from 'react';
import { notFound } from 'next/navigation';
import { getProductBySlug, getAllProductSlugs } from '@/lib/products';
import ProductClient from '@/components/ProductClient';

export async function generateStaticParams() {
  const slugs = getAllProductSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const product = getProductBySlug(params.slug);
  if (!product) {
    return { title: 'Product Not Found — SEROTONINN' };
  }
  return {
    title: `${product.title} — SEROTONINN`,
    description: `${product.title} available on SEROTONINN Berlin. High fashion, made in Ukraine.`,
  };
}

export default function ProductPage({ params }: { params: { slug: string } }) {
  const product = getProductBySlug(params.slug);

  if (!product) {
    notFound();
  }

  return <ProductClient product={product} slug={params.slug} />;
}
