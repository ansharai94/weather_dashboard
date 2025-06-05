import { Dispatch, SetStateAction } from "react";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { Input } from "./ui/input";

interface SearchBar {
  searchCity: string;
  setSearchCity: Dispatch<SetStateAction<string>>;
  handleSearch: () => void;
}
export function SearchBar({
  searchCity,
  setSearchCity,
  handleSearch,
}: SearchBar) {
  return (
    <Card className="mb-6 bg-white/90 backdrop-blur-sm">
      <CardContent className="p-4">
        <div className="flex gap-2">
          <Input
            placeholder="Caută orașul... (ex: București, Cluj-Napoca)"
            value={searchCity}
            onChange={(e) => setSearchCity(e.target.value)}
            className="flex-1"
          />
          <Button
            className="bg-blue-500 hover:bg-blue-600 text-white px-6"
            onClick={handleSearch}
          >
            Caută
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
