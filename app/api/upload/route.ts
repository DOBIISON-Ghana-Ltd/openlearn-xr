import { auth } from '@/adapters/auth/server';
import { ZStorageMetadata } from '@/data/schema.base';
import { RejectUpload, route, type Router } from '@better-upload/server';
import { toRouteHandler } from '@better-upload/server/adapters/next';
import { aws } from '@better-upload/server/clients';
import { headers } from 'next/headers';

const s3 = aws({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  region: process.env.AWS_REGION!,
});

const router: Router = {
  client: s3,
  bucketName: process.env.S3_BUCKET_NAME!,
  routes: {
    image: route({
      fileTypes: ['image/*'],
      multipleFiles: false,
      clientMetadataSchema: ZStorageMetadata,
      onBeforeUpload: async ({ clientMetadata }) => {
        const res = await auth.api.getSession({
          headers: await headers(),
        });

        if(!res) {
          throw new RejectUpload('Not logged in!')
        }

        return {
          objectInfo: {
            key: clientMetadata.key,
            metadata: {
              msc: clientMetadata.msc
            }
          }
        }
      }
    }),
  },
};

export const { POST } = toRouteHandler(router);