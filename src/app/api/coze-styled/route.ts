import { NextRequest, NextResponse } from "next/server";
import { STATUS_SUCCESS } from "@/constants/end";
import fetch from 'node-fetch';

const HTTP_URL = 'https://api.coze.cn/open_api/v2/chat';
const BOT_ID = '7383904589537935371';
const token = process.env.COZE_TOKEN;

export const maxDuration = 60; // This function can run for a maximum of 5 seconds

interface Message {
    role: string,
    type: string,
    content: string,
    content_type: string
}

const getUrlFromCozeContent = (text: string) => {
    const regex = /\[.*?\]\((.*?)\)/;
    const match = text.match(regex);

    if (match) {
        const url = match[1];
        console.log('图片地址:', url);
        return url;
    } else {
        console.log('没有找到图片地址');
        return ''
    }
}



export async function POST(req: NextRequest) {
    try {
        const data = await req.json();
        const { url, id } = data || {};
        const body = JSON.stringify({
            "conversation_id": "123344",
            "user": "29032201862555",
            "bot_id": BOT_ID,
            "query": `这是我提供的照片: image_url: ${url}, style_id: ${id} `,
            "stream": false,
            "custom_variables": {
                "image_url": `${url}`,
                "style_id": `${id}`
            }
        })
        const response = await fetch(HTTP_URL, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
                'Accept': '*/*',
                'Host': 'api.coze.cn',
                'Connection': 'keep-alive',
            },
            body,
        })
        const result = await response.json() as any;
        if (result.code === 0) {
            const current = result.messages?.find?.((item: Message) => item.type === 'answer');
            console.log('current', current);
            const data = current?.content ? getUrlFromCozeContent(current?.content) : '';
            return NextResponse.json({ status: STATUS_SUCCESS, data })
        } else {
            return NextResponse.json({ status: -1, data: result })
        }
    }
    catch (e) {
        console.error('e', e);
        return NextResponse.json({ status: -1, data: e })
    }
}