import Image from "next/image"
import { cn } from "@/lib/utils"
import Link from "next/link"
import { Button, buttonVariants } from "@/components/ui/button"

import { AspectRatio } from "@/components/ui/aspect-ratio";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { ArrowRightIcon } from '@radix-ui/react-icons';
import { Movie } from '@/lib/types'

interface Props {
  data?: Movie
}

export function BigBillboard({ data }: Props) {
  const image_url = `${process.env.NEXT_PUBLIC_IMAGE_BASE}original/${data?.backdrop_path}`
  const logo_url = `${process.env.NEXT_PUBLIC_IMAGE_BASE}original/${data?.logo_path}`

  return (
    <div className="container relative">
      <div className="py-12 md:pb-0 xl:pt-20">
        <div className="lg:grid lg:grid-cols-3 h-[60vh]" style={{ backgroundImage: 'url(' + image_url + ')', backgroundSize: 'cover', backgroundRepeat: 'no-repeat' }}>
          <div className="relative z-10 col-span-2">
            <h1 className="text-5xl font-light leading-tight sm:text-7xl xl:text-8xl xl:text-[105px] font-aeonik">
                {data?.logo_path ?
                <img src={logo_url} className="md:w-11/12 3xl:w-full max-h:30vh"></img>
                 : <div className="bg-background">
                  {data?.title}
                  </div>}
            </h1>
            <p className="mb-10 text-base leading-normal lg:pr-12 lg:mt-8 lg:text-lg md:w-11/12 3xl:w-full lg:mb-12 mt-6 bg-background">{data?.overview}</p>
            <div className="w-full mb-16 md:w-2/3 md:flex-row md:space-x-4 md:mb-0 bottom-0 left-0">
              <div className="flex w-auto items-center">
                <div className="w-auto">
                  <div className="flex flex-wrap sm:flex-nowrap w-full lg:justify-start gap-6 sm:w-auto">
                    <Button>Play</Button>
                    <a target="" className="mx-auto inline-block" href="/demo">
                      <div className="text-white bg-scale-mauve hover:bg-[#A672A2] text-base px-4 py-2 leading-[150%] font-medium justify-center flex flex-nowrap rounded-full whitespace-nowrap transition-all duration-[400ms] cursor-pointer group items-center h-full group leading-[150%] hover:brightness-75"><span className="text underline-offset-2 hover:underline-offset-4 transition-all duration-[400ms]">Book a Demo</span> <span className="inline-block w-fit ml-1 font-normal transition-all duration-[400ms] transform group-hover:translate-x-1 font-unicode">→</span></div>
                    </a>
                    <a target="" className="mx-auto inline-block" href="/data-engine">
                      <div className="text-white text-base py-2 font-medium justify-center flex flex-nowrap rounded-full whitespace-nowrap transition-all duration-[400ms] cursor-pointer group items-center h-full group leading-[150%] hover:brightness-75"><span className="text underline-offset-2 hover:underline-offset-4 transition-all duration-[400ms]">Build AI</span> <span className="inline-block w-fit ml-1 font-normal transition-all duration-[400ms] transform group-hover:translate-x-1 font-unicode">→</span></div>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* <div className="relative lg:flex items-center hidden">
            <div className="md:block hidden absolute z-0 top-24 lg:left-1/3 lg:-translate-x-1/2 lg:top-1/3 lg:-translate-y-1/2 3xl:top-1/2 3xl:left-1/2 3xl:-translate-y-1/2 w-full md:w-96 md:h-96 lg:w-[400px] lg:h-[400px] 3xl:w-[512px] 3xl:h-[512px] opacity-70 md:opacity-100">
               <canvas className="transition-all duration-1000" style="display: block; width: 512px; height: 512px;" data-engine="three.js r149" width="0" height="0"></canvas>
            </div>
         </div> */}
        </div>
      </div>
    </div>
)
}
