import csv
import logging
from collections import defaultdict
from nltk.corpus import wordnet as wn

logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')

def load_supplement_data(file_path: str) -> dict:
    """supplement.tsvを読み込み、単語をキーとした辞書を生成する"""
    logging.info(f"{file_path} から補足データを読み込みます...")
    supplement_data = defaultdict(list)
    try:
        with open(file_path, 'r', encoding='utf-8-sig') as f:
            reader = csv.DictReader(f, delimiter='\t')
            if not reader.fieldnames:
                logging.error("TSVヘッダーが読み取れません。")
                return {}
            logging.info(f"読み込んだTSVヘッダー: {reader.fieldnames}")
            if 'word' not in reader.fieldnames:
                logging.error("TSVファイルに 'word' 列が見つかりません。")
                return {}

            for row in reader:
                word_key = row.get('word')
                if word_key:
                    supplement_data[word_key.strip().lower()].append(row)
    except FileNotFoundError:
        logging.error(f"補足ファイルが見つかりません: {file_path}")
    except Exception as e:
        logging.error(f"補足ファイルの読み込み中にエラー: {e}")

    logging.info(f"{len(supplement_data)}語の補足データを読み込みました。")
    return dict(supplement_data)

def get_wordnet_data_structured(word: str) -> dict:
    """WordNetからデータを取得し、品詞ごとに整理された辞書を返す"""
    data = {
        "part_of_speech": set(),
        "definitions": [],
        "examples": set(),
        "synonyms": set()
    }
    wn_pos_map = {'n': 'noun', 'v': 'verb', 'a': 'adjective', 'r': 'adverb'}
    for wn_pos_tag, pos_name in wn_pos_map.items():
        synsets = wn.synsets(word, pos=wn_pos_tag)
        if synsets:
            data["part_of_speech"].add(pos_name)
            for synset in synsets:
                data["definitions"].append({"pos": pos_name, "def": synset.definition()})
                for ex in synset.examples():
                    data["examples"].add(ex)
                for lemma in synset.lemmas():
                    synonym = lemma.name().replace('_', ' ')
                    if synonym.lower() != word.lower():
                        data["synonyms"].add(synonym)
    return data

def format_from_supplement(rows: list) -> dict:
    """supplement.tsvの行データから、指定されたJSON構造の中間データを整形する"""
    data = {
        "part_of_speech": set(),
        "definitions": [],
        "translations": [],
        "examples": set()
    }
    for row in rows:
        pos = row.get('pos', 'unknown').lower()
        data["part_of_speech"].add(pos)

        if row.get('definition'):
            data["definitions"].append({"pos": pos, "def": row['definition']})
        if row.get('translation'):
            trans_list = [t.strip() for t in row['translation'].split(',')]
            data["translations"].append({"pos": pos, "trans": trans_list})
        if row.get('example'):
            data["examples"].add(row['example'])
    return data