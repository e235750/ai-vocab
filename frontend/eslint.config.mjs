import { dirname } from 'path'
import { fileURLToPath } from 'url'
import { FlatCompat } from '@eslint/eslintrc'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const compat = new FlatCompat({
  baseDirectory: __dirname,
})

const eslintConfig = [
  ...compat.extends('next/core-web-vitals', 'next/typescript'),

  {
    files: ['**/*.{js,jsx,ts,tsx}'],
    rules: {
      // 変数・関数名：キャメルケースを強制
      camelcase: 'off',

      // TypeScript固有の命名規則
      '@typescript-eslint/naming-convention': [
        'error',
        {
          // 'Content-Type' や 'Authorization' のような
          // ハイフンを含むプロパティ名を許可するための設定
          selector: 'property',
          // このルールは引用符が必要なプロパティにのみ適用される
          modifiers: ['requiresQuotes'],
          // フォーマットのチェックを行わない
          format: null,
        },
        // 変数：キャメルケースまたは定数用大文字スネークケース
        {
          selector: 'variable',
          format: ['camelCase', 'UPPER_CASE', 'snake_case'],
          leadingUnderscore: 'allow', // _userId等を許可
          trailingUnderscore: 'forbid', // 末尾アンダースコア禁止
        },
        // 関数・メソッド：キャメルケース
        {
          selector: ['function', 'method'],
          format: ['camelCase', 'PascalCase'], // コンストラクタはPascalCaseを許可
        },
        // パラメータ：キャメルケース
        {
          selector: 'parameter',
          format: ['camelCase', 'PascalCase'],
          leadingUnderscore: 'allow', // 未使用パラメータ用
        },
        // プロパティ：キャメルケースまたはスネークケース（API対応）
        {
          selector: 'property',
          format: ['camelCase', 'snake_case', 'PascalCase'],
          leadingUnderscore: 'allow',
        },
        // 型・インターフェース：パスカルケース
        {
          selector: ['interface', 'typeAlias'],
          format: ['PascalCase'],
        },
        // クラス：パスカルケース
        {
          selector: 'class',
          format: ['PascalCase'],
        },
        // Enum：パスカルケース
        {
          selector: 'enum',
          format: ['PascalCase'],
        },
        // Enumメンバー：大文字スネークケース
        {
          selector: 'enumMember',
          format: ['UPPER_CASE'],
        },
      ],

      // ===== コード品質関連 =====

      // 未使用変数チェック（_プレフィックスは除外）
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '^_', // _userId等の未使用引数
          varsIgnorePattern: '^_', // _data等の未使用変数
          caughtErrorsIgnorePattern: '^_', // catch(_error)等
        },
      ],

      // 再代入されない変数はconstを使用
      'prefer-const': 'error',

      // varの使用を禁止（letまたはconstを使用）
      'no-var': 'error',

      // console.logは警告、warn/errorは許可
      'no-console': [
        'warn',
        {
          allow: ['warn', 'error', 'info'],
        },
      ],
    },
  },
]

export default eslintConfig
