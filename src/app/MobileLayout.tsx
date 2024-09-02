

import Header from "./(mobile)/Header";




export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
   
      <div className="flex flex-col h-screen">
      <Header/>
      {children}
      </div>
             
            
         
        
   
  );
}
