
import React, { ReactHTMLElement } from 'react'
import { Icon } from '@iconify/react';

export interface Linkx {
    name: string;
    color: string;
    icon: string
    id?:string;
    quantity?: number;
    value: string; // Replace with the actual value

}

const user: Linkx[] = [{
    name: "Github", // Replace with the actual name
    color: "[#1A1A1A]",
     icon: 'teenyicons:github-solid' ,
     value: "Github", // Replace with the actual color
},
{
    name: "Twitter", // Replace with the actual name
    color: "#43B7E9",
    icon: 'mdi:twitter' , 
    value: "Twitter",// Replace with the actual color
},
{
    name: "Linkedin", // Replace with the actual name
    color: "#2D68FF",
    icon: 'mdi:linkedin' , 
    value: "Linkedin",// Replace with the actual color
},
{
    name: "YouTube", // Replace with the actual name
    color: "#EE3939",
    icon: 'ri:youtube-fill' ,
    value: "YouTube",// Replace with the actual color
},
{
    name: "Facebook", // Replace with the actual name
    color: "#2442AC",
    icon:'bi:facebook' , 
    value: "Facebook",// Replace with the actual color
},
{
    name: "Twitch", // Replace with the actual name
    color: "#EE3FC8",
    icon: 'mdi:twitch' ,
    value: "Twitch",// Replace with the actual color
},
{
    name: "Dev.to", // Replace with the actual name
    color: "#333333",
    icon: 'skill-icons:devto-dark',
    value: "Dev.to",// Replace with the actual color
},{
    name: "Codewars", // Replace with the actual name
    color: "#8A1A50",
    icon: 'cib:codewars',
    value: "Codewars", // Replace with the actual color
},
// {
//     name: "Codepen", // Replace with the actual name
//     color: "#302267" // Replace with the actual color
// },
{
    name: "FreeCodeCamp", // Replace with the actual name
    color: "#302267",
    icon: 'simple-icons:freecodecamp', 
    value: "FreeCodeCamp",// Replace with the actual color
},
{
    name: "Gitlab", // Replace with the actual name
    color: "#EB4925",
    icon: 'ri:gitlab-fill' ,
    value: "Gitlab", // Replace with the actual color
},
{
    name: "Hashnode", // Replace with the actual name
    color: "#0330D1",
    icon: 'fa6-brands:hashnode', 
    value: "Hashnode",// Replace with the actual color
},
{
    name: "Stack Overflow", // Replace with the actual name
    color: "#EC7100",
    icon: 'cib:stackoverflow' ,
    value: "Stack Overflow", // Replace with the actual color
},

];
export default user

