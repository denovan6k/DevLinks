
"use client";
import { useEffect } from "react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import {  useRouter } from "next/navigation";
import { useDropdownContext } from "@/app/context/dropdowncontext";
import { Linkx } from "../linkdata/data";
import { Icon } from '@iconify/react';
import db from '../../../lib/firestore';
import { collection, addDoc, getDocs, doc, updateDoc, deleteDoc } from "firebase/firestore";
import Empty from "../empty";
import Link from "next/link";

interface Item {
  id?: string;
  name?: string;
  platform: string;
  link: string;
  icon: string;
  color: string;
}

export default function FormUpdater() {
  const { options } = useDropdownContext();
  
  
  const router = useRouter();

  const [items, setItems] = useState<Item[]>([]);



  
  useEffect(() => {
    const fetchItems = async () => {
      const querySnapshot = await getDocs(collection(db, "items"));
      setItems(querySnapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id } as Item)));
    };

    fetchItems();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[]); 

  // [] missing dependency useeffect





  

  const handleRemove = async (index: any, id: string | undefined) => {
    if (id) {
      try {
        await deleteDoc(doc(db, "items", id)); // Delete the document from Firestore
        console.log("Document deleted with ID: ", id);
      } catch (e) {
        console.error("Error deleting document: ", e);
      }

    }
    const newItems = items.filter((_: any, i: any) => i !== index);
    setItems(newItems);
   
  }



  const handleAddForm = () => {
    const newForms = [...items, { platform: "", link: "", icon: "", color: "" }];
   setItems(newForms);
    
  };

  const handleRemoveForm = (index: any) => {
    const newForms = items.filter((_: any, i: any) => i !== index);
    setItems(newForms);
  
  };

  const handleChange = (index: any, field: any, value: any) => {
    let newForms = items.map((form: any, i: any) => (i === index ? { ...form, [field]: value } : form));

    if (field === "platform") {
      const selectedOption = options.find((option: Linkx) => option.value === value);
      if (selectedOption) {
        newForms[index] = {
          ...newForms[index],
          icon: selectedOption.icon,
          color: selectedOption.color,
        };
      }
    }

    setItems(newForms);
    
  };

  const handleSave = async (event: any) => {
    event.preventDefault();









    for (const form of items) {
      if (!form.platform || !form.link || !form.icon || !form.color) {
        console.error("All form fields must be filled out:", form);
        alert("Please fill out all form fields before saving.");
        return;
      }

      try {
        if (form.id) {
          // Update existing document
          const docRef = doc(db, "items", form.id);
          await updateDoc(docRef, {
            platform: form.platform,
            link: form.link,
            icon: form.icon,
            color: form.color,
          });
          console.log("Document updated with ID: ", form.id);
        } else {
          // Add new document
          const docRef = await addDoc(collection(db, "items"), {
            platform: form.platform,
            link: form.link,
            icon: form.icon,
            color: form.color,
          });
          console.log("Document written with ID: ", docRef.id);
        }
        router.push("/profile");
      } catch (e) {
        console.error("Error saving document: ", e);
      }
    }
  }

  return (

    <div className=" p-4 flex flex-col justify-center items-center gap-4">
      <Button className="border-2 border-purple-500 bg-[#ffff] text-purple-500 text-center px-[27px] py-[11px] tl:w-full" onClick={handleAddForm} size='lg'>
        + Add new link
      </Button>
      
      {items.length === 0 && <Empty/>}
       <div className="w-full">
      {items.map((form: any, index: any) => (
        <Card key={index} className="mb-4 p-[20px] rounded-lg flex flex-col ">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <Icon icon="hugeicons:menu-09" />
              <h3 className="font-semibold text-[16px] text-[#737373]">Link #{index + 1}</h3>
            </div>

            <Button variant="ghost" onClick={() => handleRemove(index,form.id)}>
              Remove
            </Button>
          
          </div>
          <div className="p-4">
            <div className="space-y-2">
              <Label htmlFor={`platform-${index}`}>Platform</Label>
              <Select value={form.platform} onValueChange={(value) => handleChange(index, "platform", value)}>
                <SelectTrigger id={`platform-${index}`}>
                  <SelectValue placeholder="Select platform" />
                </SelectTrigger>
                <SelectContent>
                  {options.map((option: Linkx, index) => (
                    <SelectItem value={option.value} key={index}>
                      <div className="flex items-center gap-2">
                        <Icon icon={option.icon} />
                        {option.name}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2 mt-4">
              <Label htmlFor={`link-${index}`}>Link</Label>
              <div className="relative flex items-center max-w-2xl">
                <Icon
                  icon="ph:link-bold"
                  className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 transform text-[#737373]"
                />
                <Input
                  id={`link-${index}`}
                  placeholder="https://example.com"
                  value={form.link}
                  className="pl-8"
                  onChange={(e) => handleChange(index, "link", e.target.value)}
                />
              </div>
            </div>
          </div>
          
        </Card>
      ))}

    
       
        <Button className="w-full bg-[#633CFF] mt-[44px] " onClick={handleSave}>
           
          Save
        
        </Button>
        
     
      </div>
    </div>
  )
}


