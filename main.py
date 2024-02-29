import os
import asyncio
import subprocess
import socket

# Initialize decky-loader settings manager
from settings import SettingsManager

# The decky plugin module is located at decky-loader/plugin
# For easy intellisense checkout the decky-loader code one directory up
# or add the `decky-loader/plugin` path to `python.analysis.extraPaths` in `.vscode/settings.json`
import decky_plugin

settingsDir = decky_plugin.DECKY_PLUGIN_SETTINGS_DIR

script_dir = decky_plugin.DECKY_PLUGIN_DIR
pidfile = decky_plugin.DECKY_PLUGIN_RUNTIME_DIR + "/decky-filebrowser.pid"

# Load user's settings
settings = SettingsManager(name="settings", settings_directory=settingsDir)
settings.read()

class Plugin:
    async def getFileBrowserStatus( self ):
        if os.path.exists( pidfile ):
            with open( pidfile, "r" ) as file:
                pid_str = file.read().strip()

            hostname = socket.gethostname()
            ipv4_address = socket.gethostbyname(hostname)

            return {
                "pid": pid_str,
                "ipv4_address": ipv4_address,
                "port": settings.getSetting("port"),
            }

        else:
            return {
                "port": settings.getSetting("port")
            }

    async def startFileBrowser( self, port = "8082" ):
        command = script_dir + "/bin/filebrowser -p " + port + " -a 0.0.0.0 -r " + decky_plugin.DECKY_USER_HOME
        process = await asyncio.create_subprocess_shell(command, stdout=asyncio.subprocess.PIPE, stderr=asyncio.subprocess.PIPE)

        # Defines the received port as the port setting
        settings.setSetting("port", port)

        with open(pidfile, "w") as file:
            file.write(str(process.pid))

        return process.pid

    async def stopFileBrowser( self, pid ):
        with open(pidfile, "r") as file:
            pid_str = file.read().strip()

        command = "kill " + pid_str
        process = subprocess.Popen(command, shell=True, stdout=subprocess.PIPE, stderr=subprocess.PIPE)

        output, error = process.communicate()
        output_str = output.decode("utf-8")

        if os.path.exists(pidfile):
            # Delete the file
            os.remove(pidfile)

        return output_str

    # Asyncio-compatible long-running code, executed in a task when the plugin is loaded
    async def _main(self):
        decky_plugin.logger.info("Hello World!")

    # Function called first during the unload process, utilize this to handle your plugin being removed
    async def _unload(self):
        decky_plugin.logger.info("Goodbye World!")
        pass

    # Migrations that should be performed before entering `_main()`.
    async def _migration(self):
        decky_plugin.logger.info("Migrating")
        # Here's a migration example for logs:
        # - `~/.config/decky-template/template.log` will be migrated to `decky_plugin.DECKY_PLUGIN_LOG_DIR/template.log`
        decky_plugin.migrate_logs(os.path.join(decky_plugin.DECKY_USER_HOME,
                                               ".config", "decky-template", "template.log"))
        # Here's a migration example for settings:
        # - `~/homebrew/settings/template.json` is migrated to `decky_plugin.DECKY_PLUGIN_SETTINGS_DIR/template.json`
        # - `~/.config/decky-template/` all files and directories under this root are migrated to `decky_plugin.DECKY_PLUGIN_SETTINGS_DIR/`
        decky_plugin.migrate_settings(
            os.path.join(decky_plugin.DECKY_HOME, "settings", "template.json"),
            os.path.join(decky_plugin.DECKY_USER_HOME, ".config", "decky-template"))
        # Here's a migration example for runtime data:
        # - `~/homebrew/template/` all files and directories under this root are migrated to `decky_plugin.DECKY_PLUGIN_RUNTIME_DIR/`
        # - `~/.local/share/decky-template/` all files and directories under this root are migrated to `decky_plugin.DECKY_PLUGIN_RUNTIME_DIR/`
        decky_plugin.migrate_runtime(
            os.path.join(decky_plugin.DECKY_HOME, "template"),
            os.path.join(decky_plugin.DECKY_USER_HOME, ".local", "share", "decky-template"))
