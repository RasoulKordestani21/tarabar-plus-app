// types.ts

// City type definition
export type City = {
  cityId: number;
  cityName: string;
  provinceId: number;
  provinceName: string;
};

export type FetchedCities = {
  id: number;
  title: string;
  province_id: number;
  provinceName: string;
  provinceId: number;
};

// Define the type for selected cities
export type SelectedCitiesType = {
  selectedCities: City[];
};

// FormState type for managing origin and destination cities
export type FormState = {
  origin: City[]; // Array of cities for origin
  destination: City[]; // Array of cities for destination
};

// LocationSelection Props type
export type LocationSelectionProps = {
  visible: boolean;
  onClose: () => void;
  onSelect: (selectedCities: City[]) => void; // Adjusted for correct prop passing
  selectedCities: City[];
  removeSelectedCity: (
    item: {
      itemId: number;
    },
    itemType: "origin" | "destination" | null
  ) => void;
  locationType: "origin" | "destination" | null;
  handleRemoveAll: (type: string) => void;
};

// DefineOriginDestination Props type
export type DefineOriginDestinationProps = {
  visible: boolean;
  onClose: () => void;
};
