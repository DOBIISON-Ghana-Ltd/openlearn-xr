import ZApp from "@/data/api/app/app.schema";
import { JSend } from "@/lib/utils/jsend";
import { secureApiRoute } from "@/lib/utils/secure-api-route";
import prisma from "@/adapters/db/client";
import { env } from "@/lib/config/env";
import axios from "axios";

const PAYSTACK_SECRET_KEY = env.PAYSTACK_SECRET_KEY || "";
const ZGetRes = ZApp.AppOnboardingGetLicensing.shape.res;

type IPaystackVerify = {
  status: boolean,
  message: string,
  data: {
    status: "success" | "pending" | "failed" | "processing" | "abandoned" | "reversed"
  }
}

export const GET = secureApiRoute(async (req, ctx, user) => {
  // get the user organization name and id
  const organization = await prisma.organization.findFirst({
    where: {
      members: {
        some: {
          userId: user.id,
          role: "owner",
        },
      },
    },
    select: {
      id: true
    }
  });

  // check if org id has active transaction in pending 
  const transaction = await prisma.transaction.findFirst({
    where: {
      organizationId: organization?.id
    },
    select: {
      id: true,
      accessCode: true,
      reference: true,
      status: true,
    }
  });
  //    check paystack with reference for state of transaction and update the transaction
  if (transaction && transaction.status === "PENDING") {
    const paystackRes = await axios.get(`https://api.paystack.co/transaction/verify/${transaction.reference}`, {
      headers: {
        Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
        "Content-Type": "application/json",
      }
    });

    const paystackData = paystackRes.data as IPaystackVerify;

    if (paystackData.status && paystackData.data.status !== "pending") {
      await prisma.transaction.update({
        where: { id: transaction.id },
        data: {
          status: paystackData.data.status // to caps
        }
      })
    }
  }
  //    if still pending then user has to cancel or continue past transaction 

  // check if org id has active subscription then 
  //    set onboarded to true 
  //    reset cookie 
  //    send flag to go to next tab 

  // OUTPUT
  //    organizationName
  //    organizationId
  //    shouldFinishTransaction
  //    accessCode
  //    finishedSubscription
  const parsed = null;
  return JSend.success(parsed);
});

const ZPatchBody = ZApp.AppOnboardingPatchLicensing.shape.body;

export const PATCH = secureApiRoute(async (req, ctx, user) => {
  const body = await req.json();
  const validated = ZPatchBody.parse(body);

  // INPUT
  //    organizationName
  //    organizationId
  //    planSlug
  //    

  // organization flow
  //    IF organizationId CHECK DB and return [name]
  //    IF name !== organizationName THEN update organizationName
  //    IF no organizationId THEN create new organization + add member as owner + set as user active organization

  //    check if a transaction already exists in pending 
  //        check paystack if still pending and return early

  // IF plan === FREE
  //    create subscription flow
  //        use [userID, orgID, plan] to create subscription
  // IF plan !== FREE
  //    trigger a paystack transaction
  //        with [planCode] initiate transaction with metadata[orgID,userID]
  //        create a new transaction with [reference, accesscode]

  // OUTPUT
  //    accessCode
  //    shouldFinishTransaction
  //    hasSubscription
  return JSend.success("Licensing updated successfully");
});
