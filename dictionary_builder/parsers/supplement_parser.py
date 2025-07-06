import logging
from collections import defaultdict
import re

# --- 設定 ---
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
# TSVで「品詞」として認識するキーのリスト
POS_KEYS = {'adjective', 'verb', 'noun', 'adverb', 'suffix', 'prefix', 'preposition', 'conjunction', 'interjection'}


# --- パーサー（変更なし） ---

def load_supplement_data(file_path: str) -> dict[str, list[dict]]:
    """
    カスタム形式のTSVを読み込み、単語ごとに情報の辞書リストを作成するパーサー。
    wordの値にスペースが含まれる場合（引用符なし）にも対応。
    """
    logging.info(f"補足ファイル {file_path} を読み込みます...")
    supplement_data = defaultdict(list)
    # key="value..." または key=value の形式にマッチする正規表現 (word以外のキー用)
    other_keys_pattern = re.compile(r'\b(\w+)=("[^"]*"|\S+)')

    try:
        with open(file_path, 'r', encoding='utf-8-sig') as f:
            for i, line in enumerate(f, 1):
                line = line.strip()
                if not line.startswith('word='):
                    if line:
                        logging.warning(f"ファイル {file_path} の {i}行目: 'word=' で始まっていません。スキップします: {line}")
                    continue

                content_after_word_equals = line[5:]
                word_value_str = ""
                other_parts_str = ""
                matches = list(other_keys_pattern.finditer(content_after_word_equals))

                if not matches:
                    word_value_str = content_after_word_equals
                else:
                    first_match_start = matches[0].start()
                    word_value_str = content_after_word_equals[:first_match_start]
                    other_parts_str = content_after_word_equals[first_match_start:]

                word = word_value_str.strip().strip('"')
                if not word:
                    logging.warning(f"ファイル {file_path} の {i}行目: 'word' の値が空です。スキップします: {line}")
                    continue

                word_key = word.lower()
                line_data = {}
                if other_parts_str:
                    found_parts = other_keys_pattern.findall(other_parts_str)
                    for key, value in found_parts:
                        line_data[key] = value.strip('"')

                supplement_data[word_key].append(line_data)

    except FileNotFoundError:
        logging.error(f"補足ファイルが見つかりません: {file_path}")
        return {}
    except Exception as e:
        logging.error(f"補足ファイルの読み込み中にエラーが発生しました: {e}")
        return {}

    logging.info(f"{len(supplement_data)}語の補足データを読み込みました。")
    return dict(supplement_data)


# --- フォーマッター（★★★ この関数を修正しました ★★★） ---

def format_from_supplement(rows: list[dict]) -> dict:
    """
    ある単語に関するデータ（辞書のリスト）を集約し、指定されたJSON形式の辞書を生成する。
    翻訳は品詞ごとにグループ化される。
    """
    part_of_speech = set()
    definitions = set()
    translations_by_pos = defaultdict(set)
    raw_examples = set()

    for row_dict in rows:
        if 'definition' in row_dict:
            definitions.add(row_dict['definition'])
        if 'example' in row_dict:
            raw_examples.add(row_dict['example'])

        for key, value in row_dict.items():
            if key in POS_KEYS:
                part_of_speech.add(key)
                # ★★★修正点★★★
                # 半角/全角カンマ、半角/全角スペースを区切り文字として分割する
                translations = re.split(r'[,\s，　]+', value)
                for t in translations:
                    # 分割によって空文字列が生まれることがあるため、チェックする
                    if t:
                        translations_by_pos[key].add(t)

    final_translations = {
        pos: sorted(list(trans_set))
        for pos, trans_set in translations_by_pos.items()
    }

    return {
        "part_of_speech": sorted(list(part_of_speech)),
        "definitions": sorted(list(definitions)),
        "translations": final_translations,
        "raw_examples": sorted(list(raw_examples))
    }