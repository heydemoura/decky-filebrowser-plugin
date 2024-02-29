import { useContext, useCallback, useEffect, useState } from 'react';
import {
  ButtonItem,
  DialogButton,
  TextField,
  Navigation,
  PanelSection,
  PanelSectionRow,
} from "decky-frontend-lib";
import { AppContext } from './utils/app-context';

const Settings = () => {
  // @ts-ignore
  const { fileBrowserManager } = useContext( AppContext );
  const [ port, setPort ] = useState( fileBrowserManager.getPort() );
  const [ isSaving, setIsSaving ] = useState( false );
  const [ isLoading, setIsLoading ] = useState( false );

  const handleSave = useCallback(async () => {
    setIsSaving( true );
    await fileBrowserManager.setPort( port )
    setIsSaving( false );
  }, [port])

  const handlePortChange = (e) => {
    setPort( e.target.value );
  }

  useEffect( () => {
    const loadDefaults = async () => {
      const _port = await fileBrowserManager.getPortFromSettings();
      setPort( _port );
      console.log( _port );
    }

    setIsLoading( true );
    loadDefaults();
    setIsLoading( false );
  }, [] );

  return (
    <div style={{ marginTop: "50px", color: "white" }}>
      { isLoading ? (
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
              onChange={ handlePortChange }
              value={ port }
            />
          </PanelSectionRow>
          <PanelSectionRow>
            <ButtonItem onClick={ handleSave } disabled={ isSaving }>
              Save
            </ButtonItem>
          </PanelSectionRow>
        </PanelSection>
      )}
    </div>
  );
};

export default Settings;
