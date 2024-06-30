"use client";

import { Button, Card, Label, Spinner } from 'flowbite-react';
import { useRef, useState, useMemo, useEffect } from 'react';
import Image from "next/image";
import { Input } from "@/components/ui/input";
import { CANVAS_STYLE, EXAMPLES, STYLE_LIST } from '@/constants';
import { cn } from '@/lib/utils';

import { download } from '@/utils/download';
import { useTranslations } from 'next-intl';
import { getImageSize, loadImage } from '@/utils';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { STATUS_SUCCESS } from '@/constants/end';

const host = process.env.NEXT_PUBLIC_HOST || '';

export default function Home() {
  // i18-n
  const t = useTranslations('Styled');

  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [loading, setLoading] = useState(false);

  // demo
  const [demoIndex, setDemoIndex] = useState(0);

  // result
  const [currentUrl, setCurrentUrl] = useState(`${EXAMPLES[demoIndex].url}`);

  const [style, setStyle] = useState(STYLE_LIST[0].value);

  const handleUrl = async (url: string) => {
    setCurrentUrl(url);
  }

  const [result, setResult] = useState<{ width: number, height: number, url: string } | null>(null);

  const [userUploadData, setUserLoaderData] = useState<{ width: number, height: number, url: string } | null>(null)
  const imageDataResult = useMemo(() => {
    if (result) {
      return result;
    }
    if (userUploadData) {
      handleUrl(userUploadData.url);
      return userUploadData;
    }
    handleUrl(EXAMPLES[demoIndex].url);

    return EXAMPLES[demoIndex];
  }, [demoIndex, userUploadData, result]);

  const handleClickDemo = async (index: number) => {
    setUserLoaderData(null);
    setResult(null);
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
    const file = event.target.files?.[0];
    if (!file) {
      console.error('error upload');
      return
    }

    const path = await getUuidByFile(event);
    const { width, height } = await getImageSize(path);
    setResult(null);
    setUserLoaderData({
      width,
      height,
      url: path,
    })

    if (!path) {
      console.log(t('upload_error'))
    }
    setLoading(false);
  }


  const handleFieldValue = (value: string) => {

    setStyle(value);
  };

  const onTry = async () => {
    setLoading(true);
    if (!currentUrl) {
      console.error('error upload');
      return
    }

    // example
    const currentIsExample = EXAMPLES.find((item) => item.url === currentUrl);
    if (currentIsExample) {
      const { data } = currentIsExample;
      // @ts-ignore
      const result = data?.[style] as string;
      if (result) {
        setTimeout(async () => {
          const { width, height } = await getImageSize(result);
          setResult({
            url: result,
            width: width,
            height: height,
          })
          setLoading(false);
        }, 1000);
      }
      return;
    }


    // localUpload
    let resultUrl = currentUrl;
    const noHost = currentUrl.startsWith('/');
    if (noHost) {
      resultUrl = `${host}${currentUrl}`;
    }

    const response = await fetch('/api/coze-styled', {
      method: 'POST',
      body: JSON.stringify({
        url: resultUrl,
        id: style,
      }),
    });
    console.log('response', response);
    const { data, status } = (await response.json()) || {};
    if (status === STATUS_SUCCESS) {
      const { width, height } = await getImageSize(data);
      setResult({
        url: data,
        width: width,
        height: height,
      })
    }

    setLoading(false);
  }

  useEffect(() => {

    (async () => {
      const { width, height, url } = imageDataResult;
      if (!canvasRef.current || !width || !height || !url) {
        console.error('canvasRef', canvasRef.current, 'width', width, 'height', height, 'url', url);
        return;
      }
      const ctx = canvasRef.current?.getContext('2d', { willReadFrequently: true });
      if (!ctx) {
        console.error('ctx', ctx);
        return
      }
      canvasRef.current.style.width = `${width > height ? CANVAS_STYLE : CANVAS_STYLE * (width / height)}px`;
      canvasRef.current.style.height = `${width > height ? CANVAS_STYLE * (height / width) : CANVAS_STYLE}px`
      canvasRef.current.width = width;
      canvasRef.current.height = height;
      const imageElement = await loadImage(url);
      ctx.drawImage(imageElement, 0, 0, width, height);
    })()
  })

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
            <Button disabled={loading} onClick={() => download(canvasRef)}>{t('download')}</Button>
          </div>

          <div>{t('try-it')} </div>
          <div className='h-[100px] w-full flex  items-center gap-5 justify-start overflow-x-auto '>
            {EXAMPLES.map((it, index) => (
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

        </Card>

        <div className='flex-1 flex-col rounded-md overflow-y-auto'>
          <Card className='h-full p-[6px] relative flex'>
            <div className='h-full w-full'>

              <div className={'flex  items-center gap-4 mb-3'}>
                <Label htmlFor="current-url" className={'text-nowrap'}>{t('current-url')}</Label>
                <Input className={'flex-1'} id='current-url' value={currentUrl} onChange={(e) => setCurrentUrl(e.target.value)} />
              </div>

              <div className={'flex  items-center gap-4 mb-3'}>
                <Label htmlFor="current-url" className={'text-nowrap'}>{t('style-id')}</Label>
                <Select onValueChange={handleFieldValue} disabled={loading} defaultValue={style}>
                  <SelectTrigger className="flex-1">
                    <SelectValue placeholder={t('style-id')} />
                  </SelectTrigger>
                  <SelectContent>
                    {/* <SelectGroup> */}
                    {/* <SelectLabel>{style.name}</SelectLabel> */}
                    {STYLE_LIST.map((item) => (
                      <SelectItem
                        key={item.value}
                        value={item.value} // *stringify the object here
                        textValue={item.name}
                        defaultValue="Select"
                      >
                        {item.name}
                      </SelectItem>
                    ))}
                    {/* </SelectGroup> */}

                  </SelectContent>
                </Select>
              </div>

              <Button color={'blue'} className='w-full' onClick={() => onTry()} disabled={loading}>{t('start')}</Button>
            </div>
          </Card>

        </div>
      </div>
    </div >
  );
}
