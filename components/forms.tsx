'use client';
import {useState} from 'react';
import {useForm} from 'react-hook-form';
import {zodResolver} from '@hookform/resolvers/zod';
import {z} from 'zod';
import {ArrowRight,CheckCircle2,AlertCircle} from 'lucide-react';
const phone=z.string().regex(/^[+\d()\s-]{7,20}$/,'Enter a valid phone number');
const hospital=z.object({hospitalName:z.string().min(2),address:z.string().min(7),city:z.string().min(2),state:z.string().min(2),contactPerson:z.string().min(2),email:z.email(),phone,hospitalType:z.string().min(1),services:z.string().min(3),website:z.union([z.url(),z.literal('')]),consent:z.literal(true)});
const career=z.object({name:z.string().min(2),email:z.email(),phone,position:z.string().min(2),introduction:z.string().min(15),consent:z.literal(true)});
const contact=z.object({name:z.string().min(2),email:z.email(),message:z.string().min(15),consent:z.literal(true)});
type Mode='hospital'|'career'|'contact';
const config={hospital:{schema:hospital,endpoint:'/api/hospital'},career:{schema:career,endpoint:'/api/career'},contact:{schema:contact,endpoint:'/api/contact'}};
export default function IntakeForm({mode}:{mode:Mode}){
 const [state,setState]=useState<{ok:boolean,message:string,reference?:string}|null>(null),[busy,setBusy]=useState(false),[file,setFile]=useState<File|null>(null);
 const {register,handleSubmit,formState:{errors},reset}=useForm<any>({resolver:zodResolver(config[mode].schema),defaultValues:{consent:false,website:''}});
 const fields:Record<Mode,{name:string,label:string,type?:string,required?:boolean}[]>={
 hospital:[{name:'hospitalName',label:'Hospital name'},{name:'address',label:'Hospital address'},{name:'city',label:'City'},{name:'state',label:'State'},{name:'contactPerson',label:'Contact person'},{name:'email',label:'Official email',type:'email'},{name:'phone',label:'Phone number',type:'tel'},{name:'hospitalType',label:'Hospital type'},{name:'services',label:'Services offered',type:'textarea'},{name:'website',label:'Website (optional)',type:'url'}],
 career:[{name:'name',label:'Full name'},{name:'email',label:'Email',type:'email'},{name:'phone',label:'Phone',type:'tel'},{name:'position',label:'Position / area of interest'},{name:'introduction',label:'Short introduction',type:'textarea'}],
 contact:[{name:'name',label:'Your name'},{name:'email',label:'Email',type:'email'},{name:'message',label:'How can we help?',type:'textarea'}]};
 async function submit(data:Record<string,unknown>){setBusy(true);setState(null);try{const fd=new FormData();for(const [k,v] of Object.entries(data))fd.append(k,String(v));if(file)fd.append('document',file);const res=await fetch(config[mode].endpoint,{method:'POST',body:fd});const body=await res.json();if(!res.ok)throw new Error(body.error||'Submission failed');setState({ok:true,message:body.message,reference:body.reference});reset();setFile(null)}catch(err){setState({ok:false,message:err instanceof Error?err.message:'Please try again'})}finally{setBusy(false)}}
 return <form onSubmit={handleSubmit(submit)} className="space-y-5" noValidate><div className="grid md:grid-cols-2 gap-5">{fields[mode].map(f=><div key={f.name} className={`field ${f.type==='textarea'?'md:col-span-2':''}`}><label htmlFor={f.name}>{f.label}</label>{f.type==='textarea'?<textarea id={f.name} rows={4} {...register(f.name)}/>:f.name==='hospitalType'?<select id={f.name} {...register(f.name)}><option value="">Select type</option><option>Multispecialty hospital</option><option>General hospital</option><option>Specialty hospital</option><option>Clinic</option><option>Other</option></select>:<input id={f.name} type={f.type||'text'} {...register(f.name)}/>} {errors[f.name]&&<small role="alert">{String(errors[f.name]?.message||'Please check this field')}</small>}</div>)}</div>
 {mode!=='contact'&&<div className="field"><label htmlFor="document">{mode==='career'?'Resume (PDF, optional)':'Verification document (PDF, optional)'}</label><input id="document" type="file" accept="application/pdf" onChange={e=>setFile(e.target.files?.[0]||null)}/><p className="text-xs text-slate-500">PDF only, maximum 5 MB. Documents are stored privately when backend is configured.</p></div>}
 <div className="hidden"><label htmlFor="website-check">Leave empty</label><input name="website-check" id="website-check" autoComplete="off" tabIndex={-1}/></div>
 <label className="flex items-start gap-3 text-sm text-slate-600"><input type="checkbox" className="mt-1" {...register('consent')}/><span>I agree to submit my information for this enquiry and understand it will be handled according to the <a href="/privacy-policy" className="text-bluebrand underline">privacy policy</a>.</span></label>{errors.consent&&<p className="text-xs text-red-600">Consent is required.</p>}
 {state&&<div role="status" className={`flex items-start gap-2 rounded-2xl p-4 text-sm ${state.ok?'bg-green-50 text-green-800':'bg-red-50 text-red-800'}`}>{state.ok?<CheckCircle2 size={19}/>:<AlertCircle size={19}/>}<span>{state.message}{state.reference&&<strong className="block mt-1">Reference: {state.reference}</strong>}</span></div>}
 <button type="submit" disabled={busy} className="btn btn-blue">{busy?'Submitting…':mode==='hospital'?'Submit hospital enquiry':mode==='career'?'Send expression of interest':'Send message'}<ArrowRight size={16}/></button>
 </form>
}
