# FROM microsoft/aspnetcore:2.0-nanoserver-sac2016 AS base
# WORKDIR /app
# EXPOSE 80

# FROM microsoft/aspnetcore-build:2.0-nanoserver-sac2016 AS build
# WORKDIR /src
# COPY *.sln ./
# COPY Mars.Services.Listing/Mars.Services.Listing.csproj Mars.Services.Listing/
# RUN dotnet restore
# COPY . .
# WORKDIR /src/Mars.Services.Listing
# RUN dotnet build -c Release -o /app

# FROM build AS publish
# RUN dotnet publish -c Release -o /app

# FROM base AS final
# WORKDIR /app
# COPY --from=publish /app .
# ENTRYPOINT ["dotnet", "Mars.Services.Listing.dll"]

FROM microsoft/dotnet:2.0.0-runtime
WORKDIR /app
COPY ./out /app
ENV ASPNETCORE_URLS http://*:51689
ENTRYPOINT dotnet Talent.Services.Talent.dll



# rossi93/project-competition-listing:latest