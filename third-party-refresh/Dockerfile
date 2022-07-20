FROM mcr.microsoft.com/playwright:v1.23.1-focal

RUN npm i --location=global playwright
RUN apt-get update && apt-get install -y pngquant
COPY run.sh /run.sh
CMD ["/run.sh"]
