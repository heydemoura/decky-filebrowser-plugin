# Decky File Browser Plugin

Access your Steam Deck files remotely from any browser.

This plugin allows people to run [File Browser](https://github.com/filebrowser/filebrowser) on their Steam Deck, enabling an easy-to-use way to transfer files from and to the Steam Deck, over the network with just a browser.

> This plugin currently includes a pre-compiled copy of File Browser, which is far from ideal. For the future releases, I plan to have a more transparent way of distributing File Browser within this project.

The plugin uses the Python back-end to start/stop a File Browser process on port `8082` ( [arbitrary port selection is in progress](https://github.com/heydemoura/decky-filebrowser-plugin/issues/1) )

With [File Browser](https://github.com/filebrowser/filebrowser) you have an authenticated web based file browser, that you can manage and transfer files from your Steam Deck. From the File Browser web interface you can:
- Upload files to your Steam Deck
- Download files from your Steam Deck
- View and Edit files from your Steam Deck
- Consume media ( audio, video as well as text ) that you have on your Steam Deck from the browser itself
- Delete files from your Steam Deck
- Share links of your files from your Steam Deck so that other people can download files straight from your Steam Deck

By default, the File Browser instance requires authorization, and the default credentials are:
User: `admin` 
Password: `admin`
