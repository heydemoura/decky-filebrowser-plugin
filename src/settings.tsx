import { useContext, useCallback, useEffect, useState } from "react";
import {
  ButtonItem,
  TextField,
  PanelSection,
  PanelSectionRow,
} from "decky-frontend-lib";
import { AppContext } from "./utils/app-context";

const Settings = () => {
  // @ts-ignore
  const { fileBrowserManager } = useContext(AppContext);
  const [port, setPort] = useState(fileBrowserManager.getPort());
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [invalidPortError, setInvalidPortError] = useState(false);

  const handleSave = useCallback(async () => {
    setIsSaving(true);
    await fileBrowserManager.setPort(port);
    setIsSaving(false);
  }, [port]);

  const handlePortChange = (e) => {
    const portNumber = +e.target.value;
    // Decky uses port 1337
    // To use a port equal or lower than 1024 on Linux, you need root access
    if (portNumber > 1024 && portNumber !== 1337) {
      setInvalidPortError(false);
      setPort(e.target.value);
      return;
    }

    setInvalidPortError(true);
  };

  useEffect(() => {
    const loadDefaults = async () => {
      const _port = await fileBrowserManager.getPortFromSettings();
      setPort(_port);
    };

    setIsLoading(true);
    loadDefaults();
    setIsLoading(false);
  }, []);

  return (
    <div style={{ marginTop: "50px", color: "white" }}>
      {isLoading ? (
        <div style={{ textAlign: "center" }}>
          <h2>Loading...</h2>
        </div>
      ) : (
        <PanelSection title="File Browser options">
          <PanelSectionRow>
            <TextField
              label="Port"
              description="TCP port used for connection"
              mustBeNumeric
              rangeMin={1025}
              rangeMax={65535}
              onChange={handlePortChange}
              value={port}
              style={{
                border: invalidPortError ? "1px red solid" : undefined,
              }}
            />
          </PanelSectionRow>
          <PanelSectionRow>
            <ButtonItem onClick={handleSave} disabled={isSaving}>
              Save
            </ButtonItem>
          </PanelSectionRow>
        </PanelSection>
      )}
    </div>
  );
};

export default Settings;
