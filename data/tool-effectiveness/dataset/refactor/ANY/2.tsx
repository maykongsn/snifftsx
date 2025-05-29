import * as React from 'react';

type LicenseModelContextType = {
  licenseModel: string;
  setLicenseModel: React.Dispatch<React.SetStateAction<string>>
}

const LicenseModel = React.createContext<LicenseModelContextType | undefined>(undefined);

if (process.env.NODE_ENV !== 'production') {
  LicenseModel.displayName = 'LicenseModel';
}

export function LicenseModelProvider(props: React.PropsWithChildren<{}>) {
  const [licenseModel, setLicenseModel] = React.useState<string>('annual');
  const value = React.useMemo(
    () => ({ licenseModel, setLicenseModel }),
    [licenseModel, setLicenseModel],
  );
  return <LicenseModel.Provider value={value}>{props.children}</LicenseModel.Provider>;
}

export function useLicenseModel() {
  return React.useContext(LicenseModel);
}