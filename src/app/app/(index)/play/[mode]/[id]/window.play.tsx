"use client";

import { IClientPage } from "./client";

type IWindowPlay = {} & IClientPage;
export default function WindowPlay(props: IWindowPlay) {

  return (
    <div className="size-full flex-center">
      WindowPlay
    </div>
  )
}