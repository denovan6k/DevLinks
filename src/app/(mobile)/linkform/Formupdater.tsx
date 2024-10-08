"use client";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import { useDropdownContext } from "@/app/context/dropdowncontext";
import { Linkx } from "../linkdata/data";
import { Icon } from '@iconify/react';
import db from '../../../lib/firestore';
import { collection, addDoc, getDocs, doc, updateDoc, deleteDoc, query, where } from "firebase/firestore";
import Empty from "../empty";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import Link from "next/link";
import { toast } from "sonner"
// Item interface
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
  const [user, setUser] = useState<any>(null); // State for user authentication
  const [items, setItems] = useState<Item[]>([]); // State for items
  const router = useRouter();
  const[click, setClicked] =useState<boolean>(false)
  const auth = getAuth(); // Firebase Auth instance
  const [userId, setUserId] = useState<string | null>(null); 
  // Check user authentication
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
        setUserId(user.uid);
        fetchItems(user.uid); // Fetch items for the authenticated user
      } else {
        setUser(null);
        router.push("/login"); // Redirect to login if no user
      }
    });

    return () => unsubscribe(); // Cleanup listener
  }, [auth, router]);

  // Fetch items unique to the authenticated user
  const fetchItems = async (userId: string) => {
    try {
      const q = collection(db, `users/${userId}/items`); // Query for documents by userId
      const querySnapshot = await getDocs(q);
      setItems(querySnapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id } as Item)));
    } catch (e) {
      console.error("Error fetching items: ", e);
    }
  };

  // Add form handler
  const handleAddForm = () => {
    const newForms = [...items, { platform: "", link: "", icon: "", color: "" }];
    setItems(newForms);
    setClicked(true) 
  };

  // Remove form handler
  const handleRemove = async (index: any, id: string | undefined) => {
    if (id) {
      try {
        await deleteDoc(doc(db, `users/${userId}/items`, id)); // Delete the document from Firestore
        console.log("Document deleted with ID: ", id);
        router.push("/");
      } catch (e) {
        console.error("Error deleting document: ", e);
      }
    }
    const newItems = items.filter((_: any, i: any) => i !== index);
    setItems(newItems);
  };

  // Change handler for form fields
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

  // Save handler for form submission
  const handleSave = async (event: any) => {
    event.preventDefault();

    if (!user) {
      alert("You need to be logged in to save items.");
      return;
    }

    for (const form of items) {
      if (!form.platform || !form.link || !form.icon || !form.color) {
        console.error("All form fields must be filled out:", form);
        alert("Please fill out all form fields before saving.");
        return;
      }

      try {
        if (form.id) {
          // Update existing document
          const docRef = doc(db, `users/${userId}/items`,form.id);
          await updateDoc(docRef, {
            platform: form.platform,
            link: form.link,
            icon: form.icon,
            color: form.color,
            userId: user.uid, // Associate with the authenticated user
          });
          console.log("Document updated with ID: ", form.id);
        } else {
          // Add new document
          const docRef = await addDoc(collection(db,`users/${userId}/items` ), {
            platform: form.platform,
            link: form.link,
            icon: form.icon,
            color: form.color,
            userId: user.uid, // Associate with the authenticated user
          });
          console.log("Document written with ID: ", docRef.id);
        }
       
        router.push("/profile");
        toast('Link Added', {
          description: "Link added Successfully",
          icon: <Icon icon='ph:seal-check' className="mr-2 text-green-600" />, // Icon component with styling
         
        });
      } catch (e) {
        console.error("Error saving document: ", e);
      }
    }
  };

  return (
    <div className="p-4 flex flex-col justify-center items-center gap-4">
      <Button className="border-2 border-purple-500 bg-[#ffff] text-purple-500 text-center px-[27px] py-[11px] tl:w-full hover:bg-[#EFEBFF]" onClick={handleAddForm} size='lg'>
        + Add new link
      </Button>
  
      {items.length === 0 && <Empty />}  
      <div className="w-full">
        {items.map((form: any, index: any) => (
          <Card key={index} className="mb-4 p-[20px] rounded-lg flex flex-col ">
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-4">
                <Icon icon="hugeicons:menu-09" />
                <h3 className="font-semibold text-[16px] text-[#737373]">Link #{index + 1}</h3>
              </div>

              <Button variant="ghost" onClick={() => handleRemove(index, form.id)}>
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
{click &&  <Button className="w-full bg-[#633CFF] mt-[44px]" onClick={handleSave}>
          Save
        </Button>}
       
      </div>
     
    </div>
  );
}
