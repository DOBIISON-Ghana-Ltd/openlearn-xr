'use client';

import Image from 'next/image';
import { FileText, FileCode, Box, Package } from 'lucide-react';

interface ResourceItem {
  id: string;
  title: string;
  type: 'pdf' | '3d' | 'unity' | 'doc';
  image?: string;
}

const RESOURCES: ResourceItem[] = [
  {
    id: '1',
    title: 'Teaching Guide For OpenLearnXR',
    type: 'pdf',
  },
  {
    id: '2',
    title: 'Advanced Cardiac Anatomy.obj',
    type: '3d',
    image: '/(new)/module-thumbnail.png',
  },
  {
    id: '3',
    title: 'MarsBase_Environment.unitypackage',
    type: 'unity',
    image: '/(new)/module-thumbnail.png',
  },
  {
    id: '4',
    title: 'Classroom_Curriculum_V2.docx',
    type: 'doc',
  },
];

export default function TeachingResourcesClient() {
  return (
    <div className="py-8 px-6 sm:px-10 lg:px-12 flex flex-col gap-6 max-w-[1084px]">
      <h2 className="text-[24px] font-semibold text-[#4b5563]">Resource Files</h2>

      {/* 4-Column Responsive Grid of Resource Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {RESOURCES.map((item) => (
          <div
            key={item.id}
            className="bg-[#ddf3f3] backdrop-blur-[6px] border border-white/10 p-4 rounded-xl flex flex-col gap-4 shadow-xs transition-all hover:shadow-md hover:border-[#459d9f]/30 cursor-pointer"
          >
            {/* Top Media Box */}
            <div className="bg-[#1c2024] h-[128px] rounded-lg overflow-hidden relative flex items-center justify-center">
              {item.image ? (
                <>
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    className="object-cover opacity-90"
                  />
                  <div className="absolute top-2 right-2 size-6 rounded bg-black/60 backdrop-blur-xs flex items-center justify-center text-white">
                    {item.type === '3d' ? (
                      <Box className="size-3.5" />
                    ) : (
                      <Package className="size-3.5" />
                    )}
                  </div>
                </>
              ) : item.type === 'pdf' ? (
                <div className="flex flex-col items-center gap-1 text-[#459d9f]">
                  <FileText className="size-10" />
                  <span className="text-[10px] font-bold uppercase tracking-wider">PDF</span>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-1 text-[#9ca3af]">
                  <FileCode className="size-10" />
                  <span className="text-[10px] font-bold uppercase tracking-wider">DOCX</span>
                </div>
              )}
            </div>

            {/* Card Title */}
            <h3 className="text-[16px] font-normal text-[#6b7280] leading-snug line-clamp-2">
              {item.title}
            </h3>
          </div>
        ))}
      </div>
    </div>
  );
}
