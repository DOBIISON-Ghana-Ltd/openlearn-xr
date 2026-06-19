import { apiRegistry } from '@/data/registry';
import { uploadFile as uploadFilePrimitive } from '@better-upload/client';
import { Infer } from '@/data/types.base';
import slugify from '@sindresorhus/slugify';
import { env } from '../config/env';

type IUploadFile = {
  file: File;
} & Infer["ZStorageMetadata"];
export const uploadFile = async (props: IUploadFile): Promise<Awaited<ReturnType<typeof uploadFilePrimitive>>> => {
  return await uploadFilePrimitive({
    file: props.file,
    route: 'image',
    api: env.NEXT_PUBLIC_STORAGE_URL,
    metadata: {
      key: props.key,
      msc: props.msc
    },
    credentials: 'include'
  });
};

interface IGetImageDimensions {
  width: number;
  height: number;
}
export const getImageDimensions = (file: File): Promise<IGetImageDimensions> => {
  return new Promise((resolve, reject) => {
    // Only process image files
    if (!file.type.startsWith('image/')) {
      return reject(new Error("File is not an image"));
    }

    const img = new Image();
    const objectUrl = URL.createObjectURL(file);

    img.onload = () => {
      const dimensions = {
        width: img.naturalWidth, // naturalWidth is more reliable for original size
        height: img.naturalHeight,
      };
      URL.revokeObjectURL(objectUrl);
      resolve(dimensions);
    };

    img.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      reject(new Error("Failed to load image for dimension check"));
    };

    img.src = objectUrl;
  });
};

type IHandleFileUpload = {
  file: File | null;
  folder: Infer["ZMedia"]["folder"]
} & Pick<IUploadFile, 'msc'>;
export async function handleFileUpload(params: IHandleFileUpload) {
  const { file, folder, msc } = params;
  if (!file) return null;

  // get these file info: key, fileName, mimeType, width, height
  const key = `${folder}/${Date.now()}-${slugify(file.name)}`;
  const fileName = file.name;
  const mimeType = file.type;
  const { width, height } = await getImageDimensions(file);

  // 1. Upload to S3
  const { file: uploadRes } = await uploadFile({ file, key, msc });

  // 2. Create media record in DB
  const mediaRes = await apiRegistry["public:media:post:one"]["mutationFn"]({
    fileName,
    mimeType,
    folder,
    width,
    height,
    key
  })

  return {
    id: mediaRes?.id || "",
    key
  }; 
};

export const getImageUrl = (key: string) => {
  if (key === "") return null;
  
  let prefix = env.NEXT_PUBLIC_IMAGE_URL || "/uploads"
  // remove trailing slash if exists
  if (prefix.endsWith('/')) {
    prefix = prefix.slice(0, -1);
  }
  return `${prefix}/${key}`;
};