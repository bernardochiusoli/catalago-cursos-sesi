# Gera publicacao\catalogo-publicacao.zip no Windows (PowerShell).
# Uso: .\scripts\gerar-publicacao.ps1   (requer .NET SDK 10 e Node 20+)
$ErrorActionPreference = 'Stop'
$raiz = Split-Path -Parent $PSScriptRoot
$saida = Join-Path $raiz 'publicacao\app'
if (Test-Path $saida) { Remove-Item $saida -Recurse -Force }
New-Item -ItemType Directory -Path $saida | Out-Null

Push-Location (Join-Path $raiz 'frontend'); npm ci; npm run build; Pop-Location
dotnet publish (Join-Path $raiz 'backend\Catalogo.Api\Catalogo.Api.csproj') -c Release -o $saida
Copy-Item (Join-Path $raiz 'frontend\dist') (Join-Path $saida 'wwwroot') -Recurse

@"
Pacote de publicação do Catálogo de cursos SESI Indústria.
Requer o runtime ASP.NET Core 10 e um PostgreSQL acessível.
1. Defina ConnectionStrings__Default ou DATABASE_URL.
2. dotnet Catalogo.Api.dll
"@ | Set-Content (Join-Path $saida 'LEIA-ME.txt') -Encoding UTF8

Get-ChildItem $saida -Recurse -File | ForEach-Object { $_.FullName.Substring($saida.Length + 1) } | Sort-Object |
  Set-Content (Join-Path $saida 'ARQUIVOS.txt') -Encoding UTF8
$zip = Join-Path $raiz 'publicacao\catalogo-publicacao.zip'
if (Test-Path $zip) { Remove-Item $zip }
Compress-Archive -Path (Join-Path $saida '*') -DestinationPath $zip
Write-Host "Gerado: $zip"
