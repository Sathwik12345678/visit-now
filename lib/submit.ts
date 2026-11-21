import {NextRequest,NextResponse} from 'next/server';
import {createClient} from '@supabase/supabase-js';
import {z} from 'zod';
export const runtime='nodejs';
const phone=z.string().regex(/^[+\d()\s-]{7,20}$/);
const common={email:z.email(),consent:z.literal('true')};
const schemas={hospital:z.object({...common,hospitalName:z.string().min(2).max(200),address:z.string().min(7).max(400),city:z.string().min(2).max(100),state:z.string().min(2).max(100),contactPerson:z.string().min(2).max(150),phone,hospitalType:z.string().min(2).max(100),services:z.string().min(3).max(2000),website:z.union([z.url(),z.literal('')])}),career:z.object({...common,name:z.string().min(2).max(150),phone,position:z.string().min(2).max(150),introduction:z.string().min(15).max(3000)}),contact:z.object({...common,name:z.string().min(2).max(150),message:z.string().min(15).max(3000)})};
export async function processForm(req:NextRequest,kind:keyof typeof schemas){
 try{
  const len=Number(req.headers.get('content-length')||0);if(len>6*1024*1024)return NextResponse.json({error:'Request is too large.'},{status:413});
  const origin=req.headers.get('origin');const host=req.headers.get('host');if(origin&&host&&new URL(origin).host!==host)return NextResponse.json({error:'Invalid request origin.'},{status:403});
  const data=await req.formData();if(data.get('website-check'))return NextResponse.json({error:'Invalid submission'},{status:400});
  const raw:Object=Object.fromEntries(Array.from(data.entries()).filter(([k,v])=>k!=='document'&&typeof v==='string'));
  const parsed=schemas[kind].safeParse(raw);if(!parsed.success)return NextResponse.json({error:'Please check all required form fields.'},{status:400});
  const url=process.env.SUPABASE_URL,key=process.env.SUPABASE_SERVICE_ROLE_KEY;if(!url||!key)return NextResponse.json({error:'Online submissions are not enabled yet. The site administrator must configure the secure backend.'},{status:503});
  const supabase=createClient(url,key,{auth:{persistSession:false}});const file=data.get('document');let filePath:string|null=null;
  const reference=`VN-${kind.substring(0,3).toUpperCase()}-${crypto.randomUUID().split('-')[0].toUpperCase()}`;
  if(file instanceof File&&file.size){if(kind==='contact')return NextResponse.json({error:'Files are not allowed for contact submissions.'},{status:400});if(file.size>5*1024*1024||file.type!=='application/pdf'||!file.name.toLowerCase().endsWith('.pdf'))return NextResponse.json({error:'Upload a PDF smaller than 5 MB.'},{status:400});const bytes=new Uint8Array(await file.arrayBuffer());if(String.fromCharCode(...bytes.slice(0,5))!=='%PDF-')return NextResponse.json({error:'Invalid PDF file.'},{status:400});filePath=`${kind}/${crypto.randomUUID()}.pdf`;const uploaded=await supabase.storage.from('visit-now-uploads').upload(filePath,bytes,{contentType:'application/pdf',upsert:false});if(uploaded.error)return NextResponse.json({error:'Secure file storage is unavailable.'},{status:503});}
  const insert={reference,kind,data:parsed.data,file_path:filePath,created_at:new Date().toISOString()};const result=await supabase.from('submissions').insert(insert);if(result.error){if(filePath)await supabase.storage.from('visit-now-uploads').remove([filePath]);return NextResponse.json({error:'Could not save this enquiry. Please try again.'},{status:500})}
  return NextResponse.json({reference,message:'Your enquiry has been received successfully. Keep this reference for future communication.'});
 }catch{return NextResponse.json({error:'Unable to process submission.'},{status:500})}
}
