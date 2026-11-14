import Link from 'next/link'
import { Suspense } from 'react'
import { navigation } from 'next/cache'

export default function Page(props) {
  return <><h1>Shop</h1><Suspense fallback={<p>Loading catalogue</p>}><Catalogue {...props} /></Suspense></>
}

async function Catalogue({ params, searchParams }) {
  const { region } = await params
  const { category = 'all' } = await searchParams
  return <Suspense key={`${region}:${category}`} fallback={<p>Loading category</p>}>
    <nav>
      <Link href={`/shop/${region}?category=all`} prefetch={true}>All</Link>{' '}
      <Link href={`/shop/${region}?category=home`} prefetch={true}>Home</Link>{' '}
      <Link href={`/shop/no?category=${category}`} prefetch={true}>Norway</Link>
    </nav>
    <p data-testid="category">{region}: {category}</p>
    <Suspense fallback={<p data-testid="pending">Checking stock</p>}>
      <Stock category={category} />
    </Suspense>
  </Suspense>
}

async function Stock({ category }) {
  await navigation()
  return <p data-testid="stock">{category}: 10 in stock</p>
}
