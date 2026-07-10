import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Contact Us',
  description: 'Get in touch with JOY Celebrations to book your luxury private party theatre in Vijayawada. We are located in Gunadala and open daily.',
  keywords: ['Contact Joy Celebrations', 'Private Party Theatre in Vijayawada', 'Book Couple Theatre Vijayawada', 'Surprise Celebration Venue'],
};

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>;
}
