FROM python:3.10


COPY requirements.txt /usr/src/app/
WORKDIR /usr/src/app
RUN pip3 install -r requirements.txt
COPY *.py .