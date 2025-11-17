'use server'

import Parser from 'rss-parser';
import { collection, getDocs, query, orderBy, limit, writeBatch, doc, Timestamp } from "firebase/firestore";
import { db } from "./firebase";
import { RssItem, Latest200RssResponse } from "./types";

// RSSパーサーのインスタンスを作成
const parser = new Parser();

/**
 * NitterのRSSフィードから最新200件を取得してFirestoreに保存する
 * 
 * @param rssUrl NitterのRSSフィードURL
 * @returns 保存に成功した件数
 */
export async function fetchAndSaveRssToFirestore(rssUrl: string): Promise<number> {
  try {
    // RSSフィードを取得・パース
    const feed = await parser.parseURL(rssUrl);
    
    // 最新200件を取得（RSSフィードが200件以上ある場合に備えて）
    const items = feed.items.slice(0, 200);
    
    // Firestoreにバッチで保存（効率的な一括書き込み）
    const batch = writeBatch(db);
    const rssCollection = collection(db, "rss_items");
    
    let savedCount = 0;
    
    for (const item of items) {
      // RSSアイテムをRssItem型に変換
      const rssItem: RssItem = {
        title: item.title || '',
        link: item.link || '',
        pubDate: item.pubDate ? new Date(item.pubDate) : new Date(),
        description: item.contentSnippet || item.content || '',
        author: item.creator || item.author,
        content: item.content,
        categories: item.categories,
        guid: item.guid || item.link,
      };
      
      // GUIDをドキュメントIDとして使用（重複防止）
      // GUIDがない場合はリンクをエンコードして使用
      const docId = encodeURIComponent(rssItem.guid || rssItem.link);
      const docRef = doc(rssCollection, docId);
      
      batch.set(docRef, rssItem, { merge: true });
      savedCount++;
    }
    
    // バッチをコミット
    await batch.commit();
    
    console.log(`${savedCount}件のRSSアイテムをFirestoreに保存しました`);
    return savedCount;
    
  } catch (error) {
    console.error('RSSの取得または保存に失敗しました:', error);
    throw error;
  }
}

/**
 * Firestoreから最新200件のRSSアイテムを取得する
 * 
 * @returns 最新200件のRSSアイテム
 */
export async function getLatest200RssFromFirestore(): Promise<Latest200RssResponse> {
  try {
    const rssCollection = collection(db, "rss_items");
    
    // 公開日時の降順で最新200件を取得
    const q = query(
      rssCollection, 
      orderBy("pubDate", "desc"), 
      limit(200)
    );
    
    const querySnapshot = await getDocs(q);
    const items: RssItem[] = [];
    
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      
      // FirestoreのTimestampをDateに変換
      items.push({
        ...data,
        pubDate: data.pubDate instanceof Timestamp 
          ? data.pubDate.toDate() 
          : new Date(data.pubDate),
      } as RssItem);
    });
    
    console.log(`${items.length}件のRSSアイテムを取得しました`);
    return { items };
    
  } catch (error) {
    console.error('RSSアイテムの取得に失敗しました:', error);
    throw error;
  }
}
