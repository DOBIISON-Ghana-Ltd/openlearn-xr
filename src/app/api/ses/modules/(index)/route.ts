import { JSend } from "@/lib/utils/jsend";
import prisma from "@/adapters/db/client";
import ZSes from "@/data/api/ses/ses.schema";
import { apiHandler } from "@/lib/utils/api-handler";

export const GET = apiHandler(async (req) => {
  const query = ZSes.SesModuleGetAll.shape.query.parse(
    Object.fromEntries(req.nextUrl.searchParams)
  );

  const whereClause: any = {
    status: { in: ["PUBLISHED"] },
  };

  const moduleWhere: any = {};

  if (query?.search && query.search.trim() !== "") {
    moduleWhere.title = { contains: query.search.trim(), mode: "insensitive" };
  }

  const collectionWhere: any = {};

  if (query?.subject && query.subject !== "all") {
    collectionWhere.name = { contains: query.subject, mode: "insensitive" };
  }

  if (query?.grade && query.grade !== "all") {
    collectionWhere.grade = { contains: query.grade, mode: "insensitive" };
  }

  if (Object.keys(collectionWhere).length > 0) {
    moduleWhere.collection = collectionWhere;
  }

  if (Object.keys(moduleWhere).length > 0) {
    whereClause.module = moduleWhere;
  }

  const modules = await prisma.moduleVersion.findMany({
    where: whereClause,
    select: {
      id: true,
      module: {
        select: {
          title: true,
          duration: true,
          difficulty: true,
          image: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const parsedData = ZSes.SesModuleGetAll.shape.res.parse(modules);
  return JSend.success(parsedData);
});
