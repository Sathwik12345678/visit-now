import {NextRequest} from 'next/server';
import {processForm} from '@/lib/submit';
export async function POST(request:NextRequest){return processForm(request,'hospital')}
