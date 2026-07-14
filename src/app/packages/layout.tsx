import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Premium Celebration Packages in Vijayawada',
  description: 'Explore our budget-friendly birthday packages and romantic date night options at JOY Celebrations, Vijayawada’s top private party theatre.',
  keywords: ['Budget-Friendly Birthday Packages Vijayawada', 'Romantic Date Night Vijayawada', 'Private Party Packages', 'Joy Celebrations Packages'],
};

export default function PackagesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
