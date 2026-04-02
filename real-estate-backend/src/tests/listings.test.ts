import request from 'supertest';
import app from '../../app';

describe('Listings API', () => {
  it('should fetch listings successfully', async () => {
    const res = await request(app).get('/api/listings');
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('data');
    expect(res.body).toHaveProperty('meta');
    expect(Array.isArray(res.body.data)).toBe(true);
  });

  it('should filter listings by min price', async () => {
    const res = await request(app).get('/api/listings?price_min=500000');
    expect(res.status).toBe(200);
    for (const listing of res.body.data) {
      expect(listing.price).toBeGreaterThanOrEqual(500000);
    }
  });

  it('should check role visibility for statusNote', async () => {
    // Standard User
    const resUser = await request(app).get('/api/listings');
    expect(resUser.body.data[0]).not.toHaveProperty('statusNote');

    // Admin User
    const resAdmin = await request(app)
      .get('/api/listings')
      .set('x-user-role', 'admin');
    
    // Check if at least one returned property has a statusNote
    const hasStatusNote = resAdmin.body.data.some((p: any) => 'statusNote' in p);
    expect(hasStatusNote).toBe(true);
  });
});
