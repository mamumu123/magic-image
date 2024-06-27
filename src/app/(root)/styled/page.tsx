"use client";

import { Button, Card, Spinner } from 'flowbite-react';
import { useRef, useState } from 'react';
import Image from "next/image";
import { Input } from "@/components/ui/input";
import { CANVAS_STYLE, EXAMPLES } from '@/constants';
import { cn } from '@/lib/utils';

import { download } from '@/utils/download';
import { useTranslations } from 'next-intl';

export default function Home() {
  const t = useTranslations('Styled');

  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [demoIndex, setDemoIndex] = useState(0);

  const [exampleState, setExampleState] = useState(EXAMPLES);

  const [loading, setLoading] = useState(false);

  const handleClickDemo = async (index: number) => {
    const demo = exampleState[index];
    setDemoIndex(index);
  }

  const getUuidByFile = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file) {
      console.error('error upload');
      return
    }
    const formData = new FormData();
    formData.append('files', file);
    const response = await fetch('/api/upload', {
      method: 'POST',
      body: formData,
    });
    const result = await response.json();
    if (result?.status !== 200) {
      return null
    }
    return result.data;
  }

  const handleMediaChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const path = await getUuidByFile(event);
    console.log('path', path);
    if (!path) {
      console.log(t('upload_error'))
    }
  }

  const onTry = async (url?: string) => {
    const demoUrl = 'https://gitee.com/lemC/picx-images-hosting/raw/master/WechatIMG32460.1aov3aqb5w.jpg' // TODO:
    const nextUrl = demoUrl;
    console.log('nextUrl', nextUrl);
    const response = await fetch('/api/coze-styled', {
      method: 'POST',
      body: JSON.stringify({
        url: nextUrl,
        id: 4,
      }),
    });
    console.log('response', response);
  }

  return (
    <div className={`flex h-full width-full  flex-col`}>
      <div className='font-bold text-4xl text-center text-black h-[50px]'>{t('title')}</div>
      <h2 className="mb-4 text-center  h-[20px]">{t('desc')}</h2>

      <div className='flex-1 flex p-[6px] relative width-full justify-between gap-10 overflow-auto'>
        <Card className='flex-1 flex-col p-[6px] relative flex'>
          <div className={' h-[400px] w-full relative flex justify-center items-center'}>
            <canvas width={CANVAS_STYLE} height={CANVAS_STYLE} ref={canvasRef} className={'w-[400px] h-[400px]'}></canvas>
            {loading && <div className={'absolute top-0 left-0 flex flex-col bg-[#000000dd] items-center justify-center w-full h-full'}>
              <Spinner aria-label="Default status example" size={'xl'} />
              <div className={'mt-2 text-lg'}>{t('dealing')}</div>
            </div>
            }
          </div>
          <div className='w-full relative flex justify-between items-center'>
            <Input disabled={loading} type="file" className='h-[60px] flex-1' onChange={handleMediaChange} accept='image/*' />
            <Button className='flex-1' disabled={loading} onClick={() => download(canvasRef)}>{t('download')}</Button>
          </div>

          <div>{t('try-it')} </div>
          <div className='h-[100px] w-full flex  items-center gap-5 justify-start overflow-x-auto '>
            {exampleState.map((it, index) => (
              <div
                key={it.url}
                onClick={() => handleClickDemo(index)}
                className={cn('w-[100px] h-[100px] relative border-[5px] rounded-md', demoIndex === index ? 'border-teal-300' : '')}>
                <Image
                  src={it.url}
                  style={{ objectFit: 'contain', fill: 'contain' }}
                  sizes="100%"
                  fill alt='bg' />
              </div>
            ))}
          </div>
          <Button onClick={() => onTry()}>{t('try-it')}</Button>

        </Card>

        <div className='flex-1 rounded-md overflow-y-auto'>
          <Card className='flex-1 flex-col p-[6px] relative flex'>
            {/* <Button onClick={onSubmit}>{t('submit')}</Button> */}
          </Card>

        </div>
      </div>
    </div >
  );
}
