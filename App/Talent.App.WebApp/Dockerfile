# FROM microsoft/dotnet:2.1-aspnetcore-runtime
# WORKDIR /talentWebPortal
# COPY ./.bin/Docker .
# ENV ASPNETCORE_URLS http://*:61771
# ENV ASPNETCORE_ENVIRONMENT docker
# ENTRYPOINT dotnet Talent.App.WebApp.dll

FROM microsoft/dotnet:2.0.0-runtime
WORKDIR /app
COPY ./out /app
ENV ASPNETCORE_URLS http://*:61772
ENTRYPOINT dotnet Talent.App.WebApp.dll

# rossi93/project-competition-app:latest
