import React from "react";
import { TailSpin } from "react-loader-spinner";
import {Loader} from "lucide-react"


const Loading = () => {
  return (
    <div className='h-screen w-full flex items-center justify-center absolute top-0 left-0' style={{background:"rgba(0,0,0,0.7)", zIndex:"1"}}>
            <TailSpin
              visible={true}
              height="180"
              width="180"
              color="#5549c9"
              ariaLabel="tail-spin-loading"
              radius="1"
              wrapperStyle={{}}
              wrapperClass=""
            />
          </div>
  );
};

export const loader = 
    <div className="flex items-center justify-center h-screen">
      <Loader className="size-10 animate-spin" />
    </div>


export default Loading;
