import type { Config } from 'tailwindcss';
export default { content:['./app/**/*.{ts,tsx}','./components/**/*.{ts,tsx}'], theme:{extend:{colors:{bluebrand:'#168FE0',greenbrand:'#55C927',navy:'#111827',muted:'#64748B',ice:'#F5F9FC'},fontFamily:{sans:['Arial','Helvetica','sans-serif']}}}, plugins:[] } satisfies Config;
