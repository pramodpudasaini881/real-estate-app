'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import Link from 'next/link';

export default function SearchClient({ initialData, initialMeta, searchParams }: any) {
  const router = useRouter();
  
  const [filters, setFilters] = useState({
    keyword: searchParams.keyword || '',
    price_min: searchParams.price_min || '',
    price_max: searchParams.price_max || '',
    beds: searchParams.beds || '',
    baths: searchParams.baths || '',
    propertyType: searchParams.propertyType || ''
  });

  const updateFilter = (k: string, v: string) => {
    setFilters(prev => ({ ...prev, [k]: v }));
  };

  const applyFilters = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const query = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value) query.append(key, String(value));
    });
    router.push(`/listings?${query.toString()}`);
  };

  return (
    <div className="layout-search">
      <aside className="sidebar">
        <h3 style={{ marginBottom: '24px' }}>Filters</h3>
        <form onSubmit={applyFilters} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', color: 'var(--muted)' }}>Keyword</label>
            <input type="text" className="input" placeholder="Search title or location..." value={filters.keyword} onChange={e => updateFilter('keyword', e.target.value)} />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', color: 'var(--muted)' }}>Min Price</label>
            <input type="number" className="input" placeholder="e.g. 100000" value={filters.price_min} onChange={e => updateFilter('price_min', e.target.value)} />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', color: 'var(--muted)' }}>Max Price</label>
            <input type="number" className="input" placeholder="e.g. 1000000" value={filters.price_max} onChange={e => updateFilter('price_max', e.target.value)} />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
             <div>
                <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', color: 'var(--muted)' }}>Beds</label>
                <select className="select" value={filters.beds} onChange={e => updateFilter('beds', e.target.value)}>
                  <option value="">Any</option>
                  <option value="1">1+</option>
                  <option value="2">2+</option>
                  <option value="3">3+</option>
                  <option value="4">4+</option>
                  <option value="5">5+</option>
                </select>
             </div>
             <div>
                <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', color: 'var(--muted)' }}>Baths</label>
                <select className="select" value={filters.baths} onChange={e => updateFilter('baths', e.target.value)}>
                  <option value="">Any</option>
                  <option value="1">1+</option>
                  <option value="2">2+</option>
                  <option value="3">3+</option>
                </select>
             </div>
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', color: 'var(--muted)' }}>Type</label>
            <select className="select" value={filters.propertyType} onChange={e => updateFilter('propertyType', e.target.value)}>
              <option value="">All Types</option>
              <option value="House">House</option>
              <option value="Apartment">Apartment</option>
              <option value="Studio">Studio</option>
              <option value="Villa">Villa</option>
              <option value="Townhouse">Townhouse</option>
            </select>
          </div>
          <button type="submit" className="btn" style={{ marginTop: '16px' }}>Apply Filters</button>
        </form>
      </aside>
      
      <main>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <h2>{initialMeta.total} Properties Found</h2>
        </div>
        
        {initialData.length === 0 ? (
           <div style={{ padding: '60px', textAlign: 'center', background: 'var(--card-bg)', borderRadius: '12px', border: '1px dashed var(--muted)' }}>
             <h3 style={{ color: 'var(--muted)' }}>No properties match your exact filters.</h3>
           </div>
        ) : (
          <div className="grid-listings">
            {initialData.map((item: any) => (
              <Link href={`/listings/${item.id}`} key={item.id} style={{ textDecoration: 'none', color: 'inherit' }}>
                <div className="card" style={{ height: '100%', cursor: 'pointer' }}>
                  <div style={{ height: '200px', background: 'var(--input-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', borderBottom: '1px solid var(--border)' }}>
                    <span style={{ color: 'var(--muted)', fontWeight: 600 }}>{item.propertyType}</span>
                  </div>
                  <div style={{ padding: '24px', flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                      <span className="price-tag">${item.price.toLocaleString()}</span>
                      <span className="tag">{item.suburb}</span>
                    </div>
                    <h3 style={{ fontSize: '1.25rem', marginBottom: '12px' }}>{item.title}</h3>
                    <div style={{ display: 'flex', gap: '16px', color: 'var(--muted)', fontSize: '0.9rem', marginTop: 'auto' }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>🛏️ {item.beds} Beds</span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>🛁 {item.baths} Baths</span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
