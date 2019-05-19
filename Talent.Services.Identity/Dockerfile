# FROM microsoft/dotnet:2.0.0-runtime
# WORKDIR /dotnetapp
# COPY ./.bin/Docker .
# ENV ASPNETCORE_URLS http://*:60970
# ENV ASPNETCORE_ENVIRONMENT docker
# ENTRYPOINT dotnet Mars.Services.Identity.dll


FROM microsoft/dotnet:2.0.0-runtime
WORKDIR /app
COPY ./out /app
ENV ASPNETCORE_URLS http://*:60998
ENV ASPNETCORE_ENVIRONMENT docker
ENTRYPOINT dotnet Talent.Services.Identity.dll


# docker image build -t rossi93/project-competition-identity:latest .



