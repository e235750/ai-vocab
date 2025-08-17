# Word Wise - EC2本番デプロイ

## ファイル構成

```
ec2-deployment/
├── docker-compose.yml              # 本番用Docker Compose (ECRイメージ使用)
├── .env.production.template        # 環境変数テンプレート
├── nginx/
│   └── nginx.conf                  # 本番用nginx設定 (HTTPS対応)
├── scripts/
│   ├── setup-ec2.sh               # EC2初期セットアップ
│   ├── deploy.sh                  # アプリケーションデプロイ
│   ├── init-letsencrypt.sh        # SSL証明書初回取得
│   └── ssl-renew.sh              # SSL証明書更新
├── systemd/
│   └── word-wise.service         # systemd設定 (自動起動)
└── README.md                     # このファイル
```

## デプロイ手順

### 1. EC2インスタンス準備

**推奨スペック:**
- インスタンスタイプ: t3.medium以上
- OS: Ubuntu 22.04 LTS
- ストレージ: 20GB以上
- セキュリティグループ: HTTP(80), HTTPS(443), SSH(22)

### 2. EC2初期セットアップ

```bash
# EC2インスタンスにSSH接続
ssh -i your-key.pem ubuntu@your-ec2-ip

# このリポジトリをクローンまたはファイルを転送
# setup-ec2.shを実行
chmod +x setup-ec2.sh
./setup-ec2.sh

# ログアウト・再ログインでDocker権限を有効化
exit
ssh -i your-key.pem ubuntu@your-ec2-ip
```

### 3. デプロイファイル配置

```bash
# プロジェクトディレクトリに移動
cd /opt/word-wise

# デプロイファイルをコピー (scp, git clone, など)
# 例: scpでファイル転送
scp -i your-key.pem -r ec2-deployment/* ubuntu@your-ec2-ip:/opt/word-wise/
```

### 4. 環境変数設定

```bash
# 環境変数ファイルを作成
cp .env.production.template .env.production

# 実際の値に編集
nano .env.production
```

**設定が必要な項目:**
- Firebase認証情報
- ドメイン名
- JWT秘密鍵
- その他アプリケーション固有の設定

### 5. AWS認証設定

```bash
# AWS CLIを設定 (ECRアクセス用)
aws configure

# 入力項目:
# AWS Access Key ID: your-access-key
# AWS Secret Access Key: your-secret-key
# Default region name: ap-southeast-2
# Default output format: json
```

### 6. SSL証明書取得

```bash
# nginx設定のドメイン名を変更
nano nginx/nginx.conf
# example.com → yourdomain.com に変更

# SSL証明書を取得
./scripts/init-letsencrypt.sh yourdomain.com
```

### 7. アプリケーションデプロイ

```bash
# 初回デプロイ
./scripts/deploy.sh yourdomain.com

# サービス状態確認
docker-compose ps
```

### 8. 自動起動設定

```bash
# systemdサービスを設定
sudo cp systemd/word-wise.service /etc/systemd/system/
sudo systemctl daemon-reload
sudo systemctl enable word-wise
sudo systemctl start word-wise

# 状態確認
sudo systemctl status word-wise
```

### 9. SSL証明書自動更新設定

```bash
# crontabを編集
crontab -e

# 以下を追加 (毎日12時に更新チェック)
0 12 * * * /opt/word-wise/scripts/ssl-renew.sh
```

## 運用手順

### アプリケーション更新

```bash
# 新しいイメージをECRにプッシュ後
cd /opt/word-wise
./scripts/deploy.sh yourdomain.com
```

### ログ確認

```bash
# アプリケーションログ
docker-compose logs -f

# nginxログ
docker-compose logs nginx

# 個別サービスログ
docker-compose logs frontend
docker-compose logs backend
```

### バックアップ

```bash
# 設定ファイルバックアップ
tar -czf word-wise-config-$(date +%Y%m%d).tar.gz .env.production nginx/ ssl/

# SSL証明書バックアップ
sudo tar -czf ssl-backup-$(date +%Y%m%d).tar.gz ssl/
```

### トラブルシューティング

```bash
# サービス状態確認
docker-compose ps

# ヘルスチェック
curl -I http://localhost/health
curl -I https://yourdomain.com/api/health

# コンテナ内確認
docker-compose exec frontend sh
docker-compose exec backend bash

# 設定テスト
docker-compose exec nginx nginx -t
```

## セキュリティ設定

### ファイアウォール
```bash
# UFW状態確認
sudo ufw status

# 必要ポートのみ開放済み:
# - 22 (SSH)
# - 80 (HTTP)
# - 443 (HTTPS)
```

### SSL設定
- TLS 1.2/1.3のみ許可
- 強力な暗号化スイート
- HSTS, XSS Protection等のセキュリティヘッダー

### 定期メンテナンス
- 月次のセキュリティアップデート
- SSL証明書の有効期限確認 (自動更新)
- ログローテーション
- バックアップの定期実行

## サポート

問題が発生した場合:
1. ログを確認
2. サービス状態を確認  
3. 設定ファイルを確認
4. 必要に応じてバックアップから復旧
