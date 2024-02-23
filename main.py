import os
import asyncio
import subprocess
import socket

# The decky plugin module is located at decky-loader/plugin
# For easy intellisense checkout the decky-loader code one directory up
# or add the `decky-loader/plugin` path to `python.analysis.extraPaths` in `.vscode/settings.json`
import decky_plugin

script_dir = os.path.dirname(os.path.abspath(__file__))
pidfile = script_dir + "/bin/filebrowser.pid"

class Plugin:
    # A normal method. It can be called from JavaScript using call_plugin_function("method_1", argument1, argument2)
    async def add(self, left, right):
        return left + right

    async def getFileBrowserStatus( self ):
        if os.path.exists( pidfile ):
            with open( pidfile, "r" ) as file:
                pid_str = file.read().strip()

            hostname = socket.gethostname()
            ipv4_address = socket.gethostbyname(hostname)

            decky_plugin.logger.info({
                "pid": pid_str,
                "ipv4_address": ipv4_address
            })

            return {
                "pid": pid_str,
                "ipv4_address": ipv4_address
            }

        else:
            return False

    async def startFileBrowser( self, port = "8082" ):
        command = script_dir + "/bin/filebrowser -p " + port + " -a 0.0.0.0 -r /home/deck"
        process = await asyncio.create_subprocess_shell(command, stdout=asyncio.subprocess.PIPE, stderr=asyncio.subprocess.PIPE)

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
