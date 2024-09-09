'use client'; // Since this is client-side code
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Icon } from '@iconify/react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import db from "../../../lib/firestore"; // Firestore instance
import { collection, getDocs } from "firebase/firestore";
import Loading from '@/app/preview/Load';
import Link from 'next/link';
import { imagedb } from '../../../../firebase'; // Firebase storage instance
import { ref, getDownloadURL, listAll, getMetadata } from "firebase/storage";
import { useParams } from 'next/navigation'; // Use Next.js to get the dynamic params from the URL

type Item = {
  id: string;
  color?: string;
  icon: string;
  platform?: string;
  link?: string;
  [key: string]: any;
};

const Preview = () => {
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState<Item[]>([]);
  const [items, setItems] = useState<Item[]>([]);
  const [imgUrl, setImgUrl] = useState<string>(''); // Store one image URL
  const { id: userId } = useParams(); // Get the dynamic user ID from the URL

  useEffect(() => {
    const loadData = async () => {
      if (userId) {
        await fetchImages(userId);  // Call the function to fetch images
        await fetchItems(userId);   // Call the function to fetch items
      }
    };
    
    loadData(); // Call the data fetching function inside useEffect
  }, [userId]);

  const fetchImages = async (userId: any) => {
    try {
      const imagesListRef = ref(imagedb, `images/${userId}/`); // User-specific image directory
      const response = await listAll(imagesListRef);

      const urlsWithMetadata = await Promise.all(
        response.items.map(async (item) => {
          const url = await getDownloadURL(item);
          const metadata = await getMetadata(item);
          return { url, timeCreated: metadata.timeCreated };
        })
      );

      urlsWithMetadata.sort((a, b) => new Date(b.timeCreated).getTime() - new Date(a.timeCreated).getTime());
      setImgUrl(urlsWithMetadata[0]?.url); // Set the most recent image or fallback to default image
    } catch (error) {
      console.error('Error fetching images:', error);
    }
  };

  const fetchItems = async (userId: any) => {
    try {
      setLoading(true);
      const [itemsSnapshot, formSnapshot] = await Promise.all([
        getDocs(collection(db, `users/${userId}/items`)), // Fetch items where userId matches the current user's UID
        getDocs(collection(db, `users/${userId}/forms`)), // Fetch form data for the user
      ]);

      setItems(itemsSnapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id } as Item)));
      setForm(formSnapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id } as Item)));
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <Loading />; // Show loading component
  }

  return (
    <div className='px-[24px] flex flex-col justify-center items-center mx-auto'>
      <div className='min-w-[237px] flex flex-col items-center mt-[56px] border p-[20px] rounded-2xl shadow-lg shadow-purple-200'>
        <div className="relative w-32 h-32">
          <Image
            src={imgUrl}
            alt="Profile Image"
            layout="fill"
            objectFit="cover"
            className="rounded-full border-4 border-[#633CFF]"
          />
        </div>
        <div className='flex flex-col justify-center text-center items-center'>
          <span className='min-w-[173px]'>
            <h3 className='text-[32px] text-[#333333] font-bold'>{form[0]?.firstName || "Unknown"}</h3>
          </span>
          <span className='min-w-[140px]'>
            <p className='text-[16px] text-[#737373]'>{form[0]?.emailAddress || "No Email"}</p>
          </span>
        </div>
        <div className='mt-[56px]'>
          {items.map((option, index) => (
           <Link href={option.link || '#'} key={index} passHref  target={option.link?.startsWith('http') ? '_blank' : '_self'} 
           rel="noopener noreferrer">
              <Button key={index} className='min-w-[237px] mb-[20px] flex justify-between p-[16px]' style={{ backgroundColor: option.color || '#fff' }}>
                <div className='flex items-center gap-2'>
                  <Icon icon={option.icon} />
                  {option.platform}
                </div>
                <Icon icon='mdi:arrow-right' className='text-white' />
              </Button>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Preview;
