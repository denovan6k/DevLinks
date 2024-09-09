/* eslint-disable react-hooks/exhaustive-deps */
"use client"

import React,{ useState,useEffect }  from 'react'
import { Icon } from '@iconify/react/dist/iconify.js'
import ProForm from './Form'
import EditForm from '../edit/editForm'
import IphoneFrame from '../(mobile)/test/IphoneFrame'
import { imagedb } from '../../../firebase'
import { ref, uploadBytes, getDownloadURL, listAll, deleteObject } from "firebase/storage";
import { Input } from '@/components/ui/input'
import Image from 'next/image'
import {v4} from 'uuid'
import { useRouter } from 'next/navigation'
import { url } from 'inspector'
import MobileLayout from '@/app/MobileLayout'
import img1 from '../assets/image-removebg-preview.png'
import {  getMetadata } from 'firebase/storage';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { toast } from "sonner"
interface ProfileProps {
  imgUrls?:string
}
const Profile = () => {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadedUrl, setUploadedUrl] = useState<string | null>(null);
  const [imgUrl, setImgUrl] = useState<string>('');
  const [userId, setUserId] = useState<string | null>(null); // Track the authenticated user's UID
  const auth = getAuth();
  // const imagesListRef = ref(imagedb, "uploads/");
  const router = useRouter();

  useEffect(() => {
  const unsubscribe = onAuthStateChanged(auth, (user) => {
    if (user) {
      setUserId(user.uid);
      fetchImages(user.uid)
      
    } else {
      setUserId(null);
    } 

  })
  return () => unsubscribe();
},[auth])


