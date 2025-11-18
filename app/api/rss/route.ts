'use server'

import { NextResponse } from "next/server";
import { FetchAndSaveRssToFirestore } from "@/functions/api/FetchAndSaveRssToFirestore";

export async function POST(request: Request) {
  let body: { rssUrl?: string };

  try {
    body = await request.json();
  } catch (error) {
    return NextResponse.json({ error: "無効なJSONです" }, { status: 400 });
  }

  const rssUrl = body?.rssUrl;
  if (!rssUrl) {
    return NextResponse.json({ error: "rssUrlパラメータが必要です" }, { status: 400 });
  }

  try {
    const savedCount = await FetchAndSaveRssToFirestore(rssUrl);
    return NextResponse.json({ savedCount });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "不明なエラー";
    console.error("RSS APIエラー:", errorMessage);
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}
