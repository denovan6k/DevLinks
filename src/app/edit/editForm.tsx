
"use client";
import * as z from "zod";
import { useState,useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  SelectValue,
  SelectTrigger,
  SelectContent,
  SelectItem,
  Select,
} from "@/components/ui/select";
import { collection, addDoc,doc, updateDoc, getDocs, query, where } from "firebase/firestore";
import db from "@/lib/firestore";
import { useRouter } from "next/navigation";
import { ref, uploadBytes, getDownloadURL, listAll, deleteObject } from "firebase/storage";
import {  getMetadata } from 'firebase/storage';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
type Item = {
    id: string;
    color?: string;
    icon: string;
    platform?: string;
    [key: string]: any;
  };






const formSchema = z
  .object({
    firstName: z.string().min(1),
    lastName: z.string().min(1),
    emailAddress: z.string().email(),
    
    
    
  })




export default function EditForm() {
    const [forms, setForm] = useState<Item[]>([]);
    const [userId, setUserId] = useState<string | null>(null); 
    const [user, setUser] = useState<any>(null);
    const auth = getAuth();
    const router = useRouter();

    useEffect(() => {
      const unsubscribe = onAuthStateChanged(auth, (user) => {
        if (user) {
          setUserId(user.uid);
          
          fetchItems(user.uid);
        } else {
          setUserId(null);
        } 
    
      })
      return () => unsubscribe();
    },[auth])

    const fetchItems = async (userId: string) => {
      try {
        
    
        // Fetch user-specific documents from Firestore (items and form collections)
        const [ formSnapshot] = await Promise.all([
           // Fetch items where userId matches the current user's UID
          getDocs(collection(db, `users/${userId}/forms`)), // Fetch form data for the user
        ]);
    
        // Optional delay for loading simulation
        // const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
        // await delay(1000);
    
      
        setForm(formSnapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id } as Item)));
      } catch (error) {
        console.error('Error fetching data:', error);
      } 
    };




  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      emailAddress: "",
      firstName: "",
      lastName: "",
      
    },
  });

 

  const handleSubmit = async (values: z.infer<typeof formSchema>) => {
    if (!userId) {
      alert("User not authenticated");
      return;
    }

    try {
      if (forms.length > 0 && forms[0]?.id) {
        // Update existing document under `users/{userId}/forms/{formId}`
        const docRef = doc(db, `users/${userId}/forms`, forms[0]?.id); // Reference to form
        await updateDoc(docRef, {
          firstName: values.firstName,
          lastName: values.lastName,
          emailAddress: values.emailAddress,
        });
        console.log("Document updated with ID: ", forms[0]?.id);
      } else {
        // Add new document to `users/{userId}/forms`
        const docRef = await addDoc(collection(db, `users/${userId}/forms`), {
          firstName: values.firstName,
          lastName: values.lastName,
          emailAddress: values.emailAddress,
        });
        console.log("New form added with ID: ", docRef.id);
      }

      router.push("/preview");
    } catch (e) {
      console.error("Error saving document: ", e);
    }
  };

  return (
    <main className="max-w-[295px] tl:min-w-[640px]">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(handleSubmit)}
          className=" flex flex-col text-[12px] gap-4"
        >
         
  
          
          <FormField
            control={form.control}
            name="firstName"
            render={({ field }) => {
              return (
                
                <FormItem className="">
                  <div className="tl:flex tl:items-center tl:justify-between">
                  <FormLabel>First name*</FormLabel>
                  <FormControl>
                    <Input placeholder= {forms[0]?.firstName || 'john'} type="text" {...field} className="tl:w-[344px]" />
                  </FormControl>
                  </div>            
                  <FormMessage />
                </FormItem>
              );
            }}
          />
          <FormField
            control={form.control}
            name="lastName"
            render={({ field }) => {
              return (
                <FormItem>
                 <div className="tl:flex tl:items-center tl:justify-between">
                  <FormLabel>Last name*</FormLabel>
                  <FormControl>
                    <Input
                      placeholder= {forms[0]?.lastName || 'doe'}
                      type="text"
                      {...field}
                      className="tl:w-[344px]" />
                  </FormControl>
                  </div>
                  <FormMessage />
                </FormItem>
              );
            }}
          />
           <FormField
            control={form.control}
            name="emailAddress"
            render={({ field }) => {
              return (
                <FormItem>
                   <div className="tl:flex tl:items-center tl:justify-between">
                  <FormLabel>Email address</FormLabel>
                  <FormControl>
                    <Input
                      placeholder= {forms[0]?.emailAddress || "johndoe@gmail.com"}
                      type="email"
                      {...field}
                      className="tl:w-[344px]" />
                  </FormControl>
                  </div>
                  <FormMessage />
                </FormItem>
              );
            }}
          />
          <div className="flex justify-end">
          <Button type="submit" className="w-full tl:max-w-[91px] bg-[#633CFF] mt-[44px] tl:mt-[80px]">
            Save
          </Button>
          </div>
        </form>
      </Form>
    </main>
  );
}
