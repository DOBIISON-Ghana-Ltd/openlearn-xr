import { JSend } from "@/lib/utils/jsend";
import prisma from "@/adapters/db/client";
import ZSim from "@/data/api/sim/sim.schema";
import { apiHandler } from "@/lib/utils/api-handler";

export const GET = apiHandler(async (req) => {
  const { searchParams } = req.nextUrl;
  const search = searchParams.get("search") ?? undefined;
  const status = searchParams.get("status") ?? undefined;
  const subject = searchParams.get("subject") ?? undefined;
  const grade = searchParams.get("grade") ?? undefined;

  const query = ZSim.SimModuleGetAll.shape.query.parse({
    search,
    status,
    subject,
    grade,
  });

  const whereClause: any = {
    status: { in: ["DRAFT", "PUBLISHED"] },
  };

  if (query?.status && query.status !== "all") {
    if (query.status === "available" || query.status === "PUBLISHED") {
      whereClause.status = "PUBLISHED";
    } else if (query.status === "coming-soon" || query.status === "DRAFT") {
      whereClause.status = "DRAFT";
    }
  }

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
      versionNumber: true,
      status: true,
      _count: {
        select: {
          checkpoints: true,
        },
      },
      module: {
        select: {
          title: true,
          collection: {
            select: {
              name: true,
              grade: true,
            },
          },
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const parsedData = ZSim.SimModuleGetAll.shape.res.parse(modules);
  return JSend.success(parsedData);
});
