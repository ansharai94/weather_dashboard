import { Dispatch, SetStateAction } from "react";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { Input } from "./ui/input";
import { MapPin, Navigation } from "lucide-react";

interface SearchBar {
  searchCity: string;
  setSearchCity: Dispatch<SetStateAction<string>>;
  handleSearch: () => void;
  handleGeolocation: () => void;
  isLoading: boolean;
  isGeolocationLoading: boolean;
}
export function SearchBar({
  searchCity,
  setSearchCity,
  handleSearch,
  handleGeolocation,
  isGeolocationLoading,
}: SearchBar) {
  return (
    <Card className="mb-6 bg-white/90 backdrop-blur-sm">
      <CardContent className="p-4">
        <div className="flex gap-3">
          <div className="flex-1 relative">
            <Input
              placeholder="Caută orașul... (ex: București, Cluj-Napoca)"
              value={searchCity}
              onChange={(e) => setSearchCity(e.target.value)}
              className="flex-1"
            />
          </div>
          <button
            onClick={handleGeolocation}
            disabled={isGeolocationLoading}
            className="px-4 py-3 bg-gray-100 hover:bg-gray-200 rounded-lg border border-gray-300 transition-colors disabled:opacity-50"
            title="Folosește locația curentă"
          >
            {isGeolocationLoading ? (
              <Navigation className="w-5 h-5 animate-spin text-blue-600" />
            ) : (
              <MapPin className="w-5 h-5 text-gray-600" />
            )}
          </button>

          <Button
            className="bg-blue-500 hover:bg-blue-600 text-white px-6"
            onClick={handleSearch}
          >
            Caută
          </Button>
        </div>
        <p className="text-sm text-gray-500 mt-2">
          💡 Apasă pe <MapPin className="w-4 h-4 inline" /> pentru a folosi
          locația curentă
        </p>
      </CardContent>
    </Card>
  );
}
