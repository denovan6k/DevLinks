'use client'
import React,{useState,useEffect,useMemo} from 'react'
import { Button } from '@/components/ui/button'
import { Icon } from '@iconify/react'
import { useRouter } from "next/navigation";
import Image from 'next/image'
import img1 from  './Ellipse.png'
import user from '../(mobile)/linkdata/data'
import db from "../../lib/firestore"
import { collection, getDocs,query, where } from "firebase/firestore"
import Loading from './Load'
import Link from 'next/link'
import { imagedb } from '../../../firebase'
import { ref, uploadBytes, getDownloadURL, listAll, deleteObject } from "firebase/storage";
import {  getMetadata } from 'firebase/storage';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
interface props{
  className?:string
}



type Item = {
  id: string;
  color?: string;
  icon: string;
  platform?: string;
  link?: string;
  [key: string]: any;
};

const Preview = ({ className }: props) => {
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState<Item[]>([]);
  const [items, setItems] = useState<Item[]>([]);
  const [imgUrl, setImgUrl] = useState<string >(''); // Store one image URL
  const [userId, setUserId] = useState<string | null>(null); // Track the authenticated user's UID
  const auth = getAuth();
  const router = useRouter();
useEffect(() => {
  const unsubscribe = onAuthStateChanged(auth, (user) => {
    if (user) {
      setUserId(user.uid);
      fetchImages(user.uid)
      fetchItems(user.uid);
    } else {
      setUserId(null);
    } 

  })
  return () => unsubscribe();
},[auth])

const fetchImages = async (userId: string) => {
  try {
    // Fetch images from Firebase Storage for the specific user (assuming images are stored under uploads/{userId}/)
    const imagesListRef = ref(imagedb, `images/${userId}/`); // User-specific image directory
    const response = await listAll(imagesListRef);

    // Fetch image URLs and metadata
    const urlsWithMetadata = await Promise.all(
      response.items.map(async (item) => {
        const url = await getDownloadURL(item);
        const metadata = await getMetadata(item); // Get metadata including timeCreated
        return { url, timeCreated: metadata.timeCreated };
      })
    );

    // Sort images by upload time (most recent first) and set the latest image URL
    urlsWithMetadata.sort((a, b) => new Date(b.timeCreated).getTime() - new Date(a.timeCreated).getTime());
    setImgUrl(urlsWithMetadata[0]?.url); // Set the most recent image or fallback to default image
  } catch (error) {
    console.error('Error fetching images:', error);
  }
};


const fetchItems = async (userId: string) => {
  try {
    setLoading(true);

    // Fetch user-specific documents from Firestore (items and form collections)
    const [itemsSnapshot, formSnapshot] = await Promise.all([
      getDocs(collection(db, `users/${userId}/items`)), // Fetch items where userId matches the current user's UID
      getDocs(collection(db, `users/${userId}/forms`)), // Fetch form data for the user
    ]);

    // Optional delay for loading simulation
    const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
    await delay(1000);

    setItems(itemsSnapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id } as Item)));
    setForm(formSnapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id } as Item)));
  } catch (error) {
    console.error('Error fetching data:', error);
  } finally {
    setLoading(false); // Ensure loading is stopped
  }
};

const handleShareProfile = () => {
  if (userId) {
    router.push(`/profile/${userId}`); // Redirect to the user's profile page with their userId
  } else {
    console.error("No userId found.");
  }
};
  
  if (loading) {
    
    return <Loading />;  // Show loading component
  }


    
  return (
    <>
  

     <div className='px-[24px] flex flex-col justify-center items-center mx-auto'>
       <div className='flex items-center py-[16px] gap-[16px] tl:min-w-[600px] lp:min-w-[1000px] tl:justify-between'>
        <Link href='/'>
          <Button className='max-w-[160px] text-[#633CFF]  border-[#633CFF] rounded-lg'>
            Back to Editor
          </Button>
          </Link>

          
          <Button className='max-w-[160px] text-[#FFF] bg-[#633CFF] rounded-lg' onClick={handleShareProfile}>
            Share Link
          </Button>
       
       </div>
       <div className='min-w-[237px] flex flex-col items-center mt-[56px] border p-[20px] rounded-2xl shadow-lg shadow-purple-200'>
       <div className="relative w-32 h-32">
      <Image
        src={imgUrl}
        alt=""
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
                <Link href={option.link ||''} key={index}>

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