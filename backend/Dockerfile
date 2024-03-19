# we support images for building with a vanilla SteamOS base,
# or versions with ootb support for rust or go
# developers can also customize these images via this Dockerfile
#FROM ghcr.io/steamdeckhomebrew/holo-toolchain-rust:latest
FROM ghcr.io/steamdeckhomebrew/holo-toolchain-go:latest
#FROM ghcr.io/steamdeckhomebrew/holo-base:latest

RUN pacman -Sy --noconfirm git nodejs npm

# Creates cache dir for NPM
RUN mkdir -p /.npm
RUN chown -R 501:20 "/.npm"

# Creates cache dir for Go modules
RUN mkdir -p /go
RUN mkdir -p /.cache/go-build
RUN chown -R 501:20 "/go"
RUN chown -R 501:20 "/.cache"

# entrypoint.sh should always be located in the backend folder
ENTRYPOINT [ "/backend/entrypoint.sh" ]
