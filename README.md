# Sommerspiele-2025

Small website with multiple games

## Host via Termux on phone

Inside Termux:

### Init

update stuff</br>
`pkg update && pkg upgrade`</br>
install stuff</br>
`pkg install nginx && pkg install termux-services`</br>
start stuff</br>
`nginx`</br>

### Usefell commands

config nginx</br>
`nano $PREFIX/etc/nginx/nginx.conf`</br>

copy from andoird download dir to FS inside termux</br>
`termux-setup-storage`</br>
`cp ~/storage/downloads/<website>/* $PREFIX/share/nginx/html`</br>

nginx html-dir</br>
`$PREFIX/share/nginx/html/index.html`</br>

stop stuff</br>
`nginx -s stop`</br>

## Host inside nginx container

`docker run -d --name nginx-sommerspiele -p 8080:80 -v <C:\\path\\to\\src>:/usr/share/nginx/html nginx`
