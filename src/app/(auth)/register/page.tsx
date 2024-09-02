"use client";
import React from "react";
import { FormEvent,useState } from "react";
import { Button } from "@/components/ui/button";
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





import Link from "next/link";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { app } from "../../../../firebase";
import { useRouter } from "next/navigation";
import { Icon } from '@iconify/react';
import { useToast } from "@/components/ui/use-toast"


const formSchema = z
  .object({
    password: z.string().min(8),
    confirmpassword: z.string(),
    emailAddress: z.string().email(),  
  }).refine(
    (data) => {
      return data.password === data.confirmpassword;
    },
    {
      message: "Passwords do not match",
      path: ["passwordConfirm"],
    }
  )

export default function Register() {
  const { toast } = useToast()
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      emailAddress: "",
      password: "",
      confirmpassword: "",
      
    },
  });

 



  async function handleSubmit( form: z.infer<typeof formSchema>) {
       

    try {
      await createUserWithEmailAndPassword(getAuth(app), form.emailAddress, form.password);
      router.push("/login");
      toast({      
        action: (
          <div className="max-w-[300px] flex justify-center items-center">
            <Icon icon='ph:seal-check' className="mr-2 text-green-600" />
            <span className="first-letter:capitalize">
              Created Account successfully
            </span>
          </div>
        ),
      }) //come back to login page after successful registration
    } catch (e) {
      console.log(e as Error);
      
    }
  }
    return (
        <>
        <div className="p-[32px] tl:p-[100px] flex flex-col justify-center items-center space-y-[20px] ">
         <div>
         <div className="flex tl:justify-center space-x-4">
         <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 40 40" fill="none">
                 <path fill-rule="evenodd" clip-rule="evenodd" d="M5.77325 34.2247C8.21659 36.6663 12.1433 36.6663 19.9999 36.6663C27.8566 36.6663 31.7849 36.6663 34.2249 34.2247C36.6666 31.7863 36.6666 27.8563 36.6666 19.9997C36.6666 12.143 36.6666 8.21467 34.2249 5.77301C31.7866 3.33301 27.8566 3.33301 19.9999 3.33301C12.1433 3.33301 8.21492 3.33301 5.77325 5.77301C3.33325 8.21634 3.33325 12.143 3.33325 19.9997C3.33325 27.8563 3.33325 31.7847 5.77325 34.2247ZM15.8333 14.583C14.7619 14.583 13.7147 14.9007 12.8239 15.4959C11.9331 16.0911 11.2389 16.937 10.8289 17.9268C10.4189 18.9166 10.3117 20.0057 10.5207 21.0564C10.7297 22.1071 11.2456 23.0723 12.0031 23.8298C12.7606 24.5874 13.7258 25.1033 14.7765 25.3123C15.8272 25.5213 16.9164 25.414 17.9061 25.004C18.8959 24.594 19.7419 23.8998 20.337 23.009C20.9322 22.1182 21.2499 21.071 21.2499 19.9997C21.2499 19.6682 21.3816 19.3502 21.616 19.1158C21.8505 18.8814 22.1684 18.7497 22.4999 18.7497C22.8314 18.7497 23.1494 18.8814 23.3838 19.1158C23.6182 19.3502 23.7499 19.6682 23.7499 19.9997C23.7499 21.5654 23.2856 23.0961 22.4157 24.3979C21.5458 25.6998 20.3094 26.7145 18.8628 27.3137C17.4162 27.9129 15.8245 28.0697 14.2888 27.7642C12.7531 27.4588 11.3425 26.7048 10.2353 25.5976C9.12816 24.4904 8.37417 23.0798 8.0687 21.5441C7.76324 20.0085 7.92001 18.4167 8.51921 16.9701C9.1184 15.5235 10.1331 14.2871 11.435 13.4172C12.7369 12.5473 14.2675 12.083 15.8333 12.083C16.1648 12.083 16.4827 12.2147 16.7171 12.4491C16.9516 12.6835 17.0833 13.0015 17.0833 13.333C17.0833 13.6645 16.9516 13.9825 16.7171 14.2169C16.4827 14.4513 16.1648 14.583 15.8333 14.583ZM29.5833 19.9997C29.5833 21.4363 29.0126 22.814 27.9967 23.8298C26.9809 24.8457 25.6032 25.4163 24.1666 25.4163C23.8351 25.4163 23.5171 25.548 23.2827 25.7825C23.0483 26.0169 22.9166 26.3348 22.9166 26.6663C22.9166 26.9979 23.0483 27.3158 23.2827 27.5502C23.5171 27.7846 23.8351 27.9163 24.1666 27.9163C25.7324 27.9163 27.263 27.452 28.5648 26.5821C29.8667 25.7122 30.8814 24.4758 31.4806 23.0293C32.0798 21.5827 32.2366 19.9909 31.9311 18.4552C31.6257 16.9195 30.8717 15.5089 29.7645 14.4017C28.6573 13.2946 27.2467 12.5406 25.7111 12.2351C24.1754 11.9297 22.5836 12.0864 21.137 12.6856C19.6904 13.2848 18.454 14.2995 17.5841 15.6014C16.7142 16.9033 16.2499 18.4339 16.2499 19.9997C16.2499 20.3312 16.3816 20.6491 16.616 20.8836C16.8505 21.118 17.1684 21.2497 17.4999 21.2497C17.8314 21.2497 18.1494 21.118 18.3838 20.8836C18.6182 20.6491 18.7499 20.3312 18.7499 19.9997C18.7499 18.5631 19.3206 17.1853 20.3364 16.1695C21.3522 15.1537 22.73 14.583 24.1666 14.583C25.6032 14.583 26.9809 15.1537 27.9967 16.1695C29.0126 17.1853 29.5833 18.5631 29.5833 19.9997Z" fill="#633CFF"/>
         </svg> 
         <p className="text-[30px] tl:text-[32px] font-bold">Devlinks</p>
         
         </div>
         <div className="tl:min-w-[396px] tl:mt-[70px] mt-[100px]"> <ul>
          <li>
          <p className="text-[24px] tl:text-[32px] font-bold">Create Account</p>
          </li>
        <li className="mt-[8px]">
          <p>Let&apos;s get you started sharing your links! </p>
        </li>
        </ul> </div>
         <main className="mx-auto">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(handleSubmit)}
          className="flex flex-col text-[12px] gap-4 mt-[64px] min-w-[311px] tl:min-w-[476px]"
        >
         
  
          
          <FormField
            control={form.control}
            name="emailAddress"
            render={({ field }) => {
              return (
                <FormItem>
                  <FormLabel>Email*</FormLabel>
                  <FormControl>
                  <div className="relative flex items-center max-w-2xl">
                      <Icon
                        icon="ph:envelope-simple-fill"
                         className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 transform text-[#737373]"
                            />



                     
                     
                     
                      <Input placeholder="e.g. alex@example.com" type="email" {...field} className="min-w-[311px] tl:min-w-[396px] px-8 py-  border-2 text-sm rounded-lg" />
                    
                      </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              );
            }}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => {
              return (
                <FormItem>
                  <FormLabel>Password*</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="*******"
                      type="password"
                      className={`min-w-[311px] tl:min-w-[396px] px-3 py-2 border-2 text-sm rounded-lg`}
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
            name="confirmpassword"
            render={({ field }) => {
              return (
                <FormItem>
                  <FormLabel>Confirm Password*</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="*******"
                      type="password"
                      className={`min-w-[311px] tl:min-w-[396px] px-3 py-2 border-2 text-sm rounded-lg`}
                      {...field}

                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              );
            }}
          />
          <Button type="submit" className="w-full bg-[#633CFF] mt-[44px] mb-[20px] tl:mt-[20px]">
            Save
          </Button>
        </form>
      </Form>
      <div className="flex flex-col justify-center items-center">
        <div className="flex flex-col tl:flex-row tl:space-x-2 text-[16px]  justify-center items-center">
        <p className="text-[#737373]"> Already have an account?</p>
        <Link href='/login'>
        <p className="text-[#633CFF]"> Login </p>
        </Link>
        </div>
       </div>
       
    </main>



         {/* <form className="flex flex-col mt-[64px] min-w-[311px] tl:min-w-[476px] tl:p-[40px]"  >
        

        <div className="tl:min-w-[396px]"> <ul>
          <li>
          <p className="text-[24px] tl:text-[32px] tl:font-bold">Create Account</p>
          </li>
        <li className="mt-[8px]">
          <p>Let's got you started sharing your links! </p>
        </li>
        </ul> </div>
       <div className="flex flex-col mt-[40px] gap-[24px]"> 
      <div className="">
          <label htmlFor="email" className="block text-[#666666] text-[12px]  mb-2">
            Email Address
          </label>
          <input
            type="email"
            id="email"
            name="email"
            placeholder='example@gmail.com'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={`min-w-[311px] tl:min-w-[396px] px-3 py-2 border-2 text-sm rounded-lg`}
          />
              <br />
  
        </div>
        <div className="">
          <label htmlFor="password" className="block text-[#666666] text-[12px]  mb-2">
           Create Password
          </label>
          <input
            type="password"
            id="password"
            name="password"
            placeholder='**********'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={`min-w-[311px] tl:min-w-[396px]  px-3 py-2 border-2 text-sm rounded-lg`}
          />
              <br />
         
        </div>
        <div className="">
          <label htmlFor="retypepassword" className="block text-[#666666] text-[12px]  mb-2">
            Confirm Password
          </label>
          <input
            type="password"
            id="retypepassword"
            name="retypepassword"
            placeholder='**********'
            value={confirmation}
            onChange={(e)=>setConfirmation(e.target.value)}
            className={`min-w-[311px] tl:min-w-[396px]  px-3 py-2 border-2 text-sm  rounded-lg`}
          />
              <br />
          
        </div>
        <p className="text-[12px]">
        Password must contain at least 8 characters
        </p>

        {error && (
              <div
                className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative"
                role="alert"
              >
                <span className="block sm:inline">{error}</span>
              </div>
            )}

        <div className="flex flex-col justify-center items-center"><Button   className="px-[27px] py-[11px] bg-[#633CFF] text-white text-center rounded-lg min-w-[311px] tl:min-w-[396px] " > Create a new account </Button></div>
        <div className="flex flex-col text-[16px]  justify-center items-center">
        <p> Already have an account?</p>
        <p className="text-[#633CFF]"> Login </p>
       </div>
       </div>
     
      </form> */}



        </div>
        </div>   
        </>
    );
}










//   interface User{
//     name: string;
    
// }
// interface Errors {
//     email?: string;
//     password?: string;
//     retypePassword?: string;
//   }

// const login = () => {
    
//     const [email,setEmail] = useState('')
//     const [password,setPassword] = useState('')
//     const [retypepassword,setRetypePassword] = useState('')
//     const [errors, setErrors] = useState<Errors>({})
//     const [submitted, setSubmitted] = useState(false);
//     //  const [agree, setAgree] = useState(false);
  
//  const validateForm = () => {
//   let isValid = true;
//   let newErrors: Errors = {};

//   // Validate emai:
//   if (!email) {
//     newErrors.email = 'Email is required';
//     isValid = false;
//   }
  

//   // Validate password
//   const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
//   if (!password || !passwordRegex.test(password) ) {
//     newErrors.password = 'Password must be at least 8 characters, including one uppercase letter, one lowercase letter, and one digit';
    
//     isValid = false;
//   }
//     //Validate retype password
//   if (retypepassword !== password){
//     newErrors.retypePassword='Password does not match'
//     isValid = false;
//   }


//   setErrors(newErrors);
//   return isValid;
// };