import logging
import os
import time

# Firestoreライブラリをインポート
import firebase_admin
from firebase_admin import credentials, firestore

from parsers.supplement_parser import load_supplement_data, format_from_supplement
from parsers.wordnet_parser import get_wordnet_data_structured

logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')

def main():
    # 1. Firebaseの初期化
    try:
        creds_json_str = os.getenv("FIREBASE_CREDENTIALS_JSON")
        if not creds_json_str:
            raise ValueError("環境変数 'FIREBASE_CREDENTIALS_JSON' が設定されていません。")

        service_account_info = json.loads(creds_json_str)
        cred = credentials.Certificate(service_account_info)
        firebase_admin.initialize_app(cred)
        db = firestore.client()
        logging.info("Firebaseの初期化に成功しました。")
    except Exception as e:
        logging.error(f"Firebaseの初期化に失敗: {e}")
        return

    # 2. supplement.tsvからデータを読み込み
    supplement_file = os.path.join("data", "raw", "supplement.tsv")
    supplement_data = load_supplement_data(supplement_file)
    
    if not supplement_data:
        logging.error("補足データが読み込めませんでした。処理を終了します。")
        return

    # 3. Firestoreへのアップロード処理を開始
    logging.info("Firestoreへのデータ登録を開始します...")
    
    # バッチ処理の準備
    batch = db.batch()
    
    word_keys = sorted(list(supplement_data.keys()))
    total_words = len(word_keys)

    for i, word in enumerate(word_keys):
        # データを整形・統合
        final_data = format_from_supplement(supplement_data[word])
        final_data['word'] = word
        
        wordnet_data = get_wordnet_data_structured(word)
        
        pos_from_supplement = set(final_data["part_of_speech"])
        pos_from_wordnet = set(wordnet_data["part_of_speech"])
        final_data["part_of_speech"] = sorted(list(pos_from_supplement.union(pos_from_wordnet)))

        examples_from_supplement = set(final_data["raw_examples"])
        examples_from_wordnet = set(wordnet_data["examples"])
        final_data["raw_examples"] = sorted(list(examples_from_supplement.union(examples_from_wordnet)))
        
        final_data["definitions"].extend(wordnet_data["definitions"])
        final_data["synonyms"] = sorted(list(wordnet_data["synonyms"]))

        # 4. バッチに書き込み操作を追加
        # ドキュメントIDは英単語そのもの（小文字）
        doc_ref = db.collection("dictionary").document(word)
        batch.set(doc_ref, final_data)
        
        # 5. 500件ごとに一度コミット（Firestoreのバッチ上限対策）
        if (i + 1) % 500 == 0:
            logging.info(f"進捗: {i + 1}/{total_words} | バッチをコミット中...")
            batch.commit()
            # バッチをリセット
            batch = db.batch()
            # レート制限を避けるために少し待機
            time.sleep(1)

    # 6. 最後に残ったバッチをコミット
    logging.info("最後のバッチをコミット中...")
    batch.commit()

    logging.info(f"すべての処理が完了しました。合計 {total_words} 件のデータをFirestoreに登録しました。")

if __name__ == "__main__":
    main()
