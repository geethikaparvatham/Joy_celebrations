import Link from 'next/link'
 
export default function NotFound() {
  return (
    <div style={{ minHeight: '80vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '2rem' }}>
      <h2 style={{ fontSize: '6rem', color: '#d4af37', margin: '0 0 1rem 0' }} className="heading-luxury">404</h2>
      <h3 style={{ fontSize: '2rem', color: 'white', marginBottom: '2rem', fontWeight: 600 }}>Page Not Found</h3>
      <p style={{ color: 'var(--text-secondary)', marginBottom: '3rem', maxWidth: '500px', fontSize: '1.1rem', lineHeight: '1.6' }}>
        The luxury experience you're looking for seems to have moved or doesn't exist. Let's get you back to the main stage.
      </p>
      <Link href="/" className="btn-primary" style={{ display: 'inline-block', textDecoration: 'none' }}>
        Return Home
      </Link>
    </div>
  )
}
