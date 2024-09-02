
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
import { collection, addDoc,doc, updateDoc, getDocs } from "firebase/firestore";
import db from "@/lib/firestore";
import { useRouter } from "next/navigation";
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
    const router = useRouter();
    useEffect(() => {
        const fetchItems = async () => {
          const querySnapshot = await getDocs(collection(db, "form"));
          setForm(querySnapshot.docs.map((doc:any) => ({ ...doc.data(), id: doc.id } as Item)));
        };
    
        fetchItems();
      }, []);






  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      emailAddress: "",
      firstName: "",
      lastName: "",
      
    },
  });

 

  const handleSubmit = async (values: z.infer<typeof formSchema>) => {

    for (const form of forms) {
    //   if (!form.firstName || !form.lastName || !form.emailAddress) {
    //     console.error("All form fields must be filled out:", form);
    //     alert("Please fill out all form fields before saving.");
    //     return;
    //   }

      try {
        if (form.id) {
          // Update existing document
          const docRef = doc(db, "form", form.id);
          await updateDoc(docRef, {
            firstName: values.firstName,
            lastName: values.lastName,
            emailAddress: values.emailAddress,
            
          });
          router.push("/preview");
          console.log("Document updated with ID: ", form.id);
        } else {
          // Add new document
          const docRef = await addDoc(collection(db, "form"), {
            platform: form.platform,
            link: form.link,
            icon: form.icon,
            color: form.color,
          });
         
          console.log("Document written with ID: ", docRef.id);
        }

      } catch (e) {
        console.error("Error saving document: ", e);
      }
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
                    <Input placeholder= {` ${forms[0]?.firstName}`} type="text" {...field} className="tl:w-[344px]" />
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
                      placeholder= {` ${forms[0]?.lastName}`}
                      type="password"
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
                      placeholder= {` ${forms[0]?.emailAddress}`}
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
