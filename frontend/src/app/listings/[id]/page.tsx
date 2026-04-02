import Link from 'next/link';

export default async function PropertyDetail({ params, searchParams }: any) {
  const resolvedParams = await params;
  const id = resolvedParams.id;
  const resolvedQuery = await searchParams;
  const isAdmin = resolvedQuery.admin === 'true';

  const fetchOpts: RequestInit = { cache: 'no-store' };
  if (isAdmin) {
    fetchOpts.headers = { 'x-user-role': 'admin' };
  }

  const res = await fetch(`http://localhost:4000/api/listings/${id}`, fetchOpts);
  
  if (!res.ok) {
    return (
      <div className="container" style={{ padding: '80px 0', textAlign: 'center' }}>
        <h2>Property not found or error loading details.</h2>
        <Link href="/listings" className="btn" style={{ marginTop: '20px' }}>Back to Search</Link>
      </div>
    );
  }

  const result = await res.json();
  const property = result.data;

  return (
    <div className="container" style={{ padding: '40px 0' }}>
      <div style={{ marginBottom: '32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Link href="/listings" style={{ textDecoration: 'none', color: 'var(--primary)', fontWeight: 600 }}>
          &larr; Back to Listings
        </Link>
        <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
           <span style={{ fontSize: '0.9rem', color: 'var(--muted)' }}>Test Role View:</span>
           {isAdmin ? (
             <Link href={`/listings/${id}`} className="btn btn-outline" style={{ padding: '6px 12px', fontSize: '0.9rem' }}>
               Switch to Normal User
             </Link>
           ) : (
             <Link href={`/listings/${id}?admin=true`} className="btn bg-red-500" style={{ padding: '6px 12px', fontSize: '0.9rem', background: '#ef4444', color: 'white', border: 'none' }}>
               Switch to Admin
             </Link>
           )}
        </div>
      </div>

      <div className="card" style={{ padding: '40px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '24px' }}>
          <div>
            <div style={{ display: 'flex', gap: '12px', marginBottom: '16px' }}>
              <span className="tag">{property.propertyType}</span>
              <span className="tag" style={{ background: 'var(--input-bg)', color: 'var(--fg)' }}>{property.suburb}</span>
              {property.statusNote && (
                 <span className="tag tag-admin">🔒 Admin Note: {property.statusNote}</span>
              )}
            </div>
            <h1 style={{ fontSize: '2.5rem', marginBottom: '16px' }}>{property.title}</h1>
            <p className="text-muted" style={{ fontSize: '1.1rem', maxWidth: '800px', lineHeight: 1.6 }}>
              {property.description}
            </p>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div className="price-tag" style={{ fontSize: '3rem', marginBottom: '8px' }}>
              ${property.price.toLocaleString()}
            </div>
            <div style={{ display: 'flex', gap: '24px', fontSize: '1.1rem', justifyContent: 'flex-end', color: 'var(--fg)', fontWeight: 500 }}>
              <span>🛏️ {property.beds} Beds</span>
              <span>🛁 {property.baths} Baths</span>
            </div>
          </div>
        </div>

        <hr style={{ margin: '40px 0', border: 'none', borderTop: '1px solid var(--border)' }} />

        <div>
          <h3 style={{ marginBottom: '16px' }}>Agent Information</h3>
          <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
            <div style={{ width: '50px', height: '50px', borderRadius: '50%', background: 'var(--primary)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem', fontWeight: 600 }}>
              {property.agent.name.charAt(0)}
            </div>
            <div>
              <div style={{ fontWeight: 600, fontSize: '1.1rem' }}>{property.agent.name}</div>
              <div className="text-muted">{property.agent.email}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
