
"use client";
import * as z from "zod";
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
import { collection, addDoc } from "firebase/firestore";
import db from "@/lib/firestore";

const formSchema = z
  .object({
    firstName: z.string().min(1),
    lastName: z.string().min(1),
    emailAddress: z.string().email(),
    
    
    
  })




export default function ProForm() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      emailAddress: "",
      firstName: "",
      lastName: "",
      
    },
  });

 

  const handleSubmit = async (values: z.infer<typeof formSchema>) => {
    
      try {
        // Add each form as a separate document in Firestore
        const docRef = await addDoc(collection(db, "form"), {
         firstName: values.firstName,
         lastName: values.lastName,
         emailAddress: values.emailAddress,
        });
        console.log("Document written with ID: ", docRef.id);
      } catch (e) {
        console.error("Error adding document: ", e);
      }



    console.log({ values });
  };

  return (
    <main className="mx-auto">
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
                <FormItem>
                  <FormLabel>First name*</FormLabel>
                  <FormControl>
                    <Input placeholder="Ben" type="text" {...field} />
                  </FormControl>
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
                  <FormLabel>Last name*</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Wright"
                      type="password"
                      {...field}
                    />
                  </FormControl>
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
                  <FormLabel>Email address</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="ben@example.com"
                      type="email"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              );
            }}
          />
          <Button type="submit" className="w-full bg-[#633CFF] mt-[44px]">
            Save
          </Button>
        </form>
      </Form>
    </main>
  );
}
