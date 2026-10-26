# Uma única imagem com front (React) e back (.NET). Build em três estágios.

# 1) Compila o front
FROM node:22-alpine AS front
WORKDIR /src/frontend
COPY frontend/package.json frontend/package-lock.json ./
RUN npm ci
COPY frontend/ ./
RUN npm run build

# 2) Publica a API (os scripts SQL da pasta database/ vão junto)
FROM mcr.microsoft.com/dotnet/sdk:10.0 AS back
WORKDIR /src
COPY database/ database/
COPY backend/Catalogo.Api/Catalogo.Api.csproj backend/Catalogo.Api/
RUN dotnet restore backend/Catalogo.Api/Catalogo.Api.csproj
COPY backend/Catalogo.Api/ backend/Catalogo.Api/
RUN dotnet publish backend/Catalogo.Api/Catalogo.Api.csproj -c Release -o /app --no-restore

# 3) Imagem final, só com o runtime
FROM mcr.microsoft.com/dotnet/aspnet:10.0
WORKDIR /app
COPY --from=back /app ./
COPY --from=front /src/frontend/dist ./wwwroot
ENV ASPNETCORE_HTTP_PORTS=8080
EXPOSE 8080
ENTRYPOINT ["dotnet", "Catalogo.Api.dll"]
