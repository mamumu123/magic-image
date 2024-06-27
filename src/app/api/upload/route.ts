import { NextRequest, NextResponse } from "next/server";
import fs from 'fs';
import { pipeline } from 'stream';
import { promisify } from 'util';
import path from "path";
import { nanoid } from 'nanoid'

const pump = promisify(pipeline);

export async function POST(req: NextRequest) {
    try {
        const formData = await req.formData();
        const file = formData.getAll('files')[0] as File;

        const uploadDir = path.join(__dirname, 'uploads');

        // 确保上传目录存在
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir);
        }

        const fileId = nanoid()

        const newPath = path.join(uploadDir, fileId);
        console.log('newPath', newPath);

        await pump(file.stream() as any, fs.createWriteStream(newPath));
        return NextResponse.json({ status: "success", data: fileId })
    }
    catch (e) {
        console.error('e', e);
        return NextResponse.json({ status: "fail", data: e })
    }
}