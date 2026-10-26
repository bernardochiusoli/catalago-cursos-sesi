#!/usr/bin/env bash
# Gera publicacao/catalogo-publicacao.zip: API publicada + front compilado em wwwroot.
# Uso: ./scripts/gerar-publicacao.sh   (requer .NET SDK 10 e Node 20+)
set -euo pipefail
raiz="$(cd "$(dirname "$0")/.." && pwd)"
saida="$raiz/publicacao/app"
rm -rf "$saida" && mkdir -p "$saida"

(cd "$raiz/frontend" && npm ci && npm run build)
dotnet publish "$raiz/backend/Catalogo.Api/Catalogo.Api.csproj" -c Release -o "$saida"
cp -r "$raiz/frontend/dist" "$saida/wwwroot"

cat > "$saida/LEIA-ME.txt" <<'TXT'
Pacote de publicação do Catálogo de cursos SESI Indústria.
Requer o runtime ASP.NET Core 10 e um PostgreSQL acessível.

Como executar:
  1. Defina a conexão (uma das duas):
       ConnectionStrings__Default=Host=...;Database=catalogo;Username=...;Password=...
       DATABASE_URL=postgresql://usuario:senha@host/catalogo?sslmode=require
  2. dotnet Catalogo.Api.dll
  3. Acesse http://localhost:5000 (ou a porta definida em ASPNETCORE_URLS)
Na subida, a aplicação cria as tabelas e insere os cursos (scripts em database/).
TXT

(cd "$saida" && find . -type f | sort > ARQUIVOS.txt)
rm -f "$raiz/publicacao/catalogo-publicacao.zip"
(cd "$saida" && zip -qr "$raiz/publicacao/catalogo-publicacao.zip" .)
echo "Gerado: publicacao/catalogo-publicacao.zip ($(wc -l < "$saida/ARQUIVOS.txt") arquivos)"
