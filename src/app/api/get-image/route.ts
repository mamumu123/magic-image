import { NextRequest, NextResponse } from "next/server";
import mime from 'mime-types';
import path from "path";
import fs from 'fs';

type Query = {
    id: string
}

export async function GET(
    request: NextRequest,
) {
    const searchParams = request.nextUrl.searchParams;
    const query: Query = {
        id: searchParams.get("id") || "",
    }

    const { id } = query;

    if (!id) {
        return new Response('', {
            status: 404,
        });
    }

    const uploadDir = path.join(__dirname, '..', 'uploads');
    const imagePath = path.join(uploadDir, query.id);

    // if (!(await fs.promises.access(imagePath).then(() => true).catch(() => false))) {
    //     return new Response('', {
    //         status: 404,
    //     });
    // }

    const imageMimeType = mime.lookup(imagePath);

    // 读取本地文件内容
    const fileContent = await fs.promises.readFile(imagePath);

    // 创建一个新的 Headers 对象，并设置 Content-Type
    const headers = new Headers();
    headers.set('Content-Type', imageMimeType as string);
    return new NextResponse(new Blob([fileContent]), {
        status: 200,
        statusText: 'OK',
        headers,
    })
}