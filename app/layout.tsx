import type { Metadata } from 'next';
import './globals.css';
export const metadata:Metadata={metadataBase:new URL(process.env.NEXT_PUBLIC_SITE_URL||'http://localhost:3000'),title:{default:'VISIT NOW | Skip the Wait',template:'%s | VISIT NOW'},description:'Discover hospitals, plan your healthcare visits, and explore VISIT NOW — a simpler way to connect with healthcare.',icons:{icon:'/brand/icon.png'},openGraph:{title:'VISIT NOW — Skip the Wait',description:'Your healthcare. Your time.',images:['/brand/logo-horizontal.png'],type:'website'}};
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="en"><body>{children}</body></html>}