const fetchImages = async (userId: string) => {
  try {
    // Fetch images from Firebase Storage for the specific user (assuming images are stored under uploads/{userId}/)
    const imagesListRef = ref(imagedb, `images/${userId}`); // User-specific image directory
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

const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
  if (event.target.files) {
    const selectedFile = event.target.files[0];
    setFile(selectedFile);

    if (selectedFile) {
      setUploading(true);
      const storageRef = ref(imagedb, `images/${userId}/profile`);

      try {
        // Upload new profile picture
        await uploadBytes(storageRef, selectedFile);
        const newImageUrl = await getDownloadURL(storageRef);

        // Check if there is an old profile picture to delete
        if (uploadedUrl) {
          // Assuming the old file path matches `images/${userId}/profile`
          const oldFileRef = ref(imagedb, `images/${userId}/profile`);
          try {
            await deleteObject(oldFileRef); // Deleting old profile picture
          } catch (deleteError) {
            console.warn("Error deleting old profile picture:", deleteError);
          }
        }

        // Update the new uploaded URL
        setUploadedUrl(newImageUrl);
        console.log("File Uploaded Successfully");

        // Display success toast notification
        toast('Uploaded successfully', {
          description: "Profile picture uploaded successfully",
          icon: <Icon icon="ph:seal-check" className="mr-2 text-slate-700" />, // Custom success icon
        });

        // Redirect to the profile page
        router.push("/profile");
      } catch (error: any) {
        console.error("Error uploading the file", error);

        // Display error toast notification
        toast(`${error.message}`, {
          description: "An error occurred. Please try again.",
          icon: <Icon icon="material-symbols:warning" className="mr-2 text-red-600" />, // Custom error icon
          action: {
            label: 'Retry',
            onClick: () => handleFileChange(event), // Retry upload on button click
          },
        });
      } finally {
        setUploading(false);
      }
    }
  }
};

    

   
  return (
<MobileLayout>
    <>
    <div className='flex flex-col items-center justify-center'>

    {/* <div className=' hidden lp:flex  '>
        <div className='p-[16px] flex   justify-between items-center bg-white '>
          <div className='mt-2 flex gap-2  items-center'>
          <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32" fill="none">
             <path fill-rule="evenodd" clip-rule="evenodd" d="M4.61863 27.3803C6.57329 29.3337 9.71463 29.3337 16 29.3337C22.2853 29.3337 25.428 29.3337 27.38 27.3803C29.3333 25.4297 29.3333 22.2857 29.3333 16.0003C29.3333 9.71499 29.3333 6.57233 27.38 4.61899C25.4293 2.66699 22.2853 2.66699 16 2.66699C9.71463 2.66699 6.57196 2.66699 4.61863 4.61899C2.66663 6.57366 2.66663 9.71499 2.66663 16.0003C2.66663 22.2857 2.66663 25.4283 4.61863 27.3803ZM12.6666 11.667C11.8096 11.667 10.9718 11.9211 10.2592 12.3973C9.54654 12.8734 8.99113 13.5502 8.66315 14.342C8.33517 15.1338 8.24935 16.0051 8.41656 16.8457C8.58376 17.6863 8.99647 18.4584 9.6025 19.0645C10.2085 19.6705 10.9806 20.0832 11.8212 20.2504C12.6618 20.4176 13.5331 20.3318 14.3249 20.0038C15.1167 19.6758 15.7935 19.1204 16.2697 18.4078C16.7458 17.6952 17 16.8574 17 16.0003C17 15.7351 17.1053 15.4808 17.2929 15.2932C17.4804 15.1057 17.7347 15.0003 18 15.0003C18.2652 15.0003 18.5195 15.1057 18.7071 15.2932C18.8946 15.4808 19 15.7351 19 16.0003C19 17.2529 18.6285 18.4774 17.9326 19.5189C17.2367 20.5604 16.2476 21.3722 15.0903 21.8516C13.933 22.3309 12.6596 22.4563 11.4311 22.212C10.2025 21.9676 9.07402 21.3644 8.18828 20.4787C7.30255 19.5929 6.69936 18.4644 6.45499 17.2359C6.21061 16.0073 6.33603 14.7339 6.81539 13.5767C7.29474 12.4194 8.1065 11.4303 9.14801 10.7344C10.1895 10.0384 11.414 9.66699 12.6666 9.66699C12.9318 9.66699 13.1862 9.77235 13.3737 9.95988C13.5613 10.1474 13.6666 10.4018 13.6666 10.667C13.6666 10.9322 13.5613 11.1866 13.3737 11.3741C13.1862 11.5616 12.9318 11.667 12.6666 11.667ZM23.6666 16.0003C23.6666 17.1496 23.2101 18.2518 22.3974 19.0645C21.5848 19.8771 20.4826 20.3337 19.3333 20.3337C19.0681 20.3337 18.8137 20.439 18.6262 20.6266C18.4386 20.8141 18.3333 21.0684 18.3333 21.3337C18.3333 21.5989 18.4386 21.8532 18.6262 22.0408C18.8137 22.2283 19.0681 22.3337 19.3333 22.3337C20.5859 22.3337 21.8104 21.9622 22.8519 21.2663C23.8934 20.5704 24.7052 19.5813 25.1845 18.424C25.6639 17.2667 25.7893 15.9933 25.5449 14.7648C25.3006 13.5362 24.6974 12.4077 23.8116 11.522C22.9259 10.6363 21.7974 10.0331 20.5689 9.78868C19.3403 9.54431 18.0669 9.66973 16.9096 10.1491C15.7524 10.6284 14.7632 11.4402 14.0673 12.4817C13.3714 13.5232 13 14.7477 13 16.0003C13 16.2655 13.1053 16.5199 13.2929 16.7074C13.4804 16.895 13.7347 17.0003 14 17.0003C14.2652 17.0003 14.5195 16.895 14.7071 16.7074C14.8946 16.5199 15 16.2655 15 16.0003C15 14.8511 15.4565 13.7489 16.2692 12.9362C17.0818 12.1235 18.184 11.667 19.3333 11.667C20.4826 11.667 21.5848 12.1235 22.3974 12.9362C23.2101 13.7489 23.6666 14.8511 23.6666 16.0003Z" fill="#633CFF"/>
              </svg>
              <p className=' text-[32px] font-bold '>devlinks</p>
          </div>
         <div className='flex justify-center items-center'>
          <div className='bg-[#EFEBFF] py-[11px] px-[27px] rounded-lg flex items-center  ml-[64px] gap-2'>
          <svg xmlns="http://www.w3.org/2000/svg" width="21" height="20" viewBox="0 0 21 20" fill="none">
  <path d="M11.1539 14.6504C11.2413 14.7375 11.3106 14.841 11.3579 14.9549C11.4053 15.0689 11.4296 15.1911 11.4296 15.3144C11.4296 15.4378 11.4053 15.56 11.3579 15.674C11.3106 15.7879 11.2413 15.8914 11.1539 15.9785L10.6898 16.4426C9.81045 17.3219 8.61778 17.816 7.37418 17.816C6.13058 17.816 4.93792 17.3219 4.05856 16.4426C3.1792 15.5632 2.68518 14.3706 2.68518 13.1269C2.68518 11.8833 3.1792 10.6907 4.05856 9.81133L5.94293 7.92773C6.78784 7.08073 7.92463 6.58885 9.12045 6.55282C10.3163 6.5168 11.4806 6.93937 12.375 7.73398C12.4673 7.81606 12.5426 7.91552 12.5965 8.02668C12.6504 8.13785 12.6818 8.25854 12.6891 8.38186C12.6963 8.50519 12.6792 8.62874 12.6387 8.74546C12.5983 8.86217 12.5352 8.96977 12.4531 9.06211C12.371 9.15444 12.2716 9.22971 12.1604 9.28361C12.0492 9.3375 11.9285 9.36898 11.8052 9.37623C11.6819 9.38349 11.5583 9.36638 11.4416 9.32589C11.3249 9.28539 11.2173 9.22231 11.125 9.14023C10.5886 8.66392 9.89062 8.41053 9.17365 8.43188C8.45668 8.45323 7.77496 8.7477 7.26793 9.25508L5.38512 11.1363C4.85759 11.6639 4.56122 12.3793 4.56122 13.1254C4.56122 13.8714 4.85759 14.5869 5.38512 15.1145C5.91265 15.642 6.62814 15.9383 7.37418 15.9383C8.12023 15.9383 8.83571 15.642 9.36324 15.1145L9.82731 14.6504C9.91438 14.5632 10.0178 14.4941 10.1316 14.4469C10.2454 14.3997 10.3674 14.3754 10.4906 14.3754C10.6138 14.3754 10.7358 14.3997 10.8496 14.4469C10.9634 14.4941 11.0668 14.5632 11.1539 14.6504ZM16.9414 3.55664C16.0613 2.67863 14.8689 2.18555 13.6257 2.18555C12.3826 2.18555 11.1902 2.67863 10.3101 3.55664L9.84606 4.0207C9.66994 4.19682 9.57099 4.43569 9.57099 4.68476C9.57099 4.93383 9.66994 5.17271 9.84606 5.34883C10.0222 5.52495 10.261 5.62389 10.5101 5.62389C10.7592 5.62389 10.9981 5.52495 11.1742 5.34883L11.6382 4.88476C12.1658 4.35723 12.8813 4.06087 13.6273 4.06087C14.3734 4.06087 15.0888 4.35723 15.6164 4.88476C16.1439 5.4123 16.4403 6.12778 16.4403 6.87383C16.4403 7.61987 16.1439 8.33536 15.6164 8.86289L13.7328 10.7473C13.2253 11.2544 12.5432 11.5485 11.8261 11.5692C11.1089 11.59 10.4109 11.3359 9.87496 10.859C9.78263 10.7769 9.67503 10.7138 9.55831 10.6733C9.4416 10.6328 9.31805 10.6157 9.19472 10.623C9.07139 10.6302 8.9507 10.6617 8.83954 10.7156C8.72837 10.7695 8.62891 10.8448 8.54684 10.9371C8.46476 11.0294 8.40168 11.137 8.36118 11.2538C8.32069 11.3705 8.30358 11.494 8.31084 11.6173C8.31809 11.7407 8.34957 11.8614 8.40346 11.9725C8.45736 12.0837 8.53263 12.1832 8.62496 12.2652C9.5187 13.0597 10.6823 13.4825 11.8775 13.4472C13.0728 13.4119 14.2093 12.9212 15.0547 12.0754L16.939 10.1918C17.8181 9.31193 18.312 8.11921 18.3125 6.87548C18.3129 5.63176 17.8198 4.43868 16.9414 3.5582V3.55664Z" fill="#633CFF"/>
</svg>
<p className=' text-[16px] text-[#633CFF] font-bold '>Links</p>
          </div>

          <div className='py-[11px] px-[27px] rounded-sm flex items-center  gap-2'>
          <svg xmlns="http://www.w3.org/2000/svg" width="21" height="20" viewBox="0 0 21 20" fill="none">
             <path d="M10.5 1.5625C8.83122 1.5625 7.19992 2.05735 5.81238 2.98448C4.42484 3.9116 3.34338 5.22936 2.70477 6.77111C2.06616 8.31286 1.89907 10.0094 2.22463 11.6461C2.55019 13.2828 3.35379 14.7862 4.53379 15.9662C5.7138 17.1462 7.21721 17.9498 8.85393 18.2754C10.4906 18.6009 12.1871 18.4338 13.7289 17.7952C15.2706 17.1566 16.5884 16.0752 17.5155 14.6876C18.4427 13.3001 18.9375 11.6688 18.9375 10C18.935 7.763 18.0453 5.61833 16.4635 4.03653C14.8817 2.45473 12.737 1.56498 10.5 1.5625ZM6.71641 15.357C7.15163 14.7619 7.72107 14.2779 8.37849 13.9442C9.0359 13.6106 9.76276 13.4367 10.5 13.4367C11.2373 13.4367 11.9641 13.6106 12.6215 13.9442C13.2789 14.2779 13.8484 14.7619 14.2836 15.357C13.1778 16.1412 11.8556 16.5625 10.5 16.5625C9.14436 16.5625 7.82221 16.1412 6.71641 15.357ZM8.3125 9.375C8.3125 8.94235 8.4408 8.51942 8.68116 8.15969C8.92153 7.79996 9.26317 7.51958 9.66288 7.35401C10.0626 7.18845 10.5024 7.14513 10.9268 7.22953C11.3511 7.31394 11.7409 7.52228 12.0468 7.8282C12.3527 8.13413 12.5611 8.52391 12.6455 8.94824C12.7299 9.37257 12.6866 9.81241 12.521 10.2121C12.3554 10.6118 12.075 10.9535 11.7153 11.1938C11.3556 11.4342 10.9327 11.5625 10.5 11.5625C9.91984 11.5625 9.36344 11.332 8.95321 10.9218C8.54297 10.5116 8.3125 9.95516 8.3125 9.375ZM15.6563 14.0578C15.0486 13.2849 14.2741 12.6595 13.3906 12.2281C13.9537 11.658 14.3355 10.934 14.4881 10.1474C14.6408 9.36074 14.5573 8.54653 14.2484 7.80718C13.9394 7.06783 13.4187 6.43637 12.7517 5.99223C12.0847 5.5481 11.3013 5.31112 10.5 5.31112C9.69869 5.31112 8.91528 5.5481 8.24831 5.99223C7.58135 6.43637 7.06062 7.06783 6.75165 7.80718C6.44267 8.54653 6.35925 9.36074 6.51187 10.1474C6.66449 10.934 7.04634 11.658 7.60938 12.2281C6.72592 12.6595 5.9514 13.2849 5.34375 14.0578C4.58051 13.0903 4.10512 11.9274 3.972 10.7022C3.83888 9.47711 4.05341 8.23925 4.59104 7.13037C5.12867 6.02148 5.96767 5.08639 7.01199 4.43212C8.05631 3.77786 9.26375 3.43086 10.4961 3.43086C11.7284 3.43086 12.9359 3.77786 13.9802 4.43212C15.0245 5.08639 15.8635 6.02148 16.4012 7.13037C16.9388 8.23925 17.1533 9.47711 17.0202 10.7022C16.8871 11.9274 16.4117 13.0903 15.6484 14.0578H15.6563Z" fill="#737373"/>
              </svg>
              <p className=' text-[14px] min-w-[105px] text-[#737373]  font-bold '>Profile Details</p>
              </div>

              </div>
              <div className='py-[11px] px-[16px] rounded-lg flex items-center border border-[#633CFF] gap-2 justify-self-end min-w-[150pxpx]'>
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none" className=''>
                  <path d="M19.6093 9.61953C19.5804 9.55625 18.896 8.03672 17.3843 6.525C15.3617 4.50547 12.8124 3.4375 9.99994 3.4375C7.18744 3.4375 4.63822 4.50547 2.61791 6.525C1.10619 8.03672 0.421816 9.55625 0.390566 9.61953C0.337638 9.73953 0.310303 9.86924 0.310303 10.0004C0.310303 10.1315 0.337638 10.2613 0.390566 10.3813C0.419472 10.4453 1.10385 11.9641 2.61635 13.4758C4.63822 15.4953 7.18744 16.5625 9.99994 16.5625C12.8124 16.5625 15.3617 15.4953 17.3812 13.4758C18.8937 11.9641 19.5781 10.4453 19.607 10.3813C19.6603 10.2614 19.688 10.1318 19.6884 10.0006C19.6888 9.86949 19.6619 9.73969 19.6093 9.61953ZM16.0109 12.1977C14.3335 13.8492 12.3117 14.6875 9.99994 14.6875C7.68822 14.6875 5.66635 13.8492 3.99135 12.1969C3.33224 11.5447 2.76528 10.8056 2.30619 10C2.76542 9.19474 3.33236 8.45589 3.99135 7.80391C5.66713 6.15078 7.68822 5.3125 9.99994 5.3125C12.3117 5.3125 14.3328 6.15078 16.0085 7.80391C16.6676 8.45583 17.2345 9.19469 17.6937 10C17.2345 10.8055 16.6676 11.5447 16.0085 12.1969L16.0109 12.1977ZM9.99994 6.5625C9.32007 6.5625 8.65546 6.76411 8.09017 7.14182C7.52487 7.51954 7.08428 8.0564 6.82411 8.68453C6.56393 9.31265 6.49585 10.0038 6.62849 10.6706C6.76113 11.3374 7.08852 11.9499 7.56926 12.4307C8.05 12.9114 8.66251 13.2388 9.32932 13.3714C9.99613 13.5041 10.6873 13.436 11.3154 13.1758C11.9435 12.9157 12.4804 12.4751 12.8581 11.9098C13.2358 11.3445 13.4374 10.6799 13.4374 10C13.4364 9.08864 13.0739 8.21489 12.4295 7.57046C11.785 6.92603 10.9113 6.56353 9.99994 6.5625ZM9.99994 11.5625C9.69091 11.5625 9.38881 11.4709 9.13186 11.2992C8.87491 11.1275 8.67464 10.8835 8.55638 10.5979C8.43812 10.3124 8.40717 9.99827 8.46746 9.69517C8.52775 9.39208 8.67657 9.11367 8.89509 8.89515C9.11361 8.67663 9.39202 8.52781 9.69511 8.46752C9.99821 8.40723 10.3124 8.43818 10.5979 8.55644C10.8834 8.6747 11.1274 8.87497 11.2991 9.13192C11.4708 9.38887 11.5624 9.69097 11.5624 10C11.5624 10.4144 11.3978 10.8118 11.1048 11.1049C10.8118 11.3979 10.4143 11.5625 9.99994 11.5625Z" fill="#633CFF"/>
                  </svg>
                  <p className=' text-[12px] text-[#633CFF] font-bold '>Profile Details</p>
               </div>

        </div>
      </div> */}

                
                
                
                
                
                  <div className='lp:grid lp:grid-cols-3 gap-4 lp:px-[40px]  lp:justify-center lp:items-center'>





                  <div className='hidden lp:flex lp:col-span-1 lp:justify-center'> 
                        <IphoneFrame />
                        </div>


                      <div className='p-[24px] tl:p-[40px] gap-[8px] flex flex-col justify-center  min-w-[343px] tl:min-w-[720px] lp:col-span-2 mx-auto'>
                      <div className='flex flex-col justify-start min-w-[295px]  gap-2'>
                          <h1 className='text-[24px] font-bold tl:text-[32px] tl:font-semibold'>Profile Details</h1>
                          <p className='text-[16px] text-[#737373] max-w-[295px] tl:max-w-[640px]'> Add your details to create a personal touch to your profile. </p>
                      </div>
                      <div className='p-[20px] flex flex-col tl:justify-between tl:flex-row max-w-[295px] tl:max-w-[720px] tl:items-center'>
                          <p className='text-[16px] text-[#737373]'>
                              Profile picture
                          </p>
                          <div className='tl:flex tl:space-x-4 tl:items-center'>



                        <div className="relative flex justify-center items-center"> 
                          
                        <Image
                          src={imgUrl? imgUrl:img1} // URL or data URL of the image
                          alt="" // Add a descriptive alt text
                          className="rounded-xl" // Apply your custom styles
                          width={0} // Width of the image
                          height={0}
                           // Height of the image
                           style={{width:'193px', height: "193px" }} // Ensure the image size is fixed
                        />
                        <div className='absolute inset-0 py-[61px] px-[39px] flex flex-col justify-center items-center text-[#633CFF] space-y-[8px] mt-[8px] min-w-[193px] rounded-xl ' onClick={() => document.getElementById('fileInput')?.click()} style={{ cursor: 'pointer' }}>
                          
                          <button  disabled={uploading} className='flex flex-col justify-center items-center'>
                            <Icon icon='ph:image' className='text-[40px]'/>
                            <p> + Upload Image</p>
                            </button>  
                            <Input type="file" onChange={handleFileChange} style={{display: 'none'}} id='fileInput'/> 
                          </div>
                        </div>
                        <p className='mt-[24px] text-[#737373] text-[12px] max-w-[255px] tl:w-[127px] tl:text-wrap'>Image must be below 1024x1024px. 
                        Use PNG or JPG format.</p>
                          </div>    
                          {/* <div className=' py-[61px] px-[39px] bg-[#EFEBFF] flex flex-col justify-center items-center text-[#633CFF] space-y-[8px] mt-[8px] min-w-[193px] rounded-xl ' onClick={() => document.getElementById('fileInput')?.click()} style={{ cursor: 'pointer' }}>
                          
                          <button  disabled={uploading} className='flex flex-col justify-center items-center'>
                            <Icon icon='ph:image' className='text-[40px]'/>
                            <p> + Upload Image</p>
                            </button>  
                            <Input type="file" onChange={handleFileChange} style={{display: 'none'}} id='fileInput'/> 
                          </div> */}
                        
                         
                      </div>
                      <div className='min-w-[295px] p-[24px]'>
                          {/* <ProForm/> */}
                          <EditForm/>
                      </div>
                      </div>
                      
                      </div>
                      </div>
                      </>    
                      </MobileLayout>
  )
}

export default Profile