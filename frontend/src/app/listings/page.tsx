import SearchClient from '@/components/SearchClient';

export default async function ListingsPage(props: { searchParams: Promise<Record<string, string>> }) {
  const paramsString = new URLSearchParams(await props.searchParams).toString();
  const res = await fetch(`http://localhost:4000/api/listings?${paramsString}`, { cache: 'no-store' });
  const data = res.ok ? await res.json() : { data: [], meta: { total: 0 } };

  return (
    <div className="container">
      <h1 className="gradient-text" style={{ fontSize: '3rem', margin: '40px 0 20px 0' }}>
        Discover Premium Properties
      </h1>
      <p className="text-muted" style={{ fontSize: '1.2rem', marginBottom: '40px' }}>
        Find your dream home with advanced search and exclusive insights.
      </p>
      <SearchClient initialData={data.data} initialMeta={data.meta} searchParams={await props.searchParams} />
    </div>
  );
}
