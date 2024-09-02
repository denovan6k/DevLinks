'use client'
import React,{useState,useEffect,useMemo} from 'react'
import { Button } from '@/components/ui/button'
import { Icon } from '@iconify/react'

import Image from 'next/image'
import img1 from  './Ellipse.png'
import user from '../(mobile)/linkdata/data'
import db from "../../lib/firestore"
import { collection, getDocs } from "firebase/firestore"
import Loading from './Load'
import Link from 'next/link'
import { imagedb } from '../../../firebase'
import { ref, uploadBytes, getDownloadURL, listAll, deleteObject } from "firebase/storage";

interface props{
  className?:string
}



type Item = {
  id: string;
  color?: string;
  icon: string;
  platform?: string;
  [key: string]: any;
};

const Preview = ({ className }: props) => {
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState<Item[]>([]);
  const [items, setItems] = useState<Item[]>([]);
  const [imgUrls, setImgUrls] = useState<string[]>([]);
  const imagesListRef = ref(imagedb, "uploads/");
  

  useEffect(() => {
    const fetchItems = async () => {
      try {
        setLoading(true);

        const [itemsSnapshot, formSnapshot] = await Promise.all([
          getDocs(collection(db, "items")),
          getDocs(collection(db, "form")),
        ]);

        listAll(imagesListRef).then((response) => {
          const urls: string[] = [];
          response.items.forEach((item) => {
            getDownloadURL(item).then((url) => {
              urls.push(url);
              if (urls.length === response.items.length) {
                setImgUrls(urls);
              }
            });
          });
        })




        // Optional delay
        const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
        await delay(3000);

        // Update state with fetched data
        setItems(itemsSnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id } as Item)));
        setForm(formSnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id } as Item)));
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);  // Ensure loading is set to false even if there's an error
      }
    };

    fetchItems();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
 
  
  if (loading) {
    
    return <Loading />;  // Show loading component
  }


    
  return (
    <>
    
     <div className='px-[24px] flex flex-col justify-center items-center mx-auto'>
       <div className='flex items-center py-[16px] gap-[16px]'>
          <Button className='max-w-[160px] text-[#633CFF]  border-[#633CFF] rounded-lg'>
            Back to Editor
          </Button>
          <Button className='max-w-[160px] text-[#FFF] bg-[#633CFF] rounded-lg'>
            Share Link
          </Button>
          
       </div>
       <div className='min-w-[237px] flex flex-col items-center mt-[56px] border p-[20px] rounded-2xl shadow-lg shadow-purple-200'>
       <div className="relative w-32 h-32">
      <Image
        src={imgUrls[0]}
        alt="Profile Picture"
        layout="fill"
        objectFit="cover"
        className="rounded-full border-4 border-[#633CFF]" // Apply circular border
      />
    </div>
               <div className='flex flex-col justify-center text-center items-center'>
               <span className='min-w-[173px]'><h3 className='text-[32px] text-[#333333] font-bold'> {form[0]?.firstName} </h3></span>  
               <span className='min-w-[140px]'><p className='text-[16px] text-[#737373]'>{form[0]?.emailAddress}</p></span>  
               </div>
               <div className='mt-[56px]'>
               {items.map((option, index) => (
                <Link href={option.link} key={index}>

                    <Button key={index} className= 'min-w-[237px] mb-[20px] flex justify-between p-[16px] ' style={{ backgroundColor: `${option.color}` }}>
                    <div className='flex items-center gap-2'>
                    <Icon icon={option.icon}/>
                    {option.platform}
                    </div>
                    <Icon icon='mdi:arrow-right' className='text-white'/>
                </Button>
                
                </Link>
               

               ))}
               </div>
             
       </div>

     </div>
    </>
  )
}

export default Preview